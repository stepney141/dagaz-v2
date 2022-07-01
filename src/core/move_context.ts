import { TBoard } from "./board";
import { TDesign } from "./design";
import { TMove } from "./move";
import { TPiece } from "./piece";

/**
 * A class representing each partial context of one move
 */
export class TMoveContext {
  board: TBoard;
  changes: Array<{ p: number, x: (null | TPiece) }>;
  design: TDesign;
  from: number;
  hand: null | { start: number, piece: (null | TPiece) };
  marks: Array<number>;
  mode: null | number;
  move: TMove;
  parent: null | TMoveContext;
  part: number;
  piece: null | TPiece;
  pos: number;
  succeed: boolean;

  /**
   * @param design - a gane design object
   * @param board - a game state object
   * @param pos - origin square
   * @param piece - a piece that moves on this turn
   */
  constructor(design: TDesign, board: TBoard, pos: number, piece: null | TPiece) {
    this.design = design;
    this.board = board;
    this.from = pos;
    this.pos = pos;
    this.mode = null;
    this.parent = null;
    this.part = 1;
    this.piece = piece;
    this.move = new TMove(this.mode);
    this.succeed = false;
    this.changes = [];
    this.marks = [];
    this.hand = null;
  }

  /**
   * clone itself
   * @returns copied instance
   */
  copy(): TMoveContext {
    const r = new TMoveContext(this.design, this.board, this.pos, this.piece);
    r.parent = this;
    r.part = this.part + 1;
    r.move = this.move.copy();
    r.mode = this.mode;
    return r;
  }

  /**
   * 
   * @param pos 
   * @param piece 
   */
  setPiece(pos: number, piece: null | TPiece) {
    this.changes.push({
      p: pos,
      x: piece
    });
  }

  /**
   * 
   * @param pos 
   * @returns
   */
  getPiece(pos: number): null | TPiece {
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
   * @param params
   * @param ix - index indicating the location of an element to be retrieved from the params array
   * @returns
   */
  getParam<T>(params: undefined | Array<T> | T, ix: number): null | T {
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
   * @param params - list of the directions toward which the piece moves
   * @param ix - index indicating the location of an direction to be retrieved from the params array
   * @returns whether the piece can go toward the given direction from the current location
   */
  go(params: Array<number>, ix: number): boolean {
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
   * @param params 
   * @param ix 
   * @returns
   */
  opposite(params: any, ix: any): null | number {
    const dir = this.getParam(params, ix);
    if (dir === null) {
      return null;
    }
    return this.design.opposite(dir);
  }

  /**
   * 
   * @param params 
   * @param ix 
   * @returns
   */
  isLastFrom(params: any, ix: any): boolean {
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
   * @returns
   */
  isEmpty(): boolean {
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
   * @returns
   */
  isEnemy(): boolean {
    const piece = this.getPiece(this.pos);
    if (piece === null) {
      return false;
    }
    return piece.player != this.board.player;
  }

  /**
   * 
   * @returns
   */
  isFriend(): boolean {
    const piece = this.getPiece(this.pos);
    if (piece === null) {
      return false;
    }
    return piece.player == this.board.player;
  }

  /**
   * 
   * @param params 
   * @param ix 
   * @returns
   */
  isPiece(params: any, ix: any): boolean {
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
   * @param params 
   * @param ix 
   * @returns
   */
  inZone(params: any, ix: any): null | boolean {
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
   * @param params 
   * @param ix 
   * @returns
   */
  promote(params: any, ix: any): boolean {
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
   * @param params 
   * @param ix 
   */
  end(params: any, ix: any) {
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
