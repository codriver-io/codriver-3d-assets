import * as THREE from 'three';
import clipping from 'polygon-clipping';
import {SPEC,PALETTES} from './config.js';
import {LOCAL_RINGS} from './footprint.js';
import {kit} from './santa-maria-maggiore-parts.js';
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,block,wall,cyl,bar,sphere}=k;
 const ring=LOCAL_RINGS[0];
 const slot=[[[31.5,-14.3],[46,-14.3],[46,14.3],[31.5,14.3],[31.5,-14.3]]];
 for(const poly of clipping.difference([ring],slot))k.shell('masonry',poly,0,15,[4,10]);
 // Canonical palace wings: upper elevations are clipped to the actual plan, not rectangular overshoots.
 for(const [x0,x1,z0,z1] of [[9,45,-42,-14.3],[9,45,14.3,45],[-54,-38,-38,39]]){
  for(const p of clipping.intersection([ring],[[[x0,z0],[x1,z0],[x1,z1],[x0,z1],[x0,z0]]]))k.shell('masonry',p,15,25,[17,21]);
 }
 // Long basilica nave, with visible clerestory windows above the lower aisle roofs.
 const windows=[];for(let u=-30;u<34;u+=near?7.8:11.7)windows.push({u,y:20,w:3.5,h:3.8,arch:true,mat:'glass'});
 block('masonry',-3,1.5,73,20.5,15,25,{south:windows,north:windows});
 k.gable('roof',-39.5,33.5,25,28,21,1.5);
 for(const z of [-16,18])k.gable('roof',-39.5,33,15,18,10,z);
 // Fuga's portico and loggia: five lower rectangular openings and three upper round arches.
 const low=Array.from({length:5},(_,i)=>({u:(i-2)*5.4,y:.35,w:3.5,h:10.3,mat:'shadow'}));
 const high=[-9,0,9].map(u=>({u,y:14.4,w:6.2,h:u===0?12.1:10.9,arch:true}));
 wall('stone',28.5,.35,28.4,1.05,41.0,0,Math.PI/2,[...low,...high]);
 wall('stone',28.5,.35,28.4,.8,35,0,Math.PI/2,[...low,...high.map(o=>({...o,mat:'shadow'}))]);
 box('stone',36.7,.175,0,10.4,.35,28.5);box('stone',36.7,12.2,0,10.4,1.2,28.5);box('stone',36.7,28.9,0,10.5,1.4,29.5);
 for(const z of [-13.5,-8.1,-2.7,2.7,8.1,13.5]){cyl('stone',41.2,z,.52,.46,.35,11.7,near?10:6);box('stone',41.2,11.9,z,1.3,.4,1.3);}
 for(const z of [-13.3,-4.5,4.5,13.3]){cyl('stone',41.3,z,.55,.49,12.6,27.5,near?10:6);box('stone',41.3,27.8,z,1.5,.6,1.5);}
 k.gable('stone',37,42.3,29.4,32.5,12.4);
 // Low balustrade and five compact robed rooftop figures, including the raised central group.
 for(const z of [-13,-7,0,7,13]){
  const base=z===0?32.4:29.7;
  box('stone',39.2,base+.25,z,1.3,.5,1.3);
  cyl('stone',39.2,z,.55,.35,base+.5,base+2.7,near?8:5);
  cyl('stone',39.2,z,.19,.19,base+2.6,base+3.1,near?8:5);sphere('stone',39.2,base+3.25,z,.4);
  for(const s of [-1,1])bar('stone',[39.2+s*.3,base+2.3,z],[39.2+s*.7,base+1.4,z+.15],.22);
 }
 // Two mapped chapel domes: octagonal drums, lead domes and open-sized lantern caps.
 for(const z of [-27.5,30.2]){
  cyl('masonry',-24,z,10.5,10.5,15,25,8);
  const N=8,R=8.2,w=2*R*Math.tan(Math.PI/8);
  for(let i=0;i<N;i++){const a=i*2*Math.PI/N;wall('stone',w,25,34,.8,-24+(R-.8)*Math.sin(a),z+(R-.8)*Math.cos(a),a,[{u:0,y:27,w:2.2,h:4.4,mat:'glass'}]);}
  k.dome('metal',-24,z,8.8,34,11);
  cyl('stone',-24,z,1.5,1.5,44.8,48.9,near?12:8);k.dome('metal',-24,z,1.8,48.9,2.6);
 }
 // Curving rear apse is separate from the long nave and chapel drums.
 cyl('stone',-51,1,8,8,15,24,near?28:18);cyl('roof',-51,1,8.3,0,24,27,near?28:18);
 // The Romanesque campanile: solid lower shaft, clock and three open triforium stages.
 const tx=30,tz=-11.5,W=7.7;
 block('masonry',tx,tz,W,W,0,25);
 block('brick',tx,tz,W,W,25,40.5,{east:[{u:0,y:34.8,w:2.55,h:2.55,circle:true,mat:'stone'}]});
 for(const [y0,y1] of [[40.5,48.2],[48.2,55.9],[55.9,63.6]]){
  for(let side=0;side<4;side++){
   const a=side*Math.PI/2,holes=[-2,0,2].map(u=>({u,y:y0+1.05,w:1.35,h:5.1,arch:true}));
   wall('brick',W,y0,y1,.58,tx+(W/2-.58)*Math.sin(a),tz+(W/2-.58)*Math.cos(a),a,holes);
  }
  box('brick',tx,y1+.18,tz,8.3,.36,8.3);
 }
 // Pointed square roof, orb and cross preserve the official 75 m summit.
 k.poly('metal',[[tx-4.1,64,tz-4.1],[tx-4.1,64,tz+4.1],[tx+4.1,64,tz+4.1],[tx+4.1,64,tz-4.1],[tx,74,tz]],[0,1,4,1,2,4,2,3,4,3,0,4]);
 sphere('metal',tx,74.1,tz,.27);bar('metal',[tx,74.1,tz],[tx,75,tz],.12);bar('metal',[tx-.38,74.6,tz],[tx+.38,74.6,tz],.1);
 const model=k.finish();model.userData.features=['75m Romanesque campanile','open triforia','5 lower and 3 upper loggia bays','paired lead domes'];return model;
}
