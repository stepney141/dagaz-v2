import _ from "underscore";
import type { Movement, GameBehaviorOptions } from "../types";
import { games } from "./../dagaz-model";
import { TBoard } from "./board";
import { TGrid } from "./board_grid";
import { TMoveContext } from "./move_context";
import { TPiece } from "./piece";

/**
 * A class representing general rules or information of the game.
 * This will never be re-instantiated after it once gets instantiated.
 */
export class TDesign {
  board: TBoard | undefined;
  dirs: Array<string>;
  game_options: GameBehaviorOptions;
  initial: Array<{ p: (null | number), t: TPiece }>;
  modes: Array<number>;
  movements: Array<Movement>;
  movements_grouped: Record<number, Array<Movement>> | null;
  pieceNames: Array<string>;
  playerNames: Array<string>;
  players: Array<undefined | Array<number>>;
  positionNames: Array<string>;
  positions: Array<Array<number>>;
  price: Array<number>;
  repeat: number | null;
  turns: Array<{ player: number, mode: any }> | undefined;
  zoneNames: Array<string>;
  zones: Array<Array<Array<number>>>;

  constructor() {
    /**
     * A list of direction names.
     * Each index of this array is a numeric id of each direction.
     */
    this.dirs = [];

    /**
     * A list of rotationally symmetric directions of players.
     * Each index of this array is a numeric id of each player.
     */
    this.players = [];

    /**
     * A list of player names.
     * Each index of this array is a numeric id of each player.
     */
    this.playerNames = [];

    /**
     * Board representation: a list of board cell offsets represented by direction ids.
     * Dagaz adopts an extended representation of the Mailbox pattern, an array-based offset board representation system.
     * @link https://www.chessprogramming.org/Mailbox
     */
    this.positions = [];

    /**
     * Board representation: a list of board cell names.
     * Each index of this array is a numeric id of each cell.
     */
    this.positionNames = [];

    /**
     * A list of priorities on the mode of moves.
     */
    this.modes = [];

    /**
     * A list of zones, the special areas composed of specified cells.
     * A zone is an array of cell ids. Also, an index of the cell array is a numeric id of a player who can use the zone.
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
    this.price = [];

    /**
     * A list of movements or behavior of pieces
     */
    this.movements = [];

    this.movements_grouped = null;

    /**
     * A list of initial piece positions and piece objects.
     */
    this.initial = [];

    this.turns;

    /**
     * An initial game state.
     */
    this.board;

    this.game_options = {
      passTurn: false,
      passPartial: false,
      sharedPieces: false,
      deferredCaptures: false,
    };

    this.repeat = null;
  }

  /**
   * Returns a new piece instance.
   * @param type - an id of the piece type
   * @param player - an id of a player who owns the piece
   * @returns
   */
  createPiece(type: number, player: number): TPiece {
    return new TPiece(type, player);
  }

  /**
   * Defines some flags for game rules and store them into the global namespace
   * @param name - flag name
   * @param value - flag value
   */
  checkVersion(name: string, value: "true" | "false") {
    if (name === "pass-turn") {
      this.game_options.passTurn = (value == "true");
    }
    if (name === "pass-partial") {
      this.game_options.passPartial = (value == "true");
    }
    if (name === "shared-pieces") {
      this.game_options.sharedPieces = (value == "true");
    }
    if (name === "deferred-captures") {
      this.game_options.deferredCaptures = (value == "true");
    }
  }

  /**
   * Returns a position name that corresponds to the given position id
   * @param pos - a position id
   * @returns a position name
   */
  posToString(pos: number): string {
    if (this.positionNames[pos] === undefined) {
      return "?";
    }
    return this.positionNames[pos];
  }

  /**
   * Returns an position corresponding to the given position name
   * @param name - a position name
   * @returns a position id
   */
  stringToPos(name: string): null | number {
    const pos = this.positionNames.indexOf(name);
    if (pos < 0) {
      return null;
    }
    return pos;
  }

  /**
   * Defines a new direction
   * @param name - a direction name
   */
  addDirection(name: string) {
    this.dirs.push(name);
  }

  /**
   * Defines a player with his/her rotationally symmetric move-directions;  
   * e.g. When a chess player moves a pawn one square toward north, the other player recognizes the pawn moves "one square toward south."  
   * This is an example of the move-direction symmetry.
   * @param name - a player name
   * @param symmetry - a list of direction ids that are rotationally symmetric in each player
   */
  addPlayer(name: string, symmetry: Array<number>) {
    const ix = this.playerNames.length;
    if (this.playerNames.length == 0) {
      this.playerNames.push("opposite");
    }
    this.players[ix] = symmetry;
    this.playerNames.push(name);
  }

  /**
   * Defines a turn.
   * @param player - a player id
   * @param modes 
   */
  addTurn(player: any, modes: any) {
    if (this.turns === undefined) {
      this.turns = [];
    }
    if (modes !== undefined && !Array.isArray(modes)) {
      modes = [modes];
    }
    this.turns.push({
      player: player,
      mode: modes
    });
  }

  repeatMark() {
    if (this.turns === undefined) {
      this.turns = [];
    }
    this.repeat = this.turns.length;
  }

  /**
   * Defines a cell on the game board.
   * @param name - a position name
   * @param dirs - an offset of each cell indicated by numeric direction ids
   */
  addPosition(name: string, dirs: Array<number>) {
    if ((this.positions.length == 0) && (name != "start")) { //when the positions list is empty, defines the origin of the coordinates 
      this.positionNames.push("start");
      this.positions.push(_.range(dirs.length).fill(0));
    }
    this.positionNames.push(name);
    this.positions.push(dirs);
  }

  /**
   * Defines a special zone on the game board.
   * @param name - a zone name
   * @param player - an ID of a player who can use the zone
   * @param positions - a list of position-names which are in the zone
   */
  addZone(name: string, player: number, positions: Array<string>) {
    let zone_id = this.zoneNames.indexOf(name);
    if (zone_id < 0) { //when the zone name is not found in the zone names list
      zone_id = this.zoneNames.length;
      this.zoneNames.push(name);
    }
    if (this.zones[zone_id] === undefined) {
      this.zones[zone_id] = [];
    }
    this.zones[zone_id][player] = positions.map((name: any) => this.stringToPos(name));
  }

  /**
   * Defines a priority on the mode of moves.
   * @param mode 
   */
  addPriority(mode: number) {
    this.modes.push(mode);
  }

  /**
   * Defines a piece.
   * @param name - a piece name
   * @param type - a piece type id
   * @param price - a piece value
   */
  addPiece(name: string, type: number, price = 1) {
    this.pieceNames[type] = name;
    this.price[type] = price;
  }

  /**
   * Returns a piece type id that corresponds to the given piece name
   * @param name - a piece name
   * @returns a piece type id
   */
  getPieceType(name: string): null | number {
    const r = this.pieceNames.indexOf(name);
    if (r < 0) {
      return null;
    }
    return r;
  }

  /**
   * Defines how a piece moves or works (e.g. how it moves to another cell, how it captures other pieces, etc.)
   * @param piece_type - piece type id
   * @param func - callback function to define a move in internal DSL
   * @param params 
   * @param mode - move mode
   * @param sound 
   */
  addMove(piece_type: number, func: (ctx: TMoveContext, params: any) => any, params: Array<number>, mode: number, sound?: any) {
    this.movements.push({
      t: piece_type,
      f: func,
      p: params,
      m: mode,
      s: sound
    });
  }

  /**
   * Returns a game board at the time when the game started.  
   * Or creates the initial board from the game design if it does not exist.
   * @returns an initial game state
   */
  getInitBoard(): TBoard {
    if (this.board === undefined) {
      games.model.buildDesign(this);
      this.configureMovement();
      this.board = new TBoard(this);
      this.initial.forEach(s => { //place pieces on the specified cells
        this.board.setPiece(s.p, s.t);
      });
    }
    return this.board;
  }

  /**
   * Defines a initial setup of pieces.
   * @param player - a name of a player who owns the pieces
   * @param type - a piece type
   * @param positions - names of cells where the piece occupies when the game starts
   */
  setup(player: string, type: string, positions: Array<string> | string) {
    const piece_type_id = this.pieceNames.indexOf(type);
    const player_id = this.playerNames.indexOf(player);
    if ((piece_type_id < 0) || (player_id < 0)) {
      return;
    }

    const piece = new TPiece(piece_type_id, player_id); // create a piece
    const position_array = (Array.isArray(positions)) ? positions : [positions]; //kind of type guard

    position_array
      .map(name => this.stringToPos(name))
      .forEach(pos => {
        this.initial.push({ //store information of a piece position 
          p: pos,
          t: piece
        });
      });
  }

  /**
   * Returns a list of all directions ids (starts from 0)
   * @returns
   */
  allDirections(): Array<number> {
    return _.range(this.dirs.length);
  }


  /**
   * Returns a list of all player ids (starts from 1)
   * @returns
   */
  allPlayers(): Array<number> {
    return _.range(1, this.playerNames.length);
  }

  /**
   * Returns a list of all cell ids (starts from 1)
   * @returns
   */
  allPositions(): Array<number> {
    return _.range(1, this.positions.length);
  }

  /**
   * Returns a direction id that corresponds to the given direction name
   * @param name - a direction name
   * @returns a direction id
   */
  getDirection(name: string): null | number {
    const dir = this.dirs.indexOf(name);
    if (dir < 0) {
      return null;
    }
    return dir;
  }

  /**
   * Returns a new piece position after a player makes a move from a current position toward a given direction
   * @param player - player id
   * @param pos - current position of the piece
   * @param dir - id of the direction toward which the player is going to make a move
   * @returns a new position (null if the new position is not found)
   */
  navigate(player: number, pos: number, dir: number): null | number {
    let target_dir = dir;
    if (this.players[player] !== undefined) {
      target_dir = this.players[player][dir];
    }

    if (this.positions[pos][target_dir] != 0) {
      return + pos + this.positions[pos][target_dir];
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
  opposite(dir: any, player = 0): number {
    return this.players[player][dir];
  }

  /**
   * Returns a zone that corresponds to the given zone name.
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
   * Returns if the player is in the given zone.
   * @param player - player id
   * @param pos - cell id
   * @param zone - zone id
   * @returns
   */
  inZone(player: number, pos: number, zone: number): boolean {
    if (this.zones[zone] !== undefined) {
      if (this.zones[zone][player] !== undefined) {
        return this.zones[zone][player].indexOf(pos) >= 0;
      }
    }
    return false;
  }

  /**
   * Returns a player who is going to make a move in the next turn.
   * @param player - current player id
   * @returns next player id
   */
  nextPlayer(player: number): number {
    if (player + 1 >= this.playerNames.length) {
      return 1;
    } else {
      return player + 1;
    }
  }

  /**
   * Returns the next turn id.
   * @param board 
   * @returns
   */
  nextTurn(board: TBoard): number {
    let turn = board.turn + 1;
    if (this.turns === undefined) {
      if (turn >= this.players.length - 1) {
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
   * Returns a current player id.
   * @param turn 
   * @returns current player id
   */
  currPlayer(turn: number): number {
    if (this.turns === undefined) {
      return turn + 1;
    } else {
      return this.turns[turn].player;
    }
  }

  /**
   * classify piece movement according to a move mode
   */
  configureMovement() {
    this.movements_grouped = _.groupBy(this.movements, movement => {
      if (this.modes.length == 0) {
        return 0;
      }
      return this.modes.indexOf(movement.m);
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
