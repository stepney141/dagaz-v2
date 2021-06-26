import { Dagaz } from '../../common-scripts/Controller/ai/bruteforce-ai.js';

QUnit.test("One tile", function (assert) {
  Dagaz.Model.InitGame();
  var design = Dagaz.Model.getDesign();
  var board  = Dagaz.Model.getInitBoard();
  board.clear();

  design.setup("You", "B00009", Dagaz.Model.stringToPos("c3"));
  var piece = board.getPiece(Dagaz.Model.stringToPos("c3"));
  assert.ok( piece !== null, "Tile found");
  assert.equal( piece.player, 1, "Tile's owner");
  assert.equal( piece.type, 20, "Tile's ID");
  assert.equal( piece.getValue(0), 9, "Tile's tag");

  board.generate();
  assert.equal( board.moves.length, 4, "4 moves generated");
  assert.equal( board.moves[0].toString(), "c3-d3", "c3-d3");
  assert.equal( board.moves[1].toString(), "c3-b3", "c3-b3");
  assert.equal( board.moves[2].toString(), "c3-c2", "c3-c2");
  assert.equal( board.moves[3].toString(), "c3-c4", "c3-c4");

  var board = board.apply(board.moves[0]);
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("d3")).toString(), "You B00009", "B00009 on d3");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("c3")), null, "c3 is empty");

  Dagaz.Model.design = undefined;
  Dagaz.Model.board = undefined;
});

QUnit.test( "One piece", function( assert ) {
  Dagaz.Model.InitGame();
  var design = Dagaz.Model.getDesign();
  var board  = Dagaz.Model.getInitBoard();
  board.clear();
  design.checkVersion("sliding-puzzle", "all");

  design.setup("You", "B00009", Dagaz.Model.stringToPos("a3"));
  design.setup("You", "B00009", Dagaz.Model.stringToPos("a2"));
  assert.equal( board.checkGoals(design), null, "No win");

  board.generate();
  assert.equal( board.moves.length, 6, "6 moves generated");
  assert.equal( board.moves[0].toString(), "a2-b2", "a2-b2 a3-b3");
  assert.equal( board.moves[1].toString(), "a2-a1", "a2-a1 a3-a2");
  assert.equal( board.moves[2].toString(), "a2-a3", "a2-a3-a4");
  assert.equal( board.moves[3].toString(), "a3-b3", "a3-b3 a2-b2");
  assert.equal( board.moves[4].toString(), "a3-a2", "a3-a2-a1");
  assert.equal( board.moves[5].toString(), "a3-a4", "a3-a4 a2-a3");

  Dagaz.Model.design = undefined;
  Dagaz.Model.board = undefined;
});

QUnit.test( "More pieces", function( assert ) {
  Dagaz.Model.InitGame();
  var design = Dagaz.Model.getDesign();
  var board  = Dagaz.Model.getInitBoard();
  board.clear();
  design.checkVersion("sliding-puzzle", "distinct");

  design.setup("You", "R01002", Dagaz.Model.stringToPos("d5"));
  design.setup("You", "R10102", Dagaz.Model.stringToPos("e5"));
  design.setup("You", "R00012", Dagaz.Model.stringToPos("e4"));
  design.setup("You", "R00105", Dagaz.Model.stringToPos("c5"));
  design.setup("You", "R01015", Dagaz.Model.stringToPos("c4"));
  design.setup("You", "R10005", Dagaz.Model.stringToPos("d4"));
  assert.equal( board.checkGoals(design), 1, "Win position");

  board.generate();
  assert.equal( board.moves.length, 2, "2 moves generated");
  assert.equal( board.moves[0].toString(), "d4-c4", "d4-c4 c5-b5 c4-b4");
  assert.equal( board.moves[1].toString(), "d4-d3", "d4-d3 c5-c4-c3");

  var board = board.apply(board.moves[0]);
  assert.equal( board.checkGoals(design), null, "No win");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("d5")).toString(), "You R01002", "R01002 on d5");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("e5")).toString(), "You R10102", "R10102 on e5");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("e4")).toString(), "You R00012", "R00012 on e4");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("c4")).toString(), "You R10005", "R10005 on c4");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("b5")).toString(), "You R00105", "R00105 on b5");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("b4")).toString(), "You R01015", "R01015 on b4");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("c5")), null, "c5 is empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("d4")), null, "d4 is empty");

  board.generate();
  assert.equal( board.moves.length, 5, "5 moves generated");
  assert.equal( board.moves[0].toString(), "e4-d4", "e4-d4 d5-c5 e5-d5");
  assert.equal( board.moves[1].toString(), "e4-e3", "e4-e3 d5-d4 e5-e4");
  assert.equal( board.moves[2].toString(), "c4-d4", "c4-d4 b5-c5 b4-c4");
  assert.equal( board.moves[3].toString(), "c4-b4", "c4-b4 b5-a5 b4-a4");
  assert.equal( board.moves[4].toString(), "c4-c3", "c4-c3 b5-b4-b3");

  Dagaz.Model.design = undefined;
  Dagaz.Model.board = undefined;
});
