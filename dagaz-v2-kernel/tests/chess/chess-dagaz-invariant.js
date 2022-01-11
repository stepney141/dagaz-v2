import _ from "../../../dependencies/underscore-esm-min.js";
import { games } from "../../src/dagaz-model.js";
import { TBoard } from "../../src/core/index.js";

let isRecursive = false;

const getGoal = games.model.getGoal;

/**
 * Returns if a player wins, loses, or draws in the given game state.
 * @param {TBoard} board 
 * @param {number} player 
 * @returns {null | 1 | -1 | 0}
 */
games.model.getGoal = function(board, player) {
  const design = board.design;
  board.generate();

  if (board.moves.length == 0) {
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
      board.moves = null;
      board.player = design.nextPlayer(board.player);
      isRecursive = true;
      board.generate();
      isRecursive = false;
      for (let i = 0; i < board.moves.length; i++) {
        for (let j = 0; j < board.moves[i].actions.length; j++) {
          // checks if the other player will be able to make a move in the next turn
          // by searching a target square of a move in the next turn by the other player
          if (safe == board.moves[i].actions[j][1]) {
            safe = null;
          }
        }
      }
      board.player = p;
      board.moves = [];
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
 * @param {TBoard} board 
 */
games.model.extension = function(board) {
  const design = board.design;
  const king = design.getPieceType("King");
  const rook = design.getPieceType("Rook");
  
  if (!isRecursive) {
    let Moves = [];

    board.moves.forEach(move => {
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

      const b = board.apply(move);

      design.allPositions().forEach(pos =>{
        const piece = b.getPiece(pos);
        if (piece === null) {
          return;
        }
        if ((piece.type == king) && (piece.player == board.player)) {
          safe.push(pos);
        }
      });

      if (safe.length > 0) {
        isRecursive = true;
        b.generate();
        isRecursive = false;

        for (const Move of b.moves) {
          for (const action of Move.actions) {
            if (safe.includes(action[1])) {
              return;
            }
          }
        }

        for (let action of move.actions) {
          const piece = action[2];
          if ((piece?.type == rook) || (piece?.type == king)) {
            action[2] = piece.setValue(0, 1);
          }
        }
      }

      Moves.push(move);
    });

    board.moves = Moves; // updates the move list with the fixed legal moves

    if (extension !== undefined) {
      extension(board);
    }
  }
};

export { games };