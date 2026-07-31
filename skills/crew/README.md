# crew

Decision guide. When to delegate to caveman subagents instead of doing the work inline.

## What it does

Tells the main thread when to spawn a caveman-style subagent versus the vanilla equivalent. The win: subagent tool-results inject back into main context verbatim, and caveman output is roughly 1/3 the size of vanilla prose. Across 20 delegations in one session, that is the difference between context exhaustion and finishing the task.

Three subagents:

| Subagent | Job | Use when |
|----------|-----|----------|
| `crew-locator` | Locate code (read-only) | "Where is X defined / what calls Y / list uses of Z" |
| `crew-editor` | Surgical edit, 1-2 files | Scope is obvious, ≤2 files. Refuses 3+ file scope. |
| `crew-reviewer` | Diff/file review | One-line findings with severity emoji |

Use vanilla `Explore` or `Code Reviewer` when you want prose, architecture commentary, or rationale. Use main thread directly for one-line answers and 3+ file refactors.

This skill is a decision guide, not a slash command. It activates when the conversation mentions delegation.

## How to invoke

Triggers on phrases like "delegate to subagent", "use crew", "spawn the locator", "save context", "compressed agent output".

## Example chaining

Locate → fix → verify (most common):

1. `crew-locator` returns site list (`path:line — symbol — note`)
2. Main thread picks 1-2 sites, hands paths to `crew-editor`
3. `crew-reviewer` audits the resulting diff

Parallel scout: spawn 2-3 `crew-locator` calls in one message with different angles (defs, callers, tests). Aggregate in main.

## Model overrides

By default, `crew-reviewer` and `crew-locator` pin `model: haiku` in their frontmatter; `crew-editor` has no `model:` line (uses the API session default). Set env vars in your shell before launching Claude Code to override per-agent:

| Env var | Agent |
|---|---|
| `CREW_REVIEWER_MODEL` | `crew-reviewer` |
| `CREW_EDITOR_MODEL` | `crew-editor` |
| `CREW_LOCATOR_MODEL` | `crew-locator` |

Example — run reviewer on sonnet, keep others on default:

```sh
export CREW_REVIEWER_MODEL=sonnet
```

Use the same model name strings you'd use in any Claude Code agent frontmatter (e.g. `haiku`, `sonnet`, `opus`).

Overrides patch only the `model:` line in the installed agent's frontmatter; the prompt body is untouched and keeps receiving upstream updates. Plugin installs only — standalone hook installs have no local agent files to patch. Unset or blank = no change. The patch persists in the installed file until the plugin is updated or reinstalled.

## See also

- [`SKILL.md`](./SKILL.md) — full decision matrix and output contracts
- [`agents/crew-locator.md`](../../agents/crew-locator.md)
- [`agents/crew-editor.md`](../../agents/crew-editor.md)
- [`agents/crew-reviewer.md`](../../agents/crew-reviewer.md)
- [Caveman README](../../README.md) — repo overview
