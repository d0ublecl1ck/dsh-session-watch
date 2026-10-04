<sub>🌐 <b>中文</b> · <a href="README.en.md">English</a></sub>

<div align="center">

# dsh-session-watch

> *「侧边栏底部一行，把六种会话状态一起摆在眼前。」*

![DSH plugin](https://img.shields.io/badge/DSH-plugin-blueviolet)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![no state writes](https://img.shields.io/badge/session%20or%20archive%20writes-none-brightgreen)

**会话状态的仪表盘：运行中 / 未读 / 待处理 / 闲置 / 未归档 / 已归档，一眼看完。显示哪些、用哪种版式、多少算多了，全在设置里。它不归档、不删除、不落盘、不联网。**

[它解决什么问题](#它解决什么问题) · [六项计数怎么算](#六项计数怎么算) · [两种版式](#两种版式) · [快速开始](#快速开始) · [设置](#设置) · [安全边界](#安全边界) · [文件结构](#文件结构) · [验证与测试](#验证与测试)

</div>

---

## 它解决什么问题

DSH 侧边栏只回答「哪个会话在哪」，不回答「现在我手上到底压着什么」。

于是你总要靠翻列表来回忆：有几个还在跑？哪个跑完了没看？哪个卡在等我审批？上一个版本那个「未归档会话提醒」只数了一个维度，超阈值才亮一盏黄灯，信息太少。

dsh-session-watch 把六个数直接摆在侧边栏底部，常驻、实时、可裁剪：

| 计数 | 含义 | 数据来源 |
|---|---|---|
| 运行中 | 会话的 Agent 正在跑 | 官方会话 UI 状态的 `running` |
| 未读 | 在你没看的时候停下来、还没确认 | 官方会话 UI 状态的 `completionUnread` |
| 待处理 | 有审批 / 计划审阅 / 提问在等你回答 | 官方会话 UI 状态的 `pendingInteraction` |
| 闲置 | 上面三种都不是的未归档会话 | 由前几项派生 |
| 未归档 | 普通会话里不在归档集里的数量 | 官方会话列表 + Workspace 归档集 |
| 已归档 | 普通会话里在归档集里的数量 | 同上 |

**自闭合**：只读官方 shell 已经发布的三个快照（`useSessions` / `useSessionStatus` / `useWorkspaces`），不依赖任何其它插件，也不读别人的数据。

## 六项计数怎么算

- **范围**：只数「普通会话」——排除子代理子会话（它们属于父会话的工作），也排除空白的新建会话座位。
- **归档轴**：普通会话要么算「未归档」，要么算「已归档」，互斥。
- **活动轴**：未归档的普通会话按 `待处理 > 运行中 > 未读 > 闲置` 的优先级，恰好落进其中一类。所以四个活动项之和**恒等于**未归档数，不会把一个「一边跑一边等你审批」的会话数两遍。
- 状态流还没给出 `running` 时，回退到会话列表行自己的 running 标记。

口径只有一份实现：[`src/count.ts`](src/count.ts)，徽标与设置行共用；单测把每条边界都钉住。

## 两种版式

| 版式 | 形态 | 适合 |
|---|---|---|
| 胶囊 `chips`（默认） | 每个指标一个「图标 + 数字」小胶囊 | 想常驻盯着数字、颜色区分状态 |
| 比例条 `meter` | 运行/未读/待处理/闲置的堆叠比例条 + 下方完整数字 | 想一眼看出分布比例 |

侧边栏收成 56px 时，两者都折叠成同一个图标 + 未归档数角标；悬停或键盘聚焦会弹出完整读数（六个指标名 + 数字）。

## 快速开始

```sh
# 1) 从 npm 装
dsh plugin --profile web add dsh-session-watch

# 2) 直接从 GitHub 装（lib/ 随仓库提交，无需构建授权）
dsh plugin --profile web add github:d0ublecl1ck/dsh-session-watch
```

装完刷新窗口（Cmd+R）。之后可以直接对 Agent 说：

```text
现在有几个会话在跑？把「闲置」关掉，只留运行中、未读、待处理。
```

偏好也能手写进 profile 的 `cordis.patch.yml`（注意 **row id 就是设置命名空间**）：

```yaml
- id: session-watch
  name: dsh-session-watch
  config:
    threshold: 20
    variant: meter
    showIdle: false
```

## 设置

Settings → 通用 → **Session Watch 状态显示**：

- **版式**：胶囊 / 比例条 二选一，切换即时生效。
- **显示项目**：六个计数逐项开关，关掉的项在侧边栏不占位。
- **未归档告警阈值**：未归档数超过该值时，未归档项进入告警色；默认 10。

每一项都是本插件自己配置命名空间的 volatile 字段，改动经 Host settings 落进 profile patch。

## 安全边界

- **不写任何会话或归档状态**：没有 `archiveSession` / `unarchiveSession` / 删除调用。插件唯一的写入是你在设置里改的那几个偏好。
- **不联网**：客户端只读 shell 已发布的快照。
- **不落盘**：不建文件、不写 `localStorage`、不注册持久化 domain。
- **不静默误算**：六个数字只有一份实现，设置行与侧边栏读数共用。
- **与卸载解耦**：Host 没有服务本插件的配置命名空间时，设置行不注册（读数照常按默认偏好显示）。

## 文件结构

```text
src/index.ts                      host 半边：name / Config / apply（全部偏好字段均 volatile）
src/config.ts                     六项指标、Config 字段名、可见性默认值、版式清单（纯逻辑）
src/count.ts                      纯计数口径：countSessions 六项 + countUnarchived + 阈值归一
src/client/index.ts               浏览器半边：注册读数与设置行
src/client/StatusWatch.tsx        侧边栏底部读数（胶囊 / 比例条 / rail 三态）
src/client/SettingsRow.tsx        设置页偏好行（开关 + 版式 + 阈值）
src/client/config-source.ts       把 config form 投影成可订阅的偏好
src/client/use-counts.ts          从三个标准 hook 读出六项计数
src/client/summary.ts             指标名与一行摘要
src/client/icons.tsx              六个指标图标 + rail 标记
src/client/styles.ts              注入的 sw-* 样式（一次注入，fiber 卸载时移除）
scripts/build.mjs                 tsc + esbuild + __ModuleLoader__ 包装
scripts/check-release.mjs         发布前离线体检（清单 / 契约 / externals / 产物新鲜度）
scripts/replay-count.mjs          把实例的两个事实文件回放成本插件的计数
test/                             31 个 node:test 用例（口径、契约、SSR 真渲染）
cordis.patch.yml                  bundle 层：插入 row id 为 session-watch 的那一行
```

## 验证与测试

```sh
npm run verify        # typecheck + build + 31 个单测 + check-release
```

- **单测 31/31**：`test/count.test.mjs`（六项口径、分区不变量、边界）、`test/client-contract.test.mjs`（模块 id、inject、两次注册、配置写入字段映射）、`test/client-render.test.mjs`（`react-dom/server` 真渲染两种版式与设置行）。
- **发布前体检**：`npm run check-release` 拦住「改了 `src/` 忘了 `npm run build`」、`export default` 折掉 `inject`、浏览器产物 require 了 platform seed 之外的模块、以及 tarball 会漏掉 `cordis.patch.yml` 四类事故。
- **实例回放**：`scripts/replay-count.mjs` 把实例的会话列表与 `storages/workspace.json` 过一遍同一份计数实现（运行中回退到行标记；未读/待处理是纯客户端实时状态，离线回放恒为 0，请在侧边栏里读）。

## License

[MIT](LICENSE)
