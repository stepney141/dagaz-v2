import type { GameRuleTemplate, MovementDefinitionMethod } from "../../src/types";

const shiftMan: MovementDefinitionMethod = function (ctx, params) {
  if (ctx.go(params, 0) && ctx.isEmpty()) {
    if (ctx.inZone(0)) {
      ctx.promote(1);
    }
    ctx.end();
  }
};

const jumpMan: MovementDefinitionMethod = function (ctx, params) {
  if (ctx.go(params, 0) && ctx.isEnemy()) {
    ctx.capture();
    if (ctx.go(params, 0) && ctx.isEmpty()) {
      if (ctx.inZone(0)) {
        ctx.promote(1);
        ctx.end(1);
      } else {
        ctx.end(1);
      }
    }
  }
};

const shiftKing: MovementDefinitionMethod = function (ctx, params) {
  while (ctx.go(params, 0) && ctx.isEmpty()) {
    ctx.end();
  }
};

const jumpKing: MovementDefinitionMethod = function (ctx, params) {
  while (ctx.go(params, 0)) {
    if (!ctx.isEmpty()) break;
  }
  if (ctx.isEnemy()) {
    ctx.capture();
    while (ctx.go(params, 0) && ctx.isEmpty()) {
      ctx.end(2);
    }
  }
};

const contKing: MovementDefinitionMethod = function (ctx, params) {
  while (ctx.go(params, 0)) {
    if (!ctx.isEmpty()) break;
    if (ctx.isLastFrom()) return;
  }
  if (ctx.isEnemy()) {
    ctx.capture();
    while (ctx.go(params, 0) && ctx.isEmpty()) {
      ctx.end(2);
    }
  }
};

export const basicGameRule: GameRuleTemplate = {
  gameOptions: {
    "smart-moves": true,
    "deferred-captures": true
  },

  directions: [
    "ne", // 0
    "se", // 1
    "sw", // 2
    "nw" // 3
  ],

  players: [
    { name: "White", symmetry: [2, 3, 0, 1] },
    { name: "Black", symmetry: [2, 3, 0, 1] }
  ],

  locations: [
    { name: "a8", offsets: [0, 9, 0, 0] },
    { name: "b8", offsets: [0, 9, 7, 0] },
    { name: "c8", offsets: [0, 9, 7, 0] },
    { name: "d8", offsets: [0, 9, 7, 0] },
    { name: "e8", offsets: [0, 9, 7, 0] },
    { name: "f8", offsets: [0, 9, 7, 0] },
    { name: "g8", offsets: [0, 9, 7, 0] },
    { name: "h8", offsets: [0, 0, 7, 0] },
    { name: "a7", offsets: [-7, 9, 0, 0] },
    { name: "b7", offsets: [-7, 9, 7, -9] },
    { name: "c7", offsets: [-7, 9, 7, -9] },
    { name: "d7", offsets: [-7, 9, 7, -9] },
    { name: "e7", offsets: [-7, 9, 7, -9] },
    { name: "f7", offsets: [-7, 9, 7, -9] },
    { name: "g7", offsets: [-7, 9, 7, -9] },
    { name: "h7", offsets: [0, 0, 7, -9] },
    { name: "a6", offsets: [-7, 9, 0, 0] },
    { name: "b6", offsets: [-7, 9, 7, -9] },
    { name: "c6", offsets: [-7, 9, 7, -9] },
    { name: "d6", offsets: [-7, 9, 7, -9] },
    { name: "e6", offsets: [-7, 9, 7, -9] },
    { name: "f6", offsets: [-7, 9, 7, -9] },
    { name: "g6", offsets: [-7, 9, 7, -9] },
    { name: "h6", offsets: [0, 0, 7, -9] },
    { name: "a5", offsets: [-7, 9, 0, 0] },
    { name: "b5", offsets: [-7, 9, 7, -9] },
    { name: "c5", offsets: [-7, 9, 7, -9] },
    { name: "d5", offsets: [-7, 9, 7, -9] },
    { name: "e5", offsets: [-7, 9, 7, -9] },
    { name: "f5", offsets: [-7, 9, 7, -9] },
    { name: "g5", offsets: [-7, 9, 7, -9] },
    { name: "h5", offsets: [0, 0, 7, -9] },
    { name: "a4", offsets: [-7, 9, 0, 0] },
    { name: "b4", offsets: [-7, 9, 7, -9] },
    { name: "c4", offsets: [-7, 9, 7, -9] },
    { name: "d4", offsets: [-7, 9, 7, -9] },
    { name: "e4", offsets: [-7, 9, 7, -9] },
    { name: "f4", offsets: [-7, 9, 7, -9] },
    { name: "g4", offsets: [-7, 9, 7, -9] },
    { name: "h4", offsets: [0, 0, 7, -9] },
    { name: "a3", offsets: [-7, 9, 0, 0] },
    { name: "b3", offsets: [-7, 9, 7, -9] },
    { name: "c3", offsets: [-7, 9, 7, -9] },
    { name: "d3", offsets: [-7, 9, 7, -9] },
    { name: "e3", offsets: [-7, 9, 7, -9] },
    { name: "f3", offsets: [-7, 9, 7, -9] },
    { name: "g3", offsets: [-7, 9, 7, -9] },
    { name: "h3", offsets: [0, 0, 7, -9] },
    { name: "a2", offsets: [-7, 9, 0, 0] },
    { name: "b2", offsets: [-7, 9, 7, -9] },
    { name: "c2", offsets: [-7, 9, 7, -9] },
    { name: "d2", offsets: [-7, 9, 7, -9] },
    { name: "e2", offsets: [-7, 9, 7, -9] },
    { name: "f2", offsets: [-7, 9, 7, -9] },
    { name: "g2", offsets: [-7, 9, 7, -9] },
    { name: "h2", offsets: [0, 0, 7, -9] },
    { name: "a1", offsets: [-7, 0, 0, 0] },
    { name: "b1", offsets: [-7, 0, 0, -9] },
    { name: "c1", offsets: [-7, 0, 0, -9] },
    { name: "d1", offsets: [-7, 0, 0, -9] },
    { name: "e1", offsets: [-7, 0, 0, -9] },
    { name: "f1", offsets: [-7, 0, 0, -9] },
    { name: "g1", offsets: [-7, 0, 0, -9] },
    { name: "h1", offsets: [0, 0, 0, -9] }
  ],

  zones: [
    { name: "promotion", player: 2, locations: ["a1", "c1", "e1", "g1"] },
    { name: "promotion", player: 1, locations: ["b8", "d8", "f8", "h8"] }
  ],

  movePriority: [
    1, // jump-type
    0 // normal-type
  ],

  pieces: [
    { name: "Man", type: 0, price: 20 },
    { name: "King", type: 1, price: 100 }
  ],

  moves: [
    { pieceType: 0, func: jumpMan, params: [3], mode: 1 },
    { pieceType: 0, func: jumpMan, params: [0], mode: 1 },
    { pieceType: 0, func: jumpMan, params: [2], mode: 1 },
    { pieceType: 0, func: jumpMan, params: [1], mode: 1 },
    { pieceType: 0, func: shiftMan, params: [3], mode: 0 },
    { pieceType: 0, func: shiftMan, params: [0], mode: 0 },
    { pieceType: 1, func: jumpKing, params: [3], mode: 1 },
    { pieceType: 1, func: jumpKing, params: [0], mode: 1 },
    { pieceType: 1, func: jumpKing, params: [2], mode: 1 },
    { pieceType: 1, func: jumpKing, params: [1], mode: 1 },
    { pieceType: 1, func: contKing, params: [3], mode: 2 },
    { pieceType: 1, func: contKing, params: [0], mode: 2 },
    { pieceType: 1, func: contKing, params: [2], mode: 2 },
    { pieceType: 1, func: contKing, params: [1], mode: 2 },
    { pieceType: 1, func: shiftKing, params: [3], mode: 0 },
    { pieceType: 1, func: shiftKing, params: [0], mode: 0 },
    { pieceType: 1, func: shiftKing, params: [2], mode: 0 },
    { pieceType: 1, func: shiftKing, params: [1], mode: 0 }
  ],

  initialPosition: [
    {
      player: "White",
      pieceName: "Man",
      locations: ["a3", "c3", "e3", "g3", "b2", "d2", "f2", "h2", "a1", "c1", "e1", "g1"]
    },
    {
      player: "Black",
      pieceName: "Man",
      locations: ["b8", "d8", "f8", "h8", "a7", "c7", "e7", "g7", "b6", "d6", "f6", "h6"]
    }
  ]
};
