# Tracewright Recorder 发布前 Checklist

## 功能

- [x] 可以开始、暂停、继续、停止录制。
- [x] 可以记录导航、点击、输入、选择和键盘操作。
- [x] 可以生成 Playwright TypeScript 测试代码。
- [x] 可以复制代码和下载 `.spec.ts` 文件。
- [x] 可以保存和清除本地录制历史。
- [x] 密码和 token 类输入默认脱敏。

## 权限

- [x] 使用 `activeTab`、`scripting`、`storage`、`tabs`、`downloads`。
- [x] 不申请 `<all_urls>`。
- [x] 不声明常驻 content scripts。
- [x] 构建产物 manifest 已检查。

## 验证

- [x] `pnpm typecheck`
- [x] `pnpm lint`
- [x] `pnpm test`
- [x] `pnpm build:chrome`
- [x] `pnpm build:edge`
- [x] `pnpm build:firefox`
- [x] `pnpm test:e2e`
- [x] `pnpm test:e2e:smoke`

## 商店素材

- [x] 图标已生成并替换 `public/icon-16.png`、`public/icon-32.png`、`public/icon-48.png`、`public/icon-128.png`。
- [x] 商店截图已放入 `store-assets/generated/`。
- [x] 实际界面截图已放入 `store-assets/captures/`。
- [x] release zip 已重新生成，且最终 manifest 不包含 `host_permissions`。

## 手动测试

- [x] Chrome 加载已解压扩展目录 `manual-load/chrome-mv3` 成功。
- [x] 用户手动录制流程通过。
