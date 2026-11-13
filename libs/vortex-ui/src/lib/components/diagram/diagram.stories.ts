import type { Meta, StoryObj } from '@storybook/angular';
import { VxDiagramComponent } from './diagram.component';

const meta: Meta<VxDiagramComponent> = {
  title: 'Visualization/Diagram',
  component: VxDiagramComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      nodes: [
        { id: '1', label: 'Início', x: 40, y: 80 },
        { id: '2', label: 'Processo', x: 200, y: 80 },
        { id: '3', label: 'Fim', x: 360, y: 80 },
      ],
      edges: [
        { from: '1', to: '2' },
        { from: '2', to: '3' },
      ],
    },
    template: `<vx-diagram [nodes]="nodes" [edges]="edges" />`,
  }),
};

export default meta;
type Story = StoryObj<VxDiagramComponent>;

export const Default: Story = {};
