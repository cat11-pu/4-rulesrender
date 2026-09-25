// app.js：渲染管线（解析 → 编译 → 增量重绘）
// 返回结构保持四个键：selectors / applied / visited / error。
"use strict";

(function (root, factory) {
  const api = factory(
    typeof require === "function" ? require("./ruleparser.js") : root.ruleparser,
    typeof require === "function" ? require("./renderer.js") : root.renderer
  );
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root.window !== "undefined") {
    root.window.app = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (ruleparser, renderer) {
  function snapshot(css, changed) {
    const parsed = ruleparser.parse(css);
    const instructions = renderer.compile(parsed.rules);
    const result = renderer.repaint(instructions, changed);
    const cost = renderer.budget(instructions, changed);
    return {
      selectors: instructions.map((item) => item.selector),
      applied: result.applied,
      visited: cost.visited,
      error: parsed.error,
    };
  }
  return { snapshot: snapshot };
});
