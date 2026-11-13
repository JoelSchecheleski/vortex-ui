import type { Meta, StoryObj } from '@storybook/angular';
import { VxLoadPanelComponent } from './load-panel.component';

const meta: Meta<VxLoadPanelComponent> = {
  title: 'Feedback/LoadPanel',
  component: VxLoadPanelComponent,
  tags: ['autodocs'],
  render: () => ({
    template: `
      <div style="position:relative;height:200px;border:1px solid var(--vx-color-border)">
        <vx-load-panel [visible]="true" message="Processando dados…" />
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<VxLoadPanelComponent>;

export const Default: Story = {};
