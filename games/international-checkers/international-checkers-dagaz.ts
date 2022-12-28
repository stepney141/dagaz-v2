import type { MovementDefinitionMethod } from "../../src/types";
import type { TGameRule } from "./../../src/design";

const shiftMan: MovementDefinitionMethod = function (ctx, params) {
  if (ctx.canGoTo(params, 0) && ctx.isEmpty()) {
    ctx.endMove();
  }
};

const jumpMan: MovementDefinitionMethod = function (ctx, params) {
  if (ctx.canGoTo(params, 0) && ctx.isEnemy()) {
    ctx.capture();
    if (ctx.canGoTo(params, 0) && ctx.isEmpty()) {
      ctx.endMove(1);
    }
  }
};

const shiftKing: MovementDefinitionMethod = function (ctx, params) {
  while (ctx.canGoTo(params, 0) && ctx.isEmpty()) {
    ctx.endMove();
  }
};

const jumpKing: MovementDefinitionMethod = function (ctx, params) {
  while (ctx.canGoTo(params, 0)) {
    if (!ctx.isEmpty()) break;
  }
  if (ctx.isEnemy()) {
    ctx.capture();
    while (ctx.canGoTo(params, 0) && ctx.isEmpty()) {
      ctx.endMove(2);
    }
  }
};

const contKing: MovementDefinitionMethod = function (ctx, params) {
  while (ctx.canGoTo(params, 0)) {
    if (!ctx.isEmpty()) break;
    if (ctx.isLastFrom()) return;
  }
  if (ctx.isEnemy()) {
    ctx.capture();
    while (ctx.canGoTo(params, 0) && ctx.isEmpty()) {
      ctx.endMove(2);
    }
  }
};

export const buildDesign = function (gameRule: TGameRule) {
  gameRule.setGameOption({ "smart-moves": true, "maximal-captures": true, "deferred-captures": true });

  gameRule
    .addDirection([
      "se", // 0
      "sw", // 1
      "ne", // 2
      "nw" // 3
    ])
    .addPlayer({ name: "White", symmetry: [3, 2, 1, 0] }, { name: "Black", symmetry: [3, 2, 1, 0] })
    .addLocation(
      { name: "a10", locationDelta: [11, 0, 0, 0] },
      { name: "b10", locationDelta: [11, 9, 0, 0] },
      { name: "c10", locationDelta: [11, 9, 0, 0] },
      { name: "d10", locationDelta: [11, 9, 0, 0] },
      { name: "e10", locationDelta: [11, 9, 0, 0] },
      { name: "f10", locationDelta: [11, 9, 0, 0] },
      { name: "g10", locationDelta: [11, 9, 0, 0] },
      { name: "h10", locationDelta: [11, 9, 0, 0] },
      { name: "i10", locationDelta: [11, 9, 0, 0] },
      { name: "j10", locationDelta: [0, 9, 0, 0] },
      { name: "a9", locationDelta: [11, 0, -9, 0] },
      { name: "b9", locationDelta: [11, 9, -9, -11] },
      { name: "c9", locationDelta: [11, 9, -9, -11] },
      { name: "d9", locationDelta: [11, 9, -9, -11] },
      { name: "e9", locationDelta: [11, 9, -9, -11] },
      { name: "f9", locationDelta: [11, 9, -9, -11] },
      { name: "g9", locationDelta: [11, 9, -9, -11] },
      { name: "h9", locationDelta: [11, 9, -9, -11] },
      { name: "i9", locationDelta: [11, 9, -9, -11] },
      { name: "j9", locationDelta: [0, 9, 0, -11] },
      { name: "a8", locationDelta: [11, 0, -9, 0] },
      { name: "b8", locationDelta: [11, 9, -9, -11] },
      { name: "c8", locationDelta: [11, 9, -9, -11] },
      { name: "d8", locationDelta: [11, 9, -9, -11] },
      { name: "e8", locationDelta: [11, 9, -9, -11] },
      { name: "f8", locationDelta: [11, 9, -9, -11] },
      { name: "g8", locationDelta: [11, 9, -9, -11] },
      { name: "h8", locationDelta: [11, 9, -9, -11] },
      { name: "i8", locationDelta: [11, 9, -9, -11] },
      { name: "j8", locationDelta: [0, 9, 0, -11] },
      { name: "a7", locationDelta: [11, 0, -9, 0] },
      { name: "b7", locationDelta: [11, 9, -9, -11] },
      { name: "c7", locationDelta: [11, 9, -9, -11] },
      { name: "d7", locationDelta: [11, 9, -9, -11] },
      { name: "e7", locationDelta: [11, 9, -9, -11] },
      { name: "f7", locationDelta: [11, 9, -9, -11] },
      { name: "g7", locationDelta: [11, 9, -9, -11] },
      { name: "h7", locationDelta: [11, 9, -9, -11] },
      { name: "i7", locationDelta: [11, 9, -9, -11] },
      { name: "j7", locationDelta: [0, 9, 0, -11] },
      { name: "a6", locationDelta: [11, 0, -9, 0] },
      { name: "b6", locationDelta: [11, 9, -9, -11] },
      { name: "c6", locationDelta: [11, 9, -9, -11] },
      { name: "d6", locationDelta: [11, 9, -9, -11] },
      { name: "e6", locationDelta: [11, 9, -9, -11] },
      { name: "f6", locationDelta: [11, 9, -9, -11] },
      { name: "g6", locationDelta: [11, 9, -9, -11] },
      { name: "h6", locationDelta: [11, 9, -9, -11] },
      { name: "i6", locationDelta: [11, 9, -9, -11] },
      { name: "j6", locationDelta: [0, 9, 0, -11] },
      { name: "a5", locationDelta: [11, 0, -9, 0] },
      { name: "b5", locationDelta: [11, 9, -9, -11] },
      { name: "c5", locationDelta: [11, 9, -9, -11] },
      { name: "d5", locationDelta: [11, 9, -9, -11] },
      { name: "e5", locationDelta: [11, 9, -9, -11] },
      { name: "f5", locationDelta: [11, 9, -9, -11] },
      { name: "g5", locationDelta: [11, 9, -9, -11] },
      { name: "h5", locationDelta: [11, 9, -9, -11] },
      { name: "i5", locationDelta: [11, 9, -9, -11] },
      { name: "j5", locationDelta: [0, 9, 0, -11] },
      { name: "a4", locationDelta: [11, 0, -9, 0] },
      { name: "b4", locationDelta: [11, 9, -9, -11] },
      { name: "c4", locationDelta: [11, 9, -9, -11] },
      { name: "d4", locationDelta: [11, 9, -9, -11] },
      { name: "e4", locationDelta: [11, 9, -9, -11] },
      { name: "f4", locationDelta: [11, 9, -9, -11] },
      { name: "g4", locationDelta: [11, 9, -9, -11] },
      { name: "h4", locationDelta: [11, 9, -9, -11] },
      { name: "i4", locationDelta: [11, 9, -9, -11] },
      { name: "j4", locationDelta: [0, 9, 0, -11] },
      { name: "a3", locationDelta: [11, 0, -9, 0] },
      { name: "b3", locationDelta: [11, 9, -9, -11] },
      { name: "c3", locationDelta: [11, 9, -9, -11] },
      { name: "d3", locationDelta: [11, 9, -9, -11] },
      { name: "e3", locationDelta: [11, 9, -9, -11] },
      { name: "f3", locationDelta: [11, 9, -9, -11] },
      { name: "g3", locationDelta: [11, 9, -9, -11] },
      { name: "h3", locationDelta: [11, 9, -9, -11] },
      { name: "i3", locationDelta: [11, 9, -9, -11] },
      { name: "j3", locationDelta: [0, 9, 0, -11] },
      { name: "a2", locationDelta: [11, 0, -9, 0] },
      { name: "b2", locationDelta: [11, 9, -9, -11] },
      { name: "c2", locationDelta: [11, 9, -9, -11] },
      { name: "d2", locationDelta: [11, 9, -9, -11] },
      { name: "e2", locationDelta: [11, 9, -9, -11] },
      { name: "f2", locationDelta: [11, 9, -9, -11] },
      { name: "g2", locationDelta: [11, 9, -9, -11] },
      { name: "h2", locationDelta: [11, 9, -9, -11] },
      { name: "i2", locationDelta: [11, 9, -9, -11] },
      { name: "j2", locationDelta: [0, 9, 0, -11] },
      { name: "a1", locationDelta: [0, 0, -9, 0] },
      { name: "b1", locationDelta: [0, 0, -9, -11] },
      { name: "c1", locationDelta: [0, 0, -9, -11] },
      { name: "d1", locationDelta: [0, 0, -9, -11] },
      { name: "e1", locationDelta: [0, 0, -9, -11] },
      { name: "f1", locationDelta: [0, 0, -9, -11] },
      { name: "g1", locationDelta: [0, 0, -9, -11] },
      { name: "h1", locationDelta: [0, 0, -9, -11] },
      { name: "i1", locationDelta: [0, 0, -9, -11] },
      { name: "j1", locationDelta: [0, 0, 0, -11] }
    )
    .addZone(
      { name: "promotion", player: 2, locations: ["a1", "c1", "e1", "g1", "i1"] },
      { name: "promotion", player: 1, locations: ["b10", "d10", "f10", "h10", "j10"] }
    );

  gameRule.addMovePriority([
    1, // jump-type
    0 // normal-type
  ]);

  gameRule
    .addPiece({ name: "Man", type: 0, price: 20 })
    .addMove(
      { pieceType: 0, func: jumpMan, params: ["nw"], mode: 1 },
      { pieceType: 0, func: jumpMan, params: ["se"], mode: 1 },
      { pieceType: 0, func: jumpMan, params: ["ne"], mode: 1 },
      { pieceType: 0, func: jumpMan, params: ["sw"], mode: 1 },
      { pieceType: 0, func: shiftMan, params: ["ne"], mode: 0 },
      { pieceType: 0, func: shiftMan, params: ["nw"], mode: 0 }
    );

  gameRule
    .addPiece({ name: "King", type: 1, price: 100 })
    .addMove(
      { pieceType: 1, func: jumpKing, params: ["nw"], mode: 1 },
      { pieceType: 1, func: jumpKing, params: ["se"], mode: 1 },
      { pieceType: 1, func: jumpKing, params: ["ne"], mode: 1 },
      { pieceType: 1, func: jumpKing, params: ["sw"], mode: 1 },
      { pieceType: 1, func: contKing, params: ["nw"], mode: 2 },
      { pieceType: 1, func: contKing, params: ["se"], mode: 2 },
      { pieceType: 1, func: contKing, params: ["ne"], mode: 2 },
      { pieceType: 1, func: contKing, params: ["sw"], mode: 2 },
      { pieceType: 1, func: shiftKing, params: ["nw"], mode: 0 },
      { pieceType: 1, func: shiftKing, params: ["se"], mode: 0 },
      { pieceType: 1, func: shiftKing, params: ["ne"], mode: 0 },
      { pieceType: 1, func: shiftKing, params: ["sw"], mode: 0 }
    );

  gameRule.setInitialPieces(
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
  );
};
