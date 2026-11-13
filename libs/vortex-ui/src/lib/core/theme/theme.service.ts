import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

/**
 * Temas oficiais VortexUI.
 * `fluent` permanece como alias estável de `fluent-blue-light` (default ThemeBuilder Blue Light).
 */
export type VortexTheme =
  | 'fluent'
  | 'fluent-blue-light'
  | 'fluent-blue-dark'
  | 'fluent-saas-light'
  | 'fluent-saas-dark'
  | 'lds';

/** Temas listados no switcher (sem duplicar o alias `fluent`). */
export const VORTEX_THEMES = [
  'fluent-blue-light',
  'fluent-blue-dark',
  'fluent-saas-light',
  'fluent-saas-dark',
  'lds',
] as const satisfies readonly VortexTheme[];

export const VORTEX_DEFAULT_THEME: VortexTheme = 'fluent-blue-light';

export const VORTEX_THEME_LABELS: Record<VortexTheme, string> = {
  fluent: 'Fluent Blue Light',
  'fluent-blue-light': 'Fluent Blue Light',
  'fluent-blue-dark': 'Fluent Blue Dark',
  'fluent-saas-light': 'Fluent SaaS Light',
  'fluent-saas-dark': 'Fluent SaaS Dark',
  lds: 'LDS',
};

export interface VortexThemeConfig {
  defaultTheme?: VortexTheme;
  storageKey?: string;
}

@Injectable({ providedIn: 'root' })
export class VortexThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly storageKey = 'vortex-ui-theme';

  readonly theme = signal<VortexTheme>(VORTEX_DEFAULT_THEME);

  /** Tema canônico aplicado no DOM (`fluent` → `fluent-blue-light`). */
  readonly resolvedTheme = computed(() => this.canonicalize(this.theme()));

  readonly availableThemes = VORTEX_THEMES;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.init();
    }

    effect(() => {
      this.applyTheme(this.resolvedTheme());
    });
  }

  private init(): void {
    const stored = localStorage.getItem(this.storageKey);
    if (stored && this.isValidTheme(stored)) {
      this.theme.set(this.canonicalize(stored));
      return;
    }
    this.theme.set(VORTEX_DEFAULT_THEME);
  }

  setTheme(theme: VortexTheme): void {
    if (!this.isValidTheme(theme)) return;
    const next = this.canonicalize(theme);
    this.theme.set(next);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, next);
    }
  }

  /** Cicla pelos temas oficiais do switcher. */
  toggleTheme(): void {
    const list = VORTEX_THEMES;
    const idx = list.indexOf(this.resolvedTheme() as (typeof list)[number]);
    const next = list[(idx + 1) % list.length];
    this.setTheme(next);
  }

  private applyTheme(theme: VortexTheme): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const root = this.document.documentElement;
    root.setAttribute('data-vx-theme', theme);
  }

  private canonicalize(theme: VortexTheme | string): VortexTheme {
    if (theme === 'fluent') return 'fluent-blue-light';
    return theme as VortexTheme;
  }

  private isValidTheme(theme: string): theme is VortexTheme {
    return theme === 'fluent' || (VORTEX_THEMES as readonly string[]).includes(theme);
  }
}
