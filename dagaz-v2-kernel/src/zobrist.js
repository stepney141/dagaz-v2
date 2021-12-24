import _ from "../../dependencies/underscore-esm-min.js";
import { TPiece } from "./core/TPiece.js";

let hash = null;

/**
 * Returns a random integer between 0 and 255
 * @returns {number}
 */
const getRandomByte = function() {
  return _.random(0, 255);
};

/**
 * 
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
 * 
 * @param {number} type 
 * @param {number} player 
 * @param {number} pos 
 * @returns {number}
 */
const getValue = function(type, player, pos) {
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
 * 
 * @param {number} value 
 * @param {TPiece} piece 
 * @param {number} pos 
 * @returns {number}
 */
export const zUpdate = function(value, piece, pos) {
  return value ^ getValue(piece.type, piece.player, pos);
};
