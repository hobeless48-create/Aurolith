---
tags: [TechnicalPlan, Roadmap, Authority, DecisionLog, Jev]
type: Technical Specification
---

# 14 - IMPLEMENTATION ROADMAP, AUTHORITY AND DECISION LOG

> Revised 2026-10-19. This is the entry point for implementation. Aurolith is a PC browser RTS/deckbuilder built with strict TypeScript, Vite, PixiJS v8 WebGL, DOM information panels and a shared deterministic simulation. The design remains the source of game rules; this document selects a delivery order and records engineering decisions.

## Rule authority

1. `Plan/Data/` is authoritative for blessings, items, units, monsters, facilities and economy. Consult the relevant file before coding a rule; do not infer rules from UI mockups or old code examples.
2. `Plan/TextPlan/01 - Core Rules & Mechanics/` governs board dimensions, fog, walls and match timeline. `Plan/TextPlan/05 - Command Cards/` governs cards.
3. `Plan/TechnicalPlan/00–13` describes implementation. Where it conflicts with the above, fix the technical file rather than changing a game rule silently.
4. `Structure.md` is a historical exhaustive file inventory. It is **not** a requirement to create every listed class before playtesting. The package ownership map below governs new code.

Board layout revision: `Board & Map Grid.md` §2 now defines 150 × 90 with centered 48 × 20 north/south castles spanning columns 51–98, 30 × 50 jungle flanks, a 90 × 50 central battlefield, and four enlarged blocked cloud corners. Older 90-column and 61-column castle geometry in technical examples is superseded. The defended sight is the home castle plus ten rows forward and ten columns to either side of that front strip.

## Package ownership

```text
Aurolith/
  shared/   # pure rules, typed commands, data schemas, seeded RNG, fixed-tick sim, tests
  client/   # Vite app; PixiJS world, DOM HUD, inputs, local transport, assets
  server/   # Node rooms, command validation, authoritative tick, player views, reconnect
  Plan/     # design and engineering source documents
  Assets/   # source art; client/public contains generated runtime assets
```

No `shared/` module may import browser, PixiJS or server APIs. Renderers consume `PlayerViewState`; they do not own game rules. Both local and online transports submit the same typed commands. Keep modules sized by actual behavior rather than the one-file-per-noun inventory in `Structure.md`.

## Delivery stages and exit criteria

| Stage | Deliverable | Exit criteria |
|---|---|---|
| 0. Rule baseline | Canonical data IDs, conflict ledger, seed and command format | Open rules are marked; a data validator catches duplicate IDs and invalid references. |
| 1. Playable vertical slice | One local human-vs-bot match on a representative hex board with two platoons, a recruit action, one camp, one wall breach and a win condition | A player can start, issue orders, finish, restart and inspect a deterministic state hash; no network required. |
| 2. Core match | Full 150×90 board, four platoons, fog, phase clock, shops, cards, blessings, facilities and bosses | Each canonical rule has at least one behavior-level check; complete 18-minute bot matches finish without stuck units or skipped timed events. |
| 3. Content expansion | 80-unit roster, 150 blessings, item and monster catalogs, art/audio pipeline | Data validation passes; representative interactions are playtested; assets load within a measured budget. |
| 4. Online 1v1 | Authoritative Node rooms, per-player views, reconnect and command validation | Hidden data does not cross the network; delayed clients resync; duplicate commands are harmless. |
| 5. Replay and polish | Command-log replay, seek snapshots, accessibility, performance tuning | State hashes reproduce; replay seek agrees with live result; measured frame-time, memory and network targets pass on chosen hardware. |
| 6. Release and support | Versioned browser deployment, live smoke checks and patch process | Public solo and online matches complete; replay opens; failures can be diagnosed and repaired. |

Stage 1 uses a small representative board for faster testing; it must retain the same coordinate and simulation model as the full board. The 150×90 layout remains the target. Stage 2 reaches feature completeness with a small validated content subset before Stage 3 fills every catalog. Do not claim a fixed 60 FPS, `<50` draw calls, one-draw-call chroma, or a particular server capacity until a profiling run supports it.

The executable stage process, task lists and owner handoffs are in [`Plan/Stages/build-process.md`](../Stages/build-process.md). Stage 6 was added for deployment and early support (Jev: **yes, 91%**).

The stage-process choices were checked with Jev: exit gates **yes 62%**; decide open rules when dependent work arrives **yes 60%**; local slice playtest **yes 72%**; core systems before full catalogs **yes 83%**; online after validated local content **yes 84%**; agent-run verification with user creative direction **yes 75%**; solo/online/replay release gates **yes 69%**. Percentages are confidence in these judgments, not completion probabilities.

## Source-rule conflicts resolved for the Stage 0 baseline

| Issue | Conflicting sources | Adopted rule and reason |
|---|---|---|
| Match opening army | `Data/BlessingList/00` specifies five free starters; `Data/Economy/02` formerly said one 60g first hire. | **Five free starters in Platoon 1, 0 starting gold.** First paid hire follows passive income. Jev chose five starters **79%** and zero gold **96%**; preserves starter-dependent blessings and a clean recruit baseline. |
| Exact 18:00 tie | `TextPlan/01/Match Timeline & Phases` compares cumulative wall-layer damage but lacked an equal-total outcome. | **Remaining core HP breaks equal wall damage; exact equality after that is a draw.** Jev chose core HP **70%**. |
| Monster stat baseline | `Data/Monster/00` §2 gave 1,300/2,200/3,800 HP; §3 formerly repeated 1,450 HP. | **Use variant-tier HP 1,300/2,200/3,800.** Jev chose it **52%**; this close call was reviewed against §2's explicit kill-time calibration. Named §3 tables now match HP; family-specific defenses and abilities remain. |
| Ground-hex health palette | `TextPlan/01/Board & Map Grid` and `TechnicalPlan/08` used gold/amber/red; `TextPlan/08/UI HUD Layout & Color Palette Specification` used green/yellow/red. | **Green/yellow/red.** Jev chose it **76%**; the board and render documents now match the HUD tokens. |
| Divine item grant tier and cap | `Data/ItemList/00` summaries said Transcendence only, while §5.5 and named Goddess blessings granted Divine items; a one-item army cap conflicted with a two-item blessing. | **Explicit condition-gated Goddess blessings grant Divine items; one copy of each named Divine item per army.** Jev chose Goddess sources **85%** and distinct-item cap **86%**. Summary and uniqueness rules now match named effects. |

## Platform decision: PC web browser first

The platform question was decided in the prior session **"Choose a platform for Aurolith"** (2026-10-19). I re-read that session on 2026-10-22: the user asked which target best fit the existing design and a workflow where they steer ideas while Codex does most of the implementation. The selected target is a **PC web browser game** for mouse and keyboard, built with TypeScript, Vite and PixiJS. This matches the PC RTS/deckbuilder design and existing client architecture, and makes each build directly playable for review. Jev selected browser with **100% confidence** in the original session and again on 2026-10-22; these percentages describe confidence in the platform judgment, not a forecast of project success.

Stage 2 acceptance is a complete local solo match in the browser using the shared deterministic simulation and DOM/PixiJS client. Stage 2 must be playable through ordinary player-facing controls and produce a visible match result; automation can verify repeatability, while the user reviews game feel. Online authority and WebSocket deployment follow in the online stage. Native desktop packaging is not part of the current target. Revisit the platform only if the product target changes from PC web.

## Engineering decision log with Jev

Jev percentages below are **confidence in the stated judgment on the supplied project context**, not the probability that the game will succeed or that a future performance target will be met. Low-confidence calls were reviewed against the source documents. The exact Jev result is recorded even where the rule authority overrode it.

| Proposed decision | Jev judgment | Plan decision and reason |
|---|---:|---|
| PC web browser over Unity/Godot for the current product target | Browser 100% (original session and 2026-10-22 recheck) | Adopt; the original platform session explicitly tied PC browser delivery to the existing PC RTS design and the user's idea-led, Codex-implemented workflow with direct playable review. Keep TypeScript, Vite, PixiJS WebGL and Node WebSocket for the planned client/server architecture. Stage 2 remains a complete local browser match; online server delivery follows later. PixiJS recommends WebGL for production ([renderer guide](https://pixijs.com/8.x/guides/components/renderers)). |
| Build a playable local vertical slice first | Yes 59% | Adopt as delivery order; reduces integration risk before the full content catalog. |
| Share deterministic simulation now; add online transport later | Yes 70% | Adopt; both modes use one rule implementation. |
| Replace flat `src/` ownership with `shared/client/server` | Yes 68% | Adopt for new code; retain `Structure.md` as an inventory. |
| Use six hand slots and 15-second overflow; remove permanent Crown slot | Yes 63% | Adopt because `TextPlan/05` explicitly defines it. |
| Use three blessing options and one reroll per match | **No 60%** | Override Jev: `Data/BlessingList/00` is explicit authority. The old technical value of four is corrected. |
| Derive match time from fixed sim ticks; server owns online clock | Yes 81% | Adopt; avoids browser tab scheduling controlling online results. |
| Redact fog and private state before sending player snapshots | Yes 85% | Adopt; client-only hiding would leak competitive information. |
| Use command log, seed and snapshots for full replay | Yes 53% | Adopt as later-stage replay design; keep a bounded telemetry buffer only for diagnostics. |
| Treat draw-call and FPS claims as measured budgets | Yes 70% | Adopt; exact draw calls depend on build and hardware. |
| Use cumulative wall damage for 18:00 tie-break | **No 56%** | Override Jev: `TextPlan/01/Match Timeline & Phases` defines this rule; the old technical tiebreak list is removed. |
| Mark five free starters versus one 60g hire as unresolved | Yes 88% | Historical audit result; resolved for Stage 0 above as five free starters and 0g. |
| Use DOM for information panels and PixiJS for the battlefield | Yes 69% | Adopt; the DOM supports text-heavy panels and controls, while PixiJS renders the world. |
| Bound or coalesce state updates for slow clients | Yes 89% | Adopt; browser WebSocket has no built-in backpressure ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)). |
| Remove zero-desync and perfect-smoothness claims from interpolation | Yes 89% | Adopt; interpolation is visual and must respond to corrections and visibility changes. |
| Give hand slot six `U` while keeping `G` for Gather | **U 98%** | Adopt; preserves the existing movement binding and six direct card keys. |
| Cap contested monster damage credit at remaining HP | Yes 80% | Adopt; an overkill hit must not distort the majority threshold. |
| Auto-pause local single-player when the page is hidden | Yes 75% | Adopt; prevents background timer throttling from leaving a large simulation backlog. |
| Resolve Aggressive pursuit range as a fixed 12-hex scan from the platoon anchor | Detailed rule 99%; glossary rule 1% | Adopt the explicit TechnicalPlan/03 rule: scan valid, visible/detectable reachable targets within 12 hexes; select nearest by distance then unit ID, route to an adjacent engagement hex. Update Glossary §8.2 and test the 12/13 boundary. The old "one hex beyond the command position" phrase did not define its origin or range and conflicted with the detailed rule and implementation. |
| Mark ground-hex health colors unresolved | Yes 79% | Historical audit result; resolved for Stage 0 above as green/yellow/red. |
| Mark variant versus named-monster HP unresolved | Yes 79% | Historical audit result; resolved for Stage 0 above as 1,300/2,200/3,800 HP. |
| Mark exact equal-wall-damage outcome unresolved | Yes 84% | Historical audit result; resolved for Stage 0 above with core HP, then a draw. |
| Mark the Divine item grant tier unresolved | Yes 87% | Historical audit result; resolved for Stage 0 above with explicit Goddess conditions. |
| Count items as 25 craftables, six Divine and four satchels | Yes 73% | Adopt; categories come directly from `Data/ItemList/00`, replacing the stale 29-item dashboard total. |
| Run phase events before commands stamped for the same tick | **Scheduled first 94%** | Adopt; phase unlocks are active for commands at their boundary tick. |

## Verification checklist for document changes

- `04`, `09` and `12` use six hand slots with overflow; no permanent Crown slot.
- `06` uses three Rite choices, one match-wide reroll and the core-rule 18:00 tiebreak.
- `06` and `13` assign online time and simulation to the server; local mode uses the same rules.
- `13` filters hidden information before transmission and includes reconnect/backpressure behavior.
- `00`, `12`, `13` and this file agree on the package split and delivery order.
