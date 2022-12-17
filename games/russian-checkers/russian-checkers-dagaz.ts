import type { TDesign } from "../../src/design";
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

export const buildDesign = function (design: TDesign) {
  design.setGameOption({
    "smart-moves": true,
    "deferred-captures": true
  });

  design.addDirection([
    "ne", // 0
    "se", // 1
    "sw", // 2
    "nw" // 3
  ]);

  design.addPlayer({ name: "White", symmetry: [2, 3, 0, 1] }, { name: "Black", symmetry: [2, 3, 0, 1] });

  design.addLocation(
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
  );

  design.addZone(
    { name: "promotion", player: 2, locations: ["a1", "c1", "e1", "g1"] },
    { name: "promotion", player: 1, locations: ["b8", "d8", "f8", "h8"] }
  );

  design.addMovePriority([
    1, // jump-type
    0 // normal-type
  ]);

  design.addPiece({ name: "Man", type: 0, price: 20 });
  design.addMove(
    { pieceType: 0, func: jumpMan, params: ["nw"], mode: 1 },
    { pieceType: 0, func: jumpMan, params: ["ne"], mode: 1 },
    { pieceType: 0, func: jumpMan, params: ["sw"], mode: 1 },
    { pieceType: 0, func: jumpMan, params: ["se"], mode: 1 },
    { pieceType: 0, func: shiftMan, params: ["nw"], mode: 0 },
    { pieceType: 0, func: shiftMan, params: ["ne"], mode: 0 }
  );

  design.addPiece({ name: "King", type: 1, price: 100 });
  design.addMove(
    { pieceType: 1, func: jumpKing, params: ["nw"], mode: 1 },
    { pieceType: 1, func: jumpKing, params: ["ne"], mode: 1 },
    { pieceType: 1, func: jumpKing, params: ["sw"], mode: 1 },
    { pieceType: 1, func: jumpKing, params: ["se"], mode: 1 },
    { pieceType: 1, func: contKing, params: ["nw"], mode: 2 },
    { pieceType: 1, func: contKing, params: ["ne"], mode: 2 },
    { pieceType: 1, func: contKing, params: ["sw"], mode: 2 },
    { pieceType: 1, func: contKing, params: ["se"], mode: 2 },
    { pieceType: 1, func: shiftKing, params: ["nw"], mode: 0 },
    { pieceType: 1, func: shiftKing, params: ["ne"], mode: 0 },
    { pieceType: 1, func: shiftKing, params: ["sw"], mode: 0 },
    { pieceType: 1, func: shiftKing, params: ["se"], mode: 0 }
  );

  design.setInitialPieces(
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
