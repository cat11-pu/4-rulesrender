// renderer.js：编译与增量重渲染（基线：每次都全量编译全量重绘）
"use strict";

function compile(rules) {
  // 基线：原样透传，不排序也不合并
  return rules.map((rule) => ({ selector: rule.selector, decls: Object.assign({}, rule.decls) }));
}

function repaint(instructions, changed) {
  // 基线：不看 changed，全部指令都重放
  return { applied: instructions.map((item) => item.selector), visited: instructions.length };
}

function budget(instructions, changed) {
  // 基线：访问数等于全部规则
  return { visited: instructions.length, limit: instructions.length };
}

module.exports = { compile, repaint, budget };
