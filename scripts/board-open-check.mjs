import { chromium } from 'playwright';

const browser = await chromium.launch({
  executablePath: process.env.AUROLITH_CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--use-angle=swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));

try {
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  const board = page.locator('#board canvas');
  await board.waitFor();
  const canvas = await board.boundingBox();
  if (!canvas || canvas.width < 200 || canvas.height < 200) throw new Error('Board canvas is missing or too small');
  if (!await page.locator('#minimap').isVisible()) throw new Error('Minimap is missing');

  await board.click({ position: { x: canvas.width / 2, y: canvas.height / 2 } });
  const firstSelection = await page.locator('#selection').innerText();
  if (!/Column \d+.*Row \d+/.test(firstSelection)) throw new Error(`Click did not select a hex: ${firstSelection}`);

  const initialZoom = await page.locator('#zoom-value').innerText();
  await page.locator('#zoom-in').click();
  const zoomed = await page.locator('#zoom-value').innerText();
  if (initialZoom === zoomed) throw new Error('Zoom control did not change the camera');

  await page.setViewportSize({ width: 1200, height: 760 });
  await page.waitForFunction((originalWidth) => {
    const canvas = document.querySelector('#board canvas');
    return canvas && canvas.getBoundingClientRect().width < originalWidth;
  }, canvas.width);
  const resized = await board.boundingBox();
  if (!resized) throw new Error('Board canvas disappeared after resize');
  await board.click({ position: { x: resized.width / 2 + 25, y: resized.height / 2 + 20 } });
  const resizedSelection = await page.locator('#selection').innerText();
  if (!/Column \d+.*Row \d+/.test(resizedSelection)) throw new Error(`Selection failed after resize: ${resizedSelection}`);

  await page.locator('#minimap').click({ position: await page.locator('#minimap').evaluate((canvas) => ({ x: canvas.clientWidth * 0.5, y: canvas.clientHeight * 0.1 })) });
  const cameraRow = Number(await page.locator('#minimap').getAttribute('data-camera-row'));
  if (cameraRow < 7 || cameraRow > 12) throw new Error('Map navigation did not reach the north fortress');
  await page.screenshot({ path: 'Assets/Showcases/Board-Prototypes/board-castle-48-preview.png', fullPage: true });
  await page.locator('#fit').click();
  await page.screenshot({ path: 'Assets/Showcases/Board-Prototypes/board-stage1-open.png', fullPage: true });
  await page.locator('#match-rite [data-blessing]').first().click();
  await page.locator('#match-toggle').click();
  await page.waitForFunction(() => document.querySelector('#match-time')?.textContent !== '0:00');
  await page.evaluate(() => { document.querySelector('.inspector').scrollTop = 0; });
  await page.screenshot({ path: 'Assets/Showcases/Board-Prototypes/board-stage1-shroud.png', fullPage: true });

  if (errors.length) throw new Error(`Browser errors: ${errors.join('; ')}`);
  console.log(`Board check passed: canvas ${Math.round(canvas.width)}×${Math.round(canvas.height)}, selection, zoom, resize, region navigation, fit, shroud preview; screenshots saved.`);
} finally {
  await browser.close();
}
