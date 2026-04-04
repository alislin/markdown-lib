import { test, expect, Page } from '@playwright/test';
import type { ThemeTestConfig, ThemeTestScenario } from './types';
import { scenarios } from './scenarios';

async function setupTheme(page: Page, scenario: ThemeTestScenario) {
  await page.evaluate((s) => {
    localStorage.clear();
    document.body.removeAttribute('data-theme');
    document.body.removeAttribute('data-vscode-theme-kind');
    
    if (s.vscodeTheme !== 'none') {
      localStorage.setItem('vscode-theme', s.vscodeTheme);
      if (s.vscodeTheme !== 'auto') {
        document.body.setAttribute('data-vscode-theme-kind', 'vscode-' + s.vscodeTheme);
      } else {
        document.body.setAttribute('data-vscode-theme-kind', 'auto');
      }
    }
    
    if (s.userTheme !== 'none' && s.userTheme !== 'auto') {
      localStorage.setItem('md-theme', s.userTheme);
      document.body.setAttribute('data-theme', s.userTheme);
    }
    
    if (s.userTheme === 'auto') {
      localStorage.setItem('md-theme', 'auto');
    }
  }, scenario);
}

async function verifyTheme(page: Page, scenario: ThemeTestScenario, config: ThemeTestConfig) {
  const themeValue = await page.locator('.active-theme-value').textContent();
  const themeSource = await page.locator('.active-theme-source').textContent();
  
  const expectedThemeText = scenario.expectedTheme === 'dark' ? '深色主题' : '浅色主题';
  const expectedSourceText = `来源: ${scenario.expectedSource}`;
  
  expect(themeValue).toBe(expectedThemeText);
  expect(themeSource).toBe(expectedSourceText);
  
  const bgColor = await page.evaluate(() => {
    return document.body.style.getPropertyValue('--md-bg-primary') || 
           getComputedStyle(document.body).getPropertyValue('--md-bg-primary');
  });
  
  if (scenario.expectedTheme === 'dark') {
    expect(bgColor.trim()).toBe(config.darkBgPrimary);
  } else {
    expect(bgColor.trim()).toMatch(/^#fff(?:fff)?$/i);
  }
}

export function runPriorityTests(config: ThemeTestConfig) {
  for (const scenario of scenarios) {
    test(`[${config.name}] 主题优先级: ${scenario.description}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scenario.systemTheme });
      
      await page.goto('/test/theme-priority.html');
      
      await page.waitForLoadState('networkidle');
      
      await setupTheme(page, scenario);
      
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      if (scenario.vscodeTheme !== 'none' && scenario.vscodeTheme !== 'auto') {
        await page.waitForFunction(() => document.body.hasAttribute('data-vscode-theme-kind'));
      }
      
      await verifyTheme(page, scenario, config);
    });
  }
}

export function runInteractionTests(config: ThemeTestConfig) {
  test(`[${config.name}] 场景对照表当前行高亮`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/test/theme-priority.html');
    await page.waitForLoadState('networkidle');
    
    await setupTheme(page, { systemTheme: 'dark', vscodeTheme: 'light', userTheme: 'dark', expectedTheme: 'dark', expectedSource: '用户选择', description: '' });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    const currentRow = page.locator('.scenario-table tbody tr.current-scenario');
    await expect(currentRow).toBeVisible();
    
    const rowData = await currentRow.evaluate((row) => {
      const cells = row.querySelectorAll('td');
      return {
        system: cells[0]?.textContent?.trim(),
        vscode: cells[1]?.textContent?.trim(),
        user: cells[2]?.textContent?.trim(),
        result: cells[3]?.textContent?.trim(),
        source: cells[4]?.textContent?.trim(),
      };
    });
    
    expect(rowData.system).toBe('dark');
    expect(rowData.vscode).toBe('light');
    expect(rowData.user).toBe('dark');
    expect(rowData.result).toBe('深色');
    expect(rowData.source).toBe('用户');
  });

  test(`[${config.name}] VSCode 设置按钮交互`, async ({ page }) => {
    await page.goto('/test/theme-priority.html');
    await page.waitForLoadState('networkidle');
    
    await page.click('.vscode-theme-btn[data-vscode="dark"]');
    await expect(page.locator('.vscode-theme-btn[data-vscode="dark"]')).toHaveClass(/active/);
    
    const vscodeAttr = await page.evaluate(() => document.body.getAttribute('data-vscode-theme-kind'));
    expect(vscodeAttr).toBe('vscode-dark');
  });

  test(`[${config.name}] 用户选择按钮交互`, async ({ page }) => {
    await page.goto('/test/theme-priority.html');
    await page.waitForLoadState('networkidle');
    
    await page.click('.user-theme-btn[data-user="light"]');
    await expect(page.locator('.user-theme-btn[data-user="light"]')).toHaveClass(/active/);
    
    const userAttr = await page.evaluate(() => document.body.getAttribute('data-theme'));
    expect(userAttr).toBe('light');
  });

  test(`[${config.name}] 系统主题显示正确`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/test/theme-priority.html');
    await page.waitForLoadState('networkidle');
    
    const systemStatus = await page.locator('.system-theme-status').textContent();
    expect(systemStatus).toContain('深色');
  });
}

export function runMarkStyleTests(config: ThemeTestConfig) {
  test(`[${config.name}] mark 高亮元素 - 浅色模式样式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    
    await page.waitForSelector('mark', { timeout: 5000 });
    
    const markStyles = await page.locator('mark').evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
      };
    });
    
    expect(markStyles.backgroundColor).toBe(hexToRgb(config.lightMarkBg));
    expect(markStyles.color).toBe(hexToRgb(config.lightMarkText));
  });

  test(`[${config.name}] mark 高亮元素 - 深色模式样式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    
    await page.waitForSelector('mark', { timeout: 5000 });
    
    const markStyles = await page.locator('mark').evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
      };
    });
    
    expect(markStyles.backgroundColor).toBe(hexToRgb(config.darkMarkBg));
    expect(markStyles.color).toBe(hexToRgb(config.darkMarkText));
  });
}

function hexToRgb(hex: string): string {
  let r: number, g: number, b: number;
  
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  } else {
    return hex;
  }
  
  return `rgb(${r}, ${g}, ${b})`;
}

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

  test(`[${config.name}] 链接样式 - 浅色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('a', { timeout: 5000 });

    const linkColor = await page.locator('a').first().evaluate((el) => {
      return getComputedStyle(el).color;
    });

    expect(linkColor).toBe(hexToRgb(config.lightLink!));
  });

  test(`[${config.name}] 链接样式 - 深色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('a', { timeout: 5000 });

    const linkColor = await page.locator('a').first().evaluate((el) => {
      return getComputedStyle(el).color;
    });

    expect(linkColor).toBe(hexToRgb(config.darkLink!));
  });

  test(`[${config.name}] 代码样式 - 浅色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('code', { timeout: 5000 });

    const codeInline = await page.locator('code').first().evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        bg: styles.backgroundColor,
        text: styles.color,
      };
    });

    expect(codeInline.bg).toBe(hexToRgb(config.lightBgCode!));
    expect(codeInline.text).toBe(hexToRgb(config.lightCodeText!));
  });

  test(`[${config.name}] 代码样式 - 深色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('code', { timeout: 5000 });

    const codeInline = await page.locator('code').first().evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        bg: styles.backgroundColor,
        text: styles.color,
      };
    });

    expect(codeInline.bg).toBe(hexToRgb(config.darkBgCode!));
    expect(codeInline.text).toBe(hexToRgb(config.darkCodeText!));
  });

  test(`[${config.name}] 引用块样式 - 浅色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('blockquote', { timeout: 5000 });

    const blockquoteStyles = await page.locator('blockquote').first().evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        bg: styles.backgroundColor,
        border: styles.borderLeftColor,
      };
    });

    expect(blockquoteStyles.bg).toBe(config.lightBgBlockquote!);
    expect(blockquoteStyles.border).toBe(config.lightBorderBlockquote!);
  });

  test(`[${config.name}] 引用块样式 - 深色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('blockquote', { timeout: 5000 });

    const blockquoteStyles = await page.locator('blockquote').first().evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        bg: styles.backgroundColor,
        border: styles.borderLeftColor,
      };
    });

    expect(blockquoteStyles.bg).toBe(config.darkBgBlockquote!);
    expect(blockquoteStyles.border).toBe(config.darkBorderBlockquote!);
  });

  test(`[${config.name}] 表格样式 - 浅色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('table th', { timeout: 5000 });

    const tableHeaderBg = await page.locator('table th').first().evaluate((el) => {
      return getComputedStyle(el).backgroundColor;
    });

    expect(tableHeaderBg).toBe(hexToRgb(config.lightBgTableHeader!));
  });

  test(`[${config.name}] 表格样式 - 深色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('table th', { timeout: 5000 });

    const tableHeaderBg = await page.locator('table th').first().evaluate((el) => {
      return getComputedStyle(el).backgroundColor;
    });

    expect(tableHeaderBg).toBe(hexToRgb(config.darkBgTableHeader!));
  });

  test(`[${config.name}] 标题样式 - 浅色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1', { timeout: 5000 });

    const headingStyles = await page.locator('h1').first().evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        color: styles.color,
        borderBottomColor: styles.borderBottomColor,
      };
    });

    expect(headingStyles.color).toBe(hexToRgb(config.lightTextHeading!));
    expect(headingStyles.borderBottomColor).toBe(hexToRgb(config.lightBorderHeading!));
  });

  test(`[${config.name}] 标题样式 - 深色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1', { timeout: 5000 });

    const headingStyles = await page.locator('h1').first().evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        color: styles.color,
        borderBottomColor: styles.borderBottomColor,
      };
    });

    expect(headingStyles.color).toBe(hexToRgb(config.darkTextHeading!));
    expect(headingStyles.borderBottomColor).toBe(hexToRgb(config.darkBorderHeading!));
  });

  test(`[${config.name}] kbd 样式 - 浅色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('kbd', { timeout: 5000 });

    const kbdBg = await page.locator('kbd').first().evaluate((el) => {
      return getComputedStyle(el).backgroundColor;
    });

    expect(kbdBg).toBe(hexToRgb(config.lightBgCode!));
  });

  test(`[${config.name}] kbd 样式 - 深色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('kbd', { timeout: 5000 });

    const kbdBg = await page.locator('kbd').first().evaluate((el) => {
      return getComputedStyle(el).backgroundColor;
    });

    expect(kbdBg).toBe(hexToRgb(config.darkBgCode!));
  });

  test(`[${config.name}] hr 样式 - 浅色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('hr', { timeout: 5000 });

    const hrBorder = await page.locator('hr').evaluate((el) => {
      return getComputedStyle(el).backgroundColor;
    });

    expect(hrBorder).toBe(hexToRgb(config.lightBorder!));
  });

  test(`[${config.name}] hr 样式 - 深色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('hr', { timeout: 5000 });

    const hrBorder = await page.locator('hr').evaluate((el) => {
      return getComputedStyle(el).backgroundColor;
    });

    expect(hrBorder).toBe(hexToRgb(config.darkBorder!));
  });

  test(`[${config.name}] 图片样式 - 浅色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('img', { timeout: 5000 });

    const imgStyles = await page.locator('img').first().evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        border: styles.border,
        boxShadow: styles.boxShadow,
      };
    });

    expect(imgStyles.border).toContain(config.lightBorderImage!);
  });

  test(`[${config.name}] 图片样式 - 深色模式`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('img', { timeout: 5000 });

    const imgStyles = await page.locator('img').first().evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        border: styles.border,
        boxShadow: styles.boxShadow,
      };
    });

    expect(imgStyles.border).toContain(config.darkBorderImage!);
  });
}