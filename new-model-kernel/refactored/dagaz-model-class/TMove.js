import { TBoard } from "./TBoard.js";

export class TMove {
  /**
   * 
   * @param {number} mode 
   */
  constructor(mode) {
    /** @type {Array<Array<(null | number)>>} */
    this.actions = [];
    this.mode = mode;
  }

  /**
   * Copies a TMove instance
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
   * 
   * @param {*} design 
   * @returns {string}
   */
  toString(design) {
    let r = "";
    let p = null;

    for (const a of this.actions) {
      if ((a[0] !== null) && (a[1] !== null)) {
        if ((p === null) || (p != a[0])) {
          if (r != "") {
            r = r + " ";
          }
          r = r + design.posToString(a[0]);
        }
        r = r + "-" + design.posToString(a[1]);
        p = a[1];
      }
    }

    return r;
  }

  /**
   * 
   * @returns {boolean}
   */
  isPass() {
    return this.actions.length == 0;
  }

  /**
   * 
   * @returns {boolean}
   */
  isDropMove() {
    if (this.actions.length != 1) {
      return false;
    }
    return (this.actions[0][0] === null) && (this.actions[0][1] !== null) && (this.actions[0][2] !== null);
  }

  /**
   * 
   * @returns {boolean}
   */
  isSimpleMove() {
    if (this.actions.length != 1) {
      return false;
    }
    return (this.actions[0][0] !== null) && (this.actions[0][1] !== null);
  }

  /**
   * 
   * @param {number} from 
   * @param {number} to 
   * @param {null | TPiece} piece 
   * @param {number=} [part=1]
   */
  movePiece(from, to, piece, part = 1) {
    this.actions.push([from, to, piece, part]);
  }

  /**
   * 
   * @param {number} from 
   * @param {number=} [part=1]
   */
  capturePiece(from, part = 1) {
    this.actions.push([from, null, null, part]);
  }

  /**
   * 
   * @param {*} to 
   * @param {*} piece 
   * @param {number=} [part=1]
   */
  dropPiece(to, piece, part = 1) {
    this.actions.push([null, to, piece, part]);
  }

  /**
   * 
   * @param {TBoard} obj 
   */
  applyTo(obj) {
    this.actions.forEach(a => {
      if (a[0] !== null) {
        obj.setPiece(a[0], null);
      }
      if ((a[1] !== null) && (a[2] !== null)) {
        obj.setPiece(a[1], a[2]);
      }
      if ((a[0] !== null) && (a[1] !== null) && (obj.setLastFrom !== undefined)) {
        obj.setLastFrom(a[0]);
      }
    });
  }
}
