import * as THREE from 'three';
import {mergeVertices} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC,PALETTES,MANIFEST } from './config.js';
import { ANGLE,parts,lancet } from './washington-national-cathedral-parts.js';
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=parts(b,near),{box,wall,roof,pin,polygon}=k,C=3.1,contacts=[];
 // Eight nave bays and five choir bays, each with cut-through pointed windows.
 for(const [lo,hi,z0,z1] of [[-64,8,-17,23],[24,65,-8,14]]){
  box('stone',[(lo+hi)/2,9,C],[hi-lo,18,14]);
  roof(lo,hi,z0,C-7,18.3,23.5);roof(lo,hi,C+7,z1,18.3,23.5);
  const bays=lo<0?8:5,step=(hi-lo)/bays;
  for(const s of [-1,1]){const f=s<0?'N':'S',z=s<0?z0:z1;
   wall(f,(lo+hi)/2,C+s*7.5,hi-lo,19,Array.from({length:bays},(_,i)=>({x:(i+.5)*step-(hi-lo)/2,y:2,w:step*.67,h:13})),17,`clerestory-${lo}-${s}`);
   for(let i=0;i<bays;i++){
    const x=lo+(i+.5)*step,px=lo+i*step+.8,pz=z-s*.45;
    wall(f,x,z,step-.1,18,[{y:3,w:step*.65,h:12}]);
    box('stone',[px,12,pz],[1.6,24,1.8],`pier-${lo}-${s}-${i}`);pin(px,pz,24,34,near?.7:.6);
    box('stone',[px,28,C+s*7.4],[1.3,20,1.5],`head-${lo}-${s}-${i}`);
    const pts=[[pz,23.4],[pz,25.2],[C+s*7.4,34.3],[C+s*7.4,32.8],[pz-s*3,25.6]];
    polygon(pts.map(([z,y])=>[-z,y]),'E',0,0,px-.55,'stone',1.1,`fly-${lo}-${s}-${i}`);
    contacts.push({member:`fly-${lo}-${s}-${i}`,a:[px,24,pz],supportA:`pier-${lo}-${s}-${i}`,c:[px,33,C+s*7.4],supportC:`head-${lo}-${s}-${i}`});
   }
  }
  roof(lo,hi,C-7.6,C+7.6,36.1,45.7);
 }
 // Deep transepts with large roses and gabled, pinnacle-framed fronts.
 for(const [s,end] of [[-1,-39],[1,41]]){
  const z0=s<0?end:C,z1=s>0?end:C,f=s<0?'N':'S';
  for(const x of [8.5,23.5])wall(x<16?'W':'E',(z0+z1)/2,x,z1-z0,36,[{y:19,w:5,h:13}]);
  roof(z0,z1,8.5,23.5,36.1,45.7,true);
  wall(f,16,end,15,37,[{circle:true,y:26,w:7.9248},{y:1,w:5.5,h:13,mat:'recess'},{x:-6,y:16,w:2.4,h:5},{x:6,y:16,w:2.4,h:5}]);
  polygon([[-7.5,0],[7.5,0],[0,10]],f,16,37,end,'stone',.8);
  for(const x of [9.5,22.5]){box('stone',[x,20,end-s*.4],[2,40,2]);pin(x,end-s*.4,40,51,1);}
  for(const x of [9,23]){box('stone',[x,12,end-s*3],[2,24,2]);pin(x,end-s*3,24,34,.7);}
 }
 function tower(x,z,w,h,central){
  const base=central?35.3:0,top=central?85:63;
  if(central)box('stone',[x,(base+44)/2,z],[w,44-base,w]);
  for(const f of ['N','S','W','E']){
   const a=f==='W'||f==='E'?z:x,d=f==='W'?x-w/2:f==='E'?x+w/2:f==='N'?z-w/2:z+w/2;
   if(!central)wall(f,a,d,w,44,[...(f==='W'?[]:[{x:-w*.23,y:24,w:2.4,h:9},{x:w*.23,y:24,w:2.4,h:9},{x:-w*.23,y:9,w:1.2,h:5},{x:w*.23,y:9,w:1.2,h:5}]),...(f==='W'?[{y:.5,w:6,h:11,mat:'recess'},...[-3.45,3.45].map(v=>({x:v,y:12,w:5.8,h:23,open:true}))]:[])]);
   wall(f,a,d,w,top-44,[{x:-w*.23,y:central?17:3,w:w*.3,h:central?20:15},{x:w*.23,y:central?17:3,w:w*.3,h:central?20:15},...(central?[-4.8,0,4.8].map(v=>({x:v,y:2,w:2.5,h:9})):[])],44);
   if(near){const sign=f==='N'||f==='W'?-1:1;for(const u of [-w*.23,w*.23]){const o=lancet(w*.36,central?22:17,4).map(p=>[p[0]+u,p[1]+(central?16:2)]);for(let i=1;i<o.length;i++){const av=new THREE.Vector3(...k.fp(f,a+o[i-1][0],44+o[i-1][1],d+sign*.3)),bv=new THREE.Vector3(...k.fp(f,a+o[i][0],44+o[i][1],d+sign*.3)),g=new THREE.BoxGeometry(.35,av.distanceTo(bv),.35);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),bv.clone().sub(av).normalize()));g.translate(...av.add(bv).multiplyScalar(.5).toArray());k.put(g);}}}
  }
  box('stone',[x,top+.5,z],[w-.1,1,w-.1]);
  for(const sx of [-1,1])for(const sz of [-1,1]){box('stone',[x+sx*w*.43,(top+base)/2,z+sz*w*.43],[1.6,top-base,1.6]);pin(x+sx*w*.43,z+sz*w*.43,top+1,h,1.05);}
  if(near)for(const s of [-1,1])for(let i=0;i<7;i++){box('stone',[x+(i-3)*w/7,top+1.6,z+s*(w/2-.4)],[.7,1.2,.7]);box('stone',[x+s*(w/2-.4),top+1.6,z+(i-3)*w/7],[.7,1.2,.7]);}
  box('roof',[x,top-1.3,z],[w-.8,.3,w-.8]);
 }
 tower(16,C,14.8,SPEC.height,true);tower(-64,-10.85,15,SPEC.westHeight,false);tower(-64,17,15,SPEC.westHeight,false);
 wall('W',C,-72,13,40,[{y:12,w:12,h:26,open:true},{y:.4,w:7,h:11,mat:'recess'}]);
 wall('W',C,-70.8,12,26,[{circle:true,y:12,w:9.2}],12,'creation-rose-recess',true,'archshade');
 wall('W',C,-70.8,12.5,12,[{y:.4,w:7,h:11,mat:'recess'}]);
 // Nested solid archivolts are recessed by 1.1 m, held by the wall jambs.
 function surround(z,y,w,h,depth,name){
  const layers=near?3:name==='west-archivolt'?2:1;
  for(let j=0;j<layers;j++){
   const spread=name==='west-archivolt'?.72:.42,outer=lancet(w+j*spread,h+j*.5,near?5:2),inner=lancet(w-.65+j*spread,h-.42+j*.5,near?5:2);
   const sh=new THREE.Shape(outer.map(([u,v])=>new THREE.Vector2(u,v)));
   sh.holes.push(new THREE.Path(inner.slice().reverse().map(([u,v])=>new THREE.Vector2(u,v))));
   const g=new THREE.ExtrudeGeometry(sh,{depth:depth/layers+.12,bevelEnabled:false,curveSegments:1});
   k.put(k.plane(g,'W',z,y,(name==='west-archivolt'?-71.05:-70.55)-j*depth/layers),'stone',name+'-'+j);
  }
 }
 surround(C,12,12,26,1.15,'west-archivolt');
 for(const z of [-16,-5.5,10.5,22.4]){box('stone',[-71.6,20,z],[1.4,40,2.2]);pin(-71.6,z,40,49,.7);}
 for(const z0 of [-10.85,17])for(const dz of [-3.45,3.45]){
  const z=z0+dz;
  wall('W',z,-70.05,5.75,23,[{x:0,y:1.8,w:1.15,h:4,mat:'recess'},{x:0,y:13,w:1.15,h:4,mat:'recess'}],12,'blind-arch-backing-'+z,true,'archshade');
  surround(z,12,5.8,23,1.25,'blind-arch-'+z);
 }
 if(near)for(const z of [-16,-5.5,10.5,22.4]){
  const x=z>22?-72.35:-73.65;
  box('stone',[(x-.45-71.8)/2,14,z],[Math.abs(x-.45+71.8),.6,1.2]);
  const body=new THREE.CylinderGeometry(.3,.5,2.2,5);body.translate(x,15.4,z);k.put(body);
  const head=new THREE.SphereGeometry(.4,6,4);head.translate(x,16.7,z);k.put(head);
  pin(x,z,17.1,20,.8);
 }

 // Seven cut-through gallery lancets stand in front of the nave backing.
 // Keep the full horizontal bay rhythm and buttress divisions in both LODs.
 wall('W',C,-72.2,13,6.2,Array.from({length:7},(_,i)=>({x:(i-3)*1.72,y:.55,w:1.25,h:4.8})),39,'west-gallery');
 for(let i=0;i<8;i++)box('stone',[-72.15,41.9,C+(i-3.5)*1.72],[.95,5.8,.44],'gallery-division-'+i);
 for(let i=0;i<7;i++){const z=C+(i-3)*1.72;polygon([[-.8,0],[.8,0],[0,1.5]],'W',z,45.2,-72.05,'stone',.3);pin(-72.15,z,46.7,48.2,.32);}
 box('stone',[-72.15,39.15,C],[.95,.65,12.9],'gallery-sill');
 // Polygonal east sanctuary and ambulatory.
 box('stone',[67,16,C],[8,32,21]);roof(65,71,C-7.5,C+7.5,36.1,45.7);
 for(let i=0;i<5;i++){const t=-Math.PI/2+i*Math.PI/4,x=71+5*Math.cos(t),z=C+7.5*Math.sin(t),g=new THREE.BoxGeometry(6,24,1);g.rotateY(-t+Math.PI/2);g.translate(x,12,z);k.put(g);const pg=new THREE.ConeGeometry(3.4,9,4);pg.translate(x-1,27,z);k.put(pg,'roof');box('stone',[x,13,z],[1.3,26,1.3]);pin(x,z,26,36,.65);}
 // Low attached chapels and north cloister; the court remains open.
 for(const [x,z,w,d,h] of [[-58,-25,16,10,11],[-61,31,10,15,11],[49,-41,30,6,9],[63,-53,26,8,11],[30,-33,6,19,9],[61,-30,4,28,9]]){
  roof(x-w/2,x+w/2,z-d/2,z+d/2,h+.2,h+4);
  for(const s of [-1,1])if(!(x<0&&z>0&&s<0))wall(s<0?'N':'S',x,z+s*d/2,w,h,Array.from({length:Math.max(2,Math.floor(w/5))},(_,i)=>({x:(i+.5)*w/Math.max(2,Math.floor(w/5))-w/2,y:1,w:2,h:h-2})));
  for(const s of [-1,1])wall(s<0?'W':'E',z,x+s*(w/2-.4),d,h);
 }
 const root=b.finish();root.userData.parts=k.ranges;root.userData.contacts=contacts;root.userData.elevationDatum=MANIFEST.elevationDatum;
 root.traverse(o=>{if(o.isMesh){o.geometry.deleteAttribute('bridgeLift');const old=o.geometry;o.geometry=mergeVertices(old,1e-4);old.dispose();o.geometry.rotateY(ANGLE);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();}});return root;
}
