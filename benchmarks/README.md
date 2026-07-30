# Benchmarks — bring your own key

This harness measures real Claude API token counts for each transatlantic
ladder level against a normal verbose reply. The numbers in the main README
come from committed runs in [`results/`](./results/). We'd like yours too.

Community runs matter here for a plain reason: one maintainer's key produces
one model, one region, one moment in time. A spread of contributed runs shows
whether the compression numbers hold across models and over releases. Every
result file records its model, trial count, level, and the SHA of the SKILL.md
it measured, so runs stay comparable and honest.

## Run it

You need Python 3.10+, [uv](https://docs.astral.sh/uv/), and an Anthropic API
key you're comfortable spending a few cents from.

```bash
# 1. Put your key in .env.local at the repo root (never committed; gitignored)
echo 'ANTHROPIC_API_KEY=sk-ant-...' > .env.local

# 2. See what would run, free
uv run --with anthropic python benchmarks/run.py --dry-run

# 3. Run one level (10 prompts × 2 modes × 3 trials = 60 calls)
uv run --with anthropic python benchmarks/run.py --level transatlantic

# 4. Or sweep the ladder
for lvl in liner plain transatlantic aviation telegraph morse; do
  uv run --with anthropic python benchmarks/run.py --level "$lvl"
done
```

A single-level run on the default sonnet model costs well under a dollar.
Results land in `benchmarks/results/benchmark_<timestamp>.json`.

## Contribute your run

1. Run whichever levels you like (a single level is a useful contribution).
2. Commit the new JSON file(s) from `benchmarks/results/` — nothing else is
   needed; the metadata block carries model, level, trials, and SKILL hash.
3. Open a PR titled `bench: <model> <level(s)>`.

House rules, inherited from upstream and kept firmly:

- **Real numbers only.** Never hand-edit a results file. Never round in the
  README table beyond what the script prints.
- **Output tokens only.** The harness measures what the agent says. Input and
  reasoning tokens are out of scope and the README says so.
- The README table regenerates from committed results via
  `--update-readme` — don't edit it by hand.

## What the harness does

For each prompt it asks the model twice: once with a neutral system prompt
("normal"), once with the chosen level's exact ruleset — the same filtered
SKILL.md text the SessionStart hook injects for that level. It records output
token counts from the API response, runs each pair multiple times, and stores
means and per-trial raw counts.

There's also a CLI-only path with no API key: `evals/level_run.py` drives the
`claude` CLI and `evals/level_measure.py` counts tokens offline with tiktoken.
Those ratios are approximate (OpenAI tokenizer against Claude output) and are
kept separate from the API-measured numbers here.
