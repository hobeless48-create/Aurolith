import { chromium } from 'playwright';

const executablePath = process.env.AUROLITH_CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const baseUrl = process.env.AUROLITH_DEV_URL || 'http://127.0.0.1:5173/';
const capturePrefix = process.env.AUROLITH_TERRAIN_CAPTURE_PREFIX || 'stage2-terrain';
const browser = await chromium.launch({ executablePath, headless: true, args: ['--use-angle=swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));

try {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.locator('#match-toggle').waitFor();
  const minimap = page.locator('#minimap');
  const scenes = [
    { name: 'west-jungle', x: 0.08, y: 0.5, col: 12, row: 45 },
    { name: 'central-field-path', x: 0.5, y: 0.5, col: 75, row: 45 },
    { name: 'east-jungle', x: 0.92, y: 0.5, col: 138, row: 45 },
    { name: 'north-fortress', x: 0.5, y: 0.1, col: 75, row: 9 },
    { name: 'south-fortress', x: 0.5, y: 0.9, col: 75, row: 80 },
  ];

  for (const scene of scenes) {
    const bounds = await minimap.boundingBox();
    if (!bounds) throw new Error('Floating map is missing');
    await minimap.click({ position: { x: bounds.width * scene.x, y: bounds.height * scene.y } });
    await page.waitForFunction(({ col, row }) => {
      const map = document.querySelector('#minimap');
      return map?.dataset.cameraCol && Math.abs(Number(map.dataset.cameraCol) - col) < 4
        && Math.abs(Number(map.dataset.cameraRow) - row) < 4;
    }, scene);
    if ((await page.locator('#zoom-value').innerText()).trim() !== '100%') throw new Error(`Map jump changed zoom for ${scene.name}`);
    await page.locator('.board-shell').screenshot({ path: `Plan/Stages/${capturePrefix}-${scene.name}.png` });
    console.log(`Captured ${scene.name} at ${await minimap.getAttribute('data-camera-col')},${await minimap.getAttribute('data-camera-row')} and 100% zoom`);
  }

  if (errors.length) throw new Error(`Browser errors: ${errors.join('; ')}`);
  console.log('Stage 2 terrain review captured all five terrain/castle regions without browser errors.');
} finally {
  await browser.close();
}
