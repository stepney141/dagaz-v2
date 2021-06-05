QUnit.test("Move list", function( assert ) {
  Dagaz.Model.InitGame();
  var design = Dagaz.Model.getDesign();
  var board  = Dagaz.Model.getInitBoard();
  var list   = Dagaz.Model.getMoveList(board);

  assert.equal( board.moves.length, 81, "81 moves generated");
  var drops = list.getDrops();
  assert.equal( drops.length, 81, "81 drops");
  assert.equal( drops[0], 80, "i1 position");
  var pieces = list.getDropPieces(80);
  assert.equal( pieces.length, 1, "One drop pieces");
  assert.equal( pieces[0].toString(), "Black Stone", "is Black Stone");

  var starts = list.getStarts();
  assert.equal( starts.length, 0, "Starts is empty");

  var targets = list.getTargets();
  assert.equal( targets.length, 0, "Targets is empty");

  var stops = list.getStops();
  assert.equal( stops.length, 81, "81 Stop positions");

  var drops = list.getDrops();
  assert.equal( drops.length, 81, "81 Drop positions");

  var move = list.setPosition(80);
  assert.equal( move.toString(), "Black Stone i1", "Black Stone i1");

  var moves = list.getMoves();
  assert.equal( list.isDone(), true, "Move is done");
  assert.equal( moves.length, 1, "One move");
  assert.equal( moves[0].toString(), "Black Stone i1", "Black Stone i1");

  Dagaz.Model.design = undefined;
  Dagaz.Model.board = undefined;
});
