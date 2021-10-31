import _ from '../../../../dependencies/underscore-esm-min.js';
import { Dagaz } from '../dagaz.js';

import { ZrfBoard } from './zrf-model-class/ZrfBoard.js';
import { ZrfDesign } from './zrf-model-class/ZrfDesign.js';
import { ZrfMove } from './zrf-model-class/ZrfMove.js';
import { ZrfMoveGenerator } from './zrf-model-class/ZrfMoveGenerator.js';
import { ZrfMoveTemplate } from './zrf-model-class/ZrfMoveTemplate.js';
import { ZrfPiece } from './zrf-model-class/ZrfPiece.js';
import { isCaptured, cartesian } from "./zrf-model-class/utils.js";

var Z2J_VERSION = 2;

Dagaz.Model.deferredStrike  = false;
Dagaz.Model.discardCascades = false;
Dagaz.Model.forkMode        = false;
Dagaz.Model.passPartial     = false;
Dagaz.Model.passTurn        = 0;
Dagaz.Model.sharedPieces    = false;
Dagaz.Model.recycleCaptures = false;
Dagaz.Model.smartFrom       = false;
Dagaz.Model.smartTo         = false;
Dagaz.Model.showGoals       = true;
Dagaz.Model.showCaptures    = true;
Dagaz.Model.showMoves       = true;
Dagaz.Model.showHints       = false;
Dagaz.Model.stalemateDraw   = false;
Dagaz.Model.showBlink       = true;
Dagaz.Model.chessCapturing  = true;
Dagaz.Model.progressive     = false;
Dagaz.Model.progressiveUrl  = null;
Dagaz.Model.silent          = false;
Dagaz.Model.showDrops       = -1;
Dagaz.Model.dragNdrop       = true;
Dagaz.Model.detectLoops     = false;
Dagaz.Model.advisorWait     = null;
Dagaz.Model.remapPromote    = false;
Dagaz.Model.passForcedDraw  = true;
Dagaz.Model.animateRedo     = false;
Dagaz.Model.completePartial = false;
Dagaz.Model.zrfCompatible   = false;
Dagaz.Model.showLose        = true;

Dagaz.Model.checkVersion = function(design, name, value) {  
  if (name == "z2j") {
    if (value > Z2J_VERSION) {
      design.failed = true;
    }
  } else {
    if ((name != "zrf")                && 
             (name != "pass-turn")          &&
             (name != "pass-partial")       &&
             (name != "moves-limit")        &&
             (name != "discard-cascades")   &&
             (name != "animate-captures")   &&
             (name != "animate-drops")      &&
             (name != "highlight-goals")    &&
             (name != "prevent-flipping")   &&
             (name != "progressive-levels") &&
             (name != "selection-screen")   &&
             (name != "show-moves-list")    &&
             (name != "show-captures")      &&
             (name != "show-drops")         &&
             (name != "smart-moves")        &&
             (name != "show-hints")         &&
             (name != "stalemate-draw")     &&
             (name != "recycle-captures")   &&
             (name != "shared-pieces")      &&
             (name != "show-blink")         &&
             (name != "drag-n-drop")        &&
             (name != "detect-loops")       &&
             (name != "advisor-wait")       &&
             (name != "promote-dialog")     &&
             (name != "complete-partial")   &&
             (name != "animate-redo")       &&
             (name != "show-lose")          &&
             (name != "silent-?-moves")) {
      design.failed = true;
    }
    if (name == "show-lose") {
      if (value == "false") Dagaz.Model.showLose = false;
    }
    if (name == "complete-partial") {
      if (value == "true") Dagaz.Model.completePartial = true;
    }
    if (name == "animate-redo") {
      if (value == "false") Dagaz.Model.animateRedo = false;
      if (value == "true")  Dagaz.Model.animateRedo = true;
    }
    if (name == "promote-dialog") {
      if (value == "remap") Dagaz.Model.remapPromote = true;
    }
    if (name == "advisor-wait") {
      Dagaz.Model.advisorWait = +value * 1000;
    }
    if (name == "detect-loops") {
      if (value == "true")    Dagaz.Model.detectLoops = true;
    }
    if (name == "drag-n-drop") {
      if (value == "false")   Dagaz.Model.dragNdrop = false;
    }
    if (name == "show-drops") {
      if (!_.isNaN(value))    Dagaz.Model.showDrops = +value;
      if (value == "false")   Dagaz.Model.showDrops = 0;
      if (value == "true")    Dagaz.Model.showDrops = -1;
      if (value == "all")     Dagaz.Model.showDrops = -2;
    }
    if (name == "progressive-levels") {
      Dagaz.Model.progressive = (value == "true");
      if (value == "silent") {
        Dagaz.Model.progressive = true;
        Dagaz.Model.silent      = true;
      }
      if ((value != "silent") && (value != "true")) {
        Dagaz.Model.progressive = true;
        Dagaz.Model.progressiveUrl = value;
      }
    }
    if (name == "show-blink") {
      Dagaz.Model.showBlink = (value == "true");
    }
    if (name == "show-captures") {
      Dagaz.Model.showCaptures = (value == "true");
    }
    if (name == "shared-pieces") {
      Dagaz.Model.sharedPieces = (value == "true");
    }
    if (name == "show-moves-list") {
      Dagaz.Model.showMoves = (value == "true");
    }
    if (name == "highlight-goals") {
      Dagaz.Model.showGoals = (value == "true");
    }
    if (name == "smart-moves") {
      if ((value == "from") || (value == "true")) {
        Dagaz.Model.smartFrom = true;
      }
      if ((value == "to") || (value == "true")) {
        Dagaz.Model.smartTo = true;
      }
    }
    if ((name == "recycle-captures") && (value == "true")) {
      Dagaz.Model.recycleCaptures = true;
    }
    if ((name == "discard-cascades") && (value == "true")) {
      Dagaz.Model.discardCascades = true;
    }
    if ((name == "pass-partial") && (value == "true")) {
      Dagaz.Model.passPartial = true;
    }
    if ((name == "pass-turn") && (value == "true")) {
      Dagaz.Model.passTurn = 1;
    }
    if ((name == "pass-turn") && (value == "forced")) {
      Dagaz.Model.passTurn = 2;
    }
    if (name == "moves-limit") {
      Dagaz.Model.movesLimit = value;
    }
    if ((name == "show-hints") && (value == "false")) {
      Dagaz.Model.showHints = false;
    }
    if ((name == "stalemate-draw") && (value == "true")) {
      Dagaz.Model.stalemateDraw = true;
    }
  }
};

Dagaz.Model.checkOption = function(design, name, value) {
  if (design.options[name] == value) {
    return true;
  }
};

Dagaz.Model.ZRF_JUMP      = 0;
Dagaz.Model.ZRF_IF        = 1;
Dagaz.Model.ZRF_FORK      = 2;
Dagaz.Model.ZRF_FUNCTION  = 3;
Dagaz.Model.ZRF_IN_ZONE   = 4;
Dagaz.Model.ZRF_GET_FLAG  = 5;
Dagaz.Model.ZRF_SET_FLAG  = 6;
Dagaz.Model.ZRF_GET_PFLAG = 7;
Dagaz.Model.ZRF_SET_PFLAG = 8;
Dagaz.Model.ZRF_GET_ATTR  = 9;
Dagaz.Model.ZRF_SET_ATTR  = 10;
Dagaz.Model.ZRF_PROMOTE   = 11;
Dagaz.Model.ZRF_MODE      = 12;
Dagaz.Model.ZRF_ON_BOARDD = 13;
Dagaz.Model.ZRF_ON_BOARDP = 14;
Dagaz.Model.ZRF_PARAM     = 15;
Dagaz.Model.ZRF_LITERAL   = 16;
Dagaz.Model.ZRF_VERIFY    = 20;
Dagaz.Model.ZRF_SET_POS   = 21;
Dagaz.Model.ZRF_NAVIGATE  = 22;
Dagaz.Model.ZRF_OPPOSITE  = 23;
Dagaz.Model.ZRF_FROM      = 24;
Dagaz.Model.ZRF_TO        = 25;
Dagaz.Model.ZRF_CAPTURE   = 26;
Dagaz.Model.ZRF_FLIP      = 27;
Dagaz.Model.ZRF_END       = 28;

Dagaz.Model.ZRF_NOT       = 0;
Dagaz.Model.ZRF_IS_EMPTY  = 1;
Dagaz.Model.ZRF_IS_ENEMY  = 2;
Dagaz.Model.ZRF_IS_FRIEND = 3;
Dagaz.Model.ZRF_IS_LASTF  = 4;
Dagaz.Model.ZRF_IS_LASTT  = 5;
Dagaz.Model.ZRF_MARK      = 6;
Dagaz.Model.ZRF_BACK      = 7;
Dagaz.Model.ZRF_PUSH      = 8;
Dagaz.Model.ZRF_POP       = 9;
Dagaz.Model.ZRF_IS_PIECE  = 10;
Dagaz.Model.ZRF_CREATE    = 11;

/* setting up commands */

Dagaz.Model.commands = {};

Dagaz.Model.commands[Dagaz.Model.ZRF_JUMP] = function(gen, param) {
  return param - 1;
};

Dagaz.Model.commands[Dagaz.Model.ZRF_IF] = function(gen, param) {
  if (gen.stack.length == 0) {
    return null;
  }
  var f = gen.stack.pop();
  if (f) {
    return param - 1;
  } else {
    return 0;
  }
};

Dagaz.Model.commands[Dagaz.Model.ZRF_FORK] = function(gen, param) {
  var g = gen.clone();
  g.cmd += param - 1;
  gen.board.addFork(g);
  return 0;
};

Dagaz.Model.commands[Dagaz.Model.ZRF_FUNCTION] = function(gen, param) {
  var game = gen.board.game;
  if (!_.isUndefined(game.functions[param])) {
    return (game.functions[param])(gen);
  }
  return null;
};

Dagaz.Model.commands[Dagaz.Model.ZRF_IN_ZONE] = function(gen, param) {
  var player = gen.board.player;
  if (gen.pos === null) {
    return null;
  }
  gen.stack.push(gen.design.inZone(param, player, gen.pos));
  return 0;
};

Dagaz.Model.commands[Dagaz.Model.ZRF_GET_FLAG] = function(gen, param) {
  gen.stack.push(gen.getValue(param, -1));
  return 0;
};

Dagaz.Model.commands[Dagaz.Model.ZRF_SET_FLAG] = function(gen, param) {
  if (gen.stack.length == 0) {
    return null;
  }
  var value = gen.stack.pop();
  gen.setValue(param, -1, value);
  return 0;
};

Dagaz.Model.commands[Dagaz.Model.ZRF_GET_PFLAG] = function(gen, param) {
  if (gen.pos === null) {
    return null;
  }
  gen.stack.push(gen.getValue(param, gen.pos));
  return 0;
};

Dagaz.Model.commands[Dagaz.Model.ZRF_SET_PFLAG] = function(gen, param) {
  if (gen.pos === null) {
    return null;
  }
  if (gen.stack.length == 0) {
    return null;
  }
  var value = gen.stack.pop();
  gen.setValue(param, gen.pos, value);
  return 0;
};

Dagaz.Model.commands[Dagaz.Model.ZRF_GET_ATTR] = function(gen, param) {
  if (gen.pos === null) {
    return null;
  }
  var value = gen.getAttr(param, gen.pos);
  if (value === null) {
    return null;
  }
  gen.stack.push(value);
  return 0;
};

Dagaz.Model.commands[Dagaz.Model.ZRF_SET_ATTR] = function(gen, param) {
  if (gen.pos === null) {
    return null;
  }
  if (gen.stack.length == 0) {
    return null;
  }
  var value = gen.stack.pop();
  gen.setAttr(param, gen.pos, value);
  return 0;
};

Dagaz.Model.commands[Dagaz.Model.ZRF_PROMOTE] = function(gen, param) {
  if (_.isUndefined(gen.piece)) {
    return null;
  }
  gen.piece = gen.piece.promote(param);
  return 0;
};

Dagaz.Model.commands[Dagaz.Model.ZRF_MODE] = function(gen, param) {
  gen.mode = param;
  return 0;
};

Dagaz.Model.commands[Dagaz.Model.ZRF_ON_BOARDD] = function(gen, param) {
  var player = gen.board.player;
  var pos = gen.pos;
  if (pos === null) {
    return null;
  }
  pos = gen.design.navigate(player, pos, param);
  if (pos !== null) {
    gen.stack.push(true);
  } else {
    gen.stack.push(false);
  }
  return 0;
};

Dagaz.Model.commands[Dagaz.Model.ZRF_ON_BOARDP] = function(gen, param) {
  if ((param >= 0) && (param < gen.design.positions.length)) {
    gen.stack.push(true);
  } else {
    gen.stack.push(false);
  }
  return 0;
};

Dagaz.Model.commands[Dagaz.Model.ZRF_PARAM] = function(gen, param) {
  var value = gen.params[param];
  gen.stack.push(value);
  return 0;
};

Dagaz.Model.commands[Dagaz.Model.ZRF_LITERAL] = function(gen, param) {
  gen.stack.push(param);
  return 0;
};

/* setting up functions */

Dagaz.Model.functions = {};

Dagaz.Model.functions[Dagaz.Model.ZRF_VERIFY] = function(gen) {
  if (gen.stack.length == 0) {
    return null;
  }
  var f = gen.stack.pop();
  if (f) {
    return 0;
  } else {
    return null;
  }
};

Dagaz.Model.functions[Dagaz.Model.ZRF_SET_POS] = function(gen) {
  if (gen.stack.length == 0) {
    return null;
  }
  var pos = gen.stack.pop();
  if (pos < gen.design.positions.length) {
    gen.pos = pos;
    return 0;
  } else {
    return null;
  }
};

Dagaz.Model.functions[Dagaz.Model.ZRF_NAVIGATE] = function(gen) {
  if (gen.stack.length == 0) {
    return null;
  }
  var dir = gen.stack.pop();
  var player = gen.board.player;
  var pos = gen.pos;
  if (pos === null) {
    return null;
  }
  pos = gen.design.navigate(player, pos, dir);
  if (pos === null) {
    return null;
  }
  if (pos < gen.design.positions.length) {
    gen.pos = pos;
    return 0;
  } else {
    return null;
  }
};

Dagaz.Model.functions[Dagaz.Model.ZRF_OPPOSITE] = function(gen) {
  if (gen.stack.length == 0) {
    return null;
  }
  var dir = gen.stack.pop();
  if (_.isUndefined(gen.design.players[0])) {
    return null;
  }
  if (_.isUndefined(gen.design.players[0][dir])) {
    return null;
  }
  dir = gen.design.players[0][dir];
  gen.stack.push(dir);
  return 0;
};

Dagaz.Model.functions[Dagaz.Model.ZRF_FROM] = function(gen) {
  if (gen.pos === null) {
    return null;
  }
  if (gen.getPiece(gen.pos) === null) {
    return null;
  }
  gen.from  = gen.pos;
  gen.piece = gen.getPiece(gen.pos);
  delete gen.initial;
  return 0;
};

Dagaz.Model.functions[Dagaz.Model.ZRF_TO] = function(gen) {
  if (gen.pos === null) {
    return null;
  }
  if (_.isUndefined(gen.piece)) {
    return null;
  }
  if (Dagaz.Model.chessCapturing && !_.isUndefined(gen.cover) && !_.isUndefined(gen.from)) {
    gen.cover[gen.pos].push(gen.from);
    gen.serial[gen.pos].push(gen.serial);
  }
  if (_.isUndefined(gen.from)) {
    gen.dropPiece(gen.pos, gen.piece);
  } else {
    gen.movePiece(gen.from, gen.pos, gen.piece);
  }
  delete gen.from;
  delete gen.piece;
  if (Dagaz.Model.detectLoops && (gen.pos !== null)) {
    if (!gen.notLooped()) {
      gen.move.failed = true;
    }
  }
  gen.generated = true;
  return 0;
};

Dagaz.Model.functions[Dagaz.Model.ZRF_CAPTURE] = function(gen) {
  if (gen.pos === null) {
    return null;
  }
  if (gen.getPiece(gen.pos) === null) {
    return 0;
  }
  if (!gen.capturePiece(gen.pos)) {
    return null;
  }
  if (!_.isUndefined(gen.cover) && !_.isUndefined(gen.from)) {
    gen.cover[gen.pos].push(gen.from);
    gen.serial[gen.pos].push(gen.serial);
  }
  gen.generated = true;
  return 0;
};

Dagaz.Model.functions[Dagaz.Model.ZRF_FLIP] = function(gen) {
  if (gen.pos === null) {
    return null;
  }
  if (gen.getPiece(gen.pos) === null) {
    return null;
  }
  var piece = gen.getPiece(gen.pos).flip();
  gen.movePiece(gen.pos, gen.pos, piece);
  return 0;
};

Dagaz.Model.functions[Dagaz.Model.ZRF_END] = function(gen) {
  var board = gen.board;
  if (gen.generated) {
    if (gen.moveType == 2) {
      board.changeMove(gen.move);
    }
    if (gen.moveType == 1) {
      board.addMove(gen.move);
    }
  }
  gen.moveType = 0;
  gen.completed = true;
  return null;
};

Dagaz.Model.functions[Dagaz.Model.ZRF_NOT] = function(gen) {
  if (gen.stack.length == 0) {
    return null;
  }
  var f = gen.stack.pop();
  gen.stack.push(!f);
  return 0;
};

Dagaz.Model.functions[Dagaz.Model.ZRF_IS_EMPTY] = function(gen) {
  if (gen.pos === null) {
    return null;
  }
  if (isCaptured(gen.move, gen.pos)) {
    gen.stack.push(false);
    return 0;
  }
  var piece = gen.getPiece(gen.pos);
  gen.stack.push(piece === null);
  return 0;
};

Dagaz.Model.functions[Dagaz.Model.ZRF_IS_PIECE] = function(gen) {
  if (gen.pos === null) {
    return null;
  }
  if (gen.stack.length == 0) {
    return null;
  }
  var type = gen.stack.pop();
  var piece = gen.getPiece(gen.pos);
  if (piece === null) {
    gen.stack.push(false);
  } else {
    gen.stack.push(piece.type == type);
  }
  return 0;
};

Dagaz.Model.functions[Dagaz.Model.ZRF_CREATE] = function(gen) {
  if (gen.pos === null) {
    return null;
  }
  if (gen.stack.length == 0) {
    return null;
  }
  if (_.isUndefined(gen.initial) && (gen.from == gen.pos)) {
    gen.initial = gen.pos;
  }
  var type = gen.stack.pop();
  var piece = new ZrfPiece(type, gen.board.player);
  gen.dropPiece(gen.pos, piece);
  return 0;
};

Dagaz.Model.isFriend = function(piece, player) {
  if (piece === null) return false;
  return (piece.player == player);
};

Dagaz.Model.functions[Dagaz.Model.ZRF_IS_ENEMY] = function(gen) {
  if (gen.pos === null) {
    return null;
  }
  var piece  = gen.getPiece(gen.pos);
  if (piece === null) {
    gen.stack.push(false);
    return 0;
  }
  var player = gen.board.player;
  gen.stack.push(!Dagaz.Model.isFriend(piece, player));
  return 0;
};

Dagaz.Model.functions[Dagaz.Model.ZRF_IS_FRIEND] = function(gen) {
  if (gen.pos === null) {
    return null;
  }
  var piece  = gen.getPiece(gen.pos);
  if (piece === null) {
    gen.stack.push(false);
    return 0;
  }
  var player = gen.board.player;
  gen.stack.push(Dagaz.Model.isFriend(piece, player));
  return 0;
};

Dagaz.Model.functions[Dagaz.Model.ZRF_IS_LASTF] = function(gen) {
  if (gen.pos === null) {
    return null;
  }
  gen.stack.push(gen.isLastFrom(gen.pos));
  return 0;
};

Dagaz.Model.functions[Dagaz.Model.ZRF_IS_LASTT] = function(gen) {
  if (gen.pos === null) {
    return null;
  }
  gen.stack.push(gen.isLastTo(gen.pos));
  return 0;
};

Dagaz.Model.functions[Dagaz.Model.ZRF_MARK] = function(gen) {
  if (gen.pos === null) {
    return null;
  }
  gen.setMark();
  return 0;
};

Dagaz.Model.functions[Dagaz.Model.ZRF_BACK] = function(gen) {
  var pos = gen.getMark();
  if (pos !== null) {
    gen.pos = pos;
  } else {
    return null;
  }
  return 0;
};

Dagaz.Model.functions[Dagaz.Model.ZRF_PUSH] = function(gen) {
  gen.marks.push(gen.pos);
  return 0;
};

Dagaz.Model.functions[Dagaz.Model.ZRF_POP] = function(gen) {
  if (gen.marks.length == 0) {
    return null;
  }
  gen.pos = gen.marks.pop();
  return 0;
};

Dagaz.find = function(array, value) {
  return Array.prototype.indexOf.call(array, value);
};

// if (!_.isUndefined(Array.indexOf)) {
//   Dagaz.find = function(array, value) {
//     return Array.prototype.indexOf.call(array, value);
//   };
// } else {
//   Dagaz.find = function(array, value) {
//     return _.indexOf(array, value);
//   };
// }

Dagaz.int32Array = function(array) {
  var a = new Int32Array(array.length);
  a.set(array);
  return a;
};

// if (!_.isUndefined(Int32Array)) {
//   Dagaz.int32Array = function(array) {
//     var a = new Int32Array(array.length);
//     a.set(array);
//     return a;
//   };
// } else {
//   Dagaz.int32Array = function(array) {
//     return array;
//   };
// }

/**
 * Convert a non-negative integer which represents a position of a piece into the position name strings
 * @param {number} pos 
 * @param {ZrfDesign} design 
 * @returns 
 */
Dagaz.Model.posToString = function(pos, design) {
  if (_.isUndefined(design)) {
    design = Dagaz.Model.getDesign();
  }
  if (pos < design.positionNames.length) {
    return design.positionNames[pos];
  } else {
    return "?";
  }
};

/**
 * Convert name strings of a piece position into a non-negative integer which represents the position 
 * @param {number} name 
 * @param {ZrfDesign} design 
 * @returns 
 */
Dagaz.Model.stringToPos = function(name, design) {
  if (_.isUndefined(design)) {
    design = Dagaz.Model.getDesign();
  }
  var pos = Dagaz.find(design.positionNames, name);
  if (pos >= 0) {
    return pos;
  } else {
    return null;
  }
};

Dagaz.Model.zupdate = function(value, piece, pos) {
  return value;
};

Dagaz.Model.hupdate = function(value, piece, pos) {
  return value;
};

Dagaz.Model.zplayer = function(value, player) {
  return value;
};

Dagaz.Model.hplayer = function(value, player) {
  return value;
};

/**
 * Find and return a game design (ZrfDesign). If it doesn't exist, create one.
 * @returns {ZrfDesign}
 */
Dagaz.Model.getDesign = function() {
  if (_.isUndefined(Dagaz.Model.design)) {
    Dagaz.Model.design = new ZrfDesign();
  }
  return Dagaz.Model.design;
};

Dagaz.Model.getPieceTypes = function(piece) {
  return [ piece.type ];
};

/**
 * Instantiate a ZrfMoveTemplate class
 * @returns {ZrfMoveTemplate}
 */
Dagaz.Model.createTemplate = function() {
  return new ZrfMoveTemplate();
};

Dagaz.Model.createGen = function(template, params, design, mode, serial, sound) {
  if (_.isUndefined(design)) {
    design = Dagaz.Model.getDesign();
  }
  var r = new ZrfMoveGenerator(design, mode, serial, sound);
  r.template = template;
  r.params   = Dagaz.int32Array(params);
  return r;
};

Dagaz.Model.getMark = function(gen) {
  if (gen.marks.length == 0) {
    return null;
  } else {
    var pos = gen.marks.pop();
    gen.marks.push(pos);
    return pos;
  }
};

Dagaz.Model.setMark = function(gen) {
  if (gen.marks.length > 0) {
    gen.marks.pop();
  }
  if (gen.pos !== null) {
    gen.marks.push(gen.pos);
  }
};

Dagaz.Model.getPiece = function(gen, pos) {
  if (gen.parent !== null) {
    return gen.parent.getPieceInternal(pos);
  }
  return gen.board.getPiece(pos);
};

Dagaz.Model.isLastFrom = function(pos, board) {
  if (!_.isUndefined(board.lastf)) {
    return (board.lastf == pos);
  } else {
    return false;
  }
};

Dagaz.Model.isLastTo = function(pos, board) {
  if (!_.isUndefined(board.lastt)) {
    return (board.lastt == pos);
  } else {
    return false;
  }
};

Dagaz.Model.getValueInternal = function(aThis, name, pos) {
  return null;
};

Dagaz.Model.getAttrInternal = function(gen, name, pos) {
  return null;
};

Dagaz.Model.createPiece = function(type, player) {
  if (_.isUndefined(Dagaz.Model.cachePiece)) {
    Dagaz.Model.cachePiece = [];
  }
  if (_.isUndefined(Dagaz.Model.cachePiece[player])) {
    Dagaz.Model.cachePiece[player] = [];
  }
  if (_.isUndefined(Dagaz.Model.cachePiece[player][type])) {
    Dagaz.Model.cachePiece[player][type] = new ZrfPiece(type, player);
  }
  return Dagaz.Model.cachePiece[player][type];
};

/**
 * 
 * @param {ZrfPiece} piece 
 * @returns {string}
 */
Dagaz.Model.pieceToString = function(piece) {
  return piece.getOwner() + " " + piece.getType();
};

/**
 * Set up a game design.
 * @param {ZrfDesign} design 
 */
Dagaz.Model.BuildDesign = function(design) {};

/**
 * Start a game and create the first state of a game design.
 */
Dagaz.Model.InitGame = function () {
  /** @type {ZrfDesign} */
  var design = Dagaz.Model.getDesign();
  this.BuildDesign(design);
};

/**
 * Check if a player win, lose, or draw.
 * @param {ZrfDesign} design 
 * @param {ZrfBoard} board 
 * @param {*} player 
 * @returns {(number|null)} The value means the player win (1), lose (-1), or draw (0) the game. If the method returns null, it means the game is not finished.
 */
Dagaz.Model.checkGoals = function(design, board, player) {
  var r = null;
  _.each(_.keys(design.goals), function(p) {
    var groups = _.groupBy(design.goals[p], function(goal) {
      return goal.num;
    });
    var goals  = _.map(_.keys(groups), function(num) {
      return groups[num];
    });
    var s = _.reduce(goals, function(acc, goal) {
      if (_.reduce(goal, function(acc, g) {
        var type = g.piece;
        if (!_.reduce(g.positions, function(acc, pos) {
          var piece = board.getPiece(pos);
          if ((piece !== null) && 
                                     (piece.player == p) &&
                                     (piece.type == type)) return true;
          return acc;
        }, false)) return false;
        return acc;
      }, true)) return true;
      return acc;
    }, false); 
    if (s) {
      r = (p == player) ? 1: -1; 
    }
  });
  return r;
};

Dagaz.Model.setup = function(board) {};

/**
 * Get an initial state of a board.
 * @returns {ZrfBoard}
 */
Dagaz.Model.getInitBoard = function() {
  if (_.isUndefined(Dagaz.Model.board)) {
    /** @type {ZrfDesign} */
    var design = Dagaz.Model.getDesign();
    /** @type {ZrfBoard} */
    Dagaz.Model.board = new ZrfBoard(Dagaz.Model);
    Dagaz.Model.board.reserve = design.reserve;
  }
  return Dagaz.Model.board;
};

Dagaz.Model.PostActions = function(board) {
  board.moves = _.filter(board.moves, function(m) { 
    return (_.isUndefined(m.failed));
  });
};

Dagaz.Model.CheckInvariants = function(board) {};
Dagaz.Model.Extension = function(board) {};

Dagaz.Model.getPartList = function(board, gen) {
  return [ gen.lastt ];
};

Dagaz.Model.GetCover = function(design, board) {
  if (_.isUndefined(board.cover)) {
    var b = board.copy();
    board.cover  = [];
    board.serial = [];
    for (var pos = 0; pos < design.positions.length; pos++) {
      board.cover[pos]  = [];
      board.serial[pos] = [];
      var piece = b.getPiece(pos);
      if (piece !== null) {
        piece = piece.changeOwner(0);
        b.setPiece(pos, piece);
      }
    }
    b.generateInternal(b, true, board.cover, board.serial);
  }
  return board.cover;
};

Dagaz.Model.decReserve = function(board, piece) {
  if (!_.isUndefined(board.reserve[piece.type])) {
    if (!_.isUndefined(board.reserve[piece.type][piece.player]) &&
              (board.reserve[piece.type][piece.player] > 0)) {
      board.reserve[piece.type][piece.player]--;
    }
  }
};

Dagaz.Model.incReserve = function(board, piece) {
  if (!_.isUndefined(board.reserve[piece.type])) {
    if (!_.isUndefined(board.reserve[piece.type][piece.player])) {
      board.reserve[piece.type][piece.player]++;
    }
  }
};

Dagaz.Model.noReserve = function(board, piece) {
  if (!_.isUndefined(board.reserve[piece])) {
    if (!_.isUndefined(board.reserve[piece][board.player])) {
      return (board.reserve[piece][board.player] <= 0);
    }
  }
  return false;
};

Dagaz.Model.Done = function(design, board) {};

/**
 * 
 * @param {*} mode 
 * @param {*} sound 
 * @returns {ZrfMove}
 */
Dagaz.Model.createMove = function(mode, sound) {
  var r = new ZrfMove(mode);
  r.sound = sound;
  return r;
};

Dagaz.Model.compareMove = function(move, notation) {
  return (move.toString() == notation);
};

_.mixin({
  cartesian: function(x) {
    var r = [];
    cartesian(r, [], x);
    return r;
  }
});

/**
 * 
 * @param {ZrfMove} move 
 * @param {*} part 
 * @returns {string}
 */
Dagaz.Model.moveToString = function(move, part) {
  if (move.actions.length == 0) {
    return "Pass";
  }
  var r = "";
  var l = "";
  var n = function(action) {
    var p = action[3];
    if (p < 0) {
      p = -p;
    }
    if (part == 0) {
      p = 0;
    }
    return (p == part);
  };
  _.chain(move.actions)
    .filter(n)
    .filter(function(action) {
      return (action[0] !== null) && (action[1] !== null) && 
                  (action[0] != action[1]) && (action[0][0] != action[1][0]);
    })
    .each(function(action) {
      if (l !== action[0][0]) {
        if (r.length > 0) {
          r = r + " ";
        }
        r = r + Dagaz.Model.posToString(action[0][0]);
      }
      r = r + " - ";
      r = r + Dagaz.Model.posToString(action[1][0]);
      l = action[1][0];
    });
  _.chain(move.actions)
    .filter(n)
    .filter(function(action) {
      return (action[0] !== null) && (action[1] === null);
    })
    .each(function(action) {
      if (r.length > 0) {
        r = r + " ";
      }
      r = r + "x ";
      r = r + Dagaz.Model.posToString(action[0][0]);
      l = action[0][0];
    });
  _.chain(move.actions)
    .filter(n)
    .filter(function(action) {
      return (action[0] === null) && (action[1] !== null);
    })
    .each(function(action) {  
      if (r.length > 0) {
        r = r + " ";
      }
      if ((action[2] !== null)) {
        r = r + action[2][0].toString() + " ";
      }
      r = r + Dagaz.Model.posToString(action[1][0]);
      l = "";
    });
  return r;
};

Dagaz.Model.getX = function(pos) {
  return pos % Dagaz.Model.WIDTH;
};

Dagaz.Model.getY = function(pos) {
  return (pos / Dagaz.Model.WIDTH) | 0;
};

Dagaz.Model.continue = function(design, board, str, result) {
  if (!_.isUndefined(result) && (result < 1)) return str;
  var re  = /^(\D*)(\d+)(.*)$/;
  var num = str.replace(re, "$2");
  if (num) {
    var len = num.length;
    num = +num + 1;
    while (num.toString().length < len) {
      num = "0" + num;
    }
    return str.replace(re, "$1" + num + "$3");
  }
  return null;
};

/**
 * @param {(number | undefined)} val 
 * @returns {number}
 */
Dagaz.Model.getSetupSelector = function(val) {
  if (_.isUndefined(Dagaz.Model.setupSelector)) {
    /** @type {string} */
    var str = window.location.search.toString();
    /** @type {string[]} */
    var result = str.match(/[?&]selector=([^&]*)/);
    if (result) {
      Dagaz.Model.setupSelector = +result[1];
    }
  }
  if (_.isUndefined(Dagaz.Model.setupSelector)) {
    if (!_.isUndefined(val) && (val > 1)) {
      Dagaz.Model.setupSelector = _.random(1, val);
    } else {
      Dagaz.Model.setupSelector = 1;
    }
  }
  return Dagaz.Model.setupSelector;
};

/**
 * @returns {(number | undefined)}
 */
Dagaz.Model.getResourceSelector = function() {
  return Dagaz.Model.setupSelector;
};

export { Dagaz };