/**
 * Secondary entry: `vortex-ui/icons/fluent-full` (alias `@vortex-ui/icons/fluent-full`).
 *
 * Full Fluent UI System Icons pack (MIT). Opt-in — does not load with the core bundle.
 *
 * ```ts
 * import { provideFluentFullIcons, FLUENT_FULL_ICON_NAMES } from 'vortex-ui/icons/fluent-full';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [provideFluentFullIcons()],
 * };
 * ```
 */
export {
  FLUENT_FULL_ICON_PACK,
  FLUENT_FULL_ICON_NAMES,
} from './generated';
export type {
  VxIconDefinition,
  VxIconPack,
  VxIconSet,
  VxIconSize,
  VxIconVariant,
  VxIconsConfig,
} from './types';
export { provideFluentFullIcons } from './provide';
