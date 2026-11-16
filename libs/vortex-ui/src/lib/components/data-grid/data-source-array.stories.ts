import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import {
  runDataSourceArrayDemo,
  type DataSourceArrayDemoMode,
} from './data-source-array-demo';

@Component({
  selector: 'vx-datasource-array-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-ds-demo" style="padding:1.25rem;font-family:var(--vx-font-family, system-ui);color:var(--vx-color-foreground, #242424)">
      <h3 style="margin:0 0 0.5rem;font-size:1.125rem">VxArrayDataSource</h3>
      <p style="margin:0 0 1rem;opacity:0.8;font-size:0.875rem">
        Local in-memory load with keyExpr, filter/sort/group, and skip/take.
      </p>

      @if (status() === 'loading') {
        <div role="status" aria-live="polite" style="padding:1rem;border:1px dashed var(--vx-color-border, #cfcfcf)">
          Loading…
        </div>
      } @else if (status() === 'error') {
        <div role="alert" style="padding:1rem;border:1px solid var(--vx-color-danger, #c50f1f);color:var(--vx-color-danger, #c50f1f)">
          {{ errorMessage() }}
        </div>
      } @else if (status() === 'empty') {
        <div role="status" style="padding:1rem;border:1px dashed var(--vx-color-border, #cfcfcf)">
          No rows — empty data source.
        </div>
      } @else {
        <p style="margin:0 0 0.75rem;font-size:0.875rem">
          totalCount (leaves): <strong>{{ totalCount() }}</strong>
          · keys: {{ keysPreview() }}
        </p>
        <ul style="margin:0;padding-left:1.25rem;font-size:0.875rem">
          @for (line of lines(); track line) {
            <li>{{ line }}</li>
          }
        </ul>
      }
    </div>
  `,
})
class DataSourceArrayDemoComponent {
  readonly mode = input<DataSourceArrayDemoMode>('ready');
  readonly delayMs = input(600);

  readonly status = signal<'loading' | 'ready' | 'empty' | 'error'>('loading');
  readonly errorMessage = signal('');
  readonly totalCount = signal(0);
  readonly lines = signal<string[]>([]);
  readonly keysPreview = signal('');

  private runSeq = 0;

  constructor() {
    effect(() => {
      const mode = this.mode();
      const delayMs = this.delayMs();
      const seq = ++this.runSeq;
      void this.run(mode, delayMs, seq);
    });
  }

  private async run(
    mode: DataSourceArrayDemoMode,
    delayMs: number,
    seq: number
  ): Promise<void> {
    this.status.set('loading');
    this.errorMessage.set('');
    this.lines.set([]);
    this.keysPreview.set('');
    this.totalCount.set(0);

    try {
      const result = await runDataSourceArrayDemo(mode, { delayMs });
      if (seq !== this.runSeq) return;
      if (result.status === 'loading') {
        this.status.set('loading');
        return;
      }
      if (result.status === 'empty') {
        this.totalCount.set(0);
        this.status.set('empty');
        return;
      }
      this.totalCount.set(result.totalCount);
      this.keysPreview.set(result.keys.map(String).join(', '));
      this.lines.set(result.lines);
      this.status.set('ready');
    } catch (err) {
      if (seq !== this.runSeq) return;
      this.errorMessage.set(
        err instanceof Error ? err.message : 'Unknown load error'
      );
      this.status.set('error');
    }
  }
}

const meta: Meta<DataSourceArrayDemoComponent> = {
  title: 'Data Management/_Foundation/DataSource-Array',
  component: DataSourceArrayDemoComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Foundation demo for `VxArrayDataSource` (local array kernel): keyExpr, client load with sort/filter/group/skip/take, plus empty / loading / error binding states.',
      },
    },
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['ready', 'empty', 'loading', 'error'],
    },
    delayMs: { control: { type: 'number', min: 0, step: 100 } },
  },
};

export default meta;
type Story = StoryObj<DataSourceArrayDemoComponent>;

export const Ready: Story = {
  args: { mode: 'ready', delayMs: 0 },
};

export const Empty: Story = {
  args: { mode: 'empty', delayMs: 0 },
};

export const Loading: Story = {
  args: { mode: 'loading', delayMs: 2500 },
};

export const Error: Story = {
  args: { mode: 'error', delayMs: 400 },
};
