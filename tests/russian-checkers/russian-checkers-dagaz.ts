import { games } from "./../../src/dagaz-model";
import type { MovementDefinitionMethod } from "../../src/types";

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

games.model.buildDesign = function (design) {
	design.checkVersion("smart-moves", true);
	design.checkVersion("deferred-captures", true);

	design.addDirection([
		"ne", // 0
		"se", // 1
		"sw", // 2
		"nw" // 3
	]);

	design.addPlayer("White", [2, 3, 0, 1]);
	design.addPlayer("Black", [2, 3, 0, 1]);

	design.addPosition("a8", [0, 9, 0, 0]);
	design.addPosition("b8", [0, 9, 7, 0]);
	design.addPosition("c8", [0, 9, 7, 0]);
	design.addPosition("d8", [0, 9, 7, 0]);
	design.addPosition("e8", [0, 9, 7, 0]);
	design.addPosition("f8", [0, 9, 7, 0]);
	design.addPosition("g8", [0, 9, 7, 0]);
	design.addPosition("h8", [0, 0, 7, 0]);
	design.addPosition("a7", [-7, 9, 0, 0]);
	design.addPosition("b7", [-7, 9, 7, -9]);
	design.addPosition("c7", [-7, 9, 7, -9]);
	design.addPosition("d7", [-7, 9, 7, -9]);
	design.addPosition("e7", [-7, 9, 7, -9]);
	design.addPosition("f7", [-7, 9, 7, -9]);
	design.addPosition("g7", [-7, 9, 7, -9]);
	design.addPosition("h7", [0, 0, 7, -9]);
	design.addPosition("a6", [-7, 9, 0, 0]);
	design.addPosition("b6", [-7, 9, 7, -9]);
	design.addPosition("c6", [-7, 9, 7, -9]);
	design.addPosition("d6", [-7, 9, 7, -9]);
	design.addPosition("e6", [-7, 9, 7, -9]);
	design.addPosition("f6", [-7, 9, 7, -9]);
	design.addPosition("g6", [-7, 9, 7, -9]);
	design.addPosition("h6", [0, 0, 7, -9]);
	design.addPosition("a5", [-7, 9, 0, 0]);
	design.addPosition("b5", [-7, 9, 7, -9]);
	design.addPosition("c5", [-7, 9, 7, -9]);
	design.addPosition("d5", [-7, 9, 7, -9]);
	design.addPosition("e5", [-7, 9, 7, -9]);
	design.addPosition("f5", [-7, 9, 7, -9]);
	design.addPosition("g5", [-7, 9, 7, -9]);
	design.addPosition("h5", [0, 0, 7, -9]);
	design.addPosition("a4", [-7, 9, 0, 0]);
	design.addPosition("b4", [-7, 9, 7, -9]);
	design.addPosition("c4", [-7, 9, 7, -9]);
	design.addPosition("d4", [-7, 9, 7, -9]);
	design.addPosition("e4", [-7, 9, 7, -9]);
	design.addPosition("f4", [-7, 9, 7, -9]);
	design.addPosition("g4", [-7, 9, 7, -9]);
	design.addPosition("h4", [0, 0, 7, -9]);
	design.addPosition("a3", [-7, 9, 0, 0]);
	design.addPosition("b3", [-7, 9, 7, -9]);
	design.addPosition("c3", [-7, 9, 7, -9]);
	design.addPosition("d3", [-7, 9, 7, -9]);
	design.addPosition("e3", [-7, 9, 7, -9]);
	design.addPosition("f3", [-7, 9, 7, -9]);
	design.addPosition("g3", [-7, 9, 7, -9]);
	design.addPosition("h3", [0, 0, 7, -9]);
	design.addPosition("a2", [-7, 9, 0, 0]);
	design.addPosition("b2", [-7, 9, 7, -9]);
	design.addPosition("c2", [-7, 9, 7, -9]);
	design.addPosition("d2", [-7, 9, 7, -9]);
	design.addPosition("e2", [-7, 9, 7, -9]);
	design.addPosition("f2", [-7, 9, 7, -9]);
	design.addPosition("g2", [-7, 9, 7, -9]);
	design.addPosition("h2", [0, 0, 7, -9]);
	design.addPosition("a1", [-7, 0, 0, 0]);
	design.addPosition("b1", [-7, 0, 0, -9]);
	design.addPosition("c1", [-7, 0, 0, -9]);
	design.addPosition("d1", [-7, 0, 0, -9]);
	design.addPosition("e1", [-7, 0, 0, -9]);
	design.addPosition("f1", [-7, 0, 0, -9]);
	design.addPosition("g1", [-7, 0, 0, -9]);
	design.addPosition("h1", [0, 0, 0, -9]);

	design.addZone("promotion", 2, ["a1", "c1", "e1", "g1"]);
	design.addZone("promotion", 1, ["b8", "d8", "f8", "h8"]);

	design.addPriority(1);			// jump-type
	design.addPriority(0);			// normal-type

	design.addPiece("Man", 0, 20);
	design.addMove({ pieceType: 0, func: jumpMan, params: [3], mode: 1 });
	design.addMove({ pieceType: 0, func: jumpMan, params: [0], mode: 1 });
	design.addMove({ pieceType: 0, func: jumpMan, params: [2], mode: 1 });
	design.addMove({ pieceType: 0, func: jumpMan, params: [1], mode: 1 });
	design.addMove({ pieceType: 0, func: shiftMan, params: [3], mode: 0 });
	design.addMove({ pieceType: 0, func: shiftMan, params: [0], mode: 0 });

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

	design.setup("White", "Man", ["a3", "c3", "e3", "g3", "b2", "d2", "f2", "h2", "a1", "c1", "e1", "g1"]);
	design.setup("Black", "Man", ["b8", "d8", "f8", "h8", "a7", "c7", "e7", "g7", "b6", "d6", "f6", "h6"]);
};

export { games };
