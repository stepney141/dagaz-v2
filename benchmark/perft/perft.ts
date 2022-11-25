import type { Plugin } from "./../../src/types";
import { buildTranspositionTable, PositionHash } from "../../src/tt";
import type { TBoard } from "../../src/board";
import { TDesign } from "../../src/design";

type ExactPerftAnswers = number[];
type DepthToSearch = number;
type NodeCounts = number;

// This hash is sooooooo collidable and impractical...
// TODO: make it a better hashing system that the collisions hardly occur
// type PerftHashTableKey = `Hash:${string}/Depth:${DepthToSearch}`;
type PerftHashTableEntry = {
  nodes: NodeCounts;
  positionHash: string;
};
type PerftHashResult = {
  result: NodeCounts;
  isFound: boolean;
};

const hashTable = buildTranspositionTable<PerftHashTableEntry>();

const lookHashTable = (key: PositionHash): PerftHashResult => {
  return {
    result: hashTable.get(key)?.nodes,
    isFound: hashTable.has(key)
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

  const { result, isFound } = lookHashTable(b.z);
  if (isFound) {
    return result;
  }

  b.generateMoves();

  for (const m of b.legalMoves) {
    const next_b = b.makeMove(m); //make a move
    nodes += depth > 1 ? perft(depth - 1, next_b) : 1;
  }

  hashTable.set(b.z, { nodes, positionHash: b.z.toString() });

  return nodes;
};

/**
 * main process
 * @param depth - depth to search
 */
export const main = function (
  depth: DepthToSearch,
  PERFT_RESULTS: ExactPerftAnswers,
  buildDesign: (design: TDesign) => void,
  plugins?: Plugin[]
) {
  const design = new TDesign();
  const initialBoard = design.getInitBoard(buildDesign, plugins);

  console.log(`Enumerate Nodes, depth = ${depth}`);

  console.time(`perft ${depth}`);

  const results = perft(depth, initialBoard);
  console.log("computed result: ", results);
  console.log("correct value: ", PERFT_RESULTS[depth]);

  console.timeEnd(`perft ${depth}`);
  console.log("----------");
};
