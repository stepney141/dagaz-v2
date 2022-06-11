import { games } from "../dagaz-model.js";
import { zUpdate } from "../zobrist.js";
import { TDesign } from "./design.js";
import { TMove } from "./move.js";
import { TMoveContext } from "./move_context.js";
import { TPiece } from "./piece.js";

/**
 * A class representing each game state.
 * This is newly instantiated every time a player makes a move and the game state gets updated.
 */
export class TBoard {
  design: any;
  forks: any;
  lastFrom: any;
  moves: any;
  parent: any;
  pieces: any;
  player: any;
  turn: any;
  z: any;
  /**
   * @param {TDesign} design - a game design object
   */
  constructor(design: any) {
    this.design = design;

    /**
     * A list of pieces on the current board.
     * Each index of this array corresponds to an id of each cell where a piece occupies.
     * @type {Array<TPiece>}
     */
    this.pieces = [];

    /**
     * An id of the current turn corresponding to the player id.
     * @type {number}
     */
    this.turn = 0;

    /**
     * An id of the current player (a player who makes a move in the current turn).
     * @type {number}
     */
    this.player = design.currPlayer(this.turn);

    /**
     * Zobrist hash of the current game state
     * @link https://en.wikipedia.org/wiki/Zobrist_hashing
     * @link https://www.chessprogramming.org/Zobrist_Hashing
     * @type {number}
     */
    this.z = 0;

    /**
     * A list of legal moves available in the current game state.
     * @type {Array<TMove> | null}
     */
    this.moves = null;

    /**
     * A previous game state
     * @type {TBoard | null}
     */
    this.parent = null;

    /** @type {Array<TMoveContext> | null} */
    this.forks = null;

    /**
     * origin square id
     * @link https://www.chessprogramming.org/Origin_Square
     * @type {number | null}
     */
    this.lastFrom = null;
  }

  /**
   * Copies and returns the TBoard instance.
   * @returns {TBoard} a copied board instance
   */
  copy() {
    const r = new TBoard(this.design);
    r.parent = this;
    r.turn = this.turn;
    r.player = this.player;
    r.pieces = [...this.pieces]; //shallow copying
    // for (const p of this.pieces) { // deep copying
    //   const clone = (p === undefined)
    //     ? undefined
    //     : Object.assign(Object.create(Object.getPrototypeOf(p)), p);
    //   r.pieces.push(clone);
    // }
    r.z = this.z;
    return r;
  }

  /**
   * Clears the current board state.
   */
  clear() {
    this.pieces = [];
    this.z = 0;
    this.moves = null;
  }

  /**
   * 
   * @param {number} pos 
   */
  setLastFrom(pos: any) {
    this.lastFrom = pos;
  }

  /**
   *
   * @param {*} pos 
   * @returns {boolean}
   */
  isLastFrom(pos: any) {
    if (this.lastFrom !== undefined) {
      return this.lastFrom == pos;
    }
    return false;
  }

  /**
   * Returns a piece on the given position.
   * @param {number} pos - a position id
   * @returns {null | TPiece} a piece (null if no piece occupies the given position)
   */
  getPiece(pos: any) {
    if (this.pieces[pos] === undefined) {
      return null;
    } else {
      return this.pieces[pos];
    }
  }

  /**
   * Puts a piece to a cell on the board.
   * @param {null | number} pos - a piece position id
   * @param {null | TPiece} piece - a piece
   */
  setPiece(pos: any, piece: any) {
    if (this.pieces[pos] !== undefined) {
      this.z = zUpdate(this.z, this.pieces[pos], pos);
    }
    if (piece === null) {
      this.pieces[pos] = undefined;
    } else {
      this.pieces[pos] = piece;
      this.z = zUpdate(this.z, piece, pos);
    }
  }

  /**
   * 
   * @param {TMoveContext} parent 
   * @returns {boolean}
   */
  completeMove(parent: any) {
    let r = false;

    this.design.movements.forEach((movement: any) => {
      if (movement.t != parent.piece.type) {
        return;
      }
      if (movement.m != parent.mode) {
        return;
      }
      const ctx = parent.copy();
      ctx.hand = {
        start: parent.pos,
        piece: parent.piece
      };
      ctx.mode = null;
      movement.f(ctx, movement.p);
      if (ctx.succeed) {
        r = true;
      }
    });

    return r;
  }

  /**
   * Generates a list of the legal moves from the current game state
   */
  generate() {
    if (this.moves === null && this.design.movements_grouped !== null) {
      this.forks = [];
      this.moves = [];

      // @ts-expect-error ts-migrate(2550) FIXME: Property 'values' does not exist on type 'ObjectCo... Remove this comment to see the full error message
      for (const Movements of Object.values(this.design.movements_grouped)) {
        let completed = false;

        this.design.allPositions().forEach((pos: any) => {
          const piece = this.getPiece(pos);
          if (piece === null) {
            return; // checks the piece existence
          }
          if (!this.design.game_options.sharedPieces && (piece.player != this.player)) {
            return; // checks if the current player can move the piece
          }

          Movements.forEach((movement: any) => {
            if (movement.t != piece.type) {
              return; // searches the movement of a specific piece from the group of the same mode moves
            }

            const ctx = new TMoveContext(this.design, this, pos, piece);
            ctx.move.mode = movement.m;
            ctx.take();
            ctx.setPiece(pos, null);
            movement.f(ctx, movement.p); // executes a method that describes moves
            if (ctx.succeed) {
              completed = true; // finishes the execution
            }
          });
        });

        if (completed) {
          break;
        }
      }

      for (const ctx of this.forks) {
        const f = this.completeMove(ctx) ? false : true;
        if (this.design.game_options.passPartial || f) {
          this.moves.push(ctx.move);
        }
      }

      this.forks = null;

      if ((games.model as any).extension !== undefined) {
        (games.model as any).extension(this);
      }
      if (this.design.game_options.passTurn && (this.moves.length == 0)) {
        this.moves.push(new TMove(0));
      }
    }
  }

  /**
   * Makes a move and creates a new game state.
   * @param {TMove} move 
   * @returns {TBoard}
   */
  apply(move: any) {
    const r = this.copy(); // create a new game state
    r.turn = r.design.nextTurn(this);
    r.player = r.design.currPlayer(r.turn);
    move.applyTo(r); // make a move
    // @ts-expect-error ts-migrate(2551) FIXME: Property 'move' does not exist on type 'TBoard'. D... Remove this comment to see the full error message
    r.move = move;
    return r;
  }
}
