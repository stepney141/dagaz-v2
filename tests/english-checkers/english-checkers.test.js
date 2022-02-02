import { games } from "../../src/dagaz-model.js";
import "./english-checkers-dagaz.js";

describe("Initial Board", () => {
  const design = games.model.getDesign();
  let board = design.getInitBoard();

  test("Black player", () => {
    expect( board.player ).toBe(1);
  });

  test("Initial position", () => {
    expect( board.turn ).toBe(0);
    expect( board.player ).toBe(1);
    expect( design.posToString(1) ).toBe("a8");
    expect( board.getPiece(1) ).toBeNull();
    expect( design.posToString(2) ).toBe("b8");
    expect( board.getPiece(2).toString(design) ).toBe("White Man");
    expect( design.posToString(3) ).toBe("c8");
    expect( board.getPiece(3) ).toBeNull();
    expect( design.posToString(4) ).toBe("d8");
    expect( board.getPiece(4).toString(design) ).toBe("White Man");
    expect( design.posToString(5) ).toBe("e8");
    expect( board.getPiece(5) ).toBeNull();
    expect( design.posToString(6) ).toBe("f8");
    expect( board.getPiece(6).toString(design) ).toBe("White Man");
    expect( design.posToString(7) ).toBe("g8");
    expect( board.getPiece(7) ).toBeNull();
    expect( design.posToString(8) ).toBe("h8");
    expect( board.getPiece(8).toString(design) ).toBe("White Man");
    expect( design.posToString(9) ).toBe("a7");
    expect( board.getPiece(9).toString(design) ).toBe("White Man");
    expect( design.posToString(10) ).toBe("b7");
    expect( board.getPiece(10) ).toBeNull();
    expect( design.posToString(11) ).toBe("c7");
    expect( board.getPiece(11).toString(design) ).toBe("White Man");
    expect( design.posToString(12) ).toBe("d7");
    expect( board.getPiece(12) ).toBeNull();
    expect( design.posToString(13) ).toBe("e7");
    expect( board.getPiece(13).toString(design) ).toBe("White Man");
    expect( design.posToString(14) ).toBe("f7");
    expect( board.getPiece(14) ).toBeNull();
    expect( design.posToString(15) ).toBe("g7");
    expect( board.getPiece(15).toString(design) ).toBe("White Man");
    expect( design.posToString(16) ).toBe("h7");
    expect( board.getPiece(16) ).toBeNull();
    expect( design.posToString(17) ).toBe("a6");
    expect( board.getPiece(17) ).toBeNull();
    expect( design.posToString(18) ).toBe("b6");
    expect( board.getPiece(18).toString(design) ).toBe("White Man");
    expect( design.posToString(19) ).toBe("c6");
    expect( board.getPiece(19) ).toBeNull();
    expect( design.posToString(20) ).toBe("d6");
    expect( board.getPiece(20).toString(design) ).toBe("White Man");
    expect( design.posToString(21) ).toBe("e6");
    expect( board.getPiece(21) ).toBeNull();
    expect( design.posToString(22) ).toBe("f6");
    expect( board.getPiece(22).toString(design) ).toBe("White Man");
    expect( design.posToString(23) ).toBe("g6");
    expect( board.getPiece(23) ).toBeNull();
    expect( design.posToString(24) ).toBe("h6");
    expect( board.getPiece(24).toString(design) ).toBe("White Man");
    expect( design.posToString(25) ).toBe("a5");
    expect( board.getPiece(25) ).toBeNull();
    expect( design.posToString(26) ).toBe("b5");
    expect( board.getPiece(26) ).toBeNull();
    expect( design.posToString(27) ).toBe("c5");
    expect( board.getPiece(27) ).toBeNull();
    expect( design.posToString(28) ).toBe("d5");
    expect( board.getPiece(28) ).toBeNull();
    expect( design.posToString(29) ).toBe("e5");
    expect( board.getPiece(29) ).toBeNull();
    expect( design.posToString(30) ).toBe("f5");
    expect( board.getPiece(30) ).toBeNull();
    expect( design.posToString(31) ).toBe("g5");
    expect( board.getPiece(31) ).toBeNull();
    expect( design.posToString(32) ).toBe("h5");
    expect( board.getPiece(32) ).toBeNull();
    expect( design.posToString(33) ).toBe("a4");
    expect( board.getPiece(33) ).toBeNull();
    expect( design.posToString(34) ).toBe("b4");
    expect( board.getPiece(34) ).toBeNull();
    expect( design.posToString(35) ).toBe("c4");
    expect( board.getPiece(35) ).toBeNull();
    expect( design.posToString(36) ).toBe("d4");
    expect( board.getPiece(36) ).toBeNull();
    expect( design.posToString(37) ).toBe("e4");
    expect( board.getPiece(37) ).toBeNull();
    expect( design.posToString(38) ).toBe("f4");
    expect( board.getPiece(38) ).toBeNull();
    expect( design.posToString(39) ).toBe("g4");
    expect( board.getPiece(39) ).toBeNull();
    expect( design.posToString(40) ).toBe("h4");
    expect( board.getPiece(40) ).toBeNull();
    expect( design.posToString(41) ).toBe("a3");
    expect( board.getPiece(41).toString(design) ).toBe("Black Man");
    expect( design.posToString(42) ).toBe("b3");
    expect( board.getPiece(42) ).toBeNull();
    expect( design.posToString(43) ).toBe("c3");
    expect( board.getPiece(43).toString(design) ).toBe("Black Man");
    expect( design.posToString(44) ).toBe("d3");
    expect( board.getPiece(44) ).toBeNull();
    expect( design.posToString(45) ).toBe("e3");
    expect( board.getPiece(45).toString(design) ).toBe("Black Man");
    expect( design.posToString(46) ).toBe("f3");
    expect( board.getPiece(46) ).toBeNull();
    expect( design.posToString(47) ).toBe("g3");
    expect( board.getPiece(47).toString(design) ).toBe("Black Man");
    expect( design.posToString(48) ).toBe("h3");
    expect( board.getPiece(48) ).toBeNull();
    expect( design.posToString(49) ).toBe("a2");
    expect( board.getPiece(49) ).toBeNull();
    expect( design.posToString(50) ).toBe("b2");
    expect( board.getPiece(50).toString(design) ).toBe("Black Man");
    expect( design.posToString(51) ).toBe("c2");
    expect( board.getPiece(51) ).toBeNull();
    expect( design.posToString(52) ).toBe("d2");
    expect( board.getPiece(52).toString(design) ).toBe("Black Man");
    expect( design.posToString(53) ).toBe("e2");
    expect( board.getPiece(53) ).toBeNull();
    expect( design.posToString(54) ).toBe("f2");
    expect( board.getPiece(54).toString(design) ).toBe("Black Man");
    expect( design.posToString(55) ).toBe("g2");
    expect( board.getPiece(55) ).toBeNull();
    expect( design.posToString(56) ).toBe("h2");
    expect( board.getPiece(56).toString(design) ).toBe("Black Man");
    expect( design.posToString(57) ).toBe("a1");
    expect( board.getPiece(57).toString(design) ).toBe("Black Man");
    expect( design.posToString(58) ).toBe("b1");
    expect( board.getPiece(58) ).toBeNull();
    expect( design.posToString(59) ).toBe("c1");
    expect( board.getPiece(59).toString(design) ).toBe("Black Man");
    expect( design.posToString(60) ).toBe("d1");
    expect( board.getPiece(60) ).toBeNull();
    expect( design.posToString(61) ).toBe("e1");
    expect( board.getPiece(61).toString(design) ).toBe("Black Man");
    expect( design.posToString(62) ).toBe("f1");
    expect( board.getPiece(62) ).toBeNull();
    expect( design.posToString(63) ).toBe("g1");
    expect( board.getPiece(63).toString(design) ).toBe("Black Man");
    expect( design.posToString(64) ).toBe("h1");
    expect( board.getPiece(64) ).toBeNull();
  });

  test("Move ganeration for white", () => {
    board.generate();
    expect( board.moves.length ).toBe(7); // 7 moves:
    expect( board.moves[0].toString(design) ).toBe("a3-b4"); // a3-b4
    expect( board.moves[1].toString(design) ).toBe("c3-b4"); // c3-b4
    expect( board.moves[2].toString(design) ).toBe("c3-d4"); // c3-d4
    expect( board.moves[3].toString(design) ).toBe("e3-d4"); // e3-d4
    expect( board.moves[4].toString(design) ).toBe("e3-f4"); // e3-f4
    expect( board.moves[5].toString(design) ).toBe("g3-f4"); // g3-f4
    expect( board.moves[6].toString(design) ).toBe("g3-h4"); // g3-h4
  });

  test("White makes a move", () => {
    board = board.apply(board.moves[0]);
    expect( board.player ).toBe(2); // White move
    expect( board.turn ).toBe(1);
    expect( board.player ).toBe(2);
    expect( design.posToString(41) ).toBe("a3");
    expect( board.getPiece(41) ).toBeNull(); 
    expect( design.posToString(34) ).toBe("b4");
    expect( board.getPiece(34).toString(design) ).toBe("Black Man"); // Black Man
  });

  test("Move generation for black", () => {
    board.generate();
    expect( board.moves.length ).toBe(7); // 7 moves:
    expect( board.moves[0].toString(design) ).toBe("b6-c5"); // b6-c5
    expect( board.moves[1].toString(design) ).toBe("b6-a5"); // b6-a5
    expect( board.moves[2].toString(design) ).toBe("d6-e5"); // d6-e5
    expect( board.moves[3].toString(design) ).toBe("d6-c5"); // d6-c5
    expect( board.moves[4].toString(design) ).toBe("f6-g5"); // f6-g5
    expect( board.moves[5].toString(design) ).toBe("f6-e5"); // f6-e5
    expect( board.moves[6].toString(design) ).toBe("h6-g5"); // h6-g5
  });

  test("Black makes a move", () => {
    board = board.apply(board.moves[6]);
    expect( board.player ).toBe(1); // Black move
    expect( board.turn ).toBe(0);
    expect( board.player ).toBe(1);
    expect( design.posToString(41) ).toBe("a3");
    expect( board.getPiece(41) ).toBeNull(); 
    expect( design.posToString(34) ).toBe("b4");
    expect( board.getPiece(34).toString(design) ).toBe("Black Man"); // Black Man
    expect( design.posToString(24) ).toBe("h6");
    expect( board.getPiece(24) ).toBeNull(); 
    expect( design.posToString(31) ).toBe("g5");
    expect( board.getPiece(31).toString(design) ).toBe("White Man"); // White Man
  });
});

describe( "Man Capturing", () => {
  const design = games.model.getDesign();
  let board = design.getInitBoard().copy();

  test("Black player", () => {
    expect( board.player ).toBe(1); // Black move
  });

  test("Move generation for white", () => {
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

    expect( board.moves.length ).toBe(2); // 2 moves:
    expect( board.moves[0].toString(design) ).toBe("f2-d4-b6-d8"); // f2-d4-b6-d8
    expect( board.moves[1].toString(design) ).toBe("f2-d4-f6-d8"); // f2-d4-f6-d8
  });

  test("Black makes a move", () => {
    board = board.apply(board.moves[0]);
    expect( board.player ).toBe(2); // White move
    expect( board.getPiece(design.stringToPos("a3")).toString(design) ).toBe("Black Man"); // Black Man on a3
    expect( board.getPiece(design.stringToPos("d8")).toString(design) ).toBe("Black King"); // Black King on d8
    expect( board.getPiece(design.stringToPos("f3")) ).toBeNull(); // f3 is empty
    expect( board.getPiece(design.stringToPos("e3")) ).toBeNull(); // e3 is empty
    expect( board.getPiece(design.stringToPos("c5")) ).toBeNull(); // c5 is empty
    expect( board.getPiece(design.stringToPos("c7")) ).toBeNull(); // c7 is empty
    expect( board.getPiece(design.stringToPos("d4")) ).toBeNull(); // d4 is empty
    expect( board.getPiece(design.stringToPos("b6")) ).toBeNull(); // b6 is empty
    expect( board.getPiece(design.stringToPos("c3")).toString(design) ).toBe("White Man"); // White Man on c3
    expect( board.getPiece(design.stringToPos("e5")).toString(design) ).toBe("White Man"); // White Man on e5
    expect( board.getPiece(design.stringToPos("e7")).toString(design) ).toBe("White Man"); // White Man on e7
  });
});

describe( "King Capturing", () => {
  const design = games.model.getDesign();
  let board = design.getInitBoard().copy();

  test("Black player", () => {
    expect( board.player ).toBe(1); // Black move
  });

  test("Move generation for white", () => {
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
    expect( board.moves.length ).toBe(6); // 6 moves:
    expect( board.moves[0].toString(design) ).toBe("d4-f6-h8"); // d4-f6-h8
    expect( board.moves[1].toString(design) ).toBe("d4-f6-h4"); // d4-f6-h4
    expect( board.moves[2].toString(design) ).toBe("d4-b6-d8-f6-h8"); // d4-b6-d8-f6-h8
    expect( board.moves[3].toString(design) ).toBe("d4-b6-d8-f6-d4"); // d4-b6-d8-f6-d4
    expect( board.moves[4].toString(design) ).toBe("d4-b6-d8-f6-h4"); // d4-b6-d8-f6-h4
    expect( board.moves[5].toString(design) ).toBe("d4-f6-d8-b6-d4"); // d4-f6-d8-b6-d4
  });

  test("White makes a move", () => {
    board = board.apply(board.moves[2]);
    expect( board.player ).toBe(2); // White move
    expect( board.getPiece(design.stringToPos("h8")).toString(design) ).toBe("Black King"); // Black King on h8
    expect( board.getPiece(design.stringToPos("d4")) ).toBeNull(); // d4 is empty 
    expect( board.getPiece(design.stringToPos("c5")) ).toBeNull(); // c5 is empty 
    expect( board.getPiece(design.stringToPos("c7")) ).toBeNull(); // c7 is empty 
    expect( board.getPiece(design.stringToPos("e7")) ).toBeNull(); // e7 is empty 
    expect( board.getPiece(design.stringToPos("g7")) ).toBeNull(); // g7 is empty 
    expect( board.getPiece(design.stringToPos("b6")) ).toBeNull(); // b6 is empty 
    expect( board.getPiece(design.stringToPos("d8")) ).toBeNull(); // d8 is empty 
    expect( board.getPiece(design.stringToPos("f6")) ).toBeNull(); // f6 is empty 
    expect( board.getPiece(design.stringToPos("e5")).toString(design) ).toBe("White Man"); // White Man on e5
    expect( board.getPiece(design.stringToPos("g5")).toString(design) ).toBe("White Man"); // White Man on g5
  });
});
