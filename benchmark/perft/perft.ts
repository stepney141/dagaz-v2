import type { Plugin } from './../../src/types';
import { TBoard, TDesign } from "../../src/core";

type ExactPerftAnswers = number[];
type PositionHash = number;
type DepthToSearch = number;
type NodeCounts = number;

// This hash is sooooooo collidable and impractical...
// TODO: make it a better hashing system that the collisions hardly occur
type PerftHashTableKey = `Hash:${PositionHash}/Depth:${DepthToSearch}`;
type PerftHashResult = {
  hash: number,
  isFound: boolean
};

const hashTable = new Map<PerftHashTableKey, NodeCounts>();

const getHash = (depth: DepthToSearch, board: TBoard): PerftHashResult => {
  return {
    hash: hashTable.get(`Hash:${board.z}/Depth:${depth}`),
    isFound: hashTable.has(`Hash:${board.z}/Depth:${depth}`)
  };
};

/**
 * Search the game tree starting from the initial positiion, 
 * and counts all the leaf nodes of a certain depth
 * @link https://www.chessprogramming.org/Perft
 * @param depth - depth to search (>= 1)
 * @param b - initial board state
 * @returns the number of enumarated nodes
 */
const perft = function (depth: DepthToSearch, b: TBoard): NodeCounts {
  let nodes: NodeCounts = 0;

  const { hash, isFound } = getHash(depth, b);
  if (isFound) {
    return hash;
  }

  b.generateMoves();

  for (const m of b.legalMoves) {
    const next_b = b.makeMove(m); //make a move
    nodes += (depth > 1) ? perft(depth - 1, next_b) : 1;
  }

  hashTable.set(`Hash:${b.z}/Depth:${depth}`, nodes);

  return nodes;
};

/**
 * main process
 * @param depth - depth to search
 */
export const main = function (depth: DepthToSearch, PERFT_RESULTS: ExactPerftAnswers, buildDesign: (design: TDesign) => void, plugins?: Plugin[]) {
  const design = new TDesign();
  const board = design.getInitBoard(buildDesign, plugins);

  console.log(`Enumerate Nodes, depth = ${depth}`);

  console.time(`perft ${depth}`);

  const results = perft(depth, board);
  console.log('computed result: ', results);
  console.log('correct value: ', PERFT_RESULTS[depth]);

  console.timeEnd(`perft ${depth}`);
  console.log('----------');
};
