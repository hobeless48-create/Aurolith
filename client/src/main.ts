import { Application, Assets, Container, FillPattern, Graphics, Matrix, Rectangle, Sprite, Text, Texture } from 'pixi.js';
import {
  BOARD_COLUMNS, BOARD_HEIGHT, BOARD_ROWS, BOARD_TILE_COUNT, BOARD_WIDTH, CASTLE_FIRST_COLUMN, CASTLE_LAST_COLUMN,
  getHex, hexCenter, HEX_SIZE, HEX_WIDTH, ROW_HEIGHT, worldToHex,
  botCommands, commanderLevelForXp, computeVision, createInitialState, fixtureCatalog, guildContracts, hirePriceGold, projectCardCastEvents, projectCombatEvents, projectBossCombatEvents, projectFacilityAttackEvents, projectTrapEvents, projectOutriderAlertEvents, projectPlayerView, stateHash, stepMatch, isTrapCardId, TRAP_CARD_KINDS, validTrapHex,
  extraDrawPriceGold, ITEM_FIXTURES, resourceStation, projectItemEvents, facilityCategory, facilityFootprint, maxUnitHp,
  FIXTURE_BLESSINGS, canDetectBrushOccupant,
  type Command, type CommandEnvelope, type FacilityKind, type Hex, type MatchState, type SceneryProp, type PlayerViewState, type Terrain,
} from '@aurolith/shared';
import './style.css';
import './theme.css';

declare global {
  interface Window {
    __aurolithCameraDebug?: { scale: number; offsetX: number; offsetY: number; screenWidth: number; screenHeight: number };
    __aurolithVisualTestOrder?: { platoonId: string; target: Hex } | null;
    __aurolithVisualTestOrderQueued?: boolean;
    __aurolithVisualTrapTarget?: Hex | null;
    __aurolithVisualVisionOrigin?: Hex | null;
    __aurolithVisualForceBossAbility?: boolean;
    __aurolithVisualGiveTrapCard?: boolean;
    __aurolithVisualOutriderFixture?: 'north' | 'south' | null;
    __aurolithVisualOutriderResult?: { emittedOwners: string[]; projectedCount: number };
    __aurolithVisualPauseOn?: { category: string; type?: string; cardId?: string } | null;
    __aurolithVisualHoldEffects?: boolean;
    __aurolithVisualDebugState?: unknown;
    __aurolithAudioWarningEvents?: number;
    __aurolithAudioBossWarningEvents?: number;
    __aurolithEffectDebug?: unknown;
    __aurolithUnitVisualDebug?: unknown;
  }
}

const COLORS: Record<Terrain, number> = {
  cloud: 0xdce4e1, jungle: 0x176f51, clearing: 0x5a9e64, field: 0x9cb978,
  highway: 0xcba34d, fortress: 0xd6d0bc, wall: 0x626b70,
  gate: 0xd4af37, altar: 0xffcf65,
};
const LABELS: Record<Terrain, string> = {
  cloud: 'Cloud barrier', jungle: 'Deep jungle', clearing: 'Jungle clearing', field: 'Open field',
  highway: 'Path (+10% movement)', fortress: 'Castle grounds', wall: 'Castle wall',
  gate: 'Front gate', altar: 'Central altar',
};
const SCENERY_LABELS: Record<SceneryProp, string> = { boulder: 'Craggy boulders', tree: 'Solitary tree', fence: 'Low stone fence', canopy: 'Canopy trees' };
const CHUNK = 15;
const root = document.querySelector<HTMLDivElement>('#app')!;
root.innerHTML = `
  <header class="topbar"><div class="brand"><span class="brand-mark">✦</span><div><strong>AUROLITH</strong><small>STAGE 2 | LOCAL MATCH</small></div></div><div class="top-status"><span class="status-dot"></span> BOARD ONLINE <span class="status-separator">/</span> ${BOARD_COLUMNS} × ${BOARD_ROWS} HEXES <span class="status-separator">/</span> ${BOARD_TILE_COUNT.toLocaleString()} CELLS</div><div class="top-pill">LOCAL MATCH <span>02</span></div></header>
  <main class="layout">
  <section class="board-shell"><div id="board" aria-label="Interactive hex board"></div><div class="board-vignette"></div><div class="map-tag"><span class="tag-line"></span> AUROLITH · PRIMARY CONTINENT <span class="tag-coordinate">150 × 90</span></div><div class="compass">N <span>✥</span> S</div><div class="zoom-controls"><button id="zoom-in" aria-label="Zoom in">+</button><button id="zoom-out" aria-label="Zoom out">−</button><button id="fit" aria-label="Fit entire board">⤢</button></div><div class="bottom-overlay"><div class="scale-label"><span class="scale-line"></span><b id="zoom-value">100%</b> ZOOM</div><div class="hint">DRAG TO EXPLORE <span>·</span> SCROLL TO ZOOM <span>·</span> CLICK A HEX TO INSPECT</div></div></section>
  <aside class="inspector"><div class="eyebrow">MATCH DETAILS <span>LIVE</span></div><div class="mini-heading">Your<br><em>battlefield.</em></div><p class="inspector-copy">Select a hex to see its terrain and whether it is passable.</p><div class="section-label">SELECTED HEX</div><div id="selection" class="selection"><div class="selection-icon">⌖</div><strong>No hex selected</strong><small>Click anywhere on the board</small></div><div class="stats"><div><span>JUNGLE FLANKS</span><b>30 × 50</b></div><div><span>CASTLE SIZE</span><b>48 × 20</b></div><div><span>CLOUD CORNERS</span><b>4 <small>blocked</small></b></div></div><div class="inspector-footer"><span class="status-dot"></span> LOCAL MATCH - FULL BOARD</div></aside></main>`;

document.querySelector<HTMLElement>('.stats')!.innerHTML = '<div><span>JUNGLE FLANKS</span><b>30 × 50</b></div><div><span>CASTLE SIZE</span><b>48 × 20</b></div><div><span>CLOUD CORNERS</span><b>4 <small>blocked</small></b></div>';
document.querySelector('.board-shell')!.insertAdjacentHTML('beforeend', '<div class="mini-wrap" aria-label="Map overview"><div class="mini-header"><strong>MAP OVERVIEW</strong><span>CLICK TO JUMP</span></div><canvas id="minimap" width="360" height="187" aria-label="Whole map with camera view and spotted units"></canvas><div class="mini-legend"><span><i class="own-dot"></i>Your units</span><span><i class="enemy-dot"></i>Spotted enemy</span></div></div>');

document.querySelector('.board-shell')!.insertAdjacentHTML('beforeend', `<div class="help-launcher"><button id="help-toggle" type="button" aria-expanded="false" aria-controls="keyboard-help" title="Keyboard help (P)">? <kbd>P</kbd></button><section id="keyboard-help" class="keyboard-help" aria-label="Keyboard controls" hidden><div class="keyboard-help-heading"><strong>Keyboard controls</strong><button id="help-close" type="button" aria-label="Close keyboard help">×</button></div><div class="shortcut-list"><span><kbd>1-4</kbd> Select platoon</span><span><kbd>A</kbd><kbd>D</kbd><kbd>R</kbd> Aggressive / Defensive / Retreat</span><span><kbd>Z</kbd><kbd>X</kbd><kbd>C</kbd> Frontline / Backline / Siege focus</span><span><kbd>G</kbd> Gather / <kbd>J</kbd> Outrider</span><span><kbd>Q</kbd><kbd>W</kbd><kbd>E</kbd><kbd>T</kbd><kbd>Y</kbd><kbd>U</kbd> Play a card</span><span><kbd>F1-F4</kbd> Jump to platoon / <kbd>H</kbd> Home</span><span><kbd>O</kbd> Pause or resume / <kbd>P</kbd> This help</span><span><kbd>Esc</kbd> Cancel card placement</span><span>Paths grant +10% movement while your platoon is on them.</span><span>On the battlefield: right-click to move, drag to pan, scroll to zoom. Click the minimap to jump.</span></div></section></div>`);
const helpToggle = document.querySelector<HTMLButtonElement>('#help-toggle')!;
const keyboardHelp = document.querySelector<HTMLElement>('#keyboard-help')!;
function setKeyboardHelpOpen(open: boolean): void {
  keyboardHelp.hidden = !open;
  helpToggle.setAttribute('aria-expanded', String(open));
}
helpToggle.addEventListener('click', () => setKeyboardHelpOpen(keyboardHelp.hidden));
document.querySelector('#help-close')!.addEventListener('click', () => setKeyboardHelpOpen(false));
const boardElement = document.querySelector<HTMLDivElement>('#board')!;
const bossAlert = document.createElement('div');
bossAlert.className = 'boss-alert';
bossAlert.setAttribute('role', 'status');
bossAlert.setAttribute('aria-live', 'assertive');
document.querySelector('.board-shell')!.appendChild(bossAlert);
const app = new Application();
await app.init({ resizeTo: boardElement, background: 0x111116, antialias: true, preference: 'webgl', resolution: Math.min(devicePixelRatio, 2), autoDensity: true });
boardElement.appendChild(app.canvas);
app.canvas.tabIndex = 0;
app.canvas.setAttribute('aria-label', 'Aurolith battlefield. Arrow keys pan; number keys select platoons; A, D, R set stance; G gathers; J scouts as Outrider; Z, X, C set focus.');
const groundTextures = await Promise.all([
  '/assets/fixture/painted-field-v1.png',
  '/assets/fixture/painted-jungle-v1.png',
  '/assets/fixture/painted-path-v1.png',
  '/assets/fixture/painted-courtyard-v1.png',
  '/assets/fixture/painted-rampart-v1.png',
].map((url) => Assets.load(url)));
const groundPatterns = groundTextures.map((texture) => {
  const pattern = new FillPattern({ texture, repetition: 'repeat' });
  // Keep illustrated blades, stone joints and soil readable at 100% zoom,
  // independently of the source image's resolution.
  pattern.setTransform(new Matrix().scale(256 / texture.width, 256 / texture.height));
  return pattern;
});
// Use the illustrated 2D prop sheet in the live battlefield. These props are
// visual decoration; concealment still comes only from the board's brush tiles.
const environmentAtlas = await Assets.load('/assets/fixture/environment-props-cartoon.png');
const propColumnStarts = [0, 444, 887, 1331];
const propColumnWidths = [444, 443, 444, 443];
const propRowStarts = [0, 444];
const propRowHeights = [444, 443];
const environmentPropFrames = propRowStarts.flatMap((y, row) => propColumnStarts.map((x, column) =>
  new Rectangle(x, y, propColumnWidths[column]!, propRowHeights[row]!)));
const environmentProps = environmentPropFrames.map((frame) => new Texture({ source: environmentAtlas.source, frame }));
const unitPortraitTextures = new Map(await Promise.all(fixtureCatalog.units.map(async (definition) => {
  const asset = fixtureCatalog.assets.find((entry) => entry.id === definition.portraitAssetId)!;
  const texture = await Assets.load<Texture>(asset.publicPath);
  const size = Math.floor(Math.min(texture.width, texture.height) * 0.8);
  return [definition.id, new Texture({ source: texture.source,
    frame: new Rectangle(Math.floor((texture.width - size) / 2), Math.floor((texture.height - size) * 0.08), size, size) })] as const;
})));
const world = new Container();
app.stage.addChild(world);
const selectionGraphic = new Graphics();
world.addChild(selectionGraphic);
const formationGraphics = new Graphics();
world.addChild(formationGraphics);
const unitGraphics = new Graphics();
world.addChild(unitGraphics);
const unitPortraitLayer = new Container({ sortableChildren: true });
world.addChild(unitPortraitLayer);
const unitVisuals = new Map<string, { root: Container; portrait: Sprite; status: Text; cast: Text; health: Graphics }>();
const fogLayer = new Container();
world.addChildAt(fogLayer, 0);
const breachGraphics = new Graphics();
world.addChildAt(breachGraphics, 0);
const structureGraphics = new Graphics();
world.addChild(structureGraphics);
const cardEffectGraphics = new Graphics();
world.addChild(cardEffectGraphics);
const skillEffectGraphics = new Graphics();
world.addChild(skillEffectGraphics);
const facilityEffectGraphics = new Graphics();
world.addChild(facilityEffectGraphics);
const bossEffectGraphics = new Graphics();
world.addChild(bossEffectGraphics);
const trapGraphics = new Graphics();
world.addChild(trapGraphics);
const trapEffectGraphics = new Graphics();
world.addChild(trapEffectGraphics);
const itemEffectGraphics = new Graphics();
world.addChild(itemEffectGraphics);
type CardPulse = { x: number; y: number; color: number; startedAt: number };
const CARD_EFFECT_MS = 3000;
let cardPulses: CardPulse[] = [];
type SkillPulse = { type: 'skill-cast' | 'skill-hit' | 'status-applied' | 'status-expired' | 'channel-start' | 'channel-interrupted'; skillId: 'watery-grave' | 'deadeye' | 'shadow-blink'; sourceId: string | null; targetId: string | null; source: { x: number; y: number } | null; target: { x: number; y: number } | null; startedAt: number };
let skillPulses: SkillPulse[] = [];
let visibleUnitPositions = new Map<string, { x: number; y: number }>();
let deadUnitIds = new Set<string>();
type FacilityPulse = { source: { x: number; y: number } | null; target: { x: number; y: number } | null; startedAt: number };
let facilityPulses: FacilityPulse[] = [];
type BossPulse = { x: number; y: number; color: number; startedAt: number };
let bossPulses: BossPulse[] = [];
type TrapPulse = { x: number; y: number; color: number; startedAt: number };
const TRAP_EFFECT_MS = 3000;
let trapPulses: TrapPulse[] = [];
let itemPulses: CardPulse[] = [];
let minimapAlerts: { col: number; row: number; startedAt: number }[] = [];
let minimapEnemyUnits: { col: number; row: number }[] = [];
let visualEffectTimeHold: number | null = null;
function announceVisualAcceptanceEvent(category: string, event: unknown): void {
  if (!import.meta.env.DEV) return;
  const detail = { category, event };
  window.dispatchEvent(new CustomEvent('aurolith:visual-event', { detail }));
  const record = event as { type?: string; cardId?: string };
  const pauseTarget = window.__aurolithVisualPauseOn;
  if (!pauseTarget || pauseTarget.category !== category || pauseTarget.type && pauseTarget.type !== record.type
    || pauseTarget.cardId && pauseTarget.cardId !== record.cardId) return;
  window.__aurolithVisualPauseOn = null;
  visualEffectTimeHold = performance.now();
  const toggle = document.querySelector<HTMLButtonElement>('#match-toggle');
  if (running) toggle?.click();
}
app.ticker.add(() => {
  const now = import.meta.env.DEV && window.__aurolithVisualHoldEffects
    ? (visualEffectTimeHold ??= performance.now())
    : visualEffectTimeHold ?? performance.now();
  if (minimapAlerts.length) drawMinimap();
  itemPulses = itemPulses.filter((pulse) => now - pulse.startedAt < 750);
  itemEffectGraphics.clear();
  for (const pulse of itemPulses) {
    const age = (now - pulse.startedAt) / 750;
    itemEffectGraphics.circle(pulse.x, pulse.y, 8 + 19 * age).stroke({ color: pulse.color, width: 3 * (1 - age), alpha: 1 - age });
  }
  cardPulses = cardPulses.filter((pulse) => now - pulse.startedAt < CARD_EFFECT_MS);
  cardEffectGraphics.clear();
  for (const pulse of cardPulses) {
    const age = (now - pulse.startedAt) / CARD_EFFECT_MS;
    const radius = 24 + 38 * age;
    cardEffectGraphics.circle(pulse.x, pulse.y, radius).fill({ color: pulse.color, alpha: 0.4 * (1 - age) });
    cardEffectGraphics.circle(pulse.x, pulse.y, radius).stroke({ color: 0xfff1b8, width: 9 * (1 - age), alpha: 1 - age });
    cardEffectGraphics.circle(pulse.x, pulse.y, 8 + 10 * age).stroke({ color: 0xffffff, width: 3 * (1 - age), alpha: 0.9 * (1 - age) });
  }
  const skillPulseDuration = (pulse: SkillPulse) => pulse.type === 'channel-start' && pulse.skillId === 'shadow-blink' ? 1800
    : pulse.type === 'channel-start' ? 2600 : pulse.type === 'skill-hit' ? 3000 : pulse.type === 'status-expired' ? 3200 : 2400;
  skillPulses = skillPulses.filter((pulse) => now - pulse.startedAt < skillPulseDuration(pulse));
  skillEffectGraphics.clear();
  const pulsePoint = (id: string | null, atEvent: { x: number; y: number } | null) => {
    if (!id || !atEvent) return null;
    const current = visibleUnitPositions.get(id);
    if (current) return current;
    const hex = worldToHex(atEvent.x, atEvent.y);
    return deadUnitIds.has(id) && hex && visionMask[hex.row * BOARD_COLUMNS + hex.col] === 2 ? atEvent : null;
  };
  for (const pulse of skillPulses) {
    const duration = skillPulseDuration(pulse);
    const age = (now - pulse.startedAt) / duration;
    const source = pulsePoint(pulse.sourceId, pulse.source);
    const target = pulsePoint(pulse.targetId, pulse.target);
    if (pulse.type === 'channel-start' && pulse.skillId === 'shadow-blink' && target) {
      skillEffectGraphics.circle(target.x, target.y, 12 + 8 * age).fill({ color: 0x38204c, alpha: 0.28 * (1 - age) });
      skillEffectGraphics.circle(target.x, target.y, 16 + 8 * age).stroke({ color: 0xc592ed, width: 3 * (1 - age), alpha: 1 - age });
      if (source) skillEffectGraphics.moveTo(source.x, source.y).lineTo(target.x, target.y).stroke({ color: 0xb174d6, width: 2 * (1 - age), alpha: 0.6 * (1 - age) });
    } else if ((pulse.type === 'skill-cast' || pulse.type === 'channel-start') && source) {
      const channel = pulse.type === 'channel-start';
      const radius = (channel ? 19 : 16) + 24 * age;
      skillEffectGraphics.circle(source.x, source.y, radius).fill({ color: channel ? 0x9e45c4 : 0x18a9d4, alpha: 0.24 * (1 - age) });
      skillEffectGraphics.circle(source.x, source.y, radius).stroke({ color: channel ? 0xf0c9ff : 0x9af0ff, width: 5 * (1 - age), alpha: 1 - age });
      if (target) skillEffectGraphics.moveTo(source.x, source.y).lineTo(target.x, target.y).stroke({ color: 0xa6f1ff, width: 5 * (1 - age), alpha: 0.95 * (1 - age) });
    } else if (target) {
      const color = pulse.type === 'status-expired' ? 0xc8f5ff : pulse.type === 'status-applied' ? 0x296df2 : 0x72d8f6;
      const radius = 22 + 32 * age;
      skillEffectGraphics.circle(target.x, target.y, radius).fill({ color: pulse.type === 'status-applied' ? 0x3679ff : color, alpha: 0.5 * (1 - age) });
      skillEffectGraphics.circle(target.x, target.y, radius).stroke({ color: pulse.type === 'status-applied' ? 0xc7ddff : 0xd2f8ff, width: 9 * (1 - age), alpha: 1 - age });
      skillEffectGraphics.circle(target.x, target.y, 8 + 12 * age).stroke({ color: 0xffffff, width: 3 * (1 - age), alpha: 0.85 * (1 - age) });
    }
  }
  facilityPulses = facilityPulses.filter((pulse) => now - pulse.startedAt < 500);
  facilityEffectGraphics.clear();
  for (const pulse of facilityPulses) {
    const age = (now - pulse.startedAt) / 500;
    if (pulse.source && pulse.target) facilityEffectGraphics.moveTo(pulse.source.x, pulse.source.y).lineTo(pulse.target.x, pulse.target.y).stroke({ color: 0xf6c965, width: 4 * (1 - age), alpha: 1 - age });
    if (pulse.target) facilityEffectGraphics.circle(pulse.target.x, pulse.target.y, 6 + 22 * age).stroke({ color: 0xf6a95d, width: 3 * (1 - age), alpha: 1 - age });
  }
  bossPulses = bossPulses.filter((pulse) => now - pulse.startedAt < 750);
  bossEffectGraphics.clear();
  for (const pulse of bossPulses) {
    const age = (now - pulse.startedAt) / 750;
    bossEffectGraphics.circle(pulse.x, pulse.y, 9 + 30 * age).stroke({ color: pulse.color, width: 4 * (1 - age), alpha: 1 - age });
  }
  trapPulses = trapPulses.filter((pulse) => now - pulse.startedAt < TRAP_EFFECT_MS);
  trapEffectGraphics.clear();
  for (const pulse of trapPulses) {
    const age = (now - pulse.startedAt) / TRAP_EFFECT_MS;
    const radius = 17 + 34 * age;
    trapEffectGraphics.circle(pulse.x, pulse.y, radius).fill({ color: pulse.color, alpha: 0.3 * (1 - age) });
    trapEffectGraphics.circle(pulse.x, pulse.y, radius).stroke({ color: 0xfff1c0, width: 6 * (1 - age), alpha: 1 - age });
  }
  if (import.meta.env.DEV) window.__aurolithEffectDebug = {
    cardPulses: cardPulses.map((pulse) => now - pulse.startedAt),
    skillPulses: skillPulses.map((pulse) => ({ type: pulse.type, age: now - pulse.startedAt, sourceNow: pulse.sourceId ? visibleUnitPositions.get(pulse.sourceId) ?? null : null })),
    trapPulses: trapPulses.map((pulse) => now - pulse.startedAt),
    ticker: app.ticker.started,
  };
});

const matchPanel = document.createElement('section');
matchPanel.className = 'match-panel';
matchPanel.innerHTML = `<div class="match-overview">
  <div class="match-overview-heading"><span class="section-label">MATCH STATUS</span><span class="match-live-dot"></span></div>
  <div class="match-readout match-clock"><b id="match-time">0:00</b><span id="match-phase">Opening</span></div>
  <div class="match-readout match-resources"><span>Gold <b id="match-gold">0</b></span><span>Level <b id="match-level">1</b> / XP <b id="match-xp">0</b></span><span>Ore <b id="match-ore">0</b></span></div>
  <div class="match-readout"><span>Your Core <b id="match-own-core">4500</b></span><span>Enemy Core <b id="match-enemy-core">?</b></span></div>
  <div class="match-readout match-walls"><span>Enemy front <b id="match-outer-wall">?</b></span><span>Keep wall <b id="match-inner-wall">?</b></span></div>
  <div class="match-readout match-boss-row"><span>Boss reward</span><b id="match-boss-reward">None</b></div>
  <div class="match-actions"><button id="match-toggle">Start match <kbd>P</kbd></button><button id="match-reset">Reset</button></div>
  <label class="match-speed-label" for="match-speed">SIMULATION SPEED <select id="match-speed" aria-label="Match speed"><option value="1">1x normal</option><option value="4">4x quick</option><option value="12">12x fast</option><option value="24">24x test match</option></select></label>
  <div id="match-result" class="match-result" role="status" hidden></div>
  <div id="match-core-battery" class="core-battery" title="Below 2250 Core HP: 150 damage every 4s while the linked courtyard Arcane Barrier or Sanctuary survives">Core battery: unpowered</div>
  </div>
  <details class="control-group strategy-group" open><summary>Orders <span>1-4 select | A/D/R stance | Z/X/C focus</span></summary>
    <div class="section-label">SELECT PLATOON</div><div id="platoon-choices" class="platoon-choices"></div>
    <div class="match-actions"><label>Stance <select id="match-stance" aria-label="Platoon stance"><option value="defensive">Defensive</option><option value="aggressive">Aggressive</option><option value="retreat">Retreat</option></select></label><label>Focus <select id="match-focus" aria-label="Platoon focus"><option value="frontline">Frontline</option><option value="backline">Backline</option><option value="siege">Siege</option></select></label></div>
    <div class="macro-buttons"><button data-macro-shortcut="KeyG">Gather <kbd>G</kbd></button><button data-macro-shortcut="KeyJ">Outrider <kbd>J</kbd></button><button data-camera-shortcut="KeyF1">View 1 <kbd>F1</kbd></button><button data-camera-shortcut="KeyF2">View 2 <kbd>F2</kbd></button><button data-camera-shortcut="KeyF3">View 3 <kbd>F3</kbd></button><button data-camera-shortcut="KeyF4">View 4 <kbd>F4</kbd></button></div>
  </details>
  <details class="control-group roster-group"><summary>Army roster <span>select a unit to inspect</span></summary><div id="match-roster" class="match-roster" aria-label="Friendly army roster"></div><div id="match-unit-detail" class="match-unit-detail" role="status"></div></details>
  <details class="control-group cards-group" open><summary>Command cards <span>Q W E T Y U</span></summary><div id="match-cards" class="card-dock"></div><button id="match-buy-card">Extra draw - <span id="match-card-price">100</span>g</button><small id="match-card-count"></small></details>
  <details class="control-group rite-group"><summary>Blessing Rite <span>opens when available</span></summary><div id="match-rite" class="rite-offer"></div><small id="match-blessings"></small></details>
  <details class="control-group economy-group"><summary>Recruit and train <span>Guild / Academy</span></summary><div class="section-label">GUILD</div><select id="match-recruit" aria-label="Champion to recruit"></select><button id="match-hire">Hire for <span id="match-price">60</span>g</button><div class="section-label">ACADEMY</div><button id="match-train-commander">Train commander - 100g</button><select id="match-unit" aria-label="Unit to train"></select><button id="match-train-unit">Train unit - 100g</button></details>
  <details class="control-group build-group"><summary>Build and equipment <span>facilities / items</span></summary><div class="section-label">FORTRESS FACILITIES</div><select id="match-facility-slot" aria-label="Facility slot"></select><select id="match-facility-kind" aria-label="Facility type"><option value="caravan-post">Caravan Post</option><option value="ballista">Ballista</option><option value="arcane-barrier">Arcane Barrier</option><option value="sanctuary" title="Boosts local healing by 40/60/90%; a courtyard Sanctuary can power the Core battery">Sanctuary</option></select><div class="match-actions"><button id="match-build-facility">Build - 150g</button><button id="match-upgrade-facility">Upgrade</button></div><small id="match-facility-xp"></small><div class="section-label">ARSENAL AND CRAFTING</div><small id="match-item-stock"></small><select id="match-material" aria-label="Bazaar material"><option value="Gilded Ore">Gilded Ore</option><option value="Ironwood Timber">Ironwood Timber</option></select><button id="match-buy-material">Buy material - 150g</button><select id="match-item" aria-label="Item recipe">${ITEM_FIXTURES.map((item) => `<option value="${item.id}">${item.name}</option>`).join('')}</select><select id="match-item-unit" aria-label="Unit to craft or equip"></select><div class="match-actions"><button id="match-craft-item">Craft - 30g</button><button id="match-equip-item">Equip item</button></div><small id="match-item-status"></small></details>
  <small id="match-hash"></small>`;
const matchFeedback = document.createElement('p');
matchFeedback.id = 'match-feedback';
matchFeedback.setAttribute('role', 'status');
matchFeedback.textContent = 'Select a platoon, then right-click a walkable hex to order it.';
document.querySelector('.inspector .eyebrow')!.after(matchFeedback);
document.querySelector('.inspector .eyebrow')!.after(matchPanel);
matchPanel.querySelector('#match-unit-detail')!.insertAdjacentHTML('afterend', '<div class="match-actions"><select id="match-formation-rank" aria-label="Selected unit formation rank"><option value="1">Rank 1 Vanguard</option><option value="2">Rank 2 Midline</option><option value="3">Rank 3 Rearguard</option></select><button id="match-set-rank">Set rank</button><select id="match-formation-slot" aria-label="Selected unit formation slot"><option value="1">Slot 1</option><option value="2">Slot 2</option><option value="3">Slot 3</option><option value="4">Slot 4</option></select><button id="match-set-slot">Set slot</button></div><small id="match-macro-state">Macro: Standard</small>');
matchPanel.querySelector('#platoon-choices')!.innerHTML = [1, 2, 3, 4].map((number) => `<button data-platoon="${number}">${number} <small>0/5</small></button>`).join('');
const recruitSelect = matchPanel.querySelector<HTMLSelectElement>('#match-recruit')!;
const CARD_LABELS: Record<string, string> = {
  'card:phalanx-formation': 'Phalanx Formation', 'card:gold-rush': 'Gold Rush', 'card:xp-surge': 'XP Surge',
  'card:supply-line-convoy': 'Supply Line Convoy', 'card:alchemical-boom': 'Alchemical Boom',
  'card:forced-march': 'Forced March', 'card:overtime-surge': 'Overtime Surge', 'card:alchemical-landmine': 'Alchemical Landmine',
  'card:spike-chokepoint': 'Spike Chokepoint', 'card:decoy-illusion': 'Decoy Illusion', 'card:ambush-net': 'Ambush Net', 'card:explosive-gas-cloud': 'Explosive Gas Cloud', 'card:falcon-recon': 'Falcon Recon',
};
const CARD_DETAILS: Record<string, string> = {
  'card:phalanx-formation': 'Selected platoon: 30% less damage and 20% slower march for 6s.',
  'card:gold-rush': 'Gain 150 gold immediately.',
  'card:xp-surge': 'Gain 200 commander XP immediately.',
  'card:supply-line-convoy': 'Recruitment costs 30% less for 90s.',
  'card:alchemical-boom': 'Double camp gold rewards for 60s.',
  'card:forced-march': 'Army marches 30% faster for 8s.',
  'card:overtime-surge': 'From 15:00: army deals 25% more damage for 60s.',
  'card:alchemical-landmine': 'Place on visible field or jungle. Triggers after a 1.2s warning for 200 area damage and a 5s slow.',
  'card:spike-chokepoint': 'Place on a visible walkable hex, especially a wall breach bottleneck. Roots up to 3 nearby enemies and deals 100 armor-piercing damage after 1.2s.',
  'card:decoy-illusion': 'Place on a visible walkable hex. The illusion bursts after 1.2s for 150 arcane damage and blinds nearby enemies for 4s.',
  'card:ambush-net': 'Place on a visible jungle or battlefield flank hex. After 1.2s it disables nearby Scout/harvester fixture skills for 8s.',
  'card:explosive-gas-cloud': 'Place on any visible walkable hex. After 1.2s it creates a toxic cloud that deals 35 damage per second for 6s.',
  'card:falcon-recon': 'Reveal a 12-hex area for 15s and hidden traps in it for 20s.',
};
let matchState: MatchState = createInitialState(1);
let visionMask = computeVision(matchState, 'player:north');
let selectedPlatoon = 1;
let selectedTrapCard: string | null = null;
let running = false;
let nextSequence = 0;
let pendingCommands: CommandEnvelope[] = [];
let feedback = 'Select a platoon, then right-click a walkable hex to order it.';
let cardDockMarkup = '';
let riteMarkup = '';
let riteWasAvailable = false;
let rosterMarkup = '';
let selectedRosterUnitId: string | null = null;
let rankSelectionUnitId: string | null = null;

function queueCommand(command: Command, playerId: CommandEnvelope['playerId'] = 'player:north'): void {
  pendingCommands.push({ tick: matchState.tick + 1, sequence: nextSequence++, playerId, command });
}

function drawUnits(view: PlayerViewState): void {
  drawFormationFrames(view.own);
  unitGraphics.clear();
  for (const visual of unitVisuals.values()) visual.root.visible = false;
  const visualDebug: { id: string; portrait: boolean; status: string; cast: string }[] = [];
  const nextBossWarning = view.neutral.bossWarnings[0];
  if (nextBossWarning) {
    const seconds = Math.ceil((nextBossWarning.spawnTick - view.tick) / 10);
    const name = nextBossWarning.id.includes('elite') ? 'Gilded Tuskgod' : nextBossWarning.id.includes('alpha') ? 'Dreadmother Stormwing' : 'Obsidian Emperor';
    bossAlert.textContent = `${name} arrives in ${seconds}s · objective hex revealed`;
    bossAlert.hidden = false;
  } else {
    bossAlert.hidden = true;
  }
  visibleUnitPositions = new Map([...view.own.units, ...view.enemy.visibleUnits]
    .filter((unit) => unit.hp > 0).map((unit) => [unit.id, hexCenter(unit.col, unit.row)]));
  deadUnitIds = new Set(matchState.players.flatMap((player) => player.units.filter((unit) => unit.hp <= 0).map((unit) => unit.id)));
  for (const group of [{ id: view.own.id, units: view.own.units }, { id: view.enemy.id, units: view.enemy.visibleUnits }]) {
    const color = group.id === 'player:north' ? 0xf0c977 : 0xff766e;
    for (const unit of group.units) {
      if (unit.hp <= 0) continue;
      const { x, y } = hexCenter(unit.col, unit.row);
      const smoky = unit.untargetableUntilTick > view.tick;
      unitGraphics.circle(x, y, 19).fill({ color: 0x111116, alpha: smoky ? 0.42 : 0.95 }).stroke({ color, width: 2 });
      const texture = unitPortraitTextures.get(unit.definitionId)!;
      let visual = unitVisuals.get(unit.id);
      if (!visual) {
        const root = new Container();
        const portrait = new Sprite({ texture, width: 34, height: 34 });
        portrait.anchor.set(0.5);
        const mask = new Graphics().circle(0, 0, 17).fill(0xffffff);
        portrait.mask = mask;
        const health = new Graphics();
        const status = new Text({ text: '', style: { fontFamily: 'Arial', fontSize: 11, fontWeight: 'bold', fill: 0xffe16b, stroke: { color: 0x111116, width: 4 } } });
        status.anchor.set(0.5, 1);
        status.position.set(0, -23);
        const cast = new Text({ text: '', style: { fontFamily: 'Arial', fontSize: 10, fontWeight: 'bold', fill: 0xa5f1ff, stroke: { color: 0x111116, width: 4 } } });
        cast.anchor.set(0.5, 1);
        cast.position.set(0, -38);
        root.addChild(portrait, mask, health, status, cast);
        unitPortraitLayer.addChild(root);
        visual = { root, portrait, health, status, cast };
        unitVisuals.set(unit.id, visual);
      }
      visual.root.visible = true;
      visual.root.position.set(x, y);
      visual.root.zIndex = y;
      visual.portrait.texture = texture;
      visual.portrait.alpha = smoky ? 0.45 : 1;
      visual.health.clear().roundRect(-18, 20, 36, 6, 2).fill(0x111116);
      visual.health.roundRect(-17, 21, 34 * Math.max(0, Math.min(1, unit.hp / maxUnitHp(unit, view.tick))), 4, 1).fill(color);
      const status = unit.stunnedUntilTick > view.tick ? 'STUN' : unit.rootedUntilTick > view.tick || unit.snaredUntilTick > view.tick ? 'ROOT'
        : unit.blindedUntilTick > view.tick ? 'BLIND' : unit.slowUntilTick > view.tick ? 'SLOW'
          : unit.channelCompleteAtTick !== null && unit.channelCompleteAtTick > view.tick ? 'CHANNEL' : smoky ? 'UNTARGETABLE' : '';
      if (visual.status.text !== status) visual.status.text = status;
      const now = visualEffectTimeHold ?? performance.now();
      let castPulse: SkillPulse | undefined;
      for (let index = skillPulses.length - 1; index >= 0; index--) {
        const pulse = skillPulses[index];
        if (pulse.sourceId === unit.id && ['skill-cast', 'channel-start', 'channel-interrupted'].includes(pulse.type) && now - pulse.startedAt >= 0 && now - pulse.startedAt < 1400) {
          castPulse = pulse;
          break;
        }
      }
      const cast = castPulse ? castPulse.type === 'channel-interrupted' ? 'INTERRUPTED' : castPulse.skillId === 'watery-grave' ? 'WATERY GRAVE'
        : castPulse.skillId === 'deadeye' ? 'DEADEYE' : 'SHADOW BLINK' : '';
      if (visual.cast.text !== cast) visual.cast.text = cast;
      if (status === 'STUN') unitGraphics.star(x, y - 18, 5, 5, 2).fill(0xffe16b);
      if (group.id === 'player:north' && unit.platoonId.endsWith(`:${selectedPlatoon}`)) unitGraphics.circle(x, y, 21).stroke({ color: 0xffecaa, width: 1.5 });
      visualDebug.push({ id: unit.id, portrait: true, status, cast });
    }
  }
  if (import.meta.env.DEV) window.__aurolithUnitVisualDebug = visualDebug;
  for (const monster of view.neutral.visibleMonsters) {
    const { x, y } = hexCenter(monster.col, monster.row);
    unitGraphics.circle(x, y, 7).fill(0x6a281d);
    unitGraphics.circle(x, y, 5).fill(0xe5784d);
  }
  for (const warning of view.neutral.bossWarnings) {
    const { x, y } = hexCenter(warning.col, warning.row);
    unitGraphics.circle(x, y, 15).stroke({ color: 0xffb34e, width: 3, alpha: 0.9 });
    unitGraphics.circle(x, y, 4).fill(0xffb34e);
  }
  for (const boss of view.neutral.visibleBosses) {
    const { x, y } = hexCenter(boss.col, boss.row);
    if (boss.hp > 0) {
      unitGraphics.circle(x, y, 15).fill(0x331922);
      unitGraphics.circle(x, y, 11).fill(boss.id.includes('elite') ? 0xd88650 : boss.id.includes('alpha') ? 0x8dc9e1 : 0xd9ae6b);
      unitGraphics.rect(x - 17, y - 23, 34, 4).fill(0x172522);
      unitGraphics.rect(x - 16, y - 22, 32 * boss.hp / boss.maxHp, 2).fill(0xe9c277);
    } else if (boss.relicUnclaimed) {
      unitGraphics.circle(x, y, 9).fill(0xf9de72);
      unitGraphics.circle(x, y, 14).stroke({ color: 0xffefae, width: 2 });
    }
  }
}

function drawFormationFrames(player: PlayerViewState['own']): void {
  formationGraphics.clear();
  const colors = [0xf59e0b, 0x06b6d4, 0xef4444, 0x10b981];
  for (const [index, platoon] of player.platoons.entries()) {
    const points = player.units.filter((unit) => unit.hp > 0 && unit.platoonId === platoon.id)
      .map((unit) => hexCenter(unit.col, unit.row))
      .sort((a, b) => a.x - b.x || a.y - b.y);
    if (!points.length) continue;
    const selected = selectedPlatoon === index + 1;
    const color = colors[index];
    if (points.length === 1) {
      formationGraphics.circle(points[0].x, points[0].y, 17)
        .fill({ color, alpha: selected ? 0.11 : 0.05 })
        .stroke({ color, width: 2, alpha: selected ? 0.8 : 0.4 });
      continue;
    }
    const cross = (a: typeof points[number], b: typeof points[number], c: typeof points[number]) =>
      (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
    const lower: typeof points = [];
    for (const point of points) {
      while (lower.length > 1 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) lower.pop();
      lower.push(point);
    }
    const upper: typeof points = [];
    for (const point of [...points].reverse()) {
      while (upper.length > 1 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) upper.pop();
      upper.push(point);
    }
    const hull = [...lower.slice(0, -1), ...upper.slice(0, -1)];
    if (hull.length < 3) {
      const minX = Math.min(...points.map((point) => point.x)) - 14;
      const minY = Math.min(...points.map((point) => point.y)) - 14;
      const maxX = Math.max(...points.map((point) => point.x)) + 14;
      const maxY = Math.max(...points.map((point) => point.y)) + 14;
      formationGraphics.roundRect(minX, minY, maxX - minX, maxY - minY, 14)
        .fill({ color, alpha: selected ? 0.11 : 0.05 })
        .stroke({ color, width: 2, alpha: selected ? 0.8 : 0.4 });
      continue;
    }
    const center = { x: hull.reduce((sum, point) => sum + point.x, 0) / hull.length, y: hull.reduce((sum, point) => sum + point.y, 0) / hull.length };
    formationGraphics.poly(hull.flatMap((point) => {
      const length = Math.hypot(point.x - center.x, point.y - center.y) || 1;
      return [point.x + 14 * (point.x - center.x) / length, point.y + 14 * (point.y - center.y) / length];
    })).fill({ color, alpha: selected ? 0.11 : 0.05 }).stroke({ color, width: 2, alpha: selected ? 0.8 : 0.4 });
  }
}

function drawTraps(view: PlayerViewState): void {
  trapGraphics.clear();
  for (const decoy of view.traps.decoys) {
    const { x, y } = hexCenter(decoy.col, decoy.row);
    // Match the opposing unit marker, with a faint echo edge to hint at an illusion.
    trapGraphics.circle(x, y, 8).fill({ color: 0x77b8de, alpha: 0.22 });
    trapGraphics.circle(x, y, 6).fill({ color: 0x77b8de, alpha: 0.42 });
    trapGraphics.circle(x, y, 11).stroke({ color: 0xd8c5ef, width: 1.5, alpha: 0.5 });
  }
  for (const trap of [...view.traps.friendly, ...view.traps.visibleEnemy]) {
    const { x, y } = hexCenter(trap.col, trap.row);
    const warned = trap.detonateAtTick !== null;
    const color = warned ? 0xf2a245 : trap.kind === 'spike-chokepoint' ? 0xc65b4a : trap.kind === 'decoy-illusion' ? 0xd29dea : trap.kind === 'ambush-net' ? 0x8f70d0 : trap.kind === 'explosive-gas-cloud' ? 0x7fb273 : 0xc17bd5;
    if (trap.kind === 'explosive-gas-cloud' && trap.cloudUntilTick !== null) trapGraphics.circle(x, y, 34).fill({ color, alpha: 0.3 });
    else if (trap.kind === 'spike-chokepoint') trapGraphics.poly([x, y - 15, x + 14, y + 11, x - 14, y + 11]).fill({ color, alpha: 0.9 }).stroke({ color: 0xffe0c8, width: 2, alpha: 0.9 });
    else if (trap.kind === 'decoy-illusion') trapGraphics.poly([x, y - 15, x + 15, y, x, y + 15, x - 15, y]).fill({ color, alpha: 0.85 }).stroke({ color: 0xffe0ff, width: 2, alpha: 0.9 });
    else if (trap.kind === 'ambush-net') { trapGraphics.circle(x, y, 13).stroke({ color, width: 4, alpha: 0.95 }); trapGraphics.moveTo(x - 10, y - 10).lineTo(x + 10, y + 10).moveTo(x + 10, y - 10).lineTo(x - 10, y + 10).stroke({ color: 0xe5d5ff, width: 2, alpha: 0.9 }); }
    else trapGraphics.circle(x, y, warned ? 14 : 10).fill({ color, alpha: warned ? 0.9 : 0.8 });
    trapGraphics.circle(x, y, warned ? 21 : 15).stroke({ color: warned ? 0xffe0a1 : 0xe3b0f3, width: 3, alpha: 0.9 });
  }
}

let trapWarningAudio: AudioContext | null = null;
window.addEventListener('pointerdown', () => {
  if (typeof window.AudioContext === 'undefined') return;
  trapWarningAudio ??= new AudioContext();
  if (trapWarningAudio.state === 'suspended') void trapWarningAudio.resume();
}, { once: true, capture: true });

function playTrapWarningClick(): void {
  if (import.meta.env.DEV) window.__aurolithAudioWarningEvents = (window.__aurolithAudioWarningEvents ?? 0) + 1;
  if (typeof window.AudioContext === 'undefined') return;
  trapWarningAudio ??= new AudioContext();
  const play = () => {
    if (trapWarningAudio?.state !== 'running') return;
    const oscillator = trapWarningAudio.createOscillator();
    const gain = trapWarningAudio.createGain();
    const now = trapWarningAudio.currentTime;
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1450, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);
    oscillator.connect(gain);
    gain.connect(trapWarningAudio.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.08);
  };
  if (trapWarningAudio.state === 'running') { play(); return; }
  void trapWarningAudio.resume().then(play).catch(() => undefined);
}

function playBossWarningHorn(): void {
  if (import.meta.env.DEV) window.__aurolithAudioBossWarningEvents = (window.__aurolithAudioBossWarningEvents ?? 0) + 1;
  if (typeof window.AudioContext === 'undefined') return;
  trapWarningAudio ??= new AudioContext();
  const play = () => {
    if (trapWarningAudio?.state !== 'running') return;
    const now = trapWarningAudio.currentTime;
    for (const [frequency, offset] of [[220, 0], [293.66, 0.16]] as const) {
      const oscillator = trapWarningAudio.createOscillator();
      const gain = trapWarningAudio.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(frequency, now + offset);
      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.12, now + offset + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.55);
      oscillator.connect(gain);
      gain.connect(trapWarningAudio!.destination);
      oscillator.start(now + offset);
      oscillator.stop(now + offset + 0.56);
    }
  };
  if (trapWarningAudio.state === 'running') { play(); return; }
  void trapWarningAudio.resume().then(play).catch(() => undefined);
}

function drawStructures(view: PlayerViewState): void {
  breachGraphics.clear();
  structureGraphics.clear();
  for (const wall of [...view.structures.friendlyWalls, ...view.structures.visibleEnemyWalls]) {
    if (wall.hp !== 0) continue;
    for (let col = wall.col; col < wall.col + wall.width; col++) {
      if (wall.ownerId !== view.own.id && visionMask[wall.row * BOARD_COLUMNS + col] !== 2) continue;
      const { x, y } = hexCenter(col, wall.row);
      breachGraphics.circle(x, y, 17).fill(0x776d59);
    }
  }
  for (const wall of [...view.structures.friendlyWalls, ...view.structures.visibleEnemyWalls]) {
    if (wall.hp <= 0) continue;
    const { x, y } = hexCenter(wall.col + 2, wall.row);
    structureGraphics.rect(x - 43, y - 25, 86, 7).fill(0x15211d);
    structureGraphics.rect(x - 41, y - 23, 82 * wall.hp / wall.maxHp, 3).fill(wall.ownerId === 'player:north' ? 0xe8c479 : 0x78b9db);
  }
  for (const core of view.structures.visibleCores) {
    const { x, y } = hexCenter(core.col, core.row);
    structureGraphics.circle(x, y, 15).fill(core.ownerId === 'player:north' ? 0xd7a85e : 0x76add1);
    structureGraphics.circle(x, y, 9).fill(0x25332f);
  }
  for (const slot of [...view.structures.friendlyFacilities, ...view.structures.visibleEnemyFacilities]) {
    if (!slot.kind && slot.rubbleUntilTick <= view.tick) continue;
    for (const point of facilityFootprint(slot)) {
      const center = hexCenter(point.col, point.row);
      structureGraphics.poly(hexPoints.map((value, index) => value + (index % 2 === 0 ? center.x : center.y)))
        .stroke({ color: slot.kind === 'ballista' ? 0xd5885c : slot.kind === 'arcane-barrier' ? 0x8db5f0 : slot.kind === 'sanctuary' ? 0xa4e1bd : 0xd9b662, width: 1.2, alpha: 0.65 });
    }
    const { x, y } = hexCenter(slot.col + 1, slot.row + 1);
    const color = slot.kind === 'ballista' ? 0xd5885c : slot.kind === 'arcane-barrier' ? 0x8db5f0 : slot.kind === 'sanctuary' ? 0xa4e1bd : slot.kind === 'caravan-post' ? 0xd9b662 : 0x6f6b66;
    structureGraphics.roundRect(x - 13, y - 13, 26, 26, 5).fill({ color, alpha: slot.pendingTier ? 0.6 : 0.95 });
    if (slot.kind && slot.maxHp > 0) {
      structureGraphics.rect(x - 16, y - 21, 32, 4).fill(0x172522);
      structureGraphics.rect(x - 15, y - 20, 30 * slot.hp / slot.maxHp, 2).fill(slot.ownerId === 'player:north' ? 0xf5db9e : 0x9fd8ed);
    }
  }
}

function renderMatchPanel(): void {
  const player = matchState.players[0];
  const view = projectPlayerView(matchState, 'player:north', visionMask);
  const seconds = Math.floor(matchState.tick / 10);
  if (!player.units.some((unit) => unit.id === selectedRosterUnitId)) selectedRosterUnitId = player.units[0]?.id ?? null;
  const nextRosterMarkup = player.units.map((unit) => {
    const definition = fixtureCatalog.units.find((entry) => entry.id === unit.definitionId)!;
    const maximum = maxUnitHp(unit, matchState.tick);
    const health = unit.hp > 0 ? `${unit.hp}/${maximum} HP` : `Respawns in ${Math.ceil(((unit.respawnAtTick ?? matchState.tick) - matchState.tick) / 10)}s`;
    const skill = unit.skillReadyAtTick > matchState.tick ? `Skill in ${Math.ceil((unit.skillReadyAtTick - matchState.tick) / 10)}s` : 'Skill ready';
    return `<button class="roster-unit${unit.id === selectedRosterUnitId ? ' active' : ''}" data-unit="${unit.id}" title="${definition.role} · ${health} · ${skill}"><span>${definition.name}<small>P${unit.platoonId.split(':').at(-1)} · L${unit.level} · ${definition.role}</small></span><span class="roster-health">${unit.hp > 0 ? `${Math.round(unit.hp / maximum * 100)}%` : 'KO'}</span></button>`;
  }).join('') || '<small>No units recruited</small>';
  if (rosterMarkup !== nextRosterMarkup) { matchPanel.querySelector('#match-roster')!.innerHTML = nextRosterMarkup; rosterMarkup = nextRosterMarkup; }
  const selectedRosterUnit = player.units.find((unit) => unit.id === selectedRosterUnitId);
  if (rankSelectionUnitId !== selectedRosterUnitId) {
    matchPanel.querySelector<HTMLSelectElement>('#match-formation-rank')!.value = String(selectedRosterUnit?.formationRank ?? 1);
    matchPanel.querySelector<HTMLSelectElement>('#match-formation-slot')!.value = String((selectedRosterUnit?.formationSlot ?? 0) + 1);
    rankSelectionUnitId = selectedRosterUnitId;
  }
  matchPanel.querySelector<HTMLButtonElement>('#match-set-rank')!.disabled = !selectedRosterUnit;
  matchPanel.querySelector<HTMLButtonElement>('#match-set-slot')!.disabled = !selectedRosterUnit;
  const rankSlotCapacity = [0, 3, 4, 3] as const;
  const formationSlotSelect = matchPanel.querySelector<HTMLSelectElement>('#match-formation-slot')!;
  for (const [slot, option] of Array.from(formationSlotSelect.options).entries()) {
    option.disabled = !selectedRosterUnit || slot >= rankSlotCapacity[selectedRosterUnit.formationRank]
      || player.units.some((unit) => unit.id !== selectedRosterUnit.id && unit.platoonId === selectedRosterUnit.platoonId
        && unit.formationRank === selectedRosterUnit.formationRank && unit.formationSlot === slot);
    option.textContent = `${selectedRosterUnit?.formationRank === 2 ? 'Flank' : selectedRosterUnit?.formationRank === 1 ? 'Vanguard' : 'Rearguard'} slot ${slot + 1}`;
  }
  const selectedDefinition = selectedRosterUnit && fixtureCatalog.units.find((entry) => entry.id === selectedRosterUnit.definitionId);
  matchPanel.querySelector('#match-unit-detail')!.textContent = selectedRosterUnit && selectedDefinition
    ? `${selectedDefinition.name} · Rank ${selectedRosterUnit.formationRank}, slot ${selectedRosterUnit.formationSlot + 1} · ${selectedRosterUnit.hp > 0 ? `${selectedRosterUnit.hp}/${maxUnitHp(selectedRosterUnit, matchState.tick)} HP` : `KO, respawn ${Math.ceil(((selectedRosterUnit.respawnAtTick ?? matchState.tick) - matchState.tick) / 10)}s`} · ${selectedRosterUnit.equippedItemId ? ITEM_FIXTURES.find((item) => item.id === selectedRosterUnit.equippedItemId)?.name : 'No item'} · ${selectedRosterUnit.stunnedUntilTick > matchState.tick ? 'Stunned' : selectedRosterUnit.slowUntilTick > matchState.tick ? 'Slowed' : 'Ready'}` : '';
  matchPanel.querySelector('#match-time')!.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  matchPanel.querySelector('#match-phase')!.textContent = matchState.phase;
  matchPanel.querySelector('#match-gold')!.textContent = String(Math.floor(player.goldMilli / 1000));
  matchPanel.querySelector('#match-ore')!.textContent = String(player.materials['Gilded Ore'] ?? 0);
  matchPanel.querySelector('#match-item-stock')!.textContent = `Ore ${player.materials['Gilded Ore'] ?? 0} · Timber ${player.materials['Ironwood Timber'] ?? 0} · ${ITEM_FIXTURES.map((item) => `${item.name} ${player.arsenal[item.id] ?? 0}`).join(' · ')}`;
  matchPanel.querySelector('#match-item-status')!.textContent = [...player.craftJobs.map((job) => `Crafting ${ITEM_FIXTURES.find((item) => item.id === job.itemId)?.name} ${Math.ceil((job.readyAtTick - matchState.tick) / 10)}s`), ...player.equipJobs.map((job) => `Equipping ${ITEM_FIXTURES.find((item) => item.id === job.itemId)?.name} ${Math.ceil((job.readyAtTick - matchState.tick) / 10)}s`)].join(' · ') || 'Craft at the Resource Tab; equip instantly in the inner keep or channel 8s in the field.';
  const activeBossReward = player.bossBuffs.emperorUntil > matchState.tick ? `Emperor ${Math.ceil((player.bossBuffs.emperorUntil - matchState.tick) / 10)}s`
    : player.bossBuffs.eyesUntil > matchState.tick ? `Stormwing ${Math.ceil((player.bossBuffs.eyesUntil - matchState.tick) / 10)}s`
      : player.bossBuffs.stampedeUntil > matchState.tick ? `Tuskgod ${Math.ceil((player.bossBuffs.stampedeUntil - matchState.tick) / 10)}s` : 'None';
  matchPanel.querySelector('#match-boss-reward')!.textContent = `${activeBossReward}${player.relics ? ` · ${player.relics} relic` : ''}`;
  matchPanel.querySelector('#match-own-core')!.textContent = String(player.coreHp);
  const batteryPower = player.batteryPowerSlotId ? player.facilities.find((slot) => slot.id === player.batteryPowerSlotId && (slot.kind === 'arcane-barrier' || slot.kind === 'sanctuary') && slot.hp > 0 && slot.tier > 0)
    : player.facilities.find((slot) => slot.zone === 'outer-courtyard' && (slot.kind === 'arcane-barrier' || slot.kind === 'sanctuary') && slot.hp > 0 && slot.tier > 0);
  matchPanel.querySelector('#match-core-battery')!.textContent = player.batteryDisabled ? 'Disabled' : !batteryPower ? 'Unpowered' : player.coreHp >= 2250 ? 'Armed below 50%' : player.batteryReadyAtTick > matchState.tick ? `Ready in ${Math.ceil((player.batteryReadyAtTick - matchState.tick) / 10)}s` : 'Ready';
  matchPanel.querySelector('#match-enemy-core')!.textContent = String(view.structures.visibleCores.find((core) => core.ownerId === 'player:south')?.hp ?? '?');
  for (const [layer, labelId] of [['outer', '#match-outer-wall'], ['inner', '#match-inner-wall']] as const) {
    const wall = view.structures.visibleEnemyWalls.find((entry) => entry.layer === layer && entry.id.endsWith(':1'));
    matchPanel.querySelector(labelId)!.textContent = wall ? wall.hp === 0 ? 'Breached' : String(wall.hp) : '?';
  }
  matchPanel.querySelector('#match-xp')!.textContent = String(player.commanderXp);
  matchPanel.querySelector('#match-level')!.textContent = String(commanderLevelForXp(player.commanderXp));
  const contracts = guildContracts(matchState, 'player:north');
  const chosenContract = recruitSelect.value;
  if (recruitSelect.options.length !== contracts.length || contracts.some((contract, index) => recruitSelect.options[index]?.value !== contract.id)) recruitSelect.replaceChildren(...contracts.map((contract) => {
    const option = document.createElement('option');
    option.value = contract.id;
    option.textContent = `${contract.name} · ${contract.role} · T${contract.tier}`;
    return option;
  }));
  if (contracts.some((contract) => contract.id === chosenContract)) recruitSelect.value = chosenContract;
  matchPanel.querySelector<HTMLButtonElement>('#match-hire')!.disabled = contracts.length === 0;
  const facilitySlotSelect = matchPanel.querySelector<HTMLSelectElement>('#match-facility-slot')!;
  const chosenSlotId = facilitySlotSelect.value;
  if (facilitySlotSelect.options.length !== player.facilities.length) facilitySlotSelect.replaceChildren(...player.facilities.map((slot) => {
    const option = document.createElement('option');
    option.value = slot.id;
    return option;
  }));
  for (const [index, slot] of player.facilities.entries()) facilitySlotSelect.options[index].textContent = `${index + 1} ${slot.zone === 'inner-keep' ? 'Keep' : 'Court'} · ${slot.kind ? `${slot.kind === 'ballista' ? 'Ballista' : slot.kind === 'arcane-barrier' ? 'Arcane Barrier' : slot.kind === 'sanctuary' ? 'Sanctuary' : 'Caravan'} T${slot.tier}${slot.pendingTier ? ` → T${slot.pendingTier}` : ''}` : slot.rubbleUntilTick > matchState.tick ? 'Rubble' : 'Empty'}`;
  if (player.facilities.some((slot) => slot.id === chosenSlotId)) facilitySlotSelect.value = chosenSlotId;
  const selectedFacility = player.facilities.find((slot) => slot.id === facilitySlotSelect.value)!;
  const combatFacilities = player.facilities.filter((slot) => slot.kind && facilityCategory(slot.kind) === 'combat').length;
  const productionFacilities = player.facilities.filter((slot) => slot.kind && facilityCategory(slot.kind) === 'production').length;
  matchPanel.querySelector('#match-facility-xp')!.textContent = `Unspent facility XP ${player.commanderXp - player.facilityXpSpent} | Combat ${combatFacilities}/3 | Production ${productionFacilities}/3`;
  matchPanel.querySelector('#match-upgrade-facility')!.textContent = selectedFacility.tier === 1 ? 'Upgrade · 250g + 100XP' : 'Upgrade · 400g + 250XP';
  const buildKind = matchPanel.querySelector<HTMLSelectElement>('#match-facility-kind')!.value as FacilityKind;
  const categoryFull = (facilityCategory(buildKind) === 'combat' ? combatFacilities : productionFacilities) >= 3;
  const buildReason = selectedFacility.kind ? 'This slot is occupied.' : selectedFacility.rubbleUntilTick > matchState.tick ? 'Wait for rubble to clear.'
    : selectedFacility.zone === 'inner-keep' && buildKind === 'arcane-barrier' ? 'Arcane Barrier requires a courtyard slot.'
      : categoryFull ? `The ${facilityCategory(buildKind)} facility category is full (3/3).` : '';
  const buildButton = matchPanel.querySelector<HTMLButtonElement>('#match-build-facility')!;
  buildButton.disabled = !!buildReason;
  buildButton.title = buildReason || 'Build the selected facility for 150 gold.';
  matchPanel.querySelector<HTMLButtonElement>('#match-upgrade-facility')!.disabled = !selectedFacility.kind || !!selectedFacility.pendingTier || selectedFacility.tier >= 3;
  matchPanel.querySelector('#match-price')!.textContent = String(hirePriceGold(matchState.tick + 1));
  matchPanel.querySelector('#match-card-price')!.textContent = String(extraDrawPriceGold(player.cards.extraBuys));
  matchPanel.querySelector('#match-card-count')!.textContent = `${player.cards.drawPile.length} in deck · ${player.cards.discard.length} discarded`;
  const nextCardDockMarkup = [
    ...player.cards.hand.map((id) => `<button data-card="${id}" title="${CARD_DETAILS[id]}"><b>${CARD_LABELS[id]}</b><small>${CARD_DETAILS[id]}</small></button>`),
    ...player.cards.overflow.map(({ id, expiresAtTick }) => `<button data-card="${id}" class="overflow" title="${CARD_DETAILS[id]} Expires in ${Math.ceil((expiresAtTick - matchState.tick) / 10)}s"><b>${CARD_LABELS[id]} · ${Math.ceil((expiresAtTick - matchState.tick) / 10)}s</b><small>${CARD_DETAILS[id]}</small></button>`),
  ].join('') || '<small>No cards in hand</small>';
  if (nextCardDockMarkup !== cardDockMarkup) {
    matchPanel.querySelector('#match-cards')!.innerHTML = nextCardDockMarkup;
    cardDockMarkup = nextCardDockMarkup;
  }
  const offer = player.blessings.offer;
  const nextRiteMarkup = offer
    ? `<strong>${offer.tier.toUpperCase()} · RITE ${offer.rite + 1}</strong><small>Choose in ${Math.ceil((offer.expiresAtTick - matchState.tick) / 10)}s</small>${offer.options.map((id) => {
      const blessing = FIXTURE_BLESSINGS.find((entry) => entry.id === id)!;
      return `<button data-blessing="${id}" title="${blessing.summary}"><b>${blessing.name}</b><small>${blessing.summary}</small></button>`;
    }).join('')}<button id="match-reroll" ${player.blessings.rerollsRemaining ? '' : 'disabled'}>Reroll · ${player.blessings.rerollsRemaining} left</button>`
    : '<small>No Rite active</small>';
  if (nextRiteMarkup !== riteMarkup) { matchPanel.querySelector('#match-rite')!.innerHTML = nextRiteMarkup; riteMarkup = nextRiteMarkup; }
  const riteDetails = matchPanel.querySelector<HTMLDetailsElement>('.rite-group')!;
  if (offer && !riteWasAvailable) riteDetails.open = true;
  riteWasAvailable = Boolean(offer);
  matchPanel.querySelector('#match-blessings')!.textContent = `Chosen: ${player.blessings.selected.map((id) => FIXTURE_BLESSINGS.find((entry) => entry.id === id)?.name ?? id).join(', ') || 'none'}`;
  matchPanel.querySelector('#match-toggle')!.textContent = running ? 'Pause' : matchState.phase === 'ended' ? 'Finished' : matchState.tick ? 'Resume' : 'Start match';
  matchPanel.querySelector('#match-toggle')!.insertAdjacentHTML('beforeend', ' <kbd>O</kbd>');
  matchPanel.querySelector<HTMLButtonElement>('#match-toggle')!.disabled = matchState.phase === 'ended';
  matchPanel.querySelector('#match-reset')!.textContent = matchState.phase === 'ended' ? 'Restart match' : 'Reset';
  const resultBanner = matchPanel.querySelector<HTMLElement>('#match-result')!;
  resultBanner.hidden = !matchState.result;
  if (matchState.result) {
    const outcome = matchState.result.winnerId === 'player:north' ? 'Victory' : matchState.result.winnerId === 'player:south' ? 'Defeat' : 'Draw';
    const reason = matchState.result.reason === 'core-collapse' ? matchState.result.winnerId === 'player:north' ? 'enemy core collapsed' : 'your core collapsed'
      : matchState.result.reason === 'wall-damage' ? 'wall damage at 18:00' : matchState.result.reason === 'core-hp' ? 'core health at 18:00'
        : matchState.players.every((entry) => entry.coreHp === 0) ? 'both cores collapsed' : 'equal score at 18:00';
    resultBanner.textContent = `${outcome} · ${reason}. Choose Restart match to play again.`;
    resultBanner.dataset.outcome = outcome.toLowerCase();
  }
  matchFeedback.textContent = feedback;
  matchPanel.querySelector('#match-hash')!.textContent = `State ${stateHash(matchState)}`;
  const unitSelect = matchPanel.querySelector<HTMLSelectElement>('#match-unit')!;
  const itemUnitSelect = matchPanel.querySelector<HTMLSelectElement>('#match-item-unit')!;
  const selectedUnitId = unitSelect.value;
  if (unitSelect.options.length !== player.units.length) {
    unitSelect.replaceChildren(...player.units.map((unit) => {
      const option = document.createElement('option');
      option.value = unit.id;
      option.textContent = `${fixtureCatalog.units.find((entry) => entry.id === unit.definitionId)?.name ?? unit.id} · L${unit.level}`;
      return option;
    }));
    if (player.units.some((unit) => unit.id === selectedUnitId)) unitSelect.value = selectedUnitId;
  } else {
    for (const [index, unit] of player.units.entries()) unitSelect.options[index].textContent = `${fixtureCatalog.units.find((entry) => entry.id === unit.definitionId)?.name ?? unit.id} · L${unit.level}`;
  }
  const chosenItemUnit = itemUnitSelect.value;
  itemUnitSelect.replaceChildren(...player.units.map((unit) => {
    const option = document.createElement('option');
    option.value = unit.id;
    option.textContent = `${fixtureCatalog.units.find((entry) => entry.id === unit.definitionId)?.name ?? unit.id} · ${unit.equippedItemId ? ITEM_FIXTURES.find((item) => item.id === unit.equippedItemId)?.name : `${unit.col}:${unit.row}`}`;
    return option;
  }));
  if (player.units.some((unit) => unit.id === chosenItemUnit)) itemUnitSelect.value = chosenItemUnit;
  const selectedItem = ITEM_FIXTURES.find((item) => item.id === matchPanel.querySelector<HTMLSelectElement>('#match-item')!.value)!;
  const selectedItemUnit = player.units.find((unit) => unit.id === itemUnitSelect.value);
  const station = resourceStation('player:north');
  matchPanel.querySelector<HTMLButtonElement>('#match-craft-item')!.disabled = !selectedItemUnit || selectedItemUnit.hp <= 0 || selectedItemUnit.col !== station.col || selectedItemUnit.row !== station.row || selectedItem.recipe.some((material) => (player.materials[material] ?? 0) < selectedItem.recipe.filter((entry) => entry === material).length) || player.goldMilli < 30000;
  matchPanel.querySelector<HTMLButtonElement>('#match-equip-item')!.disabled = !selectedItemUnit || selectedItemUnit.hp <= 0 || !!selectedItemUnit.equippedItemId || (player.arsenal[selectedItem.id] ?? 0) < 1 || !selectedItem.roles.includes(fixtureCatalog.units.find((entry) => entry.id === selectedItemUnit.definitionId)!.role);
  const platoon = player.platoons[selectedPlatoon - 1];
  matchPanel.querySelector<HTMLSelectElement>('#match-stance')!.value = platoon.stance;
  matchPanel.querySelector<HTMLSelectElement>('#match-focus')!.value = platoon.focus;
  matchPanel.querySelector('#match-macro-state')!.textContent = `Macro: ${platoon.macro === 'standard' ? 'Standard' : platoon.macro === 'gather' ? 'Gather' : 'Outrider'}${platoon.order ? ' · explicit order active' : ''}`;
  for (const [index, entry] of player.platoons.entries()) {
    const button = matchPanel.querySelector<HTMLButtonElement>(`[data-platoon="${index + 1}"]`)!;
    button.classList.toggle('active', selectedPlatoon === index + 1);
    button.querySelector('small')!.textContent = `${entry.unitIds.length}/5`;
  }
  drawUnits(view);
  drawTraps(view);
  drawStructures(view);
}

matchPanel.querySelector('#match-toggle')!.addEventListener('click', () => {
  running = matchState.phase !== 'ended' && !running;
  if (running) visualEffectTimeHold = null;
  renderMatchPanel();
});
matchPanel.querySelector('#match-reset')!.addEventListener('click', () => {
  running = false;
  selectedTrapCard = null;
  matchState = createInitialState(1);
  visionMask = computeVision(matchState, 'player:north');
  refreshFog();
  pendingCommands = [];
  cardPulses = [];
  skillPulses = [];
  facilityPulses = [];
  bossPulses = [];
  trapPulses = [];
  itemPulses = [];
  nextSequence = 0;
  selectedPlatoon = 1;
  selectedRosterUnitId = null;
  rankSelectionUnitId = null;
  rosterMarkup = '';
  feedback = 'Match reset. Select a platoon, then right-click a walkable hex.';
  renderMatchPanel();
});
matchPanel.querySelector('#platoon-choices')!.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-platoon]');
  if (!button) return;
  selectedPlatoon = Number(button.dataset.platoon);
  renderMatchPanel();
});
matchPanel.querySelector('.macro-buttons')!.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-macro-shortcut], [data-camera-shortcut]');
  const code = button?.dataset.macroShortcut ?? button?.dataset.cameraShortcut;
  if (code) window.dispatchEvent(new KeyboardEvent('keydown', { code, bubbles: true }));
});
matchPanel.querySelector('#match-roster')!.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-unit]');
  if (!button) return;
  selectedRosterUnitId = button.dataset.unit!;
  const unit = matchState.players[0].units.find((entry) => entry.id === selectedRosterUnitId)!;
  selectedPlatoon = Number(unit.platoonId.split(':').at(-1));
  matchPanel.querySelector<HTMLSelectElement>('#match-unit')!.value = unit.id;
  matchPanel.querySelector<HTMLSelectElement>('#match-item-unit')!.value = unit.id;
  renderMatchPanel();
});
matchPanel.querySelector('#match-set-rank')!.addEventListener('click', () => {
  if (!selectedRosterUnitId) return;
  rankSelectionUnitId = selectedRosterUnitId;
  queueCommand({ type: 'set-formation-rank', unitId: selectedRosterUnitId, rank: Number(matchPanel.querySelector<HTMLSelectElement>('#match-formation-rank')!.value) as 1 | 2 | 3 });
  feedback = 'Formation rank queued for the next tick.';
  renderMatchPanel();
});
matchPanel.querySelector('#match-set-slot')!.addEventListener('click', () => {
  if (!selectedRosterUnitId) return;
  queueCommand({ type: 'set-formation-slot', unitId: selectedRosterUnitId, slot: Number(matchPanel.querySelector<HTMLSelectElement>('#match-formation-slot')!.value) - 1 });
  feedback = 'Formation slot queued for the next tick.';
  renderMatchPanel();
});
matchPanel.querySelector<HTMLSelectElement>('#match-stance')!.addEventListener('change', (event) => {
  queueCommand({ type: 'set-stance', platoonId: `platoon:north:${selectedPlatoon}`, stance: (event.target as HTMLSelectElement).value as 'aggressive' | 'defensive' | 'retreat' });
  feedback = 'Stance queued for the next tick.';
  renderMatchPanel();
});
matchPanel.querySelector<HTMLSelectElement>('#match-focus')!.addEventListener('change', (event) => {
  queueCommand({ type: 'set-focus', platoonId: `platoon:north:${selectedPlatoon}`, focus: (event.target as HTMLSelectElement).value as 'frontline' | 'backline' | 'siege' });
  feedback = 'Focus queued for the next tick.';
  renderMatchPanel();
});
matchPanel.querySelector('#match-hire')!.addEventListener('click', () => {
  queueCommand({ type: 'recruit', unitDefinitionId: recruitSelect.value, platoonId: `platoon:north:${selectedPlatoon}` });
  feedback = 'Hire queued for the next tick.';
  renderMatchPanel();
});
function playHandCard(cardId: string): void {
  if (isTrapCardId(cardId) || cardId === 'card:falcon-recon') {
    selectedTrapCard = cardId;
    feedback = cardId === 'card:falcon-recon'
      ? 'Falcon Recon selected. Click any map hex to reveal the area. Press Escape to cancel.'
      : `${CARD_LABELS[cardId]} selected. Click a valid visible hex to place it. Press Escape to cancel.`;
    renderMatchPanel();
    return;
  }
  queueCommand({ type: 'play-card', cardId, platoonId: `platoon:north:${selectedPlatoon}` });
  feedback = `${CARD_LABELS[cardId]} queued.`;
  renderMatchPanel();
}
matchPanel.querySelector('#match-cards')!.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-card]');
  if (button) playHandCard(button.dataset.card!);
});
matchPanel.querySelector('#match-buy-card')!.addEventListener('click', () => {
  queueCommand({ type: 'buy-card' });
  feedback = 'Extra card draw queued.';
  renderMatchPanel();
});
matchPanel.querySelector('#match-rite')!.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  if (target.closest('#match-reroll')) {
    queueCommand({ type: 'reroll-blessings' });
    feedback = 'Rite reroll queued.';
  } else {
    const button = target.closest<HTMLButtonElement>('[data-blessing]');
    if (!button) return;
    queueCommand({ type: 'choose-blessing', blessingId: button.dataset.blessing! });
    feedback = `${FIXTURE_BLESSINGS.find((entry) => entry.id === button.dataset.blessing)?.name ?? 'Blessing'} queued.`;
  }
  renderMatchPanel();
});
matchPanel.querySelector('#match-train-commander')!.addEventListener('click', () => {
  queueCommand({ type: 'train-commander' });
  feedback = 'Commander training queued for the next tick.';
  renderMatchPanel();
});
matchPanel.querySelector('#match-train-unit')!.addEventListener('click', () => {
  const unitId = matchPanel.querySelector<HTMLSelectElement>('#match-unit')!.value;
  if (!unitId) return;
  queueCommand({ type: 'train-unit', unitId });
  feedback = 'Unit training queued for the next tick.';
  renderMatchPanel();
});
matchPanel.querySelector('#match-buy-material')!.addEventListener('click', () => {
  queueCommand({ type: 'buy-material', material: matchPanel.querySelector<HTMLSelectElement>('#match-material')!.value as 'Gilded Ore' | 'Ironwood Timber' });
  feedback = 'Bazaar purchase queued.';
  renderMatchPanel();
});
matchPanel.querySelector('#match-craft-item')!.addEventListener('click', () => {
  queueCommand({ type: 'craft-item', itemId: matchPanel.querySelector<HTMLSelectElement>('#match-item')!.value as typeof ITEM_FIXTURES[number]['id'], unitId: matchPanel.querySelector<HTMLSelectElement>('#match-item-unit')!.value });
  feedback = 'Craft queued. The unit must stay at the Resource Tab for 10 seconds.';
  renderMatchPanel();
});
matchPanel.querySelector('#match-equip-item')!.addEventListener('click', () => {
  queueCommand({ type: 'equip-item', itemId: matchPanel.querySelector<HTMLSelectElement>('#match-item')!.value as typeof ITEM_FIXTURES[number]['id'], unitId: matchPanel.querySelector<HTMLSelectElement>('#match-item-unit')!.value });
  feedback = 'Equip queued.';
  renderMatchPanel();
});
matchPanel.querySelector('#match-item')!.addEventListener('change', renderMatchPanel);
matchPanel.querySelector('#match-item-unit')!.addEventListener('change', renderMatchPanel);
matchPanel.querySelector('#match-facility-slot')!.addEventListener('change', renderMatchPanel);
matchPanel.querySelector('#match-facility-kind')!.addEventListener('change', renderMatchPanel);
matchPanel.querySelector('#match-build-facility')!.addEventListener('click', () => {
  queueCommand({ type: 'build-facility', slotId: matchPanel.querySelector<HTMLSelectElement>('#match-facility-slot')!.value, kind: matchPanel.querySelector<HTMLSelectElement>('#match-facility-kind')!.value as 'caravan-post' | 'ballista' | 'arcane-barrier' | 'sanctuary' });
  feedback = 'Facility build queued for the next tick.';
  renderMatchPanel();
});
matchPanel.querySelector('#match-upgrade-facility')!.addEventListener('click', () => {
  queueCommand({ type: 'upgrade-facility', slotId: matchPanel.querySelector<HTMLSelectElement>('#match-facility-slot')!.value });
  feedback = 'Facility upgrade queued for the next tick.';
  renderMatchPanel();
});
app.canvas.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  const rect = app.canvas.getBoundingClientRect();
  const cell = worldToHex((event.clientX - rect.left - offsetX) / scale, (event.clientY - rect.top - offsetY) / scale);
  if (!cell) return;
  queueCommand({ type: 'set-order', platoonId: `platoon:north:${selectedPlatoon}`, target: cell });
  feedback = `Move order queued for ${cell.col}:${cell.row}.`;
  renderMatchPanel();
});
document.addEventListener('visibilitychange', () => { if (document.hidden && running) { running = false; feedback = 'Paused while tab is hidden.'; renderMatchPanel(); } });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && selectedTrapCard) { const label = CARD_LABELS[selectedTrapCard]; selectedTrapCard = null; feedback = `${label} placement canceled.`; renderMatchPanel(); } });
let bulletTimeFlip = false;
function advancePreviewTick(): boolean {
  const tick = matchState.tick + 1;
  // Isolated visual acceptance fixture; the real simulation still detects and emits the alert.
  const outriderFixture = import.meta.env.DEV ? window.__aurolithVisualOutriderFixture : null;
  if (outriderFixture) {
    const ownerIndex = outriderFixture === 'north' ? 0 : 1;
    const players = matchState.players.map((player, index) => ({
      ...player,
      platoons: player.platoons.map((platoon, slot) => slot === 0 ? {
        ...platoon, stance: 'defensive' as const, macro: index === ownerIndex ? 'outrider' as const : 'standard' as const,
        anchor: { col: index === ownerIndex ? 75 : 76, row: 40 }, order: null, route: [],
        peelTargetId: null, peelAllyId: null, peelLockUntilTick: 0, outriderAlertEnemyId: null,
      } : platoon),
      units: player.units.map((unit, slot) => ({
        ...unit, col: index === ownerIndex ? 75 : slot === 0 ? 76 : 90,
        row: index === ownerIndex || slot === 0 ? 40 : index === 0 ? 5 : 80,
        definitionId: index === ownerIndex && slot === 0 ? 'unit-def:jungle-stalker' : unit.definitionId,
        stunnedUntilTick: 0, snaredUntilTick: 0, channelCompleteAtTick: null, channelTargetId: null,
      })),
    }));
    matchState = { ...matchState, players: [players[0], players[1]] };
    window.__aurolithVisualOutriderFixture = null;
  }
  if (import.meta.env.DEV && window.__aurolithVisualVisionOrigin) {
    const origin = window.__aurolithVisualVisionOrigin;
    const north = matchState.players[0];
    const scoutPlatoon = north.platoons[0];
    const offsets = [{ col: 0, row: 0 }, { col: -1, row: 0 }, { col: 1, row: 0 }, { col: 0, row: -1 }, { col: 0, row: 1 }];
    let memberIndex = 0;
    matchState = { ...matchState, players: [
      {
        ...north,
        platoons: north.platoons.map((platoon) => platoon.id === scoutPlatoon.id
          ? { ...platoon, anchor: origin, order: null, route: [], moveProgressMilli: 0 }
          : platoon),
        units: north.units.map((unit) => {
          if (!scoutPlatoon.unitIds.includes(unit.id)) return unit;
          const offset = offsets[memberIndex++ % offsets.length];
          return { ...unit, col: origin.col + offset.col, row: origin.row + offset.row, rallyProgressMilli: 0 };
        }),
      },
      matchState.players[1],
    ] };
    window.__aurolithVisualVisionOrigin = null;
  }
  if (import.meta.env.DEV && window.__aurolithVisualGiveTrapCard) {
    const north = matchState.players[0];
    const removeTrap = <T extends string>(cards: readonly T[]) => cards.filter((id) => id !== 'card:alchemical-landmine');
    matchState = { ...matchState, players: [
      { ...north, cards: { ...north.cards, hand: [...removeTrap(north.cards.hand).slice(0, 5), 'card:alchemical-landmine' as const], drawPile: removeTrap(north.cards.drawPile), locked: removeTrap(north.cards.locked), overflow: north.cards.overflow.filter((card) => card.id !== 'card:alchemical-landmine'), discard: removeTrap(north.cards.discard) } },
      matchState.players[1],
    ] };
    window.__aurolithVisualGiveTrapCard = false;
  }
  if (import.meta.env.DEV && window.__aurolithVisualTrapTarget) {
    const target = window.__aurolithVisualTrapTarget;
    const entry = matchState.players[1];
    const lead = entry.platoons.find((platoon) => platoon.id === 'platoon:south:1')!;
    const reserve = entry.platoons.find((platoon) => platoon.id === 'platoon:south:2')!;
    const leadUnitId = entry.units.filter((unit) => unit.hp > 0)
      .sort((a, b) => b.hp - a.hp || a.id.localeCompare(b.id))[0]?.id;
    if (leadUnitId) {
      const stagingHex = { col: target.col, row: target.row - 1 };
      const units = entry.units.map((unit) => unit.id === leadUnitId
        ? { ...unit, platoonId: lead.id, ...stagingHex, hp: 100000, respawnAtTick: null, stunnedUntilTick: 0, snaredUntilTick: 0, slowUntilTick: 0, untargetableUntilTick: tick + 100, channelCompleteAtTick: null, channelTargetId: null, rallyProgressMilli: 0, attackProgressMilli: 0 }
        : { ...unit, platoonId: reserve.id });
      const platoons = entry.platoons.map((platoon) => platoon.id === lead.id
        ? { ...platoon, unitIds: [leadUnitId], anchor: stagingHex, order: null, route: [], moveProgressMilli: 0 }
        : platoon.id === reserve.id ? { ...platoon, unitIds: entry.units.filter((unit) => unit.id !== leadUnitId).map((unit) => unit.id) } : platoon);
      matchState = { ...matchState, players: [matchState.players[0], { ...entry, units, platoons }] };
    }
    window.__aurolithVisualTrapTarget = null;
  }
  const visualOrder = import.meta.env.DEV ? window.__aurolithVisualTestOrder : null;
  pendingCommands.push(...botCommands(matchState, 'player:south').filter((entry) => !outriderFixture && (!visualOrder
    || entry.command.type !== 'set-order' || entry.command.platoonId !== visualOrder.platoonId)));
  if (visualOrder && !window.__aurolithVisualTestOrderQueued) {
    pendingCommands.push({
      tick,
      sequence: tick * 100 + 99,
      playerId: 'player:south',
      command: { type: 'set-order', platoonId: visualOrder.platoonId, target: visualOrder.target },
    });
    window.__aurolithVisualTestOrderQueued = true;
  }
  const currentCommands = pendingCommands.filter((entry) => entry.tick === tick);
  const step = stepMatch(matchState, currentCommands);
  for (const event of step.state.events.filter((entry) => entry.tick === step.state.tick && entry.type === 'boss-warning')) {
    playBossWarningHorn();
    announceVisualAcceptanceEvent('boss-warning', { type: 'warning', bossId: event.id });
  }
  pendingCommands = pendingCommands.filter((entry) => entry.tick > tick);
  matchState = step.state;
  if (import.meta.env.DEV && window.__aurolithVisualForceBossAbility && matchState.tick === 1200) {
    const boss = matchState.bosses[0];
    const north = matchState.players[0];
    const south = matchState.players[1];
    matchState = {
      ...matchState,
      bosses: [{ ...boss, hp: 749, spawnedAtTick: 1200, killedAtTick: null, abilityReadyAtTick: 1201, enrageUsed: false, enragedUntilTick: 0, broodCalled: false, minions: [], damageByPlayer: [751, 0], lastHitPlayerId: null, relic: null }, ...matchState.bosses.slice(1)],
      players: [
        { ...north, units: north.units.map((unit, index) => index === 0 ? { ...unit, col: 14, row: 45, hp: 100000, respawnAtTick: null, attackProgressMilli: 0 } : unit) },
        { ...south, units: south.units.map((unit, index) => index === 0 ? { ...unit, col: 16, row: 45, hp: 100000, respawnAtTick: null, attackProgressMilli: 0 } : unit) },
      ],
    };
    window.__aurolithVisualForceBossAbility = false;
  }
  if (import.meta.env.DEV && window.__aurolithVisualTestOrder) {
    const south = matchState.players[1];
    window.__aurolithVisualDebugState = {
      tick: matchState.tick,
      accepted: step.accepted,
      rejected: step.rejected,
      traps: matchState.traps,
      platoon: south.platoons.find((entry) => entry.id === window.__aurolithVisualTestOrder!.platoonId),
      units: south.units.map(({ id, col, row, hp, platoonId }) => ({ id, col, row, hp, platoonId })),
      trapEvents: step.trapEvents,
    };
  }
  const nextVision = computeVision(matchState, 'player:north', visionMask);
  const visionChanged = nextVision.some((value, index) => value !== visionMask[index]);
  const eventVision = nextVision.map((value, index) => value === 2 || visionMask[index] === 2 ? 2 : value);
  visionMask = nextVision;
  minimapEnemyUnits = projectPlayerView(matchState, 'player:north', visionMask).enemy.visibleUnits.map(({ col, row }) => ({ col, row }));
  const startedAt = performance.now();
  const projectedOutriderAlerts = projectOutriderAlertEvents(step.outriderAlerts, 'player:north');
  if (outriderFixture) window.__aurolithVisualOutriderResult = { emittedOwners: step.outriderAlerts.map((event) => event.ownerId), projectedCount: projectedOutriderAlerts.length };
  for (const event of projectedOutriderAlerts) {
    minimapAlerts.push({ col: event.col, row: event.row, startedAt });
    announceVisualAcceptanceEvent('outrider', event);
  }
  if (step.outriderAlerts.some((event) => event.ownerId === 'player:north')) drawMinimap();
  const ownUnits = matchState.players[0].units;
  const visibleEventUnitIds = new Set([
    ...ownUnits.map((unit) => unit.id),
    ...matchState.players[1].units.filter((unit) => eventVision[unit.row * BOARD_COLUMNS + unit.col] === 2
      && canDetectBrushOccupant(ownUnits, unit)).map((unit) => unit.id),
  ]);
  if (step.cardEvents.length) {
    const visibleEnemyIds = new Set(matchState.players[1].units.filter((unit) => unit.hp > 0 && visibleEventUnitIds.has(unit.id)).map((unit) => unit.id));
    for (const event of projectCardCastEvents(step.cardEvents, 'player:north', eventVision, visibleEnemyIds)) {
      const color = event.cardId === 'card:phalanx-formation' ? 0x92c5f5 : event.cardId === 'card:alchemical-boom' ? 0x7ce7a5 : 0xf5cd76;
      for (const target of event.targets) cardPulses.push({ ...hexCenter(target.col, target.row), color, startedAt });
      announceVisualAcceptanceEvent('card', event);
    }
  }
  for (const event of projectCombatEvents(step.combatEvents, eventVision, visibleEventUnitIds)) {
    skillPulses.push({ type: event.type, skillId: event.skillId, sourceId: event.sourceId, targetId: event.targetId, source: event.source ? hexCenter(event.source.col, event.source.row) : null, target: event.target ? hexCenter(event.target.col, event.target.row) : null, startedAt });
    announceVisualAcceptanceEvent('combat', event);
  }
  for (const event of projectFacilityAttackEvents(step.facilityEvents, eventVision)) facilityPulses.push({ source: event.source ? hexCenter(event.source.col, event.source.row) : null, target: event.target ? hexCenter(event.target.col, event.target.row) : null, startedAt });
  for (const event of projectBossCombatEvents(step.bossEvents, eventVision)) {
    const point = hexCenter(event.col, event.row);
    bossPulses.push({ ...point, color: event.type === 'kill' ? 0xffdf7a : event.type === 'relic-claim' ? 0xa3f3e1 : event.type === 'spawn' ? 0xeeab6d : 0xf17955, startedAt });
    if (event.type === 'ability' || event.type === 'summon' || event.type === 'leash-reset') announceVisualAcceptanceEvent('boss', event);
  }
  for (const event of projectTrapEvents(step.trapEvents, 'player:north', eventVision)) {
    const point = hexCenter(event.col, event.row);
    if (event.type === 'warning') playTrapWarningClick();
    trapPulses.push({ ...point, color: event.type === 'detonate' ? 0xf46a42 : event.type === 'warning' ? 0xf4b957 : event.type === 'placed' ? 0xb271ce : 0xe59460, startedAt });
    announceVisualAcceptanceEvent('trap', event);
  }
  for (const event of projectItemEvents(step.itemEvents, 'player:north', eventVision)) {
    const { x, y } = hexCenter(event.col, event.row);
    itemPulses.push({ x, y, color: event.type.endsWith('cancel') ? 0xeb786a : event.type.endsWith('complete') ? 0xf0d98d : 0x8bc5f2, startedAt });
  }
  const ownRejected = step.rejected.filter((entry) => currentCommands.some((input) => input.playerId === 'player:north' && input.sequence === entry.sequence));
  const ownAccepted = step.accepted.filter((sequence) => currentCommands.some((input) => input.playerId === 'player:north' && input.sequence === sequence));
  if (currentCommands.some((input) => input.playerId === 'player:north' && input.command.type === 'set-formation-rank')) rankSelectionUnitId = null;
  if (ownRejected.length) feedback = ownRejected.map((entry) => entry.reason).join(' · ');
  else if (ownAccepted.length) feedback = `${ownAccepted.length} command${ownAccepted.length === 1 ? '' : 's'} accepted.`;
  if (matchState.phase === 'ended') { running = false; feedback = `Match ended: ${matchState.result?.reason ?? 'unknown'}.`; }
  return visionChanged || tick === 1;
}
window.setInterval(() => {
  if (!running) return;
  if ([0, 3000, 6000].some((openingTick) => matchState.tick >= openingTick && matchState.tick < openingTick + 30)) {
    bulletTimeFlip = !bulletTimeFlip;
    if (bulletTimeFlip) return;
  } else bulletTimeFlip = false;
  const speed = Number(matchPanel.querySelector<HTMLSelectElement>('#match-speed')!.value);
  let fogChanged = false;
  for (let index = 0; index < speed && running; index++) fogChanged = advancePreviewTick() || fogChanged;
  if (fogChanged) refreshFog();
  drawMinimap();
  renderMatchPanel();
}, 100);
renderMatchPanel();

type Chunk = { col: number; row: number; graphic: Graphics | null; fog: Graphics | null };
const chunks: Chunk[] = [];
for (let row = 0; row < BOARD_ROWS; row += CHUNK) {
  for (let col = 0; col < BOARD_COLUMNS; col += CHUNK) chunks.push({ col, row, graphic: null, fog: null });
}
const facilityPadHexes = new Set(matchState.players.flatMap((player) => player.facilities.flatMap((slot) =>
  Array.from({ length: 9 }, (_, index) => (slot.row + Math.floor(index / 3)) * BOARD_COLUMNS + slot.col + index % 3))));
const hexPoints = Array.from({ length: 6 }, (_, i) => {
  const a = (60 * i - 30) * Math.PI / 180;
  return [Math.cos(a) * (HEX_SIZE - 0.15), Math.sin(a) * (HEX_SIZE - 0.15)];
}).flat();

function cloudColor(col: number, row: number): number {
  const castleEdge = col < CASTLE_FIRST_COLUMN ? CASTLE_FIRST_COLUMN - 1 - col : col - CASTLE_LAST_COLUMN - 1;
  const battlefieldEdge = row < 20 ? 19 - row : row - 70;
  const banks = Math.sin(col * 0.36 + row * 0.19) * 8 + Math.sin(row * 0.51 - col * 0.16) * 6;
  const shadow = 32 * Math.exp(-castleEdge / 3.2) + 12 * Math.exp(-battlefieldEdge / 2.4);
  const gray = Math.round(Math.max(174, Math.min(242, 221 + banks - shadow)));
  return (gray << 16) | (Math.min(255, gray + 5) << 8) | Math.min(255, gray + 7);
}

function shroudColor(col: number, row: number): number {
  const drift = Math.round(Math.sin(col * 0.21 + row * 0.13) * 5 + Math.sin(row * 0.27 - col * 0.08) * 4);
  return ((143 + drift) << 16) | ((149 + drift) << 8) | (153 + drift);
}

function terrainPattern(terrain: Terrain): { pattern: FillPattern; tint: number } | null {
  if (terrain === 'field') return { pattern: groundPatterns[0], tint: 0xffffff };
  if (terrain === 'jungle') return { pattern: groundPatterns[1], tint: 0xffffff };
  if (terrain === 'clearing') return { pattern: groundPatterns[0], tint: 0xe3efd4 };
  if (terrain === 'highway') return { pattern: groundPatterns[2], tint: 0xffffff };
  if (terrain === 'fortress') return { pattern: groundPatterns[3], tint: 0xffffff };
  if (terrain === 'wall') return { pattern: groundPatterns[4], tint: 0xffffff };
  return null;
}

function detailNoise(col: number, row: number, salt = 0): number {
  const value = Math.sin(col * 127.1 + row * 311.7 + salt * 74.7) * 43758.5453;
  return value - Math.floor(value);
}

function addProp(container: Container, index: number, center: { x: number; y: number }, size: number, yOffset = 9): void {
  const texture = environmentProps[index];
  const sprite = new Sprite({ texture });
  const aspect = texture.width / texture.height;
  sprite.anchor.set(0.5, 0.8);
  // The illustrated sheet has transparent breathing room around each prop;
  // enlarge it slightly so silhouettes stay readable at the default zoom.
  const artSize = size * 1.3;
  sprite.width = artSize * Math.min(1, aspect);
  sprite.height = artSize * Math.min(1, 1 / aspect);
  sprite.position.set(center.x, center.y + yOffset);
  container.addChild(sprite);
}

const TERRAIN_VEIL: Partial<Record<Terrain, { color: number; alpha: number }>> = {
  jungle: { color: 0x12543f, alpha: 0.1 },
  clearing: { color: 0xb7ca91, alpha: 0.12 },
  field: { color: 0xc7d19a, alpha: 0.08 },
  highway: { color: 0xddbb56, alpha: 0.06 },
  fortress: { color: 0xc4b692, alpha: 0.05 },
  wall: { color: 0x687279, alpha: 0.06 },
};

function buildChunk(chunk: Chunk): Graphics {
  const g = new Graphics();
  for (let row = chunk.row; row < Math.min(chunk.row + CHUNK, BOARD_ROWS); row++) {
    for (let col = chunk.col; col < Math.min(chunk.col + CHUNK, BOARD_COLUMNS); col++) {
      const hex = getHex(col, row)!;
      const center = hexCenter(col, row);
      const points = hexPoints.map((v, i) => v + (i % 2 === 0 ? center.x : center.y));
      const material = terrainPattern(hex.terrain);
      if (material) {
        g.poly(points).fill({ fill: material.pattern, color: material.tint });
        const veil = TERRAIN_VEIL[hex.terrain]!;
        g.poly(points).fill({ color: veil.color, alpha: veil.alpha });
      } else g.poly(points).fill(hex.terrain === 'cloud' ? cloudColor(col, row) : COLORS[hex.terrain]);
      if (facilityPadHexes.has(row * BOARD_COLUMNS + col)) {
        g.poly(points).fill({ color: 0xb79c69, alpha: 0.2 });
        g.poly(points).stroke({ color: 0xe3c782, width: 1.1, alpha: 0.55 });
      }
      const detail = detailNoise(col, row);
      // Sprite props are decorative except brushes: brush tiles already participate in concealment rules.
      if (hex.isBrush) addProp(g, 1, center, 38, 9);
      if (hex.decoration === 'tree' || hex.decoration === 'canopy') addProp(g, 0, center, hex.decoration === 'canopy' ? 58 : 48, 8);
      else if (hex.decoration === 'fence') addProp(g, 5, center, 48, 7);
      else if (hex.decoration === 'boulder') addProp(g, 7, center, 44, 6);
      else if (!hex.isBrush && hex.terrain === 'jungle' && detail > 0.975) addProp(g, 0, center, 46, 8);
      else if ((hex.terrain === 'field' || hex.terrain === 'clearing') && detail > 0.93) addProp(g, 6, center, 30, 12);
      if ((hex.terrain === 'field' || hex.terrain === 'clearing') && detail > 0.985) addProp(g, 3, center, 31, 10);
      if (hex.terrain === 'field' && hex.decoration === null && detail > 0.9975) addProp(g, 4, center, 37, 7);
      else if (hex.terrain === 'fortress' && detail > 0.982) addProp(g, 3, center, 28, 12);
      else if (hex.terrain === 'highway' && detail > 0.982) addProp(g, 7, center, 22, 12);
      if (hex.terrain === 'cloud') {
        const drift = (col * 13 + row * 7) % 9 - 4;
        g.ellipse(center.x - 4 + drift, center.y - 4, 11, 5).fill({ color: 0xffffff, alpha: 0.13 });
        g.ellipse(center.x + 5 - drift, center.y + 5, 9, 4).fill({ color: 0x657980, alpha: 0.065 });
      }
    }
  }
  world.addChildAt(g, 0);
  chunk.fog = new Graphics();
  fogLayer.addChild(chunk.fog);
  drawFogChunk(chunk);
  return g;
}

function drawFogChunk(chunk: Chunk): void {
  const fog = chunk.fog;
  if (!fog) return;
  fog.clear();
  for (let row = chunk.row; row < Math.min(chunk.row + CHUNK, BOARD_ROWS); row++) {
    for (let col = chunk.col; col < Math.min(chunk.col + CHUNK, BOARD_COLUMNS); col++) {
      const visibility = visionMask[row * BOARD_COLUMNS + col];
      if (visibility === 2) continue;
      const center = hexCenter(col, row);
      const points = hexPoints.map((value, index) => value + (index % 2 === 0 ? center.x : center.y));
      fog.poly(points).fill({ color: visibility === 1 ? 0x777f84 : shroudColor(col, row), alpha: visibility === 1 ? 0.42 : 0.62 });
      if (visibility === 0 && (col * 17 + row * 29) % 97 === 0) fog.circle(center.x + 4, center.y - 3, 1.2).fill({ color: 0xd4af37, alpha: 0.22 });
    }
  }
}

function refreshFog(): void {
  for (const chunk of chunks) drawFogChunk(chunk);
  const context = miniFog.getContext('2d')!;
  context.clearRect(0, 0, miniFog.width, miniFog.height);
  const cellWidth = miniFog.width / BOARD_COLUMNS;
  const cellHeight = miniFog.height / BOARD_ROWS;
  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLUMNS; col++) {
      const visibility = visionMask[row * BOARD_COLUMNS + col];
      if (visibility === 2) continue;
      context.fillStyle = visibility === 1 ? '#777f846b' : `#${shroudColor(col, row).toString(16).padStart(6, '0')}9e`;
      context.fillRect(col * cellWidth, row * cellHeight, cellWidth + 0.2, cellHeight + 0.2);
    }
  }
  drawMinimap();
}

let scale = 1;
let offsetX = 0;
let offsetY = 0;
let selected: Hex | null = null;
const MIN_SCALE = 0.04;
const MAX_SCALE = 2.3;
const zoomValue = document.querySelector<HTMLElement>('#zoom-value')!;

function cameraTo(x: number, y: number, nextScale = scale): void {
  scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, nextScale));
  offsetX = app.screen.width / 2 - x * scale;
  offsetY = app.screen.height / 2 - y * scale;
  updateCamera();
}

function updateCamera(): void {
  world.scale.set(scale);
  world.position.set(offsetX, offsetY);
  if (import.meta.env.DEV) window.__aurolithCameraDebug = { scale, offsetX, offsetY, screenWidth: app.screen.width, screenHeight: app.screen.height };
  zoomValue.textContent = `${Math.round(scale * 100)}%`;
  const left = -offsetX / scale - HEX_WIDTH * CHUNK;
  const right = (app.screen.width - offsetX) / scale + HEX_WIDTH * CHUNK;
  const top = -offsetY / scale - ROW_HEIGHT * CHUNK;
  const bottom = (app.screen.height - offsetY) / scale + ROW_HEIGHT * CHUNK;
  for (const chunk of chunks) {
    const x = chunk.col * HEX_WIDTH;
    const y = chunk.row * ROW_HEIGHT;
    const visible = x < right && x + (CHUNK + 1) * HEX_WIDTH > left && y < bottom && y + CHUNK * ROW_HEIGHT + HEX_SIZE > top;
    if (visible && !chunk.graphic) chunk.graphic = buildChunk(chunk);
    if (chunk.graphic) chunk.graphic.visible = visible;
    if (chunk.fog) chunk.fog.visible = visible;
  }
  drawMinimap();
}

function fitBoard(): void {
  const fitScale = Math.min((app.screen.width - 70) / BOARD_WIDTH, (app.screen.height - 70) / BOARD_HEIGHT);
  cameraTo(BOARD_WIDTH / 2, BOARD_HEIGHT / 2, fitScale);
}

function zoomAt(factor: number, clientX: number, clientY: number): void {
  const rect = app.canvas.getBoundingClientRect();
  const sx = clientX - rect.left;
  const sy = clientY - rect.top;
  const wx = (sx - offsetX) / scale;
  const wy = (sy - offsetY) / scale;
  scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * factor));
  offsetX = sx - wx * scale;
  offsetY = sy - wy * scale;
  updateCamera();
}

function showSelection(hex: Hex): void {
  selected = hex;
  const view = projectPlayerView(matchState, 'player:north', visionMask);
  const visibility = visionMask[hex.row * BOARD_COLUMNS + hex.col];
  const facility = visibility === 2 ? [...view.structures.friendlyFacilities, ...view.structures.visibleEnemyFacilities]
    .find((slot) => facilityFootprint(slot).some((point) => point.col === hex.col && point.row === hex.row)) : null;
  const wall = visibility === 2 ? [...view.structures.friendlyWalls, ...view.structures.visibleEnemyWalls]
    .find((entry) => entry.row === hex.row && hex.col >= entry.col && hex.col < entry.col + entry.width) : null;
  const footprint = facility ? facilityFootprint(facility) : wall
    ? Array.from({ length: wall.width }, (_, index) => ({ col: wall.col + index, row: wall.row })) : [hex];
  selectionGraphic.clear();
  for (const point of footprint) {
    const { x, y } = hexCenter(point.col, point.row);
    selectionGraphic.poly(hexPoints.map((value, index) => value + (index % 2 === 0 ? x : y)))
      .stroke({ color: 0xf2d58e, width: 3 / scale, alpha: 1 });
  }
  const label = hex.zone.replace('-', ' ').toUpperCase();
  document.querySelector('#selection')!.innerHTML = visibility === 0
    ? `<div class="selection-icon">⌖</div><strong>Unexplored</strong><small>Column ${hex.col} · Row ${hex.row}</small>`
    : facility
      ? `<div class="selection-icon">⌖</div><div class="selection-meta">${label} / ${facility.id}</div><strong>${facility.kind ? facility.kind === 'ballista' ? 'Ballista' : facility.kind === 'arcane-barrier' ? 'Arcane Barrier' : facility.kind === 'sanctuary' ? 'Sanctuary' : 'Caravan Post' : 'Facility plot'}</strong><small>3 × 3 footprint · ${facility.kind ? `Tier ${facility.tier} · ${facility.hp}/${facility.maxHp} HP` : 'Empty'}</small>`
    : wall
      ? `<div class="selection-icon">⌖</div><div class="selection-meta">${label} / ${wall.id}</div><strong>${wall.layer === 'outer' ? 'Outer' : 'Inner'} wall</strong><small>6 hexes · ${wall.hp}/${wall.maxHp} HP</small>`
    : `<div class="selection-icon">⌖</div><div class="selection-meta">${label} / ${hex.id}</div><strong>${hex.decoration ? SCENERY_LABELS[hex.decoration] : LABELS[hex.terrain]}</strong><small>Column ${hex.col} <span>·</span> Row ${hex.row} · ${hex.isWalkable ? 'Passable' : 'Blocked'}</small>`;
  drawMinimap();
}

let pointer: { id: number; x: number; y: number; startX: number; startY: number; moved: boolean } | null = null;
app.canvas.addEventListener('pointerdown', (event) => {
  if (event.button !== 0 && event.button !== 1 && event.button !== 2) return;
  app.canvas.focus();
  pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, moved: false };
  app.canvas.setPointerCapture(event.pointerId);
  app.canvas.classList.add('dragging');
});
app.canvas.addEventListener('pointermove', (event) => {
  if (!pointer || pointer.id !== event.pointerId) return;
  if (Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY) > 4) pointer.moved = true;
  if (pointer.moved) {
    offsetX += event.clientX - pointer.x;
    offsetY += event.clientY - pointer.y;
    updateCamera();
  }
  pointer.x = event.clientX;
  pointer.y = event.clientY;
});
app.canvas.addEventListener('pointerup', (event) => {
  if (!pointer || pointer.id !== event.pointerId) return;
  if (!pointer.moved && event.button === 0) {
    const rect = app.canvas.getBoundingClientRect();
    const cell = worldToHex((event.clientX - rect.left - offsetX) / scale, (event.clientY - rect.top - offsetY) / scale);
    if (cell && selectedTrapCard) {
      if (selectedTrapCard === 'card:falcon-recon') {
        queueCommand({ type: 'play-card', cardId: selectedTrapCard, target: cell });
        feedback = `Falcon Recon queued at ${cell.col}:${cell.row}.`;
        selectedTrapCard = null;
      } else if (isTrapCardId(selectedTrapCard)) {
        if (!validTrapHex(TRAP_CARD_KINDS[selectedTrapCard], cell.col, cell.row) || visionMask[cell.row * BOARD_COLUMNS + cell.col] !== 2) feedback = `${CARD_LABELS[selectedTrapCard]} needs a valid visible hex.`;
        else {
          const label = CARD_LABELS[selectedTrapCard];
          queueCommand({ type: 'play-card', cardId: selectedTrapCard, target: cell });
          feedback = `${label} placement queued at ${cell.col}:${cell.row}.`;
          selectedTrapCard = null;
        }
      }
      renderMatchPanel();
    } else if (cell) showSelection(getHex(cell.col, cell.row)!);
  }
  pointer = null;
  app.canvas.classList.remove('dragging');
});
app.canvas.addEventListener('pointercancel', () => { pointer = null; app.canvas.classList.remove('dragging'); });
app.canvas.addEventListener('contextmenu', (event) => event.preventDefault());
app.canvas.addEventListener('wheel', (event) => { event.preventDefault(); zoomAt(event.deltaY < 0 ? 1.12 : 1 / 1.12, event.clientX, event.clientY); }, { passive: false });
document.querySelector('#zoom-in')!.addEventListener('click', () => { const r = app.canvas.getBoundingClientRect(); zoomAt(1.25, r.left + r.width / 2, r.top + r.height / 2); });
document.querySelector('#zoom-out')!.addEventListener('click', () => { const r = app.canvas.getBoundingClientRect(); zoomAt(1 / 1.25, r.left + r.width / 2, r.top + r.height / 2); });
document.querySelector('#fit')!.addEventListener('click', fitBoard);
window.addEventListener('keydown', (event) => {
  if (event.target !== app.canvas || event.altKey || event.ctrlKey || event.metaKey) return;
  const step = 80;
  if (event.key === 'ArrowLeft') offsetX += step;
  else if (event.key === 'ArrowRight') offsetX -= step;
  else if (event.key === 'ArrowUp') offsetY += step;
  else if (event.key === 'ArrowDown') offsetY -= step;
  else if (event.key === 'Home') { fitBoard(); return; }
  else return;
  event.preventDefault();
  updateCamera();
});
window.addEventListener('keydown', (event) => {
  const target = event.target;
  const isTyping = target instanceof HTMLElement && (target.isContentEditable || target.matches('input, textarea, select, [contenteditable="true"]'));
  if (isTyping || event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
  if (event.code === 'KeyP') {
    setKeyboardHelpOpen(keyboardHelp.hidden);
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  const offer = matchState.players[0].blessings.offer;
  const digit = /^Digit([1-4])$/.exec(event.code);
  if (offer && digit && Number(digit[1]) <= 3) {
    const blessingId = offer.options[Number(digit[1]) - 1];
    queueCommand({ type: 'choose-blessing', blessingId });
    feedback = `${FIXTURE_BLESSINGS.find((entry) => entry.id === blessingId)?.name ?? 'Blessing'} queued.`;
  } else if (offer && event.code === 'KeyR') {
    if (!matchState.players[0].blessings.rerollsRemaining) return;
    queueCommand({ type: 'reroll-blessings' });
    feedback = 'Rite reroll queued.';
  } else if (digit) {
    selectedPlatoon = Number(digit[1]);
    feedback = `Platoon ${selectedPlatoon} selected.`;
  } else if (event.code in { KeyA: 1, KeyD: 1, KeyR: 1 }) {
    const stance = { KeyA: 'aggressive', KeyD: 'defensive', KeyR: 'retreat' }[event.code] as 'aggressive' | 'defensive' | 'retreat';
    queueCommand({ type: 'set-stance', platoonId: `platoon:north:${selectedPlatoon}`, stance });
    feedback = `${stance} stance queued for Platoon ${selectedPlatoon}.`;
  } else if (event.code in { KeyZ: 1, KeyX: 1, KeyC: 1 }) {
    const focus = { KeyZ: 'frontline', KeyX: 'backline', KeyC: 'siege' }[event.code] as 'frontline' | 'backline' | 'siege';
    queueCommand({ type: 'set-focus', platoonId: `platoon:north:${selectedPlatoon}`, focus });
    feedback = `${focus} focus queued for Platoon ${selectedPlatoon}.`;
  } else if (event.code === 'KeyG' || event.code === 'KeyJ') {
    const requestedMacro = event.code === 'KeyG' ? 'gather' : 'outrider';
    const currentMacro = matchState.players[0].platoons[selectedPlatoon - 1].macro;
    const macro = currentMacro === requestedMacro ? 'standard' : requestedMacro;
    queueCommand({ type: 'set-macro', platoonId: `platoon:north:${selectedPlatoon}`, macro });
    feedback = `${macro === 'standard' ? 'Macro cleared' : macro === 'gather' ? 'Gather' : 'Outrider'} ${macro === 'standard' ? '' : 'macro '}queued for Platoon ${selectedPlatoon}.`;
  } else if ('KeyQ KeyW KeyE KeyT KeyY KeyU'.split(' ').includes(event.code)) {
    const slot = 'KeyQ KeyW KeyE KeyT KeyY KeyU'.split(' ').indexOf(event.code);
    const cardId = matchState.players[0].cards.hand[slot];
    if (!cardId) return;
    playHandCard(cardId);
  } else if (event.code === 'KeyO') {
    if (matchState.phase === 'ended') return;
    running = !running;
    if (running) visualEffectTimeHold = null;
    feedback = running ? 'Match resumed.' : 'Match paused.';
  } else if (event.code === 'KeyH') {
    const point = hexCenter(75, 12);
    cameraTo(point.x, point.y, Math.max(scale, 0.45));
  } else if (/^F[1-4]$/.test(event.code)) {
    const platoon = matchState.players[0].platoons[Number(event.code.slice(1)) - 1];
    const point = hexCenter(platoon.anchor.col, platoon.anchor.row);
    cameraTo(point.x, point.y, Math.max(scale, 0.45));
  } else return;
  event.preventDefault();
  event.stopPropagation();
  renderMatchPanel();
});

const minimap = document.querySelector<HTMLCanvasElement>('#minimap')!;
const miniCtx = minimap.getContext('2d')!;
const miniBase = document.createElement('canvas');
miniBase.width = minimap.width;
miniBase.height = minimap.height;
const miniFog = document.createElement('canvas');
miniFog.width = minimap.width;
miniFog.height = minimap.height;
const baseCtx = miniBase.getContext('2d')!;
baseCtx.fillStyle = '#142322';
baseCtx.fillRect(0, 0, miniBase.width, miniBase.height);
for (let row = 0; row < BOARD_ROWS; row++) {
  for (let col = 0; col < BOARD_COLUMNS; col++) {
    const hex = getHex(col, row)!;
    baseCtx.fillStyle = `#${(hex.terrain === 'cloud' ? cloudColor(col, row) : COLORS[hex.terrain]).toString(16).padStart(6, '0')}`;
    baseCtx.fillRect(col * miniBase.width / BOARD_COLUMNS, row * miniBase.height / BOARD_ROWS, miniBase.width / BOARD_COLUMNS + 0.2, miniBase.height / BOARD_ROWS + 0.2);
  }
}
function drawMinimap(): void {
  const w = minimap.width;
  const h = minimap.height;
  miniCtx.drawImage(miniBase, 0, 0);
  miniCtx.drawImage(miniFog, 0, 0);
  const cellW = w / BOARD_COLUMNS;
  const cellH = h / BOARD_ROWS;
  const now = performance.now();
  minimapAlerts = minimapAlerts.filter((alert) => now - alert.startedAt < 1800);
  for (const alert of minimapAlerts) {
    const age = (now - alert.startedAt) / 1800;
    miniCtx.strokeStyle = `rgba(255, 100, 82, ${1 - age})`;
    miniCtx.lineWidth = 2;
    miniCtx.beginPath();
    miniCtx.arc((alert.col + 0.5) * cellW, (alert.row + 0.5) * cellH, 2 + age * 9, 0, Math.PI * 2);
    miniCtx.stroke();
  }
  for (const unit of matchState.players[0].units) {
    if (unit.hp <= 0) continue;
    miniCtx.beginPath();
    miniCtx.fillStyle = '#f2d177';
    miniCtx.arc((unit.col + 0.5) * cellW, (unit.row + 0.5) * cellH, 2.2, 0, Math.PI * 2);
    miniCtx.fill();
  }
  for (const unit of minimapEnemyUnits) {
    miniCtx.beginPath();
    miniCtx.fillStyle = '#ff574d';
    miniCtx.strokeStyle = '#ffe4d9';
    miniCtx.lineWidth = 0.8;
    miniCtx.arc((unit.col + 0.5) * cellW, (unit.row + 0.5) * cellH, 3, 0, Math.PI * 2);
    miniCtx.fill();
    miniCtx.stroke();
  }
  if (selected) {
    miniCtx.strokeStyle = '#f3d58e';
    miniCtx.lineWidth = 1.5;
    miniCtx.beginPath();
    miniCtx.arc((selected.col + 0.5) * cellW, (selected.row + 0.5) * cellH, 4, 0, Math.PI * 2);
    miniCtx.stroke();
  }
  miniCtx.strokeStyle = '#fff3cc';
  miniCtx.lineWidth = 1.5;
  const viewLeft = Math.max(0, Math.min(w, (-offsetX / scale) / BOARD_WIDTH * w));
  const viewTop = Math.max(0, Math.min(h, (-offsetY / scale) / BOARD_HEIGHT * h));
  const viewRight = Math.max(viewLeft, Math.min(w, ((app.screen.width - offsetX) / scale) / BOARD_WIDTH * w));
  const viewBottom = Math.max(viewTop, Math.min(h, ((app.screen.height - offsetY) / scale) / BOARD_HEIGHT * h));
  miniCtx.strokeRect(viewLeft, viewTop, viewRight - viewLeft, viewBottom - viewTop);
  const cameraHex = worldToHex((app.screen.width / 2 - offsetX) / scale, (app.screen.height / 2 - offsetY) / scale);
  if (cameraHex) {
    minimap.dataset.cameraCol = String(cameraHex.col);
    minimap.dataset.cameraRow = String(cameraHex.row);
  }
}
minimap.addEventListener('click', (event) => {
  const rect = minimap.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width * BOARD_WIDTH;
  const y = (event.clientY - rect.top) / rect.height * BOARD_HEIGHT;
  cameraTo(x, y, Math.max(scale, 0.45));
});
new ResizeObserver(() => requestAnimationFrame(updateCamera)).observe(boardElement);
const initialHomeView = hexCenter(75, 18);
cameraTo(initialHomeView.x, initialHomeView.y, 1);
refreshFog();
