import { describe, expect, it } from 'vitest';
import { allHexes, BOARD_TILE_COUNT, CASTLE_FIRST_COLUMN, CASTLE_GATE_COLUMNS, CASTLE_LAST_COLUMN, getHex, hexCenter, hexNeighbors, NORTH_CASTLE_LAST_ROW, SOUTH_CASTLE_FIRST_ROW, SOUTH_CASTLE_GATE_COLUMNS, worldToHex } from './board.js';

describe('canonical board geometry', () => {
  it('contains 13,500 uniquely identified cells', () => {
    const cells = [...allHexes()];
    expect(cells).toHaveLength(BOARD_TILE_COUNT);
    expect(new Set(cells.map((cell) => cell.id)).size).toBe(BOARD_TILE_COUNT);
    expect(getHex(149, 89)?.id).toBe('hex:149:89');
    expect(getHex(150, 89)).toBeNull();
  });

  it('maps every cell center back to its coordinate', () => {
    for (const cell of allHexes()) {
      const { x, y } = hexCenter(cell.col, cell.row);
      expect(worldToHex(x, y)).toEqual({ col: cell.col, row: cell.row });
    }
  });

  it('keeps tree, canopy, fence and boulder decoration tiles passable', () => {
    for (const point of [{ col: 47, row: 38 }, { col: 58, row: 39 }, { col: 67, row: 42 }, { col: 23, row: 40 }, { col: 102, row: 51 }]) {
      expect(getHex(point.col, point.row)).toMatchObject({ decoration: expect.any(String), isWalkable: true });
    }
  });

  it('uses the revised castle, cloud, jungle and battlefield zones', () => {
    expect(getHex(0, 0)).toMatchObject({ zone: 'cloud', terrain: 'cloud', isWalkable: false });
    expect(getHex(149, 0)).toMatchObject({ zone: 'cloud', terrain: 'cloud', isWalkable: false });
    expect(getHex(0, 89)).toMatchObject({ zone: 'cloud', terrain: 'cloud', isWalkable: false });
    expect(getHex(149, 89)).toMatchObject({ zone: 'cloud', terrain: 'cloud', isWalkable: false });
    expect(getHex(50, 19)?.zone).toBe('cloud');
    expect(getHex(99, 70)?.zone).toBe('cloud');
    expect(getHex(51, 19)?.zone).toBe('north-castle');
    expect(getHex(98, 70)?.zone).toBe('south-castle');
    expect(getHex(29, 20)?.zone).toBe('west-jungle');
    expect(getHex(29, 45)?.zone).toBe('west-jungle');
    expect(getHex(30, 45)?.zone).toBe('battlefield');
    expect(getHex(119, 45)?.zone).toBe('battlefield');
    expect(getHex(120, 45)?.zone).toBe('east-jungle');
    expect(getHex(120, 69)?.zone).toBe('east-jungle');
    expect(getHex(75, 45)?.terrain).toBe('altar');
    expect(getHex(75, 1)?.zone).toBe('north-castle');
    expect(getHex(75, 88)?.zone).toBe('south-castle');
    expect(getHex(75, 0)?.terrain).toBe('wall');
  });

  it('allows castle entry only through three gates on each frontal edge', () => {
    for (let col = 0; col < 150; col++) {
      for (const row of [NORTH_CASTLE_LAST_ROW, SOUTH_CASTLE_FIRST_ROW]) {
        const hex = getHex(col, row)!;
        if (col < CASTLE_FIRST_COLUMN || col > CASTLE_LAST_COLUMN) {
          expect(hex).toMatchObject({ terrain: 'cloud', isWalkable: false });
        } else {
          const gateColumns = row === NORTH_CASTLE_LAST_ROW ? CASTLE_GATE_COLUMNS : SOUTH_CASTLE_GATE_COLUMNS;
          const atGate = gateColumns.some((gateCol) => Math.abs(col - gateCol) <= 1);
          expect(hex.isWalkable).toBe(atGate);
          expect(hex.terrain).toBe(atGate ? 'gate' : 'wall');
        }
      }
    }
    for (let row = 0; row < 90; row++) {
      expect(getHex(CASTLE_FIRST_COLUMN, row)?.isWalkable).toBe(row > NORTH_CASTLE_LAST_ROW && row < SOUTH_CASTLE_FIRST_ROW);
      expect(getHex(CASTLE_LAST_COLUMN, row)?.isWalkable).toBe(row > NORTH_CASTLE_LAST_ROW && row < SOUTH_CASTLE_FIRST_ROW);
    }
    for (const hex of allHexes()) {
      if (!hex.isWalkable || !hex.zone.endsWith('-castle')) continue;
      for (const cell of hexNeighbors(hex.col, hex.row)) {
        const neighbor = getHex(cell.col, cell.row)!;
        if (neighbor.zone === hex.zone || !neighbor.isWalkable) continue;
        expect(hex.terrain).toBe('gate');
        expect(hex.row).toBe(hex.zone === 'north-castle' ? NORTH_CASTLE_LAST_ROW : SOUTH_CASTLE_FIRST_ROW);
        expect(neighbor.zone).toBe('battlefield');
      }
    }
  });
});
