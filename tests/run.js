// tests/run.js：基线用例
"use strict";
const assert = require("assert");
const { parse } = require("../ruleparser.js");
const { compile } = require("../renderer.js");
const { snapshot } = require("../app.js");

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok   " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

check("parse single rule", () => {
  assert.strictEqual(parse("a { color: red; }").rules.length, 1);
});

check("parse two rules", () => {
  assert.strictEqual(parse("a { color: red } b { color: blue }").rules.length, 2);
});

check("compile keeps selectors", () => {
  assert.strictEqual(compile(parse("a { color: red }").rules)[0].selector, "a");
});

check("snapshot exposes selectors", () => {
  assert.deepStrictEqual(snapshot("a { color: red }", "a").selectors, ["a"]);
});

check("snapshot reports visited", () => {
  assert.strictEqual(snapshot("a { color: red }", "a").visited, 1);
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
