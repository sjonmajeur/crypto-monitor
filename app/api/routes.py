"""
FastAPI-router met alle API-endpoints.
"""
import logging
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse

from app.services.coin_service import get_all_coins, get_coin_by_symbol
from app.services.news_service import get_recent_news
from app.services.signal_service import get_all_signals

router = APIRouter(prefix="/api")
logger = logging.getLogger(__name__)


def _merge_coin_with_signal(coin: dict, signals: dict) -> dict:
    """Combineert coin-data met het bijbehorende signaal."""
    sig = signals.get(coin["coin_id"], {})
    return {
        **coin,
        "signal": sig.get("signal", "HOLD"),
        "confidence": sig.get("confidence", 0.0),
        "sentiment_score": sig.get("sentiment_score", 0.0),
        "explanation": sig.get("explanation", ""),
        "signal_generated_at": sig.get("generated_at", ""),
    }


@router.get("/coins")
async def list_coins(
    sort_by: str = Query("market_cap_rank", description="Sorteerveld"),
    order: str = Query("asc", description="asc of desc"),
    search: str = Query("", description="Zoek op naam of ticker"),
) -> JSONResponse:
    """Geeft alle coins terug, optioneel gefilterd en gesorteerd."""
    coins = await get_all_coins()
    all_signals = await get_all_signals()
    sig_map = {s["coin_id"]: s for s in all_signals}

    merged = [_merge_coin_with_signal(c, sig_map) for c in coins]

    # Zoekfilter
    if search:
        q = search.lower()
        merged = [
            c for c in merged
            if q in c["name"].lower() or q in c["symbol"].lower()
        ]

    # Sortering
    valid_sort = {
        "name", "symbol", "price_usd", "market_cap",
        "change_24h", "sentiment_score", "confidence", "market_cap_rank",
    }
    if sort_by not in valid_sort:
        sort_by = "market_cap_rank"
    reverse = order.lower() == "desc"

    merged.sort(
        key=lambda x: (x.get(sort_by) is None, x.get(sort_by) or 0),
        reverse=reverse,
    )

    return JSONResponse({"coins": merged, "total": len(merged)})


@router.get("/coins/{symbol}")
async def coin_detail(symbol: str) -> JSONResponse:
    """Geeft gedetailleerde informatie over één coin."""
    coin = await get_coin_by_symbol(symbol)
    if not coin:
        raise HTTPException(status_code=404, detail=f"Coin '{symbol}' niet gevonden.")

    all_signals = await get_all_signals()
    sig_map = {s["coin_id"]: s for s in all_signals}
    merged = _merge_coin_with_signal(coin, sig_map)
    return JSONResponse(merged)


@router.get("/news")
async def list_news(
    limit: int = Query(50, ge=1, le=200),
) -> JSONResponse:
    """Geeft recente nieuwsartikelen terug."""
    articles = await get_recent_news(limit=limit)
    return JSONResponse({"articles": articles, "total": len(articles)})


@router.get("/signals")
async def list_signals() -> JSONResponse:
    """Geeft alle gegenereerde trading-signalen terug."""
    signals = await get_all_signals()
    return JSONResponse({"signals": signals, "total": len(signals)})


@router.get("/health")
async def health_check() -> JSONResponse:
    """Health-check endpoint."""
    return JSONResponse({
        "status": "ok",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })
