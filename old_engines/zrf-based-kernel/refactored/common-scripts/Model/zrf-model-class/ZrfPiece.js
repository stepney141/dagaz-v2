import _ from '../../../../../../dependencies/underscore-esm-min.js';
import { Dagaz } from '../../dagaz.js';

export class ZrfPiece {
  /**
   * Create a piece
   * @param {number} type - the type of the piece (a numeric value indexed from zero)
   * @param {number} player - the owner of the piece
   */
  constructor(type, player) {
    this.type   = type;
    this.player = player;
  }

  toString() {
    return Dagaz.Model.pieceToString(this);
  }

  getType() {
    var design = Dagaz.Model.getDesign();
    return design.pieceNames[this.type];
  }

  getOwner() {
    var design = Dagaz.Model.getDesign();
    return design.playerNames[this.player];
  }

  /**
   * Get an attribute value by specifying an index.
   * If the method returns null, it means no value is found.
   * @param {*} name 
   * @returns 
   */
  getValue(name) {
    if (!_.isUndefined(this.values)) {
      if (!_.isUndefined(this.values[name])) {
        return this.values[name];
      }
    }
    var design = Dagaz.Model.getDesign();
    return design.getAttribute(this.type, name);
  }

  setValue(name, value) {
    if (this.getValue(name) == value) {
      return this;
    }
    var piece = new ZrfPiece(this.type, this.player);
    if (_.isUndefined(piece.values)) {
      piece.values = [];
    }
    if (!_.isUndefined(this.values)) {
      for (var ix = 0; ix < this.values.length; ix++) {
        if (!_.isUndefined(this.values[ix])) {
          piece.values[ix] = this.values[ix];
        }
      }
    }
    piece.values[name] = value;
    return piece;
  }

  /**
   * Change statuses (piece type, piece owner, etc) of a specified piece.
   * @param {*} type 
   * @returns 
   */
  promote(type) {
    return Dagaz.Model.createPiece(type, this.player);
  }

  changeOwner(player) {
    if (this.player == player) {
      return this;
    } else {
      return Dagaz.Model.createPiece(this.type, player);
    }
  }

  flip() {
    var design = Dagaz.Model.getDesign();
    return Dagaz.Model.createPiece(this.type, design.nextPlayer(this.player));
  }
}