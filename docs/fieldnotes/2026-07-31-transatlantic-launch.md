# You don't have to grunt to save tokens

*Transatlantic is a set of prose registers for AI coding agents, built on published reading research. This is the story of why it exists.*

*Pre-release snapshot, 31 July 2026. Everything described as measured or working below is real today; the footer maps the rest to the roadmap.*

---

For years at Sage.is, the team behind the Sage AI UI, we have written to a small set of house rules. Minimal and earnest, in the Hemingway line: short declarative sentences, plain words, no ornament, nothing cut that carries meaning. The rules are older than any of our tools. They shaped the UI copy, the docs, the way we answer a support ticket. We never thought of them as a product. They were just how the house talks.

Then our agents started doing most of the talking, and they didn't talk like us. An AI coding agent left to its defaults pads every answer: the warm-up sentence, the hedge, the recap nobody asked for. You pay for those tokens and then you pay again in the time it takes to read them.

The push to fix it came from an install that worked too well. Alexander Somma put a plugin called caveman on his machine because the pitch was irresistible: make your agent talk like a caveman, save 65% of your output tokens, lose nothing technical. The pitch was honest, too — the numbers were measured against the real API and committed to the repo, which is rarer than it should be. And it delivered. The agent's answers got short.

They also got embarrassing. "New object ref each render. Wrap in `useMemo`." Correct, certainly. Also not something you'd want on screen when a client walks past, and nothing like the house voice. Caveman proved that agents waste most of their words. It never asked whether you have to talk like that to stop wasting them. We believed you didn't, because we'd been writing proof of it for years. What we'd never done was measure our style against the alternatives, and caveman's whole culture was measurement. So we forked it — the first working name on the whiteboard was simply "hemingway" — and put our voice and their rigor in the same repo.

Asking the question properly turned into a research pass through twenty-nine sources on how people actually read: the plain-language studies that cut a Veterans Affairs letter's support calls from 1,128 to 192, the syntax experiments showing that clauses folded inside clauses hurt readers more than jargon does, the eye-tracking work showing that readability formulas barely predict reading ease at all. Each claim went through adversarial fact-checking before we let it shape the design. One claim failed and was thrown out. The rest became a ladder.

Then we measured the thing that mattered. Against a plain "be concise" baseline, caveman's grunt register saves about 52% of output tokens. A register with every article intact, full grammar, one idea per sentence? 45%, inside the noise band of the same test. Under a modern tokenizer, dropping "the" buys almost nothing. The savings were never in the small words. They were in the filler sentences, and you can cut those wearing a dinner jacket.

That finding is the product. Transatlantic gives your agent six registers, named for the ways people used to talk across an ocean. The liner, for prose with an actual pulse. The plain letter, for explaining things to people who shouldn't need to reread. The transatlantic newsreel voice, the default, clipped and clear and grammatical. Aviation English, for runbooks, one instruction per sentence. And past the point where the research says comprehension starts to pay for the compression, clearly labeled as such: the telegraph and morse registers, for experts who want to skim. There's a classical Chinese annex too, kept from the original, because 文言文 remains the densest register anyone has invented.

Every level cites the tradition it comes from. The plain register leans on the plain-language movement's field results. Aviation follows the controlled-English standard that aerospace has used for decades. The default's one-idea-per-sentence rule comes from working-memory experiments, and the whole ladder refuses to chase Flesch scores because the eye-tracking evidence says those scores mislead. When we don't have evidence, the docs say so plainly. The liner register's rules against machine-writing tells are labeled as convention, because no one has run that experiment yet. We'd like to.

There was one more inheritance to deal with. Caveman's docs told users to type `/caveman`; the plugin actually required `/caveman:caveman`. A small lie, the kind every project accumulates. We fixed it structurally: the session hook mirrors every command into a scope where the bare names genuinely resolve, and every command in our docs is tested to work as written. The same temperament runs through the numbers. The benchmark harness takes your API key, not our word, and the honest-numbers page will tell you outright when this tool costs you money instead of saving it.

Caveman got the diagnosis right. Agents are verbose because nothing ever told them not to be. Transatlantic keeps the cure and gives it the voice we've held ourselves to for years, and everything it claims, it can show a citation or a committed measurement for. The house style finally has its evidence.

The grunt got us across the ocean. Now we dress for dinner.

---

*Real today: the six-register ladder plus wenyan annex, the research document with full bibliography, first per-level measurements (CLI eval, n=10, tiktoken-approximate), working commands on Claude Code and 30+ agents from a local clone, and the bring-your-own-key benchmark flow. On the [roadmap](../../TODO.md): the project's permanent home and npm release, API-measured per-level numbers, and larger eval runs to shrink the error bars.*
