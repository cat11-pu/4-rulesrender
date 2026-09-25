// app.js：渲染（基线：全量重绘）
"use strict";

const { parse } = require("./ruleparser.js");
const { compile, repaint, budget } = require("./renderer.js");

function snapshot(css, changed) {
  const parsed = parse(css);
  const instructions = compile(parsed.rules);
  const result = repaint(instructions, changed);
  const cost = budget(instructions, changed);
  return { selectors: instructions.map((item) => item.selector),
           applied: result.applied, visited: cost.visited, error: parsed.error };
}

module.exports = { snapshot };
