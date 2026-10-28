import requests
import json

url = 'https://api.typesafe.ai/v1/systemone'
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer apikey_2229933ddab20685464abc40f2f5ae7df42e_e6648fa64dceb02fdfceab157a93c3986fac9e930948b7370eb6ee52c0ef30cc'
}

payload = {
    'model': 'jev-latest',
    'state': '''Jev AI Prompt & Asset Repair Audit for Aurolith Units 1.5, 1.6, and 1.9.
Auditing exact prompts from Assets/Gen/note.md against the visual failures discovered in Assets/Units/1_Fighter:

Unit 1.5: Sunder Aegis — 'Shield Breaker'
Current Note.md Prompt:
(masterpiece, best quality:1.3), 2.5D medieval fantasy video game character sprite, full body, isolated portrait, heavy shieldbreaker dwarf stonekin warrior Sunder Aegis, stocky powerfully muscular build, braided fiery copper beard, steel-crowned brow, heavy sun-forged imperial golden plate armor reinforced with carved granite shoulder plates and lion-head pauldrons, rich crimson battle sash, wielding a massive two-handed barrier-shattering warhammer, the heavy square hammerhead glowing with molten magma fissure veins and crackling with fiery orange impact sparks, low coiled powerhouse combat stance, deep dramatic cast shadows, intense high-contrast medieval fantasy lighting, vibrant saturated molten orange, crimson, and radiant gold tones, exerting relentless barrier-cracking blunt force and heavy impact power, (pure solid white background:1.5), (isolated on white background:1.4), clean silhouette, 20% safe margin
Issue: In the past run, downscaled to 384x576 at 12 steps, resulting in blurry, low-res textures.

Unit 1.6: Duelist Valen — 'Honor Bound'
Current Note.md Prompt:
(masterpiece, best quality:1.3), 2.5D medieval fantasy video game character sprite, full body, isolated portrait, imperial noble master fencer Duelist Valen, tall athletic noble swordsman with sleek dark hair and aristocratic focus, refined sun-forged imperial golden half-plate armor over a royal midnight-blue and crimson velvet doublet, sculpted lion-crest pauldron, ornate dueling cape draped over one shoulder, wielding a masterwork gold-hilted rapier-longsword with glowing silver and gold parrying blade trails, formal honorable 1v1 dueling poise ready for a lightning-fast lunge, deep dramatic cast shadows, intense high-contrast medieval fantasy lighting, rich vibrant crimson, royal blue, and polished gold reflections, exerting supreme single-target dueling precision and lethal elegance, (pure solid white background:1.5), (isolated on white background:1.4), clean silhouette, 20% safe margin
Issue: Word 'isolated portrait' triggered a bust/torso generation. The bounding box Y cut off at 429px, severing the legs and boots completely.

Unit 1.9: Chainbreaker Rhuk — 'The Meat Hook'
Current Note.md Prompt:
(masterpiece, best quality:1.3), 2.5D medieval fantasy video game character sprite, full body, isolated portrait, colossal scarred half-orc bruiser Chainbreaker Rhuk, massive muscular frame with olive-grey skin, jutting lower tusks, fierce amber eyes, battle-worn sun-forged golden plate cuirass with heavy iron reinforcement, roaring lion pauldrons, shattered iron slave manacles still bolted around thick wrists, wielding a colossal barbed iron hook on a heavy coiled tether chain wrapped around his forearm, kinetic tension ready to drag enemies into melee range, wide menacing combat stance, deep dramatic cast shadows, intense high-contrast medieval fantasy lighting, rich vibrant dark crimson, burnished iron, and radiant gold tones, exerting brutal physical pulling force and unstoppable brawling savagery, (pure solid white background:1.5), (isolated on white background:1.4), clean silhouette, 20% safe margin
Issue: Generated at low steps; dark iron manacles and apron suffered from muddy contrast and jagged edge floodfill.''',
    'questions': {
        'sunder_aegis_verdict': {
            'type': 'choice',
            'choices': ['prompt_sound_requires_native_512x768_32steps', 'requires_major_prompt_rework'],
            'criteria': {
                'prompt_sound_requires_native_512x768_32steps': 'The visual prompt in note.md is richly detailed and accurate to the stonekin fantasy; the flaw was solely in the downscaled 384x576 12-step execution. Running native 512x768 at 32 steps DPM++ 2M Karras with DreamShaper 8 will fully resolve the low-resolution issue.',
                'requires_major_prompt_rework': 'Prompt concept needs to be rewritten.'
            }
        },
        'duelist_valen_verdict': {
            'type': 'choice',
            'choices': ['replace_portrait_with_standing_full_body_game_sprite', 'keep_isolated_portrait'],
            'criteria': {
                'replace_portrait_with_standing_full_body_game_sprite': 'CRITICAL FIX: \"isolated portrait\" causes SD 1.5 to frame from the waist up. Must replace with \"(standing full body game sprite:1.4), (entire noble fencer visible from head to boots:1.4)\" and add \"(waist-up:1.6), (cropped:1.6)\" to negative prompt.',
                'keep_isolated_portrait': 'Retain portrait token.'
            }
        },
        'chainbreaker_rhuk_verdict': {
            'type': 'choice',
            'choices': ['increase_sampling_steps_and_sharpen_iron_textures', 'redesign_character_concept'],
            'criteria': {
                'increase_sampling_steps_and_sharpen_iron_textures': 'The brute hook concept is strong; needs 32 steps DPM++ 2M Karras with explicit metallic highlights on the tether chain to prevent dark mudding.',
                'redesign_character_concept': 'Change the unit concept completely.'
            }
        }
    }
}

res = requests.post(url, headers=headers, json=payload, timeout=30)
print(json.dumps(res.json(), indent=2))
