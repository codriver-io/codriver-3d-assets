import * as THREE from 'three';
import clipping from 'polygon-clipping';
import { SPEC,PALETTES } from './config.js';
import { LOCAL_RINGS,BASTION_RINGS } from './footprint.js';
import { kit } from './castel-sant-angelo-parts.js';

export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,cyl,wall,block,bar,sphere,poly}=k;
 // The mapped star-fort envelope forms the rigid foundation, not a terrain model.
 const cut=clipping.difference([LOCAL_RINGS[0]],[[[-.3,34],[4.3,34],[4.3,64],[-.3,64],[-.3,34]]]);
 for(const [outline] of cut)k.prism('stone',outline.slice(0,-1),0,14.6);
 wall('stone',4.6,0,14.6,2.7,2,43.5,0,[{u:0,y:0,w:3.2,h:6.4,arch:true,mat:'shadow'}]);
 for(const [x,z,w,d,a] of [[2,44,84,1.2,0],[0,-43,84,1.2,0],[-43,0,1.2,82,0],[44,0,1.2,82,0]])box('stone',x,15,z,w,.8,d,a);
 for(let i=0;i<(near?25:17);i++){
  const u=-40+i*80/((near?25:17)-1);
  for(const s of [-1,1]){box('stone',u,16.1,s*43.7,near?1.5:2.1,1.5,1.3);box('stone',s*43.7,16.1,u,1.3,1.5,near?1.5:2.1);}
 }
 // Open circular parapet and alternating merlons above the four outer bastions.
 for(const ring of BASTION_RINGS){
  k.prism('stone',ring.slice(0,-1),14.6,15.2);
  const center=ring.reduce((a,p)=>[a[0]+p[0]/ring.length,a[1]+p[1]/ring.length],[0,0]);
  const stride=near?2:3;
  for(let i=0;i<ring.length-1;i+=stride){const p=ring[i],q=ring[(i+1)%(ring.length-1)],a=Math.atan2(q[0]-p[0],q[1]-p[1]);box('stone',p[0]*.96+center[0]*.04,15.8,p[1]*.96+center[1]*.04,1.1,1.2,1.6,a);}
 }
 // Ancient grey drum and the warm brick upper storey are adjoining vertical courses.
 cyl('stone',0,0,32.8,32.8,14.6,24.3,near?80:48);
 cyl('stone',0,0,33.0,33.0,23.6,24.3,near?80:48);
 const n=near?48:32,R=32.8,t=.85,w=2*R*Math.tan(Math.PI/n);
 for(let i=0;i<n;i++){
  const a=i*2*Math.PI/n;
  wall('brick',w,24.3,30.8,t,(R-t)*Math.sin(a),(R-t)*Math.cos(a),a,
   i%2===0?[{u:0,y:26.45,w:1.05,h:1.05,circle:true,mat:'shadow'}]:[]);
 }
 cyl('brick',0,0,33.5,33.5,30.8,32,near?80:48);
 // Terrace and parapet: an annulus keeps the apartment courtyard open.
 const count=near?80:48;
 for(let i=0;i<count;i++){
  const a=i*2*Math.PI/count;
  box('brick',32.95*Math.sin(a),32.3,32.95*Math.cos(a),2*33.0*Math.tan(Math.PI/count),.6,.8,a);
  if(i%2===0)box('brick',33.15*Math.sin(a),30.25,33.15*Math.cos(a),.6,1.1,1.1,a);
 }
 // Roof terrace overlaps the massive ancient cylinder only on the inside.
 cyl('stone',0,0,31.9,31.9,30.55,30.7,near?64:40);
 const bays=near?[-6,0,6]:[-6,0,6];
 const holes=[];for(const u of bays)for(const y of [32.7,36.7])holes.push({u,y,w:1.55,h:2.35,mat:'glass'});
 block('brick',0,-1.7,17.8,29.5,30.7,41,{south:holes,north:holes,east:[{u:-7,y:34,w:1.5,h:2.2,mat:'glass'},{u:0,y:34,w:1.5,h:2.2,mat:'glass'},{u:7,y:34,w:1.5,h:2.2,mat:'glass'}],west:[{u:-7,y:34,w:1.5,h:2.2,mat:'glass'},{u:0,y:34,w:1.5,h:2.2,mat:'glass'},{u:7,y:34,w:1.5,h:2.2,mat:'glass'}]});
 box('brick',0,41.5,-1.7,18.5,1,30.2);
 // Flanking papal residential ranges, attached directly to the terrace.
 for(const x of [-17,21]){
  block('brick',x,1,10.5,35,30.7,35.2,{east:[{u:-10,y:31.5,w:1.4,h:2.3,arch:true,mat:'shadow'},{u:0,y:31.5,w:1.4,h:2.3,arch:true,mat:'shadow'},{u:10,y:31.5,w:1.4,h:2.3,arch:true,mat:'shadow'}],west:[{u:-10,y:31.5,w:1.4,h:2.3,arch:true,mat:'shadow'},{u:0,y:31.5,w:1.4,h:2.3,arch:true,mat:'shadow'},{u:10,y:31.5,w:1.4,h:2.3,arch:true,mat:'shadow'}]});
  k.gable('roof',x-5.3,x+5.3,35.2,36.5,35,1);
 }
 // Saint Michael: planted legs, robed torso, head, articulated arms and two broad wings.
 box('brick',0,42.2,-1,4,.4,3.2);
 for(const x of [-.45,.45])bar('metal',[x,42.4,-1],[x*.6,43.7,-1.1],.34,.38);
 const torso=new THREE.CylinderGeometry(.47,.7,1.5,near?9:6);torso.translate(0,44.15,-1.1);k.put(torso,'metal');sphere('metal',0,45.35,-1.1,.43);
 bar('metal',[-.4,44.6,-1.1],[-1.25,45.2,-1.3],.24);bar('metal',[-1.25,45.2,-1.3],[-1.8,44.9,-1.3],.2);
 bar('metal',[.4,44.6,-1.1],[1.1,45.4,-1.1],.24);bar('metal',[1.1,45.4,-1.1],[1.35,46.5,-1.2],.2);
 // Closed wing solids, swept up and backward; broad enough to read at driving scale.
 for(const s of [-1,1])poly('metal',[[s*.25,44.1,-1.45],[s*2.7,47.65,-1.8],[s*2.1,45,-1.75],[s*.4,43.8,-1.45],[s*.25,44.1,-1.65],[s*2.7,47.65,-2],[s*2.1,45,-1.95],[s*.4,43.8,-1.65]],[0,1,2,0,2,3,4,6,5,4,7,6,0,4,5,0,5,1,1,5,6,1,6,2,2,6,7,2,7,3,3,7,4,3,4,0]);
 // Sword terminates in the raised right hand; it does not float beyond the statue.
 bar('metal',[1.3,46.2,-1.2],[1.45,48,-1.2],.09);
 const root=k.finish();root.userData.features=['bastions','cylindrical mausoleum','papal apartments','winged Saint Michael'];return root;
}
