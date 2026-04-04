import { runPriorityTests, runInteractionTests, runMarkStyleTests, runElementStyleTests } from './shared/theme-priority';
import type { ThemeTestConfig } from './shared/types';

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
};

runPriorityTests(config);
runInteractionTests(config);
runMarkStyleTests(config);
runElementStyleTests(config);