import { TBoard } from "../../src/core/index.js";

/**
 * Filter pseudo legal moves
 * @param {TBoard} board 
 */
const maximal_capturing = function(board) {
  const len = board.moves
    .map(move =>  move.actions.length)
    .reduce((a, b) => Math.max(a, b)); // gets a maximum value
  // const len = _.max(board.moves.map(move =>  move.actions.length));
  
  board.moves = board.moves.filter(move => move.actions.length == len);
};

export { maximal_capturing };
