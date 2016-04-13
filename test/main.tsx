/// <reference path="../typings/mocha.d.ts" />

mocha.setup('bdd');

import "./test-loop-inserter";
import "./test-implicit-sketch";

window.addEventListener('load', () => {
  mocha.run();
});
