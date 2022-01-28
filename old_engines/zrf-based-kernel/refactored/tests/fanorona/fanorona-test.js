import { Dagaz } from '../../common-scripts/dagaz.js';
import '../../common-scripts/Model/zrf-model.js';

import './fanorona-invariant.js';
import './fanorona-extension.js';
import './fanorona.js';

QUnit.test("Model Bug", function (assert) {
  Dagaz.Model.InitGame();
  var design = Dagaz.Model.getDesign();
  var board  = Dagaz.Model.getInitBoard();

  board.generate();
  assert.equal( board.moves.length, 5, "5 moves generated");
  assert.equal( board.moves[0].toString(), "f2 - e3 x d4 x c5");
  assert.equal( board.moves[1].toString(), "e2 - e3 x e4 x e5");
  assert.equal( board.moves[2].toString(), "d2 - e3 x f4 x g5");
  assert.equal( board.moves[3].toString(), "d3 - e3 x c3");
  assert.equal( board.moves[4].toString(), "d3 - e3 x f3");

  board = board.apply(board.moves[3]);
  board.generate();
  assert.equal( board.moves.length, 18, "18 moves generated");
  assert.equal( board.moves[0].toString(), "d4 - c3 x b2 x a1");
  assert.equal( board.moves[1].toString(), "d4 - c3 - d3 x b2 x a1 x e3");
  assert.equal( board.moves[2].toString(), "d4 - c3 - d3 x b2 x a1 x b3");
  assert.equal( board.moves[3].toString(), "d4 - d3 x d2 x d1");
  assert.equal( board.moves[4].toString(), "d4 - d3 - c3 x d2 x d1 x b3");
  assert.equal( board.moves[5].toString(), "d4 - d3 - c3 - d2 x d2 x d1 x b3 x e1");
  assert.equal( board.moves[6].toString(), "d4 - d3 - c3 x d2 x d1 x e3");
  assert.equal( board.moves[7].toString(), "d4 - d3 - c3 - d2 x d2 x d1 x e3 x e1");
  assert.equal( board.moves[8].toString(), "d4 - d3 - c3 - d2 - e3 x d2 x d1 x e3 x e1 x c1");
  assert.equal( board.moves[9].toString(), "c4 - c3 x c2 x c1");
  assert.equal( board.moves[10].toString(), "c4 - c3 - d3 x c2 x c1 x e3");
  assert.equal( board.moves[11].toString(), "c4 - c3 - d3 x c2 x c1 x b3");
  assert.equal( board.moves[12].toString(), "b4 - c3 x d2 x e1");
  assert.equal( board.moves[13].toString(), "b4 - c3 - d3 x d2 x e1 x e3");
  assert.equal( board.moves[14].toString(), "b4 - c3 - d3 - d2 x d2 x e1 x e3 x d1");
  assert.equal( board.moves[15].toString(), "b4 - c3 - d3 - d2 - e3 x d2 x e1 x e3 x d1 x c1");
  assert.equal( board.moves[16].toString(), "b4 - c3 - d3 x d2 x e1 x b3");
  assert.equal( board.moves[17].toString(), "b4 - c3 - d3 - d2 x d2 x e1 x b3 x d1");

  board = board.apply(board.moves[10]);
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("d3")).toString(), "Black Stone", "d3 - Black Stone");

  Dagaz.Model.design = undefined;
  Dagaz.Model.board = undefined;
});
