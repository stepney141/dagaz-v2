export type PositionID = number;
export type Positions = Array<Array<PositionID>>;
export type PositionName = string;
export type PositionNames = Array<PositionName>;

export type DirectionName = string;
export type Directions = Array<DirectionName>;

export type PlayerID = number;
export type PlayerIDs = Array<PlayerID>;
export type PlayerName = string;
export type PlayerNames = Array<PlayerName>

export type MoveMode = number;
export type MoveModes = Array<MoveMode>;

export type ZoneID = number;
export type ZoneIDs = Array<Array<Array<ZoneID>>>;
export type ZoneName = string;
export type ZoneNames = Array<ZoneName>;

export type PieceName = string;
export type PieceNames = Array<PieceName>;
export type PiecePrice = number;

export interface Design {
    dirs: Directions;
    players: Array<undefined | PlayerIDs>;
    playerNames: PlayerNames;
    positions: Positions;
    positionNames: PositionNames;
    modes: MoveModes;
    zones: ZoneIDs;
    zoneNames: ZoneNames;
    pieceNames: PieceNames;
    prices: Array<PiecePrice>;
    movements: Array<Movement>;
    movements_grouped: Record<number, Array<Movement>> | null;
    initial: Array<{
        p: (null | number),
        t: Piece
    }>;
    turns: Array<{
        player: any,
        mode: any
    }> | undefined;
    board: Board | undefined;
    game_options: {
        passTurn: boolean,
        passPartial: boolean,
        sharedPieces: boolean,
        deferredCaptures: boolean
    };
    repeat: number | null;
}

export interface Board {
    design: Design;
    pieces: Array<Piece>;
    turn: number;
    player: PlayerID;
    z: number;
    moves: Array<Move> | null;
    parent: Board | null;
    forks: Array<MoveContext> | null;
    lastFrom: number | null;

    constructor ()
}

export interface Move {

}

export interface Piece {

}

export interface MoveContext {

}

export interface Movement {
    t: number, //piece type id
    f: (ctx: MoveContext, params: any) => any, //movement descripting function
    p: Array<number>, //params 
    m: number, //move mode
    s: any //sound
};
