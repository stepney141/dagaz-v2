import { TPiece } from "./core/index.js";

/**
 * A transposition table
 */
let hash: any = null;

/**
 * Returns a pseudo random integer between 0 and 255
 * @returns {number}
 */
const getRandomByte = function() {
  const min = 0;
  const max = 255;
  return min + Math.floor(Math.random() * (max - min + 1));
};

/**
 * Generates a pseudo random integer
 * @returns {number}
 */
const getRandomValue = function() {
  let r = getRandomByte();
  for (let i = 0; i < 3; i++) {
    r = r << 8;
    r = r | getRandomByte();
  }
  return r;
};

/**
 * Returns a zobrist hash from a table
 * @param {number} type 
 * @param {number} player 
 * @param {number} pos 
 * @returns {number}
 */
const getValue = function(type: any, player: any, pos: any) {
  if (hash === null) {
    hash = [];
  }
  if (hash[type] === undefined) {
    hash[type] = [];
  }
  if (hash[type][player] === undefined) {
    hash[type][player] = [];
  }
  if (hash[type][player][pos] === undefined) {
    hash[type][player][pos] = getRandomValue();
  }
  return hash[type][player][pos];
};

/**
 * Updates a zobrist hash
 * @link https://en.wikipedia.org/wiki/Zobrist_hashing
 * @link https://www.chessprogramming.org/Zobrist_Hashing
 * @param {number} value - the current hash value
 * @param {TPiece} piece 
 * @param {number} pos 
 * @returns {number}
 */
const zUpdate = function(value: any, piece: any, pos: any) {
  return value ^ getValue(piece.type, piece.player, pos);
};

export { getRandomValue, zUpdate };
