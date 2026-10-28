import requests
import json
import os

url = 'https://api.typesafe.ai/v1/systemone'
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer apikey_2229933ddab20685464abc40f2f5ae7df42e_e6648fa64dceb02fdfceab157a93c3986fac9e930948b7370eb6ee52c0ef30cc'
}

state_text = """System Decision Directive: High Effect Model Evaluation & Architectural Selection for Aurolith Character Sprites.
Evaluator: Jev System One.

Context & User Request:
User inspected the 10 units in Assets/Units/1_Fighter.
User found 3 broken sprites:
- sunder_aegis.png: Broken detail, low resolution, blurry (caused by 384x576 at 12 steps Euler a, upscaled via Lanczos to 512x768).
- chainbreaker_rhuk.png: Low quality, muddy dark textures (caused by fast 16 steps on CPU).
- duelist_valen.png: Severely broken (only upper torso generated, Y cut off at 429px, entire lower body/legs/boots missing).

User Directive:
'check the model for image generation as list. then sent the note.md of the character prompt to jev. and let it decide which model is the best for high quality one. I'd prioritize the quality of the image generation over time consuming.'

Prompt Standard in Assets/Gen/note.md:
Style: 2.5D medieval fantasy video game character sprite, full body isolated on pure solid white background, rich vibrant saturated crimson and gold, high-contrast cinematic medieval lighting, deep dramatic cast shadows, 20% safe margin, clean silhouette.

Candidate Models Evaluated:
1. DreamShaper 8 (SD 1.5, local at D:\\LocalAI\\Models\\DreamShaper_8_pruned.safetensors, 2.13GB):
   - Proven 2.5D stylized RPG/fantasy character checkpoint.
   - Highly compatible with Danbooru/ArtStation tags, prompt weights, and solid white background cutouts.
   - Run at high quality: native 512x768, 30-35 steps DPM++ 2M Karras, CFG 7.5 on CPU (~4-5 mins/img).
2. SD-Turbo (local in HF cache):
   - Fast 1-step distilled model, but poor fine detail, washed out lighting, low fidelity.
3. Juggernaut XL v9 (SDXL candidate, downloadable ~6.6GB):
   - Extreme fidelity, but SDXL on CPU takes 20-30 mins per image and frequently bleeds cinematic realistic environments that ruin pure-white cutouts.
4. Rev Animated v1.2.2 (SD 1.5 candidate, downloadable ~2GB):
   - High quality semi-realistic 2.5D fantasy, strong silhouette handling.
5. Cloud Multimodal (Imagen 3 / Gemini Image):
   - SOTA fidelity and lighting, but subject to API rate quotas.

Character Prompts from note.md tested:
- Sunder Aegis: '(masterpiece, best quality:1.3), 2.5D medieval fantasy video game character sprite, full body, isolated portrait, heavy shieldbreaker dwarf stonekin warrior Sunder Aegis, stocky powerfully muscular build, braided fiery copper beard... heavy sun-forged imperial golden plate armor... wielding a massive two-handed barrier-shattering warhammer... glowing with molten magma fissure veins... (pure solid white background:1.5), 20% safe margin'
- Duelist Valen: '(masterpiece, best quality:1.3), 2.5D medieval fantasy video game character sprite, full body, isolated portrait, imperial noble master fencer Duelist Valen, tall athletic noble swordsman... refined sun-forged imperial golden half-plate armor over velvet doublet... rapier-longsword with glowing silver and gold parrying blade trails... (pure solid white background:1.5), 20% safe margin'
- Chainbreaker Rhuk: '(masterpiece, best quality:1.3), 2.5D medieval fantasy video game character sprite, full body, isolated portrait, colossal scarred half-orc bruiser Chainbreaker Rhuk, massive muscular frame... sun-forged golden plate cuirass with heavy iron reinforcement, roaring lion pauldrons, shattered iron slave manacles... colossal barbed iron hook on coiled tether chain... (pure solid white background:1.5), 20% safe margin'
"""

payload = {
    'model': 'jev-latest',
    'state': state_text,
    'questions': {
        'best_overall_model_for_quality': {
            'type': 'choice',
            'choices': [
                'dreamshaper_8_high_step_native',
                'sdxl_juggernaut_xl',
                'rev_animated_v122',
                'sd_turbo_fast'
            ],
            'criteria': {
                'dreamshaper_8_high_step_native': 'DreamShaper 8 is already installed locally (2.13GB) and excels at 2.5D stylized fantasy sprites. Running at native 512x768 with 30-35 steps DPM++ 2M Karras produces crisp armor engravings, glowing magical veins, and reliably respects solid white backgrounds for edge-connected BFS cutouts without photographic background bleed.',
                'sdxl_juggernaut_xl': 'SDXL has higher raw resolution (1024x1024), but on CPU takes 20-30 mins per image and frequently bleeds cinematic realistic environments that ruin pure-white cutouts.',
                'rev_animated_v122': 'Strong 2.5D anime/semi-realistic aesthetic, comparable to DreamShaper 8.',
                'sd_turbo_fast': 'Fastest, but fails quality prioritization directive.'
            }
        },
        'prompt_and_parameter_quality_mandate': {
            'type': 'choice',
            'choices': [
                'upgrade_to_32_steps_dpm2m_and_enforce_standing_full_body_anchors',
                'keep_12_16_steps_and_upscale_post_generation'
            ],
            'criteria': {
                'upgrade_to_32_steps_dpm2m_and_enforce_standing_full_body_anchors': 'Mandate: 1) Native 512x768 resolution. 2) 32 steps DPM++ 2M Karras. 3) Replace isolated portrait with explicit standing full body game sprite anchors. 4) Add explicit negative weights against torso-crop to permanently fix Duelist Valen and Sunder Aegis.',
                'keep_12_16_steps_and_upscale_post_generation': 'Continue downscaling and upscaling, causing blur and low resolution.'
            }
        }
    }
}

res = requests.post(url, headers=headers, json=payload, timeout=30)
print(json.dumps(res.json(), indent=2))
