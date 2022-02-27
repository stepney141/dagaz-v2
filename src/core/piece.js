import { TDesign } from "./design.js";

/**
 * A class representing each piece on the board.
 */
export class TPiece {
  /**
   * @param {number} type - a piece type id
   * @param {number} player - a player id who owns the piece
   */
  constructor(type, player) {
    this.type = type;
    this.player = player;

    /** @type {null | Array<number>} */
    this.values = null;
  }

  /**
   * Serializes the piece information into string data
   * @param {TDesign} design - the object describing the game rules
   * @returns {string} human-readable piece details
   */
  toString(design) {
    return design.playerNames[this.player] + " " + design.pieceNames[this.type];
  }

  /**
   * Returns a value of the given piece type
   * @param {number} ix - a piece id
   * @returns {null | number} a piece value (null if the specified piece doesn't exist)
   */
  getValue(ix) {
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
   * @param {number} ix - a piece id
   * @param {null | number} new_value - a new value
   * @returns {TPiece}
   */
  setValue(ix, new_value) {
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
   * @param {number} type - a new piece type id
   * @returns {TPiece} a new piece insatance
   */
  promote(type) {
    if (type == this.type) {
      return this;
    }
    return new TPiece(type, this.player);
  }

  /**
   * Returns a piece instance that got changed its owner.
   * @param {number} player - a new player id
   * @returns {TPiece} a new piece instance
   */
  changeOwner(player) {
    if (player == this.player) {
      return this;
    }
    return new TPiece(this.type, player);
  }
}
