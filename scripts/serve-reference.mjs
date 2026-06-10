import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ktx2': 'application/octet-stream',
  '.drc': 'application/octet-stream',
  '.exr': 'application/octet-stream',
  '.ogg': 'audio/ogg',
  '.wasm': 'application/wasm',
};

const port = Number(process.env.REFERENCE_PORT ?? 34568);

createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', `http://${req.headers.host}`);
    let filePath;

    if (url.pathname === '/' || url.pathname === '/index.html') {
      filePath = path.join(root, 'reference/index.html');
    } else if (url.pathname.startsWith('/assets/')) {
      filePath = path.join(root, 'public', url.pathname);
    } else {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const data = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] ?? 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(port, () => {
  console.log(`Reference build: http://localhost:${port}`);
});
