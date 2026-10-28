# Stage 0 — Rules and foundation

**Outcome:** a buildable TypeScript project and a traceable, machine-readable rule baseline. This stage prepares implementation; it does not require the full game catalog.

## Tasks

- [x] **S0-1 — Establish repository and scripts.** Create `shared/`, `client/`, `server/` workspaces, strict TypeScript configuration, and `typecheck`, `test`, `build` commands. **Verify:** install, typecheck, test, and build pass locally.
- [x] **S0-2 — Make a rule inventory.** Map each mechanic to its authoritative `Plan/Data` or `Plan/TextPlan` file; mark superseded technical examples. **Verified:** all five Stage 1 tasks have cited entries in `shared/src/rule-inventory.ts`; temporary choices are labeled `fixture`, and source paths are checked by the test suite.
- [x] **S0-3 — Record conflicting rules.** Keep the five conflicts in `TechnicalPlan/14` visible and record their adopted Stage 0 values. **Verified:** Jev-delegated choices are in the conflict ledger and canonical rule files; historical unresolved audit entries are labeled as resolved.
- [x] **S0-4 — Define shared contracts.** Add stable IDs, command types, state schema, seedable RNG, fixed tick and data-validation rules. **Verified:** `shared/src/simulation.ts` and `shared/src/foundation.test.ts` reproduce the same state hash from the same seed and commands, and reject malformed commands or invalid fixture references.
- [x] **S0-5 — Prepare the first art and test fixtures.** Choose a small set of existing unit/terrain images and representative unit, camp, wall and card data. **Verified:** seven unit definitions, a camp, wall and card resolve through `shared/src/fixture.ts`; all 15 selected images decode, match their source bytes, and are present in the production build.

## Your input

The player delegated the opening-army and other documented conflicts to Jev for the Stage 0 baseline. The selected opening is five free starter units in Platoon 1 with 0 starting gold. Creative feedback on the starter units and provisional art can be incorporated after the fixture is playable.

## Exit check

Passed on 2026-10-19: `npm ci`, `npm run build` (includes strict typecheck), and `npm test` (11 tests). The deterministic fixture reproduces; Stage 1 has explicit source or temporary-fixture labels. Stage 1 can now implement the playable loop.
