import type { TDesign } from "./design";
import type { PieceTypeID, PieceValue, PlayerID } from "../types";

/**
 * A class representing each piece on the board.
 */
export class TPiece {
	player: number;
	type: number;
	values: null | Array<number>;

	/**
	 * @param type - a piece type id
	 * @param player - a player id who owns the piece
	 */
	constructor(type: number, player: number) {
		this.type = type;
		this.player = player;
		this.values = null;
	}

	/**
	 * Serializes the piece information into string data
	 * @param design - the object describing the game rules
	 * @returns human-readable piece details
	 */
	toString(design: TDesign): string {
		return design.playerNames[this.player] + " " + design.pieceNames[this.type];
	}

	/**
	 * Returns a value of the given piece type
	 * @param ix - a piece id
	 * @returns a piece value (null if the specified piece doesn't exist)
	 */
	getValue(ix: number): null | number {
		if (this.values === null) {
			return null;
		}
		if (this.values[ix] === undefined) {
			return null;
		}
		return this.values[ix];
	}

	/**
	 * Sets a value of the piece
	 * @param ix - a piece id
	 * @param new_value - a new value
	 * @returns a piece with an updated value
	 */
	setValue(ix: number, new_value: null | number): TPiece {
		const current_value = this.getValue(ix);

		if ((current_value === null) && (new_value === null)) {
			return this;
		}
		if ((current_value !== null) && (new_value !== null) && (current_value == new_value)) {
			return this;
		}

		const r = new TPiece(this.type, this.player);

		if (r.values === null) {
			r.values = [];
		}
		if (this.values !== null) {
			r.values = [...this.values]; //shallow copying
		}
		if (new_value !== null) {
			r.values[ix] = new_value;
		} else {
			r.values[ix] = undefined;
		}

		return r;
	}

	/**
	 * Returns a piece instance promoted to another piece type.
	 * @param type - a new piece type id
	 * @returns a new piece insatance
	 */
	promote(type: number): TPiece {
		if (type == this.type) {
			return this;
		}
		return new TPiece(type, this.player);
	}

	/**
	 * Returns a piece instance that got changed its owner.
	 * @param player - a new player id
	 * @returns a new piece instance
	 */
	changeOwner(player: number): TPiece {
		if (player == this.player) {
			return this;
		}
		return new TPiece(this.type, player);
	}
}
