export interface ThemeTestConfig {
  name: string;
  lightBgPrimary?: string;
  darkBgPrimary?: string;
  lightTextPrimary?: string;
  darkTextPrimary?: string;
  lightMarkBg?: string;
  lightMarkText?: string;
  darkMarkBg?: string;
  darkMarkText?: string;
  lightLink?: string;
  darkLink?: string;
  lightLinkHover?: string;
  darkLinkHover?: string;
  lightLinkVisited?: string;
  darkLinkVisited?: string;
  lightCodeText?: string;
  darkCodeText?: string;
  lightBgCode?: string;
  darkBgCode?: string;
  lightCodeBorder?: string;
  darkCodeBorder?: string;
  lightBgBlockquote?: string;
  darkBgBlockquote?: string;
  lightTextBlockquote?: string;
  darkTextBlockquote?: string;
  lightBorderBlockquote?: string;
  darkBorderBlockquote?: string;
  lightBgTableHeader?: string;
  darkBgTableHeader?: string;
  lightBgTableHover?: string;
  darkBgTableHover?: string;
  lightBorderTable?: string;
  darkBorderTable?: string;
  lightTextHeading?: string;
  darkTextHeading?: string;
  lightBorderHeading?: string;
  darkBorderHeading?: string;
  lightBorder?: string;
  darkBorder?: string;
  lightBorderImage?: string;
  darkBorderImage?: string;
  lightShadowImage?: string;
  darkShadowImage?: string;
}

export interface ThemeTestScenario {
  systemTheme: 'dark' | 'light';
  vscodeTheme: 'none' | 'auto' | 'light' | 'dark';
  userTheme: 'none' | 'auto' | 'light' | 'dark';
  expectedTheme: 'dark' | 'light';
  expectedSource: '系统主题' | 'VSCode 设置' | '用户选择';
  description: string;
}