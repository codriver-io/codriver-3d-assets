import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { BASE_RING, COURTS } from './footprint.js';
import { kit, localRing } from './los-angeles-city-hall-kit.js';

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const k = kit(b, near), outer = localRing(BASE_RING), courts = COURTS.map(localRing);
  const shape = new THREE.Shape(outer.map(([x,z]) => new THREE.Vector2(x,-z)));
  for (const ring of courts) shape.holes.push(new THREE.Path(ring.map(([x,z]) => new THREE.Vector2(x,-z))));
  const roof = new THREE.ShapeGeometry(shape); roof.rotateX(-Math.PI/2); roof.translate(0,20,0); k.put(roof,'stone');
  // Preserve all five mapped light courts instead of filling the base with a box.
  function walls(ring, inner = false) {
    const area = ring.reduce((sum,[x,z],i) => { const c=ring[(i+1)%ring.length]; return sum+x*c[1]-c[0]*z; },0);
    const points = (area < 0) !== inner ? ring : [...ring].reverse();
    for (let i=0;i<points.length;i++) {
      const a=points[i], c=points[(i+1)%points.length], dx=c[0]-a[0], dz=c[1]-a[1], w=Math.hypot(dx,dz);
      const right=[dx/w,dz/w], normal=[-dz/w,dx/w];
      // exterior fronts have tall arched ground-floor apertures; courts are quieter grids.
      const arch = !inner && Math.abs((a[0]+c[0])/2)>35 && Math.abs((a[1]+c[1])/2)<14 && w>8;
      k.facade([(a[0]+c[0])/2,(a[1]+c[1])/2],right,normal,w,0,20,
        w>3 ? Math.max(1,Math.floor(w/(near?3.4:5.8))) : 0, arch?1:(near?3:2), arch?3.1:1.5,arch?11:2.6,'glass',arch);
    }
  }
  walls(outer); courts.forEach(r=>walls(r,true));

  // Ten-storey central spine with long wings; terracotta roofs behind a pale cornice.
  for (const sign of [-1,1]) {
    const z0 = sign>0?16:-50, z1 = sign>0?50:-16;
    k.block(-9.3,9.7,z0,z1,20,42.5,near?10:5,near?6:2,near?1.55:2,near?2.3:3,false);
    k.loft('roof',0.2,(z0+z1)/2,19, z1-z0,43.1,2,z1-z0-3,46.5);
    k.box('stone',0.2,42.8,(z0+z1)/2,19.4,0.6,z1-z0);
    for (const x of [-9.5,9.9]) k.box('stone',x,41.8,(z0+z1)/2,0.5,0.6,z1-z0);
  }
  // Main tower: one exterior cross-shaped shell, no duplicated hidden facades.
  const cross=[[-10.1,-15.6],[-10.1,-10.1],[-15.6,-10.1],[-15.6,10.1],[-10.1,10.1],[-10.1,15.6],[10.1,15.6],[10.1,10.1],[15.6,10.1],[15.6,-10.1],[10.1,-10.1],[10.1,-15.6]];
  for(let i=0;i<cross.length;i++) {
    const a=cross[i],c=cross[(i+1)%cross.length],dx=c[0]-a[0],dz=c[1]-a[1],w=Math.hypot(dx,dz);
    k.facade([(a[0]+c[0])/2,(a[1]+c[1])/2],[dx/w,dz/w],[-dz/w,dx/w],w,20,98.5,
      w>10?(near?6:5):0,near?22:9,near?1.45:1.75,near?2.15:2.8);
  }
  const shoulder=new THREE.Shape(cross.map(([x,z])=>new THREE.Vector2(x,-z)));
  const shoulderRoof=new THREE.ShapeGeometry(shoulder); shoulderRoof.rotateX(-Math.PI/2); shoulderRoof.translate(0,98.5,0);k.put(shoulderRoof,'stone');
  k.block(-10.1,10.1,-10.1,10.1,98.5,110,near?6:5,near?3:2,1.45,2.15);
  for (const side of [-1,1]) {
    const a=side>0?10.1:-15.6,c=side>0?15.6:-10.1;
    // Buttress tips above the plain shoulder become four shallow vertical fins.
    for (const z of [-8.8,8.8]) k.box('stone',(a+c)/2,104.25,z,c-a,11.5,2.6);
  }
  // Observation level, six narrow slots per face between substantial piers.
  k.box('stone',0,110.6,0,21.1,1.2,21.1);
  k.block(-9.1,9.1,-9.1,9.1,111.2,113,near?6:5,1,1.3,0.85);
  // Inset illuminated back panels are within the open column ring.
  for (const s of [-1,1]) {
    k.facade([s*9,0],[0,-s],[s,0],18,113,120.4,6,1,1.5,6.6,'light');
    k.facade([0,s*9],[s,0],[0,s],18,113,120.4,6,1,1.5,6.6,'light');
    for (let i=0;i<7;i++) {
      const q=-9.65+i*19.3/6;
      k.box('stone',s*9.8,115.8,q,1.0,9.2,0.8);
      k.box('stone',q,115.8,s*9.8,0.8,9.2,1.0);
    }
  }
  k.box('stone',0,121.0,0,21.3,1.2,21.3);
  k.loft('stone',0,0,21.3,21.3,121.6,15,15,124.0);
  k.block(-7.5,7.5,-7.5,7.5,124,127.4,near?7:5,1,1.0,1.6);
  // Mausoleum-inspired stepped pyramid, 11 m high; each course supports the next.
  const n=near?13:9;
  for(let i=0;i<n;i++) {
    const y0=127.4+11*i/n,y1=127.4+11*(i+1)/n;
    const w=15*(1-i/n), next=Math.max(0.2,15*(1-(i+1)/n));
    k.loft('stone',0,0,w,w,y0,w,w,y0+(y1-y0)*0.22);
    k.loft('stone',0,0,w,w,y0+(y1-y0)*0.22,next,next,y1);
  }
  const model=b.finish();
  model.traverse(o=>{ if(o.isMesh){ const old=o.geometry;o.geometry=mergeVertices(old,1e-4);old.dispose(); }});
  return model;
}
