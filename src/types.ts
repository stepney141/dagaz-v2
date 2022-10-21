import type { TMoveContext } from "./core";

export type DirectionName = string;
export type DirectionID = number;

export type PositionName = string;
export type PositionID = number;

export type PlayerName = string;
export type PlayerID = number;

export type PieceName = string;
export type PieceTypeID = number;
export type PieceValue = number;

export type ZoneName = string;

export type MoveModeID = number;

export type MovementDefinitionMethod = (ctx: TMoveContext, params: DirectionID[]) => any;

/**
 * description of each piece's move
 */
export type Movement = {
    pieceType: PieceTypeID //piece type id
    func: MovementDefinitionMethod //callback function to define a move in internal DSL
    params: DirectionID[] //directions that the piece can move toward
    mode: MoveModeID //move mode
};

export type GameBehaviorOptions = {
	passTurn: boolean,
	passPartial: boolean,
	sharedPieces: boolean,
	deferredCaptures: boolean,
};
