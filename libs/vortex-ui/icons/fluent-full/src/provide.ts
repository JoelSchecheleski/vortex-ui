import { EnvironmentProviders } from '@angular/core';
import { provideVxIcons } from 'vortex-ui';
import { FLUENT_FULL_ICON_PACK } from './generated';

/**
 * Registers the full Fluent icon catalog into `VxIconRegistry`
 * (merged on top of the curated core pack).
 */
export function provideFluentFullIcons(): EnvironmentProviders {
  return provideVxIcons({ fluent: FLUENT_FULL_ICON_PACK });
}
