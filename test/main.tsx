/// <reference path="../typings/mocha.d.ts" />

mocha.setup('bdd');

import "./test-loop-inserter";

window.addEventListener('load', () => {
  mocha.run();
});
