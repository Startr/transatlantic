---
name: ta-navigate
description: >
  Plan a piece of work too large for one agent session as a shared chart of
  decision cards in a TODO.md, TodoScope-style, and resolve them one at a
  time until the way to the destination is clear. Invoked as /navigate or
  /transatlantic:navigate, with a loose idea (charting) or an existing chart
  (working). Plans by default; it produces decisions, not deliverables.
disable-model-invocation: true
---

A loose idea has arrived. It is too big for one session, and the way from here to the destination is not visible yet. Navigation finds that way. It does not charge at the destination. This skill lays the route out as a shared chart in a `TODO.md`, then works its decision cards one at a time until the route is clear.

A decision card resolves a question. It is not a slice of a build to execute. The destination varies per effort, and naming it is the first act of charting, because it shapes every card. It might be a spec to hand off, a decision to lock before planning starts, or a change made in place, like a data-structure migration. The chart is domain-agnostic. Engineering work, course content, anything with this shape fits.

## Plan, don't do

Navigation is planning by default. Each card resolves a decision, and the chart is done when the way is clear: nothing left to decide before someone goes and does the thing. The pull to just do the work is usually the signal that you have reached the edge of the chart and it is time to hand off. An effort can override this in its Notes, carrying execution into the chart itself. Absent that, produce decisions, not deliverables.

## Refer by name

Every card has a name: its bold title. In everything the human reads, refer to a card by that name, never by a bare number or slug. A wall of ids is illegible; names read at a glance. When a card links to a decision record, the name wraps the link.

## The chart

The chart is a `TODO.md` file following the TodoScope convention: sections map to kanban columns, checkbox items are cards, and the scanner renders the board. For a repo-wide effort it is the repo's own `TODO.md`; for a scoped effort it lives in the effort's directory (the scanner finds subdirectory TODO.md files and boards them too). Never hand-edit `KANBAN.canvas`; it regenerates from the chart.

The chart is an index, not a store. It lists the decisions made and links the records that hold their detail. A decision lives in exactly one place, its decision record, so the chart never restates it. It gives the gist and links.

### Chart layout

```markdown
# <Effort name> — Chart

## Destination

<What reaching the end looks like: the spec, decision, or change this effort
is finding its way to. One or two lines. Every session orients here first.>

## Notes

<Domain. Skills every session should consult. Standing preferences.>

## In Progress

<!-- claimed cards: exactly the ones a session is resolving right now -->

- [ ] **<Card name>**: <question> (<who claimed it>) #interview

## TODO

<!-- charted open cards. A blocked card carries a Blocked-by line. -->

- [ ] **<Card name>**: <question> #research
- [ ] **<Card name>**: <question> #prototype
  Blocked by [<other card name>].

## Backlog

<!-- the fog: in-scope questions you cannot phrase sharply yet. Loose prose
bullets, no checkboxes, so nothing here becomes a card by accident. -->

- <suspected question or area, as loosely as the view allows>

## Out of scope

<!-- work ruled beyond the destination. Prose bullets. Never graduates. -->

- <gist> — why it is out of scope <(link to the closed card's record if one existed)>

## Done

<!-- the index: one line per resolved card, gist plus link to the record -->

- [x] **<Card name>**: <one-line gist of the answer> — [decision](docs/decisions/<slug>.md)
```

### Cards

A card is one checkbox item with a bold name and a question, sized so one agent session can resolve it. Its type rides as a TodoScope hashtag, one of `#research`, `#prototype`, `#interview`, `#task`. The board renders these as badges.

A session claims a card first, before any work, by moving it to In Progress with the claimant's name in the stakeholder position. The move is the claim; concurrent sessions skip anything already there. The chart travels in git, so pull before claiming and commit the claim promptly.

Blocking is a plain line on the card: `Blocked by [card name].` A card is unblocked when every card it names is in Done. The frontier is the open, unblocked, unclaimed cards in TODO: the edge of the known. On the board, In Progress shows what is claimed and TODO holds the frontier and the blocked together, so keep Blocked-by lines current; they are what tells the two apart.

The answer is not part of the card. It is recorded on resolution as a decision record (see Working the chart). Assets created along the way are linked from the record, not pasted into the chart.

## Card types

Every card is either HITL, worked with a human who speaks for themselves, or AFK, driven by the agent alone. A HITL card only resolves through that live exchange. The agent never stands in for the human's side of it; an interview agent that answers its own questions has broken this.

- **Research** (AFK, `#research`): read documentation, third-party APIs, or local resources to surface a fact a decision waits on. Resolve with whatever research machinery the host session provides, a research subagent where available. Use when the answer lives outside the working directory.
- **Prototype** (HITL, `#prototype`): raise the fidelity of the discussion with a cheap, rough, concrete artifact to react to. An outline, a stub, a sketch of UI or logic. Link the artifact from the decision record. Use when "how should it look" or "how should it behave" is the question.
- **Interview** (HITL, `#interview`): a conversation with the human, one question at a time, front-loaded and specific. The default type.
- **Task** (HITL or AFK, `#task`): manual work that must happen before a decision can be made. Signing up for a service so its API can be judged, provisioning access, moving data so its shape can be seen. This is the one type that does rather than decides, and it earns its place by unblocking a decision, never by delivering the destination. The agent drives it alone where it can; otherwise it hands the human a precise checklist. The record states what was done and any resulting facts later cards depend on.

## The fog

The chart is deliberately incomplete. Do not chart what you cannot yet see. Beyond the live cards lies the fog: decisions you can tell are coming but cannot pin down, because they hang on questions still open. Resolving a card clears the fog ahead of it. Whatever becomes specifiable graduates into a fresh card, one at a time, until the way is clear and no cards remain.

The Backlog section holds the fog as loose prose bullets. Everything there is in scope, just not sharp enough to card. Write as loosely or as fully as the view allows; it doubles as a signpost for collaborators reading where the effort is headed.

Fog or card? The test is whether you can state the question precisely now, not whether you can answer it now. Card it when the question is sharp, even if blocked. Leave it in the fog when you cannot phrase it that sharply. Do not pre-slice the fog into card-sized pieces; one patch may graduate into several cards, or none, once the frontier reaches it.

## Out of scope

Fog only gathers toward the destination. The destination fixes the scope, so work beyond it is out of scope. It is not fog and it does not belong in Backlog. It goes in the Out of scope section: work consciously ruled out of this effort. Scope, not sharpness, lands it there.

Out-of-scope work never graduates. It returns only if the destination is redrawn, and then as a fresh effort. When an existing card turns out to sit past the destination, remove it from TODO and leave one prose line in Out of scope: the gist and why. It stays out of Done, which records the route actually walked; a scope boundary is not a step on it.

## Invocation

Two modes. Either way, never resolve more than one card per session, research cards excepted.

### Charting

The user invokes with a loose idea.

1. Name the destination. Interview the user until the destination is one or two firm lines. The destination fixes the scope, so it is settled first.
2. Map the frontier. Interview again, breadth-first: fan out across the whole space rather than deep on any thread, surfacing the open decisions and the first questions answerable now. If this surfaces no fog and the whole journey fits one session, stop; no chart is needed. Ask the user how they would like to proceed.
3. Create the chart: Destination and Notes filled, Done empty, the fog sketched into Backlog, and every card you can specify now under TODO with its type hashtag and any Blocked-by lines. Names are identity, so cards can reference each other as you write them.
4. Fire the research. For each `#research` card, resolve it with a research subagent in parallel where the host allows, each capturing findings into its own decision record.
5. Stop. Charting is one session's work. It hand-resolves nothing else.

### Working the chart

The user invokes with a chart (a path to its TODO.md). A card name is optional; without one, the session picks the next decision, not the user.

1. Load the chart: the low-resolution view, not every record.
2. Choose the card. If the user named one, use it. Otherwise take the first frontier card in TODO order. Claim it: move it to In Progress with your name, commit.
3. Resolve it. Zoom as needed: open any decision record on demand, and consult the skills the Notes section names. For HITL cards, talk to the human; do not simulate them.
4. Record the resolution: write the decision record under `docs/decisions/` (or the effort's directory), move the card to Done with a one-line gist linking the record, and commit.
5. Advance the frontier. Add newly surfaced cards to TODO. Graduate any fog the answer has sharpened, deleting each graduated bullet from Backlog so it lives only as its card. If the answer shows a card sits beyond the destination, rule it out of scope instead of resolving it. If the decision invalidates other cards, update or remove them.

Other sessions may be working the same chart concurrently. Pull first, claim fast, commit often.
