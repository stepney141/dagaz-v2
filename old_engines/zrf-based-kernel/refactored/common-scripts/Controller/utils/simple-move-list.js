import _ from '../../../../../../dependencies/underscore-esm-min.js';
import { Dagaz } from '../../dagaz.js';

class SimpleMoveList {
  constructor(board) {
    this.board  = board;
  }

  setLastMove(move) {
    this.lastMove = move;
  }

  getLevel() {
    if (_.isUndefined(this.moves)) {
      return 0;
    } else {
      return 1;
    }
  }

  getMoves() {
    if (_.isUndefined(this.moves)) {
      return this.board.moves;
    } else {
      return this.moves;
    }
  }

  getPositions() {
    var moves = this.board.moves;
    if (!_.isUndefined(this.moves)) {
      moves = this.moves;
    }
    return _.chain(moves)
      .map(function(move) {
        return _.chain(move.actions)
          .filter(isMove)
          .slice(0, 1)
          .map(function(action) {
            if (_.isUndefined(this.moves)) {
              return +action[0];
            } else {
              return +action[1];
            }
          }, this)
          .value();
      }, this)
      .compact()
      .flatten()
      .uniq()
      .value();
  }

  getAttacking() {
    var moves = this.board.moves;
    if (!_.isUndefined(this.moves)) {
      moves = this.moves;
    }
    return _.chain(moves)
      .map(function(move) {
        return _.chain(move.actions)
          .filter(isCapturing)
          .map(function(action) {
            return +action[0];
          })
          .value();
      })
      .flatten()
      .compact()
      .uniq()
      .value();
  }

  canDone() {
    if (_.isUndefined(this.moves)) return false;
    return this.moves.length == 1;
  }

  done(view) {
    delete this.moves;
  }

  setPosition(pos) {
    var moves = [];
    if (!_.isUndefined(this.moves)) {
      moves = _.filter(this.moves, function(move) {
        return _.chain(move.actions)
          .filter(isMove)
          .slice(0, 1)
          .filter(function(action) {
            return action[1][0] == pos;
          })
          .size()
          .value() > 0;
      });
    }
    if (moves.length > 0) {
      this.moves = moves;
      return;
    }
    moves = _.filter(this.board.moves, function(move) {
      return _.chain(move.actions)
        .filter(isMove)
        .slice(0, 1)
        .filter(function(action) {
          return action[0][0] == pos;
        })
        .size()
        .value() > 0;
    });
    if (moves.length > 0) {
      this.moves = moves;
      if (!_.isUndefined(this.lastMove) && (this.moves.length > 1)) {
        this.moves = _.filter(this.moves, function(move) {
          for (var i = 0; i < move.actions.length; i++) {
            var action = move.actions[i];
            if (isReverted(action, this.lastMove)) {
              return false;
            }
          }
          return true;
        }, this);
      }
    }
  }
}

Dagaz.Model.getMoveList = function(board) {
  board.generate();
  return new SimpleMoveList(board);
};

var isMove = function(action) {
  return (action[0] !== null) && (action[1] !== null);
};

var isCapturing = function(action) {
  return (action[0] !== null) && (action[1] === null);
};

var isReverted = function(action, move) {
  return _.chain(move.actions)
    .filter(function(a) {
      return (a[0][0] == action[1][0]) &&
                   (action[0][0] == a[1][0]);
    })
    .size()
    .value() > 0;
};

export { Dagaz };