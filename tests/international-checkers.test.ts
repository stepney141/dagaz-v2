import { buildGameRule } from "../games/international-checkers/international-checkers-dagaz";
import { TGameRule } from "../src/game_rule";
import { moveToString } from "../src/move";
import { pieceToString } from "../src/piece";

test("Man promotion", function () {
  const gameRule = new TGameRule();
  buildGameRule(gameRule);

  const design = gameRule.buildGameDesign();
  let board = design.getInitBoard().copy();

  expect(board.player).toEqual(1); // White turn

  board.clear();
  const white = design.createPiece(0, 1);
  board.setPiece(design.stringToLoc("b8"), white);
  const black = design.createPiece(0, 2);
  board.setPiece(design.stringToLoc("b2"), black);
  board.setPiece(design.stringToLoc("b4"), black);
  board.setPiece(design.stringToLoc("c7"), black);
  board.setPiece(design.stringToLoc("c9"), black);
  board.setPiece(design.stringToLoc("d6"), black);
  board.setPiece(design.stringToLoc("e3"), black);
  board.setPiece(design.stringToLoc("e9"), black);
  board.setPiece(design.stringToLoc("f2"), black);
  board.setPiece(design.stringToLoc("g3"), black);
  board.setPiece(design.stringToLoc("g5"), black);
  board.setPiece(design.stringToLoc("g7"), black);
  board.setPiece(design.stringToLoc("g9"), black);
  board.setPiece(design.stringToLoc("i7"), black);
  board.setPiece(design.stringToLoc("i9"), black);
  board.generateMoves();

  expect(board.legalMoves.length).toEqual(2); // 2 moves
  expect(moveToString(board.legalMoves[0], design)).toEqual("b8-d10-f8-h10-j8-h6-f4-h2");
  expect(moveToString(board.legalMoves[1], design)).toEqual("b8-d10-f8-h10-j8-h6-f4-d2");

  board = board.makeMove(board.legalMoves[0]);

  expect(board.player).toEqual(2); // Black turn
  expect(board.getPiece(design.stringToLoc("b8")) === null).toBeTruthy(); // b8 is empty
  expect(board.getPiece(design.stringToLoc("c9")) === null).toBeTruthy(); // c9 is empty
  expect(board.getPiece(design.stringToLoc("e9")) === null).toBeTruthy(); // e9 is empty
  expect(board.getPiece(design.stringToLoc("g9")) === null).toBeTruthy(); // g9 is empty
  expect(board.getPiece(design.stringToLoc("i9")) === null).toBeTruthy(); // i9 is empty
  expect(board.getPiece(design.stringToLoc("i7")) === null).toBeTruthy(); // i7 is empty
  expect(board.getPiece(design.stringToLoc("g5")) === null).toBeTruthy(); // g5 is empty
  expect(board.getPiece(design.stringToLoc("g3")) === null).toBeTruthy(); // g3 is empty
  expect(pieceToString(board.getPiece(design.stringToLoc("b2")), design)).toEqual("Black Man"); // Black Man on b2
  expect(pieceToString(board.getPiece(design.stringToLoc("b4")), design)).toEqual("Black Man"); // Black Man on b4
  expect(pieceToString(board.getPiece(design.stringToLoc("c7")), design)).toEqual("Black Man"); // Black Man on c7
  expect(pieceToString(board.getPiece(design.stringToLoc("d6")), design)).toEqual("Black Man"); // Black Man on d6
  expect(pieceToString(board.getPiece(design.stringToLoc("e3")), design)).toEqual("Black Man"); // Black Man on e3
  expect(pieceToString(board.getPiece(design.stringToLoc("f2")), design)).toEqual("Black Man"); // Black Man on f2
  expect(pieceToString(board.getPiece(design.stringToLoc("g7")), design)).toEqual("Black Man"); // Black Man on g7
  expect(pieceToString(board.getPiece(design.stringToLoc("h2")), design)).toEqual("White Man"); // White Man on h2

  board.generateMoves();

  expect(board.legalMoves.length).toEqual(12); // 12 moves
  expect(moveToString(board.legalMoves[0], design)).toEqual("c7-b6");
  expect(moveToString(board.legalMoves[1], design)).toEqual("g7-f6");
  expect(moveToString(board.legalMoves[2], design)).toEqual("g7-h6");
  expect(moveToString(board.legalMoves[3], design)).toEqual("d6-c5");
  expect(moveToString(board.legalMoves[4], design)).toEqual("d6-e5");
  expect(moveToString(board.legalMoves[5], design)).toEqual("b4-a3");
  expect(moveToString(board.legalMoves[6], design)).toEqual("b4-c3");
  expect(moveToString(board.legalMoves[7], design)).toEqual("e3-d2");
  expect(moveToString(board.legalMoves[8], design)).toEqual("b2-a1");
  expect(moveToString(board.legalMoves[9], design)).toEqual("b2-c1");
  expect(moveToString(board.legalMoves[10], design)).toEqual("f2-e1");
  expect(moveToString(board.legalMoves[11], design)).toEqual("f2-g1");

  board = board.makeMove(board.legalMoves[8]);

  expect(board.player).toEqual(1); // White turn
  expect(board.getPiece(design.stringToLoc("b2")) === null).toBeTruthy(); // b2 is empty
  expect(pieceToString(board.getPiece(design.stringToLoc("a1")), design)).toEqual("Black King"); // Black king is on a1
});

test("Check lastFrom", function () {
  const gameRule = new TGameRule();
  buildGameRule(gameRule);

  const design = gameRule.buildGameDesign();
  let board = design.getInitBoard().copy();

  expect(board.player).toEqual(1); // White turn

  board.clear();
  const white = design.createPiece(1, 1);
  board.setPiece(design.stringToLoc("d4"), white);
  board.setPiece(design.stringToLoc("e5"), white);
  const black = design.createPiece(1, 2);
  board.setPiece(design.stringToLoc("j10"), black);
  board.generateMoves();

  expect(board.legalMoves.length).toEqual(21); // 21 moves
  expect(moveToString(board.legalMoves[0], design)).toEqual("e5-d6");
  expect(moveToString(board.legalMoves[1], design)).toEqual("e5-c7");
  expect(moveToString(board.legalMoves[2], design)).toEqual("e5-b8");
  expect(moveToString(board.legalMoves[3], design)).toEqual("e5-a9");
  expect(moveToString(board.legalMoves[4], design)).toEqual("e5-f4");
  expect(moveToString(board.legalMoves[5], design)).toEqual("e5-g3");
  expect(moveToString(board.legalMoves[6], design)).toEqual("e5-h2");
  expect(moveToString(board.legalMoves[7], design)).toEqual("e5-i1");
  expect(moveToString(board.legalMoves[8], design)).toEqual("e5-f6");
  expect(moveToString(board.legalMoves[9], design)).toEqual("e5-g7");
  expect(moveToString(board.legalMoves[10], design)).toEqual("e5-h8");
  expect(moveToString(board.legalMoves[11], design)).toEqual("e5-i9");
  expect(moveToString(board.legalMoves[12], design)).toEqual("d4-c5");
  expect(moveToString(board.legalMoves[13], design)).toEqual("d4-b6");
  expect(moveToString(board.legalMoves[14], design)).toEqual("d4-a7");
  expect(moveToString(board.legalMoves[15], design)).toEqual("d4-e3");
  expect(moveToString(board.legalMoves[16], design)).toEqual("d4-f2");
  expect(moveToString(board.legalMoves[17], design)).toEqual("d4-g1");
  expect(moveToString(board.legalMoves[18], design)).toEqual("d4-c3");
  expect(moveToString(board.legalMoves[19], design)).toEqual("d4-b2");
  expect(moveToString(board.legalMoves[20], design)).toEqual("d4-a1");

  board = board.makeMove(board.legalMoves[7]);

  expect(board.player).toEqual(2); // Black turn

  board.generateMoves();

  expect(board.legalMoves.length).toEqual(3); // 3 moves
  expect(moveToString(board.legalMoves[0], design)).toEqual("j10-c3");
  expect(moveToString(board.legalMoves[1], design)).toEqual("j10-b2");
  expect(moveToString(board.legalMoves[2], design)).toEqual("j10-a1");
});
