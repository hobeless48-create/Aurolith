# Fortress-to-jungle access paths - 2026-10-25

**Current revision - 2026-10-26:** At the user's request, all four branches now stop on the field side of the jungle entrance. Current endpoints are `(30,29)`, `(119,29)`, `(30,60)` and `(119,60)`. Road shoulders are also clipped at columns 30-119; no highway tile enters a jungle zone. Earlier deep-jungle endpoints below are historical. The +10% bonus remains on the approach paths, and normal forest movement resumes at the edge. The user again reports that most functions are usable; exact match results/timed observations are still missing.

## User feedback and chosen change

The user tried the game and said the UI looks good and most functions work. They initially raised the short base-to-base distance relative to map width, then chose faster fortress-to-jungle access paths instead of increasing map height. No exact match result or 5/10/15-minute observations were supplied; S2-6 remains open.

## Implemented

- Four approximately three-hex-wide painted road branches connect the front flank gates of both fortresses to both jungle flanks. North road centerlines are `(59,20)` to `(14,33)` and `(91,20)` to `(135,33)`; southern roads mirror them across the board.
- Existing 150 by 90 map, fortress sizes, front gate ownership, structural walls and cloud boundaries are retained.
- Reuses `highway` terrain and the illustrated path PNG; no new tile category or terrain asset is required. Road strips remove brush concealment but retain their jungle zone and its sight-radius rule.
- Implemented the already-planned +10% path speed, which was previously missing from runtime movement. It applies to the old central highway and new branches, for both teams.
- Shared formation movement reads anchor terrain; detached rallying, Outrider movement and peel movement read the individual unit's current terrain. Other applicable speed/slow effects still combine normally.
- Deterministic A* uses integer travel costs 100 on roads and 110 on ordinary ground, with a 100-per-hex lower-bound heuristic. Routes can choose a faster road where its travel benefit outweighs detour distance.
- Hex inspection identifies the +10% path bonus and floating keyboard help explains it.
- Canonical map specification and TechnicalPlan/02 are updated.
- Jev selected reuse of the +10% highway rule and mirrored front-gate branches with 98% probability. This is confidence in the implementation-direction judgment, not a forecast of player preference.

## Evidence

- **Fresh entrance revision evidence (2026-10-26):** Full suite **171/171 across 17 files** and production build/type checking pass. The revised regressions verify all four field-side endpoints, normal speed in adjacent forest tiles, and the absence of highway terrain throughout both jungle zones. [Current overview screenshot](stage2-jungle-entrances-20261026.png) was captured and inspected in the browser. The five-region captures below belong to the earlier 2026-10-25 route version.

- Full suite: **171/171 tests across 17 files passed** after the change, including the seeded pacing and resource checks.
- Seven new regression cases cover all four owned-gate connections, mirrored placement/closed walls, faster platoon travel and faster detached-unit rallying. Routing keeps over 80% of each tested gate-to-jungle route on roads.
- Production build and shared/client/server type checking passed.
- Five-region terrain capture passed at 100% zoom with no browser page errors. Capture prefix: `stage2-jungle-paths-v1`.
- Reviewed [the full-map overview](stage2-jungle-paths-overview-v1.png) and [west-jungle detail](stage2-jungle-paths-v1-west-jungle.png). New paths also appear on the normal minimap.

The user should review whether +10% feels sufficient and whether the four branch endpoints make jungle rotations clearer. Earlier exact match times are historical; no fresh human match result has been recorded for these paths. The existing HUD interaction-smoke follow-up remains separate outstanding work.
