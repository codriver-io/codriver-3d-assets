import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC,PALETTES } from './config.js';
import { FOOTPRINTS,PARTS } from './footprint.js';
import { local,partsKit } from './plant-hall-tampa-parts.js';
export const MINARETS=[[-8.35,-74.9,22.9],[17.7,-74.55,22.9],[9.65,-21.05,24.8],[9.2,22.95,24.8],[-10.35,76.5,22.9],[16.1,76.65,22.9]];
export const CUPOLAS=[[-5,-68,20.4],[1,-33,20.4],[0,37,20.4],[-5,67,20.4]];
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),p=partsKit(b,near);
 const outlines=new Map(PARTS.map(e=>[e.id,e.ring.map(local)]));
 // Articulated three main wings with lowered return roofs, all following mapped rings.
 const masses=[[1110635637,18.8],[1110635643,18.8],[1110635642,22.1],[1110635638,16.7],[1110635640,16.7],[1110635641,16.7],[1110635644,16.7],[1110635645,16.7],[1110635646,16.7]];
 for(const [id,h] of masses){const ring=outlines.get(id);p.poly('brick',ring,0,h);p.poly('roof',ring,h+.015,.24);
  // Own every exposed edge; inset the back of each pane, leaving coarse separate bays in far.
  let area=0;for(let i=1;i<ring.length;i++)area+=ring[i-1][0]*ring[i][1]-ring[i][0]*ring[i-1][1];
  for(let i=1;i<ring.length;i++){const [a,c]=[ring[i-1],ring[i]],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);if(len<4)continue;const nx=(area>0?1:-1)*dz/len,nz=(area>0?-1:1)*dx/len,ang=Math.atan2(nx,nz),n=Math.max(1,Math.floor(len/(near?3.3:6.2)));
   for(let j=0;j<n;j++)for(let row=0;row<4;row++){const y=1.15+row*4.45;if(y+2.8>h-.5)continue;const t=(j+.5)/n;p.window(a[0]+dx*t,a[1]+dz*t,y,1.1,2.65,ang,(row+j)%9===0);}
   if(near||len>10)for(const y of [4.25,8.75,13.2,h-.55]){const g=new THREE.PlaneGeometry(len,.19);g.rotateY(ang);g.translate((a[0]+c[0])/2+nx*.32,y,(a[1]+c[1])/2+nz*.32);p.put(g,'trim');}
  }
 }
 // Six cylindrical masonry minarets: corbel collar, silver skirt, open lantern, onion and moon.
 for(const [x,z,base] of MINARETS){const r=base>24?3.45:2.9;p.cyl('brick',x,z,0,base,r,r,near?24:12);
  for(const y of (near?[4.4,8.8,13.2,17.6,base-1.0]:[8.8,17.6,base-1.0]))p.cyl('trim',x,z,y,.20,r+.12,r+.12,near?24:12);
  const n=8;for(let i=0;i<n;i++){const a=i*2*Math.PI/n;for(const y of [1.2,5.7,10.2,14.7])p.window(x+(r+.025)*Math.sin(a),z+(r+.025)*Math.cos(a),y,.95,2.7,a);}
  p.cyl('trim',x,z,base,.38,r+.34,r+.44);const skirt=base+.38;
  p.lathe('silver',x,z,[[r+.44,skirt],[r+.75,skirt+.5],[r+.76,skirt+1.0],[r+.4,skirt+1.8],[r*.72,skirt+4.3],[1.18,skirt+7.2]]);
  p.cyl('trim',x,z,skirt+7.2,.24,1.43,1.43);
  for(let i=0;i<(near?8:6);i++){const a=i*2*Math.PI/(near?8:6);p.cyl('trim',x+1.03*Math.sin(a),z+1.03*Math.cos(a),skirt+7.44,2.65,.13,.13,near?6:4);}
  p.cyl('trim',x,z,skirt+10.09,.22,1.43,1.43);
  p.lathe('silver',x,z,[[0,skirt+10.31],[1.05,skirt+10.31],[1.65,skirt+10.8],[1.66,skirt+11.25],[1.34,skirt+11.9],[.55,skirt+12.9],[.08,skirt+13.55],[0,skirt+13.55]]);
  p.cyl('silver',x,z,skirt+13.55,2.55,.055,.055,6);p.crescent(x,z,skirt+16.1,.42,Math.PI/2);
  if(near){for(let i=0;i<12;i++){const a=i*Math.PI/6,from=[x+(r+.8)*Math.sin(a),skirt+1,z+(r+.8)*Math.cos(a)],to=[x+1.21*Math.sin(a),skirt+7.17,z+1.21*Math.cos(a)];b.bar('silver',from,to,.055);}
   for(let i=0;i<4;i++){const a=i*Math.PI/2;p.window(x+(r+.83)*Math.sin(a),z+(r+.83)*Math.cos(a),skirt+2.3,.48,.7,a);}}
 }
 // The east continuous veranda is genuinely open below its roof, with horseshoe bays.
 const veranda=outlines.get(1110635639);p.poly('roof',veranda,7.7,.25);
 for(let z=-53;z<57;z+=near?3.6:5.5){const x=19.1-z*.011;p.box('trim',x,0,z,.23,7.7,.23);if(near){p.box('trim',x,6.7,z,.55,.2,.55);p.shape('trim',p.horse(3.1,2.1,.1),x,5.45,z+1.8,Math.PI/2,.17);}}
 // West porte-cochere: two low domes flank a broad central crown and a pierced arcade.
 const porch=outlines.get(1110635647);p.poly('roof',porch,10.6,.28);
 for(const z of [-25,-18,-10,10,18,25]){const x=Math.abs(z)<8?-17.2:-26.0;p.box('trim',x,0,z,.55,10.6,.55);}
 for(const z of [-24,-16,12,20])p.shape('trim',p.horse(5.4,4.6,.27),-26,5.95,z, -Math.PI/2,.3);
 for(const z of [-4.8,4.8])p.box('trim',-17.65,0,z,.62,10.6,.62);
 p.shape('trim',p.horse(9,8.2,.45),-17.65,2.4,0,-Math.PI/2,.45);
 for(const [x,z,r,base,rise] of [[-16.85,-16.85,3.6,10.88,4.4],[-17.2,18.3,3.6,10.88,4.4],[-12.5,.1,4.9,10.88,5.6]]){
  p.cyl('trim',x,z,base,.25,r,r);p.lathe('silver',x,z,[[0,base+.25],[r,base+.25],[r*1.12,base+.8],[r*.95,base+1.5],[r*.58,base+rise-1.7],[r*.30,base+rise],[0,base+rise]]);
  p.cyl('trim',x,z,base+rise,1.2,r*.30,r*.30,near?16:8);p.lathe('silver',x,z,[[0,base+rise+1.2],[r*.43,base+rise+1.2],[r*.48,base+rise+1.6],[r*.25,base+rise+2.4],[0,base+rise+3.2]]);p.cyl('silver',x,z,base+rise+3.2,.9,.05,.05,6);
 }
 // Four small angular rooftop cupolas, contrasting with the six circular minarets.
 for(const [x,z,y] of CUPOLAS){p.box('brick',x,18.8,z,4.2,y-18.8,4.2);p.cyl('trim',x,z,y,.28,3.05,3.05,4);p.lathe('silver',x,z,[[0,y+.28],[2.5,y+.28],[2.4,y+1.4],[1.5,y+2.6],[.35,y+5.2],[0,y+5.8]]);p.cyl('silver',x,z,y+5.8,1.4,.06,.06,5);p.crescent(x,z,y+7.55,.35);}
 // Thin parapet outlines and chimney blocks maintain the flat stepped hotel roofline.
 for(const [x,z] of [[-5,-52],[5,-40],[-2,50],[3,61],[0,-5],[0,8]])p.box('brick',x,Math.abs(z)<15?22.355:19.055,z,1.4,1.8,1.3);
 const model=b.finish();model.traverse(o=>{if(!o.isMesh)return;o.geometry.deleteAttribute('bridgeLift');const g=o.geometry;o.geometry=mergeVertices(g,1e-6);g.dispose();});return model;
}
