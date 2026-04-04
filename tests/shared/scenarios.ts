import type { ThemeTestScenario } from './types';

export const scenarios: ThemeTestScenario[] = [
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