import { games } from "./../../src/dagaz-model";
import type { TBoard } from "./../../src/core/index";

const extension = games.model.extension;

/**
 * Filter pseudo legal moves
 * @param board 
 */
games.model.extension = function (board: TBoard) {
    const len = board.legal_moves
        .map(move => move.actions.length)
        .reduce((a, b) => Math.max(a, b)); // gets a maximum value
    // const len = _.max(board.legal_moves.map(move =>  move.actions.length));

    board.legal_moves = board.legal_moves.filter(move => move.actions.length == len);

    if (extension !== undefined) {
        extension(board);
    }
};

export { games };
