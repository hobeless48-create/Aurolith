import { describe, expect, it } from 'vitest';
import { BOARD_COLUMNS } from './board.js';
import { advanceUnitCombatWithEvents, damageAfterArmor, maxUnitHp } from './combat.js';
import { bastionDamageBps, beginCraft, beginEquip, buyMaterial, CRAFT_COST_MILLI, CRAFT_TICKS, executionBonusBps, FIELD_EQUIP_TICKS, progressItemChannels, validateItemState } from './items.js';
import { createInitialState, MATCH_LIMIT_TICKS, stepMatch, validateMatchState, type CommandEnvelope, type PlayerState, type UnitState } from './simulation.js';
import { projectItemEvents } from './vision.js';

const claw = 'item:executioners-claw';
const plate = 'item:bastion-plate';

describe('item fixture', () => {
  it('buys materials, crafts for 10 seconds, equips a compatible unit, and keeps the item through death and respawn', () => {
    const state = createInitialState(121);
    const player = { ...state.players[0], goldMilli: 500000, materials: { 'Gilded Ore': 1 } };
    const bought = buyMaterial(player, 'Gilded Ore');
    expect(bought.error).toBeNull();
    expect(bought.player.goldMilli).toBe(350000);
    const crafter = bought.player.units[2];
    const started = beginCraft(bought.player, claw, crafter.id, 1);
    expect(started.error).toBeNull();
    expect(started.player.goldMilli).toBe(350000 - CRAFT_COST_MILLI);
    expect(started.player.materials['Gilded Ore']).toBe(0);
    expect(progressItemChannels(started.player, CRAFT_TICKS).player.arsenal[claw]).toBeUndefined();
    const completed = progressItemChannels(started.player, 1 + CRAFT_TICKS);
    expect(completed.events.map((event) => event.type)).toEqual(['craft-complete']);
    expect(completed.player.arsenal[claw]).toBe(1);
    const recipient = { ...completed.player.units[0], row: 5 };
    const safePlayer = { ...completed.player, units: [recipient, ...completed.player.units.slice(1)] };
    const equipped = beginEquip(safePlayer, claw, recipient.id, 102);
    expect(equipped.error).toBeNull();
    expect(equipped.player.arsenal[claw]).toBe(0);
    expect(equipped.player.units[0].equippedItemId).toBe(claw);
    const fallen = { ...equipped.player.units[0], hp: 0, respawnAtTick: 402 };
    const deadPlayer: PlayerState = { ...equipped.player, units: [fallen, ...equipped.player.units.slice(1)] };
    const respawned = advanceUnitCombatWithEvents([deadPlayer, state.players[1]], 402).players[0].units[0];
    expect(respawned.equippedItemId).toBe(claw);
    expect(respawned.hp).toBe(maxUnitHp(respawned, 402));
    expect(validateItemState(equipped.player, 102)).toEqual([]);
  });

  it('rejects invalid craft and equip commands without spending resources or duplicating items', () => {
    const state = createInitialState(122);
    const player = { ...state.players[0], goldMilli: 500000, materials: { 'Gilded Ore': 2 }, arsenal: { [claw]: 1 } };
    const away = beginCraft(player, claw, player.units[0].id, 1);
    expect(away.error).toContain('Resource Tab');
    expect(away.player).toBe(player);
    const incompatible = beginEquip(player, claw, player.units[1].id, 1);
    expect(incompatible.error).toContain('incompatible');
    expect(incompatible.player.arsenal[claw]).toBe(1);
    const noStock = beginEquip({ ...player, arsenal: {} }, claw, player.units[0].id, 1);
    expect(noStock.error).toContain('Arsenal');
  });

  it('refunds craft or field equip channels after movement or combat, and finishes an uninterrupted field equip', () => {
    const state = createInitialState(123);
    const player = { ...state.players[0], goldMilli: 100000, materials: { 'Gilded Ore': 2 }, arsenal: { [plate]: 1 } };
    const crafter = player.units[2];
    const crafting = beginCraft(player, claw, crafter.id, 1).player;
    const moved = { ...crafting, units: crafting.units.map((unit) => unit.id === crafter.id ? { ...unit, col: unit.col + 1 } : unit) };
    const canceled = progressItemChannels(moved, 2);
    expect(canceled.events.map((event) => event.type)).toEqual(['craft-cancel']);
    expect(canceled.player.goldMilli).toBe(player.goldMilli);
    expect(canceled.player.materials['Gilded Ore']).toBe(2);

    const fighter = { ...player.units[0], col: 75, row: 45 };
    const field = { ...player, units: [fighter, ...player.units.slice(1)] };
    const equipping = beginEquip(field, plate, fighter.id, 10).player;
    expect(equipping.arsenal[plate]).toBe(0);
    const attacked = { ...equipping, units: equipping.units.map((unit) => unit.id === fighter.id ? { ...unit, lastCombatTick: 11 } : unit) };
    const returned = progressItemChannels(attacked, 11);
    expect(returned.events.map((event) => event.type)).toEqual(['equip-cancel']);
    expect(returned.player.arsenal[plate]).toBe(1);
    const ready = progressItemChannels(equipping, 10 + FIELD_EQUIP_TICKS);
    expect(ready.events.map((event) => event.type)).toEqual(['equip-complete']);
    expect(ready.player.units[0].equippedItemId).toBe(plate);
    expect(ready.player.units[0].hp).toBe(fighter.hp + 300);
  });

  it('applies equipped ATK to Watery Grave and hides item cues outside vision', () => {
    const state = createInitialState(124);
    const nami: UnitState = { ...state.players[0].units[1], col: 75, row: 45, equippedItemId: plate };
    const near = { ...state.players[1].units[0], col: 75, row: 46 };
    const far = { ...state.players[1].units[3], col: 74, row: 47 };
    const north = { ...state.players[0], units: [nami], platoons: state.players[0].platoons.map((entry, index) => ({ ...entry, stance: index === 0 ? 'aggressive' as const : entry.stance, unitIds: index === 0 ? [nami.id] : [] })) };
    const south = { ...state.players[1], units: [near, far], platoons: state.players[1].platoons.map((entry, index) => ({ ...entry, unitIds: index === 0 ? [near.id, far.id] : [] })) };
    const result = advanceUnitCombatWithEvents([north, south], 1);
    const expected = damageAfterArmor(Math.round((45 + 20) * .6), 10);
    expect(far.hp - result.players[1].units[1].hp).toBe(expected);
    const event = beginEquip({ ...state.players[0], arsenal: { [claw]: 1 } }, claw, state.players[0].units[0].id, 1).event!;
    const hidden = new Uint8Array(BOARD_COLUMNS * 90);
    expect(projectItemEvents([event], 'player:south', hidden)).toEqual([]);
    hidden[event.row * BOARD_COLUMNS + event.col] = 2;
    expect(projectItemEvents([event], 'player:south', hidden)).toHaveLength(1);
    expect(projectItemEvents([event], 'player:north', new Uint8Array(hidden.length))).toHaveLength(1);
  });

  it('uses strict execute and Bastion Plate health thresholds', () => {
    const state = createInitialState(127);
    const clawUnit = { ...state.players[0].units[0], equippedItemId: claw as typeof claw };
    expect(executionBonusBps(clawUnit, 30, 100)).toBe(10000);
    expect(executionBonusBps(clawUnit, 29, 100)).toBe(12000);
    const plateUnit = { ...state.players[0].units[0], equippedItemId: plate as typeof plate };
    const maximum = maxUnitHp(plateUnit, 1);
    expect(bastionDamageBps({ ...plateUnit, hp: Math.floor(maximum * .7) }, 1)).toBe(10000);
    expect(bastionDamageBps({ ...plateUnit, hp: maximum }, 1)).toBe(9000);
  });

  it('settles a channel due on the 18:00 terminal tick', () => {
    const initial = createInitialState(125);
    const unit = initial.players[0].units[2];
    const job = { unitId: unit.id, itemId: claw, col: unit.col, row: unit.row, startedAtTick: MATCH_LIMIT_TICKS - CRAFT_TICKS, readyAtTick: MATCH_LIMIT_TICKS };
    const state = { ...initial, tick: MATCH_LIMIT_TICKS - 1, players: [{ ...initial.players[0], craftJobs: [job] }, initial.players[1]] as typeof initial.players };
    const result = stepMatch(state);
    expect(result.state.phase).toBe('ended');
    expect(result.state.players[0].arsenal[claw]).toBe(1);
    expect(result.itemEvents.map((event) => event.type)).toEqual(['craft-complete']);
    expect(result.economyEvents.find((event) => event.source === 'item-channel' && event.playerId === 'player:north')?.arsenalDelta[claw]).toBe(1);
    expect(validateItemState(result.state.players[0], result.state.tick)).toEqual([]);
  });

  it('accepts a real item command through the match envelope', () => {
    const initial = createInitialState(126);
    const player = { ...initial.players[0], goldMilli: 500000 };
    const command: CommandEnvelope = { tick: 1, sequence: 1, playerId: 'player:north', command: { type: 'buy-material', material: 'Ironwood Timber' } };
    const result = stepMatch({ ...initial, players: [player, initial.players[1]] }, [command]);
    expect(result.accepted).toEqual([1]);
    expect(result.state.players[0].materials['Ironwood Timber']).toBe(1);
    expect(result.economyEvents.find((event) => event.source === 'command' && event.commandSequence === 1)).toMatchObject({ commandType: 'buy-material', goldMilliDelta: -150000, materialsDelta: { 'Ironwood Timber': 1 } });
    expect(validateMatchState(result.state)).toEqual([]);
  });
});
