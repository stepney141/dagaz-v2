import _ from "../../../dependencies/underscore-esm-min.js";
import { games } from "./dagaz-model.js";
import { TPiece } from "./TPiece.js";
import { TBoard } from "./TBoard.js";
import { TMoveContext } from "./TMoveContext.js";

/**
 * A class representing general rules or information of the game.
 * This will never be re-instantiated after it once gets instantiated.
 */
export class TDesign {
  constructor() {
    /**
     * A list of direction names.
     * Each index of this array is a numeric id of each direction.
     * @type {Array<string>}
     */
    this.dirs = [];
    
    /**
     * A list of rotationally symmetric directions of players.
     * Each index of this array is a numeric id of each player.
     * @type {Array<undefined | Array<number>>}
     */
    this.players = [];
    
    /**
     * A list of player names.
     * Each index of this array is a numeric id of each player.
     * @type {Array<string>}
     */
    this.playerNames = [];
    
    /**
     * Board representation: a list of board cell offsets represented by direction ids.
     * Dagaz adopts an extended representation of the Mailbox pattern, an array-based offset board representation system.
     * @link https://www.chessprogramming.org/Mailbox
     * @type {Array<Array<number>>}
     */
    this.positions = [];
    
    /**
     * Board representation: a list of board cell names.
     * Each index of this array is a numeric id of each cell.
     * @type {Array<string>}
     */
    this.positionNames = [];

    /**
     * A list of priorities on the mode of moves.
     * @type {Array<number>}
     */
    this.modes = [];
    
    /**
     * A list of zones, the special areas composed of specified cells.
     * A zone is an array of cell ids. Also, an index of the cell array is a numeric id of a player who can use the zone.
     * Each index of this "zones" array is a numeric id of each zone.
     * @type {Array<Array<Array<number>>>}
     */
    this.zones = [];
    
    /** @type {Array<string>} */
    this.zoneNames = [];
    
    /**
     * A list of pieces' names.
     * Each index of this array is a numeric id of each piece type.
     * @type {string}
     */
    this.pieceNames = [];
    
    /** 
     * A list of pieces' prices.
     * @type {Array<number>}
     */
    this.price = [];
    
    /** 
     * @typedef {Object} move 
     * @property {number} t - piece type id
     * @property {(ctx: TMoveContext, params: *) => *} f - function
     * @property {Array<number>} p - params 
     * @property {number} m - move mode 
     * @property {*} s - sound 
     */
    /** @type {Array<move>} */
    this.moves = [];
    
    /**
     * A list of initial piece positions and piece objects.
     * @type {Array<{p: (null | number), t: TPiece}>}
     */
    this.initial = [];

    /**
     * @type {Array<{player: *, mode: *}> | undefined}
     */
    this.turns;

    /**
     * An initial game state.
     * @type {TBoard | undefined}
     */
    this.board;
  }

  /**
   * Returns a new piece instance.
   * @param {number} type - an id of the piece type
   * @param {number} player - an id of a player who owns the piece
   * @returns {TPiece}
   */
  createPiece(type, player) {
    return new TPiece(type, player);
  }

  /**
   * Defines some flags for game rules and store them into the global namespace
   * @public
   * @param {string} name - flag name
   * @param {"true" | "false"} value - flag name
   */
  checkVersion(name, value) {
    if (name == "pass-turn") {
      games.model.passTurn = (value == "true");
    }
    if (name == "pass-partial") {
      games.model.passPartial = (value == "true");
    }
    if (name == "shared-pieces") {
      games.model.sharedPieces = (value == "true");
    }
    if (name == "deferred-captures") {
      games.model.deferredCaptures = (value == "true");
    }
  }

  /**
   * Returns a position name that corresponds to the given position id
   * @param {number} pos - a position id
   * @returns {string} a position name
   */
  posToString(pos) {
    if (this.positionNames[pos] === undefined) {
      return "?";
    }
    return this.positionNames[pos];
  }

  /**
   * Returns an position corresponding to the given position name
   * @param {string} name - a position name
   * @returns {null | number} a position id
   */
  stringToPos(name) {
    const pos = this.positionNames.indexOf(name);
    if (pos < 0) {
      return null;
    }
    return pos;
  }

  /**
   * Defines a new direction
   * @public
   * @param {string} name - a direction name
   */
  addDirection(name) {
    this.dirs.push(name);
  }

  /**
   * Defines a player with his/her rotationally symmetric move-directions;  
   * e.g. When a chess player moves a pawn one square toward north, the other player recognizes the pawn moves "one square toward south."  
   * This is an example of the move-direction symmetry.
   * @public
   * @param {string} name - a player name
   * @param {Array<number>} symmetry - a list of direction ids that are rotationally symmetric in each player
   */
  addPlayer(name, symmetry) {
    const ix = this.playerNames.length;
    if (this.playerNames.length == 0) {
      this.playerNames.push("opposite");
    }
    this.players[ix] = symmetry;
    this.playerNames.push(name);
  }

  /**
   * Defines a turn.
   * @public
   * @param {*} player - a player id
   * @param {*} modes 
   */
  addTurn(player, modes) {
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
   * @public
   * @param {string} name - a position name
   * @param {Array<number>} dirs - an offset of each cell indicated by numeric direction ids
   */
  addPosition(name, dirs) {
    if ((this.positions.length == 0) && (name != "start")) { //when the positions list is empty, defines the origin of the coordinates 
      this.positionNames.push("start");
      this.positions.push(_.range(dirs.length).fill(0));
    }
    this.positionNames.push(name);
    this.positions.push(dirs);
  }

  /**
   * Defines a special zone on the game board.
   * @public
   * @param {string} name - a zone name
   * @param {number} player - an ID of a player who can use the zone
   * @param {Array<string>} positions - a list of position-names which are in the zone
   */
  addZone(name, player, positions) {
    let zone_id = this.zoneNames.indexOf(name);
    if (zone_id < 0) { //when the zone list is empty
      zone_id = this.zoneNames.length;
      this.zoneNames.push(name);
    }
    if (this.zones[zone_id] === undefined) {
      this.zones[zone_id] = [];
    }
    this.zones[zone_id][player] = positions.map(name => this.stringToPos(name));
  }

  /**
   * Defines a priority on the mode of moves.
   * @param {number} mode 
   */
  addPriority(mode) {
    this.modes.push(mode);
  }

  /**
   * Defines a piece.
   * @public
   * @param {string} name - a piece name
   * @param {number} type - an id of a piece type
   * @param {number=} [price=1] - a piece value
   */
  addPiece(name, type, price = 1) {
    this.pieceNames[type] = name;
    this.price[type] = price;
  }

  /**
   * 
   * @param {string} name - a piece name
   * @returns {null | number} a piece type id
   */
  getPieceType(name) {
    const r = this.pieceNames.indexOf(name);
    if (r < 0) {
      return null;
    }
    return r;
  }

  /**
   * Defines how a piece moves or works (e.g. how it moves to another cell, how it captures other pieces, etc.)
   * @public
   * @param {number} type - piece type id
   * @param {(ctx: TMoveContext, params: *) => *} fun 
   * @param {Array<number>} params 
   * @param {number} mode - move mode
   * @param {*} sound 
   */
  addMove(type, fun, params, mode, sound) {
    this.moves.push({
      t: type,
      f: fun,
      p: params,
      m: mode,
      s: sound
    });
  }

  /**
   * Returns a game board at the time when the game started.  
   * Or creates the initial board from the game design if it does not exist.
   * @public
   * @returns {TBoard} an initial game state
   */
  getInitBoard() {
    if (this.board === undefined) {
      games.model.BuildDesign(this);
      this.board = new TBoard(this);
      this.initial.forEach(s => { //place pieces on the specified cells
        this.board.setPiece(s.p, s.t);
      });
    }
    return this.board;
  }

  /**
   * Defines a initial setup of pieces.
   * @public
   * @param {string} player - a name of a player who owns the pieces
   * @param {string} type - a piece type
   * @param {Array<string> | string} positions - names of cells where the piece occupies when the game starts
   */
  setup(player, type, positions) {
    const piece_type_id = this.pieceNames.indexOf(type);
    const player_id = this.playerNames.indexOf(player);
    if ((piece_type_id < 0) || (player_id < 0)) {
      return;
    }
    const piece = new TPiece(piece_type_id, player_id); // create a piece
    if (!Array.isArray(positions)) { //kind of type guard
      positions = [positions];
    }
    positions
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
   * @returns {Array<number>}
   */
  allDirections() {
    return _.range(this.dirs.length);
  }


  /**
   * Returns a list of all player ids (starts from 1)
   * @returns {Array<number>}
   */
  allPlayers() {
    return _.range(1, this.playerNames.length);
  }

  /**
   * Returns a list of all cell ids (starts from 1)
   * @returns {Array<number>}
   */
  allPositions() {
    return _.range(1, this.positions.length);
  }

  /**
   * Returns a direction id that corresponds to the given direction name
   * @param {string} name - a direction name
   * @returns {null | number} a direction id
   */
  getDirection(name) {
    const dir = this.dirs.indexOf(name);
    if (dir < 0) {
      return null;
    }
    return dir;
  }

  /**
   * Returns a new piece position after a player makes a move from a current position toward a given direction
   * @param {number} player - player id
   * @param {number} pos - current position of the piece
   * @param {number} dir - id of the direction that the player is going to make a move toward
   * @returns {null | number} a new position
   */
  navigate(player, pos, dir) {
    if (this.players[player] !== undefined) {
      dir = this.players[player][dir];
    }
    if (this.positions[pos][dir] != 0) {
      return + pos + this.positions[pos][dir];
    } else {
      return null;
    }
  }

  /**
   * 
   * @param {*} dir 
   * @param {number=} [player=0]
   * @returns {number}
   */
  opposite(dir, player = 0) {
    return this.players[player][dir];
  }

  /**
   * Returns a zone that corresponds to the given zone name.
   * @param {string} name - a zone name
   * @returns {null | number} a zone id
   */
  getZone(name) {
    const zone = this.zoneNames.indexOf(name);
    if (zone < 0) {
      return null;
    }
    return zone;
  }

  /**
   * Returns if the player is in the given zone.
   * @param {number} player - player id
   * @param {number} pos - cell id
   * @param {number} zone - zone id
   * @returns {boolean}
   */
  inZone(player, pos, zone) {
    if (this.zones[zone] !== undefined) {
      if (this.zones[zone][player] !== undefined) {
        return this.zones[zone][player].indexOf(pos) >= 0;
      }
    }
    return false;
  }

  /**
   * Returns a player who is going to make a move in the next turn.
   * @param {number} player - current player id
   * @returns {number} next player id
   */
  nextPlayer(player) {
    if (player + 1 >= this.playerNames.length) {
      return 1;
    } else {
      return player + 1;
    }
  }

  /**
   * Returns the next turn id.
   * @param {TBoard} board 
   * @returns {number}
   */
  nextTurn(board) {
    let turn = board.turn + 1;
    if (this.turns === undefined) {
      if (turn >= this.players.length - 1) {
        turn = 0;
        if (this.repeat !== undefined) {
          turn += this.repeat;
        }
      }
    } else {
      if (turn >= this.turns.length) {
        turn = 0;
        if (this.repeat !== undefined) {
          turn += this.repeat;
        }
      }
    }
    return turn;
  }

  /**
   * Returns a current player id.
   * @param {number} turn 
   * @returns {number} current player id
   */
  currPlayer(turn) {
    if (this.turns === undefined) {
      return turn + 1;
    } else {
      return this.turns[turn].player;
    }
  }
}
