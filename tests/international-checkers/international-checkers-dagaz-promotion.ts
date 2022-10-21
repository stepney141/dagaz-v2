import { games } from "./../../src/dagaz-model";
import type { TBoard } from "./../../src/core/index";

const extension = games.model.extension;

/**
 * promotion of a man to a king
 * @param board 
 */
games.model.extension = function (board: TBoard) {
    const design = board.design;

    for (const move of board.legal_moves.filter(move => move.actions.length != 0)) {
        const action = move.actions[move.actions.length - 1];
        if ((action[1] !== null) && (action[2] !== null) && design.inZone(board.player, action[1], 0)) {
            action[2] = action[2].promote(1);
        }
    }

    if (extension !== undefined) {
        extension(board);
    }
};

export { games };
