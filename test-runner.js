#! /usr/bin/env node
// almost the same as the sample code :-p
// https://github.com/ameshkov/node-qunit-puppeteer

import glob from 'glob';
import path from 'path';
import { runQunitPuppeteer, printOutput } from 'node-qunit-puppeteer';

const sleep = async (seconds) => new Promise((resolve, reject) => { setTimeout(() => { resolve(); }, seconds * 1000); });

const dirname = path.dirname(new URL(import.meta.url).pathname); // get the root path of the repository

const testFilesArray = glob.sync(`${dirname}/zrf-based-kernel/old/tests/**/**/*.htm`); // get a list of QUnit HTML files

const qunitArgsArray = testFilesArray.map(path => {
  return {
    targetUrl: `file://${path}`,
    redirectConsole: true
  }; 
});

for (const qunitArgs of qunitArgsArray) { // run the tests
  runQunitPuppeteer(qunitArgs)
    .then((result) => {
    // Print the test result to the output
      printOutput(result, console);
      if (result.stats.failed > 0) {
      // Handle the failed test run
      // currently notghing to do.
      }
    })
    .catch((ex) => {
      console.error(ex);
    });
  sleep(1);
}
