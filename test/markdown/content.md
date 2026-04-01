# MD-Green Theme

一个支持深浅色主题切换的 Markdown 样式库。

## 特性

- 自动跟随系统主题
- 支持手动切换主题
- CSS 变量便于自定义
- 模块化 SCSS 源码

## 快速开始

### 安装

```bash
npm install md-green-theme
```

### 使用

```html
<link rel="stylesheet" href="md-green.css">
```

## 主题切换

手动切换主题：

```html
<html data-theme="dark">  <!-- 强制深色 -->
<html data-theme="light"> <!-- 强制浅色 -->
```

## CSS 变量

覆盖默认变量：

```css
:root {
  --md-bg-primary: #your-color;
  --md-text-primary: #your-color;
}
```

## 可用变量

| 变量名 | 说明 | 默认值 |
|-------|------|--------|
| `--md-bg-primary` | 主背景色 | `#ffffff` |
| `--md-bg-secondary` | 次要背景色 | `#f7f7f7` |
| `--md-text-primary` | 主文本色 | `#444444` |
| `--md-text-heading` | 标题色 | `#111111` |
| `--md-link` | 链接色 | `#0099ff` |
| `--md-code-text` | 代码色 | `#F44336` |

## 输出文件

| 文件 | 大小 | 说明 |
|-----|------|-----|
| md-green.css | ~11KB | 完整版 |
| md-green-light.css | ~7KB | 浅色版 |
| md-green-dark.css | ~6KB | 深色版 |
| md-green-base.css | ~7KB | 基础版 |

## 许可证

MIT