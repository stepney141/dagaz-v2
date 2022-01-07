import _ from "../../../dependencies/underscore-esm-min.js";
import { games } from "../dagaz-model.js";
import { TMove } from "./TMove.js";
import { TMoveContext } from "./TMoveContext.js";
import { TPiece } from "./TPiece.js";
import { TDesign } from "./TDesign.js";
import { zUpdate } from "../zobrist.js";

/**
 * A class representing each game state.
 * This is newly instantiated every time a player makes a move and the game state gets updated.
 */
export class TBoard {
  /**
   * @param {TDesign} design - a game design object
   */
  constructor(design) {
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

    /** @type {nulber | null} */
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
    // _.each(_.keys(this.pieces), pos => {
    //   r.pieces[pos] = this.pieces[pos];
    // });
    r.pieces = [...this.pieces]; //shallow copying
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
  setLastFrom(pos) {
    this.lastFrom = pos; 
  }

  /**
   *
   * @param {*} pos 
   * @returns {boolean}
   */
  isLastFrom(pos) {
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
  getPiece(pos) {
    if (this.pieces[pos] === undefined) {
      return null;
    } else {
      return this.pieces[pos];
    }
  }

  /**
   * Puts a piece to a cell on the board.
   * @param {null | number} pos - a piece position id
   * @param {null | TPiece} piece - a piece type id
   */
  setPiece(pos, piece) {
    if (this.pieces[pos] !== undefined) {
      this.z = zUpdate(this.z, this.pieces[pos], pos);
    }
    if (piece === null) {
      delete this.pieces[pos];
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
  completeMove(parent) {
    let r = false;
    this.design.moves.forEach(t => {
      if (t.t != parent.piece.type) {
        return;
      }
      if (t.m != parent.mode) {
        return;
      }
      const ctx = parent.copy();
      ctx.hand = {
        start: parent.pos,
        piece: parent.piece
      };
      ctx.mode = null;
      t.f(ctx, t.p);
      if (ctx.succeed) {
        r = true;
      }
    });
    return r;
  }

  /**
   * Generates a list of legal moves and store it in the board instance.
   */
  generate() {
    if (this.moves === null) {
      this.forks = [];
      this.moves = [];

      /** 
       * @typedef {Object} move 
       * @property {number} t - piece type id
       * @property {(ctx: TMoveContext, params: *) => *} f - function
       * @property {Array<number>} p - params 
       * @property {number} m - move mode 
       * @property {*} s - sound 
       */
      /** @type {Object<number, Array<move>> }} */
      const groups = _.groupBy(this.design.moves, move => {
        if (this.design.modes.length == 0) {
          return 0;
        }
        return this.design.modes.indexOf(move.m);
      });

      let cnt = this.design.modes.length;
      if (cnt == 0) {
        cnt = 1;
      }

      for (let i = 0; i < cnt; i++) {
        let completed = false;
        this.design.allPositions().forEach(pos => {
          const piece = this.getPiece(pos);
          if (piece === null) {
            return;
          }
          if (!this.design.game_options.sharedPieces && (piece.player != this.player)) {
            return;
          }
          groups[i].forEach(move => {
            if (move.t != piece.type) {
              return;
            }
            const ctx = new TMoveContext(this.design, this, pos, piece);
            ctx.move.mode = move.m;
            ctx.take();
            ctx.setPiece(pos, null);
            move.f(ctx, move.p);
            if (ctx.succeed) {
              completed = true;
            }
          });
        });
        if (completed) {
          break;
        }
      }

      for (const ctx of this.forks) {
        let f = true;
        if (this.completeMove(ctx)) {
          f = false;
        }
        if (this.design.game_options.passPartial || f) {
          this.moves.push(ctx.move);
        }
      }

      this.forks = null;
      
      if (games.model.extension !== undefined) {
        games.model.extension(this);
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
  apply(move) {
    const r = this.copy(); //create a new game state
    r.turn = r.design.nextTurn(this);
    r.player = r.design.currPlayer(r.turn);
    move.applyTo(r); // make a move
    r.move = move;
    return r;
  }
}
