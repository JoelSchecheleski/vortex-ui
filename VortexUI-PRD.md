# VortexUI — Product Requirements Document (PRD)

**Versão:** 2.1 — Super Suite YOLO (sem npm)  
**Data:** 13 de Novembro de 2026  
**Status:** Theme Lab ✅ · Fases 0–6 ✅ · **Super Suite M0 em massa ✅** (Chat, Pivot, Maps, Diagram, Gauges, Editors, Overlays, Scheduler mês, Chart funnel/polar) · Widgets Gallery expandida ✅ · **npm publish adiada** · Próximo: aprofundar M1→M2 + CI visual (ainda sem publish)  

**Referências de mercado (inspiração de superfície / DX de produto — não fork de código):**  
- Repositório: [DevExpress/DevExtreme](https://github.com/DevExpress/DevExtreme) — suite HTML5/JS enterprise (~80+ widgets; Angular / React / Vue / jQuery)  
- Site Angular: [DevExtreme Angular Components](https://js.devexpress.com/Angular/Documentation/Guide/Angular_Components/DevExtreme_Angular_Components/) (~80+ responsive/touch UI)  
- [Widgets Gallery DevExtreme Angular](https://js.devexpress.com/Angular/Demos/WidgetsGallery/) — padrão UX da demo Vortex  
- [API Reference — UI Components](https://js.devexpress.com/Angular/Documentation/ApiReference/UI_Components/)  
- [AI-powered Features (DevExtreme)](https://js.devexpress.com/Angular/Documentation/Guide/AI_Features/Overview_of_AI-powered_Features/)  
- [AI Assistant — DataGrid](https://js.devexpress.com/Angular/Documentation/Guide/UI_Components/DataGrid/AI_Assistant/)  
- [AI Columns — DataGrid](https://js.devexpress.com/Angular/Documentation/Guide/UI_Components/DataGrid/Columns/Column_Types/AI_Columns/)  
- [Choose a Data Management Component](https://js.devexpress.com/Angular/Documentation/Guide/UI_Components/DataGrid/Choose_a_Data_Management_Component/)  

**Design system interno (tema #2):**  
- `design/Guidelines-LDS.md` — LDS Figma Make Themes (LDS GF Theme); fonte de verdade do tema **LDS**  
- `design/brand/` — marca VortexUI (mark + lockup SVG)  

---

## 1. Visão do Produto

Transformar o VortexUI em um **super projeto Angular-only**: a suite de UI enterprise mais moderna da plataforma Angular — **paridade de catálogo** com a superfície DevExtreme (~80+ componentes), reimplementada de forma **nativa** (Signals, Standalone, zoneless, MIT), com AI-first e performance de DataGrid como âncora.

### 1.1 Tese do Super Projeto

O [DevExtreme](https://github.com/DevExpress/DevExtreme) é a referência de mercado em **completude**: DataGrid, TreeList, CardView, Pivot, Charts/Gauges, Scheduler, Gantt, Diagram, Maps, File Manager, Forms/Editors, Chat, HTML Editor, navigation/layout e wrappers interativos — com demos densas e wrappers Angular estáveis.

VortexUI **não** embute nem redistribui o runtime proprietário DevExtreme. Em vez disso:

| O que reaproveitamos (legal / produto) | O que **não** fazemos |
|----------------------------------------|------------------------|
| Taxonomia de widgets e agrupamentos da Widgets Gallery | Copiar código-fonte DX / `devextreme` / `devextreme-angular` |
| Contratos de UX (toolbar, filter row, AI Assistant, Prompt Editor) | Reexportar pacotes comerciais sob MIT |
| Critérios de “feature complete” por família (Grid / Chart / Scheduler…) | Dependência runtime obrigatória de DX |
| Padrões Angular publicamente documentados (config syntax, SSR, tree-shaking) | Clonar assets/temas proprietários sem reimplementação |
| Benchmarks de demos (~450) como checklist de aceite | Passar-se por produto DevExpress |

**Escopo de plataforma:** **somente Angular 22+**. Sem React/Vue/jQuery no core. Isso concentra engenharia na melhor API Signals possível (vantagem vs wrappers multi-framework).

**Superioridade explícita vs. referência DX:**

- 100% Standalone + Signals (`input` / `model` / `output` / `resource`)
- Zoneless-first + `OnPush`
- Design Tokens (`data-vx-theme`) — Fluent Light + LDS agora; ThemeBuilder Vortex depois
- **AI-native** em toda a suite (opt-in, Command Bus, sem vendor lock de LLM)
- Bundle tree-shakeable por secondary entries (`vortex-ui/grid`, `vortex-ui/charts`, `vortex-ui/ai`, …)
- Licença pretendida **MIT** (a confirmar) — adoção open / enterprise sem trial comercial DX
- DataGrid 1M+ rows como prova de fogo contínua

**Nome:** VortexUI  
**Target:** Angular 22+ (alinhar major a major, como DX faz com Angular)  
**Estilo:** CSS puro + Design Tokens (sem Tailwind no core)  
**Monorepo:** Nx + `ng-packagr`  

**Diferenciais principais:**  
- Suite Angular completa (programa Super Suite §13)  
- DataGrid de altíssima performance + Theme Lab / Widgets Gallery  
- File Manager + AI Bridge  
- Catálogo vivo alinhado a [DevExtreme Angular](https://js.devexpress.com/Angular/)  
- Temas: **Fluent Light (default)** · **LDS** · expansão ThemeBuilder nas fases Super  

---

## 2. Decisões já tomadas

| Item | Decisão |
|------|---------|
| Nome da biblioteca | **VortexUI** |
| Framework | **Angular 22+ only** (sem ports React/Vue/jQuery no core) |
| Relação com DevExtreme | **Inspiração / paridade de superfície** — implementação própria; sem dependência runtime DX |
| Código DX | **Proibido** no tree Vortex (estudo de docs/demos públicos ok; sem paste de sources) |
| Arquitetura | Nx monorepo + secondary entry points por família |
| Componentes | Standalone only |
| Estado / Reactividade | Signals first (`input()`, `model()`, `output()`, `signal`, `computed`, `resource`) |
| Change Detection | `OnPush` + compatível com zoneless |
| Styling | CSS + Design Tokens (sem Tailwind no core) |
| Tema default | **Fluent Blue Light** (`fluent-blue-light`, alias `fluent`) — ThemeBuilder 26.1.6 |
| Temas Fluent | `fluent-blue-light` · `fluent-blue-dark` · `fluent-saas-light` · `fluent-saas-dark` |
| Tema LDS | **LDS** (`lds`) — `design/Guidelines-LDS.md` |
| Fontes ThemeBuilder | `design/themes/dx-themebuilder/*.css` (referência; runtime usa `--vx-*`) |
| Temas futuros | Material, `system` preference + ThemeBuilder Vortex |
| Validação de tema | Theme Lab + **Widgets Gallery** (`apps/docs`) |
| Foco prioritário | 1) DataGrid + temas<br>2) File Manager<br>3) AI Foundation<br>4) **Paridade 80+ (Super Suite)** |
| AI | Opt-in por componente (`ai.enabled`); sem vendor lock de LLM |
| Publicação | `vortex-ui` + entries `vortex-ui/*` (`ng-packagr`) |
| Qualidade Angular-class | SSR-safe, tree-shaking, types first, testes de componente, visual regression |
| Licença pretendida | MIT (a confirmar) |

---

## 3. Escopo atual (estado do monorepo)

### 3.1 Core
- Design Tokens completos (spacing, radius, typography, shadows, z-index, transitions) ✅
- `VortexThemeService` — `fluent` | `lds` (default `fluent`) ✅
- Temas CSS: `fluent.css` + `lds.css` + barrel `styles/vortex-ui.css` ✅
- Theme Lab + **Widgets Gallery** em `apps/docs` (nav accordion, preview, code pane) ✅
- Entry `vortex-ui/ai` + Mock AI Integration ✅
- Storybook (vortex-ui) ✅ — **~76 stories** cobrindo Super Suite M0 (build-storybook OK)
- Brand: `design/brand/` + logo na gallery ✅

### 3.2 Maturidade por família (resumo)

| Família (espelho DX) | Status Vortex | Gap vs Super Suite |
|----------------------|---------------|--------------------|
| Data Grid / Data Mgmt | DataGrid (virt + remote + AI + edit/group/export), TreeList, CardView, FilterBuilder, File Manager | Pivot Grid + Field Chooser enterprise; master-detail; state storing; column chooser completo |
| Forms & Editors | Form, TextBox, Select, List, Validation, Button… | Autocomplete/Lookup/TagBox/DateRange/ColorBox profundos; Smart Paste completo |
| Navigation & Layout | Tabs, Drawer, TreeView, Splitter, Toolbar… | Menu/ContextMenu/Accordion/Stepper/Gallery/TileView feature-complete |
| Data Visualization | Chart (+funnel/polar), Sparkline, Bullet, Funnel, TreeMap, Sankey, Gauges, Diagram | M0 → M2 interação/séries |
| Scheduling | Scheduler (day/week/**month**), Gantt (base) | Timeline/agenda, recurrence, resources, drag-edit rich |
| Messaging / Editor | HTML Editor + AI, **Chat M0** | Chat AI streaming/attachments, collab editing |
| Maps / Pivot | **PivotGrid M0**, Field Chooser, Map, Vector Map | Pivot engine 1M + map providers |
| Editors / Overlays | Number/Radio/Slider/Tag/Lookup/… + LoadPanel/Tooltip/Popover/… | M1→M2 polish |
| Progress / Wrappers | ProgressBar, LoadIndicator, Draggable/Sortable/Resizable | Wrappers M2 production-grade |

### 3.3 Estrutura alvo (Super Suite — secondary entries)

```
vortex-ui/
├── apps/docs/                     # Widgets Gallery + Theme Lab + AI demos
├── apps/...                       # Exemplos / e2e / visual regression
├── design/brand/                  # Logo + guidelines
├── libs/vortex-ui/
│   ├── src/lib/core/              # Theme, tokens, DataSource, a11y utils
│   ├── src/lib/ai/                # → vortex-ui/ai
│   ├── src/lib/components/
│   │   ├── grid/                  # → vortex-ui/grid
│   │   ├── charts/                # → vortex-ui/charts
│   │   ├── scheduler/             # → vortex-ui/scheduler
│   │   ├── editors/               # → vortex-ui/editors
│   │   ├── navigation/            # → vortex-ui/navigation
│   │   ├── file/                  # → vortex-ui/file
│   │   └── ...
│   └── styles/themes/
```

**Regra de packaging:** o consumidor importa só o que usa (`import { VxDataGridComponent } from 'vortex-ui/grid'`), espelhando a disciplina de tree-shaking do ecossistema DX Angular, sem o custo do runtime multi-framework.

---

## 4. Temas — requisitos reforçados (Fluent Light + LDS)

### 4.1 Objetivos (escopo inicial = 2 temas)

1. **Default = Fluent Blue Light** (`fluent-blue-light`, alias `fluent`) — tokens do ThemeBuilder `vx.fluent.BlueLight.css`.
2. **Fluent Blue Dark** / **Fluent SaaS Light** / **Fluent SaaS Dark** — mesmos fontes ThemeBuilder mapeados para `--vx-*`.
3. **LDS** (`lds`) — guideline `design/Guidelines-LDS.md`.
4. Troca de tema em runtime via `data-vx-theme` sem remount forçado (exceto casos documentados).
5. Theme Lab / Gallery / CI: validar os **5** temas oficiais do switcher.

### 4.2 Contratos de tema (namespace Vortex)

| Token group | Obrigatório | Uso |
|-------------|-------------|-----|
| `--vx-color-bg-*` | Sim | Surfaces, grid rows, dialogs |
| `--vx-color-fg-*` | Sim | Texto, ícones |
| `--vx-color-border-*` | Sim | Grid lines, inputs |
| `--vx-color-accent-*` / primary | Sim | Primary actions, AI sparkle |
| `--vx-color-danger/success/warning` | Sim | Feedback |
| `--vx-shadow-*` | Sim | Popups / AI dialog |
| `--vx-radius-*` | Sim | Controles |
| `--vx-font-*` + type scale | Sim | Tipografia |
| `--vx-spacing-*` | Sim | Layout |

Componentes **nunca** usam hex direto; só tokens `--vx-*`. O arquivo de tema (`fluent.css` / `lds.css`) é quem resolve os valores.

### 4.3 Tema LDS — fonte de verdade e mapeamento

Fonte: guideline anexado (LDS GF Theme, gerado 17/09/2025 via Figma Make UI Component Studio).

#### Cores canônicas (LDS → `--vx-*`)

| Token LDS (guideline) | Valor | Token Vortex sugerido |
|-----------------------|-------|------------------------|
| `--primary` | `#005C3A` | `--vx-color-primary` |
| `--primary-foreground` | `#FFFFFF` | `--vx-color-primary-fg` |
| `--secondary` | `#BAD49D` | `--vx-color-secondary` |
| `--secondary-foreground` | `#212C16` | `--vx-color-secondary-fg` |
| `--background` | `#F2F2F2` | `--vx-color-bg` |
| `--foreground` | `#4A4A4A` | `--vx-color-fg` |
| `--card` | `#FFFFFF` | `--vx-color-bg-elevated` |
| `--muted` / `--muted-foreground` | `#F2F2F2` / `#6E6E6E` | `--vx-color-muted*` |
| `--destructive` | `#D92020` | `--vx-color-danger` |
| `--border` | `#E6E6E6` | `--vx-color-border` |
| Outline / ghost text | `#003418` | `--vx-color-primary-ink` |
| Input border | `#919191` | `--vx-color-border-strong` |
| Badge default | `#003827` / `#D1F5DC` | `--vx-color-badge-*` |
| Alert info | `#0B4260` / `#D8EFFD` / `#C0E6FC` | `--vx-color-info*` |
| Destructive soft | `#720D0D` / `#FFE4E4` | `--vx-color-danger-soft*` |

#### Tipografia LDS
- Family: **Poppins** (`Poppins, system-ui, sans-serif`) — obrigatória no tema `lds`
- Escala completa Display → Body (Baseline + Emphasized) conforme guideline
- Weights: Regular 400 · Medium 500 · Bold 700
- No tema Fluent, a family pode permanecer a do Fluent; a troca de tema deve trocar `--vx-font-family`

#### Shape / spacing / shadow (LDS)
- Radius base: `0.5rem` (8px em controles; badges 16px)
- Spacing: `xs`…`2xl` conforme guideline
- Shadows: `sm` → `xl` (AI dialog / modal usam `xl`)

#### Regras de UX LDS que o tema #2 **deve** respeitar

| Área | Regra |
|------|--------|
| **Copy** | Sentence case em toda UI (exceção: nomes próprios, marcas, siglas). Sem Title Case em botões/abas/headers. |
| **Tom** | Frases curtas; erros com problema + ação esperada. |
| **Modal / Popup padrão LDS** | 80% × 80% da área útil, centralizado; header/footer fixos; body com scroll; overlay `rgb(0 0 0 / 0.4)`. |
| **AI Assistant / Prompt Editor** | Podem usar shell mais compacto (popover), mas quando abertos como **modal full** no tema LDS, herdam a regra 80%. |
| **Button** | Variants: primary, secondary, outline, ghost, destructive, destructive-ghost. Footer modal: Cancelar = destructive-ghost · CTA = primary. |
| **Input / Textarea / Select** | Border `#919191`, radius 8px, bg branco (via tokens). |
| **Badge** | default / secondary / outline / destructive (cores do guideline). |
| **Alert** | default (info), destructive, description. |
| **Tabs** | Estilo wizard-stepper: grid equal columns, border-bottom 3px, states default / active / done. |

> **Nota:** o AI Assistant Dialog (sparkle) continua o padrão de produto; no tema LDS ele deve consumir primary `#005C3A`, Poppins e sentence case nos chips/labels.

### 4.4 DataGrid como laboratório oficial de tema (Theme Lab)

O **DataGrid** é o componente canônico para **provar** que um tema está completo. Motivo: densidade visual máxima (header, filter row, selection, badges, toolbar, empty cells, AI chrome).

#### Requisitos do Theme Lab (`apps/docs`)
- Mesmo dataset de demo (ex.: Product / Sale Amount / Region / Sector / Sale Date / Customer).
- Switcher de tema no header: **Fluent Light (default)** | **LDS** (somente estes no início).
- Checklist visual obrigatório nos **dois temas**:

| Área | Fluent Light | LDS |
|------|--------------|-----|
| Toolbar + group panel | ✓ | ✓ |
| Column headers + sort icons | ✓ | ✓ (sentence case nos headers de demo) |
| Filter row | ✓ | ✓ |
| Zebra / hover / selection | ✓ | ✓ (primary/selection verdes LDS) |
| Badges / pills (Category) | ✓ | ✓ (tokens badge LDS) |
| Empty / “No data” cells | ✓ | ✓ |
| AI sparkle button + AI Assistant dialog | ✓ | ✓ (Poppins + primary LDS) |
| AI Prompt Editor (coluna AI) | ✓ | ✓ |
| Scrollbars / sticky header | ✓ | ✓ |
| Contraste texto/ícone (WCAG AA) | ✓ | ✓ |
| Tipografia do tema | Fluent stack | **Poppins** carregada |

#### Critérios de aceite — temas
- [ ] App docs inicia em **Fluent Light** por default
- [ ] Alternar para **LDS** aplica tokens + Poppins sem quebrar DataGrid nem AI dialog
- [ ] `lds.css` espelha o guideline (cores, radius, type scale, shadows)
- [ ] Nenhum componente core usa cor hex hardcoded fora de tokens
- [ ] Screenshot / visual regression mínimo (**Fluent Light + LDS**) no CI (fase docs)
- [ ] Nenhum outro tema aparece no switcher do docs até nova fase
---

## 5. Catálogo de componentes (paridade DevExtreme Angular — Super Suite)

Fontes canônicas:
- [DevExpress/DevExtreme](https://github.com/DevExpress/DevExtreme)
- [Widgets Gallery](https://js.devexpress.com/Angular/Demos/WidgetsGallery/)
- [DevExtreme Angular Components](https://js.devexpress.com/Angular/Documentation/Guide/Angular_Components/DevExtreme_Angular_Components/)
- [UI Components API](https://js.devexpress.com/Angular/Documentation/ApiReference/UI_Components/)

**Regra:** cada item é um alvo de produto VortexUI (`vx-*`). Prioridade = fase do roadmap.  
**Meta Super Suite:** cobrir a mesma **superfície de categorias** DX (~80+ widgets) com implementação Angular-native.

**Níveis de maturidade (por componente):**

| Nível | Significado |
|-------|-------------|
| **M0** | API + demo mínima |
| **M1** | Usável em app interno (a11y básica, tokens, docs) |
| **M2** | Feature set “gallery demo” (paridade UX principal DX) |
| **M3** | Enterprise (perf, SSR, i18n, state store, AI commands, visual regression) |

Meta de lançamento **v2 Super**: famílias críticas em **M2+**; Grid/File/AI em **M3**.

### 5.1 Data Grids / Data Management

| Componente Vortex | Inspiração DX | Fase | AI Dialog | Notas |
|-------------------|---------------|------|-----------|-------|
| `vx-data-grid` | Data Grid | **1** | Sim | Virtualização, AI Assistant, AI Columns |
| `vx-tree-list` | Tree List | 5 | Sim | AI Columns |
| `vx-card-view` | Card View | 5 | Sim | |
| `vx-pivot-grid` | Pivot Grid | **10** | Sim | Engine client ~1M cells (meta DX); M2+ |
| `vx-pivot-field-chooser` | Pivot Grid Field Chooser | **10** | Opcional | |
| `vx-filter-builder` | Filter Builder | 4 ✅ | Sim | Integra com Grid/List |

> **Escolha de Data Management (paridade DX):** DataGrid = tabular flat/master-detail; TreeList = hierarquia; CardView = cards responsivos; PivotGrid = OLAP/agregação. Documentar no docs como [Choose a Data Management Component](https://js.devexpress.com/Angular/Documentation/Guide/UI_Components/DataGrid/Choose_a_Data_Management_Component/).

### 5.2 Data Visualization

| Componente Vortex | Inspiração DX | Fase | AI Dialog |
|-------------------|---------------|------|-----------|
| `vx-chart` (+ area/bar/line/pie/…) | Chart family (30+ types meta) | **6** base ✅ · **9** expand | Sim |
| `vx-bullet` | Bullet Chart | 9 | Opcional |
| `vx-funnel` | Funnel | 9 | Opcional |
| `vx-pie-chart` | Pie (série dedicada) | 6/9 | Sim |
| `vx-polar-chart` | Polar | 9 | Opcional |
| `vx-sankey` | Sankey | 9 | Opcional |
| `vx-sparkline` | Sparklines | 5 ✅ | Opcional |
| `vx-tree-map` | Tree Map | 9 | Sim |
| `vx-bar-gauge` / `vx-circular-gauge` / `vx-linear-gauge` | Gauges | 9 | Opcional |
| `vx-diagram` | Diagram | **11** | Sim |

### 5.3 Scheduling / Planning

| Componente Vortex | Inspiração DX | Fase | AI Dialog |
|-------------------|---------------|------|-----------|
| `vx-scheduler` | Scheduler | **6** base ✅ · **8** rich | Sim |
| `vx-gantt` | Gantt | **6** base ✅ · **8** rich | Sim |

### 5.4 Messaging & Editor

| Componente Vortex | Inspiração DX | Fase | AI Dialog / AI nativo |
|-------------------|---------------|------|------------------------|
| `vx-chat` | Chat (AI assistants / conversational) | **8** | Nativo (streaming, tools, attachments, prompt suggestions) |
| `vx-html-editor` | HTML Editor / Rich Text | 5 ✅ · **8** collab | AI text editing |

### 5.5 Forms & Data Editors

| Componente Vortex | Inspiração DX | Fase | AI Dialog |
|-------------------|---------------|------|-----------|
| `vx-form` | Form | 3 | Sim + Smart Paste |
| `vx-fieldset` | Field Set | 3 | Opcional |
| `vx-calendar` | Calendar | 3 | Opcional |
| `vx-checkbox` | Check Box | 3 | — |
| `vx-color-box` | Color Box | 4 | — |
| `vx-date-box` | Date Box | 3 | — |
| `vx-date-range-box` | Date Range Box | 4 | — |
| `vx-number-box` | Number Box | 3 | — |
| `vx-radio-group` | Radio Group | 3 | — |
| `vx-range-selector` | Range Selector | 5 | Sim |
| `vx-range-slider` / `vx-slider` | Sliders | 3 | — |
| `vx-switch` | Switch | 3 | — |
| `vx-text-area` / `vx-text-box` | Text Area / Box | 3 | Opcional |
| `vx-autocomplete` | Autocomplete | 3 | Opcional |
| `vx-drop-down-box` | Drop Down Box | 4 | Opcional |
| `vx-select-box` | Select Box | 3 | Opcional |
| `vx-tag-box` | Tag Box | 3 | Opcional |
| `vx-lookup` | Lookup | 4 | Sim |

### 5.6 Buttons

| Componente Vortex | Inspiração DX | Fase | AI Dialog |
|-------------------|---------------|------|-----------|
| `vx-button` | Button | ✅ 0 | — |
| `vx-button-group` | Button Group | 3 | — |
| `vx-drop-down-button` | Drop Down Button | 3 | — |
| `vx-speech-to-text` | Speech To Text | 4 | Integra no AI dialog |
| `vx-fab` | Floating Action Button | 4 | — |

### 5.7 File Upload / Management

| Componente Vortex | Inspiração DX | Fase | AI Dialog |
|-------------------|---------------|------|-----------|
| `vx-file-manager` | File Manager | **2** | Sim (organizar, buscar, resumir) |
| `vx-file-uploader` | File Uploader | 2 | Opcional |

### 5.8 Popup & Notifications

| Componente Vortex | Inspiração DX | Fase | AI Dialog |
|-------------------|---------------|------|-----------|
| `vx-popover` | Popover | 3 | — (usado pelo AI dialog) |
| `vx-popup` / `vx-dialog` | Popup | 3 | — (shell do AI Assistant) |
| `vx-toast` | Toast | 3 | — |
| `vx-tooltip` | Tooltip | 3 | — |

### 5.9 Navigation & Layout

| Componente Vortex | Inspiração DX | Fase | AI Dialog |
|-------------------|---------------|------|-----------|
| `vx-accordion` | Accordion | 4 | Opcional |
| `vx-action-sheet` | Action Sheet | 4 | — |
| `vx-context-menu` | Context Menu | 3 | — |
| `vx-menu` | Menu | 4 | Opcional |
| `vx-multi-view` | Multi View | 4 | — |
| `vx-drawer` | Drawer | 3 | — |
| `vx-tab-panel` / `vx-tabs` | Tab Panel / Tabs | 3 | Opcional |
| `vx-toolbar` | Toolbar | 3 | Host do botão AI |
| `vx-stepper` | Stepper | 4 | Sim |
| `vx-pagination` | Pagination | 3 | — |
| `vx-list` | List | 3 | Sim |
| `vx-tree-view` | Tree View | 4 | Sim |
| `vx-tile-view` | Tile View | 5 | Opcional |
| `vx-splitter` | Splitter | 4 | — |
| `vx-gallery` | Gallery | 5 | Opcional |
| `vx-scroll-view` | Scroll View | 3 | — |
| `vx-box` / `vx-responsive-box` | Box / Responsive Box | 4 | — |

### 5.10 Interactive wrappers, progress, maps, validation

| Componente Vortex | Inspiração DX | Fase | AI Dialog |
|-------------------|---------------|------|-----------|
| `vx-draggable` / `vx-sortable` / `vx-resizable` | Draggable / Sortable / Resizable | 4 | — |
| `vx-load-indicator` / `vx-load-panel` / `vx-progress-bar` | Progress | 3 | — |
| `vx-map` / `vx-vector-map` | Maps | **11** | Sim |
| `vx-validator` / `vx-validation-group` / `vx-validation-summary` | Validation | 3 | Opcional (explicar erros) |

### 5.11 Famílias DX a cobrir na Super Suite (checklist de produto)

Espelho das categorias públicas DevExtreme Angular ([js.devexpress.com/Angular](https://js.devexpress.com/Angular/)):

1. **Data Grids / Data Management** — DataGrid, TreeList, CardView, PivotGrid (+ Field Chooser), Filter Builder  
2. **Data Visualization** — Chart family, Bullet, Funnel, Pie, Polar, Sankey, Sparklines, TreeMap, Gauges, Diagram  
3. **Scheduling / Planning** — Scheduler, Gantt  
4. **Messaging** — Chat (AI assistants & conversational UX)  
5. **Editors** — HTML/Rich Text Editor (+ AI text), Form & data editors  
6. **File Management** — File Manager, File Uploader  
7. **Buttons / Actions** — Button, ButtonGroup, DropDownButton, FAB, SpeechToText  
8. **Navigation & Layout** — Accordion, Menu, Drawer, Tabs, Toolbar, Stepper, List, TreeView, Splitter, Gallery, …  
9. **Popup & Overlays** — Popup, Popover, Toast, Tooltip, LoadPanel  
10. **Interactive wrappers** — Draggable, Sortable, Resizable  
11. **Maps** — Map (providers), Vector Map  
12. **Validation** — Validator, ValidationGroup, ValidationSummary  

Cada família no `apps/docs` deve ter **categoria accordion + demos** (padrão Widgets Gallery).

### 5.12 Camada de dados (paridade conceitual CustomStore / ArrayStore)

Para sustentar Grid / Pivot / Scheduler / Charts em escala enterprise, VortexUI padroniza:

| Peça | Responsabilidade |
|------|------------------|
| `VxArrayDataSource` | Array em memória + sort/filter/group client |
| `VxRemoteDataSource` | `load({ skip, take, sort, filter })` + `totalCount` (já usado no Grid 1M) |
| `VxCustomStore` | Adapter pluggable (REST/GraphQL/SignalR) |
| Cache / reshape | Opções documentadas por componente |
| Real-time | Hooks para patch incremental (WebSocket) sem remount |

### 5.13 Contrato comum a **todos** os componentes

Todo `vx-*` deve expor (quando aplicável):

1. API Signals (`input` / `model` / `output`)
2. Design tokens only (Fluent Light + LDS ok nos dois oficiais)
3. A11y (teclado + ARIA)
4. Tree-shakeable entry (secondary entry points ao longo do tempo)
5. **AI opt-in** — ver §6 (`ai`, `aiIntegration`, toolbar sparkle, dialog)

---

## 6. Vortex AI — operacionalização de componentes por IA

Inspiração: [Overview AI Features](https://js.devexpress.com/Angular/Documentation/Guide/AI_Features/Overview_of_AI-powered_Features/), [aiIntegration Setup](https://js.devexpress.com/Angular/Documentation/Guide/AI_Features/aiIntegration_Setup/), demos de AI Assistant / AI Columns.

### 6.1 Princípios

1. **Opt-in explícito do desenvolvedor** — IA desligada por default (`ai.enabled = false`).
2. **Sem vendor lock** — qualquer LLM via adapter (`VortexAIIntegration`).
3. **A IA não “enxerga o DOM”** — só acessa **contexto tipado** e **comandos declarados** pelo componente (allowlist).
4. **Least privilege** — o app controla quais campos/linhas/ações vão para o modelo.
5. **Human-in-the-loop** — ações destrutivas exigem confirmação configurável.
6. **Mesma UX em todos os componentes AI-capable**: botão sparkle → dialog/popover de interação.

### 6.2 Três modos de IA (produto)

| Modo | UI (ref. anexos) | Uso |
|------|------------------|-----|
| **A — AI Assistant Dialog** | Popup “AI Assistant” com chat, empty state, suggestion chips, mic, send | Linguagem natural → comandos no componente (filter, sort, group, select…) |
| **B — AI Prompt Editor** | Dialog “AI Prompt Editor” ancorado à coluna/feature (Regenerate / Apply) | Prompt fixo ou editável para gerar/derivar dados (ex.: AI Column) |
| **C — AI Embedded / Smart actions** | Sem chat completo (Smart Paste, rewrite no editor, semantic search) | Ações pontuais com o mesmo `aiIntegration` |

### 6.3 Arquitetura — AI Bridge + MVC de comandos

```
┌─────────────────────────────────────────────────────────┐
│  App (Angular)                                          │
│  ┌──────────────┐    ┌──────────────────────────────┐  │
│  │ LLM Adapter  │◄──►│ VortexAIIntegration (shared) │  │
│  │ (OpenAI,     │    │ sendRequest / stream / tools │  │
│  │  Azure,      │    └──────────────┬───────────────┘  │
│  │  local…)     │                   │                   │
│  └──────────────┘                   ▼                   │
│                     ┌───────────────────────────────┐   │
│                     │ VortexAIController (por comp.)│   │
│                     │  Model  → estado do widget    │   │
│                     │  View   → AI Dialog / Prompt  │   │
│                     │  Controller → Command Bus     │   │
│                     └───────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

#### Camadas

| Camada | Responsabilidade |
|--------|------------------|
| **Model** | Snapshot serializável do estado do componente (schema versionado): filtros ativos, sort, selection keys, colunas visíveis, page, metadados — **nunca o DOM**. |
| **View** | `vx-ai-assistant-dialog`, `vx-ai-prompt-editor`, botão sparkle na toolbar. |
| **Controller** | Interpreta intent (LLM tool-calling ou parser) → emite `VortexAICommand[]` → aplica via API pública do componente. |

### 6.4 `VortexAIIntegration` (contrato)

```ts
interface VortexAIIntegration {
  /** Chamada one-shot */
  sendRequest(req: VortexAIRequest): Promise<VortexAIResponse>;
  /** Streaming de tokens / tool calls (Chat) */
  stream?(req: VortexAIRequest): AsyncIterable<VortexAIStreamEvent>;
}

interface VortexAIRequest {
  feature: 'assistant' | 'ai-column' | 'smart-paste' | 'semantic-search' | 'editor' | string;
  componentType: string;          // 'data-grid' | 'form' | ...
  componentId?: string;
  messages?: VortexAIMessage[];
  prompt?: string;
  /** Contexto já filtrado pelo app/componente */
  context: VortexAIContext;
  tools?: VortexAIToolDefinition[]; // comandos permitidos
  signal?: AbortSignal;
}
```

- Uma instância **global** no app **ou** override por componente / por coluna (paridade com `aiIntegration` DevExtreme).
- Secondary entry: `vortex-ui/ai` (alias monorepo `@vortex-ui/ai`) — não puxa LLM SDK para quem não usa IA.

### 6.5 Regras de acesso da IA aos dados (obrigatórias)

| Regra | Detalhe |
|-------|---------|
| **R1 — Deny by default** | Sem `ai.enabled`, nenhum request, nenhum botão sparkle. |
| **R2 — Context projection** | Só campos listados em `ai.contextFields` (ou equivalente) entram no payload. |
| **R3 — Row window** | Default: linhas **visíveis** (+ opcional selection). Cap configurável (`ai.maxRowsInContext`, default sugerido: 100). |
| **R4 — Cancel hook** | `aiRequestCreating` pode mutar `context` / `data` ou `cancel = true` (paridade `onAIAssistantRequestCreating` / `onAIColumnRequestCreating`). |
| **R5 — No persist AI cells** | Valores de AI Column **não** gravam no `dataSource` automaticamente (a menos que o app implemente Apply explícito). |
| **R6 — PII** | API para mascarar/redact antes do envio; docs com checklist LGPD/GDPR. |
| **R7 — Command allowlist** | LLM só pode invocar tools publicados pelo component capability registry. |
| **R8 — Audit** | Eventos `aiCommandExecuted`, `aiRequestCompleted`, `aiRequestFailed` para telemetria do app. |

### 6.6 Capability Registry & Command Bus (técnica avançada)

Cada componente AI-capable registra capacidades:

```ts
interface VortexAICapability {
  componentType: 'data-grid' | 'tree-list' | 'form' | 'file-manager' | 'list' | string;
  commands: VortexAICommandSpec[];
  /** Como montar o Model/contexto a partir do estado Signals */
  projectContext(state: unknown, policy: VortexAIPrivacyPolicy): VortexAIContext;
  /** Aplica comando já validado */
  execute(command: VortexAICommand): void | Promise<void>;
  /** Suggestions chips do empty state */
  suggest?(state: unknown): VortexAISuggestion[];
}
```

#### Exemplos de comandos — DataGrid

| Command | Efeito |
|---------|--------|
| `filter.set` / `filter.clear` | Filtros |
| `sort.set` | Ordenação |
| `group.set` | Agrupamento |
| `selection.set` / `selection.selectAll` | Seleção (cuidado com datasets grandes → deferred) |
| `columns.reorder` / `columns.fix` / `columns.resize` | Layout |
| `paging.goTo` / `focus.row` | Navegação |
| `summary.calculate` | Totais |
| `aiColumn.regenerate` | Regenera coluna AI |
| `export.*` | Somente se habilitado pelo app |

Suggestion chips (empty state do dialog), como no anexo:  
`Help` · `Filter Sector by Health` · `Sort by Region` · `Group by Product`.

### 6.7 AI Assistant Dialog (UX obrigatória quando `ai.enabled`)

Referência visual: anexos (sparkle na toolbar + popup “AI Assistant”).

**Chrome mínimo:**
- Título configurável (`ai.assistant.title`, default `"AI Assistant"`)
- Ações: clear chat, minimize/collapse (opcional), close
- Empty state com ícone sparkle + texto pronto
- Suggestion chips contextuais
- Input (“Type a message”) + send + opcional speech-to-text
- Posicionamento: popup ancorado ao componente / botão sparkle (não página separada)

**API (esboço):**
```html
<vx-data-grid
  [ai]="{ enabled: true, assistant: { enabled: true } }"
  [aiIntegration]="ai"
  (aiRequestCreating)="onAiReq($event)"
  (aiCommandExecuted)="onCmd($event)"
/>
```

Requisitos DX a espelhar / superar:
- Toolbar deve permanecer acessível; se `toolbar.items` for custom, incluir `aiAssistantButton`.
- Respostas customizáveis (`customizeResponseTitle` / `customizeResponseText`).
- Comandos que dependem de feature desligada no grid devem falhar com mensagem clara (não silent fail).

### 6.8 AI Columns + Prompt Editor

Referência visual: anexo “AI Prompt Editor” (textarea + Regenerate Data + Apply).

| Item | Requisito |
|------|-----------|
| Tipo de coluna | `type: 'ai'` |
| Prompt | Pré-definido e/ou editável via Prompt Editor |
| Células | Mostram valor gerado ou `noDataText` (“No data”) |
| Ações | Regenerate (por coluna / selection) · Apply (habilitado só com resultado válido) |
| Limitações | Sem bind a `dataField`; sem sort/filter/edit nativos sobre valor AI (doc explícita) |
| Performance | Cache por row key + prompt hash; `useCache` no request hook |

### 6.9 Técnicas avançadas de renderização / dados com IA

| Técnica | Descrição | Onde |
|---------|-----------|------|
| **Tool-calling determinístico** | LLM escolhe comando tipado; UI aplica via API Signals — evita “IA reescrever HTML” | Assistant |
| **Context compaction** | Summaries + sample rows em vez de dataset inteiro | Large grids |
| **Semantic search** | Embedding/search provider pluggable na filter row / search panel | DataGrid |
| **AI Column streaming** | Células atualizam progressivamente (skeleton → valor) | AI Columns |
| **Smart Paste** | Clipboard → mapeamento de campos do Form | `vx-form` |
| **Deferred selection + AI** | Evita explodir context size em `selectAll` | DataGrid |
| **Offline / self-hosted agents** | Adapter local com acesso a dados do app sem sair da VPC | Enterprise |
| **MVC remoto (opcional)** | Controller no backend valida comandos e devolve *patch* de estado (`JsonPatch` / ops Vortex) para o Model do cliente | Apps regulados |

### 6.10 Critérios de aceite — AI Foundation

- [ ] `ai.enabled` false → zero chrome AI, zero network
- [ ] DataGrid: sparkle abre AI Assistant (Fluent Light **e** LDS)
- [ ] Chips executam filter/sort/group via Command Bus
- [ ] AI Column + Prompt Editor (Regenerate / Apply)
- [ ] Hooks `aiRequestCreating` cancelam/redigem payload
- [ ] Cap de linhas no contexto respeitado
- [ ] Documentação: “como plugar OpenAI / Azure / modelo local”
- [x] Entry `vortex-ui/ai` (`@vortex-ui/ai`) tree-shakeable

---

## 7. Objetivos da Próxima Fase (Prioridade #1)

### 7.1 DataGrid — Virtualização Real (Crítico)

**Problema a resolver:**  
Suportar **milhões de linhas** com performance excelente (scroll fluido, baixo consumo de memória).

#### Requisitos funcionais

1. **Row Virtualization**
   - Renderizar apenas as linhas visíveis + buffer (overscan)
   - Altura de linha configurável (fixa ou variável futura)
   - Scroll suave mesmo com 1M+ registros

2. **Column Virtualization** (fase 1.5)
   - Especialmente importante quando há muitas colunas

3. **Modos de dados**
   - Client-side (array completo em memória)
   - Server-side / Infinite loading (recomendado para milhões de linhas)
   - Interface clara de `DataSource` (load, totalCount, sort, filter)

4. **Features mínimas na v1 de virtualização**
   - Sorting (client e server)
   - Selection (single / multi)
   - Filter row (mínimo)
   - Row click
   - Loading state
   - Empty state
   - Sticky header
   - Frozen columns (left) — desejável
   - Toolbar + slot para `aiAssistantButton`

5. **Performance targets**
   - 60fps no scroll com 1.000.000 de linhas (server-side)
   - Memória estável (não crescer linearmente com o total de dados)
   - Time to first paint < 100ms após dados chegarem

#### Requisitos técnicos

- Usar Signals para estado interno (scroll position, visible range, selection)
- Preferir `IntersectionObserver` ou cálculo manual de range + `transform`/`translateY`
- Evitar `*ngFor` em milhões de itens (nunca renderizar tudo)
- Compatível com zoneless
- API limpa e tipada
- Tokens Fluent Light + LDS validados no Theme Lab

#### Critérios de aceite

- [ ] Consegue renderizar 1.000.000 de linhas via data source server-side com scroll fluido
- [ ] Seleção e sort continuam funcionando
- [ ] Não há memory leak ao fazer scroll longo
- [ ] Header permanece sticky
- [ ] Documentação de como implementar um DataSource customizado
- [ ] Theme Lab: Fluent Light (default) + LDS sem regressão visual

---

### 7.2 Theme Lab no DataGrid (Prioridade #1 acoplada)

- Página `docs` dedicada com switcher de tema
- Dataset rico (imagens thumbnail, currency, badges, dates) para stress de tokens
- Incluir chrome AI (sparkle + dialogs) nos dois temas obrigatórios

---

### 7.3 File Manager — Completar (Prioridade #2)

**Objetivo:** Tornar o componente utilizável em produção (nível DevExtreme FileManager ou superior).

#### Requisitos funcionais

1. **Navegação**
   - Árvore de pastas (sidebar opcional)
   - Breadcrumbs clicáveis
   - Histórico (voltar/avançar) — desejável

2. **Views**
   - Lista (atual)
   - Grid / Thumbnails
   - Detalhes (nome, tamanho, data, tipo)

3. **Operações de arquivo**
   - Upload (drag & drop + botão)
   - Download
   - Renomear (inline ou modal)
   - Excluir (com confirmação)
   - Mover / Copiar (drag & drop entre pastas)
   - Criar pasta

4. **Seleção & Context Menu**
   - Single e multi-select
   - Menu de contexto (botão direito)
   - Ações em lote

5. **AI (opt-in)**
   - Assistant para buscar, filtrar por tipo, sugerir organização, resumir seleção
   - Mesmas regras de §6

6. **Outros**
   - Permissões (read-only, disable actions)
   - Loading states por operação
   - Feedback visual (toasts)
   - Suporte a arquivos grandes (progress de upload)

#### Critérios de aceite

- [ ] Upload funciona (input file + drag & drop)
- [ ] Renomear e excluir funcionam
- [ ] Navegação entre pastas é fluida
- [ ] Context menu básico
- [ ] API documentada para integração com qualquer backend
- [ ] `ai.enabled` opcional com dialog padrão

---

### 7.4 AI Foundation (Prioridade #3, inicia em paralelo leve com Grid)

1. Pacote / entry `vortex-ui/ai` + `VortexAIIntegration` ✅
2. `vx-ai-assistant-dialog` + `vx-ai-prompt-editor` (primitivos reutilizáveis)
3. Primeiro consumer: `vx-data-grid`
4. Capability registry + command bus
5. Demo no Theme Lab (Fluent Light + LDS)

---

## 8. Roadmap de alto nível

### 8.1 Fundação (entregue)

| Fase | Entrega | Status |
|------|---------|--------|
| 0 | Scaffold + Tokens + Theme + Button/Card/DataGrid/FileManager base | ✅ |
| 1 | DataGrid Virtualization + Theme Lab + Server-side DataSource | ✅ |
| 1b | AI Foundation (Integration, Assistant, Prompt Editor, sparkle) | ✅ Base |
| 2 | File Manager (+ AI opt-in) | ✅ Base |
| 3 | Form, Editors, Dialog, Toast, Toolbar, List, Validation | ✅ |
| 4 | Navigation/Layout + Filter Builder + Storybook + entries | ✅ |
| 5 | TreeList, CardView, HTML Editor, Sparklines, Grid editing/group/export | ✅ |
| 6 | Chart / Scheduler / Gantt / Progress (base gallery) | ✅ Base |

### 8.2 Super Suite (programa de expansão → ~80+ Angular)

| Fase | Entrega | Status |
|------|---------|--------|
| **7** | **npm publish** + GitHub + CI visual | 🔄 Pacote `@joel_jsp/vortex-ui@0.1.0` preparado · repo GitHub · publish aguarda OTP 2FA npm · CI visual pendente |
| **8** | Scheduler/Gantt **rich** + Chat | 🔄 **M0/M1 parcial** — Chat M0 ✅ · Scheduler **mês** ✅ · recurrence/resources/drag ainda pendente |
| **9** | Charts **expand** (funnel, polar, sankey, treemap, gauges, bullet) | 🔄 **M0** ✅ na Gallery · aprofundar séries/interação |
| **10** | **PivotGrid** + Field Chooser + engine de agregação | 🔄 **M0** ✅ (soma tabular + chooser) · engine 1M pendente |
| **11** | Diagram + Maps + wrappers M2 | 🔄 **M0** ✅ Diagram/Map/VectorMap · wrappers já existiam |
| **12** | DataGrid/TreeList/CardView **M3** | Planejado |
| **13** | ThemeBuilder + Dark/Material/`system` + i18n | Planejado |
| **14** | Paridade Gallery 80+ auditada + site docs + starter CLI | 🔄 **Catálogo Gallery ~80 superfície M0** em curso · audit formal pendente |

---

## 9. Fora de escopo (por enquanto)

- Embutir / redistribuir **runtime DevExtreme** ou `devextreme-angular` (licença comercial DX ≠ MIT Vortex)
- Ports React / Vue / jQuery do VortexUI (foco Angular-only)
- Temas além de Fluent Light + LDS **até** Fase 13
- Integração obrigatória com Angular Material / CDK (independência; CDK utilitário só se justificado)
- Suporte a Angular < 21
- Treinamento/hospedagem de LLM pela VortexUI (apenas adapters)
- Envio automático de PII sem policy do app
- Clonar assets/CSS proprietários DevExpress

---

## 10. Métricas de sucesso

### 10.1 v1 (fundação — em curso / validar)

- DataGrid 1M+ linhas com boa performance
- Theme Lab: Fluent Light + LDS sem regressão
- File Manager cobre 90% dos casos comuns
- AI Assistant no DataGrid: ≥ 8 comandos estáveis
- Bundle tree-shakable; AI em entry separada
- Zero dependência de Zone.js
- Widgets Gallery operacional em `apps/docs`

### 10.2 v2 Super Suite (meta)

- **≥ 80 componentes** `vx-*` publicados com demo na Gallery (paridade de categorias DX)
- Famílias críticas (Grid, TreeList, Form, Chart, Scheduler, File, AI) em maturidade **M2+**
- PivotGrid processa agregações grandes no client (meta inspirada no engine DX)
- Chat + HTML Editor AI como superfície conversacional de referência
- Visual regression CI cobrindo Grid + 10 widgets canônicos × 2 temas
- Tempo de “add VortexUI to Angular app” < 10 minutos (docs Getting Started)
- Score Lighthouse a11y ≥ meta definida por widget crítico
- Nenhum pacote `devextreme*` nas dependencies de produção

---

## 11. Próximas ações imediatas

1. ~~Publicar npm~~ — **adiada** até ordem explícita  
2. Elevar componentes Super Suite de **M0 → M2** (Chat, Pivot, Charts, Scheduler rich)  
3. Visual regression Playwright (Fluent + LDS) no CI — **sem** publish  
4. Secondary entries estáveis (`vortex-ui/grid`, `charts`, `ai`, …) preparadas para quando houver publish  
5. Audit formal checklist §5.11 vs Gallery  
6. Manter catálogo §5 vivo vs [Widgets Gallery DX](https://js.devexpress.com/Angular/Demos/WidgetsGallery/)

---

## 12. Lacunas abertas (decisões pendentes)

| Tópico | Pergunta | Sugestão default |
|--------|----------|------------------|
| Provider LLM de demo | Qual usar no `docs`? | Adapter mock + OpenAI opcional via env |
| Idioma do Assistant | PT / EN / i18n? | i18n desde o início (PT default no docs BR) |
| AI em *todos* os widgets | Obrigatório na Super Suite? | Capability-ready em todos; sparkle nos data-centric primeiro |
| Visual regression | Playwright screenshots? | Sim, Fluent + LDS; expandir na Fase 7 |
| Nome do tema default | `fluent` vs `fluent-light` | `fluent` + alias `fluent-light` |
| Nome do tema #2 | `lds` vs `lds-gf`? | **`lds`** (fechado) |
| Escopo inicial de temas | Só Fluent + LDS? | **Sim até Fase 13** |
| Poppins no bundle | Self-host vs Google Fonts? | Self-host / `@fontsource/poppins` |
| Modal AI no LDS | 80% ou popover? | Popover default; 80% se `mode: 'modal'` |
| Licença MIT vs dual | Confirmada? | MIT core; exemplos MIT |
| Export XLSX | Dependência opcional? | Peer/optional entry `vortex-ui/export` |
| Map providers | Google/Bing/OSM? | Adapter pluggable; OSM default nos demos |
| Paridade pixel-perfect DX | Obrigatória? | **Não** — paridade de *capacidade*; visual Vortex/Fluent/LDS |

---

## 13. Programa Super Suite — detalhes operacionais

### 13.1 Por que Angular-only multiplica o valor

DevExtreme cobre 4 stacks ([Angular / React / Vue / jQuery](https://js.devexpress.com/)). VortexUI concentra 100% do investimento em:

- Melhor API Signals da categoria  
- SSR / hydration sem surpresas de wrappers JS legados  
- Docs e demos **só** Angular (menor superfície de suporte)  
- Integração natural com ecossistema Nx / Angular CLI / Vitest / Playwright  

### 13.2 Como “reaproveitar” DevExtreme sem risco legal

1. **Ler** docs públicas, demos e issues do [GitHub DevExtreme](https://github.com/DevExpress/DevExtreme) para entender comportamentos esperados.  
2. **Traduzir** para requisitos Vortex (tabelas §5 + ADRs).  
3. **Implementar** do zero em `libs/vortex-ui` com tokens e Signals.  
4. **Validar** na Widgets Gallery Vortex (preview + código + tema).  
5. **Nunca** copiar sources, temas compilados proprietários ou exemplos com copyright restritivo sem revisão legal.

### 13.3 Qualidade “enterprise-ready” por widget (Definition of Done)

- [ ] Standalone + Signals + OnPush + zoneless smoke  
- [ ] Tokens Fluent + LDS (sem hex hardcoded)  
- [ ] Teclado + ARIA mínimos  
- [ ] Demo na Gallery (categoria + ▶ componente + demos)  
- [ ] Snippets `template.html` + `component.ts`  
- [ ] Storybook story (quando aplicável)  
- [ ] Testes unitários das APIs públicas  
- [ ] `ai` capability registrada **ou** documentada como N/A  
- [ ] Entry point / path de import estável  
- [ ] Nota de limitações vs DX (honestidade de paridade)

### 13.4 Organização de engenharia sugerida

| Squad / trilho | Famílias | Fases |
|----------------|----------|-------|
| **Grid Core** | DataGrid, TreeList, CardView, FilterBuilder, DataSource | 12 contínuo |
| **Insight** | Charts, Gauges, Pivot, Diagram | 9–11 |
| **Time** | Scheduler, Gantt | 8 |
| **Content** | HTML Editor, Chat, File | 8 + contínuo |
| **Chrome** | Editors, Nav, Popup, Wrappers, ThemeBuilder | 7, 13 |
| **AI Platform** | Bridge, capabilities, demos | transversal |

### 13.5 North-star de produto

> “Se um time Angular hoje avalia DevExtreme pela completude da suite, a alternativa open/moderna deve ser **VortexUI** — mesmos problemas de negócio resolvidos, API Angular 22 nativa, AI opt-in, sem trial comercial.”

---

**Documento mantido por:** Equipe VortexUI  
**Última atualização:** 13/11/2026 (v2.1 — Super Suite YOLO M0 em massa; **sem** npm publish; paridade superfície [DevExtreme](https://github.com/DevExpress/DevExtreme))
