import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs/promises';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';
import { createGzip, gzip as gzipCallback } from 'node:zlib';
import { promisify } from 'node:util';
import worker from '../dist/server/index.js';
import { securityHeaders } from '../lib/security.js';

// Native vinext's asset URL cache uses Windows path separators. This local adapter
// serves the unchanged built Worker and assets with normal HTTP compression.
const client = fileURLToPath(new URL('../dist/client/', import.meta.url));
const types = { '.js':'application/javascript', '.css':'text/css', '.jpg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml', '.woff2':'font/woff2' };
const gzip = promisify(gzipCallback);
const port = Number(process.env.PORT || 5173);
const compressible = (type = '') => type.startsWith('text/') || type.includes('javascript') || type.includes('json') || type.includes('svg');
http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost:' + port);
    const decoded = decodeURIComponent(url.pathname);
    const file = path.resolve(client, '.' + decoded);
    const relative = path.relative(client, file);
    const acceptsGzip = /\bgzip\b/.test(req.headers['accept-encoding'] || '');
    if (!relative.startsWith('..') && !path.isAbsolute(relative) && !relative.split(/[\\/]/).some(part => part.startsWith('.') || part.startsWith('_')) && ['GET','HEAD'].includes(req.method)) {
      try {
        const stat = await fs.stat(file);
        if (stat.isFile()) {
          const type = types[path.extname(file)] || 'application/octet-stream';
          const compressed = acceptsGzip && compressible(type);
          const data = await fs.readFile(file);
          const body = compressed ? await gzip(data) : data;
          res.writeHead(200, { ...securityHeaders(false,false), 'Content-Type':type, 'Content-Length':body.length,
            'Cache-Control':url.pathname.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'public, max-age=3600',
            'Vary':'Accept-Encoding', ...(compressed ? {'Content-Encoding':'gzip'} : {}) });
          res.end(req.method === 'HEAD' ? undefined : body);
          return;
        }
      } catch { /* Let the Worker resolve non-asset routes. */ }
    }
    const request = new Request(url, {method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body:Readable.toWeb(req),duplex:'half'}:{})});
    const response = await worker.fetch(request, {}, {waitUntil(p){void Promise.resolve(p).catch(()=>{})},passThroughOnException(){}});
    const headers = Object.fromEntries(response.headers);
    const compressed = acceptsGzip && response.body && compressible(headers['content-type']) && !headers['content-encoding'];
    if (compressed) {
      headers['content-encoding'] = 'gzip';
      headers.vary = headers.vary ? headers.vary + ', Accept-Encoding' : 'Accept-Encoding';
      delete headers['content-length'];
    }
    res.writeHead(response.status, headers);
    if (response.body && req.method !== 'HEAD') {
      const body = Readable.fromWeb(response.body);
      body.on('error', () => res.destroy());
      if (compressed) body.pipe(createGzip()).on('error', () => res.destroy()).pipe(res);
      else body.pipe(res);
    } else res.end();
  } catch {
    if (!res.headersSent) res.writeHead(500);
    res.end('Preview error');
  }
}).listen(port, '127.0.0.1', () => console.log('Local built preview: http://localhost:' + port));
