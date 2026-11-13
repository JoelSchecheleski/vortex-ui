import type { Meta, StoryObj } from '@storybook/angular';
import { VxFunnelComponent } from './funnel.component';

const data = [
  { argument: 'Visitas', value: 1000 },
  { argument: 'Leads', value: 420 },
  { argument: 'Vendas', value: 96 },
];

const meta: Meta<VxFunnelComponent> = {
  title: 'Visualization/Funnel',
  component: VxFunnelComponent,
  tags: ['autodocs'],
  args: { data },
};

export default meta;
type Story = StoryObj<VxFunnelComponent>;

export const Default: Story = {};
