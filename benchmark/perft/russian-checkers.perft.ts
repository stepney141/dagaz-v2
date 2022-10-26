import { buildDesign } from "../../tests/russian-checkers/russian-checkers-dagaz";
import { TDesign } from "../../src/core";
import type { TBoard } from "../../src/core";

/** 
 * @link https://damforum.nl/bb3/viewtopic.php?t=2822#p80038
 */
const PERFT_RESULTS = [
    1, 7, 49, 302, 1469, 7482, 37986, 190146, 929899, 4570586, 22444032, 110917189
];

/**
 * Search the game tree starting from the initial positiion, 
 * and counts all the leaf nodes of a certain depth
 * @link https://www.chessprogramming.org/Perft
 * @param depth - depth to search (>= 1)
 * @param b - initial board state
 * @returns the number of enumarated nodes
 */
const perft = function (depth: number, b: TBoard) {
    let nodes = 0;

    b.generateMoves();

    for (const m of b.legalMoves) {
        // console.log(m.toString(board.design));
        const next_b = b.makeMove(m); //make a move
        nodes += (depth > 1) ? perft(depth - 1, next_b) : 1;
    }

    return nodes;
};

/**
 * main process
 * @param depth - depth to search
 */
const main = function (depth: number) {
    const design = new TDesign();
    const board = design.getInitBoard(buildDesign);

    console.log(`Enumerate Nodes, depth = ${depth}`);

    console.time(`perft ${depth}`);

    const results = perft(depth, board);
    console.log('computed result: ', results);
    console.log('correct value: ', PERFT_RESULTS[depth]);

    console.timeEnd(`perft ${depth}`);
};

// for (let i = 1; i <= 9; i++) {
//     main(i);
//     console.log("----------");
// }

main(9);

console.log("==========");
