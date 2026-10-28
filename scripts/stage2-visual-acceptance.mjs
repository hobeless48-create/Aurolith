import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';

const chrome = process.env.AUROLITH_CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const baseUrl = process.env.AUROLITH_DEV_URL || 'http://127.0.0.1:5173/';
const browser = await chromium.launch({ executablePath: chrome, headless: true, args: ['--use-angle=swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const errors = [];
const capturePrefix = process.env.AUROLITH_VISUAL_CAPTURE_PREFIX || 'stage2-visual';
page.on('pageerror', (error) => errors.push(error.message));
await page.addInitScript(() => {
  window.__aurolithVisualEvents = [];
  window.__aurolithAudioClicks = 0;
  if (window.AudioContext) {
    const NativeAudioContext = window.AudioContext;
    window.AudioContext = class extends NativeAudioContext {
      createOscillator() {
        const oscillator = super.createOscillator();
        const start = oscillator.start.bind(oscillator);
        oscillator.start = (...args) => { window.__aurolithAudioClicks++; return start(...args); };
        return oscillator;
      }
    };
  }
  window.__aurolithVisualPauseOn = null;
  window.__aurolithVisualTestOrderQueued = false;
  window.addEventListener('aurolith:visual-event', (event) => window.__aurolithVisualEvents.push(event.detail));
});

async function pauseOnVisualEvent(target) {
  await page.evaluate((eventTarget) => { window.__aurolithVisualPauseOn = eventTarget; }, target);
}

async function captureWhen(name, predicate, arg = null, timeout = 150000, aliases = []) {
  try {
    await page.waitForFunction(predicate, arg, { timeout, polling: 'raf' });
  } catch {
    const state = await page.evaluate(() => ({ clock: document.querySelector('#match-time')?.textContent, feedback: document.querySelector('#match-feedback')?.textContent, events: window.__aurolithVisualEvents.slice(-5) }));
    throw new Error(`${name} visual fixture timed out: ${JSON.stringify(state)}`);
  }
  const toggle = page.locator('#match-toggle');
  console.log(`${name} cue before recenter: ${JSON.stringify(await page.evaluate(() => ({ toggle: document.querySelector('#match-toggle')?.textContent, effects: window.__aurolithEffectDebug, event: window.__aurolithVisualEvents.at(-1) })))}`);
  await page.evaluate(() => { window.__aurolithVisualHoldEffects = true; });
  if ((await toggle.innerText()).startsWith('Pause')) await toggle.click();
  await centerCameraOnLatestEvent();
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const board = await page.locator('.board-shell').boundingBox();
  if (!board) throw new Error('Battlefield viewport is missing');
  const screenshot = await page.screenshot({ clip: board });
  await writeFile(`Plan/Stages/${capturePrefix}-${name}.png`, screenshot);
  for (const alias of aliases) await writeFile(`Plan/Stages/${capturePrefix}-${alias}.png`, screenshot);
  await page.evaluate(() => { window.__aurolithVisualHoldEffects = false; });
  console.log(`${name} visual state: ${JSON.stringify(await page.evaluate(() => window.__aurolithEffectDebug))}`);
}

async function clickHex(col, row, button = 'left') {
  const canvas = page.locator('#board canvas');
  const rect = await canvas.boundingBox();
  if (!rect) throw new Error('Board canvas missing');
  const width = Math.sqrt(3) * 20;
  const center = (c, r) => ({ x: width * (c + 0.5 * (r & 1)) + width / 2, y: 30 * r + 20 });
  const target = center(col, row);
  const camera = await page.evaluate(() => window.__aurolithCameraDebug);
  if (!camera) throw new Error('Camera transform is unavailable');
  const position = { x: (target.x * camera.scale + camera.offsetX) * rect.width / camera.screenWidth,
    y: (target.y * camera.scale + camera.offsetY) * rect.height / camera.screenHeight };
  await canvas.click({ button, position });
}

async function panBoardBy(x, y) {
  const rect = await page.locator('#board canvas').boundingBox();
  if (!rect) throw new Error('Board canvas missing');
  const start = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x + x, start.y + y, { steps: 6 });
  await page.mouse.up();
}

async function centerCameraOnHex(col, row) {
  const map = page.locator('#minimap');
  const bounds = await map.boundingBox();
  if (!bounds) throw new Error('Map overview is missing');
  await map.click({ position: { x: bounds.width * (col + 0.5) / 150, y: bounds.height * (row + 0.5) / 90 } });
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function centerCameraOnLatestEvent() {
  const point = await page.evaluate(() => {
    const entry = window.__aurolithVisualEvents.at(-1);
    const event = entry?.event;
    const target = event?.targets?.[0] ?? event?.target ?? event;
    return target && Number.isFinite(target.col) && Number.isFinite(target.row) ? { col: target.col, row: target.row } : null;
  });
  if (!point) throw new Error('The visual event did not include a visible target hex');
  await centerCameraOnHex(point.col, point.row);
}

async function visualEventMark() {
  return page.evaluate(() => window.__aurolithVisualEvents.length);
}

try {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.locator('#minimap').click({ position: await page.locator('#minimap').evaluate((canvas) => ({ x: canvas.clientWidth * 0.5, y: canvas.clientHeight * 0.5 })) });
  if (await page.locator('#zoom-value').innerText() !== '100%') throw new Error('Visual acceptance must use the new default 100% gameplay zoom');
  await page.locator('#minimap').click({ position: await page.locator('#minimap').evaluate((canvas) => ({ x: canvas.clientWidth * 0.5, y: canvas.clientHeight * 0.1 })) });
  await page.locator('#minimap').click({ position: await page.locator('#minimap').evaluate((canvas) => ({ x: canvas.clientWidth * 0.5, y: canvas.clientHeight * 0.5 })) });
  await page.locator('#match-speed').selectOption('12');
  await page.locator('#match-rite [data-blessing]').first().click();
  await page.locator('#match-stance').selectOption('aggressive');
  await pauseOnVisualEvent({ category: 'boss-warning', type: 'warning' });
  await page.locator('#match-toggle').click();
  await clickHex(75, 45, 'right');
  await panBoardBy(0, 100);
  if (await page.locator('#zoom-value').innerText() !== '100%') throw new Error('Card visual capture moved away from 100% gameplay zoom');

  await page.waitForFunction(() => window.__aurolithVisualEvents.some((entry) => entry.category === 'boss-warning' && entry.event.type === 'warning'), null, { timeout: 150000 });
  await centerCameraOnHex(15, 45);
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const warningBoard = await page.locator('.board-shell').boundingBox();
  if (!warningBoard) throw new Error('Battlefield viewport is missing');
  await writeFile(`Plan/Stages/${capturePrefix}-boss-warning.png`, await page.screenshot({ clip: warningBoard }));
  console.log(`boss-warning visual state: ${JSON.stringify(await page.evaluate(() => window.__aurolithEffectDebug))}`);
  const bossHorn = await page.evaluate(() => ({ warningEvents: window.__aurolithAudioBossWarningEvents, clicks: window.__aurolithAudioClicks }));
  if (bossHorn.warningEvents < 1 || bossHorn.clicks < 2 || !(await page.locator('.boss-alert').innerText()).includes('Gilded Tuskgod')) {
    throw new Error(`Boss warning horn or HUD banner did not appear: ${JSON.stringify(bossHorn)}`);
  }
  const bossAbilityMark = await visualEventMark();
  await page.evaluate(() => { window.__aurolithVisualForceBossAbility = true; });
  await pauseOnVisualEvent({ category: 'boss', type: 'ability' });
  await page.locator('#match-toggle').click();
  await captureWhen('boss-ability', (mark) => window.__aurolithVisualEvents.slice(mark).some((entry) => entry.category === 'boss' && entry.event.type === 'ability'), bossAbilityMark, 60000);
  if (!(await page.locator('#match-toggle').innerText()).startsWith('Resume')) throw new Error('Boss ability event did not pause on its authoritative tick');
  await page.locator('#match-toggle').click();

  const excludedCards = ['card:gold-rush', 'card:xp-surge', 'card:alchemical-landmine', 'card:spike-chokepoint', 'card:decoy-illusion', 'card:ambush-net', 'card:explosive-gas-cloud', 'card:falcon-recon'];
  const findVisibleCard = () => page.locator('#match-cards [data-card]').evaluateAll((buttons, excluded) => buttons.map((button) => button.dataset.card).find((id) => id && !excluded.includes(id)) || null, excludedCards);
  if (!await findVisibleCard()) await page.waitForFunction((excluded) => [...document.querySelectorAll('#match-cards [data-card]')].some((button) => !excluded.includes(button.dataset.card)), excludedCards, { timeout: 120000 });
  const cardId = await findVisibleCard();
  const castable = cardId ? page.locator(`#match-cards [data-card="${cardId}"]`) : null;
  if (!cardId) throw new Error('Opening hand did not contain a non-trap card');
  const cardMark = await visualEventMark();
  await pauseOnVisualEvent({ category: 'card', cardId });
  await castable.click();
  await captureWhen('card-cast', ({ mark, id }) => window.__aurolithVisualEvents.slice(mark).some((entry) => entry.category === 'card' && entry.event.cardId === id), { mark: cardMark, id: cardId }, 10000);
  await page.locator('#minimap').click({ position: await page.locator('#minimap').evaluate((canvas) => ({ x: canvas.clientWidth * 0.5, y: canvas.clientHeight * 0.5 })) });
  const skillMark = await visualEventMark();
  await pauseOnVisualEvent({ category: 'combat', type: 'status-applied' });
  await page.locator('#match-toggle').click();

  // Nami cast, hit and status application are same-tick events; this frame contains all three cues.
  await captureWhen('skill-hit', (mark) => window.__aurolithVisualEvents.slice(mark).some((entry) => entry.category === 'combat' && entry.event.skillId === 'watery-grave' && entry.event.type === 'status-applied'), skillMark, 150000, ['skill-cast', 'status-applied']);
  const unitCues = await page.evaluate(() => window.__aurolithUnitVisualDebug);
  if (!unitCues.some((unit) => unit.status === 'STUN') || !unitCues.some((unit) => unit.cast === 'WATERY GRAVE')) throw new Error(`Skill/status labels were not visible on units: ${JSON.stringify(unitCues)}`);
  const statusExpiryMark = await visualEventMark();
  await pauseOnVisualEvent({ category: 'combat', type: 'status-expired' });
  await page.locator('#match-toggle').click();
  await captureWhen('status-expired', (mark) => window.__aurolithVisualEvents.slice(mark).some((entry) => entry.category === 'combat' && entry.event.skillId === 'watery-grave' && entry.event.type === 'status-expired'), statusExpiryMark);
  if (!(await page.locator('#match-toggle').innerText()).startsWith('Resume')) throw new Error('Status expiry fixture did not pause on its authoritative event');
  await page.evaluate(() => { window.__aurolithVisualGiveTrapCard = true; });
  // Keep the vision-origin fixture stable while clicking its trap tile; 12× speed can move units between frames.
  await page.locator('#match-speed').selectOption('1');
  await page.locator('#match-toggle').click();

  await page.locator('#minimap').click({ position: await page.locator('#minimap').evaluate((canvas) => ({ x: canvas.clientWidth * 0.5, y: canvas.clientHeight * 0.5 })) });
  await page.waitForFunction(() => [...document.querySelectorAll('#match-cards [data-card]')].some((button) => button.dataset.card === 'card:alchemical-landmine'), null, { timeout: 120000 });
  const trapTarget = { col: 79, row: 42 };
  await page.evaluate(() => { window.__aurolithVisualVisionOrigin = { col: 79, row: 44 }; });
  await page.waitForFunction(() => window.__aurolithVisualVisionOrigin === null, null, { timeout: 3000 });
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const trapPlacementMark = await visualEventMark();
  await pauseOnVisualEvent({ category: 'trap', type: 'placed' });
  await page.locator('#match-cards [data-card="card:alchemical-landmine"]').click();
  // This visible field tile is just off the central highway, where the south bot's gate route crosses.
  await clickHex(trapTarget.col, trapTarget.row);
  await captureWhen('trap-placed', (mark) => window.__aurolithVisualEvents.slice(mark).some((entry) => entry.category === 'trap' && entry.event.type === 'placed'), trapPlacementMark, 10000);
  const placedTrap = await page.evaluate(() => window.__aurolithVisualEvents.findLast((entry) => entry.category === 'trap' && entry.event.type === 'placed').event);
  if (placedTrap.col !== trapTarget.col || placedTrap.row !== trapTarget.row) throw new Error(`Trap placement missed its target: ${JSON.stringify(placedTrap)}`);
  await page.evaluate(() => {
    window.__aurolithVisualTrapTarget = { col: 79, row: 42 };
    window.__aurolithVisualTestOrder = { platoonId: 'platoon:south:1', target: { col: 79, row: 42 } };
    window.__aurolithVisualTestOrderQueued = false;
  });
  const trapWarningMark = await visualEventMark();
  await pauseOnVisualEvent({ category: 'trap', type: 'warning' });
  await page.locator('#match-toggle').click();
  await page.waitForTimeout(1500);
  console.log(`Trap visual fixture state: ${JSON.stringify(await page.evaluate(() => window.__aurolithVisualDebugState))}`);
  await captureWhen('trap-warning', (mark) => window.__aurolithVisualEvents.slice(mark).some((entry) => entry.category === 'trap' && entry.event.type === 'warning'), trapWarningMark, 90000);
  const audioState = await page.evaluate(() => ({ warningEvents: window.__aurolithAudioWarningEvents, clicks: window.__aurolithAudioClicks }));
  if (audioState.warningEvents < 1 || audioState.clicks < 1) throw new Error(`Trap warning click did not reach Web Audio: ${JSON.stringify(audioState)}`);
  await pauseOnVisualEvent({ category: 'trap', type: 'detonate' });
  const trapDetonationMark = await visualEventMark();
  await page.locator('#match-toggle').click();
  await captureWhen('trap-detonation', (mark) => window.__aurolithVisualEvents.slice(mark).some((entry) => entry.category === 'trap' && entry.event.type === 'detonate'), trapDetonationMark, 10000);
  await page.evaluate(() => { window.__aurolithVisualTestOrder = null; window.__aurolithVisualTestOrderQueued = false; });
  await page.locator('#match-toggle').click();
  await page.locator('#match-toggle').click();
  await page.waitForTimeout(3500);
  const remainingPulses = await page.evaluate(() => window.__aurolithEffectDebug);
  if (remainingPulses.cardPulses.length || remainingPulses.skillPulses.length || remainingPulses.trapPulses.length) {
    throw new Error(`Timed visual effects did not clear: ${JSON.stringify(remainingPulses)}`);
  }
  console.log('Timed visual pulses cleared after their display windows.');

  if (errors.length) throw new Error(`Browser errors: ${errors.join('; ')}`);
  console.log(`Stage 2 visual acceptance captured boss warning/horn, visible card, Nami skill/status and trap events at 100% zoom. Card: ${cardId}.`);
} finally {
  await browser.close();
}
