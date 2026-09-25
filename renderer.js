// renderer.js：编译与增量重渲染
(function () {
"use strict";

// 编译：同选择器的声明合并（后写覆盖先写），按选择器名排序输出指令。
function compile(rules) {
  const merged = new Map();
  for (const rule of rules || []) {
    if (!rule || !rule.selector) continue;
    const decls = merged.get(rule.selector) || {};
    merged.set(rule.selector, Object.assign(decls, rule.decls));
  }
  return Array.from(merged.keys()).sort().map((selector) => ({ selector: selector, decls: merged.get(selector) }));
}

function changedSet(changed) {
  const list = Array.isArray(changed) ? changed : [changed];
  return new Set(list.filter((item) => typeof item === "string" && item !== ""));
}

// 增量重绘：只重放与 changed 匹配的指令，返回 { applied, visited }。
function repaint(instructions, changed) {
  const targets = changedSet(changed);
  const applied = [];
  for (const item of instructions || []) {
    if (targets.has(item.selector)) applied.push(item.selector);
  }
  return { applied: applied, visited: applied.length };
}

// 预算：visited 为命中改动元素的规则数，limit 为编译结果总数。
function budget(instructions, changed) {
  const list = instructions || [];
  return { visited: repaint(list, changed).visited, limit: list.length };
}

// 不变量：重绘集合必须始终是编译结果的真子集。
function isProperSubset(instructions, applied) {
  const all = new Set((instructions || []).map((item) => item.selector));
  const hit = new Set(applied || []);
  if (hit.size >= all.size) return false;
  for (const selector of hit) if (!all.has(selector)) return false;
  return true;
}

const api = { compile, repaint, budget, isProperSubset };
if (typeof module !== "undefined" && module.exports) module.exports = api;
if (typeof globalThis !== "undefined") globalThis.renderer = api;
})();
