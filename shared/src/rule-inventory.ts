/** Stage 1 source map. Fixture entries are deliberate temporary choices, not canon. */
export type RuleSource = Readonly<{
  id: string;
  stageTask: 'S1-1' | 'S1-2' | 'S1-3' | 'S1-4' | 'S1-5';
  authority: 'canonical' | 'fixture';
  path: string;
  section: string;
  note: string;
}>;

export const ruleInventory: readonly RuleSource[] = [
  { id: 'board.layout', stageTask: 'S1-1', authority: 'canonical', path: 'Plan/TextPlan/01 - Core Rules & Mechanics/Board & Map Grid.md', section: '§2', note: '150×90, cloud corners, 30×50 jungle flanks, centered 48×20 castles, altar 75:45.' },
  { id: 'board.castle-entry', stageTask: 'S1-1', authority: 'canonical', path: 'Plan/TextPlan/01 - Core Rules & Mechanics/Castle & Defensive Layers.md', section: '§2', note: 'Only frontal gates and future front breaches permit castle entry; side and rear blocked.' },
  { id: 'board.tile-art', stageTask: 'S1-1', authority: 'fixture', path: 'Plan/TextPlan/01 - Core Rules & Mechanics/Board & Map Grid.md', section: '§4', note: 'Prototype colors precede the full 22-tile art catalog.' },
  { id: 'recruit.opening', stageTask: 'S1-2', authority: 'canonical', path: 'Plan/Data/Economy/02 - Recruit Shop & Commander Level.md', section: '§1', note: 'Five free starters in Platoon 1, 0 starting gold.' },
  { id: 'recruit.cost', stageTask: 'S1-2', authority: 'canonical', path: 'Plan/Data/Economy/01 - Unit Cost Model (Equal Cost + Escalation + Resign).md', section: '§§1–2', note: '60g base, 2:30 additive escalation. Supersedes tier prices in roster headers.' },
  { id: 'recruit.unit-stats', stageTask: 'S1-2', authority: 'canonical', path: 'Plan/Data/UnitRoster/00 - Unit Roster Overview & Class Definitions.md', section: '§2', note: 'Class framework; selected unit values are from Final per-class files. Auto-battler language does not cancel platoon commands.' },
  { id: 'platoons.orders', stageTask: 'S1-2', authority: 'canonical', path: 'Plan/TextPlan/02 - Units & Platoons/Commander & Platoon System.md', section: '§§1–4', note: 'Ownership, four platoons, stance, focus and macro orders. Old five-card/Crown slot text in §5 is superseded by TextPlan/05.' },
  { id: 'movement.path', stageTask: 'S1-2', authority: 'fixture', path: 'Plan/TechnicalPlan/02 - Pathfinding, Drag-Vector & Movement Engine.md', section: 'prototype', note: 'Stage 1 route and path smoothing are provisional until exercised in the local match.' },
  { id: 'combat.damage', stageTask: 'S1-3', authority: 'canonical', path: 'Plan/TextPlan/01 - Core Rules & Mechanics/Numerical Baseline & Balance.md', section: '§§1,5', note: 'Armor, structure HP/resistance, passive income and army cap.' },
  { id: 'combat.respawn', stageTask: 'S1-3', authority: 'canonical', path: 'Plan/Data/Economy/01 - Unit Cost Model (Equal Cost + Escalation + Resign).md', section: '§3', note: 'Free 30-second respawn; no rehire bill.' },
  { id: 'camp.regular', stageTask: 'S1-3', authority: 'canonical', path: 'Plan/Data/Monster/00 - Jungle Monsters & Material Drops.md', section: '§§2–3', note: 'Common Feral Boar fixture uses canonical 1,300 HP; camp placement is temporary.' },
  { id: 'camp.boss', stageTask: 'S1-3', authority: 'canonical', path: 'Plan/Data/Monster/01 - Jungle Bosses.md', section: '§1', note: 'Bosses deferred from the first slice; this is their later authoritative source.' },
  { id: 'wall.breach', stageTask: 'S1-3', authority: 'canonical', path: 'Plan/TextPlan/01 - Core Rules & Mechanics/Castle & Defensive Layers.md', section: '§2', note: 'Outer segment 3,000 HP, 6 hexes; 3-hex breach corridor. Fixture chooses one northern segment.' },
  { id: 'cards.fixture', stageTask: 'S1-3', authority: 'canonical', path: 'Plan/TextPlan/05 - Command Cards/00 - Card System (Rules + All 25 Cards).md', section: 'Forced March', note: 'One representative card; six hand slots and no permanent Crown slot. Old TextPlan/02 hand text superseded.' },
  { id: 'bot.commands', stageTask: 'S1-4', authority: 'fixture', path: 'Plan/TechnicalPlan/07 - AI Commander Bot State Machine.md', section: 'prototype', note: 'Simple bot issues legal player commands; full tactical policy is deferred.' },
  { id: 'match.phases', stageTask: 'S1-4', authority: 'canonical', path: 'Plan/TextPlan/01 - Core Rules & Mechanics/Match Timeline & Phases.md', section: '§§1–5', note: '18-minute limit, win, wall-damage then core-HP tie-break, then draw.' },
  { id: 'match.restart', stageTask: 'S1-4', authority: 'fixture', path: 'Plan/Stages/stage-1-playable-slice.md', section: 'S1-4', note: 'Restart without page reload is a vertical-slice UX fixture.' },
  { id: 'test.play-path', stageTask: 'S1-5', authority: 'fixture', path: 'Plan/Stages/stage-1-playable-slice.md', section: 'S1-5', note: 'Temporary browser test path: recruit → command → camp → breach → result.' },
] as const;
