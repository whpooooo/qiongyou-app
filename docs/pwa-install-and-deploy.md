# Android 与 iOS 安装说明

PWA 必须通过 HTTPS 地址打开才能安装和离线使用。直接双击本机的 `index.html` 只能作为网页预览，不能安装到手机主屏幕。

## Android Chrome

1. 使用 Android Chrome 打开部署后的 HTTPS 地址。
2. 等待首页完整加载。
3. 点击浏览器右上角菜单。
4. 选择“安装应用”或“添加到主屏幕”。
5. 确认安装。
6. 从桌面点击“下一站”图标启动。

安装后以独立窗口运行，不需要先打开 Chrome 标签页。

## iPhone / iPad Safari

1. 使用 Safari 打开部署后的 HTTPS 地址。
2. 点击底部或顶部的“分享”按钮。
3. 找到并点击“添加到主屏幕”。
4. 确认名称为“下一站未知”。
5. 点击“添加”。
6. 从桌面点击图标启动。

注意：iOS 必须使用 Safari。Chrome 或微信内置浏览器通常无法完成 iOS 主屏幕安装。

## 离线验证

1. 首次打开后停留几秒，让 Service Worker 完成缓存。
2. 关闭页面。
3. 暂时关闭手机网络或开启飞行模式。
4. 从主屏幕图标重新打开。
5. 首页、路线规划、推荐、社区示例、收藏和已保存内容应仍可打开。

第一次访问必须联网。离线缓存只能保存已经成功下载的资源。

## 数据保存

- 保存方案、收藏、模拟发布和点赞保存在浏览器本地。
- 清理浏览器数据、卸载 PWA 或部分系统存储回收可能清除数据。
- 跨手机同步和永久保存需要后续接入账号与云端数据库。

## GitHub Pages 部署

### 1. 修改 Git 身份

在项目目录运行：

```powershell
git config user.name "你的名字"
git config user.email "你的 GitHub 邮箱或 no-reply 邮箱"
```

### 2. 创建 GitHub 仓库

在 GitHub 创建一个空仓库，不要勾选自动生成 README、License 或 `.gitignore`。

### 3. 推送本地项目

把 `<用户名>` 和 `<仓库名>` 替换为实际值：

```powershell
git remote add origin https://github.com/<用户名>/<仓库名>.git
git branch -M main
git push -u origin main
```

如果已经存在 origin，改用：

```powershell
git remote set-url origin https://github.com/<用户名>/<仓库名>.git
git push -u origin main
```

### 4. 启用 GitHub Pages

1. 进入 GitHub 仓库的 `Settings`。
2. 打开左侧 `Pages`。
3. 在 `Build and deployment` 中选择 `Deploy from a branch`。
4. 分支选择 `main`。
5. 目录选择 `/ (root)`。
6. 点击 `Save`。
7. 等待部署完成。

部署地址通常是：

```text
https://<用户名>.github.io/<仓库名>/
```

### 5. 手机验证

- Android：用 Chrome 打开部署地址并安装应用。
- iPhone：用 Safari 打开部署地址并添加到主屏幕。

## 更新版本

修改网页后：

```powershell
git add --all
git commit -m "update: describe your change"
git push
```

GitHub Pages 更新后，重新打开 PWA 即可获取新版本。若缓存还没有更新，可以关闭应用后再次打开，或在浏览器中强制刷新。