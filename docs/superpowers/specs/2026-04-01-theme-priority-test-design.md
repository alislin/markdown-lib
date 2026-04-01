# 主题优先级测试系统设计文档

**日期：** 2026-04-01  
**状态：** 待审核  
**范围：** 为 MD-Green Markdown 主题库添加主题优先级测试系统

---

## 概述

为测试文件添加一种场景系统，用于测试和验证主题优先级逻辑：系统主题、VSCode 主题设置、用户手动选择之间的优先级关系。

### 优先级规则

```
用户选择 > VSCode 设置 > 系统主题
```

- **用户选择**（最高优先级）：用户通过 UI 明确选择浅色或深色主题
- **VSCode 设置**：模拟 VSCode 编辑器的主题设置（auto、light、dark）
- **系统主题**（最低优先级）：操作系统的深色/浅色模式偏好

---

## 实现方案

采用纯 CSS 属性方案，使用多个 data 属性通过 CSS 选择器优先级实现主题应用。

### CSS 属性设计

```html
<html data-vscode-theme="light" data-theme="dark">
  <!-- data-theme: 用户手动选择（优先级最高） -->
  <!-- data-vscode-theme: VSCode 设置 -->
</html>
```

### 属性值定义

| 属性 | 可选值 | 说明 |
|------|--------|------|
| `data-theme` | `light`、`dark`、无 | 用户手动选择的主题 |
| `data-vscode-theme` | `auto`、`light`、`dark`、无 | VSCode 编辑器主题设置 |

---

## CSS 选择器优先级实现

### 浅色主题

```scss
// 优先级 1：用户手动选择浅色（最高）
[data-theme="light"] {
  --md-bg-primary: #ffffff;
  // ... 浅色主题变量
}

// 优先级 2：VSCode 设置为浅色（无用户选择时）
:root:not([data-theme])[data-vscode-theme="light"] {
  --md-bg-primary: #ffffff;
  // ... 浅色主题变量
}

// 优先级 3：系统浅色主题（默认，无需额外选择器）
```

### 深色主题

```scss
// 优先级 1：用户手动选择深色（最高）
[data-theme="dark"] {
  --md-bg-primary: #1a1a1a;
  // ... 深色主题变量
}

// 优先级 2：VSCode 设置为深色（无用户选择时）
:root:not([data-theme])[data-vscode-theme="dark"] {
  --md-bg-primary: #1a1a1a;
  // ... 深色主题变量
}

// 优先级 3：系统深色主题（已存在）
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]):not([data-vscode-theme="light"]) {
    // 当无用户选择，VSCode 不是 light 时，使用系统主题
  }
}
```

---

## 测试页面结构

创建 `test/theme-priority.html`，包含以下功能模块：

### 1. 主题来源控制面板

- **系统主题显示**：实时显示当前操作系统主题偏好（dark/light）
- **VSCode 设置选择器**：auto、light、dark、无四个选项
- **用户选择控制**：auto、light、dark 三个选项

### 2. 当前激活主题指示器

- 显示当前应用的主题（深色/浅色）
- 显示主题来源（用户选择、VSCode 设置、系统主题）

### 3. 场景对照表

完整展示所有主题来源组合及其对应的应用结果：

| 系统主题 | VSCode 设置 | 用户选择 | 最终主题 | 来源 |
|---------|------------|---------|---------|------|
| dark | 无 | - | dark | 系统 |
| light | 无 | - | light | 系统 |
| dark | auto | - | dark | 系统 |
| light | auto | - | light | 系统 |
| dark | light | - | light | VSCode |
| light | dark | - | dark | VSCode |
| dark | dark | - | dark | VSCode |
| light | light | - | light | VSCode |
| dark | light | light | light | 用户 |
| dark | light | dark | dark | 用户 |
| light | dark | light | light | 用户 |
| light | dark | dark | dark | 用户 |

当前场景行高亮显示。

### 4. Markdown 测试内容

包含标准 Markdown 元素：标题、段落、代码块、表格、引用、列表等，用于验证不同场景下的样式表现。

---

## 文件修改清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/scss/themes/_light.scss` | 修改 | 添加 VSCode light 优先级选择器 |
| `src/scss/themes/_dark.scss` | 修改 | 添加 VSCode dark 优先级选择器，调整系统主题选择器 |
| `test/theme-priority.html` | 新建 | 测试页面 HTML |
| `test/_theme-priority.js` | 新建 | 主题优先级控制 JavaScript |
| `test/_theme-priority.css` | 新建 | 测试页面专用样式 |
| `test/_nav.js` | 修改 | 确保与 data-vscode-theme 属性兼容 |

---

## JavaScript 功能设计

`test/_theme-priority.js` 主要功能：

```javascript
// 1. 检测系统主题
const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// 2. 监听系统主题变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateStatus);

// 3. 管理 VSCode 设置
function setVscodeTheme(theme) {
  if (theme === 'none') {
    document.documentElement.removeAttribute('data-vscode-theme');
  } else {
    document.documentElement.setAttribute('data-vscode-theme', theme);
  }
  localStorage.setItem('vscode-theme', theme);
  updateStatus();
}

// 4. 管理用户选择（复用/扩展现有逻辑）
function setUserTheme(theme) {
  if (theme === 'auto') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
  localStorage.setItem('md-theme', theme);
  updateStatus();
}

// 5. 计算当前激活主题及来源
function calculateActiveTheme() {
  const userTheme = document.documentElement.getAttribute('data-theme');
  const vscodeTheme = document.documentElement.getAttribute('data-vscode-theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (userTheme) {
    return { theme: userTheme, source: '用户选择' };
  }
  
  if (vscodeTheme && vscodeTheme !== 'auto') {
    return { theme: vscodeTheme, source: 'VSCode 设置' };
  }
  
  return { theme: systemDark ? 'dark' : 'light', source: '系统主题' };
}

// 6. 更新 UI 显示和高亮当前场景行
function updateStatus() {
  // 更新主题指示器
  // 高亮对照表中对应的行
}
```

---

## 测试验证

实现完成后需验证：

1. CSS 选择器优先级正确生效
2. 所有 12 种场景组合应用正确的主题
3. 系统主题变化时实时更新
4. 主题来源指示器显示正确
5. Markdown 内容在不同主题下样式正确

---

## 边界情况

- 用户选择 auto 后，应清除 data-theme 属性，让 VSCode 或系统主题生效
- VSCode 设置为 auto 时，应跟随系统主题
- VSCode 设置为无时，直接使用系统主题（跳过 VSCode 层级）

---

## 实现顺序

1. 修改 SCSS 文件，添加新的选择器
2. 创建测试页面 HTML 结构
3. 创建测试页面 CSS 样式
4. 创建 JavaScript 逻辑
5. 更新 _nav.js 兼容性
6. 测试验证所有场景