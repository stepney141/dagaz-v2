import { games } from "../../src/dagaz-model.js";
import "./chess-dagaz.js";
import "./chess-dagaz-invariant.js";

/**
 * Search the game tree starting from the initial positiion, 
 * and counts all the leaf nodes of a certain depth
 * @link https://www.chessprogramming.org/Perft
 * @param {TBoard} board - initial board state
 * @param {number} depth - depth to search
 * @returns {number} 
 */
const perft = function (board, depth) {
  let nodes = 0;
  let b = board;

  b.generate();

  for (let m of b.moves) {
    // console.log(m.toString(board.design));
    b = b.apply(m); //make a move
    nodes += (depth > 1) ? perft(b, depth - 1) : 1;
    b = b.parent; //undo a move
  }

  return nodes;
};

/**
 * main process
 * @param {number} depth - depth to search
 */
const main = function (depth) {
  games.model.resetDesign();
  const Design = games.model.getDesign();
  let Board = Design.getInitBoard();

  console.log(`Enumerate Nodes, depth = ${depth}`);

  console.time(`perft ${depth}`);

  const results = perft(Board, depth);
  console.log('result: ', results);

  console.timeEnd(`perft ${depth}`);

};

//for (let j = 1; j <= 4; j++){

for (let i = 1; i <= 4 ; i++) {
  main(i);
}

console.log("==========");

// }

/* 
output examples (when 1 <= depth <= 6)
===============

$ node perft.test.js
Enumerate Nodes, depth = 1
result:  20
perft 1: 25.931ms
Enumerate Nodes, depth = 2
result:  400
perft 2: 105.393ms
Enumerate Nodes, depth = 3
result:  8902
perft 3: 504.85ms
Enumerate Nodes, depth = 4
result:  197281
perft 4: 9.437s
Enumerate Nodes, depth = 5
result:  4865609
perft 5: 4:38.972 (m:ss.mmm) 
Enumerate Nodes, depth = 6
result:  119060470
perft 6: 1:43:10.049 (h:mm:ss.mmm)

*/
