import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { BLADES } from './tour-first-plan.js';
import { local, simplify, surfaces } from './tour-first-parts.js';
export function crown(blade) {
 const plan=simplify(local(blade.ring,SPEC.origin),.22),a=blade.direction*Math.PI/180;
 const projection=([x,z])=>x*Math.sin(a)-z*Math.cos(a),v=plan.map(projection),lo=Math.min(...v),hi=Math.max(...v);
 return {plan,top:(x,z)=>blade.height-25*(projection([x,z])-lo)/(hi-lo)};
}
export function create({detail='near'}={}) {
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),s=surfaces(b);
 const base=simplify(local(FOOTPRINTS[0],SPEC.origin),.3);
 s.shell(base,5,{pitch:5,bay:near?2.6:5.2,band:.35,mullion:.18});
 for(const blade of BLADES){const{plan,top}=crown(blade);s.shell(plan,top,{bottom:5,pitch:near?3.8:7.6,bay:near?3.3:6.6,band:near?.28:.45,mullion:near?.09:.14});}
 const tallest=crown(BLADES[0]),tip=tallest.plan.reduce((a,c)=>tallest.top(...a)>tallest.top(...c)?a:c);
 const mast=new THREE.CylinderGeometry(.09,.23,6.4,near?8:5);mast.translate(tip[0],227.8,tip[1]);b.put(mast,'roof');
 const model=s.finish();model.userData.identity='2011 three-blade tower with unequal sloping crowns and slender 231 m tip';return model;
}
