# 穷游路线规划 Web 原型

面向国内学生和年轻背包客的手机优先 Web 原型，包含路线规划、途径点、三套方案比较、“下一站，未知”目的地推荐和“旅人现场”路线社区。

## 当前范围

- 支持所有省级行政中心省会、首府、直辖市和热门旅游城市。
- 城市间交通、票价、耗时和游玩费用均为模拟预估。
- 不开放组队、实名认证、站内支付或订单售后。
- 没有真实数据权限前，购票按钮只提示“官方购票渠道尚未接入”。
- 保存方案、收藏、发布、点赞和评论只保存在当前浏览器。
- 首页、热门路线、目的地推荐、路线详情和社区精选使用本地原创 SVG 风景插画。

## 运行

直接双击 `index.html` 即可。

也可以在 PowerShell 中运行：

```powershell
Start-Process '.\index.html'
```

页面不需要安装依赖，也不需要启动本地服务器。

## 测试

```powershell
powershell -ExecutionPolicy Bypass -File '.\tests\run-tests.ps1'
```

成功输出必须包含：

```text
TEST_RESULTS: PASS <数量> FAIL 0
```

测试使用 Microsoft Edge 的无头模式，不会打开可见浏览器窗口。

## PWA 安卓与 iOS

项目已经具备 PWA 配置：

- Android 可通过 Chrome 安装到主屏幕。
- iPhone 和 iPad 可通过 Safari 的“添加到主屏幕”安装。
- 安装和离线缓存需要 HTTPS，不能通过本地 `file://` 启用。
- 安装步骤和 GitHub Pages 部署方式见 `docs/pwa-install-and-deploy.md`。

PWA 完整性检查：

```powershell
powershell -ExecutionPolicy Bypass -File '.\tests\check-pwa.ps1'
```

成功输出：

```text
PWA_CHECKS: PASS
```
## 主要目录

- `index.html`：应用入口。
- `manifest.webmanifest`：PWA 安装配置。
- `service-worker.js`：离线缓存服务。
- `styles.css`：移动端样式。
- `assets/images`：本地 SVG 风景插画。
- `assets/icons`：安卓和 iOS 主屏幕图标。
- `js/core`：路线、推荐、社区、存储、视觉、接口和记录逻辑。
- `js/data`：城市、热门路线和社区种子数据。
- `js/ui`：各页面渲染与交互。
- `docs/superpowers/specs`：产品设计稿。
- `docs/superpowers/plans`：实施计划。
- `tests`：无依赖测试和测试脚本。

## 当前限制

- 图片为原型插画，不是最终实拍照片。
- 路线结果用于验证产品流程，不能作为真实出行或购票依据。
- 实时班次和官方购票入口需要后续接入有授权的数据服务。