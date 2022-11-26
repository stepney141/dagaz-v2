import type { GameRuleTemplate, MovementDefinitionMethod } from "../../src/types";

const step: MovementDefinitionMethod = function (ctx, params) {
  if (ctx.go(params, 0) && !ctx.isFriend()) {
    ctx.end();
  }
};

const pawnShift: MovementDefinitionMethod = function (ctx, params) {
  if (ctx.go(params, 0) && ctx.isEmpty()) {
    if (ctx.inZone(0)) {
      ctx.promote(4);
    }
    ctx.end();
  }
};

const pawnLeap: MovementDefinitionMethod = function (ctx, params) {
  if (ctx.go(params, 0) && ctx.isEnemy()) {
    if (ctx.inZone(0)) {
      ctx.promote(4);
    }
    ctx.end();
  }
};

const pawnJump: MovementDefinitionMethod = function (ctx, params) {
  if (ctx.go(params, 0) && ctx.isEmpty() && ctx.inZone(1) && ctx.go(params, 0) && ctx.isEmpty()) {
    ctx.end();
  }
};

const enPassant: MovementDefinitionMethod = function (ctx, params) {
  if (ctx.go(params, 0) && ctx.isEnemy() && ctx.isPiece(0)) {
    ctx.capture();
    if (ctx.go(params, 1)) {
      ctx.put();
      if (ctx.go(params, 1) && ctx.isLastFrom()) {
        ctx.end();
      }
    }
  }
};

const jump: MovementDefinitionMethod = function (ctx, params) {
  if (ctx.go(params, 0) && ctx.go(params, 1) && !ctx.isFriend()) {
    ctx.end();
  }
};

const slide: MovementDefinitionMethod = function (ctx, params) {
  while (ctx.go(params, 0)) {
    if (ctx.isFriend()) break;
    ctx.end();
    if (!ctx.isEmpty()) break;
  }
};

/**
 * kingside castling
 */
const O_O: MovementDefinitionMethod = function (ctx, params) {
  if (ctx.go(params, 0) && ctx.isEmpty() && ctx.go(params, 0) && ctx.isEmpty()) {
    ctx.put();
    if (ctx.go(params, 0) && ctx.isFriend() && ctx.isPiece(1)) {
      ctx.take();
      if (ctx.go(params, 1) && ctx.go(params, 1)) {
        ctx.end();
      }
    }
  }
};

/**
 * queenside castling
 */
const O_O_O: MovementDefinitionMethod = function (ctx, params) {
  if (ctx.go(params, 0) && ctx.isEmpty() && ctx.go(params, 0) && ctx.isEmpty()) {
    ctx.put();
    if (ctx.go(params, 0) && ctx.isEmpty() && ctx.go(params, 0) && ctx.isFriend() && ctx.isPiece(1)) {
      ctx.take();
      if (ctx.go(params, 1) && ctx.go(params, 1) && ctx.go(params, 1)) {
        ctx.end();
      }
    }
  }
};

export const basicGameRule: GameRuleTemplate = {
  gameOptions: {
    "smart-moves": false
  },

  directions: [
    "w", // 0
    "e", // 1
    "s", // 2
    "ne", // 3
    "n", // 4
    "se", // 5
    "sw", // 6
    "nw" // 7
  ],

  players: [
    {
      name: "White",
      symmetry: [1, 0, 4, 6, 2, 7, 3, 5] // [e, w, n, sw, s, nw, ne, se]
    },
    {
      name: "Black",
      symmetry: [0, 1, 4, 5, 2, 3, 7, 6] // [w, e, n, se, s, ne, nw, sw]
    }
  ],

  locations: [
    { name: "a8", offsets: [0, 1, 8, 0, 0, 9, 0, 0] },
    { name: "b8", offsets: [-1, 1, 8, 0, 0, 9, 7, 0] },
    { name: "c8", offsets: [-1, 1, 8, 0, 0, 9, 7, 0] },
    { name: "d8", offsets: [-1, 1, 8, 0, 0, 9, 7, 0] },
    { name: "e8", offsets: [-1, 1, 8, 0, 0, 9, 7, 0] },
    { name: "f8", offsets: [-1, 1, 8, 0, 0, 9, 7, 0] },
    { name: "g8", offsets: [-1, 1, 8, 0, 0, 9, 7, 0] },
    { name: "h8", offsets: [-1, 0, 8, 0, 0, 0, 7, 0] },
    { name: "a7", offsets: [0, 1, 8, -7, -8, 9, 0, 0] },
    { name: "b7", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "c7", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "d7", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "e7", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "f7", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "g7", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "h7", offsets: [-1, 0, 8, 0, -8, 0, 7, -9] },
    { name: "a6", offsets: [0, 1, 8, -7, -8, 9, 0, 0] },
    { name: "b6", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "c6", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "d6", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "e6", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "f6", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "g6", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "h6", offsets: [-1, 0, 8, 0, -8, 0, 7, -9] },
    { name: "a5", offsets: [0, 1, 8, -7, -8, 9, 0, 0] },
    { name: "b5", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "c5", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "d5", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "e5", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "f5", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "g5", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "h5", offsets: [-1, 0, 8, 0, -8, 0, 7, -9] },
    { name: "a4", offsets: [0, 1, 8, -7, -8, 9, 0, 0] },
    { name: "b4", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "c4", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "d4", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "e4", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "f4", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "g4", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "h4", offsets: [-1, 0, 8, 0, -8, 0, 7, -9] },
    { name: "a3", offsets: [0, 1, 8, -7, -8, 9, 0, 0] },
    { name: "b3", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "c3", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "d3", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "e3", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "f3", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "g3", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "h3", offsets: [-1, 0, 8, 0, -8, 0, 7, -9] },
    { name: "a2", offsets: [0, 1, 8, -7, -8, 9, 0, 0] },
    { name: "b2", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "c2", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "d2", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "e2", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "f2", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "g2", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "h2", offsets: [-1, 0, 8, 0, -8, 0, 7, -9] },
    { name: "a1", offsets: [0, 1, 0, -7, -8, 0, 0, 0] },
    { name: "b1", offsets: [-1, 1, 0, -7, -8, 0, 0, -9] },
    { name: "c1", offsets: [-1, 1, 0, -7, -8, 0, 0, -9] },
    { name: "d1", offsets: [-1, 1, 0, -7, -8, 0, 0, -9] },
    { name: "e1", offsets: [-1, 1, 0, -7, -8, 0, 0, -9] },
    { name: "f1", offsets: [-1, 1, 0, -7, -8, 0, 0, -9] },
    { name: "g1", offsets: [-1, 1, 0, -7, -8, 0, 0, -9] },
    { name: "h1", offsets: [-1, 0, 0, 0, -8, 0, 0, -9] }
  ],

  zones: [
    { name: "last-rank", player: 1, locations: ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"] },
    { name: "last-rank", player: 2, locations: ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"] },
    { name: "third-rank", player: 1, locations: ["a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3"] },
    { name: "third-rank", player: 2, locations: ["a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6"] }
  ],

  pieces: [
    { name: "Pawn", type: 0, price: 2 },
    { name: "Rook", type: 1, price: 10 },
    { name: "Knight", type: 2, price: 6 },
    { name: "Bishop", type: 3, price: 6 },
    { name: "Queen", type: 4, price: 18 },
    { name: "King", type: 5, price: 1000 }
  ],

  moves: [
    { pieceType: 0, func: pawnShift, params: [4], mode: 0 },
    { pieceType: 0, func: pawnJump, params: [4], mode: 0 },
    { pieceType: 0, func: pawnLeap, params: [7], mode: 0 },
    { pieceType: 0, func: pawnLeap, params: [3], mode: 0 },
    { pieceType: 0, func: enPassant, params: [1, 4], mode: 0 },
    { pieceType: 0, func: enPassant, params: [0, 4], mode: 0 },
    { pieceType: 1, func: slide, params: [4], mode: 0 },
    { pieceType: 1, func: slide, params: [2], mode: 0 },
    { pieceType: 1, func: slide, params: [0], mode: 0 },
    { pieceType: 1, func: slide, params: [1], mode: 0 },
    { pieceType: 2, func: jump, params: [4, 7], mode: 0 },
    { pieceType: 2, func: jump, params: [4, 3], mode: 0 },
    { pieceType: 2, func: jump, params: [2, 6], mode: 0 },
    { pieceType: 2, func: jump, params: [2, 5], mode: 0 },
    { pieceType: 2, func: jump, params: [0, 7], mode: 0 },
    { pieceType: 2, func: jump, params: [0, 6], mode: 0 },
    { pieceType: 2, func: jump, params: [1, 3], mode: 0 },
    { pieceType: 2, func: jump, params: [1, 5], mode: 0 },
    { pieceType: 3, func: slide, params: [7], mode: 0 },
    { pieceType: 3, func: slide, params: [6], mode: 0 },
    { pieceType: 3, func: slide, params: [3], mode: 0 },
    { pieceType: 3, func: slide, params: [5], mode: 0 },
    { pieceType: 4, func: slide, params: [4], mode: 0 },
    { pieceType: 4, func: slide, params: [2], mode: 0 },
    { pieceType: 4, func: slide, params: [0], mode: 0 },
    { pieceType: 4, func: slide, params: [1], mode: 0 },
    { pieceType: 4, func: slide, params: [7], mode: 0 },
    { pieceType: 4, func: slide, params: [6], mode: 0 },
    { pieceType: 4, func: slide, params: [3], mode: 0 },
    { pieceType: 4, func: slide, params: [5], mode: 0 },
    { pieceType: 5, func: step, params: [4], mode: 0 },
    { pieceType: 5, func: step, params: [2], mode: 0 },
    { pieceType: 5, func: step, params: [0], mode: 0 },
    { pieceType: 5, func: step, params: [1], mode: 0 },
    { pieceType: 5, func: step, params: [7], mode: 0 },
    { pieceType: 5, func: step, params: [6], mode: 0 },
    { pieceType: 5, func: step, params: [3], mode: 0 },
    { pieceType: 5, func: step, params: [5], mode: 0 },
    { pieceType: 5, func: O_O, params: [1, 0], mode: 1 },
    { pieceType: 5, func: O_O_O, params: [0, 1], mode: 1 }
  ],

  initialPosition: [
    {
      player: "White",
      pieceName: "Pawn",
      locations: ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"]
    },
    { player: "White", pieceName: "Rook", locations: ["a1", "h1"] },
    { player: "White", pieceName: "Knight", locations: ["b1", "g1"] },
    { player: "White", pieceName: "Bishop", locations: ["c1", "f1"] },
    { player: "White", pieceName: "Queen", locations: ["d1"] },
    { player: "White", pieceName: "King", locations: ["e1"] },
    {
      player: "Black",
      pieceName: "Pawn",
      locations: ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"]
    },
    { player: "Black", pieceName: "Rook", locations: ["a8", "h8"] },
    { player: "Black", pieceName: "Knight", locations: ["b8", "g8"] },
    { player: "Black", pieceName: "Bishop", locations: ["c8", "f8"] },
    { player: "Black", pieceName: "Queen", locations: ["d8"] },
    { player: "Black", pieceName: "King", locations: ["e8"] }
  ]
};
