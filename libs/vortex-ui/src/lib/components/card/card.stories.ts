import type { Meta, StoryObj } from '@storybook/angular';
import { VxCardComponent } from './card.component';

const meta: Meta<VxCardComponent> = {
  title: 'Components/Card',
  component: VxCardComponent,
  tags: ['autodocs'],
  render: () => ({
    template: `
      <vx-card>
        <h3 style="margin:0 0 0.5rem">Card</h3>
        <p style="margin:0;opacity:0.8">Container básico com tokens do tema ativo.</p>
      </vx-card>
    `,
  }),
};

export default meta;
type Story = StoryObj<VxCardComponent>;

export const Default: Story = {};
