import _ from "../../../dependencies/underscore-esm-min.js";
import { games } from "../../src/dagaz-model.js";
import { TBoard } from "../../src/core/TBoard.js";

const extension = games.model.extension;

/**
 * @param {TBoard} board 
 */
games.model.extension = function(board) {
  const len = _.max(board.moves.map(move =>  move.actions.length));
  board.moves = board.moves.filter(move => move.actions.length == len);
  
  if (extension !== undefined) {
    extension(board);
  }
};

export { games };