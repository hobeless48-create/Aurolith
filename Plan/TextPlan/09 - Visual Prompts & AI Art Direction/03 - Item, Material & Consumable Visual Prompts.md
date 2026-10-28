---
tags: [VisualPrompts, Items, Materials, Consumables, AIImagePrompt]
type: Design Specification
---

# ⚔️ 03 - ITEM, MATERIAL & CONSUMABLE VISUAL PROMPTS

> This file follows `00 - Style Guide & Prompt Template.md` — same 6-line imagination template, palette tokens and quality bar. Items render as a **64×64 inventory icon AND a worn model on a unit**; materials as **64×64 resource icon stacks**; consumables as single-use **64×64 potion/throwable icons**.

---

## 🧪 Materials (7)

> All materials drop exclusively from their jungle monster family and come in Common / Rare / Epic quality (set by the dropping monster variant). Rarity never creates new items — it sets the crafted item's quality tier.

**Gilded Ore**
- **Subject:** Raw jungle iron-gold ore, the physical-power (+ATK) base material dropped by Ironhide Boars.
- **Look:** A 64×64 resource icon stack of rough golden ore chunks, dull on the outside with a faint imperial-gold glint on fresh breaks.
- **Rarity:** Stack renders with the dropped quality tint — Common (no tint) / Rare (blue) / Epic (purple) — each chunk scaling slightly larger with rarity.
- **Palette:** Imperial Gold `#D4AF37`, Obsidian Dark `#111116`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Arcane Crystal**
- **Subject:** A sharp cyan crystal, the magic-power (+AP) base material dropped by Verdant Wyrms.
- **Look:** A 64×64 resource icon cluster of jagged crystals with a soft arcane-cyan glow deep inside, facets catching light.
- **Rarity:** Cluster tint signals quality — Common (no tint) / Rare (blue) / Epic (purple) — brighter core glow and sharper facets as rarity rises.
- **Palette:** Arcane Cyan `#00E5FF`, Obsidian Dark `#111116`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Ironwood Timber**
- **Subject:** Iron-banded lumber, the durability (+HP) base material dropped by Ancient Treants.
- **Look:** A 64×64 resource icon stack of thick logs with dark iron grain and rusted metal bands, one sawn end showing dense rings.
- **Rarity:** Stack tint signals quality — Common (no tint) / Rare (blue) / Epic (purple) — bands brighten and grain grows deeper with rarity.
- **Palette:** Polished Steel `#E0E0E0`, Jungle Bronze `#CD7F32`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Emberbloom Sap**
- **Subject:** Glowing plant sap, the sustain (regen/lifesteal) base material dropped by Emberbloom Insects.
- **Look:** A 64×64 resource icon of a honeycomb-drop of translucent sap in a leaf cup, warm ember glow pulsing from within.
- **Rarity:** Sap drop tint signals quality — Common (no tint) / Rare (blue) / Epic (purple) — glow intensifies and droplet size grows with rarity.
- **Palette:** Emerald Green `#00A86B`, Sunburst Orange `#FF8C00`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Stormfeather**
- **Subject:** A storm-charged feather, the tempo (ASPD / move speed) base material dropped by Stormcrest Raptors.
- **Look:** A 64×64 resource icon stack of dark feathers crackling with tiny cyan lightning, quills tipped in gold.
- **Rarity:** Feather bundle tint signals quality — Common (no tint) / Rare (blue) / Epic (purple) — static arcs grow brighter and more numerous with rarity.
- **Palette:** Arcane Cyan `#00E5FF`, Obsidian Dark `#111116`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Voidshard**
- **Subject:** A jagged shard of void, the utility (CC-resist / penetration) base material dropped by Shadowmaw Spiders.
- **Look:** A 64×64 resource icon cluster of black-violet shards that seem to absorb light, thin smoke wisping off the edges.
- **Rarity:** Shard cluster tint signals quality — Common (no tint) / Rare (blue) / Epic (purple) — darker core and stronger smoke plume with rarity.
- **Palette:** Dark Violet `#8A2BE2`, Obsidian Dark `#111116`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Sunforge Alloy**
- **Subject:** Radiant forge-alloy, the fortitude (shields / damage reduction) base material dropped by Sunforged Golems.
- **Look:** A 64×64 resource icon stack of gold-and-silver alloy ingots, still warm with a sunburst glow etched with forge runes.
- **Rarity:** Ingot stack tint signals quality — Common (no tint) / Rare (blue) / Epic (purple) — heat glow and rune brightness intensify with rarity.
- **Palette:** Imperial Gold `#D4AF37`, Polished Steel `#E0E0E0`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

---

## ⚔️ Crafted Equipment (25)

> All 25 items are **2-component combines** from the 7 materials, worn on a unit. Effects are passive/automatic (auto-battler compliant). Quality tint: Common (none) / Rare (blue) / Epic (purple) / Ancient (gold pulsing, Genius-tier only).

### Physical hybrids

**Warblade**
- **Subject:** A rune-etched hybrid blade (+ATK/+AP) for Fighter · Mage · Marksman carry-hybrids.
- **Look:** A worn one-handed broadsword, gilded edge catching light, arcane-cyan runes etched along the fuller and glowing faintly after each cast.
- **Gear/Sigil:** Cyan rune glow on the blade — signature of the Runic Edge bonus-magic-damage passive; quality tint on the crossguard.
- **Palette:** Imperial Gold `#D4AF37`, Arcane Cyan `#00E5FF`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Bastion Plate**
- **Subject:** A heavy gilded chest plate (+ATK/+HP) for Fighter · Tanker · Assassin front-line sustain.
- **Look:** A worn golden breastplate layered over ironwood slats, lion pauldrons, crimson cloak trim; thick and immovable silhouette at 64px.
- **Gear/Sigil:** Suncrest emblem embossed on the sternum — the Thick Hide DR seal; quality tint on the trim.
- **Palette:** Imperial Gold `#D4AF37`, Crimson Red `#FF4444`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Bloodlocket**
- **Subject:** A vampiric gold locket (+ATK/+lifesteal) for Fighter · Marksman · Siege sustain killers.
- **Look:** A worn gold locket on a chain, crimson blood-gem center that pulses bright when the wearer scores a kill, tiny etched fangs on the clasp.
- **Gear/Sigil:** Pulsing crimson gem — the Blood Rush heal-on-kill marker; quality tint on the chain.
- **Palette:** Imperial Gold `#D4AF37`, Crimson Red `#FF4444`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Gale Blade**
- **Subject:** A slim wind-kissed sword (+ATK/+ASPD) for Fighter · Marksman · Assassin tempo.
- **Look:** A worn slim golden blade with a feathered crossguard, thin air-trails spiraling off the edge as if always in motion.
- **Gear/Sigil:** Feather-tipped crossguard — the Gale Cut slow signature; quality tint on the hilt wrap.
- **Palette:** Imperial Gold `#D4AF37`, Arcane Cyan `#00E5FF`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Sunderblade**
- **Subject:** A serrated armor-shredding greatblade (+ATK/armor-pen) for Fighter · Tanker · Assassin tank-busters.
- **Look:** A worn broad golden blade with void-dark serrations along the edge, small cracks of dark-violet energy visible between teeth.
- **Gear/Sigil:** Void-dark serrated edge — the Sunder armor-shred signature; quality tint on the pommel.
- **Palette:** Imperial Gold `#D4AF37`, Dark Violet `#8A2BE2`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

### Durability & utility

**Aegis Prism**
- **Subject:** A tower shield with a crystal core (+AP/+HP) for Tanker · Mage anti-burst safety.
- **Look:** A worn ironwood tower shield with a faceted arcane-cyan prism set in its center, the prism flashing once when Prism Shell saves the carrier from lethal damage.
- **Gear/Sigil:** Cyan prism core — the anti-burst survival marker; quality tint on the rim bands.
- **Palette:** Arcane Cyan `#00E5FF`, Polished Steel `#E0E0E0`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Arcanist's Tonic**
- **Subject:** A spellcaster's belt-flask (+AP/+HP regen) for Mage · Support sustain casters.
- **Look:** A worn hip flask of hammered gold, emerald-green tonic sloshing inside, a tiny cyan rune stamped on the cap that glows each time a spell is cast.
- **Gear/Sigil:** Glowing cap rune — the Tonic Surge cast-heal marker; quality tint on the strap.
- **Palette:** Arcane Cyan `#00E5FF`, Emerald Green `#00A86B`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Storm Rod**
- **Subject:** A crackling arcane rod (+AP/+ASPD) for Mage · Marksman hybrid DPS rhythm.
- **Look:** A worn cyan crystal rod bound in gold, a feather tied at the butt, tiny static arcs jumping tip-to-tip after every third attack.
- **Gear/Sigil:** Static-arc tip — the Static Overload every-3rd-hit marker; quality tint on the gold bindings.
- **Palette:** Arcane Cyan `#00E5FF`, Imperial Gold `#D4AF37`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Null Ward**
- **Subject:** A channeler's ward-crystal (+AP/CC-resist) for Mage · Support · Siege casters.
- **Look:** A worn dark-cyan ward crystal on a leather cord, wrapped in obsidian wire that flickers with a 1.2s bubble of silence while the carrier channels.
- **Gear/Sigil:** Flickering silence-bubble — the Null Field spell-shield marker; quality tint on the cord clasp.
- **Palette:** Arcane Cyan `#00E5FF`, Obsidian Dark `#111116`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Grove Barrier**
- **Subject:** A root-woven bulwark shield (+HP/+HP regen) for Tanker · Support · Artisan low-HP walls.
- **Look:** A worn timber shield overgrown with emerald roots, small leaves budding along the rim that unfurl when the carrier drops below 40% HP.
- **Gear/Sigil:** Budding emerald roots — the Grove Roots low-HP DR marker; quality tint on the bark bands.
- **Palette:** Emerald Green `#00A86B`, Jungle Bronze `#CD7F32`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Iron Strider**
- **Subject:** Ironwood greaves (+HP/move speed) for Tanker · Fighter · Siege slow-tank speed patch.
- **Look:** Worn knee-high ironwood greaves banded with gold, storm feathers pluming at the calves, faint wind-lines trailing behind the moving carrier.
- **Gear/Sigil:** Feather plumes on the calves — the Sturdy Gait slow-immunity marker; quality tint on the band rivets.
- **Palette:** Polished Steel `#E0E0E0`, Arcane Cyan `#00E5FF`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Bulwark Core**
- **Subject:** A heavy ironwood tower shield (+HP/+DR) for Tanker · Support · Artisan frontline aura.
- **Look:** Worn ironwood tower shield with a dark-violet core gem, a soft DR aura ring rippling outward to adjacent allies.
- **Gear/Sigil:** Ripple aura ring — the Bulwark Aura ally-DR marker; quality tint on the shield boss.
- **Palette:** Polished Steel `#E0E0E0`, Dark Violet `#8A2BE2`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

### Sustain & tempo

**Swift Mend**
- **Subject:** A healer's feather charm (+HP regen/+ASPD) for Support · Fighter · Marksman heal amplifiers.
- **Look:** Worn emerald feather charm bound with a sap-soaked cord, a soft green glow that brightens whenever the carrier receives healing.
- **Gear/Sigil:** Glowing emerald feather — the healing-received +20% marker; quality tint on the cord weave.
- **Palette:** Emerald Green `#00A86B`, Imperial Gold `#D4AF37`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Vital Shard**
- **Subject:** An anti-CC amulet (+HP regen/CC-resist) for Support · Tanker · Mage cleanse safety.
- **Look:** Worn emerald shard amulet on a dark cord, the shard flashing a cleansing emerald burst the moment the carrier is first disabled in a fight.
- **Gear/Sigil:** Cleansing emerald flash — the Vital Ward cleanse-and-heal marker; quality tint on the wire wrap.
- **Palette:** Emerald Green `#00A86B`, Obsidian Dark `#111116`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Phantom Step**
- **Subject:** A shadow-feather cloak (+move speed/+dodge) for Marksman · Fighter · Artisan kite tempo.
- **Look:** Worn obsidian cloak lined with dark feathers and thin smoke accents, the wearer flickering translucent for a frame when the first attack against them misses.
- **Gear/Sigil:** Translucent flicker on miss — the Phantom first-hit-miss marker; quality tint on the clasp.
- **Palette:** Obsidian Dark `#111116`, Arcane Cyan `#00E5FF`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

### The 10 new items (v2.1 — Alloy row + pure combines)

**Sunpiercer**
- **Subject:** A radiant anti-heal spear (+ATK/+DEF) for Fighter · Marksman · Assassin heal-counters.
- **Look:** Worn gold-and-alloy spear with a sunburst tip that flares a searing golden flash onto struck enemies, scorching their wounds shut.
- **Gear/Sigil:** Sunburst tip flash — the Searing Light heal-reduction marker; quality tint on the haft.
- **Palette:** Imperial Gold `#D4AF37`, Sunburst Orange `#FF8C00`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Mantle of Dawn**
- **Subject:** A dawn-lit cape (+AP/+HP) for Tanker · Mage · Support dive targets.
- **Look:** Worn gold-trimmed mantle of cyan silk that blooms a bright dawn-shield bubble around the carrier every 10s, then fades.
- **Gear/Sigil:** Periodic dawn-shield bubble — the Dawn Ward rotating-shield marker; quality tint on the shoulder clasps.
- **Palette:** Arcane Cyan `#00E5FF`, Imperial Gold `#D4AF37`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Vanguard Banner**
- **Subject:** A battle standard (+HP/+DR) for Tanker · Fighter · Support melee-team buffs.
- **Look:** Worn ironwood banner pole topped with a golden finial, an imperial-gold pennant snapping in an unseen wind and casting a +ATK aura ring over allies within 1 hex.
- **Gear/Sigil:** Golden pennant aura ring — the Banner of the First Line ATK aura marker; quality tint on the finial.
- **Palette:** Imperial Gold `#D4AF37`, Crimson Red `#FF4444`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Everflame Vial**
- **Subject:** A kindling potion flask (+HP regen/+AP) for Support · Mage · Fighter heal-to-damage enablers.
- **Look:** Worn gold-capped vial of emerald fire, a tiny flame that leaps from the vial to any ally the carrier heals, empowering their next strikes.
- **Gear/Sigil:** Leaping emerald flame — the Kindle damage-boost marker; quality tint on the cap.
- **Palette:** Emerald Green `#00A86B`, Sunburst Orange `#FF8C00`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Sunstep**
- **Subject:** Gilded rhythm greaves (+ASPD/+move speed) for Marksman · Assassin · Fighter guaranteed crits.
- **Look:** Worn gold-plated greaves with a single sun-feather fixed to each ankle, the wearer leaving a brief golden after-image every fourth step.
- **Gear/Sigil:** Golden after-image on the 4th step — the Critical Cadence guaranteed-crit marker; quality tint on the plating.
- **Palette:** Imperial Gold `#D4AF37`, Sunburst Orange `#FF8C00`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Nullpiercer**
- **Subject:** A void-shredding spear (+AP/magic-pen) for Mage · Assassin · Fighter magic-shred.
- **Look:** Worn dark-violet spear rimmed in gold, thin void rifts tearing open at the tip with every hit and peeling away the target's magic armor.
- **Gear/Sigil:** Void-rift tip — the Void Rift MR-shred marker; quality tint on the gold rim.
- **Palette:** Dark Violet `#8A2BE2`, Imperial Gold `#D4AF37`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Executioner's Claw**
- **Subject:** A brutal execute gauntlet (+ATK) for Fighter · Marksman · Assassin finishing blows.
- **Look:** Worn golden claw-gauntlet over the off-hand, talon tips dripping faint crimson that flares whenever a struck enemy drops below 30% HP.
- **Gear/Sigil:** Crimson flare on low-HP targets — the Bloodguilt execute marker; quality tint on the claw rivets.
- **Palette:** Imperial Gold `#D4AF37`, Crimson Red `#FF4444`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Spellforge Crown**
- **Subject:** A crystal crown (+AP) for Mage · Support spell-snowball casters.
- **Look:** Worn gold circlet set with three rising arcane-cyan crystals, each crystal lighting in sequence as the caster's AP ramps with every cast.
- **Gear/Sigil:** Sequential crystal lighting — the Arcane Surge stacking-AP marker; quality tint on the circlet band.
- **Palette:** Arcane Cyan `#00E5FF`, Imperial Gold `#D4AF37`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Colossus Heart**
- **Subject:** A gilded core talisman (+HP) for Tanker · Fighter · Artisan scaling front lines.
- **Look:** Worn ironwood-framed golden heart talisman that grows heavier and more ornate with every kill, cracks of gold light spreading outward as Max HP climbs.
- **Gear/Sigil:** Gold-light growth on kills — the Gilded Constitution permanent-HP marker; quality tint on the heart gem.
- **Palette:** Imperial Gold `#D4AF37`, Jungle Bronze `#CD7F32`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Undying Bloom**
- **Subject:** A blossoming emerald charm (+HP regen) for Tanker · Support · Fighter last-stand sustain.
- **Look:** Worn emerald blossom pinned to the chest, petals closed — they unfold and glow warmly whenever the carrier drops below 40% HP, healing from within.
- **Gear/Sigil:** Blooming emerald petals — the Second Spring low-HP heal/DR marker; quality tint on the stem wrap.
- **Palette:** Emerald Green `#00A86B`, Imperial Gold `#D4AF37`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

---

## ✨ Divine & Unique Items

> Divine items are a separate, non-craftable lane above Ancient — granted only by Transcendence-tier trait conditions. Unique (1 per army), no quality ladder, each with a **radiant halo** in its 64×64 icon and on the worn model.

**Excavate**
- **Subject:** A radiant golden shovel for any-class jungle farmers (economy accelerator).
- **Look:** Worn over the shoulder, a polished golden shovel with a radiant sun emblem on the blade and a worn leather-grip handle; every 10s in the jungle it gleams as gold is struck.
- **Gear/Sigil:** Divine radiant halo around the blade — the Prospector's Rhythm gold-gain marker.
- **Palette:** Imperial Gold `#D4AF37`, Sunburst Orange `#FF8C00`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Unite**
- **Subject:** A blood-soaked golden medal for Support-only platoon-shared health pools.
- **Look:** Worn on a crimson ribbon, a blood-stained golden medal whose centerpiece turns into a beating single heart, linking the whole platoon's health into one bar.
- **Gear/Sigil:** Divine radiant halo around the heart-center — the Shared Blood pool-link marker.
- **Palette:** Imperial Gold `#D4AF37`, Crimson Red `#FF4444`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Absolute Shield**
- **Subject:** A silver shining shield for Tanker-only platoon-wide damage reduction.
- **Look:** Worn on the arm, a mirror-bright polished-silver kite shield engraved with the Suncrest, casting a broad radiant DR blanket over the entire platoon.
- **Gear/Sigil:** Divine radiant halo on the boss — the Bulwark of Absolution platoon-DR marker.
- **Palette:** Polished Steel `#E0E0E0`, Imperial Gold `#D4AF37`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Magnifier**
- **Subject:** An old rusted magnifier for any-class ranged snipers (range-scaled burst).
- **Look:** Worn hanging from a leather strap, a battered rusted brass magnifier with a cracked lens that snaps to a golden scope-glass when the carrier engages at long range.
- **Gear/Sigil:** Divine radiant halo glinting off the lens — the Telescopic Focus range bonus marker.
- **Palette:** Jungle Bronze `#CD7F32`, Imperial Gold `#D4AF37`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Excalibur**
- **Subject:** A shining golden sword for any-class killers (scaling duelist).
- **Look:** Worn in hand, a gleaming imperial-gold longsword with a radiant white-gold edge, the blade darkening slightly at the base with each kill while its glow intensifies.
- **Gear/Sigil:** Divine radiant halo along the full blade — the Coronation of Blood kill-ramp marker.
- **Palette:** Imperial Gold `#D4AF37`, Polished Steel `#E0E0E0`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Midnight**
- **Subject:** A pitch-black dagger for Assassin-only one-shot kills.
- **Look:** Worn in a shadow sheath, a dagger of absolute black whose blade drinks light, its edge briefly blooming with violet shadow every 20s as the Shadow's Contract primes.
- **Gear/Sigil:** Divine radiant halo barely visible against the void blade — the Shadow's Contract ×5 charge marker.
- **Palette:** Obsidian Dark `#111116`, Dark Violet `#8A2BE2`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

---

## 🧴 Consumables (4)

> Single-use potions and throwables from the legacy consumable lane (Resource Tab, gold/time based). Readable as distinct 64×64 icons — never mistaken for materials or equipment.

**Healing Flask**
- **Subject:** A single-use healing potion restoring 150 HP to the platoon's units.
- **Look:** A 64×64 icon of a round glass flask with a wax-sealed cork, emerald-green liquid glowing softly with little bubbles rising; glows brighter as it's about to be used.
- **Gear/Sigil:** Emerald glow and wax seal — instantly reads as "drink-to-heal"; no rarity tint (consumable).
- **Palette:** Emerald Green `#00A86B`, Polished Steel `#E0E0E0`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Speed Elixir**
- **Subject:** A single-use elixir granting +30% movement speed for 20s.
- **Look:** A 64×64 icon of a slender cyan vial with a gold cap, shimmering wind-cyan liquid with tiny feather streaks frozen inside.
- **Gear/Sigil:** Wind streaks in the vial — instantly reads as "movement speed"; no rarity tint (consumable).
- **Palette:** Arcane Cyan `#00E5FF`, Imperial Gold `#D4AF37`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Damage Tonic**
- **Subject:** A single-use tonic granting +20% attack DPS for 20s.
- **Look:** A 64×64 icon of a squat crimson tonic bottle with a leather-wrapped neck, fiery orange liquid swirling with tiny ember sparks.
- **Gear/Sigil:** Ember sparks in the liquid — instantly reads as "attack damage"; no rarity tint (consumable).
- **Palette:** Crimson Red `#FF4444`, Sunburst Orange `#FF8C00`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.

**Siege Bomb**
- **Subject:** A throwable brass bomb dealing 300 direct siege damage to a wall segment.
- **Look:** A 64×64 icon of a riveted brass sphere with a short sputtering fuse and a lit sunburst stencil, faint orange sparks already flying off the fuse.
- **Gear/Sigil:** Lit fuse and brass rivets — instantly reads as "explosive"; no rarity tint (consumable).
- **Palette:** Brass Yellow `#E5B80B`, Sunburst Orange `#FF8C00`.
- **Style:** isometric 2.5D game sprite, stylized fantasy, clean readable silhouette at 64px.
- **Finish:** high-detail, soft golden rim light, game-ready texture, no text.
