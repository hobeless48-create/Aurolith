import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';

const prefix = process.env.AUROLITH_OUTRIDER_CAPTURE_PREFIX || 'stage2-outrider';
const browser = await chromium.launch({ executablePath: process.env.AUROLITH_CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true, args: ['--use-angle=swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
const evidence = [];
page.on('pageerror', (error) => errors.push(error.message));
await page.addInitScript(() => {
  window.__outriderDraws = [];
  window.__outriderEvents = [];
  window.addEventListener('aurolith:visual-event', ({ detail }) => {
    if (detail.category === 'outrider') window.__outriderEvents.push(detail.event);
  });
  const arc = CanvasRenderingContext2D.prototype.arc;
  const stroke = CanvasRenderingContext2D.prototype.stroke;
  CanvasRenderingContext2D.prototype.arc = function (x, y, radius, ...rest) {
    if (this.canvas.id === 'minimap') this.__lastOutriderArc = { x, y, radius };
    return arc.call(this, x, y, radius, ...rest);
  };
  CanvasRenderingContext2D.prototype.stroke = function (...args) {
    if (this.canvas.id === 'minimap' && /^rgba?\(255,\s*100,\s*82[,)]/.test(this.strokeStyle)) {
      window.__outriderDraws.push({ ...this.__lastOutriderArc, at: performance.now(), color: this.strokeStyle });
    }
    return stroke.apply(this, args);
  };
});

try {
  for (const owner of ['north', 'south']) {
    await page.goto(process.env.AUROLITH_DEV_URL || 'http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
    await page.locator('#match-toggle').waitFor();
    await page.locator('#match-rite [data-blessing]').first().click();
    await page.evaluate((side) => {
      window.__aurolithVisualOutriderFixture = side;
      window.__aurolithVisualPauseOn = { category: 'outrider' };
    }, owner);
    await page.locator('#match-toggle').click();
    await page.waitForFunction(() => !!window.__aurolithVisualOutriderResult, null, { timeout: 15000 });
    if (owner === 'north') {
      await page.waitForFunction(() => window.__outriderDraws.some((draw) => draw.radius >= 6));
      // Copy the actual canvas immediately: screenshot layout/stability waits can outlast a short pulse.
      const pixels = await page.locator('#minimap').evaluate((canvas) => canvas.toDataURL('image/png').split(',')[1]);
      await writeFile(`Plan/Stages/${prefix}-owner-pulse.png`, Buffer.from(pixels, 'base64'));
    } else if ((await page.locator('#match-toggle').innerText()).startsWith('Pause')) {
      await page.locator('#match-toggle').click();
    }
    const initial = await page.evaluate(() => ({
      fixture: window.__aurolithVisualOutriderResult,
      events: window.__outriderEvents,
      draws: window.__outriderDraws,
      width: document.querySelector('#minimap').width, height: document.querySelector('#minimap').height,
    }));
    if (JSON.stringify(initial.fixture.emittedOwners) !== JSON.stringify([`player:${owner}`])) throw new Error(`Fixture did not emit the expected authoritative alert: ${JSON.stringify(initial)}`);
    if (owner === 'north') {
      if (initial.fixture.projectedCount !== 1 || initial.events.length !== 1 || !initial.draws.length) throw new Error('Own alert failed to reach minimap rendering');
      const event = initial.events[0];
      const expectedX = (event.col + 0.5) * initial.width / 150;
      const expectedY = (event.row + 0.5) * initial.height / 90;
      if (initial.draws.some((draw) => Math.abs(draw.x - expectedX) > 0.01 || Math.abs(draw.y - expectedY) > 0.01)) throw new Error('Alert pulse was drawn at the wrong minimap location');
      await page.waitForTimeout(2100);
      const before = await page.evaluate(() => window.__outriderDraws.length);
      await page.waitForTimeout(350);
      const after = await page.evaluate(() => window.__outriderDraws.length);
      if (before !== after) throw new Error('Expired Outrider pulse continued drawing while paused');
      const radii = await page.evaluate(() => window.__outriderDraws.map((draw) => draw.radius));
      if (Math.max(...radii) - Math.min(...radii) < 4) throw new Error('Alert ring did not expand over its display window');
      await page.locator('#minimap').screenshot({ path: `Plan/Stages/${prefix}-expired.png` });
      evidence.push({ owner, ...initial.fixture, event, drawCount: after, correctCoordinates: true, expands: true, expiredWhilePaused: true });
    } else {
      if (initial.fixture.projectedCount !== 0 || initial.events.length || initial.draws.length) throw new Error('Opponent-only alert leaked onto the north player minimap');
      await page.locator('#minimap').screenshot({ path: `Plan/Stages/${prefix}-opponent-filtered.png` });
      evidence.push({ owner, ...initial.fixture, eventCount: initial.events.length, drawCount: initial.draws.length });
    }
  }
  if (errors.length) throw new Error(`Page errors: ${errors.join('; ')}`);
  await writeFile(`Plan/Stages/${prefix}.json`, JSON.stringify({ scenario: 'DEV-positioned encounters, real stepMatch emission and owner projection, actual Canvas minimap strokes', evidence, errors }, null, 2));
  console.log(JSON.stringify({ evidence, errors }));
} finally { await browser.close(); }
