/**
 * Generates the optional Fluent full icon pack secondary entry.
 * Source: @fluentui/svg-icons (MIT) — run after npm install.
 *
 *   node scripts/generate-fluent-full-icons.mjs
 */
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const iconsDir = join(root, 'node_modules', '@fluentui', 'svg-icons', 'icons');
const outDir = join(root, 'libs', 'vortex-ui', 'icons', 'fluent-full', 'src', 'generated');

const SIZE_RE = /_(16|20|24)_(regular|filled)\.svg$/;

mkdirSync(outDir, { recursive: true });

/** @type {Map<string, { regular: Record<number, string>, filled: Record<number, string> }>} */
const pack = new Map();

for (const file of readdirSync(iconsDir)) {
  const full = join(iconsDir, file);
  if (!statSync(full).isFile() || !SIZE_RE.test(file)) continue;

  const m = file.match(/^(.+)_(16|20|24)_(regular|filled)\.svg$/);
  if (!m) continue;

  const name = m[1].replace(/_/g, '-');
  const size = Number(m[2]);
  const variant = /** @type {'regular' | 'filled'} */ (m[3]);

  let def = pack.get(name);
  if (!def) {
    def = { regular: {}, filled: {} };
    pack.set(name, def);
  }

  let svg = readFileSync(full, 'utf8').trim();
  svg = svg
    .replace(/\s(width|height)="[^"]*"/g, '')
    .replace(/\sfill="[^"]*"/g, '')
    .replace('<svg ', '<svg fill="currentColor" ');
  def[variant][size] = svg;
}

const names = [...pack.keys()].sort((a, b) => a.localeCompare(b));
/** @type {Map<string, Record<string, unknown>>} */
const chunks = new Map();

for (const name of names) {
  const key = /^[a-z]/.test(name[0]) ? name[0] : 'other';
  if (!chunks.has(key)) chunks.set(key, {});
  chunks.get(key)[name] = pack.get(name);
}

const header = `/**
 * Auto-generated Fluent UI System Icons (full pack).
 * Copyright (c) Microsoft Corporation — MIT License
 * https://github.com/microsoft/fluentui-system-icons
 *
 * DO NOT EDIT — run: node scripts/generate-fluent-full-icons.mjs
 */
`;

const typeImport = `import type { VxIconPack } from '../types';\n\n`;
const chunkFiles = [];

for (const [key, data] of [...chunks.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const fileName = `pack-${key}.ts`;
  const exportName = `FLUENT_FULL_CHUNK_${key.toUpperCase()}`;
  const content = `${header}${typeImport}export const ${exportName}: VxIconPack = ${JSON.stringify(data)};\n`;
  writeFileSync(join(outDir, fileName), content);
  chunkFiles.push({ fileName, exportName });
  console.log(`${fileName}: ${Object.keys(data).length} icons (${(content.length / 1024 / 1024).toFixed(2)} MB)`);
}

const indexBody =
  header +
  chunkFiles.map((c) => `import { ${c.exportName} } from './${c.fileName.replace(/\.ts$/, '')}';`).join('\n') +
  `\n${typeImport}` +
  `export const FLUENT_FULL_ICON_PACK: VxIconPack = {\n` +
  chunkFiles.map((c) => `  ...${c.exportName},`).join('\n') +
  `\n};\n\n` +
  `export const FLUENT_FULL_ICON_NAMES: readonly string[] = Object.freeze(\n` +
  `  Object.keys(FLUENT_FULL_ICON_PACK).sort((a, b) => a.localeCompare(b)),\n` +
  `);\n`;

writeFileSync(join(outDir, 'index.ts'), indexBody);
console.log(`Done: ${names.length} icons in ${chunkFiles.length} chunks → ${outDir}`);
