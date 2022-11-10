import type { LocationID, PieceTypeID, PlayerID, TPiece } from "./types";

type TranspositionTableKey = `${PieceTypeID}/${PlayerID}/${LocationID}`;

/**
 * A transposition table
 */
const TRANSPOSITION_TABLE = new Map<TranspositionTableKey, number>();

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
const getHash = function (pieceType: number, player: number, loc: number) {
  const key: TranspositionTableKey = `${pieceType}/${player}/${loc}`;
  if (TRANSPOSITION_TABLE.has(key) === false) {
    TRANSPOSITION_TABLE.set(key, getRandomValue());
  }
  return TRANSPOSITION_TABLE.get(key);
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
export const zUpdate = function (value: number, piece: TPiece, loc: number): number {
  return value ^ getHash(piece.type, piece.player, loc);
};
