---
tags: [VisualPrompts, World, Fortress, Commander, Icons, AIImagePrompt]
type: Design Specification
---

# 🌍 06 - WORLD, FORTRESS, COMMANDER & ICON VISUAL PROMPTS

> Follows `00 - Style Guide & Prompt Template.md` — same 6-bullet imagination template, Gilded Empire palette tokens, and global style suffix (World category tip: atmosphere + tile language + colorblind readability).

## 🗺️ Field & Terrain

**Jungle Biome Tile** (Wild Aurum side channel)
- **Subject:** Neutral jungle hex tile from the 30-column × 50-row side channels flanking the central battlefield between two castles; the outer four corners are cloud barriers.
- **Look:** Overgrown sun-dappled soil tangled with emerald vines and alchemical flora, scattered bronze-age ruin shards; tile edges kept slightly darker so hex adjacency reads at a glance.
- **Signature:** Faint tether-leash ring etched into the earth around monster camp spawns — only visible on hover.
- **Palette:** Emerald Green `#00A86B` dominant, Jungle Bronze `#CD7F32` ruin accents, Obsidian `#111116` shadowed soil.
- **Style:** top-down isometric hex tile · stylized fantasy · clean tile-edge silhouette at 32px.
- **Finish:** high-detail · soft golden rim light · game-ready texture · no text.

**Battlefield Center Tile**
- **Subject:** Central 90×90 battlefield hex tile where platoons march, fight, and siege.
- **Look:** Sun-gilded marble flagstone with faint gold-vein inlays, hairline obsidian cracks, and light scorch scuffs from past skirmishes; flat enough to never fight the unit sprite for attention.
- **Signature:** Neutral stone tone chosen to keep cyan range markers, crimson danger, and gold reticles high-contrast on top.
- **Palette:** Sun-Gilded Marble `#F5F5DC` dominant, Imperial Gold `#D4AF37` vein lines, Obsidian `#111116` grout cracks.
- **Style:** top-down isometric hex tile · stylized fantasy · clean silhouette at 32px.
- **Finish:** high-detail · soft ambient occlusion · game-ready texture · no text.

**Courtyard Tile**
- **Subject:** Outer Courtyard (10 rows) and Inner Keep (8 rows) paving within the 48-column castle, directly in front of their wall segments.
- **Look:** Orderly imperial paving in polished marble bands with a repeating gold suncrest mosaic, brass-grated drains and weathered seam lines; reads as "safe ground" behind the walls.
- **Signature:** Mosaic line runs parallel to the wall to reinforce the 6-hex wall-segment rhythm.
- **Palette:** Sun-Gilded Marble `#F5F5DC` dominant, Imperial Gold `#D4AF37` mosaics, Brass Yellow `#E5B80B` grates.
- **Style:** top-down isometric hex tile · stylized fantasy · clean silhouette at 32px.
- **Finish:** high-detail · soft golden rim light · game-ready texture · no text.

**Overall Board Aerial Mood**
- **Subject:** Sweeping 90×150 aerial view of the whole match board in a single establishing image.
- **Look:** Three horizontal bands — emerald jungle strips on both flanks, sun-gilded central battlefield, and the golden segmented fortress band at the south edge with its courtyards and tall keep — under a warm imperial haze.
- **Signature:** Band contrast is the readability rule: jungle vs field vs fortress must be distinguishable even in grayscale.
- **Palette:** Emerald Green `#00A86B` flanks, Sun-Gilded Marble `#F5F5DC` field, Imperial Gold `#D4AF37` fortress, Obsidian `#111116` deep shadows.
- **Style:** isometric 2.5D strategy-map panorama · stylized fantasy · readable band silhouette at thumbnail size.
- **Finish:** high-detail · warm golden rim light · soft atmospheric haze · game-ready texture · no text.

## 🏰 Fortress & Walls

**Outer Wall Segment** (6-hex-wide, 3,000 HP)
- **Subject:** One 6-hex-wide segment of the segmented outer wall, standing as a raised battlement with a walkable top.
- **Look:** **Intact** — clean gold stone blocks with an Imperial Suncrest relief and crenellations; **damaged** — crack overlays, scorch marks, and chipped crenellations on the same body; **destroyed** — collapsed gold-stone rubble heap that cleans up in 10s.
- **Signature:** Intact top grants the +1 Hex elevation high-ground feel — visible parapet that ranged units stand on; destroyed state has no parapet at all.
- **Palette:** Imperial Gold `#D4AF37` stone dominant, Polished Steel `#E0E0E0` trims, Obsidian `#111116` scorch, Crimson `#FF4444` breach marker accents.
- **Style:** isometric 2.5D structure · stylized fantasy · clean silhouette readable at 64px.
- **Finish:** high-detail · soft golden rim light · game-ready texture · no text.

**Inner Keep / Castle Core** (4,500 HP)
- **Subject:** The towering core keep behind the inner wall — the final objective of the fortress.
- **Look:** Tall central keep with layered golden ramparts, brass gear housings, alchemical mintage crucibles, and a radiant Imperial Suncrest on the crown; heavier and grander than any wall segment.
- **Signature:** Suncrest window glows brighter as the keep loses HP, then darkens to obsidian as it nears collapse.
- **Palette:** Imperial Gold `#D4AF37` dominant, Brass Yellow `#E5B80B` machinery, Sun-Gilded Marble `#F5F5DC` face, Obsidian `#111116` mortar lines.
- **Style:** isometric 2.5D fortress · stylized fantasy · clean silhouette readable at 96px.
- **Finish:** high-detail · strong golden rim light · game-ready texture · no text.

**Fortress Shroud / Fog-of-War Veil**
- **Subject:** The animated fog overlay that masks unexplored board areas (renders above the world, below UI).
- **Look:** Slowly roiling obsidian mist flecked with faint drifting gold-dust motes; unexplored regions opaque, revealed regions punched through with soft-edged holes so the world behind stays readable.
- **Signature:** Edges feather inward from the walls so your own courtyards are never fully obscured — friendly home ground always half-visible.
- **Palette:** Obsidian `#111116` dominant, Imperial Gold `#D4AF37` motes, Dark Violet `#8A2BE2` deepest shadow pockets.
- **Style:** 2.5D animated overlay · stylized fantasy · soft non-banding edges at 64px.
- **Finish:** high-detail · subtle golden rim light · low-alpha game texture · no text.

## 🧑✈️ Commander

**High Imperial Commander**
- **Subject:** The player's field avatar — a High Imperial Commander leader unit who directs platoons from an elevated command vantage on the 90×150 board.
- **Look:** Broad-shouldered sun-forged golden plate with lion pauldrons, crimson cloak trim, and a laurel-crested great helm with an obsidian visor slit; regal bearing that reads as "commander" even as a 64px sprite.
- **Gear:** Gold-embroidered command banner on a war-spear (marks his vantage point) and a suncrest signet on the gauntlet.
- **Palette:** Imperial Gold `#D4AF37` primary, Crimson `#FF4444` trim, Obsidian `#111116` under-armor, Sun-Gilded Marble `#F5F5DC` cloak lining.
- **Style:** isometric 2.5D game sprite · stylized fantasy · clean silhouette readable at 64px.
- **Finish:** high-detail · soft golden rim light · game-ready texture · no text.

## 🏷️ Trait Icons

**Trait Tier Icon — Transcendence** (highest tier)
- **Subject:** 64×64 emblem for the Transcendence trait tier — the "beyond mortal" rank.
- **Look:** Radiant golden sunburst halo cradling twin ascending wings with a single tiny all-seeing eye at the center; symmetrical, monumental.
- **Gear:** The emblem device itself — engraved on a gilded medallion with a radiant outer ring.
- **Palette:** Imperial Gold `#D4AF37` dominant, white-gold light `#FFF3C4` highlights, Obsidian `#111116` ring gap.
- **Style:** flat emblem icon · stylized fantasy · clean silhouette readable at 24px.
- **Finish:** high-detail · soft golden rim light · game-ready texture · no text.

**Trait Tier Icon — Genius**
- **Subject:** 64×64 emblem for the Genius trait tier — exceptional intellect and foresight.
- **Look:** Obsidian gear wheel fused with an arcane cyan lightning sigil that doubles as an open-book spine; a single spark at the hub where metal meets magic.
- **Gear:** The emblem device itself — an enameled gear-badge worn on the shoulder.
- **Palette:** Arcane Cyan `#00E5FF` dominant, Obsidian `#111116` gears, Polished Steel `#E0E0E0` rim.
- **Style:** flat emblem icon · stylized fantasy · clean silhouette readable at 24px.
- **Finish:** high-detail · soft cyan glow rim · game-ready texture · no text.

**Trait Tier Icon — Perfect**
- **Subject:** 64×64 emblem for the Perfect trait tier — flawless execution in every detail.
- **Look:** A flawless golden laurel wreath wrapped around a perfect circle seal, every petal identical and evenly spaced; no chips, no asymmetry.
- **Gear:** The emblem device itself — a chased-gold roundel set into armor.
- **Palette:** Imperial Gold `#D4AF37` dominant, Sun-Gilded Marble `#F5F5DC` seal face, Emerald Green `#00A86B` leaf veins.
- **Style:** flat emblem icon · stylized fantasy · clean silhouette readable at 24px.
- **Finish:** high-detail · soft golden rim light · game-ready texture · no text.

**Trait Tier Icon — Extra**
- **Subject:** 64×64 emblem for the Extra trait tier — above average, one step beyond.
- **Look:** A double chevron stack with a small sunburst-orange spark bursting at the top point; upward momentum implied.
- **Gear:** The emblem device itself — a brass-and-steel rank chevron.
- **Palette:** Brass Yellow `#E5B80B` dominant, Sunburst Orange `#FF8C00` spark, Polished Steel `#E0E0E0` chevrons.
- **Style:** flat emblem icon · stylized fantasy · clean silhouette readable at 24px.
- **Finish:** high-detail · soft warm rim light · game-ready texture · no text.

**Trait Tier Icon — Ordinary**
- **Subject:** 64×64 emblem for the Ordinary trait tier — the baseline rank everyone starts from.
- **Look:** A plain bronze hex coin token with a single unadorned notch; deliberately dull surface, no shine, no ornament.
- **Gear:** The emblem device itself — a simple stamped bronze coin.
- **Palette:** Jungle Bronze `#CD7F32` dominant, Obsidian `#111116` stamp shadows, no secondary accent.
- **Style:** flat emblem icon · stylized fantasy · clean silhouette readable at 24px.
- **Finish:** flat game-art shading · matte surface · game-ready texture · no text.

## 🖼️ UI & Portrait Elements

**Unit Portrait Style**
- **Subject:** 64px class-art portrait used in the Roster Panel rows, graveyard queue, and card targets.
- **Look:** Chest-up bust with the class accent (armor, cloak, weapon hint) over a soft class-token backdrop; full color only while the signature ability is ready, grayscale in a 150ms tween on cooldown, near-black silhouette when dead.
- **Gear:** Thin imperial-gold hairline frame; class icon chip in the corner.
- **Palette:** Imperial Gold `#D4AF37` frame dominant, class token secondary, Obsidian `#111116` dead-state.
- **Style:** flat 2D portrait · stylized fantasy · clean silhouette readable at 48px.
- **Finish:** high-detail · soft golden rim light · game-ready texture · no text.

**HP Bar Color Zones**
- **Subject:** Live health bar shown above units in-world and on roster rows.
- **Look:** Smoothly transitioning bar — Green `#00A86B` above 60%, Yellow (brass `#E5B80B`) 30–60%, Red `#FF4444` below 30% — with a 0.1s white damage flash on every hit.
- **Signature:** Thin white shield bar stacked underneath shows temporary shields (Mantle of Dawn, Dawn Ward) on top of base HP.
- **Palette:** Emerald Green `#00A86B` → Brass Yellow `#E5B80B` → Crimson Red `#FF4444`, Polished Steel `#E0E0E0` shield overlay.
- **Style:** flat 2D UI bar · stylized fantasy · readable at 8px width.
- **Finish:** high-contrast flat colors · no texture noise · no text.

**Ready-Ring Indicator**
- **Subject:** Small radial ring on the portrait corner showing signature-ability readiness.
- **Look:** Filled gold ring + glow = ability ready (portrait is color); empty ring + grayscale portrait = on cooldown; a thin arc sweeps the ring to show remaining cooldown progress.
- **Signature:** Ring fills in real time; completing the ring triggers a 0.3s glow pulse and soft "ready" chime.
- **Palette:** Imperial Gold `#D4AF37` ready state, Obsidian `#111116` empty state.
- **Style:** flat 2D UI ring · stylized fantasy · readable at 16px diameter.
- **Finish:** crisp anti-aliased edges · high-contrast · no text.

**Tier Tint Ring**
- **Subject:** Aura ring under a unit's base marking equipped-item quality (item-bearing units only).
- **Look:** Common — no ring; Rare — steady blue ring; Epic — purple ring; Ancient — pulsing gold ring; Divine — persistent radiant halo around the carrier.
- **Signature:** Ring sits flat under the sprite base so it never occludes the unit silhouette.
- **Palette:** Polished Steel blue `#4A90E2` · Dark Violet `#8A2BE2` · Imperial Gold `#D4AF37` pulsing · radiant white-gold `#FFF3C4`.
- **Style:** flat 2D ground decal · stylized fantasy · readable at 64px.
- **Finish:** soft glow edges · game-ready texture · no text.

**Platoon Pennant**
- **Subject:** Small gold pennant floating above the platoon-leader unit's HP bar.
- **Look:** Tiny triangular gold-embroidered banner with a suncrest dot, gently waving on a short pole; distinguishes the leader from the rest of the 3–6 unit platoon.
- **Signature:** Selected unit keeps the standard gold reticle underneath — pennant and reticle never visually conflict.
- **Palette:** Imperial Gold `#D4AF37` dominant, Crimson `#FF4444` trim edge.
- **Style:** flat 2D UI prop · stylized fantasy · readable at 16px height.
- **Finish:** clean pixel art shading · subtle sway animation · no text.

**Minimap Icon Set** (3:5 minimap, 180×300px)
- **Subject:** The complete minimap symbol family for the 90×150 board.
- **Look:** Unit dot — gold circle for friendly, crimson circle for enemy; monster camp — emerald claw-paw mark; facility — brass gear square; wall segment — gold horizontal bar matching each 6-hex segment.
- **Signature:** Shapes differ by silhouette AND color so they read in grayscale (colorblind rule).
- **Palette:** Imperial Gold `#D4AF37` · Crimson Red `#FF4444` · Emerald Green `#00A86B` · Brass Yellow `#E5B80B`.
- **Style:** flat 2D minimap glyphs · stylized fantasy · readable at 4–8px.
- **Finish:** crisp 1px outlines · high contrast · no text.

## ✨ VFX & Particles

**Gold-Dust Death Dissolve**
- **Subject:** The death state where a unit's corpse dissolves into swirling gold dust, leaving scorched armor scraps.
- **Look:** The sprite erupts into a slow spiral of imperial-gold dust motes that rise and scatter (~0.8s), leaving a few charred armor shards that fade; fully particle-driven from the 150-particle pool, no baked frames.
- **Signature:** One signature burst of brighter gold at the start, then a lazy upward drift — readable as "dead" even mid-battle.
- **Palette:** Imperial Gold `#D4AF37` motes, Sunburst Orange `#FF8C00` ember specks, Obsidian `#111116` scorched scraps.
- **Style:** 2.5D particle effect · stylized fantasy · readable at 64px.
- **Finish:** soft additive glow · gentle falloff · no text.

**Ability Cast Glow**
- **Subject:** The telegraphed wind-up glow when a unit's signature ability is about to fire.
- **Look:** A gathering bloom of light around the caster — arcane cyan for magic, gold for war-cries, emerald for heals — that snaps to full color at the exact release frame (mirrors the portrait monochrome→color moment).
- **Signature:** Wind-up ring shrinks toward the caster for 0.3s as a dodge/counter-read window, then detonates outward.
- **Palette:** Arcane Cyan `#00E5FF` · Imperial Gold `#D4AF37` · Emerald Green `#00A86B` per cast type.
- **Style:** 2.5D particle effect · stylized fantasy · soft bloom.
- **Finish:** additive blending · soft golden rim light · no text.

**Explosion Burst**
- **Subject:** Big demolition burst for siege strikes, Wallcrusher hits, and heavy facilities.
- **Look:** Sunburst-orange fireball with a brass-yellow core, an obsidian smoke ring that billows outward, and a brief screen shake; highest-priority voice in the pool.
- **Signature:** Frame 1 flash > expanding fireball > smoke ring — three beats that read instantly as "siege damage".
- **Palette:** Sunburst Orange `#FF8C00` fire, Brass Yellow `#E5B80B` core, Obsidian `#111116` smoke, Crimson `#FF4444` flash edge.
- **Style:** 2.5D particle effect · stylized fantasy · chunky readable silhouette.
- **Finish:** high-contrast fire sprite · soft smoke falloff · no text.

**Trap Detonation**
- **Subject:** Hidden-trap trigger burst that reveals a Dark Violet danger pulse on the hex.
- **Look:** A dark violet pulse ring expands from the hex with a thin crimson warning flash on frame 1, then settles into thin violet smoke wisps; invisible until triggered.
- **Signature:** One-frame crimson flash is the player-readable cue, even at screen edge.
- **Palette:** Dark Violet `#8A2BE2` dominant, Crimson Red `#FF4444` flash, Obsidian `#111116` smoke.
- **Style:** 2.5D particle effect · stylized fantasy · fast 0.4s lifetime.
- **Finish:** additive violet glow · crisp flash frame · no text.

**Projectile Trails**
- **Subject:** Trails for every ranged projectile class so attack origin is always trackable.
- **Look:** Class-colored streaks — emerald arrow lines for marksmen, arcane cyan bolt trails for mages, sunburst-orange arcing shells for siege mortars — with a fading taper.
- **Signature:** Trajectory arc reads before impact, letting players read cross-board fire without parsing sprites.
- **Palette:** Emerald Green `#00A86B` · Arcane Cyan `#00E5FF` · Sunburst Orange `#FF8C00`.
- **Style:** 2.5D particle trail · stylized fantasy · thin bright streaks.
- **Finish:** additive glow · smooth taper · no text.

**Revive Reassembly**
- **Subject:** The gold-light reassembly used by Undying Legion / The Undying Host revivals.
- **Look:** Gold-light motes spiral inward around the corpse shards, body silhouettes back together from feet to head, finishing with a soft emerald sparkle and a gentle ring pulse.
- **Signature:** Spiral direction and sparkle color distinguish revive (inward, green-gold) from death dissolve (outward, plain gold).
- **Palette:** Imperial Gold `#D4AF37` motes, Emerald Green `#00A86B` finish sparkle, white-gold `#FFF3C4` core glow.
- **Style:** 2.5D particle effect · stylized fantasy · readable at 64px.
- **Finish:** soft additive glow · clean reassembly timing · no text.
