/**
 * internal DSL to describe piece movements
 * @module move_context
 */

import { capturePiece, cloneMove, copyMove, movePiece } from "./move";
import { promotePiece } from "./piece";

import type { TBoard } from "./board";
import type { TDesign } from "./design";
import type { ZoneID, MoveModeID, TPiece, TMove, Part, DirectionID, LocationID, PieceTypeID } from "./types";

/**
 * @param params
 * @param ix - index indicating the location of an element to be retrieved from the params array
 */
function getParam<T>(params: T | Array<T>, ix: number | undefined): null | T {
  if (params === undefined) {
    return null;
  }
  if (Array.isArray(params)) {
    return params[ix];
  }
  return params;
}

/**
 * A partial move context
 */
export class TMoveContext {
  board: TBoard;
  changes: Array<{ loc: LocationID; piece: null | TPiece }>;
  design: TDesign;
  from: number;
  hand: null | { start: LocationID; piece: null | TPiece };
  marks: Array<number>;
  mode: null | number;
  move: TMove;
  parent: null | TMoveContext;
  part: Part;
  piece: null | TPiece;
  loc: LocationID;
  succeed: boolean;

  /**
   * @param design - a gane design object
   * @param board - a game state object
   * @param loc - origin square (the last square that the moving piece passed through)
   * @param piece - a piece that moves on this turn
   */
  constructor(design: TDesign, board: TBoard, loc: LocationID, piece: null | TPiece) {
    this.design = design;
    this.board = board;

    /**
     * origin square; the last location that the moving piece passed through
     */
    this.from = loc;

    /**
     * temporary location of the moving piece
     */
    this.loc = loc;
    this.mode = null;
    this.parent = null;

    /**
     * 駒の取り方と関係があるなにか
     */
    this.part = 1;

    /**
     * the moving piece
     */
    this.piece = piece;
    this.move = {
      actions: [],
      mode: this.mode
    };
    this.succeed = false;
    this.changes = [];
    this.marks = [];

    /**
     * piece and its origin square
     */
    this.hand = null;
  }

  /**
   * Clone itself
   * @returns copied instance
   */
  copy(): TMoveContext {
    const r = new TMoveContext(this.design, this.board, this.loc, this.piece);
    r.parent = this;
    r.part = this.part + 1;
    r.move = copyMove(this.move);
    r.mode = this.mode;
    return r;
  }

  /**
   *
   * @param loc
   * @param piece
   */
  setPiece(loc: LocationID, piece: null | TPiece) {
    this.changes.push({ loc, piece });
  }

  /**
   *
   * @param loc
   * @returns
   */
  getPiece(loc: LocationID): null | TPiece {
    for (const elem of this.changes) {
      if (elem.loc == loc) {
        return elem.piece;
      }
    }
    if (this.parent !== null) {
      return this.parent.getPiece(loc);
    }
    return this.board.getPiece(loc);
  }

  mark() {
    this.marks.push(this.loc);
  }

  back() {
    if (this.marks.length > 0) {
      this.loc = this.marks[this.marks.length - 1];
    }
  }

  pop() {
    if (this.marks.length > 0) {
      this.loc = this.marks.pop();
    }
  }

  /**
   * Record the moving piece and its origin square
   */
  take() {
    this.hand = {
      start: this.loc,
      piece: this.board.getPiece(this.loc)
    };
  }

  put() {
    if (this.hand !== null) {
      this.piece = this.hand.piece;
      movePiece(this.move, {
        originSquare: this.hand.start,
        targetSquare: this.loc,
        piece: this.hand.piece,
        part: this.part
      });
      this.hand = null;
      this.succeed = true;
    }
  }

  /**
   * Check whether the target square is not occupied
   * (i.e. whether the piece can move toward the given direction from the current location)
   * @param params - direction that the piece can move toward
   * @param ix - params array index of the direction that the piece will move toward
   */
  canGoTo(params: Array<DirectionID>, ix: number): boolean {
    const dir = getParam(params, ix);
    if (dir === null) {
      return false;
    }
    let player = this.board.player;
    if (this.hand !== null) {
      player = this.hand.piece.player;
    }
    const new_loc = this.design.navigate(player, this.loc, dir);
    if (new_loc === null) {
      return false;
    }
    this.loc = new_loc; // update the piece location
    return true;
  }

  /**
   *
   * @param params
   * @param ix
   * @returns
   */
  opposite(params: number, ix: number): null | number {
    const dir = getParam(params, ix);
    if (dir === null) {
      return null;
    }
    return this.design.getDirectionFromPlayer(dir);
  }

  /**
   *
   * @param params
   * @param ix
   * @returns
   */
  isLastFrom(params?: number, ix?: number): boolean {
    let loc = getParam(params, ix);
    if (loc === null) {
      loc = this.loc;
    }
    if (this.parent !== null && this.parent.parent !== null) {
      if (loc == this.parent.parent.from) {
        return true;
      }
    }
    return this.board.isLastFrom(loc);
  }

  /**
   * Check whether the target square of the piece is empty or not
   */
  isEmpty(): boolean {
    if (this.design.gameOptions["deferred-captures"]) {
      for (const a of this.move.actions) {
        if (
          a.originSquare !== null && // the move is NOT a piece-dropping move
          a.targetSquare === null && // the move is a piece-capturing move
          a.originSquare == this.loc
        ) {
          return false;
        }
      }
    }
    return this.getPiece(this.loc) === null;
  }

  /**
   * Check whether an enemy piece is on the given square or not
   */
  isEnemy(): boolean {
    const piece = this.getPiece(this.loc);
    if (piece === null) {
      return false;
    }
    return piece.player != this.board.player;
  }

  /**
   * Check whether a piece is mine
   * @returns
   */
  isFriend(): boolean {
    const piece = this.getPiece(this.loc);
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
  isPiece(params: number, ix?: number): boolean {
    const t = getParam(params, ix);
    if (t === null) {
      return !this.isEmpty();
    }
    const piece = this.getPiece(this.loc);
    if (piece === null) {
      return false;
    }
    return piece.type == t;
  }

  /**
   * Check if the piece is in the specified zone
   * @param params
   * @param ix
   */
  inZone(params: ZoneID, ix?: number): null | boolean {
    const zone = getParam(params, ix);
    if (zone === null) {
      return null;
    }
    let player = this.board.player;
    if (this.hand !== null) {
      player = this.hand.piece.player;
    }
    return this.design.isInZone(player, this.loc, zone);
  }

  /**
   * Make the current piece promote to another piece of the given type
   * @param params
   * @param ix
   * @returns whether the current piece can promote to the given piece type or not
   */
  promote(params: PieceTypeID, ix?: number): boolean {
    if (this.hand === null) {
      return false;
    }
    const type = getParam(params, ix);
    if (type === null) {
      return false;
    }
    this.hand.piece = promotePiece(this.hand.piece, type);
    return true;
  }

  /**
   * capture a piece on the passing square
   */
  capture() {
    this.setPiece(this.loc, null); // take an existing piece off the square
    capturePiece(this.move, {
      originSquare: this.loc,
      part: this.part
    }); // capture the piece
  }

  /**
   * Finish the context of the current move
   * @param params
   * @param ix
   */
  endMove(params?: MoveModeID, ix?: number) {
    const hand = this.hand;
    this.put();
    this.mode = getParam(params, ix);

    if (this.succeed) {
      if (this.mode !== null) {
        const ctx = this.copy();
        this.board.forks.push(ctx);
      } else {
        this.board.legalMoves.push(this.move);
      }
    }

    this.move = cloneMove(this.move, this.part);
    this.hand = hand;
  }
}
