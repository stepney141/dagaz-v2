import type { MovementDefinitionMethod } from "../../src/types";
import type { TDesign } from './../../src/core';

const shiftMan: MovementDefinitionMethod = function (ctx, params) {
    if (ctx.go(params, 0) && ctx.isEmpty()) {
        if (ctx.inZone(0)) {
            ctx.promote(1);
        }
        ctx.end();
    }
};

const shiftKing: MovementDefinitionMethod = function (ctx, params) {
    if (ctx.go(params, 0) && ctx.isEmpty()) {
        ctx.end();
    }
};

const jumpMan: MovementDefinitionMethod = function (ctx, params) {
    if (ctx.go(params, 0) && ctx.isEnemy()) {
        ctx.capture();
        if (ctx.go(params, 0) && ctx.isEmpty()) {
            if (ctx.inZone(0)) {
                ctx.promote(1);
                ctx.end();
            } else {
                ctx.end(1);
            }
        }
    }
};

const jumpKing: MovementDefinitionMethod = function (ctx, params) {
    if (ctx.go(params, 0) && ctx.isEnemy()) {
        ctx.capture();
        if (ctx.go(params, 0) && ctx.isEmpty()) {
            ctx.end(1);
        }
    }
};

export const buildDesign = function (design: TDesign) {
    design.checkGameOption("smart-moves", true);

    design.addDirection([
        "ne", // 0
        "se", // 1
        "sw", // 2
        "nw" // 3
    ]);

    design.addPlayer({ name: "Black", symmetry: [2, 3, 0, 1] });
    design.addPlayer({ name: "White", symmetry: [2, 3, 0, 1] });

    design.addPosition({ name: "a8", offsets: [0, 9, 0, 0] });
    design.addPosition({ name: "b8", offsets: [0, 9, 7, 0] });
    design.addPosition({ name: "c8", offsets: [0, 9, 7, 0] });
    design.addPosition({ name: "d8", offsets: [0, 9, 7, 0] });
    design.addPosition({ name: "e8", offsets: [0, 9, 7, 0] });
    design.addPosition({ name: "f8", offsets: [0, 9, 7, 0] });
    design.addPosition({ name: "g8", offsets: [0, 9, 7, 0] });
    design.addPosition({ name: "h8", offsets: [0, 0, 7, 0] });
    design.addPosition({ name: "a7", offsets: [-7, 9, 0, 0] });
    design.addPosition({ name: "b7", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "c7", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "d7", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "e7", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "f7", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "g7", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "h7", offsets: [0, 0, 7, -9] });
    design.addPosition({ name: "a6", offsets: [-7, 9, 0, 0] });
    design.addPosition({ name: "b6", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "c6", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "d6", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "e6", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "f6", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "g6", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "h6", offsets: [0, 0, 7, -9] });
    design.addPosition({ name: "a5", offsets: [-7, 9, 0, 0] });
    design.addPosition({ name: "b5", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "c5", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "d5", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "e5", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "f5", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "g5", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "h5", offsets: [0, 0, 7, -9] });
    design.addPosition({ name: "a4", offsets: [-7, 9, 0, 0] });
    design.addPosition({ name: "b4", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "c4", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "d4", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "e4", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "f4", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "g4", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "h4", offsets: [0, 0, 7, -9] });
    design.addPosition({ name: "a3", offsets: [-7, 9, 0, 0] });
    design.addPosition({ name: "b3", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "c3", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "d3", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "e3", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "f3", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "g3", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "h3", offsets: [0, 0, 7, -9] });
    design.addPosition({ name: "a2", offsets: [-7, 9, 0, 0] });
    design.addPosition({ name: "b2", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "c2", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "d2", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "e2", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "f2", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "g2", offsets: [-7, 9, 7, -9] });
    design.addPosition({ name: "h2", offsets: [0, 0, 7, -9] });
    design.addPosition({ name: "a1", offsets: [-7, 0, 0, 0] });
    design.addPosition({ name: "b1", offsets: [-7, 0, 0, -9] });
    design.addPosition({ name: "c1", offsets: [-7, 0, 0, -9] });
    design.addPosition({ name: "d1", offsets: [-7, 0, 0, -9] });
    design.addPosition({ name: "e1", offsets: [-7, 0, 0, -9] });
    design.addPosition({ name: "f1", offsets: [-7, 0, 0, -9] });
    design.addPosition({ name: "g1", offsets: [-7, 0, 0, -9] });
    design.addPosition({ name: "h1", offsets: [0, 0, 0, -9] });

    design.addZone({ name: "promotion", player: 2, positions: ["a1", "c1", "e1", "g1"] });
    design.addZone({ name: "promotion", player: 1, positions: ["b8", "d8", "f8", "h8"] });

    design.addPriority(1);			// jump-type
    design.addPriority(0);			// normal-type

    design.addPiece({ name: "Man", type: 0, price: 20 });
    design.addMove({ pieceType: 0, func: jumpMan, params: [3], mode: 1 });
    design.addMove({ pieceType: 0, func: jumpMan, params: [0], mode: 1 });
    design.addMove({ pieceType: 0, func: shiftMan, params: [3], mode: 0 });
    design.addMove({ pieceType: 0, func: shiftMan, params: [0], mode: 0 });

    design.addPiece({ name: "King", type: 1, price: 40 });
    design.addMove({ pieceType: 1, func: jumpKing, params: [3], mode: 1 });
    design.addMove({ pieceType: 1, func: jumpKing, params: [0], mode: 1 });
    design.addMove({ pieceType: 1, func: jumpKing, params: [2], mode: 1 });
    design.addMove({ pieceType: 1, func: jumpKing, params: [1], mode: 1 });
    design.addMove({ pieceType: 1, func: shiftKing, params: [3], mode: 0 });
    design.addMove({ pieceType: 1, func: shiftKing, params: [0], mode: 0 });
    design.addMove({ pieceType: 1, func: shiftKing, params: [2], mode: 0 });
    design.addMove({ pieceType: 1, func: shiftKing, params: [1], mode: 0 });

    design.setInitialPieces({ player: "Black", pieceName: "Man", positions: ["a3", "c3", "e3", "g3", "b2", "d2", "f2", "h2", "a1", "c1", "e1", "g1"] });
    design.setInitialPieces({ player: "White", pieceName: "Man", positions: ["b8", "d8", "f8", "h8", "a7", "c7", "e7", "g7", "b6", "d6", "f6", "h6"] });
};
