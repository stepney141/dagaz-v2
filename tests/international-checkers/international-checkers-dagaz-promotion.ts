import type { TBoard } from "./../../src/core";

/**
 * promotion of a man to a king
 * @param board 
 */
export const promotion = {
    name: "extension",
    func: function (board: TBoard) {
        const design = board.design;

        for (const move of board.legalMoves.filter(move => move.actions.length != 0)) {
            const action = move.actions[move.actions.length - 1];
            if ((action[1] !== null) && (action[2] !== null) && design.isInZone(board.player, action[1], 0)) {
                action[2] = action[2].promote(1);
            }
        }
    }
};
