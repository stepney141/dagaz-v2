import _ from "../../../dependencies/underscore-esm-min.js";
import { games } from "../dagaz-model.js";
import { TPiece } from "./TPiece.js";
import { TBoard } from "./TBoard.js";

export class TDesign {
  constructor() {
    /**
     * @type {Array<string>}
     * @description a list of direction names
     */
    this.dirs = [];
    
    /** @type {Array<undefined | Array<number>>} */
    this.players = [];
    
    /** @type {Array<string>} */
    this.playerNames = [];
    
    /**
     * @type {Array<Array<number>>}
     * @description a list of position ids
     */
    this.positions = [];
    
    /** @type {Array<string>} */
    this.positionNames = [];

    /** @type {Array<number>} */
    this.modes = [];
    
    /** @type {Array<Array<number>>} */
    this.zones = [];
    
    /** @type {Array<string>} */
    this.zoneNames = [];
    
    /** @type {string} */
    this.pieceNames = [];
    
    /** @type {Array<number>} */
    this.price = [];
    
    /** 
     * @typedef {Object} move 
     * @property {number} t - move type
     * @property {(ctx: TMoveContext, params: *) => *} f - function
     * @property {Array<number>} p - params 
     * @property {number} m - move mode 
     * @property {*} s - sound 
     */
    /** @type {Array<move>} */
    this.moves = [];
    
    /**
     * @type {Array<{p: TPiece, t: (null | number)}>}
     * @description a list of objects that include initial piece positions and piece instances
     */
    this.initial = [];

    /**
     * @type {Array<{player: *, mode: *}> | undefined}
     * @description 
     */
    this.turns;
  }

  /**
   * Returns a new piece instance
   * @param {number} type - an id of the piece type
   * @param {number} player - an id of a player who owns the piece
   * @returns {TPiece}
   */
  createPiece(type, player) {
    return new TPiece(type, player);
  }

  /**
   * Defines some flags for game rules and store them into the global namespace
   * @param {string} name 
   * @param {"true" | "false"} value 
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
    if (_.isUndefined(this.positionNames[pos])) return "?";
    return this.positionNames[pos];
  }

  /**
   * Returns an position corresponding to the given position name
   * @param {string} name - a position name
   * @returns {null | number} a position id
   */
  stringToPos(name) {
    var pos = _.indexOf(this.positionNames, name);
    if (pos < 0) return null;
    return pos;
  }

  /**
   * Defines a new direction
   * @param {string} name - a direction name
   */
  addDirection(name) {
    this.dirs.push(name);
  }

  /**
   * Defines a player
   * @param {string} name - a player name
   * @param {Array<number>} symmetry 
   */
  addPlayer(name, symmetry) {
    var ix = this.playerNames.length;
    if (this.playerNames.length == 0) {
      this.playerNames.push("opposite");
    }
    this.players[ix] = symmetry;
    this.playerNames.push(name);
  }

  /**
   * Defines a turn
   * @param {*} player - a player
   * @param {*} modes 
   */
  addTurn(player, modes) {
    if (_.isUndefined(this.turns)) {
      this.turns = [];
    }
    if (!_.isUndefined(modes) && !_.isArray(modes)) {
      modes = [modes];
    }
    this.turns.push({
      p: player,
      m: modes
    });
  }

  repeatMark() {
    if (_.isUndefined(this.turns)) {
      this.turns = [];
    }
    this.repeat = this.turns.length;
  }

  /**
   * Defines a cell on the game board
   * @param {string} name - a position name
   * @param {Array<number>} dirs 
   */
  addPosition(name, dirs) {
    if ((this.positions.length == 0) && (name != "start")) {
      this.positionNames.push("start");
      this.positions.push(_.map(_.range(dirs.length), function(n) {return 0;}));
    }
    this.positionNames.push(name);
    this.positions.push(dirs);
  }

  /**
   * Defines a special zone on the game board
   * @param {string} name - a zone name
   * @param {number} player - an ID of a player who can use the zone
   * @param {Array<string>} positions - positions which are in the zone
   */
  addZone(name, player, positions) {
    var zone = _.indexOf(this.zoneNames, name);
    if (zone < 0) {
      zone = this.zoneNames.length;
      this.zoneNames.push(name);
    }
    if (_.isUndefined(this.zones[zone])) {
      this.zones[zone] = [];
    }
    this.zones[zone][player] = _.map(positions, function(name) {
      return this.stringToPos(name);
    }, this);
  }

  /**
   * 
   * @param {number} mode 
   */
  addPriority(mode) {
    this.modes.push(mode);
  }

  /**
   * Defines a piece
   * @param {string} name - a piece name
   * @param {number} type - an id of a piece type
   * @param {number} price - a piece value
   */
    this.pieceNames[type] = name;
    this.price[type] = price ? price : 1;
  }

  /**
   * 
   * @param {string} name - a piece name
   * @returns {null | number}
   */
  getPieceType(name) {
    var r = _.indexOf(this.pieceNames, name);
    if (r < 0) return null;
    return r;
  }

  /**
   * Defines the behavior of a piece (e.g. how it moves to another cell, how it captures other pieces, etc.)
   * @param {number} type 
   * @param {(ctx: TMoveContext, params: *) => *} fun 
   * @param {Array<number>} params 
   * @param {number} mode 
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
   * Returns a game board at the time when the game started
   * @returns {TBoard} an initial game state
   */
  getInitBoard() {
    if (_.isUndefined(this.board)) {
      games.model.BuildDesign(this);
      this.board = new TBoard(this);
      _.each(this.initial, function(s) {
        this.board.setPiece(s.p, s.t);
      }, this);
    }
    return this.board;
  }

  /**
   * Defines a initial setup of a piece
   * @param {string} player - a name of a player who owns the pieces
   * @param {string} type - a piece type
   * @param {Array<string> | string} positions - names of cells which the piece occupies when the game starts
   */
  setup(player, type, positions) {
    var t = _.indexOf(this.pieceNames, type);
    var p = _.indexOf(this.playerNames, player);
    if ((t < 0) || (p < 0)) return;
    var piece = new TPiece(t, p);
    if (!_.isArray(positions)) {
      positions = [positions];
    }
    _.chain(positions)
      .map(function(name) {
        return this.stringToPos(name);
      }, this)
      .each(function(pos) {
        this.initial.push({
          p: pos,
          t: piece
        });
      }, this);
  }


  /**
   * Returns an array of numbers progressing from 1 to the number of directions - 1
   * @returns {Array<number>}
   */
  allDirections() {
    return _.range(this.dirs.length);
  }


  /**
   * Returns an array of numbers progressing from 1 to the number of players - 1
   * @returns {Array<number>}
   */
  allPlayers() {
    return _.range(1, this.playerNames.length);
  }

  /**
   * Returns an array of numbers progressing from 1 to the number of positions - 1
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
    var dir = _.indexOf(this.dirs, name);
    if (dir < 0) {
      return null;
    }
    return dir;
  }

  /**
   * 
   * @param {number} player 
   * @param {number} pos 
   * @param {number} dir 
   * @returns {null | number}
   */
  navigate(player, pos, dir) {
    if (!_.isUndefined(this.players[player])) {
      dir = this.players[player][dir];
    }
    if (this.positions[pos][dir] != 0) {
      return + pos + this.positions[pos][dir];
    } else {
      return null;
    }
  }

  opposite(dir, player) {
    if (_.isUndefined(player)) {
      player = 0;
    }
    return this.players[player][dir];
  }

  /**
   * Returns a zone that corresponds to the given zone name
   * @param {string} name - a zone name
   * @returns {null | number} a zone id
   */
  getZone(name) {
    var zone = _.indexOf(this.zoneNames, name);
    if (zone < 0) return null;
    return zone;
  }

  /**
   * Returns if the player is in the given zone
   * @param {*} player 
   * @param {*} pos 
   * @param {*} zone 
   * @returns {boolean}
   */
  inZone(player, pos, zone) {
    if (!_.isUndefined(this.zones[zone])) {
      if (!_.isUndefined(this.zones[zone][player])) {
        return _.indexOf(this.zones[zone][player], pos) >= 0;
      }
    }
    return false;
  }

  /**
   * Returns a player who is going to play in the next turn
   * @param {number} player 
   * @returns {number}
   */
  nextPlayer(player) {
    if (player + 1 >= this.playerNames.length) {
      return 1;
    } else {
      return player + 1;
    }
  }

  /**
   * Returns the next turn id
   * @param {TBoard} board 
   * @returns {number}
   */
  nextTurn(board) {
    var turn = board.turn + 1;
    if (_.isUndefined(this.turns)) {
      if (turn >= this.players.length - 1) {
        turn = 0;
        if (!_.isUndefined(this.repeat)) {
          turn += this.repeat;
        }
      }
    } else {
      if (turn >= this.turns.length) {
        turn = 0;
        if (!_.isUndefined(this.repeat)) {
          turn += this.repeat;
        }
      }
    }
    return turn;
  }

  /**
   * Returns a current player
   * @param {number} turn 
   * @returns {number} a player id
   */
  currPlayer(turn) {
    if (_.isUndefined(this.turns)) {
      return turn + 1;
    } else {
      return this.turns[turn].player;
    }
  }
}
