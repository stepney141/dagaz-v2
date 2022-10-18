import type { TBoard } from "./board";
import type { TPiece } from "./piece";
import type { TDesign } from "./design";
import type { PositionID, MoveModeID } from "../types";

type From = null | number;
type To = null | number;
type Piece = null | TPiece;
type Part = null | number;

/**
 * action[0] from - origin square id (the cell where the move starts); null for drop moves.
 * action[1] to - target square id (the cell where the move finishes); null for capture moves.
 * action[2] piece - the piece object that a player moves.  
 * action[3] part - the number of partial moves; this is used in checkers-like games
 */
type MoveAction = Array<[From, To, Piece, Part]>;

export class TMove {
	actions: MoveAction;
	mode: null | number;

	/**
	 * @param mode 
	 */
	constructor(mode: null | number) {
		this.actions = [];
		this.mode = mode;
	}

	/**
	 * Copies a TMove instance.
	 * @returns a new move instance
	 */
	copy(): TMove {
		const r = new TMove(this.mode);
		r.actions = [...this.actions]; //shallow copying
		return r;
	}

	/**
	 * 
	 * @param part 
	 * @returns
	 */
	clone(part: number): TMove {
		const r = new TMove(this.mode);
		const filtered_actions = this.actions.filter(a => {
			return (a[0] === null) || (a[1] === null) || (a[3] !== part);
		});
		r.actions = [...filtered_actions]; //shallow copying
		return r;
	}

	/**
	 * Converts the moves to human-readable strings.
	 * @param design - game design
	 * @returns human-readable notations of the move
	 */
	toString(design: TDesign): string {
		let str = "";
		let cell = null;

		for (const a of this.actions) {
			if ((a[0] !== null) && (a[1] !== null)) {
				if ((cell === null) || (cell != a[0])) {
					if (str != "") {
						str = str + " ";
					}
					str = `${str}${design.posToString(a[0])}`; //convert the start cell to strings
				}
				str = `${str}-${design.posToString(a[1])}`; //convert the target cell to strings
				cell = a[1];
			}
		}

		return str;
	}

	/**
	 * 
	 * @returns
	 */
	isPass(): boolean {
		return this.actions.length == 0;
	}

	/**
	 * Checks whether the move is a drop move or not.
	 * @returns
	 */
	isDropMove(): boolean {
		if (this.actions.length != 1) {
			return false;
		}
		return (this.actions[0][0] === null) && (this.actions[0][1] !== null) && (this.actions[0][2] !== null);
	}

	/**
	 * Checks whether the move is a "quiet move" or not;
	 * when a player just moves his/her piece without attacking or capturing an enemy piece, the move is a quiet move.
	 * @link https://www.chessprogramming.org/Quiet_Moves
	 * @link https://en.wikipedia.org/wiki/Glossary_of_chess#quiet_move
	 * @returns
	 */
	isQuietMove(): boolean {
		if (this.actions.length != 1) {
			return false;
		}
		return (this.actions[0][0] !== null) && (this.actions[0][1] !== null);
	}

	/**
	 * Called when the move is a piece-transferring move.
	 * @param from 
	 * @param to 
	 * @param piece 
	 * @param part
	 */
	movePiece(from: From, to: To, piece: Piece, part: Part = 1) {
		this.actions.push([from, to, piece, part]);
	}

	/**
	 * Called when the move is a piece-capturing move.
	 * @param from 
	 * @param part
	 */
	capturePiece(from: From, part: Part = 1) {
		this.actions.push([from, null, null, part]);
	}

	/**
	 * Called when the move is a piece-dropping move.
	 * @param to 
	 * @param piece 
	 * @param part
	 */
	dropPiece(to: To, piece: Piece, part: Part = 1) {
		this.actions.push([null, to, piece, part]);
	}

	/**
	 * Updates the current board state with the move.
	 * @param board
	 */
	applyTo(board: TBoard) {
		for (const a of this.actions) {
			if (a[0] !== null) {
				board.setPiece(a[0], null); //make empty the start cell
			}
			if ((a[1] !== null) && (a[2] !== null)) {
				board.setPiece(a[1], a[2]); //put a piece on the goal cell
			}
			if ((a[0] !== null) && (a[1] !== null)) {
				board.setLastFrom(a[0]);
			}
		}
	}
}
