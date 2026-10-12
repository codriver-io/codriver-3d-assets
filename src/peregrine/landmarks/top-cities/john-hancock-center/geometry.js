// Original procedural geometry; OSM-derived plan © OpenStreetMap contributors, ODbL 1.0.
import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { halfPlan, facePoint, panel, BRACES, MASTS, world } from './john-hancock-center-parts.js';
export function create({detail='near'}={}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  // Partition the skin into spandrels, mullions and individual panes: no substrate
  // behind the glass, no layered glass/metal cycle, and a real grid in far LOD.
  const rows=near?100:46;
  const hash = seed => { let v=Math.imul(seed^0x9e3779b9,0x85ebca6b);v=Math.imul(v^(v>>>13),0xc2b2ae35);return ((v^(v>>>16))>>>0)/4294967296; };
  for(let f=0;f<4;f++) {
    const bays=near?(f%2?16:26):(f%2?6:9);
    for(let row=0;row<rows;row++) {
      const lo=337*row/rows, hi=337*(row+1)/rows;
      const sill=lo+(row===0?0:near?0.7:1.35), head=hi-0.25;
      if(sill>lo)b.put(panel(f,-1,1,lo,sill),'skin');
      b.put(panel(f,-1,1,head,hi),'skin');
      for(let j=0;j<bays;j++) {
        const s0=-1+2*j/bays,s1=-1+2*(j+1)/bays, gap=near?0.006:0.012;
        b.put(panel(f,s0,s0+gap,sill,head),'skin');
        // One mullion per bay; panes meet the next mullion without overlap.
        const lit=hash(row*92821+j*68917+f*13337)<0.14 && row>2 && row<rows-2;
        b.put(panel(f,s0+gap,s1,sill,head),lit?'glow':'glass');
      }
    }
    b.put(panel(f,-1,1,337,SPEC.roofM),'skin');
    // Named corner supports and primary verticals follow the tapered faces.
    for(const s of [-0.976,-0.5,0,0.5,0.976])
      b.bar('columns',facePoint(f,s,0,0.6),facePoint(f,s,337,0.6),Math.abs(s)>0.9?1.55:0.85,1.4);
  }
  for(const m of BRACES)b.bar('structure',m.a,m.b,1.25,1.1);
  const [rw,rd]=halfPlan(337);
  // Closed roof / parapet and integrated roof plant support the two masts.
  const deck=new THREE.PlaneGeometry(rw*2,rd*2);deck.rotateX(-Math.PI/2);deck.translate(0,SPEC.roofM,0);b.put(deck,'roof');
  for(const m of MASTS) {
    b.box('roof',[m.x,345.2,m.z],[4.0,3.0,4.0]);
    // Contiguous tapered sections (antenna equipment is estimated).
    const ys=[346.7,353.7,400,438,456.9], radii=[1.3,0.7,0.48,0.24,0.12];
    for(let i=0;i<ys.length-1;i++){
      const g=new THREE.CylinderGeometry(radii[i+1],radii[i],ys[i+1]-ys[i],near?8:5,1,false);
      g.translate(m.x,(ys[i+1]+ys[i])/2,m.z);b.put(g,'antenna');
    }
    if(near)for(let y=359;y<436;y+=11) {
      b.box('antenna',[m.x+0.7,y,m.z],[1.5,2.4,0.55]);
      b.box('antenna',[m.x,y,m.z+0.65],[0.55,2.4,1.5]);
    }
  }
  // Entrance roofs meet the main body; only the three mapped attached roofs.
  b.box('columns',[-6.15,4.7,-28.8],[13.8,0.8,5.1]);
  b.box('columns',[-0.2,4.7,28.65],[26.0,0.8,4.9]);
  b.box('columns',[-42.65,4.7,-0.25],[3.2,0.8,30.5]);
  // Ground-bearing lobby piers support the western canopy's exposed edge.
  for(const z of [-14.1,0,14.1])b.box('columns',[-44.0,2.15,z],[0.55,4.3,0.55]);
  const root=b.finish();
  root.traverse(o=>{if(o.isMesh){const pos=o.geometry.attributes.position;for(let i=0;i<pos.count;i++)if(pos.getY(i)<0)pos.setY(i,0);o.geometry.rotateY(SPEC.rotation);o.geometry.deleteAttribute('bridgeLift');o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();}});
  root.userData.memberContacts=BRACES.map(m=>({...m,a:world(m.a),b:world(m.b)}));
  root.userData.elevationDatum='Rigid base on local y=0; placement datum owned by host.';
  return root;
}
