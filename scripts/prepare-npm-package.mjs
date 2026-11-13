import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist/libs/vortex-ui');
const pkgPath = join(dist, 'package.json');

if (!existsSync(pkgPath)) {
  console.error('dist/libs/vortex-ui/package.json não encontrado. Rode o build antes.');
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

// Nome unscoped `vortex-ui` já existe no npm público → publicamos scoped.
pkg.name = '@joel_jsp/vortex-ui';
pkg.version = pkg.version || '0.1.0';
pkg.license = 'MIT';
pkg.description =
  pkg.description ||
  'VortexUI — Angular 22+ component suite (Signals, zoneless, AI opt-in, Fluent + LDS themes)';
pkg.repository = {
  type: 'git',
  url: 'git+https://github.com/JoelSchecheleski/vortex-ui.git',
};
pkg.homepage = 'https://github.com/JoelSchecheleski/vortex-ui#readme';
pkg.bugs = { url: 'https://github.com/JoelSchecheleski/vortex-ui/issues' };
pkg.publishConfig = {
  access: process.env.NPM_ACCESS || 'restricted',
  registry: 'https://registry.npmjs.org/',
};

pkg.exports = {
  ...(pkg.exports || {}),
  './package.json': { default: './package.json' },
  './styles/vortex-ui.css': {
    default: './src/lib/styles/vortex-ui.css',
  },
  './styles/*': {
    default: './src/lib/styles/*',
  },
};

writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

const rootLicense = join(process.cwd(), 'LICENSE');
if (existsSync(rootLicense)) {
  copyFileSync(rootLicense, join(dist, 'LICENSE'));
}

console.log(`Prepared ${pkg.name}@${pkg.version} (access=${pkg.publishConfig.access})`);
