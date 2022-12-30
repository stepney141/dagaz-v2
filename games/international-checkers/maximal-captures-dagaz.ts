import type { TBoard } from "../../src/board";
import type { Plugin } from "../../src/types";

/**
 * Filter pseudo legal moves
 * @param board
 */
export const maximalCapture: Plugin = {
  name: "extension",
  func: function (board: TBoard) {
    const len = board.legalMoves.map((move) => move.actions.length).reduce((a, b) => Math.max(a, b)); // gets a maximum value

    board.legalMoves = board.legalMoves.filter((move) => move.actions.length == len);
  }
};
