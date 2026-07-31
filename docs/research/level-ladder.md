# The Transatlantic Level Ladder — Research Basis

Design document for the fork's prose-compression levels. Every level cites the research
tradition that justifies its rules, and every source consulted in the underlying research
pass is listed in the bibliography. Synthesized from a 29-source, adversarially verified
deep-research pass (2026-07-30): 126 claims extracted, 25 spot-verified by 3-vote
adversarial panels, 24 confirmed, 1 refuted (see "Refuted claims").

## What the evidence says

**1. Plainer prose measurably wins.** Controlled experiments and field data agree:
a US Department of Veterans Affairs letter rewrite cut inbound calls from 1,128 to 192
(est. >$40k/yr saved per letter); a 1989 US Navy study (Suchan & Colucci, 262 officers)
found plain-style memos gave significantly higher comprehension and 17–23% less reading
time; a second VA letter dropped non-comprehension from 56% to 11%; even lawyers
comprehend and recall "legalese" worse than equivalent-meaning simplified text.
*Verified 3-0 (FCC staffing anecdote 2-1).*
Sources: Kimble, *Writing for Dollars, Writing to Please* [S1]; Martinez, Mollica &
Gibson, PNAS 2023 [S2].

**2. Syntax, not vocabulary, is the main enemy.** The dominant driver of reading
difficulty is center-embedding — long-distance syntactic dependencies that overload
working memory — not jargon. A ~10M-word corpus analysis plus two experiments (N=184)
showed center-embedded clauses inhibited recall more than any other feature, even for
experienced, high-reading-level readers. This grounds Gibson's dependency-locality
theory and gives the ladder its first-order rule: kill center-embedding before touching
word choice. *Verified 3-0.*
Sources: Martinez, Mollica & Gibson, Cognition 2022 [S3]; PNAS 2023 [S2].

**3. "Shorter" and "clearer" are separate axes.** In a self-paced reading experiment
(N=117, Spanish administrative texts), plain terminology significantly improved
comprehension but did NOT significantly reduce reading time. A "most-compressed" level
is not automatically a "most-comprehensible" level; the ladder must treat readability
and speed as distinct dimensions. Caveat: single study, one language/register.
*Verified 3-0.* Source: Fernández-Silva & Núñez Cortés 2025 [S4].

**4. Do not optimize against Flesch/Flesch-Kincaid.** Measured against real-time
eye-tracking of adult English readers, traditional readability formulas, NLP methods,
commercial education systems, AND frontier LLMs (GPT-5, Gemini 2.0 Flash, Claude
Sonnet 4) all predict reading ease poorly; word entropy, length, frequency, and
surprisal (negative log-probability in context) predict it well — surprisal strongest.
Formula scores are descriptors, not objectives. The design target is *low-surprisal
wording in expected positions*, not a grade-level number. *Verified 3-0.*
Source: Gruteke Klein, Frenkel, Shubi & Berzak, "Surprisal Takes It All" [S5].
Supporting critiques of formulas: [S10] [S12] [S13] [S14] [S15].

**5. Levels are engineered cut-points, not natural categories.** Kuhn's canonical
survey of 100 English-based controlled natural languages (1930–today) classifies them
on four PENS dimensions (Precision, Expressiveness, Naturalness, Simplicity) and finds
they form a single scattered cloud between full English (P1E5N5S1) and propositional
logic (P5E1N1S5). A named ladder is a set of chosen cut-points on a continuum — we
present it as such. *Verified 3-0.* Source: Kuhn, Computational Linguistics 2014 [S6].

**6. The controlled-language tier is industrially validated.** Caterpillar Technical
English (with CMU, from 1991) is a documented industrial controlled-English deployment
[S7]. A 2023 experimental study (English→Turkish, 40 participants) found a CTE-rewritten
text used fewer words (52 vs 75), scored higher on reading ease (67.75 vs 59.92 FRE) at
equal lexical density, and produced significantly more accurate translations (11 vs 0
participants, p<0.05). Small n; direction consistent with three decades of industrial
use. *Verified 3-0 (translation-accuracy sub-claim 2-1).* Sources: [S7] [S8].

**7. Structure has evidence; most style folklore does not.** A systematic review of 33
empirical plain-language-summary studies found no empirical support for MOST criteria
in PLS writing guidelines — but found that structured format (subheadings) imparts more
knowledge and improves rated comprehensibility, credibility, and decision confidence.
The ladder leans on validated levers (syntax, structure, common words) and flags
convention-only rules as such. *Verified 3-0.* Source: Stoll, Kerwer et al.,
PLOS ONE 2022 [S9]. Front-loading support: inverted pyramid [S27], F-shaped scanning
[S29], given-new contract (Clark & Haviland 1977) [S28].

**8. LLM-side evidence cuts both ways.** Concise-output prompting (Concise
Chain-of-Thought) cut average response length 48.7% for GPT-3.5 and GPT-4 [S22];
verbose answers are *less* accurate than concise ones (27.61% gap on Qasper;
"verbosity compensation") [S24]; long reasoning chains carry real cost overhead
("overthinking") [S25]; prompt design strongly shifts LLM output distributions [S23].
BUT removing stopwords, articles, and commas from *input context* consistently degrades
LLM performance on MMLU and BABILong-4k, even when only irrelevant tokens are removed
(LLM-Microscope) [S21]. Consequence: telegraph-style compression is an OUTPUT register
for human skimming; never apply it to context the model must re-read (memory files,
CLAUDE.md) expecting free wins.

**9. Information-theoretic background.** Shannon's guessing-game experiments put
English redundancy near 75% [S16] — why telegraphic text remains decodable at all.
Reading-time and syntactic-reduction studies (Levy & Jaeger 2007 [S19]; Demberg &
Keller 2008 [S18]; Hahn et al. 2021 [S17]) show humans manage information density
actively — redundancy is not waste, it is load-smoothing.

## The ladder

Six levels, most readable to most compressed. Names follow the transatlantic
communication theme — each level is a real historic channel across the Atlantic, and
each maps to a research tradition.

| Level | Voice | Research basis | Position vs Pareto knee |
|-------|-------|----------------|-------------------------|
| **liner** | The ocean liner: classy, humanized prose. Full natural voice — varied sentence length and rhythm, contractions welcome, concrete over abstract, warmth without filler. Actively strips machine-writing tells: em-dash chains, "X, not Y" contrasts, rule-of-three cadence, aphoristic closers, uniform sentence length. May spend a few extra words on grace. | Surprisal/burstiness evidence — human prose varies information density and reads easier than uniformly-flat text [S5] [S17] [S19]; given-new flow [S28]. Anti-AI-tell rules are stylometric convention, flagged honestly per [S9] as convention, not validated experiment. | Before the knee; trades a little length for voice. For essays, announcements, anything with a byline. |
| **plain** | The plain-language letter. Full grammar, short declarative sentences, no center-embedding, common words, active voice, front-loaded conclusions, subheadings. Keeps helpful redundancy. | Plain-language movement [S1] [S2] [S3]; structure evidence [S9]; inverted pyramid [S27] [S29]; given-new [S28]. | Before the knee. Maximum comprehension. |
| **transatlantic** *(default)* | The newsreel voice. Everything in plain, minus filler, hedging, pleasantries, rhetorical padding, and repetition. One idea per sentence. Neutral, clipped, measured — never breathless. Grammar fully intact. | Plain-language base plus concision evidence: CCoT −48.7% length [S22]; verbosity-accuracy gap [S24]. Cuts pure redundancy only. | At the knee. Fewer words, comprehension preserved or improved. |
| **aviation** | Controlled technical English. Sentence cap ~20 words. One instruction per sentence. Imperative for procedures. One term = one meaning. Noun clusters ≤ 3 words. Lists over run-on enumerations. | CNL tradition: ASD-STE100 / Caterpillar CTE [S6] [S7] [S8]. | At the knee for procedures; best for runbooks, ESL readers, translation. |
| **telegraph** | Pay-per-word. Articles dropped, fragments OK, short synonyms — the historic transatlantic-cable register ("telegraphic style" is the standard linguistic term). Maps from legacy caveman `full`. | Shannon redundancy makes it decodable [S16]; speed-vs-comprehension dissociation [S4] and working-memory findings [S3] mark it past the knee. Input-context warning [S21]. | Past the knee. Faster to skim; NOT shown easier to understand. Expert/skim tier. |
| **morse** | Bare keywords, minimal glue. Maps from legacy caveman `ultra`. | Same as telegraph, amplified. Reader reconstructs structure. | Well past the knee. Max compression; reader bears ambiguity risk. |

**The Pareto frontier, stated plainly:** compression is free while it removes filler,
hedging, and already-stated information (liner → plain → transatlantic → aviation
preserve or improve comprehension while cutting or holding word count). It starts
costing comprehension the moment shortening forces center-embedded syntax, rare
high-surprisal words, or broken given-new links (telegraph → morse). The default level
sits at that knee.

## Refuted claims

One extracted claim failed adversarial verification (1-2) and must NOT be cited:

- ~~"Readers rated medium-complexity plain-language summaries (reading age 14–17) as
  most accessible, rather than the lowest-complexity versions."~~ Not supported by the
  underlying source [S9]. Do not use "maximum simplification is suboptimal" as a claim.

## Source-quality caveats

- Dramatic field figures (FCC five-staff reassignment, Navy $250–350M/yr, VA $40k/yr)
  come via Kimble's advocacy compilation [S1] and trace to advocacy newsletters or
  coordinator estimates, not independent audits. Direction is corroborated by the
  controlled experiments [S2] [S3]; treat exact dollar/staff numbers as anecdotal.
- The CTE word-count/Flesch comparison is a single text pair (n=1); the
  translation-accuracy result is one 40-participant study with sloppy p-value notation
  in the source ("p<0.5" printed for p<0.05) [S8].
- The comprehension-vs-speed dissociation is one N=117 Spanish-language study [S4];
  replication for English assistant prose is an open question.
- The formula-vs-eye-tracking result [S5] is 2025–2026 work testing current frontier
  models — fresh, not yet widely replicated.

## First measured data (2026-07-31)

CLI eval run (`evals/level_run.py`): 10 prompts × 8 arms, model sonnet, tokens
counted offline with tiktoken (approximate ratios, not exact Claude tokens).
Savings are vs the "Answer concisely." terse control arm, mean across prompts:

| Level | Mean tokens | Savings vs terse (mean) | stdev |
|---|---:|---:|---:|
| liner | 198 | +44% | 20% |
| plain | 288 | +17% | 28% |
| transatlantic | 200 | +45% | 30% |
| aviation | 174 | +52% | 18% |
| telegraph | 176 | +52% | 13% |
| morse | 97 | +73% | 10% |

Two readings, both design-confirming. First, **transatlantic achieves telegraph-class
savings with grammar fully intact** (45% vs 52%, inside each other's noise band):
dropping articles buys almost nothing under a BPE tokenizer, exactly as the ladder
predicted — the real savings come from cutting filler clauses. Second, plain's smaller
saving is the point of plain: it keeps helpful redundancy on purpose. Morse is the only
level that buys a large step beyond the middle of the ladder. Caveats: n=10, one model,
one run; the terse control came out slightly *longer* than bare baseline (353 vs 319
mean tokens), a reminder that these are noisy small-sample ratios. API-measured
per-level numbers (exact Claude tokens, `benchmarks/run.py --level`) remain the
authoritative target.

## Open questions (unresolved by the evidence)

- Exact per-level savings under the Claude API tokenizer — the CLI/tiktoken run above
  approximates it; authoritative numbers need `benchmarks/run.py --level` runs
  (bring-your-own-key flow in `benchmarks/README.md`).
- Whether the comprehension-vs-speed dissociation replicates for English technical prose.
- Quantified knee location for assistant prose specifically — no study measures it directly.
- How to weight surprisal (validated predictor, needs a model to compute) against
  formulas (invalid target, cheap to compute) in practical tooling.

## Design rules that follow

1. Default (`transatlantic`) keeps full grammar. Article-dropping is opt-in, flagged as skim-tier.
2. Never chase Flesch scores; prefer common words in expected positions (low surprisal).
3. Kill center-embedding first, everywhere, at every level — the validated main enemy.
4. Front-load the answer; structure with subheadings at liner/plain/transatlantic.
5. Memory-file compression (`caveman-compress` lineage) must NOT use telegraph/morse —
   stopword removal degrades LLM reading of context [S21].
6. Wenyan levels are dropped from the fork (brand mismatch); legacy caveman levels map
   to `telegraph` (full) and `morse` (ultra) for migration.
7. `liner`'s anti-AI-tell rules are convention, not validated experiment — documented
   as such, consistent with [S9]'s finding that most style rules lack validation.

## Bibliography

All sources consulted in the research pass. Quality: primary = peer-reviewed paper or
primary document; secondary = expert synthesis; blog = practitioner content;
unreliable = fetched but yielded no usable claims.

| # | Source | Quality | Angle |
|---|--------|---------|-------|
| S1 | Kimble, *Writing for Dollars, Writing to Please* — <https://www.editorsoftware.com/wp-content/uploads/2021/03/kimble-writing-for-dollars-plain-english.pdf> | primary | plain-language outcomes |
| S2 | Martinez, Mollica & Gibson, "Even lawyers do not like legalese," PNAS 2023 — <https://www.pnas.org/doi/10.1073/pnas.2302672120> | primary | plain-language outcomes |
| S3 | Martinez, Mollica & Gibson, "Poor writing, not specialized concepts, drives processing difficulty in legal language," Cognition 2022 — <https://www.sciencedirect.com/science/article/pii/S0010027722000580> | primary | plain-language outcomes |
| S4 | Fernández-Silva & Núñez Cortés, Int. J. Applied Linguistics 2025 — <https://onlinelibrary.wiley.com/doi/10.1111/ijal.12650> | primary | plain-language outcomes |
| S5 | Gruteke Klein, Frenkel, Shubi & Berzak, "Surprisal Takes It All" — <https://arxiv.org/pdf/2502.11150> (HTML: <https://arxiv.org/html/2502.11150v1>) | primary | readability metrics / cognitive load |
| S6 | Kuhn, "A Survey and Classification of Controlled Natural Languages," Computational Linguistics 2014 — <https://arxiv.org/pdf/1507.01701> | primary | controlled natural languages |
| S7 | Kamprath, Adolphson et al., "Controlled Language for Multilingual Document Production" (Caterpillar CTE), CLAW 1998 — <https://www.semanticscholar.org/paper/7211d59c0445e1bdb7d1c507cc9e5aa60271168d> | primary | controlled natural languages |
| S8 | CTE English→Turkish experimental study, Studies About Languages 43 (2023) — <https://pdfs.semanticscholar.org/dd3c/7bbf6f7312ca45a7bd172bee9a6f492ac1bc.pdf> | primary | controlled natural languages |
| S9 | Stoll, Kerwer et al., systematic review of plain-language summaries, PLOS ONE 2022 — <https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0268789> | primary | plain-language outcomes |
| S10 | "Readability Formulas: 7 Reasons to Avoid Them," UXmatters 2019 — <https://www.uxmatters.com/mt/archives/2019/07/readability-formulas-7-reasons-to-avoid-them-and-what-to-do-instead.php> | secondary | readability metrics |
| S11 | Linköping University thesis (fetched; no usable claims) — <https://liu.diva-portal.org/smash/get/diva2:16816/FULLTEXT01> | unreliable | controlled natural languages |
| S12 | AHRQ, "Tip 6: Use caution with readability formulas" — <https://www.ahrq.gov/talkingquality/resources/writing/tip6.html> | secondary | readability metrics |
| S13 | Bruce, Rubin & Starr, "Readability formulas have even more limitations than Klare discusses" (1981) — <https://www.researchgate.net/publication/220517614> | primary | readability metrics |
| S14 | Readability formulas vs comprehension/retention, PMC 2025 — <https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12490814/> | primary | readability metrics |
| S15 | Readability formulas vs EFL reader judgments (118 undergraduates), MJSS 2012 — <https://www.richtmann.org/journal/index.php/mjss/article/download/11036/10649/41930> | primary | readability metrics |
| S16 | Shannon, "Prediction and Entropy of Printed English" (1951) — <https://www.princeton.edu/~wbialek/rome/refs/shannon_51.pdf> | primary | information theory |
| S17 | Hahn et al., resource-rational sentence processing, Psych. Review 2021 — <https://www.mhahn.info/files/hahn_psychreview_2021_final.pdf> | primary | information theory / cognitive load |
| S18 | Demberg & Keller, eye-tracking corpus evidence for syntactic processing, Cognition 2008 — <https://www.coli.uni-saarland.de/~vera/CognitionDembergKeller08.pdf> | primary | cognitive load |
| S19 | Levy & Jaeger, "Speakers optimize information density through syntactic reduction," NIPS 2007 — <https://www.academia.edu/265552/> | primary | information theory |
| S20 | (duplicate HTML mirror of S5, counted separately in fetch stats) | primary | cognitive load |
| S21 | "LLM-Microscope: the Hidden Role of Punctuation in Context Memory of Transformers" — <https://arxiv.org/pdf/2502.15007> | primary | LLM tokenization/terseness |
| S22 | "Concise Chain-of-Thought (CCoT)" — <https://arxiv.org/pdf/2401.05618> | primary | LLM terseness |
| S23 | Prompt-design sensitivity in LLM annotation — <https://arxiv.org/pdf/2406.11980> | primary | LLM terseness |
| S24 | "Verbosity compensation" (Qasper gap) — <https://arxiv.org/pdf/2411.07858> | primary | LLM terseness |
| S25 | "Overthinking" — cost of long reasoning chains — <https://arxiv.org/pdf/2503.16419> | primary | LLM terseness |
| S26 | Portkey, "Optimize token efficiency in prompts" — <https://portkey.ai/blog/optimize-token-efficiency-in-prompts/> | blog | LLM tokenization |
| S27 | Nielsen Norman Group, "Inverted Pyramid: Writing for Comprehension" — <https://www.nngroup.com/articles/inverted-pyramid/> | secondary | journalism style |
| S28 | Clark & Haviland, "Comprehension and the Given-New Contract" (1977) — <http://www.web.stanford.edu/~clark/1970s/Clark,%20H.H.%20_%20Haviland,%20S.E.%20_Comprehension%20and%20the%20given-new%20contract_%201977.pdf> | primary | journalism style / cognitive load |
| S29 | Nielsen Norman Group, "F-Shaped Pattern for Reading Web Content" — <https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content-discovered/> | primary | journalism style |

**Coverage gaps** (searched, but no verified claims survived — the ladder does NOT lean
on these): Ogden's Basic English specifics, Attempto Controlled English specifics,
cloze-test evidence on redundancy, AP style efficacy, Hemingway/mid-Atlantic diction as
tested phenomena (folklore until tested), and precise BPE tokenizer arithmetic for
article-dropping (open question above).
