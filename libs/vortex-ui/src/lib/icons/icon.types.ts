export type VxIconSet = 'fluent' | 'material';

export type VxIconVariant = 'regular' | 'filled';

/** Native Fluent artwork sizes we ship / resolve against. */
export type VxIconSize = 12 | 16 | 20 | 24 | 28 | 32;

/**
 * Per-icon definition: SVG markup keyed by variant then size.
 * Markup should use fill="currentColor" (or no fill) so themes apply.
 */
export type VxIconDefinition = Partial<
  Record<VxIconVariant, Partial<Record<number, string>>>
>;

export type VxIconPack = Record<string, VxIconDefinition>;

export interface VxIconsConfig {
  fluent?: VxIconPack;
  material?: VxIconPack;
}
