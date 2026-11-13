import type { Meta, StoryObj } from '@storybook/angular';
import { VxSankeyComponent } from './sankey.component';

const meta: Meta<VxSankeyComponent> = {
  title: 'Visualization/Sankey',
  component: VxSankeyComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      nodes: [
        { id: 'a', label: 'Origem' },
        { id: 'b', label: 'Etapa' },
        { id: 'c', label: 'Destino' },
      ],
      links: [
        { source: 'a', target: 'b', value: 40 },
        { source: 'b', target: 'c', value: 32 },
      ],
    },
    template: `<vx-sankey [nodes]="nodes" [links]="links" />`,
  }),
};

export default meta;
type Story = StoryObj<VxSankeyComponent>;

export const Default: Story = {};
