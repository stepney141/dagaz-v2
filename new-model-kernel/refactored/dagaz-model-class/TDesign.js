import { _ } from "underscore";
import { games } from "../dagaz-model-object.js";
import { TPiece } from "./TPiece.js";
import { TBoard } from "./TBoard.js";

export class TDesign {
  constructor() {
    this.dirs          = [];
    this.players       = [];
    this.playerNames   = [];
    this.positions     = [];
    this.positionNames = [];
    this.modes         = [];
    this.zones         = [];
    this.zoneNames     = [];
    this.pieceNames    = [];
    this.price         = [];
    this.moves         = [];
    this.initial       = [];
  }

  createPiece(type, player) {
    return new TPiece(type, player);
  }

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

  posToString(pos) {
    if (_.isUndefined(this.positionNames[pos])) return "?";
    return this.positionNames[pos];
  }

  stringToPos(name) {
    var pos = _.indexOf(this.positionNames, name);
    if (pos < 0) return null;
    return pos;
  }

  addDirection(name) {
    this.dirs.push(name);
  }

  addPlayer(name, symmetry) {
    var ix = this.playerNames.length;
    if (this.playerNames.length == 0) {
      this.playerNames.push("opposite");
    }
    this.players[ix] = symmetry;
    this.playerNames.push(name);
  }

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

  addPosition(name, dirs) {
    if ((this.positions.length == 0) && (name != "start")) {
      this.positionNames.push("start");
      this.positions.push(_.map(_.range(dirs.length), function(n) {return 0;}));
    }
    this.positionNames.push(name);
    this.positions.push(dirs);
  }

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

  addPriority(mode) {
    this.modes.push(mode);
  }

  addPiece(name, type, price) {
    this.pieceNames[type] = name;
    this.price[type] = price ? price : 1;
  }

  getPieceType(name) {
    var r = _.indexOf(this.pieceNames, name);
    if (r < 0) return null;
    return r;
  }

  addMove(type, fun, params, mode, sound) {
    this.moves.push({
      t: type,
      f: fun,
      p: params,
      s: sound,
      m: mode
    });
  }

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

  allDirections() {
    return _.range(this.dirs.length);
  }

  allPlayers() {
    return _.range(1, this.playerNames.length);
  }

  allPositions() {
    return _.range(1, this.positions.length);
  }

  getDirection(name) {
    var dir = _.indexOf(this.dirs, name);
    if (dir < 0) {
      return null;
    }
    return dir;
  }

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

  getZone(name) {
    var zone = _.indexOf(this.zoneNames, name);
    if (zone < 0) return null;
    return zone;
  }

  inZone(player, pos, zone) {
    if (!_.isUndefined(this.zones[zone])) {
      if (!_.isUndefined(this.zones[zone][player])) {
        return _.indexOf(this.zones[zone][player], pos) >= 0;
      }
    }
    return false;
  }

  nextPlayer(player) {
    if (player + 1 >= this.playerNames.length) {
      return 1;
    } else {
      return player + 1;
    }
  }

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

  currPlayer(turn) {
    if (_.isUndefined(this.turns)) {
      return turn + 1;
    } else {
      return this.turns[turn].player;
    }
  }
}