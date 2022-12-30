import { buildGameRule } from "../../games/chess/chess-dagaz";
import { getGoal, extension } from "../../games/chess/chess-dagaz-invariant";

import { main } from "./perft";

/**
 * @link https://www.chessprogramming.org/Perft_Results
 */
const PERFT_RESULTS = [1, 20, 400, 8902, 197281, 4865609, 119060324, 3195901860];

for (let i = 1; i <= 6; i++) {
  main(i, PERFT_RESULTS, buildGameRule, [getGoal, extension]);
}

console.log("==========");

/* 
output examples (when 1 <= depth <= 6)

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
