import { Dagaz } from './fanorona-extension.js';

var ZRF = {
  JUMP:          0,
  IF:            1,
  FORK:          2,
  FUNCTION:      3,
  IN_ZONE:       4,
  FLAG:          5,
  SET_FLAG:      6,
  POS_FLAG:      7,
  SET_POS_FLAG:  8,
  ATTR:          9,
  SET_ATTR:      10,
  PROMOTE:       11,
  MODE:          12,
  ON_BOARD_DIR:  13,
  ON_BOARD_POS:  14,
  PARAM:         15,
  LITERAL:       16,
  VERIFY:        20
};

Dagaz.Model.BuildDesign = function(design) {
  design.checkVersion("z2j", "2");
  design.checkVersion("smart-moves", "false");
  design.checkVersion("show-hints", "false");
  design.checkVersion("show-blink", "false");
  design.checkVersion("pass-partial", "true");
  design.checkVersion("animate-captures", "false");
  design.checkVersion("advisor-wait", "5");
  design.checkVersion("fanorona-extension", "true");
  design.checkVersion("fanorona-invariant", "true");

  design.addDirection("w");  // 0
  design.addDirection("e");  // 1
  design.addDirection("s");  // 2
  design.addDirection("n");  // 3
  design.addDirection("ne"); // 4
  design.addDirection("sw"); // 5
  design.addDirection("nw"); // 6
  design.addDirection("se"); // 7

  design.addPlayer("White", [1, 0, 3, 2, 5, 4, 7, 6]);
  design.addPlayer("Black", [0, 1, 2, 3, 4, 5, 6, 7]);

  design.addPosition("a5", [0, 1, 9, 0, 0, 0, 0, 10]);
  design.addPosition("b5", [-1, 1, 9, 0, 0, 0, 0, 0]);
  design.addPosition("c5", [-1, 1, 9, 0, 0, 8, 0, 10]);
  design.addPosition("d5", [-1, 1, 9, 0, 0, 0, 0, 0]);
  design.addPosition("e5", [-1, 1, 9, 0, 0, 8, 0, 10]);
  design.addPosition("f5", [-1, 1, 9, 0, 0, 0, 0, 0]);
  design.addPosition("g5", [-1, 1, 9, 0, 0, 8, 0, 10]);
  design.addPosition("h5", [-1, 1, 9, 0, 0, 0, 0, 0]);
  design.addPosition("i5", [-1, 0, 9, 0, 0, 8, 0, 0]);
  design.addPosition("a4", [0, 1, 9, -9, 0, 0, 0, 0]);
  design.addPosition("b4", [-1, 1, 9, -9, -8, 8, -10, 10]);
  design.addPosition("c4", [-1, 1, 9, -9, 0, 0, 0, 0]);
  design.addPosition("d4", [-1, 1, 9, -9, -8, 8, -10, 10]);
  design.addPosition("e4", [-1, 1, 9, -9, 0, 0, 0, 0]);
  design.addPosition("f4", [-1, 1, 9, -9, -8, 8, -10, 10]);
  design.addPosition("g4", [-1, 1, 9, -9, 0, 0, 0, 0]);
  design.addPosition("h4", [-1, 1, 9, -9, -8, 8, -10, 10]);
  design.addPosition("i4", [-1, 0, 9, -9, 0, 0, 0, 0]);
  design.addPosition("a3", [0, 1, 9, -9, -8, 0, 0, 10]);
  design.addPosition("b3", [-1, 1, 9, -9, 0, 0, 0, 0]);
  design.addPosition("c3", [-1, 1, 9, -9, -8, 8, -10, 10]);
  design.addPosition("d3", [-1, 1, 9, -9, 0, 0, 0, 0]);
  design.addPosition("e3", [-1, 1, 9, -9, -8, 8, -10, 10]);
  design.addPosition("f3", [-1, 1, 9, -9, 0, 0, 0, 0]);
  design.addPosition("g3", [-1, 1, 9, -9, -8, 8, -10, 10]);
  design.addPosition("h3", [-1, 1, 9, -9, 0, 0, 0, 0]);
  design.addPosition("i3", [-1, 0, 9, -9, 0, 8, -10, 0]);
  design.addPosition("a2", [0, 1, 9, -9, 0, 0, 0, 0]);
  design.addPosition("b2", [-1, 1, 9, -9, -8, 8, -10, 10]);
  design.addPosition("c2", [-1, 1, 9, -9, 0, 0, 0, 0]);
  design.addPosition("d2", [-1, 1, 9, -9, -8, 8, -10, 10]);
  design.addPosition("e2", [-1, 1, 9, -9, 0, 0, 0, 0]);
  design.addPosition("f2", [-1, 1, 9, -9, -8, 8, -10, 10]);
  design.addPosition("g2", [-1, 1, 9, -9, 0, 0, 0, 0]);
  design.addPosition("h2", [-1, 1, 9, -9, -8, 8, -10, 10]);
  design.addPosition("i2", [-1, 0, 9, -9, 0, 0, 0, 0]);
  design.addPosition("a1", [0, 1, 0, -9, -8, 0, 0, 0]);
  design.addPosition("b1", [-1, 1, 0, -9, 0, 0, 0, 0]);
  design.addPosition("c1", [-1, 1, 0, -9, -8, 0, -10, 0]);
  design.addPosition("d1", [-1, 1, 0, -9, 0, 0, 0, 0]);
  design.addPosition("e1", [-1, 1, 0, -9, -8, 0, -10, 0]);
  design.addPosition("f1", [-1, 1, 0, -9, 0, 0, 0, 0]);
  design.addPosition("g1", [-1, 1, 0, -9, -8, 0, -10, 0]);
  design.addPosition("h1", [-1, 1, 0, -9, 0, 0, 0, 0]);
  design.addPosition("i1", [-1, 0, 0, -9, 0, 0, -10, 0]);

  design.addCommand(0, ZRF.FUNCTION,	24);	// from
  design.addCommand(0, ZRF.PARAM,	0);	// $1
  design.addCommand(0, ZRF.FUNCTION,	22);	// navigate
  design.addCommand(0, ZRF.FUNCTION,	1);	// empty?
  design.addCommand(0, ZRF.FUNCTION,	20);	// verify
  design.addCommand(0, ZRF.PARAM,	1);	// $2
  design.addCommand(0, ZRF.FUNCTION,	22);	// navigate
  design.addCommand(0, ZRF.FUNCTION,	2);	// enemy?
  design.addCommand(0, ZRF.FUNCTION,	20);	// verify
  design.addCommand(0, ZRF.FUNCTION,	26);	// capture
  design.addCommand(0, ZRF.PARAM,	2);	// $3
  design.addCommand(0, ZRF.FUNCTION,	22);	// navigate
  design.addCommand(0, ZRF.MODE,	0);	// priority-type
  design.addCommand(0, ZRF.FUNCTION,	25);	// to
  design.addCommand(0, ZRF.FUNCTION,	28);	// end

  design.addCommand(1, ZRF.FUNCTION,	24);	// from
  design.addCommand(1, ZRF.PARAM,	0);	// $1
  design.addCommand(1, ZRF.FUNCTION,	22);	// navigate
  design.addCommand(1, ZRF.FUNCTION,	2);	// enemy?
  design.addCommand(1, ZRF.FUNCTION,	20);	// verify
  design.addCommand(1, ZRF.FUNCTION,	26);	// capture
  design.addCommand(1, ZRF.PARAM,	1);	// $2
  design.addCommand(1, ZRF.FUNCTION,	22);	// navigate
  design.addCommand(1, ZRF.PARAM,	2);	// $3
  design.addCommand(1, ZRF.FUNCTION,	22);	// navigate
  design.addCommand(1, ZRF.FUNCTION,	1);	// empty?
  design.addCommand(1, ZRF.FUNCTION,	20);	// verify
  design.addCommand(1, ZRF.MODE,	0);	// priority-type
  design.addCommand(1, ZRF.FUNCTION,	25);	// to
  design.addCommand(1, ZRF.FUNCTION,	28);	// end

  design.addCommand(2, ZRF.FUNCTION,	24);	// from
  design.addCommand(2, ZRF.PARAM,	0);	// $1
  design.addCommand(2, ZRF.FUNCTION,	22);	// navigate
  design.addCommand(2, ZRF.FUNCTION,	1);	// empty?
  design.addCommand(2, ZRF.FUNCTION,	20);	// verify
  design.addCommand(2, ZRF.FUNCTION,	25);	// to
  design.addCommand(2, ZRF.FUNCTION,	28);	// end

  design.addPriority(0);			// priority-type
  design.addPriority(1);			// normal-type

  design.addPiece("Stone", 0);
  design.addMove(0, 0, [3, 3, 2], 0);
  design.addMove(0, 0, [6, 6, 7], 0);
  design.addMove(0, 0, [2, 2, 3], 0);
  design.addMove(0, 0, [7, 7, 6], 0);
  design.addMove(0, 0, [0, 0, 1], 0);
  design.addMove(0, 0, [5, 5, 4], 0);
  design.addMove(0, 0, [1, 1, 0], 0);
  design.addMove(0, 0, [4, 4, 5], 0);
  design.addMove(0, 1, [3, 2, 2], 0);
  design.addMove(0, 1, [6, 7, 7], 0);
  design.addMove(0, 1, [2, 3, 3], 0);
  design.addMove(0, 1, [7, 6, 6], 0);
  design.addMove(0, 1, [0, 1, 1], 0);
  design.addMove(0, 1, [5, 4, 4], 0);
  design.addMove(0, 1, [1, 0, 0], 0);
  design.addMove(0, 1, [4, 5, 5], 0);
  design.addMove(0, 2, [3], 1);
  design.addMove(0, 2, [6], 1);
  design.addMove(0, 2, [2], 1);
  design.addMove(0, 2, [7], 1);
  design.addMove(0, 2, [0], 1);
  design.addMove(0, 2, [5], 1);
  design.addMove(0, 2, [1], 1);
  design.addMove(0, 2, [4], 1);

  design.setup("White", "Stone", 36);
  design.setup("White", "Stone", 27);
  design.setup("White", "Stone", 37);
  design.setup("White", "Stone", 28);
  design.setup("White", "Stone", 19);
  design.setup("White", "Stone", 38);
  design.setup("White", "Stone", 29);
  design.setup("White", "Stone", 39);
  design.setup("White", "Stone", 30);
  design.setup("White", "Stone", 21);
  design.setup("White", "Stone", 40);
  design.setup("White", "Stone", 31);
  design.setup("White", "Stone", 41);
  design.setup("White", "Stone", 32);
  design.setup("White", "Stone", 42);
  design.setup("White", "Stone", 33);
  design.setup("White", "Stone", 24);
  design.setup("White", "Stone", 43);
  design.setup("White", "Stone", 34);
  design.setup("White", "Stone", 44);
  design.setup("White", "Stone", 35);
  design.setup("White", "Stone", 26);
  design.setup("Black", "Stone", 18);
  design.setup("Black", "Stone", 9);
  design.setup("Black", "Stone", 0);
  design.setup("Black", "Stone", 10);
  design.setup("Black", "Stone", 1);
  design.setup("Black", "Stone", 20);
  design.setup("Black", "Stone", 11);
  design.setup("Black", "Stone", 2);
  design.setup("Black", "Stone", 12);
  design.setup("Black", "Stone", 3);
  design.setup("Black", "Stone", 13);
  design.setup("Black", "Stone", 4);
  design.setup("Black", "Stone", 23);
  design.setup("Black", "Stone", 14);
  design.setup("Black", "Stone", 5);
  design.setup("Black", "Stone", 15);
  design.setup("Black", "Stone", 6);
  design.setup("Black", "Stone", 25);
  design.setup("Black", "Stone", 16);
  design.setup("Black", "Stone", 7);
  design.setup("Black", "Stone", 17);
  design.setup("Black", "Stone", 8);
};

Dagaz.View.configure = function(view) {
  view.defBoard("Board");
  view.defPiece("WhiteStone", "White Stone");
  view.defPiece("BlackStone", "Black Stone");
 
  view.defPosition("a5", 0, -2, 75, 75);
  view.defPosition("b5", 75, -2, 75, 75);
  view.defPosition("c5", 150, -2, 75, 75);
  view.defPosition("d5", 225, -2, 75, 75);
  view.defPosition("e5", 300, -2, 75, 75);
  view.defPosition("f5", 375, -2, 75, 75);
  view.defPosition("g5", 450, -2, 75, 75);
  view.defPosition("h5", 525, -2, 75, 75);
  view.defPosition("i5", 600, -2, 75, 75);
  view.defPosition("a4", 0, 73, 75, 75);
  view.defPosition("b4", 75, 73, 75, 75);
  view.defPosition("c4", 150, 73, 75, 75);
  view.defPosition("d4", 225, 73, 75, 75);
  view.defPosition("e4", 300, 73, 75, 75);
  view.defPosition("f4", 375, 73, 75, 75);
  view.defPosition("g4", 450, 73, 75, 75);
  view.defPosition("h4", 525, 73, 75, 75);
  view.defPosition("i4", 600, 73, 75, 75);
  view.defPosition("a3", 0, 148, 75, 75);
  view.defPosition("b3", 75, 148, 75, 75);
  view.defPosition("c3", 150, 148, 75, 75);
  view.defPosition("d3", 225, 148, 75, 75);
  view.defPosition("e3", 300, 148, 75, 75);
  view.defPosition("f3", 375, 148, 75, 75);
  view.defPosition("g3", 450, 148, 75, 75);
  view.defPosition("h3", 525, 148, 75, 75);
  view.defPosition("i3", 600, 148, 75, 75);
  view.defPosition("a2", 0, 223, 75, 75);
  view.defPosition("b2", 75, 223, 75, 75);
  view.defPosition("c2", 150, 223, 75, 75);
  view.defPosition("d2", 225, 223, 75, 75);
  view.defPosition("e2", 300, 223, 75, 75);
  view.defPosition("f2", 375, 223, 75, 75);
  view.defPosition("g2", 450, 223, 75, 75);
  view.defPosition("h2", 525, 223, 75, 75);
  view.defPosition("i2", 600, 223, 75, 75);
  view.defPosition("a1", 0, 298, 75, 75);
  view.defPosition("b1", 75, 298, 75, 75);
  view.defPosition("c1", 150, 298, 75, 75);
  view.defPosition("d1", 225, 298, 75, 75);
  view.defPosition("e1", 300, 298, 75, 75);
  view.defPosition("f1", 375, 298, 75, 75);
  view.defPosition("g1", 450, 298, 75, 75);
  view.defPosition("h1", 525, 298, 75, 75);
  view.defPosition("i1", 600, 298, 75, 75);
};

export { Dagaz };