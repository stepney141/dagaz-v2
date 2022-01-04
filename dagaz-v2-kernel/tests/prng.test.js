import { getRandomValue } from "../src/zobrist.js";
import * as fs from 'fs/promises';

const main = async (n) => {
  let list = [];

  for (let i = 1; i <= n; i++) {
    list.push(getRandomValue());
  }

  list.sort((a, b) => a - b); // sort as an integer

  console.log(list.length);

  console.log( "Is there a duplicated value in the array?", (new Set(list)).size != list.length);

  console.log( list.filter((val, i, array) => !(array.indexOf(val) === i)) ); // search duplicated values
  
  const data = JSON.stringify(list, null, "  ");

  try {
    await fs.writeFile(
      `./prng.test.txt`,
      data,
      (e) => {
        if (e) console.log("error: ", e);
      }
    );
  } catch (e) {
    console.log("error: ", e.message);
  }

};

main(100000);
