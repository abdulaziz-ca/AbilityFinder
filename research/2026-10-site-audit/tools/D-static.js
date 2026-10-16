const http=require("http"),fs=require("fs"),path=require("path");
const ROOT=process.argv[2];const T={".html":"text/html; charset=utf-8",".js":"text/javascript",".css":"text/css",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",".woff2":"font/woff2",".xml":"application/xml",".txt":"text/plain",".json":"application/json"};
http.createServer((q,s)=>{let p=decodeURIComponent(new URL(q.url,"http://x").pathname);if(p.endsWith("/"))p+="index.html";const f=path.join(ROOT,p);if(!f.startsWith(ROOT)){s.writeHead(403);return s.end()}
fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);return s.end("nf")}s.writeHead(200,{"Content-Type":T[path.extname(f)]||"application/octet-stream"});s.end(d)})}).listen(Number(process.argv[3]),"127.0.0.1",511,()=>console.log("up"));
