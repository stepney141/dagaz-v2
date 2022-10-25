import type { TMoveContext, TPiece } from "./core";

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

/**
 * action[0] from - origin square (the location where the move starts); null for piece-dropping moves like Go.
 * @link https://www.chessprogramming.org/Origin_Square  
 * action[1] to - target square (the location where the move finishes); null for piece-capturing moves.
 * @link https://www.chessprogramming.org/Target_Square  
 * action[2] piece - the piece that a player moves.  
 * action[3] part - the move execution phase of partial moves; used in checker-like games
 */
export type MoveAction = {
    originSquare: From,
    targetSquare: To,
    piece: null | TPiece,
    part: Part
};

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
