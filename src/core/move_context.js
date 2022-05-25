import { TBoard } from "./board.js";
import { TDesign } from "./design.js";
import { TMove } from "./move.js";
import { TPiece } from "./piece.js";

/**
 * A class representing each partial context of one move
 */
export class TMoveContext {
  /**
   * @param {TDesign} design - a gane design object
   * @param {TBoard} board - a game state object
   * @param {number} pos - origin square
   * @param {null | TPiece} piece - a piece that moves on this turn
   */
  constructor(design, board, pos, piece) {
    this.design = design;
    this.board = board;
    this.from = pos;
    this.pos = pos;

    /** @type {null | number} */
    this.mode = null;
    
    /** @type {null | TMoveContext} */
    this.parent = null;
    
    /** @type {number} */
    this.part = 1;
    
    /** @type {null | TPiece} */
    this.piece = piece;
    
    this.move = new TMove(this.mode);
    this.succeed = false;

    /** @type {Array<{p: number, x: (null | TPiece)}>} */
    this.changes = [];

    this.marks = [];
    
    /** @type {null | {start: number, piece: (null | TPiece)}} */
    this.hand = null;
  }

  /**
   * 
   * @returns {TMoveContext}
   */
  copy() {
    const r = new TMoveContext(this.design, this.board, this.pos, this.piece);
    r.parent = this;
    r.part   = this.part + 1;
    r.move   = this.move.copy();
    r.mode   = this.mode;
    return r;
  }

  /**
   * 
   * @param {number} pos 
   * @param {null | TPiece} piece 
   */
  setPiece(pos, piece) {
    this.changes.push({
      p: pos,
      x: piece
    });
  }

  /**
   * 
   * @param {number} pos 
   * @returns {null | TPiece}
   */
  getPiece(pos) {
    for (const elem of this.changes) {
      if (elem.p == pos) {
        return elem.x;
      }
    }
    if (this.parent !== null) {
      return this.parent.getPiece(pos);
    }
    return this.board.getPiece(pos);
  }

  mark() {
    this.marks.push(this.pos);
  }

  back() {
    if (this.marks.length > 0) {
      this.pos = this.marks[this.marks.length - 1];
    }
  }

  pop() {
    if (this.marks.length > 0) {
      this.pos = this.marks.pop();
    }
  }

  /**
   * Saves the location of the origin square of the move and the piece.
   */
  take() {
    this.hand = {
      start: this.pos,
      piece: this.board.getPiece(this.pos)
    };
  }

  put() {
    if (this.hand !== null) {
      this.piece = this.hand.piece;
      this.move.movePiece(this.hand.start, this.pos, this.hand.piece, this.part);
      this.hand = null;
      this.succeed = true;
    }
  }

  /**
   * @template T
   * @param {undefined | Array<T> | T} params
   * @param {number} ix - index indicating the location of an element to be retrieved from the params array
   * @returns {null | T}
   */
  getParam(params, ix) {
    if (params === undefined) {
      return null;
    }
    if (Array.isArray(params)) {
      return params[ix];
    }
    return params;
  }

  /**
   * 
   * @param {Array<number>} params - list of the directions toward which the piece moves
   * @param {number} ix - index indicating the location of an direction to be retrieved from the params array
   * @returns {boolean} whether the piece can go toward the given direction from the current location
   */
  go(params, ix) {
    const dir = this.getParam(params, ix);
    if (dir === null) {
      return false;
    }
    let player = this.board.player;
    if (this.hand !== null) {
      player = this.hand.piece.player;
    }
    const new_p = this.design.navigate(player, this.pos, dir);
    if (new_p === null) {
      return false;
    }
    this.pos = new_p; // updates the piece location
    return true;
  }

  /**
   * 
   * @param {*} params 
   * @param {*} ix 
   * @returns {null | number}
   */
  opposite(params, ix) {
    const dir = this.getParam(params, ix);
    if (dir === null) {
      return null;
    }
    return this.design.opposite(dir);
  }

  /**
   * 
   * @param {*} params 
   * @param {*} ix 
   * @returns {boolean}
   */
  isLastFrom(params, ix) {
    let pos = this.getParam(params, ix);
    if (pos === null) {
      pos = this.pos;
    }
    if ((this.parent !== null) && (this.parent.parent !== null)) {
      if (pos == this.parent.parent.from) {
        return true;
      }
    }
    return this.board.isLastFrom(pos);
  }

  /**
   * 
   * @returns {boolean}
   */
  isEmpty() {
    if (this.design.game_options.deferredCaptures) {
      for (const a of this.move.actions) {
        if ((a[0] !== null) && (a[1] === null) && (a[0] == this.pos)) {
          return false;
        }
      }
    }
    return this.getPiece(this.pos) === null;
  }

  /**
   * 
   * @returns {boolean}
   */
  isEnemy() {
    const piece = this.getPiece(this.pos);
    if (piece === null) {
      return false;
    }
    return piece.player != this.board.player;
  }

  /**
   * 
   * @returns {boolean}
   */
  isFriend() {
    const piece = this.getPiece(this.pos);
    if (piece === null) {
      return false;
    }
    return piece.player == this.board.player;
  }

  /**
   * 
   * @param {*} params 
   * @param {*} ix 
   * @returns {boolean}
   */
  isPiece(params, ix) {
    const t = this.getParam(params, ix);
    if (t === null) {
      return !this.isEmpty();
    }
    const piece = this.getPiece(this.pos);
    if (piece === null) {
      return false;
    }
    return piece.type == t;
  }

  /**
   * 
   * @param {*} params 
   * @param {*} ix 
   * @returns {null | boolean}
   */
  inZone(params, ix) {
    const zone = this.getParam(params, ix);
    if (zone === null) {
      return null;
    }
    let player = this.board.player;
    if (this.hand !== null) {
      player = this.hand.piece.player;
    }
    return this.design.inZone(player, this.pos, zone);
  }

  /**
   * piece promotions
   * @param {*} params 
   * @param {*} ix 
   * @returns {boolean}
   */
  promote(params, ix) {
    if (this.hand === null) {
      return false;
    }
    const type = this.getParam(params, ix);
    if (type === null) {
      return false;
    }
    this.hand.piece = this.hand.piece.promote(type);
    return true;
  }

  /**
   * capturing pieces
   */
  capture() {
    this.setPiece(this.pos, null);
    this.move.capturePiece(this.pos, this.part);
  }

  /**
   * ends a turn
   * @param {*} params 
   * @param {*} ix 
   */
  end(params, ix) {
    const hand = this.hand;
    this.put();
    this.mode = this.getParam(params, ix);
    if (this.succeed) {
      if (this.mode !== null) {
        const ctx = this.copy();
        this.board.forks.push(ctx);
      } else {
        this.board.moves.push(this.move);
      }
    }
    this.move = this.move.clone(this.part);
    this.hand = hand;
  }
}
