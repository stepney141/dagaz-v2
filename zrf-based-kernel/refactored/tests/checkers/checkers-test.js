import { Dagaz } from '../../common-scripts/dagaz.js';
import '../../common-scripts/Model/zrf-model.js';
import '../../common-scripts/Controller/utils/move-list.js';
import './maximal-captures.js';
import './turkish-dama.js';

QUnit.test("Move Generator", function (assert) {
  Dagaz.Model.InitGame();
  var design = Dagaz.Model.getDesign();
  var board  = Dagaz.Model.getInitBoard();
  board.clear();
  var t = design.getTemplate(1);
  var from = Dagaz.Model.stringToPos("b2");
  assert.ok( from !== null, "Correct position");
  assert.equal( Dagaz.Model.posToString(from), "b2", "From position");
  var m = new Dagaz.Model.createMove();
  var g = Dagaz.Model.createGen(t, [3]);
  g.init(board, from);
  g.move = m;
  var man = Dagaz.Model.createPiece(0, 1);
  var king = man.promote(1);
  assert.equal( man.getType(), "Man", "Man piece");
  assert.equal( king.getType(), "King", "King piece");
  board.setPiece(from, man);
  var to = design.navigate(1, from, 3);
  assert.equal( Dagaz.Model.posToString(to), "b3", "To position");
  g.setPiece(from, null);
  g.setPiece(to, man);
  assert.equal( g.getPiece(from), man, "Man in [from] position (snapshot)");
  assert.equal( g.getPiece(to), null, "And [to] position is empty");
  var c = g.copy(g.template, g.params);
  assert.equal( c.getPiece(from), null, "[from] position is empty");
  assert.equal( c.getPiece(to), man, "[to] position contains Man");
  assert.equal( g.getValue(0, from), null, "No value");
  g.setValue(0, from, true);
  assert.equal( g.getValue(0, from), true, "Position flag");
  assert.equal( c.getValue(0, from), null, "No value again");
  assert.equal( g.getAttr(0, from), null, "No attribute value");
  design.addAttribute(man.type, 0, false);
  assert.equal( g.getAttr(0, from), false, "Attribute's initial value");
  g.setAttr(0, to, true);
  assert.equal( g.attrs[to][0], true, "Attribute's value changed");
  Dagaz.Model.design = undefined;
  Dagaz.Model.board = undefined;
});

QUnit.test( "Board", function( assert ) {
  Dagaz.Model.InitGame();
  var design = Dagaz.Model.getDesign();
  var board  = Dagaz.Model.getInitBoard();
  board.clear();
  design.setup("Black", "Man", 3);
  design.setup("Black", "Man", 8);
  design.setup("Black", "Man", 13);
  design.setup("Black", "Man", 18);
  design.setup("Black", "Man", 29);
  design.setup("Black", "Man", 53);
  design.setup("Black", "Man", 56);
  design.setup("Black", "Man", 58);
  design.setup("White", "King", 45);
  assert.equal( board.player, 1, "White");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("a1")).toString(), "Black Man", "a1 - Black Man");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("b1")), null, "b1 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("c1")).toString(), "Black Man", "c1 - Black Man");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("d1")), null, "d1 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("e1")), null, "e1 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("f1")), null, "f1 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("g1")), null, "g1 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("h1")), null, "h1 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("a2")), null, "a2 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("b2")), null, "b2 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("c2")), null, "c2 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("d2")), null, "d2 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("e2")), null, "e2 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("f2")).toString(), "Black Man", "f2 - Black Man");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("g2")), null, "g2 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("h2")), null, "h2 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("a3")), null, "a3 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("b3")), null, "b3 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("c3")), null, "c3 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("d3")), null, "d3 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("e3")), null, "e3 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("f3")).toString(), "White King", "f3 - White King");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("g3")), null, "g3 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("h3")), null, "h3 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("a4")), null, "a4 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("b4")), null, "b4 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("c4")), null, "c4 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("d4")), null, "d4 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("e4")), null, "e4 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("f4")), null, "f4 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("g4")), null, "g4 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("h4")), null, "h4 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("a5")), null, "a5 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("b5")), null, "b5 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("c5")), null, "c5 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("d5")), null, "d5 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("e5")), null, "e5 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("f5")).toString(), "Black Man", "f5 - Black Man");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("g5")), null, "g5 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("h5")), null, "h5 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("a6")), null, "a6 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("b6")), null, "b6 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("c6")).toString(), "Black Man", "c6 - Black Man");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("d6")), null, "d6 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("e6")), null, "e6 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("f6")), null, "f6 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("g6")), null, "g6 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("h6")), null, "h6 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("a7")).toString(), "Black Man", "a7 - Black Man");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("b7")), null, "b7 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("c7")), null, "c7 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("d7")), null, "d7 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("e7")), null, "e7 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("f7")).toString(), "Black Man", "f7 - Black Man");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("g7")), null, "g7 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("h7")), null, "h7 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("a8")), null, "a8 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("b8")), null, "b8 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("c8")), null, "c8 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("d8")).toString(), "Black Man", "d8 - Black Man");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("e8")), null, "e8 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("f8")), null, "f8 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("g8")), null, "g8 - Empty");
  assert.equal( board.getPiece(Dagaz.Model.stringToPos("h8")), null, "h8 - Empty");

  var p = board.getPiece(Dagaz.Model.stringToPos("f3"));
  var m = Dagaz.Model.createMove();
  m.capturePiece(Dagaz.Model.stringToPos("f5"), 1);
  m.movePiece(Dagaz.Model.stringToPos("f3"), Dagaz.Model.stringToPos("f6"), p, 1);
  assert.equal( m.toString(1), "f3 - f6 x f5", "f3 - f6 x f5");
  var mb = board.apply(m);
  assert.equal( mb.player, 2, "Black");
  assert.equal( mb.getPiece(Dagaz.Model.stringToPos("f3")), null, "f3 - Empty");
  assert.equal( mb.getPiece(Dagaz.Model.stringToPos("f5")), null, "f5 - Empty");
  assert.equal( mb.getPiece(Dagaz.Model.stringToPos("f6")).toString(), "White King", "f6 - White King");
  assert.equal( mb.getPiece(Dagaz.Model.stringToPos("f7")).toString(), "Black Man", "f7 - Black Man");

  var q = board.getPiece(Dagaz.Model.stringToPos("f7"));
  var n = Dagaz.Model.createMove();
  n.capturePiece(Dagaz.Model.stringToPos("f6"), 1);
  n.movePiece(Dagaz.Model.stringToPos("f7"), Dagaz.Model.stringToPos("f5"), q, 1);
  assert.equal( n.toString(1), "f7 - f5 x f6", "f7 - f5 x f6");
  var nb = mb.apply(n);
  assert.equal( nb.player, 1, "White");
  assert.equal( nb.getPiece(Dagaz.Model.stringToPos("f7")), null, "f7 - Empty");
  assert.equal( nb.getPiece(Dagaz.Model.stringToPos("f6")), null, "f6 - Empty");
  assert.equal( nb.getPiece(Dagaz.Model.stringToPos("f5")).toString(), "Black Man", "f5 - Black Man");

  var p = board.getPiece(Dagaz.Model.stringToPos("f3"));
  var o = m.copy();
  o.capturePiece(Dagaz.Model.stringToPos("c6"), 2);
  o.movePiece(Dagaz.Model.stringToPos("f6"), Dagaz.Model.stringToPos("a6"), p, 2);
  assert.equal( o.toString(1), "f3 - f6 x f5", "f3 - f6 x f5");
  assert.equal( o.toString(2), "f6 - a6 x c6", "f6 - a6 x c6");
  assert.equal( o.toString(), "f3 - f6 - a6 x f5 x c6", "f3 - f6 - a6 x f5 x c6");
  var ob = board.apply(o);
  assert.equal( ob.player, 2, "Black");
  assert.equal( ob.getPiece(Dagaz.Model.stringToPos("f3")), null, "f3 - Empty");
  assert.equal( ob.getPiece(Dagaz.Model.stringToPos("f5")), null, "f5 - Empty");
  assert.equal( ob.getPiece(Dagaz.Model.stringToPos("f6")), null, "f6 - Empty");
  assert.equal( ob.getPiece(Dagaz.Model.stringToPos("c6")), null, "c6 - Empty");
  assert.equal( ob.getPiece(Dagaz.Model.stringToPos("a6")).toString(), "White King", "a6 - White King");

  assert.equal( o.isAttacked(Dagaz.Model.stringToPos("f3")), false, "f3 - Not attacked");
  assert.equal( o.isAttacked(Dagaz.Model.stringToPos("f6")), true, "f6 - Is attacked");
  assert.equal( o.isAttacked(Dagaz.Model.stringToPos("a6")), true, "a6 - Is attacked");
  assert.equal( o.isAttacked(Dagaz.Model.stringToPos("f5")), true, "f5 - Is attacked");
  assert.equal( o.isAttacked(Dagaz.Model.stringToPos("c6")), true, "c6 - Is attacked");

  Dagaz.Model.design = undefined;
  Dagaz.Model.board = undefined;
});

QUnit.test( "Man's moves", function( assert ) {
  Dagaz.Model.InitGame();
  var design = Dagaz.Model.getDesign();
  var board  = Dagaz.Model.getInitBoard();
  board.clear();

  design.setup("White", "Man", Dagaz.Model.stringToPos("c3"));
  design.setup("White", "Man", Dagaz.Model.stringToPos("g7"));
  design.setup("Black", "Man", Dagaz.Model.stringToPos("c5"));
  assert.equal( board.player, 1, "White player");
  var n  = design.getDirection("n");
  assert.equal( n, 3, "North direction");
  var t1 = design.getTemplate(1);
  var g1 = Dagaz.Model.createGen(t1, [ n ]);
  assert.equal( g1.pieces.length , 0, "No Generator's positions");
  g1.init(board, Dagaz.Model.stringToPos("c3"));
  assert.equal( g1.pieces.length , 0, "No Generator's positions again");
  assert.equal( g1.template.commands.length, 13, "Template length");
  assert.equal( g1.stack.length, 0, "Stack is empty");
  assert.equal( g1.pos, 42, "Initial position");
  assert.equal( g1.getPiece(g1.pos).toString(), "White Man", "Current piece");

  assert.equal( (g1.template.commands[g1.cmd++])(g1), 0, "ZRF_FROM executed");
  assert.equal( g1.cmd, 1, "cmd = 1");
  assert.equal( g1.from, 42, "Initial position");
  assert.equal( g1.piece.toString(), "White Man", "Current piece");

  assert.equal( (g1.template.commands[g1.cmd++])(g1), 0, "ZRF_PARAM executed");
  assert.equal( g1.cmd, 2, "cmd = 2");
  assert.equal( g1.stack.length, 1, "Stack");
  assert.equal( g1.stack[0], 3, "Direction");

  assert.equal( (g1.template.commands[g1.cmd++])(g1), 0, "ZRF_NAVIGATE executed");
  assert.equal( g1.cmd, 3, "cmd = 3");
  assert.equal( g1.stack.length, 0, "Stack is empty");
  assert.equal( g1.pos, 34, "Target position");

  assert.equal( (g1.template.commands[g1.cmd++])(g1), 0, "ZRF_IS_EMPTY executed");
  assert.equal( g1.cmd, 4, "cmd = 4");
  assert.equal( g1.stack.length, 1, "Stack");
  assert.equal( g1.stack[0], true, "Position is empty");

  assert.equal( (g1.template.commands[g1.cmd++])(g1), 0, "ZRF_VERIFY executed");
  assert.equal( g1.cmd, 5, "cmd = 5");

  assert.equal( (g1.template.commands[g1.cmd++])(g1), 0, "ZRF_IN_ZONE executed");
  assert.equal( g1.cmd, 6, "cmd = 6");
  assert.equal( g1.stack.length, 1, "Stack");
  assert.equal( g1.stack[0], false, "Not in promotion");

  assert.equal( (g1.template.commands[g1.cmd++])(g1), 0, "ZRF_NOT executed");
  assert.equal( g1.cmd, 7, "cmd = 7");
  assert.equal( g1.stack.length, 1, "Stack");
  assert.equal( g1.stack[0], true, "Not");

  assert.equal( (g1.template.commands[g1.cmd++])(g1), 3, "ZRF_IF executed");
  g1.cmd += 3;
  assert.equal( g1.cmd, 11, "cmd = 11");
  assert.equal( g1.stack.length, 0, "Stack is empty");

  assert.equal( (g1.template.commands[g1.cmd++])(g1), 0, "ZRF_TO executed");
  assert.equal( g1.cmd, 12, "cmd = 12");
  assert.equal( g1.from, null, "Empty position");
  assert.equal( g1.piece, null, "Empty piece");
  assert.equal( g1.move.actions.length, 1, "1 action");
  assert.equal( g1.move.actions[0][0][0], 42, "From position");
  assert.equal( g1.move.actions[0][1][0], 34, "To position");
  assert.equal( g1.move.actions[0][2][0].toString(), "White Man", "piece");
  assert.equal( g1.move.actions[0][3], 1, "level");
  assert.equal( g1.lastf, 42, "Last from");
  assert.equal( g1.lastt, 34, "Last to");
  assert.equal( g1.pieces[42], null, "c3 is empty");
  assert.equal( g1.pieces[34].toString(), "White Man", "White Man on c4");
  assert.equal( g1.pieces[0], undefined, "any positions undefined");
  assert.equal( g1.move.toString(1), "c3 - c4", "c3 - c4");
  assert.equal( g1.move.toString(), "c3 - c4", "c3 - c4");

  Dagaz.Model.design = undefined;
  Dagaz.Model.board = undefined;
});

QUnit.test( "Simple Man's moves", function( assert ) {
  Dagaz.Model.InitGame();
  var design = Dagaz.Model.getDesign();
  var board  = Dagaz.Model.getInitBoard();
  board.clear();

  design.setup("White", "Man", Dagaz.Model.stringToPos("c3"));
  board.generate();
  assert.equal( board.moves.length, 3, "3 Moves generated");
  assert.equal( board.moves[0].toString(), "c3 - d3", "c3 - d3");
  assert.equal( board.moves[1].toString(), "c3 - b3", "c3 - b3");
  assert.equal( board.moves[2].toString(), "c3 - c4", "c3 - c4");

  Dagaz.Model.design = undefined;
  Dagaz.Model.board = undefined;
});

QUnit.test( "Man's capturing priorited", function( assert ) {
  Dagaz.Model.InitGame();
  var design = Dagaz.Model.getDesign();
  var board  = Dagaz.Model.getInitBoard();
  board.clear();

  design.setup("White", "Man", Dagaz.Model.stringToPos("b2"));
  design.setup("White", "Man", Dagaz.Model.stringToPos("e2"));
  design.setup("Black", "Man", Dagaz.Model.stringToPos("b3"));
  design.setup("Black", "Man", Dagaz.Model.stringToPos("f2"));

  board.generate();
  assert.equal( board.moves.length, 2, "2 Moves generated");
  assert.equal( board.moves[0].toString(), "e2 - g2 x f2", "e2 - g2 x f2");
  assert.equal( board.moves[1].toString(), "b2 - b4 x b3", "b2 - b4 x b3");

  Dagaz.Model.design = undefined;
  Dagaz.Model.board = undefined;
});

QUnit.test( "Man's capturing chain", function( assert ) {
  Dagaz.Model.InitGame();
  var design = Dagaz.Model.getDesign();
  var board  = Dagaz.Model.getInitBoard();
  board.clear();

  design.setup("White", "Man", Dagaz.Model.stringToPos("d2"));
  design.setup("Black", "Man", Dagaz.Model.stringToPos("d3"));
  design.setup("Black", "Man", Dagaz.Model.stringToPos("d5"));
  design.setup("Black", "Man", Dagaz.Model.stringToPos("e4"));
  design.setup("Black", "Man", Dagaz.Model.stringToPos("f5"));

  board.generate();
  assert.equal( board.moves.length, 1, "1 move generated");
  assert.equal( board.moves[0].toString(), "d2 - d4 - f4 - f6 x d3 x e4 x f5", "d2 - d4 - f4 - f6 x d3 x e4 x f5");

  Dagaz.Model.design = undefined;
  Dagaz.Model.board = undefined;
});

QUnit.test( "King's slide", function( assert ) {
  Dagaz.Model.InitGame();
  var design = Dagaz.Model.getDesign();
  var board  = Dagaz.Model.getInitBoard();
  board.clear();

  design.setup("White", "King", Dagaz.Model.stringToPos("d4"));
  board.generate();
  assert.equal( board.moves.length, 14, "14 moves generated");
  assert.equal( board.moves[0].toString(), "d4 - d3", "d4 - d3");
  assert.equal( board.moves[1].toString(), "d4 - e4", "d4 - e4");
  assert.equal( board.moves[2].toString(), "d4 - c4", "d4 - c4");
  assert.equal( board.moves[3].toString(), "d4 - d5", "d4 - d5");
  assert.equal( board.moves[4].toString(), "d4 - d6", "d4 - d6");
  assert.equal( board.moves[5].toString(), "d4 - d7", "d4 - d7");
  assert.equal( board.moves[6].toString(), "d4 - d8", "d4 - d8");
  assert.equal( board.moves[7].toString(), "d4 - b4", "d4 - b4");
  assert.equal( board.moves[8].toString(), "d4 - a4", "d4 - a4");
  assert.equal( board.moves[9].toString(), "d4 - f4", "d4 - f4");
  assert.equal( board.moves[10].toString(), "d4 - g4", "d4 - g4");
  assert.equal( board.moves[11].toString(), "d4 - h4", "d4 - h4");
  assert.equal( board.moves[12].toString(), "d4 - d2", "d4 - d2");
  assert.equal( board.moves[13].toString(), "d4 - d1", "d4 - d1");

  Dagaz.Model.design = undefined;
  Dagaz.Model.board = undefined;
});

QUnit.test( "King's capturing chain", function( assert ) {
  Dagaz.Model.InitGame();
  var design = Dagaz.Model.getDesign();
  var board  = Dagaz.Model.getInitBoard();
  board.clear();

  design.setup("White", "King", Dagaz.Model.stringToPos("d4"));
  design.setup("Black", "Man", Dagaz.Model.stringToPos("c4"));
  design.setup("Black", "Man", Dagaz.Model.stringToPos("a6"));
  design.setup("Black", "Man", Dagaz.Model.stringToPos("f8"));

  board.generate();
  assert.equal( board.moves.length, 2, "2 moves generated");
  assert.equal( board.moves[0].toString(), "d4 - a4 - a8 - g8 x c4 x a6 x f8", "d4 - a4 - a8 - g8 x c4 x a6 x f8");
  assert.equal( board.moves[1].toString(), "d4 - a4 - a8 - h8 x c4 x a6 x f8", "d4 - a4 - a8 - h8 x c4 x a6 x f8");

  Dagaz.Model.design = undefined;
  Dagaz.Model.board = undefined;
});

QUnit.test( "Move List", function( assert ) {
  Dagaz.Model.InitGame();
  var design = Dagaz.Model.getDesign();
  var board  = Dagaz.Model.getInitBoard();
  board.clear();

  design.setup("White", "King", Dagaz.Model.stringToPos("d8"));
  design.setup("Black", "Man", Dagaz.Model.stringToPos("e8"));
  design.setup("Black", "Man", Dagaz.Model.stringToPos("b7"));
  design.setup("Black", "Man", Dagaz.Model.stringToPos("e7"));
  design.setup("Black", "Man", Dagaz.Model.stringToPos("a6"));
  design.setup("Black", "Man", Dagaz.Model.stringToPos("b6"));
  design.setup("Black", "Man", Dagaz.Model.stringToPos("d6"));
  design.setup("Black", "Man", Dagaz.Model.stringToPos("e6"));
  design.setup("Black", "Man", Dagaz.Model.stringToPos("g6"));
  design.setup("Black", "Man", Dagaz.Model.stringToPos("h6"));
  design.setup("Black", "Man", Dagaz.Model.stringToPos("e5"));
  design.setup("Black", "Man", Dagaz.Model.stringToPos("b3"));
  design.setup("Black", "Man", Dagaz.Model.stringToPos("c3"));
  design.setup("Black", "Man", Dagaz.Model.stringToPos("f3"));
  design.setup("Black", "Man", Dagaz.Model.stringToPos("a2"));
  design.setup("Black", "Man", Dagaz.Model.stringToPos("d1"));

  board.generate();
  assert.equal( board.moves.length, 42, "42 moves generated");
  assert.equal( board.moves[0].toString(), "d8 - g8 - g3 - d3 - d7 - h7 - h5 - a5 - a7 - e7 - e1 - c1 - c6 - a6 - a1 x e8 x g6 x f3 x d6 x e7 x h6 x e5 x a6 x b7 x e6 x d1 x c3 x b6 x a2", "d8 - g8 - g3 - d3 - d7 - h7 - h5 - a5 - a7 - e7 - e1 - c1 - c6 - a6 - a1 x e8 x g6 x f3 x d6 x e7 x h6 x e5 x a6 x b7 x e6 x d1 x c3 x b6 x a2");

  Dagaz.Model.design = undefined;
  Dagaz.Model.board = undefined;
});
