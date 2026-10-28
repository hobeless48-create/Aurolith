# Stage 5 — Replay and polish

**Outcome:** players can understand and revisit a result, and the complete game is usable on the supported PC browsers and target hardware.

## Tasks

- [ ] **S5-1 — Build a reproducible replay.** Store seed, rule/data version, accepted command log and seek snapshots. Add play/pause/scrub controls. **Verify:** replay hashes agree with the live match at checkpoints and at the final result.
- [ ] **S5-2 — Improve action clarity.** Review selection, orders, damage, cooldowns, fog, card targeting, error messages, audio cues and end-of-match statistics. **Verify:** the first-match path is understandable from in-game prompts and can be completed without developer controls.
- [ ] **S5-3 — Check keyboard and accessible UI.** Verify all core DOM actions have focus and keyboard paths, visible labels and readable states; test color-independent health/status cues. **Verify:** a keyboard-only browser test can navigate the menu, recruit, choose blessings and inspect a result.
- [ ] **S5-4 — Measure the complete build.** Profile frame time, memory, texture loading and network queue size in representative crowded fights and full-map camera movement. Fix measured bottlenecks. **Verify:** agreed budgets pass on the chosen PC/browser test set, with the measurement recorded.
- [ ] **S5-5 — Run regression scenarios.** Automate deterministic rule fixtures and browser flows for start, mid-match phase, win, reconnect and replay. **Verify:** prior saved seeds still reproduce or carry a documented versioned rule change.
- [ ] **S5-6 — Freeze a release candidate.** Do a full solo match and full online match on that build; triage all defects by whether they block release. **Verify:** no open issue prevents finishing, understanding or replaying a match.

## Your input

Choose final feel and presentation priorities from the measured and playtested issues. Agree on the target PC/browser set and acceptable performance budget after seeing actual measurements; I implement and remeasure fixes.

## Exit check

Replay is reproducible, accessibility and regression checks pass, performance is measured on target hardware, and the release candidate completes both solo and online matches.
