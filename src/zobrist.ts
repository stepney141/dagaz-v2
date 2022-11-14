/**
 * Generate 64-bit pseudo random integer with Xorshift method.
 */
function* XorShift64(initialState: bigint): Iterator<bigint> {
  let x: bigint = initialState & 0xFFFF_FFFF_FFFF_FFFFn;
  if (x === 0n) {
    throw Error("initialState must not be zero.");
  }
  for (; ;) {
    x ^= x << 13n;
    x &= 0xFFFF_FFFF_FFFF_FFFFn;
    x ^= x >> 7n;
    x ^= x << 17n;
    x &= 0xFFFF_FFFF_FFFF_FFFFn;
    yield x;
  }
}
const RANDOM_SEED = BigInt(new Date().getTime()) & 0xFFFF_FFFF_FFFF_FFFFn;
export const getRandomValue = XorShift64(RANDOM_SEED);

export type PositionHash = bigint;
type TranspositionTableKey = PositionHash;
export type TranspositionTable<Entry> = Map<TranspositionTableKey, Entry>;

export function buildTranspositionTable<Entry>(): TranspositionTable<Entry> {
  return new Map();
}

/**
 * Updates a zobrist hash
 * @link https://en.wikipedia.org/wiki/Zobrist_hashing
 * @link https://www.chessprogramming.org/Zobrist_Hashing
 */
export function zUpdate<K extends TranspositionTableKey>(currentHashKey: K) {
  const hash = getRandomValue.next().value as PositionHash;
  return (currentHashKey ^ hash) & 0xFFFF_FFFF_FFFF_FFFFn;
}
