import { Injectable, inject } from '@angular/core';
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { FLUENT_ICON_PACK } from './fluent/pack';
import { VX_ICONS_CONFIG } from './icon.tokens';
import type {
  VxIconDefinition,
  VxIconSet,
  VxIconSize,
  VxIconVariant,
  VxIconsConfig,
} from './icon.types';

const SIZE_FALLBACKS: readonly number[] = [20, 24, 16, 28, 32, 12];

@Injectable({ providedIn: 'root' })
export class VxIconRegistry {
  private readonly extra = inject(VX_ICONS_CONFIG, { optional: true }) ?? {};

  private readonly packs: Record<VxIconSet, Record<string, VxIconDefinition>> = {
    fluent: { ...FLUENT_ICON_PACK, ...(this.extra.fluent ?? {}) },
    material: { ...(this.extra.material ?? {}) },
  };

  /** Merge additional icons at runtime (e.g. lazy feature modules). */
  register(config: VxIconsConfig): void {
    if (config.fluent) {
      Object.assign(this.packs.fluent, config.fluent);
    }
    if (config.material) {
      Object.assign(this.packs.material, config.material);
    }
  }

  has(name: string, set: VxIconSet = 'fluent'): boolean {
    return Boolean(this.packs[set]?.[name]);
  }

  names(set: VxIconSet = 'fluent'): string[] {
    return Object.keys(this.packs[set] ?? {});
  }

  /**
   * Resolve SVG markup for name/set/variant/size with size fallback.
   * Returns null when the icon is not registered.
   */
  resolve(
    name: string,
    set: VxIconSet = 'fluent',
    variant: VxIconVariant = 'regular',
    size: VxIconSize | number = 20,
  ): string | null {
    const def = this.packs[set]?.[name];
    if (!def) {
      return null;
    }

    const preferredVariant = def[variant] ?? def.regular ?? def.filled;
    if (!preferredVariant) {
      return null;
    }

    const exact = preferredVariant[size];
    if (exact) {
      return exact;
    }

    for (const fallback of SIZE_FALLBACKS) {
      const svg = preferredVariant[fallback];
      if (svg) {
        return svg;
      }
    }

    const anySize = Object.values(preferredVariant)[0];
    return anySize ?? null;
  }
}

/** Register extra Fluent / Material icons at app bootstrap. */
export function provideVxIcons(config: VxIconsConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: VX_ICONS_CONFIG, useValue: config },
  ]);
}
