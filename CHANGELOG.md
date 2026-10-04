# Changelog

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 的分节习惯，版本号遵循语义化版本。

## 0.4.0 — 2026-10-03

### 变更（破坏性）
- **改名**：包名 `dsh-unarchived-watch` -> `dsh-session-watch`；row id / 设置命名空间 / 两个 slot entry id 从 `unarchived-watch` -> `session-watch`。设置命名空间随之改变，profile 里旧的 `unarchived-watch` 配置不再被读取（需按新 id 重写）。
- **计数口径扩展**：在 `countUnarchived` 之上新增 `countSessions`，一次返回六项：运行中 / 未读 / 待处理 / 闲置 / 未归档 / 已归档。活动四项按 `待处理 > 运行中 > 未读 > 闲置` 归类，四者之和恒等于未归档数；`countUnarchived` 改为它的 `unarchived` 投影，旧行为不变。

### 新增
- 侧边栏底部**常驻状态读数**，两种版式：胶囊（默认）与比例条；56px rail 折叠为单图标 + 未归档角标。
- 设置页「Session Watch 状态显示」行：六项计数逐项开关 + 版式切换 + 未归档告警阈值；全部为 volatile 字段。
- `test/` 从 22 个扩到 31 个：六项口径、分区不变量、配置字段写入映射、两种版式的 SSR 渲染。

### 移除
- `src/client/WarningBadge.tsx`、`WarningIcon.tsx`、`ThresholdRow.tsx`、`threshold.ts`，由 `StatusWatch.tsx`、`SettingsRow.tsx`、`config-source.ts`、`icons.tsx` 取代。
- 先做过、再按用户取舍删掉的「数字格」「紧凑」两种版式；`normalizeVariant` 对未知版式回退到默认，不会渲染空白。

### 说明
- 为什么未读/待处理取官方状态：它们与官方侧边栏行状态点同源，插件因此不需要第二个数据 owner；代价是与 `dsh-unread-helper` 的跨重启账本数字可能不同。

## 0.3.0 — 2026-10-02

### 移除
- **设置页整页看板**：`Settings → 未归档会话` 页不再注册。设置页里本插件只剩通用栏的阈值配置行；未归档会话的明细继续由官方侧边栏自己呈现。

### 变更
- 客户端不再注册 `settings.section`，`UnarchivedSection` 组件及其 `section.*` 文案与样式随之删除；`dsh.client.inject` 名单去掉不再需要的 `@deepseek-ai/dsh-client-ui-settings`。
- `src/count.ts` 回归纯计数：`collectUnarchived` / `groupUnarchived` / `describeAge` 只被看板使用，一并移除；徽标与阈值行仍共用 `countUnarchived` 的口径，计数逻辑未变。
- `scripts/replay-count.mjs` 不再输出分组，只报总数、阈值与亮灯判定。
- 单测从 33 个收敛到 22 个：删除看板专属的 `test/board.test.mjs` 与 `test/section-render.test.mjs`，契约测试改为断言 `settings.section` 不注册。

### 说明
- 为什么移除：设置页只需要「允许设阈值」；逐条列出全部未归档会话属于越界展示，要看明细时官方侧边栏本来就是权威清单。

## 0.2.0 — 2026-10-02

### 新增
- **设置页看板**：Settings 里新增「未归档会话」整页，按工作区分组列出全部未归档普通会话（标题、运行状态、相对时间），顶部给出总数、阈值和是否越线。
- **数字角标**：侧边栏警告图标直接带上未归档普通会话的数量，不再只靠悬停气泡。
- **`README.en.md`** 与本次发布说明。

### 变更
- `src/count.ts` 从"只数数"升级为"选行 + 分组 + 时间分档"，徽标与看板共用同一份口径；单测钉住 `collectUnarchived(...).length === countUnarchived(...)`。
- 单测从 21 个增加到 33 个；新增 `npm run check-release` 作为发布前体检。

### 复现回放（本机实例）

README 里的数字不是估算。把一台在跑的实例的两个事实源存成文件，再用仓库自带的回放脚本过一遍同一份计数实现：

```sh
# 1) 会话列表：实例 Remote 的 session/list（POST /api/session/list，签上实例的浏览器会话 Cookie），
#    结果形如 { "items": [ { sessionId, blank, origin?, parentSessionId?, title, cwd, updatedAt, running } ] }
# 2) 归档集与工作区归属：<DSH home>/storages/workspace.json 的 global / tables

node scripts/replay-count.mjs \
  --sessions /tmp/sessions.json \
  --workspace "<DSH home>/storages/workspace.json" \
  --threshold 10
```

脚本离线运行（只读两个文件），输出总数、阈值判定与按工作区分组的行数 —— 与侧边栏徽标、设置页看板用的是 `src/count.ts` 同一份实现。

### 说明
- 为什么加看板：徽标只能回答"多了"，看板回答"多了哪些、在哪个工作区"。
- 为什么看板不做归档按钮：归档是对真实状态的写操作，官方侧边栏已经有；插件再做一次就会成为状态的第二个 owner。按"只读、不接管"的原则没有采纳（见 `AGENTS.md` 的不变量）。

## 0.1.0 — 2026-10-02

### 新增
- 首次发布：volatile `threshold`（默认 10，设置页可改）、侧边栏底部黄色警告三角（悬停/聚焦显示数量文本）、设置页通用栏的阈值配置行。
- 21 个 `node:test` 用例：计数口径、客户端模块契约、两个组件的 `react-dom/server` 真渲染。
- 客户端半边通过 `settings.general.item` 注册，宿主半边只声明 Config：整个插件不持有任何自己的持久化状态。
