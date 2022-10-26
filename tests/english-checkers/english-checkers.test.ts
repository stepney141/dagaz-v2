import { TDesign } from "../../src/core";
import { buildDesign } from "./english-checkers-dagaz";

test("Initial Board", function () {
    const design = new TDesign();
    let board = design.getInitBoard(buildDesign);

    expect(board.player).toEqual(1); // Black turn 
    expect(board.turn).toEqual(0);
    expect(board.player).toEqual(1);
    expect(design.locToString(1)).toEqual("a8");
    expect(board.getPiece(1) === null).toBeTruthy();
    expect(design.locToString(2)).toEqual("b8");
    expect(board.getPiece(2).toString(design)).toEqual("White Man");
    expect(design.locToString(3)).toEqual("c8");
    expect(board.getPiece(3) === null).toBeTruthy();
    expect(design.locToString(4)).toEqual("d8");
    expect(board.getPiece(4).toString(design)).toEqual("White Man");
    expect(design.locToString(5)).toEqual("e8");
    expect(board.getPiece(5) === null).toBeTruthy();
    expect(design.locToString(6)).toEqual("f8");
    expect(board.getPiece(6).toString(design)).toEqual("White Man");
    expect(design.locToString(7)).toEqual("g8");
    expect(board.getPiece(7) === null).toBeTruthy();
    expect(design.locToString(8)).toEqual("h8");
    expect(board.getPiece(8).toString(design)).toEqual("White Man");
    expect(design.locToString(9)).toEqual("a7");
    expect(board.getPiece(9).toString(design)).toEqual("White Man");
    expect(design.locToString(10)).toEqual("b7");
    expect(board.getPiece(10) === null).toBeTruthy();
    expect(design.locToString(11)).toEqual("c7");
    expect(board.getPiece(11).toString(design)).toEqual("White Man");
    expect(design.locToString(12)).toEqual("d7");
    expect(board.getPiece(12) === null).toBeTruthy();
    expect(design.locToString(13)).toEqual("e7");
    expect(board.getPiece(13).toString(design)).toEqual("White Man");
    expect(design.locToString(14)).toEqual("f7");
    expect(board.getPiece(14) === null).toBeTruthy();
    expect(design.locToString(15)).toEqual("g7");
    expect(board.getPiece(15).toString(design)).toEqual("White Man");
    expect(design.locToString(16)).toEqual("h7");
    expect(board.getPiece(16) === null).toBeTruthy();
    expect(design.locToString(17)).toEqual("a6");
    expect(board.getPiece(17) === null).toBeTruthy();
    expect(design.locToString(18)).toEqual("b6");
    expect(board.getPiece(18).toString(design)).toEqual("White Man");
    expect(design.locToString(19)).toEqual("c6");
    expect(board.getPiece(19) === null).toBeTruthy();
    expect(design.locToString(20)).toEqual("d6");
    expect(board.getPiece(20).toString(design)).toEqual("White Man");
    expect(design.locToString(21)).toEqual("e6");
    expect(board.getPiece(21) === null).toBeTruthy();
    expect(design.locToString(22)).toEqual("f6");
    expect(board.getPiece(22).toString(design)).toEqual("White Man");
    expect(design.locToString(23)).toEqual("g6");
    expect(board.getPiece(23) === null).toBeTruthy();
    expect(design.locToString(24)).toEqual("h6");
    expect(board.getPiece(24).toString(design)).toEqual("White Man");
    expect(design.locToString(25)).toEqual("a5");
    expect(board.getPiece(25) === null).toBeTruthy();
    expect(design.locToString(26)).toEqual("b5");
    expect(board.getPiece(26) === null).toBeTruthy();
    expect(design.locToString(27)).toEqual("c5");
    expect(board.getPiece(27) === null).toBeTruthy();
    expect(design.locToString(28)).toEqual("d5");
    expect(board.getPiece(28) === null).toBeTruthy();
    expect(design.locToString(29)).toEqual("e5");
    expect(board.getPiece(29) === null).toBeTruthy();
    expect(design.locToString(30)).toEqual("f5");
    expect(board.getPiece(30) === null).toBeTruthy();
    expect(design.locToString(31)).toEqual("g5");
    expect(board.getPiece(31) === null).toBeTruthy();
    expect(design.locToString(32)).toEqual("h5");
    expect(board.getPiece(32) === null).toBeTruthy();
    expect(design.locToString(33)).toEqual("a4");
    expect(board.getPiece(33) === null).toBeTruthy();
    expect(design.locToString(34)).toEqual("b4");
    expect(board.getPiece(34) === null).toBeTruthy();
    expect(design.locToString(35)).toEqual("c4");
    expect(board.getPiece(35) === null).toBeTruthy();
    expect(design.locToString(36)).toEqual("d4");
    expect(board.getPiece(36) === null).toBeTruthy();
    expect(design.locToString(37)).toEqual("e4");
    expect(board.getPiece(37) === null).toBeTruthy();
    expect(design.locToString(38)).toEqual("f4");
    expect(board.getPiece(38) === null).toBeTruthy();
    expect(design.locToString(39)).toEqual("g4");
    expect(board.getPiece(39) === null).toBeTruthy();
    expect(design.locToString(40)).toEqual("h4");
    expect(board.getPiece(40) === null).toBeTruthy();
    expect(design.locToString(41)).toEqual("a3");
    expect(board.getPiece(41).toString(design)).toEqual("Black Man");
    expect(design.locToString(42)).toEqual("b3");
    expect(board.getPiece(42) === null).toBeTruthy();
    expect(design.locToString(43)).toEqual("c3");
    expect(board.getPiece(43).toString(design)).toEqual("Black Man");
    expect(design.locToString(44)).toEqual("d3");
    expect(board.getPiece(44) === null).toBeTruthy();
    expect(design.locToString(45)).toEqual("e3");
    expect(board.getPiece(45).toString(design)).toEqual("Black Man");
    expect(design.locToString(46)).toEqual("f3");
    expect(board.getPiece(46) === null).toBeTruthy();
    expect(design.locToString(47)).toEqual("g3");
    expect(board.getPiece(47).toString(design)).toEqual("Black Man");
    expect(design.locToString(48)).toEqual("h3");
    expect(board.getPiece(48) === null).toBeTruthy();
    expect(design.locToString(49)).toEqual("a2");
    expect(board.getPiece(49) === null).toBeTruthy();
    expect(design.locToString(50)).toEqual("b2");
    expect(board.getPiece(50).toString(design)).toEqual("Black Man");
    expect(design.locToString(51)).toEqual("c2");
    expect(board.getPiece(51) === null).toBeTruthy();
    expect(design.locToString(52)).toEqual("d2");
    expect(board.getPiece(52).toString(design)).toEqual("Black Man");
    expect(design.locToString(53)).toEqual("e2");
    expect(board.getPiece(53) === null).toBeTruthy();
    expect(design.locToString(54)).toEqual("f2");
    expect(board.getPiece(54).toString(design)).toEqual("Black Man");
    expect(design.locToString(55)).toEqual("g2");
    expect(board.getPiece(55) === null).toBeTruthy();
    expect(design.locToString(56)).toEqual("h2");
    expect(board.getPiece(56).toString(design)).toEqual("Black Man");
    expect(design.locToString(57)).toEqual("a1");
    expect(board.getPiece(57).toString(design)).toEqual("Black Man");
    expect(design.locToString(58)).toEqual("b1");
    expect(board.getPiece(58) === null).toBeTruthy();
    expect(design.locToString(59)).toEqual("c1");
    expect(board.getPiece(59).toString(design)).toEqual("Black Man");
    expect(design.locToString(60)).toEqual("d1");
    expect(board.getPiece(60) === null).toBeTruthy();
    expect(design.locToString(61)).toEqual("e1");
    expect(board.getPiece(61).toString(design)).toEqual("Black Man");
    expect(design.locToString(62)).toEqual("f1");
    expect(board.getPiece(62) === null).toBeTruthy();
    expect(design.locToString(63)).toEqual("g1");
    expect(board.getPiece(63).toString(design)).toEqual("Black Man");
    expect(design.locToString(64)).toEqual("h1");
    expect(board.getPiece(64) === null).toBeTruthy();

    board.generateMoves();

    expect(board.legalMoves.length).toEqual(7); // 7 moves
    expect(board.legalMoves[0].toString(design)).toEqual("a3-b4");
    expect(board.legalMoves[1].toString(design)).toEqual("c3-b4");
    expect(board.legalMoves[2].toString(design)).toEqual("c3-d4");
    expect(board.legalMoves[3].toString(design)).toEqual("e3-d4");
    expect(board.legalMoves[4].toString(design)).toEqual("e3-f4");
    expect(board.legalMoves[5].toString(design)).toEqual("g3-f4");
    expect(board.legalMoves[6].toString(design)).toEqual("g3-h4");

    board = board.makeMove(board.legalMoves[0]);

    expect(board.player).toEqual(2); // White turn
    expect(board.turn).toEqual(1);
    expect(board.player).toEqual(2);
    expect(design.locToString(41)).toEqual("a3");
    expect(board.getPiece(41) === null).toBeTruthy();
    expect(design.locToString(34)).toEqual("b4");
    expect(board.getPiece(34).toString(design)).toEqual("Black Man");

    board.generateMoves();

    expect(board.legalMoves.length).toEqual(7); // 7 moves
    expect(board.legalMoves[0].toString(design)).toEqual("b6-c5");
    expect(board.legalMoves[1].toString(design)).toEqual("b6-a5");
    expect(board.legalMoves[2].toString(design)).toEqual("d6-e5");
    expect(board.legalMoves[3].toString(design)).toEqual("d6-c5");
    expect(board.legalMoves[4].toString(design)).toEqual("f6-g5");
    expect(board.legalMoves[5].toString(design)).toEqual("f6-e5");
    expect(board.legalMoves[6].toString(design)).toEqual("h6-g5");

    board = board.makeMove(board.legalMoves[6]);

    expect(board.player).toEqual(1); // Black turn
    expect(board.turn).toEqual(0);
    expect(board.player).toEqual(1);
    expect(design.locToString(41)).toEqual("a3");
    expect(board.getPiece(41) === null).toBeTruthy();
    expect(design.locToString(34)).toEqual("b4");
    expect(board.getPiece(34).toString(design)).toEqual("Black Man");
    expect(design.locToString(24)).toEqual("h6");
    expect(board.getPiece(24) === null).toBeTruthy();
    expect(design.locToString(31)).toEqual("g5");
    expect(board.getPiece(31).toString(design)).toEqual("White Man");
});

test("Man Capturing", function () {
    const design = new TDesign();
    let board = design.getInitBoard(buildDesign);

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
    board.generateMoves();

    expect(board.legalMoves.length).toEqual(2); // 2 moves
    expect(board.legalMoves[0].toString(design)).toEqual("f2-d4-b6-d8");
    expect(board.legalMoves[1].toString(design)).toEqual("f2-d4-f6-d8");

    board = board.makeMove(board.legalMoves[0]);

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

test("King Capturing", function () {
    const design = new TDesign();
    let board = design.getInitBoard(buildDesign);

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
    board.generateMoves();

    expect(board.legalMoves.length).toEqual(6); // 6 moves
    expect(board.legalMoves[0].toString(design)).toEqual("d4-f6-h8");
    expect(board.legalMoves[1].toString(design)).toEqual("d4-f6-h4");
    expect(board.legalMoves[2].toString(design)).toEqual("d4-b6-d8-f6-h8");
    expect(board.legalMoves[3].toString(design)).toEqual("d4-b6-d8-f6-d4");
    expect(board.legalMoves[4].toString(design)).toEqual("d4-b6-d8-f6-h4");
    expect(board.legalMoves[5].toString(design)).toEqual("d4-f6-d8-b6-d4");

    board = board.makeMove(board.legalMoves[2]);

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
