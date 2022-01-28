#! /usr/bin/env node
// almost the same as the sample code :-p
// https://github.com/ameshkov/node-qunit-puppeteer

import glob from 'glob';
import path from 'path';
import { runQunitPuppeteer, printOutput, printResultSummary, printFailedTests } from 'node-qunit-puppeteer';

const [hostname, port] = ['localhost', 5501];
const engine_type = process.argv[2]; // engine type ('v2', 'zrf-based-kernel', 'new-model-kernel')
const version = process.argv[3]; //version type ('old', 'refactored', etc.)

const dirname = path.dirname(new URL(import.meta.url).pathname); // get the root path of the repository

const testFilesArray = (engine_type === "v2") ?  // get a list of QUnit HTML files
  glob.sync(`${dirname}/tests/**/*.htm`): // preparing dagaz v2 tests
  glob.sync(`${dirname}/old_engines/${engine_type}/${version}/tests/**/**/*.htm`); // preparing dagaz v1 tests (new-model-kernel, zrf-based-kernel)

const qunitArgsArray = testFilesArray.map(path => {
  return {
    targetUrl: `${path.replace(dirname, `http://${hostname}:${port}`)}`
  }; 
});

(async () => {
  for (const qunitArgs of qunitArgsArray) { // run the tests
    await runQunitPuppeteer(qunitArgs)
      .then((result) => {
        console.group(qunitArgs.targetUrl);

        printResultSummary(result, console);
        if (result.stats.failed > 0) {
          printFailedTests(result, console);
          // other action(s) on failed tests
        }

        console.groupEnd();
        console.log('\n');
      })
      .catch((ex) => {
        console.error(ex);
      });
  }
})();
