import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import handler from '../api/rsvp.js';
const root=fileURLToPath(new URL('../public/',import.meta.url));
try{const env=await fs.readFile(new URL('../.env.local',import.meta.url),'utf8');for(const line of env.split('\n')){const match=line.match(/^([A-Z_]+)=(.*)$/);if(match&&!process.env[match[1]])process.env[match[1]]=match[2].trim().replace(/^['"]|['"]$/g,'');}}catch{}
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp','.ttf':'font/ttf','.mp4':'video/mp4'};
http.createServer(async(req,res)=>{
  res.status=code=>{res.statusCode=code;return res;};res.json=data=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(data));};
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/api/rsvp'){
    let body='';try{for await(const chunk of req){body+=chunk;if(body.length>10000){res.status(413).json({error:'Response too large.'});return;}}req.body=body;await handler(req,res);}catch{if(!res.headersSent)res.status(500).json({error:'Unable to process response.'});}return;
  }
  try{const requested=decodeURIComponent(url.pathname);const target=path.resolve(root,'.'+(requested==='/'?'/index.html':requested));if(!target.startsWith(root+path.sep)&&target!==path.join(root,'index.html')){res.statusCode=403;res.end();return;}const data=await fs.readFile(target);res.setHeader('Content-Type',types[path.extname(target)]||'application/octet-stream');res.end(data);}catch{res.statusCode=404;res.end('Not found');}
}).listen(Number(process.env.PORT)||3000,'127.0.0.1',()=>console.log('Wedding invitation: http://localhost:3000'));
