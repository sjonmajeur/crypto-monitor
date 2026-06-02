"""
Sentiment-analyse op basis van trefwoorden.
"""
import logging
import re

from app.database.db import get_db

logger = logging.getLogger(__name__)

POSITIVE_WORDS = {
    "bullish","adoption","approval","growth","rally","partnership","breakout","profit",
    "surge","gain","gains","record","high","launch","upgrade","integration","support",
    "buy","bull","moon","pump","rise","rises","rising","increase","increased",
    "accelerate","boom","expand","innovation","milestone","achieve","positive","strong",
    "strength","recover","recovery","rebound","investment","institutional","etf","approved","listed",
}

NEGATIVE_WORDS = {
    "hack","lawsuit","ban","crash","fraud","decline","selloff","bankruptcy","bear","bearish",
    "drop","drops","dump","dumping","scam","exploit","vulnerability","breach","stolen","theft",
    "fine","penalty","regulation","restrict","blocked","delisted","warning","risk","danger",
    "concern","fear","sell","loss","losses","fall","falls","falling","decrease","decreased",
    "investigation","arrest","probe","collapse","crisis","trouble",
}

WEIGHT_TITLE = 2.0
WEIGHT_SUMMARY = 1.0


def _score_text(text: str) -> float:
    if not text:
        return 0.0
    words = set(re.findall(r"\b[a-z]+\b", text.lower()))
    pos = len(words & POSITIVE_WORDS)
    neg = len(words & NEGATIVE_WORDS)
    return float(pos - neg)


def _classify(score: float) -> str:
    if score > 0:
        return "positive"
    if score < 0:
        return "negative"
    return "neutral"


def _normalize(raw: float, max_val: float = 5.0) -> float:
    if max_val == 0:
        return 0.0
    return max(-100.0, min(100.0, (raw / max_val) * 100.0))


async def analyse_and_store_sentiment() -> None:
    logger.info("Start sentiment-analyse…")
    with get_db() as db:
        cursor = db.execute(
            "SELECT id, title, summary FROM news WHERE sentiment = 'neutral' OR sentiment IS NULL"
        )
        articles = cursor.fetchall()
        for art in articles:
            raw = _score_text(art["title"]) * WEIGHT_TITLE + _score_text(art["summary"]) * WEIGHT_SUMMARY
            norm = _normalize(raw)
            label = _classify(raw)
            db.execute(
                "UPDATE news SET sentiment = ?, sentiment_score = ? WHERE id = ?",
                (label, norm, art["id"]),
            )
    logger.info("Sentiment berekend voor %d artikelen.", len(articles))


def _coin_mentioned(text: str, symbol: str, name: str) -> bool:
    t = text.lower()
    return symbol.lower() in t or name.lower() in t or f"${symbol.lower()}" in t


async def get_sentiment_for_coin(symbol: str, name: str) -> float:
    with get_db() as db:
        cursor = db.execute(
            "SELECT title, summary, sentiment_score FROM news ORDER BY fetched_at DESC LIMIT 200"
        )
        articles = cursor.fetchall()

    scores: list[float] = []
    for art in articles:
        combined = f"{art['title']} {art['summary']}"
        if _coin_mentioned(combined, symbol, name):
            scores.append(art["sentiment_score"])

    if not scores:
        return 0.0
    return round(sum(scores) / len(scores), 1)
