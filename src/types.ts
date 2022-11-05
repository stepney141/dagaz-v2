import type { TMoveContext } from "./core";

export type DirectionName = string;
export type DirectionID = number;

export type LocationName = string;
export type LocationID = number;

export type PlayerName = string;
export type PlayerID = number;

export type PieceName = string;
export type PieceTypeID = number;
export type PieceValue = number;

export type ZoneName = string;

export type From = null | LocationID;
export type To = null | LocationID;
export type Part = null | number;

export type MoveModeID = number;

export type MovementDefinitionMethod = <T>(ctx: TMoveContext, params: DirectionID[]) => T | void;

/**
 * description of each piece's move
 */
export type Movement = {
  pieceType: PieceTypeID //piece type id
  func: MovementDefinitionMethod //callback function to define a move in internal DSL
  params: DirectionID[] //directions that the piece can move toward
  mode: MoveModeID //move mode
};

export type Plugin = {
  name: string,
  func: any
};
