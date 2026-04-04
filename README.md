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

## 主题架构

### 设计原则

每个主题包含**浅色**和**暗色**两套配色，确保主题色系一致：

```
md-{name}/           # 主题名称
├── 浅色配色         # 明亮背景 + 深色文字
└── 暗色配色         # 深色背景 + 浅色文字
```

### 目录结构

```
src/scss/
├── core/                    # 核心样式（所有主题共用）
│   ├── _variables.scss      # 主题变量定义
│   ├── _mixins.scss         # 混入样式
│   ├── _reset.scss          # 重置样式
│   ├── _typography.scss     # 排版样式
│   ├── _code.scss           # 代码块样式
│   ├── _blockquote.scss     # 引用块样式
│   ├── _tables.scss         # 表格样式
│   ├── _forms.scss          # 表单样式
│   ├── _images.scss         # 图片样式
│   └── _utilities.scss      # 工具类
├── themes/                  # 主题切换逻辑
│   ├── _light.scss          # 浅色模式选择器
│   └── _dark.scss           # 暗色模式选择器
├── md-green.scss            # 绿色主题入口（完整版）
├── md-green-light.scss      # 绿色主题入口（仅浅色）
├── md-green-dark.scss       # 绿色主题入口（仅暗色）
└── md-green-base.scss       # 基础样式入口（无配色）
```

### 输出文件

每个主题生成 3 个 CSS 文件：

| 文件 | 说明 | 使用场景 |
|------|------|----------|
| `md-{name}.css` | 完整版，自动切换深浅色 | 默认推荐 |
| `md-{name}-light.css` | 仅浅色配色 | 强制浅色场景，体积更小 |
| `md-{name}-dark.css` | 仅暗色配色 | 强制暗色场景，体积更小 |
| `md-base.css` | 无配色基础版 | 完全自定义 |

### 主题切换优先级

1. **用户手动选择**（最高）：`<body data-theme="light|dark">`
2. **VSCode 主题**：`<body data-vscode-theme-kind="vscode-light|vscode-dark">`
3. **系统偏好**（默认）：`@media (prefers-color-scheme: dark)`

## 扩展主题

### 步骤 1：定义变量

在 `src/scss/core/_variables.scss` 中添加新主题的配色变量：

```scss
// 浅色配色
$md-{name}-light-colors: (
  'bg-primary': #fff,
  'bg-secondary': #f7f7f7,
  'bg-code': #f7f7f7,
  'bg-blockquote': rgb(244 255 244),
  'bg-table-hover': #fbf8e9,
  'bg-table-header': #dce9f9,
  'text-primary': #444,
  'text-secondary': #666,
  'text-muted': #999,
  'text-heading': #111,
  'text-blockquote': #3c3c3c,
  'text-blockquote-cite': #bfbfbf,
  'link': #09f,
  'link-hover': #f60,
  'link-visited': purple,
  'code-text': #F44336,
  'code-border': #6CE26C,
  'code-bg': #f7f7f7,
  'border': #EFEAEA,
  'border-heading': #EFEAEA,
  'border-blockquote': rgb(9 180 66),
  'border-table': #ccc,
  'border-image': gray,
  // ... 其他变量参考 $md-light-colors
);

// 暗色配色
$md-{name}-dark-colors: (
  'bg-primary': #1a1a1a,
  'bg-secondary': #1e1e1e,
  // ... 参考现有 $md-dark-colors
);
```

### 步骤 2：添加 Mixin

在 `src/scss/core/_mixins.scss` 中添加：

```scss
@mixin {name}-light-colors {
  @each $key, $value in $md-{name}-light-colors {
    --md-#{$key}: #{$value};
  }
}

@mixin {name}-dark-colors {
  @each $key, $value in $md-{name}-dark-colors {
    --md-#{$key}: #{$value};
  }
  // 继承浅色配色中的非颜色变量
  @each $key, $value in $md-{name}-light-colors {
    @if not map.has-key($md-{name}-dark-colors, $key) {
      --md-#{$key}: #{$value};
    }
  }
}
```

### 步骤 3：创建入口文件

创建 3 个入口文件：

**`src/scss/md-{name}.scss`**（完整版）：
```scss
@use 'core/variables';
@use 'core/mixins' as *;
@use 'themes/light';
@use 'themes/dark';
@use 'core/reset';
@use 'core/typography';
@use 'core/code';
@use 'core/blockquote';
@use 'core/tables';
@use 'core/forms';
@use 'core/images';
@use 'core/utilities';

// 覆盖默认配色
:root { @include {name}-light-colors; }
body[data-theme="light"] { @include {name}-light-colors; }
body:not([data-theme])[data-vscode-theme-kind="vscode-light"] { @include {name}-light-colors; }
body[data-theme="dark"] { @include {name}-dark-colors; }
body:not([data-theme])[data-vscode-theme-kind="vscode-dark"] { @include {name}-dark-colors; }
@media (prefers-color-scheme: dark) {
  body:not([data-theme], [data-vscode-theme-kind*="light"]) { @include {name}-dark-colors; }
}
```

**`src/scss/md-{name}-light.scss`**（仅浅色）：
```scss
@use 'core/variables';
@use 'core/mixins' as *;
@use 'core/reset';
@use 'core/typography';
@use 'core/code';
@use 'core/blockquote';
@use 'core/tables';
@use 'core/forms';
@use 'core/images';
@use 'core/utilities';

:root { @include {name}-light-colors; }
body[data-theme="light"] { @include {name}-light-colors; }
body:not([data-theme])[data-vscode-theme-kind="vscode-light"] { @include {name}-light-colors; }

table th {
  background-image: linear-gradient(to bottom, #e8f4fc, #dce9f9);
}
```

**`src/scss/md-{name}-dark.scss`**（仅暗色）：
```scss
@use 'core/variables';
@use 'core/mixins' as *;
@use 'core/reset';
@use 'core/typography';
@use 'core/code';
@use 'core/blockquote';
@use 'core/tables';
@use 'core/forms';
@use 'core/images';
@use 'core/utilities';

:root { @include {name}-dark-colors; }
body[data-theme="dark"] { @include {name}-dark-colors; }
@include dark-forms;
// ... 其他暗色特有样式
```

### 步骤 4：更新构建配置

在 `build.js` 中添加：

```js
const targets = [
  // ... 现有配置
  { input: 'src/scss/md-{name}.scss', output: 'dist/md-{name}.css' },
  { input: 'src/scss/md-{name}-light.scss', output: 'dist/md-{name}-light.css' },
  { input: 'src/scss/md-{name}-dark.scss', output: 'dist/md-{name}-dark.css' },
];
```

### 步骤 5：构建测试

```bash
npm run build
```

### 步骤 6：添加测试

每个新主题需要添加对应的自动化测试。

#### 测试目录结构

```
tests/                          # 自动化测试（按主题独立）
├── shared/                     # 共享测试逻辑
│   ├── theme-priority.ts       # 优先级测试（参数化）
│   ├── visual.ts               # 视觉回归测试（参数化）
│   └── types.ts                # 类型定义
├── green.spec.ts               # 绿色主题测试
├── blue.spec.ts                # 蓝色主题测试
└── ...

test/                           # 手动测试页面（整合）
├── index.html                  # 统一预览页（含主题选择器）
├── vscode.html                 # VSCode 环境模拟
├── obsidian.html               # Obsidian 环境模拟
├── docsify.html                # Docsify 环境模拟
├── export.html                 # 导出模板
├── theme-priority.html         # 优先级交互测试
├── _nav.js                     # 导航与主题切换脚本
├── _nav.css                    # 导航样式
└── markdown/
    └── content.md              # 测试内容
```

#### 测试架构原则

| 类型 | 设计原则 | 理由 |
|------|----------|------|
| 自动测试 | 按主题独立 | 不同主题变量值不同，需分别验证 |
| 手动测试 | 整合统一页面 | 避免重复代码，易于对比不同主题 |

#### 共享测试逻辑

自动测试采用参数化设计，共享测试逻辑，每个主题传入配置：

```typescript
// tests/shared/types.ts
interface ThemeTestConfig {
  name: string;                 // 主题名称 'green' | 'blue'
  lightBgPrimary: string;       // 浅色背景色 '#fff'
  darkBgPrimary: string;        // 暗色背景色 '#1a1a1a'
  lightTextPrimary: string;     // 浅色文字色 '#444'
  darkTextPrimary: string;      // 暗色文字色 '#d0d0d0'
}

// tests/shared/theme-priority.ts
export function runPriorityTests(config: ThemeTestConfig) {
  for (const scenario of scenarios) {
    test(`[${config.name}] ${scenario.description}`, async ({ page }) => {
      // 使用 config 中的颜色值验证
      const bgColor = await getComputedStyle('--md-bg-primary');
      expect(bgColor).toBe(config.darkBgPrimary); // 或 lightBgPrimary
    });
  }
}

// tests/green.spec.ts
import { runPriorityTests } from './shared/theme-priority';

const greenConfig: ThemeTestConfig = {
  name: 'green',
  lightBgPrimary: '#fff',
  darkBgPrimary: '#1a1a1a',
  // ...
};

runPriorityTests(greenConfig);
```

#### 创建主题测试文件

在 `tests/` 目录创建 `{name}.spec.ts`：

```typescript
// tests/blue.spec.ts
import { test, expect } from '@playwright/test';
import { runPriorityTests, runVisualTests } from './shared';
import type { ThemeTestConfig } from './shared/types';

const config: ThemeTestConfig = {
  name: 'blue',
  lightBgPrimary: '#e3f2fd',
  darkBgPrimary: '#0d1b2a',
  lightTextPrimary: '#0d47a1',
  darkTextPrimary: '#90caf9',
};

// 优先级测试
runPriorityTests(config);

// 视觉回归测试
runVisualTests(config);

// 主题特有测试
test('[blue] 链接颜色正确', async ({ page }) => {
  await page.goto('/test/index.html?theme=blue');
  const linkColor = await getComputedStyle('--md-link');
  expect(linkColor).toBe('#1976d2');
});
```

#### 运行测试

```bash
npm run test              # 运行所有测试
npm run test -- --grep=blue  # 仅测试蓝色主题
```

### 命名规范

| 类型 | 格式 | 示例 |
|------|------|------|
| 主题名称 | `{name}` | `blue`, `purple`, `ocean` |
| 变量前缀 | `$md-{name}-{mode}-colors` | `$md-blue-light-colors` |
| Mixin 前缀 | `{name}-{mode}-colors` | `blue-light-colors` |
| 入口文件 | `md-{name}[-{mode}].scss` | `md-blue-light.scss` |
| 输出文件 | `md-{name}[-{mode}].css` | `md-blue-light.css` |
| 测试文件 | `{name}.spec.ts` | `blue.spec.ts` |
| 测试配置 | `ThemeTestConfig` 对象 | `{ name: 'blue', ... }` |

## 构建

```bash
npm run build    # 编译所有版本
npm run watch    # 监听文件变化
```

## 许可证

MIT