# dsh-unarchived-watch

DSH Web 插件：**未归档会话数超过阈值时，在侧边栏底部显示一个警告图标**；阈值可以在设置页里改。

- 位置：侧边栏底部、Settings 旁边（`sidebar.footer.action`），黄色警告三角。
- 阈值：默认 **10**，设置页 → 通用 → 「未归档会话提醒」里可改，改动立即生效。
- 计数：页面加载后实时跟随会话列表与归档状态，不需要刷新。

## 计数口径

「未归档的会话」= 会话列表里的**普通会话**，排除这三类：

1. **已归档**的会话（这正是本插件要提醒的清理对象）；
2. **子代理子会话**（`origin: 'subagent'` 或带 `parentId`），它们是父会话工作的一部分；
3. **空白新建会话**（`blank: true`），即侧边栏的 New Session 占位。

判定规则集中在 [`src/count.ts`](src/count.ts)，浏览器半边与单测共用同一份实现。

## 安装

```sh
dsh plugin --profile web add <本仓库的绝对路径>
```

装完刷新浏览器窗口（Cmd+R）即可加载客户端半边。

## 配置

设置页里改最方便。也可以直接写在 profile 的 `cordis.patch.yml`：

```yaml
- id: unarchived-watch
  name: dsh-unarchived-watch
  config:
    threshold: 20
```

**row id 就是设置命名空间**：客户端用 `configForms.get('unarchived-watch')` 读写这个配置。改掉 row id 就会同时改掉设置页的命名空间。

## 开发

```sh
npm install
npm run verify   # typecheck + build + 单测
```

- `src/index.ts` —— host 半边：只导出 `name` / `Config` / `apply`。`threshold` 声明为 volatile 字段，dsh-settings 才会把它投影进设置命名空间。
- `src/count.ts` —— 纯计数与阈值规则（无框架依赖，单测直接打它）。
- `src/client/index.ts` —— 浏览器半边：注册侧边栏图标与设置行。
- `src/client/threshold.ts` —— 把 config form 投影成可订阅的阈值。
- `src/client/WarningBadge.tsx` / `ThresholdRow.tsx` —— 两个可见面。
- `lib/` 是构建产物：改 `src/` 后必须 `npm run build`，否则安装方拿到旧 bundle。
- 客户端产物由 `scripts/build.mjs` 用 esbuild 打包后包进 `window.__ModuleLoader__.load({ id, factory })`；React 与平台模块保持 external。

## 测试

`node --test`，21 个用例：

- `test/count.test.mjs` —— 计数、归一化、阈值边界。
- `test/client-contract.test.mjs` —— 加载真实 `lib/client.js`，验证模块 id、`apply`/`inject` 契约与两次注册。
- `test/client-render.test.mjs` —— 用 react-dom/server 真渲染两个组件：阈值内不显示、越线显示、归档与子会话不计入、设置行显示当前值与输入框。

浏览器端只能由真实页面最终确认（本仓库的单测覆盖到「组件渲染出什么」为止，不覆盖浏览器里的 slot 挂载）。
