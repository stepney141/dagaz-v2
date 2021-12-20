import { TBoard } from "./TBoard.js";
import { TDesign } from "./TDesign.js";
import { TPiece } from "./TPiece.js";

export class TMove {
  /**
   * @param {null | number} mode 
   */
  constructor(mode) {
    /**
     * action[0] from - origin square (the cell where the move starts)  
     * action[1] to - target square (the cell where the move finishes); In a drop move, this parameter should be a cell where the piece is placed on.  
     * action[2] piece - the piece object that a player moves.  
     * action[3] part -   
     * @type {Array<[(null | number), (null | number), (null | TPiece), (null | number)]>>}
     */
    this.actions = [];
    this.mode = mode;
  }

  /**
   * Copies a TMove instance.
   * @returns {TMove}
   */
  copy() {
    const r = new TMove(this.mode);
    this.actions.forEach(a => {
      r.actions.push(a);
    });
    return r;
  }

  /**
   * 
   * @param {number} part 
   * @returns {TMove}
   */
  clone(part) {
    const r = new TMove(this.mode);
    this.actions.forEach(a => {
      if ((a[0] !== null) && (a[1] !== null) && (a[3] == part)) {
        return;
      }
      r.actions.push(a);
    });
    return r;
  }

  /**
   * Converts the moves to human-readable strings.
   * @param {TDesign} design 
   * @returns {string}
   */
  toString(design) {
    let str = "";
    let cell = null;

    for (const a of this.actions) {
      if ((a[0] !== null) && (a[1] !== null)) {
        if ((cell === null) || (cell != a[0])) {
          if (str != "") {
            str = str + " ";
          }
          str = str + design.posToString(a[0]); //convert the start cell to strings
        }
        str = str + "-" + design.posToString(a[1]); //convert the target cell to strings
        cell = a[1];
      }
    }

    return str;
  }

  /**
   * 
   * @returns {boolean}
   */
  isPass() {
    return this.actions.length == 0;
  }

  /**
   * Checks whether the move is a drop move or not.
   * @returns {boolean}
   */
  isDropMove() {
    if (this.actions.length != 1) {
      return false;
    }
    return (this.actions[0][0] === null) && (this.actions[0][1] !== null) && (this.actions[0][2] !== null);
  }

  /**
   * Checks whether the move is a "simple move" or not.
   * e.g. When a player just moves his/her piece from a current cell to another one, the move is a simple move.
   * @returns {boolean}
   */
  isSimpleMove() {
    if (this.actions.length != 1) {
      return false;
    }
    return (this.actions[0][0] !== null) && (this.actions[0][1] !== null);
  }

  /**
   * Called when the move is a piece-transferring move.
   * @param {number} from 
   * @param {number} to 
   * @param {null | TPiece} piece 
   * @param {number=} [part=1]
   */
  movePiece(from, to, piece, part = 1) {
    this.actions.push([from, to, piece, part]);
  }

  /**
   * Called when the move is a piece-capturing move.
   * @param {number} from 
   * @param {number=} [part=1]
   */
  capturePiece(from, part = 1) {
    this.actions.push([from, null, null, part]);
  }

  /**
   * Called when the move is a piece-dropping move.
   * @param {*} to 
   * @param {*} piece 
   * @param {number=} [part=1]
   */
  dropPiece(to, piece, part = 1) {
    this.actions.push([null, to, piece, part]);
  }

  /**
   * Updates the current board state with the move.
   * @param {TBoard} obj 
   */
  applyTo(obj) {
    this.actions.forEach(a => {
      if (a[0] !== null) {
        obj.setPiece(a[0], null); //make empty the start cell
      }
      if ((a[1] !== null) && (a[2] !== null)) {
        obj.setPiece(a[1], a[2]); //put a piece on the goal cell
      }
      if ((a[0] !== null) && (a[1] !== null) && (obj.setLastFrom !== undefined)) {
        obj.setLastFrom(a[0]);
      }
    });
  }
}
