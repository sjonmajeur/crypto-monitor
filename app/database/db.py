"""
Database initialisatie en verbeheer via ingebouwde sqlite3.
Compatibel met Python 3.14+.
"""
import sqlite3
import logging
from contextlib import contextmanager
from pathlib import Path

logger = logging.getLogger(__name__)

DB_PATH = str(Path("crypto_monitor.db"))


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


@contextmanager
def get_db():
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


async def init_db() -> None:
    with get_db() as db:
        db.execute("""
            CREATE TABLE IF NOT EXISTS coins (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                coin_id     TEXT    UNIQUE NOT NULL,
                symbol      TEXT    NOT NULL,
                name        TEXT    NOT NULL,
                image_url   TEXT,
                price_usd   REAL,
                market_cap  REAL,
                change_24h  REAL,
                change_7d   REAL,
                market_cap_rank INTEGER,
                updated_at  TEXT    NOT NULL
            )
        """)
        db.execute("""
            CREATE TABLE IF NOT EXISTS news (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                title       TEXT    NOT NULL,
                source      TEXT,
                published_at TEXT,
                url         TEXT    UNIQUE,
                summary     TEXT,
                sentiment   TEXT    DEFAULT 'neutral',
                sentiment_score REAL DEFAULT 0.0,
                fetched_at  TEXT    NOT NULL
            )
        """)
        db.execute("""
            CREATE TABLE IF NOT EXISTS signals (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                coin_id     TEXT    UNIQUE NOT NULL,
                symbol      TEXT    NOT NULL,
                signal      TEXT    NOT NULL,
                confidence  REAL    NOT NULL,
                sentiment_score REAL DEFAULT 0.0,
                explanation TEXT,
                generated_at TEXT   NOT NULL
            )
        """)
    logger.info("Database tabellen aangemaakt/geverifieerd.")
