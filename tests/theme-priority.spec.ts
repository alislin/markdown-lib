import { test, expect, Page } from '@playwright/test';

interface ThemeTestScenario {
  systemTheme: 'dark' | 'light';
  vscodeTheme: 'none' | 'auto' | 'light' | 'dark';
  userTheme: 'none' | 'auto' | 'light' | 'dark';
  expectedTheme: 'dark' | 'light';
  expectedSource: '系统主题' | 'VSCode 设置' | '用户选择';
  description: string;
}

const scenarios: ThemeTestScenario[] = [
  { systemTheme: 'dark', vscodeTheme: 'none', userTheme: 'none', expectedTheme: 'dark', expectedSource: '系统主题', description: '系统深色，无其他设置' },
  { systemTheme: 'light', vscodeTheme: 'none', userTheme: 'none', expectedTheme: 'light', expectedSource: '系统主题', description: '系统浅色，无其他设置' },
  { systemTheme: 'dark', vscodeTheme: 'auto', userTheme: 'none', expectedTheme: 'dark', expectedSource: '系统主题', description: '系统深色，VSCode auto' },
  { systemTheme: 'light', vscodeTheme: 'auto', userTheme: 'none', expectedTheme: 'light', expectedSource: '系统主题', description: '系统浅色，VSCode auto' },
  { systemTheme: 'dark', vscodeTheme: 'light', userTheme: 'none', expectedTheme: 'light', expectedSource: 'VSCode 设置', description: '系统深色，VSCode light' },
  { systemTheme: 'light', vscodeTheme: 'dark', userTheme: 'none', expectedTheme: 'dark', expectedSource: 'VSCode 设置', description: '系统浅色，VSCode dark' },
  { systemTheme: 'dark', vscodeTheme: 'dark', userTheme: 'none', expectedTheme: 'dark', expectedSource: 'VSCode 设置', description: '系统深色，VSCode dark' },
  { systemTheme: 'light', vscodeTheme: 'light', userTheme: 'none', expectedTheme: 'light', expectedSource: 'VSCode 设置', description: '系统浅色，VSCode light' },
  { systemTheme: 'dark', vscodeTheme: 'light', userTheme: 'light', expectedTheme: 'light', expectedSource: '用户选择', description: '用户选择 light 优先' },
  { systemTheme: 'dark', vscodeTheme: 'light', userTheme: 'dark', expectedTheme: 'dark', expectedSource: '用户选择', description: '用户选择 dark 优先' },
  { systemTheme: 'light', vscodeTheme: 'dark', userTheme: 'light', expectedTheme: 'light', expectedSource: '用户选择', description: '用户选择覆盖 VSCode' },
  { systemTheme: 'light', vscodeTheme: 'dark', userTheme: 'dark', expectedTheme: 'dark', expectedSource: '用户选择', description: '用户选择 dark 覆盖所有' },
];

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

async function verifyTheme(page: Page, scenario: ThemeTestScenario) {
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
    expect(bgColor.trim()).toBe('#1a1a1a');
  } else {
    expect(bgColor.trim()).toMatch(/^#fff(?:fff)?$/i);
  }
}

for (const scenario of scenarios) {
  test(`主题优先级: ${scenario.description}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scenario.systemTheme });
    
    await page.goto('/test/theme-priority.html');
    
    await page.waitForLoadState('networkidle');
    
    await setupTheme(page, scenario);
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    if (scenario.vscodeTheme !== 'none' && scenario.vscodeTheme !== 'auto') {
      await page.waitForFunction(() => document.body.hasAttribute('data-vscode-theme-kind'));
    }
    
    await verifyTheme(page, scenario);
  });
}

test('场景对照表当前行高亮', async ({ page }) => {
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

test('VSCode 设置按钮交互', async ({ page }) => {
  await page.goto('/test/theme-priority.html');
  await page.waitForLoadState('networkidle');
  
  await page.click('.vscode-theme-btn[data-vscode="dark"]');
  await expect(page.locator('.vscode-theme-btn[data-vscode="dark"]')).toHaveClass(/active/);
  
  const vscodeAttr = await page.evaluate(() => document.body.getAttribute('data-vscode-theme-kind'));
  expect(vscodeAttr).toBe('vscode-dark');
});

test('用户选择按钮交互', async ({ page }) => {
  await page.goto('/test/theme-priority.html');
  await page.waitForLoadState('networkidle');
  
  await page.click('.user-theme-btn[data-user="light"]');
  await expect(page.locator('.user-theme-btn[data-user="light"]')).toHaveClass(/active/);
  
  const userAttr = await page.evaluate(() => document.body.getAttribute('data-theme'));
  expect(userAttr).toBe('light');
});

test('系统主题显示正确', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/test/theme-priority.html');
  await page.waitForLoadState('networkidle');
  
  const systemStatus = await page.locator('.system-theme-status').textContent();
  expect(systemStatus).toContain('深色');
});