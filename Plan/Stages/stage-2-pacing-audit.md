# Stage 2 pacing and resource audit

**2026-10-26 late-game continuation:** The ordinary-HUD defensive scenario now supplies exact automated 5:00/10:00/15:00/18:00 checkpoint evidence, including active overtime at 15:00 and a wall-damage defeat at 18:00. No balance overrides were used. This does not establish human pacing acceptance. [Detailed record](stage2-late-game-2026-10-26.md). Earlier exact times below remain historical.


Measured on 2026-10-21 with `shared/src/pacing.test.ts`. Times are simulation time (10 ticks per second). Gold pairs are north / south. All three active matches used the fixture bot on both sides, submitted no rejected commands, and ended by Core collapse. Checkpoint states passed `validateMatchState`.

| Seed | 5:00 gold | 10:00 gold | Result time | 15:00 reached? |
| --- | ---: | ---: | ---: | --- |
| 1 | 5,710 / 6,329.6 | 10,730 / 12,154.6 | 11:10.6 | No |
| 2 | 6,009.8 / 5,466 | 11,924.7 / 10,591.1 | 10:03.2 | No |
| 42 | 5,710 / 5,579.85 | 10,630 / 10,979.85 | 11:10.6 | No |

At 5:00 each bot had seven champions, three facilities, one blessing and no wall damage. At 10:00 each had two blessings and had damaged enemy walls. The fixture pool has only two paid champions beyond the five starters, and the current bot builds only three of its six facility slots. This explains much of the large unspent bank; it is a fixture and bot decision issue, not evidence that the full 40-champion economy is balanced. No active seeded match reached 15:00, so these runs cannot verify late strategic choices or overtime combat pacing.

An unattended seed-7 match reached the 18:00 draw. Its 5:00, 10:00, 15:00 and 18:00 states passed validation; the passive resource test checks normal income immediately before overtime, boosted income immediately after it begins, and the final 18:00 tick. This exposed and fixed an income boundary: the terminal tick previously used the normal rate after the phase became `ended`; it now pays the overtime rate before result resolution. The 18:00 check includes the selected Courier Contract's scheduled 40g payment.

The per-tick `economyEvents` ledger now records gold, commander XP, materials, arsenal and relic changes across passive income, facility completion, automatic blessing, accepted commands, combat, camps, bosses, structures and items. `shared/src/pacing.test.ts` reconciles the event totals against state changes for active seeds 1, 2 and 42 and unattended seed 7. Item tests also check Bazaar purchase and terminal crafting entries. The full test suite passed 102/102 and type checking passed after this edit; build and browser smoke have not been rerun since the ledger change.

Still required for S2-6: manually finish a human-versus-bot match; inspect actual player choices and HUD load at 5:00, 10:00 and 15:00 in a match that survives that long; review whether the resource rates and purchases make sense in play; check for stranded platoons and blocked end states under those conditions.

## Current S2-6 action — 2026-10-24

Avoid balance tuning just to force 15-minute matches until the human run supplies pacing evidence. Existing active matches use a restricted fixture roster and fixture bot that builds only part of the available facilities, so early Core-collapse times do not isolate human game feel or prove the full economy needs retuning. Jev selected **observe first** over tuning to force 15-minute matches (selected-choice probability: 100%; confidence in this judgment, not a future-outcome probability). In the human run, record the exact result time if the match ends early; if it remains active, capture the state and player decisions at 15:00. Use `stage2-human-playtest.md` and leave S2-6 open until those observations are recorded.

**Pause update (2026-10-24):** The user has deferred this playtest until they ask to resume. No human data is available yet; the observation plan above remains the next S2-6 action.

## Current map and UI recheck — 2026-10-24

The map now treats tree, canopy, fence and boulder props as passable scenery that does not block sight. After this rule change, `npm test -- --maxWorkers=1` passed 164/164 across 16 files; the built-in `pacing.test.ts` still verified that active fixture-bot seeds end after 10:00 and before 15:00, while unattended seed 7 reaches the 18:00 result. The current UI player-vs-bot playthrough ended by enemy Core collapse at 8:48. These machine runs do not supply a human's strategy, HUD readability or game-feel assessment at 5:00, 10:00 and 15:00; S2-6 remains open for that evidence.
