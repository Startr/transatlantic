# ta-navigate

Plan work too big for one session as a shared chart of decision cards, then resolve them one at a time until the way is clear.

## What it does

Some work arrives as a loose idea wrapped in fog: the destination is real but the route is not visible, and no single agent session can hold the whole journey. Navigation charts that route as a `TODO.md` in the TodoScope convention. Sections are kanban columns, decision cards are checkbox items, the fog lives as loose prose in Backlog, and every resolved decision lands in Done with a one-line gist linking a decision record.

The skill plans; it does not build. Each card resolves one decision (an interview with the human, a research pass, a rough prototype to react to, or a small unblocking task). The chart is done when nothing is left to decide before someone goes and does the thing.

Because the chart is a TODO.md, TodoScope boards it automatically alongside everything else, and several sessions can work the same chart concurrently: claiming a card means moving it to In Progress with your name on it.

## How to invoke

```
/navigate <a loose idea>          # charting: name the destination, lay the cards
/navigate <path to TODO.md>       # working: claim the next card, resolve it, advance
/navigate <path> <card name>      # working: resolve a specific card
```

`/transatlantic:navigate` is the same command through the plugin namespace.

One card per session, research cards excepted. That is the point: the map outlives any one context window.

## See also

- [`SKILL.md`](./SKILL.md) — full LLM-facing instructions
- [Transatlantic README](../../README.md) — repo overview
