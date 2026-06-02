"""
CryptoSignal — FastAPI applicatie entry-point.
"""
import logging
import os
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.api.routes import router
from app.database.db import init_db
from app.services.coin_service import fetch_and_store_coins
from app.services.news_service import fetch_and_store_news
from app.services.sentiment_service import analyse_and_store_sentiment
from app.services.signal_service import generate_signals

load_dotenv()
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)

COIN_INTERVAL = int(os.getenv("COIN_UPDATE_INTERVAL", 300))   # 5 min
NEWS_INTERVAL = int(os.getenv("NEWS_UPDATE_INTERVAL", 900))   # 15 min

scheduler = AsyncIOScheduler()


async def _full_refresh() -> None:
    """Ververs coins, nieuws, sentiment en signalen in volgorde."""
    await fetch_and_store_coins()
    await fetch_and_store_news()
    await analyse_and_store_sentiment()
    await generate_signals()


async def _coin_refresh() -> None:
    """Alleen coins + signalen (vaker dan nieuws)."""
    await fetch_and_store_coins()
    await analyse_and_store_sentiment()
    await generate_signals()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Opstarten ──────────────────────────────────────────────────────────
    logger.info("CryptoSignal opstarten…")
    await init_db()

    # Eerste ophaalronde direct bij start
    await _full_refresh()

    # Achtergrondtaken plannen
    scheduler.add_job(_coin_refresh, "interval", seconds=COIN_INTERVAL, id="coin_job")
    scheduler.add_job(_full_refresh, "interval", seconds=NEWS_INTERVAL, id="news_job")
    scheduler.start()
    logger.info("Scheduler gestart (coins: %ds, nieuws: %ds).", COIN_INTERVAL, NEWS_INTERVAL)

    yield

    # ── Afsluiten ──────────────────────────────────────────────────────────
    scheduler.shutdown(wait=False)
    logger.info("CryptoSignal gestopt.")


app = FastAPI(
    title="CryptoSignal",
    description="Crypto monitoring & trading signal dashboard",
    version="1.0.0",
    lifespan=lifespan,
)

# ── Statische bestanden ────────────────────────────────────────────────────────
static_dir = Path(__file__).parent / "static"
static_dir.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# ── API routes ─────────────────────────────────────────────────────────────────
app.include_router(router)

# ── Dashboard ──────────────────────────────────────────────────────────────────
_template_path = Path(__file__).parent / "templates" / "index.html"


@app.get("/", response_class=HTMLResponse)
async def dashboard() -> HTMLResponse:
    """Serveert het hoofd-dashboard."""
    return HTMLResponse(_template_path.read_text(encoding="utf-8"))
