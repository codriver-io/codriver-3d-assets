import * as THREE from'three';import clipping from'polygon-clipping';import{assetBuilder}from'../../asset-geometry.js';import{SPEC,PALETTES}from'./config.js';import{FOOTPRINTS}from'./footprint.js';import{local,simplify,surfaces}from'./tour-bretagne-nantes-parts.js';
export const SHAFT=simplify(local(FOOTPRINTS[0],SPEC.origin),.1),PODIUM=simplify(local(FOOTPRINTS[1],SPEC.origin),.15);const center=SHAFT.reduce((a,p)=>a.map((v,k)=>v+p[k]/SHAFT.length),[0,0]);export const inset=k=>SHAFT.map(p=>p.map((v,i)=>center[i]+(v-center[i])*k));
export function create({detail='near'}={}){const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),s=surfaces(b);
 const podium=clipping.difference([PODIUM],[SHAFT]);for(const p of podium){s.shell(p[0],16,{capTop:false,pitch:4,bay:near?3:6,band:1.8,mullion:.4,wall:'frame',glass:'glass'});const clean=p.map(r=>Math.hypot(r[0][0]-r.at(-1)[0],r[0][1]-r.at(-1)[1])<.001?r.slice(0,-1):r),all=clean.flat();for(const t of THREE.ShapeUtils.triangulateShape(clean[0].map(v=>new THREE.Vector2(...v)),clean.slice(1).map(r=>r.map(v=>new THREE.Vector2(...v)))))s.tri('roof',...t.slice().reverse().map(i=>[all[i][0],16,all[i][1]]));}
 s.shell(SHAFT,120,{pitch:120/(near?32:16),bay:near?1.5:3,band:near?.32:.5,mullion:near?.12:.2,wall:'frame',glass:'glass'});
 s.shell(inset(.77),134,{bottom:120,pitch:near?1.1:2.2,bay:near?1:2,band:.28,mullion:.16,wall:'mechanical',glass:'vent'});
 s.shell(inset(.40),143,{bottom:134,windows:false,wall:'tank'});
 for(const p of inset(.37).filter((p,i)=>i%3===0))b.bar('tank',[p[0],143,p[1]],[p[0],144,p[1]],.12);
 const m=s.finish();m.userData.identity='1976 bronze-grid shaft,stepped technical crown and pale water tank reaching144 m';return m;}
