import type { MovementDefinitionMethod } from "../../src/types";
import type { TDesign } from "../../src/core";

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

export const buildDesign = function (design: TDesign) {
  design.setGameOption("smart-moves", true);
  design.setGameOption("deferred-captures", true);

  design.addDirection([
    "ne", // 0
    "se", // 1
    "sw", // 2
    "nw" // 3
  ]);

  design.addPlayer({ name: "White", symmetry: [2, 3, 0, 1] });
  design.addPlayer({ name: "Black", symmetry: [2, 3, 0, 1] });

  design.addLocation({ name: "a8", offsets: [0, 9, 0, 0] });
  design.addLocation({ name: "b8", offsets: [0, 9, 7, 0] });
  design.addLocation({ name: "c8", offsets: [0, 9, 7, 0] });
  design.addLocation({ name: "d8", offsets: [0, 9, 7, 0] });
  design.addLocation({ name: "e8", offsets: [0, 9, 7, 0] });
  design.addLocation({ name: "f8", offsets: [0, 9, 7, 0] });
  design.addLocation({ name: "g8", offsets: [0, 9, 7, 0] });
  design.addLocation({ name: "h8", offsets: [0, 0, 7, 0] });
  design.addLocation({ name: "a7", offsets: [-7, 9, 0, 0] });
  design.addLocation({ name: "b7", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "c7", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "d7", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "e7", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "f7", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "g7", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "h7", offsets: [0, 0, 7, -9] });
  design.addLocation({ name: "a6", offsets: [-7, 9, 0, 0] });
  design.addLocation({ name: "b6", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "c6", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "d6", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "e6", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "f6", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "g6", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "h6", offsets: [0, 0, 7, -9] });
  design.addLocation({ name: "a5", offsets: [-7, 9, 0, 0] });
  design.addLocation({ name: "b5", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "c5", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "d5", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "e5", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "f5", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "g5", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "h5", offsets: [0, 0, 7, -9] });
  design.addLocation({ name: "a4", offsets: [-7, 9, 0, 0] });
  design.addLocation({ name: "b4", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "c4", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "d4", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "e4", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "f4", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "g4", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "h4", offsets: [0, 0, 7, -9] });
  design.addLocation({ name: "a3", offsets: [-7, 9, 0, 0] });
  design.addLocation({ name: "b3", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "c3", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "d3", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "e3", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "f3", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "g3", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "h3", offsets: [0, 0, 7, -9] });
  design.addLocation({ name: "a2", offsets: [-7, 9, 0, 0] });
  design.addLocation({ name: "b2", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "c2", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "d2", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "e2", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "f2", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "g2", offsets: [-7, 9, 7, -9] });
  design.addLocation({ name: "h2", offsets: [0, 0, 7, -9] });
  design.addLocation({ name: "a1", offsets: [-7, 0, 0, 0] });
  design.addLocation({ name: "b1", offsets: [-7, 0, 0, -9] });
  design.addLocation({ name: "c1", offsets: [-7, 0, 0, -9] });
  design.addLocation({ name: "d1", offsets: [-7, 0, 0, -9] });
  design.addLocation({ name: "e1", offsets: [-7, 0, 0, -9] });
  design.addLocation({ name: "f1", offsets: [-7, 0, 0, -9] });
  design.addLocation({ name: "g1", offsets: [-7, 0, 0, -9] });
  design.addLocation({ name: "h1", offsets: [0, 0, 0, -9] });

  design.addZone({ name: "promotion", player: 2, locations: ["a1", "c1", "e1", "g1"] });
  design.addZone({ name: "promotion", player: 1, locations: ["b8", "d8", "f8", "h8"] });

  design.addPriority(1);			// jump-type
  design.addPriority(0);			// normal-type

  design.addPiece({ name: "Man", type: 0, price: 20 });
  design.addMove({ pieceType: 0, func: jumpMan, params: [3], mode: 1 });
  design.addMove({ pieceType: 0, func: jumpMan, params: [0], mode: 1 });
  design.addMove({ pieceType: 0, func: jumpMan, params: [2], mode: 1 });
  design.addMove({ pieceType: 0, func: jumpMan, params: [1], mode: 1 });
  design.addMove({ pieceType: 0, func: shiftMan, params: [3], mode: 0 });
  design.addMove({ pieceType: 0, func: shiftMan, params: [0], mode: 0 });

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

  design.setInitialPieces({ player: "White", pieceName: "Man", locations: ["a3", "c3", "e3", "g3", "b2", "d2", "f2", "h2", "a1", "c1", "e1", "g1"] });
  design.setInitialPieces({ player: "Black", pieceName: "Man", locations: ["b8", "d8", "f8", "h8", "a7", "c7", "e7", "g7", "b6", "d6", "f6", "h6"] });
};
