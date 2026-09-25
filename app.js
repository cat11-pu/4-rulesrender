// app.js：增量渲染入口（snapshot 结构固定：selectors / applied / visited / error）
(function () {
"use strict";

const ruleparser = typeof require === "function" ? require("./ruleparser.js") : globalThis.ruleparser;
const renderer = typeof require === "function" ? require("./renderer.js") : globalThis.renderer;

function snapshot(css, changed) {
  const parsed = ruleparser.parse(css);
  const instructions = renderer.compile(parsed.rules);
  const result = renderer.repaint(instructions, changed);
  const cost = renderer.budget(instructions, changed);
  return { selectors: instructions.map((item) => item.selector),
           applied: result.applied, visited: cost.visited, error: parsed.error };
}

const api = { snapshot };
if (typeof module !== "undefined" && module.exports) module.exports = api;
if (typeof globalThis !== "undefined") globalThis.app = api;
})();
