import type { Meta, StoryObj } from '@storybook/angular';
import { VxLookupComponent } from './lookup.component';

const meta: Meta<VxLookupComponent> = {
  title: 'Forms/Lookup',
  component: VxLookupComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      items: [
        { id: '1', label: 'Item A' },
        { id: '2', label: 'Item B' },
      ],
      value: '1',
    },
    template: `
      <vx-lookup style="display:block;max-width:280px" label="Referência" [items]="items" [(value)]="value" />
    `,
  }),
};

export default meta;
type Story = StoryObj<VxLookupComponent>;

export const Default: Story = {};
