import _ from 'underscore';
import { Dagaz } from '../../dagaz.js';
import { addPrior, CompleteMove } from './utils.js';
import { ZrfMove } from './ZrfMove.js';
import { ZrfPiece } from 'ZrfPiece.js';

export class ZrfBoard {
  constructor(game) {
    this.game     = game;
    this.pieces   = [];
    this.forks    = [];
    this.turn     = 0;
    this.player   = Dagaz.Model.getDesign().currPlayer(this.turn);
    this.changed  = [];
    this.parent   = null;
    this.values   = [];
    this.zSign    = Dagaz.Model.zplayer(0, this.player);
    this.hSign    = Dagaz.Model.hplayer(0, this.player);
    this.level    = 0;
  }

  assign(board) {
    this.zSign    = board.zSign;
    this.hSign    = board.hSign;
    this.pieces   = board.pieces;
    delete this.moves;
  }

  getValue(name) {
    if (_.isUndefined(this.values[name])) {
      return null;
    } else {
      return this.values[name];
    }
  }

  setValue(name, value) {
    if (value === null) {
      delete this.values[name];
    } else {
      this.values[name] = value;
    }
  }

  traceMoves() {
    var signs = [];
    var moves = [];
    var board = this;
    while (board.parent) {
      if (board.zSign != 0) {
        if (_.indexOf(signs, board.zSign) >= 0) {
          var f = true;
          while (f) {
            moves.pop();
            f = signs.pop() != board.zSign;
          }
        }
      }
      if (board.move) {
        signs.push(board.zSign);
        moves.push(board.move);
      }
      board = board.parent;
    }
    return moves.reverse();
  }

  checkGoals(design, player) {
    if (!player) {
      player = this.player;
    }
    return Dagaz.Model.checkGoals(design, this, player);
  }

  setup(view, initialize) {
    if (initialize) {
      Dagaz.Model.setup(this);
    }
    view.clear();
    _.each(_.keys(this.pieces), function(pos) {
      var piece = this.pieces[pos];
      if (piece !== null) {
        view.addPiece(piece.toString(), pos, piece);
      }
    }, this);
  }

  copy() {
    var r = new ZrfBoard(this.game);
    r.parent  = this;
    r.player  = this.player;
    r.zSign   = this.zSign;
    r.hSign   = this.hSign;
    r.lastf   = this.lastf;
    r.lastt   = this.lastt;
    r.reserve = [];
    _.each(_.keys(this.reserve), function(t) {
      r.reserve[t] = [];
      _.each(_.keys(this.reserve[t]), function(p) {
        r.reserve[t][p] = this.reserve[t][p];
      }, this);
    }, this);
    _.each(_.keys(this.pieces), function(pos) {
      r.pieces[pos] = this.pieces[pos];
    }, this);
    _.each(_.keys(this.values), function(k) {
      r.values[k] = this.values[k];
    }, this);
    return r;
  }

  clear() {
    this.zSign    = 0;
    this.hSign    = 0;
    this.pieces   = [];
  }

  addFork(gen) {
    if (!_.isUndefined(Dagaz.Model.movesLimit)) {
      if (this.forks.length >= Dagaz.Model.movesLimit) {
        this.failed = true;
        return;
      }
    }
    this.forks.push(gen);
  }

  getPiece(pos) {
    if (_.isUndefined(this.pieces[pos])) {
      return null;
    } else {
      return this.pieces[pos];
    }
  }

  setPiece(pos, piece) {
    if (!_.isUndefined(this.pieces[pos])) {
      var op = this.pieces[pos];
      this.zSign = Dagaz.Model.zupdate(this.zSign, op, pos);
      this.hSign = Dagaz.Model.hupdate(this.hSign, op, pos);
    }
    if (piece === null) {
      delete this.pieces[pos];
    } else {
      this.pieces[pos] = piece;
      this.zSign = Dagaz.Model.zupdate(this.zSign, piece, pos);
      this.hSign = Dagaz.Model.hupdate(this.hSign, piece, pos);
    }
  }

  addMove(move) {
    this.moves.push(move);
  }

  changeMove(move) {
    if (this.moves.length > 0) {
      this.moves.pop();
    }
    this.moves.push(move);
  }

  getSignature() {
    return this.zSign;
  }

  generateInternal(callback, cont, cover, serial) {
    var design = this.game.design;
    if (_.isUndefined(this.moves)) {
      this.moves = [];
    } else {
      return;
    }
    var sn = 0;
    if ((this.moves.length == 0) && !design.failed && (this.player > 0)) {
      var priors = [];
      _.chain(_.keys(this.pieces))
        .filter(function(pos)  
        { return !_.isUndefined(cover) ||
                           Dagaz.Model.sharedPieces || 
                           Dagaz.Model.isFriend(this.pieces[pos], this.player); 
        }, this)
        .each(function(pos) {
          var piece = this.pieces[pos];
          _.chain(design.pieces[piece.type])
            .filter(function(move) { return (move.type == 0); })
            .filter(function(move) { 
              return design.isValidMode(this.turn, move.mode); 
            }, this)
            .each(function(move) {
              var g = Dagaz.Model.createGen(move.template, move.params, this.game.design, move.mode, sn++, move.sound);
              if (!_.isUndefined(cover)) {
                g.cover  = cover;
                g.serial = serial;
              }
              g.init(this, pos);
              addPrior(priors, move.mode, g);
            }, this);
        }, this);
      if (_.isUndefined(cover)) {
        _.each(design.allPositions(), function(pos) {          
          _.chain(_.range(design.pieces.length))
            .filter(function(tp) { return !Dagaz.Model.noReserve(this, tp); }, this)
            .each(function(tp) {
              _.chain(design.pieces[tp])
                .filter(function(move) { return (move.type == 1); })
                .filter(function(move) { 
                  return design.isValidMode(this.turn, move.mode); 
                }, this)
                .each(function(move) {
                  var g = Dagaz.Model.createGen(move.template, move.params, this.game.design, move.mode, sn++, move.sound);
                  g.init(this, pos);
                  g.piece = new ZrfPiece(tp, this.player);
                  addPrior(priors, move.mode, g);
                }, this);
            }, this);
        }, this);
      }
      this.forks = [];
      if (callback.checkContinue()) {
        for (var i = 0; i <= design.modes.length; i++) {
          var f = false;
          if (!_.isUndefined(priors[i])) {
            while (priors[i].length > 0) {
              var g = priors[i].pop();
              g.generate();
              if (g.completed && !g.move.isPass()) {
                if (cont && (g.moveType == 0)) {
                  CompleteMove(this, g, cover, serial);
                }
                f = true;
              }
            }
          }
          if (f) break;
          if (i >= design.modes.length) break;
        }
        while (this.forks.length > 0) {
          var g = this.forks.pop();
          g.generate();
          if (g.completed) {
            if (cont && (g.moveType == 0)) {
              CompleteMove(this, g, cover, serial);
            }
          }
        }
      }
      Dagaz.Model.Extension(this);
      if (cont) {
        Dagaz.Model.CheckInvariants(this);
        Dagaz.Model.PostActions(this);
        if (Dagaz.Model.passTurn == 1) {
          this.moves.push(new ZrfMove());
        }
        if (Dagaz.Model.passTurn == 2) {
          if (this.moves.length == 0) {
            this.moves.push(new ZrfMove());
          }
        }
      }
    }
  }

  generate(design) {
    this.generateInternal(this, true);
  }

  getCover(design) {
    return Dagaz.Model.GetCover(design, this);
  }

  checkContinue() {
    return true;
  }

  movePiece(move, from, to, piece) {
    this.lastf = from;
    this.lastt = to;
    this.lastc = to;
    if ((piece === null) && this.parent) {
      piece = this.parent.getPiece(from);
    }
    if (piece === null) {
      piece = this.getPiece(from);
    }
    if (Dagaz.find(this.changed, from) < 0) {
      this.setPiece(from, null);
    }
    this.setPiece(to, piece);
    this.changed.push(to);
  }

  dropPiece(move, pos, piece) {
    this.lastt = pos;
    Dagaz.Model.decReserve(this, piece);
    this.setPiece(pos, piece);
    this.changed.push(pos);
  }

  capturePiece(move, pos) {
    if (Dagaz.Model.recycleCaptures) {
      var piece = this.getPiece(pos);
      if (piece != null) {
        Dagaz.Model.incReserve(this, piece);
      }
    }
    this.setPiece(pos, null);
    this.changed = _.filter(this.changed, function(p) {
      return p != pos; 
    });
  }

  commit(move) {
    this.changed = [];
  }

  apply(move) {
    if (!_.isUndefined(move.result)) return move.result;
    var design = Dagaz.Model.design;
    var r = this.copy();
    r.turn   = design.nextTurn(this);
    r.zSign  = Dagaz.Model.zplayer(r.zSign, this.player);
    r.hSign  = Dagaz.Model.hplayer(r.hSign, this.player);
    r.player = design.currPlayer(r.turn);
    r.level  = this.level + 1;
    move.applyAll(r);
    r.move = move;
    r.zSign  = Dagaz.Model.zplayer(r.zSign, r.player);
    r.hSign  = Dagaz.Model.hplayer(r.hSign, r.player);
    return r;
  }
}