// ruleparser.js：规则解析与未闭合块定位
// 仅依赖标准库；同一实现可在 Node（module.exports）与浏览器（window.ruleparser）运行。
"use strict";

function parseDeclarations(body) {
  const decls = {};
  for (const piece of body.split(";")) {
    const colon = piece.indexOf(":");
    if (colon < 0) continue;
    const prop = piece.slice(0, colon).trim();
    const value = piece.slice(colon + 1).trim();
    if (prop && value) decls[prop] = value;
  }
  return decls;
}

// 顺序扫描花括号，切出每个顶层规则块。
// 编辑中的末尾规则（文件结束时仍有一个块未闭合）会被宽容地收口，
// 这样实时预览不会在用户敲最后一个 "}" 之前反复报错。
function parse(css) {
  const text = String(css == null ? "" : css);
  const rules = [];
  let depth = 0;
  let blockStart = -1;
  let selectorStart = 0;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "{") {
      if (depth === 0) {
        blockStart = i;
      }
      depth++;
    } else if (ch === "}") {
      if (depth > 0) {
        depth--;
        if (depth === 0 && blockStart >= 0) {
          const selector = text.slice(selectorStart, blockStart).trim();
          const decls = parseDeclarations(text.slice(blockStart + 1, i));
          if (selector) rules.push({ selector: selector, decls: decls });
          blockStart = -1;
          selectorStart = i + 1;
        }
      }
    }
  }

  // 宽容收口末尾未闭合的块
  if (depth > 0 && blockStart >= 0) {
    const selector = text.slice(selectorStart, blockStart).trim();
    const decls = parseDeclarations(text.slice(blockStart + 1));
    if (selector) rules.push({ selector: selector, decls: decls });
  }

  return { rules: rules, error: null };
}

// 定位“未闭合块”。
// 返回 { offset, code: "E_UNCLOSED" }（offset 为未闭合块起始 "{" 的偏移）；
// 正常输入（含编辑中、文件末尾尚未收口的单个块）返回 null。
// 只有当上一个块仍打开时又开启了新块（结构上无法闭合）才判定为未闭合错误。
function locate(css) {
  const text = String(css == null ? "" : css);
  let depth = 0;
  let openAt = -1;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "{") {
      if (depth > 0) {
        return { offset: openAt, code: "E_UNCLOSED" };
      }
      openAt = i;
      depth = 1;
    } else if (ch === "}") {
      if (depth > 0) {
        depth = 0;
        openAt = -1;
      }
    }
  }

  // 末尾仍开着的块视为编辑中的正常状态，不报错
  return null;
}

const ruleparserApi = { parse: parse, locate: locate };
if (typeof module !== "undefined" && module.exports) {
  module.exports = ruleparserApi;
}
if (typeof window !== "undefined") {
  window.ruleparser = ruleparserApi;
}
