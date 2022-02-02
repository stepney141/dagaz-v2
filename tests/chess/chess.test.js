import { games } from "../../src/dagaz-model.js";
import "./chess-dagaz.js";
import "./chess-dagaz-invariant.js";

describe("Initial Board", () => {
  const design = games.model.getDesign();
  const board = design.getInitBoard();

  test("White player", () => {
    expect( board.player ).toBe(1);
    board.generate();
    expect( board.moves.length ).toBe(20); // 20 moves:
    expect( board.moves[0].toString(design) ).toBe("a2-a3"); // a2-a3
    expect( board.moves[1].toString(design) ).toBe("a2-a4"); // a2-a4
    expect( board.moves[2].toString(design) ).toBe("b2-b3"); // b2-b3
    expect( board.moves[3].toString(design) ).toBe("b2-b4"); // b2-b4
    expect( board.moves[4].toString(design) ).toBe("c2-c3"); // c2-c3
    expect( board.moves[5].toString(design) ).toBe("c2-c4"); // c2-c4
    expect( board.moves[6].toString(design) ).toBe("d2-d3"); // d2-d3
    expect( board.moves[7].toString(design) ).toBe("d2-d4"); // d2-d4
    expect( board.moves[8].toString(design) ).toBe("e2-e3"); // e2-e3
    expect( board.moves[9].toString(design) ).toBe("e2-e4"); // e2-e4
    expect( board.moves[10].toString(design) ).toBe("f2-f3"); // f2-f3
    expect( board.moves[11].toString(design) ).toBe("f2-f4"); // f2-f4
    expect( board.moves[12].toString(design) ).toBe("g2-g3"); // g2-g3
    expect( board.moves[13].toString(design) ).toBe("g2-g4"); // g2-g4
    expect( board.moves[14].toString(design) ).toBe("h2-h3"); // h2-h3
    expect( board.moves[15].toString(design) ).toBe("h2-h4"); // h2-h4
    expect( board.moves[16].toString(design) ).toBe("b1-a3"); // b1-a3
    expect( board.moves[17].toString(design) ).toBe("b1-c3"); // b1-c3
    expect( board.moves[18].toString(design) ).toBe("g1-f3"); // g1-f3
    expect( board.moves[19].toString(design) ).toBe("g1-h3"); // g1-h3
  });
});

describe( "En Passant", () => {
  const design = games.model.getDesign();
  let board = design.getInitBoard();
  board.clear();

  test("White player", () => {
    expect( board.player ).toBe(1);
  });

  test("Move generation for black", () => {
    const white = design.createPiece(0, 1);
    board.setPiece(design.stringToPos("c4"), white);
    board.setPiece(design.stringToPos("e2"), white);
    board.setPiece(design.stringToPos("g2"), white);
    const black = design.createPiece(0, 2);
    board.setPiece(design.stringToPos("d4"), black);
    board.setPiece(design.stringToPos("f4"), black);
    board.generate();
    expect( board.moves.length ).toBe(5); // 5 moves:
    expect( board.moves[0].toString(design) ).toBe("c4-c5"); // c4-c5
    expect( board.moves[1].toString(design) ).toBe("e2-e3"); // e2-e3
    expect( board.moves[2].toString(design) ).toBe("e2-e4"); // e2-e4
    expect( board.moves[3].toString(design) ).toBe("g2-g3"); // g2-g3
    expect( board.moves[4].toString(design) ).toBe("g2-g4"); // g2-g4
  });

  test("Black makes a move", () => {
    board = board.apply(board.moves[2]);
    expect( design.posToString(board.lastFrom) ).toBe("e2"); // Last from position: e2
  });

  test("Black player", () => {
    expect( board.player ).toBe(2);
  });

  test("Move generation for white", () => {
    board.generate();
    expect( board.moves.length ).toBe(4); // 4 moves:
    expect( board.moves[0].toString(design) ).toBe("d4-d3"); // d4-d3
    expect( board.moves[1].toString(design) ).toBe("d4-e3"); // d4-e3
    expect( board.moves[2].toString(design) ).toBe("f4-f3"); // f4-f3
    expect( board.moves[3].toString(design) ).toBe("f4-e3"); // f4-e3
  });

  test("White makes a move", () => {
    board = board.apply(board.moves[1]);
    expect( board.player ).toBe(1);
    expect( board.getPiece(design.stringToPos("d4")) ).toBeNull(); // d4 is empty
    expect( board.getPiece(design.stringToPos("e4")) ).toBeNull(); // e4 is empty
    expect( board.getPiece(design.stringToPos("e2")) ).toBeNull(); // e2 is empty
    expect( board.getPiece(design.stringToPos("e3")).toString(design) ).toBe("Black Pawn"); // Black Pawn on e3
  });

  test("Move generation for black", () => {
    board.generate();
    expect( board.moves.length ).toBe(3); // 3 moves:
    expect( board.moves[0].toString(design) ).toBe("c4-c5"); // c4-c5
    expect( board.moves[1].toString(design) ).toBe("g2-g3"); // g2-g3
    expect( board.moves[2].toString(design) ).toBe("g2-g4"); // g2-g4
  });
  
  test("Black player", () => {
    board = board.apply(board.moves[1]);
    expect( board.player ).toBe(2);
  });
  
  test("Move generation for white", () => {
    board.generate();
    expect( board.moves.length ).toBe(3); // 3 moves:
    expect( board.moves[0].toString(design) ).toBe("f4-f3"); // f4-f3
    expect( board.moves[1].toString(design) ).toBe("f4-g3"); // f4-g3
    expect( board.moves[2].toString(design) ).toBe("e3-e2"); // e3-e2
  });
  
  test("White player", () => {
    board = board.apply(board.moves[1]);
    expect( board.player ).toBe(1);
    expect( board.getPiece(design.stringToPos("f4")) ).toBeNull(); // f4 is empty
    expect( board.getPiece(design.stringToPos("g3")).toString(design) ).toBe("Black Pawn"); // Black Pawn on g3
  });
  
  test("Move generation for black", () => {
    board.generate();
    expect( board.moves.length ).toBe(1); // 1 move:
    expect( board.moves[0].toString(design) ).toBe("c4-c5"); // c4-c5
  });
});

describe( "Castling", () => {
  const design = games.model.getDesign();
  let board = design.getInitBoard();
  board.clear();

  test("White player", () => {
    expect( board.player ).toBe(1); // White move
  });

  const whitePawn = design.createPiece(0, 1);
  board.setPiece(design.stringToPos("a2"), whitePawn);
  board.setPiece(design.stringToPos("b2"), whitePawn);
  board.setPiece(design.stringToPos("c2"), whitePawn);
  board.setPiece(design.stringToPos("d2"), whitePawn);
  board.setPiece(design.stringToPos("e2"), whitePawn);
  board.setPiece(design.stringToPos("f2"), whitePawn);
  board.setPiece(design.stringToPos("g2"), whitePawn);
  board.setPiece(design.stringToPos("h2"), whitePawn);
  const whiteKing = design.createPiece(5, 1);
  board.setPiece(design.stringToPos("e1"), whiteKing);
  const whiteRook = design.createPiece(1, 1);
  board.setPiece(design.stringToPos("a1"), whiteRook);
  board.setPiece(design.stringToPos("h1"), whiteRook);
  const blackPawn = design.createPiece(0, 2);
  board.setPiece(design.stringToPos("a7"), blackPawn);
  board.setPiece(design.stringToPos("b7"), blackPawn);
  board.setPiece(design.stringToPos("c7"), blackPawn);
  board.setPiece(design.stringToPos("d7"), blackPawn);
  board.setPiece(design.stringToPos("e7"), blackPawn);
  board.setPiece(design.stringToPos("f7"), blackPawn);
  board.setPiece(design.stringToPos("g7"), blackPawn);
  board.setPiece(design.stringToPos("h7"), blackPawn);
  const blackKing = design.createPiece(5, 2);
  board.setPiece(design.stringToPos("e8"), blackKing);
  const blackRook = design.createPiece(1, 2);
  board.setPiece(design.stringToPos("a8"), blackRook);
  board.setPiece(design.stringToPos("h8"), blackRook);

  test("Move generation for black", () => {
    board.generate();
    expect( board.moves.length ).toBe(25); // 25 moves:
    expect( board.moves[0].toString(design) ).toBe("a2-a3"); // a2-a3
    expect( board.moves[1].toString(design) ).toBe("a2-a4"); // a2-a4
    expect( board.moves[2].toString(design) ).toBe("b2-b3"); // b2-b3
    expect( board.moves[3].toString(design) ).toBe("b2-b4"); // b2-b4
    expect( board.moves[4].toString(design) ).toBe("c2-c3"); // c2-c3
    expect( board.moves[5].toString(design) ).toBe("c2-c4"); // c2-c4
    expect( board.moves[6].toString(design) ).toBe("d2-d3"); // d2-d3
    expect( board.moves[7].toString(design) ).toBe("d2-d4"); // d2-d4
    expect( board.moves[8].toString(design) ).toBe("e2-e3"); // e2-e3
    expect( board.moves[9].toString(design) ).toBe("e2-e4"); // e2-e4
    expect( board.moves[10].toString(design) ).toBe("f2-f3"); // f2-f3
    expect( board.moves[11].toString(design) ).toBe("f2-f4"); // f2-f4
    expect( board.moves[12].toString(design) ).toBe("g2-g3"); // g2-g3
    expect( board.moves[13].toString(design) ).toBe("g2-g4"); // g2-g4
    expect( board.moves[14].toString(design) ).toBe("h2-h3"); // h2-h3
    expect( board.moves[15].toString(design) ).toBe("h2-h4"); // h2-h4
    expect( board.moves[16].toString(design) ).toBe("a1-b1"); // a1-b1
    expect( board.moves[17].toString(design) ).toBe("a1-c1"); // a1-c1
    expect( board.moves[18].toString(design) ).toBe("a1-d1"); // a1-d1
    expect( board.moves[19].toString(design) ).toBe("e1-d1"); // e1-d1
    expect( board.moves[20].toString(design) ).toBe("e1-f1"); // e1-f1
    expect( board.moves[21].toString(design) ).toBe("e1-g1 h1-f1"); // e1-g1 h1-f1
    expect( board.moves[22].toString(design) ).toBe("e1-c1 a1-d1"); // e1-c1 a1-d1
    expect( board.moves[23].toString(design) ).toBe("h1-g1"); // h1-g1
    expect( board.moves[24].toString(design) ).toBe("h1-f1"); // h1-f1
  });
  
  test("Black makes a move", () => {
    board = board.apply(board.moves[21]);
    expect( board.player ).toBe(2); //Black move
    expect( board.getPiece(design.stringToPos("e1")) ).toBeNull(); // e1 is empty
    expect( board.getPiece(design.stringToPos("h1")) ).toBeNull(); // h1 is empty
    expect( board.getPiece(design.stringToPos("g1")).toString(design) ).toBe("White King"); // White King on g1
    expect( board.getPiece(design.stringToPos("f1")).toString(design) ).toBe("White Rook"); // White Rook on f1
  });

  test("Move generation for white", () => {
    board.generate();
    expect( board.moves.length ).toBe(25); // 25 moves:
    expect( board.moves[0].toString(design) ).toBe("a8-b8"); // a8-b8
    expect( board.moves[1].toString(design) ).toBe("a8-c8"); // a8-c8
    expect( board.moves[2].toString(design) ).toBe("a8-d8"); // a8-d8
    expect( board.moves[3].toString(design) ).toBe("e8-d8"); // e8-d8
    expect( board.moves[4].toString(design) ).toBe("e8-f8"); // e8-f8
    expect( board.moves[5].toString(design) ).toBe("e8-g8 h8-f8"); // e8-g8 h8-f8
    expect( board.moves[6].toString(design) ).toBe("e8-c8 a8-d8"); // e8-c8 a8-d8
    expect( board.moves[7].toString(design) ).toBe("h8-g8"); // h8-g8
    expect( board.moves[8].toString(design) ).toBe("h8-f8"); // h8-f8
    expect( board.moves[9].toString(design) ).toBe("a7-a6"); // a7-a6
    expect( board.moves[10].toString(design) ).toBe("a7-a5"); // a7-a5
    expect( board.moves[11].toString(design) ).toBe("b7-b6"); // b7-b6
    expect( board.moves[12].toString(design) ).toBe("b7-b5"); // b7-b5
    expect( board.moves[13].toString(design) ).toBe("c7-c6"); // c7-c6
    expect( board.moves[14].toString(design) ).toBe("c7-c5"); // c7-c5
    expect( board.moves[15].toString(design) ).toBe("d7-d6"); // d7-d6
    expect( board.moves[16].toString(design) ).toBe("d7-d5"); // d7-d5
    expect( board.moves[17].toString(design) ).toBe("e7-e6"); // e7-e6
    expect( board.moves[18].toString(design) ).toBe("e7-e5"); // e7-e5
    expect( board.moves[19].toString(design) ).toBe("f7-f6"); // f7-f6
    expect( board.moves[20].toString(design) ).toBe("f7-f5"); // f7-f5
    expect( board.moves[21].toString(design) ).toBe("g7-g6"); // g7-g6
    expect( board.moves[22].toString(design) ).toBe("g7-g5"); // g7-g5
    expect( board.moves[23].toString(design) ).toBe("h7-h6"); // h7-h6
    expect( board.moves[24].toString(design) ).toBe("h7-h5"); // h7-h5
  });

  test("White makes a move", () => {
    board = board.apply(board.moves[6]);
    expect( board.player ).toBe(1); //White move
    expect( board.getPiece(design.stringToPos("e8")) ).toBeNull(); // e8 is empty
    expect( board.getPiece(design.stringToPos("a8")) ).toBeNull(); // a8 is empty
    expect( board.getPiece(design.stringToPos("c8")).toString(design) ).toBe("Black King"); // Black King on c8
    expect( board.getPiece(design.stringToPos("d8")).toString(design) ).toBe("Black Rook"); // Black Rook on d8
  });
});

describe( "Stalemate", () => {
  const design = games.model.getDesign();
  let board = design.getInitBoard();
  board.clear();

  test("White player", () => {
    expect( board.player ).toBe(1);
  });

  const whiteKing = design.createPiece(5, 1);
  board.setPiece(design.stringToPos("e1"), whiteKing);
  const whiteQueen = design.createPiece(4, 1);
  board.setPiece(design.stringToPos("d1"), whiteQueen);
  const blackKing = design.createPiece(5, 2);
  board.setPiece(design.stringToPos("b8"), blackKing);

  test("No goal", () => {
    expect( games.model.getGoal(board, board.player) ).toBeNull(); // No goal
  });

  test("Move generation for black", () => {
    board.generate();
    expect( board.moves.length ).toBe(21); // 21 moves:
    expect( board.moves[0].toString(design) ).toBe("d1-d2"); // d1-d2
    expect( board.moves[1].toString(design) ).toBe("d1-d3"); // d1-d3
    expect( board.moves[2].toString(design) ).toBe("d1-d4"); // d1-d4
    expect( board.moves[3].toString(design) ).toBe("d1-d5"); // d1-d5
    expect( board.moves[4].toString(design) ).toBe("d1-d6"); // d1-d6
    expect( board.moves[5].toString(design) ).toBe("d1-d7"); // d1-d7
    expect( board.moves[6].toString(design) ).toBe("d1-d8"); // d1-d8
    expect( board.moves[7].toString(design) ).toBe("d1-c1"); // d1-c1
    expect( board.moves[8].toString(design) ).toBe("d1-b1"); // d1-b1
    expect( board.moves[9].toString(design) ).toBe("d1-a1"); // d1-a1
    expect( board.moves[10].toString(design) ).toBe("d1-c2"); // d1-c2
    expect( board.moves[11].toString(design) ).toBe("d1-b3"); // d1-b3
    expect( board.moves[12].toString(design) ).toBe("d1-a4"); // d1-a4
    expect( board.moves[13].toString(design) ).toBe("d1-e2"); // d1-e2
    expect( board.moves[14].toString(design) ).toBe("d1-f3"); // d1-f3
    expect( board.moves[15].toString(design) ).toBe("d1-g4"); // d1-g4
    expect( board.moves[16].toString(design) ).toBe("d1-h5"); // d1-h5
    expect( board.moves[17].toString(design) ).toBe("e1-e2"); // e1-e2
    expect( board.moves[18].toString(design) ).toBe("e1-f1"); // e1-f1
    expect( board.moves[19].toString(design) ).toBe("e1-d2"); // e1-d2
    expect( board.moves[20].toString(design) ).toBe("e1-f2"); // e1-f2
  });

  test("Black makes a move", () => {
    board = board.apply(board.moves[11]);
    expect( board.player, 2, "Black move");
  });

  test("No goal", () => {
    expect( games.model.getGoal(board, board.player) ).toBeNull(); // No goal
  });

  test("Move gerenation for white", () => {
    board.generate();
    expect( board.moves.length ).toBe(4); // 4 moves:
    expect( board.moves[0].toString(design) ).toBe("b8-a8"); // b8-a8
    expect( board.moves[1].toString(design) ).toBe("b8-c8"); // b8-c8
    expect( board.moves[2].toString(design) ).toBe("b8-a7"); // b8-a7
    expect( board.moves[3].toString(design) ).toBe("b8-c7"); // b8-c7
  });

  test("White makes a move", () => {
    board = board.apply(board.moves[0]);
    expect( board.player ).toBe(1);
    expect( games.model.getGoal(board, board.player) ).toBeNull(); // No goal
  });

  test("Move gerenation for black", () => {
    board.generate();
    expect( board.moves.length ).toBe(28); // 28 moves:
    expect( board.moves[0].toString(design) ).toBe("b3-b4"); // b3-b4
    expect( board.moves[1].toString(design) ).toBe("b3-b5"); // b3-b5
    expect( board.moves[2].toString(design) ).toBe("b3-b6"); // b3-b6
    expect( board.moves[3].toString(design) ).toBe("b3-b7"); // b3-b7
    expect( board.moves[4].toString(design) ).toBe("b3-b8"); // b3-b8
    expect( board.moves[5].toString(design) ).toBe("b3-b2"); // b3-b2
    expect( board.moves[6].toString(design) ).toBe("b3-b1"); // b3-b1
    expect( board.moves[7].toString(design) ).toBe("b3-a3"); // b3-a3
    expect( board.moves[8].toString(design) ).toBe("b3-c3"); // b3-c3
    expect( board.moves[9].toString(design) ).toBe("b3-d3"); // b3-d3
    expect( board.moves[10].toString(design) ).toBe("b3-e3"); // b3-e3
    expect( board.moves[11].toString(design) ).toBe("b3-f3"); // b3-f3
    expect( board.moves[12].toString(design) ).toBe("b3-g3"); // b3-g3
    expect( board.moves[13].toString(design) ).toBe("b3-h3"); // b3-h3
    expect( board.moves[14].toString(design) ).toBe("b3-a4"); // b3-a4
    expect( board.moves[15].toString(design) ).toBe("b3-a2"); // b3-a2
    expect( board.moves[16].toString(design) ).toBe("b3-c4"); // b3-c4
    expect( board.moves[17].toString(design) ).toBe("b3-d5"); // b3-d5
    expect( board.moves[18].toString(design) ).toBe("b3-e6"); // b3-e6
    expect( board.moves[19].toString(design) ).toBe("b3-f7"); // b3-f7
    expect( board.moves[20].toString(design) ).toBe("b3-g8"); // b3-g8
    expect( board.moves[21].toString(design) ).toBe("b3-c2"); // b3-c2
    expect( board.moves[22].toString(design) ).toBe("b3-d1"); // b3-d1
    expect( board.moves[23].toString(design) ).toBe("e1-e2"); // e1-e2
    expect( board.moves[24].toString(design) ).toBe("e1-d1"); // e1-d1
    expect( board.moves[25].toString(design) ).toBe("e1-f1"); // e1-f1
    expect( board.moves[26].toString(design) ).toBe("e1-d2"); // e1-d2
    expect( board.moves[27].toString(design) ).toBe("e1-f2"); // e1-f2
  });

  test("Black makes a move", () => {
    board = board.apply(board.moves[2]);
    expect( board.player ).toBe(2);
  });

  test("Draw", () => {
    expect( games.model.getGoal(board, 1) ).toBe(0); // Draw
    board.generate();
    expect( board.moves.length ).toBe(0); // 0 moves:
  });
});

describe( "Checkmate", () => {
  const design = games.model.getDesign();
  let board = design.getInitBoard();
  board.clear();

  test("White player", () => {
    expect( board.player ).toBe(1);
  });

  const whiteKing = design.createPiece(5, 1);
  board.setPiece(design.stringToPos("e1"), whiteKing);
  const whiteRook = design.createPiece(1, 1);
  board.setPiece(design.stringToPos("a1"), whiteRook);
  board.setPiece(design.stringToPos("h1"), whiteRook);
  const blackKing = design.createPiece(5, 2);
  board.setPiece(design.stringToPos("e8"), blackKing);

  test("No goal", () => {
    expect( games.model.getGoal(board, board.player) ).toBeNull(); // No goal
  });

  test("Move generation for black", () => {
    board.generate();
    expect( board.moves.length ).toBe(26); // 26 moves:
    expect( board.moves[0].toString(design) ).toBe("a1-a2"); // a1-a2
    expect( board.moves[1].toString(design) ).toBe("a1-a3"); // a1-a3
    expect( board.moves[2].toString(design) ).toBe("a1-a4"); // a1-a4
    expect( board.moves[3].toString(design) ).toBe("a1-a5"); // a1-a5
    expect( board.moves[4].toString(design) ).toBe("a1-a6"); // a1-a6
    expect( board.moves[5].toString(design) ).toBe("a1-a7"); // a1-a7
    expect( board.moves[6].toString(design) ).toBe("a1-a8"); // a1-a8
    expect( board.moves[7].toString(design) ).toBe("a1-b1"); // a1-b1
    expect( board.moves[8].toString(design) ).toBe("a1-c1"); // a1-c1
    expect( board.moves[9].toString(design) ).toBe("a1-d1"); // a1-d1
    expect( board.moves[10].toString(design) ).toBe("e1-e2"); // e1-e2
    expect( board.moves[11].toString(design) ).toBe("e1-d1"); // e1-d1
    expect( board.moves[12].toString(design) ).toBe("e1-f1"); // e1-f1
    expect( board.moves[13].toString(design) ).toBe("e1-d2"); // e1-d2
    expect( board.moves[14].toString(design) ).toBe("e1-f2"); // e1-f2
    expect( board.moves[15].toString(design) ).toBe("e1-g1 h1-f1"); // e1-g1 h1-f1
    expect( board.moves[16].toString(design) ).toBe("e1-c1 a1-d1"); // e1-c1 a1-d1
    expect( board.moves[17].toString(design) ).toBe("h1-h2"); // h1-h2
    expect( board.moves[18].toString(design) ).toBe("h1-h3"); // h1-h3
    expect( board.moves[19].toString(design) ).toBe("h1-h4"); // h1-h4
    expect( board.moves[20].toString(design) ).toBe("h1-h5"); // h1-h5
    expect( board.moves[21].toString(design) ).toBe("h1-h6"); // h1-h6
    expect( board.moves[22].toString(design) ).toBe("h1-h7"); // h1-h7
    expect( board.moves[23].toString(design) ).toBe("h1-h8"); // h1-h8
    expect( board.moves[24].toString(design) ).toBe("h1-g1"); // h1-g1
    expect( board.moves[25].toString(design) ).toBe("h1-f1"); // h1-f1
  });

  test("Black makes a move", () => {
    board = board.apply(board.moves[5]);
    expect( board.player ).toBe(2);
  });

  test("No goal", () => {
    expect( games.model.getGoal(board, board.player) ).toBeNull(); // No goal
  });

  test("Move generation for white", () => {
    board.generate();
    expect( board.moves.length ).toBe(2); // 2 moves:
    expect( board.moves[0].toString(design) ).toBe("e8-d8"); // e8-d8
    expect( board.moves[1].toString(design) ).toBe("e8-f8"); // e8-f8
  });

  test("White makes a move", () => {
    board = board.apply(board.moves[1]);
    expect( board.player ).toBe(1);
  });

  test("No goal", () => {
    expect( games.model.getGoal(board, board.player) ).toBeNull(); // No goal
  });

  test("Move generation for black", () => {
    board.generate();
    expect( board.moves.length ).toBe(29); // 29 moves:
    expect( board.moves[0].toString(design) ).toBe("a7-a8"); // a7-a8
    expect( board.moves[1].toString(design) ).toBe("a7-a6"); // a7-a6
    expect( board.moves[2].toString(design) ).toBe("a7-a5"); // a7-a5
    expect( board.moves[3].toString(design) ).toBe("a7-a4"); // a7-a4
    expect( board.moves[4].toString(design) ).toBe("a7-a3"); // a7-a3
    expect( board.moves[5].toString(design) ).toBe("a7-a2"); // a7-a2
    expect( board.moves[6].toString(design) ).toBe("a7-a1"); // a7-a1
    expect( board.moves[7].toString(design) ).toBe("a7-b7"); // a7-b7
    expect( board.moves[8].toString(design) ).toBe("a7-c7"); // a7-c7
    expect( board.moves[9].toString(design) ).toBe("a7-d7"); // a7-d7
    expect( board.moves[10].toString(design) ).toBe("a7-e7"); // a7-e7
    expect( board.moves[11].toString(design) ).toBe("a7-f7"); // a7-f7
    expect( board.moves[12].toString(design) ).toBe("a7-g7"); // a7-g7
    expect( board.moves[13].toString(design) ).toBe("a7-h7"); // a7-h7
    expect( board.moves[14].toString(design) ).toBe("e1-e2"); // e1-e2
    expect( board.moves[15].toString(design) ).toBe("e1-d1"); // e1-d1
    expect( board.moves[16].toString(design) ).toBe("e1-f1"); // e1-f1
    expect( board.moves[17].toString(design) ).toBe("e1-d2"); // e1-d2
    expect( board.moves[18].toString(design) ).toBe("e1-f2"); // e1-f2
    expect( board.moves[19].toString(design) ).toBe("e1-g1 h1-f1"); // e1-g1 h1-f1
    expect( board.moves[20].toString(design) ).toBe("h1-h2"); // h1-h2
    expect( board.moves[21].toString(design) ).toBe("h1-h3"); // h1-h3
    expect( board.moves[22].toString(design) ).toBe("h1-h4"); // h1-h4
    expect( board.moves[23].toString(design) ).toBe("h1-h5"); // h1-h5
    expect( board.moves[24].toString(design) ).toBe("h1-h6"); // h1-h6
    expect( board.moves[25].toString(design) ).toBe("h1-h7"); // h1-h7
    expect( board.moves[26].toString(design) ).toBe("h1-h8"); // h1-h8
    expect( board.moves[27].toString(design) ).toBe("h1-g1"); // h1-g1
    expect( board.moves[28].toString(design) ).toBe("h1-f1"); // h1-f1
  });

  test("Black makes a move", () => {
    board = board.apply(board.moves[26]);
    expect( board.player ).toBe(2);
  });

  test("Game finished", () => {
    expect( games.model.getGoal(board, 1) ).toBe(1); // White won
    expect( games.model.getGoal(board, 2) ).toBe(-1); // Black lose
    board.generate();
    expect( board.moves.length ).toBe(0); // 0 moves:
  });
});
