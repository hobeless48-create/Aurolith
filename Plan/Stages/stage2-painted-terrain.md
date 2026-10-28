# Stage 2 painted ground materials

Implemented 2026-10-25 at the user's request for illustrated material rather than plain color.

## Assets

Generated five opaque PNG textures using the existing cartoon prop sheet as the style reference. Project assets are in `client/public/assets/fixture/`; original generation outputs remain in the Codex generated-images directory.

| Material | Project filename | Original generated filename |
| --- | --- | --- |
| field | `painted-field-v1.png` | `exec-0676a6f3-a18e-4a17-afbc-3146a9365d3b.png` |
| jungle | `painted-jungle-v1.png` | `exec-f1ce88eb-0e9e-4c65-ab77-403e29d41ba7.png` |
| path | `painted-path-v1.png` | `exec-27c91a08-6397-430e-9817-e1f346ccafbb.png` |
| courtyard | `painted-courtyard-v1.png` | `exec-3e43cf03-6e90-439f-8d08-b22dc6e4b101.png` |
| rampart | `painted-rampart-v1.png` | `exec-29a275b8-96eb-4246-9002-1c84caf18be7.png` |

Field art contains grass blades, clover, dirt patches and flat stones. Jungle adds leaf litter, moss and fine roots. The path uses worn earth and embedded sandstone. Courtyard and rampart use warm limestone and cool capstone masonry respectively. Clearing reuses field art with a distinct light tint.

## Rendering

- Loaded once through Pixi Assets; repeating FillPatterns sit beneath existing prop sprites.
- Repeat scale is 256 world units per source image, normalized by source dimensions.
- Terrain color veils reduced to 5-12% opacity so detail remains visible; fog and hex boundaries stay above the material.
- These assets change presentation only. Decorative props remain passable; brush concealment, movement and structure rules come from the simulation.
- Earlier SVG textures are retained; the live board uses the versioned PNG files.
- Art-direction judgment: readable painted ground with separate prop sprites. Jev selected this with 100% probability, confidence in the judgment rather than a forecast of player preference.

## Verification

- `npm run build` passed shared/client/server type checking and the production build.
- With `AUROLITH_TERRAIN_CAPTURE_PREFIX=stage2-painted-terrain-v1`, `npm run stage2:terrain-review` captured all five regions at 100% zoom without browser page errors. The optional capture prefix preserves earlier evidence.
- Reviewed central field/path, jungle and fortress captures for material detail and fog visibility.
- [Full current UI](stage2-painted-ui-v1.png)
- [Central field and path](stage2-painted-terrain-v1-central-field-path.png)
- [West jungle](stage2-painted-terrain-v1-west-jungle.png)
- [East jungle](stage2-painted-terrain-v1-east-jungle.png)
- [North fortress](stage2-painted-terrain-v1-north-fortress.png)
- [South fortress](stage2-painted-terrain-v1-south-fortress.png)

S2-6 remains open for the user's human match, game feel and HUD/scenery readability review.
