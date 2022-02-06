import { EnglishCheckerClient } from "./english-checkers-dagaz.js";

const app = new EnglishCheckerClient();

test("Initial Board", function() {
  const design = app.getGameDesign();
  let board = design.getInitBoard();
  
  expect(board.player).toEqual(1); // Black turn 
  expect(board.turn).toEqual(0);
  expect(board.player).toEqual(1);
  expect(design.posToString(1)).toEqual("a8");
  expect(board.getPiece(1) === null).toBeTruthy();
  expect(design.posToString(2)).toEqual("b8");
  expect(board.getPiece(2).toString(design)).toEqual("White Man");
  expect(design.posToString(3)).toEqual("c8");
  expect(board.getPiece(3) === null).toBeTruthy();
  expect(design.posToString(4)).toEqual("d8");
  expect(board.getPiece(4).toString(design)).toEqual("White Man");
  expect(design.posToString(5)).toEqual("e8");
  expect(board.getPiece(5) === null).toBeTruthy();
  expect(design.posToString(6)).toEqual("f8");
  expect(board.getPiece(6).toString(design)).toEqual("White Man");
  expect(design.posToString(7)).toEqual("g8");
  expect(board.getPiece(7) === null).toBeTruthy();
  expect(design.posToString(8)).toEqual("h8");
  expect(board.getPiece(8).toString(design)).toEqual("White Man");
  expect(design.posToString(9)).toEqual("a7");
  expect(board.getPiece(9).toString(design)).toEqual("White Man");
  expect(design.posToString(10)).toEqual("b7");
  expect(board.getPiece(10) === null).toBeTruthy();
  expect(design.posToString(11)).toEqual("c7");
  expect(board.getPiece(11).toString(design)).toEqual("White Man");
  expect(design.posToString(12)).toEqual("d7");
  expect(board.getPiece(12) === null).toBeTruthy();
  expect(design.posToString(13)).toEqual("e7");
  expect(board.getPiece(13).toString(design)).toEqual("White Man");
  expect(design.posToString(14)).toEqual("f7");
  expect(board.getPiece(14) === null).toBeTruthy();
  expect(design.posToString(15)).toEqual("g7");
  expect(board.getPiece(15).toString(design)).toEqual("White Man");
  expect(design.posToString(16)).toEqual("h7");
  expect(board.getPiece(16) === null).toBeTruthy();
  expect(design.posToString(17)).toEqual("a6");
  expect(board.getPiece(17) === null).toBeTruthy();
  expect(design.posToString(18)).toEqual("b6");
  expect(board.getPiece(18).toString(design)).toEqual("White Man");
  expect(design.posToString(19)).toEqual("c6");
  expect(board.getPiece(19) === null).toBeTruthy();
  expect(design.posToString(20)).toEqual("d6");
  expect(board.getPiece(20).toString(design)).toEqual("White Man");
  expect(design.posToString(21)).toEqual("e6");
  expect(board.getPiece(21) === null).toBeTruthy();
  expect(design.posToString(22)).toEqual("f6");
  expect(board.getPiece(22).toString(design)).toEqual("White Man");
  expect(design.posToString(23)).toEqual("g6");
  expect(board.getPiece(23) === null).toBeTruthy();
  expect(design.posToString(24)).toEqual("h6");
  expect(board.getPiece(24).toString(design)).toEqual("White Man");
  expect(design.posToString(25)).toEqual("a5");
  expect(board.getPiece(25) === null).toBeTruthy();
  expect(design.posToString(26)).toEqual("b5");
  expect(board.getPiece(26) === null).toBeTruthy();
  expect(design.posToString(27)).toEqual("c5");
  expect(board.getPiece(27) === null).toBeTruthy();
  expect(design.posToString(28)).toEqual("d5");
  expect(board.getPiece(28) === null).toBeTruthy();
  expect(design.posToString(29)).toEqual("e5");
  expect(board.getPiece(29) === null).toBeTruthy();
  expect(design.posToString(30)).toEqual("f5");
  expect(board.getPiece(30) === null).toBeTruthy();
  expect(design.posToString(31)).toEqual("g5");
  expect(board.getPiece(31) === null).toBeTruthy();
  expect(design.posToString(32)).toEqual("h5");
  expect(board.getPiece(32) === null).toBeTruthy();
  expect(design.posToString(33)).toEqual("a4");
  expect(board.getPiece(33) === null).toBeTruthy();
  expect(design.posToString(34)).toEqual("b4");
  expect(board.getPiece(34) === null).toBeTruthy();
  expect(design.posToString(35)).toEqual("c4");
  expect(board.getPiece(35) === null).toBeTruthy();
  expect(design.posToString(36)).toEqual("d4");
  expect(board.getPiece(36) === null).toBeTruthy();
  expect(design.posToString(37)).toEqual("e4");
  expect(board.getPiece(37) === null).toBeTruthy();
  expect(design.posToString(38)).toEqual("f4");
  expect(board.getPiece(38) === null).toBeTruthy();
  expect(design.posToString(39)).toEqual("g4");
  expect(board.getPiece(39) === null).toBeTruthy();
  expect(design.posToString(40)).toEqual("h4");
  expect(board.getPiece(40) === null).toBeTruthy();
  expect(design.posToString(41)).toEqual("a3");
  expect(board.getPiece(41).toString(design)).toEqual("Black Man");
  expect(design.posToString(42)).toEqual("b3");
  expect(board.getPiece(42) === null).toBeTruthy();
  expect(design.posToString(43)).toEqual("c3");
  expect(board.getPiece(43).toString(design)).toEqual("Black Man");
  expect(design.posToString(44)).toEqual("d3");
  expect(board.getPiece(44) === null).toBeTruthy();
  expect(design.posToString(45)).toEqual("e3");
  expect(board.getPiece(45).toString(design)).toEqual("Black Man");
  expect(design.posToString(46)).toEqual("f3");
  expect(board.getPiece(46) === null).toBeTruthy();
  expect(design.posToString(47)).toEqual("g3");
  expect(board.getPiece(47).toString(design)).toEqual("Black Man");
  expect(design.posToString(48)).toEqual("h3");
  expect(board.getPiece(48) === null).toBeTruthy();
  expect(design.posToString(49)).toEqual("a2");
  expect(board.getPiece(49) === null).toBeTruthy();
  expect(design.posToString(50)).toEqual("b2");
  expect(board.getPiece(50).toString(design)).toEqual("Black Man");
  expect(design.posToString(51)).toEqual("c2");
  expect(board.getPiece(51) === null).toBeTruthy();
  expect(design.posToString(52)).toEqual("d2");
  expect(board.getPiece(52).toString(design)).toEqual("Black Man");
  expect(design.posToString(53)).toEqual("e2");
  expect(board.getPiece(53) === null).toBeTruthy();
  expect(design.posToString(54)).toEqual("f2");
  expect(board.getPiece(54).toString(design)).toEqual("Black Man");
  expect(design.posToString(55)).toEqual("g2");
  expect(board.getPiece(55) === null).toBeTruthy();
  expect(design.posToString(56)).toEqual("h2");
  expect(board.getPiece(56).toString(design)).toEqual("Black Man");
  expect(design.posToString(57)).toEqual("a1");
  expect(board.getPiece(57).toString(design)).toEqual("Black Man");
  expect(design.posToString(58)).toEqual("b1");
  expect(board.getPiece(58) === null).toBeTruthy();
  expect(design.posToString(59)).toEqual("c1");
  expect(board.getPiece(59).toString(design)).toEqual("Black Man");
  expect(design.posToString(60)).toEqual("d1");
  expect(board.getPiece(60) === null).toBeTruthy();
  expect(design.posToString(61)).toEqual("e1");
  expect(board.getPiece(61).toString(design)).toEqual("Black Man");
  expect(design.posToString(62)).toEqual("f1");
  expect(board.getPiece(62) === null).toBeTruthy();
  expect(design.posToString(63)).toEqual("g1");
  expect(board.getPiece(63).toString(design)).toEqual("Black Man");
  expect(design.posToString(64)).toEqual("h1");
  expect(board.getPiece(64) === null).toBeTruthy();
  
  board.generate();
  
  expect(board.moves.length).toEqual(7); // 7 moves
  expect(board.moves[0].toString(design)).toEqual("a3-b4");
  expect(board.moves[1].toString(design)).toEqual("c3-b4");
  expect(board.moves[2].toString(design)).toEqual("c3-d4");
  expect(board.moves[3].toString(design)).toEqual("e3-d4");
  expect(board.moves[4].toString(design)).toEqual("e3-f4");
  expect(board.moves[5].toString(design)).toEqual("g3-f4");
  expect(board.moves[6].toString(design)).toEqual("g3-h4");
  
  board = board.apply(board.moves[0]);
  
  expect(board.player).toEqual(2); // White turn
  expect(board.turn).toEqual(1);
  expect(board.player).toEqual(2);
  expect(design.posToString(41)).toEqual("a3");
  expect(board.getPiece(41) === null).toBeTruthy();
  expect(design.posToString(34)).toEqual("b4");
  expect(board.getPiece(34).toString(design)).toEqual("Black Man");
  
  board.generate();
  
  expect(board.moves.length).toEqual(7); // 7 moves
  expect(board.moves[0].toString(design)).toEqual("b6-c5");
  expect(board.moves[1].toString(design)).toEqual("b6-a5");
  expect(board.moves[2].toString(design)).toEqual("d6-e5");
  expect(board.moves[3].toString(design)).toEqual("d6-c5");
  expect(board.moves[4].toString(design)).toEqual("f6-g5");
  expect(board.moves[5].toString(design)).toEqual("f6-e5");
  expect(board.moves[6].toString(design)).toEqual("h6-g5");
  
  board = board.apply(board.moves[6]);
  
  expect(board.player).toEqual(1); // Black turn
  expect(board.turn).toEqual(0);
  expect(board.player).toEqual(1);
  expect(design.posToString(41)).toEqual("a3");
  expect(board.getPiece(41) === null).toBeTruthy();
  expect(design.posToString(34)).toEqual("b4");
  expect(board.getPiece(34).toString(design)).toEqual("Black Man");
  expect(design.posToString(24)).toEqual("h6");
  expect(board.getPiece(24) === null).toBeTruthy();
  expect(design.posToString(31)).toEqual("g5");
  expect(board.getPiece(31).toString(design)).toEqual("White Man");
});

test( "Man Capturing", function() {
  const design = app.getGameDesign();
  let board = design.getInitBoard().copy();
  
  expect(board.player).toEqual(1); // Black turn
  
  board.clear();
  const black = design.createPiece(0, 1);
  board.setPiece(design.stringToPos("a3"), black);
  board.setPiece(design.stringToPos("f2"), black);
  const white = design.createPiece(0, 2);
  board.setPiece(design.stringToPos("c3"), white);
  board.setPiece(design.stringToPos("c5"), white);
  board.setPiece(design.stringToPos("c7"), white);
  board.setPiece(design.stringToPos("e3"), white);
  board.setPiece(design.stringToPos("e5"), white);
  board.setPiece(design.stringToPos("e7"), white);
  board.generate();
  
  expect(board.moves.length).toEqual(2); // 2 moves
  expect(board.moves[0].toString(design)).toEqual("f2-d4-b6-d8");
  expect(board.moves[1].toString(design)).toEqual("f2-d4-f6-d8");
  
  board = board.apply(board.moves[0]);
  
  expect(board.player).toEqual(2); // White turn
  expect(board.getPiece(design.stringToPos("a3")).toString(design)).toEqual("Black Man"); // Black man is on a3
  expect(board.getPiece(design.stringToPos("d8")).toString(design)).toEqual("Black King"); // Black king is on d8
  expect(board.getPiece(design.stringToPos("f3")) === null).toBeTruthy(); // f3 is empty
  expect(board.getPiece(design.stringToPos("e3")) === null).toBeTruthy(); // e3 is empty
  expect(board.getPiece(design.stringToPos("c5")) === null).toBeTruthy(); // c5 is empty
  expect(board.getPiece(design.stringToPos("c7")) === null).toBeTruthy(); // c7 is empty
  expect(board.getPiece(design.stringToPos("d4")) === null).toBeTruthy(); // d4 is empty
  expect(board.getPiece(design.stringToPos("b6")) === null).toBeTruthy(); // b6 is empty
  expect(board.getPiece(design.stringToPos("c3")).toString(design)).toEqual("White Man"); // White Man is on c3
  expect(board.getPiece(design.stringToPos("e5")).toString(design)).toEqual("White Man"); // White Man is on e5
  expect(board.getPiece(design.stringToPos("e7")).toString(design)).toEqual("White Man"); // White Man is on e7
});

test( "King Capturing", function() {
  const design = app.getGameDesign();
  let board = design.getInitBoard().copy();
  
  expect(board.player).toEqual(1); // Black turn
  
  board.clear();
  let black = design.createPiece(0, 1);
  board.setPiece(design.stringToPos("f2"), black);
  black = black.promote(1);
  board.setPiece(design.stringToPos("d4"), black);
  const white = design.createPiece(0, 2);
  board.setPiece(design.stringToPos("c5"), white);
  board.setPiece(design.stringToPos("c7"), white);
  board.setPiece(design.stringToPos("e5"), white);
  board.setPiece(design.stringToPos("e7"), white);
  board.setPiece(design.stringToPos("g5"), white);
  board.setPiece(design.stringToPos("g7"), white);
  board.generate();
  
  expect(board.moves.length).toEqual(6); // 6 moves
  expect(board.moves[0].toString(design)).toEqual("d4-f6-h8");
  expect(board.moves[1].toString(design)).toEqual("d4-f6-h4");
  expect(board.moves[2].toString(design)).toEqual("d4-b6-d8-f6-h8");
  expect(board.moves[3].toString(design)).toEqual("d4-b6-d8-f6-d4");
  expect(board.moves[4].toString(design)).toEqual("d4-b6-d8-f6-h4");
  expect(board.moves[5].toString(design)).toEqual("d4-f6-d8-b6-d4");
  
  board = board.apply(board.moves[2]);
  
  expect(board.player).toEqual(2); // White turn
  expect(board.getPiece(design.stringToPos("h8")).toString(design)).toEqual("Black King"); // Black king is on h88
  expect(board.getPiece(design.stringToPos("d4")) === null).toBeTruthy(); // d4 is empty
  expect(board.getPiece(design.stringToPos("c5")) === null).toBeTruthy(); // c5 is empty
  expect(board.getPiece(design.stringToPos("c7")) === null).toBeTruthy(); // c7 is empty
  expect(board.getPiece(design.stringToPos("e7")) === null).toBeTruthy(); // e7 is empty
  expect(board.getPiece(design.stringToPos("g7")) === null).toBeTruthy(); // g7 is empty
  expect(board.getPiece(design.stringToPos("b6")) === null).toBeTruthy(); // b6 is empty
  expect(board.getPiece(design.stringToPos("d8")) === null).toBeTruthy(); // d8 is empty
  expect(board.getPiece(design.stringToPos("f6")) === null).toBeTruthy(); // f6 is empty
  expect(board.getPiece(design.stringToPos("e5")).toString(design)).toEqual("White Man"); // White Man is on e5
  expect(board.getPiece(design.stringToPos("g5")).toString(design)).toEqual("White Man"); // White Man is on g5
});
