# Deprecated Engines

This is a collection of Dagaz v1 Engines, old and deprecated core units.

## How to run tests

It has unit tests based on [QUnit](https://qunitjs.com/) test suite. You can run them with Node.js.

At first, make sure that you have installed dependencies:

```bash
$ git clone https://github.com/stepney141/dagaz-new
$ cd dagaz-new
$ npm install
$ npm run-script prepare-test # script to configure the test environment.
```

Next, open the port 5501 on your localhost.

Then, run one of these commands on your shell:

```bash
$ npm run-script test-zrf-refactored # run unit tests for the refactored zrf-based kernel
$ npm run-script test-new-model-refactored # run unit tests for the refactored new-model kernel
```

## Based files

- zrf-based-kernel :
  - The common scripts are based on [GlukKazan/GlukKazan.github.io:fb084e8](https://github.com/GlukKazan/GlukKazan.github.io/blob/fb084e880915b0410b21f3190a3c9e2a86a79ce9/common-scripts)
  - The test scripts are from [GlukKazan/Dagaz:1ffac28](https://github.com/GlukKazan/Dagaz/tree/1ffac284ea075f68eb193187c1c88038cf89940f/tests)
  - The game implementations for the test files are from [GlukKazan/Dagaz:ad1306c](https://github.com/GlukKazan/Dagaz/tree/ad1306c7cb9f7a906237767f5413fb1057778c22/src/debug/games)

- new-model-kernel :
  - The common scripts are based on [GlukKazan/Dagaz:f04f44f](https://github.com/GlukKazan/Dagaz/blob/f04f44fb6d4967076f19648fd290236ab511a0ff/src/debug/kernel)
  - The test scripts are from [GlukKazan/Dagaz:1ffac28](https://github.com/GlukKazan/Dagaz/tree/1ffac284ea075f68eb193187c1c88038cf89940f/tests)
  - The game implementations on this new model don't exist so far.
