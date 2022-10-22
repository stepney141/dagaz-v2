import { games } from "../../src/dagaz-model";
import type { TBoard } from "../../src/core";
import "../../tests/english-checkers/english-checkers-dagaz";

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
const main = function (depth: number, design = games.model.getDesign()) {
    const board = design.getInitBoard();

    console.log(`Enumerate Nodes, depth = ${depth}`);

    console.time(`perft ${depth}`);

    const results = perft(depth, board);
    console.log('result: ', results);

    console.timeEnd(`perft ${depth}`);
};

for (let i = 1; i <= 13; i++) {
    main(i);
}

console.log("==========");
