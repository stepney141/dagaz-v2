#! /usr/bin/env node
// almost the same as the sample code :-p
// https://github.com/ameshkov/node-qunit-puppeteer

import glob from 'glob';
import path from 'path';
import { runQunitPuppeteer, printOutput, printResultSummary, printFailedTests } from 'node-qunit-puppeteer';

const [hostname, port] = ['localhost', 5501];
const mode = process.argv[2];
const model_type = process.argv[3];

const dirname = path.dirname(new URL(import.meta.url).pathname); // get the root path of the repository

const testFilesArray = (mode === "dagaz-v2-kernel") ?  // get a list of QUnit HTML files
  glob.sync(`${dirname}/${mode}/tests/**/*.htm`): // dagaz v2
  glob.sync(`${dirname}/${model_type}/${mode}/tests/**/**/*.htm`); //dagaz v1 (new-model-kernel, zrf-based-kernel)

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
