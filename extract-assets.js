const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(
  path.join(__dirname, 'assets', 'App3D-f554a111.js'),
  'utf8'
);

const staticAssets = new Set();
for (const re of [
  /le\.load\(["']([^"']+)["']/g,
  /zt\.load\(["']([^"']+)["']/g,
  /zt\.batched\(["']([^"']+)["']/g,
]) {
  let m;
  while ((m = re.exec(content)) !== null) staticAssets.add(m[1]);
}

const audio = [...content.matchAll(/url:"([^"]+\.ogg)"/g)].map((m) => m[1]);
const objs = [
  ...content.matchAll(/obj:"([^"]+)"/g),
  ...content.matchAll(/innerobject:"([^"]+)"/g),
].map((m) => m[1]);
const vdbs = [...content.matchAll(/vdb:"([^"]+)"/g)].map((m) => m[1]);
const cubeObjs = [...content.matchAll(/obj:"(cube\d+)"/g)].map((m) => m[1]);

const dynamic = new Set();
for (const obj of [...new Set(objs)]) {
  if (obj.endsWith('.drc') || obj.endsWith('.ktx2')) continue;
  dynamic.add(`${obj}.drc`);
  dynamic.add(`${obj}_dark_color.ktx2`);
  dynamic.add(`cubes/${obj}_roughness.ktx2`);
  dynamic.add(`cubes/${obj}_normal.ktx2`);
  dynamic.add(`cubes/${obj}_color.ktx2`);
}
for (const cube of cubeObjs) {
  dynamic.add(`cubes/${cube}_roughness.ktx2`);
  dynamic.add(`cubes/${cube}_normal.ktx2`);
}
for (const name of ['shattered_ring', 'shattered_ring2']) {
  dynamic.add(`${name}_color.ktx2`);
  dynamic.add(`${name}_ao.ktx2`);
}
for (const vdb of [...new Set(vdbs)]) {
  dynamic.add(`volumes/${vdb}.ktx2`);
}

const all = new Set([...staticAssets, ...dynamic, ...audio]);
const result = {
  geometries: [],
  images: [],
  fonts: [],
  audio: [],
  root: [],
};

for (const asset of [...all].sort()) {
  if (asset.endsWith('.drc')) result.geometries.push(asset);
  else if (asset.startsWith('../fonts/') || asset.startsWith('fonts/'))
    result.fonts.push(asset.replace('../fonts/', ''));
  else if (asset.endsWith('.ogg')) result.audio.push(asset);
  else if (
    asset.endsWith('.ktx2') ||
    asset.endsWith('.png') ||
    asset.endsWith('.exr') ||
    asset.endsWith('.jpg')
  )
    result.images.push(asset);
  else result.root.push(asset);
}

fs.writeFileSync(path.join(__dirname, 'asset-manifest.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
console.log('TOTAL:', all.size);
