import _ from "underscore";

import { getPiecePrice, pieceToString, updatePiecePrice } from "../../src/piece";

import type { TBoard } from "../../src/board";
import type { TMove, LocationID, PlayerID } from "../../src/types";

type GameGoalStatus = null | 1 | -1 | 0;

let isRecursive = false;

/**
 * @link https://www.chess.com/terms/draw-chess#dead-position
 */
const isDeadPosition = (board: TBoard): boolean => {
  const pieceList = board.pieces
    .filter((piece) => piece !== undefined)
    .map((piece) => pieceToString(piece, board.design))
    .sort()
    .toString();

  if (
    pieceList == "Black King,White King" ||
    pieceList == "Black Bishop,Black King,White King" ||
    pieceList == "Black King,White Bishop,White King" ||
    pieceList == "Black King,Black Knight,White King" ||
    pieceList == "Black King,White King,White Knight"
  ) {
    return true;
  } else {
    return false;
  }
};

/**
 * Returns if a player wins, loses, or draws in the given game state.
 * @param board
 * @param player
 * @returns {null | 1 | -1 | 0}
 */
export const getGoal = {
  name: "getGoal",
  func: function (board: TBoard, player: PlayerID): GameGoalStatus {
    const design = board.design;

    board.generateMoves(); // search the next ply

    if (isDeadPosition(board)) {
      return 0; //draw
    }

    // checks the game result only if the current player cannot make any legal move
    if (board.legalMoves.length == 0) {
      const king = design.getPieceType("King");

      /** the square where a current player's king exists */
      let safe: LocationID | null = null;

      design.allLocations().forEach((loc) => {
        const piece = board.getPiece(loc);
        if (piece === null) {
          return;
        }
        if (piece.type == king && piece.player == board.player) {
          // checks if there is a current player's king on the board
          safe = loc;
        }
      });

      const p = board.player;

      if (safe !== null) {
        // when a current player's king is NOT on the board
        board.legalMoves = null;
        board.player = design.getNextPlayer(board.player);
        isRecursive = true;

        board.generateMoves();
        isRecursive = false;

        // search a target square of the move in the next turn
        // so that it check whether the other player can make a move in the next turn or not
        for (const legal_move of board.legalMoves) {
          for (const action of legal_move.actions) {
            if (safe == action.targetSquare) {
              safe = null;
            }
          }
        }

        board.player = p;
        board.legalMoves = [];
      }

      if (safe === null) {
        // when a current player's king is on the board
        if (p == player) {
          return -1; // the player loses
        } else {
          return 1; // the player wins
        }
      }

      return 0; // draw
    }

    return null; // the game is not finished yet
  }
};

/**
 * @param board - depth 0 (the current game state)
 */
export const extension = {
  name: "extension",
  func: function (board: TBoard) {
    const design = board.design;
    const king = design.getPieceType("King");
    const rook = design.getPieceType("Rook");

    if (!isRecursive) {
      const Moves: TMove[] = [];

      // filter pseudo-legal moves
      board.legalMoves.forEach((move) => {
        let safe: number[] = [];

        if (move.mode == 1) {
          // castling
          const a = move.actions[0].originSquare;
          const b = move.actions[1].originSquare;
          safe = _.range(Math.min(a, b), Math.max(a, b) + 1);

          for (const action of move.actions) {
            const piece = action.piece;
            if (getPiecePrice(piece, 0) !== null) {
              return;
            }
          }
        }

        // search in depth 1
        const b = board.makeMove(move);
        design.allLocations().forEach((loc) => {
          const piece = b.getPiece(loc);
          if (piece === null) {
            return;
          }
          if (piece.type == king && piece.player == board.player) {
            safe.push(loc); // get the place where the next player's king occupies
          }
        });

        if (safe.length > 0) {
          isRecursive = true;

          // search in depth 2:
          b.generateMoves();
          isRecursive = false;

          // this checks whether the next player's king can be captured in the depth 2
          // if so, it skips processing the current move
          for (const Move of b.legalMoves) {
            for (const action of Move.actions) {
              if (safe.includes(action.targetSquare)) {
                return;
              }
            }
          }

          // search in depth 1:
          for (const action of move.actions) {
            const piece = action.piece;
            if (piece?.type == rook || piece?.type == king) {
              action.piece = updatePiecePrice(piece, 0, 1); // updates the pieces' value
            }
          }
        }

        Moves.push(move);
      });

      board.legalMoves = Moves; // updates the move list with the fixed legal legalMoves
    }
  }
};
