import { applicationConfig, Preview } from '@storybook/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import {
  VORTEX_THEMES,
  VORTEX_THEME_LABELS,
  type VortexTheme,
} from '../src/lib/core/theme/theme.service';

function applyTheme(theme: VortexTheme): void {
  if (typeof document === 'undefined') return;
  const resolved = theme === 'fluent' ? 'fluent-blue-light' : theme;
  document.documentElement.setAttribute('data-vx-theme', resolved);
}

const preview: Preview = {
  parameters: {
    layout: 'padded',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
  globalTypes: {
    theme: {
      description: 'Tema VortexUI',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: VORTEX_THEMES.map((value) => ({
          value,
          title: VORTEX_THEME_LABELS[value],
        })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'fluent-blue-light',
  },
  decorators: [
    applicationConfig({
      providers: [provideZonelessChangeDetection()],
    }),
    (storyFn, context) => {
      const theme = (context.globals['theme'] as VortexTheme) ?? 'fluent-blue-light';
      applyTheme(theme);
      return storyFn();
    },
  ],
};

export default preview;
