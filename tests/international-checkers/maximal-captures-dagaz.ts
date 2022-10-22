import { games } from "./../../src/dagaz-model";
import type { TBoard } from "./../../src/core/index";

const extension = games.model.extension;

/**
 * Filter pseudo legal moves
 * @param board 
 */
games.model.extension = function (board: TBoard) {
    const len = board.legalMoves
        .map(move => move.actions.length)
        .reduce((a, b) => Math.max(a, b)); // gets a maximum value
    // const len = _.max(board.legalMoves.map(move =>  move.actions.length));

    board.legalMoves = board.legalMoves.filter(move => move.actions.length == len);

    if (extension !== undefined) {
        extension(board);
    }
};

export { games };
