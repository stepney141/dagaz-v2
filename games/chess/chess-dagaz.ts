import type { TDesign } from "../../src/design";
import type { MovementDefinitionMethod } from "../../src/types";

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

export const buildDesign = function (design: TDesign) {
  design.setGameOption({ "smart-moves": false });

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

  design.addPlayer(
    { name: "White", symmetry: [1, 0, 4, 6, 2, 7, 3, 5] }, // [e, w, n, sw, s, nw, ne, se]
    { name: "Black", symmetry: [0, 1, 4, 5, 2, 3, 7, 6] } // [w, e, n, se, s, ne, nw, sw]
  );

  design.addLocation(
    { name: "a8", offsets: [0, 1, 8, 0, 0, 9, 0, 0] },
    { name: "b8", offsets: [-1, 1, 8, 0, 0, 9, 7, 0] },
    { name: "c8", offsets: [-1, 1, 8, 0, 0, 9, 7, 0] },
    { name: "d8", offsets: [-1, 1, 8, 0, 0, 9, 7, 0] },
    { name: "e8", offsets: [-1, 1, 8, 0, 0, 9, 7, 0] },
    { name: "f8", offsets: [-1, 1, 8, 0, 0, 9, 7, 0] },
    { name: "g8", offsets: [-1, 1, 8, 0, 0, 9, 7, 0] },
    { name: "h8", offsets: [-1, 0, 8, 0, 0, 0, 7, 0] },
    { name: "a7", offsets: [0, 1, 8, -7, -8, 9, 0, 0] },
    { name: "b7", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "c7", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "d7", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "e7", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "f7", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "g7", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "h7", offsets: [-1, 0, 8, 0, -8, 0, 7, -9] },
    { name: "a6", offsets: [0, 1, 8, -7, -8, 9, 0, 0] },
    { name: "b6", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "c6", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "d6", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "e6", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "f6", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "g6", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "h6", offsets: [-1, 0, 8, 0, -8, 0, 7, -9] },
    { name: "a5", offsets: [0, 1, 8, -7, -8, 9, 0, 0] },
    { name: "b5", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "c5", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "d5", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "e5", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "f5", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "g5", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "h5", offsets: [-1, 0, 8, 0, -8, 0, 7, -9] },
    { name: "a4", offsets: [0, 1, 8, -7, -8, 9, 0, 0] },
    { name: "b4", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "c4", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "d4", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "e4", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "f4", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "g4", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "h4", offsets: [-1, 0, 8, 0, -8, 0, 7, -9] },
    { name: "a3", offsets: [0, 1, 8, -7, -8, 9, 0, 0] },
    { name: "b3", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "c3", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "d3", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "e3", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "f3", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "g3", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "h3", offsets: [-1, 0, 8, 0, -8, 0, 7, -9] },
    { name: "a2", offsets: [0, 1, 8, -7, -8, 9, 0, 0] },
    { name: "b2", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "c2", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "d2", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "e2", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "f2", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "g2", offsets: [-1, 1, 8, -7, -8, 9, 7, -9] },
    { name: "h2", offsets: [-1, 0, 8, 0, -8, 0, 7, -9] },
    { name: "a1", offsets: [0, 1, 0, -7, -8, 0, 0, 0] },
    { name: "b1", offsets: [-1, 1, 0, -7, -8, 0, 0, -9] },
    { name: "c1", offsets: [-1, 1, 0, -7, -8, 0, 0, -9] },
    { name: "d1", offsets: [-1, 1, 0, -7, -8, 0, 0, -9] },
    { name: "e1", offsets: [-1, 1, 0, -7, -8, 0, 0, -9] },
    { name: "f1", offsets: [-1, 1, 0, -7, -8, 0, 0, -9] },
    { name: "g1", offsets: [-1, 1, 0, -7, -8, 0, 0, -9] },
    { name: "h1", offsets: [-1, 0, 0, 0, -8, 0, 0, -9] }
  );

  design.addZone(
    { name: "last-rank", player: 1, locations: ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"] },
    { name: "last-rank", player: 2, locations: ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"] },
    { name: "third-rank", player: 1, locations: ["a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3"] },
    { name: "third-rank", player: 2, locations: ["a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6"] }
  );

  design.addPiece({ name: "Pawn", type: 0, price: 2 });
  design.addMove(
    { pieceType: 0, func: pawnShift, params: ["n"], mode: 0 },
    { pieceType: 0, func: pawnJump, params: ["n"], mode: 0 },
    { pieceType: 0, func: pawnLeap, params: ["nw"], mode: 0 },
    { pieceType: 0, func: pawnLeap, params: ["ne"], mode: 0 },
    { pieceType: 0, func: enPassant, params: ["e", "n"], mode: 0 },
    { pieceType: 0, func: enPassant, params: ["w", "n"], mode: 0 }
  );

  design.addPiece({ name: "Rook", type: 1, price: 10 });
  design.addMove(
    { pieceType: 1, func: slide, params: ["n"], mode: 0 },
    { pieceType: 1, func: slide, params: ["s"], mode: 0 },
    { pieceType: 1, func: slide, params: ["w"], mode: 0 },
    { pieceType: 1, func: slide, params: ["e"], mode: 0 }
  );

  design.addPiece({ name: "Knight", type: 2, price: 6 });
  design.addMove(
    { pieceType: 2, func: jump, params: ["n", "nw"], mode: 0 },
    { pieceType: 2, func: jump, params: ["n", "ne"], mode: 0 },
    { pieceType: 2, func: jump, params: ["s", "sw"], mode: 0 },
    { pieceType: 2, func: jump, params: ["s", "se"], mode: 0 },
    { pieceType: 2, func: jump, params: ["w", "nw"], mode: 0 },
    { pieceType: 2, func: jump, params: ["w", "sw"], mode: 0 },
    { pieceType: 2, func: jump, params: ["e", "ne"], mode: 0 },
    { pieceType: 2, func: jump, params: ["e", "se"], mode: 0 }
  );

  design.addPiece({ name: "Bishop", type: 3, price: 6 });
  design.addMove(
    { pieceType: 3, func: slide, params: ["nw"], mode: 0 },
    { pieceType: 3, func: slide, params: ["sw"], mode: 0 },
    { pieceType: 3, func: slide, params: ["ne"], mode: 0 },
    { pieceType: 3, func: slide, params: ["se"], mode: 0 }
  );

  design.addPiece({ name: "Queen", type: 4, price: 18 });
  design.addMove(
    { pieceType: 4, func: slide, params: ["n"], mode: 0 },
    { pieceType: 4, func: slide, params: ["s"], mode: 0 },
    { pieceType: 4, func: slide, params: ["w"], mode: 0 },
    { pieceType: 4, func: slide, params: ["e"], mode: 0 },
    { pieceType: 4, func: slide, params: ["nw"], mode: 0 },
    { pieceType: 4, func: slide, params: ["sw"], mode: 0 },
    { pieceType: 4, func: slide, params: ["ne"], mode: 0 },
    { pieceType: 4, func: slide, params: ["se"], mode: 0 }
  );

  design.addPiece({ name: "King", type: 5, price: 1000 });
  design.addMove(
    { pieceType: 5, func: step, params: ["n"], mode: 0 },
    { pieceType: 5, func: step, params: ["s"], mode: 0 },
    { pieceType: 5, func: step, params: ["w"], mode: 0 },
    { pieceType: 5, func: step, params: ["e"], mode: 0 },
    { pieceType: 5, func: step, params: ["nw"], mode: 0 },
    { pieceType: 5, func: step, params: ["sw"], mode: 0 },
    { pieceType: 5, func: step, params: ["ne"], mode: 0 },
    { pieceType: 5, func: step, params: ["se"], mode: 0 },
    { pieceType: 5, func: O_O, params: ["e", "w"], mode: 1 },
    { pieceType: 5, func: O_O_O, params: ["w", "e"], mode: 1 }
  );

  design.setInitialPieces(
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
