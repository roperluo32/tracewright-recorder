# Tracewright Recorder 开发计划

当前版本定位为完全免费的本地 Playwright 测试录制与导出插件，优先服务开发者、QA 工程师和小型研发团队。

## 1. 产品定位

### 核心目标

- 用户在当前网页上手动操作，插件记录关键交互步骤。
- 将操作步骤转换为可读、可编辑、可运行的 Playwright 测试代码。
- 尽量在本地完成录制、整理和导出，不上传页面内容或用户操作数据。
- 第一版免费发布，重点验证安装量、真实使用场景和代码导出质量。

### 目标用户

| 用户 | 主要需求 |
|---|---|
| 前端开发者 | 快速生成回归测试初稿，减少手写 selector 和动作代码。 |
| QA 工程师 | 把手工验收流程沉淀为 Playwright 自动化脚本。 |
| 独立开发者 | 不搭复杂工具链，也能快速保存关键路径测试。 |
| 小团队 | 用低成本方式建立基本 E2E 覆盖。 |

### 产品差异点

- 重点不是替代 Playwright 官方 codegen，而是做成浏览器插件里的轻量工作流。
- 更强调 selector 可读性、步骤整理、断言建议和导出体验。
- 默认低权限、低风险、无账号、无远程服务。

## 2. MVP 免费功能

### 必做功能

- 当前标签页开始 / 暂停 / 停止录制。
- 记录点击、输入、选择、提交、键盘快捷键等基础交互。
- 记录页面导航和 URL 变化。
- 生成 Playwright TypeScript 测试代码。
- 提供 selector 候选优先级：role / label / text / test id / css fallback。
- 在 popup 中展示已录制步骤列表。
- 支持删除单个步骤、清空录制、复制代码。
- 支持下载 `.spec.ts` 文件。
- 支持本地录制历史。
- 支持多语言 UI 与多语言商店素材。

### 可选增强

- 自动生成基础断言建议，例如 `expect(page).toHaveURL(...)`。
- 对输入密码类字段做自动脱敏，不保存真实值。
- 支持用户配置 test id attribute，例如 `data-testid`、`data-test`。
- 支持导出为 Playwright Test runner 格式和简洁脚本格式。

### 明确不包含

- 不包含账号系统。
- 不包含云端同步。
- 不包含远程执行测试。
- 不自动上传 DOM、截图、用户输入或测试代码。
- 不做跨站批量爬取。
- 不注入第三方分析 SDK。

## 3. 权限与隐私策略

### Manifest 权限原则

- 优先使用 `activeTab` + `scripting`。
- 只在用户点击录制后注入 content script。
- 不申请 `<all_urls>`，除非后续明确需要并能解释用途。
- 如需保存历史，只使用 `storage`。
- 如需下载文件，只使用 `downloads`，并在文案中解释用途。

### 隐私承诺

- 录制数据默认只保存在本机浏览器存储中。
- 密码字段、隐藏字段、疑似 token 字段默认不保存明文。
- 不收集浏览历史。
- 不将页面内容发送到服务器。
- 用户可一键清空录制历史。

## 4. 核心架构

推荐数据流：

```text
用户操作事件 -> content script 采集 -> selector 生成器 -> 结构化步骤 -> popup 展示 -> 代码生成器 -> 复制 / 下载
```

避免模式：

```text
content script 拼接代码字符串 -> popup 原样展示 -> 难以测试和重构
```

### 推荐项目结构

```text
tracewright-recorder/
  entrypoints/
    background.ts
    content.ts
    popup/
      App.tsx
      index.html
      main.tsx
    options/
      App.tsx
      index.html
      main.tsx
  src/
    core/
      events/
        normalizeEvent.ts
        eventBuffer.ts
      selectors/
        getRoleSelector.ts
        getLabelSelector.ts
        getTextSelector.ts
        getTestIdSelector.ts
        getCssFallback.ts
        chooseSelector.ts
      generator/
        generatePlaywrightSpec.ts
        generateAssertions.ts
      recorder/
        recorderState.ts
        sanitizeInput.ts
      history/
        recordingHistory.ts
    shared/
      browser.ts
      messages.ts
      storage.ts
      types.ts
      i18n.ts
    ui/
      components/
      styles/
  tests/
    fixtures/
      login-form.html
      ecommerce-flow.html
      keyboard-form.html
      dynamic-list.html
    unit/
    e2e/
  public/
    _locales/
    icon-16.png
    icon-48.png
    icon-128.png
  docs/
    tracewright-recorder-plan.md
    store-listing-localized.md
    privacy-policy.md
    release-checklist.md
  wxt.config.ts
  package.json
```

## 5. Task 拆分

### Phase 0：产品与命名确认

| Task | 产出 | 验收标准 |
|---|---|---|
| 确认正式名称 | 插件名称、短名、slug | Chrome / Edge / Firefox 文案可复用。 |
| 明确免费版范围 | MVP 功能列表 | 不含账号、云同步、远程执行。 |
| 确认商店分类 | 开发者工具分类 | 三大商店分类选择一致或有记录。 |
| 初版风险评估 | 权限、隐私、政策风险清单 | 无明显高风险方向。 |

### Phase 1：项目脚手架

| Task | 产出 | 验收标准 |
|---|---|---|
| 初始化 WXT + React + TypeScript | 可运行项目 | `pnpm dev` 可启动。 |
| 建立共享浏览器 API 封装 | `src/shared/browser.ts` | 代码中不散落直接 API 调用。 |
| 配置多浏览器构建 | Chrome / Edge / Firefox scripts | 三个目标都能生成 manifest。 |
| 建立 ESLint / Prettier / Vitest | 基础质量工具 | typecheck、lint、test 命令存在。 |
| 建立本地化结构 | `_locales` 与 i18n 工具 | 至少包含 en、zh_CN。 |

### Phase 2：录制核心

| Task | 产出 | 验收标准 |
|---|---|---|
| 设计录制步骤类型 | `RecordingStep` 类型 | click、fill、select、press、navigate 可表达。 |
| 实现事件标准化 | `normalizeEvent.ts` | DOM event 可转为统一结构。 |
| 实现录制状态机 | `recorderState.ts` | start、pause、resume、stop 行为稳定。 |
| 实现输入脱敏 | `sanitizeInput.ts` | password/token/secret 不保存明文。 |
| 实现事件去噪 | `eventBuffer.ts` | 输入连续字符合并为一个 fill 步骤。 |

### Phase 3：Selector 生成

| Task | 产出 | 验收标准 |
|---|---|---|
| role selector | `getRoleSelector.ts` | button/link/textbox 等常见元素可生成。 |
| label selector | `getLabelSelector.ts` | 表单输入优先使用 label。 |
| text selector | `getTextSelector.ts` | 文本按钮和链接可读性好。 |
| test id selector | `getTestIdSelector.ts` | 支持可配置 test id attribute。 |
| CSS fallback | `getCssFallback.ts` | 无语义信息时仍能定位。 |
| selector 选择器 | `chooseSelector.ts` | 按稳定性和可读性排序。 |

### Phase 4：代码生成

| Task | 产出 | 验收标准 |
|---|---|---|
| 生成 Playwright spec | `generatePlaywrightSpec.ts` | 输出可格式化、可运行的 `.spec.ts`。 |
| 生成导航代码 | `page.goto` / URL 断言 | URL 变化表达准确。 |
| 生成交互代码 | click / fill / selectOption / press | 常见交互映射正确。 |
| 生成基础断言建议 | `generateAssertions.ts` | 不过度生成脆弱断言。 |
| 代码复制与下载 | popup 操作 | 用户可复制或下载 spec。 |

### Phase 5：Popup 与 Options UI

| Task | 产出 | 验收标准 |
|---|---|---|
| Popup 录制控制 | 开始、暂停、停止按钮 | 状态变化清晰。 |
| 步骤列表 | 可查看、删除、清空 | 操作不会破坏剩余步骤。 |
| 代码预览 | 语法高亮或等宽展示 | 长代码可滚动阅读。 |
| 历史记录入口 | 最近录制列表 | 可恢复或删除记录。 |
| Options 设置 | test id attribute、历史保留数量 | 设置保存后立即影响生成逻辑。 |

### Phase 6：测试体系

| Task | 产出 | 验收标准 |
|---|---|---|
| selector 单元测试 | Vitest tests | role/label/text/test id/css fallback 覆盖。 |
| generator 单元测试 | 快照或字符串断言 | 生成代码稳定可读。 |
| sanitize 单元测试 | 敏感输入 fixture | 不泄露密码和 token。 |
| fixture 页面测试 | 本地 HTML fixtures | 登录表单、电商流程、键盘表单覆盖。 |
| Playwright E2E | 加载插件自动化测试 | popup 录制、复制、下载路径可验证。 |
| manifest 权限检查 | 脚本或测试 | release 包不含宽权限。 |

### Phase 7：本地化与商店材料

| Task | 产出 | 验收标准 |
|---|---|---|
| UI 多语言 | `_locales` messages | en、zh_CN、zh_TW、ja、ko、de、fr、es、pt_BR 完整。 |
| 商店文案 | `store-listing-localized.md` | 标题、短描述、长描述齐全。 |
| 隐私政策 | `privacy-policy.md` 和 `site/privacy.html` | 明确本地处理和权限用途。 |
| 服务条款 | `terms.md` | 免费版边界清晰。 |
| 截图脚本 | store assets | 多语言图不溢出、不乱码。 |

### Phase 8：构建与发布准备

| Task | 产出 | 验收标准 |
|---|---|---|
| Chrome 构建 | chrome zip | manifest 和权限检查通过。 |
| Edge 构建 | edge zip | 包名、描述、图标完整。 |
| Firefox 构建 | firefox zip | MV2/MV3 兼容性确认。 |
| Release checklist | `release-checklist.md` | 上传前逐项勾选。 |
| GitHub 仓库准备 | 独立 repo | README、docs、privacy 同步。 |
| 审核备注 | 三大商店提交说明 | 说明 activeTab、storage、downloads 用途。 |

## 6. 第一版验收标准

- TypeScript typecheck 通过。
- ESLint 通过。
- Vitest 单元测试通过。
- Playwright E2E 测试通过。
- Chrome / Edge / Firefox 构建通过。
- release zip 内 manifest 权限符合最小化原则。
- UI 和商店文案至少覆盖 9 种语言。
- 隐私政策公开可访问。
- 不包含账号、远程授权、云同步、分析 SDK。

## 7. 发布前建议命令

```bash
pnpm exec wxt prepare
pnpm typecheck
pnpm lint
pnpm test
pnpm build:chrome
pnpm build:edge
pnpm build:firefox
pnpm test:e2e
```

发布包生成后继续检查：

```bash
cat .output/chrome-mv3/manifest.json
cat .output/edge-mv3/manifest.json
cat .output/firefox-mv2/manifest.json
rg "http://\*/\*|https://\*/\*|<all_urls>|host_permissions|content_scripts" .output release
```

## 8. 未来增长候选

以下能力只作为未来方向，不进入第一版门槛：

- 多测试用例项目管理。
- 自动生成 Page Object Model。
- AI 辅助整理步骤和断言。
- 团队共享测试片段。
- GitHub Actions 配置生成。
- 录制结果同步到云端工作区。
- 录制失败回放和截图对比。
- 与 Playwright Trace Viewer 深度集成。

## 9. 复用第一款插件经验

- 从第一天开始做多语言，不等上架前补。
- 商店截图单独设计，不直接拿 popup 截图充数。
- 文案、权限说明、隐私政策必须与实际 manifest 保持一致。
- 核心逻辑保持纯函数，优先可单元测试。
- activeTab 优先，避免所有网站权限。
- 构建后检查最终 manifest，而不是只看源码配置。
- 生成 zip 前必须完整跑 typecheck、lint、test、build、e2e。
- Chrome、Firefox、Edge 的商店材料分别检查，不假设一个市场通过另一个也完整。
