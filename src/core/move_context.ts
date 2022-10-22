import { TMove } from "./move";
import type { TBoard } from "./board";
import type { TDesign } from "./design";
import type { TPiece } from "./piece";
import type { Part, DirectionID, PositionID, PieceTypeID } from './../types';

/**
 * A partial move context
 */
export class TMoveContext {
    board: TBoard;
    changes: Array<{ p: PositionID, x: (null | TPiece) }>;
    design: TDesign;
    from: number;
    hand: null | { start: PositionID, piece: (null | TPiece) };
    marks: Array<number>;
    mode: null | number;
    move: TMove;
    parent: null | TMoveContext;
    part: Part;
    piece: null | TPiece;
    pos: PositionID;
    succeed: boolean;

    /**
     * @param design - a gane design object
     * @param board - a game state object
     * @param pos - origin square (the last square that the moving piece passed through)
     * @param piece - a piece that moves on this turn
     */
    constructor(design: TDesign, board: TBoard, pos: PositionID, piece: null | TPiece) {
        this.design = design;
        this.board = board;

        /**
         * origin square; the last location that the moving piece passed through
         */
        this.from = pos;

        /** 
         * temporary location of the moving piece
         */
        this.pos = pos;
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
        this.move = new TMove(this.mode);
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
    setPiece(pos: PositionID, piece: null | TPiece) {
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
    getPiece(pos: PositionID): null | TPiece {
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
     * Record the moving piece and its origin square
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
    getParam<T>(params: T | Array<T>, ix: number | undefined): null | T {
        if (params === undefined) {
            return null;
        }
        if (Array.isArray(params)) {
            return params[ix];
        }
        return params;
    }

    /**
     * Check whether the target square is not occupied
     * (i.e. whether the piece can move toward the given direction from the current location)
     * @param params - direction that the piece can move toward
     * @param ix - params array index of the direction that the piece will move toward
     */
    go(params: Array<DirectionID>, ix: number): boolean {
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
        this.pos = new_p; // update the piece location
        return true;
    }

    /**
     * 
     * @param params 
     * @param ix 
     * @returns
     */
    opposite(params: number, ix: number): null | number {
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
    isLastFrom(params?: number, ix?: number): boolean {
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
     * Check whether the target square of the piece is empty or not
     */
    isEmpty(): boolean {
        if (this.design.gameOptions['deferred-captures']) {
            for (const a of this.move.actions) {
                if (
                    (a[0] !== null) // the move is NOT a piece-dropping move
                    && (a[1] === null) // the move is a piece-capturing move
                    && (a[0] == this.pos)
                ) {
                    return false;
                }
            }
        }
        return this.getPiece(this.pos) === null;
    }

    /**
     * Check whether an enemy piece is on the given square or not
     */
    isEnemy(): boolean {
        const piece = this.getPiece(this.pos);
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
    isPiece(params: number, ix?: number): boolean {
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
     * Check if the piece is in the specified zone
     * @param params 
     * @param ix 
     */
    inZone(params: number, ix?: number): null | boolean {
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
     * Make the current piece promote to another piece of the given type
     * @param params 
     * @param ix 
     * @returns whether the current piece can promote to the given piece type or not
     */
    promote(params: PieceTypeID, ix?: number): boolean {
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
     * capture a piece on the passing square
     */
    capture() {
        this.setPiece(this.pos, null); // take an existing piece off the square
        this.move.capturePiece(this.pos, this.part); // capture the piece
    }

    /**
     * Finish the context of the current move
     * @param params 
     * @param ix 
     */
    end(params?: number, ix?: number) {
        const hand = this.hand;
        this.put();
        this.mode = this.getParam(params, ix);

        if (this.succeed) {
            if (this.mode !== null) {
                const ctx = this.copy();
                this.board.forks.push(ctx);
            } else {
                this.board.legalMoves.push(this.move);
            }
        }

        this.move = this.move.clone(this.part);
        this.hand = hand;
    }
}
