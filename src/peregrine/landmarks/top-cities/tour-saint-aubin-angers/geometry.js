import * as THREE from 'three';import { SPEC, PALETTES } from './config.js';import { kit } from './parts.js';
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{box,cyl,wall,put,near}=k;
 for(let i=0;i<4;i++){
  const a=i*Math.PI/2,holes=[];
  if(i===0)for(const u of [-3.3,3.3]){holes.push({u,y:0,w:1.6,h:3.1,arch:true,mat:'shadow'});holes.push({u,y:4.5,w:2.4,h:3.9,arch:true,mat:'glass'});}
  for(const u of [-3.3,3.3])holes.push({u,y:29.2,w:3.4,h:8.4,arch:true,mat:'shadow'});
  wall('plaster',15.2,0,39,.8,6.8*Math.sin(a),6.8*Math.cos(a),a,holes);
  wall('plaster',12.5,39,49,.7,5.55*Math.sin(a),5.55*Math.cos(a),a,[{u:0,y:40.1,w:3.45,h:7.7,arch:true,mat:'shadow'}]);
  // Three concentric Romanesque archivolts and engaged colonnettes.
  for(const [u,y,r] of [[-3.3,35.9,1.7],[3.3,35.9,1.7],[0,46.1,1.73]]){
   const z=y>40?6.3:7.6;
   for(let ring=0;ring<(near?3:1);ring++){
    const g=new THREE.TorusGeometry(r+.22+(near?ring:1)*.28,.11,3,near?16:6,Math.PI);g.translate(u,y,z+.08);g.rotateY(a);put(g,'plaster');
   }
   for(const s of [-1,1]){const g=new THREE.CylinderGeometry(.15,.15,7.0,near?8:5);g.translate(u+s*(r+.35),y-3.5,z+.15);g.rotateY(a);put(g,'plaster');}
  }
  // Recessed horizontal louvres cross genuine wall apertures.
  for(const u of [-3.3,3.3])for(let y=29.5;y<36.8;y+=near?.48:1.9){const g=new THREE.BoxGeometry(3.6,.16,.45);g.translate(u,y,7.12);g.rotateY(a);put(g,'louvre');}
  for(let y=40.4;y<46.8;y+=near?.48:1.9){const g=new THREE.BoxGeometry(3.65,.16,.45);g.translate(0,y,5.8);g.rotateY(a);put(g,'louvre');}
 }
 for(const y of [1.1,9.6,27.9,38.8])box('plaster',0,y,0,15.65,.55,15.65);
 box('plaster',0,49,0,12.9,.6,12.9);
 for(const x of [-6.8,6.8])for(const z of [-6.8,6.8]){
  box('plaster',x,14,z,1.65,28,1.65);cyl('plaster',x,z,.75,.75,28,39,near?12:8);
  cyl('plaster',x*.87,z*.87,1.05,1.05,39,49,near?16:10);cyl('roof',x*.87,z*.87,1.2,.03,49,53.8,near?16:10);
 }
 const profile=[[0,49.15],[9.0,49.15],[6.2,50.5],[3.8,52.5],[2.0,53.3],[0,53.3]];
 const g=new THREE.LatheGeometry(profile.map(p=>new THREE.Vector2(...p)),4);g.rotateY(Math.PI/4);put(g,'roof');
 cyl('roof',0,0,.06,.06,53.3,54,6);
 // Photo-calibrated storey split: base 24 m, bell stages 24–35 and 35–45,
 // with the tall curved pavilion rising from 45 to 54 m.
 const root=k.finish();root.traverse(o=>{if(o.isMesh){const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i);p.setY(i,y<28?y*24/28:y<49?y-4:45+(y-49)*9/5);}p.needsUpdate=true;o.geometry.computeVertexNormals();o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();}});return root;
}
