# 穷游 APP PWA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有手机网页原型升级为可从 Android Chrome 和 iOS Safari 安装、可离线打开、后续可部署到 GitHub Pages 的 PWA。

**Architecture:** 保持纯静态 HTML/CSS/JavaScript。通过 `manifest.webmanifest` 提供安装元数据，通过 `service-worker.js` 缓存应用外壳，通过 PNG 主屏幕图标适配 Android 和 iOS，并使用 PowerShell 静态检查脚本验证 PWA 完整性。

**Tech Stack:** HTML5、CSS3、原生 JavaScript、Web App Manifest、Service Worker、PowerShell、Microsoft Edge Headless。

**Spec:** `docs/superpowers/specs/2026-09-26-qiongyou-app-mvp-design.md`

## Global Constraints

- PWA 继续使用本地资源，不依赖 CDN。
- 不改变现有规划、推荐、社区、收藏和模拟数据行为。
- 通过 `file://` 打开时，所有原功能继续工作；仅跳过 Service Worker 注册。
- Service Worker 只在 HTTPS 或 localhost 注册。
- 不使用推送通知、后台同步或原生权限。
- Android 和 iOS 图标必须使用不透明 PNG，尺寸至少 180、192 和 512。
- 应用名称使用“下一站未知”，短名称使用“下一站”。
- 主题色使用 `#ff5a36`，背景色使用 `#fffdf8`。
- 所有路径使用相对路径，确保 GitHub Pages 子目录部署可用。
- 每个任务完成后运行 `tests/run-tests.ps1`，最后必须为 `FAIL 0`。

---

### Task 1: Manifest、iOS 元数据与图标

**Files:**
- Create: `manifest.webmanifest`
- Create: `assets/icons/icon-192.png`
- Create: `assets/icons/icon-512.png`
- Create: `assets/icons/maskable-512.png`
- Create: `assets/icons/apple-touch-icon.png`
- Create: `tools/generate-pwa-icons.ps1`
- Modify: `index.html`

- [ ] **Step 1: 写静态失败检查**

创建 `tests/check-pwa.ps1`，检查 `manifest.webmanifest`、四个 PNG 图标和 iOS 元数据。

- [ ] **Step 2: 运行并确认失败**

Run: `tests/check-pwa.ps1`
Expected: 报告 manifest 或图标文件缺失。

- [ ] **Step 3: 生成图标和 manifest**

`manifest.webmanifest` 必须包含：

```json
{
  "name": "下一站未知",
  "short_name": "下一站",
  "start_url": "./index.html",
  "scope": "./",
  "display": "standalone",
  "background_color": "#fffdf8",
  "theme_color": "#ff5a36",
  "lang": "zh-CN",
  "icons": [
    { "src": "assets/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "assets/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "assets/icons/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

图标使用 PowerShell `System.Drawing` 生成，画面为暖色天空、山形和路线点，不包含文字。

- [ ] **Step 4: 更新 index.html**

加入 manifest、theme-color、apple-touch-icon、mobile-web-app-capable 和 apple-mobile-web-app 相关元数据。

- [ ] **Step 5: 验证**

Run: `tests/check-pwa.ps1` 和 `tests/run-tests.ps1`
Expected: PWA 检查通过，原有测试保持 `FAIL 0`。

---

### Task 2: Service Worker 离线缓存

**Files:**
- Create: `service-worker.js`
- Modify: `js/app.js`
- Modify: `tests/check-pwa.ps1`

- [ ] **Step 1: 添加失败检查**

检查 `service-worker.js` 存在，并检查缓存清单包含 `index.html`、`styles.css`、全部 `js`、全部 `data`、全部 `ui`、9 张 SVG 和图标文件。

- [ ] **Step 2: 实现 Service Worker**

使用版本化缓存 `qiongyou-pwa-v1`。Install 阶段预缓存程序资源；Activate 阶段删除旧缓存；Fetch 阶段对同源 GET 请求使用缓存优先并回退网络；页面导航离线时返回缓存的 `index.html`。

- [ ] **Step 3: 注册 Service Worker**

在 `js/app.js` 中仅当 `location.protocol === 'https:'` 或主机为 `localhost`、`127.0.0.1` 时注册 `./service-worker.js`。注册失败只记录控制台警告，不影响网页功能。

- [ ] **Step 4: 验证**

Run: `tests/check-pwa.ps1` 和 `tests/run-tests.ps1`
Expected: 所有检查通过。

---

### Task 3: iOS/Android 安装说明与 GitHub Pages

**Files:**
- Create: `docs/pwa-install-and-deploy.md`
- Modify: `README.md`

- [ ] **Step 1: 写安装说明**

文档说明 Android Chrome 和 iOS Safari 的安装步骤、HTTPS 要求和本地数据限制。

- [ ] **Step 2: 写 GitHub Pages 步骤**

文档包含创建 GitHub 仓库、添加 remote、推送 `main`、在仓库设置中启用 Pages、选择 `Deploy from a branch`、分支 `main`、目录 `/ (root)`。

- [ ] **Step 3: 验证文档与实际文件一致**

逐项检查文档中的文件名、分支名和路径与项目一致。

---

### Task 4: 最终提交

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: 清理临时文件**

确认没有预览、测试输出或临时图标文件进入仓库。

- [ ] **Step 2: 运行全部测试**

Run: `powershell -ExecutionPolicy Bypass -File '.\tests\run-tests.ps1'`
Expected: `TEST_RESULTS: PASS <数量> FAIL 0`。

Run: `powershell -ExecutionPolicy Bypass -File '.\tests\check-pwa.ps1'`
Expected: `PWA_CHECKS: PASS`。

- [ ] **Step 3: 提交 Git**

使用本地 Git 提交 PWA 功能。