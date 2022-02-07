import { games } from "../../src/dagaz-model.js";
import "./chess-dagaz.js";
import "./chess-dagaz-invariant.js";

test("Initial Board", function() {
  const design = games.model.getDesign();
  const board = design.getInitBoard();

  expect(board.player).toEqual(1); // White turn
  
  board.generate();
  
  expect(board.moves.length).toEqual(20); // 20 moves
  expect(board.moves[0].toString(design)).toEqual("a2-a3");
  expect(board.moves[1].toString(design)).toEqual("a2-a4");
  expect(board.moves[2].toString(design)).toEqual("b2-b3");
  expect(board.moves[3].toString(design)).toEqual("b2-b4");
  expect(board.moves[4].toString(design)).toEqual("c2-c3");
  expect(board.moves[5].toString(design)).toEqual("c2-c4");
  expect(board.moves[6].toString(design)).toEqual("d2-d3");
  expect(board.moves[7].toString(design)).toEqual("d2-d4");
  expect(board.moves[8].toString(design)).toEqual("e2-e3");
  expect(board.moves[9].toString(design)).toEqual("e2-e4");
  expect(board.moves[10].toString(design)).toEqual("f2-f3");
  expect(board.moves[11].toString(design)).toEqual("f2-f4");
  expect(board.moves[12].toString(design)).toEqual("g2-g3");
  expect(board.moves[13].toString(design)).toEqual("g2-g4");
  expect(board.moves[14].toString(design)).toEqual("h2-h3");
  expect(board.moves[15].toString(design)).toEqual("h2-h4");
  expect(board.moves[16].toString(design)).toEqual("b1-a3");
  expect(board.moves[17].toString(design)).toEqual("b1-c3");
  expect(board.moves[18].toString(design)).toEqual("g1-f3");
  expect(board.moves[19].toString(design)).toEqual("g1-h3");
});

test( "En Passant", function() {
  const design = games.model.getDesign();
  let board = design.getInitBoard();
  board.clear();
  
  expect(board.player).toEqual(1); // White turn
  
  const white = design.createPiece(0, 1);
  board.setPiece(design.stringToPos("c4"), white);
  board.setPiece(design.stringToPos("e2"), white);
  board.setPiece(design.stringToPos("g2"), white);
  const black = design.createPiece(0, 2);
  board.setPiece(design.stringToPos("d4"), black);
  board.setPiece(design.stringToPos("f4"), black);
  board.generate();
  
  expect(board.moves.length).toEqual(5); // 5 moves
  expect(board.moves[0].toString(design)).toEqual("c4-c5");
  expect(board.moves[1].toString(design)).toEqual("e2-e3");
  expect(board.moves[2].toString(design)).toEqual("e2-e4");
  expect(board.moves[3].toString(design)).toEqual("g2-g3");
  expect(board.moves[4].toString(design)).toEqual("g2-g4");
  
  board = board.apply(board.moves[2]);
  
  expect(design.posToString(board.lastFrom)).toEqual("e2"); // Last from position: e2
  expect(board.player).toEqual(2); // Black turn
  
  board.generate();
  
  expect(board.moves.length).toEqual(4); // 4 moves
  expect(board.moves[0].toString(design)).toEqual("d4-d3");
  expect(board.moves[1].toString(design)).toEqual("d4-e3");
  expect(board.moves[2].toString(design)).toEqual("f4-f3");
  expect(board.moves[3].toString(design)).toEqual("f4-e3");
  
  board = board.apply(board.moves[1]);
  
  expect(board.player).toEqual(1); // White turn
  expect(board.getPiece(design.stringToPos("d4")) === null).toBeTruthy(); // d4 is empty
  expect(board.getPiece(design.stringToPos("e4")) === null).toBeTruthy(); // e4 is empty
  expect(board.getPiece(design.stringToPos("e2")) === null).toBeTruthy(); // e2 is empty
  expect(board.getPiece(design.stringToPos("e3")).toString(design)).toEqual("Black Pawn"); // Black Pawn is on e3
  
  board.generate();
  
  expect(board.moves.length).toEqual(3); // 3 moves
  expect(board.moves[0].toString(design)).toEqual("c4-c5");
  expect(board.moves[1].toString(design)).toEqual("g2-g3");
  expect(board.moves[2].toString(design)).toEqual("g2-g4");
  
  board = board.apply(board.moves[1]);
  
  expect(board.player).toEqual(2); // Black turn
  
  board.generate();
  
  expect(board.moves.length).toEqual(3); // 3 moves
  expect(board.moves[0].toString(design)).toEqual("f4-f3");
  expect(board.moves[1].toString(design)).toEqual("f4-g3");
  expect(board.moves[2].toString(design)).toEqual("e3-e2");
  
  board = board.apply(board.moves[1]);
  
  expect(board.player).toEqual(1); // White turn
  expect(board.getPiece(design.stringToPos("f4")) === null).toBeTruthy(); // f4 is empty
  expect(board.getPiece(design.stringToPos("g3")).toString(design)).toEqual("Black Pawn"); // Black Pawn is on g3
  
  board.generate();
  
  expect(board.moves.length).toEqual(1); // 1 move
  expect(board.moves[0].toString(design)).toEqual("c4-c5");
});

test( "Castling", function() {
  const design = games.model.getDesign();
  let board = design.getInitBoard();
  board.clear();
  
  expect(board.player).toEqual(1); // White turn
  
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
  board.generate();
  
  expect(board.moves.length).toEqual(25); // 25 moves
  expect(board.moves[0].toString(design)).toEqual("a2-a3");
  expect(board.moves[1].toString(design)).toEqual("a2-a4");
  expect(board.moves[2].toString(design)).toEqual("b2-b3");
  expect(board.moves[3].toString(design)).toEqual("b2-b4");
  expect(board.moves[4].toString(design)).toEqual("c2-c3");
  expect(board.moves[5].toString(design)).toEqual("c2-c4");
  expect(board.moves[6].toString(design)).toEqual("d2-d3");
  expect(board.moves[7].toString(design)).toEqual("d2-d4");
  expect(board.moves[8].toString(design)).toEqual("e2-e3");
  expect(board.moves[9].toString(design)).toEqual("e2-e4");
  expect(board.moves[10].toString(design)).toEqual("f2-f3");
  expect(board.moves[11].toString(design)).toEqual("f2-f4");
  expect(board.moves[12].toString(design)).toEqual("g2-g3");
  expect(board.moves[13].toString(design)).toEqual("g2-g4");
  expect(board.moves[14].toString(design)).toEqual("h2-h3");
  expect(board.moves[15].toString(design)).toEqual("h2-h4");
  expect(board.moves[16].toString(design)).toEqual("a1-b1");
  expect(board.moves[17].toString(design)).toEqual("a1-c1");
  expect(board.moves[18].toString(design)).toEqual("a1-d1");
  expect(board.moves[19].toString(design)).toEqual("e1-d1");
  expect(board.moves[20].toString(design)).toEqual("e1-f1");
  expect(board.moves[21].toString(design)).toEqual("e1-g1 h1-f1");
  expect(board.moves[22].toString(design)).toEqual("e1-c1 a1-d1");
  expect(board.moves[23].toString(design)).toEqual("h1-g1");
  expect(board.moves[24].toString(design)).toEqual("h1-f1");
  
  board = board.apply(board.moves[21]);
  
  expect(board.player).toEqual(2); // Black turn
  expect(board.getPiece(design.stringToPos("e1")) === null).toBeTruthy(); // e1 is empty
  expect(board.getPiece(design.stringToPos("h1")) === null).toBeTruthy(); // h1 is empty
  expect(board.getPiece(design.stringToPos("g1")).toString(design)).toEqual("White King"); // White King is on g1
  expect(board.getPiece(design.stringToPos("f1")).toString(design)).toEqual("White Rook"); // White Rook is on f1
  
  board.generate();
  
  expect(board.moves.length).toEqual(25); // 25 moves
  expect(board.moves[0].toString(design)).toEqual("a8-b8");
  expect(board.moves[1].toString(design)).toEqual("a8-c8");
  expect(board.moves[2].toString(design)).toEqual("a8-d8");
  expect(board.moves[3].toString(design)).toEqual("e8-d8");
  expect(board.moves[4].toString(design)).toEqual("e8-f8");
  expect(board.moves[5].toString(design)).toEqual("e8-g8 h8-f8");
  expect(board.moves[6].toString(design)).toEqual("e8-c8 a8-d8");
  expect(board.moves[7].toString(design)).toEqual("h8-g8");
  expect(board.moves[8].toString(design)).toEqual("h8-f8");
  expect(board.moves[9].toString(design)).toEqual("a7-a6");
  expect(board.moves[10].toString(design)).toEqual("a7-a5");
  expect(board.moves[11].toString(design)).toEqual("b7-b6");
  expect(board.moves[12].toString(design)).toEqual("b7-b5");
  expect(board.moves[13].toString(design)).toEqual("c7-c6");
  expect(board.moves[14].toString(design)).toEqual("c7-c5");
  expect(board.moves[15].toString(design)).toEqual("d7-d6");
  expect(board.moves[16].toString(design)).toEqual("d7-d5");
  expect(board.moves[17].toString(design)).toEqual("e7-e6");
  expect(board.moves[18].toString(design)).toEqual("e7-e5");
  expect(board.moves[19].toString(design)).toEqual("f7-f6");
  expect(board.moves[20].toString(design)).toEqual("f7-f5");
  expect(board.moves[21].toString(design)).toEqual("g7-g6");
  expect(board.moves[22].toString(design)).toEqual("g7-g5");
  expect(board.moves[23].toString(design)).toEqual("h7-h6");
  expect(board.moves[24].toString(design)).toEqual("h7-h5");
  
  board = board.apply(board.moves[6]);
  
  expect(board.player).toEqual(1); // White turn
  expect(board.getPiece(design.stringToPos("e8")) === null).toBeTruthy(); // e8 is empty
  expect(board.getPiece(design.stringToPos("a8")) === null).toBeTruthy(); // a8 is empty
  expect(board.getPiece(design.stringToPos("c8")).toString(design)).toEqual("Black King"); // Black King is on c8
  expect(board.getPiece(design.stringToPos("d8")).toString(design)).toEqual("Black Rook"); // Black Rook is on d8
});

test( "Stalemate", function() {
  const design = games.model.getDesign();
  let board = design.getInitBoard();
  board.clear();
  
  expect(board.player).toEqual(1); // White turn
  
  const whiteKing = design.createPiece(5, 1);
  board.setPiece(design.stringToPos("e1"), whiteKing);
  const whiteQueen = design.createPiece(4, 1);
  board.setPiece(design.stringToPos("d1"), whiteQueen);
  const blackKing = design.createPiece(5, 2);
  board.setPiece(design.stringToPos("b8"), blackKing);
  
  expect(games.model.getGoal(board, board.player) === null).toBeTruthy(); // No goal
  
  board.generate();
  
  expect(board.moves.length).toEqual(21); // 21 moves
  expect(board.moves[0].toString(design)).toEqual("d1-d2");
  expect(board.moves[1].toString(design)).toEqual("d1-d3");
  expect(board.moves[2].toString(design)).toEqual("d1-d4");
  expect(board.moves[3].toString(design)).toEqual("d1-d5");
  expect(board.moves[4].toString(design)).toEqual("d1-d6");
  expect(board.moves[5].toString(design)).toEqual("d1-d7");
  expect(board.moves[6].toString(design)).toEqual("d1-d8");
  expect(board.moves[7].toString(design)).toEqual("d1-c1");
  expect(board.moves[8].toString(design)).toEqual("d1-b1");
  expect(board.moves[9].toString(design)).toEqual("d1-a1");
  expect(board.moves[10].toString(design)).toEqual("d1-c2");
  expect(board.moves[11].toString(design)).toEqual("d1-b3");
  expect(board.moves[12].toString(design)).toEqual("d1-a4");
  expect(board.moves[13].toString(design)).toEqual("d1-e2");
  expect(board.moves[14].toString(design)).toEqual("d1-f3");
  expect(board.moves[15].toString(design)).toEqual("d1-g4");
  expect(board.moves[16].toString(design)).toEqual("d1-h5");
  expect(board.moves[17].toString(design)).toEqual("e1-e2");
  expect(board.moves[18].toString(design)).toEqual("e1-f1");
  expect(board.moves[19].toString(design)).toEqual("e1-d2");
  expect(board.moves[20].toString(design)).toEqual("e1-f2");
  
  board = board.apply(board.moves[11]);
  
  expect(board.player).toEqual(2); // Black turn
  expect(games.model.getGoal(board, board.player) === null).toBeTruthy(); // No goal
  
  board.generate();
  
  expect(board.moves.length).toEqual(4); // 4 moves
  expect(board.moves[0].toString(design)).toEqual("b8-a8");
  expect(board.moves[1].toString(design)).toEqual("b8-c8");
  expect(board.moves[2].toString(design)).toEqual("b8-a7");
  expect(board.moves[3].toString(design)).toEqual("b8-c7");
  
  board = board.apply(board.moves[0]);
  
  expect(board.player).toEqual(1); // White turn
  expect(games.model.getGoal(board, board.player) === null).toBeTruthy(); // No goal
  
  board.generate();
  
  expect(board.moves.length).toEqual(28); // 28 moves
  expect(board.moves[0].toString(design)).toEqual("b3-b4");
  expect(board.moves[1].toString(design)).toEqual("b3-b5");
  expect(board.moves[2].toString(design)).toEqual("b3-b6");
  expect(board.moves[3].toString(design)).toEqual("b3-b7");
  expect(board.moves[4].toString(design)).toEqual("b3-b8");
  expect(board.moves[5].toString(design)).toEqual("b3-b2");
  expect(board.moves[6].toString(design)).toEqual("b3-b1");
  expect(board.moves[7].toString(design)).toEqual("b3-a3");
  expect(board.moves[8].toString(design)).toEqual("b3-c3");
  expect(board.moves[9].toString(design)).toEqual("b3-d3");
  expect(board.moves[10].toString(design)).toEqual("b3-e3");
  expect(board.moves[11].toString(design)).toEqual("b3-f3");
  expect(board.moves[12].toString(design)).toEqual("b3-g3");
  expect(board.moves[13].toString(design)).toEqual("b3-h3");
  expect(board.moves[14].toString(design)).toEqual("b3-a4");
  expect(board.moves[15].toString(design)).toEqual("b3-a2");
  expect(board.moves[16].toString(design)).toEqual("b3-c4");
  expect(board.moves[17].toString(design)).toEqual("b3-d5");
  expect(board.moves[18].toString(design)).toEqual("b3-e6");
  expect(board.moves[19].toString(design)).toEqual("b3-f7");
  expect(board.moves[20].toString(design)).toEqual("b3-g8");
  expect(board.moves[21].toString(design)).toEqual("b3-c2");
  expect(board.moves[22].toString(design)).toEqual("b3-d1");
  expect(board.moves[23].toString(design)).toEqual("e1-e2");
  expect(board.moves[24].toString(design)).toEqual("e1-d1");
  expect(board.moves[25].toString(design)).toEqual("e1-f1");
  expect(board.moves[26].toString(design)).toEqual("e1-d2");
  expect(board.moves[27].toString(design)).toEqual("e1-f2");
  
  board = board.apply(board.moves[2]);
  
  expect(board.player).toEqual(2); // Black turn
  expect(games.model.getGoal(board, 1)).toEqual(0); // Draw
  
  board.generate();
  
  expect(board.moves.length).toEqual(0); // No move
});

test( "Checkmate", function() {
  const design = games.model.getDesign();
  let board = design.getInitBoard();
  board.clear();
  
  expect(board.player).toEqual(1); // White turn
  
  const whiteKing = design.createPiece(5, 1);
  board.setPiece(design.stringToPos("e1"), whiteKing);
  const whiteRook = design.createPiece(1, 1);
  board.setPiece(design.stringToPos("a1"), whiteRook);
  board.setPiece(design.stringToPos("h1"), whiteRook);
  const blackKing = design.createPiece(5, 2);
  board.setPiece(design.stringToPos("e8"), blackKing);
  
  expect(games.model.getGoal(board, board.player) === null).toBeTruthy(); // No goal
  
  board.generate();
  
  expect(board.moves.length).toEqual(26); // 26 moves
  expect(board.moves[0].toString(design)).toEqual("a1-a2");
  expect(board.moves[1].toString(design)).toEqual("a1-a3");
  expect(board.moves[2].toString(design)).toEqual("a1-a4");
  expect(board.moves[3].toString(design)).toEqual("a1-a5");
  expect(board.moves[4].toString(design)).toEqual("a1-a6");
  expect(board.moves[5].toString(design)).toEqual("a1-a7");
  expect(board.moves[6].toString(design)).toEqual("a1-a8");
  expect(board.moves[7].toString(design)).toEqual("a1-b1");
  expect(board.moves[8].toString(design)).toEqual("a1-c1");
  expect(board.moves[9].toString(design)).toEqual("a1-d1");
  expect(board.moves[10].toString(design)).toEqual("e1-e2");
  expect(board.moves[11].toString(design)).toEqual("e1-d1");
  expect(board.moves[12].toString(design)).toEqual("e1-f1");
  expect(board.moves[13].toString(design)).toEqual("e1-d2");
  expect(board.moves[14].toString(design)).toEqual("e1-f2");
  expect(board.moves[15].toString(design)).toEqual("e1-g1 h1-f1");
  expect(board.moves[16].toString(design)).toEqual("e1-c1 a1-d1");
  expect(board.moves[17].toString(design)).toEqual("h1-h2");
  expect(board.moves[18].toString(design)).toEqual("h1-h3");
  expect(board.moves[19].toString(design)).toEqual("h1-h4");
  expect(board.moves[20].toString(design)).toEqual("h1-h5");
  expect(board.moves[21].toString(design)).toEqual("h1-h6");
  expect(board.moves[22].toString(design)).toEqual("h1-h7");
  expect(board.moves[23].toString(design)).toEqual("h1-h8");
  expect(board.moves[24].toString(design)).toEqual("h1-g1");
  expect(board.moves[25].toString(design)).toEqual("h1-f1");
  
  board = board.apply(board.moves[5]);
  
  expect(board.player).toEqual(2); // Black turn
  expect(games.model.getGoal(board, board.player) === null).toBeTruthy(); // No goal
  
  board.generate();
  
  expect(board.moves.length).toEqual(2); // 2 moves
  expect(board.moves[0].toString(design)).toEqual("e8-d8");
  expect(board.moves[1].toString(design)).toEqual("e8-f8");
  
  board = board.apply(board.moves[1]);
  
  expect(board.player).toEqual(1); // White turn
  expect(games.model.getGoal(board, board.player) === null).toBeTruthy(); // No goal
  
  board.generate();
  
  expect(board.moves.length).toEqual(29); // 29 moves
  expect(board.moves[0].toString(design)).toEqual("a7-a8");
  expect(board.moves[1].toString(design)).toEqual("a7-a6");
  expect(board.moves[2].toString(design)).toEqual("a7-a5");
  expect(board.moves[3].toString(design)).toEqual("a7-a4");
  expect(board.moves[4].toString(design)).toEqual("a7-a3");
  expect(board.moves[5].toString(design)).toEqual("a7-a2");
  expect(board.moves[6].toString(design)).toEqual("a7-a1");
  expect(board.moves[7].toString(design)).toEqual("a7-b7");
  expect(board.moves[8].toString(design)).toEqual("a7-c7");
  expect(board.moves[9].toString(design)).toEqual("a7-d7");
  expect(board.moves[10].toString(design)).toEqual("a7-e7");
  expect(board.moves[11].toString(design)).toEqual("a7-f7");
  expect(board.moves[12].toString(design)).toEqual("a7-g7");
  expect(board.moves[13].toString(design)).toEqual("a7-h7");
  expect(board.moves[14].toString(design)).toEqual("e1-e2");
  expect(board.moves[15].toString(design)).toEqual("e1-d1");
  expect(board.moves[16].toString(design)).toEqual("e1-f1");
  expect(board.moves[17].toString(design)).toEqual("e1-d2");
  expect(board.moves[18].toString(design)).toEqual("e1-f2");
  expect(board.moves[19].toString(design)).toEqual("e1-g1 h1-f1");
  expect(board.moves[20].toString(design)).toEqual("h1-h2");
  expect(board.moves[21].toString(design)).toEqual("h1-h3");
  expect(board.moves[22].toString(design)).toEqual("h1-h4");
  expect(board.moves[23].toString(design)).toEqual("h1-h5");
  expect(board.moves[24].toString(design)).toEqual("h1-h6");
  expect(board.moves[25].toString(design)).toEqual("h1-h7");
  expect(board.moves[26].toString(design)).toEqual("h1-h8");
  expect(board.moves[27].toString(design)).toEqual("h1-g1");
  expect(board.moves[28].toString(design)).toEqual("h1-f1");
  
  board = board.apply(board.moves[26]);
  
  expect(board.player).toEqual(2); // Black turn
  expect(games.model.getGoal(board, 1)).toEqual(1); // White wins
  expect(games.model.getGoal(board, 2)).toEqual(-1); // Black loses
  
  board.generate();
  
  expect(board.moves.length).toEqual(0); // No move
});
