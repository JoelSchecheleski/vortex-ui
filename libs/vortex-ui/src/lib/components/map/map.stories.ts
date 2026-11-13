import type { Meta, StoryObj } from '@storybook/angular';
import { VxMapComponent } from './map.component';

const meta: Meta<VxMapComponent> = {
  title: 'Maps/Map',
  component: VxMapComponent,
  tags: ['autodocs'],
  args: {
    markers: [
      { lat: -23.55, lng: -46.63, label: 'São Paulo' },
      { lat: 38.72, lng: -9.14, label: 'Lisboa' },
    ],
  },
};

export default meta;
type Story = StoryObj<VxMapComponent>;

export const Default: Story = {};
