import type { TGameRule } from "../../src/game_rule";
import type { MovementDefinitionMethod } from "../../src/types";

const shiftMan: MovementDefinitionMethod = function (ctx, params) {
  if (ctx.canGoTo(params, 0) && ctx.isEmpty()) {
    if (ctx.inZone(0)) {
      ctx.promote(1);
    }
    ctx.endMove();
  }
};

const jumpMan: MovementDefinitionMethod = function (ctx, params) {
  if (ctx.canGoTo(params, 0) && ctx.isEnemy()) {
    ctx.capture();
    if (ctx.canGoTo(params, 0) && ctx.isEmpty()) {
      if (ctx.inZone(0)) {
        ctx.promote(1);
        ctx.endMove(1);
      } else {
        ctx.endMove(1);
      }
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

export const buildGameRule = function (gameRule: TGameRule) {
  gameRule.setGameOption({
    "smart-moves": true,
    "deferred-captures": true
  });

  gameRule
    .addDirection([
      "NE", // 0
      "SE", // 1
      "SW", // 2
      "NW" // 3
    ])
    .addPlayer(
      {
        name: "White",
        symmetry: { NE: "SW", SE: "NW", SW: "NE", NW: "SE" }
      },
      {
        name: "Black",
        symmetry: { NE: "SW", SE: "NW", SW: "NE", NW: "SE" }
      }
    )
    .addLocation(
      { name: "a8", locationDelta: [0, 9, 0, 0] },
      { name: "b8", locationDelta: [0, 9, 7, 0] },
      { name: "c8", locationDelta: [0, 9, 7, 0] },
      { name: "d8", locationDelta: [0, 9, 7, 0] },
      { name: "e8", locationDelta: [0, 9, 7, 0] },
      { name: "f8", locationDelta: [0, 9, 7, 0] },
      { name: "g8", locationDelta: [0, 9, 7, 0] },
      { name: "h8", locationDelta: [0, 0, 7, 0] },
      { name: "a7", locationDelta: [-7, 9, 0, 0] },
      { name: "b7", locationDelta: [-7, 9, 7, -9] },
      { name: "c7", locationDelta: [-7, 9, 7, -9] },
      { name: "d7", locationDelta: [-7, 9, 7, -9] },
      { name: "e7", locationDelta: [-7, 9, 7, -9] },
      { name: "f7", locationDelta: [-7, 9, 7, -9] },
      { name: "g7", locationDelta: [-7, 9, 7, -9] },
      { name: "h7", locationDelta: [0, 0, 7, -9] },
      { name: "a6", locationDelta: [-7, 9, 0, 0] },
      { name: "b6", locationDelta: [-7, 9, 7, -9] },
      { name: "c6", locationDelta: [-7, 9, 7, -9] },
      { name: "d6", locationDelta: [-7, 9, 7, -9] },
      { name: "e6", locationDelta: [-7, 9, 7, -9] },
      { name: "f6", locationDelta: [-7, 9, 7, -9] },
      { name: "g6", locationDelta: [-7, 9, 7, -9] },
      { name: "h6", locationDelta: [0, 0, 7, -9] },
      { name: "a5", locationDelta: [-7, 9, 0, 0] },
      { name: "b5", locationDelta: [-7, 9, 7, -9] },
      { name: "c5", locationDelta: [-7, 9, 7, -9] },
      { name: "d5", locationDelta: [-7, 9, 7, -9] },
      { name: "e5", locationDelta: [-7, 9, 7, -9] },
      { name: "f5", locationDelta: [-7, 9, 7, -9] },
      { name: "g5", locationDelta: [-7, 9, 7, -9] },
      { name: "h5", locationDelta: [0, 0, 7, -9] },
      { name: "a4", locationDelta: [-7, 9, 0, 0] },
      { name: "b4", locationDelta: [-7, 9, 7, -9] },
      { name: "c4", locationDelta: [-7, 9, 7, -9] },
      { name: "d4", locationDelta: [-7, 9, 7, -9] },
      { name: "e4", locationDelta: [-7, 9, 7, -9] },
      { name: "f4", locationDelta: [-7, 9, 7, -9] },
      { name: "g4", locationDelta: [-7, 9, 7, -9] },
      { name: "h4", locationDelta: [0, 0, 7, -9] },
      { name: "a3", locationDelta: [-7, 9, 0, 0] },
      { name: "b3", locationDelta: [-7, 9, 7, -9] },
      { name: "c3", locationDelta: [-7, 9, 7, -9] },
      { name: "d3", locationDelta: [-7, 9, 7, -9] },
      { name: "e3", locationDelta: [-7, 9, 7, -9] },
      { name: "f3", locationDelta: [-7, 9, 7, -9] },
      { name: "g3", locationDelta: [-7, 9, 7, -9] },
      { name: "h3", locationDelta: [0, 0, 7, -9] },
      { name: "a2", locationDelta: [-7, 9, 0, 0] },
      { name: "b2", locationDelta: [-7, 9, 7, -9] },
      { name: "c2", locationDelta: [-7, 9, 7, -9] },
      { name: "d2", locationDelta: [-7, 9, 7, -9] },
      { name: "e2", locationDelta: [-7, 9, 7, -9] },
      { name: "f2", locationDelta: [-7, 9, 7, -9] },
      { name: "g2", locationDelta: [-7, 9, 7, -9] },
      { name: "h2", locationDelta: [0, 0, 7, -9] },
      { name: "a1", locationDelta: [-7, 0, 0, 0] },
      { name: "b1", locationDelta: [-7, 0, 0, -9] },
      { name: "c1", locationDelta: [-7, 0, 0, -9] },
      { name: "d1", locationDelta: [-7, 0, 0, -9] },
      { name: "e1", locationDelta: [-7, 0, 0, -9] },
      { name: "f1", locationDelta: [-7, 0, 0, -9] },
      { name: "g1", locationDelta: [-7, 0, 0, -9] },
      { name: "h1", locationDelta: [0, 0, 0, -9] }
    )
    .addZone(
      { name: "promotion", player: 2, locations: ["a1", "c1", "e1", "g1"] },
      { name: "promotion", player: 1, locations: ["b8", "d8", "f8", "h8"] }
    );

  gameRule.addMovePriority([
    1, // jump-type
    0 // normal-type
  ]);

  gameRule
    .addPiece({ name: "Man", type: 0, price: 20 })
    .addMove(
      { pieceType: 0, func: jumpMan, params: ["NW"], mode: 1 },
      { pieceType: 0, func: jumpMan, params: ["NE"], mode: 1 },
      { pieceType: 0, func: jumpMan, params: ["SW"], mode: 1 },
      { pieceType: 0, func: jumpMan, params: ["SE"], mode: 1 },
      { pieceType: 0, func: shiftMan, params: ["NW"], mode: 0 },
      { pieceType: 0, func: shiftMan, params: ["NE"], mode: 0 }
    );

  gameRule
    .addPiece({ name: "King", type: 1, price: 100 })
    .addMove(
      { pieceType: 1, func: jumpKing, params: ["NW"], mode: 1 },
      { pieceType: 1, func: jumpKing, params: ["NE"], mode: 1 },
      { pieceType: 1, func: jumpKing, params: ["SW"], mode: 1 },
      { pieceType: 1, func: jumpKing, params: ["SE"], mode: 1 },
      { pieceType: 1, func: contKing, params: ["NW"], mode: 2 },
      { pieceType: 1, func: contKing, params: ["NE"], mode: 2 },
      { pieceType: 1, func: contKing, params: ["SW"], mode: 2 },
      { pieceType: 1, func: contKing, params: ["SE"], mode: 2 },
      { pieceType: 1, func: shiftKing, params: ["NW"], mode: 0 },
      { pieceType: 1, func: shiftKing, params: ["NE"], mode: 0 },
      { pieceType: 1, func: shiftKing, params: ["SW"], mode: 0 },
      { pieceType: 1, func: shiftKing, params: ["SE"], mode: 0 }
    );

  gameRule.setInitialPieces(
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
  );
};
