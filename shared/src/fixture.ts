import { getHex } from './board.js';

export type AssetRecord = Readonly<{ id: string; sourcePath: string; publicPath: string; format: 'png' | 'jpg'; provisional?: boolean }>;
export type UnitDefinition = Readonly<{
  id: string; name: string; role: 'fighter' | 'tanker' | 'mage' | 'marksman' | 'support' | 'assassin' | 'siege';
  tier: 1 | 2 | 3 | 4 | 5; hp: number; attack: number; defense: number; magicResist: number; attackType: 'physical' | 'magic'; range: number;
  movePerSecond: number; attacksPerSecond: number; portraitAssetId: string; sourcePath: string;
}>;
export type FixtureCatalog = Readonly<{
  assets: readonly AssetRecord[];
  units: readonly UnitDefinition[];
  starterUnitIds: readonly string[];
  monster: Readonly<{ id: string; name: string; variant: 'common'; hp: number; defense: number; attack: number; attacksPerSecond: number; packSize: number; material: string; sourcePath: string }>;
  camps: readonly Readonly<{ id: string; monsterId: string; col: number; row: number; markerAssetId: string }>[];
  wall: Readonly<{ id: string; ownerId: 'player:north'; col: number; row: number; width: number; hp: number; tileAssetId: string }>;
  card: Readonly<{ id: string; name: string; durationTicks: number; speedBps: number; sourcePath: string }>;
}>;

const rosterRoot = 'Plan/Data/UnitRoster/';
export const fixtureCatalog: FixtureCatalog = {
  assets: [
    { id: 'asset:unit:sunder-aegis', sourcePath: 'Assets/Units/1_Fighter/sunder_aegis.png', publicPath: '/assets/fixture/sunder_aegis.png', format: 'png' },
    { id: 'asset:unit:tidecaller-nami', sourcePath: 'Assets/Units_Legacy_v1/2_Tanker/tidecaller_nami.png', publicPath: '/assets/fixture/tidecaller_nami.png', format: 'png', provisional: true },
    { id: 'asset:unit:frostcaller-lyra', sourcePath: 'Assets/Units_Legacy_v1/3_Mage/frostcaller_lyra.png', publicPath: '/assets/fixture/frostcaller_lyra.png', format: 'png', provisional: true },
    { id: 'asset:unit:twinblade-vex', sourcePath: 'Assets/Units/4_Marksman/twinblade_vex.png', publicPath: '/assets/fixture/twinblade_vex.png', format: 'png' },
    { id: 'asset:unit:sniper-castella', sourcePath: 'Assets/Units_Legacy_v1/4_Marksman/sniper_castella.png', publicPath: '/assets/fixture/sniper_castella.png', format: 'png', provisional: true },
    { id: 'asset:unit:timekeeper-nora', sourcePath: 'Assets/Units_Legacy_v1/5_Support/timekeeper_nora.png', publicPath: '/assets/fixture/timekeeper_nora.png', format: 'png', provisional: true },
    { id: 'asset:unit:jungle-stalker', sourcePath: 'Assets/Units/8_Assassin/jungle_stalker.png', publicPath: '/assets/fixture/jungle_stalker.png', format: 'png' },
    { id: 'asset:unit:nightblade', sourcePath: 'Assets/Units/8_Assassin/nightblade.png', publicPath: '/assets/fixture/nightblade.png', format: 'png' },
    { id: 'asset:unit:sapper-drox', sourcePath: 'Assets/Units_Legacy_v1/6_Siege/sapper_drox.png', publicPath: '/assets/fixture/sapper_drox.png', format: 'png', provisional: true },
    { id: 'asset:terrain:field', sourcePath: 'Assets/Tiles/1_Field/field_grass.jpg', publicPath: '/assets/fixture/field_grass.jpg', format: 'jpg' },
    { id: 'asset:terrain:highway', sourcePath: 'Assets/Tiles/1_Field/field_dirtpath.jpg', publicPath: '/assets/fixture/field_dirtpath.jpg', format: 'jpg' },
    { id: 'asset:terrain:jungle', sourcePath: 'Assets/Tiles/2_Jungle/jungle_floor.jpg', publicPath: '/assets/fixture/jungle_floor.jpg', format: 'jpg' },
    { id: 'asset:terrain:castle', sourcePath: 'Assets/Tiles/3_Base/courtyard_marble.jpg', publicPath: '/assets/fixture/courtyard_marble.jpg', format: 'jpg' },
    { id: 'asset:terrain:cloud-boundary', sourcePath: 'Assets/Tiles/3_Base/perimeter_cliff.jpg', publicPath: '/assets/fixture/perimeter_cliff.jpg', format: 'jpg' },
    { id: 'asset:structure:wall', sourcePath: 'Assets/Tiles/3_Base/castle_wall_rampart.jpg', publicPath: '/assets/fixture/castle_wall_rampart.jpg', format: 'jpg' },
    { id: 'asset:structure:gate', sourcePath: 'Assets/Structures/castle_gate.png', publicPath: '/assets/fixture/castle_gate.png', format: 'png' },
    { id: 'asset:camp:den', sourcePath: 'Assets/Tiles/2_Jungle/boss_beast_den.png', publicPath: '/assets/fixture/boss_beast_den.png', format: 'png' },
  ],
  units: [
    { id: 'unit-def:sunder-aegis', name: 'Sunder Aegis', role: 'fighter', tier: 1, hp: 520, attack: 60, defense: 22, magicResist: 18, attackType: 'physical', range: 1, movePerSecond: 2, attacksPerSecond: 0.9, portraitAssetId: 'asset:unit:sunder-aegis', sourcePath: rosterRoot + 'Final - Fighters.md' },
    { id: 'unit-def:tidecaller-nami', name: 'Tidecaller Nami', role: 'tanker', tier: 1, hp: 950, attack: 45, defense: 35, magicResist: 45, attackType: 'physical', range: 1, movePerSecond: 1.7, attacksPerSecond: 0.6, portraitAssetId: 'asset:unit:tidecaller-nami', sourcePath: rosterRoot + 'Final - Tankers.md' },
    { id: 'unit-def:frostcaller-lyra', name: 'Frostcaller Lyra', role: 'mage', tier: 1, hp: 620, attack: 55, defense: 15, magicResist: 25, attackType: 'magic', range: 3, movePerSecond: 1.8, attacksPerSecond: 0.7, portraitAssetId: 'asset:unit:frostcaller-lyra', sourcePath: rosterRoot + 'Final - Mages.md' },
    { id: 'unit-def:twinblade-vex', name: 'Twinblade Vex', role: 'marksman', tier: 1, hp: 580, attack: 65, defense: 14, magicResist: 10, attackType: 'physical', range: 4, movePerSecond: 2, attacksPerSecond: 1, portraitAssetId: 'asset:unit:twinblade-vex', sourcePath: rosterRoot + 'Final - Marksmen.md' },
    { id: 'unit-def:sniper-castella', name: 'Sniper Castella', role: 'marksman', tier: 4, hp: 750, attack: 105, defense: 15, magicResist: 18, attackType: 'physical', range: 7, movePerSecond: 1.8, attacksPerSecond: 0.7, portraitAssetId: 'asset:unit:sniper-castella', sourcePath: rosterRoot + 'Final - Marksmen.md' },
    { id: 'unit-def:timekeeper-nora', name: 'Timekeeper Nora', role: 'support', tier: 1, hp: 620, attack: 40, defense: 12, magicResist: 25, attackType: 'physical', range: 3, movePerSecond: 2, attacksPerSecond: 0.6, portraitAssetId: 'asset:unit:timekeeper-nora', sourcePath: rosterRoot + 'Final - Supports.md' },
    { id: 'unit-def:jungle-stalker', name: 'Jungle Stalker', role: 'assassin', tier: 1, hp: 560, attack: 50, defense: 14, magicResist: 14, attackType: 'physical', range: 1, movePerSecond: 2.7, attacksPerSecond: 1, portraitAssetId: 'asset:unit:jungle-stalker', sourcePath: rosterRoot + 'Final - Assassins.md' },
    { id: 'unit-def:nightblade', name: 'Nightblade', role: 'assassin', tier: 3, hp: 800, attack: 90, defense: 18, magicResist: 18, attackType: 'physical', range: 1, movePerSecond: 2.6, attacksPerSecond: 1.1, portraitAssetId: 'asset:unit:nightblade', sourcePath: rosterRoot + 'Final - Assassins.md' },
    { id: 'unit-def:sapper-drox', name: 'Sapper Drox', role: 'siege', tier: 1, hp: 550, attack: 60, defense: 10, magicResist: 8, attackType: 'physical', range: 2, movePerSecond: 1.1, attacksPerSecond: 0.6, portraitAssetId: 'asset:unit:sapper-drox', sourcePath: rosterRoot + 'Final - Siege.md' },
  ],
  starterUnitIds: ['unit-def:sunder-aegis', 'unit-def:tidecaller-nami', 'unit-def:frostcaller-lyra', 'unit-def:twinblade-vex', 'unit-def:timekeeper-nora'],
  monster: { id: 'monster-def:feral-boar', name: 'Feral Boar', variant: 'common', hp: 1300, defense: 6, attack: 22, attacksPerSecond: 0.7, packSize: 5, material: 'Gilded Ore', sourcePath: 'Plan/Data/Monster/00 - Jungle Monsters & Material Drops.md' },
  camps: [
    { id: 'camp:west:feral-boar:1', monsterId: 'monster-def:feral-boar', col: 14, row: 33, markerAssetId: 'asset:camp:den' },
    { id: 'camp:east:feral-boar:1', monsterId: 'monster-def:feral-boar', col: 135, row: 56, markerAssetId: 'asset:camp:den' },
  ],
  wall: { id: 'wall:north:outer:1', ownerId: 'player:north', col: 62, row: 19, width: 6, hp: 3000, tileAssetId: 'asset:structure:wall' },
  card: { id: 'card:forced-march', name: 'Forced March', durationTicks: 80, speedBps: 13000, sourcePath: 'Plan/TextPlan/05 - Command Cards/00 - Card System (Rules + All 25 Cards).md' },
};

export function validateFixture(catalog: FixtureCatalog): string[] {
  const errors: string[] = [];
  const allIds = [...catalog.assets.map((asset) => asset.id), ...catalog.units.map((unit) => unit.id), catalog.monster.id, ...catalog.camps.map((camp) => camp.id), catalog.wall.id, catalog.card.id];
  if (new Set(allIds).size !== allIds.length) errors.push('Duplicate fixture ID');
  const assets = new Set(catalog.assets.map((asset) => asset.id));
  const units = new Set(catalog.units.map((unit) => unit.id));
  for (const unit of catalog.units) {
    if (!assets.has(unit.portraitAssetId)) errors.push(`${unit.id} references missing portrait ${unit.portraitAssetId}`);
    if (!Number.isInteger(unit.tier) || unit.tier < 1 || unit.tier > 5 || unit.hp <= 0 || unit.attack <= 0 || unit.defense < 0 || unit.magicResist < 0 || unit.range <= 0 || unit.movePerSecond <= 0 || unit.attacksPerSecond <= 0) errors.push(`${unit.id} has invalid Stage 0 stats`);
  }
  if (catalog.monster.hp <= 0 || catalog.monster.defense < 0 || catalog.monster.attack <= 0 || catalog.monster.attacksPerSecond <= 0 || catalog.monster.packSize !== 5 || !catalog.monster.material) errors.push('Monster stats are invalid');
  if (catalog.starterUnitIds.length !== 5 || new Set(catalog.starterUnitIds).size !== 5) errors.push('Opening must have five distinct starters');
  for (const id of catalog.starterUnitIds) if (!units.has(id)) errors.push(`Missing starter ${id}`);
  if (catalog.camps.length !== 2 || catalog.camps.some((camp) => camp.monsterId !== catalog.monster.id || !assets.has(camp.markerAssetId))) errors.push('Camp reference is invalid');
  if (getHex(catalog.camps[0]?.col, catalog.camps[0]?.row)?.zone !== 'west-jungle') errors.push('Camp must be in west jungle');
  if (getHex(catalog.camps[1]?.col, catalog.camps[1]?.row)?.zone !== 'east-jungle') errors.push('Camp must be in east jungle');
  if (!assets.has(catalog.wall.tileAssetId) || catalog.wall.width !== 6 || catalog.wall.hp !== 3000) errors.push('Wall definition is invalid');
  for (let col = catalog.wall.col; col < catalog.wall.col + catalog.wall.width; col++) {
    if (getHex(col, catalog.wall.row)?.terrain !== 'wall') errors.push(`Wall hex ${col}:${catalog.wall.row} is not on the front wall`);
  }
  if (catalog.card.durationTicks !== 80 || catalog.card.speedBps !== 13000) errors.push('Forced March fixture does not match its source');
  for (const asset of catalog.assets) {
    if (!asset.sourcePath.startsWith('Assets/') || !asset.publicPath.startsWith('/assets/fixture/') || !asset.publicPath.endsWith(`.${asset.format}`)) errors.push(`Invalid asset path ${asset.id}`);
  }
  return errors;
}
