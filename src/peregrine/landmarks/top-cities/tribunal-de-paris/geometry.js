import * as THREE from'three';import{assetBuilder}from'../../asset-geometry.js';import{SPEC,PALETTES}from'./config.js';import{FOOTPRINTS}from'./footprint.js';import{local,simplify,surfaces}from'./tribunal-de-paris-parts.js';
const a=26.45*Math.PI/180,C=Math.cos(a),S=Math.sin(a);export const point=(u,v)=>[u*C+v*S,-u*S+v*C];
const rect=(u0,u1,v0,v1)=>[[u0,v0],[u1,v0],[u1,v1],[u0,v1]].map(p=>point(...p));
export const BLOCKS=[{bottom:34,top:84,end:85},{bottom:88,top:124,end:40},{bottom:128,top:160,end:1}].map(x=>({...x,ring:rect(5,47,-79,x.end)}));
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),s=surfaces(b);
 s.shell(simplify(local(FOOTPRINTS[0],SPEC.origin),.4),30,{pitch:near?4.2:8.4,bay:near?3:6,band:.25,mullion:.12});
 for(const x of BLOCKS){const neck=rect(7,45,-77,x.end-2);s.shell(neck,x.bottom,{bottom:x.bottom-4,pitch:4,bay:near?3:6,glass:'shade',band:.14,mullion:.1});s.shell(x.ring,x.top,{bottom:x.bottom,pitch:near?4:8,bay:near?3:6,band:near?.35:.55,mullion:near?.13:.18});}
 // Three planted roof terraces. Every trunk starts in its actual roof plane.
 const terraces=[[30,90],[84,74],[124,29]];
 for(const[y,v]of terraces)for(const u of near?[11,20,30,40]:[15,36]){const[x,z]=point(u,v);const trunk=new THREE.CylinderGeometry(.16,.22,2.6,near?6:4);trunk.translate(x,y+1.3,z);b.put(trunk,'bark');const leaf=new THREE.IcosahedronGeometry(near?2.2:3.1,0);leaf.scale(1,1.2,1);leaf.translate(x,y+3.2,z);b.put(leaf,'leaf');}
 const model=s.finish();model.userData.identity='three shrinking stacked glass blocks and planted roof terraces';return model;
}
