import type { Meta, StoryObj } from '@storybook/angular';
import { VxPivotFieldChooserComponent } from './pivot-field-chooser.component';

const meta: Meta<VxPivotFieldChooserComponent> = {
  title: 'Data/PivotFieldChooser',
  component: VxPivotFieldChooserComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      fieldState: {
        available: ['region', 'amount'],
        rows: ['product'],
        columns: [],
        values: ['amount'],
      },
    },
    template: `<vx-pivot-field-chooser [fieldState]="fieldState" />`,
  }),
};

export default meta;
type Story = StoryObj<VxPivotFieldChooserComponent>;

export const Default: Story = {};
