"""
Trading signal engine.
"""
import logging
from datetime import datetime, timezone
from typing import Literal

from app.database.db import get_db
from app.services.sentiment_service import get_sentiment_for_coin

logger = logging.getLogger(__name__)

Signal = Literal["BUY", "SELL", "HOLD"]


def _trend_score(change_24h: float | None, change_7d: float | None) -> float:
    c24 = change_24h or 0.0
    c7d = change_7d or 0.0
    raw = 0.6 * c24 + 0.4 * (c7d / 7)
    return max(-100.0, min(100.0, raw * 5))


def _generate_explanation(signal, name, trend, sentiment, change_24h, change_7d) -> str:
    c24 = change_24h or 0.0
    c7d = change_7d or 0.0
    trend_word = "stijgt" if trend > 0 else "daalt"
    news_word = (
        "overwegend positief" if sentiment > 10
        else "overwegend negatief" if sentiment < -10
        else "gemengd"
    )
    if signal == "BUY":
        return (
            f"{name} laat een positieve koersontwikkeling zien "
            f"({c24:+.1f}% in 24u, {c7d:+.1f}% in 7d) en het nieuws is {news_word}. "
            f"Koopsignaal gebaseerd op samenkomende positieve factoren."
        )
    elif signal == "SELL":
        return (
            f"{name} {trend_word} in prijs "
            f"({c24:+.1f}% in 24u, {c7d:+.1f}% in 7d) en het nieuws is {news_word}. "
            f"Verkoopsignaal op basis van negatieve markt- en nieuwsindicatoren."
        )
    else:
        return (
            f"Marktsignalen voor {name} zijn gemengd ({c24:+.1f}% in 24u). "
            f"Houdadvies omdat trend en sentiment elkaar niet eenduidig bevestigen."
        )


def _compute_signal(trend: float, sentiment: float) -> tuple[Signal, float]:
    if trend > 0 and sentiment >= 0:
        conf = min(100.0, (trend + max(0, sentiment)) / 2)
        return "BUY", round(conf, 1)
    elif trend < 0 and sentiment <= 0:
        conf = min(100.0, (abs(trend) + abs(min(0, sentiment))) / 2)
        return "SELL", round(conf, 1)
    else:
        conf = min(60.0, abs(trend - sentiment) / 2)
        return "HOLD", round(conf, 1)


async def generate_signals() -> int:
    logger.info("Start genereren trading-signalen…")

    with get_db() as db:
        cursor = db.execute("SELECT * FROM coins ORDER BY market_cap_rank ASC")
        coins = [dict(row) for row in cursor.fetchall()]

    if not coins:
        return 0

    now = datetime.now(timezone.utc).isoformat()
    count = 0

    with get_db() as db:
        for coin in coins:
            try:
                sentiment = await get_sentiment_for_coin(coin["symbol"], coin["name"])
                trend = _trend_score(coin.get("change_24h"), coin.get("change_7d"))
                signal, confidence = _compute_signal(trend, sentiment)
                explanation = _generate_explanation(
                    signal, coin["name"], trend, sentiment,
                    coin.get("change_24h"), coin.get("change_7d"),
                )
                db.execute(
                    """
                    INSERT INTO signals
                        (coin_id, symbol, signal, confidence, sentiment_score, explanation, generated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(coin_id) DO UPDATE SET
                        signal          = excluded.signal,
                        confidence      = excluded.confidence,
                        sentiment_score = excluded.sentiment_score,
                        explanation     = excluded.explanation,
                        generated_at    = excluded.generated_at
                    """,
                    (coin["coin_id"], coin["symbol"], signal, confidence, sentiment, explanation, now),
                )
                count += 1
            except Exception as exc:
                logger.error("Signaal-fout voor %s: %s", coin.get("symbol"), exc)

    logger.info("Trading-signalen gegenereerd: %d coins.", count)
    return count


async def get_all_signals() -> list[dict]:
    with get_db() as db:
        cursor = db.execute("SELECT * FROM signals ORDER BY confidence DESC")
        return [dict(row) for row in cursor.fetchall()]
