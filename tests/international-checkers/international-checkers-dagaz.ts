import { games } from "./../../src/dagaz-model";
import type { MovementDefinitionMethod } from "../../src/types";

const shiftMan = function (ctx, params) {
	if (ctx.go(params, 0) && ctx.isEmpty()) {
		ctx.end();
	}
};

const jumpMan = function (ctx, params) {
	if (ctx.go(params, 0) && ctx.isEnemy()) {
		ctx.capture();
		if (ctx.go(params, 0) && ctx.isEmpty()) {
			ctx.end(1);
		}
	}
};

const shiftKing = function (ctx, params) {
	while (ctx.go(params, 0) && ctx.isEmpty()) {
		ctx.end();
	}
};

const jumpKing = function (ctx, params) {
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

const contKing = function (ctx, params) {
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
	design.checkVersion("smart-moves", true);
	design.checkVersion("maximal-captures", true);
	design.checkVersion("deferred-captures", true);

	design.addDirection([
		"se", // 0
		"sw", // 1
		"ne", // 2
		"nw" // 3
	]);

	design.addPlayer("White", [3, 2, 1, 0]);
	design.addPlayer("Black", [3, 2, 1, 0]);

	design.addPosition("a10", [11, 0, 0, 0]);
	design.addPosition("b10", [11, 9, 0, 0]);
	design.addPosition("c10", [11, 9, 0, 0]);
	design.addPosition("d10", [11, 9, 0, 0]);
	design.addPosition("e10", [11, 9, 0, 0]);
	design.addPosition("f10", [11, 9, 0, 0]);
	design.addPosition("g10", [11, 9, 0, 0]);
	design.addPosition("h10", [11, 9, 0, 0]);
	design.addPosition("i10", [11, 9, 0, 0]);
	design.addPosition("j10", [0, 9, 0, 0]);
	design.addPosition("a9", [11, 0, -9, 0]);
	design.addPosition("b9", [11, 9, -9, -11]);
	design.addPosition("c9", [11, 9, -9, -11]);
	design.addPosition("d9", [11, 9, -9, -11]);
	design.addPosition("e9", [11, 9, -9, -11]);
	design.addPosition("f9", [11, 9, -9, -11]);
	design.addPosition("g9", [11, 9, -9, -11]);
	design.addPosition("h9", [11, 9, -9, -11]);
	design.addPosition("i9", [11, 9, -9, -11]);
	design.addPosition("j9", [0, 9, 0, -11]);
	design.addPosition("a8", [11, 0, -9, 0]);
	design.addPosition("b8", [11, 9, -9, -11]);
	design.addPosition("c8", [11, 9, -9, -11]);
	design.addPosition("d8", [11, 9, -9, -11]);
	design.addPosition("e8", [11, 9, -9, -11]);
	design.addPosition("f8", [11, 9, -9, -11]);
	design.addPosition("g8", [11, 9, -9, -11]);
	design.addPosition("h8", [11, 9, -9, -11]);
	design.addPosition("i8", [11, 9, -9, -11]);
	design.addPosition("j8", [0, 9, 0, -11]);
	design.addPosition("a7", [11, 0, -9, 0]);
	design.addPosition("b7", [11, 9, -9, -11]);
	design.addPosition("c7", [11, 9, -9, -11]);
	design.addPosition("d7", [11, 9, -9, -11]);
	design.addPosition("e7", [11, 9, -9, -11]);
	design.addPosition("f7", [11, 9, -9, -11]);
	design.addPosition("g7", [11, 9, -9, -11]);
	design.addPosition("h7", [11, 9, -9, -11]);
	design.addPosition("i7", [11, 9, -9, -11]);
	design.addPosition("j7", [0, 9, 0, -11]);
	design.addPosition("a6", [11, 0, -9, 0]);
	design.addPosition("b6", [11, 9, -9, -11]);
	design.addPosition("c6", [11, 9, -9, -11]);
	design.addPosition("d6", [11, 9, -9, -11]);
	design.addPosition("e6", [11, 9, -9, -11]);
	design.addPosition("f6", [11, 9, -9, -11]);
	design.addPosition("g6", [11, 9, -9, -11]);
	design.addPosition("h6", [11, 9, -9, -11]);
	design.addPosition("i6", [11, 9, -9, -11]);
	design.addPosition("j6", [0, 9, 0, -11]);
	design.addPosition("a5", [11, 0, -9, 0]);
	design.addPosition("b5", [11, 9, -9, -11]);
	design.addPosition("c5", [11, 9, -9, -11]);
	design.addPosition("d5", [11, 9, -9, -11]);
	design.addPosition("e5", [11, 9, -9, -11]);
	design.addPosition("f5", [11, 9, -9, -11]);
	design.addPosition("g5", [11, 9, -9, -11]);
	design.addPosition("h5", [11, 9, -9, -11]);
	design.addPosition("i5", [11, 9, -9, -11]);
	design.addPosition("j5", [0, 9, 0, -11]);
	design.addPosition("a4", [11, 0, -9, 0]);
	design.addPosition("b4", [11, 9, -9, -11]);
	design.addPosition("c4", [11, 9, -9, -11]);
	design.addPosition("d4", [11, 9, -9, -11]);
	design.addPosition("e4", [11, 9, -9, -11]);
	design.addPosition("f4", [11, 9, -9, -11]);
	design.addPosition("g4", [11, 9, -9, -11]);
	design.addPosition("h4", [11, 9, -9, -11]);
	design.addPosition("i4", [11, 9, -9, -11]);
	design.addPosition("j4", [0, 9, 0, -11]);
	design.addPosition("a3", [11, 0, -9, 0]);
	design.addPosition("b3", [11, 9, -9, -11]);
	design.addPosition("c3", [11, 9, -9, -11]);
	design.addPosition("d3", [11, 9, -9, -11]);
	design.addPosition("e3", [11, 9, -9, -11]);
	design.addPosition("f3", [11, 9, -9, -11]);
	design.addPosition("g3", [11, 9, -9, -11]);
	design.addPosition("h3", [11, 9, -9, -11]);
	design.addPosition("i3", [11, 9, -9, -11]);
	design.addPosition("j3", [0, 9, 0, -11]);
	design.addPosition("a2", [11, 0, -9, 0]);
	design.addPosition("b2", [11, 9, -9, -11]);
	design.addPosition("c2", [11, 9, -9, -11]);
	design.addPosition("d2", [11, 9, -9, -11]);
	design.addPosition("e2", [11, 9, -9, -11]);
	design.addPosition("f2", [11, 9, -9, -11]);
	design.addPosition("g2", [11, 9, -9, -11]);
	design.addPosition("h2", [11, 9, -9, -11]);
	design.addPosition("i2", [11, 9, -9, -11]);
	design.addPosition("j2", [0, 9, 0, -11]);
	design.addPosition("a1", [0, 0, -9, 0]);
	design.addPosition("b1", [0, 0, -9, -11]);
	design.addPosition("c1", [0, 0, -9, -11]);
	design.addPosition("d1", [0, 0, -9, -11]);
	design.addPosition("e1", [0, 0, -9, -11]);
	design.addPosition("f1", [0, 0, -9, -11]);
	design.addPosition("g1", [0, 0, -9, -11]);
	design.addPosition("h1", [0, 0, -9, -11]);
	design.addPosition("i1", [0, 0, -9, -11]);
	design.addPosition("j1", [0, 0, 0, -11]);

	design.addZone("promotion", 2, ["a1", "c1", "e1", "g1", "i1"]);
	design.addZone("promotion", 1, ["b10", "d10", "f10", "h10", "j10"]);

	design.addPriority(1);			// jump-type
	design.addPriority(0);			// normal-type

	design.addPiece("Man", 0, 20);
	design.addMove({ pieceType: 0, func: jumpMan, params: [3], mode: 1 });
	design.addMove({ pieceType: 0, func: jumpMan, params: [0], mode: 1 });
	design.addMove({ pieceType: 0, func: jumpMan, params: [2], mode: 1 });
	design.addMove({ pieceType: 0, func: jumpMan, params: [1], mode: 1 });
	design.addMove({ pieceType: 0, func: shiftMan, params: [2], mode: 0 });
	design.addMove({ pieceType: 0, func: shiftMan, params: [3], mode: 0 });

	design.addPiece("King", 1, 100);
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

	design.setup("White", "Man", ["a1", "c1", "e1", "g1", "i1", "b2", "d2", "f2", "h2", "j2", "a3", "c3", "e3", "g3", "i3", "b4", "d4", "f4", "h4", "j4"]);
	design.setup("Black", "Man", ["b10", "d10", "f10", "h10", "j10", "a9", "c9", "e9", "g9", "i9", "b8", "d8", "f8", "h8", "j8", "a7", "c7", "e7", "g7", "i7"]);
};

export { games };
