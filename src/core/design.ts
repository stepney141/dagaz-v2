import _ from "underscore";
import type {
  Plugin,
  Movement, MoveModeID,
  DirectionName, DirectionID,
  LocationName, LocationID,
  PlayerName, PlayerID,
  PieceName, PieceTypeID, PieceValue,
  ZoneName
} from "./../types";
import { TBoard } from "./board";
import { TGrid } from "./board_grid";
import { TPiece } from "./piece";

type GameBehaviorOptions =
    | 'pass-turn'
    | 'pass-partial'
    | 'shared-pieces'
    | 'deferred-captures'
    | 'maximal-captures'
    | 'smart-moves';
type GameBehaviorOptionFlags = Record<GameBehaviorOptions, boolean>;

/**
 * @param player - a name of a player who owns the pieces
 * @param pieceType - a piece type
 * @param locations - names of cells where the piece occupies when the game starts
 */
type InitialPiecePlacementSetting = {
    player: PlayerName,
    pieceName: PieceName,
    locations: LocationName[]
};

/**
 * @param name - a zone name
 * @param player - an ID of a player who can use the zone
 * @param locations - a list of location-names which are in the zone
 */
type ZoneSetting = {
    name: ZoneName,
    player: PlayerID,
    locations: LocationName[]
};

/**
 * @param name - a location name
 * @param offsets - location offsets indicated by direction ids
 */
type LocationSetting = {
    name: LocationName,
    offsets: number[]
};

/**
 * @param name - a player name
 * @param symmetry - a list of direction ids that are rotationally symmetric in each player
 */
type PlayerSetting = {
    name: string,
    symmetry: DirectionID[]
};

/**
 * @param name - a piece name
 * @param type - a piece type id
 * @param price - a piece value
 */
type PieceSetting = {
    name: PieceName,
    type: PieceTypeID,
    price?: PieceValue
};

type TurnSetting = {
    player: PlayerID,
    modes: number[]
};

/**
 * Manager of information and rules of the game.
 * This will be never re-instantiated after it once gets instantiated.
 */
export class TDesign {
  board: TBoard | undefined;
  boardConnectionGraph: LocationID[][];
  directionNames: DirectionName[];
  gameOptions: GameBehaviorOptionFlags;
  initialGamePosition: Array<{ location: (null | LocationID), piece: TPiece }>;
  modes: MoveModeID[];
  movements: Movement[];
  groupedMovements: Record<number, Movement[]> | null;
  pieceNames: PieceName[];
  playerNames: PlayerName[];
  plugins: Plugin[];
  locationNames: LocationName[];
  piecePrices: number[];
  repeat: number | null;
  rotationallySymmetricDirections: Array<undefined | DirectionID[]>;
  turns: Array<TurnSetting> | undefined;
  zoneNames: ZoneName[];
  zones: LocationID[][][];

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
     * A list of zones, the special areas composed of specified cells.
     * A zone is an array of location ids. Also, an index of the location array is a numeric id of a player who can use the zone.
     * Each index of this "zones" array is a numeric id of each zone.
     */
    this.zones = [];

    this.zoneNames = [];

    /**
     * A list of pieces' names.
     * Each index of this array is a numeric id of each piece type.
     */
    this.pieceNames = [];

    /** 
     * A list of pieces' prices.
     */
    this.piecePrices = [];

    /**
     * A list of movements or behavior of pieces
     */
    this.movements = [];

    this.groupedMovements = null;

    /**
     * A list of initial piece locations and piece objects.
     */
    this.initialGamePosition = [];

    this.turns;

    /**
     * An initial game state.
     */
    this.board;

    this.gameOptions = {
      'pass-turn': false,
      'pass-partial': false,
      'shared-pieces': false,
      'deferred-captures': false,
      'maximal-captures': false,
      'smart-moves': false
    };

    this.repeat = null;

    this.plugins = [];
  }

  /**
   * Return a new piece instance.
   * @param type - an id of the piece type
   * @param player - an id of a player who owns the piece
   * @returns new piece
   */
  createPiece(type: PieceTypeID, player: PlayerID): TPiece {
    return new TPiece(type, player);
  }

  /**
   * Define some flags for game rules and store them into the global namespace
   * @param name - flag name
   * @param value - flag value
   */
  checkGameOption(name: GameBehaviorOptions, value: boolean) {
    if (name === "pass-turn") {
      this.gameOptions['pass-turn'] = (value === true);
    }
    if (name === "pass-partial") {
      this.gameOptions['pass-partial'] = (value === true);
    }
    if (name === "shared-pieces") {
      this.gameOptions['shared-pieces'] = (value === true);
    }
    if (name === "deferred-captures") {
      this.gameOptions['deferred-captures'] = (value === true);
    }
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
  stringToPos(name: LocationName): null | LocationID {
    const loc = this.locationNames.indexOf(name);
    if (loc < 0) {
      return null;
    }
    return loc;
  }

  /**
   * Define a new direction
   * @param name - a list of direction names
   */
  addDirection(nameList: DirectionName[]) {
    this.directionNames = nameList;
  }

  /**
   * Define a player with his/her rotationally symmetric move-directions;  
   * e.g. When a chess player moves a pawn one square toward north, the other player recognizes the pawn moves "one square toward south."  
   * This is an example of the move-direction symmetry.
   */
  addPlayer({ name, symmetry }: PlayerSetting) {
    const ix = this.playerNames.length;
    if (this.playerNames.length == 0) {
      this.playerNames.push("opposite");
    }
    this.rotationallySymmetricDirections[ix] = symmetry;
    this.playerNames.push(name);
  }

  /**
   * Define a turn.
   * @param player - a player id
   * @param modes 
   */
  addTurn({ player, modes }: TurnSetting) {
    if (this.turns === undefined) {
      this.turns = [];
    }
    this.turns.push({ player, modes });
  }

  setRepeatMark() {
    if (this.turns === undefined) {
      this.turns = [];
    }
    this.repeat = this.turns.length;
  }

  /**
   * Define a location on the game board.
   */
  addLocation({ name, offsets }: LocationSetting) {
    if ((this.boardConnectionGraph.length == 0) && (name != "start")) { //when the locations list is empty, defines the origin of the coordinates 
      this.locationNames.push("start");
      this.boardConnectionGraph.push(_.range(offsets.length).fill(0));
    }
    this.locationNames.push(name);
    this.boardConnectionGraph.push(offsets);
  }

  /**
   * Define a special zone on the game board.
   */
  addZone({ name, player, locations }: ZoneSetting) {
    let zone_id = this.zoneNames.indexOf(name);
    if (zone_id < 0) { //when the zone name is not found in the zone names list
      zone_id = this.zoneNames.length;
      this.zoneNames.push(name);
    }
    if (this.zones[zone_id] === undefined) {
      this.zones[zone_id] = [];
    }
    this.zones[zone_id][player] = locations.map(name => this.stringToPos(name));
  }

  /**
   * Define a priority on the mode of moves.
   * @param mode 
   */
  addPriority(mode: MoveModeID) {
    this.modes.push(mode);
  }

  /**
   * Define a piece.
   * @param name - a piece name
   * @param type - a piece type id
   * @param price - a piece value
   */
  addPiece({ name, type, price = 1 }: PieceSetting) {
    this.pieceNames[type] = name;
    this.piecePrices[type] = price;
  }

  /**
   * Return a piece type id that corresponds to the given piece name
   * @param name - a piece name
   * @returns a piece type id
   */
  getPieceType(name: PieceName): null | PieceTypeID {
    const r = this.pieceNames.indexOf(name);
    if (r < 0) {
      return null;
    }
    return r;
  }

  /**
   * Define how a piece moves or works (e.g. how it moves to another location, how it captures other pieces, etc.)
   */
  addMove(movement: Movement) {
    this.movements.push(movement);
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
    this.initialGamePosition.forEach(s => { // place pieces on the specified cells
      board.setPiece(s.location, s.piece);
    });
    return board;
  }

  setPlugins(plugins: Plugin[]) {
    plugins.forEach(plugin => this.plugins.push(plugin));
  }

  /**
   * Define a initial setup of pieces.
   */
  setInitialPieces({ player, pieceName, locations }: InitialPiecePlacementSetting) {
    const piece_type_id = this.pieceNames.indexOf(pieceName);
    const player_id = this.playerNames.indexOf(player);
    if ((piece_type_id < 0) || (player_id < 0)) {
      return;
    }
    const piece = new TPiece(piece_type_id, player_id); // create a piece

    locations
      .map(name => this.stringToPos(name))
      .forEach(loc => {
        this.initialGamePosition.push({ //store information of a piece location 
          location: loc,
          piece: piece
        });
      });
  }

  /**
   * Return a list of all direction ids (starts from 0)
   * @returns a list of all direction ids
   */
  allDirections(): DirectionID[] {
    return _.range(this.directionNames.length);
  }


  /**
   * Return a list of all player ids (starts from 1)
   * @returns a list of all player ids
   */
  allPlayers(): PlayerID[] {
    return _.range(1, this.playerNames.length);
  }

  /**
   * Return a list of all location ids (starts from 1)
   * @returns a list of all location ids
   */
  allLocations(): LocationID[] {
    return _.range(1, this.boardConnectionGraph.length);
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
   * Return a new piece location after a player makes a move from a current location toward a given direction
   * @param player - player id
   * @param loc - current location of the piece
   * @param dir - direction toward which the player is going to make a move
   * @returns new location id (null if it is not found)
   */
  navigate(player: PlayerID, loc: LocationID, dir: DirectionID): null | LocationID {
    let target_dir = dir;
    if (this.rotationallySymmetricDirections[player] !== undefined) {
      target_dir = this.rotationallySymmetricDirections[player][dir];
    }

    if (this.boardConnectionGraph[loc][target_dir] != 0) {
      return + loc + this.boardConnectionGraph[loc][target_dir];
    } else {
      return null;
    }
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
    const zone = this.zoneNames.indexOf(name);
    if (zone < 0) {
      return null;
    }
    return zone;
  }

  /**
   * Return whether the player is in the given zone.
   * @param player - player id
   * @param loc - location id
   * @param zone - zone id
   * @returns
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
   * @returns
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
   * Classify piece movement according to a move mode
   */
  configureMovement() {
    this.groupedMovements = _.groupBy(this.movements, movement => {
      if (this.modes.length == 0) {
        return 0;
      }
      return this.modes.indexOf(movement.mode);
    });
  }

  /**
   * Create a new grid
   * @returns a new TGrid instance
   */
  addGrid(): TGrid {
    return new TGrid(this);
  }
}
