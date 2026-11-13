import type { Meta, StoryObj } from '@storybook/angular';
import { VxTabsComponent, VxTabPanelComponent } from './tabs.component';

const meta: Meta<VxTabsComponent> = {
  title: 'Navigation/Tabs',
  component: VxTabsComponent,
  tags: ['autodocs'],
  render: () => ({
    moduleMetadata: { imports: [VxTabPanelComponent] },
    props: { selected: 'a' },
    template: `
      <vx-tabs [(selected)]="selected">
        <vx-tab-panel tabId="a" label="Geral">Conteúdo da aba Geral.</vx-tab-panel>
        <vx-tab-panel tabId="b" label="Layout">Conteúdo da aba Layout.</vx-tab-panel>
        <vx-tab-panel tabId="c" label="Avançado" [disabled]="true">Off</vx-tab-panel>
      </vx-tabs>
    `,
  }),
};

export default meta;
type Story = StoryObj<VxTabsComponent>;

export const Default: Story = {};
