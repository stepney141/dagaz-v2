/**
 * management game rules
 * @module design
 */
import _ from "underscore";

import { TBoard } from "./board";
import { range } from "./utils";

import type {
  TPiece,
  Plugin,
  Movement,
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
  ZoneID,
  ZoneName,
  MovementDefinitionMethod
} from "./types";

const DEFAULT_GAME_OPTIONS = {
  "pass-turn": false,
  "pass-partial": false,
  "shared-pieces": false,
  "deferred-captures": false,
  "maximal-captures": false,
  "smart-moves": false
} satisfies Record<string, boolean>;

type GameBehaviorOptionNames = keyof typeof DEFAULT_GAME_OPTIONS;
type GameBehaviorOptions = Record<GameBehaviorOptionNames, boolean>;

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

  buildGameDesign() {
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
        this.boardConnectionGraph.push(_.range(locationDelta.length).fill(0));
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
}

export class TDesign {
  boardConnectionGraph: LocationID[][];
  directionIds: DirectionID[];
  directionNames: DirectionName[];
  gameOptions: GameBehaviorOptions;
  initialGamePosition: { location: null | LocationID; piece: TPiece }[];
  modes: MoveModeID[];
  movements: Movement[];
  groupedMovements: Record<number, Movement[]> | null;
  pieceNames: {
    [EachPiece in PieceName]: PieceTypeID;
  };
  pieces: {
    [key in PieceTypeID]: {
      name: PieceName;
      price: PiecePrice;
    };
  };
  playerNames: PlayerName[];
  plugins: Plugin[];
  locationIds: LocationID[];
  locationNames: LocationName[];
  repeat: number | null;
  rotationallySymmetricDirections: DirectionID[][];
  turns: { player: PlayerID; modes: number[] }[] | undefined;
  zoneNames: {
    [key in ZoneName]: ZoneID;
  };
  zones: {
    [key in ZoneID]: {
      [EachPlayerWhoCanUseTheZone in PlayerID]: LocationID[];
    };
  };

  constructor(gameRule: TGameRule) {
    const copiedGameRule = new (gameRule.constructor as { new (): TGameRule })();
    Object.assign(copiedGameRule, gameRule);
    Object.assign(this, copiedGameRule); // merge TGameRule instance properties to TDesign

    this.directionIds = gameRule.directionNames.map((_, index) => index);
    this.locationIds = gameRule.locationNames.map((_, index) => index);

    // convert pieces to internal representation
    this.pieceNames = {};
    for (const [pieceTypeString, pieceConfig] of Object.entries(gameRule.pieces)) {
      this.pieceNames[pieceConfig.name] = +pieceTypeString;
    }

    // convert zones to internal representation
    this.zoneNames = {};
    this.zones = {};
    for (const [zoneName, zoneConfig] of Object.entries(gameRule.zones)) {
      const zoneId = Object.keys(gameRule.zones).indexOf(zoneName);
      this.zoneNames[zoneName] = zoneId;

      const zoneUser: PlayerID = +Object.keys(zoneConfig)[0];
      const locationNamesInZone: LocationName[] = Object.values(zoneConfig)[0];
      this.zones[zoneId] = {
        [zoneUser]: locationNamesInZone.map((locName) => this.stringToLoc(locName))
      };
    }

    // convert movements to internal representation
    this.movements = [];
    for (const { pieceType, func, params, mode } of gameRule.movements) {
      this.movements.push({
        pieceType,
        func,
        params: params.map((dirName) => this.stringToDir(dirName)),
        mode
      });
    }

    // convert initial position to internal representation
    this.initialGamePosition = [];
    for (const [locName, pieceOnLoc] of Object.entries(gameRule.initialGamePosition)) {
      this.initialGamePosition.push({
        location: this.stringToLoc(locName),
        piece: this.createPiece(this.getPieceType(pieceOnLoc.pieceName), this.getPlayerID(pieceOnLoc.player))
      });
    }

    this.groupedMovements = null;
    this.configureMovement();
  }

  /**
   * Return a list of all direction ids (starts from 0)
   * @returns a list of all direction ids
   */
  allDirections(): DirectionID[] {
    return range({ stop: this.directionNames.length });
  }

  /**
   * Return a list of all player ids (starts from 1)
   * @returns a list of all player ids
   */
  allPlayers(): PlayerID[] {
    return range({ start: 1, stop: this.playerNames.length });
  }

  /**
   * Return a list of all location ids (starts from 1)
   * @returns a list of all location ids
   */
  allLocations(): LocationID[] {
    return range({ start: 1, stop: this.boardConnectionGraph.length });
  }

  /**
   * Return a new piece location after a player makes a move from a current location toward a given direction
   * @param player - player id
   * @param loc - current location of the piece
   * @param dir - direction toward which the player is going to make a move
   * @returns new location id (null if it is not found)
   */
  navigate(player: PlayerID, loc: LocationID, dir: DirectionID): null | LocationID {
    const target_dir =
      this.rotationallySymmetricDirections[player] !== undefined
        ? this.rotationallySymmetricDirections[player][dir]
        : dir;

    if (this.boardConnectionGraph[loc][target_dir] != 0) {
      return +loc + this.boardConnectionGraph[loc][target_dir];
    } else {
      return null;
    }
  }

  /**
   * Return a game board at the time when the game started.
   * If it doesn't exist, create the initial board from the game design.
   * @returns an initial game state
   */
  getInitBoard(plugins?: Plugin[]): TBoard {
    if (plugins !== undefined) {
      this.setPlugins(plugins);
    }

    const board = new TBoard(this); // create the initial game state
    this.initialGamePosition.forEach((s) => {
      // place pieces on the specified cells
      board.setPiece(s.location, s.piece);
    });
    return board;
  }

  /**
   * Return a piece type id that corresponds to the given piece name
   * @param name - a piece name
   * @returns a piece type id
   */
  getPieceType(name: PieceName): null | PieceTypeID {
    const r = this.pieceNames[name];
    if (r === undefined) {
      return null;
    }
    return r;
  }

  /**
   * Return a piece type id that corresponds to the given piece name
   * @param name - a piece name
   * @returns a piece type id
   */
  getPieceName(pieceType: PieceTypeID): null | PieceName {
    const name = this.pieces[pieceType]?.name;
    if (name === undefined) {
      return null;
    }
    return name;
  }

  /**
   * Return a player name that corresponds to the given player id
   * @param playerName - a player name
   * @returns a numerical player ID
   */
  getPlayerID(playerName: PlayerName): null | PlayerID {
    const id = this.playerNames.indexOf(playerName);
    if (id === -1) {
      return null;
    }
    return id;
  }

  /**
   * Return a player id that corresponds to the given player name
   * @param playerID - a numerical player ID
   * @returns a player name
   */
  getPlayerName(playerID: PlayerID): null | string {
    const name = this.playerNames[playerID];
    if (name === undefined) {
      return null;
    }
    return name;
  }

  /**
   *
   * @param dir
   * @param player
   * @returns
   */
  getDirectionFromPlayer(dir: DirectionID, player = 0): number {
    return this.rotationallySymmetricDirections[player][dir];
  }

  /**
   * Return a current player id.
   * @param turn
   * @returns current player id
   */
  getCurrentPlayer(turn: number): PlayerID {
    if (this.turns === undefined) {
      return turn + 1;
    } else {
      return this.turns[turn].player;
    }
  }

  /**
   * Return a player who is going to make a move in the next turn.
   * @param player - current player id
   * @returns next player id
   */
  getNextPlayer(player: PlayerID): PlayerID {
    if (player + 1 >= this.playerNames.length) {
      return 1;
    } else {
      return player + 1;
    }
  }

  /**
   * Return the next turn id.
   * @param board
   * @returns next turn id
   */
  getNextTurn(board: TBoard): number {
    let turn = board.turn + 1;
    if (this.turns === undefined) {
      if (turn >= this.rotationallySymmetricDirections.length - 1) {
        turn = 0;
        if (this.repeat !== null) {
          turn += this.repeat;
        }
      }
    } else {
      if (turn >= this.turns.length) {
        turn = 0;
        if (this.repeat !== null) {
          turn += this.repeat;
        }
      }
    }
    return turn;
  }

  /**
   * Return whether the player is in the given zone.
   * @param player - player id
   * @param loc - location id
   * @param zone - zone id
   */
  isInZone(player: PlayerID, loc: LocationID, zone: number): boolean {
    if (this.zones[zone] !== undefined) {
      if (this.zones[zone][player] !== undefined) {
        return this.zones[zone][player].indexOf(loc) >= 0;
      }
    }
    return false;
  }

  /**
   * Return a new piece instance.
   * @param type - an id of the piece type
   * @param player - an id of a player who owns the piece
   * @returns new piece
   */
  createPiece(type: PieceTypeID, player: PlayerID): TPiece {
    return {
      type,
      player,
      price: this.pieces[type].price,
      attributes: null
    };
  }

  /**
   * Return a location name that corresponds to the given location id
   * @param loc - a location id
   * @returns a location name
   */
  locToString(loc: LocationID): LocationName {
    if (this.locationNames[loc] === undefined) {
      return "?";
    }
    return this.locationNames[loc];
  }

  /**
   * Return an location corresponding to the given location name
   * @param name - a location name
   * @returns a location id
   */
  stringToLoc(name: LocationName): null | LocationID {
    const loc = this.locationNames.indexOf(name);
    if (loc < 0) {
      return null;
    }
    return loc;
  }

  dirToString(dir: DirectionID): null | DirectionName {
    if (this.directionNames[dir] === undefined) {
      return "?";
    }
    return this.directionNames[dir];
  }

  /**
   * Return a direction id that corresponds to the given direction name
   * @param name - a direction name
   * @returns a direction id
   */
  stringToDir(name: DirectionName): null | DirectionID {
    const dir = this.directionNames.indexOf(name);
    if (dir < 0) {
      return null;
    }
    return dir;
  }

  private setPlugins(plugins: Plugin[]) {
    plugins.forEach((plugin) => this.plugins.push(plugin));
  }

  /**
   * Classify piece movement according to a move mode
   */
  private configureMovement() {
    this.groupedMovements = _.groupBy(this.movements, (movement) => {
      if (this.modes.length == 0) {
        return 0;
      }
      return this.modes.indexOf(movement.mode);
    });
  }
}
