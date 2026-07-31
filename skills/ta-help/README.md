# ta-help

Quick-reference card. One shot, no mode change.

## What it does

Prints a cheat sheet of all transatlantic modes, sibling skills, deactivation triggers, and how to set the default mode via env var or config file. One-shot display — does not flip the active mode, write flag files, or persist anything. Use when you forget the slash commands.

## How to invoke

```
/ta-help
```

Also triggers on "transatlantic help", "what transatlantic commands", "how do I use transatlantic".

## Example output

```
Modes:
  /transatlantic              full (default)
  /transatlantic lite         lighter
  /transatlantic ultra        extreme
  /transatlantic wenyan       classical Chinese

Skills:
  /ta-commit       terse Conventional Commits
  /ta-review       one-line PR comments
  /ta-stats        session token savings

Deactivate:
  "stop transatlantic" or "normal mode"
```

## See also

- [`SKILL.md`](./SKILL.md) — full reference card
- [Transatlantic README](../../README.md) — repo overview
