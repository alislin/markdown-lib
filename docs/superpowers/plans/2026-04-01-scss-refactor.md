# Markdown Theme SCSS 重构实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将单文件 CSS 重构为模块化 SCSS 项目，支持深浅主题切换，输出四种目标文件。

**Architecture:** SCSS 模块化 + CSS 变量主题系统。核心样式按功能拆分，主题变量通过 CSS 自定义属性实现运行时切换。

**Tech Stack:** Dart Sass, Node.js, CSS Custom Properties

---

## 文件结构

| 文件路径 | 职责 |
|---------|------|
| `src/scss/core/_variables.scss` | CSS 变量定义（颜色、间距、圆角） |
| `src/scss/core/_reset.scss` | 基础重置、body 样式 |
| `src/scss/core/_typography.scss` | 标题、段落、列表、链接、水平线 |
| `src/scss/core/_code.scss` | 内联代码、代码块 |
| `src/scss/core/_tables.scss` | 表格样式 |
| `src/scss/core/_forms.scss` | 表单元素、按钮 |
| `src/scss/core/_blockquote.scss` | 引用块 |
| `src/scss/core/_images.scss` | 图片样式 |
| `src/scss/core/_utilities.scss` | 工具类（row, col, flex） |
| `src/scss/themes/_light.scss` | 浅色主题变量覆盖 |
| `src/scss/themes/_dark.scss` | 深色主题变量覆盖 |
| `src/scss/md-green.scss` | 完整版入口 |
| `src/scss/md-green-light.scss` | 仅浅色版入口 |
| `src/scss/md-green-dark.scss` | 仅深色版入口 |
| `src/scss/md-green-base.scss` | 无主题基础版入口 |
| `package.json` | 项目配置、依赖 |
| `build.js` | 构建脚本 |
| `dist/*.css` | 编译输出 |

---

## Task 1: 项目初始化

**Files:**
- Create: `package.json`
- Create: `src/scss/core/` 目录
- Create: `src/scss/themes/` 目录
- Create: `dist/` 目录

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "md-green-theme",
  "version": "1.0.0",
  "description": "Markdown theme with light/dark mode support",
  "main": "dist/md-green.css",
  "scripts": {
    "build": "node build.js",
    "watch": "sass --watch src/scss:dist --style compressed",
    "dev": "sass src/scss/md-green.scss:dist/md-green.css --watch"
  },
  "files": [
    "dist/"
  ],
  "devDependencies": {
    "sass": "^1.83.0"
  }
}
```

- [ ] **Step 2: 创建目录结构**

```bash
mkdir -p src/scss/core src/scss/themes dist
```

- [ ] **Step 3: 安装依赖**

```bash
npm install
```

Expected: sass 包安装成功

- [ ] **Step 4: 提交初始化**

```bash
git add package.json package-lock.json
git commit -m "chore: initialize project with sass dependency"
```

---

## Task 2: CSS 变量系统

**Files:**
- Create: `src/scss/core/_variables.scss`

- [ ] **Step 1: 创建变量文件**

```scss
// src/scss/core/_variables.scss

// 浅色主题默认变量
:root {
  // === 背景色 ===
  --md-bg-primary: #ffffff;
  --md-bg-secondary: #f7f7f7;
  --md-bg-code: #f7f7f7;
  --md-bg-blockquote: rgb(244, 255, 244);
  --md-bg-table-hover: #fbf8e9;
  --md-bg-table-header: #dce9f9;
  
  // === 文本色 ===
  --md-text-primary: #444444;
  --md-text-secondary: #666666;
  --md-text-muted: #999999;
  --md-text-heading: #111111;
  --md-text-blockquote: #3c3c3c;
  --md-text-blockquote-cite: #bfbfbf;
  
  // === 链接色 ===
  --md-link: #0099ff;
  --md-link-hover: #ff6600;
  --md-link-visited: purple;
  
  // === 代码色 ===
  --md-code-text: #F44336;
  --md-code-border: #6CE26C;
  --md-code-bg: #f7f7f7;
  
  // === 边框色 ===
  --md-border: #EFEAEA;
  --md-border-heading: #EFEAEA;
  --md-border-blockquote: rgb(9, 180, 66);
  --md-border-table: #ccc;
  --md-border-image: gray;
  
  // === 间距 ===
  --md-spacing-xs: 4px;
  --md-spacing-sm: 8px;
  --md-spacing-md: 16px;
  --md-spacing-lg: 24px;
  --md-spacing-xl: 32px;
  
  // === 圆角 ===
  --md-radius-sm: 3px;
  --md-radius-md: 4px;
  --md-radius-lg: 6px;
  
  // === 字体 ===
  --md-font-body: 宋体, "Microsoft YaHei", Arial, sans-serif;
  --md-font-heading: 仿宋, Georgia, Palatino, serif;
  --md-font-code: Consolas, Monaco, "Andale Mono", monospace;
  --md-font-blockquote: 楷体;
  
  // === 字号 ===
  --md-font-size-base: 16px;
  --md-font-size-h1: 48px;
  --md-font-size-h2: 36px;
  --md-font-size-h3: 24px;
  --md-font-size-h4: 21px;
  --md-font-size-h5: 18px;
  --md-font-size-code: 13px;
  --md-font-size-small: 14px;
  
  // === 行高 ===
  --md-line-height: 1.6;
  --md-line-height-heading: 1;
  --md-line-height-code: 1.7em;
  
  // === 阴影 ===
  --md-shadow-image: 5px 5px 5px grey;
  --md-shadow-code: none;
}
```

- [ ] **Step 2: 提交变量文件**

```bash
git add src/scss/core/_variables.scss
git commit -m "feat: add CSS variables for theme system"
```

---

## Task 3: 深色主题变量

**Files:**
- Create: `src/scss/themes/_dark.scss`

- [ ] **Step 1: 创建深色主题变量**

```scss
// src/scss/themes/_dark.scss

// 系统深色主题（自动）
@media (prefers-color-scheme: dark) {
  :root {
    // === 背景色 ===
    --md-bg-primary: #1a1a1a;
    --md-bg-secondary: #1e1e1e;
    --md-bg-code: #252525;
    --md-bg-blockquote: #242424;
    --md-bg-table-hover: #2a2a2a;
    --md-bg-table-header: #2d2d2d;
    
    // === 文本色 ===
    --md-text-primary: #d0d0d0;
    --md-text-secondary: #cccccc;
    --md-text-muted: #888888;
    --md-text-heading: #f0f0f0;
    --md-text-blockquote: #d0d0d0;
    --md-text-blockquote-cite: #888888;
    
    // === 链接色 ===
    --md-link: #5ca8ff;
    --md-link-hover: #ff914d;
    --md-link-visited: #b380ff;
    
    // === 代码色 ===
    --md-code-text: #ff6b6b;
    --md-code-border: #4CAF50;
    --md-code-bg: #2d2d2d;
    
    // === 边框色 ===
    --md-border: #404040;
    --md-border-heading: #404040;
    --md-border-blockquote: #388E3C;
    --md-border-table: #333;
    --md-border-image: #444;
    
    // === 阴影 ===
    --md-shadow-image: 5px 5px 15px rgba(0, 0, 0, 0.5);
    --md-shadow-code: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
}

// 手动深色主题（最高优先级）
[data-theme="dark"] {
  --md-bg-primary: #1a1a1a;
  --md-bg-secondary: #1e1e1e;
  --md-bg-code: #252525;
  --md-bg-blockquote: #242424;
  --md-bg-table-hover: #2a2a2a;
  --md-bg-table-header: #2d2d2d;
  
  --md-text-primary: #d0d0d0;
  --md-text-secondary: #cccccc;
  --md-text-muted: #888888;
  --md-text-heading: #f0f0f0;
  --md-text-blockquote: #d0d0d0;
  --md-text-blockquote-cite: #888888;
  
  --md-link: #5ca8ff;
  --md-link-hover: #ff914d;
  --md-link-visited: #b380ff;
  
  --md-code-text: #ff6b6b;
  --md-code-border: #4CAF50;
  --md-code-bg: #2d2d2d;
  
  --md-border: #404040;
  --md-border-heading: #404040;
  --md-border-blockquote: #388E3C;
  --md-border-table: #333;
  --md-border-image: #444;
  
  --md-shadow-image: 5px 5px 15px rgba(0, 0, 0, 0.5);
  --md-shadow-code: 0 2px 8px rgba(0, 0, 0, 0.3);
}
```

- [ ] **Step 2: 创建浅色手动覆盖**

```scss
// src/scss/themes/_light.scss

[data-theme="light"] {
  --md-bg-primary: #ffffff;
  --md-bg-secondary: #f7f7f7;
  --md-bg-code: #f7f7f7;
  --md-bg-blockquote: rgb(244, 255, 244);
  --md-bg-table-hover: #fbf8e9;
  --md-bg-table-header: #dce9f9;
  
  --md-text-primary: #444444;
  --md-text-secondary: #666666;
  --md-text-muted: #999999;
  --md-text-heading: #111111;
  --md-text-blockquote: #3c3c3c;
  --md-text-blockquote-cite: #bfbfbf;
  
  --md-link: #0099ff;
  --md-link-hover: #ff6600;
  --md-link-visited: purple;
  
  --md-code-text: #F44336;
  --md-code-border: #6CE26C;
  --md-code-bg: #f7f7f7;
  
  --md-border: #EFEAEA;
  --md-border-heading: #EFEAEA;
  --md-border-blockquote: rgb(9, 180, 66);
  --md-border-table: #ccc;
  --md-border-image: gray;
  
  --md-shadow-image: 5px 5px 5px grey;
  --md-shadow-code: none;
}
```

- [ ] **Step 3: 提交主题文件**

```bash
git add src/scss/themes/_dark.scss src/scss/themes/_light.scss
git commit -m "feat: add dark and light theme overrides"
```

---

## Task 4: 基础重置模块

**Files:**
- Create: `src/scss/core/_reset.scss`

- [ ] **Step 1: 创建重置文件**

```scss
// src/scss/core/_reset.scss

body {
  margin: 0 auto;
  font-family: var(--md-font-body);
  color: var(--md-text-primary);
  line-height: var(--md-line-height);
  padding: var(--md-spacing-lg);
  background-color: var(--md-bg-primary);
}

@media screen and (min-width: 768px) {
  body {
    margin: 10px auto;
  }
}

@media screen and (max-width: 768px) {
  body {
    padding: 20px;
  }
}
```

- [ ] **Step 2: 提交重置文件**

```bash
git add src/scss/core/_reset.scss
git commit -m "feat: add base reset styles"
```

---

## Task 5: 排版模块

**Files:**
- Create: `src/scss/core/_typography.scss`

- [ ] **Step 1: 创建排版文件**

```scss
// src/scss/core/_typography.scss

// === 标题 ===
h1, h2, h3, h4 {
  color: var(--md-text-heading);
  font-weight: 400;
  margin-top: 1em;
}

h1, h2, h3, h4, h5 {
  font-family: var(--md-font-heading);
}

h1, h2, h3, h4, h5, p, dl {
  margin-bottom: var(--md-spacing-md);
  padding: 0;
}

h1 {
  font-size: var(--md-font-size-h1);
  line-height: 54px;
}

h2 {
  font-size: var(--md-font-size-h2);
  line-height: 42px;
}

h1, h2 {
  border-bottom: 1px solid var(--md-border-heading);
  padding-bottom: 10px;
}

h3 {
  font-size: var(--md-font-size-h3);
  line-height: 30px;
}

h4 {
  font-size: var(--md-font-size-h4);
  line-height: 26px;
}

h5 {
  font-size: var(--md-font-size-h5);
  line-height: 23px;
}

// === 链接 ===
a {
  color: var(--md-link);
  margin: 0;
  padding: 0;
  vertical-align: baseline;
}

a:hover {
  text-decoration: none;
  color: var(--md-link-hover);
}

// === 列表 ===
ul, ol {
  padding: 0;
  padding-left: var(--md-spacing-lg);
  margin: 0;
}

li {
  line-height: var(--md-spacing-lg);
}

p, ul, ol {
  font-size: var(--md-font-size-base);
  line-height: var(--md-spacing-lg);
}

ol ol, ul ol {
  list-style-type: lower-roman;
}

// === 水平线 ===
hr {
  text-align: left;
  color: #999;
  height: 2px;
  padding: 0;
  margin: var(--md-spacing-md) 0;
  background-color: var(--md-border);
  border: 0 none;
}

// === 定义列表 ===
dl {
  padding: 0;
}

dl dt {
  padding: 10px 0;
  margin-top: var(--md-spacing-md);
  font-size: 1em;
  font-style: italic;
  font-weight: bold;
}

dl dd {
  padding: 0 var(--md-spacing-md);
  margin-bottom: var(--md-spacing-md);
  margin-left: 0;
}

// === 段落 ===
p {
  margin-bottom: var(--md-spacing-md);
}
```

- [ ] **Step 2: 提交排版文件**

```bash
git add src/scss/core/_typography.scss
git commit -m "feat: add typography styles (headings, lists, links)"
```

---

## Task 6: 代码模块

**Files:**
- Create: `src/scss/core/_code.scss`

- [ ] **Step 1: 创建代码文件**

```scss
// src/scss/core/_code.scss

code, pre {
  border-radius: var(--md-radius-sm);
  background-color: var(--md-bg-code);
  color: inherit;
}

code {
  font-family: var(--md-font-code);
  margin: 0 2px;
  color: var(--md-code-text);
}

pre {
  line-height: var(--md-line-height-code);
  overflow: auto;
  padding: 6px 10px;
  border-left: 5px solid var(--md-code-border);
  box-shadow: var(--md-shadow-code);
}

pre > code {
  border: 0;
  display: inline;
  max-width: initial;
  padding: 0;
  margin: 0;
  overflow: initial;
  line-height: inherit;
  font-size: .85em;
  white-space: pre;
  background: 0 0;
}

@media screen and (max-width: 768px) {
  pre {
    margin: 10px -20px;
    border-radius: 0;
  }
}
```

- [ ] **Step 2: 提交代码文件**

```bash
git add src/scss/core/_code.scss
git commit -m "feat: add code and code block styles"
```

---

## Task 7: 引用块模块

**Files:**
- Create: `src/scss/core/_blockquote.scss`

- [ ] **Step 1: 创建引用文件**

```scss
// src/scss/core/_blockquote.scss

aside {
  display: block;
  float: right;
  width: 390px;
}

blockquote {
  font-family: var(--md-font-blockquote);
  border-left: 0.5em solid var(--md-border-blockquote);
  padding: 0 0 0 2em;
  margin-left: 0;
  background-color: var(--md-bg-blockquote);
}

blockquote cite {
  font-size: var(--md-font-size-small);
  line-height: 20px;
  color: var(--md-text-blockquote-cite);
}

blockquote cite::before {
  content: '\2014 \00A0';
}

blockquote p {
  color: var(--md-text-blockquote);
}
```

- [ ] **Step 2: 提交引用文件**

```bash
git add src/scss/core/_blockquote.scss
git commit -m "feat: add blockquote styles"
```

---

## Task 8: 表格模块

**Files:**
- Create: `src/scss/core/_tables.scss`

- [ ] **Step 1: 创建表格文件**

```scss
// src/scss/core/_tables.scss

table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  border: solid var(--md-border-table) 1px;
  border-radius: var(--md-radius-lg);
}

table tr:hover {
  background: var(--md-bg-table-hover);
  transition: all 0.1s ease-in-out;
}

table td, table th {
  border-left: 1px solid var(--md-border-table);
  border-top: 1px solid var(--md-border-table);
  padding: 10px;
  text-align: left;
}

table th {
  background-color: var(--md-bg-table-header);
  border: 1px solid var(--md-border-table);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
  padding: 5px;
}

table th:first-child {
  border-radius: var(--md-radius-lg) 0 0 0;
}

table th:last-child {
  border-radius: 0 var(--md-radius-lg) 0 0;
}

table th:only-child {
  border-radius: var(--md-radius-lg) var(--md-radius-lg) 0 0;
}

table tr:last-child td:first-child {
  border-radius: 0 0 0 var(--md-radius-lg);
}

table tr:last-child td:last-child {
  border-radius: 0 0 var(--md-radius-lg) 0;
}
```

- [ ] **Step 2: 提交表格文件**

```bash
git add src/scss/core/_tables.scss
git commit -m "feat: add table styles"
```

---

## Task 9: 表单模块

**Files:**
- Create: `src/scss/core/_forms.scss`

- [ ] **Step 1: 创建表单文件**

```scss
// src/scss/core/_forms.scss

// === 基础表单 ===
button,
input,
select,
textarea {
  font-size: 100%;
  margin: 0;
  vertical-align: baseline;
}

button, input {
  line-height: normal;
}

button::-moz-focus-inner,
input::-moz-focus-inner {
  border: 0;
  padding: 0;
}

button,
input[type="button"],
input[type="reset"],
input[type="submit"] {
  cursor: pointer;
}

input[type=checkbox],
input[type=radio] {
  cursor: pointer;
}

label,
input,
select,
textarea {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: var(--md-font-size-small);
  font-weight: normal;
  line-height: normal;
  margin-bottom: 18px;
}

input[type=text],
input[type=password],
textarea,
select {
  display: inline-block;
  width: 210px;
  padding: 4px;
  font-size: var(--md-font-size-small);
  font-weight: normal;
  line-height: 18px;
  height: 18px;
  color: var(--md-text-muted);
  border: 1px solid var(--md-border-table);
  border-radius: var(--md-radius-sm);
}

select,
input[type=file] {
  height: 27px;
  line-height: 27px;
}

textarea {
  height: auto;
}

input[type=text],
input[type=password],
select,
textarea {
  transition: border linear 0.2s, box-shadow linear 0.2s;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

input[type=text]:focus,
input[type=password]:focus,
textarea:focus {
  outline: none;
  border-color: rgba(82, 168, 236, 0.8);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 8px rgba(82, 168, 236, 0.6);
}

// === 占位符 ===
:placeholder-shown {
  color: var(--md-text-blockquote-cite);
}

// === 按钮 ===
button {
  display: inline-block;
  padding: 4px 14px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: var(--md-font-size-small);
  line-height: 18px;
  border-radius: var(--md-radius-md);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
  background-color: #0064cd;
  background-image: linear-gradient(to bottom, #049cdb, #0064cd);
  color: #fff;
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);
  border: 1px solid #004b9a;
  border-bottom-color: #003f81;
  transition: 0.1s linear all;
  border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);
}

button:hover {
  color: #fff;
  background-position: 0 -15px;
  text-decoration: none;
}

button:active {
  box-shadow: inset 0 3px 7px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.05);
}

button::-moz-focus-inner {
  padding: 0;
  border: 0;
}
```

- [ ] **Step 2: 提交表单文件**

```bash
git add src/scss/core/_forms.scss
git commit -m "feat: add form and button styles"
```

---

## Task 10: 图片模块

**Files:**
- Create: `src/scss/core/_images.scss`

- [ ] **Step 1: 创建图片文件**

```scss
// src/scss/core/_images.scss

img {
  box-shadow: var(--md-shadow-image);
  border: 1px solid var(--md-border-image);
}
```

- [ ] **Step 2: 提交图片文件**

```bash
git add src/scss/core/_images.scss
git commit -m "feat: add image styles"
```

---

## Task 11: 工具类模块

**Files:**
- Create: `src/scss/core/_utilities.scss`

- [ ] **Step 1: 创建工具类文件**

```scss
// src/scss/core/_utilities.scss

flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.row {
  display: flex;
}

.row .col {
  flex: 1;
  padding-right: 10px;
  padding-left: 10px;
}

.row .col:nth-child(1) {
  margin-left: -10px;
}

.row .col:nth-last-child(1) {
  margin-right: -10px;
}
```

- [ ] **Step 2: 提交工具类文件**

```bash
git add src/scss/core/_utilities.scss
git commit -m "feat: add utility classes (row, col, flex)"
```

---

## Task 12: 完整版入口文件

**Files:**
- Create: `src/scss/md-green.scss`

- [ ] **Step 1: 创建完整版入口**

```scss
// src/scss/md-green.scss

// 变量（浅色默认）
@use 'core/variables';

// 深色主题（系统自动 + 手动覆盖）
@use 'themes/dark';
@use 'themes/light';

// 核心样式
@use 'core/reset';
@use 'core/typography';
@use 'core/code';
@use 'core/blockquote';
@use 'core/tables';
@use 'core/forms';
@use 'core/images';
@use 'core/utilities';
```

- [ ] **Step 2: 提交入口文件**

```bash
git add src/scss/md-green.scss
git commit -m "feat: add main entry file with all modules"
```

---

## Task 13: 单主题入口文件

**Files:**
- Create: `src/scss/md-green-light.scss`
- Create: `src/scss/md-green-dark.scss`
- Create: `src/scss/md-green-base.scss`

- [ ] **Step 1: 创建仅浅色版入口**

```scss
// src/scss/md-green-light.scss

// 仅使用浅色变量（不引入深色主题）
@use 'core/variables';

// 核心 styles
@use 'core/reset';
@use 'core/typography';
@use 'core/code';
@use 'core/blockquote';
@use 'core/tables';
@use 'core/forms';
@use 'core/images';
@use 'core/utilities';
```

- [ ] **Step 2: 创建仅深色版入口**

```scss
// src/scss/md-green-dark.scss

// 直接在 :root 设置深色变量（无 media query）
:root {
  --md-bg-primary: #1a1a1a;
  --md-bg-secondary: #1e1e1e;
  --md-bg-code: #252525;
  --md-bg-blockquote: #242424;
  --md-bg-table-hover: #2a2a2a;
  --md-bg-table-header: #2d2d2d;
  
  --md-text-primary: #d0d0d0;
  --md-text-secondary: #cccccc;
  --md-text-muted: #888888;
  --md-text-heading: #f0f0f0;
  --md-text-blockquote: #d0d0d0;
  --md-text-blockquote-cite: #888888;
  
  --md-link: #5ca8ff;
  --md-link-hover: #ff914d;
  --md-link-visited: #b380ff;
  
  --md-code-text: #ff6b6b;
  --md-code-border: #4CAF50;
  --md-code-bg: #2d2d2d;
  
  --md-border: #404040;
  --md-border-heading: #404040;
  --md-border-blockquote: #388E3C;
  --md-border-table: #333;
  --md-border-image: #444;
  
  --md-shadow-image: 5px 5px 15px rgba(0, 0, 0, 0.5);
  --md-shadow-code: 0 2px 8px rgba(0, 0, 0, 0.3);
}

@use 'core/reset';
@use 'core/typography';
@use 'core/code';
@use 'core/blockquote';
@use 'core/tables';
@use 'core/forms';
@use 'core/images';
@use 'core/utilities';
```

- [ ] **Step 3: 创建无主题基础版入口**

```scss
// src/scss/md-green-base.scss

// 仅变量声明和核心样式，无主题颜色值
// 用户可自行覆盖变量
@use 'core/variables';

@use 'core/reset';
@use 'core/typography';
@use 'core/code';
@use 'core/blockquote';
@use 'core/tables';
@use 'core/forms';
@use 'core/images';
@use 'core/utilities';
```

- [ ] **Step 4: 提交单主题入口文件**

```bash
git add src/scss/md-green-light.scss src/scss/md-green-dark.scss src/scss/md-green-base.scss
git commit -m "feat: add single-theme entry files"
```

---

## Task 14: 构建脚本

**Files:**
- Create: `build.js`

- [ ] **Step 1: 创建构建脚本**

```javascript
// build.js

const sass = require('sass');
const fs = require('fs');
const path = require('path');

const targets = [
  { input: 'src/scss/md-green.scss', output: 'dist/md-green.css' },
  { input: 'src/scss/md-green-light.scss', output: 'dist/md-green-light.css' },
  { input: 'src/scss/md-green-dark.scss', output: 'dist/md-green-dark.css' },
  { input: 'src/scss/md-green-base.scss', output: 'dist/md-green-base.css' },
];

console.log('Building markdown theme...\n');

targets.forEach(({ input, output }) => {
  try {
    const result = sass.compile(input, {
      style: 'compressed',
      loadPaths: ['src/scss'],
    });
    
    fs.writeFileSync(output, result.css);
    
    const sizeKB = (result.css.length / 1024).toFixed(2);
    console.log(`✓ ${output} (${sizeKB} KB)`);
  } catch (error) {
    console.error(`✗ ${input}: ${error.message}`);
    process.exit(1);
  }
});

console.log('\nBuild complete!');
```

- [ ] **Step 2: 运行构建测试**

```bash
npm run build
```

Expected: 四个 CSS 文件生成成功

- [ ] **Step 3: 检查输出文件**

```bash
ls -la dist/
```

Expected: 四个 .css 文件存在

- [ ] **Step 4: 提交构建脚本**

```bash
git add build.js dist/
git commit -m "feat: add build script and compiled CSS outputs"
```

---

## Task 15: 深色模式表单优化

**Files:**
- Modify: `src/scss/themes/_dark.scss`

- [ ] **Step 1: 添加深色表单样式**

在 `_dark.scss` 文件末尾的 `}` 之前添加：

```scss
// === 深色模式表单优化 ===
input[type=text],
input[type=password],
textarea,
select {
  background-color: var(--md-bg-code);
  border-color: #444;
  color: var(--md-text-primary);
}

input[type=text]:focus,
input[type=password]:focus,
textarea:focus {
  border-color: #4CAF50;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5), 0 0 8px rgba(76, 175, 80, 0.3);
}

button {
  background: linear-gradient(to bottom, #2c3e50, #34495e);
  border-color: #2c3e50;
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.5);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

button:hover {
  background: linear-gradient(to bottom, #34495e, #2c3e50);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}
```

- [ ] **Step 2: 重新构建验证**

```bash
npm run build
```

Expected: 构建成功

- [ ] **Step 3: 提交优化**

```bash
git add src/scss/themes/_dark.scss
git commit -m "feat: optimize dark mode form styles"
```

---

## Task 16: 深色模式表格优化

**Files:**
- Modify: `src/scss/themes/_dark.scss`

- [ ] **Step 1: 添加深色表格样式**

在 `_dark.scss` 的深色变量块内添加：

```scss
// === 深色模式表格优化 ===
table th {
  background-image: linear-gradient(to bottom, #3a3a3a, #2d2d2d);
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.8);
}
```

- [ ] **Step 2: 重新构建验证**

```bash
npm run build
```

- [ ] **Step 3: 提交优化**

```bash
git add src/scss/themes/_dark.scss
git commit -m "feat: optimize dark mode table header styles"
```

---

## Task 17: 深色模式辅助样式

**Files:**
- Modify: `src/scss/themes/_dark.scss`

- [ ] **Step 1: 添加辅助样式**

在 `_dark.scss` 末尾（在 `[data-theme="dark"]` 块之后）添加：

```scss
// === 选中文本 ===
[data-theme="dark"] ::selection {
  background-color: rgba(76, 175, 80, 0.3);
  color: #ffffff;
}

@media (prefers-color-scheme: dark) {
  ::selection {
    background-color: rgba(76, 175, 80, 0.3);
    color: #ffffff;
  }
}

// === 滚动条 ===
[data-theme="dark"] {
  scrollbar-width: thin;
  scrollbar-color: #444 #222;
}

@media (prefers-color-scheme: dark) {
  ::-webkit-scrollbar {
    width: 10px;
  }
  
  ::-webkit-scrollbar-track {
    background: #222;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 5px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
}

// === kbd 和 mark ===
[data-theme="dark"] kbd {
  background-color: var(--md-bg-code);
  border-color: #444;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
}

[data-theme="dark"] mark {
  background-color: rgba(255, 235, 59, 0.2);
  color: #fff;
  padding: 0 2px;
}

@media (prefers-color-scheme: dark) {
  kbd {
    background-color: #2d2d2d;
    border-color: #444;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
    color: #d0d0d0;
  }
  
  mark {
    background-color: rgba(255, 235, 59, 0.2);
    color: #fff;
  }
}
```

- [ ] **Step 2: 重新构建验证**

```bash
npm run build
```

- [ ] **Step 3: 提交辅助样式**

```bash
git add src/scss/themes/_dark.scss
git commit -m "feat: add dark mode auxiliary styles (selection, scrollbar, kbd, mark)"
```

---

## Task 18: README 文档

**Files:**
- Create: `README.md`

- [ ] **Step 1: 创建 README**

```markdown
# MD-Green Markdown Theme

一个支持深浅色主题切换的 Markdown 样式库，适用于 VSCode、Obsidian、Docsify 等环境。

## 安装

下载 `dist/` 目录下的 CSS 文件，或通过 npm 安装：

```bash
npm install md-green-theme
```

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
```

- [ ] **Step 2: 提交 README**

```bash
git add README.md
git commit -m "docs: add README with usage instructions"
```

---

## Task 19: 最终验证与清理

**Files:**
- Remove: `src/md-green.css`（原文件）

- [ ] **Step 1: 备份原文件**

```bash
mv src/md-green.css src/md-green.css.bak
```

- [ ] **Step 2: 最终构建验证**

```bash
npm run build
```

Expected: 四个文件编译成功，无错误

- [ ] **Step 3: 检查输出文件大小**

```bash
ls -la dist/*.css
```

Expected: 四个文件大小合理（完整版约 12KB，单主题版约 6-8KB）

- [ ] **Step 4: 删除备份文件**

```bash
rm src/md-green.css.bak
```

- [ ] **Step 5: 最终提交**

```bash
git add -A
git commit -m "feat: complete SCSS refactor with modular structure"
```

---

## 验收清单

- [ ] `npm run build` 成功编译四个 CSS 文件
- [ ] 完整版支持 `[data-theme]` 手动切换
- [ ] 完整版支持 `prefers-color-scheme` 自动切换
- [ ] 浅色版固定浅色主题
- [ ] 深色版固定深色主题
- [ ] 基础版仅包含布局和变量声明
- [ ] 所有原有样式效果保持一致
- [ ] 深色模式对比度符合 WCAG AA 标准