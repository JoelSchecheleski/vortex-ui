import type { Meta, StoryObj } from '@storybook/angular';
import { VxChartComponent } from './chart.component';

const data = [
  { argument: 'África', value: 42 },
  { argument: 'Europa', value: 68 },
  { argument: 'Américas', value: 55 },
  { argument: 'Ásia', value: 81 },
];

const meta: Meta<VxChartComponent> = {
  title: 'Visualization/Chart',
  component: VxChartComponent,
  tags: ['autodocs'],
  args: {
    type: 'bar',
    title: 'Vendas',
    data,
    width: 480,
    height: 240,
  },
};

export default meta;
type Story = StoryObj<VxChartComponent>;

export const Bar: Story = {};
export const Line: Story = { args: { type: 'line' } };
export const Area: Story = { args: { type: 'area' } };
export const Pie: Story = { args: { type: 'pie' } };
export const Funnel: Story = { args: { type: 'funnel', title: 'Funil de vendas' } };
export const Polar: Story = { args: { type: 'polar', title: 'Radar regional' } };
