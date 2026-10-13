import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { TIERS, TERRACES, PODIUM, PODIUM_ROOFS, TOPS } from './miami-tower-parts.js';

// All facade materials partition the shell. No backing faces or overlapping overlays.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  function quad(points, mat, normal) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(points.flat(), 3));
    g.setIndex([0,1,2,0,2,3]); g.computeVertexNormals();
    const n = g.attributes.normal;
    if (n.getX(0)*normal[0]+n.getY(0)*normal[1]+n.getZ(0)*normal[2]<0) g.setIndex([0,2,1,0,3,2]);
    g.computeVertexNormals(); b.put(g,mat);
  }
  function cap(ring, y, mat, up = true) {
    const vs = ring.map(([x,z])=>new THREE.Vector2(x,z));
    const tris = THREE.ShapeUtils.triangulateShape(vs, []);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.Float32BufferAttribute(ring.flatMap(([x,z])=>[x,y,z]),3));
    g.setIndex(tris.flat()); g.computeVertexNormals();
    if(g.attributes.normal.getY(0)*(up?1:-1)<0) g.setIndex(tris.flatMap(([a,c,d])=>[a,d,c]));
    g.computeVertexNormals(); b.put(g,mat);
  }
  function shell(ring, lo, hi, garage = false) {
    let area=0;
    for(let i=0;i<ring.length;i++){const a=ring[i],c=ring[(i+1)%ring.length];area+=a[0]*c[1]-c[0]*a[1];}
    for(let i=0;i<ring.length;i++) {
      const a=ring[i],c=ring[(i+1)%ring.length],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);
      if(len<.03)continue;
      const n = area>0?[dz/len,0,-dx/len]:[-dz/len,0,dx/len];
      const at=(s,y)=>[a[0]+dx*s/len,y,a[1]+dz*s/len];
      const panel=(s,t,y,h,m)=>{if(t-s>.005&&h-y>.005)quad([at(s,y),at(t,y),at(t,h),at(s,h)],m,n);};
      const pitch=garage?3.6:3.4, band=garage?.82:1.02;
      const cuts=new Set([lo,hi]);
      for(let y=0;y<hi+pitch;y+=pitch) { if(y>lo&&y<hi)cuts.add(y);if(y+band>lo&&y+band<hi)cuts.add(y+band); }
      if(garage)for(const y of [1,7.2,9,12])if(y>lo&&y<hi)cuts.add(y);
      const ys=[...cuts].sort((a,c)=>a-c);
      for(let j=0;j<ys.length-1;j++) {
        const y=ys[j],h=ys[j+1],mid=(y+h)/2;
        const spandrel=mid%pitch<band;
        if(spandrel) {panel(0,len,y,h,garage?'stone':'light');continue;}
        // Dark glazed arrival spine, blue Knight Center station slot in the south garage face.
        const station=garage&&n[2]>.9&&mid>=9&&mid<=12;
        if(garage&&mid<1){panel(0,len,y,h,'stone');continue;}
        const bayPitch=near?1.8:5.5, bays=Math.max(1,Math.round(len/bayPitch)),w=len/bays;
        for(let k=0;k<bays;k++) {
          const s=k*w,t=(k+1)*w;
          const mat=station?'glow':((k+i)%5===0?'reflection':'glass');
          if(near){panel(s,s+.055,y,h,'mullion');panel(s+.055,t,y,h,mat);}
          else panel(s,t,y,h,mat);
        }
      }
    }
  }
  // One rigid podium outer shell. Exposed garage roofs only; tower and garage share no caps.
  cap(PODIUM,0,'stone',false); shell(PODIUM,0,36,true);
  PODIUM_ROOFS.forEach(r=>cap(r,36,'roof'));
  TIERS.forEach((r,i)=>{shell(r,i?TOPS[i-1]:36,TOPS[i]);cap(i<2?TERRACES[i]:r,TOPS[i],'roof');});
  // Sky terrace pavilion: open-bottom shell, partitioned pale parapet; no stacked caps.
  const pavilion=[[10,17],[22,17],[22,25],[10,25]];
  for(let i=0;i<4;i++) {
    const a=pavilion[i],c=pavilion[(i+1)%4],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),n=[dz/len,0,-dx/len];
    quad([[a[0],36,a[1]],[c[0],36,c[1]],[c[0],40,c[1]],[a[0],40,a[1]]],'glass',n);
    quad([[a[0],40,a[1]],[c[0],40,c[1]],[c[0],40.6,c[1]],[a[0],40.6,a[1]]],'stone',n);
  }
  cap(pavilion,40.6,'roof');
  const root=b.finish();
  root.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift');});
  return root;
}
