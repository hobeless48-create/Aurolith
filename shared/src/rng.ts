/** Xorshift32 replay stream. Zero seed is mapped to a nonzero state. */
export function nextRandomUint32(current: number): { value: number; nextState: number } {
  let x = current >>> 0;
  if (x === 0) x = 0x6d2b79f5;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  const value = x >>> 0;
  return { value, nextState: value };
}
