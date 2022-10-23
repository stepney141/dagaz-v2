import { TBoard, TDesign } from "../../src/core";
import { buildDesign } from "../../tests/chess/chess-dagaz";
import { getGoal, extension } from "../../tests/chess/chess-dagaz-invariant";

/**
 * Search the game tree starting from the initial positiion, 
 * and counts all the leaf nodes of a certain depth
 * @link https://www.chessprogramming.org/Perft
 * @param {number} depth - depth to search (>= 1)
 * @param {TBoard} b - initial board state
 * @returns {number} 
 */
const perft = function (depth: number, b: TBoard): number {
    let nodes = 0;

    b.generate();

    for (const m of b.legalMoves) {
        // console.log(m.toString(board.design));
        const next_b = b.apply(m); //make a move
        nodes += (depth > 1) ? perft(depth - 1, next_b) : 1;
    }

    return nodes;
};

/**
 * main process
 * @param {number} depth - depth to search
 */
const main = function (depth: number) {
    const design = new TDesign();
    const board = design.getInitBoard(buildDesign, [getGoal, extension]);

    console.log(`Enumerate Nodes, depth = ${depth}`);

    console.time(`perft ${depth}`);

    const results = perft(depth, board);
    console.log('result: ', results);

    console.timeEnd(`perft ${depth}`);
};

for (let i = 1; i <= 5; i++) {
    main(i);
}

console.log("==========");

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
