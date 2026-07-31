# transatlantic

Research-backed prose levels for AI agents. Concise output that stays clear.

## What it does

Sets the register your agent answers in, on a six-level ladder from classy humanized prose down to bare keywords. Every level keeps code blocks, error strings, commands, and technical terms byte-for-byte exact. The level persists for the whole session until changed or stopped.

| Level | Voice |
|-------|-------|
| `liner` | Classy, humanized prose. Varied rhythm, no machine tells. |
| `plain` | The plain-language letter. Short sentences, common words. |
| `transatlantic` | Default. The newsreel voice: full grammar, filler cut. |
| `aviation` | Controlled technical English. One instruction per sentence. |
| `telegraph` | Dropped articles, fragments. Skim register. |
| `morse` | Bare keywords. Maximum compression. |
| `wenyan` | Classical Chinese annex (also `wenyan-lite`, `wenyan-ultra`). |

Each level is grounded in published research on readable, concise writing. The full citations live in [docs/research/level-ladder.md](../../docs/research/level-ladder.md).

Auto-clarity rule: the agent rises to plain full-grammar prose for security warnings, irreversible-action confirmations, and multi-step sequences where compression risks a misread, then resumes the active level.

## How to invoke

```
/transatlantic            # default level
/ta liner                 # short form, classy end
/ta telegraph             # skim register
/transatlantic wenyan     # classical Chinese
normal mode               # back to ordinary prose
```

Legacy `/caveman lite|full|ultra` still works and maps onto the ladder.

## Example output

Question: "Why does my React component re-render?"

transatlantic (default):
> The component re-renders because each render creates a new object reference. Wrap the value in `useMemo` to keep the reference stable.

telegraph:
> New object ref each render. Inline object prop = new ref = re-render. Wrap in `useMemo`.

## See also

- [`SKILL.md`](./SKILL.md) — full LLM-facing instructions
- [Transatlantic README](../../README.md) — repo overview, install, benchmarks
