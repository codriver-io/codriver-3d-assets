import*as THREE from'three';import{assetBuilder}from'../../asset-geometry.js';import{SPEC,PALETTES}from'./config.js';import{kit}from'./spire-of-dublin-geometry-kit.js';
export const shaftRadius=y=>1.5-(1.5-.075)*(y-.12)/(120-.12);
export function create({detail='near'}={}){const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=kit(b,THREE),n=near?40:20;
 k.radial([[0,1.6],[.12,1.6]],n,'base');const ys=[.12,8,20,20.04,40,40.04,60,60.04,80,80.04,100,100.04,108,120],stations=ys.map(y=>[y,shaftRadius(y)]);k.radial(stations,n,(s)=>ys[s]>=108?'tip':ys[s+1]-ys[s]<.05?'joint':'steel');k.flush();const root=b.finish();root.traverse(m=>{if(m.isMesh)m.geometry.rotateY(1.619);});return root;}
