"""
Service voor het ophalen van crypto-data via de gratis CoinGecko API.
"""
import logging
import time
from datetime import datetime, timezone
from typing import Any

import requests

from app.database.db import get_db

logger = logging.getLogger(__name__)

COINGECKO_BASE = "https://api.coingecko.com/api/v3"
MAX_RETRIES = 3
RETRY_DELAY = 5


def _fetch_with_retry(url: str, params: dict | None = None) -> dict | list | None:
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            resp = requests.get(url, params=params, timeout=15)
            if resp.status_code == 429:
                wait = int(resp.headers.get("Retry-After", 60))
                logger.warning("Rate-limit bereikt. Wacht %d seconden…", wait)
                time.sleep(wait)
                continue
            resp.raise_for_status()
            return resp.json()
        except requests.RequestException as exc:
            logger.warning("Poging %d mislukt: %s", attempt, exc)
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY * attempt)
    logger.error("Alle pogingen mislukt voor %s", url)
    return None


async def fetch_and_store_coins() -> int:
    logger.info("Start ophalen coin-data van CoinGecko…")
    url = f"{COINGECKO_BASE}/coins/markets"
    params: dict[str, Any] = {
        "vs_currency": "usd",
        "order": "market_cap_desc",
        "per_page": 100,
        "page": 1,
        "sparkline": False,
        "price_change_percentage": "7d",
    }

    data = _fetch_with_retry(url, params)
    if not data:
        return 0

    now = datetime.now(timezone.utc).isoformat()
    saved = 0

    with get_db() as db:
        for coin in data:
            try:
                db.execute(
                    """
                    INSERT INTO coins
                        (coin_id, symbol, name, image_url, price_usd, market_cap,
                         change_24h, change_7d, market_cap_rank, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(coin_id) DO UPDATE SET
                        price_usd       = excluded.price_usd,
                        market_cap      = excluded.market_cap,
                        change_24h      = excluded.change_24h,
                        change_7d       = excluded.change_7d,
                        market_cap_rank = excluded.market_cap_rank,
                        image_url       = excluded.image_url,
                        updated_at      = excluded.updated_at
                    """,
                    (
                        coin.get("id"),
                        coin.get("symbol", "").upper(),
                        coin.get("name"),
                        coin.get("image"),
                        coin.get("current_price"),
                        coin.get("market_cap"),
                        coin.get("price_change_percentage_24h"),
                        coin.get("price_change_percentage_7d_in_currency"),
                        coin.get("market_cap_rank"),
                        now,
                    ),
                )
                saved += 1
            except Exception as exc:
                logger.error("Fout bij opslaan coin %s: %s", coin.get("id"), exc)

    logger.info("Coin-data bijgewerkt: %d coins.", saved)
    return saved


async def get_all_coins() -> list[dict]:
    with get_db() as db:
        cursor = db.execute("SELECT * FROM coins ORDER BY market_cap_rank ASC")
        return [dict(row) for row in cursor.fetchall()]


async def get_coin_by_symbol(symbol: str) -> dict | None:
    with get_db() as db:
        cursor = db.execute("SELECT * FROM coins WHERE symbol = ?", (symbol.upper(),))
        row = cursor.fetchone()
        return dict(row) if row else None
