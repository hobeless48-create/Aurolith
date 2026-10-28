import { chromium } from 'playwright';

const chrome = process.env.AUROLITH_CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await chromium.launch({ executablePath: chrome, headless: true, args: ['--use-angle=swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));

function center(col, row) {
  const width = Math.sqrt(3) * 20;
  return { x: width * (col + 0.5 * (row & 1)) + width / 2, y: 30 * row + 20 };
}

async function gameSeconds() {
  const [minutes, seconds] = (await page.locator('#match-time').innerText()).split(':').map(Number);
  return minutes * 60 + seconds;
}

async function waitForGameTime(seconds, timeout = 120000) {
  await page.waitForFunction((target) => {
    const [minutes, seconds] = (document.querySelector('#match-time')?.textContent || '0:00').split(':').map(Number);
    return minutes * 60 + seconds >= target || !document.querySelector('#match-result')?.hidden;
  }, seconds, { timeout });
  if (!await page.locator('#match-result').isHidden()) throw new Error(`Match ended early at ${await gameSeconds()}: ${await page.locator('#match-result').innerText()}`);
}

async function orderAt(col, row, focusCol, focusRow, scale) {
  const board = page.locator('#board canvas');
  const rect = await board.boundingBox();
  if (!rect) throw new Error('Board canvas missing');
  const target = center(col, row);
  const focus = center(focusCol, focusRow);
  const position = { x: rect.width / 2 + (target.x - focus.x) * scale, y: rect.height / 2 + (target.y - focus.y) * scale };
  for (let attempt = 0; attempt < 3; attempt++) {
    if (position.x < 0 || position.x > rect.width || position.y < 0 || position.y > rect.height) throw new Error(`Order target ${col}:${row} outside camera`);
    await board.click({ position });
    const selected = await page.locator('#selection').innerText();
    const match = selected.match(/Column\s+(\d+).*Row\s+(\d+)/s);
    if (!match) throw new Error(`Could not inspect order target: ${selected}`);
    const actualCol = Number(match[1]);
    const actualRow = Number(match[2]);
    if (actualCol === col && actualRow === row) break;
    const actual = center(actualCol, actualRow);
    position.x += (target.x - actual.x) * scale;
    position.y += (target.y - actual.y) * scale;
    if (attempt === 2) throw new Error(`Could not aim at ${col}:${row}; last selection was ${actualCol}:${actualRow}`);
  }
  await board.click({ button: 'right', position });
  const text = await page.locator('#match-feedback').innerText();
  if (!text.includes(`${col}:${row}`) && !text.includes('command accepted')) throw new Error(`Order aimed at ${col}:${row}, UI said: ${text}`);
}

async function orderCamp() {
  const camp = center(14, 33);
  const minimap = page.locator('#minimap');
  const rect = await minimap.boundingBox();
  if (!rect) throw new Error('Minimap missing');
  await minimap.click({ position: { x: rect.width * camp.x / (150.5 * Math.sqrt(3) * 20), y: rect.height * camp.y / (89 * 30 + 40) } });
  await orderAt(14, 33, 14, 33, 0.45);
}

async function pause() {
  if ((await page.locator('#match-toggle').innerText()).startsWith('Pause')) await page.locator('#match-toggle').click();
}

async function resume() {
  if ((await page.locator('#match-toggle').innerText()).startsWith('Resume')) await page.locator('#match-toggle').click();
}

async function runScenario(round) {
  if (!await page.locator('.economy-group').evaluate((element) => element.open)) await page.locator('.economy-group > summary').click();
  await page.locator('#match-speed').selectOption('24');
  await page.locator('#match-rite [data-blessing]').first().click();
  await page.locator('#match-toggle').click();
  await orderCamp();
  await page.locator('#match-stance').selectOption('aggressive');

  await page.waitForFunction(() => Number(document.querySelector('#match-gold')?.textContent) >= 60, null, { timeout: 30000 });
  await page.locator('[data-platoon="2"]').click();
  await page.locator('#match-recruit').selectOption('unit-def:sapper-drox');
  await page.locator('#match-hire').click();
  await page.locator('#match-stance').selectOption('aggressive');
  await page.locator('#match-focus').selectOption('siege');
  await page.waitForFunction(() => document.querySelector('[data-platoon="2"] small')?.textContent === '1/5', null, { timeout: 30000 });

  await waitForGameTime(240);
  if (Number(await page.locator('#match-ore').innerText()) <= 0) throw new Error(`Round ${round}: no jungle camp material by 4:00`);
  await pause();
  await page.locator('#minimap').click({ position: await page.locator('#minimap').evaluate((canvas) => ({ x: canvas.clientWidth * 0.5, y: canvas.clientHeight * 0.9 })) });
  await page.locator('[data-platoon="1"]').click();
  await orderAt(86, 69, 75, 80, 0.49);
  await page.locator('[data-platoon="2"]').click();
  await orderAt(86, 69, 75, 80, 0.49);
  await resume();

  await page.waitForFunction(() => document.querySelector('#match-outer-wall')?.textContent === 'Breached' || !document.querySelector('#match-result')?.hidden, null, { timeout: 120000 });
  if (await page.locator('#match-outer-wall').innerText() !== 'Breached') throw new Error(`Round ${round}: outer wall did not breach; ${await page.locator('#match-result').innerText()}`);
  await pause();
  await page.locator('[data-platoon="1"]').click();
  await orderAt(86, 80, 75, 80, 0.49);
  await page.locator('[data-platoon="2"]').click();
  await orderAt(86, 80, 75, 80, 0.49);
  await resume();

  await page.waitForFunction(() => document.querySelector('#match-inner-wall')?.textContent === 'Breached' || !document.querySelector('#match-result')?.hidden, null, { timeout: 120000 });
  if (await page.locator('#match-inner-wall').innerText() !== 'Breached') throw new Error(`Round ${round}: inner wall did not breach; ${await page.locator('#match-result').innerText()}`);
  await pause();
  await page.locator('[data-platoon="1"]').click();
  await orderAt(75, 84, 75, 80, 0.49);
  await page.locator('[data-platoon="2"]').click();
  await orderAt(75, 84, 75, 80, 0.49);
  await resume();

  await page.locator('#match-result:not([hidden])').waitFor({ timeout: 120000 });
  const outcome = await page.locator('#match-result').innerText();
  const clock = await page.locator('#match-time').innerText();
  const hash = await page.locator('#match-hash').innerText();
  console.log(`Round ${round}: ${outcome} at ${clock}; ${hash}`);
  if (round === 1) {
    await page.locator('#match-result').scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'Assets/Showcases/Board-Prototypes/stage1-result.png' });
  }
  return outcome;
}

try {
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  const first = await runScenario(1);
  await page.locator('#match-reset').click();
  if (await page.locator('#match-time').innerText() !== '0:00' || !await page.locator('#match-result').isHidden()) throw new Error('Restart did not reset the match');
  const second = await runScenario(2);
  if (first !== second) throw new Error(`Same-seed replay diverged: ${first} vs ${second}`);
  if (errors.length) throw new Error(`Browser errors: ${errors.join('; ')}`);
  console.log('Stage 1 browser playthrough passed twice with the same result and no page errors.');
} finally {
  await browser.close();
}
