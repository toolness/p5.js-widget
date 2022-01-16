/// <reference path="../typings/mocha.d.ts" />

mocha.setup('bdd' as MochaSetupOptions);

import "./test-loop-inserter";
import "./test-implicit-sketch";

window.addEventListener('load', () => {
  mocha.run();
});
