import { Component, computed, inject, signal, viewChild } from '@angular/core';
import {
  VxButtonComponent,
  VxCardComponent,
  VxDataGridComponent,
  VxFileManagerComponent,
  VxTextBoxComponent,
  VxCheckboxComponent,
  VxSwitchComponent,
  VxSelectBoxComponent,
  VxDateBoxComponent,
  VxFormComponent,
  VxListComponent,
  VxValidationSummaryComponent,
  VxToastOutletComponent,
  VxToastService,
  VortexThemeService,
  VortexTheme,
  VORTEX_THEMES,
  VORTEX_THEME_LABELS,
  VxFilterState,
  VxTabsComponent,
  VxTabPanelComponent,
  VxDrawerComponent,
  VxTreeViewComponent,
  VxSplitterComponent,
  VxFilterBuilderComponent,
  VxTreeListComponent,
  VxCardViewComponent,
  VxHtmlEditorComponent,
  VxSparklineComponent,
  VxChartComponent,
  VxSchedulerComponent,
  VxGanttComponent,
  VxProgressBarComponent,
  VxChatComponent,
  VxPivotGridComponent,
  VxPivotFieldChooserComponent,
  VxCircularGaugeComponent,
  VxLinearGaugeComponent,
  VxBarGaugeComponent,
  VxBulletComponent,
  VxFunnelComponent,
  VxTreeMapComponent,
  VxSankeyComponent,
  VxDiagramComponent,
  VxMapComponent,
  VxVectorMapComponent,
  VxNumberBoxComponent,
  VxRadioGroupComponent,
  VxSliderComponent,
  VxRangeSliderComponent,
  VxTextAreaComponent,
  VxColorBoxComponent,
  VxTagBoxComponent,
  VxAutocompleteComponent,
  VxLookupComponent,
  VxDateRangeBoxComponent,
  VxButtonGroupComponent,
  VxDropDownButtonComponent,
  VxCalendarComponent,
  VxLoadPanelComponent,
  VxTooltipComponent,
  VxPopoverComponent,
  VxPaginationComponent,
  VxGalleryComponent,
  VxTileViewComponent,
  VxScrollViewComponent,
  VxContextMenuComponent,
  VxFileUploaderComponent,
  VxFieldSetComponent,
  type VxChartType,
  type VxPivotFieldState,
  type VxSchedulerView,
  required,
  email,
  minLength,
  validateAll,
} from 'vortex-ui';
import { VortexMockAIIntegration, VortexAIConfig } from 'vortex-ui/ai';
import { DEFAULT_DEMO_ID, findDemo, GALLERY_CATALOG } from './gallery/catalog';
import type { GalleryComponent } from './gallery/models';
import {
  cardFields,
  cardItems,
  chartData,
  autocompleteItems,
  barGaugeItems,
  buttonGroupItems,
  chatMessages as seedChatMessages,
  contextMenuItems,
  createAppointments,
  demoRows,
  diagramEdges,
  diagramNodes,
  dropDownItems,
  fileItems,
  filterFields,
  funnelVizData,
  galleryItems,
  ganttTasks,
  GRID_COLUMNS,
  listItems,
  lookupItems,
  mapMarkers,
  pivotFields as defaultPivotFields,
  pivotRows,
  radioItems,
  remoteSource,
  sankeyLinks,
  sankeyNodes,
  sparkData,
  tileItems,
  treeItems,
  treeListColumns,
  treeListItems,
  treeMapData,
  vectorRegions,
} from './gallery/demo-data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    VxButtonComponent,
    VxCardComponent,
    VxDataGridComponent,
    VxFileManagerComponent,
    VxTextBoxComponent,
    VxCheckboxComponent,
    VxSwitchComponent,
    VxSelectBoxComponent,
    VxDateBoxComponent,
    VxFormComponent,
    VxListComponent,
    VxValidationSummaryComponent,
    VxToastOutletComponent,
    VxTabsComponent,
    VxTabPanelComponent,
    VxDrawerComponent,
    VxTreeViewComponent,
    VxSplitterComponent,
    VxFilterBuilderComponent,
    VxTreeListComponent,
    VxCardViewComponent,
    VxHtmlEditorComponent,
    VxSparklineComponent,
    VxChartComponent,
    VxSchedulerComponent,
    VxGanttComponent,
    VxProgressBarComponent,
    VxChatComponent,
    VxPivotGridComponent,
    VxPivotFieldChooserComponent,
    VxCircularGaugeComponent,
    VxLinearGaugeComponent,
    VxBarGaugeComponent,
    VxBulletComponent,
    VxFunnelComponent,
    VxTreeMapComponent,
    VxSankeyComponent,
    VxDiagramComponent,
    VxMapComponent,
    VxVectorMapComponent,
    VxNumberBoxComponent,
    VxRadioGroupComponent,
    VxSliderComponent,
    VxRangeSliderComponent,
    VxTextAreaComponent,
    VxColorBoxComponent,
    VxTagBoxComponent,
    VxAutocompleteComponent,
    VxLookupComponent,
    VxDateRangeBoxComponent,
    VxButtonGroupComponent,
    VxDropDownButtonComponent,
    VxCalendarComponent,
    VxLoadPanelComponent,
    VxTooltipComponent,
    VxPopoverComponent,
    VxPaginationComponent,
    VxGalleryComponent,
    VxTileViewComponent,
    VxScrollViewComponent,
    VxContextMenuComponent,
    VxFileUploaderComponent,
    VxFieldSetComponent,
  ],
  template: `
    <vx-toast-outlet />
    <div class="gallery">
      <aside class="gallery__nav" [class.gallery__nav--open]="navOpen()">
        <div class="gallery__brand">
          <img
            class="gallery__logo"
            src="brand/vortexui-lockup-on-dark.svg"
            alt="VortexUI"
            width="200"
            height="53"
          />
          <span>Widgets Gallery</span>
        </div>

        <nav class="gallery__tree" aria-label="Componentes">
          @for (cat of catalog; track cat.id) {
            <div class="gallery__cat" [class.gallery__cat--open]="isCategoryOpen(cat.id)">
              <button
                type="button"
                class="gallery__cat-head"
                (click)="toggleCategory(cat.id)"
                [attr.aria-expanded]="isCategoryOpen(cat.id)"
              >
                <span>{{ cat.title }}</span>
                <span class="gallery__chev" aria-hidden="true"></span>
              </button>

              @if (isCategoryOpen(cat.id)) {
                <ul class="gallery__comp-list">
                  @for (comp of cat.components; track comp.id) {
                    <li class="gallery__comp" [class.gallery__comp--open]="isComponentOpen(comp.id)">
                      <button
                        type="button"
                        class="gallery__comp-head"
                        [class.gallery__comp-head--active]="active()?.component.id === comp.id"
                        (click)="toggleComponent(comp)"
                        [attr.aria-expanded]="isComponentOpen(comp.id)"
                      >
                        <span class="gallery__tri" aria-hidden="true"></span>
                        <span class="gallery__comp-title">{{ comp.title }}</span>
                        @if (comp.badge) {
                          <span class="gallery__badge" [attr.data-badge]="comp.badge">{{ comp.badge }}</span>
                        }
                      </button>

                      @if (isComponentOpen(comp.id)) {
                        <ul class="gallery__demo-list">
                          @for (demo of comp.demos; track demo.id) {
                            <li>
                              <button
                                type="button"
                                class="gallery__demo-link"
                                [class.gallery__demo-link--active]="selectedId() === demo.id"
                                (click)="selectDemo(demo.id)"
                              >
                                <span>{{ demo.title }}</span>
                                @if (demo.badge) {
                                  <span class="gallery__badge" [attr.data-badge]="demo.badge">{{ demo.badge }}</span>
                                }
                              </button>
                            </li>
                          }
                        </ul>
                      }
                    </li>
                  }
                </ul>
              }
            </div>
          }
        </nav>
      </aside>

      <section class="gallery__main">
        <header class="gallery__toolbar">
          <button type="button" class="gallery__icon-btn gallery__nav-toggle" (click)="navOpen.set(!navOpen())" aria-label="Menu">
            ☰
          </button>
          <div class="gallery__crumb">
            <span>{{ active()?.category.title }}</span>
            <span aria-hidden="true">/</span>
            <span>{{ active()?.component.title }}</span>
            <span aria-hidden="true">/</span>
            <strong>{{ active()?.demo.title }}</strong>
          </div>
          <div class="gallery__themes" role="group" aria-label="Tema">
            @for (t of themes; track t) {
              <button
                type="button"
                class="gallery__theme-btn"
                [class.gallery__theme-btn--active]="theme() === t"
                (click)="setTheme(t)"
              >
                {{ themeLabel(t) }}
              </button>
            }
          </div>
          <button
            type="button"
            class="gallery__icon-btn"
            [class.gallery__icon-btn--active]="codeOpen()"
            (click)="codeOpen.set(!codeOpen())"
            aria-label="Código"
            title="Mostrar/ocultar código"
          >
            {{ '{' }}{{ '}' }}
          </button>
        </header>

        <div class="gallery__workspace" [class.gallery__workspace--code-hidden]="!codeOpen()">
          <div class="gallery__preview-wrap">
            <div class="gallery__preview-meta">
              <h1>{{ active()?.demo.title }}</h1>
              <p>{{ active()?.demo.description }}</p>
            </div>
            <div class="gallery__preview" [attr.data-demo]="selectedId()">
              @switch (selectedId()) {
                @case ('grid-overview') {
                  <vx-data-grid [columns]="columns" [data]="rows" [rowHeight]="36" />
                }
                @case ('grid-remote') {
                  <vx-data-grid
                    [columns]="columns"
                    [dataSource]="remoteSource"
                    [rowHeight]="36"
                    [overscan]="10"
                  />
                }
                @case ('grid-ai') {
                  <vx-data-grid
                    [columns]="columns"
                    [data]="rows"
                    [rowHeight]="36"
                    [ai]="aiConfig"
                    [aiIntegration]="aiIntegration"
                  />
                }
                @case ('grid-editing') {
                  <vx-data-grid
                    #grid
                    [columns]="columns"
                    [data]="rows"
                    [rowHeight]="36"
                    [editable]="true"
                    [exportEnabled]="true"
                    (cellEdit)="onCellEdit($event)"
                  />
                }
                @case ('file-manager') {
                  <vx-file-manager [items]="files()" [ai]="aiConfig" [aiIntegration]="aiIntegration" />
                }
                @case ('tree-list') {
                  <vx-tree-list
                    [items]="treeListItems"
                    [columns]="treeListColumns"
                    [(expandedIds)]="treeListExpanded"
                  />
                }
                @case ('card-view') {
                  <vx-card-view [items]="cardItems" [fields]="cardFields" [(selectedIds)]="cardSelected" />
                }
                @case ('filter-builder') {
                  <div class="gallery__stack">
                    <vx-filter-builder [fields]="filterFields" (applyFilter)="onFilterApply($event)" />
                    <vx-data-grid #grid [columns]="columns" [data]="rows" [rowHeight]="36" />
                  </div>
                }
                @case ('button') {
                  <div class="gallery__row">
                    <vx-button>Confirmar</vx-button>
                    <vx-button variant="secondary">Secundário</vx-button>
                    <vx-button variant="outline">Outline</vx-button>
                    <vx-button variant="ghost">Ghost</vx-button>
                    <vx-button variant="danger">Danger</vx-button>
                  </div>
                }
                @case ('form') {
                  <vx-card title="Cadastro" subtitle="Validation + editors">
                    <vx-validation-summary [errors]="formErrorList()" />
                    <vx-form (submitted)="onFormSubmit()">
                      <vx-text-box label="Nome" [(value)]="formName" [invalid]="!!formErrors()['name']" />
                      <vx-text-box label="E-mail" type="email" [(value)]="formEmail" [invalid]="!!formErrors()['email']" />
                      <vx-select-box label="Setor" [items]="sectors" [(value)]="formSector" />
                      <vx-date-box label="Data" [(value)]="formDate" />
                      <vx-checkbox label="Aceito os termos" [(checked)]="formTerms" />
                      <vx-switch label="Alertas" [(checked)]="formAlerts" />
                      <div vx-form-actions class="gallery__row">
                        <vx-button type="submit">Salvar</vx-button>
                      </div>
                    </vx-form>
                  </vx-card>
                }
                @case ('list') {
                  <vx-list [items]="listItems" [searchable]="true" [multiSelect]="true" [(selectedIds)]="listSelected" />
                }
                @case ('tabs') {
                  <vx-tabs [(selected)]="tabsSelected">
                    <vx-tab-panel tabId="a" label="Geral">Conteúdo da aba Geral no tema {{ themeLabel(theme()) }}.</vx-tab-panel>
                    <vx-tab-panel tabId="b" label="Tokens">Design tokens Fluent Light e LDS.</vx-tab-panel>
                    <vx-tab-panel tabId="c" label="AI" [disabled]="true">Off</vx-tab-panel>
                  </vx-tabs>
                }
                @case ('drawer') {
                  <div class="gallery__drawer-host">
                    <vx-drawer [(open)]="drawerOpen" title="Navegação" mode="overlay" width="240px">
                      <vx-tree-view [items]="treeItems" [(expandedIds)]="treeExpanded" />
                      <div vx-drawer-content>
                        <vx-button size="sm" (click)="drawerOpen.set(!drawerOpen())">
                          {{ drawerOpen() ? 'Fechar' : 'Abrir' }} drawer
                        </vx-button>
                      </div>
                    </vx-drawer>
                  </div>
                }
                @case ('splitter') {
                  <vx-splitter class="gallery__splitter" [(ratio)]="splitRatio">
                    <div vx-splitter-pane-1>Painel A</div>
                    <div vx-splitter-pane-2>Painel B · ratio {{ splitRatio() }}%</div>
                  </vx-splitter>
                }
                @case ('chart') {
                  <div class="gallery__stack">
                    <div class="gallery__row">
                      @for (t of chartTypes; track t) {
                        <vx-button size="sm" [variant]="chartType() === t ? 'primary' : 'outline'" (click)="chartType.set(t)">{{ t }}</vx-button>
                      }
                    </div>
                    <vx-chart [type]="chartType()" title="Vendas por região" [data]="chartData" [width]="560" [height]="280" />
                  </div>
                }
                @case ('sparkline') {
                  <div class="gallery__row">
                    <vx-sparkline [data]="sparkData" [width]="180" [height]="40" />
                    <vx-progress-bar [value]="72" label="Meta" />
                  </div>
                }
                @case ('scheduler') {
                  <vx-scheduler [appointments]="appointments" [(view)]="schedulerView" />
                }
                @case ('gantt') {
                  <vx-gantt [tasks]="ganttTasks" />
                }
                @case ('html-editor') {
                  <vx-html-editor [(value)]="htmlValue" [ai]="aiConfig" [aiIntegration]="aiIntegration" />
                }
                @case ('chat') {
                  <vx-chat class="gallery__chat" [messages]="chatMessages()" (messageSent)="onChatSend($event)" />
                }
                @case ('pivot-grid') {
                  <div class="gallery__stack">
                    <vx-pivot-field-chooser [fieldState]="pivotFields()" (fieldChange)="pivotFields.set($event)" />
                    <vx-pivot-grid [data]="pivotRows" [fields]="pivotFields()" />
                  </div>
                }
                @case ('pivot-field-chooser') {
                  <vx-pivot-field-chooser [fieldState]="pivotFields()" (fieldChange)="pivotFields.set($event)" />
                }
                @case ('circular-gauge') {
                  <vx-circular-gauge [value]="gaugeValue()" [max]="100" />
                }
                @case ('linear-gauge') {
                  <vx-linear-gauge [value]="gaugeValue()" [max]="100" />
                }
                @case ('bar-gauge') {
                  <vx-bar-gauge [items]="barGaugeItems" [max]="100" />
                }
                @case ('bullet') {
                  <vx-bullet [value]="72" [target]="80" [good]="85" />
                }
                @case ('funnel-viz') {
                  <vx-funnel [data]="funnelVizData" [width]="400" [height]="260" />
                }
                @case ('tree-map') {
                  <vx-tree-map [data]="treeMapData" [width]="480" [height]="280" />
                }
                @case ('sankey') {
                  <vx-sankey [nodes]="sankeyNodes" [links]="sankeyLinks" [width]="480" [height]="280" />
                }
                @case ('diagram') {
                  <vx-diagram [nodes]="diagramNodes" [edges]="diagramEdges" />
                }
                @case ('map') {
                  <vx-map [markers]="mapMarkers" (markerClick)="onMapMarker($event)" />
                }
                @case ('vector-map') {
                  <vx-vector-map [regions]="vectorRegions" [selected]="vectorSelected()" (regionClick)="vectorSelected.set($event.id)" />
                }
                @case ('number-box') {
                  <vx-number-box label="Quantidade" [(value)]="numberValue" [min]="0" [max]="100" />
                }
                @case ('radio-group') {
                  <vx-radio-group label="Setor" [items]="radioItems" [(value)]="radioValue" />
                }
                @case ('slider') {
                  <vx-slider label="Volume" [(value)]="sliderValue" [showValue]="true" />
                }
                @case ('range-slider') {
                  <vx-range-slider label="Faixa de valor" [(start)]="rangeStart" [(end)]="rangeEnd" />
                }
                @case ('text-area') {
                  <vx-text-area label="Observações" [(value)]="textAreaValue" [rows]="4" />
                }
                @case ('color-box') {
                  <vx-color-box label="Cor de destaque" [(value)]="colorValue" />
                }
                @case ('tag-box') {
                  <vx-tag-box label="Tags" [(value)]="tagValues" />
                }
                @case ('autocomplete') {
                  <vx-autocomplete label="Produto" [items]="autocompleteItems" [(value)]="autocompleteValue" />
                }
                @case ('lookup') {
                  <vx-lookup label="Produto" [items]="lookupItems" [(value)]="lookupValue" />
                }
                @case ('date-range-box') {
                  <vx-date-range-box label="Período" [(start)]="dateRangeStart" [(end)]="dateRangeEnd" />
                }
                @case ('button-group') {
                  <vx-button-group [items]="buttonGroupItems" [(value)]="buttonGroupValue" />
                }
                @case ('drop-down-button') {
                  <vx-drop-down-button [items]="dropDownItems" (itemClick)="onDropDown($event)" />
                }
                @case ('calendar') {
                  <vx-calendar [(selected)]="calendarDay" [(viewDate)]="calendarMonth" />
                }
                @case ('field-set') {
                  <vx-field-set legend="Contato">
                    <vx-text-box label="Nome" [(value)]="fieldSetName" />
                    <vx-text-box label="E-mail" type="email" [(value)]="fieldSetEmail" />
                  </vx-field-set>
                }
                @case ('file-uploader') {
                  <vx-file-uploader [multiple]="true" (filesSelected)="onFilesSelected($event)" />
                }
                @case ('gallery') {
                  <vx-gallery [items]="galleryItems" [(selectedId)]="gallerySelected" />
                }
                @case ('tile-view') {
                  <vx-tile-view [items]="tileItems" (tileClick)="onTile($event)" />
                }
                @case ('scroll-view') {
                  <vx-scroll-view [maxHeight]="220">
                    <p>Conteúdo rolável da galeria VortexUI.</p>
                    @for (i of scrollLines; track i) {
                      <p>Linha {{ i }} — tokens Fluent e LDS aplicados automaticamente.</p>
                    }
                  </vx-scroll-view>
                }
                @case ('pagination') {
                  <vx-pagination [totalItems]="120" [pageSize]="10" [(page)]="pageIndex" />
                }
                @case ('load-panel') {
                  <div class="gallery__load-host">
                    <vx-button size="sm" (click)="loadVisible.set(!loadVisible())">{{ loadVisible() ? 'Ocultar' : 'Mostrar' }} painel</vx-button>
                    <vx-load-panel [visible]="loadVisible()" message="Carregando tema…" />
                  </div>
                }
                @case ('tooltip') {
                  <vx-tooltip text="Tooltip com tokens do tema">
                    <vx-button size="sm" variant="outline">Passe o mouse</vx-button>
                  </vx-tooltip>
                }
                @case ('popover') {
                  <vx-popover title="Design tokens" [(open)]="popoverOpen">
                    <span vxPopoverTrigger>Fluent Light e LDS</span>
                    Os tokens CSS definem cores, tipografia e espaçamento da galeria.
                  </vx-popover>
                }
                @case ('context-menu') {
                  <vx-context-menu [items]="contextMenuItems" [(open)]="ctxOpen" [(x)]="ctxX" [(y)]="ctxY" (itemClick)="onCtx($event)">
                    <div class="gallery__ctx-host" tabindex="0">Clique direito nesta área</div>
                  </vx-context-menu>
                }
                @default {
                  <p class="gallery__empty">Selecione um demo na navegação.</p>
                }
              }
            </div>
          </div>

          @if (codeOpen()) {
            <aside class="gallery__code">
              <div class="gallery__code-tabs" role="tablist">
                <button
                  type="button"
                  role="tab"
                  [class.gallery__code-tab--active]="codeTab() === 'html'"
                  (click)="codeTab.set('html')"
                >
                  template.html
                </button>
                <button
                  type="button"
                  role="tab"
                  [class.gallery__code-tab--active]="codeTab() === 'ts'"
                  (click)="codeTab.set('ts')"
                >
                  component.ts
                </button>
                <button type="button" class="gallery__copy" (click)="copyCode()">Copiar</button>
              </div>
              <pre class="gallery__code-pre"><code>{{ activeCode() }}</code></pre>
            </aside>
          }
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
        overflow: hidden;
      }

      .gallery {
        display: grid;
        grid-template-columns: 280px minmax(0, 1fr);
        height: 100%;
        background: var(--vx-color-bg, #f3f2f1);
        color: var(--vx-color-text);
        font-family: var(--vx-font-sans);
      }

      .gallery__nav {
        display: flex;
        flex-direction: column;
        border-right: 1px solid #2b2b2b;
        background: #1f1f1f;
        color: #f3f2f1;
        min-height: 0;
      }

      .gallery__brand {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        padding: 1rem 1rem 0.85rem;
        background: transparent;
        border-bottom: 1px solid #2b2b2b;
      }

      .gallery__logo {
        display: block;
        width: 100%;
        max-width: 200px;
        height: auto;
        object-fit: contain;
        object-position: left center;
      }

      .gallery__brand span {
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: #a19f9d;
        padding-left: 0.2rem;
      }

      .gallery__tree {
        flex: 1;
        overflow: auto;
        padding: 0.25rem 0 1rem;
      }

      .gallery__cat {
        border-bottom: 1px solid #2b2b2b;
      }

      .gallery__cat-head {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        border: none;
        background: transparent;
        color: #fff;
        font: inherit;
        font-size: 0.95rem;
        font-weight: 600;
        text-align: left;
        padding: 0.85rem 1rem;
        cursor: pointer;
      }

      .gallery__cat-head:hover {
        background: #292929;
      }

      .gallery__chev {
        width: 0.45rem;
        height: 0.45rem;
        border-right: 2px solid #3b82f6;
        border-bottom: 2px solid #3b82f6;
        transform: rotate(45deg);
        transition: transform 0.15s ease;
        flex-shrink: 0;
        margin-top: -0.15rem;
      }

      .gallery__cat--open > .gallery__cat-head .gallery__chev {
        transform: rotate(-135deg);
        margin-top: 0.2rem;
      }

      .gallery__comp-list,
      .gallery__demo-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .gallery__comp-head {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 0.55rem;
        border: 1px solid transparent;
        background: transparent;
        color: #f3f2f1;
        font: inherit;
        font-size: 0.9rem;
        text-align: left;
        padding: 0.55rem 1rem 0.55rem 1.15rem;
        cursor: pointer;
      }

      .gallery__comp-head:hover {
        background: #2a2a2a;
      }

      .gallery__comp-head--active {
        border-color: #3b82f6;
        background: #252525;
      }

      .gallery__tri {
        width: 0;
        height: 0;
        border-top: 0.28rem solid transparent;
        border-bottom: 0.28rem solid transparent;
        border-left: 0.4rem solid #f3f2f1;
        flex-shrink: 0;
        transition: transform 0.15s ease;
      }

      .gallery__comp--open > .gallery__comp-head .gallery__tri {
        transform: rotate(90deg);
      }

      .gallery__comp-title {
        flex: 1;
        min-width: 0;
      }

      .gallery__demo-list {
        padding: 0 0 0.35rem;
      }

      .gallery__demo-link {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        border: 1px solid transparent;
        background: transparent;
        color: #d2d0ce;
        text-align: left;
        padding: 0.45rem 1rem 0.45rem 2.35rem;
        font: inherit;
        font-size: 0.84rem;
        cursor: pointer;
      }

      .gallery__demo-link:hover {
        background: #2a2a2a;
        color: #fff;
      }

      .gallery__demo-link--active {
        border-color: #3b82f6;
        background: #252525;
        color: #fff;
        font-weight: 600;
      }

      .gallery__badge {
        font-size: 0.65rem;
        font-weight: 700;
        padding: 0.12rem 0.4rem;
        border-radius: 999px;
        background: #13a10e;
        color: #fff;
        flex-shrink: 0;
      }

      .gallery__badge[data-badge='AI'] {
        background: #0f6cbd;
      }

      .gallery__badge[data-badge='New'] {
        background: #8764b8;
      }

      .gallery__badge[data-badge='Upd'] {
        background: #13a10e;
      }

      .gallery__main {
        display: flex;
        flex-direction: column;
        min-width: 0;
        min-height: 0;
      }

      .gallery__toolbar {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.65rem 1rem;
        border-bottom: 1px solid var(--vx-color-border);
        background: var(--vx-color-surface);
        flex-shrink: 0;
      }

      .gallery__crumb {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.85rem;
        color: var(--vx-color-text-secondary);
        min-width: 0;
        flex: 1;
      }

      .gallery__crumb strong {
        color: var(--vx-color-text);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .gallery__themes {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 0.35rem;
        max-width: min(42rem, 100%);
      }

      .gallery__theme-btn {
        white-space: nowrap;
      }

      .gallery__theme-btn,
      .gallery__icon-btn,
      .gallery__copy,
      .gallery__code-tabs button {
        border: 1px solid var(--vx-color-border);
        background: var(--vx-color-bg-elevated);
        color: var(--vx-color-text);
        border-radius: var(--vx-radius-md);
        font: inherit;
        font-size: 0.8rem;
        cursor: pointer;
        padding: 0.35rem 0.65rem;
      }

      .gallery__theme-btn--active,
      .gallery__icon-btn--active {
        background: var(--vx-color-primary);
        border-color: var(--vx-color-primary);
        color: var(--vx-color-primary-text);
      }

      .gallery__icon-btn {
        min-width: 2.1rem;
      }

      .gallery__nav-toggle {
        display: none;
      }

      .gallery__workspace {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(280px, 380px);
        flex: 1;
        min-height: 0;
      }

      .gallery__workspace--code-hidden {
        grid-template-columns: 1fr;
      }

      .gallery__preview-wrap {
        display: flex;
        flex-direction: column;
        min-height: 0;
        padding: 1rem 1.25rem 1.25rem;
        overflow: auto;
      }

      .gallery__preview-meta h1 {
        margin: 0;
        font-size: 1.35rem;
      }

      .gallery__preview-meta p {
        margin: 0.35rem 0 1rem;
        color: var(--vx-color-text-secondary);
        font-size: 0.9rem;
      }

      .gallery__preview {
        flex: 1;
        min-height: 420px;
        background: var(--vx-color-surface);
        border: 1px solid var(--vx-color-border);
        border-radius: var(--vx-radius-lg);
        padding: 1rem;
        box-shadow: var(--vx-shadow-sm);
        overflow: auto;
      }

      .gallery__preview[data-demo^='grid'],
      .gallery__preview[data-demo='file-manager'],
      .gallery__preview[data-demo='tree-list'],
      .gallery__preview[data-demo='scheduler'],
      .gallery__preview[data-demo='gantt'],
      .gallery__preview[data-demo='drawer'],
      .gallery__preview[data-demo='splitter'],
      .gallery__preview[data-demo='filter-builder'],
      .gallery__preview[data-demo='pivot-grid'],
      .gallery__preview[data-demo='chat'] {
        display: flex;
        flex-direction: column;
        height: calc(100vh - 180px);
        min-height: 480px;
      }

      .gallery__chat {
        flex: 1;
        min-height: 320px;
        display: block;
        height: 100%;
      }

      .gallery__load-host {
        position: relative;
        min-height: 140px;
        padding: 1rem;
        border: 1px solid var(--vx-color-border);
        border-radius: var(--vx-radius-md);
      }

      .gallery__ctx-host {
        padding: 2.5rem;
        border: 1px dashed var(--vx-color-border);
        border-radius: var(--vx-radius-md);
        text-align: center;
        color: var(--vx-color-text-secondary);
        user-select: none;
      }

      .gallery__preview vx-data-grid,
      .gallery__preview vx-file-manager,
      .gallery__preview vx-tree-list,
      .gallery__preview vx-scheduler,
      .gallery__preview vx-gantt,
      .gallery__preview vx-card-view,
      .gallery__preview vx-list,
      .gallery__preview .gallery__splitter,
      .gallery__preview .gallery__drawer-host,
      .gallery__preview .gallery__stack {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .gallery__preview vx-data-grid,
      .gallery__preview vx-file-manager,
      .gallery__preview vx-tree-list,
      .gallery__preview vx-scheduler,
      .gallery__preview vx-gantt,
      .gallery__preview vx-card-view,
      .gallery__preview vx-list {
        display: block;
        height: 100%;
      }

      .gallery__stack {
        gap: 1rem;
      }

      .gallery__row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        align-items: center;
      }

      .gallery__drawer-host {
        border: 1px solid var(--vx-color-border);
        border-radius: var(--vx-radius-md);
        overflow: hidden;
      }

      .gallery__splitter {
        height: 100%;
      }

      .gallery__empty {
        color: var(--vx-color-text-secondary);
      }

      .gallery__code {
        display: flex;
        flex-direction: column;
        border-left: 1px solid var(--vx-color-border);
        background: #1b1a19;
        color: #f3f2f1;
        min-height: 0;
      }

      .gallery__code-tabs {
        display: flex;
        gap: 0.35rem;
        padding: 0.55rem 0.65rem;
        border-bottom: 1px solid #3b3a39;
        flex-shrink: 0;
      }

      .gallery__code-tabs button {
        background: transparent;
        border-color: transparent;
        color: #c8c6c4;
      }

      .gallery__code-tab--active {
        background: #292827 !important;
        color: #fff !important;
      }

      .gallery__copy {
        margin-left: auto;
        background: #292827 !important;
        border-color: #3b3a39 !important;
        color: #fff !important;
      }

      .gallery__code-pre {
        margin: 0;
        padding: 1rem;
        overflow: auto;
        flex: 1;
        font-family: var(--vx-font-mono, ui-monospace, monospace);
        font-size: 0.78rem;
        line-height: 1.55;
        white-space: pre-wrap;
        word-break: break-word;
      }

      @media (max-width: 1100px) {
        .gallery {
          grid-template-columns: 1fr;
        }

        .gallery__nav {
          position: fixed;
          inset: 0 auto 0 0;
          width: min(300px, 88vw);
          z-index: 20;
          transform: translateX(-105%);
          transition: transform var(--vx-transition-normal);
          box-shadow: var(--vx-shadow-xl);
        }

        .gallery__nav--open {
          transform: translateX(0);
        }

        .gallery__nav-toggle {
          display: inline-flex;
        }

        .gallery__workspace {
          grid-template-columns: 1fr;
        }

        .gallery__code {
          border-left: none;
          border-top: 1px solid #3b3a39;
          min-height: 240px;
        }
      }
    `,
  ],
})
export class AppComponent {
  private readonly themeService = inject(VortexThemeService);
  private readonly toast = inject(VxToastService);
  private readonly grid = viewChild<VxDataGridComponent>('grid');

  readonly catalog = GALLERY_CATALOG;
  readonly themes = VORTEX_THEMES;
  readonly theme = this.themeService.theme;

  readonly selectedId = signal(DEFAULT_DEMO_ID);
  readonly codeOpen = signal(true);
  readonly codeTab = signal<'html' | 'ts'>('html');
  readonly navOpen = signal(false);
  readonly openCategories = signal<Set<string>>(new Set(['ai', 'grids']));
  readonly openComponents = signal<Set<string>>(new Set(['data-grid']));

  readonly columns = GRID_COLUMNS;
  readonly rows = demoRows;
  readonly remoteSource = remoteSource;
  readonly listItems = listItems;
  readonly filterFields = filterFields;
  readonly treeListItems = treeListItems;
  readonly treeListColumns = treeListColumns;
  readonly cardItems = cardItems;
  readonly cardFields = cardFields;
  readonly chartData = chartData;
  readonly sparkData = sparkData;
  readonly treeItems = treeItems;
  readonly ganttTasks = ganttTasks;
  readonly appointments = createAppointments();
  readonly sectors = ['Saúde', 'Telecom', 'Seguros', 'Varejo'];

  readonly aiConfig: VortexAIConfig = {
    enabled: true,
    assistant: { enabled: true, title: 'AI Assistant' },
    contextFields: ['id', 'product', 'region', 'sector', 'saleAmount'],
    maxRowsInContext: 50,
  };
  readonly aiIntegration = new VortexMockAIIntegration();

  readonly files = signal(fileItems);
  readonly treeListExpanded = signal(['org', 'eng']);
  readonly cardSelected = signal<string[]>([]);
  readonly listSelected = signal<string[]>([]);
  readonly tabsSelected = signal('a');
  readonly drawerOpen = signal(false);
  readonly treeExpanded = signal(['root']);
  readonly splitRatio = signal(40);
  readonly chartTypes: VxChartType[] = ['bar', 'line', 'area', 'pie', 'funnel', 'polar'];
  readonly chartType = signal<VxChartType>('bar');
  readonly schedulerView = signal<VxSchedulerView>('month');
  readonly chatMessages = signal([...seedChatMessages]);
  readonly pivotFields = signal<VxPivotFieldState>({ ...defaultPivotFields });
  readonly gaugeValue = signal(72);
  readonly vectorSelected = signal('br');
  readonly numberValue = signal(12);
  readonly radioValue = signal('Telecom');
  readonly sliderValue = signal(45);
  readonly rangeStart = signal(20);
  readonly rangeEnd = signal(80);
  readonly textAreaValue = signal('Notas do Theme Lab.');
  readonly colorValue = signal('#0f6cbd');
  readonly tagValues = signal<string[]>(['fluent', 'lds']);
  readonly autocompleteValue = signal('SolarMax');
  readonly lookupValue = signal('2');
  readonly dateRangeStart = signal('2026-01-01');
  readonly dateRangeEnd = signal('2026-03-31');
  readonly buttonGroupValue = signal('Lista');
  readonly calendarDay = signal('');
  readonly calendarMonth = signal(new Date());
  readonly fieldSetName = signal('');
  readonly fieldSetEmail = signal('');
  readonly gallerySelected = signal('g1');
  readonly pageIndex = signal(1);
  readonly loadVisible = signal(false);
  readonly popoverOpen = signal(false);
  readonly ctxOpen = signal(false);
  readonly ctxX = signal(0);
  readonly ctxY = signal(0);
  readonly scrollLines = Array.from({ length: 12 }, (_, i) => i + 1);
  readonly pivotRows = pivotRows;
  readonly funnelVizData = funnelVizData;
  readonly treeMapData = treeMapData;
  readonly sankeyNodes = sankeyNodes;
  readonly sankeyLinks = sankeyLinks;
  readonly diagramNodes = diagramNodes;
  readonly diagramEdges = diagramEdges;
  readonly mapMarkers = mapMarkers;
  readonly vectorRegions = vectorRegions;
  readonly barGaugeItems = barGaugeItems;
  readonly galleryItems = galleryItems;
  readonly tileItems = tileItems;
  readonly lookupItems = lookupItems;
  readonly autocompleteItems = autocompleteItems;
  readonly buttonGroupItems = buttonGroupItems;
  readonly dropDownItems = dropDownItems;
  readonly radioItems = radioItems;
  readonly contextMenuItems = contextMenuItems;
  readonly htmlValue = signal('<p>Escreva e use <b>✦ AI</b> para reescrever.</p>');

  readonly formName = signal('');
  readonly formEmail = signal('');
  readonly formSector = signal('');
  readonly formDate = signal('');
  readonly formTerms = signal(false);
  readonly formAlerts = signal(true);
  readonly formErrors = signal<Record<string, string>>({});
  readonly formErrorList = computed(() => Object.values(this.formErrors()));

  readonly active = computed(() => findDemo(this.selectedId()));
  readonly activeCode = computed(() => {
    const demo = this.active()?.demo;
    if (!demo) return '';
    return this.codeTab() === 'html' ? demo.code.html : demo.code.ts;
  });

  themeLabel(theme: VortexTheme): string {
    return VORTEX_THEME_LABELS[theme] ?? theme;
  }

  setTheme(theme: VortexTheme): void {
    this.themeService.setTheme(theme);
  }

  selectDemo(id: string): void {
    this.selectedId.set(id);
    this.navOpen.set(false);
    const found = findDemo(id);
    if (found) {
      const cats = new Set(this.openCategories());
      cats.add(found.category.id);
      this.openCategories.set(cats);
      const comps = new Set(this.openComponents());
      comps.add(found.component.id);
      this.openComponents.set(comps);
    }
  }

  isCategoryOpen(id: string): boolean {
    return this.openCategories().has(id);
  }

  toggleCategory(id: string): void {
    const next = new Set(this.openCategories());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this.openCategories.set(next);
  }

  isComponentOpen(id: string): boolean {
    return this.openComponents().has(id);
  }

  toggleComponent(comp: GalleryComponent): void {
    const next = new Set(this.openComponents());
    if (next.has(comp.id)) {
      next.delete(comp.id);
      this.openComponents.set(next);
      return;
    }
    next.add(comp.id);
    this.openComponents.set(next);
    if (comp.demos.length === 1) {
      this.selectDemo(comp.demos[0].id);
    }
  }

  async copyCode(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.activeCode());
      this.toast.success('Código copiado.');
    } catch {
      this.toast.danger('Não foi possível copiar.');
    }
  }

  onCellEdit(e: { field: string; value: unknown }): void {
    this.toast.info(`Editado ${e.field} → ${e.value}`);
  }

  onFilterApply(filter: VxFilterState | null): void {
    this.grid()?.setFilter(filter);
    this.toast.info(filter ? `Filtro: ${filter.field} = ${filter.value}` : 'Filtro limpo');
  }

  onChatSend(text: string): void {
    const id = `m${Date.now()}`;
    this.chatMessages.update((msgs) => [...msgs, { id, author: 'Você', text, mine: true }]);
    this.toast.success('Mensagem enviada.');
  }

  onMapMarker(marker: { label?: string }): void {
    this.toast.info(marker.label ?? 'Marcador');
  }

  onDropDown(action: string): void {
    this.toast.info(action);
  }

  onFilesSelected(files: FileList): void {
    this.toast.success(`${files.length} arquivo(s) selecionado(s).`);
  }

  onTile(tile: { title: string }): void {
    this.toast.info(tile.title);
  }

  onCtx(item: { label: string }): void {
    this.toast.info(item.label);
  }

  onFormSubmit(): void {
    const errors = validateAll({
      name: { value: this.formName(), validators: [required(), minLength(3)] },
      email: { value: this.formEmail(), validators: [required(), email()] },
      sector: { value: this.formSector(), validators: [required('Selecione o setor')] },
      terms: {
        value: this.formTerms(),
        validators: [required('Aceite os termos.')],
      },
    });
    this.formErrors.set(errors);
    if (Object.keys(errors).length) {
      this.toast.danger('Corrija os erros do formulário.');
      return;
    }
    this.toast.success('Cadastro salvo.');
  }
}
