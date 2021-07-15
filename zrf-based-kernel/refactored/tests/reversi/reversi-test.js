import { Dagaz } from '../../common-scripts/dagaz.js';
import '../../common-scripts/Model/zrf-model.js';
import '../../common-scripts/Controller/utils/move-list-v3.js';
import './reversi-extension.js';
import './reversi.js';

QUnit.test("Move list", function (assert) {
  Dagaz.Model.InitGame();
  var design = Dagaz.Model.getDesign();
  var board  = Dagaz.Model.getInitBoard();
  var list   = Dagaz.Model.getMoveList(board);

  assert.equal( board.moves.length, 4, "4 moves generated");
  assert.equal( board.moves[0].toString(), "Black Stone e3", "Black Stone e3");
  assert.equal( board.moves[0].actions.length, 2, "2 actions");
  assert.equal( board.moves[0].actions[0][0], null, "Drop move");
  assert.equal( Dagaz.Model.posToString(board.moves[0].actions[0][1][0]), "e3", "to e3");
  assert.equal( board.moves[0].actions[0][2][0], "Black Stone", "Black Stone");
  assert.equal( board.moves[0].actions[0][3], 1, "Level 1");

  assert.equal( Dagaz.Model.posToString(board.moves[0].actions[1][0][0]), "e4", "Move from e4");
  assert.equal( Dagaz.Model.posToString(board.moves[0].actions[1][1][0]), "e4", "to e4");
  assert.equal( board.moves[0].actions[1][2][0], "Black Stone", "Black Stone");
  assert.equal( board.moves[0].actions[1][3], 1, "Level 1");

  var starts = list.getStarts();
  assert.equal( starts.length, 0, "Starts is empty");

  var targets = list.getTargets();
  assert.equal( targets.length, 0, "Targets is empty");

  var stops = list.getStops();
  assert.equal( stops.length, 4, "4 Stop positions");

  var drops = list.getDrops();
  assert.equal( drops.length, 4, "4 Drop positions");

  var move = list.setPosition(Dagaz.Model.stringToPos("e3"));
  assert.equal( move.toString(), "Black Stone e3", "Black Stone e3");

  var moves = list.getMoves();
  assert.equal( list.isDone(), true, "Move is done");
  assert.equal( moves.length, 1, "One move");
  assert.equal( moves[0].toString(), "Black Stone e3", "Black Stone e3");

  Dagaz.Model.design = undefined;
  Dagaz.Model.board = undefined;
});
