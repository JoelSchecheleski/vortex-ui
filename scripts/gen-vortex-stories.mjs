import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('libs/vortex-ui/src/lib/components');

/** @type {Record<string, string>} */
const files = {
  'checkbox/checkbox.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxCheckboxComponent } from './checkbox.component';

const meta: Meta<VxCheckboxComponent> = {
  title: 'Components/Checkbox',
  component: VxCheckboxComponent,
  tags: ['autodocs'],
  args: { label: 'Aceito os termos', disabled: false, checked: false },
  render: (args) => ({
    props: args,
    template: \`<vx-checkbox [(checked)]="checked" [label]="label" [disabled]="disabled" />\`,
  }),
};

export default meta;
type Story = StoryObj<VxCheckboxComponent>;

export const Default: Story = {};
export const Checked: Story = { args: { checked: true } };
`,

  'switch/switch.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxSwitchComponent } from './switch.component';

const meta: Meta<VxSwitchComponent> = {
  title: 'Components/Switch',
  component: VxSwitchComponent,
  tags: ['autodocs'],
  args: { label: 'Notificações', disabled: false, checked: true },
  render: (args) => ({
    props: args,
    template: \`<vx-switch [(checked)]="checked" [label]="label" [disabled]="disabled" />\`,
  }),
};

export default meta;
type Story = StoryObj<VxSwitchComponent>;

export const Default: Story = {};
export const Off: Story = { args: { checked: false } };
`,

  'select-box/select-box.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxSelectBoxComponent } from './select-box.component';

const meta: Meta<VxSelectBoxComponent> = {
  title: 'Forms/SelectBox',
  component: VxSelectBoxComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      items: ['Opção A', 'Opção B', 'Opção C'],
      value: 'Opção A',
    },
    template: \`
      <vx-select-box style="display:block;max-width:280px" [items]="items" [(value)]="value" label="Região" />
    \`,
  }),
};

export default meta;
type Story = StoryObj<VxSelectBoxComponent>;

export const Default: Story = {};
`,

  'date-box/date-box.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxDateBoxComponent } from './date-box.component';

const meta: Meta<VxDateBoxComponent> = {
  title: 'Forms/DateBox',
  component: VxDateBoxComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { value: '2026-11-13' },
    template: \`
      <vx-date-box style="display:block;max-width:280px" label="Data" [(value)]="value" />
    \`,
  }),
};

export default meta;
type Story = StoryObj<VxDateBoxComponent>;

export const Default: Story = {};
`,

  'dialog/dialog.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxDialogComponent } from './dialog.component';

const meta: Meta<VxDialogComponent> = {
  title: 'Feedback/Dialog',
  component: VxDialogComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { open: true, title: 'Confirmar ação' },
    template: \`
      <vx-dialog [(open)]="open" [title]="title">
        <p>Deseja continuar com esta operação?</p>
      </vx-dialog>
    \`,
  }),
};

export default meta;
type Story = StoryObj<VxDialogComponent>;

export const Default: Story = {};
export const Large: Story = {
  render: () => ({
    props: { open: true, title: 'Detalhes', size: 'lg' as const },
    template: \`<vx-dialog [(open)]="open" [title]="title" [size]="size"><p>Conteúdo amplo do diálogo.</p></vx-dialog>\`,
  }),
};
`,

  'toast/toast.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { Component, inject } from '@angular/core';
import { VxToastOutletComponent } from './toast-outlet.component';
import { VxToastService } from './toast.service';
import { VxButtonComponent } from '../button/button.component';

@Component({
  selector: 'vx-story-toast',
  standalone: true,
  imports: [VxToastOutletComponent, VxButtonComponent],
  template: \`
    <vx-toast-outlet />
    <vx-button (click)="show()">Mostrar toast</vx-button>
  \`,
})
class StoryToastDemo {
  readonly toast = inject(VxToastService);
  show(): void {
    this.toast.success('Salvo com sucesso!');
  }
}

const meta: Meta<StoryToastDemo> = {
  title: 'Feedback/Toast',
  component: StoryToastDemo,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<StoryToastDemo>;

export const Default: Story = {};
`,

  'form/form.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxFormComponent } from './form.component';

const meta: Meta<VxFormComponent> = {
  title: 'Forms/Form',
  component: VxFormComponent,
  tags: ['autodocs'],
  render: () => ({
    template: \`
      <vx-form title="Perfil" subtitle="Dados básicos">
        <p style="margin:0">Conteúdo do formulário aqui.</p>
      </vx-form>
    \`,
  }),
};

export default meta;
type Story = StoryObj<VxFormComponent>;

export const Default: Story = {};
`,

  'toolbar/toolbar.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxToolbarComponent } from './toolbar.component';
import { VxButtonComponent } from '../button/button.component';

const meta: Meta<VxToolbarComponent> = {
  title: 'Components/Toolbar',
  component: VxToolbarComponent,
  tags: ['autodocs'],
  render: () => ({
    template: \`
      <vx-toolbar>
        <vx-button size="sm">Novo</vx-button>
        <vx-button size="sm" variant="outline">Exportar</vx-button>
      </vx-toolbar>
    \`,
    moduleMetadata: { imports: [VxToolbarComponent, VxButtonComponent] },
  }),
};

export default meta;
type Story = StoryObj<VxToolbarComponent>;

export const Default: Story = {};
`,

  'list/list.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxListComponent } from './list.component';

const meta: Meta<VxListComponent> = {
  title: 'Data/List',
  component: VxListComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      items: [
        { id: '1', text: 'SolarMax', secondaryText: 'África' },
        { id: '2', text: 'EcoCharge', secondaryText: 'Europa' },
        { id: '3', text: 'VoltEdge', secondaryText: 'Américas' },
      ],
      selectedIds: ['1'],
    },
    template: \`<vx-list [items]="items" [(selectedIds)]="selectedIds" searchable />\`,
  }),
};

export default meta;
type Story = StoryObj<VxListComponent>;

export const Default: Story = {};
`,

  'validation/validation-summary.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxValidationSummaryComponent } from './validation-summary.component';

const meta: Meta<VxValidationSummaryComponent> = {
  title: 'Forms/ValidationSummary',
  component: VxValidationSummaryComponent,
  tags: ['autodocs'],
  args: {
    errors: ['E-mail inválido', 'Senha muito curta'],
  },
};

export default meta;
type Story = StoryObj<VxValidationSummaryComponent>;

export const Default: Story = {};
`,

  'file-manager/file-manager.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxFileManagerComponent } from './file-manager.component';

const meta: Meta<VxFileManagerComponent> = {
  title: 'File/FileManager',
  component: VxFileManagerComponent,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => ({
    props: {
      items: [
        { id: 'd1', name: 'Documentos', isDirectory: true, parentId: null },
        { id: 'f1', name: 'relatorio.pdf', isDirectory: false, parentId: 'd1', size: 2048 },
        { id: 'f2', name: 'planilha.xlsx', isDirectory: false, parentId: 'd1', size: 4096 },
      ],
    },
    template: \`
      <div style="height:420px;padding:1rem;box-sizing:border-box">
        <vx-file-manager [items]="items" />
      </div>
    \`,
  }),
};

export default meta;
type Story = StoryObj<VxFileManagerComponent>;

export const Default: Story = {};
`,

  'accordion/accordion.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
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
    template: \`<vx-accordion [items]="items" [(openIds)]="openIds" />\`,
  }),
};

export default meta;
type Story = StoryObj<VxAccordionComponent>;

export const Default: Story = {};
`,

  'drawer/drawer.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxDrawerComponent } from './drawer.component';

const meta: Meta<VxDrawerComponent> = {
  title: 'Navigation/Drawer',
  component: VxDrawerComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { open: true, title: 'Navegação' },
    template: \`
      <div style="height:320px;border:1px solid var(--vx-color-border)">
        <vx-drawer [(open)]="open" [title]="title">
          <p style="margin:0">Links e filtros laterais.</p>
          <div vx-drawer-content style="padding:1rem">Conteúdo principal</div>
        </vx-drawer>
      </div>
    \`,
  }),
};

export default meta;
type Story = StoryObj<VxDrawerComponent>;

export const Default: Story = {};
`,

  'menu/menu.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxMenuComponent } from './menu.component';

const meta: Meta<VxMenuComponent> = {
  title: 'Navigation/Menu',
  component: VxMenuComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      items: [
        { id: '1', label: 'Início' },
        { id: '2', label: 'Relatórios' },
        {
          id: '3',
          label: 'Mais',
          children: [{ id: '3a', label: 'Exportar' }],
        },
      ],
    },
    template: \`<vx-menu [items]="items" />\`,
  }),
};

export default meta;
type Story = StoryObj<VxMenuComponent>;

export const Default: Story = {};
`,

  'splitter/splitter.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxSplitterComponent } from './splitter.component';

const meta: Meta<VxSplitterComponent> = {
  title: 'Navigation/Splitter',
  component: VxSplitterComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { ratio: 35 },
    template: \`
      <div style="height:240px">
        <vx-splitter [(ratio)]="ratio">
          <div vx-splitter-pane-1 style="padding:0.75rem;background:var(--vx-color-bg-muted)">Painel A</div>
          <div vx-splitter-pane-2 style="padding:0.75rem">Painel B</div>
        </vx-splitter>
      </div>
    \`,
  }),
};

export default meta;
type Story = StoryObj<VxSplitterComponent>;

export const Default: Story = {};
`,

  'stepper/stepper.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxStepperComponent } from './stepper.component';

const meta: Meta<VxStepperComponent> = {
  title: 'Navigation/Stepper',
  component: VxStepperComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      steps: [
        { id: '1', label: 'Conta' },
        { id: '2', label: 'Plano' },
        { id: '3', label: 'Confirmação' },
      ],
      activeIndex: 1,
    },
    template: \`<vx-stepper [steps]="steps" [(activeIndex)]="activeIndex" />\`,
  }),
};

export default meta;
type Story = StoryObj<VxStepperComponent>;

export const Default: Story = {};
`,

  'box/box.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxBoxComponent } from './box.component';

const meta: Meta<VxBoxComponent> = {
  title: 'Components/Box',
  component: VxBoxComponent,
  tags: ['autodocs'],
  render: () => ({
    template: \`
      <vx-box gap="var(--vx-space-2)">
        <span style="padding:0.5rem;background:var(--vx-color-bg-muted)">A</span>
        <span style="padding:0.5rem;background:var(--vx-color-bg-muted)">B</span>
        <span style="padding:0.5rem;background:var(--vx-color-bg-muted)">C</span>
      </vx-box>
    \`,
  }),
};

export default meta;
type Story = StoryObj<VxBoxComponent>;

export const Default: Story = {};
`,

  'fab/fab.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxFabComponent } from './fab.component';

const meta: Meta<VxFabComponent> = {
  title: 'Components/FAB',
  component: VxFabComponent,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => ({
    template: \`<vx-fab ariaLabel="Criar">+</vx-fab>\`,
  }),
};

export default meta;
type Story = StoryObj<VxFabComponent>;

export const Default: Story = {};
`,

  'action-sheet/action-sheet.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxActionSheetComponent } from './action-sheet.component';

const meta: Meta<VxActionSheetComponent> = {
  title: 'Components/ActionSheet',
  component: VxActionSheetComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      open: true,
      title: 'Ações',
      items: [
        { id: '1', label: 'Compartilhar' },
        { id: '2', label: 'Duplicar' },
        { id: '3', label: 'Excluir', danger: true },
      ],
    },
    template: \`<vx-action-sheet [(open)]="open" [title]="title" [items]="items" />\`,
  }),
};

export default meta;
type Story = StoryObj<VxActionSheetComponent>;

export const Default: Story = {};
`,

  'multi-view/multi-view.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxMultiViewComponent, VxMultiViewItemComponent } from './multi-view.component';

const meta: Meta<VxMultiViewComponent> = {
  title: 'Components/MultiView',
  component: VxMultiViewComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { selectedIndex: 0 },
    template: \`
      <vx-multi-view [(selectedIndex)]="selectedIndex" style="max-width:360px">
        <vx-multi-view-item itemId="1"><p>Página 1</p></vx-multi-view-item>
        <vx-multi-view-item itemId="2"><p>Página 2</p></vx-multi-view-item>
      </vx-multi-view>
    \`,
    moduleMetadata: { imports: [VxMultiViewComponent, VxMultiViewItemComponent] },
  }),
};

export default meta;
type Story = StoryObj<VxMultiViewComponent>;

export const Default: Story = {};
`,

  'wrappers/draggable.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxDraggableComponent } from './draggable.component';

const meta: Meta<VxDraggableComponent> = {
  title: 'Components/Draggable',
  component: VxDraggableComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { x: 0, y: 0 },
    template: \`
      <span style="display:inline-block;padding:2rem;background:var(--vx-color-bg-muted)">
        <vx-draggable [(x)]="x" [(y)]="y">
          <span style="padding:0.5rem 1rem;background:var(--vx-color-primary);color:#fff;border-radius:6px">Arraste</span>
        </vx-draggable>
      </span>
    \`,
  }),
};

export default meta;
type Story = StoryObj<VxDraggableComponent>;

export const Default: Story = {};
`,

  'wrappers/sortable.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxSortableComponent } from './sortable.component';

const meta: Meta<VxSortableComponent> = {
  title: 'Components/Sortable',
  component: VxSortableComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      items: [
        { id: '1', text: 'Primeiro' },
        { id: '2', text: 'Segundo' },
        { id: '3', text: 'Terceiro' },
      ],
    },
    template: \`<vx-sortable [(items)]="items" />\`,
  }),
};

export default meta;
type Story = StoryObj<VxSortableComponent>;

export const Default: Story = {};
`,

  'wrappers/resizable.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxResizableComponent } from './resizable.component';

const meta: Meta<VxResizableComponent> = {
  title: 'Components/Resizable',
  component: VxResizableComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { width: 240, height: 140 },
    template: \`
      <vx-resizable [(width)]="width" [(height)]="height" style="display:block">
        <div style="height:100%;display:grid;place-items:center;background:var(--vx-color-bg-muted)">Redimensionável</div>
      </vx-resizable>
    \`,
  }),
};

export default meta;
type Story = StoryObj<VxResizableComponent>;

export const Default: Story = {};
`,

  'html-editor/html-editor.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxHtmlEditorComponent } from './html-editor.component';

const meta: Meta<VxHtmlEditorComponent> = {
  title: 'Messaging/HtmlEditor',
  component: VxHtmlEditorComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { value: '<p>Olá <strong>mundo</strong></p>' },
    template: \`
      <div style="max-width:640px;height:280px">
        <vx-html-editor [(value)]="value" />
      </div>
    \`,
  }),
};

export default meta;
type Story = StoryObj<VxHtmlEditorComponent>;

export const Default: Story = {};
`,

  'sparkline/sparkline.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxSparklineComponent } from './sparkline.component';

const meta: Meta<VxSparklineComponent> = {
  title: 'Visualization/Sparkline',
  component: VxSparklineComponent,
  tags: ['autodocs'],
  args: { data: [3, 7, 5, 9, 12, 8, 14] },
};

export default meta;
type Story = StoryObj<VxSparklineComponent>;

export const Default: Story = {};
export const LineOnly: Story = { args: { showArea: false } };
`,

  'gantt/gantt.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxGanttComponent } from './gantt.component';

const meta: Meta<VxGanttComponent> = {
  title: 'Scheduling/Gantt',
  component: VxGanttComponent,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => ({
    props: {
      tasks: [
        { id: '1', title: 'Design', start: '2026-11-01', end: '2026-11-08', progress: 80 },
        { id: '2', title: 'Build', start: '2026-11-06', end: '2026-11-20', progress: 35 },
      ],
    },
    template: \`
      <div style="height:280px;padding:1rem;box-sizing:border-box">
        <vx-gantt [tasks]="tasks" />
      </div>
    \`,
  }),
};

export default meta;
type Story = StoryObj<VxGanttComponent>;

export const Default: Story = {};
`,

  'progress/progress-bar.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxProgressBarComponent } from './progress-bar.component';

const meta: Meta<VxProgressBarComponent> = {
  title: 'Feedback/ProgressBar',
  component: VxProgressBarComponent,
  tags: ['autodocs'],
  args: { value: 62, label: 'Upload' },
};

export default meta;
type Story = StoryObj<VxProgressBarComponent>;

export const Default: Story = {};
export const Complete: Story = { args: { value: 100 } };
`,

  'progress/load-indicator.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxLoadIndicatorComponent } from './load-indicator.component';

const meta: Meta<VxLoadIndicatorComponent> = {
  title: 'Feedback/LoadIndicator',
  component: VxLoadIndicatorComponent,
  tags: ['autodocs'],
  args: { size: 'lg' as const },
};

export default meta;
type Story = StoryObj<VxLoadIndicatorComponent>;

export const Default: Story = {};
`,

  'chat/chat.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxChatComponent } from './chat.component';

const meta: Meta<VxChatComponent> = {
  title: 'Messaging/Chat',
  component: VxChatComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      messages: [
        { id: '1', author: 'Ana', text: 'Bom dia!' },
        { id: '2', author: 'Você', text: 'Tudo certo por aqui.', mine: true },
      ],
    },
    template: \`<div style="height:320px;max-width:420px"><vx-chat [messages]="messages" /></div>\`,
  }),
};

export default meta;
type Story = StoryObj<VxChatComponent>;

export const Default: Story = {};
`,

  'pivot-grid/pivot-grid.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxPivotGridComponent } from './pivot-grid.component';

const data = [
  { region: 'África', product: 'A', amount: 120 },
  { region: 'Europa', product: 'A', amount: 200 },
  { region: 'África', product: 'B', amount: 90 },
];

const meta: Meta<VxPivotGridComponent> = {
  title: 'Data/PivotGrid',
  component: VxPivotGridComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      data,
      fields: {
        available: ['region', 'product', 'amount'],
        rows: ['region'],
        columns: ['product'],
        values: ['amount'],
      },
    },
    template: \`<vx-pivot-grid [data]="data" [fields]="fields" />\`,
  }),
};

export default meta;
type Story = StoryObj<VxPivotGridComponent>;

export const Default: Story = {};
`,

  'pivot-grid/pivot-field-chooser.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
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
    template: \`<vx-pivot-field-chooser [fieldState]="fieldState" />\`,
  }),
};

export default meta;
type Story = StoryObj<VxPivotFieldChooserComponent>;

export const Default: Story = {};
`,

  'gauge/circular-gauge.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxCircularGaugeComponent } from './circular-gauge.component';

const meta: Meta<VxCircularGaugeComponent> = {
  title: 'Visualization/CircularGauge',
  component: VxCircularGaugeComponent,
  tags: ['autodocs'],
  args: { value: 72, min: 0, max: 100 },
};

export default meta;
type Story = StoryObj<VxCircularGaugeComponent>;

export const Default: Story = {};
`,

  'gauge/linear-gauge.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxLinearGaugeComponent } from './linear-gauge.component';

const meta: Meta<VxLinearGaugeComponent> = {
  title: 'Visualization/LinearGauge',
  component: VxLinearGaugeComponent,
  tags: ['autodocs'],
  args: { value: 58, min: 0, max: 100 },
};

export default meta;
type Story = StoryObj<VxLinearGaugeComponent>;

export const Default: Story = {};
`,

  'gauge/bar-gauge.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxBarGaugeComponent } from './bar-gauge.component';

const meta: Meta<VxBarGaugeComponent> = {
  title: 'Visualization/BarGauge',
  component: VxBarGaugeComponent,
  tags: ['autodocs'],
  args: {
    items: [
      { label: 'CPU', value: 45 },
      { label: 'RAM', value: 72 },
      { label: 'Disco', value: 33 },
    ],
  },
};

export default meta;
type Story = StoryObj<VxBarGaugeComponent>;

export const Default: Story = {};
`,

  'bullet/bullet.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
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
`,

  'funnel/funnel.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxFunnelComponent } from './funnel.component';

const data = [
  { argument: 'Visitas', value: 1000 },
  { argument: 'Leads', value: 420 },
  { argument: 'Vendas', value: 96 },
];

const meta: Meta<VxFunnelComponent> = {
  title: 'Visualization/Funnel',
  component: VxFunnelComponent,
  tags: ['autodocs'],
  args: { data },
};

export default meta;
type Story = StoryObj<VxFunnelComponent>;

export const Default: Story = {};
`,

  'tree-map/tree-map.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxTreeMapComponent } from './tree-map.component';

const meta: Meta<VxTreeMapComponent> = {
  title: 'Visualization/TreeMap',
  component: VxTreeMapComponent,
  tags: ['autodocs'],
  args: {
    data: [
      { name: 'África', value: 42 },
      { name: 'Europa', value: 68 },
      { name: 'Ásia', value: 81 },
    ],
  },
};

export default meta;
type Story = StoryObj<VxTreeMapComponent>;

export const Default: Story = {};
`,

  'sankey/sankey.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxSankeyComponent } from './sankey.component';

const meta: Meta<VxSankeyComponent> = {
  title: 'Visualization/Sankey',
  component: VxSankeyComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      nodes: [
        { id: 'a', label: 'Origem' },
        { id: 'b', label: 'Etapa' },
        { id: 'c', label: 'Destino' },
      ],
      links: [
        { source: 'a', target: 'b', value: 40 },
        { source: 'b', target: 'c', value: 32 },
      ],
    },
    template: \`<vx-sankey [nodes]="nodes" [links]="links" />\`,
  }),
};

export default meta;
type Story = StoryObj<VxSankeyComponent>;

export const Default: Story = {};
`,

  'diagram/diagram.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxDiagramComponent } from './diagram.component';

const meta: Meta<VxDiagramComponent> = {
  title: 'Visualization/Diagram',
  component: VxDiagramComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      nodes: [
        { id: '1', label: 'Início', x: 40, y: 80 },
        { id: '2', label: 'Processo', x: 200, y: 80 },
        { id: '3', label: 'Fim', x: 360, y: 80 },
      ],
      edges: [
        { from: '1', to: '2' },
        { from: '2', to: '3' },
      ],
    },
    template: \`<vx-diagram [nodes]="nodes" [edges]="edges" />\`,
  }),
};

export default meta;
type Story = StoryObj<VxDiagramComponent>;

export const Default: Story = {};
`,

  'map/map.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
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
`,

  'map/vector-map.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxVectorMapComponent } from './vector-map.component';

const meta: Meta<VxVectorMapComponent> = {
  title: 'Maps/VectorMap',
  component: VxVectorMapComponent,
  tags: ['autodocs'],
  args: {
    selected: 'br',
    regions: [
      { id: 'br', name: 'Brasil', d: 'M120,200 L200,180 L240,220 L180,260 Z' },
      { id: 'pt', name: 'Portugal', d: 'M60,120 L100,100 L120,140 L80,160 Z' },
    ],
  },
};

export default meta;
type Story = StoryObj<VxVectorMapComponent>;

export const Default: Story = {};
`,

  'number-box/number-box.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxNumberBoxComponent } from './number-box.component';

const meta: Meta<VxNumberBoxComponent> = {
  title: 'Forms/NumberBox',
  component: VxNumberBoxComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { value: 42 },
    template: \`
      <vx-number-box style="display:block;max-width:200px" label="Quantidade" [(value)]="value" [min]="0" [max]="100" />
    \`,
  }),
};

export default meta;
type Story = StoryObj<VxNumberBoxComponent>;

export const Default: Story = {};
`,

  'radio-group/radio-group.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxRadioGroupComponent } from './radio-group.component';

const meta: Meta<VxRadioGroupComponent> = {
  title: 'Forms/RadioGroup',
  component: VxRadioGroupComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { items: ['Mensal', 'Anual'], value: 'Mensal' },
    template: \`<vx-radio-group label="Plano" [items]="items" [(value)]="value" />\`,
  }),
};

export default meta;
type Story = StoryObj<VxRadioGroupComponent>;

export const Default: Story = {};
`,

  'slider/slider.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxSliderComponent } from './slider.component';

const meta: Meta<VxSliderComponent> = {
  title: 'Forms/Slider',
  component: VxSliderComponent,
  tags: ['autodocs'],
  args: { min: 0, max: 100, value: 40 },
  render: (args) => ({
    props: args,
    template: \`<vx-slider style="display:block;max-width:280px" [(value)]="value" [min]="min" [max]="max" />\`,
  }),
};

export default meta;
type Story = StoryObj<VxSliderComponent>;

export const Default: Story = {};
`,

  'range-slider/range-slider.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxRangeSliderComponent } from './range-slider.component';

const meta: Meta<VxRangeSliderComponent> = {
  title: 'Forms/RangeSlider',
  component: VxRangeSliderComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { start: 20, end: 75 },
    template: \`
      <vx-range-slider style="display:block;max-width:280px" [(start)]="start" [(end)]="end" />
    \`,
  }),
};

export default meta;
type Story = StoryObj<VxRangeSliderComponent>;

export const Default: Story = {};
`,

  'text-area/text-area.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxTextAreaComponent } from './text-area.component';

const meta: Meta<VxTextAreaComponent> = {
  title: 'Forms/TextArea',
  component: VxTextAreaComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { value: 'Notas do projeto…' },
    template: \`
      <vx-text-area style="display:block;max-width:360px" placeholder="Escreva…" [(value)]="value" [rows]="4" />
    \`,
  }),
};

export default meta;
type Story = StoryObj<VxTextAreaComponent>;

export const Default: Story = {};
`,

  'color-box/color-box.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxColorBoxComponent } from './color-box.component';

const meta: Meta<VxColorBoxComponent> = {
  title: 'Forms/ColorBox',
  component: VxColorBoxComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { value: '#0f6cbd' },
    template: \`<vx-color-box [(value)]="value" />\`,
  }),
};

export default meta;
type Story = StoryObj<VxColorBoxComponent>;

export const Default: Story = {};
`,

  'tag-box/tag-box.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxTagBoxComponent } from './tag-box.component';

const meta: Meta<VxTagBoxComponent> = {
  title: 'Forms/TagBox',
  component: VxTagBoxComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { value: ['angular', 'design'] },
    template: \`
      <vx-tag-box style="display:block;max-width:320px" label="Tags" [(value)]="value" />
    \`,
  }),
};

export default meta;
type Story = StoryObj<VxTagBoxComponent>;

export const Default: Story = {};
`,

  'autocomplete/autocomplete.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxAutocompleteComponent } from './autocomplete.component';

const meta: Meta<VxAutocompleteComponent> = {
  title: 'Forms/Autocomplete',
  component: VxAutocompleteComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { items: ['Lisboa', 'São Paulo', 'Luanda', 'Maputo'], value: '' },
    template: \`
      <vx-autocomplete style="display:block;max-width:280px" label="Cidade" [items]="items" [(value)]="value" />
    \`,
  }),
};

export default meta;
type Story = StoryObj<VxAutocompleteComponent>;

export const Default: Story = {};
`,

  'lookup/lookup.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxLookupComponent } from './lookup.component';

const meta: Meta<VxLookupComponent> = {
  title: 'Forms/Lookup',
  component: VxLookupComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      items: [
        { id: '1', label: 'Item A' },
        { id: '2', label: 'Item B' },
      ],
      value: '1',
    },
    template: \`
      <vx-lookup style="display:block;max-width:280px" label="Referência" [items]="items" [(value)]="value" />
    \`,
  }),
};

export default meta;
type Story = StoryObj<VxLookupComponent>;

export const Default: Story = {};
`,

  'date-range-box/date-range-box.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxDateRangeBoxComponent } from './date-range-box.component';

const meta: Meta<VxDateRangeBoxComponent> = {
  title: 'Forms/DateRangeBox',
  component: VxDateRangeBoxComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { start: '2026-11-01', end: '2026-11-13' },
    template: \`
      <vx-date-range-box style="display:block;max-width:360px" [(start)]="start" [(end)]="end" />
    \`,
  }),
};

export default meta;
type Story = StoryObj<VxDateRangeBoxComponent>;

export const Default: Story = {};
`,

  'button-group/button-group.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxButtonGroupComponent } from './button-group.component';

const meta: Meta<VxButtonGroupComponent> = {
  title: 'Components/ButtonGroup',
  component: VxButtonGroupComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { items: ['Dia', 'Semana', 'Mês'], value: 'Semana' },
    template: \`<vx-button-group [items]="items" [(value)]="value" />\`,
  }),
};

export default meta;
type Story = StoryObj<VxButtonGroupComponent>;

export const Default: Story = {};
`,

  'drop-down-button/drop-down-button.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxDropDownButtonComponent } from './drop-down-button.component';

const meta: Meta<VxDropDownButtonComponent> = {
  title: 'Components/DropDownButton',
  component: VxDropDownButtonComponent,
  tags: ['autodocs'],
  args: { label: 'Exportar', items: ['PDF', 'CSV', 'XLSX'] },
};

export default meta;
type Story = StoryObj<VxDropDownButtonComponent>;

export const Default: Story = {};
`,

  'calendar/calendar.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxCalendarComponent } from './calendar.component';

const meta: Meta<VxCalendarComponent> = {
  title: 'Forms/Calendar',
  component: VxCalendarComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { selected: '2026-11-13' },
    template: \`<vx-calendar [(selected)]="selected" />\`,
  }),
};

export default meta;
type Story = StoryObj<VxCalendarComponent>;

export const Default: Story = {};
`,

  'load-panel/load-panel.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxLoadPanelComponent } from './load-panel.component';

const meta: Meta<VxLoadPanelComponent> = {
  title: 'Feedback/LoadPanel',
  component: VxLoadPanelComponent,
  tags: ['autodocs'],
  render: () => ({
    template: \`
      <div style="position:relative;height:200px;border:1px solid var(--vx-color-border)">
        <vx-load-panel [visible]="true" message="Processando dados…" />
      </div>
    \`,
  }),
};

export default meta;
type Story = StoryObj<VxLoadPanelComponent>;

export const Default: Story = {};
`,

  'tooltip/tooltip.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxTooltipComponent } from './tooltip.component';

const meta: Meta<VxTooltipComponent> = {
  title: 'Feedback/Tooltip',
  component: VxTooltipComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { text: 'Mais informações' },
    template: \`<vx-tooltip [text]="text"><span>Hover aqui</span></vx-tooltip>\`,
  }),
};

export default meta;
type Story = StoryObj<VxTooltipComponent>;

export const Default: Story = {};
`,

  'popover/popover.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxPopoverComponent } from './popover.component';

const meta: Meta<VxPopoverComponent> = {
  title: 'Feedback/Popover',
  component: VxPopoverComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { open: true, title: 'Ajuda' },
    template: \`
      <vx-popover [(open)]="open" [title]="title">
        <span vxPopoverTrigger>Detalhes</span>
        Texto explicativo do popover.
      </vx-popover>
    \`,
  }),
};

export default meta;
type Story = StoryObj<VxPopoverComponent>;

export const Default: Story = {};
`,

  'pagination/pagination.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxPaginationComponent } from './pagination.component';

const meta: Meta<VxPaginationComponent> = {
  title: 'Components/Pagination',
  component: VxPaginationComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { totalItems: 120, pageSize: 10, page: 2 },
    template: \`<vx-pagination [totalItems]="totalItems" [pageSize]="pageSize" [(page)]="page" />\`,
  }),
};

export default meta;
type Story = StoryObj<VxPaginationComponent>;

export const Default: Story = {};
`,

  'gallery/gallery.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxGalleryComponent } from './gallery.component';

const meta: Meta<VxGalleryComponent> = {
  title: 'Components/Gallery',
  component: VxGalleryComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      items: [
        { id: '1', src: 'https://picsum.photos/seed/a/480/280', alt: 'Painel A' },
        { id: '2', src: 'https://picsum.photos/seed/b/480/280', alt: 'Painel B' },
      ],
      selectedId: '1',
    },
    template: \`<vx-gallery [items]="items" [(selectedId)]="selectedId" />\`,
  }),
};

export default meta;
type Story = StoryObj<VxGalleryComponent>;

export const Default: Story = {};
`,

  'tile-view/tile-view.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxTileViewComponent } from './tile-view.component';

const meta: Meta<VxTileViewComponent> = {
  title: 'Data/TileView',
  component: VxTileViewComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      items: [
        { id: '1', title: 'SolarMax', subtitle: 'África' },
        { id: '2', title: 'EcoCharge', subtitle: 'Europa' },
      ],
    },
    template: \`<vx-tile-view [items]="items" />\`,
  }),
};

export default meta;
type Story = StoryObj<VxTileViewComponent>;

export const Default: Story = {};
`,

  'scroll-view/scroll-view.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxScrollViewComponent } from './scroll-view.component';

const meta: Meta<VxScrollViewComponent> = {
  title: 'Components/ScrollView',
  component: VxScrollViewComponent,
  tags: ['autodocs'],
  render: () => ({
    template: \`
      <vx-scroll-view style="display:block;height:120px;max-width:280px;border:1px solid var(--vx-color-border)">
        <p style="margin:0;padding:0.5rem">Conteúdo longo…</p>
        <p style="margin:0;padding:0.5rem">Linha 2</p>
        <p style="margin:0;padding:0.5rem">Linha 3</p>
        <p style="margin:0;padding:0.5rem">Linha 4</p>
        <p style="margin:0;padding:0.5rem">Linha 5</p>
      </vx-scroll-view>
    \`,
  }),
};

export default meta;
type Story = StoryObj<VxScrollViewComponent>;

export const Default: Story = {};
`,

  'context-menu/context-menu.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxContextMenuComponent } from './context-menu.component';

const meta: Meta<VxContextMenuComponent> = {
  title: 'Navigation/ContextMenu',
  component: VxContextMenuComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      items: [
        { id: '1', label: 'Copiar' },
        { id: '2', label: 'Colar' },
        { id: '3', label: 'Excluir', disabled: true },
      ],
    },
    template: \`
      <vx-context-menu [items]="items">
        <div style="padding:2rem;background:var(--vx-color-bg-muted)">Clique com o botão direito</div>
      </vx-context-menu>
    \`,
  }),
};

export default meta;
type Story = StoryObj<VxContextMenuComponent>;

export const Default: Story = {};
`,

  'file-uploader/file-uploader.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxFileUploaderComponent } from './file-uploader.component';

const meta: Meta<VxFileUploaderComponent> = {
  title: 'File/FileUploader',
  component: VxFileUploaderComponent,
  tags: ['autodocs'],
  args: { label: 'Enviar anexos', multiple: true },
};

export default meta;
type Story = StoryObj<VxFileUploaderComponent>;

export const Default: Story = {};
`,

  'field-set/field-set.stories.ts': `import type { Meta, StoryObj } from '@storybook/angular';
import { VxFieldSetComponent } from './field-set.component';

const meta: Meta<VxFieldSetComponent> = {
  title: 'Forms/FieldSet',
  component: VxFieldSetComponent,
  tags: ['autodocs'],
  render: () => ({
    template: \`
      <vx-field-set legend="Contato">
        <p style="margin:0">Campos do fieldset aqui.</p>
      </vx-field-set>
    \`,
  }),
};

export default meta;
type Story = StoryObj<VxFieldSetComponent>;

export const Default: Story = {};
`,
};

let created = 0;
for (const [rel, content] of Object.entries(files)) {
  const target = path.join(root, rel);
  if (fs.existsSync(target)) {
    console.log('skip exists', rel);
    continue;
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, 'utf8');
  created++;
  console.log('wrote', rel);
}
console.log('created', created, 'story files');
