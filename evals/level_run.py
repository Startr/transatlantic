"""
Per-level eval runner for the transatlantic ladder.

Same honest three-arm design as llm_run.py, but one arm per ladder LEVEL
instead of per skill: the system prompt for each level is SKILL.md
filtered to that level's table row and example lines — byte-equivalent
to what the SessionStart hook injects for that level.

  1. __baseline__  — no system prompt
  2. __terse__     — "Answer concisely."
  3. <level>       — "Answer concisely.\n\nTRANSATLANTIC MODE ACTIVE — level: X\n\n{filtered SKILL.md}"

The honest delta per level is (3) vs (2). Writes evals/snapshots/levels.json.

Requires: `claude` CLI on PATH, authenticated.
Run: python3 evals/level_run.py
Environment: CAVEMAN_EVAL_MODEL — optional --model value passed to claude.
"""

from __future__ import annotations

import datetime as dt
import json
import os
import re
import subprocess
from pathlib import Path

EVALS = Path(__file__).parent
SKILL_MD = EVALS.parent / "skills" / "caveman" / "SKILL.md"
PROMPTS = EVALS / "prompts" / "en.txt"
SNAPSHOT = EVALS / "snapshots" / "levels.json"

TERSE_PREFIX = "Answer concisely."
LEVELS = ["liner", "plain", "transatlantic", "aviation", "telegraph", "morse"]


def filter_skill(body: str, level: str) -> str:
    """Mirror ta-activate.js: keep only the active level's intensity
    table row and example lines; everything else passes through."""
    out: list[str] = []
    for line in body.splitlines():
        row = re.match(r"^\|\s*\*\*(\S+?)\*\*\s*\|", line)
        if row:
            if row.group(1) == level:
                out.append(line)
            continue
        ex = re.match(r"^- (\S+?):\s", line)
        if ex:
            if ex.group(1) == level:
                out.append(line)
            continue
        out.append(line)
    return "\n".join(out)


def run_claude(prompt: str, system: str | None = None) -> str:
    cmd = ["claude", "-p"]
    if system:
        cmd += ["--system-prompt", system]
    if model := os.environ.get("TA_EVAL_MODEL") or os.environ.get("CAVEMAN_EVAL_MODEL"):
        cmd += ["--model", model]
    cmd.append(prompt)
    out = subprocess.run(cmd, capture_output=True, text=True, check=True, timeout=300)
    return out.stdout.strip()


def claude_version() -> str:
    try:
        out = subprocess.run(
            ["claude", "--version"], capture_output=True, text=True, check=True
        )
        return out.stdout.strip()
    except Exception:
        return "unknown"


def main() -> None:
    prompts = [p.strip() for p in PROMPTS.read_text().splitlines() if p.strip()]
    body = re.sub(r"^---[\s\S]*?---\s*", "", SKILL_MD.read_text())

    print(f"=== {len(prompts)} prompts × ({len(LEVELS)} levels + 2 control arms) ===", flush=True)

    snapshot: dict = {
        "metadata": {
            "generated_at": dt.datetime.now(dt.timezone.utc).isoformat(),
            "claude_cli_version": claude_version(),
            "model": (os.environ.get("TA_EVAL_MODEL") or os.environ.get("CAVEMAN_EVAL_MODEL", "default")),
            "n_prompts": len(prompts),
            "terse_prefix": TERSE_PREFIX,
            "skill_file": str(SKILL_MD.relative_to(EVALS.parent)),
        },
        "prompts": prompts,
        "arms": {},
    }

    print("baseline (no system prompt)", flush=True)
    snapshot["arms"]["__baseline__"] = [run_claude(p) for p in prompts]

    print("terse (control)", flush=True)
    snapshot["arms"]["__terse__"] = [run_claude(p, system=TERSE_PREFIX) for p in prompts]

    for level in LEVELS:
        system = (
            f"{TERSE_PREFIX}\n\nTRANSATLANTIC MODE ACTIVE — level: {level}\n\n"
            + filter_skill(body, level)
        )
        print(f"  {level}", flush=True)
        snapshot["arms"][level] = [run_claude(p, system=system) for p in prompts]

    SNAPSHOT.parent.mkdir(parents=True, exist_ok=True)
    SNAPSHOT.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2))
    print(f"\nWrote {SNAPSHOT}")


if __name__ == "__main__":
    main()
