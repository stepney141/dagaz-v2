import { getPieceAttribute, pieceToString, updatePieceAttribute } from "../../src/piece";
import { range } from "../../src/utils";

import type { TBoard } from "../../src/board";
import type { TMove, LocationID, PlayerID, Plugin } from "../../src/types";

type GameGoalStatus = null | 1 | -1 | 0;

/** the flag to allow recursive calls to an extension */
let isRecursive = false;

const deadPositions = [
  "Black King,White King",
  "Black Bishop,Black King,White King",
  "Black King,White Bishop,White King",
  "Black King,Black Knight,White King",
  "Black King,White King,White Knight"
];

/**
 * @link https://www.chess.com/terms/draw-chess#dead-position
 */
const isDeadPosition = (board: TBoard): boolean => {
  const pieceList = board.pieces
    .filter((piece) => piece !== undefined)
    .map((piece) => pieceToString(piece, board.design))
    .sort()
    .toString();

  if (deadPositions.includes(pieceList)) {
    return true;
  } else {
    return false;
  }
};

/**
 * Returns if a player wins, loses, or draws in the given game state.
 * @param board
 * @param player
 * @returns game result status
 */
export const getGoal = {
  name: "getGoal",
  func: function (board: TBoard, player: PlayerID): GameGoalStatus {
    if (isDeadPosition(board)) {
      return 0; //draw
    }

    const design = board.design;
    board.generateMoves();

    // checks the game result only if the current player cannot make any legal move
    if (board.legalMoves.length == 0) {
      const king = design.getPieceType("King");

      /** location of the current player's king */
      let safe: LocationID | null = null;

      design.allLocations().forEach((loc) => {
        const piece = board.getPiece(loc);
        // if the current player's king is on the board
        if (piece?.type == king && piece?.player == board.player) {
          safe = loc;
        }
      });

      const p = board.player;

      // if the current player's king is NOT on the board
      if (safe !== null) {
        board.legalMoves = null;
        board.player = design.getNextPlayer(board.player);

        isRecursive = true;
        board.generateMoves();
        isRecursive = false;

        // search a target square of the move in the next turn
        // i.e. check whether the other player can make a move in the next turn
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

      // if the current player's king is NOT on the board
      if (safe === null) {
        if (p == player) {
          return -1; // the specified player loses
        } else {
          return 1; // the specified player wins
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
export const validateCastlingRights: Plugin = {
  name: "extension",
  func: function (board: TBoard) {
    const design = board.design;
    const king = design.getPieceType("King");
    const rook = design.getPieceType("Rook");

    if (!isRecursive) {
      const Moves: TMove[] = [];

      // filter pseudo-legal moves
      board.legalMoves.forEach((move) => {
        let safe: LocationID[] = [];

        // when a castling move is generated
        if (move.mode == 1) {
          const a = move.actions[0].originSquare; // king's origin square
          const b = move.actions[1].originSquare; // rook's origin square
          safe = range({ start: Math.min(a, b), stop: Math.max(a, b) + 1 });

          for (const action of move.actions) {
            if (getPieceAttribute(action.piece, 0) !== null) {
              return;
            }
          }
        }

        // search in depth 1
        const b = board.makeMove(move);
        design.allLocations().forEach((loc) => {
          const piece = b.getPiece(loc);
          if (piece?.type == king && piece?.player == board.player) {
            safe.push(loc); // get the location of the next player's king
          }
        });

        // if the next player's king will be alive...
        if (safe.length > 0) {
          // search in depth 2
          isRecursive = true; // turn off the recursive call
          b.generateMoves();
          isRecursive = false;

          // check whether the next player's king will be captured in the next 2 ply
          for (const Move of b.legalMoves) {
            for (const action of Move.actions) {
              if (safe.includes(action.targetSquare)) {
                return;
              }
            }
          }

          // search in depth 1
          for (const action of move.actions) {
            const piece = action.piece;
            if (piece?.type == rook || piece?.type == king) {
              action.piece = updatePieceAttribute(piece, 0, 1); // updates the pieces' attribute
            }
          }
        }

        Moves.push(move); // a move that have passed the above validations is a genuine legal move
      });

      board.legalMoves = Moves; // updates the movelist with the fixed legal moves
    }
  }
};
