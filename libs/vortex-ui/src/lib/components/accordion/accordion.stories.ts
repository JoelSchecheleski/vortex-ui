import type { Meta, StoryObj } from '@storybook/angular';
import { VxAccordionComponent } from './accordion.component';

const meta: Meta<VxAccordionComponent> = {
  title: 'Navigation/Accordion',
  component: VxAccordionComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      items: [
        { id: 'a', title: 'Geral', content: 'Configurações gerais do workspace.' },
        { id: 'b', title: 'Segurança', content: 'Políticas e permissões.' },
      ],
      openIds: ['a'],
    },
    template: `<vx-accordion [items]="items" [(openIds)]="openIds" />`,
  }),
};

export default meta;
type Story = StoryObj<VxAccordionComponent>;

export const Default: Story = {};
