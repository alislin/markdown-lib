# 元素样式测试扩展设计

## 目标

扩展现有自动测试，覆盖所有 Markdown 元素在浅色和深色主题下的样式验证。

## 背景

当前测试仅覆盖：
- 12 种主题优先级场景
- 交互测试（按钮、表格高亮）
- `mark` 元素样式

缺失的核心元素样式测试：
- `body` 背景/文本色
- `a` 链接样式（默认、hover、visited）
- `code` / `pre` 代码块
- `blockquote` 引用块
- `table` 表格（thead、tbody hover）
- `h1-h5` 标题
- `kbd` 键盘按键
- `hr` 水平线
- `img` 图片边框
- `dl` 定义列表
- 表单元素

## 设计方案

### 1. 扩展类型定义 `tests/shared/types.ts`

新增完整元素样式配置字段：

```typescript
export interface ThemeTestConfig {
  name: string;
  
  // 现有字段
  lightBgPrimary: string;
  darkBgPrimary: string;
  lightTextPrimary: string;
  darkTextPrimary: string;
  lightMarkBg: string;
  lightMarkText: string;
  darkMarkBg: string;
  darkMarkText: string;
  
  // 新增：链接样式
  lightLink: string;
  darkLink: string;
  lightLinkHover: string;
  darkLinkHover: string;
  lightLinkVisited: string;
  darkLinkVisited: string;
  
  // 新增：代码样式
  lightCodeText: string;
  darkCodeText: string;
  lightBgCode: string;
  darkBgCode: string;
  lightCodeBorder: string;
  darkCodeBorder: string;
  
  // 新增：引用块样式
  lightBgBlockquote: string;
  darkBgBlockquote: string;
  lightTextBlockquote: string;
  darkTextBlockquote: string;
  lightBorderBlockquote: string;
  darkBorderBlockquote: string;
  
  // 新增：表格样式
  lightBgTableHeader: string;
  darkBgTableHeader: string;
  lightBgTableHover: string;
  darkBgTableHover: string;
  lightBorderTable: string;
  darkBorderTable: string;
  
  // 新增：标题样式
  lightTextHeading: string;
  darkTextHeading: string;
  lightBorderHeading: string;
  darkBorderHeading: string;
  
  // 新增：其他元素
  lightBorder: string;
  darkBorder: string;
  lightBorderImage: string;
  darkBorderImage: string;
  lightShadowImage: string;
  darkShadowImage: string;
}
```

### 2. 新增测试函数 `tests/shared/theme-priority.ts`

添加 `runElementStyleTests(config: ThemeTestConfig)` 函数，包含以下测试用例：

#### 测试分组

| 测试名称 | 验证元素 | 验证变量 |
|---------|---------|---------|
| body 背景与文本 | `body` | `--md-bg-primary`, `--md-text-primary` |
| 链接样式 | `a`, `a:hover` | `--md-link`, `--md-link-hover` |
| 代码样式 | `code`, `pre` | `--md-bg-code`, `--md-code-text` |
| 引用块样式 | `blockquote` | `--md-bg-blockquote`, `--md-border-blockquote` |
| 表格样式 | `table th`, `table tr:hover` | `--md-bg-table-header`, `--md-bg-table-hover` |
| 标题样式 | `h1`, `h2` | `--md-text-heading`, `--md-border-heading` |
| kbd 样式 | `kbd` | `--md-bg-code`, border |
| hr 边框样式 | `hr` | `--md-border` |
| 图片样式 | `img` | `--md-border-image`, `--md-shadow-image` |

#### 测试模式

每个测试用例包含两种主题模式验证：
- 浅色模式：`page.emulateMedia({ colorScheme: 'light' })`
- 深色模式：`page.emulateMedia({ colorScheme: 'dark' })`

#### 验证方式

验证 CSS 变量值是否正确应用：

```typescript
const bgColor = await page.evaluate(() => {
  return getComputedStyle(document.body).getPropertyValue('--md-bg-primary').trim();
});
expect(bgColor).toBe(config.lightBgPrimary);
```

### 3. 更新配置 `tests/green.spec.ts`

根据 `src/scss/core/_variables.scss` 中的变量值填充完整配置：

```typescript
const config: ThemeTestConfig = {
  name: 'green',
  
  // 现有配置
  lightBgPrimary: '#fff',
  darkBgPrimary: '#1a1a1a',
  lightTextPrimary: '#444',
  darkTextPrimary: '#d0d0d0',
  lightMarkBg: '#fff59d',
  lightMarkText: '#000',
  darkMarkBg: '#5c4e00',
  darkMarkText: '#fff176',
  
  // 新增：链接（根据 _variables.scss）
  lightLink: '#09f',
  darkLink: '#5ca8ff',
  lightLinkHover: '#f60',
  darkLinkHover: '#ff914d',
  lightLinkVisited: 'purple',
  darkLinkVisited: '#b380ff',
  
  // 新增：代码
  lightCodeText: '#F44336',
  darkCodeText: '#ff6b6b',
  lightBgCode: '#f7f7f7',
  darkBgCode: '#252525',
  lightCodeBorder: '#6CE26C',
  darkCodeBorder: '#4CAF50',
  
  // 新增：引用块
  lightBgBlockquote: 'rgb(244 255 244)',
  darkBgBlockquote: '#242424',
  lightTextBlockquote: '#3c3c3c',
  darkTextBlockquote: '#d0d0d0',
  lightBorderBlockquote: 'rgb(9 180 66)',
  darkBorderBlockquote: '#388E3C',
  
  // 新增：表格
  lightBgTableHeader: '#dce9f9',
  darkBgTableHeader: '#2d2d2d',
  lightBgTableHover: '#fbf8e9',
  darkBgTableHover: '#2a2a2a',
  lightBorderTable: '#ccc',
  darkBorderTable: '#333',
  
  // 新增：标题
  lightTextHeading: '#111',
  darkTextHeading: '#f0f0f0',
  lightBorderHeading: '#EFEAEA',
  darkBorderHeading: '#404040',
  
  // 新增：其他
  lightBorder: '#EFEAEA',
  darkBorder: '#404040',
  lightBorderImage: 'gray',
  darkBorderImage: '#444',
  lightShadowImage: '5px 5px 5px grey',
  darkShadowImage: '5px 5px 15px rgb(0 0 0 / 50%)',
};

runPriorityTests(config);
runInteractionTests(config);
runMarkStyleTests(config);
runElementStyleTests(config);  // 新增
```

## 测试数量估算

| 类别 | 当前测试数 | 新增测试数 | 总计 |
|------|-----------|-----------|------|
| 主题优先级 | 12 | 0 | 12 |
| 交互测试 | 4 | 0 | 4 |
| mark 样式 | 2 | 0 | 2 |
| 元素样式（新增） | 0 | 9 | 9 |
| **总计** | **18** | **9** | **27** |

每个元素样式测试包含浅色和深色两种验证，实际断言数约为 18 个。

## 文件变更

1. `tests/shared/types.ts` - 扩展接口定义
2. `tests/shared/theme-priority.ts` - 添加 `runElementStyleTests` 函数
3. `tests/green.spec.ts` - 扩展配置并调用新测试

## 验证方式

运行 `npx playwright test --reporter=list` 验证所有 27 个测试通过。