"""
Nieuwsaggregatie via CryptoCompare API en RSS-feeds.
"""
import logging
import os
import time
from datetime import datetime, timezone

import feedparser
import requests

from app.database.db import get_db

logger = logging.getLogger(__name__)

CRYPTOCOMPARE_KEY = os.getenv("CRYPTOCOMPARE_API_KEY", "")
MAX_RETRIES = 3
RETRY_DELAY = 5

RSS_FEEDS = [
    ("CoinDesk", "https://www.coindesk.com/arc/outboundfeeds/rss/"),
    ("Cointelegraph", "https://cointelegraph.com/rss"),
    ("CryptoNews", "https://cryptonews.com/news/feed/"),
    ("Decrypt", "https://decrypt.co/feed"),
]


def _fetch_cryptocompare_news() -> list[dict]:
    url = "https://min-api.cryptocompare.com/data/v2/news/?lang=EN"
    headers = {}
    if CRYPTOCOMPARE_KEY:
        headers["authorization"] = f"Apikey {CRYPTOCOMPARE_KEY}"

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            resp = requests.get(url, headers=headers, timeout=15)
            resp.raise_for_status()
            data = resp.json()
            articles = data.get("Data", [])
            result = []
            for a in articles[:50]:
                result.append({
                    "title": a.get("title", ""),
                    "source": a.get("source_info", {}).get("name", "CryptoCompare"),
                    "published_at": datetime.fromtimestamp(
                        a.get("published_on", 0), tz=timezone.utc
                    ).isoformat(),
                    "url": a.get("url", ""),
                    "summary": a.get("body", "")[:500],
                })
            logger.info("CryptoCompare: %d artikelen opgehaald.", len(result))
            return result
        except Exception as exc:
            logger.warning("CryptoCompare poging %d mislukt: %s", attempt, exc)
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY)
    return []


def _fetch_rss_feed(name: str, url: str) -> list[dict]:
    try:
        feed = feedparser.parse(url)
        result = []
        for entry in feed.entries[:20]:
            published = ""
            if hasattr(entry, "published_parsed") and entry.published_parsed:
                published = datetime(*entry.published_parsed[:6], tzinfo=timezone.utc).isoformat()
            summary = ""
            if hasattr(entry, "summary"):
                summary = entry.summary[:500]
            elif hasattr(entry, "description"):
                summary = entry.description[:500]
            result.append({
                "title": getattr(entry, "title", ""),
                "source": name,
                "published_at": published,
                "url": getattr(entry, "link", ""),
                "summary": summary,
            })
        logger.info("RSS %s: %d artikelen opgehaald.", name, len(result))
        return result
    except Exception as exc:
        logger.warning("RSS %s mislukt: %s", name, exc)
        return []


async def fetch_and_store_news() -> int:
    logger.info("Start ophalen crypto-nieuws…")
    articles: list[dict] = []
    articles.extend(_fetch_cryptocompare_news())
    for name, url in RSS_FEEDS:
        articles.extend(_fetch_rss_feed(name, url))

    if not articles:
        logger.warning("Geen nieuwsartikelen opgehaald.")
        return 0

    now = datetime.now(timezone.utc).isoformat()
    saved = 0

    with get_db() as db:
        for art in articles:
            if not art.get("url") or not art.get("title"):
                continue
            try:
                db.execute(
                    """
                    INSERT OR IGNORE INTO news
                        (title, source, published_at, url, summary, fetched_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """,
                    (
                        art["title"],
                        art.get("source", ""),
                        art.get("published_at", ""),
                        art["url"],
                        art.get("summary", ""),
                        now,
                    ),
                )
                saved += 1
            except Exception as exc:
                logger.error("Fout bij opslaan artikel: %s", exc)

    logger.info("Nieuws bijgewerkt: %d nieuwe artikelen.", saved)
    return saved


async def get_recent_news(limit: int = 50) -> list[dict]:
    with get_db() as db:
        cursor = db.execute(
            "SELECT * FROM news ORDER BY fetched_at DESC, published_at DESC LIMIT ?",
            (limit,),
        )
        return [dict(row) for row in cursor.fetchall()]
