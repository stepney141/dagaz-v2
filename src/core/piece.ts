import type { TDesign } from "./design";
import type { TPiece, PieceTypeID, PieceValue, PlayerID } from "../types";

/**
 * Serialize the piece information into string data
 * @param design - the object describing the game rules
 * @returns human-readable piece details
 */
export function pieceToString(piece: TPiece, design: TDesign): string {
  return design.playerNames[piece.player] + " " + design.pieceNames[piece.type];
}

/**
 * Return a value of the given piece type
 * @param ix - a piece id
 * @returns a piece value (null if the specified piece doesn't exist)
 */
export function getPieceValue(piece: TPiece, ix: PieceTypeID): null | PieceValue {
  if (piece.values === null) {
    return null;
  }
  if (piece.values[ix] === undefined) {
    return null;
  }
  return piece.values[ix];
}

/**
 * Set a value of the piece
 * @param ix - a piece id
 * @param new_value - a new value
 * @returns a piece with an updated value
 */
export function updatePieceValue(piece: TPiece, ix: PieceTypeID, new_value: null | PieceValue): TPiece {
  const current_value = getPieceValue(piece, ix);

  if ((current_value === null) && (new_value === null)) {
    return piece;
  }
  if ((current_value !== null) && (new_value !== null) && (current_value == new_value)) {
    return piece;
  }

  const r: TPiece = { player: piece.player, type: piece.type, values: null };

  if (r.values === null) {
    r.values = [];
  }
  if (piece.values !== null) {
    r.values = [...piece.values]; //shallow copying
  }
  if (new_value !== null) {
    r.values[ix] = new_value;
  } else {
    r.values[ix] = undefined;
  }

  return r;
}

/**
 * Return a piece instance promoted to another piece type.
 * @param type - a new piece type id
 * @returns a new piece insatance
 */
export function promotePiece(piece: TPiece, type: PieceTypeID): TPiece {
  return {
    ...piece,
    type
  };
}

/**
 * Return a piece instance that got changed its owner.
 * @param player - a new player id
 * @returns a new piece instance
 */
export function changePieceOwner(piece: TPiece, player: PlayerID): TPiece {
  return {
    ...piece,
    player
  };
}
