import { games } from "../../src/dagaz-model.js";
import "./maximal-captures-dagaz.js";
import "./international-checkers-dagaz-promotion.js";
import "./international-checkers-dagaz.js";

describe("Man promotion", () => {
  const design = games.model.getDesign();
  let board = design.getInitBoard().copy();

  test("White player", () => {
    expect( board.player ).toBe(1);
  });

  test("Move generation for black", () => {
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

    expect( board.moves.length ).toBe(2); // 2 moves
    expect( board.moves[0].toString(design) ).toBe("b8-d10-f8-h10-j8-h6-f4-h2", "b8-d10-f8-h10-j8-h6-f4-h2");
    expect( board.moves[1].toString(design) ).toBe("b8-d10-f8-h10-j8-h6-f4-d2", "b8-d10-f8-h10-j8-h6-f4-d2");
  });

  test("Black makes a move", () => {
    board = board.apply(board.moves[0]);
    expect( board.player ).toBe(2); // Black move
    expect( board.getPiece(design.stringToPos("b8")) ).toBeNull(); // b8 is empty
    expect( board.getPiece(design.stringToPos("c9")) ).toBeNull(); // c9 is empty
    expect( board.getPiece(design.stringToPos("e9")) ).toBeNull(); // e9 is empty
    expect( board.getPiece(design.stringToPos("g9")) ).toBeNull(); // g9 is empty
    expect( board.getPiece(design.stringToPos("i9")) ).toBeNull(); // i9 is empty
    expect( board.getPiece(design.stringToPos("i7")) ).toBeNull(); // i7 is empty
    expect( board.getPiece(design.stringToPos("g5")) ).toBeNull(); // g5 is empty
    expect( board.getPiece(design.stringToPos("g3")) ).toBeNull(); // g3 is empty
    expect( board.getPiece(design.stringToPos("b2")).toString(design) ).toBe("Black Man"); // Black Man on b2
    expect( board.getPiece(design.stringToPos("b4")).toString(design) ).toBe("Black Man"); // Black Man on b4
    expect( board.getPiece(design.stringToPos("c7")).toString(design) ).toBe("Black Man"); // Black Man on c7
    expect( board.getPiece(design.stringToPos("d6")).toString(design) ).toBe("Black Man"); // Black Man on d6
    expect( board.getPiece(design.stringToPos("e3")).toString(design) ).toBe("Black Man"); // Black Man on e3
    expect( board.getPiece(design.stringToPos("f2")).toString(design) ).toBe("Black Man"); // Black Man on f2
    expect( board.getPiece(design.stringToPos("g7")).toString(design) ).toBe("Black Man"); // Black Man on g7
    expect( board.getPiece(design.stringToPos("h2")).toString(design) ).toBe("White Man"); // White Man on h2
  });

  test("Move generation for white", () => {
    board.generate();
    expect( board.moves.length ).toBe(12); // 12 moves:
    expect( board.moves[0].toString(design) ).toBe("c7-b6"); // c7-b6
    expect( board.moves[1].toString(design) ).toBe("g7-f6"); // g7-f6
    expect( board.moves[2].toString(design) ).toBe("g7-h6"); // g7-h6
    expect( board.moves[3].toString(design) ).toBe("d6-c5"); // d6-c5
    expect( board.moves[4].toString(design) ).toBe("d6-e5"); // d6-e5
    expect( board.moves[5].toString(design) ).toBe("b4-a3"); // b4-a3
    expect( board.moves[6].toString(design) ).toBe("b4-c3"); // b4-c3
    expect( board.moves[7].toString(design) ).toBe("e3-d2"); // e3-d2
    expect( board.moves[8].toString(design) ).toBe("b2-a1"); // b2-a1
    expect( board.moves[9].toString(design) ).toBe("b2-c1"); // b2-c1
    expect( board.moves[10].toString(design) ).toBe("f2-e1"); // f2-e1
    expect( board.moves[11].toString(design) ).toBe("f2-g1"); // f2-g1
  });

  test("White makes a move", () => {
    board = board.apply(board.moves[8]);
    expect( board.player ).toBe(1); // White move
    expect( board.getPiece(design.stringToPos("b2")) ).toBeNull(); // b2 is empty
    expect( board.getPiece(design.stringToPos("a1")).toString(design) ).toBe("Black King"); // Black King on a1
  });
});

describe( "Check lastFrom", () => {
  const design = games.model.getDesign();
  let board = design.getInitBoard().copy();

  expect( board.player ).toBe(1); // White move

  board.clear();
  const white = design.createPiece(1, 1);
  board.setPiece(design.stringToPos("d4"), white);
  board.setPiece(design.stringToPos("e5"), white);
  const black = design.createPiece(1, 2);
  board.setPiece(design.stringToPos("j10"), black);
  board.generate();

  expect( board.moves.length ).toBe(21); //21 moves
  expect( board.moves[0].toString(design) ).toBe("e5-d6"); // e5-d6
  expect( board.moves[1].toString(design) ).toBe("e5-c7"); // e5-c7
  expect( board.moves[2].toString(design) ).toBe("e5-b8"); // e5-b8
  expect( board.moves[3].toString(design) ).toBe("e5-a9"); // e5-a9
  expect( board.moves[4].toString(design) ).toBe("e5-f4"); // e5-f4
  expect( board.moves[5].toString(design) ).toBe("e5-g3"); // e5-g3
  expect( board.moves[6].toString(design) ).toBe("e5-h2"); // e5-h2
  expect( board.moves[7].toString(design) ).toBe("e5-i1"); // e5-i1
  expect( board.moves[8].toString(design) ).toBe("e5-f6"); // e5-f6
  expect( board.moves[9].toString(design) ).toBe("e5-g7"); // e5-g7
  expect( board.moves[10].toString(design) ).toBe("e5-h8"); // e5-h8
  expect( board.moves[11].toString(design) ).toBe("e5-i9"); // e5-i9
  expect( board.moves[12].toString(design) ).toBe("d4-c5"); // d4-c5
  expect( board.moves[13].toString(design) ).toBe("d4-b6"); // d4-b6
  expect( board.moves[14].toString(design) ).toBe("d4-a7"); // d4-a7
  expect( board.moves[15].toString(design) ).toBe("d4-e3"); // d4-e3
  expect( board.moves[16].toString(design) ).toBe("d4-f2"); // d4-f2
  expect( board.moves[17].toString(design) ).toBe("d4-g1"); // d4-g1
  expect( board.moves[18].toString(design) ).toBe("d4-c3"); // d4-c3
  expect( board.moves[19].toString(design) ).toBe("d4-b2"); // d4-b2
  expect( board.moves[20].toString(design) ).toBe("d4-a1"); // d4-a1
  board = board.apply(board.moves[7]);
  expect( board.player ).toBe(2); // Black move
  board.generate();
  expect( board.moves.length ).toBe(3); // 3 moves
  expect( board.moves[0].toString(design) ).toBe("j10-c3"); // j10-c3
  expect( board.moves[1].toString(design) ).toBe("j10-b2"); // j10-b2
  expect( board.moves[2].toString(design) ).toBe("j10-a1"); // j10-a1
});
