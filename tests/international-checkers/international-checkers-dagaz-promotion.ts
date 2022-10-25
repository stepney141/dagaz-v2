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
            if ((action.targetSquare !== null) && (action.piece !== null) && design.isInZone(board.player, action.targetSquare, 0)) {
                action.piece = action.piece.promote(1);
            }
        }
    }
};
