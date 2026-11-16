# Pesquisa DevExtreme — Data Grids / Data Management

Pacote de web scraping da [Widgets Gallery Angular](https://js.devexpress.com/Angular/Demos/WidgetsGallery/) (tema **FluentBlueLight**) para paridade de superfície no VortexUI.

## Para a IA — ordem de leitura

1. **`PRD-DATA-MANAGEMENT.md`** — PRD / checklist humano+IA (hierarquia PT/EN, URLs, descrições, critérios de aceite).
2. **Storybook ↔ PRD** — convenção de path/tags/status (abaixo) e doc canônica **Data Management/_Docs/Storybook-PRD-Tracking**.
3. **`IMAGE-MANIFEST.json`** — índice `seq → images/NNN-*.png` (mesma ordem do PRD).
4. **`catalog.json`** — árvore + metadados completos (máquina).
5. **`raw/NNN-*.json`** — um arquivo por demo (descrição EN, links de docs/API, URL).
6. **`images/NNN-*.png`** — prévia visual sequencial do **iframe da demo** (widget ao vivo, tema Fluent Blue Light); abrir junto do `seq` correspondente. Descrição textual fica em `raw/` / PRD (não na imagem).

## Componentes cobertos (145 demos)

| seq approx | Widget | Vortex target |
|------------|--------|---------------|
| 001–079 | DataGrid | `vx-data-grid` |
| 080–109 | TreeList | `vx-tree-list` |
| 110–123 | CardView | `vx-card-view` |
| 124–142 | PivotGrid | `vx-pivot-grid` |
| 143–145 | FilterBuilder | `vx-filter-builder` |

## Storybook ↔ PRD (convenção)

- Path de paridade: `Data Management/{Widget}/{NNN}-{Slug}` (`{Widget}` = PascalCase do PRD/DX, não o kebab da pasta).
- CSF: `tags: ['autodocs']` + `component` no `Meta`; citar `docs/research/.../images/NNN-*.png` em `parameters.docs.description` (AC visual interno — **nunca** no npm).
- Status `TODO|M0|M1|M2|M3` só em `PRD-DATA-MANAGEMENT.md` (tick Storybook + bump de maturidade ao landing).
- Doc canônica: `libs/vortex-ui/src/lib/docs/data-management/storybook-prd-tracking.mdx`.

## Regras

- **Não** copiar código DevExtreme / pacotes `devextreme*`.
- Screenshots = referência interna de aceite visual (não publicar no npm).
- Implementação = Signals / Standalone / OnPush / zoneless, temas Fluent + LDS.

## Re-scrape

```bash
cd docs/research/devextreme-data-management
npm install
npx playwright install chromium
node scrape.mjs          # resume (pula imagens já OK)
node scrape.mjs --force  # refaz tudo
```

## Fonte

URL de partida usada no pedido:  
https://js.devexpress.com/Angular/Demos/WidgetsGallery/Demo/TreeList/Overview/FluentBlueLight/
