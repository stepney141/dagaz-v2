import { buildTranspositionTable } from "../../src/tt";

import { TGameRule } from "./../../src/game_rule";

import type { TBoard } from "../../src/board";
import type { PositionHash } from "../../src/tt";
import type { Plugin } from "./../../src/types";

type ExactPerftAnswers = number[];
type DepthToSearch = number;
type NodeCounts = number;

// This hash is sooooooo collidable and impractical...
// TODO: make it a better hashing system that the collisions hardly occur
// type PerftHashTableKey = `Hash:${string}/Depth:${DepthToSearch}`;
type PerftHashTableEntry = {
  nodes: NodeCounts;
  depth: DepthToSearch;
};
type PerftHashResult =
  | {
      result: PerftHashTableEntry;
      isFound: true;
    }
  | {
      result: undefined;
      isFound: false;
    };

const perftTT = buildTranspositionTable<PerftHashTableEntry>();
function lookupPerftTT(key: PositionHash): PerftHashResult {
  return {
    result: perftTT.get(key),
    isFound: perftTT.has(key)
  } as PerftHashResult;
}

/**
 * Search the game tree starting from the initial positiion,
 * and counts all the leaf nodes of a certain depth
 * @link https://www.chessprogramming.org/Perft
 * @param depth - depth to search (>= 1)
 * @param b - initial board state
 * @returns the number of enumarated nodes
 */
const perft = function (depth: DepthToSearch, b: TBoard): NodeCounts {
  if (depth >= 1) {
    let nodes: NodeCounts = 0;

    const { result, isFound } = lookupPerftTT(b.hash);
    if (isFound) {
      return result.nodes;
    }

    b.generateMoves();
    for (const m of b.legalMoves) {
      const next_b = b.makeMove(m); //make a move
      nodes += perft(depth - 1, next_b);
    }

    perftTT.set(b.hash, { nodes, depth });

    return nodes;
  }

  return 1;
};

/**
 * main process
 * @param depth - depth to search
 */
export const main = function (
  depth: DepthToSearch,
  PERFT_RESULTS: ExactPerftAnswers,
  buildGameRule: (gameRule: TGameRule) => void,
  plugins?: Plugin[]
) {
  const gameRule = new TGameRule();
  buildGameRule(gameRule);

  const design = gameRule.buildGameDesign();
  const initialBoard = design.getInitBoard(plugins);

  console.log(`Enumerate Nodes, depth = ${depth}`);

  console.time(`perft ${depth}`);

  const results = perft(depth, initialBoard);
  console.log("computed result: ", results);
  console.log("correct value: ", PERFT_RESULTS[depth]);

  console.timeEnd(`perft ${depth}`);
  console.log("----------");
};
