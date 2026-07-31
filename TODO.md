# Transatlantic — Roadmap

Fork of [caveman](https://github.com/JuliusBrussee/caveman) rebranding to
**transatlantic**: research-backed prose levels from classy humanized (liner)
to bare keywords (morse). Level ladder and citations:
`docs/research/level-ladder.md`.

> **Convention** — Sections below map to kanban columns. Inline source-code
> tags use the same vocabulary so items stay cross-referenced between this
> file and the codebase. `KANBAN.canvas` auto-generates from this file and
> inline tags — do not hand-edit it.
>
> | Column      | Markdown section  | Inline tag  |
> |-------------|-------------------|-------------|
> | Backlog     | `## Backlog`      |             |
> | TODO        | `## TODO`         | `# TODO:`   |
> | In Progress | `## In Progress`  | `# FIXME:`  |
> | Bugs        | `## Bugs`         | `# BUG:`    |
> | Done        | `- [x]` items / `## Done` | —   |

## In Progress

- [ ] **Plugin Rename**: `caveman` to `transatlantic` #critical
  - [x] `.claude-plugin/plugin.json` + `marketplace.json` renamed — commands now `/transatlantic:*`
  - [x] Local machine rewired (`enabledPlugins` + `installed_plugins` keys, backups kept)
  - [x] Skill frontmatter name to `transatlantic`; tracker accepts every namespaced form
  - [x] Flag-file name decided: keep `.caveman-active` until 1.0 — five readers share the path, renaming pre-release risks split-brain (recorded in CLAUDE.md fork banner)
- [ ] **Docs Rewrite in Liner Voice**: README is the product front door
  - [x] README: liner voice, ladder table, research section with citations, honest pre-release install, benchmark table relabeled telegraph, upstream credits (original preserved at `docs/research/README-caveman-upstream.md`)
  - [x] INSTALL.md: pre-release banner with local-clone install; per-agent matrix accurate for both versions
  - [x] AGENTS.md / GEMINI.md — @-includes of SKILL.md, already serve the new ladder, no change needed
  - [x] `src/rules/caveman-activate.md` rewritten to the transatlantic ruleset; `caveman-init.js` embedded copy byte-synced, new sentinel, legacy installs upgrade in place (tested)
  - [x] OpenClaw bootstrap rewritten — markers kept, file and embedded fallback byte-equal (verified)
  - [x] CLAUDE.md: fork-status banner supersedes conflicting upstream instructions
  - [x] Env/config names: `TRANSATLANTIC_DEFAULT_MODE` primary + `CAVEMAN_DEFAULT_MODE` legacy; `~/.config/transatlantic/` + repo `.transatlantic*` configs with caveman fallbacks

## TODO

### Rebrand Sweep

- [ ] **Package & Installer Rename**: npm identity and install paths
  - [x] `package.json` name to `transatlantic`, bins `transatlantic` + `caveman`, upstream repo fields dropped until org repo exists
  - [ ] `bin/install.js` PROVIDERS strings, hook file paths, uninstall marker
  - [ ] `install.sh` / `install.ps1` shim references
  - [ ] Keep `CAVEMAN_DEFAULT_MODE` env var accepted as legacy alias
- [ ] **CI Sync Workflow**: `.github/workflows/sync-skill.yml` paths after renames
  - [ ] Mirror dir `plugins/caveman/` to `plugins/transatlantic/`
  - [ ] Release ZIP name `dist/caveman.skill`
- [ ] **Repo & Distribution**: New home under the team org
  - [ ] Create GitHub repo (org: Sage.is or Startr — decide)
  - [ ] Init git-flow branches `develop` + `master` — Makefile release_finish pushes to both
  - [ ] Point local clone `origin` at the org repo (Makefile OWNER self-corrects from remote)
  - [ ] Reserve npm name `transatlantic`
  - [ ] Point marketplace source at the new repo
  - [ ] Update `enabledPlugins` key on user machines after plugin rename (`caveman@caveman` to new id)
- [ ] **Installer Ships the Full Local Setup**: Everything hand-done on this machine, automated
  - [ ] Install bare user-scope commands (`~/.claude/commands/transatlantic.md`, `ta.md`) — plugin commands are always namespaced, bare form needs user scope
  - [ ] Wire statusline into `settings.json` via `bin/lib/settings.js` (hand-added 2026-07-30)
  - [ ] Document the dev-mode install (installPath pointed at clone) and its marketplace-update revert risk

### Evidence Debt

- [ ] **Benchmark the New Levels**: Real numbers only — never estimate #critical
  - [x] `--level` flag added to `benchmarks/run.py` (filters SKILL.md like the SessionStart hook; level recorded in results metadata)
  - [x] `benchmarks/README.md` — bring-your-own-key invitation with contribution flow and house rules
  - [x] CLI-only eval path: `evals/level_run.py` + `level_measure.py` (no API key; tiktoken ratios, kept separate from API numbers)
  - [ ] First community/API runs per level committed to `benchmarks/results/`
  - [ ] Update `COMPRESSION` map in `src/hooks/caveman-stats.js` from results
  - [ ] Regenerate README benchmark table from committed results
- [ ] **Eval the New Levels**: Three-arm harness (baseline / terse / skill)
  - [x] Per-level CLI run committed (`evals/snapshots/levels.json`, sonnet, n=10): liner +44%, plain +17%, transatlantic +45%, aviation +52%, telegraph +52%, morse +73% vs terse control — transatlantic hits telegraph-class savings with grammar intact
  - [ ] Regenerate legacy `evals/snapshots/results.json` for the new SKILL.md
  - [ ] Re-run with larger n and a second model to shrink the noise bands (stdev 10–30%)
- [ ] **Compression Boundary in caveman-compress**: Enforce the research finding
  - [ ] Skill must refuse telegraph/morse register for LLM context files (memory, CLAUDE.md)
  - [ ] Default compress target: transatlantic register

### Alignment Cleanup

- [ ] **TodoScope Alignment**: Finish convention adoption
  - [ ] Review `.todoscope-exclude.csv` paths (plugins/ mirror excluded on purpose)
  - [ ] Migrate any inline tags in source to `TODO:` / `FIXME:` / `BUG:` vocabulary
  - [ ] Scan repo with TodoScope and verify the board matches this file
- [ ] **Startr Alignment Follow-ups**: Scaffold landed 2026-07-30 (Makefile + allowlist .gitignore, verified)
  - [x] Stale dotdir leftovers (`.junie/`, `.kiro/`, `.roo/`, `.agents/`) — verified absent from this clone, nothing to remove
  - [ ] Decide fate of upstream `context/refs/` gitignore entry after fork cleanup

## Backlog

- [ ] **Liner Validation Eval**: Anti-AI-tell rules are convention, not experiment — build an eval that scores burstiness/tell-frequency so the level earns its citations
- [ ] **Surprisal Tooling**: Explore scoring output with a small LM (surprisal beats Flesch as a readability predictor — open question S5 in the ladder doc)
- [ ] **Wenyan Decision**: Deprecated in fork — decide whether to upstream the wenyan levels back to caveman or drop entirely
- [ ] **Per-Level Stats**: Statusline savings attribution once per-level benchmarks exist
- [ ] **Cavecrew Rename**: Decide subagent family name for the transatlantic brand

## Bugs

_No known bugs. Use `# BUG:` inline tags to flag defects in source._

## Done

- [x] **Name Research**: npm/GitHub availability probe — `transatlantic` free on npm, `pico` taken (2026-07-30)
- [x] **Bare Command Fix**: `/transatlantic` and `/ta` as user-scope commands; tracker accepts all namespaced forms
- [x] **Startr Scaffold**: Universal Makefile (help/vars/verify/git-flow-next/things_clean) + `.gitignore` converted to `.*` allowlist, both verified (`make verify` OK, no tracked files hidden)
- [x] **TodoScope Bootstrap**: TODO.md + `.todoscope-exclude.csv` created to convention
- [x] **Fork Bootstrap**: Six-level ladder landed on branch `transatlantic` — research pass, ladder doc, SKILL.md, hooks, statusline, stats, tests green, local machine swapped, committed (8bf3f4c, 86a708d, 25671de)
