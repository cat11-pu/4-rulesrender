// renderer.js：编译与增量重渲染
// compile 合并同选择器声明（后写覆盖先写）并按选择器名排序；
// repaint / budget 只针对 changed 选择器，避免整页重绘。
"use strict";

function isChanged(selector, changed) {
  if (Array.isArray(changed)) {
    for (const item of changed) if (item === selector) return true;
    return false;
  }
  return selector === changed;
}

function compile(rules) {
  const merged = new Map();
  for (const rule of rules) {
    if (!rule || !rule.selector) continue;
    const selector = rule.selector;
    if (!merged.has(selector)) merged.set(selector, {});
    Object.assign(merged.get(selector), rule.decls);
  }
  const selectors = Array.from(merged.keys()).sort();
  return selectors.map((selector) => ({
    selector: selector,
    decls: merged.get(selector),
  }));
}

// 只重放与 changed 匹配的指令；applied 为实际重绘的选择器，
// visited 为命中（访问）的规则数。
function repaint(instructions, changed) {
  const applied = [];
  let visited = 0;
  for (const item of instructions) {
    if (isChanged(item.selector, changed)) {
      applied.push(item.selector);
      visited++;
    }
  }
  return { applied: applied, visited: visited };
}

// visited：命中改动元素的规则数；limit：编译结果总数。
function budget(instructions, changed) {
  let visited = 0;
  for (const item of instructions) {
    if (isChanged(item.selector, changed)) visited++;
  }
  return { visited: visited, limit: instructions.length };
}

const rendererApi = { compile: compile, repaint: repaint, budget: budget };
if (typeof module !== "undefined" && module.exports) {
  module.exports = rendererApi;
}
if (typeof window !== "undefined") {
  window.renderer = rendererApi;
}
