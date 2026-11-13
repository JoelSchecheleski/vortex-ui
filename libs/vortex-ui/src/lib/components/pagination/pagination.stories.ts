import type { Meta, StoryObj } from '@storybook/angular';
import { VxPaginationComponent } from './pagination.component';

const meta: Meta<VxPaginationComponent> = {
  title: 'Components/Pagination',
  component: VxPaginationComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { totalItems: 120, pageSize: 10, page: 2 },
    template: `<vx-pagination [totalItems]="totalItems" [pageSize]="pageSize" [(page)]="page" />`,
  }),
};

export default meta;
type Story = StoryObj<VxPaginationComponent>;

export const Default: Story = {};
