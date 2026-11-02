import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const targetPath = join(
  process.cwd(),
  'node_modules',
  '@embroider',
  'vite',
  'dist',
  'src',
  'resolver.js'
);

if (existsSync(targetPath)) {
  const original = readFileSync(targetPath, 'utf8');
  const needle = "ensureSymlinkSync(pkg.root, join(tmp, 'node_modules', pkg.name));";
  const replacement = "ensureSymlinkSync(pkg.root, join(tmp, 'node_modules', pkg.name), 'junction');";
  if (original.includes(needle)) {
    writeFileSync(targetPath, original.replace(needle, replacement), 'utf8');
  }
}
