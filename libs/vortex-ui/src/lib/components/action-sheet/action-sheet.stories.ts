import type { Meta, StoryObj } from '@storybook/angular';
import { VxActionSheetComponent } from './action-sheet.component';

const meta: Meta<VxActionSheetComponent> = {
  title: 'Components/ActionSheet',
  component: VxActionSheetComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      open: true,
      title: 'Ações',
      items: [
        { id: '1', label: 'Compartilhar' },
        { id: '2', label: 'Duplicar' },
        { id: '3', label: 'Excluir', danger: true },
      ],
    },
    template: `<vx-action-sheet [(open)]="open" [title]="title" [items]="items" />`,
  }),
};

export default meta;
type Story = StoryObj<VxActionSheetComponent>;

export const Default: Story = {};
