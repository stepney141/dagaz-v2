import { TBoard } from "../../src/core/index.js";

/**
 * promotion of a man to a king
 * @param {TBoard} board 
 */
const promotion = function(board) {
  const design = board.design;

  for (const move of board.moves.filter(move => move.actions.length != 0)) {
    const action = move.actions[move.actions.length - 1];
    if ((action[1] !== null) && (action[2] !== null) && design.inZone(board.player, action[1], 0)) {
      action[2] = action[2].promote(1);
    }
  }
};

export { promotion };
