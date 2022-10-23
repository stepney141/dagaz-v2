import _ from "underscore";
import { games } from "./../../src/dagaz-model";
import type { TBoard, TMove } from "../../src/core";
import type { PositionID, PlayerID } from "../../src/types";

type GameGoalStatus = null | 1 | -1 | 0;

let isRecursive = false;

const getGoal = games.model.getGoal;

/**
 * Returns if a player wins, loses, or draws in the given game state.
 * @param board 
 * @param player 
 * @returns {null | 1 | -1 | 0}
 */
games.model.getGoal = function (board: TBoard, player: PlayerID): GameGoalStatus {
    const design = board.design;

    board.generate(); // search the next ply

    // checks the game result only if the current player cannot make any legal move
    if (board.legalMoves.length == 0) {
        const king = design.getPieceType("King");

        /** the square where a current player's king exists */
        let safe: PositionID | null = null;

        design.allPositions().forEach(pos => {
            const piece = board.getPiece(pos);
            if (piece === null) {
                return;
            }
            if ((piece.type == king) && (piece.player == board.player)) {
                // checks if there is a current player's king on the board
                safe = pos;
            }
        });

        const p = board.player;

        if (safe !== null) { // when a current player's king is NOT on the board
            board.legalMoves = null;
            board.player = design.getNextPlayer(board.player);
            isRecursive = true;

            board.generate();
            isRecursive = false;

            // search a target square of the move in the next turn
            // so that it check whether the other player can make a move in the next turn or not
            for (const legal_move of board.legalMoves) {
                for (const action of legal_move.actions) {
                    if (safe == action[1]) {
                        safe = null;
                    }
                }
            }

            board.player = p;
            board.legalMoves = [];
        }

        if (safe === null) {  // when a current player's king is on the board
            if (p == player) {
                return -1; // the player loses
            } else {
                return 1; // the player wins
            }
        }
        return 0; // draw
    }

    if (getGoal !== undefined) {
        return getGoal(board);
    }

    return null; // the game is not finished yet
};

const extension = games.model.extension;

/**
 * @param board - depth 0 (the current game state)
 */
games.model.extension = function (board: TBoard) {
    const design = board.design;
    const king = design.getPieceType("King");
    const rook = design.getPieceType("Rook");

    if (!isRecursive) {
        const Moves: TMove[] = [];

        // filter pseudo-legal moves
        board.legalMoves.forEach(move => {
            let safe: number[] = [];

            if (move.mode == 1) { // castling
                const a = move.actions[0][0];
                const b = move.actions[1][0];
                safe = _.range(Math.min(a, b), Math.max(a, b) + 1);

                for (const action of move.actions) {
                    const piece = action[2];
                    if (piece.getValue(0) !== null) {
                        return;
                    }
                }
            }

            // search in depth 1
            const b = board.apply(move);
            design.allPositions().forEach(pos => {
                const piece = b.getPiece(pos);
                if (piece === null) {
                    return;
                }
                if ((piece.type == king) && (piece.player == board.player)) {
                    safe.push(pos); // get the place where the next player's king occupies
                }
            });

            if (safe.length > 0) {
                isRecursive = true;

                // search in depth 2:
                b.generate();
                isRecursive = false;

                // this checks whether the next player's king can be captured in the depth 2
                // if so, it skips processing the current move
                for (const Move of b.legalMoves) {
                    for (const action of Move.actions) {
                        if (safe.includes(action[1])) {
                            return;
                        }
                    }
                }

                // search in depth 1:
                for (const action of move.actions) {
                    const piece = action[2];
                    if ((piece?.type == rook) || (piece?.type == king)) {
                        action[2] = piece.setValue(0, 1); // updates the pieces' value
                    }
                }
            }

            Moves.push(move);
        });

        board.legalMoves = Moves; // updates the move list with the fixed legal legalMoves

        if (extension !== undefined) {
            extension(board);
        }
    }
};

export { games };
