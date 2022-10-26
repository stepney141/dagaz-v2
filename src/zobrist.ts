import type { TPiece } from "./core/index";

/**
 * A transposition table
 */
let hash: null | number[][][] = null;

/**
 * Generates a pseudo random integer between 0 and 255
 * @returns a pseudo random integer between 0 and 255
 */
const getRandomByte = function (): number {
  const min = 0;
  const max = 255;
  return min + Math.floor(Math.random() * (max - min + 1));
};

/**
 * Generates a pseudo random integer
 * @returns a pseudo random integer
 */
const getRandomValue = function (): number {
  let r = getRandomByte();
  for (let i = 0; i < 3; i++) {
    r = r << 8;
    r = r | getRandomByte();
  }
  return r;
};

/**
 * Returns a zobrist hash from a table
 * @param type 
 * @param player 
 * @param loc 
 * @returns
 */
const getValue = function (type: number, player: number, loc: number): number {
  if (hash === null) {
    hash = [];
  }
  if (hash[type] === undefined) {
    hash[type] = [];
  }
  if (hash[type][player] === undefined) {
    hash[type][player] = [];
  }
  if (hash[type][player][loc] === undefined) {
    hash[type][player][loc] = getRandomValue();
  }
  return hash[type][player][loc];
};

/**
 * Updates a zobrist hash
 * @link https://en.wikipedia.org/wiki/Zobrist_hashing
 * @link https://www.chessprogramming.org/Zobrist_Hashing
 * @param value - the current hash value
 * @param piece 
 * @param loc 
 * @returns zobrist hash
 */
const zUpdate = function (value: number, piece: TPiece, loc: number): number {
  return value ^ getValue(piece.type, piece.player, loc);
};

export { getRandomValue, zUpdate };
