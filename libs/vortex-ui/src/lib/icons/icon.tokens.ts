import { InjectionToken } from '@angular/core';
import type { VxIconsConfig } from './icon.types';

/** Extra / override icon packs provided by the application. */
export const VX_ICONS_CONFIG = new InjectionToken<VxIconsConfig>('VX_ICONS_CONFIG', {
  providedIn: 'root',
  factory: () => ({}),
});
