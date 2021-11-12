import _ from "../../../dependencies/underscore-esm-min.js";
import { games } from "../dagaz-model.js";
import { TMove } from "./TMove.js";
import { TMoveContext } from "./TMoveContext.js";

export class TBoard {
  constructor(design) {
    this.design = design;
    this.pieces = [];
    this.turn   = 0;
    this.player = design.currPlayer(this.turn);
    this.z      = 0;
  }

  copy() {
    var r = new TBoard(this.design);
    r.parent = this;
    r.turn   = this.turn;
    r.player = this.player;
    _.each(_.keys(this.pieces), function(pos) {
      r.pieces[pos] = this.pieces[pos];
    }, this);
    r.z = this.z;
    return r;
  }

  clear() {
    this.pieces = [];
    this.z = 0;
    delete this.moves;
  }

  setLastFrom(pos) {
    this.lastFrom = pos; 
  }

  isLastFrom(pos) {
    if (!_.isUndefined(this.lastFrom)) {
      return this.lastFrom == pos;
    }
    return false;
  }

  getPiece(pos) {
    if (_.isUndefined(this.pieces[pos])) {
      return null;
    } else {
      return this.pieces[pos];
    }
  }

  setPiece(pos, piece) {
    if (!_.isUndefined(games.model.zupdate) && !_.isUndefined(this.pieces[pos])) {
      this.z = games.model.zupdate(this.z, this.pieces[pos], pos);
    }
    if (piece === null) {
      delete this.pieces[pos];
    } else {
      this.pieces[pos] = piece;
      if (!_.isUndefined(games.model.zupdate)) {
        this.z = games.model.zupdate(this.z, piece, pos);
      }
    }
  }

  completeMove(parent) {
    var r = false;
    _.each(this.design.moves, function(t) {
      if (t.t != parent.piece.type) return;
      if (t.m != parent.mode) return;
      var ctx = parent.copy();
      ctx.hand = {
        start: parent.pos,
        piece: parent.piece
      };
      ctx.mode = null;
      t.f(ctx, t.p);
      if (ctx.succeed) {
        r = true;
      }
    }, this);
    return r;
  }

  generate() {
    if (_.isUndefined(this.moves)) {
      this.forks = [];
      this.moves = [];
      var groups = _.groupBy(this.design.moves, function(t) {
        if (this.design.modes.length == 0) return 0;
        return _.indexOf(this.design.modes, t.m);
      }, this);
      var cnt = this.design.modes.length;
      if (cnt == 0) cnt = 1;
      for (var i = 0; i < cnt; i++) {
        var completed = false;
        _.each(this.design.allPositions(), function(pos) {
          var piece = this.getPiece(pos);
          if (piece === null) return;
          if (!games.model.sharedPieces && (piece.player != this.player)) return;
          _.each(groups[i], function(t) {
            if (t.t != piece.type) return;
            var ctx = new TMoveContext(this.design, this, pos, piece);
            ctx.move.mode = t.m;
            ctx.take(); ctx.setPiece(pos, null);
            t.f(ctx, t.p);
            if (ctx.succeed) {
              completed = true;
            }
          }, this);
        }, this);
        if (completed) break;
      }
      for (var i = 0; i < this.forks.length; i++) {
        var ctx = this.forks[i];
        var f = true;
        if (this.completeMove(ctx)) f = false;
        if (games.model.passPartial || f) {
          this.moves.push(ctx.move);
        }
      }
      delete this.forks;
      if (!_.isUndefined(games.model.extension)) {
        games.model.extension(this);
      }
      if (games.model.passTurn && (this.moves.length == 0)) {
        this.moves.push(new TMove(0));
      }
    }
  }

  apply(move) {
    var r = this.copy();
    r.turn = r.design.nextTurn(this);
    r.player = r.design.currPlayer(r.turn);
    move.applyTo(r);
    r.move = move;
    return r;
  }
}