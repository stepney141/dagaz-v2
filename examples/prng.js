import { getRandomValue } from "../src/zobrist.js";
import * as fs from 'fs/promises';

// implementation with set/map
const main = async (n) => {
  let list = new Set();
  let duplicated = [];

  for (let i = 1; i <= n; i++) {
    let r = getRandomValue();
    if (!list.has(r)) {
      list.add(r);
    } else {
      duplicated.push(r);
    }
  }

  console.log( "total number generated:", n );

  console.log( "Is a duplicated value in the array?:", list.size != n);

  console.log( "duplicated counts:", n - list.size ); // show the number of duplicated values

  // await output(duplicated.sort((a, b) => a - b));

};

// implementation with array
const main_array = async (n) => {
  let list = [];

  for (let i = 1; i <= n; i++) {
    list.push(getRandomValue());
  }

  list.sort((a, b) => a - b); // sort as an integer (heavy task)

  console.log("total number generated:", n);

  console.log( "Is a duplicated value in the array?:", (new Set(list)).size != list.length ); // (less heavy than the sort)

  // console.log( list.filter((val, i, array) => !(array.indexOf(val) === i)) ); // search duplicated values (very heavy task)
  
  // await output(list);

};

const output = async (data) => {
  try {
    const json = JSON.stringify(data, null, "  ");

    await fs.writeFile(
      `./prng.test.txt`,
      json,
      (e) => {
        if (e) console.log("error: ", e);
      }
    );
  } catch (e) {
    console.log("error: ", e.message);
  }
};

((n) => {

  console.time("time_set/map");

  main(n);
  // the set/map size is limited to 2^24 in V8
  // ref: https://github.com/nodejs/node/issues/37320

  console.timeEnd("time_set/map");

  console.time("time_arr");

  main_array(n);

  console.timeEnd("time_arr");

})(2 ** 24);
