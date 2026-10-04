# dsh-session-watch

DSH Web 插件：侧边栏底部常驻一行会话状态读数（运行中 / 未读 / 待处理 / 闲置 / 未归档 / 已归档），两种版式可选；设置页可逐项开关、切换版式、设未归档告警阈值。

## 怎么跑

- 开发：`npm install`，`npm run verify`（typecheck + build + 单测 + `check-release`）。
- 装进实例：`dsh plugin --profile web add <本目录绝对路径>`，然后刷新窗口。
- `lib/` 是**被跟踪的构建产物**：改 `src/` 或 `scripts/` 后必须 `npm run build` 并一起提交，否则安装方拿到旧 bundle（`npm run check-release` 会拦住这种提交）。
- **任何 `lib/` 产物变更（host 或 client 半边）后都必须对实例 `remove` + `add`**：client-modules 的组合图只在插件 fiber 生命周期时重建，只刷新页面会因旧 revision URL 被 immutable 拒绝，导致整个客户端模块（含读数）消失。

## 技术栈

- TypeScript（两个 tsconfig）+ esbuild；客户端产物是浏览器模块（`window.__ModuleLoader__.load`）。
- 依赖极简：host 半边只额外依赖 `@deepseek-ai/schemastery`（声明 Config 用）；客户端只从 shell 的 platform seed 里取 `react` 与 `@deepseek-ai/dsh-client-ui-primitives`（Tooltip），其余 official 形状都用 `src/client/types.ts` + `src/client/platform.d.ts` 的结构化/ambient 类型描述。
- platform seed 词表（react / react-dom / cordis / dsh-client-store / dsh-client-ui-slots / dsh-client-ui-primitives / dsh-client-ui-dockkit）由 shell 注入；引入新的 seed 外模块前先核对这张表（`scripts/check-release.mjs` 也按这张表拦截）。
- 计数读的三份快照全部来自官方标准 hook：`useSessions`、`useSessionStatus`、`useWorkspaces`。**MUST NOT** 依赖任何第三方插件的代码、数据或 HTTP 路由。
- 测试：`node --test` + `react-dom/server`；`test/harness.mjs` 把真实 `lib/client.js` 挂到假 client context 上。

## 验证资产（明文规矩）

- **动计数口径、版式清单或 slot 注册前先跑 `npm run verify`**；改 `src/count.ts` 的筛选/分区条件必须同步更新 `test/count.test.mjs` 的口径断言，改 `src/config.ts` 的版式清单必须同步更新 `test/client-render.test.mjs`。
- **README / 汇报里的验收数字必须来自真实实例回放**（附命令与时间点），不得手写估算或沿用旧数字。
- **发布前必须 `npm run check-release` 通过**；它是发布门，不是提示。
- 发布动作（建仓库、push、npm publish、投稿目录、改 GitHub 仓库名）每一步单独授权，不合并成一次“发一下”。

## 不变量

- **row id === 设置命名空间 === 两个客户端 slot 的 entry id**，三处都是 `session-watch`（`src/config.ts` 的 `PLUGIN_ID`）。
- `Config` 里每一个偏好字段（`threshold` / `variant` / 六个 `show*`）**必须**是 volatile，否则 dsh-settings 不会投影出命名空间，设置行不注册。
- 客户端模块的 `id` 必须等于包名 `dsh-session-watch`。
- 六项计数口径只允许在 `src/count.ts` 里改；指标清单、Config 字段名与默认可见性只在 `src/config.ts` 里改；读数与设置行共用二者。
- 活动四项 **MUST** 保持「待处理 > 运行中 > 未读 > 闲置」的分区，四者之和 **MUST** 恒等于未归档数（单测钉住该不变量）。
- **本插件不做任何状态写操作**：不归档、不取消归档、不删除、不落盘、不联网。唯一的写入是用户自己改的偏好字段。

## 当前状态与下一步

- 已实现（0.4.0）：六项计数（运行中 / 未读 / 待处理 / 闲置 / 未归档 / 已归档）、两种版式（胶囊 / 比例条，rail 折叠为单图标 + 未归档角标）、设置页逐项开关 + 版式切换 + 阈值、zh/en 文案。
- 已验证：`npm run verify` 31/31 通过 + `check-release` release-ready（0.4.0）；版式预览用真实组件 SSR + DSH 真实主题 token 渲染核对（亮/暗两套）。
- 未验证：真实浏览器里 slot 的最终挂载与视觉效果（含 56px rail 下角标是否被裁），只能由页面确认；改名后本机目录/profile 的重装与实例回放尚未执行。
- 下一步（未做，按需授权）：本机目录与 GitHub 仓库改名为 `dsh-session-watch`、npm 发布、投稿 awesome-dsh-plugin 目录、加 CI。
