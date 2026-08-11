---
name: ta-stats
description: >
  Show real token usage and estimated savings for the current session.
  Reads directly from the Claude Code session log — no AI estimation.
  Triggers on /ta-stats. Output is injected by the mode-tracker hook;
  the model itself does not compute the numbers.
disable-model-invocation: true
---

This skill is delivered by `hooks/ta-stats.js` (read by `hooks/ta-mode-tracker.js` on `/ta-stats`). The model does not need to do anything when this skill fires — the UserPromptSubmit hook intercepts the prompt, runs the script, and returns `decision: "block"` with the formatted stats in `systemMessage`, which Claude Code shows to the user directly. The user sees the numbers immediately.

`disable-model-invocation: true` keeps the model from auto-loading this no-op body mid-conversation; the hook, not the skill, does the work.
