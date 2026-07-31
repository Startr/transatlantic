---
name: ta-help
description: >
  Quick-reference card for the transatlantic levels, skills, and commands.
  One-shot display, not a persistent mode. Trigger: /ta-help,
  "transatlantic help", "caveman help", "what transatlantic commands",
  "how do I use transatlantic".
---

# Transatlantic Help

Display this reference card when invoked. One-shot — do NOT change mode, write flag files, or persist anything. Output in the transatlantic register.

## Levels

Most readable to most compressed. Full research basis: `docs/research/level-ladder.md`.

| Level | Trigger | What changes |
|-------|---------|--------------|
| **liner** | `/transatlantic liner` | Classy humanized prose. Varied rhythm, no machine tells. |
| **plain** | `/transatlantic plain` | Plain-language letter. Short sentences, common words, helpful redundancy kept. |
| **transatlantic** | `/transatlantic` | Default. Newsreel voice — full grammar, filler and hedging cut. |
| **aviation** | `/transatlantic aviation` | Controlled technical English. One instruction per sentence, ~20-word cap. |
| **telegraph** | `/transatlantic telegraph` | Dropped articles, fragments. Skim register. Legacy caveman `full`. |
| **morse** | `/transatlantic morse` | Bare keywords. Maximum compression. Legacy caveman `ultra`. |
| **wenyan** | `/transatlantic wenyan` | Classical Chinese annex (also `wenyan-lite`, `wenyan-ultra`). Densest register of all. |

`/ta <level>` is the short form. Legacy `/caveman lite|full|ultra` maps onto the ladder. A level sticks until changed or session end.

## Skills

| Skill | Trigger | What it does |
|-------|---------|--------------|
| **caveman-commit** | `/caveman-commit` | Terse commit messages. Conventional Commits, ≤50-char subject. |
| **caveman-review** | `/caveman-review` | One-line PR comments: `L42: bug: user null. Add guard.` |
| **caveman-compress** | `/caveman-compress <file>` | Compress a memory file for LLM context. Never uses telegraph/morse — stopword removal harms model reading. |
| **caveman-stats** | `/caveman-stats` | Real session token usage and lifetime savings. |
| **caveman-help** | `/ta-help` | This card. |

## Deactivate

Say "stop transatlantic", "stop caveman", or "normal mode". Resume anytime with `/transatlantic`.

## Language

The user's language is preserved by default. They write Portuguese, the reply is Portuguese at the active level. The style compresses; the language never changes. Technical terms, code, commands, commit types, and exact error strings stay verbatim unless the user asks for translation.

## Configure Default Level

Default level: `transatlantic`. Change it:

**Environment variable** (highest priority):
```bash
export TRANSATLANTIC_DEFAULT_MODE=liner
```
(`CAVEMAN_DEFAULT_MODE` still works as a legacy alias.)

**Config file** (`~/.config/transatlantic/config.json`, legacy `~/.config/caveman/config.json` honored):
```json
{ "defaultMode": "plain" }
```

**Per-repo** (checked in): `.transatlantic/config.json` or `.transatlantic.json` at the repo root (legacy `.caveman*` honored).

Set `"off"` to disable auto-activation on session start; `/transatlantic` still activates manually.

Resolution: env var > repo-local config > user config > `transatlantic`.
