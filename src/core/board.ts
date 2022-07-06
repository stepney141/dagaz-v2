import { games } from "./../dagaz-model";
import type { Movement, PositionID } from "./../types";
import { TDesign } from "./design";
import { TMove } from "./move";
import { TMoveContext } from "./move_context";
import { TPiece } from "./piece";
import { zUpdate } from "./../zobrist";

/**
 * A class representing each game state.
 * This is newly instantiated every time a player makes a move and the game state gets updated.
 */
export class TBoard {
  design: TDesign;
  forks: TMoveContext[] | null;
  last_from: PositionID | null;
  legal_moves: TMove[] | null;
  made_move: TMove | null;
  parent: TBoard | null;
  pieces: TPiece[];
  player: number;
  turn: number;
  z: number;

  /**
   * @param design - a game design object
   */
  constructor(design: TDesign) {
    this.design = design;

    /**
     * A list of pieces on the current board.
     * Each index of this array corresponds to an id of each cell where a piece occupies.
     */
    this.pieces = [];

    /**
     * An id of the current turn corresponding to the player id.
     */
    this.turn = 0;

    /**
     * An id of the current player (a player who makes a move in the current turn).
     */
    this.player = design.currPlayer(this.turn);

    /**
     * Zobrist hash of the current game state
     * @link https://en.wikipedia.org/wiki/Zobrist_hashing
     * @link https://www.chessprogramming.org/Zobrist_Hashing
     */
    this.z = 0;

    /**
     * A list of legal moves available in the current game state.
     */
    this.legal_moves = null;

    /**
     * A move that connects the current game state and the parent node of the game tree
     */
    this.made_move = null;

    /**
     * A previous game state
     */
    this.parent = null;

    this.forks = null;

    /**
     * origin square id
     * @link https://www.chessprogramming.org/Origin_Square
     */
    this.last_from = null;
  }

  /**
   * Copies and returns the TBoard instance.
   * @returns a copied board instance
   */
  copy(): TBoard {
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
    this.legal_moves = null;
  }

  /**
   * 
   * @param pos 
   */
  setLastFrom(pos: number) {
    this.last_from = pos;
  }

  /**
   *
   * @param pos 
   * @returns
   */
  isLastFrom(pos: number): boolean {
    if (this.last_from !== undefined) {
      return this.last_from == pos;
    }
    return false;
  }

  /**
   * Returns a piece on the given position.
   * @param pos - a position id
   * @returns a piece (null if no piece occupies the given position)
   */
  getPiece(pos: number): null | TPiece {
    if (this.pieces[pos] === undefined) {
      return null;
    } else {
      return this.pieces[pos];
    }
  }

  /**
   * Puts a piece to a cell on the board.
   * @param pos - a piece position id
   * @param piece - a piece
   */
  setPiece(pos: null | number, piece: null | TPiece) {
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
   * @param parent 
   * @returns
   */
  completeMove(parent: TMoveContext): boolean {
    let r = false;

    this.design.movements.forEach((movement: Movement) => {
      if (movement.pieceType != parent.piece.type) {
        return;
      }
      if (movement.mode != parent.mode) {
        return;
      }
      const ctx = parent.copy();
      ctx.hand = {
        start: parent.pos,
        piece: parent.piece
      };
      ctx.mode = null;
      movement.func(ctx, movement.params);
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
    if (this.legal_moves === null && this.design.movements_grouped !== null) {
      this.forks = [];
      this.legal_moves = [];

      for (const Movements of Object.values(this.design.movements_grouped)) {
        let completed = false;

        this.design.allPositions().forEach(pos => {
          const piece = this.getPiece(pos);
          if (piece === null) {
            return; // checks the piece existence
          }
          if (!this.design.game_options.sharedPieces && (piece.player != this.player)) {
            return; // checks if the current player can move the piece
          }

          Movements.forEach((movement: Movement) => {
            if (movement.pieceType != piece.type) {
              return; // searches the movement of a specific piece from the group of the same mode moves
            }

            const ctx = new TMoveContext(this.design, this, pos, piece);
            ctx.move.mode = movement.mode;
            ctx.take();
            ctx.setPiece(pos, null);
            movement.func(ctx, movement.params); // executes a method that describes moves
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
          this.legal_moves.push(ctx.move);
        }
      }

      this.forks = null;

      if (games.model.extension !== undefined) {
        games.model.extension(this);
      }
      if (this.design.game_options.passTurn && (this.legal_moves.length == 0)) {
        this.legal_moves.push(new TMove(0));
      }
    }
  }

  /**
   * Makes a move and creates a new game state.
   * @param move 
   * @returns
   */
  apply(move: TMove): TBoard {
    const r = this.copy(); // create a new game state
    r.turn = r.design.nextTurn(this);
    r.player = r.design.currPlayer(r.turn);
    move.applyTo(r); // make a move
    r.made_move = move;
    return r;
  }
}
