import type { TBoard } from "./board";
import type { TDesign } from "./design";
import type { TMove, MoveAction } from "../types";

type CapturingMove = Pick<MoveAction, 'originSquare' | 'part'>;
type DroppingMove = Pick<MoveAction, 'targetSquare' | 'piece' | 'part'>;

/**
 * Copy itself.
 * @returns a new move instance
 */
export function copyMove(move: TMove): TMove {
  return {
    mode: move.mode,
    actions: [...move.actions], //shallow copying
  };
}

/**
 * 
 * @param part 
 * @returns
 */
export function cloneMove(move: TMove, part: number): TMove {
  const filtered_actions = move.actions.filter(a =>
    (a.originSquare === null) //search drop moves
    || (a.targetSquare === null) //search capture moves
    || (a.part !== part)
  );
  return {
    mode: move.mode,
    actions: [...filtered_actions] //shallow copying
  };
}

/**
 * Convert the moves to human-readable strings.
 * @param design - game design
 * @returns human-readable notations of the move
 */
export function moveToString(move: TMove, design: TDesign): string {
  let str = "";
  let location = null;

  for (const a of move.actions) {
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
 * Check whether the move is a pass or not.
 */
export function isPassMove(move: TMove): boolean {
  return move.actions.length == 0;
}

/**
 * Check whether the move is a drop move or not
 */
export function isDropMove(move: TMove): boolean {
  if (move.actions.length != 1) {
    return false;
  }
  return (move.actions[0].originSquare === null)
    && (move.actions[0].targetSquare !== null)
    && (move.actions[0].piece !== null);
}

/**
 * Checks whether the move is a "quiet move" or not;
 * when a player just moves his/her piece without attacking or capturing any piece, the move is a quiet move.
 * @link https://www.chessprogramming.org/Quiet_Moves
 * @link https://en.wikipedia.org/wiki/Glossary_of_chess#quiet_move
 */
export function isQuietMove(move: TMove): boolean {
  if (move.actions.length != 1) {
    return false;
  }
  return (move.actions[0].originSquare !== null)
    && (move.actions[0].targetSquare !== null);
}

/**
 * Called when the move is a piece-transferring move.
 */
export function movePiece(move: TMove, { originSquare, targetSquare, piece, part = 1 }: MoveAction) {
  move.actions.push({ originSquare, targetSquare, piece, part });
}

/**
 * Called when the move is a piece-capturing move.
 */
export function capturePiece(move: TMove, { originSquare, part = 1 }: CapturingMove) {
  move.actions.push({ originSquare, targetSquare: null, piece: null, part });
}

/**
 * Called when the move is a piece-dropping move.
 */
export function dropPiece(move: TMove, { targetSquare, piece, part = 1 }: DroppingMove) {
  move.actions.push({ originSquare: null, targetSquare, piece, part });
}

/**
 * Updates the current board state with the move.
 */
export function applyTo(move: TMove, board: TBoard) {
  for (const a of move.actions) {
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
