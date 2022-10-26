import { TMove } from "./move";
import { TMoveContext } from "./move_context";
import { zUpdate } from "./../zobrist";
import type { From, LocationID, PlayerID } from "./../types";
import type { TDesign } from "./design";
import type { TPiece } from "./piece";

/**
 * A game state.
 * This is newly instantiated every time a player makes a move and the game state gets updated.
 */
export class TBoard {
    design: TDesign;
    forks: TMoveContext[] | null;
    lastFrom: From;
    legalMoves: TMove[] | null;
    lastlyMadeMove: TMove | null;
    parent: TBoard | null;
    pieces: TPiece[];
    player: PlayerID;
    turn: number;
    z: number;

    /**
     * @param design - a game design object
     */
    constructor(design: TDesign) {
        this.design = design;

        /**
         * A list of pieces on the current board.
         * Each index of this array corresponds to an id of each location where a piece occupies.
         */
        this.pieces = [];

        /**
         * An id of the current turn corresponding to the player id.
         */
        this.turn = 0;

        /**
         * An id of the current player (a player who makes a move in the current turn).
         */
        this.player = design.getCurrentPlayer(this.turn);

        /**
         * Zobrist hash of the current game state
         * @link https://en.wikipedia.org/wiki/Zobrist_hashing
         * @link https://www.chessprogramming.org/Zobrist_Hashing
         */
        this.z = 0;

        /**
         * A list of legal moves available in the current game state.
         */
        this.legalMoves = null;

        /**
         * The last-made move
         */
        this.lastlyMadeMove = null;

        /**
         * The previous game state
         */
        this.parent = null;

        this.forks = null;

        /**
         * origin square id
         * @link https://www.chessprogramming.org/Origin_Square
         */
        this.lastFrom = null;
    }

    /**
     * Copy the TBoard instance.
     * @returns a copied board instance
     */
    copy(): TBoard {
        const r = new TBoard(this.design);
        r.parent = this;
        r.turn = this.turn;
        r.player = this.player;
        r.pieces = [...this.pieces]; //shallow copying
        r.z = this.z;
        return r;
    }

    /**
     * Clear the current board state.
     */
    clear() {
        this.pieces = [];
        this.z = 0;
        this.legalMoves = null;
    }

    /**
     * Set the origin square (the location where the move starts)
     * @param loc 
     */
    setLastFrom(loc: LocationID) {
        this.lastFrom = loc;
    }

    /**
     * Check if a location is the origin square (the location where the move starts)
     * @param loc 
     * @returns
     */
    isLastFrom(loc: LocationID): boolean {
        if (this.lastFrom !== undefined) {
            return this.lastFrom == loc;
        }
        return false;
    }

    /**
     * Return a piece on the given location.
     * @param loc - a location id
     * @returns a piece (null if no piece occupies the given location)
     */
    getPiece(loc: LocationID): null | TPiece {
        if (this.pieces[loc] === undefined) {
            return null;
        } else {
            return this.pieces[loc];
        }
    }

    /**
     * Put a piece to a location on the board.
     * @param loc - a piece location id
     * @param piece - a piece
     */
    setPiece(loc: null | LocationID, piece: null | TPiece) {
        if (this.pieces[loc] !== undefined) {
            this.z = zUpdate(this.z, this.pieces[loc], loc);
        }
        if (piece === null) {
            this.pieces[loc] = undefined;
        } else {
            this.pieces[loc] = piece;
            this.z = zUpdate(this.z, piece, loc);
        }
    }

    /**
     * Check if a chain of move contexts is completed as a legal move
     * @param parent 
     * @returns
     */
    isCompleteMove(parent: TMoveContext): boolean {
        let r = false;

        for (const movement of this.design.movements) {
            if (movement.pieceType != parent.piece.type) {
                continue;
            }
            if (movement.mode != parent.mode) {
                continue;
            }
            const ctx = parent.copy();
            ctx.hand = {
                start: parent.loc,
                piece: parent.piece
            };
            ctx.mode = null;
            movement.func(ctx, movement.params);
            if (ctx.succeed) {
                r = true;
            }
        }

        return r;
    }

    /**
     * Generate a list of the legal moves from the current game state
     */
    generateMoves() {
        if (this.legalMoves === null && this.design.groupedMovements !== null) {
            this.forks = [];
            this.legalMoves = [];

            for (const Movements of Object.values(this.design.groupedMovements)) {
                let completed = false;

                for (const loc of this.design.allLocations()) { // looks into every location
                    const piece = this.getPiece(loc);
                    if (piece === null) {
                        continue; // check if the piece exists on the location
                    }
                    if (!this.design.gameOptions['shared-pieces'] && (piece.player != this.player)) {
                        continue; // check if the current player can move the piece
                    }

                    for (const movement of Movements) {
                        if (movement.pieceType != piece.type) {
                            continue; // search a specific movement from the group of moves that have the same mode
                        }

                        const ctx = new TMoveContext(this.design, this, loc, piece);
                        ctx.move.mode = movement.mode; // set move modes to a TMove instance
                        ctx.take();
                        ctx.setPiece(loc, null);
                        movement.func(ctx, movement.params); // execute a move definition method
                        if (ctx.succeed) {
                            completed = true; // finish the execution
                        }
                    }
                }

                if (completed) {
                    break;
                }
            }

            for (const ctx of this.forks) {
                const f = this.isCompleteMove(ctx) ? false : true; // check if the chain of move contexts is completed as a legal move
                if (this.design.gameOptions['pass-partial'] || f) {
                    this.legalMoves.push(ctx.move);
                }
            }

            this.forks = null;

            // execute "invariant" modules to generate additional legal moves that cannot be described as TMoveContext
            this.design.plugins
                .filter(plugin => plugin.name == "extension")
                .forEach(plugin => plugin.func(this));

            if (this.design.gameOptions['pass-turn'] && (this.legalMoves.length == 0)) {
                this.legalMoves.push(new TMove(0));
            }
        }
    }

    /**
     * Make a move and creates a new game state.
     * @param move 
     * @returns
     */
    makeMove(move: TMove): TBoard {
        const r = this.copy(); // create a new game state
        r.turn = r.design.getNextTurn(this); // set next turn
        r.player = r.design.getCurrentPlayer(r.turn); // set the next player
        move.applyTo(r); // make a move
        r.lastlyMadeMove = move;
        return r;
    }
}
