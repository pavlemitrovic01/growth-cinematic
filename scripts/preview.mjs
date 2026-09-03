import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs/promises';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';
import worker from '../dist/server/index.js';
import { securityHeaders } from '../lib/security.js';

// vinext 0.0.50's production asset cache uses Windows backslashes as URL keys.
// Serve the unchanged built assets and Worker locally without patching node_modules.
const client = fileURLToPath(new URL('../dist/client/', import.meta.url));
const types = { '.js':'application/javascript', '.css':'text/css', '.jpg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml', '.woff2':'font/woff2' };
const port=Number(process.env.PORT || 5173);
http.createServer(async (req,res)=>{
  try {
    const url=new URL(req.url, 'http://localhost:'+port);
    const decoded=decodeURIComponent(url.pathname);
    const file=path.resolve(client,'.'+decoded);
    const relative=path.relative(client,file);
    if(!relative.startsWith('..')&&!path.isAbsolute(relative)&&!relative.split(/[\\/]/).some(part=>part.startsWith('.'))&&['GET','HEAD'].includes(req.method)){
      try {
        const stat=await fs.stat(file);
        if(stat.isFile()){
          res.writeHead(200,{...securityHeaders(false,false),'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Length':stat.size});
          res.end(req.method==='HEAD'?undefined:await fs.readFile(file));return;
        }
      } catch {}
    }
    const request=new Request(url,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body:Readable.toWeb(req),duplex:'half'}:{})});
    const response=await worker.fetch(request,{}, {waitUntil(p){void Promise.resolve(p).catch(()=>{})},passThroughOnException(){}});
    res.writeHead(response.status,Object.fromEntries(response.headers));
    if(response.body&&req.method!=='HEAD')Readable.fromWeb(response.body).pipe(res); else res.end();
  } catch {res.writeHead(500);res.end('Preview error');}
}).listen(port,'127.0.0.1',()=>console.log('Local built preview: http://localhost:'+port));
