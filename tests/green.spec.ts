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
  lightBgCode: '#f7f7f7',
  darkBgCode: '#252525',
  lightCodeText: '#F44336',
  darkCodeText: '#ff6b6b',
  lightBgBlockquote: 'rgb(244, 255, 244)',
  darkBgBlockquote: 'rgb(36, 36, 36)',
  lightBorderBlockquote: 'rgb(9, 180, 66)',
  darkBorderBlockquote: 'rgb(56, 142, 60)',
  lightBgTableHeader: '#dce9f9',
  darkBgTableHeader: '#2d2d2d',
  lightTextHeading: '#111',
  darkTextHeading: '#f0f0f0',
  lightBorderHeading: '#efeaea',
  darkBorderHeading: '#404040',
  lightBorder: '#efeaea',
  darkBorder: '#404040',
  lightBorderImage: 'rgb(128, 128, 128)',
  darkBorderImage: 'rgb(68, 68, 68)',
  lightShadowImage: 'none',
  darkShadowImage: 'none',
  lightKbdBg: 'rgba(0, 0, 0, 0)',
  darkKbdBg: '#2d2d2d',
};

runPriorityTests(config);
runInteractionTests(config);
runMarkStyleTests(config);
runElementStyleTests(config);