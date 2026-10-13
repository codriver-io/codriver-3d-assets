import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { PLANS, TIERS, buffers, crownRods, crownPoint } from './bank-of-america-corporate-center-parts.js';

// Closed, tessellated walls: stone and glass occupy disjoint
// cells rather than layering dark rectangles over a solid stone extrusion.
export function create({detail='near'}={}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail), m=buffers();
  for(let tier=0;tier<TIERS.length;tier++) {
    const ring=PLANS[tier], [bottom,top]=TIERS[tier];
    const area=ring.reduce((s,p,i)=>s+p[0]*ring[(i+1)%ring.length][1]-ring[(i+1)%ring.length][0]*p[1],0);
    for(let e=0;e<ring.length;e++) {
      const a=ring[e],c=ring[(e+1)%ring.length], dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);
      const normal=area>0?[dz/len,0,-dx/len]:[-dz/len,0,dx/len];
      const at=(t,y,inset=0)=>[a[0]+dx*t-normal[0]*inset,y,a[1]+dz*t-normal[2]*inset];
      const face=(mat,t0,t1,y0,y1,inset=0)=>m.quad(mat,at(t0,y0,inset),at(t1,y0,inset),at(t1,y1,inset),at(t0,y1,inset),normal);
      const mat=tier===0?'granite':'stone';
      const bays=Math.max(1,Math.round(len/(near?2.35:5.8)));
      const rowPitch=near?3.85:7.7, rows=Math.max(1,(near?Math.round:Math.ceil)((top-bottom)/rowPitch));
      const ys=tier===0?(near?[0,7.5,12.5,16.2,19.9,23.6,27.3,31,34.7,38.4,42]:[0,7.5,14.4,21.3,28.2,35.1,42]):Array.from({length:rows+1},(_,i)=>bottom+(top-bottom)*i/rows);
      for(let j=0;j<bays;j++) {
        const l=j/bays,r=(j+1)/bays,margin=(tier===0?0.23:0.17)/bays;
        const t0=l+margin,t1=r-margin;
        // One continuous stone pier per bay, window/spandrel grid between piers.
        if(tier===0) {for(const [y0,y1,stone] of [[0,12.5,'granite'],[12.5,top,'stone']]) {face(stone,l,t0,y0,y1);face(stone,t1,r,y0,y1);}} else {face(mat,l,t0,bottom,top);face(mat,t1,r,bottom,top);}
        for(let f=0;f<ys.length-1;f++) {
          const y=ys[f],py=ys[f+1]-y, stone=tier===0&&y<12.5?'granite':'stone', sill=y<1?0.3:0.52;
          const y0=y+sill,y1=y+py-0.16;
          face(stone,t0,t1,y,y0);face(stone,t0,t1,y1,y+py);
          const recess=0; // Flush disjoint facade cells: no layered faces in either LOD.
          const lit=(j*7+f*13+e*3+tier*11)%17<3 && bottom>8;
          face(lit?'glow':'glass',t0,t1,y0,y1,recess);

        }
      }
    }
    // Horizontal setback ledges only outside the next tier; no hidden coplanar roof under it.
    const inner=PLANS[tier+1];
    if(inner) {
      const shape=ring.map(p=>new THREE.Vector2(...p)),hole=inner.map(p=>new THREE.Vector2(...p));
      for(const [i,j,k] of THREE.ShapeUtils.triangulateShape(shape,[hole])) {
        const points=[...ring,...inner];
        const a=points[i],c=points[j],d=points[k];
        m.triangle('roof',[a[0],top,a[1]],[c[0],top,c[1]],[d[0],top,d[1]],[0,1,0]);
      }
    } else m.cap('roof',ring,top);
  }
  // The larger first mapped tier provides the deep granite podium footprint.
  m.finish(b);

  const rods=crownRods(detail), sides=near?5:4;
  for(const rod of rods) {
    const h=rod.top[1]-rod.base[1], tip=1.5;
    const g=new THREE.CylinderGeometry(rod.radius,rod.radius,h-tip,sides,1,true);
    g.translate(rod.base[0],rod.base[1]+(h-tip)/2,rod.base[2]);b.put(g,'light');
    const point=new THREE.ConeGeometry(0.99*rod.radius,tip,sides,1,true);
    point.translate(rod.top[0],rod.top[1]-tip/2,rod.top[2]);b.put(point,'light');
  }
  // Four nested open collar rings, carrying the rods laterally; preserve all in far.
  for(const [r,y] of [[13.15,238],[9.4,247],[5.6,253],[2.55,260]]) {
    const n=near?48:24;
    for(let i=0;i<n;i++) {
      const t=i*2*Math.PI/n+0.12,u=(i+1)*2*Math.PI/n+0.12;
      const p=(a)=>crownPoint(r,a,y);
      b.bar('light',p(t),p(u),near?0.14:0.18);
    }
  }
  const root=b.finish();
  root.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift');});
  root.userData.crownRodCount=rods.length;
  root.userData.elevationDatum=MANIFEST_DATUM;
  return root;
}
const MANIFEST_DATUM='Y=0 local flat-map grade; rigid base, no DEM baked in.';
