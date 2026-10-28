import { chromium } from 'playwright';

const executablePath = process.env.AUROLITH_CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await chromium.launch({ executablePath, headless: true, args: ['--use-angle=swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
const capturePrefix = process.env.AUROLITH_SMOKE_CAPTURE_PREFIX || 'stage2-smoke';
page.on('pageerror', (error) => errors.push(error.message));
try {
  await page.goto(process.env.AUROLITH_DEV_URL || 'http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  await page.locator('#match-toggle').waitFor();
  await page.waitForFunction(() => Array.isArray(window.__aurolithUnitVisualDebug) && window.__aurolithUnitVisualDebug.filter((unit) => unit.id.startsWith('unit:north:') && unit.portrait).length === 5);
  if (await page.locator('.sidebar').count()) throw new Error('Removed left navigation rail returned');
  await page.locator('#help-toggle').click();
  if (!await page.locator('#keyboard-help').isVisible()) throw new Error('Help button did not open keyboard guide');
  await page.keyboard.press('KeyP');
  if (!await page.locator('#keyboard-help').isHidden()) throw new Error('P did not close keyboard guide outside battlefield focus');
  await page.keyboard.press('KeyP');
  if (!await page.locator('#keyboard-help').isVisible()) throw new Error('P did not open keyboard guide');
  await page.locator('#help-close').click();
  if ((await page.locator('#match-time').innerText()) !== '0:00' || !(await page.locator('#match-toggle').innerText()).startsWith('Start match')) throw new Error('Help interaction started the match');
  const minimap = page.locator('#minimap');
  if ((await page.locator('#zoom-value').innerText()).trim() !== '100%') throw new Error('Opening camera did not start at 100% zoom');
  if (!(await page.locator('.mini-header').innerText()).includes('MAP OVERVIEW')) throw new Error('Floating map overview is missing its heading');
  await page.screenshot({ path: `Plan/Stages/${capturePrefix}-initial.png` });
  const startCamera = await minimap.getAttribute('data-camera-col');
  const startCameraRow = await minimap.getAttribute('data-camera-row');
  await minimap.click({ position: await minimap.evaluate((canvas) => ({ x: canvas.clientWidth * 0.95, y: canvas.clientHeight * 0.95 })) });
  const jumpedCamera = await minimap.getAttribute('data-camera-col');
  const jumpedCameraRow = await minimap.getAttribute('data-camera-row');
  if (!startCamera || !startCameraRow || !jumpedCamera || !jumpedCameraRow
    || Math.abs(Number(jumpedCamera) - Number(startCamera)) < 20 || Math.abs(Number(jumpedCameraRow) - Number(startCameraRow)) < 20) throw new Error('Map click did not jump the camera to the clicked region');
  if ((await page.locator('#zoom-value').innerText()).trim() !== '100%') throw new Error('Map jump unexpectedly changed the camera zoom');
  await minimap.click({ position: await minimap.evaluate((canvas) => ({ x: canvas.clientWidth * 0.5, y: canvas.clientHeight * 0.5 })) });
  await page.waitForTimeout(250);
  if ((await page.locator('#zoom-value').innerText()).trim() !== '100%') throw new Error('Region jump unexpectedly changed the camera zoom');
  await page.screenshot({ path: `Plan/Stages/${capturePrefix}-environment.png` });
  if (await page.locator('#match-roster [data-unit]').count() !== 5) throw new Error('Opening roster did not show five units');
  await page.locator('.roster-group > summary').click();
  await page.locator('#match-roster [data-unit="unit:north:2"]').click();
  if (await page.locator('#match-unit').inputValue() !== 'unit:north:2' || !(await page.locator('#match-unit-detail').innerText()).includes('Tidecaller Nami')) throw new Error('Roster selection did not show the unit or sync controls');
  await page.locator('#match-formation-rank').selectOption('2');
  await page.locator('#match-set-rank').click();
  if (await page.locator('#match-cards [data-card]').count() !== 3) throw new Error('Opening hand did not contain three cards');
  if (await page.locator('#match-cards [data-card] small').count() !== 3) throw new Error('Card effects are not readable in the dock');
  if (await page.locator('#match-rite [data-blessing]').count() !== 3) throw new Error('Opening Rite did not contain three blessings');
  const board = page.locator('#board canvas');
  await board.focus();
  await page.keyboard.press('Digit1');
  if (!(await page.locator('#match-feedback').innerText()).includes('queued')) throw new Error('Rite keyboard choice was not queued');
  await page.locator('#match-toggle').click();
  await page.locator('#match-blessings').filter({ hasNotText: 'Chosen: none' }).waitFor({ timeout: 3000 });
  await page.waitForFunction(() => document.querySelector('#match-formation-rank')?.value === '2', null, { timeout: 3000 });
  await page.waitForFunction(() => document.querySelector('#match-unit-detail')?.textContent?.includes('Rank 2, slot 2'), null, { timeout: 3000 });
  await page.locator('#match-toggle').focus();
  await page.keyboard.press('KeyO');
  if (!(await page.locator('#match-toggle').innerText()).startsWith('Resume')) throw new Error('O did not pause from a control button');
  const pausedClock = await page.locator('#match-time').innerText();
  await page.waitForTimeout(350);
  if ((await page.locator('#match-time').innerText()) !== pausedClock) throw new Error('Paused clock continued advancing');
  await page.keyboard.press('KeyP');
  if (!await page.locator('#keyboard-help').isVisible() || !(await page.locator('#match-toggle').innerText()).startsWith('Resume')) throw new Error('P did not open help while preserving pause');
  await page.keyboard.press('KeyP');
  await page.keyboard.press('KeyO');
  if (!(await page.locator('#match-toggle').innerText()).startsWith('Pause')) throw new Error('O did not resume');
  await page.locator('#match-stance').focus();
  await page.keyboard.press('KeyP');
  await page.keyboard.press('KeyO');
  if (!await page.locator('#keyboard-help').isHidden() || !(await page.locator('#match-toggle').innerText()).startsWith('Pause')) throw new Error('Global help/pause keys overrode a select field');
  await page.locator('#match-formation-slot').selectOption('3');
  await page.locator('#match-set-slot').click();
  await page.waitForFunction(() => document.querySelector('#match-unit-detail')?.textContent?.includes('Rank 2, slot 3'), null, { timeout: 3000 });
  await board.focus();
  await page.keyboard.press('Digit2');
  if (!await page.locator('[data-platoon="2"]').evaluate((element) => element.classList.contains('active'))) throw new Error('Platoon hotkey did not select Platoon 2');
  await page.keyboard.press('KeyA');
  await page.locator('#match-feedback').filter({ hasText: 'aggressive stance queued' }).waitFor();
  await page.waitForFunction(() => document.querySelector('#match-stance')?.value === 'aggressive', null, { timeout: 3000 });
  for (const [key, focus] of [['KeyX', 'backline'], ['KeyC', 'siege'], ['KeyZ', 'frontline']]) {
    await page.keyboard.press(key);
    await page.waitForFunction((value) => document.querySelector('#match-focus')?.value === value, focus, { timeout: 3000 });
  }
  await page.keyboard.press('KeyG');
  await page.waitForFunction(() => document.querySelector('#match-macro-state')?.textContent === 'Macro: Gather', null, { timeout: 3000 });
  await page.locator('[data-macro-shortcut="KeyG"]').click();
  await page.waitForFunction(() => document.querySelector('#match-macro-state')?.textContent === 'Macro: Standard', null, { timeout: 3000 });
  await page.locator('[data-macro-shortcut="KeyG"]').click();
  await page.waitForFunction(() => document.querySelector('#match-macro-state')?.textContent === 'Macro: Gather', null, { timeout: 3000 });
  await page.locator('#match-speed').selectOption('4');
  const handCards = await page.locator('#match-cards [data-card]').evaluateAll((buttons) => buttons.map((button) => button.dataset.card));
  const trapCards = new Set(['card:alchemical-landmine', 'card:spike-chokepoint', 'card:decoy-illusion', 'card:ambush-net', 'card:explosive-gas-cloud']);
  const cardSlot = handCards.findIndex((card) => !trapCards.has(card));
  if (cardSlot < 0) throw new Error('Opening hand had no castable non-trap card');
  await board.focus();
  await page.keyboard.press(['KeyQ', 'KeyW', 'KeyE', 'KeyT', 'KeyY', 'KeyU'][cardSlot]);
  await page.waitForFunction(() => document.querySelectorAll('#match-cards [data-card]').length === 2, null, { timeout: 3000 });
  try {
    await page.waitForFunction(() => Number(document.querySelector('#match-gold')?.textContent) >= 60, null, { timeout: 16000 });
  } catch {
    const state = await page.evaluate(() => ({ clock: document.querySelector('#match-time')?.textContent, gold: document.querySelector('#match-gold')?.textContent, phase: document.querySelector('#match-phase')?.textContent, feedback: document.querySelector('#match-feedback')?.textContent }));
    throw new Error(`Passive-income smoke timed out: ${JSON.stringify(state)}; page errors: ${errors.join('; ') || 'none'}`);
  }
  await page.locator('[data-platoon="2"]').click();
  await page.locator('.economy-group > summary').click();
  await page.locator('#match-recruit').selectOption('unit-def:jungle-stalker');
  await page.locator('#match-hire').click();
  await page.locator('#match-feedback').filter({ hasText: /commands? accepted/ }).waitFor({ timeout: 3000 });
  await page.waitForFunction(() => document.querySelectorAll('#match-roster [data-unit]').length === 6, null, { timeout: 3000 });
  await board.focus();
  await page.keyboard.press('KeyJ');
  await page.waitForFunction(() => document.querySelector('#match-macro-state')?.textContent === 'Macro: Outrider', null, { timeout: 3000 });
  await page.waitForFunction(() => Number(document.querySelector('#match-gold')?.textContent) >= 150, null, { timeout: 22000 });
  await page.locator('.build-group > summary').click();
  await page.locator('#match-facility-slot').selectOption('facility-slot:north:5');
  await page.locator('#match-facility-kind').selectOption('arcane-barrier');
  if (!await page.locator('#match-build-facility').isDisabled()) throw new Error('Arcane Barrier was offered in an inner keep slot');
  await page.locator('#match-facility-slot').selectOption('facility-slot:north:1');
  await page.locator('#match-facility-kind').selectOption('sanctuary');
  await page.locator('#match-build-facility').click();
  await page.waitForFunction(() => document.querySelector('#match-facility-slot option')?.textContent?.includes('Sanctuary T1'), null, { timeout: 9000 });
  if (await page.locator('#match-core-battery').innerText() !== 'Armed below 50%') throw new Error('Core battery did not show its armed state');
  await page.waitForFunction(() => Number(document.querySelector('#match-gold')?.textContent) >= 100, null, { timeout: 16000 });
  const beforeTraining = Number(await page.locator('#match-xp').innerText());
  await page.locator('#match-train-commander').click();
  await page.waitForFunction((before) => Number(document.querySelector('#match-xp')?.textContent) >= before + 100, beforeTraining, { timeout: 3000 });
  await page.waitForFunction(() => Number(document.querySelector('#match-gold')?.textContent) >= 630, null, { timeout: 25000 });
  for (const [slot, kind, label] of [['facility-slot:north:2', 'ballista', 'Ballista T1'], ['facility-slot:north:3', 'arcane-barrier', 'Arcane Barrier T1']]) {
    await page.locator('#match-facility-slot').selectOption(slot);
    await page.locator('#match-facility-kind').selectOption(kind);
    await page.locator('#match-build-facility').click();
    await page.waitForFunction(({ id, text }) => [...document.querySelector('#match-facility-slot').options].some((option) => option.value === id && option.textContent.includes(text)), { id: slot, text: label }, { timeout: 9000 });
  }
  await page.locator('#match-facility-slot').selectOption('facility-slot:north:4');
  await page.locator('#match-facility-kind').selectOption('ballista');
  if (!await page.locator('#match-build-facility').isDisabled() || !(await page.locator('#match-build-facility').getAttribute('title')).includes('category is full')) throw new Error('Fourth combat facility was not disabled with an explanation');
  await page.locator('#match-facility-kind').selectOption('caravan-post');
  if (await page.locator('#match-build-facility').isDisabled()) throw new Error('Combat cap incorrectly blocked an available production facility');
  await page.locator('#match-material').selectOption('Gilded Ore');
  for (let amount = 1; amount <= 2; amount++) {
    await page.locator('#match-buy-material').click();
    await page.waitForFunction((count) => document.querySelector('#match-item-stock')?.textContent?.includes(`Ore ${count}`), amount, { timeout: 3000 });
  }
  await page.locator('#match-item').selectOption('item:executioners-claw');
  await page.locator('#match-item-unit').selectOption('unit:north:3');
  if (await page.locator('#match-craft-item').isDisabled()) throw new Error('Eligible resource-station crafter could not craft');
  await page.locator('#match-craft-item').click();
  try {
    await page.waitForFunction(() => document.querySelector('#match-item-stock')?.textContent?.includes("Executioner's Claw 1"), null, { timeout: 15000 });
  } catch {
    const state = await page.evaluate(() => ({ clock: document.querySelector('#match-time')?.textContent, toggle: document.querySelector('#match-toggle')?.textContent, stock: document.querySelector('#match-item-stock')?.textContent, status: document.querySelector('#match-item-status')?.textContent, feedback: document.querySelector('#match-feedback')?.textContent }));
    throw new Error(`Craft did not finish: ${JSON.stringify(state)}`);
  }
  await page.locator('#match-item-unit').selectOption('unit:north:1');
  await page.locator('#match-equip-item').click();
  await page.waitForFunction(() => document.querySelector('#match-item-stock')?.textContent?.includes("Executioner's Claw 0"), null, { timeout: 7000 });
  await page.locator('#match-roster [data-unit="unit:north:1"]').click();
  await page.waitForFunction(() => document.querySelector('#match-unit-detail')?.textContent?.includes("Executioner's Claw"), null, { timeout: 7000 });
  await page.locator('[data-platoon="2"]').click();
  if (!(await page.locator('[data-platoon="2"]').innerText()).includes('1/5')) throw new Error('Recruit did not enter Platoon 2');
  await minimap.click({ position: await minimap.evaluate((canvas) => ({ x: canvas.clientWidth * 0.5, y: canvas.clientHeight * 0.5 })) });
  const rect = await board.boundingBox();
  if (!rect) throw new Error('Board canvas is missing');
  await board.click({ button: 'right', position: { x: rect.width / 2, y: rect.height / 2 } });
  await page.locator('#match-feedback').filter({ hasText: /commands? accepted/ }).waitFor({ timeout: 3000 });
  await page.locator('#match-reset').click();
  if ((await page.locator('#match-time').innerText()) !== '0:00') throw new Error('Reset did not restore match clock');
  if (errors.length) throw new Error(`Browser errors: ${errors.join('; ')}`);
  console.log('Browser smoke passed: help button/P, O pause/resume, select-field guards, 100% camera/map, expandable management groups, roster/formation, Rite/platoon/stance/focus/macros/cards, hiring/training, Sanctuary, facility-category cap/explanation, material purchase/craft/equip, order and reset');
} finally {
  await browser.close();
}
