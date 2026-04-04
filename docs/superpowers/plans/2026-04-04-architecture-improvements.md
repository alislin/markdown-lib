# 架构改进修复方案

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复项目架构问题，消除变量重复定义、修复硬编码路径、添加工程化工具、完善发布流程

**Architecture:** 重构 SCSS 变量系统为单一数据源，通过 mixin 输出到 CSS 变量；移除硬编码路径改用 Playwright 自动发现；添加 lint 工具和 .npmignore

**Tech Stack:** SCSS, Playwright, ESLint, Stylelint, standard-version

---

## 文件结构

**修改文件：**
- `src/scss/core/_variables.scss` - 重构为 SCSS 变量定义
- `src/scss/core/_mixins.scss` - 改为引用变量而非重复定义
- `src/scss/themes/_dark.scss` - 使用新的 mixin 方式
- `src/scss/themes/_light.scss` - 使用新的 mixin 方式
- `playwright.config.ts` - 移除硬编码路径
- `package.json` - 添加 lint 脚本和依赖

**新增文件：**
- `.npmignore` - 排除开发文件
- `.eslintrc.json` - ESLint 配置
- `.stylelintrc.json` - Stylelint 配置

---

### Task 1: 重构 SCSS 变量系统为单一数据源

**Files:**
- Modify: `src/scss/core/_variables.scss`
- Modify: `src/scss/core/_mixins.scss`

- [ ] **Step 1: 重构 _variables.scss 定义 SCSS 变量**

将变量定义改为 SCSS map 格式，同时保留原有 `:root` 输出：

```scss
// src/scss/core/_variables.scss

// === 浭点 ===
$md-breakpoint-md: 768px;

// === 浅色主题 SCSS 变量（单一数据源）===
$md-light-colors: (
  'bg-primary': #ffffff,
  'bg-secondary': #f7f7f7,
  'bg-code': #f7f7f7,
  'bg-blockquote': rgb(244, 255, 244),
  'bg-table-hover': #fbf8e9,
  'bg-table-header': #dce9f9,
  'text-primary': #444444,
  'text-secondary': #666666,
  'text-muted': #999999,
  'text-heading': #111111,
  'text-blockquote': #3c3c3c,
  'text-blockquote-cite': #bfbfbf,
  'link': #0099ff,
  'link-hover': #ff6600,
  'link-visited': purple,
  'code-text': #F44336,
  'code-border': #6CE26C,
  'code-bg': #f7f7f7,
  'border': #EFEAEA,
  'border-heading': #EFEAEA,
  'border-blockquote': rgb(9, 180, 66),
  'border-table': #ccc,
  'border-image': gray,
  'spacing-xs': 4px,
  'spacing-sm': 8px,
  'spacing-md': 16px,
  'spacing-lg': 24px,
  'spacing-xl': 32px,
  'radius-sm': 3px,
  'radius-md': 4px,
  'radius-lg': 6px,
  'font-body': (宋体, "Microsoft YaHei", Arial, sans-serif),
  'font-heading': (仿宋, Georgia, Palatino, serif),
  'font-code': (Consolas, Monaco, "Andale Mono", monospace),
  'font-blockquote': 楷体,
  'font-size-base': 16px,
  'font-size-h1': 48px,
  'font-size-h2': 36px,
  'font-size-h3': 24px,
  'font-size-h4': 21px,
  'font-size-h5': 18px,
  'font-size-code': 13px,
  'font-size-small': 14px,
  'line-height': 1.6,
  'line-height-heading': 1,
  'line-height-code': 1.7em,
  'shadow-image': 5px 5px 5px grey,
  'shadow-code': none,
);

// === 深色主题 SCSS 变量（仅颜色部分）===
$md-dark-colors: (
  'bg-primary': #1a1a1a,
  'bg-secondary': #1e1e1e,
  'bg-code': #252525,
  'bg-blockquote': #242424,
  'bg-table-hover': #2a2a2a,
  'bg-table-header': #2d2d2d,
  'text-primary': #d0d0d0,
  'text-secondary': #cccccc,
  'text-muted': #888888,
  'text-heading': #f0f0f0,
  'text-blockquote': #d0d0d0,
  'text-blockquote-cite': #888888,
  'link': #5ca8ff,
  'link-hover': #ff914d,
  'link-visited': #b380ff,
  'code-text': #ff6b6b,
  'code-border': #4CAF50,
  'code-bg': #2d2d2d,
  'border': #404040,
  'border-heading': #404040,
  'border-blockquote': #388E3C,
  'border-table': #333,
  'border-image': #444,
  'shadow-image': 5px 5px 15px rgba(0, 0, 0, 0.5),
  'shadow-code': 0 2px 8px rgba(0, 0, 0, 0.3),
);

// 浅色主题默认输出到 :root
:root {
  @each $key, $value in $md-light-colors {
    --md-#{$key}: $value;
  }
}
```

- [ ] **Step 2: 重构 _mixins.scss 使用 SCSS 变量**

```scss
// src/scss/core/_mixins.scss
@use 'variables' as *;

// === 浅色主题颜色变量 ===
@mixin light-colors {
  @each $key, $value in $md-light-colors {
    --md-#{$key}: $value;
  }
}

// === 深色主题颜色变量 ===
@mixin dark-colors {
  @each $key, $value in $md-dark-colors {
    --md-#{$key}: $value;
  }
  // 深色主题继承浅色主题的非颜色变量（字体、间距等）
  --md-font-body: #{map-get($md-light-colors, 'font-body')};
  --md-font-heading: #{map-get($md-light-colors, 'font-heading')};
  --md-font-code: #{map-get($md-light-colors, 'font-code')};
  --md-font-blockquote: #{map-get($md-light-colors, 'font-blockquote')};
  --md-font-size-base: #{map-get($md-light-colors, 'font-size-base')};
  --md-font-size-h1: #{map-get($md-light-colors, 'font-size-h1')};
  --md-font-size-h2: #{map-get($md-light-colors, 'font-size-h2')};
  --md-font-size-h3: #{map-get($md-light-colors, 'font-size-h3')};
  --md-font-size-h4: #{map-get($md-light-colors, 'font-size-h4')};
  --md-font-size-h5: #{map-get($md-light-colors, 'font-size-h5')};
  --md-font-size-code: #{map-get($md-light-colors, 'font-size-code')};
  --md-font-size-small': #{map-get($md-light-colors, 'font-size-small')};
  --md-line-height: #{map-get($md-light-colors, 'line-height')};
  --md-line-height-heading: #{map-get($md-light-colors, 'line-height-heading')};
  --md-line-height-code: #{map-get($md-light-colors, 'line-height-code')};
  --md-spacing-xs: #{map-get($md-light-colors, 'spacing-xs')};
  --md-spacing-sm: #{map-get($md-light-colors, 'spacing-sm')};
  --md-spacing-md: #{map-get($md-light-colors, 'spacing-md')};
  --md-spacing-lg: #{map-get($md-light-colors, 'spacing-lg')};
  --md-spacing-xl: #{map-get($md-light-colors, 'spacing-xl')};
  --md-radius-sm: #{map-get($md-light-colors, 'radius-sm')};
  --md-radius-md: #{map-get($md-light-colors, 'radius-md')};
  --md-radius-lg: #{map-get($md-light-colors, 'radius-lg')};
}

// === 深色主题表单样式（保持不变）===
@mixin dark-forms {
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

  table th {
    background-image: linear-gradient(to bottom, #3a3a3a, #2d2d2d);
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.8);
  }
}

// === 浅色主题表格样式 ===
@mixin light-table-header {
  table th {
    background-image: linear-gradient(to bottom, #e8f4fc, #dce9f9);
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
  }
}
```

- [ ] **Step 3: 运行构建验证**

Run: `npm run build`
Expected: 所有 CSS 文件成功生成，无错误

- [ ] **Step 4: 运行测试验证**

Run: `npm test`
Expected: 所有测试通过

---

### Task 2: 修复 Playwright 硬编码路径

**Files:**
- Modify: `playwright.config.ts`

- [ ] **Step 1: 移除硬编码 Chrome 路径**

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'off',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npx http-server -p 8080',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

- [ ] **Step 2: 安装 Playwright 浏览器（如需要）**

Run: `npx playwright install chromium`
Expected: 浏览器安装成功

- [ ] **Step 3: 运行测试验证**

Run: `npm test`
Expected: 所有测试通过

---

### Task 3: 添加 .npmignore 文件

**Files:**
- Create: `.npmignore`

- [ ] **Step 1: 创建 .npmignore 文件**

```
# 源代码
src/
*.scss

# 开发配置
.github/
docs/
test/
tests/
scripts/

# 构建工具
build.js
playwright.config.ts
commitlint.config.js
.versionrc.json

# 测试相关
test-results/
playwright-report/

# 依赖
node_modules/

# 编辑器
.vscode/
.idea/

# 其他
.gitignore
*.log
*.md
!README.md
```

- [ ] **Step 2: 验证发布内容**

Run: `npm pack --dry-run`
Expected: 只包含 `dist/` 目录和 `README.md`

---

### Task 4: 添加代码质量工具

**Files:**
- Modify: `package.json`
- Create: `.eslintrc.json`

- [ ] **Step 1: 安装 ESLint 依赖**

Run: `npm install --save-dev eslint @eslint/js`
Expected: 依赖安装成功

- [ ] **Step 2: 创建 .eslintrc.json**

```json
{
  "env": {
    "browser": true,
    "node": true,
    "es2022": true
  },
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "off"
  }
}
```

- [ ] **Step 3: 添加 lint 脚本到 package.json**

在 `package.json` 的 `scripts` 中添加：

```json
"lint": "eslint . --ext .js,.ts",
"lint:fix": "eslint . --ext .js,.ts --fix"
```

- [ ] **Step 4: 运行 lint 检查**

Run: `npm run lint`
Expected: 无错误或只有警告

---

### Task 5: 添加 Stylelint 工具

**Files:**
- Modify: `package.json`
- Create: `.stylelintrc.json`

- [ ] **Step 1: 安装 Stylelint 依赖**

Run: `npm install --save-dev stylelint stylelint-config-standard-scss`
Expected: 依赖安装成功

- [ ] **Step 2: 创建 .stylelintrc.json**

```json
{
  "extends": ["stylelint-config-standard-scss"],
  "rules": {
    "scss/at-rule-no-unknown": true,
    "scss/at-import-partial-extension": null,
    "no-descending-specificity": null
  }
}
```

- [ ] **Step 3: 添加 stylelint 脚本到 package.json**

在 `package.json` 的 `scripts` 中添加：

```json
"lint:style": "stylelint \"src/**/*.scss\"",
"lint:style:fix": "stylelint \"src/**/*.scss\" --fix"
```

- [ ] **Step 4: 运行 stylelint 检查**

Run: `npm run lint:style`
Expected: 无错误

---

### Task 6: 完善 package.json scripts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 更新 package.json scripts**

将 scripts 部分更新为：

```json
"scripts": {
  "build": "node build.js",
  "watch": "sass --watch src/scss:dist --style compressed",
  "dev": "sass src/scss/md-green.scss:dist/md-green.css --watch",
  "lint": "eslint . --ext .js,.ts && stylelint \"src/**/*.scss\"",
  "lint:fix": "eslint . --ext .js,.ts --fix && stylelint \"src/**/*.scss\" --fix",
  "test": "npx playwright test",
  "release": "standard-version",
  "release:first": "standard-version --first-release",
  "release:tag": "node scripts/release.js",
  "prepublishOnly": "npm run build && npm run lint"
}
```

- [ ] **Step 2: 验证完整流程**

Run: `npm run build && npm run lint`
Expected: 构建成功，lint 无错误

---

### Task 7: 提交更改

**Files:**
- All modified files

- [ ] **Step 1: 查看更改状态**

Run: `git status`

- [ ] **Step 2: 提交所有更改**

Run: `git add -A && git commit -m "refactor: 改进项目架构

- 重构 SCSS 变量系统为单一数据源
- 移除 Playwright 硬编码路径
- 添加 .npmignore 排除开发文件
- 添加 ESLint 和 Stylelint 配置
- 完善 package.json scripts"`

Expected: 提交成功

---

## 验收标准

1. `npm run build` 成功，生成 4 个 CSS 文件
2. `npm test` 所有测试通过
3. `npm run lint` 无错误
4. `npm pack --dry-run` 只包含 `dist/` 和 `README.md`
5. 变量只在 `_variables.scss` 定义一次