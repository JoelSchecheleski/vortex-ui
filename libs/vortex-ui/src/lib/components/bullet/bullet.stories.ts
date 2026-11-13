import type { Meta, StoryObj } from '@storybook/angular';
import { VxBulletComponent } from './bullet.component';

const meta: Meta<VxBulletComponent> = {
  title: 'Visualization/Bullet',
  component: VxBulletComponent,
  tags: ['autodocs'],
  args: { value: 65, target: 80, good: 75, max: 100 },
};

export default meta;
type Story = StoryObj<VxBulletComponent>;

export const Default: Story = {};
