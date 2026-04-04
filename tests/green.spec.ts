import { runPriorityTests, runInteractionTests } from './shared/theme-priority';
import type { ThemeTestConfig } from './shared/types';

const config: ThemeTestConfig = {
  name: 'green',
  lightBgPrimary: '#fff',
  darkBgPrimary: '#1a1a1a',
  lightTextPrimary: '#444',
  darkTextPrimary: '#d0d0d0',
};

runPriorityTests(config);
runInteractionTests(config);