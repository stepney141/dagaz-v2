import { TDesign } from "../../src/core";
import { buildDesign } from "./international-checkers-dagaz";
import { maximalCapture } from "./maximal-captures-dagaz";
import { promotion } from "./international-checkers-dagaz-promotion";

test("Man promotion", function () {
    const design = new TDesign();
    let board = design.getInitBoard(buildDesign, [maximalCapture, promotion]).copy();

    expect(board.player).toEqual(1); // White turn

    board.clear();
    const white = design.createPiece(0, 1);
    board.setPiece(design.stringToPos("b8"), white);
    const black = design.createPiece(0, 2);
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

    expect(board.legalMoves.length).toEqual(2); // 2 moves
    expect(board.legalMoves[0].toString(design)).toEqual("b8-d10-f8-h10-j8-h6-f4-h2");
    expect(board.legalMoves[1].toString(design)).toEqual("b8-d10-f8-h10-j8-h6-f4-d2");

    board = board.apply(board.legalMoves[0]);

    expect(board.player).toEqual(2); // Black turn
    expect(board.getPiece(design.stringToPos("b8")) === null).toBeTruthy(); // b8 is empty
    expect(board.getPiece(design.stringToPos("c9")) === null).toBeTruthy(); // c9 is empty
    expect(board.getPiece(design.stringToPos("e9")) === null).toBeTruthy(); // e9 is empty
    expect(board.getPiece(design.stringToPos("g9")) === null).toBeTruthy(); // g9 is empty
    expect(board.getPiece(design.stringToPos("i9")) === null).toBeTruthy(); // i9 is empty
    expect(board.getPiece(design.stringToPos("i7")) === null).toBeTruthy(); // i7 is empty
    expect(board.getPiece(design.stringToPos("g5")) === null).toBeTruthy(); // g5 is empty
    expect(board.getPiece(design.stringToPos("g3")) === null).toBeTruthy(); // g3 is empty
    expect(board.getPiece(design.stringToPos("b2")).toString(design)).toEqual("Black Man"); // Black Man on b2
    expect(board.getPiece(design.stringToPos("b4")).toString(design)).toEqual("Black Man"); // Black Man on b4
    expect(board.getPiece(design.stringToPos("c7")).toString(design)).toEqual("Black Man"); // Black Man on c7
    expect(board.getPiece(design.stringToPos("d6")).toString(design)).toEqual("Black Man"); // Black Man on d6
    expect(board.getPiece(design.stringToPos("e3")).toString(design)).toEqual("Black Man"); // Black Man on e3
    expect(board.getPiece(design.stringToPos("f2")).toString(design)).toEqual("Black Man"); // Black Man on f2
    expect(board.getPiece(design.stringToPos("g7")).toString(design)).toEqual("Black Man"); // Black Man on g7
    expect(board.getPiece(design.stringToPos("h2")).toString(design)).toEqual("White Man"); // White Man on h2

    board.generate();

    expect(board.legalMoves.length).toEqual(12); // 12 moves
    expect(board.legalMoves[0].toString(design)).toEqual("c7-b6");
    expect(board.legalMoves[1].toString(design)).toEqual("g7-f6");
    expect(board.legalMoves[2].toString(design)).toEqual("g7-h6");
    expect(board.legalMoves[3].toString(design)).toEqual("d6-c5");
    expect(board.legalMoves[4].toString(design)).toEqual("d6-e5");
    expect(board.legalMoves[5].toString(design)).toEqual("b4-a3");
    expect(board.legalMoves[6].toString(design)).toEqual("b4-c3");
    expect(board.legalMoves[7].toString(design)).toEqual("e3-d2");
    expect(board.legalMoves[8].toString(design)).toEqual("b2-a1");
    expect(board.legalMoves[9].toString(design)).toEqual("b2-c1");
    expect(board.legalMoves[10].toString(design)).toEqual("f2-e1");
    expect(board.legalMoves[11].toString(design)).toEqual("f2-g1");

    board = board.apply(board.legalMoves[8]);

    expect(board.player).toEqual(1); // White turn
    expect(board.getPiece(design.stringToPos("b2")) === null).toBeTruthy(); // b2 is empty
    expect(board.getPiece(design.stringToPos("a1")).toString(design)).toEqual("Black King"); // Black king is on a1
});

test("Check lastFrom", function () {
    const design = new TDesign();
    let board = design.getInitBoard(buildDesign, [maximalCapture, promotion]).copy();

    expect(board.player).toEqual(1); // White turn

    board.clear();
    const white = design.createPiece(1, 1);
    board.setPiece(design.stringToPos("d4"), white);
    board.setPiece(design.stringToPos("e5"), white);
    const black = design.createPiece(1, 2);
    board.setPiece(design.stringToPos("j10"), black);
    board.generate();

    expect(board.legalMoves.length).toEqual(21); // 21 moves
    expect(board.legalMoves[0].toString(design)).toEqual("e5-d6");
    expect(board.legalMoves[1].toString(design)).toEqual("e5-c7");
    expect(board.legalMoves[2].toString(design)).toEqual("e5-b8");
    expect(board.legalMoves[3].toString(design)).toEqual("e5-a9");
    expect(board.legalMoves[4].toString(design)).toEqual("e5-f4");
    expect(board.legalMoves[5].toString(design)).toEqual("e5-g3");
    expect(board.legalMoves[6].toString(design)).toEqual("e5-h2");
    expect(board.legalMoves[7].toString(design)).toEqual("e5-i1");
    expect(board.legalMoves[8].toString(design)).toEqual("e5-f6");
    expect(board.legalMoves[9].toString(design)).toEqual("e5-g7");
    expect(board.legalMoves[10].toString(design)).toEqual("e5-h8");
    expect(board.legalMoves[11].toString(design)).toEqual("e5-i9");
    expect(board.legalMoves[12].toString(design)).toEqual("d4-c5");
    expect(board.legalMoves[13].toString(design)).toEqual("d4-b6");
    expect(board.legalMoves[14].toString(design)).toEqual("d4-a7");
    expect(board.legalMoves[15].toString(design)).toEqual("d4-e3");
    expect(board.legalMoves[16].toString(design)).toEqual("d4-f2");
    expect(board.legalMoves[17].toString(design)).toEqual("d4-g1");
    expect(board.legalMoves[18].toString(design)).toEqual("d4-c3");
    expect(board.legalMoves[19].toString(design)).toEqual("d4-b2");
    expect(board.legalMoves[20].toString(design)).toEqual("d4-a1");

    board = board.apply(board.legalMoves[7]);

    expect(board.player).toEqual(2); // Black turn

    board.generate();

    expect(board.legalMoves.length).toEqual(3); // 3 moves
    expect(board.legalMoves[0].toString(design)).toEqual("j10-c3");
    expect(board.legalMoves[1].toString(design)).toEqual("j10-b2");
    expect(board.legalMoves[2].toString(design)).toEqual("j10-a1");
});
