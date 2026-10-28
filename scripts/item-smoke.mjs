import { chromium } from 'playwright';

const executablePath = process.env.AUROLITH_CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await chromium.launch({ executablePath, headless: true, args: ['--use-angle=swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
try {
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  await page.locator('#match-speed').selectOption('24');
  await page.locator('#match-toggle').click();
  await page.waitForFunction(() => Number(document.querySelector('#match-gold')?.textContent) >= 335, null, { timeout: 12000 });
  await page.locator('#match-buy-material').click();
  await page.waitForFunction(() => document.querySelector('#match-item-stock')?.textContent?.includes('Ore 1'), null, { timeout: 3000 });
  await page.locator('#match-buy-material').click();
  await page.waitForFunction(() => document.querySelector('#match-item-stock')?.textContent?.includes('Ore 2'), null, { timeout: 3000 });
  await page.locator('#match-item-unit').selectOption('unit:north:3');
  await page.locator('#match-craft-item').click();
  await page.locator('#match-item-status').filter({ hasText: 'Crafting Executioner' }).waitFor({ timeout: 3000 });
  await page.waitForFunction(() => document.querySelector('#match-item-stock')?.textContent?.includes("Executioner's Claw 1"), null, { timeout: 5000 });
  await page.locator('#match-item-unit').selectOption('unit:north:1');
  await page.locator('#match-equip-item').click();
  await page.locator('#match-item-status').filter({ hasText: 'Equipping Executioner' }).waitFor({ timeout: 3000 });
  await page.waitForFunction(() => document.querySelector('#match-item-unit option[value="unit:north:1"]')?.textContent?.includes("Executioner's Claw"), null, { timeout: 5000 });
  if (errors.length) throw new Error(`Browser errors: ${errors.join('; ')}`);
  console.log('Item browser smoke passed: Bazaar purchase, station craft, Arsenal stock, field equip');
} finally {
  await browser.close();
}
