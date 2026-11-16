import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular';
import { VxIconComponent } from '../../../src/lib/components/icon/icon.component';
import { VxButtonComponent } from '../../../src/lib/components/button/button.component';
import { provideFluentFullIcons } from './provide';
import { FLUENT_FULL_ICON_NAMES } from './generated';

const SAMPLE_ONLY_IN_FULL = [
  'home',
  'person',
  'settings',
  'mail',
  'calendar',
  'dismiss',
  'arrow-download',
  'checkmark',
  'more-horizontal',
  'folder',
  'document',
  'camera',
  'globe',
  'lock-closed',
  'star',
] as const;

const MAX_VISIBLE = 120;

const meta: Meta = {
  title: 'Icons/Fluent Full',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Catálogo Fluent **completo** (opt-in) — ~${FLUENT_FULL_ICON_NAMES.length} nomes.

\`\`\`ts
import { provideFluentFullIcons, FLUENT_FULL_ICON_NAMES } from 'vortex-ui/icons/fluent-full';

providers: [provideFluentFullIcons()]
\`\`\`

Lista runtime: \`FLUENT_FULL_ICON_NAMES\`.  
Upstream: [icons_regular.md](https://github.com/microsoft/fluentui-system-icons/blob/main/icons_regular.md).  
Docs do pacote: \`libs/vortex-ui/icons/fluent-full/README.md\`.
        `.trim(),
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [provideFluentFullIcons()],
    }),
  ],
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  name: 'Overview & setup',
  render: () => ({
    moduleMetadata: {
      imports: [VxIconComponent, VxButtonComponent],
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:1.25rem;max-width:40rem;color:var(--vx-color-text,#201f1e);font:14px/1.45 system-ui">
        <div>
          <strong style="font-size:1.1rem">Fluent Full está ativo neste story</strong>
          <p style="margin:.4rem 0 0;opacity:.85">
            Total registrado: <strong>{{ total }}</strong> nomes
            (sizes 16 / 20 / 24 · regular + filled).
            O core sozinho só traz o pack curado — este entry é separado de propósito.
          </p>
        </div>
        <pre style="margin:0;padding:.75rem 1rem;background:var(--vx-color-bg-elevated,#f3f2f1);border-radius:8px;overflow:auto;font-size:12px">import { provideFluentFullIcons } from 'vortex-ui/icons/fluent-full';

providers: [provideFluentFullIcons()]</pre>
        <div>
          <p style="margin:0 0 .65rem;opacity:.85">Exemplos que <em>não</em> estão no pack curado do core:</p>
          <div style="display:flex;flex-wrap:wrap;gap:.85rem">
            @for (n of samples; track n) {
              <div style="display:flex;flex-direction:column;align-items:center;gap:.3rem;min-width:4.75rem">
                <vx-icon [name]="n" [size]="24"></vx-icon>
                <span style="font-size:11px;text-align:center">{{ n }}</span>
              </div>
            }
          </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:.5rem;align-items:center">
          <vx-button icon="home" variant="primary">Home</vx-button>
          <vx-button icon="mail" variant="outline">Mail</vx-button>
          <vx-button icon="settings" [iconOnly]="true" variant="ghost" aria-label="Settings" />
          <vx-button icon="dismiss" [iconOnly]="true" variant="outline" aria-label="Close" />
        </div>
      </div>
    `,
    props: {
      total: FLUENT_FULL_ICON_NAMES.length,
      samples: SAMPLE_ONLY_IN_FULL,
    },
  }),
};

export const Browse: Story = {
  name: 'Browse / search',
  argTypes: {
    query: {
      control: 'text',
      description: 'Filtro sobre FLUENT_FULL_ICON_NAMES',
    },
  },
  args: {
    query: 'calendar',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Filtre o catálogo completo (mostra até 120 resultados para não travar o Storybook). Use o control **query**.',
      },
    },
  },
  render: (args) => {
    const q = String((args as { query?: string }).query ?? '')
      .trim()
      .toLowerCase();
    const matched = q
      ? FLUENT_FULL_ICON_NAMES.filter((n) => n.includes(q))
      : [...FLUENT_FULL_ICON_NAMES];
    const names = matched.slice(0, MAX_VISIBLE);
    const truncated = matched.length > MAX_VISIBLE;

    return {
      moduleMetadata: {
        imports: [VxIconComponent],
      },
      props: {
        query: (args as { query?: string }).query ?? '',
        names,
        matchCount: matched.length,
        truncated,
        catalogSize: FLUENT_FULL_ICON_NAMES.length,
      },
      template: `
        <div style="display:flex;flex-direction:column;gap:1rem;color:var(--vx-color-text,#201f1e);font:14px/1.4 system-ui">
          <p style="margin:0;opacity:.85">
            Catálogo: <strong>{{ catalogSize }}</strong> · filtro
            <code>{{ query || '(todos)' }}</code> →
            <strong>{{ matchCount }}</strong> match(es)
            @if (truncated) {
              <span>(exibindo {{ names.length }})</span>
            }
          </p>
          <p style="margin:0;font-size:12px;opacity:.7">
            Altere o control <strong>query</strong> no painel Controls do Storybook.
          </p>
          <div style="display:flex;flex-wrap:wrap;gap:.85rem">
            @for (n of names; track n) {
              <div style="display:flex;flex-direction:column;align-items:center;gap:.3rem;min-width:5rem" [title]="n">
                <vx-icon [name]="n" [size]="20"></vx-icon>
                <span style="font-size:10px;text-align:center;max-width:5.5rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ n }}</span>
              </div>
            }
          </div>
        </div>
      `,
    };
  },
};
