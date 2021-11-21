import _ from "../../../dependencies/underscore-esm-min.js";
import { games } from "../dagaz-model.js";
import { TMove } from "./TMove.js";
import { TMoveContext } from "./TMoveContext.js";
import { TPiece } from "./TPiece.js";
import { TDesign } from "./TDesign.js";

export class TBoard {
  /**
   * 
   * @param {TDesign} design 
   */
  constructor(design) {
    this.design = design;
    
    /**
     * @type {Array<TPiece>}
     * @description a list of pieces on the current board. a new piece will be pushed into the index corresponding to its position id.
     */
    this.pieces = [];

    /**
     * @type {number}
     * @description an id of the current turn. it corresponds to the player id.
     */
    this.turn = 0;
    
    /**
     * @type {number}
     * @description an id of a player who makes a move in the current turn
     */
    this.player = design.currPlayer(this.turn);
    
    this.z = 0;
    
    /**
     * @type {Array<TMove> | undefined}
     * @description a list of legal moves available in the current game state.
     */
    this.moves;
  }

  /**
   * Copies and returns the TBoard instance
   * @returns {TBoard} a copied board instance
   */
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

  /**
   * Clears the instance members
   */
  clear() {
    this.pieces = [];
    this.z = 0;
    delete this.moves;
  }

  /**
   * 
   * @param {*} pos 
   */
  setLastFrom(pos) {
    this.lastFrom = pos; 
  }

  /**
   * 
   * @param {*} pos 
   * @returns {boolean}
   */
  isLastFrom(pos) {
    if (!_.isUndefined(this.lastFrom)) {
      return this.lastFrom == pos;
    }
    return false;
  }

  /**
   * Returns a piece on the given position
   * @param {number} pos - a position id
   * @returns {null | TPiece} a piece (null if no piece occupies the given position)
   */
  getPiece(pos) {
    if (_.isUndefined(this.pieces[pos])) {
      return null;
    } else {
      return this.pieces[pos];
    }
  }

  /**
   * Puts a given piece to a given position on the board instance
   * @param {null | number} pos 
   * @param {null | TPiece} piece 
   */
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

  /**
   * 
   * @param {TMoveContext} parent 
   * @returns {boolean}
   */
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

  /**
   * Generates a list of legal moves and store it in the board instance
   */
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

  /**
   * Makes a move and create a new game state
   * @param {TMove} move 
   * @returns {TBoard}
   */
  apply(move) {
    var r = this.copy();
    r.turn = r.design.nextTurn(this);
    r.player = r.design.currPlayer(r.turn);
    move.applyTo(r);
    r.move = move;
    return r;
  }
}
