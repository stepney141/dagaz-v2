import type { GameRuleTemplate, MovementDefinitionMethod } from "../../src/types";

const shiftMan: MovementDefinitionMethod = function (ctx, params) {
  if (ctx.go(params, 0) && ctx.isEmpty()) {
    ctx.end();
  }
};

const jumpMan: MovementDefinitionMethod = function (ctx, params) {
  if (ctx.go(params, 0) && ctx.isEnemy()) {
    ctx.capture();
    if (ctx.go(params, 0) && ctx.isEmpty()) {
      ctx.end(1);
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
    "maximal-captures": true,
    "deferred-captures": true
  },

  directions: [
    "se", // 0
    "sw", // 1
    "ne", // 2
    "nw" // 3
  ],

  players: [
    { name: "White", symmetry: [3, 2, 1, 0] },
    { name: "Black", symmetry: [3, 2, 1, 0] }
  ],

  locations: [
    { name: "a10", offsets: [11, 0, 0, 0] },
    { name: "b10", offsets: [11, 9, 0, 0] },
    { name: "c10", offsets: [11, 9, 0, 0] },
    { name: "d10", offsets: [11, 9, 0, 0] },
    { name: "e10", offsets: [11, 9, 0, 0] },
    { name: "f10", offsets: [11, 9, 0, 0] },
    { name: "g10", offsets: [11, 9, 0, 0] },
    { name: "h10", offsets: [11, 9, 0, 0] },
    { name: "i10", offsets: [11, 9, 0, 0] },
    { name: "j10", offsets: [0, 9, 0, 0] },
    { name: "a9", offsets: [11, 0, -9, 0] },
    { name: "b9", offsets: [11, 9, -9, -11] },
    { name: "c9", offsets: [11, 9, -9, -11] },
    { name: "d9", offsets: [11, 9, -9, -11] },
    { name: "e9", offsets: [11, 9, -9, -11] },
    { name: "f9", offsets: [11, 9, -9, -11] },
    { name: "g9", offsets: [11, 9, -9, -11] },
    { name: "h9", offsets: [11, 9, -9, -11] },
    { name: "i9", offsets: [11, 9, -9, -11] },
    { name: "j9", offsets: [0, 9, 0, -11] },
    { name: "a8", offsets: [11, 0, -9, 0] },
    { name: "b8", offsets: [11, 9, -9, -11] },
    { name: "c8", offsets: [11, 9, -9, -11] },
    { name: "d8", offsets: [11, 9, -9, -11] },
    { name: "e8", offsets: [11, 9, -9, -11] },
    { name: "f8", offsets: [11, 9, -9, -11] },
    { name: "g8", offsets: [11, 9, -9, -11] },
    { name: "h8", offsets: [11, 9, -9, -11] },
    { name: "i8", offsets: [11, 9, -9, -11] },
    { name: "j8", offsets: [0, 9, 0, -11] },
    { name: "a7", offsets: [11, 0, -9, 0] },
    { name: "b7", offsets: [11, 9, -9, -11] },
    { name: "c7", offsets: [11, 9, -9, -11] },
    { name: "d7", offsets: [11, 9, -9, -11] },
    { name: "e7", offsets: [11, 9, -9, -11] },
    { name: "f7", offsets: [11, 9, -9, -11] },
    { name: "g7", offsets: [11, 9, -9, -11] },
    { name: "h7", offsets: [11, 9, -9, -11] },
    { name: "i7", offsets: [11, 9, -9, -11] },
    { name: "j7", offsets: [0, 9, 0, -11] },
    { name: "a6", offsets: [11, 0, -9, 0] },
    { name: "b6", offsets: [11, 9, -9, -11] },
    { name: "c6", offsets: [11, 9, -9, -11] },
    { name: "d6", offsets: [11, 9, -9, -11] },
    { name: "e6", offsets: [11, 9, -9, -11] },
    { name: "f6", offsets: [11, 9, -9, -11] },
    { name: "g6", offsets: [11, 9, -9, -11] },
    { name: "h6", offsets: [11, 9, -9, -11] },
    { name: "i6", offsets: [11, 9, -9, -11] },
    { name: "j6", offsets: [0, 9, 0, -11] },
    { name: "a5", offsets: [11, 0, -9, 0] },
    { name: "b5", offsets: [11, 9, -9, -11] },
    { name: "c5", offsets: [11, 9, -9, -11] },
    { name: "d5", offsets: [11, 9, -9, -11] },
    { name: "e5", offsets: [11, 9, -9, -11] },
    { name: "f5", offsets: [11, 9, -9, -11] },
    { name: "g5", offsets: [11, 9, -9, -11] },
    { name: "h5", offsets: [11, 9, -9, -11] },
    { name: "i5", offsets: [11, 9, -9, -11] },
    { name: "j5", offsets: [0, 9, 0, -11] },
    { name: "a4", offsets: [11, 0, -9, 0] },
    { name: "b4", offsets: [11, 9, -9, -11] },
    { name: "c4", offsets: [11, 9, -9, -11] },
    { name: "d4", offsets: [11, 9, -9, -11] },
    { name: "e4", offsets: [11, 9, -9, -11] },
    { name: "f4", offsets: [11, 9, -9, -11] },
    { name: "g4", offsets: [11, 9, -9, -11] },
    { name: "h4", offsets: [11, 9, -9, -11] },
    { name: "i4", offsets: [11, 9, -9, -11] },
    { name: "j4", offsets: [0, 9, 0, -11] },
    { name: "a3", offsets: [11, 0, -9, 0] },
    { name: "b3", offsets: [11, 9, -9, -11] },
    { name: "c3", offsets: [11, 9, -9, -11] },
    { name: "d3", offsets: [11, 9, -9, -11] },
    { name: "e3", offsets: [11, 9, -9, -11] },
    { name: "f3", offsets: [11, 9, -9, -11] },
    { name: "g3", offsets: [11, 9, -9, -11] },
    { name: "h3", offsets: [11, 9, -9, -11] },
    { name: "i3", offsets: [11, 9, -9, -11] },
    { name: "j3", offsets: [0, 9, 0, -11] },
    { name: "a2", offsets: [11, 0, -9, 0] },
    { name: "b2", offsets: [11, 9, -9, -11] },
    { name: "c2", offsets: [11, 9, -9, -11] },
    { name: "d2", offsets: [11, 9, -9, -11] },
    { name: "e2", offsets: [11, 9, -9, -11] },
    { name: "f2", offsets: [11, 9, -9, -11] },
    { name: "g2", offsets: [11, 9, -9, -11] },
    { name: "h2", offsets: [11, 9, -9, -11] },
    { name: "i2", offsets: [11, 9, -9, -11] },
    { name: "j2", offsets: [0, 9, 0, -11] },
    { name: "a1", offsets: [0, 0, -9, 0] },
    { name: "b1", offsets: [0, 0, -9, -11] },
    { name: "c1", offsets: [0, 0, -9, -11] },
    { name: "d1", offsets: [0, 0, -9, -11] },
    { name: "e1", offsets: [0, 0, -9, -11] },
    { name: "f1", offsets: [0, 0, -9, -11] },
    { name: "g1", offsets: [0, 0, -9, -11] },
    { name: "h1", offsets: [0, 0, -9, -11] },
    { name: "i1", offsets: [0, 0, -9, -11] },
    { name: "j1", offsets: [0, 0, 0, -11] }
  ],

  zones: [
    { name: "promotion", player: 2, locations: ["a1", "c1", "e1", "g1", "i1"] },
    { name: "promotion", player: 1, locations: ["b10", "d10", "f10", "h10", "j10"] }
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
    { pieceType: 0, func: shiftMan, params: [2], mode: 0 },
    { pieceType: 0, func: shiftMan, params: [3], mode: 0 },
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
      locations: [
        "a1",
        "c1",
        "e1",
        "g1",
        "i1",
        "b2",
        "d2",
        "f2",
        "h2",
        "j2",
        "a3",
        "c3",
        "e3",
        "g3",
        "i3",
        "b4",
        "d4",
        "f4",
        "h4",
        "j4"
      ]
    },
    {
      player: "Black",
      pieceName: "Man",
      locations: [
        "b10",
        "d10",
        "f10",
        "h10",
        "j10",
        "a9",
        "c9",
        "e9",
        "g9",
        "i9",
        "b8",
        "d8",
        "f8",
        "h8",
        "j8",
        "a7",
        "c7",
        "e7",
        "g7",
        "i7"
      ]
    }
  ]
};
