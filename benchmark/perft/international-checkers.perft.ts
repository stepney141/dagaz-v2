import { buildDesign } from "../../tests/international-checkers/international-checkers-dagaz";
import { promotion } from "../../tests/international-checkers/international-checkers-dagaz-promotion";
import { maximalCapture } from "../../tests/international-checkers/maximal-captures-dagaz";
import { TDesign } from "../../src/core";
import type { TBoard } from "../../src/core";

/** 
 * @link https://aartbik.blogspot.com/2012/10/bikdam-international-checkers.html
 */
const PERFT_RESULTS = [
    1, 9, 81, 658, 4265, 27117, 167140, 1049442, 6483961, 41022423, 258895763, 1665861398,
];

/**
 * Search the game tree starting from the initial positiion, 
 * and counts all the leaf nodes of a certain depth
 * @link https://www.chessprogramming.org/Perft
 * @param depth - depth to search (>= 1)
 * @param b - initial board state
 * @returns the number of enumarated nodes
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
 * @param depth - depth to search
 */
const main = function (depth: number) {
    const design = new TDesign();
    const board = design.getInitBoard(buildDesign, [maximalCapture, promotion]);

    console.log(`Enumerate Nodes, depth = ${depth}`);

    console.time(`perft ${depth}`);

    const results = perft(depth, board);
    console.log('computed result: ', results);
    console.log('correct value: ', PERFT_RESULTS[depth]);

    console.timeEnd(`perft ${depth}`);
};

for (let i = 1; i <= 10; i++) {
    main(i);
    console.log("----------");
}

console.log("==========");
