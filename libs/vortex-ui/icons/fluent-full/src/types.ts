/**
 * Local mirror of core icon pack types so this secondary entry
 * does not deep-import `vortex-ui` source (ng-packagr rootDir).
 */
export type VxIconSet = 'fluent' | 'material';
export type VxIconVariant = 'regular' | 'filled';
export type VxIconSize = 12 | 16 | 20 | 24 | 28 | 32;

export type VxIconDefinition = Partial<
  Record<VxIconVariant, Partial<Record<number, string>>>
>;

export type VxIconPack = Record<string, VxIconDefinition>;

export interface VxIconsConfig {
  fluent?: VxIconPack;
  material?: VxIconPack;
}
