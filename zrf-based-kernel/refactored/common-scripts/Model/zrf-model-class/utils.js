import _ from '../../../../../dependencies/underscore-esm-min.js';
import { Dagaz } from '../../dagaz.js';

var addPositions = function(self, ix, name, point) {
  if (ix < 0) {
    var offsets = _.map(_.range(self.dirs.length), function(dir) {
      return 0;
    });
    _.each(_.keys(self.dirs), function(dir) {
      var o = 0;
      for (var c = self.scales.length - 1; c >= 0; c--) {
        if (c < self.scales.length - 1) {
          o = o * self.scales[c].length;
        }
        var v = self.dirs[dir][c];
        var x = point[c] + v;
        if (x < 0) return;
        if (x >= self.scales[c].length) return;
        o += v;
      }
      offsets[dir] = o;
    });
    self.design.addPosition(name, offsets);
    return;
  }
  for (var i = 0; i < self.scales[ix].length; i++) {
    point.unshift(i);
    addPositions(self, ix - 1, self.scales[ix][i] + name, point);
    point.shift();
  }
};
  
var copyArray = function(a) {
  var r = [];
  if (Dagaz.Model.detectLoops) {
    _.each(a, function(x) {
      r.push(x);
    });
  }
  return r;
};

var isCaptured = function(move, pos) {
  if (!Dagaz.Model.deferredStrike) return false;
  for (var i = 0; i < move.actions.length; i++) {
    var a = move.actions[i];
    if ((a[0] !== null) && (a[1] === null) && (a[0] == pos)) return true;
  }
  return false;
};

var addPrior = function(priors, mode, gen) {
  var ix = 0;
  if (gen.design.modes.length > 0) {
    ix = Dagaz.find(gen.design.modes, mode);
    if (Dagaz.Model.zrfCompatible && (ix < 0)) {
      ix = gen.design.modes.length;
    }
  }
  if (ix >= 0) {
    if (_.isUndefined(priors[ix])) {
      priors[ix] = [];
    }
    priors[ix].push(gen);
  }
};

var CompleteMove = function(board, gen, cover, serial) {
  var f = false;
  if (!_.isUndefined(gen.initial)) {
    f = true;
    gen.pos   = gen.initial;
    gen.lastt = gen.initial;
  }
  var positions = Dagaz.Model.getPartList(board, gen);
  if (!Dagaz.Model.passPartial) { var t = 2; } 
  else { var t = 1; }
  while (positions.length > 0) {
    var pos = positions.pop();
    var piece = gen.getPieceInternal(pos);
    if (f && (piece === null) && (gen.parent !== null)) {
      piece = gen.parent.getPieceInternal(pos);
      gen.setPiece(pos, piece);
    }
    if ((piece !== null) && (Dagaz.Model.sharedPieces || Dagaz.Model.isFriend(piece, board.player))) {
      _.each(board.game.design.pieces[piece.type], function(move) {
        if ((move.type == 0) && (move.mode == gen.mode) && gen.notLooped()) {
          var g = gen.copy(move.template, move.params);
          if (!_.isUndefined(cover)) {
            g.cover  = cover;
            g.serial = serial;
          }
          g.moveType = t;
          g.generate();
          if (g.completed && (g.moveType == 0)) {
            CompleteMove(board, g, cover, serial);
            t = 1;
          }
        }
      }, this);
    }
  }
};

var cartesian = function(r, prefix, arr) {
  if (arr.length > 0) {
    _.each(_.first(arr), function (n) {
      var x = _.clone(prefix);
      x.push(n);
      cartesian(r, x, _.rest(arr));
    });
  } else {
    r.push(prefix);
  }
};

var pushItem = function(r, list, control, ix) {
  if ((list === null) || (list.length < 1) || 
           (list.length == 1) || (ix >= control.length)) {
    r.push(list);
    return ix;
  }
  if (list[control[ix]] === null) {
    r.push(null);
  } else {
    r.push([list[control[ix]]]);
  }
  return ix + 1;
};

var isValidAction = function(action) {
  return (action[0] !== null) || (action[1] !== null);
};

var isValidMove = function(move) {
  return 1 >= _.chain(move.actions)
    .filter(function (action) {
      return (action[1] === null);
    })
    .map(function (action) {
      return action[0][0];
    })
    .countBy()
    .values()
    .max()
    .value();
};

export { addPositions, copyArray, isCaptured, addPrior, CompleteMove, cartesian, pushItem, isValidAction, isValidMove };