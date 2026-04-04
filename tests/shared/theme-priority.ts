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