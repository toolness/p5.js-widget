/// <reference path="../typings/mocha.d.ts" />

import chai = require("chai"); let expect = chai.expect;

import LoopInserter from "../lib/loop-inserter";
import falafel from "../lib/falafel";

// These tests are ported from https://github.com/toolness/slowmo-js.

function testLoop(code) {
  let i = 0;
  let checkCalled = 0;
  let check = function() {
    checkCalled++;
  };
  let mangled = falafel(code, {}, LoopInserter("check")).toString();

  eval(mangled);
  expect(checkCalled).to.equal(3);
  expect(i).to.equal(3);
}

describe('LoopInserter', () => {
  it('works with for loops', () => {
    testLoop("for (i = 0; i < 3; i++) {}");
  });

  it("works w/ for loops w/ empty conditions", () => {
    testLoop("for (i = 0;; i++) { if (i >= 2) { i++; break;} }");
  });

  it("works with while loops", () => {
    testLoop("i = 0; while (i < 3) { i++; }");
  });

  it("works with do..while loops", () => {
    testLoop("i = 0; do { i++; } while (i < 3)");
  });

  it("can take a function w/ node as arg", () => {
    let log = [];
    let logLoop = function(range) {
      log.push(range);
    };
    let code = "/* */ for (var i = 0; i < 1; i++) {}";
    let mangled = falafel(code, {}, LoopInserter(function(node) {
      return "logLoop(" + JSON.stringify(node.range) + ");";
    })).toString();

    eval(mangled);
    expect(log).to.eql([[6, 36]]);
  });
});
