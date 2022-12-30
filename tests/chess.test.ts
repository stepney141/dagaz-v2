import { buildGameRule } from "../games/chess/chess-dagaz";
import { getGoal } from "../games/chess/chess-dagaz-invariant";
import { TGameRule } from "../src/game_rule";
import { moveToString } from "../src/move";
import { pieceToString } from "../src/piece";

test("Initial Board", function () {
  const gameRule = new TGameRule();
  buildGameRule(gameRule);

  const design = gameRule.buildGameDesign();
  const board = design.getInitBoard();

  expect(board.player).toEqual(1); // White turn

  board.generateMoves();

  expect(board.legalMoves.length).toEqual(20); // 20 moves
  expect(moveToString(board.legalMoves[0], design)).toEqual("a2-a3");
  expect(moveToString(board.legalMoves[1], design)).toEqual("a2-a4");
  expect(moveToString(board.legalMoves[2], design)).toEqual("b2-b3");
  expect(moveToString(board.legalMoves[3], design)).toEqual("b2-b4");
  expect(moveToString(board.legalMoves[4], design)).toEqual("c2-c3");
  expect(moveToString(board.legalMoves[5], design)).toEqual("c2-c4");
  expect(moveToString(board.legalMoves[6], design)).toEqual("d2-d3");
  expect(moveToString(board.legalMoves[7], design)).toEqual("d2-d4");
  expect(moveToString(board.legalMoves[8], design)).toEqual("e2-e3");
  expect(moveToString(board.legalMoves[9], design)).toEqual("e2-e4");
  expect(moveToString(board.legalMoves[10], design)).toEqual("f2-f3");
  expect(moveToString(board.legalMoves[11], design)).toEqual("f2-f4");
  expect(moveToString(board.legalMoves[12], design)).toEqual("g2-g3");
  expect(moveToString(board.legalMoves[13], design)).toEqual("g2-g4");
  expect(moveToString(board.legalMoves[14], design)).toEqual("h2-h3");
  expect(moveToString(board.legalMoves[15], design)).toEqual("h2-h4");
  expect(moveToString(board.legalMoves[16], design)).toEqual("b1-a3");
  expect(moveToString(board.legalMoves[17], design)).toEqual("b1-c3");
  expect(moveToString(board.legalMoves[18], design)).toEqual("g1-f3");
  expect(moveToString(board.legalMoves[19], design)).toEqual("g1-h3");
});

test("En Passant", function () {
  const gameRule = new TGameRule();
  buildGameRule(gameRule);

  const design = gameRule.buildGameDesign();
  let board = design.getInitBoard();

  board.clear();

  expect(board.player).toEqual(1); // White turn

  const white = design.createPiece(0, 1);
  board.setPiece(design.stringToLoc("c4"), white);
  board.setPiece(design.stringToLoc("e2"), white);
  board.setPiece(design.stringToLoc("g2"), white);
  const black = design.createPiece(0, 2);
  board.setPiece(design.stringToLoc("d4"), black);
  board.setPiece(design.stringToLoc("f4"), black);
  board.generateMoves();

  expect(board.legalMoves.length).toEqual(5); // 5 moves
  expect(moveToString(board.legalMoves[0], design)).toEqual("c4-c5");
  expect(moveToString(board.legalMoves[1], design)).toEqual("e2-e3");
  expect(moveToString(board.legalMoves[2], design)).toEqual("e2-e4");
  expect(moveToString(board.legalMoves[3], design)).toEqual("g2-g3");
  expect(moveToString(board.legalMoves[4], design)).toEqual("g2-g4");

  board = board.makeMove(board.legalMoves[2]);

  expect(design.locToString(board.lastFrom)).toEqual("e2"); // Last from location: e2
  expect(board.player).toEqual(2); // Black turn

  board.generateMoves();

  expect(board.legalMoves.length).toEqual(4); // 4 moves
  expect(moveToString(board.legalMoves[0], design)).toEqual("d4-d3");
  expect(moveToString(board.legalMoves[1], design)).toEqual("d4-e3");
  expect(moveToString(board.legalMoves[2], design)).toEqual("f4-f3");
  expect(moveToString(board.legalMoves[3], design)).toEqual("f4-e3");

  board = board.makeMove(board.legalMoves[1]);

  expect(board.player).toEqual(1); // White turn
  expect(board.getPiece(design.stringToLoc("d4")) === null).toBeTruthy(); // d4 is empty
  expect(board.getPiece(design.stringToLoc("e4")) === null).toBeTruthy(); // e4 is empty
  expect(board.getPiece(design.stringToLoc("e2")) === null).toBeTruthy(); // e2 is empty
  expect(pieceToString(board.getPiece(design.stringToLoc("e3")), design)).toEqual("Black Pawn"); // Black Pawn is on e3

  board.generateMoves();

  expect(board.legalMoves.length).toEqual(3); // 3 moves
  expect(moveToString(board.legalMoves[0], design)).toEqual("c4-c5");
  expect(moveToString(board.legalMoves[1], design)).toEqual("g2-g3");
  expect(moveToString(board.legalMoves[2], design)).toEqual("g2-g4");

  board = board.makeMove(board.legalMoves[1]);

  expect(board.player).toEqual(2); // Black turn

  board.generateMoves();

  expect(board.legalMoves.length).toEqual(3); // 3 moves
  expect(moveToString(board.legalMoves[0], design)).toEqual("f4-f3");
  expect(moveToString(board.legalMoves[1], design)).toEqual("f4-g3");
  expect(moveToString(board.legalMoves[2], design)).toEqual("e3-e2");

  board = board.makeMove(board.legalMoves[1]);

  expect(board.player).toEqual(1); // White turn
  expect(board.getPiece(design.stringToLoc("f4")) === null).toBeTruthy(); // f4 is empty
  expect(pieceToString(board.getPiece(design.stringToLoc("g3")), design)).toEqual("Black Pawn"); // Black Pawn is on g3

  board.generateMoves();

  expect(board.legalMoves.length).toEqual(1); // 1 move
  expect(moveToString(board.legalMoves[0], design)).toEqual("c4-c5");
});

test("Castling", function () {
  const gameRule = new TGameRule();
  buildGameRule(gameRule);

  const design = gameRule.buildGameDesign();
  let board = design.getInitBoard();

  board.clear();

  expect(board.player).toEqual(1); // White turn

  const whitePawn = design.createPiece(0, 1);
  board.setPiece(design.stringToLoc("a2"), whitePawn);
  board.setPiece(design.stringToLoc("b2"), whitePawn);
  board.setPiece(design.stringToLoc("c2"), whitePawn);
  board.setPiece(design.stringToLoc("d2"), whitePawn);
  board.setPiece(design.stringToLoc("e2"), whitePawn);
  board.setPiece(design.stringToLoc("f2"), whitePawn);
  board.setPiece(design.stringToLoc("g2"), whitePawn);
  board.setPiece(design.stringToLoc("h2"), whitePawn);
  const whiteKing = design.createPiece(5, 1);
  board.setPiece(design.stringToLoc("e1"), whiteKing);
  const whiteRook = design.createPiece(1, 1);
  board.setPiece(design.stringToLoc("a1"), whiteRook);
  board.setPiece(design.stringToLoc("h1"), whiteRook);
  const blackPawn = design.createPiece(0, 2);
  board.setPiece(design.stringToLoc("a7"), blackPawn);
  board.setPiece(design.stringToLoc("b7"), blackPawn);
  board.setPiece(design.stringToLoc("c7"), blackPawn);
  board.setPiece(design.stringToLoc("d7"), blackPawn);
  board.setPiece(design.stringToLoc("e7"), blackPawn);
  board.setPiece(design.stringToLoc("f7"), blackPawn);
  board.setPiece(design.stringToLoc("g7"), blackPawn);
  board.setPiece(design.stringToLoc("h7"), blackPawn);
  const blackKing = design.createPiece(5, 2);
  board.setPiece(design.stringToLoc("e8"), blackKing);
  const blackRook = design.createPiece(1, 2);
  board.setPiece(design.stringToLoc("a8"), blackRook);
  board.setPiece(design.stringToLoc("h8"), blackRook);
  board.generateMoves();

  expect(board.legalMoves.length).toEqual(25); // 25 moves
  expect(moveToString(board.legalMoves[0], design)).toEqual("a2-a3");
  expect(moveToString(board.legalMoves[1], design)).toEqual("a2-a4");
  expect(moveToString(board.legalMoves[2], design)).toEqual("b2-b3");
  expect(moveToString(board.legalMoves[3], design)).toEqual("b2-b4");
  expect(moveToString(board.legalMoves[4], design)).toEqual("c2-c3");
  expect(moveToString(board.legalMoves[5], design)).toEqual("c2-c4");
  expect(moveToString(board.legalMoves[6], design)).toEqual("d2-d3");
  expect(moveToString(board.legalMoves[7], design)).toEqual("d2-d4");
  expect(moveToString(board.legalMoves[8], design)).toEqual("e2-e3");
  expect(moveToString(board.legalMoves[9], design)).toEqual("e2-e4");
  expect(moveToString(board.legalMoves[10], design)).toEqual("f2-f3");
  expect(moveToString(board.legalMoves[11], design)).toEqual("f2-f4");
  expect(moveToString(board.legalMoves[12], design)).toEqual("g2-g3");
  expect(moveToString(board.legalMoves[13], design)).toEqual("g2-g4");
  expect(moveToString(board.legalMoves[14], design)).toEqual("h2-h3");
  expect(moveToString(board.legalMoves[15], design)).toEqual("h2-h4");
  expect(moveToString(board.legalMoves[16], design)).toEqual("a1-b1");
  expect(moveToString(board.legalMoves[17], design)).toEqual("a1-c1");
  expect(moveToString(board.legalMoves[18], design)).toEqual("a1-d1");
  expect(moveToString(board.legalMoves[19], design)).toEqual("e1-d1");
  expect(moveToString(board.legalMoves[20], design)).toEqual("e1-f1");
  expect(moveToString(board.legalMoves[21], design)).toEqual("e1-g1 h1-f1");
  expect(moveToString(board.legalMoves[22], design)).toEqual("e1-c1 a1-d1");
  expect(moveToString(board.legalMoves[23], design)).toEqual("h1-g1");
  expect(moveToString(board.legalMoves[24], design)).toEqual("h1-f1");

  board = board.makeMove(board.legalMoves[21]);

  expect(board.player).toEqual(2); // Black turn
  expect(board.getPiece(design.stringToLoc("e1")) === null).toBeTruthy(); // e1 is empty
  expect(board.getPiece(design.stringToLoc("h1")) === null).toBeTruthy(); // h1 is empty
  expect(pieceToString(board.getPiece(design.stringToLoc("g1")), design)).toEqual("White King"); // White King is on g1
  expect(pieceToString(board.getPiece(design.stringToLoc("f1")), design)).toEqual("White Rook"); // White Rook is on f1

  board.generateMoves();

  expect(board.legalMoves.length).toEqual(25); // 25 moves
  expect(moveToString(board.legalMoves[0], design)).toEqual("a8-b8");
  expect(moveToString(board.legalMoves[1], design)).toEqual("a8-c8");
  expect(moveToString(board.legalMoves[2], design)).toEqual("a8-d8");
  expect(moveToString(board.legalMoves[3], design)).toEqual("e8-d8");
  expect(moveToString(board.legalMoves[4], design)).toEqual("e8-f8");
  expect(moveToString(board.legalMoves[5], design)).toEqual("e8-g8 h8-f8");
  expect(moveToString(board.legalMoves[6], design)).toEqual("e8-c8 a8-d8");
  expect(moveToString(board.legalMoves[7], design)).toEqual("h8-g8");
  expect(moveToString(board.legalMoves[8], design)).toEqual("h8-f8");
  expect(moveToString(board.legalMoves[9], design)).toEqual("a7-a6");
  expect(moveToString(board.legalMoves[10], design)).toEqual("a7-a5");
  expect(moveToString(board.legalMoves[11], design)).toEqual("b7-b6");
  expect(moveToString(board.legalMoves[12], design)).toEqual("b7-b5");
  expect(moveToString(board.legalMoves[13], design)).toEqual("c7-c6");
  expect(moveToString(board.legalMoves[14], design)).toEqual("c7-c5");
  expect(moveToString(board.legalMoves[15], design)).toEqual("d7-d6");
  expect(moveToString(board.legalMoves[16], design)).toEqual("d7-d5");
  expect(moveToString(board.legalMoves[17], design)).toEqual("e7-e6");
  expect(moveToString(board.legalMoves[18], design)).toEqual("e7-e5");
  expect(moveToString(board.legalMoves[19], design)).toEqual("f7-f6");
  expect(moveToString(board.legalMoves[20], design)).toEqual("f7-f5");
  expect(moveToString(board.legalMoves[21], design)).toEqual("g7-g6");
  expect(moveToString(board.legalMoves[22], design)).toEqual("g7-g5");
  expect(moveToString(board.legalMoves[23], design)).toEqual("h7-h6");
  expect(moveToString(board.legalMoves[24], design)).toEqual("h7-h5");

  board = board.makeMove(board.legalMoves[6]);

  expect(board.player).toEqual(1); // White turn
  expect(board.getPiece(design.stringToLoc("e8")) === null).toBeTruthy(); // e8 is empty
  expect(board.getPiece(design.stringToLoc("a8")) === null).toBeTruthy(); // a8 is empty
  expect(pieceToString(board.getPiece(design.stringToLoc("c8")), design)).toEqual("Black King"); // Black King is on c8
  expect(pieceToString(board.getPiece(design.stringToLoc("d8")), design)).toEqual("Black Rook"); // Black Rook is on d8
});

test("Stalemate", function () {
  const gameRule = new TGameRule();
  buildGameRule(gameRule);

  const design = gameRule.buildGameDesign();
  let board = design.getInitBoard();

  board.clear();

  expect(board.player).toEqual(1); // White turn

  const whiteKing = design.createPiece(5, 1);
  board.setPiece(design.stringToLoc("e1"), whiteKing);
  const whiteQueen = design.createPiece(4, 1);
  board.setPiece(design.stringToLoc("d1"), whiteQueen);
  const blackKing = design.createPiece(5, 2);
  board.setPiece(design.stringToLoc("b8"), blackKing);

  expect(getGoal.func(board, board.player) === null).toBeTruthy(); // No goal

  board.generateMoves();

  expect(board.legalMoves.length).toEqual(21); // 21 moves
  expect(moveToString(board.legalMoves[0], design)).toEqual("d1-d2");
  expect(moveToString(board.legalMoves[1], design)).toEqual("d1-d3");
  expect(moveToString(board.legalMoves[2], design)).toEqual("d1-d4");
  expect(moveToString(board.legalMoves[3], design)).toEqual("d1-d5");
  expect(moveToString(board.legalMoves[4], design)).toEqual("d1-d6");
  expect(moveToString(board.legalMoves[5], design)).toEqual("d1-d7");
  expect(moveToString(board.legalMoves[6], design)).toEqual("d1-d8");
  expect(moveToString(board.legalMoves[7], design)).toEqual("d1-c1");
  expect(moveToString(board.legalMoves[8], design)).toEqual("d1-b1");
  expect(moveToString(board.legalMoves[9], design)).toEqual("d1-a1");
  expect(moveToString(board.legalMoves[10], design)).toEqual("d1-c2");
  expect(moveToString(board.legalMoves[11], design)).toEqual("d1-b3");
  expect(moveToString(board.legalMoves[12], design)).toEqual("d1-a4");
  expect(moveToString(board.legalMoves[13], design)).toEqual("d1-e2");
  expect(moveToString(board.legalMoves[14], design)).toEqual("d1-f3");
  expect(moveToString(board.legalMoves[15], design)).toEqual("d1-g4");
  expect(moveToString(board.legalMoves[16], design)).toEqual("d1-h5");
  expect(moveToString(board.legalMoves[17], design)).toEqual("e1-e2");
  expect(moveToString(board.legalMoves[18], design)).toEqual("e1-f1");
  expect(moveToString(board.legalMoves[19], design)).toEqual("e1-d2");
  expect(moveToString(board.legalMoves[20], design)).toEqual("e1-f2");

  board = board.makeMove(board.legalMoves[11]);

  expect(board.player).toEqual(2); // Black turn
  expect(getGoal.func(board, board.player) === null).toBeTruthy(); // No goal

  board.generateMoves();

  expect(board.legalMoves.length).toEqual(4); // 4 moves
  expect(moveToString(board.legalMoves[0], design)).toEqual("b8-a8");
  expect(moveToString(board.legalMoves[1], design)).toEqual("b8-c8");
  expect(moveToString(board.legalMoves[2], design)).toEqual("b8-a7");
  expect(moveToString(board.legalMoves[3], design)).toEqual("b8-c7");

  board = board.makeMove(board.legalMoves[0]);

  expect(board.player).toEqual(1); // White turn
  expect(getGoal.func(board, board.player) === null).toBeTruthy(); // No goal

  board.generateMoves();

  expect(board.legalMoves.length).toEqual(28); // 28 moves
  expect(moveToString(board.legalMoves[0], design)).toEqual("b3-b4");
  expect(moveToString(board.legalMoves[1], design)).toEqual("b3-b5");
  expect(moveToString(board.legalMoves[2], design)).toEqual("b3-b6");
  expect(moveToString(board.legalMoves[3], design)).toEqual("b3-b7");
  expect(moveToString(board.legalMoves[4], design)).toEqual("b3-b8");
  expect(moveToString(board.legalMoves[5], design)).toEqual("b3-b2");
  expect(moveToString(board.legalMoves[6], design)).toEqual("b3-b1");
  expect(moveToString(board.legalMoves[7], design)).toEqual("b3-a3");
  expect(moveToString(board.legalMoves[8], design)).toEqual("b3-c3");
  expect(moveToString(board.legalMoves[9], design)).toEqual("b3-d3");
  expect(moveToString(board.legalMoves[10], design)).toEqual("b3-e3");
  expect(moveToString(board.legalMoves[11], design)).toEqual("b3-f3");
  expect(moveToString(board.legalMoves[12], design)).toEqual("b3-g3");
  expect(moveToString(board.legalMoves[13], design)).toEqual("b3-h3");
  expect(moveToString(board.legalMoves[14], design)).toEqual("b3-a4");
  expect(moveToString(board.legalMoves[15], design)).toEqual("b3-a2");
  expect(moveToString(board.legalMoves[16], design)).toEqual("b3-c4");
  expect(moveToString(board.legalMoves[17], design)).toEqual("b3-d5");
  expect(moveToString(board.legalMoves[18], design)).toEqual("b3-e6");
  expect(moveToString(board.legalMoves[19], design)).toEqual("b3-f7");
  expect(moveToString(board.legalMoves[20], design)).toEqual("b3-g8");
  expect(moveToString(board.legalMoves[21], design)).toEqual("b3-c2");
  expect(moveToString(board.legalMoves[22], design)).toEqual("b3-d1");
  expect(moveToString(board.legalMoves[23], design)).toEqual("e1-e2");
  expect(moveToString(board.legalMoves[24], design)).toEqual("e1-d1");
  expect(moveToString(board.legalMoves[25], design)).toEqual("e1-f1");
  expect(moveToString(board.legalMoves[26], design)).toEqual("e1-d2");
  expect(moveToString(board.legalMoves[27], design)).toEqual("e1-f2");

  board = board.makeMove(board.legalMoves[2]);

  expect(board.player).toEqual(2); // Black turn
  expect(getGoal.func(board, 1)).toEqual(0); // Draw

  board.generateMoves();

  expect(board.legalMoves.length).toEqual(0); // No move
});

test("Checkmate", function () {
  const gameRule = new TGameRule();
  buildGameRule(gameRule);

  const design = gameRule.buildGameDesign();
  let board = design.getInitBoard();

  board.clear();

  expect(board.player).toEqual(1); // White turn

  const whiteKing = design.createPiece(5, 1);
  board.setPiece(design.stringToLoc("e1"), whiteKing);
  const whiteRook = design.createPiece(1, 1);
  board.setPiece(design.stringToLoc("a1"), whiteRook);
  board.setPiece(design.stringToLoc("h1"), whiteRook);
  const blackKing = design.createPiece(5, 2);
  board.setPiece(design.stringToLoc("e8"), blackKing);

  expect(getGoal.func(board, board.player) === null).toBeTruthy(); // No goal

  board.generateMoves();

  expect(board.legalMoves.length).toEqual(26); // 26 moves
  expect(moveToString(board.legalMoves[0], design)).toEqual("a1-a2");
  expect(moveToString(board.legalMoves[1], design)).toEqual("a1-a3");
  expect(moveToString(board.legalMoves[2], design)).toEqual("a1-a4");
  expect(moveToString(board.legalMoves[3], design)).toEqual("a1-a5");
  expect(moveToString(board.legalMoves[4], design)).toEqual("a1-a6");
  expect(moveToString(board.legalMoves[5], design)).toEqual("a1-a7");
  expect(moveToString(board.legalMoves[6], design)).toEqual("a1-a8");
  expect(moveToString(board.legalMoves[7], design)).toEqual("a1-b1");
  expect(moveToString(board.legalMoves[8], design)).toEqual("a1-c1");
  expect(moveToString(board.legalMoves[9], design)).toEqual("a1-d1");
  expect(moveToString(board.legalMoves[10], design)).toEqual("e1-e2");
  expect(moveToString(board.legalMoves[11], design)).toEqual("e1-d1");
  expect(moveToString(board.legalMoves[12], design)).toEqual("e1-f1");
  expect(moveToString(board.legalMoves[13], design)).toEqual("e1-d2");
  expect(moveToString(board.legalMoves[14], design)).toEqual("e1-f2");
  expect(moveToString(board.legalMoves[15], design)).toEqual("e1-g1 h1-f1");
  expect(moveToString(board.legalMoves[16], design)).toEqual("e1-c1 a1-d1");
  expect(moveToString(board.legalMoves[17], design)).toEqual("h1-h2");
  expect(moveToString(board.legalMoves[18], design)).toEqual("h1-h3");
  expect(moveToString(board.legalMoves[19], design)).toEqual("h1-h4");
  expect(moveToString(board.legalMoves[20], design)).toEqual("h1-h5");
  expect(moveToString(board.legalMoves[21], design)).toEqual("h1-h6");
  expect(moveToString(board.legalMoves[22], design)).toEqual("h1-h7");
  expect(moveToString(board.legalMoves[23], design)).toEqual("h1-h8");
  expect(moveToString(board.legalMoves[24], design)).toEqual("h1-g1");
  expect(moveToString(board.legalMoves[25], design)).toEqual("h1-f1");

  board = board.makeMove(board.legalMoves[5]);

  expect(board.player).toEqual(2); // Black turn
  expect(getGoal.func(board, board.player) === null).toBeTruthy(); // No goal

  board.generateMoves();

  expect(board.legalMoves.length).toEqual(2); // 2 moves
  expect(moveToString(board.legalMoves[0], design)).toEqual("e8-d8");
  expect(moveToString(board.legalMoves[1], design)).toEqual("e8-f8");

  board = board.makeMove(board.legalMoves[1]);

  expect(board.player).toEqual(1); // White turn
  expect(getGoal.func(board, board.player) === null).toBeTruthy(); // No goal

  board.generateMoves();

  expect(board.legalMoves.length).toEqual(29); // 29 moves
  expect(moveToString(board.legalMoves[0], design)).toEqual("a7-a8");
  expect(moveToString(board.legalMoves[1], design)).toEqual("a7-a6");
  expect(moveToString(board.legalMoves[2], design)).toEqual("a7-a5");
  expect(moveToString(board.legalMoves[3], design)).toEqual("a7-a4");
  expect(moveToString(board.legalMoves[4], design)).toEqual("a7-a3");
  expect(moveToString(board.legalMoves[5], design)).toEqual("a7-a2");
  expect(moveToString(board.legalMoves[6], design)).toEqual("a7-a1");
  expect(moveToString(board.legalMoves[7], design)).toEqual("a7-b7");
  expect(moveToString(board.legalMoves[8], design)).toEqual("a7-c7");
  expect(moveToString(board.legalMoves[9], design)).toEqual("a7-d7");
  expect(moveToString(board.legalMoves[10], design)).toEqual("a7-e7");
  expect(moveToString(board.legalMoves[11], design)).toEqual("a7-f7");
  expect(moveToString(board.legalMoves[12], design)).toEqual("a7-g7");
  expect(moveToString(board.legalMoves[13], design)).toEqual("a7-h7");
  expect(moveToString(board.legalMoves[14], design)).toEqual("e1-e2");
  expect(moveToString(board.legalMoves[15], design)).toEqual("e1-d1");
  expect(moveToString(board.legalMoves[16], design)).toEqual("e1-f1");
  expect(moveToString(board.legalMoves[17], design)).toEqual("e1-d2");
  expect(moveToString(board.legalMoves[18], design)).toEqual("e1-f2");
  expect(moveToString(board.legalMoves[19], design)).toEqual("e1-g1 h1-f1");
  expect(moveToString(board.legalMoves[20], design)).toEqual("h1-h2");
  expect(moveToString(board.legalMoves[21], design)).toEqual("h1-h3");
  expect(moveToString(board.legalMoves[22], design)).toEqual("h1-h4");
  expect(moveToString(board.legalMoves[23], design)).toEqual("h1-h5");
  expect(moveToString(board.legalMoves[24], design)).toEqual("h1-h6");
  expect(moveToString(board.legalMoves[25], design)).toEqual("h1-h7");
  expect(moveToString(board.legalMoves[26], design)).toEqual("h1-h8");
  expect(moveToString(board.legalMoves[27], design)).toEqual("h1-g1");
  expect(moveToString(board.legalMoves[28], design)).toEqual("h1-f1");

  board = board.makeMove(board.legalMoves[26]);

  expect(board.player).toEqual(2); // Black turn
  expect(getGoal.func(board, 1)).toEqual(1); // White wins
  expect(getGoal.func(board, 2)).toEqual(-1); // Black loses

  board.generateMoves();

  expect(board.legalMoves.length).toEqual(0); // No move
});
