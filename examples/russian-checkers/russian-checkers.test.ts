import { games } from "../../src/dagaz-model";
import "./russian-checkers-dagaz";

test("King Moves", function () {
  const design = games.model.getDesign();
  let board = design.getInitBoard().copy();

  expect(board.player).toEqual(1); // White turn

  board.clear();
  const white = design.createPiece(1, 1);
  board.setPiece(design.stringToPos("h2"), white);
  board.generate();

  expect(board.moves.length).toEqual(7); // 7 moves
  expect(board.moves[0].toString(design)).toEqual("h2-g3");
  expect(board.moves[1].toString(design)).toEqual("h2-f4");
  expect(board.moves[2].toString(design)).toEqual("h2-e5");
  expect(board.moves[3].toString(design)).toEqual("h2-d6");
  expect(board.moves[4].toString(design)).toEqual("h2-c7");
  expect(board.moves[5].toString(design)).toEqual("h2-b8");
  expect(board.moves[6].toString(design)).toEqual("h2-g1");

  board = board.apply(board.moves[3]);

  expect(board.player).toEqual(2); // Black turn
  expect(board.getPiece(design.stringToPos("h2")) === null).toBeTruthy(); // h2 is empty
  expect(board.getPiece(design.stringToPos("f4")) === null).toBeTruthy(); // f4 is empty
  expect(board.getPiece(design.stringToPos("e5")) === null).toBeTruthy(); // e5 is empty
  expect(board.getPiece(design.stringToPos("d6")).toString(design)).toEqual("White King"); // White King is on d6
});

test("King Capturing", function () {
  const design = games.model.getDesign();
  let board = design.getInitBoard().copy();

  expect(board.player).toEqual(1); // White turn

  board.clear();
  const white = design.createPiece(1, 1);
  board.setPiece(design.stringToPos("h2"), white);
  const black = design.createPiece(0, 2);
  board.setPiece(design.stringToPos("f4"), black);
  board.generate();

  expect(board.moves.length).toEqual(4); // 4 moves
  expect(board.moves[0].toString(design)).toEqual("h2-e5");
  expect(board.moves[1].toString(design)).toEqual("h2-d6");
  expect(board.moves[2].toString(design)).toEqual("h2-c7");
  expect(board.moves[3].toString(design)).toEqual("h2-b8");

  board = board.apply(board.moves[2]);

  expect(board.player).toEqual(2);
  expect(board.getPiece(design.stringToPos("h2")) === null).toBeTruthy(); // h2 is empty
  expect(board.getPiece(design.stringToPos("g3")) === null).toBeTruthy(); // g3 is empty
  expect(board.getPiece(design.stringToPos("f4")) === null).toBeTruthy(); // f4 is empty
  expect(board.getPiece(design.stringToPos("e5")) === null).toBeTruthy(); // e5 is empty
  expect(board.getPiece(design.stringToPos("d6")) === null).toBeTruthy(); // d6 is empty
  expect(board.getPiece(design.stringToPos("c7")).toString(design)).toEqual("White King"); // White King is on c7
});

test("Man Capturing", function () {
  const design = games.model.getDesign();
  let board = design.getInitBoard().copy();

  expect(board.player).toEqual(1); // White turn

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

  expect(board.moves.length).toEqual(7); // 7 moves
  expect(board.moves[0].toString(design)).toEqual("h2-f4-d6-f8-h6-f4");
  expect(board.moves[1].toString(design)).toEqual("h2-f4-d6-f8-h6-e3");
  expect(board.moves[2].toString(design)).toEqual("h2-f4-d6-f8-h6-c1");
  expect(board.moves[3].toString(design)).toEqual("h2-f4-h6-f8-d6-a3");
  expect(board.moves[4].toString(design)).toEqual("h2-f4-h6-f8-d6-f4");
  expect(board.moves[5].toString(design)).toEqual("h2-f4-h6-f8-c5-a3");
  expect(board.moves[6].toString(design)).toEqual("h2-f4-d6-f8-h6-d2-a5");

  board = board.apply(board.moves[6]);

  expect(board.player).toEqual(2); // Black turn
  expect(board.getPiece(design.stringToPos("h2")) === null).toBeTruthy(); // h2 is empty
  expect(board.getPiece(design.stringToPos("g3")) === null).toBeTruthy(); // g3 is empty
  expect(board.getPiece(design.stringToPos("f4")) === null).toBeTruthy(); // f4 is empty
  expect(board.getPiece(design.stringToPos("e5")) === null).toBeTruthy(); // e5 is empty
  expect(board.getPiece(design.stringToPos("d6")) === null).toBeTruthy(); // d6 is empty
  expect(board.getPiece(design.stringToPos("e7")) === null).toBeTruthy(); // e7 is empty
  expect(board.getPiece(design.stringToPos("f8")) === null).toBeTruthy(); // f8 is empty
  expect(board.getPiece(design.stringToPos("g7")) === null).toBeTruthy(); // g7 is empty
  expect(board.getPiece(design.stringToPos("h6")) === null).toBeTruthy(); // h6 is empty
  expect(board.getPiece(design.stringToPos("g5")) === null).toBeTruthy(); // g5 is empty
  expect(board.getPiece(design.stringToPos("e3")) === null).toBeTruthy(); // e3 is empty
  expect(board.getPiece(design.stringToPos("d2")) === null).toBeTruthy(); // d2 is empty
  expect(board.getPiece(design.stringToPos("c3")) === null).toBeTruthy(); // c3 is empty
  expect(board.getPiece(design.stringToPos("b4")) === null).toBeTruthy(); // b4 is empty
  expect(board.getPiece(design.stringToPos("a5")).toString(design)).toEqual("White King"); // White king is on a5
  expect(board.getPiece(design.stringToPos("a7")).toString(design)).toEqual("Black Man"); // Black king is on a7
});
