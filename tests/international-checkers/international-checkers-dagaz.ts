import type { TDesign } from "../../src/design";
import type { MovementDefinitionMethod } from "../../src/types";

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

export const buildDesign = function (design: TDesign) {
  design.setGameOption("smart-moves", true);
  design.setGameOption("maximal-captures", true);
  design.setGameOption("deferred-captures", true);

  design.addDirection([
    "se", // 0
    "sw", // 1
    "ne", // 2
    "nw" // 3
  ]);

  design.addPlayer({ name: "White", symmetry: [3, 2, 1, 0] });
  design.addPlayer({ name: "Black", symmetry: [3, 2, 1, 0] });

  design.addLocation({ name: "a10", offsets: [11, 0, 0, 0] });
  design.addLocation({ name: "b10", offsets: [11, 9, 0, 0] });
  design.addLocation({ name: "c10", offsets: [11, 9, 0, 0] });
  design.addLocation({ name: "d10", offsets: [11, 9, 0, 0] });
  design.addLocation({ name: "e10", offsets: [11, 9, 0, 0] });
  design.addLocation({ name: "f10", offsets: [11, 9, 0, 0] });
  design.addLocation({ name: "g10", offsets: [11, 9, 0, 0] });
  design.addLocation({ name: "h10", offsets: [11, 9, 0, 0] });
  design.addLocation({ name: "i10", offsets: [11, 9, 0, 0] });
  design.addLocation({ name: "j10", offsets: [0, 9, 0, 0] });
  design.addLocation({ name: "a9", offsets: [11, 0, -9, 0] });
  design.addLocation({ name: "b9", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "c9", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "d9", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "e9", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "f9", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "g9", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "h9", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "i9", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "j9", offsets: [0, 9, 0, -11] });
  design.addLocation({ name: "a8", offsets: [11, 0, -9, 0] });
  design.addLocation({ name: "b8", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "c8", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "d8", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "e8", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "f8", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "g8", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "h8", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "i8", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "j8", offsets: [0, 9, 0, -11] });
  design.addLocation({ name: "a7", offsets: [11, 0, -9, 0] });
  design.addLocation({ name: "b7", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "c7", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "d7", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "e7", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "f7", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "g7", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "h7", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "i7", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "j7", offsets: [0, 9, 0, -11] });
  design.addLocation({ name: "a6", offsets: [11, 0, -9, 0] });
  design.addLocation({ name: "b6", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "c6", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "d6", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "e6", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "f6", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "g6", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "h6", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "i6", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "j6", offsets: [0, 9, 0, -11] });
  design.addLocation({ name: "a5", offsets: [11, 0, -9, 0] });
  design.addLocation({ name: "b5", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "c5", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "d5", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "e5", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "f5", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "g5", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "h5", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "i5", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "j5", offsets: [0, 9, 0, -11] });
  design.addLocation({ name: "a4", offsets: [11, 0, -9, 0] });
  design.addLocation({ name: "b4", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "c4", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "d4", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "e4", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "f4", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "g4", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "h4", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "i4", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "j4", offsets: [0, 9, 0, -11] });
  design.addLocation({ name: "a3", offsets: [11, 0, -9, 0] });
  design.addLocation({ name: "b3", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "c3", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "d3", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "e3", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "f3", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "g3", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "h3", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "i3", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "j3", offsets: [0, 9, 0, -11] });
  design.addLocation({ name: "a2", offsets: [11, 0, -9, 0] });
  design.addLocation({ name: "b2", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "c2", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "d2", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "e2", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "f2", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "g2", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "h2", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "i2", offsets: [11, 9, -9, -11] });
  design.addLocation({ name: "j2", offsets: [0, 9, 0, -11] });
  design.addLocation({ name: "a1", offsets: [0, 0, -9, 0] });
  design.addLocation({ name: "b1", offsets: [0, 0, -9, -11] });
  design.addLocation({ name: "c1", offsets: [0, 0, -9, -11] });
  design.addLocation({ name: "d1", offsets: [0, 0, -9, -11] });
  design.addLocation({ name: "e1", offsets: [0, 0, -9, -11] });
  design.addLocation({ name: "f1", offsets: [0, 0, -9, -11] });
  design.addLocation({ name: "g1", offsets: [0, 0, -9, -11] });
  design.addLocation({ name: "h1", offsets: [0, 0, -9, -11] });
  design.addLocation({ name: "i1", offsets: [0, 0, -9, -11] });
  design.addLocation({ name: "j1", offsets: [0, 0, 0, -11] });

  design.addZone({ name: "promotion", player: 2, locations: ["a1", "c1", "e1", "g1", "i1"] });
  design.addZone({ name: "promotion", player: 1, locations: ["b10", "d10", "f10", "h10", "j10"] });

  design.addMovePriority([
    1, // jump-type
    0 // normal-type
  ]);

  design.addPiece({ name: "Man", type: 0, price: 20 });
  design.addMove({ pieceType: 0, func: jumpMan, params: [3], mode: 1 });
  design.addMove({ pieceType: 0, func: jumpMan, params: [0], mode: 1 });
  design.addMove({ pieceType: 0, func: jumpMan, params: [2], mode: 1 });
  design.addMove({ pieceType: 0, func: jumpMan, params: [1], mode: 1 });
  design.addMove({ pieceType: 0, func: shiftMan, params: [2], mode: 0 });
  design.addMove({ pieceType: 0, func: shiftMan, params: [3], mode: 0 });

  design.addPiece({ name: "King", type: 1, price: 100 });
  design.addMove({ pieceType: 1, func: jumpKing, params: [3], mode: 1 });
  design.addMove({ pieceType: 1, func: jumpKing, params: [0], mode: 1 });
  design.addMove({ pieceType: 1, func: jumpKing, params: [2], mode: 1 });
  design.addMove({ pieceType: 1, func: jumpKing, params: [1], mode: 1 });
  design.addMove({ pieceType: 1, func: contKing, params: [3], mode: 2 });
  design.addMove({ pieceType: 1, func: contKing, params: [0], mode: 2 });
  design.addMove({ pieceType: 1, func: contKing, params: [2], mode: 2 });
  design.addMove({ pieceType: 1, func: contKing, params: [1], mode: 2 });
  design.addMove({ pieceType: 1, func: shiftKing, params: [3], mode: 0 });
  design.addMove({ pieceType: 1, func: shiftKing, params: [0], mode: 0 });
  design.addMove({ pieceType: 1, func: shiftKing, params: [2], mode: 0 });
  design.addMove({ pieceType: 1, func: shiftKing, params: [1], mode: 0 });

  design.setInitialPieces({
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
  });
  design.setInitialPieces({
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
  });
};
