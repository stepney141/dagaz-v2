import type { TMoveContext } from "./move_context";

export type DirectionName = string;
export type DirectionID = number;

export type LocationName = string;
export type LocationID = number;

export type PlayerName = string;
export type PlayerID = number;

export type PieceName = string;
export type PieceTypeID = number;
export type PiecePrice = number;

export type ZoneName = string;
export type ZoneID = number;

export type From = null | LocationID;
export type To = null | LocationID;
export type Part = null | number;

export type MoveModeID = number;

export type MovementDefinitionMethod = <T>(ctx: TMoveContext, params: DirectionID[]) => T | void;

/**
 * description of each piece's move
 */
export type Movement = {
  pieceType: PieceTypeID; //piece type id
  func: MovementDefinitionMethod; //callback function to define a move in internal DSL
  params: DirectionID[]; //directions that the piece can move toward
  mode: MoveModeID; //move mode
};

export type Plugin = {
  name: string;
  func: any;
};

/**
 * representation of a piece on the board
 */
export type TPiece = {
  player: PlayerID;
  type: PieceTypeID;
  prices: null | PiecePrice[];
};

/**
 * action[0] from - origin square (the location where the move starts); null for piece-dropping moves like Go.
 * action[1] to - target square (the location where the move finishes); null for piece-capturing moves.
 * action[2] piece - the piece that a player moves.
 * action[3] part - the move execution phase of partial moves; used in checker-like games
 * @link https://www.chessprogramming.org/Origin_Square
 * @link https://www.chessprogramming.org/Target_Square
 */
export type MoveAction = {
  originSquare: From;
  targetSquare: To;
  piece: null | TPiece;
  part: Part;
};

/**
 * representation of a move on each turn
 */
export type TMove = {
  actions: MoveAction[];
  mode: null | MoveModeID;
};

export type GameBehaviorOptions =
  | "pass-turn"
  | "pass-partial"
  | "shared-pieces"
  | "deferred-captures"
  | "maximal-captures"
  | "smart-moves";
export type GameBehaviorOptionFlags = Record<GameBehaviorOptions, boolean>;

export type GameRuleTemplate = {
  directions: DirectionName[],

  /**
   * @param name - a location name
   * @param offsets - location offsets indicated by direction ids
   */
  locations: {
    name: LocationName,
    offsets: number[]
  }[],

  /**
   * @param name - a player name
   * @param symmetry - a list of direction ids that are rotationally symmetric in each player
   */
  players: {
    name: PlayerName,
    symmetry: number[]
  }[],

  /**
   * @param name - a piece name
   * @param type - a piece type id
   * @param price - a piece value
   */
  pieces: {
    name: PieceName,
    type: PieceTypeID,
    price: PiecePrice
  }[],

  moves: Movement[],

  /**
   * @param player - a name of a player who owns the pieces
   * @param pieceType - a piece type
   * @param locations - names of cells where the piece occupies when the game starts
   */
  initialPosition: {
    player: PlayerName,
    pieceName: PieceName,
    locations: LocationName[]
  }[],

  /**
   * @param name - a zone name
   * @param player - an ID of a player who can use the zone
   * @param locations - a list of location-names which are in the zone
   */
  zones?: {
    name: ZoneName,
    player: PlayerID,
    locations: LocationName[]
  }[],

  turns?: {
    player: PlayerID,
    modes: number[]
  }[],

  movePriority?: number[],
  gameOptions?: Partial<GameBehaviorOptionFlags>
};
