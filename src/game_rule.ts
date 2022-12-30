/**
 * internal DSL to define game rules
 * @module gamerule
 */

import { TDesign } from "./design";
import { DEFAULT_GAME_OPTIONS } from "./game_options";
import { range } from "./utils";

import type {
  Plugin,
  MoveModeID,
  DirectionName,
  DirectionID,
  LocationName,
  LocationID,
  PlayerName,
  PlayerID,
  PieceName,
  PieceTypeID,
  PiecePrice,
  ZoneName,
  MovementDefinitionMethod,
  GameBehaviorOptions
} from "./types";

/**
 * Game rule builder that provides internal DSL for describing game rules
 */
export class TGameRule {
  /**
   * Board representation: a list of board location offsets represented by direction ids.
   * Dagaz adopts an extended representation of the Mailbox pattern, an array-based offset board representation system.
   * @link https://www.chessprogramming.org/Mailbox
   */
  boardConnectionGraph: LocationID[][];

  /**
   * A list of direction names.
   * Each index of this array is a numeric id of each direction.
   */
  directionNames: DirectionName[];

  gameOptions: GameBehaviorOptions;

  /**
   * A list of initial piece locations and piece objects.
   */
  initialGamePosition: {
    [key in LocationName]: {
      player: PlayerName;
      pieceName: PieceName;
    };
  };

  /**
   * A list of priorities on the mode of moves.
   */
  modes: MoveModeID[];

  /**
   * A list of movements or behavior of pieces
   */
  movements: {
    pieceType: PieceTypeID;
    func: MovementDefinitionMethod;
    params: DirectionName[];
    mode: MoveModeID;
  }[];

  /**
   * A list of pieces' names and prices.
   * Each property is a numeric id of each piece type.
   */
  pieces: {
    [key in PieceTypeID]: {
      name: PieceName;
      price: PiecePrice;
    };
  };

  /**
   * A list of player names.
   * Each index of this array is a numeric id of each player.
   */
  playerNames: PlayerName[];

  plugins: Plugin[];

  /**
   * Board representation: a list of board location names.
   * Each index of this array is a numeric id of each location.
   */
  locationNames: LocationName[];

  repeat: number | null;

  /**
   * A list of rotationally symmetric directions of players.
   * Each index of this array is a numeric id of each player.
   */
  rotationallySymmetricDirections: DirectionID[][];

  turns: { player: PlayerID; modes: number[] }[] | undefined;

  /**
   * A list of zones, the special areas composed of specified locations.
   */
  zones: {
    [key in ZoneName]: {
      [zoneUser in PlayerID]: LocationName[];
    };
  };

  constructor() {
    this.boardConnectionGraph = [];
    this.directionNames = [];
    this.gameOptions = DEFAULT_GAME_OPTIONS;
    this.initialGamePosition = {};
    this.locationNames = [];
    this.modes = [];
    this.movements = [];
    this.pieces = {};
    this.playerNames = [];
    this.plugins = [];
    this.repeat = null;
    this.rotationallySymmetricDirections = [];
    this.turns = undefined;
    this.zones = {};
  }

  buildGameDesign(): TDesign {
    return new TDesign(this);
  }

  /**
   * Define some flags for game rules and store them into the global namespace
   */
  setGameOption(gameOptions: Partial<GameBehaviorOptions> = {}): this {
    this.gameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      ...gameOptions
    };
    return this;
  }

  /**
   * Define a new direction
   * @param name - a list of direction names
   */
  addDirection(nameList: DirectionName[]): this {
    this.directionNames = nameList;
    return this;
  }

  /**
   * Define a player with his/her rotationally symmetric move-directions;
   * e.g. When a chess player moves a pawn one square toward north, the other player recognizes the pawn moves "one square toward south."
   * This is an example of the move-direction symmetry.
   * @param name - a player name
   * @param symmetry - a list of direction ids that are rotationally symmetric in each player
   */
  addPlayer(
    ...playerConfig: {
      name: string;
      symmetry: DirectionID[];
    }[]
  ): this {
    for (const { name, symmetry } of playerConfig) {
      const ix = this.playerNames.length;
      if (this.playerNames.length == 0) {
        this.playerNames.push("opposite");
      }
      this.rotationallySymmetricDirections[ix] = symmetry;
      this.playerNames.push(name);
    }
    return this;
  }

  /**
   * Define a location on the game board.
   * @param name - a location name
   * @param locationDelta - displacement vector; numerical difference of adjacent locations
   */
  addLocation(
    ...locationConfig: {
      name: LocationName;
      locationDelta: number[];
    }[]
  ): this {
    for (const { name, locationDelta } of locationConfig) {
      if (this.boardConnectionGraph.length == 0 && name != "start") {
        //when the locations list is empty, defines the origin of the coordinates
        this.locationNames.push("start");
        this.boardConnectionGraph.push(range({ stop: locationDelta.length }).fill(0));
      }
      this.locationNames.push(name);
      this.boardConnectionGraph.push(locationDelta);
    }
    return this;
  }

  /**
   * Define a turn.
   * @param player - a player id
   * @param modes
   */
  addTurn({ player, modes }: { player: PlayerID; modes: number[] }): this {
    if (this.turns === undefined) {
      this.turns = [];
    }
    this.turns.push({ player, modes });
    return this;
  }

  setRepeatMark(): this {
    if (this.turns === undefined) {
      this.turns = [];
    }
    this.repeat = this.turns.length;
    return this;
  }

  /**
   * Define a special zone on the game board.
   * @param name - a zone name
   * @param player - an ID of a player who can use the zone
   * @param locations - a list of location-names which are in the zone
   */
  addZone(
    ...zoneConfig: {
      name: ZoneName;
      player: PlayerID;
      locations: LocationName[];
    }[]
  ): this {
    for (const { name, player, locations } of zoneConfig) {
      if (name in this.zones === false) {
        this.zones[name] = {};
      }
      this.zones[name][player] = locations;
    }
    return this;
  }

  /**
   * Define a priority on the mode of moves.
   * @param mode
   */
  addMovePriority(modes: MoveModeID[]): this {
    this.modes = modes;
    return this;
  }

  /**
   * Define a piece.
   * @param name - a piece name
   * @param type - a piece type id
   * @param price - a piece value
   */
  addPiece({ name, type, price = 1 }: { name: PieceName; type: PieceTypeID; price?: PiecePrice }): this {
    this.pieces[type] = { name, price };
    return this;
  }

  /**
   * Define how a piece moves or works (e.g. how it moves to another location, how it captures other pieces, etc.)
   */
  addMove(
    ...movements: {
      pieceType: PieceTypeID;
      func: MovementDefinitionMethod;
      params: DirectionName[];
      mode: MoveModeID;
    }[]
  ): this {
    for (const { pieceType, func, params, mode } of movements) {
      this.movements.push({ pieceType, func, params, mode });
    }
    return this;
  }

  /**
   * Define a initial setup of pieces.
   * @param player - a name of a player who owns the pieces
   * @param pieceType - a piece type
   * @param locations - names of cells where the piece occupies when the game starts
   */
  setInitialPieces(
    ...initialPiecePlacementConfig: {
      player: PlayerName;
      pieceName: PieceName;
      locations: LocationName[];
    }[]
  ): this {
    for (const { player, pieceName, locations } of initialPiecePlacementConfig) {
      for (const locName of locations) {
        this.initialGamePosition[locName] = { player, pieceName };
      }
    }
    return this;
  }

  setPlugins(plugins: Plugin[]) {
    this.plugins = plugins;
  }
}
