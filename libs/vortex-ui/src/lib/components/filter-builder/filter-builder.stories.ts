import type { Meta, StoryObj } from '@storybook/angular';
import { VxFilterBuilderComponent } from './filter-builder.component';

const meta: Meta<VxFilterBuilderComponent> = {
  title: 'Data/FilterBuilder',
  component: VxFilterBuilderComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      fields: [
        { field: 'product', label: 'Produto' },
        { field: 'region', label: 'Região' },
        { field: 'sector', label: 'Setor' },
      ],
    },
    template: `<vx-filter-builder [fields]="fields" />`,
  }),
};

export default meta;
type Story = StoryObj<VxFilterBuilderComponent>;

export const Empty: Story = {};
