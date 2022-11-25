import { buildDesign } from "../../tests/international-checkers/international-checkers-dagaz";
import { promotion } from "../../tests/international-checkers/international-checkers-dagaz-promotion";
import { maximalCapture } from "../../tests/international-checkers/maximal-captures-dagaz";
import { main } from "./perft";

/**
 * @link https://aartbik.blogspot.com/2012/10/bikdam-international-checkers.html
 */
const PERFT_RESULTS = [1, 9, 81, 658, 4265, 27117, 167140, 1049442, 6483961, 41022423, 258895763, 1665861398];

for (let i = 1; i <= 8; i++) {
  main(i, PERFT_RESULTS, buildDesign, [promotion, maximalCapture]);
}

console.log("==========");
