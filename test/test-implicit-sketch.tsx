/// <reference path="../typings/mocha.d.ts" />

import chai = require("chai"); let expect = chai.expect;

import makeImplicitSketch from "../lib/implicit-sketch";

function ensureUnchanged(code: string) {
  expect(makeImplicitSketch(code)).to.eql(code);
}

describe("makeImplicitSketch()", () => {
  it("does nothing to invalid JS", () => {
    ensureUnchanged("function blah {}");
    ensureUnchanged("function() {}");
    ensureUnchanged("#W$OTN#$ROGK$#%OKRr<T$R>");
  });

  it("does nothing to code w/ existing setup()", () => {
    ensureUnchanged("function setup() {}");
  });

  it("does nothing to code w/ existing draw()", () => {
    ensureUnchanged("function draw() {}");
  });

  it("wraps code that lacks setup/draw in setup()", () => {
    expect(makeImplicitSketch("foo()"))
      .to.eql("function setup() { foo() }");

    expect(makeImplicitSketch("function boop() {}"))
      .to.eql("function setup() { function boop() {} }");
  });
});
