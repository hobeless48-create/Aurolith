# Stage 3 — Full content and balance

**Outcome:** all planned content is selectable, usable and coherent in complete matches. Expand from the Stage 2 fixture through validated data batches, keeping the game playable after each batch.

## Tasks

- [ ] **S3-1 — Import catalog data.** Convert the 80 units, 150 blessings, 25 craftable items, six Divine items, four satchels, 21 regular monsters, three bosses, 18 facilities and 25 command cards into typed records. **Verify:** counts, IDs, references, unlocks and recipes pass validation.
- [ ] **S3-2 — Implement effect families.** Group abilities into reusable, deterministic effect handlers; add special behavior only where the rule truly differs. **Verify:** every content entry declares a supported effect, target and trigger; no entry is silently inert.
- [ ] **S3-3 — Connect artwork and audio.** Inventory existing images, generate runtime atlases where profiling supports them, assign fallback art and add loading/error states. **Verify:** every catalog entry has a usable visual, and missing assets fail visibly in development.
  - [ ] Model the complete 22-tile terrain catalog and its remaining props/obstacles with the two-layer rendering described in the board specification. Stage 1 uses the planned small terrain fixture set.
- [ ] **S3-4 — Check content interactions.** Run fixtures for class diversity, card/blessing stacking, item compatibility, boss rewards, facility upgrades and death/respawn persistence. **Verify:** representative combinations produce expected state changes and no duplicate rewards.
- [ ] **S3-5 — Balance with match data.** Record win rate by seed/side, match length, economy curves, unit pick/use, boss contest and wall-break timing. Change one rule family at a time and replay the same seed set. **Verify:** the changes address a measured outlier without breaking a prior scenario.
- [ ] **S3-6 — Playtest the whole catalog.** Provide focused sessions for each class and each blessing category, then a full match. **Verify:** all planned choices are discoverable and usable; confusing or dominant choices have tracked fixes.

## Your input

Settle the ground-health palette and Divine item grant tier before the full art and content gate. Judge whether units and blessings express the intended strategy and fantasy; I handle conversion, validation and tuning evidence.

## Exit check

Catalog validation is green, all content is reachable under its intended rules, representative cross-system checks pass, and complete local matches remain playable with the full data set.
