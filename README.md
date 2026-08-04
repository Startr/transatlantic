<p align="center">
  <strong>transatlantic</strong>
</p>

<p align="center">
  Six prose registers for AI coding agents, each one grounded in published research<br>
  on how people actually read. Concise output that stays clear.
</p>

<p align="center">
  <a href="#see-it">See it</a> ·
  <a href="#install">Install</a> ·
  <a href="#the-ladder">The ladder</a> ·
  <a href="#the-research">The research</a> ·
  <a href="#what-you-get">What you get</a> ·
  <a href="#benchmarks">Benchmarks</a>
</p>

---

Transatlantic is a skill/plugin for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) and 30+ other AI coding agents. The voice comes first. At [Sage.is](https://sage.is), makers of the Sage AI UI, the house writing guidelines have been minimal, earnest, and Hemingway-inspired for years: short declarative sentences, plain words, nothing cut that carries meaning. Transatlantic packages that register so your agent writes to it too. It's built on a fork of [caveman](https://github.com/JuliusBrussee/caveman), which proved that agents waste most of their words and contributed its measurement culture; we contributed the voice. The default cuts the filler and keeps the grammar, because the evidence says that's where compression is free.

The name is the idea. Every level is a way people once talked across the Atlantic: the ocean liner, the plain letter, the newsreel broadcast, aviation radio, the telegraph cable, morse code. Pick how far down the wire you want to go.

## See it

**Question:** "Why does my React component re-render?"

> **A typical agent (69 tokens):** The reason your React component is re-rendering is likely because you're creating a new object reference on each render cycle. When you pass an inline object as a prop, React's shallow comparison sees it as a different object every time, which triggers a re-render. I'd recommend using useMemo to memoize the object.

> **transatlantic, the default (26 tokens):** The component re-renders because each render creates a new object reference. Wrap the value in `useMemo` to keep the reference stable.

> **telegraph, when you want it terse (19 tokens):** New object ref each render. Inline object prop = new ref = re-render. Wrap in `useMemo`.

Same fix each time. The default reads like a good newsroom edit; telegraph reads like a cable from 1912. You choose the register, and code, commands, and error strings stay byte-for-byte exact at every level.

## Install

One command finds every agent on your machine and wires each one:

```bash
# macOS · Linux · WSL
curl -fsSL https://raw.githubusercontent.com/Startr/transatlantic/master/install.sh | bash
```

```bash
# Or from a clone, same result
git clone https://github.com/Startr/transatlantic.git && cd transatlantic
node bin/install.js
```

On Claude Code specifically, the plugin path also works: `claude plugin marketplace add Startr/transatlantic && claude plugin install transatlantic@transatlantic`. The full per-agent matrix (Cursor, Windsurf, Cline, Gemini, 30+ more) lives in [INSTALL.md](./INSTALL.md).

Or simply `npx -y transatlantic` once Node ≥18 is on the box. Safe to re-run; `npx -y transatlantic --uninstall` removes everything it added.

**Turn it on:** it's on by default from message one on Claude Code. Switch levels with `/transatlantic <level>` (or the short form `/ta <level>`). **Turn it off:** say "normal mode". The legacy `/caveman` commands still work and map onto the new ladder.

A word on command names, because upstream got this wrong and we won't: Claude Code namespaces plugin commands, so a plugin alone only provides `/transatlantic:transatlantic`. This project's session hook therefore mirrors its commands into your user scope at session start, which is what makes the bare `/transatlantic` and `/ta` forms real. The mirror is polite (files you author yourself are never touched) and takes effect from your first session start after install (in the very first session, the namespaced form works immediately). Every command documented here is tested to resolve.

## The ladder

Six levels, most readable to most compressed. Each maps to a real research tradition; the full citations live in [docs/research/level-ladder.md](./docs/research/level-ladder.md).

| Level | Voice | When to use it |
|---|---|---|
| `liner` | Classy, humanized prose. Varied rhythm, no machine tells. | Essays, announcements, anything with a byline |
| `plain` | The plain-language letter. Short sentences, common words, helpful redundancy kept. | Explaining things to non-experts |
| `transatlantic` | **Default.** The newsreel voice. Full grammar with the filler, hedging, and padding cut. | Everyday agent work |
| `aviation` | Controlled technical English, ASD-STE100 style. One instruction per sentence. | Runbooks, procedures, ESL readers, translation |
| `telegraph` | Pay-per-word. Dropped articles, fragments. The old caveman `full`. | Skimming as an expert |
| `morse` | Bare keywords. The old caveman `ultra`. | Maximum compression, you fill the gaps |
| `wenyan` | Classical Chinese (文言文), the densest register of all. Also `wenyan-lite` and `wenyan-ultra`. | When you read classical Chinese and want maximum meaning per token |

Your language is preserved at every level. Write Portuguese and the agent answers in Portuguese, compressed the same way.

## The research

Most "be concise" tools guess. We ran a 29-source research pass with adversarial fact-checking (24 of 25 spot-verified claims confirmed) and built each level on what survived. Four findings shape the design:

**Plainer prose wins, measurably.** A rewritten Veterans Affairs letter cut inbound support calls from 1,128 to 192. A US Navy study found officers read plain memos 17–23% faster with better comprehension. Even lawyers understand legalese worse than a plain rewrite of the same contract ([PNAS 2023](https://www.pnas.org/doi/10.1073/pnas.2302672120)).

**Syntax is the real enemy.** Center-embedded clauses, sentences folded inside sentences, hurt recall more than jargon does ([Cognition 2022](https://www.sciencedirect.com/science/article/pii/S0010027722000580)). Every level therefore splits nested clauses first and worries about word choice second.

**Shorter and clearer are different axes.** Plain wording improved comprehension without making reading faster in controlled testing. So the ladder never pretends its tersest levels are its clearest; telegraph and morse are labeled as skim registers, honestly.

**Readability formulas mislead.** Against eye-tracking data, Flesch-style scores and even frontier LLMs predict reading ease poorly; word predictability does far better ([Surprisal Takes It All](https://arxiv.org/pdf/2502.11150)). We design for common words in expected positions instead of chasing a grade-level number.

One more, for the machines: stripping articles and stopwords from an agent's *input* context measurably degrades its performance ([LLM-Microscope](https://arxiv.org/pdf/2502.15007)). Telegraph compression is for human eyes. The tooling refuses to apply it to memory files an agent must re-read.

## What you get

| Command | What it does |
|---|---|
| `/transatlantic [level]` or `/ta [level]` | Set the prose register. Sticks until changed or session end. |
| `/caveman [lite\|full\|ultra]` | Legacy commands, mapped onto the ladder. |
| `/ta-commit` | Conventional Commit messages, ≤50-char subject. |
| `/ta-review` | One-line PR comments: `L42: 🔴 bug: user null. Add guard.` |
| `/ta-stats` | Real session token usage and lifetime savings. |
| `/ta-compress <file>` | Rewrite a memory file into the compact register that's safe for LLM context. |
| `/navigate <idea\|chart>` | Chart work too big for one session as decision cards in a TodoScope `TODO.md`, then resolve one per session. `/navigate help` for the usage card. |
| `/ta-help` | The quick-reference card: levels, commands, how to switch off. |

On Claude Code the statusline shows the active level: `[TRANSATLANTIC]`, or `[TRANSATLANTIC:MORSE]` when you've gone down the wire.

## Benchmarks

Real token counts from the Claude API, committed and reproducible in [`benchmarks/`](./benchmarks/) and [`evals/`](./evals/). The measured number belongs to the **telegraph** register (the upstream caveman default): average **65% output reduction** across 10 tasks, range 22–87%.

<!-- BENCHMARK-TABLE-START -->
| Task | Normal | Telegraph | Saved |
|------|-------:|--------:|------:|
| Explain React re-render bug | 1180 | 159 | 87% |
| Fix auth middleware token expiry | 704 | 121 | 83% |
| Set up PostgreSQL connection pool | 2347 | 380 | 84% |
| Explain git rebase vs merge | 702 | 292 | 58% |
| Refactor callback to async/await | 387 | 301 | 22% |
| Architecture: microservices vs monolith | 446 | 310 | 30% |
| Review PR for security issues | 678 | 398 | 41% |
| Docker multi-stage build | 1042 | 290 | 72% |
| Debug PostgreSQL race condition | 1200 | 232 | 81% |
| Implement React error boundary | 3454 | 456 | 87% |
| **Average** | **1214** | **294** | **65%** |
<!-- BENCHMARK-TABLE-END -->

First per-level measurements exist (CLI eval, 10 prompts, sonnet, tiktoken-approximate ratios vs a plain "be concise" control): liner +44%, plain +17%, transatlantic +45%, aviation +52%, telegraph +52%, morse +73%. The headline: the default keeps full grammar and still lands in telegraph's savings band. Dropping articles buys almost nothing under a modern tokenizer. The tokens were in the filler. Details and caveats in [docs/research/level-ladder.md](./docs/research/level-ladder.md).

API-measured numbers are the authoritative target, collected the same way as the table above: measured, committed, never estimated. You can contribute a run with your own API key; one level costs pennies and takes minutes. The how and the house rules live in [benchmarks/README.md](./benchmarks/README.md).

> [!IMPORTANT]
> **Honest number warning.** These levels shrink **output** tokens. Input and reasoning tokens are untouched, and the skill itself adds ~1–1.5k input tokens per turn, so whole-session savings run smaller than the output number. The primary win is readability and speed; cost is the bonus. Full accounting in **[docs/HONEST-NUMBERS.md](./docs/HONEST-NUMBERS.md)**.

## Credits

Forked from [caveman](https://github.com/JuliusBrussee/caveman) by Julius Brussee, whose benchmarks, eval harness, and hook architecture this project stands on. The grunt got us across the ocean. Now we're dressing for dinner.

MIT licensed, like the original.
