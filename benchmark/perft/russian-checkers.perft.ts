import { buildDesign } from "../../tests/russian-checkers/russian-checkers-dagaz";
import { main } from "./perft";

/**
 * @link https://damforum.nl/bb3/viewtopic.php?t=2822#p80038
 */
const PERFT_RESULTS = [1, 7, 49, 302, 1469, 7482, 37986, 190146, 929899, 4570586, 22444032, 110917189];

for (let i = 1; i <= 8; i++) {
  main(i, PERFT_RESULTS, buildDesign);
}

console.log("==========");
