// ruleparser.js：规则解析（基线：只切分整块，不定位错误）
"use strict";

function parse(css) {
  // 基线：按花括号粗切，非法输入不报
  const rules = [];
  const parts = String(css).split("}");
  for (const part of parts) {
    if (part.indexOf("{") < 0) continue;
    const [selector, body] = part.split("{");
    const decls = {};
    for (const item of body.split(";")) {
      const [prop, value] = item.split(":");
      if (prop && value) decls[prop.trim()] = value.trim();
    }
    rules.push({ selector: selector.trim(), decls: decls });
  }
  return { rules: rules, error: null };
}

function locate(css) {
  // 基线：不定位
  return null;
}

module.exports = { parse, locate };
