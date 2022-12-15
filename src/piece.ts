/**
 * functions to view or update each piece's state
 * @module piece
 */

import type { TDesign } from "./design";
import type { TPiece, PieceTypeID, PlayerID } from "./types";

/**
 * Serialize the piece information into string data
 * @param design - the object describing the game rules
 * @returns human-readable piece details
 */
export function pieceToString(piece: TPiece, design: TDesign): string {
  return `${design.playerNames[piece.player]} ${design.pieces[piece.type]?.name}`;
}

/**
 * Return an attribute value of the given piece
 * @param ix - a piece id
 * @returns a piece value (null if the specified piece doesn't exist)
 */
export function getPieceAttribute(piece: TPiece, ix: number) {
  if (piece.attributes === null || piece.attributes[ix] === undefined) {
    return null;
  }
  return piece.attributes[ix];
}

/**
 * Set an attribute value of the given piece
 * @param ix - a piece id
 * @param new_value - a new value
 * @returns a piece with an updated value
 */
export function updatePieceAttribute(piece: TPiece, ix: number, new_value: any | null): TPiece {
  const currentAttribute = getPieceAttribute(piece, ix);

  if (currentAttribute === null && new_value === null) {
    return piece;
  }
  if (currentAttribute !== null && new_value !== null && currentAttribute == new_value) {
    return piece;
  }

  const r: TPiece = { player: piece.player, type: piece.type, price: 1, attributes: [] };

  if (piece.attributes !== null) {
    r.attributes = [...piece.attributes]; //shallow copying
  }
  if (new_value !== null) {
    r.attributes[ix] = new_value;
  } else {
    r.attributes[ix] = undefined;
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
