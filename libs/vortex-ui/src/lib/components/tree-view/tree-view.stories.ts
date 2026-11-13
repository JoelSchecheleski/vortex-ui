import type { Meta, StoryObj } from '@storybook/angular';
import { VxTreeViewComponent } from './tree-view.component';

const meta: Meta<VxTreeViewComponent> = {
  title: 'Navigation/TreeView',
  component: VxTreeViewComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      expandedIds: ['root'],
      selectedIds: [] as string[],
      items: [
        {
          id: 'root',
          text: 'VortexUI',
          children: [
            { id: 'grid', text: 'Data Grid' },
            { id: 'fm', text: 'File Manager' },
            {
              id: 'nav',
              text: 'Navigation',
              children: [
                { id: 'tabs', text: 'Tabs' },
                { id: 'drawer', text: 'Drawer' },
              ],
            },
          ],
        },
      ],
    },
    template: `
      <div style="height:280px">
        <vx-tree-view
          [items]="items"
          [(expandedIds)]="expandedIds"
          [(selectedIds)]="selectedIds"
        />
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<VxTreeViewComponent>;

export const Default: Story = {};
