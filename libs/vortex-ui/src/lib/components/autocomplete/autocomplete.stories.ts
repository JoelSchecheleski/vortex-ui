import type { Meta, StoryObj } from '@storybook/angular';
import { VxAutocompleteComponent } from './autocomplete.component';

const meta: Meta<VxAutocompleteComponent> = {
  title: 'Forms/Autocomplete',
  component: VxAutocompleteComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { items: ['Lisboa', 'São Paulo', 'Luanda', 'Maputo'], value: '' },
    template: `
      <vx-autocomplete style="display:block;max-width:280px" label="Cidade" [items]="items" [(value)]="value" />
    `,
  }),
};

export default meta;
type Story = StoryObj<VxAutocompleteComponent>;

export const Default: Story = {};
