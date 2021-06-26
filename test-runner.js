#! /usr/bin/env node
// almost the same as the sample code :-p
// https://github.com/ameshkov/node-qunit-puppeteer

import glob from 'glob';
import path from 'path';
import { runQunitPuppeteer, printOutput, printResultSummary, printFailedTests } from 'node-qunit-puppeteer';

const sleep = async (seconds) => new Promise((resolve, reject) => { setTimeout(() => { resolve(); }, seconds * 1000); });

const dirname = path.dirname(new URL(import.meta.url).pathname); // get the root path of the repository

const testFilesArray = glob.sync(`${dirname}/zrf-based-kernel/old/tests/**/**/*.htm`); // get a list of QUnit HTML files

const qunitArgsArray = testFilesArray.map(path => {
  return {
    targetUrl: `file://${path}`
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
      })
      .catch((ex) => {
        console.error(ex);
      });
  }
})();