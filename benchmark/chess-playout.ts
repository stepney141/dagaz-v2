import { buildGameRule } from "../games/chess/chess-dagaz";
import { getGoal, extension } from "../games/chess/chess-dagaz-invariant";
import { pieceToString } from "../src/piece";

import { TGameRule } from "./../src/game_rule";

function playout(plyUpperLimit: number, enableLog = true): number {
  const gameRule = new TGameRule();
  buildGameRule(gameRule);
  const design = gameRule.buildGameDesign();
  let board = design.getInitBoard([extension, getGoal]);
  let count = 0;

  if (enableLog) console.time("playout");

  for (;;) {
    const result = getGoal.func(board, board.player);
    if (count > plyUpperLimit || result !== null) {
      break;
    }
    count++;

    board.generateMoves();
    const rand = Math.floor(Math.random() * board.legalMoves.length);
    const move = board.legalMoves[rand];

    // console.log(`ply: ${count}`);
    // console.log(`player: ${board.player}`);

    board = board.makeMove(move);
  }

  if (enableLog) {
    const finalPosition = board.pieces // make position human-readable
      .map((piece, locID) =>
        piece !== undefined
          ? {
              ...piece,
              player: design.playerNames[piece.player],
              type: pieceToString(piece, design),
              loc: design.locToString(locID)
            }
          : undefined
      )
      .filter((value) => value !== undefined);

    const gameGoalStatus = getGoal.func(board, board.player);
    const currentPlayer = design.playerNames[board.player];
    const gameResult =
      gameGoalStatus == 0 ? "Draw" : gameGoalStatus == 1 ? `${currentPlayer} Won` : `${currentPlayer} lose`;

    console.log(finalPosition);
    console.log("ply: ", count);
    console.log("result: ", gameResult);
  }

  if (enableLog) console.timeEnd("playout");

  return count;
}

function testPlayoutPlyFreq(MAX_TEST_COUNT: number) {
  const MAX_PLY = 100001;
  const gameResultLog = {
    "~100": 0,
    "101~200": 0,
    "201~300": 0,
    "301~400": 0,
    "401~500": 0,
    "501~600": 0,
    "601~700": 0,
    "701~800": 0,
    "801~900": 0,
    "901~1000": 0,
    "1001~5000": 0,
    "5001~": 0
  };

  console.time("test");
  for (let i = 1; i <= MAX_TEST_COUNT; i++) {
    const finishedPly = playout(MAX_PLY, true);
    if (finishedPly <= 100) {
      gameResultLog["~100"]++;
    } else if (101 <= finishedPly && finishedPly <= 200) {
      gameResultLog["101~200"]++;
    } else if (201 <= finishedPly && finishedPly <= 300) {
      gameResultLog["201~300"]++;
    } else if (301 <= finishedPly && finishedPly <= 400) {
      gameResultLog["301~400"]++;
    } else if (401 <= finishedPly && finishedPly <= 500) {
      gameResultLog["401~500"]++;
    } else if (501 <= finishedPly && finishedPly <= 600) {
      gameResultLog["501~600"]++;
    } else if (601 <= finishedPly && finishedPly <= 700) {
      gameResultLog["601~700"]++;
    } else if (701 <= finishedPly && finishedPly <= 800) {
      gameResultLog["701~800"]++;
    } else if (801 <= finishedPly && finishedPly <= 900) {
      gameResultLog["801~900"]++;
    } else if (901 <= finishedPly && finishedPly <= 1000) {
      gameResultLog["901~1000"]++;
    } else if (1001 <= finishedPly && finishedPly <= 5000) {
      gameResultLog["1001~5000"]++;
    } else if (5001 <= finishedPly) {
      gameResultLog["5001~"]++;
    }
  }
  console.timeEnd("test");

  console.log("Ply when game finished:", gameResultLog);
}

testPlayoutPlyFreq(1000);
// playout(100000);
