import _ from "../../../../dependencies/underscore-esm-min.js";
import { games } from "../../core/dagaz-model.js";
import { TBoard } from "../../core/TBoard.js";

let isRecursive = false;

const getGoal = games.model.getGoal;

/**
 * @param {TBoard} board 
 * @param {number} player 
 * @returns {null | number}
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
        safe = pos;
      }
    });

    const p = board.player;

    if (safe !== null) {
      delete board.moves;
      board.player = design.nextPlayer(board.player);
      isRecursive = true;
      board.generate();
      isRecursive = false;
      for (let i = 0; i < board.moves.length; i++) {
        for (let j = 0; j < board.moves[i].actions.length; j++) {
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
        return -1;
      } else {
        return 1;
      }
    }
    return 0;
  }

  if (getGoal !== undefined) {
    return getGoal(board);
  }

  return null;
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
    let moves = [];

    board.moves.forEach(move => {
      let safe = [];

      if (move.mode == 1) {
        const a = move.actions[0][0];
        const b = move.actions[1][0];
        safe = _.range(Math.min(a, b), Math.max(a, b) + 1);
        for (let i = 0; i < move.actions.length; i++) {
          const piece = move.actions[i][2];
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

        for (let i = 0; i < b.moves.length; i++) {
          for (let j = 0; j < b.moves[i].actions.length; j++) {
            if (safe.indexOf(b.moves[i].actions[j][1]) >= 0) {
              return;
            }
          }
        }

        for (let i = 0; i < move.actions.length; i++) {
          const piece = move.actions[i][2];
          if ((piece.type == rook) || (piece.type == king)) {
            move.actions[i][2] = piece.setValue(0, 1);
          }
        }
      }

      moves.push(move);
    });

    board.moves = moves;
    if (extension !== undefined) {
      extension(board);
    }
  }
};

export { games };