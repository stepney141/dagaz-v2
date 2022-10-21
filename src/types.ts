import type { TMoveContext, TPiece } from "./core";

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

export type From = null | PositionID;
export type To = null | PositionID;
export type Part = null | number;

/**
 * action[0] from - origin square (the cell where the move starts); null for piece-dropping moves like Go.  
 * action[1] to - target square (the cell where the move finishes); null for piece-capturing moves.  
 * action[2] piece - the piece that a player moves.  
 * action[3] part - the move execution phase of partial moves; used in checker-like games
 */
export type MoveActions = Array<[From, To, (null | TPiece), Part]>;

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
