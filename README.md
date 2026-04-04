# MD-Green Markdown Theme

[![npm version](https://img.shields.io/npm/v/md-green-theme.svg)](https://www.npmjs.com/package/md-green-theme)

一个支持深浅色主题切换的 Markdown 样式库，适用于 VSCode、Obsidian、Docsify 等环境。

## 安装

下载 `dist/` 目录下的 CSS 文件，或通过 npm 安装：

```bash
npm install md-green-theme
```

## CDN 引用

通过 jsDelivr 引入：

```html
<!-- 最新版本 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/md-green-theme@latest/dist/md-green.css">

<!-- 指定版本（推荐用于生产环境） -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/md-green-theme@1.0.2/dist/md-green.css">
```

可选主题文件：
- `md-green.css` - 完整版（自动主题切换）
- `md-green-light.css` - 仅浅色模式
- `md-green-dark.css` - 仅深色模式

## 使用方式

### 完整版（自动主题切换）

```html
<link rel="stylesheet" href="md-green.css">
```

自动跟随系统主题切换深浅色。

### 手动切换主题

```html
<html data-theme="dark">
<!-- 强制深色 -->
<html data-theme="light">
<!-- 强制浅色 -->
```

### 单主题版本

- `md-green-light.css` - 仅浅色模式
- `md-green-dark.css` - 仅深色模式
- `md-green-base.css` - 无主题基础版（需自定义变量）

## 自定义主题

覆盖 CSS 变量：

```css
:root {
  --md-bg-primary: #your-color;
  --md-text-primary: #your-color;
  /* ... */
}
```

## 构建

```bash
npm run build    # 编译所有版本
npm run watch    # 监听文件变化
```

## 许可证

MIT