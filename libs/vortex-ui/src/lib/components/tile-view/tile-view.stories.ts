import type { Meta, StoryObj } from '@storybook/angular';
import { VxTileViewComponent } from './tile-view.component';

const meta: Meta<VxTileViewComponent> = {
  title: 'Data/TileView',
  component: VxTileViewComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      items: [
        { id: '1', title: 'SolarMax', subtitle: 'África' },
        { id: '2', title: 'EcoCharge', subtitle: 'Europa' },
      ],
    },
    template: `<vx-tile-view [items]="items" />`,
  }),
};

export default meta;
type Story = StoryObj<VxTileViewComponent>;

export const Default: Story = {};
