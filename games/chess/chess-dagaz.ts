import { validateCastlingRights, getGoal } from "./chess-dagaz-invariant";

import type { MovementDefinitionMethod } from "../../src/types";
import type { TGameRule } from "./../../src/game_rule";

const step: MovementDefinitionMethod = function (ctx, params) {
  if (ctx.canGoTo(params, 0) && !ctx.isFriend()) {
    ctx.endMove();
  }
};

const pawnShift: MovementDefinitionMethod = function (ctx, params) {
  if (ctx.canGoTo(params, 0) && ctx.isEmpty()) {
    if (ctx.inZone(0)) {
      ctx.promote(4);
    }
    ctx.endMove();
  }
};

const pawnLeap: MovementDefinitionMethod = function (ctx, params) {
  if (ctx.canGoTo(params, 0) && ctx.isEnemy()) {
    if (ctx.inZone(0)) {
      ctx.promote(4);
    }
    ctx.endMove();
  }
};

const pawnJump: MovementDefinitionMethod = function (ctx, params) {
  if (ctx.canGoTo(params, 0) && ctx.isEmpty() && ctx.inZone(1) && ctx.canGoTo(params, 0) && ctx.isEmpty()) {
    ctx.endMove();
  }
};

const enPassant: MovementDefinitionMethod = function (ctx, params) {
  if (ctx.canGoTo(params, 0) && ctx.isEnemy() && ctx.isPiece(0)) {
    ctx.capture();
    if (ctx.canGoTo(params, 1)) {
      ctx.put();
      if (ctx.canGoTo(params, 1) && ctx.isLastFrom()) {
        ctx.endMove();
      }
    }
  }
};

const jump: MovementDefinitionMethod = function (ctx, params) {
  if (ctx.canGoTo(params, 0) && ctx.canGoTo(params, 1) && !ctx.isFriend()) {
    ctx.endMove();
  }
};

const slide: MovementDefinitionMethod = function (ctx, params) {
  while (ctx.canGoTo(params, 0)) {
    if (ctx.isFriend()) break;
    ctx.endMove();
    if (!ctx.isEmpty()) break;
  }
};

/**
 * kingside castling
 */
const O_O: MovementDefinitionMethod = function (ctx, params) {
  if (ctx.canGoTo(params, 0) && ctx.isEmpty() && ctx.canGoTo(params, 0) && ctx.isEmpty()) {
    ctx.put();
    if (ctx.canGoTo(params, 0) && ctx.isFriend() && ctx.isPiece(1)) {
      ctx.take();
      if (ctx.canGoTo(params, 1) && ctx.canGoTo(params, 1)) {
        ctx.endMove();
      }
    }
  }
};

/**
 * queenside castling
 */
const O_O_O: MovementDefinitionMethod = function (ctx, params) {
  if (ctx.canGoTo(params, 0) && ctx.isEmpty() && ctx.canGoTo(params, 0) && ctx.isEmpty()) {
    ctx.put();
    if (ctx.canGoTo(params, 0) && ctx.isEmpty() && ctx.canGoTo(params, 0) && ctx.isFriend() && ctx.isPiece(1)) {
      ctx.take();
      if (ctx.canGoTo(params, 1) && ctx.canGoTo(params, 1) && ctx.canGoTo(params, 1)) {
        ctx.endMove();
      }
    }
  }
};

export const buildGameRule = function (gameRule: TGameRule) {
  gameRule.setPlugins([getGoal, validateCastlingRights]);
  gameRule.setGameOption({ "smart-moves": false });

  gameRule
    .addDirection([
      "W", // 0
      "E", // 1
      "S", // 2
      "NE", // 3
      "N", // 4
      "SE", // 5
      "SW", // 6
      "NW" // 7
    ])
    .addPlayer(
      {
        name: "White",
        symmetry: { W: "E", E: "W", S: "N", NE: "SW", N: "S", SE: "NW", SW: "NE", NW: "SE" }
      },
      {
        name: "Black",
        symmetry: { W: "W", E: "E", S: "N", NE: "SE", N: "S", SE: "NE", SW: "NW", NW: "SW" }
      }
    )
    .addLocation(
      { name: "a8", locationDelta: [0, 1, 8, 0, 0, 9, 0, 0] },
      { name: "b8", locationDelta: [-1, 1, 8, 0, 0, 9, 7, 0] },
      { name: "c8", locationDelta: [-1, 1, 8, 0, 0, 9, 7, 0] },
      { name: "d8", locationDelta: [-1, 1, 8, 0, 0, 9, 7, 0] },
      { name: "e8", locationDelta: [-1, 1, 8, 0, 0, 9, 7, 0] },
      { name: "f8", locationDelta: [-1, 1, 8, 0, 0, 9, 7, 0] },
      { name: "g8", locationDelta: [-1, 1, 8, 0, 0, 9, 7, 0] },
      { name: "h8", locationDelta: [-1, 0, 8, 0, 0, 0, 7, 0] },
      { name: "a7", locationDelta: [0, 1, 8, -7, -8, 9, 0, 0] },
      { name: "b7", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "c7", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "d7", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "e7", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "f7", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "g7", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "h7", locationDelta: [-1, 0, 8, 0, -8, 0, 7, -9] },
      { name: "a6", locationDelta: [0, 1, 8, -7, -8, 9, 0, 0] },
      { name: "b6", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "c6", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "d6", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "e6", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "f6", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "g6", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "h6", locationDelta: [-1, 0, 8, 0, -8, 0, 7, -9] },
      { name: "a5", locationDelta: [0, 1, 8, -7, -8, 9, 0, 0] },
      { name: "b5", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "c5", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "d5", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "e5", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "f5", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "g5", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "h5", locationDelta: [-1, 0, 8, 0, -8, 0, 7, -9] },
      { name: "a4", locationDelta: [0, 1, 8, -7, -8, 9, 0, 0] },
      { name: "b4", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "c4", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "d4", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "e4", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "f4", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "g4", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "h4", locationDelta: [-1, 0, 8, 0, -8, 0, 7, -9] },
      { name: "a3", locationDelta: [0, 1, 8, -7, -8, 9, 0, 0] },
      { name: "b3", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "c3", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "d3", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "e3", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "f3", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "g3", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "h3", locationDelta: [-1, 0, 8, 0, -8, 0, 7, -9] },
      { name: "a2", locationDelta: [0, 1, 8, -7, -8, 9, 0, 0] },
      { name: "b2", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "c2", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "d2", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "e2", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "f2", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "g2", locationDelta: [-1, 1, 8, -7, -8, 9, 7, -9] },
      { name: "h2", locationDelta: [-1, 0, 8, 0, -8, 0, 7, -9] },
      { name: "a1", locationDelta: [0, 1, 0, -7, -8, 0, 0, 0] },
      { name: "b1", locationDelta: [-1, 1, 0, -7, -8, 0, 0, -9] },
      { name: "c1", locationDelta: [-1, 1, 0, -7, -8, 0, 0, -9] },
      { name: "d1", locationDelta: [-1, 1, 0, -7, -8, 0, 0, -9] },
      { name: "e1", locationDelta: [-1, 1, 0, -7, -8, 0, 0, -9] },
      { name: "f1", locationDelta: [-1, 1, 0, -7, -8, 0, 0, -9] },
      { name: "g1", locationDelta: [-1, 1, 0, -7, -8, 0, 0, -9] },
      { name: "h1", locationDelta: [-1, 0, 0, 0, -8, 0, 0, -9] }
    )
    .addZone(
      { name: "last-rank", player: 1, locations: ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"] },
      { name: "last-rank", player: 2, locations: ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"] },
      { name: "third-rank", player: 1, locations: ["a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3"] },
      { name: "third-rank", player: 2, locations: ["a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6"] }
    );

  gameRule
    .addPiece({ name: "Pawn", type: 0, price: 2 })
    .addMove(
      { pieceType: 0, func: pawnShift, params: ["N"], mode: 0 },
      { pieceType: 0, func: pawnJump, params: ["N"], mode: 0 },
      { pieceType: 0, func: pawnLeap, params: ["NW"], mode: 0 },
      { pieceType: 0, func: pawnLeap, params: ["NE"], mode: 0 },
      { pieceType: 0, func: enPassant, params: ["E", "N"], mode: 0 },
      { pieceType: 0, func: enPassant, params: ["W", "N"], mode: 0 }
    );

  gameRule
    .addPiece({ name: "Rook", type: 1, price: 10 })
    .addMove(
      { pieceType: 1, func: slide, params: ["N"], mode: 0 },
      { pieceType: 1, func: slide, params: ["S"], mode: 0 },
      { pieceType: 1, func: slide, params: ["W"], mode: 0 },
      { pieceType: 1, func: slide, params: ["E"], mode: 0 }
    );

  gameRule
    .addPiece({ name: "Knight", type: 2, price: 6 })
    .addMove(
      { pieceType: 2, func: jump, params: ["N", "NW"], mode: 0 },
      { pieceType: 2, func: jump, params: ["N", "NE"], mode: 0 },
      { pieceType: 2, func: jump, params: ["S", "SW"], mode: 0 },
      { pieceType: 2, func: jump, params: ["S", "SE"], mode: 0 },
      { pieceType: 2, func: jump, params: ["W", "NW"], mode: 0 },
      { pieceType: 2, func: jump, params: ["W", "SW"], mode: 0 },
      { pieceType: 2, func: jump, params: ["E", "NE"], mode: 0 },
      { pieceType: 2, func: jump, params: ["E", "SE"], mode: 0 }
    );

  gameRule
    .addPiece({ name: "Bishop", type: 3, price: 6 })
    .addMove(
      { pieceType: 3, func: slide, params: ["NW"], mode: 0 },
      { pieceType: 3, func: slide, params: ["SW"], mode: 0 },
      { pieceType: 3, func: slide, params: ["NE"], mode: 0 },
      { pieceType: 3, func: slide, params: ["SE"], mode: 0 }
    );

  gameRule
    .addPiece({ name: "Queen", type: 4, price: 18 })
    .addMove(
      { pieceType: 4, func: slide, params: ["N"], mode: 0 },
      { pieceType: 4, func: slide, params: ["S"], mode: 0 },
      { pieceType: 4, func: slide, params: ["W"], mode: 0 },
      { pieceType: 4, func: slide, params: ["E"], mode: 0 },
      { pieceType: 4, func: slide, params: ["NW"], mode: 0 },
      { pieceType: 4, func: slide, params: ["SW"], mode: 0 },
      { pieceType: 4, func: slide, params: ["NE"], mode: 0 },
      { pieceType: 4, func: slide, params: ["SE"], mode: 0 }
    );

  gameRule
    .addPiece({ name: "King", type: 5, price: 1000 })
    .addMove(
      { pieceType: 5, func: step, params: ["N"], mode: 0 },
      { pieceType: 5, func: step, params: ["S"], mode: 0 },
      { pieceType: 5, func: step, params: ["W"], mode: 0 },
      { pieceType: 5, func: step, params: ["E"], mode: 0 },
      { pieceType: 5, func: step, params: ["NW"], mode: 0 },
      { pieceType: 5, func: step, params: ["SW"], mode: 0 },
      { pieceType: 5, func: step, params: ["NE"], mode: 0 },
      { pieceType: 5, func: step, params: ["SE"], mode: 0 },
      { pieceType: 5, func: O_O, params: ["E", "W"], mode: 1 },
      { pieceType: 5, func: O_O_O, params: ["W", "E"], mode: 1 }
    );

  gameRule.setInitialPieces(
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
  );
};
