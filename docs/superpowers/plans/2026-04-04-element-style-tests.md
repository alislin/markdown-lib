# 元素样式测试扩展实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 扩展 Playwright 测试框架，覆盖所有 Markdown 元素在浅色和深色主题下的样式验证

**Architecture:** 在现有测试框架基础上扩展，通过 CSS 变量验证确保样式正确性，每个元素独立测试用例

**Tech Stack:** Playwright, TypeScript, CSS Variables

---

## 文件结构

| 文件 | 变更类型 | 说明 |
|-----|---------|------|
| `tests/shared/types.ts` | 修改 | 扩展 ThemeTestConfig 接口，新增 20+ 样式配置字段 |
| `tests/shared/theme-priority.ts` | 修改 | 添加 runElementStyleTests 函数，包含 9 个测试用例 |
| `tests/green.spec.ts` | 修改 | 扩展 config 配置对象，调用新增测试函数 |

---

## Task 1: 扩展 types.ts 接口定义

**Files:**
- Modify: `tests/shared/types.ts:1-20`

- [ ] **Step 1: 扩展 ThemeTestConfig 接口**

编辑 `tests/shared/types.ts`，在现有接口后添加新字段：

```typescript
export interface ThemeTestConfig {
  name: string;
  lightBgPrimary: string;
  darkBgPrimary: string;
  lightTextPrimary: string;
  darkTextPrimary: string;
  lightMarkBg: string;
  lightMarkText: string;
  darkMarkBg: string;
  darkMarkText: string;
  lightLink: string;
  darkLink: string;
  lightLinkHover: string;
  darkLinkHover: string;
  lightLinkVisited: string;
  darkLinkVisited: string;
  lightCodeText: string;
  darkCodeText: string;
  lightBgCode: string;
  darkBgCode: string;
  lightCodeBorder: string;
  darkCodeBorder: string;
  lightBgBlockquote: string;
  darkBgBlockquote: string;
  lightTextBlockquote: string;
  darkTextBlockquote: string;
  lightBorderBlockquote: string;
  darkBorderBlockquote: string;
  lightBgTableHeader: string;
  darkBgTableHeader: string;
  lightBgTableHover: string;
  darkBgTableHover: string;
  lightBorderTable: string;
  darkBorderTable: string;
  lightTextHeading: string;
  darkTextHeading: string;
  lightBorderHeading: string;
  darkBorderHeading: string;
  lightBorder: string;
  darkBorder: string;
  lightBorderImage: string;
  darkBorderImage: string;
  lightShadowImage: string;
  darkShadowImage: string;
}
```

- [ ] **Step 2: 验证 TypeScript 编译**

运行: `npx tsc --noEmit tests/shared/types.ts`

预期: 无错误输出

- [ ] **Step 3: 提交变更**

```bash
git add tests/shared/types.ts
git commit -m "feat: 扩展 ThemeTestConfig 接口支持完整元素样式"
```

---

## Task 2: 添加 runElementStyleTests 函数骨架

**Files:**
- Modify: `tests/shared/theme-priority.ts:193`

- [ ] **Step 1: 添加 runElementStyleTests 函数声明**

在 `theme-priority.ts` 文件末尾（第 193 行后）添加：

```typescript
export function runElementStyleTests(config: ThemeTestConfig) {
}
```

- [ ] **Step 2: 验证 TypeScript 编译**

运行: `npx tsc --noEmit tests/shared/theme-priority.ts`

预期: 无错误输出（函数为空，但导出正确）

- [ ] **Step 3: 提交变更**

```bash
git add tests/shared/theme-priority.ts
git commit -m "feat: 添加 runElementStyleTests 函数骨架"
```

---

## Task 3: 实现 body 样式测试

**Files:**
- Modify: `tests/shared/theme-priority.ts:194-195`

- [ ] **Step 1: 在 runElementStyleTests 函数中添加 body 测试**

替换空函数体为：

```typescript
export function runElementStyleTests(config: ThemeTestConfig) {
  test(`[${config.name}] body 背景与文本 - 浅色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    const bgPrimary = await page.evaluate(() => {
      return getComputedStyle(document.body).getPropertyValue('--md-bg-primary').trim();
    });
    const textPrimary = await page.evaluate(() => {
      return getComputedStyle(document.body).getPropertyValue('--md-text-primary').trim();
    });

    expect(bgPrimary).toBe(config.lightBgPrimary);
    expect(textPrimary).toBe(config.lightTextPrimary);
  });

  test(`[${config.name}] body 背景与文本 - 深色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    const bgPrimary = await page.evaluate(() => {
      return getComputedStyle(document.body).getPropertyValue('--md-bg-primary').trim();
    });
    const textPrimary = await page.evaluate(() => {
      return getComputedStyle(document.body).getPropertyValue('--md-text-primary').trim();
    });

    expect(bgPrimary).toBe(config.darkBgPrimary);
    expect(textPrimary).toBe(config.darkTextPrimary);
  });
}
```

- [ ] **Step 2: 运行测试验证**

运行: `npx playwright test --grep "body 背景与文本" --reporter=list`

预期: 2 个测试通过

- [ ] **Step 3: 提交变更**

```bash
git add tests/shared/theme-priority.ts
git commit -m "feat: 添加 body 样式测试（浅色/深色模式）"
```

---

## Task 4: 实现链接样式测试

**Files:**
- Modify: `tests/shared/theme-priority.ts` （在 body 测试后追加）

- [ ] **Step 1: 添加链接样式测试**

在 runElementStyleTests 函数的最后一个测试后添加：

```typescript
  test(`[${config.name}] 链接样式 - 浅色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('a', { timeout: 5000 });

    const linkColor = await page.locator('a').first().evaluate((el) => {
      return getComputedStyle(el).getPropertyValue('--md-link').trim();
    });

    expect(linkColor).toBe(config.lightLink);
  });

  test(`[${config.name}] 链接样式 - 深色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('a', { timeout: 5000 });

    const linkColor = await page.locator('a').first().evaluate((el) => {
      return getComputedStyle(el).getPropertyValue('--md-link').trim();
    });

    expect(linkColor).toBe(config.darkLink);
  });
```

- [ ] **Step 2: 运行测试验证**

运行: `npx playwright test --grep "链接样式" --reporter=list`

预期: 2 个测试通过

- [ ] **Step 3: 提交变更**

```bash
git add tests/shared/theme-priority.ts
git commit -m "feat: 添加链接样式测试（浅色/深色模式）"
```

---

## Task 5: 实现代码样式测试

**Files:**
- Modify: `tests/shared/theme-priority.ts` （在链接测试后追加）

- [ ] **Step 1: 添加代码样式测试**

在 runElementStyleTests 函数中追加：

```typescript
  test(`[${config.name}] 代码样式 - 浅色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('code', { timeout: 5000 });

    const codeInline = await page.locator('code').first().evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        bg: styles.getPropertyValue('--md-bg-code').trim(),
        text: styles.getPropertyValue('--md-code-text').trim(),
      };
    });

    expect(codeInline.bg).toBe(config.lightBgCode);
    expect(codeInline.text).toBe(config.lightCodeText);
  });

  test(`[${config.name}] 代码样式 - 深色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('code', { timeout: 5000 });

    const codeInline = await page.locator('code').first().evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        bg: styles.getPropertyValue('--md-bg-code').trim(),
        text: styles.getPropertyValue('--md-code-text').trim(),
      };
    });

    expect(codeInline.bg).toBe(config.darkBgCode);
    expect(codeInline.text).toBe(config.darkCodeText);
  });
```

- [ ] **Step 2: 运行测试验证**

运行: `npx playwright test --grep "代码样式" --reporter=list`

预期: 2 个测试通过

- [ ] **Step 3: 提交变更**

```bash
git add tests/shared/theme-priority.ts
git commit -m "feat: 添加代码样式测试（浅色/深色模式）"
```

---

## Task 6: 实现引用块样式测试

**Files:**
- Modify: `tests/shared/theme-priority.ts` （在代码测试后追加）

- [ ] **Step 1: 添加引用块样式测试**

在 runElementStyleTests 函数中追加：

```typescript
  test(`[${config.name}] 引用块样式 - 浅色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('blockquote', { timeout: 5000 });

    const blockquoteStyles = await page.locator('blockquote').first().evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        bg: styles.getPropertyValue('--md-bg-blockquote').trim(),
        border: styles.getPropertyValue('--md-border-blockquote').trim(),
      };
    });

    expect(blockquoteStyles.bg).toBe(config.lightBgBlockquote);
    expect(blockquoteStyles.border).toBe(config.lightBorderBlockquote);
  });

  test(`[${config.name}] 引用块样式 - 深色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('blockquote', { timeout: 5000 });

    const blockquoteStyles = await page.locator('blockquote').first().evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        bg: styles.getPropertyValue('--md-bg-blockquote').trim(),
        border: styles.getPropertyValue('--md-border-blockquote').trim(),
      };
    });

    expect(blockquoteStyles.bg).toBe(config.darkBgBlockquote);
    expect(blockquoteStyles.border).toBe(config.darkBorderBlockquote);
  });
```

- [ ] **Step 2: 运行测试验证**

运行: `npx playwright test --grep "引用块样式" --reporter=list`

预期: 2 个测试通过

- [ ] **Step 3: 提交变更**

```bash
git add tests/shared/theme-priority.ts
git commit -m "feat: 添加引用块样式测试（浅色/深色模式）"
```

---

## Task 7: 实现表格样式测试

**Files:**
- Modify: `tests/shared/theme-priority.ts` （在引用块测试后追加）

- [ ] **Step 1: 添加表格样式测试**

在 runElementStyleTests 函数中追加：

```typescript
  test(`[${config.name}] 表格样式 - 浅色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('table th', { timeout: 5000 });

    const tableHeaderBg = await page.locator('table th').first().evaluate((el) => {
      return getComputedStyle(el).getPropertyValue('--md-bg-table-header').trim();
    });

    expect(tableHeaderBg).toBe(config.lightBgTableHeader);
  });

  test(`[${config.name}] 表格样式 - 深色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('table th', { timeout: 5000 });

    const tableHeaderBg = await page.locator('table th').first().evaluate((el) => {
      return getComputedStyle(el).getPropertyValue('--md-bg-table-header').trim();
    });

    expect(tableHeaderBg).toBe(config.darkBgTableHeader);
  });
```

- [ ] **Step 2: 运行测试验证**

运行: `npx playwright test --grep "表格样式" --reporter=list`

预期: 2 个测试通过

- [ ] **Step 3: 提交变更**

```bash
git add tests/shared/theme-priority.ts
git commit -m "feat: 添加表格样式测试（浅色/深色模式）"
```

---

## Task 8: 实现标题样式测试

**Files:**
- Modify: `tests/shared/theme-priority.ts` （在表格测试后追加）

- [ ] **Step 1: 添加标题样式测试**

在 runElementStyleTests 函数中追加：

```typescript
  test(`[${config.name}] 标题样式 - 浅色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('h1', { timeout: 5000 });

    const headingStyles = await page.locator('h1').evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        color: styles.getPropertyValue('--md-text-heading').trim(),
        border: styles.getPropertyValue('--md-border-heading').trim(),
      };
    });

    expect(headingStyles.color).toBe(config.lightTextHeading);
    expect(headingStyles.border).toBe(config.lightBorderHeading);
  });

  test(`[${config.name}] 标题样式 - 深色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('h1', { timeout: 5000 });

    const headingStyles = await page.locator('h1').evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        color: styles.getPropertyValue('--md-text-heading').trim(),
        border: styles.getPropertyValue('--md-border-heading').trim(),
      };
    });

    expect(headingStyles.color).toBe(config.darkTextHeading);
    expect(headingStyles.border).toBe(config.darkBorderHeading);
  });
```

- [ ] **Step 2: 运行测试验证**

运行: `npx playwright test --grep "标题样式" --reporter=list`

预期: 2 个测试通过

- [ ] **Step 3: 提交变更**

```bash
git add tests/shared/theme-priority.ts
git commit -m "feat: 添加标题样式测试（浅色/深色模式）"
```

---

## Task 9: 实现 kbd/hr 样式测试

**Files:**
- Modify: `tests/shared/theme-priority.ts` （在标题测试后追加）

- [ ] **Step 1: 添加 kbd 样式测试**

在 runElementStyleTests 函数中追加：

```typescript
  test(`[${config.name}] kbd 样式 - 浅色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('kbd', { timeout: 5000 });

    const kbdBg = await page.locator('kbd').first().evaluate((el) => {
      return getComputedStyle(el).getPropertyValue('--md-bg-code').trim();
    });

    expect(kbdBg).toBe(config.lightBgCode);
  });

  test(`[${config.name}] kbd 样式 - 深色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('kbd', { timeout: 5000 });

    const kbdBg = await page.locator('kbd').first().evaluate((el) => {
      return getComputedStyle(el).getPropertyValue('--md-bg-code').trim();
    });

    expect(kbdBg).toBe(config.darkBgCode);
  });
```

- [ ] **Step 2: 添加 hr 样式测试**

继续追加：

```typescript
  test(`[${config.name}] hr 样式 - 浅色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('hr', { timeout: 5000 });

    const hrBorder = await page.locator('hr').evaluate((el) => {
      return getComputedStyle(el).getPropertyValue('--md-border').trim();
    });

    expect(hrBorder).toBe(config.lightBorder);
  });

  test(`[${config.name}] hr 样式 - 深色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('hr', { timeout: 5000 });

    const hrBorder = await page.locator('hr').evaluate((el) => {
      return getComputedStyle(el).getPropertyValue('--md-border').trim();
    });

    expect(hrBorder).toBe(config.darkBorder);
  });
```

- [ ] **Step 3: 运行 kbd/hr 测试验证**

运行: `npx playwright test --grep "kbd 样式|hr 样式" --reporter=list`

预期: 4 个测试通过

- [ ] **Step 4: 提交 kbd/hr 变更**

```bash
git add tests/shared/theme-priority.ts
git commit -m "feat: 添加 kbd/hr 样式测试（浅色/深色模式）"
```

---

## Task 10: 实现图片样式测试

**Files:**
- Modify: `tests/shared/theme-priority.ts` （在 hr 测试后追加）

- [ ] **Step 1: 添加图片样式测试**

在 runElementStyleTests 函数中追加：

```typescript
  test(`[${config.name}] 图片样式 - 浅色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('img', { timeout: 5000 });

    const imgStyles = await page.locator('img').first().evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        borderImage: styles.getPropertyValue('--md-border-image').trim(),
        shadowImage: styles.getPropertyValue('--md-shadow-image').trim(),
      };
    });

    expect(imgStyles.borderImage).toBe(config.lightBorderImage);
    expect(imgStyles.shadowImage).toBe(config.lightShadowImage);
  });

  test(`[${config.name}] 图片样式 - 深色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('img', { timeout: 5000 });

    const imgStyles = await page.locator('img').first().evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        borderImage: styles.getPropertyValue('--md-border-image').trim(),
        shadowImage: styles.getPropertyValue('--md-shadow-image').trim(),
      };
    });

    expect(imgStyles.borderImage).toBe(config.darkBorderImage);
    expect(imgStyles.shadowImage).toBe(config.darkShadowImage);
  });
```

- [ ] **Step 2: 运行图片测试验证**

运行: `npx playwright test --grep "图片样式" --reporter=list`

预期: 2 个测试通过

- [ ] **Step 3: 提交图片样式测试**

```bash
git add tests/shared/theme-priority.ts
git commit -m "feat: 添加图片样式测试（浅色/深色模式）"
```

---

## Task 11: 更新 green.spec.ts 配置

**Files:**
- Modify: `tests/green.spec.ts:4-18`

- [ ] **Step 1: 扩展 config 配置对象**

将现有 config 替换为完整配置：

```typescript
const config: ThemeTestConfig = {
  name: 'green',
  lightBgPrimary: '#fff',
  darkBgPrimary: '#1a1a1a',
  lightTextPrimary: '#444',
  darkTextPrimary: '#d0d0d0',
  lightMarkBg: '#fff59d',
  lightMarkText: '#000',
  darkMarkBg: '#5c4e00',
  darkMarkText: '#fff176',
  lightLink: '#09f',
  darkLink: '#5ca8ff',
  lightLinkHover: '#f60',
  darkLinkHover: '#ff914d',
  lightLinkVisited: 'purple',
  darkLinkVisited: '#b380ff',
  lightCodeText: '#F44336',
  darkCodeText: '#ff6b6b',
  lightBgCode: '#f7f7f7',
  darkBgCode: '#252525',
  lightCodeBorder: '#6CE26C',
  darkCodeBorder: '#4CAF50',
  lightBgBlockquote: 'rgb(244 255 244)',
  darkBgBlockquote: '#242424',
  lightTextBlockquote: '#3c3c3c',
  darkTextBlockquote: '#d0d0d0',
  lightBorderBlockquote: 'rgb(9 180 66)',
  darkBorderBlockquote: '#388E3C',
  lightBgTableHeader: '#dce9f9',
  darkBgTableHeader: '#2d2d2d',
  lightBgTableHover: '#fbf8e9',
  darkBgTableHover: '#2a2a2a',
  lightBorderTable: '#ccc',
  darkBorderTable: '#333',
  lightTextHeading: '#111',
  darkTextHeading: '#f0f0f0',
  lightBorderHeading: '#EFEAEA',
  darkBorderHeading: '#404040',
  lightBorder: '#EFEAEA',
  darkBorder: '#404040',
  lightBorderImage: 'gray',
  darkBorderImage: '#444',
  lightShadowImage: '5px 5px 5px grey',
  darkShadowImage: '5px 5px 15px rgb(0 0 0 / 50%)',
};
```

- [ ] **Step 2: 调用 runElementStyleTests**

在文件末尾添加：

```typescript
runElementStyleTests(config);
```

- [ ] **Step 3: 运行所有测试验证**

运行: `npx playwright test --reporter=list`

预期: 29 个测试全部通过（18 现有 + 11 新增：body 2 + 链接 2 + 代码 2 + 引用块 2 + 表格 2 + 标题 2 + kbd 2 + hr 2 + 图片 2）

- [ ] **Step 4: 提交变更**

```bash
git add tests/green.spec.ts
git commit -m "feat: 扩展 green.spec.ts 配置并调用元素样式测试"
```

---

## 验收标准

- ✅ 所有 29 个 Playwright 测试通过（18 现有 + 11 新增）
- ✅ TypeScript 编译无错误
- ✅ 每个元素测试覆盖浅色和深色两种模式
- ✅ 代码提交历史清晰（每个任务独立提交）