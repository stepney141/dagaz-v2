/**
 * management game rules
 * @module design
 */
import _ from "underscore";

import { TBoard } from "./board";
import { TGrid } from "./board_grid";
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
} as const satisfies Record<string, boolean>;

type GameBehaviorOptionNames = keyof typeof DEFAULT_GAME_OPTIONS;
type GameBehaviorOptions = Record<GameBehaviorOptionNames, boolean>;

/**
 * Manager of information and rules of the game.
 * This will be never re-instantiated after it once gets instantiated.
 */
export class TDesign {
  board: TBoard | undefined;
  boardConnectionGraph: LocationID[][];
  directionNames: DirectionName[];
  gameOptions: GameBehaviorOptions;
  initialGamePosition: { location: null | LocationID; piece: TPiece }[];
  modes: MoveModeID[];
  movements: Movement[];
  groupedMovements: Record<number, Movement[]> | null;
  pieces: {
    [key in PieceTypeID]: {
      name: PieceName;
      price: PiecePrice;
    };
  };
  pieceNames: {
    [EachPiece in PieceName]: PieceTypeID;
  };
  playerNames: PlayerName[];
  plugins: Plugin[];
  locationNames: LocationName[];
  repeat: number | null;
  rotationallySymmetricDirections: DirectionID[][];
  turns: { player: PlayerID; modes: number[] }[] | undefined;
  zoneNames: {
    [EachZone in ZoneName]: ZoneID;
  };
  zones: {
    [EachZone in ZoneID]: {
      [EachPlayerWhoCanUseTheZone in PlayerID]: LocationID[];
    };
  };

  constructor() {
    /**
     * A list of direction names.
     * Each index of this array is a numeric id of each direction.
     */
    this.directionNames = [];

    /**
     * A list of rotationally symmetric directions of players.
     * Each index of this array is a numeric id of each player.
     */
    this.rotationallySymmetricDirections = [];

    /**
     * A list of player names.
     * Each index of this array is a numeric id of each player.
     */
    this.playerNames = [];

    /**
     * Board representation: a list of board location offsets represented by direction ids.
     * Dagaz adopts an extended representation of the Mailbox pattern, an array-based offset board representation system.
     * @link https://www.chessprogramming.org/Mailbox
     */
    this.boardConnectionGraph = [];

    /**
     * Board representation: a list of board location names.
     * Each index of this array is a numeric id of each location.
     */
    this.locationNames = [];

    /**
     * A list of priorities on the mode of moves.
     */
    this.modes = [];

    /**
     * A list of zones, the special areas composed of specified locations.
     */
    this.zones = {};
    this.zoneNames = {};

    /**
     * A list of pieces' names and prices.
     * Each property is a numeric id of each piece type.
     */
    this.pieces = {};
    this.pieceNames = {};

    /**
     * A list of movements or behavior of pieces
     */
    this.movements = [];

    this.groupedMovements = null;

    /**
     * A list of initial piece locations and piece objects.
     */
    this.initialGamePosition = [];

    this.turns = undefined;

    /**
     * An initial game state.
     */
    this.board;

    this.gameOptions = DEFAULT_GAME_OPTIONS;

    this.repeat = null;

    this.plugins = [];
  }

  /**
   * Define some flags for game rules and store them into the global namespace
   * @param name - flag name
   * @param value - flag value
   */
  setGameOption(gameOptions: Partial<GameBehaviorOptions> = {}): TDesign {
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
  addDirection(nameList: DirectionName[]): TDesign {
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
    ...playerSettings: {
      name: string;
      symmetry: DirectionID[];
    }[]
  ): TDesign {
    for (const { name, symmetry } of playerSettings) {
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
    ...locationSettings: {
      name: LocationName;
      locationDelta: number[];
    }[]
  ): TDesign {
    for (const { name, locationDelta } of locationSettings) {
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
  addTurn({ player, modes }: { player: PlayerID; modes: number[] }): TDesign {
    if (this.turns === undefined) {
      this.turns = [];
    }
    this.turns.push({ player, modes });
    return this;
  }

  setRepeatMark(): TDesign {
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
    ...zoneSettings: {
      name: ZoneName;
      player: PlayerID;
      locations: LocationName[];
    }[]
  ): TDesign {
    for (const { name, player, locations } of zoneSettings) {
      let zone_id = this.zoneNames[name];
      if (zone_id === undefined) {
        //when the zone name is not found in the list
        zone_id = Object.keys(this.zoneNames).length;
        this.zoneNames[name] = zone_id;
      }
      if (this.zones[zone_id] === undefined) {
        this.zones[zone_id] = {};
      }
      this.zones[zone_id][player] = locations.map((name) => this.stringToLoc(name));
    }
    return this;
  }

  /**
   * Define a priority on the mode of moves.
   * @param mode
   */
  addMovePriority(modes: MoveModeID[]): TDesign {
    this.modes = modes;
    return this;
  }

  /**
   * Define a piece.
   * @param name - a piece name
   * @param type - a piece type id
   * @param price - a piece value
   */
  addPiece({ name, type, price = 1 }: { name: PieceName; type: PieceTypeID; price?: PiecePrice }): TDesign {
    this.pieces[type] = {
      name,
      price
    };
    this.pieceNames[name] = type;
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
  ): TDesign {
    for (const { pieceType, func, params, mode } of movements) {
      this.movements.push({
        pieceType,
        func,
        params: params.map((name) => this.getDirection(name)),
        mode
      });
    }
    return this;
  }

  /**
   * Create a new grid
   * @returns a new TGrid instance
   */
  addGrid(): TGrid {
    return new TGrid(this);
  }

  /**
   * Define a initial setup of pieces.
   * @param player - a name of a player who owns the pieces
   * @param pieceType - a piece type
   * @param locations - names of cells where the piece occupies when the game starts
   */
  setInitialPieces(
    ...initialPiecePlacementSettings: {
      player: PlayerName;
      pieceName: PieceName;
      locations: LocationName[];
    }[]
  ): TDesign {
    for (const { player, pieceName, locations } of initialPiecePlacementSettings) {
      const piece_type_id = this.getPieceType(pieceName);
      const player_id = this.playerNames.indexOf(player);
      if (piece_type_id === null || player_id < 0) {
        continue;
      }
      const piece = this.createPiece(piece_type_id, player_id);

      locations
        .map((name) => this.stringToLoc(name))
        .forEach((loc) => {
          this.initialGamePosition.push({
            //store information of a piece location
            location: loc,
            piece: piece
          });
        });
    }
    return this;
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
  getInitBoard(buildDesign: (design: TDesign) => void, plugins?: Plugin[]): TBoard {
    buildDesign(this); // load game rules
    this.configureMovement();
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
   * Return a direction id that corresponds to the given direction name
   * @param name - a direction name
   * @returns a direction id
   */
  getDirection(name: DirectionName): null | DirectionID {
    const dir = this.directionNames.indexOf(name);
    if (dir < 0) {
      return null;
    }
    return dir;
  }

  /**
   *
   * @param dir
   * @param player
   * @returns
   */
  getDirectionFromOtherPlayer(dir: DirectionID, player = 0): number {
    return this.rotationallySymmetricDirections[player][dir];
  }

  /**
   * Return a zone that corresponds to the given zone name.
   * @param name - a zone name
   * @returns a zone id
   */
  getZone(name: string): null | number {
    const zone = this.zoneNames[name];
    if (zone === undefined) {
      return null;
    }
    return zone;
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
   *
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
