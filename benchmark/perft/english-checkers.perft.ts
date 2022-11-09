import { buildDesign } from "../../tests/english-checkers/english-checkers-dagaz";
import { main } from './perft';

/** 
 * @link https://damforum.nl/bb3/viewtopic.php?t=2822#p80038
 */
const PERFT_RESULTS = [
  1, 7, 49, 302, 1469, 7361, 36768, 179740, 845931, 3963680, 18391564, 85242128, 388617999
];
for (let i = 1; i <= 11; i++) {
  main(i, PERFT_RESULTS, buildDesign);
}

console.log("==========");
