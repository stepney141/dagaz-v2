import { games } from "./../../src/dagaz-model";
import type { MovementDefinitionMethod } from "../../src/types";

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
    if (ctx.go(params, 0) &&
        ctx.isEmpty() &&
        ctx.inZone(1) &&
        ctx.go(params, 0) &&
        ctx.isEmpty()) {
        ctx.end();
    }
};

const enPassant: MovementDefinitionMethod = function (ctx, params) {
    if (ctx.go(params, 0) &&
        ctx.isEnemy() &&
        ctx.isPiece(0)) {
        ctx.capture();
        if (ctx.go(params, 1)) {
            ctx.put();
            if (ctx.go(params, 1) &&
                ctx.isLastFrom()) {
                ctx.end();
            }
        }
    }
};

const jump: MovementDefinitionMethod = function (ctx, params) {
    if (ctx.go(params, 0) &&
        ctx.go(params, 1) &&
        !ctx.isFriend()) {
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
    if (ctx.go(params, 0) &&
        ctx.isEmpty() &&
        ctx.go(params, 0) &&
        ctx.isEmpty()) {
        ctx.put();
        if (ctx.go(params, 0) &&
            ctx.isFriend() &&
            ctx.isPiece(1)) {
            ctx.take();
            if (ctx.go(params, 1) &&
                ctx.go(params, 1)) {
                ctx.end();
            }
        }
    }
};

/**
 * queenside castling
 */
const O_O_O: MovementDefinitionMethod = function (ctx, params) {
    if (ctx.go(params, 0) &&
        ctx.isEmpty() &&
        ctx.go(params, 0) &&
        ctx.isEmpty()) {
        ctx.put();
        if (ctx.go(params, 0) &&
            ctx.isEmpty() &&
            ctx.go(params, 0) &&
            ctx.isFriend() &&
            ctx.isPiece(1)) {
            ctx.take();
            if (ctx.go(params, 1) &&
                ctx.go(params, 1) &&
                ctx.go(params, 1)) {
                ctx.end();
            }
        }
    }
};

games.model.buildDesign = function (design) {
    design.checkVersion("smart-moves", false);

    design.addDirection([
        "w", // 0
        "e", // 1
        "s", // 2
        "ne", // 3
        "n", // 4
        "se", // 5
        "sw", // 6
        "nw" // 7
    ]);

    design.addPlayer("White", [1, 0, 4, 6, 2, 7, 3, 5]); // [e, w, n, sw, s, nw, ne, se]
    design.addPlayer("Black", [0, 1, 4, 5, 2, 3, 7, 6]); // [w, e, n, se, s, ne, nw, sw]

    design.addPosition("a8", [0, 1, 8, 0, 0, 9, 0, 0]);
    design.addPosition("b8", [-1, 1, 8, 0, 0, 9, 7, 0]);
    design.addPosition("c8", [-1, 1, 8, 0, 0, 9, 7, 0]);
    design.addPosition("d8", [-1, 1, 8, 0, 0, 9, 7, 0]);
    design.addPosition("e8", [-1, 1, 8, 0, 0, 9, 7, 0]);
    design.addPosition("f8", [-1, 1, 8, 0, 0, 9, 7, 0]);
    design.addPosition("g8", [-1, 1, 8, 0, 0, 9, 7, 0]);
    design.addPosition("h8", [-1, 0, 8, 0, 0, 0, 7, 0]);
    design.addPosition("a7", [0, 1, 8, -7, -8, 9, 0, 0]);
    design.addPosition("b7", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("c7", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("d7", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("e7", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("f7", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("g7", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("h7", [-1, 0, 8, 0, -8, 0, 7, -9]);
    design.addPosition("a6", [0, 1, 8, -7, -8, 9, 0, 0]);
    design.addPosition("b6", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("c6", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("d6", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("e6", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("f6", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("g6", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("h6", [-1, 0, 8, 0, -8, 0, 7, -9]);
    design.addPosition("a5", [0, 1, 8, -7, -8, 9, 0, 0]);
    design.addPosition("b5", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("c5", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("d5", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("e5", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("f5", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("g5", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("h5", [-1, 0, 8, 0, -8, 0, 7, -9]);
    design.addPosition("a4", [0, 1, 8, -7, -8, 9, 0, 0]);
    design.addPosition("b4", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("c4", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("d4", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("e4", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("f4", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("g4", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("h4", [-1, 0, 8, 0, -8, 0, 7, -9]);
    design.addPosition("a3", [0, 1, 8, -7, -8, 9, 0, 0]);
    design.addPosition("b3", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("c3", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("d3", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("e3", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("f3", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("g3", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("h3", [-1, 0, 8, 0, -8, 0, 7, -9]);
    design.addPosition("a2", [0, 1, 8, -7, -8, 9, 0, 0]);
    design.addPosition("b2", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("c2", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("d2", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("e2", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("f2", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("g2", [-1, 1, 8, -7, -8, 9, 7, -9]);
    design.addPosition("h2", [-1, 0, 8, 0, -8, 0, 7, -9]);
    design.addPosition("a1", [0, 1, 0, -7, -8, 0, 0, 0]);
    design.addPosition("b1", [-1, 1, 0, -7, -8, 0, 0, -9]);
    design.addPosition("c1", [-1, 1, 0, -7, -8, 0, 0, -9]);
    design.addPosition("d1", [-1, 1, 0, -7, -8, 0, 0, -9]);
    design.addPosition("e1", [-1, 1, 0, -7, -8, 0, 0, -9]);
    design.addPosition("f1", [-1, 1, 0, -7, -8, 0, 0, -9]);
    design.addPosition("g1", [-1, 1, 0, -7, -8, 0, 0, -9]);
    design.addPosition("h1", [-1, 0, 0, 0, -8, 0, 0, -9]);

    design.addZone("last-rank", 1, ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"]);
    design.addZone("last-rank", 2, ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"]);
    design.addZone("third-rank", 1, ["a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3"]);
    design.addZone("third-rank", 2, ["a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6"]);

    design.addPiece("Pawn", 0, 2);
    design.addMove({ pieceType: 0, func: pawnShift, params: [4], mode: 0 });
    design.addMove({ pieceType: 0, func: pawnJump, params: [4], mode: 0 });
    design.addMove({ pieceType: 0, func: pawnLeap, params: [7], mode: 0 });
    design.addMove({ pieceType: 0, func: pawnLeap, params: [3], mode: 0 });
    design.addMove({ pieceType: 0, func: enPassant, params: [1, 4], mode: 0 });
    design.addMove({ pieceType: 0, func: enPassant, params: [0, 4], mode: 0 });

    design.addPiece("Rook", 1, 10);
    design.addMove({ pieceType: 1, func: slide, params: [4], mode: 0 });
    design.addMove({ pieceType: 1, func: slide, params: [2], mode: 0 });
    design.addMove({ pieceType: 1, func: slide, params: [0], mode: 0 });
    design.addMove({ pieceType: 1, func: slide, params: [1], mode: 0 });

    design.addPiece("Knight", 2, 6);
    design.addMove({ pieceType: 2, func: jump, params: [4, 7], mode: 0 });
    design.addMove({ pieceType: 2, func: jump, params: [4, 3], mode: 0 });
    design.addMove({ pieceType: 2, func: jump, params: [2, 6], mode: 0 });
    design.addMove({ pieceType: 2, func: jump, params: [2, 5], mode: 0 });
    design.addMove({ pieceType: 2, func: jump, params: [0, 7], mode: 0 });
    design.addMove({ pieceType: 2, func: jump, params: [0, 6], mode: 0 });
    design.addMove({ pieceType: 2, func: jump, params: [1, 3], mode: 0 });
    design.addMove({ pieceType: 2, func: jump, params: [1, 5], mode: 0 });

    design.addPiece("Bishop", 3, 6);
    design.addMove({ pieceType: 3, func: slide, params: [7], mode: 0 });
    design.addMove({ pieceType: 3, func: slide, params: [6], mode: 0 });
    design.addMove({ pieceType: 3, func: slide, params: [3], mode: 0 });
    design.addMove({ pieceType: 3, func: slide, params: [5], mode: 0 });

    design.addPiece("Queen", 4, 18);
    design.addMove({ pieceType: 4, func: slide, params: [4], mode: 0 });
    design.addMove({ pieceType: 4, func: slide, params: [2], mode: 0 });
    design.addMove({ pieceType: 4, func: slide, params: [0], mode: 0 });
    design.addMove({ pieceType: 4, func: slide, params: [1], mode: 0 });
    design.addMove({ pieceType: 4, func: slide, params: [7], mode: 0 });
    design.addMove({ pieceType: 4, func: slide, params: [6], mode: 0 });
    design.addMove({ pieceType: 4, func: slide, params: [3], mode: 0 });
    design.addMove({ pieceType: 4, func: slide, params: [5], mode: 0 });

    design.addPiece("King", 5, 1000);
    design.addMove({ pieceType: 5, func: step, params: [4], mode: 0 });
    design.addMove({ pieceType: 5, func: step, params: [2], mode: 0 });
    design.addMove({ pieceType: 5, func: step, params: [0], mode: 0 });
    design.addMove({ pieceType: 5, func: step, params: [1], mode: 0 });
    design.addMove({ pieceType: 5, func: step, params: [7], mode: 0 });
    design.addMove({ pieceType: 5, func: step, params: [6], mode: 0 });
    design.addMove({ pieceType: 5, func: step, params: [3], mode: 0 });
    design.addMove({ pieceType: 5, func: step, params: [5], mode: 0 });
    design.addMove({ pieceType: 5, func: O_O, params: [1, 0], mode: 1 });
    design.addMove({ pieceType: 5, func: O_O_O, params: [0, 1], mode: 1 });

    design.setup("White", "Pawn", ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"]);
    design.setup("White", "Rook", ["a1", "h1"]);
    design.setup("White", "Knight", ["b1", "g1"]);
    design.setup("White", "Bishop", ["c1", "f1"]);
    design.setup("White", "Queen", ["d1"]);
    design.setup("White", "King", ["e1"]);
    design.setup("Black", "Pawn", ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"]);
    design.setup("Black", "Rook", ["a8", "h8"]);
    design.setup("Black", "Knight", ["b8", "g8"]);
    design.setup("Black", "Bishop", ["c8", "f8"]);
    design.setup("Black", "Queen", ["d8"]);
    design.setup("Black", "King", ["e8"]);
};

export { games };
