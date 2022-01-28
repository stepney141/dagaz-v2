import _ from '../../../../../../dependencies/underscore-esm-min.js';
import { Dagaz } from '../../dagaz.js';
import { ZrfMove } from './ZrfMove.js';
import { isCaptured, copyArray } from './utils.js';
import { ZrfDesign } from './ZrfDesign.js';
import { ZrfMoveTemplate } from './ZrfMoveTemplate.js';

export class ZrfMoveGenerator {
  constructor(design, mode, serial, sound) {
    /** @type {ZrfMove} */
    this.move = new ZrfMove(mode, serial, sound);
    
    this.start    = mode;
    this.moveType = 1;

    /** @type {?ZrfMoveTemplate} */
    this.template = null;

    /** @type {?Int32Array} */
    this.params = null;
    
    this.mode     = null;
    this.board    = null;
    this.pos      = null;
    this.parent   = null;
    this.pieces   = [];
    this.values   = [];
    this.attrs    = [];
    this.stack    = [];
    this.marks	= [];
    this.cmd      = 0;
    this.level    = 1;
    this.serial = serial;

    /** @type {ZrfDesign} */
    this.design = design;
    
    this.steps    = [];
  }

  init(board, pos) {
    this.board    = board;
    this.pos      = +pos;
    if (Dagaz.Model.detectLoops) {
      this.steps.push(this.pos);
    }
  }

  clone() {
    var r = new ZrfMoveGenerator(this.design, this.start, this.serial, this.sound);
    r.template = this.template;
    r.params   = this.params;  
    r.level    = this.level;
    r.parent   = this.parent;
    r.cmd      = this.cmd;
    r.mode     = this.mode;
    r.board    = this.board;
    r.pos      = this.pos;
    if (!_.isUndefined(this.cover)) {
      r.cover   = this.cover;
      r.serial  = this.serial;
    }
    if (!_.isUndefined(this.initial)) {
      r.initial = this.initial;
    }
    _.each(this.marks, function(it) { r.marks.push(it); });
    _.each(this.stack, function(it) { r.stack.push(it); });
    _.each(_.keys(this.pieces), function(pos) {
      r.pieces[pos] = this.pieces[pos];
    }, this);
    _.each(_.keys(this.values), function(name) {
      r.values[name] = [];
      _.each(_.keys(this.values[name]), function(pos) {
        r.values[name][pos] = this.values[name][pos];
      }, this);
    }, this);
    _.each(_.keys(this.attrs), function(pos) {
      r.attrs[pos] = [];
      _.each(_.keys(this.attrs[pos]), function(name) {
        r.attrs[pos][name] = this.attrs[pos][name];
      }, this);
    }, this);
    if (!_.isUndefined(this.from)) {
      r.from = this.from;
    }
    if (!_.isUndefined(this.piece)) {
      r.piece = this.piece;
    }
    r.move = this.move.clone(r.level);
    return r;
  }

  copy(template, params) {
    var r = Dagaz.Model.createGen(template, params, this.design, this.move.mode, this.serial, this.move.sound);
    r.level    = this.level + 1;
    r.parent   = this;
    r.board    = this.board;
    r.pos      = this.pos;
    r.move     = this.move.copy();
    r.steps    = copyArray(this.steps);
    if (Dagaz.Model.detectLoops) {
      r.steps.push(this.pos);
    }
    if (!_.isUndefined(this.cover)) {
      r.cover   = this.cover;
      r.serial  = this.serial;
    }
    if (!_.isUndefined(this.initial)) {
      r.initial = this.initial;
    }
    return r;
  }

  notLooped() {
    return (this.steps.length < 2) || (_.indexOf(this.steps, this.pos) < 0);
  }

  getPos() {
    return this.pos;
  }

  movePiece(from, to, piece) {
    if (!_.isUndefined(this.attrs[to])) {
      for (var name in this.attrs[to]) {
        piece = piece.setValue(name, this.attrs[to][name]);
      }
    }
    this.move.movePiece(from, to, piece, this.level);
    this.lastf = from;
    this.lastt = to;
    if (from != to) {
      this.setPiece(from, null);
    }
    this.setPiece(to, piece);
  }

  dropPiece(pos, piece) {
    this.move.dropPiece(pos, piece, this.level);
    this.setPiece(pos, piece);
  }

  capturePiece(pos) {
    if (isCaptured(this.move, pos)) return false;
    this.move.capturePiece(pos, this.level);
    this.setPiece(pos, null);
    return true;
  }

  getMark() {
    return Dagaz.Model.getMark(this);
  }

  setMark() {
    Dagaz.Model.setMark(this);
  }

  getPieceInternal(pos) {
    if (!_.isUndefined(this.pieces[pos])) {
      return this.pieces[pos];
    }
    if (this.parent !== null) {
      return this.parent.getPieceInternal(pos);
    }
    return this.board.getPiece(pos);
  }

  getPiece(pos) {
    return Dagaz.Model.getPiece(this, pos);
  }

  setPiece(pos, piece) {
    this.pieces[pos] = piece;
  }

  isLastFrom(pos) {
    if (this.parent !== null) {
      if (!_.isUndefined(this.parent.lastf)) {
        return (this.parent.lastf == pos);
      } else {
        return false;
      }
    }
    return Dagaz.Model.isLastFrom(pos, this.board);
  }

  isLastTo(pos) {
    if (this.parent !== null) {
      if (!_.isUndefined(this.parent.lastt)) {
        return (this.parent.lastt == pos);
      } else {
        return false;
      }
    }
    return Dagaz.Model.isLastTo(pos, this.board);
  }

  getValue(name, pos) {
    if (!_.isUndefined(this.values[name])) {
      if (!_.isUndefined(this.values[name][pos])) {
        return this.values[name][pos];
      }
    }
    return Dagaz.Model.getValueInternal(this, name, pos);
  }

  setValue(name, pos, value) {
    if (_.isUndefined(this.values[name])) {
      this.values[name] = [];
    }
    this.values[name][pos] = value;
  }

  getAttr(name, pos) {
    var piece = this.getPiece(pos);
    if (piece !== null) {
      return piece.getValue(name);
    }
    return Dagaz.Model.getAttrInternal(this, name, pos);
  }

  setAttr(name, pos, value) {
    if (_.isUndefined(this.attrs[pos])) {
      this.attrs[pos] = [];
    }
    this.attrs[pos][name] = value;
    var piece = this.getPieceInternal(pos);
    if (piece !== null) {
      piece = piece.setValue(name, value);
      this.move.movePiece(pos, pos, piece, this.level);
      this.setPiece(pos, piece);
    }
  }

  generate() {
    while (this.cmd < this.template.commands.length) {
      var r = (this.template.commands[this.cmd++])(this);
      if (r === null) return;
      this.cmd += r;
      if (this.cmd < 0) return;
    }
    this.cmd = 0;
    this.completed = true;
  }
}