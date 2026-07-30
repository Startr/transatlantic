"""
Read evals/snapshots/levels.json (produced by level_run.py) and report
real output-length reduction per ladder level against the terse control
arm — how much each level adds on top of a plain "Answer concisely."

Same tokenizer caveat as measure.py: tiktoken o200k_base approximates
Claude's BPE; ratios are meaningful, absolute counts approximate.

Run: uv run --with tiktoken python evals/level_measure.py
"""

from __future__ import annotations

import json
import statistics
from pathlib import Path

import tiktoken

ENCODING = tiktoken.get_encoding("o200k_base")
SNAPSHOT = Path(__file__).parent / "snapshots" / "levels.json"
LEVEL_ORDER = ["liner", "plain", "transatlantic", "aviation", "telegraph", "morse"]


def count(text: str) -> int:
    return len(ENCODING.encode(text))


def fmt_pct(x: float) -> str:
    sign = "−" if x < 0 else "+"
    return f"{sign}{abs(x) * 100:.0f}%"


def main() -> None:
    if not SNAPSHOT.exists():
        print(f"No snapshot at {SNAPSHOT}. Run `python3 evals/level_run.py` first.")
        return

    snap = json.loads(SNAPSHOT.read_text())
    arms = snap["arms"]
    meta = snap["metadata"]
    baseline = [count(t) for t in arms["__baseline__"]]
    terse = [count(t) for t in arms["__terse__"]]

    print(f"model={meta['model']}  cli={meta['claude_cli_version']}  n={meta['n_prompts']}")
    print(f"baseline mean tokens: {statistics.mean(baseline):.0f}")
    print(f"terse    mean tokens: {statistics.mean(terse):.0f}")
    print()
    print(f"{'level':<14} {'mean tok':>8} {'vs terse (median)':>18} {'mean':>7} {'min':>6} {'max':>6} {'stdev':>6}")
    for level in LEVEL_ORDER:
        if level not in arms:
            continue
        toks = [count(t) for t in arms[level]]
        savings = [(t - s) / t if t else 0.0 for s, t in zip(toks, terse)]
        med = statistics.median(savings)
        mean = statistics.mean(savings)
        sd = statistics.stdev(savings) if len(savings) > 1 else 0.0
        print(
            f"{level:<14} {statistics.mean(toks):>8.0f} {fmt_pct(med):>18} "
            f"{fmt_pct(mean):>7} {fmt_pct(min(savings)):>6} {fmt_pct(max(savings)):>6} {sd * 100:>5.0f}%"
        )


if __name__ == "__main__":
    main()
