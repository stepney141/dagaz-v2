import type { TDesign } from "./design";
import type { TPiece, PieceTypeID, PiecePrice, PlayerID } from "../types";

/**
 * Serialize the piece information into string data
 * @param design - the object describing the game rules
 * @returns human-readable piece details
 */
export function pieceToString(piece: TPiece, design: TDesign): string {
  return `${design.playerNames[piece.player]} ${design.pieces[piece.type]?.name}`;
}

/**
 * Return a value of the given piece type
 * @param ix - a piece id
 * @returns a piece value (null if the specified piece doesn't exist)
 */
export function getPiecePrice(piece: TPiece, ix: PieceTypeID): null | PiecePrice {
  if (piece.prices === null) {
    return null;
  }
  if (piece.prices[ix] === undefined) {
    return null;
  }
  return piece.prices[ix];
}

/**
 * Set a value of the piece
 * @param ix - a piece id
 * @param new_value - a new value
 * @returns a piece with an updated value
 */
export function updatePiecePrice(piece: TPiece, ix: PieceTypeID, new_value: null | PiecePrice): TPiece {
  const currentPrice = getPiecePrice(piece, ix);

  if ((currentPrice === null) && (new_value === null)) {
    return piece;
  }
  if ((currentPrice !== null) && (new_value !== null) && (currentPrice == new_value)) {
    return piece;
  }

  const r: TPiece = { player: piece.player, type: piece.type, prices: [] };

  if (piece.prices !== null) {
    r.prices = [...piece.prices]; //shallow copying
  }
  if (new_value !== null) {
    r.prices[ix] = new_value;
  } else {
    r.prices[ix] = undefined;
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
