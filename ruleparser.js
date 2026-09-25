// ruleparser.js：规则解析与未闭合块定位
(function () {
"use strict";

const E_UNCLOSED = "E_UNCLOSED";

// 解析选择器块与声明，返回 { rules, error }。
// 未闭合的块记入 error（E_UNCLOSED，offset 为块起始偏移），已闭合的块照常返回。
function parse(css) {
  const text = String(css);
  const rules = [];
  let error = null;
  let cursor = 0;
  while (cursor < text.length) {
    const open = text.indexOf("{", cursor);
    if (open < 0) break;
    const selector = text.slice(cursor, open).trim();
    const close = text.indexOf("}", open + 1);
    if (close < 0) {
      error = { code: E_UNCLOSED, offset: open };
      break;
    }
    const decls = {};
    for (const item of text.slice(open + 1, close).split(";")) {
      const colon = item.indexOf(":");
      if (colon < 0) continue;
      const prop = item.slice(0, colon).trim();
      const value = item.slice(colon + 1).trim();
      if (prop && value) decls[prop] = value;
    }
    if (selector) rules.push({ selector: selector, decls: decls });
    cursor = close + 1;
  }
  return { rules: rules, error: error };
}

// 定位第一个未闭合的块，返回 { code: E_UNCLOSED, offset }；正常输入返回 null。
function locate(css) {
  const text = String(css);
  let open = -1;
  for (let index = 0; index < text.length; index += 1) {
    const ch = text[index];
    if (ch === "{") open = index;
    else if (ch === "}") open = -1;
  }
  return open < 0 ? null : { code: E_UNCLOSED, offset: open };
}

const api = { parse, locate, E_UNCLOSED };
if (typeof module !== "undefined" && module.exports) module.exports = api;
if (typeof globalThis !== "undefined") globalThis.ruleparser = api;
})();
