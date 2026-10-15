const TILE_CACHE="zetas-argenmap-hybrid-v1";
const APP_CACHE="zetas-app-shell-v6";
const IGN_BASE="https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mapabase_hibrido@EPSG%3A3857@png/";

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
  event.waitUntil(self.clients.claim());
});

function parseHybridRoute(url){
  const marker="/__ign_hybrid/";
  const i=url.pathname.lastIndexOf(marker);
  if(i<0) return null;
  const rest=url.pathname.slice(i+marker.length);
  const m=rest.match(/^(\d+)\/(\d+)\/(\d+)\.png$/);
  if(!m) return null;
  return {z:Number(m[1]),x:Number(m[2]),y:Number(m[3])};
}

async function hybridResponse(request,coord){
  const cache=await caches.open(TILE_CACHE);
  const cached=await cache.match(request);
  if(cached) return cached;

  const tmsY=(2**coord.z)-1-coord.y;
  const remote=`${IGN_BASE}${coord.z}/${coord.x}/${tmsY}.png`;
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
  const coord=parseHybridRoute(url);
  if(coord){
    event.respondWith(hybridResponse(event.request,coord));
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
