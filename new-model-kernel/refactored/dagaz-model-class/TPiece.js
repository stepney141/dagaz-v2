import { TDesign } from "./TDesign.js";

/**
 * A class representing each piece on the board.
 */
export class TPiece {
  /**
   * @param {number} type - a piece type id
   * @param {number} player - an id of a player who owns the piece
   */
  constructor(type, player) {
    this.type = type;
    this.player = player;
  }

  /**
   * Serializes the piece information into string data
   * @param {TDesign} design - the object describing the game rules
   * @returns {string} human-readable piece information
   */
  toString(design) {
    return design.playerNames[this.player] + " " + design.pieceNames[this.type];
  }

  /**
   * Returns a value of the given piece type, or null (if the specified piece do not exist)
   * @param {number} ix - a piece id
   * @returns {null | number} the piece value
   */
  getValue(ix) {
    if (this.values === undefined) {
      return null;
    }
    if (this.values[ix] === undefined) {
      return null;
    }
    return this.values[ix];
  }

  /**
   * 
   * @param {number} ix 
   * @param {null | number} value 
   * @returns {TPiece}
   */
  setValue(ix, value) {
    const v = this.getValue(ix);

    if ((v === null) && (value === null)) {
      return this;
    }
    if ((v !== null) && (value !== null) && (v == value)) {
      return this;
    }

    const r = new TPiece(this.type, this.player);
    
    if (r.values === undefined) {
      r.values = [];
    }
    if (this.values !== undefined) {
      // _.each(_.keys(this.values), i => {
      //   r.values[i] = this.values[i];
      // });
      r.values = [...this.values]; //shallow copying
    }
    if (value !== null) {
      r.values[ix] = value;
    } else {
      delete r.values[ix];
    }

    return r;
  }

  /**
   * Returns a piece instance promoted to another piece type
   * @param {number} type - a new piece type id
   * @returns {TPiece}
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
   * @returns {TPiece}
   */
  changeOwner(player) {
    if (player == this.player) {
      return this;
    }
    return new TPiece(this.type, player);
  }
}
