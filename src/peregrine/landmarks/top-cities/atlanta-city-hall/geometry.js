import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { ANNEX_RING, HISTORIC_RING, BASE_RING, TOWER_RING } from './footprint.js';
import { parts, localRing } from './atlanta-city-hall-parts.js';

export function create({detail='near'}={}) {
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=parts(b,near);
  const historic=localRing(HISTORIC_RING),base=localRing(BASE_RING),tower=localRing(TOWER_RING),annex=localRing(ANNEX_RING);
  const xs=tower.map(p=>p[0]),zs=tower.map(p=>p[1]);
  const x=(Math.min(...xs)+Math.max(...xs))/2,z=(Math.min(...zs)+Math.max(...zs))/2,w=22.5,d=20.9;
  const signedArea=r=>r.reduce((sum,p,i)=>sum+p[0]*r[(i+1)%r.length][1]-r[(i+1)%r.length][0]*p[1],0);
  // Full mapped six-storey annex includes its rounded Trinity Avenue entrance.
  const ar=signedArea(annex)<0?annex:[...annex].reverse();
  for(let i=0;i<ar.length;i++){
    const p=ar[i],q=ar[(i+1)%ar.length],len=Math.hypot(p[0]-q[0],p[1]-q[1]);
    const shared=Math.max(p[1],q[1])<28&&Math.min(p[1],q[1])>27&&Math.min(p[0],q[0])>-14&&Math.max(p[0],q[0])<4;
    if(!shared)k.wall(p,q,0,19.5,len>3?Math.max(1,Math.round(len/(near?3.2:5.4))):0,near?6:3,{mat:'marble',ww:near?1.8:2.4,wh:near?1.7:2.5});
  }
  k.roof(annex,19.5);
  const hr=signedArea(historic)<0?historic:[...historic].reverse();
  for(let i=0;i<hr.length;i++){
    const p=hr[i],q=hr[(i+1)%hr.length],len=Math.hypot(p[0]-q[0],p[1]-q[1]);
    if(p[1]>27&&q[1]>27)continue;
    const front=p[1]<-17&&q[1]<-17;
    if(front){
      k.wall(p,q,0,10.8,len>18?7:3,1,{ww:2.2,wh:8.4,arch:len>18?'portal':false});
      k.wall(p,q,10.8,14.8,len>18?7:3,1,{ww:1.9,wh:2.6});
    }else k.wall(p,q,0,14.8,len>3?Math.max(1,Math.round(len/(near?3.0:4.4))):0,near?3:2,{ww:1.7,wh:3.2});
  }
  k.roof(base,14.8);
  // White vertical piers frame olive-green spandrel panels between apertures.
  const lower=k.block(x,z,w,d,14.8,49.2,near?9:7,near?9:5,{ww:near?1.5:1.8,wh:near?2.5:3.7,olive:true,lit:true});
  const middle=k.block(x,z,17.2,17.6,49.2,58,near?7:5,2,{ww:1.5,wh:2.75,olive:true,arch:true,lit:true});
  const upper=k.block(x,z,13.4,14.2,58,64,5,1,{ww:1.5,wh:2.9,arch:true,lit:true});
  k.roof(lower,49.2,'stone',[middle]);k.roof(middle,58,'stone',[upper]);k.roof(upper,64,'roof');
  // Shallow green pyramid concealed behind the Gothic tracery parapet.
  k.pyramid(x,z,12.2,13,64,2.25);
  for(const [rw,rd,y,h] of [[w,d,49.2,1],[17.2,17.6,58,1.15],[13.4,14.2,64,1]]){
    const edges=[[x-rw/2,z-rd/2],[x+rw/2,z-rd/2],[x+rw/2,z+rd/2],[x-rw/2,z+rd/2]];
    for(let i=0;i<4;i++){
      const p=edges[i],q=edges[(i+3)%4],len=Math.hypot(p[0]-q[0],p[1]-q[1]);
      k.wall(p,q,y,y+h,near?Math.round(len/1.35):0,1,{ww:.38,wh:.5,arch:true});
    }
    for(const [tx,tz]of edges){
      const top=y===64?66.6:y+h+.7;
      k.box('stone',tx,(y+top-.4)/2,tz,.65,top-.4-y,.65);
      k.pyramid(tx,tz,.65,.65,top-.4,.4,'stone');
    }
  }
  const model=b.finish();
  model.traverse(o=>{if(o.isMesh){const old=o.geometry;o.geometry=mergeVertices(old,1e-4);o.geometry.normalizeNormals();old.dispose();}});
  return model;
}
