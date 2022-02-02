import { games } from "../../src/dagaz-model.js";
import "./russian-checkers-dagaz.js";

describe("King Moves", () => {
  const design = games.model.getDesign();
  let board = design.getInitBoard().copy();

  test("White player", () => {
    expect(board.player).toBe(1);
  });

  test("Move generation", () => {
    board.clear();
    const white = design.createPiece(1, 1);
    board.setPiece(design.stringToPos("h2"), white);
    board.generate();
  
    expect( board.moves.length ).toBe(7); // 7 moves
    expect( board.moves[0].toString(design) ).toBe("h2-g3"); // h2-g3
    expect( board.moves[1].toString(design) ).toBe("h2-f4"); // h2-f4
    expect( board.moves[2].toString(design) ).toBe("h2-e5"); // h2-e5
    expect( board.moves[3].toString(design) ).toBe("h2-d6"); // h2-d6
    expect( board.moves[4].toString(design) ).toBe("h2-c7"); // h2-c7
    expect( board.moves[5].toString(design) ).toBe("h2-b8"); // h2-b8
    expect( board.moves[6].toString(design) ).toBe("h2-g1"); // h2-g1
  });

  test("Black makes a move", () => {
    board = board.apply(board.moves[3]);

    expect( board.player ).toBe(2); // Black move
    expect( board.getPiece(design.stringToPos("h2")) ).toBeNull(); // h2 is empty
    expect( board.getPiece(design.stringToPos("f4")) ).toBeNull(); // f4 is empty
    expect( board.getPiece(design.stringToPos("e5")) ).toBeNull(); // e5 is empty
    expect( board.getPiece(design.stringToPos("d6")).toString(design) ).toBe("White King"); // White King on d6
  });
});

describe( "King Capturing", () => {
  const design = games.model.getDesign();
  let board = design.getInitBoard().copy();

  test("White player", () => {
    expect( board.player ).toBe(1);
  });

  test("Move generation", () => {
    board.clear();
    const white = design.createPiece(1, 1);
    board.setPiece(design.stringToPos("h2"), white);
    const black = design.createPiece(0, 2);
    board.setPiece(design.stringToPos("f4"), black);
    board.generate();
  
    expect( board.moves.length ).toBe(4); // 4 moves
    expect( board.moves[0].toString(design) ).toBe("h2-e5"); // h2-e5
    expect( board.moves[1].toString(design) ).toBe("h2-d6"); // h2-d6
    expect( board.moves[2].toString(design) ).toBe("h2-c7"); // h2-c7
    expect( board.moves[3].toString(design) ).toBe("h2-b8"); // h2-b8
  });

  test("Black makes a move", () => {
    board = board.apply(board.moves[2]);

    expect( board.player ).toBe(2); // Black move
    expect( board.getPiece(design.stringToPos("h2")) ).toBeNull(); // h2 is empty
    expect( board.getPiece(design.stringToPos("g3")) ).toBeNull(); // g3 is empty
    expect( board.getPiece(design.stringToPos("f4")) ).toBeNull(); // f4 is empty
    expect( board.getPiece(design.stringToPos("e5")) ).toBeNull(); // e5 is empty
    expect( board.getPiece(design.stringToPos("d6")) ).toBeNull(); // d6 is empty
    expect( board.getPiece(design.stringToPos("c7")).toString(design) ).toBe("White King"); // White King on c7
  });
});

describe( "Man Capturing", () => {
  const design = games.model.getDesign();
  let board = design.getInitBoard().copy();

  test("White player", () => {
    expect( board.player ).toBe(1);
  });

  test("Move generation", () => {
    board.clear();
    const white = design.createPiece(0, 1);
    board.setPiece(design.stringToPos("h2"), white);
    const black = design.createPiece(0, 2);
    board.setPiece(design.stringToPos("a7"), black);
    board.setPiece(design.stringToPos("b4"), black);
    board.setPiece(design.stringToPos("e5"), black);
    board.setPiece(design.stringToPos("e7"), black);
    board.setPiece(design.stringToPos("g3"), black);
    board.setPiece(design.stringToPos("g5"), black);
    board.setPiece(design.stringToPos("g7"), black);
    board.generate();

    expect( board.moves.length ).toBe(7); // 7 moves
    expect( board.moves[0].toString(design) ).toBe("h2-f4-d6-f8-h6-f4");
    expect( board.moves[1].toString(design) ).toBe("h2-f4-d6-f8-h6-e3");
    expect( board.moves[2].toString(design) ).toBe("h2-f4-d6-f8-h6-c1");
    expect( board.moves[3].toString(design) ).toBe("h2-f4-h6-f8-d6-a3");
    expect( board.moves[4].toString(design) ).toBe("h2-f4-h6-f8-d6-f4");
    expect( board.moves[5].toString(design) ).toBe("h2-f4-h6-f8-c5-a3");
    expect( board.moves[6].toString(design) ).toBe("h2-f4-d6-f8-h6-d2-a5");
  });

  test("Black makes a move", () => {

    board = board.apply(board.moves[6]);
    expect( board.player ).toBe(2); //Black move

    expect( board.getPiece(design.stringToPos("h2")) ).toBeNull(); // h2 is empty
    expect( board.getPiece(design.stringToPos("g3")) ).toBeNull(); // g3 is empty
    expect( board.getPiece(design.stringToPos("f4")) ).toBeNull(); // f4 is empty
    expect( board.getPiece(design.stringToPos("e5")) ).toBeNull(); // e5 is empty
    expect( board.getPiece(design.stringToPos("d6")) ).toBeNull(); // d6 is empty
    expect( board.getPiece(design.stringToPos("e7")) ).toBeNull(); // e7 is empty
    expect( board.getPiece(design.stringToPos("f8")) ).toBeNull(); // f8 is empty
    expect( board.getPiece(design.stringToPos("g7")) ).toBeNull(); // g7 is empty
    expect( board.getPiece(design.stringToPos("h6")) ).toBeNull(); // h6 is empty
    expect( board.getPiece(design.stringToPos("g5")) ).toBeNull(); // g5 is empty
    expect( board.getPiece(design.stringToPos("e3")) ).toBeNull(); // e3 is empty
    expect( board.getPiece(design.stringToPos("d2")) ).toBeNull(); // d2 is empty
    expect( board.getPiece(design.stringToPos("c3")) ).toBeNull(); // c3 is empty
    expect( board.getPiece(design.stringToPos("b4")) ).toBeNull(); // b4 is empty
    expect( board.getPiece(design.stringToPos("a5")).toString(design) ).toBe("White King"); // White King on a5
    expect( board.getPiece(design.stringToPos("a7")).toString(design) ).toBe("Black Man"); // Black Man on a7
  });
});
