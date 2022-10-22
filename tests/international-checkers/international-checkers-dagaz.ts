import { games } from "./../../src/dagaz-model";
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

games.model.buildDesign = function (design) {
    design.checkGameOption("smart-moves", true);
    design.checkGameOption("maximal-captures", true);
    design.checkGameOption("deferred-captures", true);

    design.addDirection([
        "se", // 0
        "sw", // 1
        "ne", // 2
        "nw" // 3
    ]);

    design.addPlayer({ name: "White", symmetry: [3, 2, 1, 0] });
    design.addPlayer({ name: "Black", symmetry: [3, 2, 1, 0] });

    design.addPosition({ name: "a10", offsets: [11, 0, 0, 0] });
    design.addPosition({ name: "b10", offsets: [11, 9, 0, 0] });
    design.addPosition({ name: "c10", offsets: [11, 9, 0, 0] });
    design.addPosition({ name: "d10", offsets: [11, 9, 0, 0] });
    design.addPosition({ name: "e10", offsets: [11, 9, 0, 0] });
    design.addPosition({ name: "f10", offsets: [11, 9, 0, 0] });
    design.addPosition({ name: "g10", offsets: [11, 9, 0, 0] });
    design.addPosition({ name: "h10", offsets: [11, 9, 0, 0] });
    design.addPosition({ name: "i10", offsets: [11, 9, 0, 0] });
    design.addPosition({ name: "j10", offsets: [0, 9, 0, 0] });
    design.addPosition({ name: "a9", offsets: [11, 0, -9, 0] });
    design.addPosition({ name: "b9", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "c9", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "d9", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "e9", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "f9", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "g9", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "h9", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "i9", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "j9", offsets: [0, 9, 0, -11] });
    design.addPosition({ name: "a8", offsets: [11, 0, -9, 0] });
    design.addPosition({ name: "b8", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "c8", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "d8", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "e8", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "f8", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "g8", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "h8", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "i8", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "j8", offsets: [0, 9, 0, -11] });
    design.addPosition({ name: "a7", offsets: [11, 0, -9, 0] });
    design.addPosition({ name: "b7", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "c7", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "d7", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "e7", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "f7", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "g7", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "h7", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "i7", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "j7", offsets: [0, 9, 0, -11] });
    design.addPosition({ name: "a6", offsets: [11, 0, -9, 0] });
    design.addPosition({ name: "b6", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "c6", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "d6", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "e6", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "f6", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "g6", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "h6", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "i6", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "j6", offsets: [0, 9, 0, -11] });
    design.addPosition({ name: "a5", offsets: [11, 0, -9, 0] });
    design.addPosition({ name: "b5", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "c5", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "d5", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "e5", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "f5", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "g5", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "h5", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "i5", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "j5", offsets: [0, 9, 0, -11] });
    design.addPosition({ name: "a4", offsets: [11, 0, -9, 0] });
    design.addPosition({ name: "b4", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "c4", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "d4", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "e4", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "f4", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "g4", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "h4", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "i4", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "j4", offsets: [0, 9, 0, -11] });
    design.addPosition({ name: "a3", offsets: [11, 0, -9, 0] });
    design.addPosition({ name: "b3", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "c3", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "d3", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "e3", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "f3", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "g3", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "h3", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "i3", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "j3", offsets: [0, 9, 0, -11] });
    design.addPosition({ name: "a2", offsets: [11, 0, -9, 0] });
    design.addPosition({ name: "b2", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "c2", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "d2", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "e2", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "f2", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "g2", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "h2", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "i2", offsets: [11, 9, -9, -11] });
    design.addPosition({ name: "j2", offsets: [0, 9, 0, -11] });
    design.addPosition({ name: "a1", offsets: [0, 0, -9, 0] });
    design.addPosition({ name: "b1", offsets: [0, 0, -9, -11] });
    design.addPosition({ name: "c1", offsets: [0, 0, -9, -11] });
    design.addPosition({ name: "d1", offsets: [0, 0, -9, -11] });
    design.addPosition({ name: "e1", offsets: [0, 0, -9, -11] });
    design.addPosition({ name: "f1", offsets: [0, 0, -9, -11] });
    design.addPosition({ name: "g1", offsets: [0, 0, -9, -11] });
    design.addPosition({ name: "h1", offsets: [0, 0, -9, -11] });
    design.addPosition({ name: "i1", offsets: [0, 0, -9, -11] });
    design.addPosition({ name: "j1", offsets: [0, 0, 0, -11] });

    design.addZone({ name: "promotion", player: 2, positions: ["a1", "c1", "e1", "g1", "i1"] });
    design.addZone({ name: "promotion", player: 1, positions: ["b10", "d10", "f10", "h10", "j10"] });

    design.addPriority(1);			// jump-type
    design.addPriority(0);			// normal-type

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

    design.configureInitBoard({ player: "White", pieceName: "Man", positions: ["a1", "c1", "e1", "g1", "i1", "b2", "d2", "f2", "h2", "j2", "a3", "c3", "e3", "g3", "i3", "b4", "d4", "f4", "h4", "j4"] });
    design.configureInitBoard({ player: "Black", pieceName: "Man", positions: ["b10", "d10", "f10", "h10", "j10", "a9", "c9", "e9", "g9", "i9", "b8", "d8", "f8", "h8", "j8", "a7", "c7", "e7", "g7", "i7"] });
};

export { games };
