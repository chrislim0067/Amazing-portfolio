/**
 * Strips auto-bootstrap from the legacy Svelte runtime bundle so React can
 * control mounting. Keeps Svelte exports required by App3D-f554a111.js.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const targets = [
  path.join(root, 'src/legacy/index-2eb69c09.js'),
  path.join(root, 'public/assets/index-2eb69c09.js'),
];

const marker = 'const ut=document.createElement("style");ut.textContent=pt;document.head.append(ut);';

for (const runtimePath of targets) {
  let source;
  try {
    source = readFileSync(runtimePath, 'utf8');
  } catch {
    continue;
  }

  if (!source.includes(marker)) {
    console.log('Runtime already patched:', runtimePath);
    continue;
  }

  const patched = source.replace(
    /const ut=document\.createElement\("style"\);ut\.textContent=pt;document\.head\.append\(ut\);const X=.*?\)\(\);/s,
    '',
  );

  if (patched === source || !patched.includes('export{Ft as S,')) {
    console.error('Patch failed for', runtimePath);
    process.exit(1);
  }

  writeFileSync(runtimePath, patched, 'utf8');
  console.log('Patched', runtimePath);
}
