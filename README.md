# rulesrender

浏览器单页样式工作台（原生 HTML/CSS/JS，零依赖）。

## 起服务看页面

    python3 -m http.server 8000

浏览器打开 http://127.0.0.1:8000/ 即可看到实时预览。

## 模块

- `ruleparser.parse(css)`：解析选择器块与声明，返回 `{ rules, error }`；未闭合块报 `E_UNCLOSED`（含块起始偏移 `offset`）。
- `ruleparser.locate(css)`：定位第一个未闭合块，返回 `{ code: "E_UNCLOSED", offset }`；正常输入返回 `null`。
- `renderer.compile(rules)`：同选择器声明合并（后写覆盖先写），按选择器名排序输出指令。
- `renderer.repaint(instructions, changed)`：只重绘与 `changed` 匹配的指令，返回 `{ applied, visited }`。
- `renderer.budget(instructions, changed)`：返回 `{ visited, limit }`，`visited` 为命中规则数，`limit` 为编译结果总数。
- `app.snapshot(css, changed)`：返回 `{ selectors, applied, visited, error }`（结构固定）。

## 测试

    node tests/run.js

## 场景自检

    node check_sample.js
