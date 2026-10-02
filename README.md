<sub>🌐 <b>中文</b> · <a href="README.en.md">English</a></sub>

<div align="center">

# dsh-unarchived-watch

> *「会话攒到第 11 个，侧边栏底部会替你亮一盏黄灯。」*

![DSH plugin](https://img.shields.io/badge/DSH-plugin-blueviolet)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![no archive writes](https://img.shields.io/badge/session%20or%20archive%20writes-none-brightgreen)

**未归档会话积压的仪表灯：越线就亮，点开是一张按工作区分组的只读清单 —— 它不归档、不删除、不落盘；唯一会写的，是你在设置页设的那个阈值。**

[它解决什么问题](#它解决什么问题) · [效果示例](#效果示例) · [快速开始](#快速开始) · [触发方式](#触发方式) · [它和同类有什么不同](#它和同类有什么不同) · [安全边界](#安全边界) · [文件结构](#文件结构) · [验证与测试](#验证与测试)

</div>

---

## 它解决什么问题

DSH 里的归档是个**手动动作**，而"该归档了"这件事没有任何人提醒你。

于是它总是这样发生：你连着几周只顾开新会话，直到某天打开侧边栏，发现要滚很久才能找到上周那条 —— 然后花半小时翻捡、归档、后悔没早点整理。

这个插件把"该清理了"变成一个**被动触发的信号**：未归档的普通会话一旦超过你设的阈值（默认 10），侧边栏底部就会亮起一个黄色警告三角，角标上是当前数量。点进设置页能看到完整的看板：多少个、在哪个工作区、各自多久没动过。

**它只负责告诉你，不替你动手。** 归档动作仍然在你熟悉的侧边栏行内菜单里；插件不接管任何状态。

## 效果示例

下面是本机实例（DSH Desktop，2026-10-02 11:16）的**真实回放**，不是编的样例：

```text
会话列表                125 行
其中普通会话             63 个   （排除 48 个子代理子会话 + 14 个空白新建会话）
其中已归档               34 个
→ 未归档普通会话         29 个
→ 阈值                   10
→ 侧边栏                 亮灯，角标 29
```

同一场排查里我前后读了两次，归档集从 11 涨到 38（这段时间有 27 个会话被归档），计数随之从 **54 掉到 29** —— 它跟着你的清理实时变化，不需要刷新。

设置页看板的同一次回放，按工作区分成 9 组：

```text
 15  resumate               1  anki-templates
  3  homekeeping-core       2  dsh-session-ledger
  2  graphmaps              2  data-supply-platform
  2  add_account            1  sub2api
  1  （未归属工作区）
```

数字会跟着你的清理走：写这份文档的十几分钟里，同一个实例的归档集从 11 涨到 59，计数从 54 一路掉到 9（这时灯就灭了）。所以下面这句是**那个时刻**的真实读数，你自己跑 [scripts/replay-count.mjs](scripts/replay-count.mjs) 得到的一定是新的。

悬停图标会显示一句话，屏幕阅读器读到的是同一句：

```text
未归档会话 29 个，已超过阈值 10 个
```

## 快速开始

两条路，任选一条：

```sh
# 1) npm 包
dsh plugin --profile web add dsh-unarchived-watch

# 2) 直接指向 GitHub 仓库（不需要构建授权：lib/ 随仓库提交）
dsh plugin --profile web add github:d0ublecl1ck/dsh-unarchived-watch
```

装完刷新窗口（Cmd+R）。装完第一句话可以直接对 Agent 说：

```text
现在有多少未归档会话？超阈值的时候把阈值调成 20。
```

阈值也能手写进 profile 的 `cordis.patch.yml`（注意 **row id 就是设置命名空间**）：

```yaml
- id: unarchived-watch
  name: dsh-unarchived-watch
  config:
    threshold: 20
```

## 触发方式

- "我有多少会话没归档？"
- "侧边栏底部那个黄三角是什么？"
- "未归档有点多了，提醒我一下"
- "阈值改成 20"
- "帮我看看哪个工作区积压最多"
- "把未归档会话提醒关掉"（把阈值调到很大，或禁用 row）

## 它会交付什么

| 位置 | 内容 | 什么时候出现 |
|---|---|---|
| 侧边栏底部 | 黄色警告三角 + 数量角标 | 未归档普通会话数 **严格大于** 阈值 |
| 悬停 / 键盘聚焦 | 文本气泡：`未归档会话 {count} 个，已超过阈值 {threshold} 个` | 图标可见时 |
| Settings → 通用 | 「未归档会话提醒」配置行：输入框 + 当前数量 | Host 服务了本插件配置时 |
| Settings → 未归档会话 | 整页看板：总数 / 阈值 / 是否越线 + 按工作区分组的清单 | 同上 |

## 它和同类有什么不同

DSH 生态里已经有几个**归档管理器**（做得都很好）。这个插件的定位刻意不同：

| 维度 | 归档管理器（如 dsh-archive-manager / dsh-archived-conversations / dsh-session-sweeper） | dsh-unarchived-watch |
|---|---|---|
| 回答的问题 | "已归档的在哪里、怎么恢复/删除" | "什么时候该归档了" |
| 入口 | 设置页整页列表 / 侧边栏列表 | 侧边栏底部一盏灯 + 一块看板 |
| 触发时机 | 你想起来去看 | 越线自动出现 |
| 写操作 | 会改归档状态（部分会删除会话） | **零写操作**，全程只读快照 |
| 状态归属 | 自己持有一份列表/索引 | 不持有任何状态，计数现场算 |

如果你要的是"管理归档"，请用那三个；如果你要的是"别让我攒到失控"，用这个。

## 安全边界

- **不写会话或归档状态**：没有 `archiveSession` / `unarchiveSession` / 删除调用；归档仍走官方侧边栏的行内动作。插件唯一的写入是你自己改的阈值 —— 它经 Host settings 存进 profile 的 `cordis.patch.yml`，那是配置，不是会话状态。
- **不联网**：客户端只读 shell 已经发布的快照（`useSessions` / `useWorkspaces`），不发起任何网络请求。
- **不落盘**：插件自己不建文件、不写 `localStorage`、不注册持久化 domain。
- **不会静默误算**：徽标与看板共用 `src/count.ts` 一份实现，单测钉住两者相等；口径写在看板上也不藏。
- **什么时候停手**：Host 没有服务本插件的配置命名空间时，配置行与看板不注册（徽标照常，用默认阈值）——不会渲染一个改不动的控件。

## 文件结构

```text
src/index.ts                     host 半边：只导出 name / Config / apply（threshold 是 volatile 字段）
src/count.ts                     纯计数 + 分组 + 时间分档（无框架依赖，单测直接打它）
src/client/index.ts              浏览器半边：注册徽标 / 配置行 / 看板，注册文案与样式
src/client/WarningBadge.tsx      侧边栏底部的图标 + 数量角标 + 官方 Tooltip
src/client/ThresholdRow.tsx      设置页通用栏的阈值输入行
src/client/UnarchivedSection.tsx 设置页整页看板
src/client/threshold.ts          把 config form 投影成可订阅的阈值
src/client/styles.ts             注入的 uw-* 样式（一次注入，fiber 卸载时移除）
scripts/build.mjs                tsc + esbuild + __ModuleLoader__ 包装
scripts/check-release.mjs        发布前离线体检（清单 / 契约 / externals / 产物新鲜度）
test/                            33 个 node:test 用例（口径、模块契约、SSR 真渲染）
cordis.patch.yml                 bundle 层：插入 row id 为 unarchived-watch 的那一行
```

## 验证与测试

一条命令跑完全部门禁：

```sh
npm run verify        # typecheck + build + 33 个单测 + check-release
```

- **单测 33/33**：`test/count.test.mjs`（口径与边界）、`test/board.test.mjs`（选行/分组/时间分档）、`test/client-contract.test.mjs`（加载真实 `lib/client.js` 验模块 id 与三次注册）、`test/client-render.test.mjs` + `test/section-render.test.mjs`（`react-dom/server` 真渲染徽标、配置行、看板）。
- **发布前体检**：`npm run check-release` 会拦住"改了 `src/` 忘了 `npm run build`"、`export default` 折掉 `inject`、浏览器产物 require 了 platform seed 之外的模块、以及 tarball 会漏掉 `cordis.patch.yml` 这四类发布事故。
- **真实数据回放**：上面的数字是用本机实例跑出来的。[scripts/replay-count.mjs](scripts/replay-count.mjs) 就是当时用的脚本 —— 把实例的会话列表与 `storages/workspace.json` 喂给它，它在任何一台 DSH 实例上都能算出同样的口径与分组（命令见 `CHANGELOG.md` 的 0.2.0 节）。
- **已知边界**：单测覆盖到"组件渲染出什么"为止；slot 在浏览器里的最终挂载与视觉效果需要刷新页面确认（页面里看不到图标时，先看 `document.head` 里有没有 `<style data-plugin="dsh-unarchived-watch">`）。

## License

[MIT](LICENSE)
