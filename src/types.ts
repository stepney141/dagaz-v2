import type { TMoveContext } from "./core";

export type Movement = {
    t: number//piece type id
    f: (ctx: TMoveContext, params: any) => any //movement descripting function
    p: Array<number> //params 
    m: number //move mode 
    s: any //sound 
}

export type GameBehaviorOptions = {
    passTurn: boolean,
    passPartial: boolean,
    sharedPieces: boolean,
    deferredCaptures: boolean,
};
