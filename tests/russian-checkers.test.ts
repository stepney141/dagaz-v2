import { buildGameRule } from "../games/russian-checkers/russian-checkers-dagaz";
import { TGameRule } from "../src/design";
import { moveToString } from "../src/move";
import { pieceToString } from "../src/piece";

test("King Moves", function () {
  const gameRule = new TGameRule();
  buildGameRule(gameRule);

  const design = gameRule.buildGameDesign();
  let board = design.getInitBoard();

  expect(board.player).toEqual(1); // White turn

  board.clear();
  const white = design.createPiece(1, 1);
  board.setPiece(design.stringToLoc("h2"), white);
  board.generateMoves();

  expect(board.legalMoves.length).toEqual(7); // 7 moves
  expect(moveToString(board.legalMoves[0], design)).toEqual("h2-g3");
  expect(moveToString(board.legalMoves[1], design)).toEqual("h2-f4");
  expect(moveToString(board.legalMoves[2], design)).toEqual("h2-e5");
  expect(moveToString(board.legalMoves[3], design)).toEqual("h2-d6");
  expect(moveToString(board.legalMoves[4], design)).toEqual("h2-c7");
  expect(moveToString(board.legalMoves[5], design)).toEqual("h2-b8");
  expect(moveToString(board.legalMoves[6], design)).toEqual("h2-g1");

  board = board.makeMove(board.legalMoves[3]);

  expect(board.player).toEqual(2); // Black turn
  expect(board.getPiece(design.stringToLoc("h2")) === null).toBeTruthy(); // h2 is empty
  expect(board.getPiece(design.stringToLoc("f4")) === null).toBeTruthy(); // f4 is empty
  expect(board.getPiece(design.stringToLoc("e5")) === null).toBeTruthy(); // e5 is empty
  expect(pieceToString(board.getPiece(design.stringToLoc("d6")), design)).toEqual("White King"); // White King is on d6
});

test("King Capturing", function () {
  const gameRule = new TGameRule();
  buildGameRule(gameRule);

  const design = gameRule.buildGameDesign();
  let board = design.getInitBoard();

  expect(board.player).toEqual(1); // White turn

  board.clear();
  const white = design.createPiece(1, 1);
  board.setPiece(design.stringToLoc("h2"), white);
  const black = design.createPiece(0, 2);
  board.setPiece(design.stringToLoc("f4"), black);
  board.generateMoves();

  expect(board.legalMoves.length).toEqual(4); // 4 moves
  expect(moveToString(board.legalMoves[0], design)).toEqual("h2-e5");
  expect(moveToString(board.legalMoves[1], design)).toEqual("h2-d6");
  expect(moveToString(board.legalMoves[2], design)).toEqual("h2-c7");
  expect(moveToString(board.legalMoves[3], design)).toEqual("h2-b8");

  board = board.makeMove(board.legalMoves[2]);

  expect(board.player).toEqual(2);
  expect(board.getPiece(design.stringToLoc("h2")) === null).toBeTruthy(); // h2 is empty
  expect(board.getPiece(design.stringToLoc("g3")) === null).toBeTruthy(); // g3 is empty
  expect(board.getPiece(design.stringToLoc("f4")) === null).toBeTruthy(); // f4 is empty
  expect(board.getPiece(design.stringToLoc("e5")) === null).toBeTruthy(); // e5 is empty
  expect(board.getPiece(design.stringToLoc("d6")) === null).toBeTruthy(); // d6 is empty
  expect(pieceToString(board.getPiece(design.stringToLoc("c7")), design)).toEqual("White King"); // White King is on c7
});

test("Man Capturing", function () {
  const gameRule = new TGameRule();
  buildGameRule(gameRule);

  const design = gameRule.buildGameDesign();
  let board = design.getInitBoard();

  expect(board.player).toEqual(1); // White turn

  board.clear();
  const white = design.createPiece(0, 1);
  board.setPiece(design.stringToLoc("h2"), white);
  const black = design.createPiece(0, 2);
  board.setPiece(design.stringToLoc("a7"), black);
  board.setPiece(design.stringToLoc("b4"), black);
  board.setPiece(design.stringToLoc("e5"), black);
  board.setPiece(design.stringToLoc("e7"), black);
  board.setPiece(design.stringToLoc("g3"), black);
  board.setPiece(design.stringToLoc("g5"), black);
  board.setPiece(design.stringToLoc("g7"), black);
  board.generateMoves();

  expect(board.legalMoves.length).toEqual(7); // 7 moves
  expect(moveToString(board.legalMoves[0], design)).toEqual("h2-f4-d6-f8-h6-f4");
  expect(moveToString(board.legalMoves[1], design)).toEqual("h2-f4-d6-f8-h6-e3");
  expect(moveToString(board.legalMoves[2], design)).toEqual("h2-f4-d6-f8-h6-c1");
  expect(moveToString(board.legalMoves[3], design)).toEqual("h2-f4-h6-f8-d6-a3");
  expect(moveToString(board.legalMoves[4], design)).toEqual("h2-f4-h6-f8-d6-f4");
  expect(moveToString(board.legalMoves[5], design)).toEqual("h2-f4-h6-f8-c5-a3");
  expect(moveToString(board.legalMoves[6], design)).toEqual("h2-f4-d6-f8-h6-d2-a5");

  board = board.makeMove(board.legalMoves[6]);

  expect(board.player).toEqual(2); // Black turn
  expect(board.getPiece(design.stringToLoc("h2")) === null).toBeTruthy(); // h2 is empty
  expect(board.getPiece(design.stringToLoc("g3")) === null).toBeTruthy(); // g3 is empty
  expect(board.getPiece(design.stringToLoc("f4")) === null).toBeTruthy(); // f4 is empty
  expect(board.getPiece(design.stringToLoc("e5")) === null).toBeTruthy(); // e5 is empty
  expect(board.getPiece(design.stringToLoc("d6")) === null).toBeTruthy(); // d6 is empty
  expect(board.getPiece(design.stringToLoc("e7")) === null).toBeTruthy(); // e7 is empty
  expect(board.getPiece(design.stringToLoc("f8")) === null).toBeTruthy(); // f8 is empty
  expect(board.getPiece(design.stringToLoc("g7")) === null).toBeTruthy(); // g7 is empty
  expect(board.getPiece(design.stringToLoc("h6")) === null).toBeTruthy(); // h6 is empty
  expect(board.getPiece(design.stringToLoc("g5")) === null).toBeTruthy(); // g5 is empty
  expect(board.getPiece(design.stringToLoc("e3")) === null).toBeTruthy(); // e3 is empty
  expect(board.getPiece(design.stringToLoc("d2")) === null).toBeTruthy(); // d2 is empty
  expect(board.getPiece(design.stringToLoc("c3")) === null).toBeTruthy(); // c3 is empty
  expect(board.getPiece(design.stringToLoc("b4")) === null).toBeTruthy(); // b4 is empty
  expect(pieceToString(board.getPiece(design.stringToLoc("a5")), design)).toEqual("White King"); // White king is on a5
  expect(pieceToString(board.getPiece(design.stringToLoc("a7")), design)).toEqual("Black Man"); // Black king is on a7
});
