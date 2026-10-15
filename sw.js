const HYBRID_CACHE="zetas-argenmap-hybrid-v1";
const SAT_CACHE="zetas-satellite-v1";
const APP_CACHE="zetas-app-shell-v8-4";
const IGN_BASE="https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mapabase_hibrido@EPSG%3A3857@png/";
const SAT_BASE="https://imagenes.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mosaicos_vuelos@EPSG%3A3857@png/";

self.addEventListener("install",event=>{
  event.waitUntil((async()=>{
    try{
      const c=await caches.open(APP_CACHE);
      await c.addAll(["./","./index.html"]);
    }catch(e){}
    await self.skipWaiting();
  })());
});

self.addEventListener("activate",event=>{
  event.waitUntil((async()=>{
    const keep=new Set([HYBRID_CACHE,SAT_CACHE,APP_CACHE]);
    const names=await caches.keys();
    await Promise.all(names.filter(n=>n.startsWith("zetas-")&&!keep.has(n)).map(n=>caches.delete(n)));
    await self.clients.claim();
  })());
});

function parseRoute(url,marker){
  const i=url.pathname.lastIndexOf(marker);
  if(i<0) return null;
  const rest=url.pathname.slice(i+marker.length);
  const m=rest.match(/^(\d+)\/(\d+)\/(\d+)\.png$/);
  if(!m) return null;
  return {z:Number(m[1]),x:Number(m[2]),y:Number(m[3])};
}

async function cachedTile(request,cacheName,remote){
  const cache=await caches.open(cacheName);
  const cached=await cache.match(request);
  if(cached) return cached;
  try{
    const response=await fetch(remote,{mode:"no-cors",cache:"no-store"});
    await cache.put(request,response.clone());
    return response;
  }catch(e){
    const retry=await cache.match(request);
    if(retry) return retry;
    return new Response("",{status:504,statusText:"Offline tile unavailable"});
  }
}

self.addEventListener("fetch",event=>{
  const url=new URL(event.request.url);
  const hybrid=parseRoute(url,"/__ign_hybrid/");
  if(hybrid){
    const tmsY=(2**hybrid.z)-1-hybrid.y;
    const remote=`${IGN_BASE}${hybrid.z}/${hybrid.x}/${tmsY}.png`;
    event.respondWith(cachedTile(event.request,HYBRID_CACHE,remote));
    return;
  }

  const sat=parseRoute(url,"/__satellite/");
  if(sat){
    const tmsY=(2**sat.z)-1-sat.y;
    const remote=`${SAT_BASE}${sat.z}/${sat.x}/${tmsY}.png`;
    event.respondWith(cachedTile(event.request,SAT_CACHE,remote));
    return;
  }

  if(event.request.mode==="navigate"){
    event.respondWith((async()=>{
      try{
        const net=await fetch(event.request);
        const c=await caches.open(APP_CACHE);
        c.put("./index.html",net.clone()).catch(()=>{});
        return net;
      }catch(e){
        const c=await caches.open(APP_CACHE);
        return (await c.match("./index.html")) || Response.error();
      }
    })());
  }
});
