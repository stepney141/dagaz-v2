import _ from '../../../../../dependencies/underscore-esm-min.js';
import { Dagaz } from '../../dagaz.js';
import { ZrfGrid } from './ZrfGrid.js';

/**
 * Class representing a design of a game
 */
export class ZrfDesign {
  constructor() {
    this.playerNames    = [];
    this.players        = [];
    this.positionNames  = [];
    this.positions      = [];
    this.zoneNames      = [];
    this.zones          = [];
    this.pieceNames     = [];
    this.pieces         = [];
    this.attrs          = [];
    this.dirs           = [];
    this.templates      = [];
    this.options        = [];
    this.modes          = [];
    this.price          = [];
    this.goals          = [];
    this.failed         = false;
  }

  allPositions() {
    return _.range(this.positions.length);
  }

  allDirections() {
    return _.range(this.dirs.length);
  }

  allPlayers() {
    return _.range(1, this.playerNames.length);
  }

  reserve(player, piece, cnt, selector) {
    if (!_.isUndefined(selector) && (selector != Dagaz.Model.getSetupSelector())) {
      return;
    }
    var o = Dagaz.find(this.playerNames, player);
    var t = Dagaz.find(this.pieceNames, piece);
    if ((o < 0) || (t < 0)) {
      this.failed = true;
    } else {
      if (_.isUndefined(this.reserve[t])) {
        this.reserve[t] = [];
      }
      this.reserve[t][o] = cnt;
    }
  }

  /**
   * define initial arrangements of a piece
   * @param {*} player 
   * @param {*} piece 
   * @param {*} pos 
   * @param {*} selector 
   */
  setup(player, piece, pos, selector) {
    if (!_.isUndefined(selector) && (selector != Dagaz.Model.getSetupSelector())) {
      return;
    }
    if (_.isArray(pos)) {
      _.each(pos, function(p) {
        this.setup(player, piece, Dagaz.Model.stringToPos(p, this));
      }, this);
      return;
    }
    var o = Dagaz.find(this.playerNames, player);
    var t = Dagaz.find(this.pieceNames, piece);
    if ((o < 0) || (t < 0)) {
      this.failed = true;
    } else {
      var board = Dagaz.Model.getInitBoard();
      board.setPiece(pos, Dagaz.Model.createPiece(t, o));
    }
  }

  goal(n, player, piece, pos) {
    var o = Dagaz.find(this.playerNames, player);
    if (_.isUndefined(this.goals[o])) {
      this.goals[o] = [];
    }
    this.goals[o].push({
      num: n,
      piece: Dagaz.find(this.pieceNames, piece),
      positions: pos
    });
  }

  getGoalPositions(player, pieces) {
    if (!_.isUndefined(this.goals[player])) {
      return _.chain(this.goals[player])
        .filter(function(goal) {
          return goal.num == 0;
        })
        .filter(function(goal) {
          return _.indexOf(pieces, goal.piece) >= 0;
        })
        .map(function(goal) {
          return goal.positions;
        })
        .flatten()
        .uniq()
        .value();
    } else {
      return [];
    }
  }

  getTemplate(ix) {
    if (_.isUndefined(this.templates[ix])) {
      this.templates[ix] = Dagaz.Model.createTemplate();
    }
    return this.templates[ix];
  }

  /**
   * define a description of moves of pieces by the stackmachine commands
   * @deprecated in future updates
   * @param {*} ix 
   * @param {*} name 
   * @param {*} param 
   */
  addCommand(ix, name, param) {
    var template = this.getTemplate(ix);
    template.addCommand(name, param);
  }

  /**
   * define priority on the mode of moves. For example, capture in checkers are kind of priority
   * @param {*} mode 
   */
  addPriority(mode) {
    this.modes.push(mode);
  }

  addAttribute(type, name, val) {
    if (_.isUndefined(this.attrs[name])) {
      this.attrs[name] = [];
    }
    this.attrs[name][type] = val;
  }

  getAttribute(type, name) {
    if (_.isUndefined(this.attrs[name])) {
      return null;
    }
    if (_.isUndefined(this.attrs[name][type])) {
      return null;
    }
    return this.attrs[name][type];
  }

  /**
   * define a piece and its numerical value
   * @param {*} name 
   * @param {*} type 
   * @param {*} price 
   */
  addPiece(name, type, price) {
    this.pieceNames[type] = name;
    this.price[type] = price ? price : 1;
  }

  /**
   * define a possible movement of a piece
   * @param {*} type 
   * @param {*} template 
   * @param {*} params 
   * @param {*} mode 
   * @param {*} sound 
   * @param {*} selector 
   */
  addMove(type, template, params, mode, sound, selector) {
    if (!_.isUndefined(selector) && (selector != Dagaz.Model.getSetupSelector())) {
      return;
    }
    if (_.isUndefined(this.pieces[type])) {
      this.pieces[type] = [];
    }
    if (!_.isUndefined(this.templates[template])) {
      this.pieces[type].push({
        type: 0,
        template: this.templates[template],
        params: params,
        sound: sound,
        mode: mode
      });
    }
  }

  addDrop(type, template, params, mode, sound, selector) {
    if (!_.isUndefined(selector) && (selector != Dagaz.Model.getSetupSelector())) {
      return;
    }
    if (_.isUndefined(this.pieces[type])) {
      this.pieces[type] = [];
    }
    if (!_.isUndefined(this.templates[template])) {
      this.pieces[type].push({
        type: 1,
        template: this.templates[template],
        params: params,
        sound: sound,
        mode: mode
      });
    }
  }

  /**
   * options modifying the game.
   * @param {*} name 
   * @param {*} value 
   * @param {*} selector
   */
  checkVersion(name, value, selector) {
    if (!_.isUndefined(selector) && (selector != Dagaz.Model.getSetupSelector())) {
      return;
    }
    console.log("checkVersion: " + name + "=" + value);
    this.options[name] = value;
    Dagaz.Model.checkVersion(this, name, value);
  }

  checkOption(name, value) {
    return Dagaz.Model.checkOption(this, name, value);
  }

  getPieceType(name) {
    var r = Dagaz.find(this.pieceNames, name);
    if (r < 0) {
      return null;
    }
    return r;
  }

  getDirection(name) {
    var r = Dagaz.find(this.dirs, name);
    if (r < 0) {
      return null;
    }
    return r;
  }

  /**
   * define a direction on the board.
   * @param {*} name 
   */
  addDirection(name) {
    this.dirs.push(name);
  }

  /**
   * define rules for conversion between players and direction
   * @param {*} player 
   * @param {*} symmetries 
   * @param {*} selector 
   */
  addPlayer(player, symmetries, selector) {
    if (!_.isUndefined(selector) && (selector != Dagaz.Model.getResourceSelector())) return;
    var ix = this.playerNames.length;
    if (this.playerNames.length == 0) {
      ix = 0;
      this.playerNames.push("opposite");
    }
    this.players[ix] = Dagaz.int32Array(symmetries);
    this.playerNames.push(player);
  }

  getPlayersCount() {
    return this.playerNames.length - 1;
  }

  /**
   * define turn orders in the game
   * @param {*} player 
   * @param {*} modes 
   * @param {*} selector 
   */
  addTurn(player, modes, selector) {
    if (!_.isUndefined(selector) && (selector != Dagaz.Model.getResourceSelector())) return;
    if (_.isUndefined(this.turns)) {
      this.turns = [];
    }
    if (!_.isUndefined(modes) && !_.isArray(modes)) {
      modes = [modes];
    }
    this.turns.push({
      random: false,
      player: player,
      modes:  modes
    });
  }

  addRandom(player, modes) {
    if (_.isUndefined(this.turns)) {
      this.turns = [];
    }
    this.turns.push({
      random: true,
      player: player,
      modes:  modes
    });
  }

  repeatMark() {
    if (_.isUndefined(this.turns)) {
      this.turns = [];
    }
    this.repeat = this.turns.length;
  }

  isPuzzle() {
    if (!_.isUndefined(this.turns) && (this.turns.length == 1)) return true;
    return _.chain(_.keys(this.playerNames)).max().value() == 1;
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
      if (turn >= this.playerNames.length - 1) {
        turn = 0;
        if (this.repeat) {
          turn += this.repeat;
        }
      }
    } else {
      if (turn >= this.turns.length) {
        turn = 0;
        if (this.repeat) {
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

  isValidMode(turn, mode) {
    if (_.isUndefined(this.turns) || 
              _.isUndefined(this.turns[turn]) ||
              _.isUndefined(this.turns[turn].modes)) {
      return true;
    } else {
      return _.indexOf(this.turns[turn].modes, mode) >= 0;
    }
  }

  prevPlayer(player) {
    if (player == 1) {
      return this.playerNames.length;
    } else {
      return player - 1;
    }
  }

  prevTurn(board) {
    if (_.isUndefined(this.turns)) {
      if (board.turn == 0) {
        return this.playerNames.length - 2;
      }
    } else {
      if ((board.turn == 0) || (board.turn == this.repeat)) {
        return this.turns.length - 1;
      }
    }
    return board.turn - 1;
  }

  /**
   * define positions on the board and offsets for directions between the positions
   * @param {*} name 
   * @param {*} links 
   * @param {*} selector 
   */
  addPosition(name, links, selector) {
    if (!_.isUndefined(selector) && (selector != Dagaz.Model.getSetupSelector())) {
      return;
    }
    if (_.isUndefined(links)) {
      links = _.map(_.range(this.dirs.length), function(dir) {
        return 0;
      });
    }
    if (_.isArray(name)) {
      _.each(name, function(n) {
        this.addPosition(n, links);
      }, this);
      return;
    }
    this.positionNames.push(name);
    this.positions.push(Dagaz.int32Array(links));
  }

  linkPosition(dir, from, to) {
    if (dir >= this.dirs.length) return;
    if ((from >= this.positions.length) || (to >= this.positions.length) || (from == to)) return;
    this.positions[from][dir] = to - from;
  }

  linkPositions(commands, selector) {
    if (!_.isUndefined(selector) && (selector != Dagaz.Model.getResourceSelector())) return;
    _.each(commands, function(c) {
      this.linkPosition(c.dir, c.from, c.to);
    }, this);
  }

  unlinkPosition(dir, from) {
    if (dir >= this.dirs.length) return;
    if (from >= this.positions.length) return;
    this.positions[from][dir] = 0;
  }

  unlinkPositions(commands, selector) {
    if (!_.isUndefined(selector) && (selector != Dagaz.Model.getResourceSelector())) return;
    _.each(commands, function(c) {
      var dirs = _.range(this.dirs.length);
      if (!_.isUndefined(c.dir)) {
        dirs = [c.dir];
      }
      if (!_.isUndefined(c.from)) {
        _.each(dirs, function(dir) {
          if (!_.isUndefined(c.to)) {
            var p = this.navigate(1, c.from, dir);
            if ((p !== null) && (p != c.to)) return;
          }
          this.unlinkPosition(dir, c.from);
        }, this);
      } else {
        if (_.isUndefined(c.to)) return;
        _.each(this.allPositions(), function(from) {
          if (from == c.to) return;
          _.each(dirs, function(dir) {
            var p = this.navigate(1, from, dir);
            if (p === null) return;
            if (p != c.to) return;
            this.unlinkPosition(dir, from);
          }, this);
        });
      }
    }, this);
  }

  killPosition(pos) {
    for (var dir = 0; dir < this.dirs.length; dir++) {
      this.unlinkPosition(dir, pos);
    }
    this.unlinkPositions({
      to: pos
    });
  }

  killPositions(positions, selector) {
    if (!_.isUndefined(selector) && (selector != Dagaz.Model.getResourceSelector())) return;
    _.each(positions, function(pos) {
      this.killPosition(pos);
    }, this);
  }

  addGrid() {
    return new ZrfGrid(this);
  }

  findDirection(from, to) {
    if (from >= this.positions.length) return null;
    var dir = Dagaz.find(this.positions[from], to - from);
    if (dir < 0) return null;
    return dir;
  }

  opposite(dir, player) {
    if (_.isUndefined(player)) {
      player = 0;
    }
    return this.players[player][dir];
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

  getZone(name) {
    var zone = Dagaz.find(this.zoneNames, name);
    if (zone < 0) return null;
    return zone;
  }

  /**
   * define a special area on the board
   * @param {*} name 
   * @param {*} player 
   * @param {*} positions 
   * @param {*} selector 
   */
  addZone(name, player, positions, selector) {
    if (!_.isUndefined(selector) && (selector != Dagaz.Model.getResourceSelector())) return;
    var zone = Dagaz.find(this.zoneNames, name);
    if (zone < 0) {
      zone = this.zoneNames.length;
      this.zoneNames.push(name);
    }
    if (_.isUndefined(this.zones[zone])) {
      this.zones[zone] = [];
    }
    this.zones[zone][player] = Dagaz.int32Array(positions);
  }

  zonePositions(zone, player) {
    if (!_.isUndefined(this.zones[zone])) {
      if (!_.isUndefined(this.zones[zone][player])) {
        return this.zones[zone][player];
      }
    }
    return [];
  }

  inZone(zone, player, pos) {
    if (!_.isUndefined(this.zones[zone])) {
      if (!_.isUndefined(this.zones[zone][player])) {
        return Dagaz.find(this.zones[zone][player], pos) >= 0;
      }
    }
    return false;
  }

  setupSelector(val) {
    Dagaz.Model.getSetupSelector(val);
  }
}