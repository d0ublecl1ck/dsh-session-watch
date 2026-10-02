# dsh-unarchived-watch

DSH Web 插件：未归档会话数超过阈值时，在侧边栏底部显示警告图标；阈值在设置页配置。

## 怎么跑

- 开发：`npm install`，`npm run verify`（typecheck + build + node 测试）。
- 装进实例：`dsh plugin --profile web add <本目录绝对路径>`，然后刷新窗口。
- `lib/` 是**被跟踪的构建产物**：改 `src/` 后必须 `npm run build` 并一起提交，否则安装方拿到旧 bundle。
- 改了 host 半边必须 `remove` + `add`；只改 client 半边时 client-modules 会按产物 revision 重新组合。

## 技术栈

- TypeScript（两个 tsconfig）+ esbuild；客户端产物是浏览器模块（`window.__ModuleLoader__.load`）。
- 依赖极简：运行时只额外依赖 `@deepseek-ai/schemastery`（host 半边声明 Config 用），其余 official 形状都用 `src/client/types.ts` 里的结构化类型描述，避免 `link:` 安装的裸导入决议问题。
- 测试：`node --test` + `react-dom/server`；`test/harness.mjs` 负责把真实 `lib/client.js` 挂到假 client context 上。

## 当前状态与下一步

- 已实现：host 半边（volatile `threshold`，默认 10）、侧边栏警告图标、设置页配置行、zh/en 文案、21 个单测。
- 已验证：typecheck + build + 单测；`create-dsh-plugin` 五门验证梯子 G1–G5 全绿；装进 web profile 后 `settings/describe` 返回命名空间 `unarchived-watch`（`threshold: 10`，`applies: live`），运行中的 host 也已在 boot 图里下发 `dsh-unarchived-watch/client.js`。
- 未验证：真实浏览器里 slot 的最终挂载与视觉效果，只能由页面确认。
- 下一步（未做）：按需加「点击图标跳到会话列表/归档面板」；给设置行补预设档位选择。

## 不变量

- **row id === 设置命名空间 === 客户端 slot 的 entry id**，三处都是 `unarchived-watch`。
- `Config.threshold` **必须**是 volatile 字段，否则 dsh-settings 的 `volatileForm` 不会投影出命名空间，设置页就没有这一项。
- 客户端模块的 `id` 必须等于包名 `dsh-unarchived-watch`。
- 计数口径只允许在 `src/count.ts` 里改，浏览器半边与单测共用它。
