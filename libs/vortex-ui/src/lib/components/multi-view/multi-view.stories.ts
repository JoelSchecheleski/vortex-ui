import type { Meta, StoryObj } from '@storybook/angular';
import { VxMultiViewComponent, VxMultiViewItemComponent } from './multi-view.component';

const meta: Meta<VxMultiViewComponent> = {
  title: 'Components/MultiView',
  component: VxMultiViewComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { selectedIndex: 0 },
    template: `
      <vx-multi-view [(selectedIndex)]="selectedIndex" style="max-width:360px">
        <vx-multi-view-item itemId="1"><p>Página 1</p></vx-multi-view-item>
        <vx-multi-view-item itemId="2"><p>Página 2</p></vx-multi-view-item>
      </vx-multi-view>
    `,
    moduleMetadata: { imports: [VxMultiViewComponent, VxMultiViewItemComponent] },
  }),
};

export default meta;
type Story = StoryObj<VxMultiViewComponent>;

export const Default: Story = {};
