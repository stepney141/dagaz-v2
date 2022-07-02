import { games } from "../../src/dagaz-model";
import "../../examples/international-checkers/international-checkers-dagaz";
import "../../examples/international-checkers/international-checkers-dagaz-promotion";
import "../../examples/international-checkers/maximal-captures-dagaz";

/**
 * Search the game tree starting from the initial positiion, 
 * and counts all the leaf nodes of a certain depth
 * @link https://www.chessprogramming.org/Perft
 * @param {number} depth - depth to search (>= 1)
 * @param {TBoard} b - initial board state
 * @returns {number} 
 */
const perft = function (depth, b) {
  let nodes = 0;

  b.generate();

  for (let m of b.moves) {
    // console.log(m.toString(board.design));
    let next_b = b.apply(m); //make a move
    nodes += (depth > 1) ? perft(depth - 1, next_b) : 1;
  }

  return nodes;
};

/**
 * main process
 * @param {number} depth - depth to search
 */
const main = function (depth, design = games.model.getDesign()) {
  const board = design.getInitBoard();

  console.log(`Enumerate Nodes, depth = ${depth}`);

  console.time(`perft ${depth}`);

  const results = perft(depth, board);
  console.log('result: ', results);

  console.timeEnd(`perft ${depth}`);
};

for (let i = 1; i <= 10; i++) {
  main(i);
}

console.log("==========");
