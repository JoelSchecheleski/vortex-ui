import type { Meta, StoryObj } from '@storybook/angular';
import { VxFabComponent } from './fab.component';

const meta: Meta<VxFabComponent> = {
  title: 'Components/FAB',
  component: VxFabComponent,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => ({
    template: `<vx-fab ariaLabel="Criar">+</vx-fab>`,
  }),
};

export default meta;
type Story = StoryObj<VxFabComponent>;

export const Default: Story = {};
