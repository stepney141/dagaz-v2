import _ from "underscore";
import { TBoard } from "../../src/core";
import { PlayerID } from "../../src/types";
import { games } from "./../../src/dagaz-model";

let isRecursive = false;

const getGoal = games.model.getGoal;

/**
 * Returns if a player wins, loses, or draws in the given game state.
 * @param board 
 * @param player 
 * @returns {null | 1 | -1 | 0}
 */
games.model.getGoal = function (board: TBoard, player: PlayerID) {
  const design = board.design;
  board.generate();

  if (board.legal_moves.length == 0) {
    const king = design.getPieceType("King");
    let safe = null;

    design.allPositions().forEach(pos => {
      const piece = board.getPiece(pos);
      if (piece === null) {
        return;
      }
      if ((piece.type == king) && (piece.player == board.player)) {
        safe = pos; // there is a current player's king on the board
      }
    });

    const p = board.player;

    if (safe !== null) {
      board.legal_moves = null;
      board.player = design.nextPlayer(board.player);
      isRecursive = true;
      board.generate();
      isRecursive = false;
      for (let i = 0; i < board.legal_moves.length; i++) {
        for (let j = 0; j < board.legal_moves[i].actions.length; j++) {
          // checks if the other player will be able to make a move in the next turn
          // by searching a target square of a move in the next turn by the other player
          if (safe == board.legal_moves[i].actions[j][1]) {
            safe = null;
          }
        }
      }
      board.player = p;
      board.legal_moves = [];
    }

    if (safe === null) {
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
 * @param {TBoard} board - depth 0 (the current game state)
 */
games.model.extension = function (board) {
  const design = board.design;
  const king = design.getPieceType("King");
  const rook = design.getPieceType("Rook");

  if (!isRecursive) {
    /** @type {Array<TMove>} */
    let Moves = [];

    // filters the pre-generated moves
    board.legal_moves.forEach(move => {
      /** @type {Array<number>} */
      let safe = [];

      if (move.mode == 1) {
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

      // depth 1
      const b = board.apply(move);

      // searches in depth 1
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
        b.generate(); // depth 2
        isRecursive = false;

        // searches in depth 2
        for (const Move of b.legal_moves) {
          for (const action of Move.actions) {
            if (safe.includes(action[1])) {
              // checks if the next player's king can be captured in the depth 2
              // if so, skips processing the current move
              return;
            }
          }
        }

        // searches in depth 1
        for (let action of move.actions) {
          const piece = action[2];
          if ((piece?.type == rook) || (piece?.type == king)) {
            action[2] = piece.setValue(0, 1); // updates the pieces' value
          }
        }
      }

      Moves.push(move);
    });

    board.legal_moves = Moves; // updates the move list with the fixed legal legal_moves

    if (extension !== undefined) {
      extension(board);
    }
  }
};

export { games };
