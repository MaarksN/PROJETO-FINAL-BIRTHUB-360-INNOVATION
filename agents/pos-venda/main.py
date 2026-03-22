"""Compatibility shim for the legacy hyphenated pos-venda path.

The workspace contract still expects ``agents/pos-venda/main.py`` to exist while
runtime code lives under ``agents/pos_venda``. This wrapper preserves that
legacy entrypoint without duplicating the implementation.
"""

from __future__ import annotations

from pathlib import Path
import runpy

TARGET = Path(__file__).resolve().parents[1] / "pos_venda" / "main.py"

if __name__ == "__main__":
    runpy.run_path(str(TARGET), run_name="__main__")
