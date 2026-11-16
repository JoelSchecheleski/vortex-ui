import type { Meta, StoryObj } from '@storybook/angular';
import { VxIconComponent } from './icon.component';
import { FLUENT_ICON_NAMES } from '../../icons/fluent/pack';

const meta: Meta<VxIconComponent> = {
  title: 'Components/Icon',
  component: VxIconComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Ícones Fluent (MIT) via \`<vx-icon>\`.

**Core (este story):** pack curado embutido no \`vortex-ui\` (${FLUENT_ICON_NAMES.length} nomes).

**Catálogo completo (~2.9k):** entry opt-in \`vortex-ui/icons/fluent-full\` — veja a story **Icons / Fluent Full**.
Não entre no bundle principal até \`provideFluentFullIcons()\`.
        `.trim(),
      },
    },
  },
  argTypes: {
    name: { control: 'select', options: [...FLUENT_ICON_NAMES] },
    set: { control: 'select', options: ['fluent', 'material'] },
    size: { control: 'select', options: [16, 20, 24] },
    variant: { control: 'select', options: ['regular', 'filled'] },
  },
  args: {
    name: 'code',
    set: 'fluent',
    size: 20,
    variant: 'regular',
  },
  render: (args) => ({
    props: args,
    template: `<vx-icon [name]="name" [set]="set" [size]="size" [variant]="variant"></vx-icon>`,
  }),
};

export default meta;
type Story = StoryObj<VxIconComponent>;

export const Default: Story = {};

export const Filled: Story = {
  args: { variant: 'filled', name: 'add' },
};

/** Grade do pack curado (sempre disponível sem providers extras). */
export const CorePack: Story = {
  name: 'Core pack (curated)',
  parameters: {
    docs: {
      description: {
        story:
          'Ícones embutidos no core. Para o catálogo Fluent completo, use **Icons / Fluent Full** + `provideFluentFullIcons()`.',
      },
    },
  },
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:1rem;color:var(--vx-color-text,#201f1e)">
        <p style="margin:0;font:14px/1.4 system-ui;opacity:.85">
          Pack curado do core ({{ names.length }} ícones).
          Precisa de mais? Ative <code>vortex-ui/icons/fluent-full</code>
          — story <strong>Icons / Fluent Full</strong>.
        </p>
        <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center">
          @for (n of names; track n) {
            <div style="display:flex;flex-direction:column;align-items:center;gap:0.35rem;min-width:4.5rem">
              <vx-icon [name]="n" [size]="20"></vx-icon>
              <span style="font:12px/1.2 system-ui">{{ n }}</span>
            </div>
          }
        </div>
      </div>
    `,
    props: { names: FLUENT_ICON_NAMES },
  }),
};
