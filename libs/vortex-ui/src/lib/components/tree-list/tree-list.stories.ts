import type { Meta, StoryObj } from '@storybook/angular';
import { VxTreeListComponent } from './tree-list.component';

const meta: Meta<VxTreeListComponent> = {
  title: 'Data/TreeList',
  component: VxTreeListComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      expandedIds: ['root'],
      items: [
        {
          id: 'root',
          data: { name: 'Root', role: 'Org' },
          children: [
            { id: 'a', data: { name: 'Alpha', role: 'Team' } },
            { id: 'b', data: { name: 'Beta', role: 'Team' } },
          ],
        },
      ],
      columns: [{ field: 'role', header: 'Papel', width: '120px' }],
    },
    template: `
      <div style="height:280px">
        <vx-tree-list [items]="items" [columns]="columns" [(expandedIds)]="expandedIds" />
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<VxTreeListComponent>;

export const Default: Story = {};
