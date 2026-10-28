# Stage 2 late-game browser evidence - 2026-10-26

## Scope

`scripts/stage2-defensive-pacing.mjs` uses ordinary HUD recruitment, training, facilities and Defensive hold orders. It commits investment commands at 4x and waits between checkpoints at 24x. It does not override simulation state, health, resources or balance rules. Jev selected this ordinary-HUD scenario with 100% confidence in that judgment; this is not a prediction of match outcomes.

## Observed result

The corrected scenario passed without browser page errors. The DOM observer recorded:

| Clock | State | Own Core | Gold | Commander XP |
| --- | --- | --- | --- | --- |
| 5:00 | Active, expansion | 4500 | 320 | 3000 |
| 10:00 | Active, siege | 4500 | 4298 | 6004 |
| 15:00 | Active, overtime | 4500 | 12750 | 9004 |
| 18:00 | Ended, defeat by wall damage | 4500 | 18714 | 10800 |

Three automatic/selected blessings are listed at 15:00. All six facilities reached T3, and the nine recruited units reached L3. The screenshot was taken at **15:24**, separately from the exact 15:00 DOM observation. The result shows that a match can remain active into overtime using existing rules; it does not establish satisfactory balance, strategy or economy. High unused resources in this deliberately defensive scenario warrant human review rather than automatic tuning.

- [Raw action and checkpoint record](stage2-defensive-pacing-final-20261026.json)
- [Overtime screenshot, 15:24](stage2-defensive-pacing-final-20261026-15m.png)
- [18:00 result](stage2-defensive-pacing-final-20261026-result.png)

## Facility HUD correction

An earlier attempt wrongly assumed three facilities per kind. The actual shared rule allows three **combat** and three **production** facilities. Its attempted fourth combat facility was rejected with "Facility category is full". The failed attempt is retained in `stage2-defensive-pacing-20261026-error.json` and its screenshot; it is not passing evidence.

The client now displays Combat/Production counts and disables Build with a reason for an occupied slot, uncleared rubble, an invalid Arcane Barrier location or a full category. It uses the shared `facilityCategory` helper. The scenario now builds two Ballistas, one Arcane Barrier and three Caravans. No facility rules changed.

## Remaining acceptance

Validation after the HUD correction: production build and shared/client/server type checking passed. The expanded browser smoke passed, including three completed combat facilities, a disabled fourth combat build with a category-full explanation, and an enabled production choice in the same empty slot. Existing help/shortcuts, roster, tactics, recruitment/training, crafting/equipment, orders and reset also passed. Capture prefix: `stage2-category-hud-20261026`. The prior shared regression remains 171/171 across 17 files; it was not rerun for this client-only correction.

S2-1 through S2-5 remain accepted for the defined fixture scope. S2-6 and the Stage 2 exit remain open. The user's report establishes that most functions work, but explicitly does not assess balance and says subtle skills/stun were unclear with the earlier presentation. Character portraits and status/cast labels now await their review. Exact human result/time, game feel, meaningful strategic choices, resource clarity, stranded-unit observations and 5/10/15-minute pacing notes remain unrecorded. Keep the human observation sheet blank where no observations were supplied; this automated record belongs here instead.
