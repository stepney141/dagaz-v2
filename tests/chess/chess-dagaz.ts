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
    design.checkGameOption("smart-moves", false);

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

    design.addPlayer({ name: "White", symmetry: [1, 0, 4, 6, 2, 7, 3, 5] }); // [e, w, n, sw, s, nw, ne, se]
    design.addPlayer({ name: "Black", symmetry: [0, 1, 4, 5, 2, 3, 7, 6] }); // [w, e, n, se, s, ne, nw, sw]

    design.addPosition({ name: "a8", offsets: [0, 1, 8, 0, 0, 9, 0, 0] });
    design.addPosition({ name: "b8", offsets: [-1, 1, 8, 0, 0, 9, 7, 0] });
    design.addPosition({ name: "c8", offsets: [-1, 1, 8, 0, 0, 9, 7, 0] });
    design.addPosition({ name: "d8", offsets: [-1, 1, 8, 0, 0, 9, 7, 0] });
    design.addPosition({ name: "e8", offsets: [-1, 1, 8, 0, 0, 9, 7, 0] });
    design.addPosition({ name: "f8", offsets: [-1, 1, 8, 0, 0, 9, 7, 0] });
    design.addPosition({ name: "g8", offsets: [-1, 1, 8, 0, 0, 9, 7, 0] });
    design.addPosition({ name: "h8", offsets: [-1, 0, 8, 0, 0, 0, 7, 0] });
    design.addPosition({ name: "a7", offsets: [0, 1, 8, -7, -8, 9, 0, 0] });
    design.addPosition({ name: "b7", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "c7", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "d7", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "e7", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "f7", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "g7", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "h7", offsets: [-1, 0, 8, 0, -8, 0, 7, -9] });
    design.addPosition({ name: "a6", offsets: [0, 1, 8, -7, -8, 9, 0, 0] });
    design.addPosition({ name: "b6", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "c6", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "d6", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "e6", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "f6", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "g6", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "h6", offsets: [-1, 0, 8, 0, -8, 0, 7, -9] });
    design.addPosition({ name: "a5", offsets: [0, 1, 8, -7, -8, 9, 0, 0] });
    design.addPosition({ name: "b5", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "c5", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "d5", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "e5", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "f5", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "g5", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "h5", offsets: [-1, 0, 8, 0, -8, 0, 7, -9] });
    design.addPosition({ name: "a4", offsets: [0, 1, 8, -7, -8, 9, 0, 0] });
    design.addPosition({ name: "b4", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "c4", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "d4", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "e4", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "f4", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "g4", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "h4", offsets: [-1, 0, 8, 0, -8, 0, 7, -9] });
    design.addPosition({ name: "a3", offsets: [0, 1, 8, -7, -8, 9, 0, 0] });
    design.addPosition({ name: "b3", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "c3", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "d3", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "e3", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "f3", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "g3", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "h3", offsets: [-1, 0, 8, 0, -8, 0, 7, -9] });
    design.addPosition({ name: "a2", offsets: [0, 1, 8, -7, -8, 9, 0, 0] });
    design.addPosition({ name: "b2", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "c2", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "d2", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "e2", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "f2", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "g2", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] });
    design.addPosition({ name: "h2", offsets: [-1, 0, 8, 0, -8, 0, 7, -9] });
    design.addPosition({ name: "a1", offsets: [0, 1, 0, -7, -8, 0, 0, 0] });
    design.addPosition({ name: "b1", offsets: [-1, 1, 0, -7, -8, 0, 0, -9] });
    design.addPosition({ name: "c1", offsets: [-1, 1, 0, -7, -8, 0, 0, -9] });
    design.addPosition({ name: "d1", offsets: [-1, 1, 0, -7, -8, 0, 0, -9] });
    design.addPosition({ name: "e1", offsets: [-1, 1, 0, -7, -8, 0, 0, -9] });
    design.addPosition({ name: "f1", offsets: [-1, 1, 0, -7, -8, 0, 0, -9] });
    design.addPosition({ name: "g1", offsets: [-1, 1, 0, -7, -8, 0, 0, -9] });
    design.addPosition({ name: "h1", offsets: [-1, 0, 0, 0, -8, 0, 0, -9] });

    design.addZone({ name: "last-rank", player: 1, positions: ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"] });
    design.addZone({ name: "last-rank", player: 2, positions: ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"] });
    design.addZone({ name: "third-rank", player: 1, positions: ["a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3"] });
    design.addZone({ name: "third-rank", player: 2, positions: ["a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6"] });

    design.addPiece({ name: "Pawn", type: 0, price: 2 });
    design.addMove({ pieceType: 0, func: pawnShift, params: [4], mode: 0 });
    design.addMove({ pieceType: 0, func: pawnJump, params: [4], mode: 0 });
    design.addMove({ pieceType: 0, func: pawnLeap, params: [7], mode: 0 });
    design.addMove({ pieceType: 0, func: pawnLeap, params: [3], mode: 0 });
    design.addMove({ pieceType: 0, func: enPassant, params: [1, 4], mode: 0 });
    design.addMove({ pieceType: 0, func: enPassant, params: [0, 4], mode: 0 });

    design.addPiece({ name: "Rook", type: 1, price: 10 });
    design.addMove({ pieceType: 1, func: slide, params: [4], mode: 0 });
    design.addMove({ pieceType: 1, func: slide, params: [2], mode: 0 });
    design.addMove({ pieceType: 1, func: slide, params: [0], mode: 0 });
    design.addMove({ pieceType: 1, func: slide, params: [1], mode: 0 });

    design.addPiece({ name: "Knight", type: 2, price: 6 });
    design.addMove({ pieceType: 2, func: jump, params: [4, 7], mode: 0 });
    design.addMove({ pieceType: 2, func: jump, params: [4, 3], mode: 0 });
    design.addMove({ pieceType: 2, func: jump, params: [2, 6], mode: 0 });
    design.addMove({ pieceType: 2, func: jump, params: [2, 5], mode: 0 });
    design.addMove({ pieceType: 2, func: jump, params: [0, 7], mode: 0 });
    design.addMove({ pieceType: 2, func: jump, params: [0, 6], mode: 0 });
    design.addMove({ pieceType: 2, func: jump, params: [1, 3], mode: 0 });
    design.addMove({ pieceType: 2, func: jump, params: [1, 5], mode: 0 });

    design.addPiece({ name: "Bishop", type: 3, price: 6 });
    design.addMove({ pieceType: 3, func: slide, params: [7], mode: 0 });
    design.addMove({ pieceType: 3, func: slide, params: [6], mode: 0 });
    design.addMove({ pieceType: 3, func: slide, params: [3], mode: 0 });
    design.addMove({ pieceType: 3, func: slide, params: [5], mode: 0 });

    design.addPiece({ name: "Queen", type: 4, price: 18 });
    design.addMove({ pieceType: 4, func: slide, params: [4], mode: 0 });
    design.addMove({ pieceType: 4, func: slide, params: [2], mode: 0 });
    design.addMove({ pieceType: 4, func: slide, params: [0], mode: 0 });
    design.addMove({ pieceType: 4, func: slide, params: [1], mode: 0 });
    design.addMove({ pieceType: 4, func: slide, params: [7], mode: 0 });
    design.addMove({ pieceType: 4, func: slide, params: [6], mode: 0 });
    design.addMove({ pieceType: 4, func: slide, params: [3], mode: 0 });
    design.addMove({ pieceType: 4, func: slide, params: [5], mode: 0 });

    design.addPiece({ name: "King", type: 5, price: 1000 });
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

    design.setInitialPieces({ player: "White", pieceName: "Pawn", positions: ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"] });
    design.setInitialPieces({ player: "White", pieceName: "Rook", positions: ["a1", "h1"] });
    design.setInitialPieces({ player: "White", pieceName: "Knight", positions: ["b1", "g1"] });
    design.setInitialPieces({ player: "White", pieceName: "Bishop", positions: ["c1", "f1"] });
    design.setInitialPieces({ player: "White", pieceName: "Queen", positions: ["d1"] });
    design.setInitialPieces({ player: "White", pieceName: "King", positions: ["e1"] });
    design.setInitialPieces({ player: "Black", pieceName: "Pawn", positions: ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"] });
    design.setInitialPieces({ player: "Black", pieceName: "Rook", positions: ["a8", "h8"] });
    design.setInitialPieces({ player: "Black", pieceName: "Knight", positions: ["b8", "g8"] });
    design.setInitialPieces({ player: "Black", pieceName: "Bishop", positions: ["c8", "f8"] });
    design.setInitialPieces({ player: "Black", pieceName: "Queen", positions: ["d8"] });
    design.setInitialPieces({ player: "Black", pieceName: "King", positions: ["e8"] });
};

export { games };
