# Transatlantic — Roadmap

Fork of [caveman](https://github.com/JuliusBrussee/caveman) rebranded to
**transatlantic**: research-backed prose levels from classy humanized (liner)
to bare keywords (morse), plus a classical Chinese annex (wenyan). Level
ladder and citations: `docs/research/level-ladder.md`.

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

- [ ] **Post-Launch**: Live as of 2026-07-31 — remaining follow-through
  - [ ] Reserve npm name `transatlantic` — needs `npm login` (BLOCKED on auth: `npm whoami` says ENEEDAUTH)
  - [ ] Announce (Sage.is / Startr channels; fieldnote is the copy source)
  - [ ] Watch for first community benchmark PRs

## TODO

### Poka-Yoke (pre-npm audit, 2026-07-31) — mistake-proof before publish

- [x] **Release-Ref Unification**: shims now pin `npx github:$REPO#$PINNED_REF` (v1.0.0) — zero floating refs; bump both shim pins + `bin/install.js` PINNED_REF together each release (covered by the pending version-equality test)
- [ ] **Version Triplication** #critical
  - [x] Aligned at 1.0.0 (package.json, git tag via make release flow, `PINNED_REF`, `SKILL_VERSION`) — transatlantic's own versioning initialized 2026-07-31; upstream's inherited v1.x tags and the interim v2.0.0 removed
  - [x] Test added: package == PINNED_REF == both shim pins == latest tag (pokayoke.test.mjs)
- [x] **Publish Gate**: `"prepublishOnly": "npm test"` in package.json
- [x] **Audit fully applied** (2026-07-31, `tests/installer/pokayoke.test.mjs`, suite 132/132): command list derived from filesystem; drift tests for skill-dir lists, HOOK_FILES js↔sh parity, checksum bytes, statusline case arms, SKILL table rows, mirror↔source byte-equality, version quadruple (package/PINNED_REF/shim pins/latest tag); semantic maps single-sourced in caveman-config; plugin id derived from plugin.json; CI sync trigger fixed (was `main`, a branch this repo lacks — root cause of stale mirrors). Devices caught four real bugs on first run: stale checksums, openclaw bootstrap pointing at the old skill path, uninstall crashing on missing repoRoot, and opencode.json registering `plugins/caveman/plugin.js` while the installer wrote `plugins/transatlantic/` — opencode installs loaded nothing

### Rebrand Remainder

- [ ] **Installer String Sweep**: `bin/install.js` PROVIDERS labels, uninstall marker, `install.sh` / `install.ps1` shim references — mechanism works, strings still say caveman
- [ ] **Installer Ships the Full Local Setup**: Automate what was hand-done on this machine
  - [ ] Wire statusline into `settings.json` via `bin/lib/settings.js` (hand-added 2026-07-30)
  - [ ] `--uninstall` removes marker-owned mirrored commands
  - [ ] Document the dev-mode install (installPath pointed at clone) and its marketplace-update revert risk
- [ ] **Internal Filename Decision at 1.0**: `ta-config.js`, `ta-activate.js`, `ta-mode-tracker.js`, `caveman-statusline.*`, `ta-stats.js`, `ta-init.js`, `.ta-active` flag, `caveman-shrink` npm package — all functional, all still cave-named. Rename in one coordinated pass at the repo move (see CLAUDE.md fork banner for the split-brain rationale)

### Evidence Debt

- [ ] **API Benchmarks Per Level**: Real numbers only — never estimate #critical
  - [ ] First community/API runs per level committed to `benchmarks/results/` (BYO-key flow live in `benchmarks/README.md`; `run.py --level` ready)
  - [ ] Update `COMPRESSION` map in `src/hooks/ta-stats.js` from results
  - [ ] Regenerate README benchmark table from committed results
- [ ] **Eval Follow-ups**: Per-level CLI numbers exist (see Done); shrink the error bars
  - [ ] Regenerate legacy `evals/snapshots/results.json` for the new SKILL.md
  - [ ] Re-run `level_run.py` with larger n and a second model (current stdev 10–30%)
- [ ] **Compression Boundary in ta-compress**: Enforce the research finding (ladder doc S21)
  - [ ] Skill must refuse telegraph/morse register for LLM context files (memory, CLAUDE.md)
  - [ ] Default compress target: transatlantic register

### Alignment Cleanup

- [ ] **TodoScope Alignment**: Finish convention adoption
  - [ ] Review `.todoscope-exclude.csv` paths (plugins/ mirror excluded on purpose)
  - [ ] Migrate any inline tags in source to `TODO:` / `FIXME:` / `BUG:` vocabulary
  - [ ] Scan repo with TodoScope and verify the board matches this file
- [ ] **Startr Alignment Follow-ups**:
  - [ ] Decide fate of upstream `context/refs/` gitignore entry after fork cleanup

## Backlog

- [ ] **Navigate Skill Follow-ups**: `ta-navigate` shipped 2026-08-03 (chart = TodoScope TODO.md, decision cards, fog in Backlog, decision records in docs/decisions/) — follow-ups: TodoScope scanner treatment of `Blocked by [name]` lines (surface blocked-vs-frontier on the board), a worked example chart in docs, and per-level register guidance for decision records
- [ ] **Liner Validation Eval**: Anti-AI-tell rules are convention, not experiment — build an eval that scores burstiness/tell-frequency so the level earns its citations
- [ ] **Surprisal Tooling**: Explore scoring output with a small LM (surprisal beats Flesch as a readability predictor — open question S5 in the ladder doc)
- [ ] **Wenyan Benchmarks**: The annex claims densest register per token — measure it (eval + API runs)
- [ ] **Per-Level Stats**: Statusline savings attribution once per-level benchmarks exist

## Bugs

_No known bugs. Use `# BUG:` inline tags to flag defects in source._

## Done

- [x] **LAUNCHED** (2026-07-31): `Startr/transatlantic` public; v2.0.0 tagged; landing page live at startr.github.io/transatlantic (Pages, master:/docs); one-liner install verified end-to-end from the live internet in a sandbox (curl → shim → npx → transatlantic installer, correct plugin id); every install path test-verified (installer suite 121/121, all hook suites green); develop/master/transatlantic in sync at v2.0.0

- [x] **Name Research**: npm/GitHub availability probe — `transatlantic` free on npm, `pico` taken (2026-07-30)
- [x] **Fork Bootstrap**: Six-level ladder landed on branch `transatlantic` — 29-source verified research pass, ladder doc with full bibliography, SKILL.md, hooks with legacy normalization, statusline, stats, all suites green, local machine swapped (2026-07-30)
- [x] **TodoScope + Startr Scaffolds**: TODO.md, `.todoscope-exclude.csv`, universal Makefile, `.*`-allowlist `.gitignore` — all verified (2026-07-30)
- [x] **Plugin + Package Rename**: manifest/marketplace/package to `transatlantic`; commands namespace `/transatlantic:*`; flag file stays `.ta-active` until 1.0 by recorded decision (2026-07-31)
- [x] **Docs in Liner Voice**: README (research-marketed, honest pre-release install), INSTALL banner, rule bodies, OpenClaw bootstrap (byte-synced), CLAUDE.md fork banner, env/config names with legacy fallbacks (2026-07-31)
- [x] **Every Documented Command Resolves**: SessionStart hook mirrors plugin commands into user scope (marker-owned, idempotent, retires stale mirrors); trackers accept every namespaced spelling; tested (2026-07-31)
- [x] **Caveman Command Retirement**: `/ta-*` family ships; no caveman-named command anywhere; per-repo rule files migrate legacy installs in place; typed legacy forms accepted undocumented (2026-07-31)
- [x] **Wenyan Reinstated**: First-class annex (wenyan-lite / wenyan / wenyan-ultra) — Chinese stays, cave goes (2026-07-31)
- [x] **Crew Rename**: `crew-locator` / `crew-editor` / `crew-reviewer` (was cavecrew-*) after a three-agent research pass (sea literature, cable-ship history, CRM/naming studies): metaphor names the ship, function names the crew. `CREW_*_MODEL` env vars with legacy `CAVECREW_*` accepted (2026-07-31)
- [x] **First Per-Level Numbers**: CLI eval (sonnet, n=10, tiktoken ratios vs terse control): liner +44%, plain +17%, transatlantic +45%, aviation +52%, telegraph +52%, morse +73% — transatlantic hits telegraph-class savings with grammar intact; snapshot committed (2026-07-31)
- [x] **Benchmark Invitation**: `run.py --level` + BYO-key contribution flow in `benchmarks/README.md` under real-numbers-only house rules (2026-07-31)
- [x] **CI Sync Workflow**: paths updated for `plugins/transatlantic/`, `skills/transatlantic` + `ta-*` + `crew`, `dist/transatlantic.skill` (2026-07-31)
- [x] **Docs Site Rebuilt**: `docs/index.html` is now the transatlantic landing page — self-contained (no external fonts/CDN), light and dark, liner-voice copy from the fieldnote, measured-numbers table with caveats, honest install section; upstream page preserved at `docs/research/index-caveman-upstream.html` (2026-07-31)
- [x] **Upstream Posture Decided**: fork quietly, no upstream PRs — clean divergence, less coordination overhead (2026-07-31)
- [x] **Repo Home: Startr** (decided 2026-07-31, "dev tech lives with the dev tools"): private `Startr/transatlantic` created; git-flow `develop` (default) + `master` pushed; local remotes rewired (`origin`=Startr, `upstream`=JuliusBrussee); package/plugin/marketplace identity Startr with the Sage.is voice credit kept in copy; local marketplace source repointed; clone URLs real
- [x] **Landing Page in Startr House Style**: startr.style + vendored system7.css (hard shadows, Monaco, System 7), same liner copy, no tracking script (2026-07-31)
- [x] **Documentation Alignment Pass**: skill READMEs, CONTRIBUTING, SECURITY, HONEST-NUMBERS, evals README, TOML stubs, CLAUDE.md body — all match the shipped state (2026-07-31)
