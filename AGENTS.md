# dsh-unarchived-watch

DSH Web 插件：未归档普通会话数超过阈值时，在侧边栏底部亮警告图标（带数量角标）；设置页只有阈值配置行。

## 怎么跑

- 开发：`npm install`，`npm run verify`（typecheck + build + 单测 + `check-release`）。
- 装进实例：`dsh plugin --profile web add <本目录绝对路径>`，然后刷新窗口。
- `lib/` 是**被跟踪的构建产物**：改 `src/` 或 `scripts/` 后必须 `npm run build` 并一起提交，否则安装方拿到旧 bundle（`npm run check-release` 会拦住这种提交）。
- **任何 `lib/` 产物变更（host 或 client 半边）后都必须对实例 `remove` + `add`**：client-modules 的组合图只在插件 fiber 生命周期时重建，只刷新页面会因旧 revision URL 被 immutable 拒绝，导致整个客户端模块（含徽标）消失。

## 技术栈

- TypeScript（两个 tsconfig）+ esbuild；客户端产物是浏览器模块（`window.__ModuleLoader__.load`）。
- 依赖极简：host 半边只额外依赖 `@deepseek-ai/schemastery`（声明 Config 用）；客户端只从 shell 的 platform seed 里取 `react` 与 `@deepseek-ai/dsh-client-ui-primitives`（Tooltip），其余 official 形状都用 `src/client/types.ts` + `src/client/platform.d.ts` 的结构化/ambient 类型描述。
- platform seed 词表（react / react-dom / cordis / dsh-client-store / dsh-client-ui-slots / dsh-client-ui-primitives / dsh-client-ui-dockkit）由 shell 注入，见 `dsh-web-frontend/dist/assets/index-*.js` 的 `staticModules`；引入新的 seed 外模块前先核对这张表（`scripts/check-release.mjs` 也按这张表拦截）。
- 测试：`node --test` + `react-dom/server`；`test/harness.mjs` 把真实 `lib/client.js` 挂到假 client context 上。

## 验证资产（明文规矩）

- **动计数口径或 slot 注册前先跑 `npm run verify`**；改 `src/count.ts` 的筛选条件必须同步更新 `test/count.test.mjs` 的口径断言。
- **README / 汇报里的验收数字必须来自真实实例回放**（附命令与时间点），不得手写估算或沿用旧数字。
- **发布前必须 `npm run check-release` 通过**；它是发布门，不是提示。
- 发布动作（建仓库、push、npm publish、投稿目录）每一步单独授权，不合并成一次"发一下"。

## 不变量

- **row id === 设置命名空间 === 客户端 slot 的 entry id**，三处都是 `unarchived-watch`。
- `Config.threshold` **必须**是 volatile 字段，否则 dsh-settings 不会投影出命名空间，配置行不注册。
- 客户端模块的 `id` 必须等于包名 `dsh-unarchived-watch`。
- 计数口径只允许在 `src/count.ts` 里改，徽标与阈值行共用它。
- **本插件不做任何状态写操作**：不归档、不取消归档、不删除、不落盘、不联网。要加归档入口必须先经用户明确授权，并保证不成为状态的第二个 owner。

## 当前状态与下一步

- 已实现（0.3.0）：volatile `threshold`（默认 10）、侧边栏图标 + 数量角标 + 悬停文本、设置页阈值配置行、zh/en 文案；0.3.0 按用户要求移除了设置页整页看板。
- 已验证：`npm run verify` 22/22 通过 + `check-release` release-ready（0.3.0）；0.2.0 时代的实例回放与 G1–G5 结论见 `CHANGELOG.md`（计数口径未变，仍由同一 `countUnarchived` 实现）。
- 未验证：真实浏览器里 slot 的最终挂载与视觉效果（含 56px rail 下角标是否被裁），只能由页面确认。
- 下一步（未做，按需授权）：一键归档入口（往 `uiWorkspace.archiveSession` 接，需授权）、首屏截图/GIF、投稿 awesome-dsh-plugin 目录、加 CI。
