import { Component, ChangeDetectionStrategy, computed, input, model } from '@angular/core';

@Component({
  selector: 'vx-pagination',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="vx-pg" [attr.aria-label]="ariaLabel()">
      <button type="button" [disabled]="page() <= 1" (click)="go(page() - 1)" aria-label="Página anterior">‹</button>
      @for (p of pages(); track p) {
        <button
          type="button"
          class="vx-pg__num"
          [class.vx-pg__num--active]="p === page()"
          [attr.aria-current]="p === page() ? 'page' : null"
          (click)="go(p)"
        >
          {{ p }}
        </button>
      }
      <button type="button" [disabled]="page() >= totalPages()" (click)="go(page() + 1)" aria-label="Próxima página">›</button>
    </nav>
  `,
  styles: `
    :host { display: inline-flex; }
    .vx-pg { display: inline-flex; align-items: center; gap: var(--vx-space-1); font-family: var(--vx-font-sans); }
    .vx-pg button {
      min-width: 2rem; height: 2rem; border: 1px solid var(--vx-color-border);
      border-radius: var(--vx-radius-sm); background: var(--vx-color-bg-elevated);
      font: inherit; font-size: var(--vx-font-size-sm); cursor: pointer;
    }
    .vx-pg button:disabled { opacity: 0.45; cursor: not-allowed; }
    .vx-pg__num--active { background: var(--vx-color-primary); border-color: var(--vx-color-primary); color: var(--vx-color-primary-text); }
  `,
})
export class VxPaginationComponent {
  readonly totalItems = input(0);
  readonly pageSize = input(10);
  readonly page = model(1);
  readonly ariaLabel = input('Paginação');

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalItems() / this.pageSize())));

  readonly pages = computed(() => {
    const n = this.totalPages();
    return Array.from({ length: Math.min(n, 7) }, (_, i) => i + 1);
  });

  go(p: number): void {
    const clamped = Math.min(this.totalPages(), Math.max(1, p));
    this.page.set(clamped);
  }
}
