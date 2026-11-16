import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { VxIconRegistry } from '../../icons/icon.registry';
import type {
  VxIconSet,
  VxIconSize,
  VxIconVariant,
} from '../../icons/icon.types';

@Component({
  selector: 'vx-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'vx-icon',
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
    '[attr.role]': 'ariaLabel() ? "img" : null',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.aria-hidden]': 'ariaLabel() ? null : "true"',
  },
  template: `
    @if (safeSvg(); as svg) {
      <span class="vx-icon__svg" [innerHTML]="svg"></span>
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      line-height: 0;
      color: inherit;
      vertical-align: middle;
    }

    .vx-icon__svg {
      display: inline-flex;
      width: 100%;
      height: 100%;
    }

    .vx-icon__svg :is(svg) {
      width: 100%;
      height: 100%;
      display: block;
    }
  `,
})
export class VxIconComponent {
  private readonly registry = inject(VxIconRegistry);
  private readonly sanitizer = inject(DomSanitizer);

  readonly name = input.required<string>();
  readonly set = input<VxIconSet>('fluent');
  readonly size = input<VxIconSize>(20);
  readonly variant = input<VxIconVariant>('regular');
  readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' });

  readonly safeSvg = computed((): SafeHtml | null => {
    const markup = this.registry.resolve(
      this.name(),
      this.set(),
      this.variant(),
      this.size(),
    );
    if (!markup) {
      return null;
    }
    return this.sanitizer.bypassSecurityTrustHtml(markup);
  });
}
