import type { TBoard } from "./../../src/core";

/**
 * Filter pseudo legal moves
 * @param board 
 */
export const maximalCapture = {
  name: "extension",
  func: function (board: TBoard) {
    const len = board.legalMoves
      .map(move => move.actions.length)
      .reduce((a, b) => Math.max(a, b)); // gets a maximum value
    // const len = _.max(board.legalMoves.map(move =>  move.actions.length));

    board.legalMoves = board.legalMoves.filter(move => move.actions.length == len);
  }
};
