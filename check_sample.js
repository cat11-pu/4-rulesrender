import fs from "node:fs";
import { compile } from "./compile.js";
import { recompile } from "./invalidate.js";
import { render } from "./app.js";

const spec = JSON.parse(fs.readFileSync(process.argv[2] || "sample/styles.json", "utf8"));
const full = compile(spec.rules, spec.elements);
const grown = recompile(spec.rules, spec.elements, spec.changed_rule, spec.budget);
const view = render(spec);

console.log("每个元素的胜出规则 =", JSON.stringify(full.matched));
console.log("重编译的规则 =", JSON.stringify(grown.recompiled));
console.log("受影响的元素 =", JSON.stringify(grown.invalidated));
console.log("预算消耗 =", grown.used);
console.log("增量是否与全量一致 =", view.consistent);
console.log("未知选择器的错误码 =", spec.unknown_code);
