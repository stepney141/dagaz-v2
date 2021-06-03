import { games } from "./international-checkers-dagaz.js";

QUnit.test("Man promotion", function (assert) {
  var design = games.model.getDesign();
  var board = design.getInitBoard().copy();
  assert.equal( board.player , 1, "White move");
  board.clear();
  var white = design.createPiece(0, 1);
  board.setPiece(design.stringToPos("b8"), white);
  var black = design.createPiece(0, 2);
  board.setPiece(design.stringToPos("b2"), black);
  board.setPiece(design.stringToPos("b4"), black);
  board.setPiece(design.stringToPos("c7"), black);
  board.setPiece(design.stringToPos("c9"), black);
  board.setPiece(design.stringToPos("d6"), black);
  board.setPiece(design.stringToPos("e3"), black);
  board.setPiece(design.stringToPos("e9"), black);
  board.setPiece(design.stringToPos("f2"), black);
  board.setPiece(design.stringToPos("g3"), black);
  board.setPiece(design.stringToPos("g5"), black);
  board.setPiece(design.stringToPos("g7"), black);
  board.setPiece(design.stringToPos("g9"), black);
  board.setPiece(design.stringToPos("i7"), black);
  board.setPiece(design.stringToPos("i9"), black);
  board.generate();
  assert.equal( board.moves.length, 2, "2 moves:");
  assert.equal( board.moves[0].toString(design) , "b8-d10-f8-h10-j8-h6-f4-h2", "b8-d10-f8-h10-j8-h6-f4-h2");
  assert.equal( board.moves[1].toString(design) , "b8-d10-f8-h10-j8-h6-f4-d2", "b8-d10-f8-h10-j8-h6-f4-d2");
  board = board.apply(board.moves[0]);
  assert.equal( board.player , 2, "Black move");
  assert.ok( board.getPiece(design.stringToPos("b8")) === null, "b8 is empty");
  assert.ok( board.getPiece(design.stringToPos("c9")) === null, "c9 is empty");
  assert.ok( board.getPiece(design.stringToPos("e9")) === null, "e9 is empty");
  assert.ok( board.getPiece(design.stringToPos("g9")) === null, "g9 is empty");
  assert.ok( board.getPiece(design.stringToPos("i9")) === null, "i9 is empty");
  assert.ok( board.getPiece(design.stringToPos("i7")) === null, "i7 is empty");
  assert.ok( board.getPiece(design.stringToPos("g5")) === null, "g5 is empty");
  assert.ok( board.getPiece(design.stringToPos("g3")) === null, "g3 is empty");
  assert.equal( board.getPiece(design.stringToPos("b2")).toString(design) , "Black Man", "Black Man on b2");
  assert.equal( board.getPiece(design.stringToPos("b4")).toString(design) , "Black Man", "Black Man on b4");
  assert.equal( board.getPiece(design.stringToPos("c7")).toString(design) , "Black Man", "Black Man on c7");
  assert.equal( board.getPiece(design.stringToPos("d6")).toString(design) , "Black Man", "Black Man on d6");
  assert.equal( board.getPiece(design.stringToPos("e3")).toString(design) , "Black Man", "Black Man on e3");
  assert.equal( board.getPiece(design.stringToPos("f2")).toString(design) , "Black Man", "Black Man on f2");
  assert.equal( board.getPiece(design.stringToPos("g7")).toString(design) , "Black Man", "Black Man on g7");
  assert.equal( board.getPiece(design.stringToPos("h2")).toString(design) , "White Man", "White Man on h2");
  board.generate();
  assert.equal( board.moves.length, 12, "12 moves:");
  assert.equal( board.moves[0].toString(design) , "c7-b6", "c7-b6");
  assert.equal( board.moves[1].toString(design) , "g7-f6", "g7-f6");
  assert.equal( board.moves[2].toString(design) , "g7-h6", "g7-h6");
  assert.equal( board.moves[3].toString(design) , "d6-c5", "d6-c5");
  assert.equal( board.moves[4].toString(design) , "d6-e5", "d6-e5");
  assert.equal( board.moves[5].toString(design) , "b4-a3", "b4-a3");
  assert.equal( board.moves[6].toString(design) , "b4-c3", "b4-c3");
  assert.equal( board.moves[7].toString(design) , "e3-d2", "e3-d2");
  assert.equal( board.moves[8].toString(design) , "b2-a1", "b2-a1");
  assert.equal( board.moves[9].toString(design) , "b2-c1", "b2-c1");
  assert.equal( board.moves[10].toString(design) , "f2-e1", "f2-e1");
  assert.equal( board.moves[11].toString(design) , "f2-g1", "f2-g1");
  board = board.apply(board.moves[8]);
  assert.equal( board.player , 1, "White move");
  assert.ok( board.getPiece(design.stringToPos("b2")) === null, "b2 is empty");
  assert.equal( board.getPiece(design.stringToPos("a1")).toString(design) , "Black King", "Black King on a1");
});

QUnit.test( "Check lastFrom", function( assert ) {
  var design = games.model.getDesign();
  var board = design.getInitBoard().copy();
  assert.equal( board.player , 1, "White move");
  board.clear();
  var white = design.createPiece(1, 1);
  board.setPiece(design.stringToPos("d4"), white);
  board.setPiece(design.stringToPos("e5"), white);
  var black = design.createPiece(1, 2);
  board.setPiece(design.stringToPos("j10"), black);
  board.generate();
  assert.equal( board.moves.length, 21, "21 moves:");
  assert.equal( board.moves[0].toString(design) , "e5-d6", "e5-d6");
  assert.equal( board.moves[1].toString(design) , "e5-c7", "e5-c7");
  assert.equal( board.moves[2].toString(design) , "e5-b8", "e5-b8");
  assert.equal( board.moves[3].toString(design) , "e5-a9", "e5-a9");
  assert.equal( board.moves[4].toString(design) , "e5-f4", "e5-f4");
  assert.equal( board.moves[5].toString(design) , "e5-g3", "e5-g3");
  assert.equal( board.moves[6].toString(design) , "e5-h2", "e5-h2");
  assert.equal( board.moves[7].toString(design) , "e5-i1", "e5-i1");
  assert.equal( board.moves[8].toString(design) , "e5-f6", "e5-f6");
  assert.equal( board.moves[9].toString(design) , "e5-g7", "e5-g7");
  assert.equal( board.moves[10].toString(design) , "e5-h8", "e5-h8");
  assert.equal( board.moves[11].toString(design) , "e5-i9", "e5-i9");
  assert.equal( board.moves[12].toString(design) , "d4-c5", "d4-c5");
  assert.equal( board.moves[13].toString(design) , "d4-b6", "d4-b6");
  assert.equal( board.moves[14].toString(design) , "d4-a7", "d4-a7");
  assert.equal( board.moves[15].toString(design) , "d4-e3", "d4-e3");
  assert.equal( board.moves[16].toString(design) , "d4-f2", "d4-f2");
  assert.equal( board.moves[17].toString(design) , "d4-g1", "d4-g1");
  assert.equal( board.moves[18].toString(design) , "d4-c3", "d4-c3");
  assert.equal( board.moves[19].toString(design) , "d4-b2", "d4-b2");
  assert.equal( board.moves[20].toString(design) , "d4-a1", "d4-a1");
  board = board.apply(board.moves[7]);
  assert.equal( board.player , 2, "Black move");
  board.generate();
  assert.equal( board.moves.length, 3, "3 moves:");
  assert.equal( board.moves[0].toString(design) , "j10-c3", "j10-c3");
  assert.equal( board.moves[1].toString(design) , "j10-b2", "j10-b2");
  assert.equal( board.moves[2].toString(design) , "j10-a1", "j10-a1");
});
