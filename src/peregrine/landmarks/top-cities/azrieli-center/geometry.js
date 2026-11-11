import * as THREE from 'three';
import polygonClipping from 'polygon-clipping';
import { SPEC, PALETTES } from './config.js';
import { LOCAL_RINGS } from './footprint.js';
import { builder } from './azrieli-center-parts.js';
export function create({detail='near'}={}) {
 const {near,b,face,cap,frame,patch,walls,prism,rect,block,spin,cyl,hip,rows,finish}=builder(SPEC,PALETTES,detail);
 // Normalize closed clipping rings before flattening indices; ShapeUtils removes a duplicate closing vertex.
 const openRing=r=>r.length>1&&r[0][0]===r.at(-1)[0]&&r[0][1]===r.at(-1)[1]?r.slice(0,-1):r;
const circle=Array.from({length:near?84:28},(_,j)=>[-.6+21.8*Math.cos(j*2*Math.PI/(near?84:28)),-26.3+21.8*Math.sin(j*2*Math.PI/(near?84:28))]);
 const tower=(r,h,pitch)=>{const step=near?3.65:7.3;walls(r,0,h-8.5,'frame',rows(1,h-8.5,step,step-(near?.42:.7)),pitch,'glass',near?.91:.87);walls(r,h-8.5,h,'frame',[[h-7.7,h-.7]],near?1.6:3.3,'vent',.72);cap('roof',r,h-1);};
 tower(circle,187,999);tower(LOCAL_RINGS[2],169,near?2.6:6);tower(LOCAL_RINGS[3],154,near?2.4:6);
 walls(LOCAL_RINGS[0],0,18.5,'podium',[[1.2,4.8],[8.6,11.7]],near?6:12,'glass',.58);
 const atr=Array.from({length:near?40:24},(_,j)=>[-31.65+13.65*Math.cos(j*2*Math.PI/(near?40:24)),9.8+13.65*Math.sin(j*2*Math.PI/(near?40:24))]);
 const cut=polygonClipping.difference([LOCAL_RINGS[0]],...([circle,LOCAL_RINGS[2],LOCAL_RINGS[3],atr].map(r=>[r])));
 for(const poly of cut){const shape=openRing(poly[0]).map(v=>new THREE.Vector2(...v)),holes=poly.slice(1).map(r=>openRing(r).map(v=>new THREE.Vector2(...v))),all=[...shape,...holes.flat()];for(const t of THREE.ShapeUtils.triangulateShape(shape,holes))face('roof',t.map(j=>[all[j].x,18.5,all[j].y]),[0,1,0]);}
 const profile=[[13.65,18.5],[13.4,19.7],[11.4,21.5],[8.5,23.1],[4.6,24],[0,24.2]];
 spin(profile,'atrium',-31.65,9.8,near?40:24);
 // Subtle white structural ribs are separate radial glass partitions, no logos.

return finish();
}
