import { games } from "./maximal-captures-dagaz.js";
import { TBoard } from "../../dagaz-model-class/TBoard.js";

const extension = games.model.extension;

/**
 * @param {TBoard} board 
 */
games.model.extension = function(board) {
  const design = board.design;

  board.moves.forEach(move => {
    if (move.actions.length == 0) {
      return;
    }
    const action = move.actions[move.actions.length - 1];
    if ((action[1] !== null) && (action[2] !== null) && design.inZone(board.player, action[1], 0)) {
      action[2] = action[2].promote(1);
    }
  });

  if (extension !== undefined) {
    extension(board);
  }
};

export { games };