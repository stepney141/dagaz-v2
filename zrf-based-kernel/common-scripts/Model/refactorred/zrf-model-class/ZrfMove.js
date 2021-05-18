import _ from 'underscore';
import { Dagaz } from '../../../dagaz.js';

export class ZrfMove {
  constructor(mode, serial, sound) {
    this.actions  = [];
    this.serial   = serial;
    if (!_.isUndefined(sound)) {
      this.sound = sound;
    }
    if (_.isUndefined(mode)) {
      this.mode = 0;
    } else {
      this.mode = mode;
    }
  }

  getZ() {
    if (_.isUndefined(this.zSign)) {
      _.each(this.actions, function(a) {
        if (a[2] === null) return;
        if (a[0] !== null) {
          this.zSign = Dagaz.Model.zupdate(this.zSign, a[2][0], a[0][0]);
        }
        if (a[1] !== null) {
          this.zSign = Dagaz.Model.zupdate(this.zSign, a[2][0], a[1][0]);
        }
      }, this);
    }
    return this.zSign;
  }

  getControlList() {
    return _.chain(this.actions)
      .map(function (action) {
        return _.chain(_.range(3))
          .map(function (ix) {
            if (action[ix] === null) {
              return 0;
            } else {
              return action[ix].length;
            }
          })
          .filter(function (n) { return n > 1; })
          .value();
      })
      .flatten()
      .map(function (n) { return _.range(n); })
      .cartesian()
      .value();
  }

  determinate() {
    var c = this.getControlList();
    if (c.length > 1) {
      return _.chain(c)
        .map(function (l) {
          var r = new ZrfMove(this.mode);
          r.serial = this.serial;
          var pos = 0;
          _.each(this.actions, function (action) {
            var x = [];
            _.each(_.range(3), function (ix) {
              pos = pushItem(this, action[ix], l, pos);
            }, x);
            x.push(action[3]);
            if (isValidAction(x)) {
              this.actions.push(x);
            }
          }, r);
          return r;
        }, this)
        .filter(isValidMove)
        .value();
    } else {
      return [ this ];
    }
  }

  copy() {
    var r = new ZrfMove(this.mode);
    r.actions = _.filter(this.actions);
    r.serial  = this.serial;
    r.sound   = this.sound;
    return r;
  }

  clone(level) {
    var r = new ZrfMove(this.mode);
    r.serial = this.serial;
    r.sound  = this.sound;
    var o = true;
    r.actions = _.chain(this.actions)
      .filter(function(action) {
        if ((action[0] !== null) && (action[1] !== null) && o) {
          if (Dagaz.Model.discardCascades) {
            o = false;
          }
          return true;
        }
        if (Dagaz.Model.forkMode || (Math.abs(action[3]) < level)) {
          return true;
        }
        return false;
      })
      .value();
    return r;
  }

  toString(part) {
    return Dagaz.Model.moveToString(this, part ? part : 0 );
  }

  isAttacked(pos) {
    return _.chain(this.actions)
      .filter(function(action) {
        var fp = action[0];
        var tp = action[1];
        if ((fp !== null) && (fp[0] == pos) && (tp === null)) {
          return true;
        }
        if ((tp !== null) && (tp[0] == pos) && (fp !== null) && (fp[0] != tp[0])) {
          return true;
        }
        return false;
      })
      .size()
      .value() > 0;
  }

  applyTo(obj, part) {
    if (!part) part = 1;
    var r = false;
    var n = function (action) {
      return (action[3] == part);
    };
    _.chain(this.actions)
      .filter(n)
      .filter(function (action) {
        return (action[0] !== null) && (action[1] !== null);
      })
      .each(function (action) {
        obj.movePiece(this, action[0][0], action[1][0], (action[2] === null) ? null : action[2][0], action[3]);
        r = true;
      }, this);
    _.chain(this.actions)
      .filter(n)
      .filter(function (action) {
        return (action[0] === null) && (action[1] !== null) && (action[2] !== null);
      })
      .each(function (action) {
        obj.dropPiece(this, action[1][0], action[2][0], action[3]);
        r = true;
      }, this);
    _.chain(this.actions)
      .filter(n)
      .filter(function (action) {
        return (action[0] !== null) && (action[1] === null);
      })
      .each(function (action) {
        obj.capturePiece(this, action[0][0], action[3]);
        r = true;
      }, this);
    _.chain(this.actions)
      .filter(n)
      .filter(function (action) {
        return (action[0] === null) && (action[1] === null) && (action[2] !== null);
      })
      .each(function (action) {
        if (!_.isUndefined(action[2][0].exec)) {
          action[2][0].exec(obj);
        }
      });
    if (r) {
      obj.commit(this);
    }
    return r;
  }

  applyAll(obj) {
    var mx = _.chain(this.actions)
      .map(function(action) {
        return action[3];
      })
      .push(0)
      .max()
      .value();
    if (mx > 0) {
      _.chain(_.range(1, mx + 1))
        .each(function (part) {
          this.applyTo(obj, part);
        }, this);
    }
  }

  movePiece(from, to, piece, part) {
    if (!part) part = 1;
    if (piece === null) {
      this.actions.push([ [from], [to], null, part]);
    } else {
      this.actions.push([ [from], [to], [piece], part]);
    }
  }

  dropPiece(pos, piece, part) {
    if (!part) part = 1;
    this.actions.push([null, [pos], [piece], part]);
  }

  capturePiece(pos, part) {
    if (!part) part = 1;
    this.actions.push([ [pos], null, null, part]);
  }

  getTarget() {
    for (var i = 0; i < this.actions.length; i++) {
      var a = this.actions[i];
      if ((a[0] !== null) && (a[1] !== null)) {
        return a[1][0];
      }
    }
    return null;
  }

  setReserve(type, player, value, part) {
    if (!part) part = 1;
    this.actions.push([ null, null, [{
      exec: function(obj) {
        if (obj.reserve) {
          obj.reserve[type][player] = value;
        }
      }
    }], part]);
  }

  addReserve(type, player, value, part) {
    if (!part) part = 1;
    this.actions.push([ null, null, [{
      exec: function(obj) {
        if (obj.reserve) {
          obj.reserve[type][player] += value;
        }
      }
    }], part]);
  }

  setValue(name, value, part) {
    if (!part) part = 1;
    this.actions.push([ null, null, [{
      exec: function(obj) {
        if (obj.setValue) {
          obj.setValue(name, value);
        }
      }
    }], part]);
  }

  addValue(name, value, part) {
    if (!part) part = 1;
    this.actions.push([ null, null, [{
      exec: function(obj) {
        if (obj.getValue && obj.setValue) {
          var acc = obj.getValue(name);
          if (!acc) acc = 0;
          acc += value;
          obj.setValue(name, acc);
        }
      }
    }], part]);
  }

  goTo(turn, part) {
    if (!part) part = 1;
    this.actions.push([ null, null, [{
      exec: function(obj) {
        var design = Dagaz.Model.design;
        if (!_.isUndefined(obj.turn) && !_.isUndefined(obj.player)) {
          obj.turn = turn;
          obj.player = design.currPlayer(turn);
        }
      }
    }], part]);
  }

  playSound(ix, delay, part) {
    if (!part) part = 1;
    if (!_.isUndefined(Dagaz.Controller.play)) {
      this.actions.push([ null, null, [{
        exec: function() {
          if (_.isUndefined(delay)) {
            Dagaz.Controller.play(ix);
          } else {
            _.delay(Dagaz.Controller.play, delay, ix);
          }
        }
      }], part]);
    }
  }

  isPass() {
    return this.actions.length == 0;
  }

  clarify(move) {
    _.each(move.actions, function(s) {
      if ((s[0] !== null) && (s[1] !== null)) {
        _.each(this.actions, function(d) {
          if ((d[0] !== null) && (d[1] !== null) && (d[0][0] == s[0][0]) && (d[1][0] == s[1][0])) {
            d[2] = s[2];
          }
        });
      }
    }, this);
  }

  isSimpleMove() {
    return (this.actions.length == 1) && (this.actions[0][0] !== null) && (this.actions[0][1] !== null);
  }

  isDropMove() {
    var r = false;
    for (var i = 0; i < this.actions.length; i++) {
      if (this.actions[i][0] !== null) return false;
      if (this.actions[i][1] !== null) return true;
    }
    return r;
  }

  join(move) {
    _.each(move.actions, function(a) {
      this.actions.push(a);  
    }, this);
  }
}