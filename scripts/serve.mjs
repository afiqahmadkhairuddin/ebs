import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };
http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    // The preview serves only public website files, not source, docs, dependencies or Git.
    if (pathname.split('/').some(segment => segment.startsWith('.')) || /^\/(scripts|tests|docs|node_modules)\b/.test(pathname) || /\.(json|mjs|pdf)$/.test(pathname)) throw new Error('Private file');
    let file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(root + path.sep) && file !== root) throw new Error('Invalid path');
    if ((await stat(file)).isDirectory()) {
      if (!pathname.endsWith('/')) {
        res.writeHead(301, { Location: pathname + '/' + new URL(req.url, 'http://localhost').search });
        res.end();
        return;
      }
      file = path.join(file, 'index.html');
    }
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<!doctype html><html lang="en"><title>Page not found | EBS Resources</title><h1>Page not found</h1><a href="/">Return to EBS Resources</a></html>');
  }
}).listen(4173, '127.0.0.1', () => console.log('EBS preview: http://127.0.0.1:4173'));
