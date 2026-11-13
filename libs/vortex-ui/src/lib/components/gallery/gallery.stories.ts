import type { Meta, StoryObj } from '@storybook/angular';
import { VxGalleryComponent } from './gallery.component';

const meta: Meta<VxGalleryComponent> = {
  title: 'Components/Gallery',
  component: VxGalleryComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      items: [
        { id: '1', src: 'https://picsum.photos/seed/a/480/280', alt: 'Painel A' },
        { id: '2', src: 'https://picsum.photos/seed/b/480/280', alt: 'Painel B' },
      ],
      selectedId: '1',
    },
    template: `<vx-gallery [items]="items" [(selectedId)]="selectedId" />`,
  }),
};

export default meta;
type Story = StoryObj<VxGalleryComponent>;

export const Default: Story = {};
