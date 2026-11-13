import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

export interface VxPivotFieldState {
  available: string[];
  rows: string[];
  columns: string[];
  values: string[];
}

@Component({
  selector: 'vx-pivot-field-chooser',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-pfc" [attr.aria-label]="ariaLabel()" role="group">
      @for (zone of zones; track zone.key) {
        <section class="vx-pfc__zone">
          <h4 class="vx-pfc__title">{{ zone.label }}</h4>
          <ul class="vx-pfc__list">
            @for (field of fieldState()[zone.key]; track field) {
              <li>
                <button type="button" class="vx-pfc__chip" (click)="move(field, zone.key)">{{ field }}</button>
              </li>
            }
          </ul>
        </section>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    .vx-pfc {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: var(--vx-space-3);
      font-family: var(--vx-font-sans);
      font-size: var(--vx-font-size-sm);
    }
    .vx-pfc__zone {
      border: 1px dashed var(--vx-color-border);
      border-radius: var(--vx-radius-md);
      padding: var(--vx-space-2);
      min-height: 80px;
    }
    .vx-pfc__title {
      margin: 0 0 var(--vx-space-2);
      font-size: var(--vx-font-size-xs);
      color: var(--vx-color-text-secondary);
      font-weight: var(--vx-font-weight-semibold);
    }
    .vx-pfc__list { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: var(--vx-space-1); }
    .vx-pfc__chip {
      border: 1px solid var(--vx-color-border);
      background: var(--vx-color-bg-elevated);
      border-radius: var(--vx-radius-sm);
      padding: 0.15rem 0.45rem;
      font: inherit;
      font-size: var(--vx-font-size-xs);
      cursor: pointer;
    }
  `,
})
export class VxPivotFieldChooserComponent {
  readonly fieldState = input.required<VxPivotFieldState>();
  readonly ariaLabel = input('Seletor de campos pivot');
  readonly fieldChange = output<VxPivotFieldState>();

  readonly zones = [
    { key: 'available' as const, label: 'Disponíveis' },
    { key: 'rows' as const, label: 'Linhas' },
    { key: 'columns' as const, label: 'Colunas' },
    { key: 'values' as const, label: 'Valores' },
  ];

  move(field: string, from: keyof VxPivotFieldState): void {
    const state = { ...this.fieldState() };
    const nextZone: keyof VxPivotFieldState =
      from === 'available' ? 'rows' : from === 'rows' ? 'columns' : from === 'columns' ? 'values' : 'available';
    state[from] = state[from].filter((f) => f !== field);
    if (!state[nextZone].includes(field)) state[nextZone] = [...state[nextZone], field];
    this.fieldChange.emit(state);
  }
}
