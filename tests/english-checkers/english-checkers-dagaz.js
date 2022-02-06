import { DagazClient } from "../../src/game-client.js";

const shiftMan = function(ctx, params) {
  if (ctx.go(params, 0) && ctx.isEmpty()) {
    if (ctx.inZone(0)) {
      ctx.promote(1);
    }    
    ctx.end();
  }
};

const shiftKing = function(ctx, params) {
  if (ctx.go(params, 0) && ctx.isEmpty()) {
    ctx.end();
  }
};

const jumpMan = function(ctx, params) {
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

const jumpKing = function(ctx, params) {
  if (ctx.go(params, 0) && ctx.isEnemy()) {
    ctx.capture();
    if (ctx.go(params, 0) && ctx.isEmpty()) {
      ctx.end(1);
    }
  }
};

const game_rules = function(design) {
  design.checkVersion("smart-moves", "true");

  design.addDirection("ne"); // 0
  design.addDirection("se"); // 1
  design.addDirection("sw"); // 2
  design.addDirection("nw"); // 3

  design.addPlayer("Black", [2, 3, 0, 1]);
  design.addPlayer("White", [2, 3, 0, 1]);

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
  design.addMove(0, jumpMan, [3], 1);
  design.addMove(0, jumpMan, [0], 1);
  design.addMove(0, shiftMan, [3], 0);
  design.addMove(0, shiftMan, [0], 0);

  design.addPiece("King", 1, 40);
  design.addMove(1, jumpKing, [3], 1);
  design.addMove(1, jumpKing, [0], 1);
  design.addMove(1, jumpKing, [2], 1);
  design.addMove(1, jumpKing, [1], 1);
  design.addMove(1, shiftKing, [3], 0);
  design.addMove(1, shiftKing, [0], 0);
  design.addMove(1, shiftKing, [2], 0);
  design.addMove(1, shiftKing, [1], 0);

  design.setup("Black", "Man", ["a3", "c3", "e3", "g3", "b2", "d2", "f2", "h2", "a1", "c1", "e1", "g1"]);
  design.setup("White", "Man", ["b8", "d8", "f8", "h8", "a7", "c7", "e7", "g7", "b6", "d6", "f6", "h6"]);
};

class EnglishCheckerClient {
  constructor () {
    this.client = new DagazClient({ game: game_rules });
    this.client.buildGameDesign();
  }

  getGameDesign() {
    return this.client.getGameDesign();
  }
}

export { EnglishCheckerClient };
