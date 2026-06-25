"""
Centralised logging setup.

Call get_logger(__name__) in every module:
    from src.core.logging import get_logger
    logger = get_logger(__name__)

Features
--------
* Structured JSON output in production  (DEBUG=false)
* Human-readable coloured output in dev (DEBUG=true)
* Log level controlled by the LOG_LEVEL env var (default INFO)
* One call to configure_logging() is enough — safe to call multiple times
  (subsequent calls are no-ops thanks to the _configured guard).
"""

import logging
import sys
from typing import Optional

from src.core.config import settings

_RESET = "\x1b[0m"
_GREY = "\x1b[38;5;240m"
_YELLOW = "\x1b[33m"
_RED = "\x1b[31m"
_BOLD = "\x1b[1m"

_LEVEL_COLOURS = {
    logging.DEBUG: _GREY,
    logging.INFO: "\x1b[32m",
    logging.WARNING: _YELLOW,
    logging.ERROR: _RED,
    logging.CRITICAL: _BOLD + _RED,
}


class _DevFormatter(logging.Formatter):
    FMT = "%(asctime)s %(levelname)-8s %(name)s — %(message)s"
    DATE = "%H:%M:%S"

    def format(self, record: logging.LogRecord) -> str:
        colour = _LEVEL_COLOURS.get(record.levelno, _RESET)
        formatter = logging.Formatter(
            fmt=f"{colour}{self.FMT}{_RESET}",
            datefmt=self.DATE,
        )
        return formatter.format(record)


class _ProdFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        import json
        import traceback

        payload: dict = {
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "time": self.formatTime(record, "%Y-%m-%dT%H:%M:%S"),
        }
        if record.exc_info:
            payload["exc"] = traceback.format_exception(*record.exc_info)
        return json.dumps(payload, ensure_ascii=False)


_configured = False


def configure_logging(level: Optional[str] = None) -> None:
    global _configured
    if _configured:
        return

    log_level_str = level or "DEBUG" if settings.DEBUG else "INFO"
    log_level = getattr(logging, log_level_str.upper(), logging.INFO)

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(_DevFormatter() if settings.DEBUG else _ProdFormatter())

    root = logging.getLogger()
    root.setLevel(log_level)
    root.handlers.clear()
    root.addHandler(handler)

    for noisy in (
        "httpx",
        "httpcore",
        "urllib3",
        "weasyprint",
        "pdfminer",
        "pdfplumber",
        "PIL",
        "fontTools",
    ):
        logging.getLogger(noisy).setLevel(logging.WARNING)

    _configured = True


def get_logger(name: str) -> logging.Logger:
    configure_logging()
    return logging.getLogger(name)
