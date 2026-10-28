import { nextRandomUint32 } from './rng.js';

export type BlessingTier = 'grace' | 'exalted' | 'imperial';
export type BlessingDefinition = Readonly<{ id: string; name: string; tier: BlessingTier; sourcePath: string; summary: string }>;

/** Economy-focused Rite fixtures from the authoritative tier files. */
export const FIXTURE_BLESSINGS: readonly BlessingDefinition[] = [
  { id: 'blessing:grace:holy-nation', name: 'Holy Nation', tier: 'grace', sourcePath: 'Plan/Data/BlessingList/05 - Grace Blessing.md', summary: '+10% passive gold and XP' },
  { id: 'blessing:grace:gilded-ledger', name: 'Gilded Ledger', tier: 'grace', sourcePath: 'Plan/Data/BlessingList/05 - Grace Blessing.md', summary: '+5% passive gold; +25g per new 300g bank threshold' },
  { id: 'blessing:grace:war-chest', name: 'War Chest — Small', tier: 'grace', sourcePath: 'Plan/Data/BlessingList/05 - Grace Blessing.md', summary: '+75g now; first 3 recruits refund 10g' },
  { id: 'blessing:grace:copper-interest', name: 'Copper Interest', tier: 'grace', sourcePath: 'Plan/Data/BlessingList/05 - Grace Blessing.md', summary: 'Minute interest: +1g per 100g saved, capped at 30g' },
  { id: 'blessing:grace:scrap-pickers', name: 'Scrap Pickers', tier: 'grace', sourcePath: 'Plan/Data/BlessingList/05 - Grace Blessing.md', summary: '+5g per monster kill; +15g on five-monster clear' },
  { id: 'blessing:grace:courier-contract', name: 'Courier Contract', tier: 'grace', sourcePath: 'Plan/Data/BlessingList/05 - Grace Blessing.md', summary: '+40g every two minutes; Scout resolution pays 10g' },
  { id: 'blessing:exalted:holy-nation', name: 'Holy Nation', tier: 'exalted', sourcePath: 'Plan/Data/BlessingList/04 - Exalted Blessing.md', summary: '+20% passive gold and XP' },
  { id: 'blessing:exalted:gilded-vault', name: 'Gilded Vault', tier: 'exalted', sourcePath: 'Plan/Data/BlessingList/04 - Exalted Blessing.md', summary: '+8% passive gold; +50g per new 500g bank threshold' },
  { id: 'blessing:exalted:war-chest', name: 'War Chest', tier: 'exalted', sourcePath: 'Plan/Data/BlessingList/04 - Exalted Blessing.md', summary: '+120g now; spend it within one minute for +30g' },
  { id: 'blessing:exalted:merchants-bargain', name: "Merchant's Bargain", tier: 'exalted', sourcePath: 'Plan/Data/BlessingList/04 - Exalted Blessing.md', summary: 'Recruits cost 8% less; every fifth is free' },
  { id: 'blessing:exalted:bounty-hunter', name: 'Bounty Hunter', tier: 'exalted', sourcePath: 'Plan/Data/BlessingList/04 - Exalted Blessing.md', summary: '+15% camp bounties; +50g every fifth clear' },
  { id: 'blessing:exalted:silver-interest', name: 'Silver Interest', tier: 'exalted', sourcePath: 'Plan/Data/BlessingList/04 - Exalted Blessing.md', summary: 'Minute interest: +2g per 100g saved, cap grows with bank' },
  { id: 'blessing:imperial:holy-nation', name: 'Holy Nation', tier: 'imperial', sourcePath: 'Plan/Data/BlessingList/03 - Imperial Blessing.md', summary: '+40% passive gold and XP' },
  { id: 'blessing:imperial:gilded-taxes', name: 'Gilded Taxes', tier: 'imperial', sourcePath: 'Plan/Data/BlessingList/03 - Imperial Blessing.md', summary: '+15% passive gold; breach pays 100g and doubles camp bounties for 20s' },
  { id: 'blessing:imperial:royal-treasury', name: 'Royal Treasury', tier: 'imperial', sourcePath: 'Plan/Data/BlessingList/03 - Imperial Blessing.md', summary: '+250g now; recruits cost 10% less above 1500g bank' },
  { id: 'blessing:imperial:merchant-discount', name: 'Merchant Discount', tier: 'imperial', sourcePath: 'Plan/Data/BlessingList/03 - Imperial Blessing.md', summary: 'Recruits cost 15% less; extra cards capped at 150g, every third free' },
  { id: 'blessing:imperial:rapid-bounty', name: 'Rapid Bounty', tier: 'imperial', sourcePath: 'Plan/Data/BlessingList/03 - Imperial Blessing.md', summary: '+30% camp bounties; elite clear grants a Rare material' },
  { id: 'blessing:imperial:golden-interest', name: 'Golden Interest', tier: 'imperial', sourcePath: 'Plan/Data/BlessingList/03 - Imperial Blessing.md', summary: 'Minute interest: +2g per 100g saved, plus 30g above 1000g' },
];

export type BlessingOffer = Readonly<{ rite: 0 | 1 | 2; tier: BlessingTier; options: readonly string[]; openedAtTick: number; expiresAtTick: number }>;
export type BlessingState = Readonly<{ selected: readonly string[]; seen: readonly string[]; offer: BlessingOffer | null; rerollsRemaining: 0 | 1; recruitsSinceWarChest: number; campClearsSinceBounty: number; ledgerThreshold: number; vaultThreshold: number; warChestChosenAtTick: number | null; warChestSpendMilli: number; warChestRewarded: boolean; taxesCampBonusUntil: number }>;
export type BlessingSetup = Readonly<{ tiers: readonly [BlessingTier, BlessingTier, BlessingTier]; north: BlessingState; south: BlessingState; rngState: number }>;

export function emptyBlessingState(): BlessingState {
  return { selected: [], seen: [], offer: null, rerollsRemaining: 1, recruitsSinceWarChest: 0, campClearsSinceBounty: 0, ledgerThreshold: 0, vaultThreshold: 0, warChestChosenAtTick: null, warChestSpendMilli: 0, warChestRewarded: false, taxesCampBonusUntil: 0 };
}

function shuffle<T>(values: readonly T[], start: number): { values: T[]; rngState: number } {
  const copy = [...values];
  let rngState = start;
  for (let index = copy.length - 1; index > 0; index--) {
    const draw = nextRandomUint32(rngState);
    rngState = draw.nextState;
    const other = draw.value % (index + 1);
    [copy[index], copy[other]] = [copy[other], copy[index]];
  }
  return { values: copy, rngState };
}

export function openBlessingRite(previous: BlessingState, rite: 0 | 1 | 2, tier: BlessingTier, tick: number, startRngState: number): { blessings: BlessingState; rngState: number } {
  if (previous.offer) throw new Error('Previous Rite remains unresolved');
  const eligible = FIXTURE_BLESSINGS.filter((entry) => entry.tier === tier && !previous.seen.includes(entry.id));
  if (eligible.length < 3) throw new Error(`Not enough unseen ${tier} blessings`);
  const shuffled = shuffle(eligible, startRngState);
  const options = shuffled.values.slice(0, 3).map((entry) => entry.id);
  return { blessings: { ...previous, seen: [...previous.seen, ...options], offer: { rite, tier, options, openedAtTick: tick, expiresAtTick: tick + 270 } }, rngState: shuffled.rngState };
}

export function createBlessingSetup(startRngState: number): BlessingSetup {
  const tiers = shuffle<BlessingTier>(['grace', 'exalted', 'imperial'], startRngState);
  const north = openBlessingRite(emptyBlessingState(), 0, tiers.values[0], 0, tiers.rngState);
  const south = openBlessingRite(emptyBlessingState(), 0, tiers.values[0], 0, north.rngState);
  return { tiers: tiers.values as [BlessingTier, BlessingTier, BlessingTier], north: north.blessings, south: south.blessings, rngState: south.rngState };
}

export function rerollBlessingOffer(previous: BlessingState, startRngState: number): { blessings: BlessingState; rngState: number } | null {
  if (!previous.offer || previous.rerollsRemaining === 0) return null;
  const eligible = FIXTURE_BLESSINGS.filter((entry) => entry.tier === previous.offer!.tier && !previous.seen.includes(entry.id));
  if (eligible.length < 3) return null;
  const shuffled = shuffle(eligible, startRngState);
  const options = shuffled.values.slice(0, 3).map((entry) => entry.id);
  return { blessings: { ...previous, seen: [...previous.seen, ...options], offer: { ...previous.offer, options }, rerollsRemaining: 0 }, rngState: shuffled.rngState };
}

export function chooseBlessing(previous: BlessingState, id: string): BlessingState | null {
  if (!previous.offer?.options.includes(id)) return null;
  return { ...previous, selected: [...previous.selected, id], offer: null };
}

export function hasBlessing(blessings: BlessingState, id: string): boolean { return blessings.selected.includes(id); }

/** Only the strongest Holy Nation variant contributes its production bonus. */
export function holyNationBonusBps(blessings: BlessingState): number {
  return hasBlessing(blessings, 'blessing:imperial:holy-nation') ? 4000
    : hasBlessing(blessings, 'blessing:exalted:holy-nation') ? 2000
      : hasBlessing(blessings, 'blessing:grace:holy-nation') ? 1000 : 0;
}

export function passiveGoldBonusBps(blessings: BlessingState): number {
  return holyNationBonusBps(blessings)
    + (hasBlessing(blessings, 'blessing:grace:gilded-ledger') ? 500 : 0)
    + (hasBlessing(blessings, 'blessing:exalted:gilded-vault') ? 800 : 0)
    + (hasBlessing(blessings, 'blessing:imperial:gilded-taxes') ? 1500 : 0);
}

export function campBountyBonusBps(blessings: BlessingState, tick: number): number {
  return (hasBlessing(blessings, 'blessing:exalted:bounty-hunter') ? 1500 : 0)
    + (hasBlessing(blessings, 'blessing:imperial:rapid-bounty') ? 3000 : 0)
    + (blessings.taxesCampBonusUntil > tick ? 10000 : 0);
}

export function recruitDiscountBps(blessings: BlessingState, bankMilli: number, recruitNumber: number): number {
  if (hasBlessing(blessings, 'blessing:exalted:merchants-bargain') && recruitNumber % 5 === 0) return 10000;
  return (hasBlessing(blessings, 'blessing:exalted:merchants-bargain') ? 800 : 0)
    + (hasBlessing(blessings, 'blessing:imperial:merchant-discount') ? 1500 : 0)
    + (hasBlessing(blessings, 'blessing:imperial:royal-treasury') && bankMilli > 1500000 ? 1000 : 0);
}

export function validateBlessingState(blessings: BlessingState, tick: number): string[] {
  const valid = new Set(FIXTURE_BLESSINGS.map((entry) => entry.id));
  const errors: string[] = [];
  if (![0, 1].includes(blessings.rerollsRemaining) || new Set(blessings.seen).size !== blessings.seen.length || blessings.seen.some((id) => !valid.has(id))) errors.push('Invalid seen blessings or reroll count');
  if (new Set(blessings.selected).size !== blessings.selected.length || blessings.selected.some((id) => !blessings.seen.includes(id)) || blessings.selected.length > 3) errors.push('Invalid selected blessings');
  if (blessings.offer && (blessings.offer.options.length !== 3 || new Set(blessings.offer.options).size !== 3 || blessings.offer.options.some((id) => !blessings.seen.includes(id)) || blessings.offer.expiresAtTick <= tick)) errors.push('Invalid or expired Rite offer');
  return errors;
}
