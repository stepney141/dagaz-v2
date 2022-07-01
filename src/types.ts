import type { TMoveContext } from "./core";

export type DirectionName = string;
export type DirectionID = number;

export type PositionName = string;
export type PositionID = number;

export type PlayerID = number;

export type Movement = {
    pieceType: number//piece type id
    func: (ctx: TMoveContext, params: any) => any //callback function to define a move in internal DSL
    params: Array<number> //params 
    mode: number //move mode 
};

export type GameBehaviorOptions = {
    passTurn: boolean,
    passPartial: boolean,
    sharedPieces: boolean,
    deferredCaptures: boolean,
};
