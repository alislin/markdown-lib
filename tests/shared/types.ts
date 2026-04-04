export interface ThemeTestConfig {
  name: string;
  lightBgPrimary: string;
  darkBgPrimary: string;
  lightTextPrimary: string;
  darkTextPrimary: string;
}

export interface ThemeTestScenario {
  systemTheme: 'dark' | 'light';
  vscodeTheme: 'none' | 'auto' | 'light' | 'dark';
  userTheme: 'none' | 'auto' | 'light' | 'dark';
  expectedTheme: 'dark' | 'light';
  expectedSource: '系统主题' | 'VSCode 设置' | '用户选择';
  description: string;
}