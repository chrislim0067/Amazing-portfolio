const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE = 'https://www.igloo.inc';
const ROOT = __dirname;

const manifest = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'asset-manifest.json'), 'utf8')
);

const downloads = [
  { url: `${BASE}/index.html`, dest: 'index.html' },
  { url: `${BASE}/assets/index-2eb69c09.js`, dest: 'assets/index-2eb69c09.js' },
  { url: `${BASE}/assets/App3D-f554a111.js`, dest: 'assets/App3D-f554a111.js' },
  { url: `${BASE}/assets/favicon32-af94112f.png`, dest: 'assets/favicon32-af94112f.png' },
  { url: `${BASE}/assets/favicon16-9e4401be.png`, dest: 'assets/favicon16-9e4401be.png' },
  { url: `${BASE}/assets/IBMPlexMono-Medium-897c8c30.woff2`, dest: 'assets/IBMPlexMono-Medium-897c8c30.woff2' },
  { url: `${BASE}/assets/IBMPlexMono-Medium-1e253194.woff`, dest: 'assets/IBMPlexMono-Medium-1e253194.woff' },
  { url: `${BASE}/assets/IBMPlexMono-Regular-d3034935.woff2`, dest: 'assets/IBMPlexMono-Regular-d3034935.woff2' },
  { url: `${BASE}/assets/IBMPlexMono-Regular-419d45f6.woff`, dest: 'assets/IBMPlexMono-Regular-419d45f6.woff' },
  { url: `${BASE}/assets/audioworker-036a09db.js`, dest: 'assets/audioworker-036a09db.js' },
  { url: `${BASE}/assets/msdfworker-ac346fa7.js`, dest: 'assets/msdfworker-ac346fa7.js' },
  { url: `${BASE}/assets/bitmapworker-046527f8.js`, dest: 'assets/bitmapworker-046527f8.js' },
  { url: `${BASE}/assets/exrworker-41cbee65.js`, dest: 'assets/exrworker-41cbee65.js' },
  { url: `${BASE}/assets/fonts/IBMPlexMono-Medium.json`, dest: 'assets/fonts/IBMPlexMono-Medium.json' },
  { url: `${BASE}/assets/libs/draco/draco_decoder.wasm`, dest: 'assets/libs/draco/draco_decoder.wasm' },
  { url: `${BASE}/assets/libs/draco/draco_wasm_wrapper.js`, dest: 'assets/libs/draco/draco_wasm_wrapper.js' },
  { url: `${BASE}/assets/libs/draco/draco_decoder.js`, dest: 'assets/libs/draco/draco_decoder.js' },
  { url: `${BASE}/assets/libs/basis/basis_transcoder.wasm`, dest: 'assets/libs/basis/basis_transcoder.wasm' },
  { url: `${BASE}/assets/libs/basis/basis_transcoder.js`, dest: 'assets/libs/basis/basis_transcoder.js' },
  { url: `${BASE}/assets/geometries/cubes/cube1.drc`, dest: 'assets/geometries/cubes/cube1.drc' },
  { url: `${BASE}/assets/geometries/cubes/cube2.drc`, dest: 'assets/geometries/cubes/cube2.drc' },
  { url: `${BASE}/assets/geometries/cubes/cube3.drc`, dest: 'assets/geometries/cubes/cube3.drc' },
  { url: `${BASE}/assets/geometries/igloo.drc`, dest: 'assets/geometries/igloo.drc' },
];

for (const file of manifest.geometries) {
  downloads.push({
    url: `${BASE}/assets/geometries/${file}`,
    dest: `assets/geometries/${file}`,
  });
}
for (const file of manifest.images) {
  downloads.push({
    url: `${BASE}/assets/images/${file}`,
    dest: `assets/images/${file}`,
  });
}
for (const file of manifest.fonts) {
  downloads.push({
    url: `${BASE}/assets/fonts/${file}`,
    dest: `assets/fonts/${file}`,
  });
}
for (const file of manifest.audio) {
  downloads.push({
    url: `${BASE}/assets/audio/${file}`,
    dest: `assets/audio/${file}`,
  });
}

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          fetch(new URL(res.headers.location, url).href).then(resolve).catch(reject);
          return;
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () =>
          resolve({
            status: res.statusCode,
            type: res.headers['content-type'] || '',
            body: Buffer.concat(chunks),
          })
        );
      })
      .on('error', reject);
  });
}

async function downloadOne({ url, dest }) {
  const out = path.join(ROOT, dest);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  if (fs.existsSync(out) && fs.statSync(out).size > 0) {
    return { dest, status: 'skipped' };
  }
  const res = await fetch(url);
  if (res.status !== 200 || res.type.includes('text/html')) {
    return { dest, status: 'failed', code: res.status, type: res.type };
  }
  fs.writeFileSync(out, res.body);
  return { dest, status: 'ok', size: res.body.length };
}

(async () => {
  const results = [];
  for (const item of downloads) {
    const result = await downloadOne(item);
    results.push(result);
    const mark = result.status === 'ok' ? 'OK' : result.status === 'skipped' ? 'SKIP' : 'FAIL';
    console.log(`${mark} ${result.dest}${result.size ? ` (${result.size})` : ''}`);
  }
  const failed = results.filter((r) => r.status === 'failed');
  const ok = results.filter((r) => r.status === 'ok');
  console.log(`\nDone: ${ok.length} downloaded, ${failed.length} failed, ${results.length} total`);
  if (failed.length) {
    console.log('\nFailed files:');
    failed.forEach((f) => console.log(` - ${f.dest} (${f.code}, ${f.type})`));
    process.exitCode = 1;
  }
})();
