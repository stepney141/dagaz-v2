import type { TBoard } from "./board";
import type { TPiece } from "./piece";
import type { TDesign } from "./design";
import type { From, To, Part, MoveAction, MoveModeID } from "../types";

export class TMove {
  actions: MoveAction[];
  mode: null | MoveModeID;

  /**
   * @param mode 
   */
  constructor(mode: null | MoveModeID) {
    this.actions = [];
    this.mode = mode;
  }

  /**
   * Copy itself.
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
    const filtered_actions = this.actions.filter(a =>
      (a.originSquare === null) //search drop moves
      || (a.targetSquare === null) //search capture moves
      || (a.part !== part)
    );
    r.actions = [...filtered_actions]; //shallow copying
    return r;
  }

  /**
   * Convert the moves to human-readable strings.
   * @param design - game design
   * @returns human-readable notations of the move
   */
  toString(design: TDesign): string {
    let str = "";
    let location = null;

    for (const a of this.actions) {
      if ((a.originSquare !== null) && (a.targetSquare !== null)) { //neither drop moves nor capture moves
        if ((location === null) || (location != a.originSquare)) {
          if (str != "") {
            str = str + " ";
          }
          str = `${str}${design.locToString(a.originSquare)}`; //convert the start location to strings
        }
        str = `${str}-${design.locToString(a.targetSquare)}`; //convert the target location to strings
        location = a.targetSquare;
      }
    }

    return str;
  }

  /**
   * Check whether the move is a pass or not;
   * @returns
   */
  isPass(): boolean {
    return this.actions.length == 0;
  }

  /**
   * Check whether the move is a drop move or not.
   * @returns
   */
  isDropMove(): boolean {
    if (this.actions.length != 1) {
      return false;
    }
    return (this.actions[0].originSquare === null) && (this.actions[0].targetSquare !== null) && (this.actions[0].piece !== null);
  }

  /**
   * Checks whether the move is a "quiet move" or not;
   * when a player just moves his/her piece without attacking or capturing any piece, the move is a quiet move.
   * @link https://www.chessprogramming.org/Quiet_Moves
   * @link https://en.wikipedia.org/wiki/Glossary_of_chess#quiet_move
   * @returns
   */
  isQuietMove(): boolean {
    if (this.actions.length != 1) {
      return false;
    }
    return (this.actions[0].originSquare !== null) && (this.actions[0].targetSquare !== null);
  }

  /**
   * Called when the move is a piece-transferring move.
   * @param from 
   * @param to 
   * @param piece 
   * @param part
   */
  movePiece(originSquare: From, targetSquare: To, piece: TPiece | null, part: Part = 1) {
    this.actions.push({ originSquare, targetSquare, piece, part });
  }

  /**
   * Called when the move is a piece-capturing move.
   * @param from 
   * @param part
   */
  capturePiece(originSquare: From, part: Part = 1) {
    this.actions.push({ originSquare, targetSquare: null, piece: null, part });
  }

  /**
   * Called when the move is a piece-dropping move.
   * @param to 
   * @param piece 
   * @param part
   */
  dropPiece(targetSquare: To, piece: TPiece | null, part: Part = 1) {
    this.actions.push({ originSquare: null, targetSquare, piece, part });
  }

  /**
   * Updates the current board state with the move.
   * @param board
   */
  applyTo(board: TBoard) {
    for (const a of this.actions) {
      if (a.originSquare !== null) {
        board.setPiece(a.originSquare, null); //make the origin square empty
      }
      if ((a.targetSquare !== null) && (a.piece !== null)) {
        board.setPiece(a.targetSquare, a.piece); //put a piece on the target location
      }
      if ((a.originSquare !== null) && (a.targetSquare !== null)) {
        board.setLastFrom(a.originSquare); //update the origin square
      }
    }
  }
}
