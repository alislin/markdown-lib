# Markdown Theme SCSS 重构设计

## 概述

将现有的单文件 CSS 项目重构为模块化的 SCSS 项目，支持深色/浅色主题切换，输出多种目标文件。

## 背景

### 当前问题

- 单个 765 行 CSS 文件，浅色和深色样式混杂
- 深色模式样式通过嵌套 `@media (prefers-color-scheme: dark)` 实现，难以维护
- 无法灵活切换主题
- 无法按需加载
- 存在大量过时的浏览器前缀

### 使用场景

- VSCode Markdown 预览
- Obsidian 主题
- Docsify 样式
- 导出 HTML 样式引用

## 目标

1. 模块化：按功能拆分 SCSS 文件
2. 主题切换：支持用户设置 > VSCode 主题 > 系统主题优先级
3. 多输出：提供完整版、浅色版、深色版、无主题基础版
4. 优化：保留原有风格，优化对比度、可读性，清理过时代码

## 架构设计

### 目录结构

```
markdown-theme/
├── src/
│   └── scss/
│       ├── core/                        # 核心样式（无主题）
│       │   ├── _reset.scss             # 基础重置
│       │   ├── _typography.scss        # 排版（标题、段落、列表）
│       │   ├── _code.scss              # 代码块
│       │   ├── _tables.scss           # 表格
│       │   ├── _forms.scss            # 表单
│       │   ├── _blockquote.scss       # 引用
│       │   ├── _images.scss           # 图片
│       │   └── _utilities.scss        # 工具类（flex、row 等）
│       ├── themes/
│       │   ├── _variables-light.scss   # 浅色主题变量
│       │   ├── _variables-dark.scss    # 深色主题变量
│       │   └── _theme-mixin.scss       # 主题应用 mixin
│       ├── md-green.scss              # 完整版入口
│       ├── md-green-light.scss        # 仅浅色
│       ├── md-green-dark.scss         # 仅深色
│       └── md-green-base.scss         # 无主题基础版
├── dist/                              # 编译输出
│   ├── md-green.css
│   ├── md-green-light.css
│   ├── md-green-dark.css
│   └── md-green-base.css
├── package.json
├── build.js                           # 构建脚本
└── README.md
```

### 模块职责

| 模块 | 职责 |
|------|------|
| `_reset.scss` | 基础重置、box-sizing |
| `_typography.scss` | 标题、段落、列表、链接、水平线、定义列表 |
| `_code.scss` | 内联代码、代码块 |
| `_tables.scss` | 表格样式 |
| `_forms.scss` | 输入框、按钮、选择框 |
| `_blockquote.scss` | 引用块 |
| `_images.scss` | 图片样式 |
| `_utilities.scss` | 工具类（.row, .col, flex 等） |

## 主题系统

### 变量体系

使用 CSS 自定义属性实现主题切换：

```scss
// 语义化变量
:root {
  // 背景色
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f7f7f7;
  
  // 文本色
  --color-text-primary: #444444;
  --color-text-secondary: #666666;
  --color-text-muted: #999999;
  
  // 标题色
  --color-heading: #111111;
  
  // 链接色
  --color-link: #0099ff;
  --color-link-hover: #ff6600;
  --color-link-visited: purple;
  
  // 代码色
  --color-code-bg: #f7f7f7;
  --color-code-text: #F44336;
  --color-code-border: #6CE26C;
  
  // 引用块
  --color-blockquote-border: rgb(9, 180, 66);
  --color-blockquote-bg: rgb(244, 255, 244);
  
  // 边框
  --color-border: #EFEAEA;
  
  // 间距
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  // 圆角
  --radius-sm: 3px;
  --radius-md: 4px;
  --radius-lg: 6px;
}
```

### 主题切换优先级

1. **用户手动设置**（最高）- 通过 `[data-theme="dark/light"]` 属性
2. **系统主题** - 通过 `prefers-color-scheme` 媒体查询
3. **默认浅色**（最低）

```scss
// 浅色变量（默认）
:root {
  --color-bg-primary: #ffffff;
  // ...
}

// 系统深色主题
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: #1a1a1a;
    // ...
  }
}

// 手动深色（优先级最高）
[data-theme="dark"] {
  --color-bg-primary: #1a1a1a;
  // ...
}

// 手动浅色
[data-theme="light"] {
  --color-bg-primary: #ffffff;
  // ...
}
```

### 使用方式

**完整版（自动切换）：**
```html
<link rel="stylesheet" href="md-green.css">
<!-- 跟随系统自动切换 -->
```

**手动切换：**
```html
<html data-theme="dark">
<!-- 或 -->
<html data-theme="light">
```

**仅单一主题：**
```html
<link rel="stylesheet" href="md-green-dark.css">
<!-- 始终深色，无切换逻辑 -->
```

## 构建系统

### 依赖

```json
{
  "devDependencies": {
    "sass": "^1.x"
  }
}
```

### 构建脚本

```javascript
// build.js
const sass = require('sass');
const fs = require('fs');
const path = require('path');

const targets = [
  { input: 'md-green.scss', output: 'md-green.css' },
  { input: 'md-green-light.scss', output: 'md-green-light.css' },
  { input: 'md-green-dark.scss', output: 'md-green-dark.css' },
  { input: 'md-green-base.scss', output: 'md-green-base.css' },
];

targets.forEach(({ input, output }) => {
  const result = sass.compile(`src/scss/${input}`, {
    style: 'compressed',
  });
  fs.writeFileSync(`dist/${output}`, result.css);
});
```

### 输出文件

| 文件 | 说明 | 预估大小 |
|------|------|----------|
| `md-green.css` | 完整版（含浅色+深色自动切换） | ~12KB |
| `md-green-light.css` | 仅浅色模式 | ~6KB |
| `md-green-dark.css` | 仅深色模式 | ~6KB |
| `md-green-base.css` | 无主题基础版（仅布局+变量声明） | ~5KB |

## 优化项

### 保留内容

- 原有设计风格（颜色、间距、字体）
- 响应式布局
- 绿色主题色（边框、引用块等）

### 优化内容

1. **对比度优化**
   - 深色模式链接调整为 WCAG AA 标准
   - 代码高对比度配色

2. **清理过时代码**
   - 移除 `-khtml-`、旧版 `-moz-`、`-webkit-` 前缀
   - 简化 CSS 渐变语法
   - 移除 IE 特定 hack（如 `*zoom`）

3. **代码规范化**
   - 统一使用 CSS 变量
   - 一致的命名约定

## 文件拆分映射

| 原文件内容 | 目标模块 |
|------------|----------|
| body 基础样式 | `_reset.scss` + `_typography.scss` |
| h1-h5 标题 | `_typography.scss` |
| a 链接 | `_typography.scss` |
| ul/ol 列表 | `_typography.scss` |
| code/pre 代码 | `_code.scss` |
| blockquote | `_blockquote.scss` |
| hr | `_typography.scss` |
| dl/dt/dd | `_typography.scss` |
| table | `_tables.scss` |
| form 元素 | `_forms.scss` |
| img | `_images.scss` |
| .row/.col | `_utilities.scss` |
| 深色模式 @media | `themes/_variables-dark.scss` |

## 验收标准

1. 四种输出文件均可正常编译
2. 完整版支持自动主题切换和手动覆盖
3. 浅色版/深色版固定主题，无切换逻辑
4. 基础版仅包含布局和变量声明
5. 所有原有样式效果保持一致
6. 对比度符合 WCAG AA 标准

## 风险与缓解

| 风险 | 缓解措施 |
|------|----------|
| CSS 变量兼容性 | 目标平台均支持，无需处理 IE |
| 样式拆分遗漏 | 完整对照原文件逐项检查 |
| 主题切换不生效 | 明确优先级，测试各种场景 |

## 后续扩展

- 支持自定义主题（用户提供变量覆盖）
- 添加更多预设主题色（蓝、紫等）
- 输出 Source Map 便于调试