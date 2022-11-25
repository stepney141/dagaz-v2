/**
 * Transposition Table & Hash Generator
 * @module tt
 */

export type PositionHash = [number, number];

/**
 * Generate 64-bit pseudo random integer with Xorshift method.
 * Each integer generated is represented as a tuple of two 32-bit numbers.
 */
function* XorShift64(initialState: PositionHash): Iterator<PositionHash> {
  let x0: number = initialState[0] & 0xffff_ffff;
  let x1: number = initialState[1] & 0xffff_ffff;
  if (x0 === 0 && x1 === 0) {
    throw Error("initialState must not be zero.");
  }
  for (;;) {
    x1 ^= (x0 >>> 19) | (x1 << 13);
    x0 ^= x0 << 13;
    x0 ^= (x0 >>> 7) | (x1 << 25);
    x1 ^= x1 >>> 7;
    x1 ^= (x0 >>> 15) | (x1 << 17);
    x0 ^= x0 << 17;
    yield [x0 >>> 0, x1 >>> 0] as PositionHash;
  }
}
const RANDOM_SEED: PositionHash = [1, 0];
export const getRandomValue = XorShift64(RANDOM_SEED);

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
export function zUpdate(currentHashKey: PositionHash): PositionHash {
  const hash = getRandomValue.next().value as PositionHash;
  return [(currentHashKey[0] ^ hash[0]) & 0xffff_ffff, (currentHashKey[1] ^ hash[1]) & 0xffff_ffff];
}
