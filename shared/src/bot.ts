import { fixtureCatalog, type FixtureCatalog } from './fixture.js';
import { BOSS_DEFINITIONS } from './bosses.js';
import { corePoint } from './structures.js';
import { guildContracts, type Command, type CommandEnvelope, type MatchState, type PlayerId } from './simulation.js';

function needsOrder(platoon: MatchState['players'][number]['platoons'][number], target: { col: number; row: number }): boolean {
  const current = platoon.order ?? platoon.anchor;
  return current.col !== target.col || current.row !== target.row;
}

/** A small local opponent that submits the same commands as a human seat. */
export function botCommands(state: MatchState, playerId: PlayerId, catalog: FixtureCatalog = fixtureCatalog): CommandEnvelope[] {
  if (state.phase === 'ended') return [];
  const player = state.players.find((entry) => entry.id === playerId);
  if (!player) throw new Error('Unknown bot seat');
  const enemyId: PlayerId = playerId === 'player:north' ? 'player:south' : 'player:north';
  const enemyWalls = state.walls.filter((wall) => wall.ownerId === enemyId);
  const outerBreached = enemyWalls.some((wall) => wall.layer === 'outer' && wall.hp === 0);
  const innerBreached = enemyWalls.some((wall) => wall.layer === 'inner' && wall.hp === 0);
  const targetLayer = outerBreached ? 'inner' : 'outer';
  const targetWall = enemyWalls.find((wall) => wall.layer === targetLayer && wall.id.endsWith(':1'))!;
  const attackTarget = outerBreached && innerBreached ? corePoint(enemyId)
    : { col: targetWall.col + 2, row: enemyId === 'player:north' ? targetWall.row + 1 : targetWall.row - 1 };
  const camp = catalog.camps[playerId === 'player:north' ? 0 : 1];
  const campTarget = { col: camp.col, row: camp.row };
  const objective = state.bosses.find((boss, index) => {
    const windowStart = [900, 4500, 6900][index];
    const windowEnd = [2700, 5700, 8700][index];
    return state.tick >= windowStart && state.tick < windowEnd && boss.killedAtTick === null;
  });
  const enemySide = playerId === 'player:north' ? 1 : 0;
  const stealObjective = state.bosses.find((boss, index) => {
    const windowStart = [900, 4500, 6900][index];
    const windowEnd = [2700, 5700, 8700][index];
    return state.tick >= windowStart && state.tick < windowEnd && boss.killedAtTick === null
      && boss.spawnedAtTick !== null && boss.hp > 0 && boss.hp * 2 < BOSS_DEFINITIONS[index].hp
      && boss.damageByPlayer[enemySide] > 0;
  });
  const mainTarget = objective ? { col: objective.col, row: objective.row } : state.tick < 3000 ? campTarget : attackTarget;
  const commands: Command[] = [];
  if (player.blessings.offer) commands.push({ type: 'choose-blessing', blessingId: player.blessings.offer.options[0] });
  const main = player.platoons[0];
  if (main.stance !== 'aggressive') commands.push({ type: 'set-stance', platoonId: main.id, stance: 'aggressive' });
  if (needsOrder(main, mainTarget)) commands.push({ type: 'set-order', platoonId: main.id, target: mainTarget });
  const farm = player.platoons[1];
  const farmTarget = stealObjective ? { col: stealObjective.col, row: stealObjective.row } : campTarget;
  if (farm.unitIds.length && needsOrder(farm, farmTarget)) commands.push({ type: 'set-order', platoonId: farm.id, target: farmTarget });
  const available = guildContracts(state, playerId, catalog);
  if (farm.unitIds.length < 2 && available.length && player.goldMilli + (state.phase === 'overtime' ? 1500 : 1000) >= 60000) {
    const priority = ['unit-def:jungle-stalker', 'unit-def:sapper-drox'];
    const desired = priority.map((id) => available.find((unit) => unit.id === id)).find(Boolean) ?? available[0];
    commands.push({ type: 'recruit', unitDefinitionId: desired.id, platoonId: farm.id });
  }
  if (!commands.some((command) => command.type === 'recruit')) {
    const caravan = player.facilities[0];
    const ballista = player.facilities[1];
    const barrier = player.facilities[2];
    if (!caravan.kind && caravan.rubbleUntilTick <= state.tick + 1 && player.goldMilli >= 150000) commands.push({ type: 'build-facility', slotId: caravan.id, kind: 'caravan-post' });
    else if (!ballista.kind && ballista.rubbleUntilTick <= state.tick + 1 && player.goldMilli >= 150000) commands.push({ type: 'build-facility', slotId: ballista.id, kind: 'ballista' });
    else if (!barrier.kind && barrier.rubbleUntilTick <= state.tick + 1 && player.goldMilli >= 150000) commands.push({ type: 'build-facility', slotId: barrier.id, kind: 'arcane-barrier' });
    else if (caravan.tier === 1 && !caravan.pendingTier && player.goldMilli >= 250000 && player.commanderXp - player.facilityXpSpent >= 100) commands.push({ type: 'upgrade-facility', slotId: caravan.id });
  }
  const side = playerId === 'player:north' ? 0 : 1;
  return commands.map((command, index) => ({ tick: state.tick + 1, sequence: (state.tick + 1) * 100 + side * 10 + index, playerId, command }));
}
