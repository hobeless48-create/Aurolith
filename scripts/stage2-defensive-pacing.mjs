import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';

const prefix = process.env.AUROLITH_PACING_CAPTURE_PREFIX || 'stage2-defensive-pacing';
const browser = await chromium.launch({ executablePath: process.env.AUROLITH_CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true, args: ['--use-angle=swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
const actions = [];
let pendingAction = null;
let lateScreenshotClock = null;
page.on('pageerror', (error) => errors.push(error.message));
class MatchFinished extends Error {}

async function ended() { return !await page.locator('#match-result').isHidden(); }
async function pause() {
  if ((await page.locator('#match-toggle').innerText()).startsWith('Pause')) await page.locator('#match-toggle').click();
  if (await ended()) throw new MatchFinished();
}
async function resume() {
  if ((await page.locator('#match-toggle').innerText()).match(/^(Start match|Resume)/)) await page.locator('#match-toggle').click();
}
async function gold() { return Number(await page.locator('#match-gold').innerText()); }
async function settle(description, predicate = null, arg = null) {
  pendingAction = description;
  await page.locator('#match-speed').selectOption('4');
  await resume();
  await page.waitForFunction(() => !document.querySelector('#match-result')?.hidden || document.querySelector('#match-feedback')?.textContent?.includes('accepted'), null, { timeout: 12000 });
  if (predicate) await page.waitForFunction(predicate, arg, { timeout: 12000 });
  await pause();
  const feedback = await page.locator('#match-feedback').innerText();
  if (!feedback.includes('accepted')) throw new Error(`${description}: ${feedback}`);
  actions.push({ clock: await page.locator('#match-time').innerText(), description });
  console.log(`${actions.at(-1).clock}: ${description}`);
  pendingAction = null;
  if (!lateScreenshotClock && await page.locator('#match-phase').innerText() === 'overtime') {
    lateScreenshotClock = await page.locator('#match-time').innerText();
    await page.screenshot({ path: `Plan/Stages/${prefix}-15m.png` });
  }
}
async function waitUntil(seconds) {
  await page.locator('#match-speed').selectOption('24');
  await resume();
  await page.waitForFunction((target) => {
    const [m, s] = document.querySelector('#match-time').textContent.split(':').map(Number);
    return m * 60 + s >= target || !document.querySelector('#match-result').hidden;
  }, seconds, { timeout: 180000 });
  await pause();
}
async function chooseRite() {
  const choices = page.locator('#match-rite [data-blessing]');
  if (!await choices.count()) return;
  const descriptions = await choices.allInnerTexts();
  const index = descriptions.findIndex((text) => /health|armor|shield|healing|damage reduction/i.test(text));
  await choices.nth(index < 0 ? 0 : index).click();
  await settle(`Rite: ${descriptions[index < 0 ? 0 : index].split('\n')[0]}`);
}
async function holdInnerKeep(platoon) {
  await page.locator(`[data-platoon="${platoon}"]`).click();
  await page.locator('#match-stance').selectOption('defensive');
  await page.locator('#minimap').click({ position: await page.locator('#minimap').evaluate((canvas) => ({ x: canvas.clientWidth * 0.5, y: canvas.clientHeight * 0.06 })) });
  const camera = await page.evaluate(() => window.__aurolithCameraDebug);
  const canvas = page.locator('#board canvas');
  const bounds = await canvas.boundingBox();
  const x = Math.sqrt(3) * 20 * 76; // Center of odd-row hex 75:5.
  const y = 30 * 5 + 20;
  await canvas.click({ button: 'right', position: { x: (x * camera.scale + camera.offsetX) * bounds.width / camera.screenWidth, y: (y * camera.scale + camera.offsetY) * bounds.height / camera.screenHeight } });
  await settle(`Platoon ${platoon}: Defensive hold inside keep`);
}
async function invest() {
  await chooseRite();
  await page.locator('[data-platoon="2"]').click();
  for (const id of ['unit-def:sniper-castella', 'unit-def:nightblade', 'unit-def:jungle-stalker', 'unit-def:sapper-drox']) {
    const available = await page.locator('#match-recruit').evaluate((select) => [...select.options].map((option) => option.value));
    const price = Number(await page.locator('#match-price').innerText());
    if (!available.includes(id) || await gold() < price || (await page.locator('[data-platoon="2"] small').innerText()).startsWith('5/')) continue;
    const count = await page.locator('#match-roster [data-unit]').count();
    await page.locator('#match-recruit').selectOption(id);
    await page.locator('#match-hire').click();
    await settle(`Recruit ${id}`, (expected) => document.querySelectorAll('#match-roster [data-unit]').length > expected, count);
  }
  await holdInnerKeep(1);
  await holdInnerKeep(2);
  // The cap is three per category, not three per individual facility kind.
  const plan = [[2, 'ballista'], [1, 'arcane-barrier'], [5, 'ballista'], [4, 'caravan-post'], [3, 'caravan-post'], [6, 'caravan-post']];
  for (const [number, kind] of plan) {
    const slot = `facility-slot:north:${number}`;
    await page.locator('#match-facility-slot').selectOption(slot);
    let label = await page.locator('#match-facility-slot option:checked').innerText();
    if (label.includes('Empty') && await gold() >= 150) {
      await page.locator('#match-facility-kind').selectOption(kind);
      if (!await page.locator('#match-build-facility').isDisabled()) {
        await page.locator('#match-build-facility').click();
        await settle(`Build ${kind} in slot ${number}`, (id) => [...document.querySelector('#match-facility-slot').options].some((option) => option.value === id && option.textContent.includes('T1')), slot);
      }
    }
    for (let pass = 0; pass < 2; pass++) {
      label = await page.locator('#match-facility-slot option:checked').innerText();
      const tier = Number(/T(\d)/.exec(label)?.[1] || 0);
      if (tier < 1 || tier >= 3 || await page.locator('#match-upgrade-facility').isDisabled()) break;
      const cost = tier === 1 ? 250 : 400;
      const xpCost = tier === 1 ? 100 : 250;
      const xp = Number((await page.locator('#match-facility-xp').innerText()).match(/\d+/)?.[0] || 0);
      if (await gold() < cost || xp < xpCost) break;
      await page.locator('#match-upgrade-facility').click();
      await settle(`Upgrade slot ${number} to T${tier + 1}`, ({ id, target }) => [...document.querySelector('#match-facility-slot').options].some((option) => option.value === id && option.textContent.includes(`T${target}`) && !option.textContent.includes('→')), { id: slot, target: tier + 1 });
    }
  }
  const ids = await page.locator('#match-roster [data-unit]').evaluateAll((buttons) => buttons.map((button) => button.dataset.unit));
  for (const id of ids) {
    for (let pass = 0; pass < 3 && await gold() >= 100; pass++) {
      const label = await page.locator(`#match-roster [data-unit="${id}"]`).innerText();
      if (/L3\b/.test(label) || label.includes('KO')) break;
      await page.locator('#match-unit').selectOption(id);
      await page.locator('#match-train-unit').click();
      await settle(`Academy training ${id}`);
    }
  }
}

try {
  await page.addInitScript(() => {
    window.__defensiveSnapshots = [];
    const recorded = new Set();
    setInterval(() => {
      const clock = document.querySelector('#match-time')?.textContent;
      if (!clock) return;
      const [m, s] = clock.split(':').map(Number);
      const seconds = m * 60 + s;
      for (const target of [300, 600, 900, 1080]) {
        if (seconds < target || recorded.has(target)) continue;
        recorded.add(target);
        window.__defensiveSnapshots.push({ targetSeconds: target, clock, active: !!document.querySelector('#match-result')?.hidden,
          phase: document.querySelector('#match-phase')?.textContent, gold: document.querySelector('#match-gold')?.textContent,
          xp: document.querySelector('#match-xp')?.textContent, ownCore: document.querySelector('#match-own-core')?.textContent,
          blessings: document.querySelector('#match-blessings')?.textContent, cards: document.querySelector('#match-card-count')?.textContent,
          roster: document.querySelector('#match-roster')?.textContent, facilities: [...(document.querySelector('#match-facility-slot')?.options || [])].map((option) => option.textContent) });
      }
    }, 100);
  });
  await page.goto(process.env.AUROLITH_DEV_URL || 'http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  await page.locator('#match-toggle').waitFor();
  for (const selector of ['.roster-group', '.economy-group', '.build-group']) if (!await page.locator(selector).evaluate((element) => element.open)) await page.locator(`${selector} > summary`).click();
  await page.locator('#match-speed').selectOption('24');
  await chooseRite();
  for (const target of [120, 240, 360, 480, 600, 780, 900]) {
    try {
      await waitUntil(target);
      if (target === 900) {
        lateScreenshotClock = await page.locator('#match-time').innerText();
        await page.screenshot({ path: `Plan/Stages/${prefix}-15m.png` });
        console.log(`Active late-game UI: ${await page.locator('#match-time').innerText()} / ${await page.locator('#match-phase').innerText()}`);
      } else await invest();
      console.log(`Defensive investment/checkpoint completed at ${await page.locator('#match-time').innerText()}`);
    } catch (error) { if (error instanceof MatchFinished) break; throw error; }
  }
  if (!await ended()) {
    await page.locator('#match-speed').selectOption('24');
    await resume();
    await page.locator('#match-result:not([hidden])').waitFor({ timeout: 180000 });
  }
  const checkpoints = await page.evaluate(() => window.__defensiveSnapshots);
  const report = { scenario: 'ordinary-HUD defensive investments; no simulation overrides', actions, checkpoints, lateScreenshotClock,
    result: await page.locator('#match-result').innerText(), endTime: await page.locator('#match-time').innerText(),
    reachedActive15: checkpoints.some((entry) => entry.targetSeconds === 900 && entry.active && entry.phase === 'overtime'), errors };
  await writeFile(`Plan/Stages/${prefix}.json`, JSON.stringify(report, null, 2));
  await page.locator('#match-result').scrollIntoViewIfNeeded();
  await page.screenshot({ path: `Plan/Stages/${prefix}-result.png` });
  console.log(JSON.stringify({ result: report.result, endTime: report.endTime, reachedActive15: report.reachedActive15, checkpoints: checkpoints.map(({ targetSeconds, clock, active, phase, ownCore }) => ({ targetSeconds, clock, active, phase, ownCore })) }));
  if (errors.length) throw new Error(`Browser page errors: ${errors.join('; ')}`);
  if (!report.reachedActive15) process.exitCode = 2;
} catch (error) {
  const state = await page.evaluate(() => ({ clock: document.querySelector('#match-time')?.textContent, toggle: document.querySelector('#match-toggle')?.textContent,
    gold: document.querySelector('#match-gold')?.textContent, xp: document.querySelector('#match-facility-xp')?.textContent,
    feedback: document.querySelector('#match-feedback')?.textContent, facility: document.querySelector('#match-facility-slot option:checked')?.textContent,
    result: document.querySelector('#match-result')?.textContent, checkpoints: window.__defensiveSnapshots }));
  await writeFile(`Plan/Stages/${prefix}-error.json`, JSON.stringify({ pendingAction, error: error.message, state, actions, errors }, null, 2));
  await page.screenshot({ path: `Plan/Stages/${prefix}-error.png` });
  throw new Error(`${pendingAction || 'Defensive scenario'}: ${error.message}; ${JSON.stringify(state)}`);
} finally { await browser.close(); }
