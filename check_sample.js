// check_sample.js：跑 sample/rules.json，打印验收面
"use strict";
const fs = require("fs");
const { parse, locate } = require("./ruleparser.js");
const { compile, repaint, budget, isProperSubset } = require("./renderer.js");
const { snapshot } = require("./app.js");

const spec = JSON.parse(fs.readFileSync(process.argv[2] || "sample/rules.json", "utf8"));
const parsed = parse(spec.css);
const instructions = compile(parsed.rules);
const changed = repaint(instructions, spec.changed);
const view = snapshot(spec.css, spec.changed);
const cost = budget(instructions, spec.changed);
const bad = locate(spec.valid_css);

console.log("编译后的选择器 =", JSON.stringify(view.selectors));
console.log("选择器数量 =", view.selectors.length);
console.log("改动后实际重绘的选择器 =", JSON.stringify(changed.applied));
console.log("改动后重绘条数 =", changed.applied.length);
console.log("预算（访问规则数） =", cost.visited);
console.log("预算上限 =", cost.limit);
console.log("未闭合块的错误偏移 =", bad && bad.offset);
console.log("未闭合块的错误码 =", bad && bad.code);
console.log("不变量（重绘集合是编译结果的真子集） =", spec.subset_invariant === isProperSubset(instructions, changed.applied));
