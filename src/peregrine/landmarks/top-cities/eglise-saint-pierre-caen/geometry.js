import * as T from 'three';
import {mergeVertices} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES,MANIFEST} from './config.js';
import {kit,ANGLE} from './eglise-saint-pierre-caen-kit.js';
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=kit(b,near);
 const {face,rect,pointed,solid,panel,border,line,faceLine,disk,ring,cone,cyl,prism,fan,gable,window,pinnacle,parapet,box}=k;
 const front=-21.65,back=31,cz=-9.4;
 // Rigid, modest stone socle. No invented plaza or terrain skirt.
 prism('stone',[[-21.65,-20.9],[-20,-21.6],[30.85,-21.6],[30.85,2.8],[-16,2.8],[-16,1.4],[-21.65,1.4]],0,.48);
 // Nave upper walls with genuinely recessed pointed clerestory bays.
 for(const side of [-1,1]){
  const z=cz+side*6.65,angle=side<0?Math.PI:0;
  for(let i=0;i<10;i++){
   const x=front+2.63+i*5.26,f=face(x,z,angle),holes=[];
   holes.push(window(f,3.72,7.1,16.35,3));
   solid('stone',rect(5.26,23.8),f,0,.65,holes);
   box('trim',x,15.2,z+side*.16,5.26,.28,.33);
   box('trim',x,23.8,z+side*.1,5.26,.4,.4);
  }
 }
 // Central dark slate roof and narrow ridge cap. No transept.
 gable('roof',front,back,cz-6.75,cz+6.75,24,30);
 box('roof',4.675,30.03,cz,52.65,.18,.24);
 if(near)for(let x=-20;x<31;x+=2.1)for(const s of [-1,1])line('roof',[x,24.13,cz+s*6.55],[x,30.1,cz],.045);
 // Aisles: buttressed low windows, sloping roof and a pierced gallery.
 for(const side of [-1,1]){
  const angle=side<0?Math.PI:0;
  for(let i=0;i<10;i++){
   const z=side<0?-21.35:(i===0?1.25:3.15);const x=front+2.63+i*5.26;if(side>0&&x>-16&&x<-6)continue;
   const f=face(x,z,angle),holes=[window(f,3.45,8.7,2.2,3)];
   solid('stone',rect(5.26,13.6),f,0,.7,holes);
   box('trim',x,1.2,z+side*.1,5.26,.3,.35);
   box('trim',x,12.6,z+side*.16,5.26,.55,.5);
   box('trim',x,14.3,z,5.26,.28,.4);
   // Aisle roof is a sloping slate strip; its stone gallery lies in front.
   const ra=[[x-2.63,z],[x+2.63,z],[x+2.63,cz+side*6.5],[x-2.63,cz+side*6.5]];
   const pos=[ra[0][0],13.7,ra[0][1],ra[1][0],13.7,ra[1][1],ra[2][0],16.2,ra[2][1],ra[3][0],16.2,ra[3][1]];
   const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(side<0?[0,2,1,0,3,2]:[0,1,2,0,2,3]);k.put(g,'roof');
   const count=near?9:4;for(let j=0;j<count;j++){const u=-2.45+j*4.9/(count-1);if(near)box('trim',x+u,13.6,z,.12,1.2,.15);else faceLine('trim',f,[u,13],[u,14.2],.12,.14);}
  }
  for(let i=0;i<=10;i++){
   const z=side<0?-21.35:(i===0?1.25:3.15);const x=front+i*5.26+(side<0&&i===0?.9:0);if(side>0&&x>-16&&x<-6)continue;
   // Tapered stepped piers and flying arches distinguish the long sides.
   box('stone',x,5.6,z-side*.25,.75,11.2,1.3);
   box('trim',x,11.65,z-side*.12,.85,.55,1.45);
   box('stone',x,15.2,z-side*.45,.52,6.5,.95);
   pinnacle(x,z-side*.25,18.1,4.2,.23);
   const u=cz+side*6.7;
   line('trim',[x,17.2,z-side*.25],[x,21.9,u],.38);
   line('stone',[x,16.5,z-side*.45],[x,20.4,u],.28);
   if(near){box('trim',x,9,z+side*.28,.98,.18,.56);box('trim',x,4.5,z+side*.28,.98,.16,.56);}
  }
 }
 // West facade: pointed entrance, rose, nested mouldings and tall gabled frame.
 const west=face(front,cz,-Math.PI/2),door=pointed(5.4,11.2);
 const circle=Array.from({length:near?40:16},(_,i)=>[Math.cos(i*Math.PI*2/(near?40:16))*3.45,20+Math.sin(i*Math.PI*2/(near?40:16))*3.45]);
 solid('stone',rect(13.3,24),west,0,.8,[door,circle]);
 panel('recess',door,west,0,-.5);
 for(let i=0;i<(near?4:2);i++)border('trim',pointed(5.65+i*.55,11.65+i*.42),.18,west,0,.1+i*.11);
 // Two timber door leaves behind the Gothic portal.
 panel('recess',rect(4.65,5.7),west,0,-.42);faceLine('trim',west,[0,0],[0,5.8],.1,-.33);
 solid('stone',[[-6.65,24],[6.65,24],[0,30]],west,0,.65);
 border('trim',[[-6.65,24],[0,30],[6.65,24]],.28,west,0,.12);
 disk('glow',west,20,3.44,-.36);ring('trim',west,20,3.75,.4,.15);ring('trim',west,20,1.14,.2,.25);
 for(let i=0;i<12;i++){
  const t=i*Math.PI/6;faceLine('trim',west,[Math.cos(t)*1.05,20+Math.sin(t)*1.05],[Math.cos(t)*3.32,20+Math.sin(t)*3.32],.17,.24);
  const f=face(front-.3,cz-Math.cos(t)*2.31,-Math.PI/2);ring('trim',f,20+Math.sin(t)*2.31,.66,.12,0,near?40:8);
 }
 border('trim',pointed(9.6,14.4),.22,west,12.2,.14);
 faceLine('trim',west,[-4.8,12.2],[4.8,12.2],.25,.18);
 // Elaborate entrance's triangular canopy and gabled side turrets.
 faceLine('trim',west,[-4,0],[0,16.1],.24,.27);faceLine('trim',west,[0,16.1],[4,0],.24,.27);
 for(const z of [cz-6.4,cz+6.4]){
  box('stone',front+.15,12,z,.75,24,1.1);pinnacle(front+.1,z,24,7,.42);
  if(near)for(let y=2;y<23;y+=3.4)box('trim',front-.15,y,z,.6,.25,1.15);
 }
 for(const z of [-19.1]){const f=face(front,z,-Math.PI/2);solid('stone',rect(4.35,13.6),f,0,.7,[window(f,2.6,8.5,2.1,2)]);pinnacle(front+.35,z-2,14,4,.25);}
 // Renaissance chevet: lower polygonal radiating chapels, flat balustraded
 // cornice and upper choir with oculi, pilasters and tall Gothic glazing.
 const outer=[],inner=[];const n=8;
 for(let i=0;i<=n;i++){const t=-Math.PI/2+i*Math.PI/n;outer.push([31+12.3*Math.cos(t),cz+12.3*Math.sin(t)]);inner.push([31+6.65*Math.cos(t),cz+6.65*Math.sin(t)]);}
 prism('stone',outer,0,.48);
 for(let i=0;i<n;i++){
  const a=outer[i],c=outer[i+1],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),mx=(a[0]+c[0])/2,mz=(a[1]+c[1])/2,ang=Math.atan2(-dz,dx)+Math.PI,f=face(mx,mz,ang);
  const h=window(f,len*.7,8.5,2.4,3);solid('stone',rect(len,13.7),f,0,.65,[h]);
  for(const y of [1.1,11.8,13.4,14.7]){faceLine('trim',f,[-len/2,y],[len/2,y],y===13.4?.4:.22,.16);}
  parapet(f,len,13.7,1.25,near?5:2);
  const px=mx+Math.sin(ang)*.1,pz=mz+Math.cos(ang)*.1;
  if(near)pinnacle(px,pz,14.95,3,.18,'ornament');else cone('ornament',px,pz,14.95,17.95,.25,4);
  // Decorated pilaster and semicircular frieze relief without copied sculptural meshes.
  cyl('ornament',a[0]-.12,a[1],.5,14.8,.32);pinnacle(a[0]-.1,a[1],14.8,6.2,.35,'ornament');
  if(near){for(let j=0;j<4;j++){const ff=face(mx+Math.cos(ang)*(j-1.5)*len/4,mz-Math.sin(ang)*(j-1.5)*len/4,ang);ring('trim',ff,12.65,.24,.09,.2);}for(let y=2;y<11;y+=2.7)cyl('trim',a[0]-.12,a[1],y,y+.2,.43);}
  const v=[inner[i],inner[i+1],outer[i+1],outer[i]];fan('roof',v,13.85,[31,16.2,cz]);
 }
 // upper apse: solid window-bearing polygon, arcading and round Renaissance oculi.
 for(let i=0;i<n;i++){
  const a=inner[i],c=inner[i+1],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),ang=Math.atan2(-dz,dx)+Math.PI,f=face((a[0]+c[0])/2,(a[1]+c[1])/2,ang);
  const holes=[window(f,len*.72,7,16.2,2)];solid('stone',rect(len,23.8),f,0,.6,holes);
  faceLine('trim',f,[-len/2,23.8],[len/2,23.8],.4,.12);
  parapet(f,len,24,1.5,near?3:1);
  cyl('trim',a[0],a[1],14.7,25,.19);pinnacle(a[0],a[1],25,3.6,.27,'ornament');
  if(near){ring('trim',f,14.8,.45,.13,.1);disk('recess',f,14.8,.3,.065);}
 }
 fan('roof',[...inner,[31,cz]],24,[31,30,cz]);
 // Square western tower sits on the mapped side projection, set behind the west front.
 const tx=-11.2,tz=3.9,w=8.25;
 box('stone',tx,14.4,tz,w,28.8,w);
 for(const y of [1.25,8.3,16.4,27.9]){
  for(const s of [-1,1]){box('trim',tx,y,tz+s*w/2,w+.12,.38,.45);box('trim',tx+s*w/2,y,tz,.45,.38,w+.12);}
 }
 for(let side=0;side<4;side++){
  const ang=side*Math.PI/2,f=face(tx+Math.sin(ang)*w/2,tz+Math.cos(ang)*w/2,ang);
  // Lower shaft lancet relief has deep dark surrounds and slender paired openings.
  panel('recess',pointed(4.7,17.9),f,9,.075);border('trim',pointed(4.9,18.1),.22,f,9,.17);
  for(const u of [-1.18,1.18]){const ff=face(f.x+Math.cos(ang)*u,f.z-Math.sin(ang)*u,ang);panel('stone',pointed(1.72,15.6),ff,9.4,.19);border('trim',pointed(1.82,15.8),.12,ff,9.3,.25);}
  // Genuine tall open belfry with triple pointed arches; no dark backing cube.
  const holes=[];for(const u of [-2.35,0,2.35]){const p=pointed(1.6,14.1).map(([x,y])=>[x+u,y+30]);holes.push(p);border('trim',p,.2,f,0,.12);}
  solid('stone',rect(w,16.5),f,28.8,.65,holes.map(p=>p.map(([x,y])=>[x,y-28.8])));
  for(const u of [-3.75,3.75])faceLine('trim',f,[u,29],[u,45.5],.35,.2);
  // Open tracery at the terrace, nested square cornices.
  faceLine('trim',f,[-4.4,45.5],[4.4,45.5],.55,.2);
  faceLine('trim',f,[-4.35,47],[4.35,47],.2,.12);
  const cnt=near?12:5;for(let j=0;j<cnt;j++){const u=-4+j*8/(cnt-1);faceLine('trim',f,[u,45.7],[u,46.95],.12,.13);}
 }
 box('stone',tx,29.1,tz,7.05,.3,7.05);box('stone',tx,45.6,tz,8.7,.5,8.7);
 // Eight-sided stone needle and crocketed gablets, restored to 75 m.
 cone('stone',tx,tz,46.05,74.6,4.05,8);cyl('trim',tx,tz,74.55,75,.07,5);
 for(const sx of [-1,1])for(const sz of [-1,1])pinnacle(tx+sx*3.7,tz+sz*3.7,45.85,9.2,.37);
 for(let i=0;i<8;i++){
  const t=i*Math.PI/4,x=tx+Math.sin(t)*4,z=tz+Math.cos(t)*4;
  pinnacle(x,z,45.7,i%2?8.3:6.4,.32);
  const f=face(x,z,t);border('trim',pointed(1.7,5.8),.17,f,46,.18);
  for(let y=50;y<73;y+=near?2.1:7.2){const radius=4.05*(74.6-y)/28.55;cone('trim',tx+Math.sin(t)*(radius+.09),tz+Math.cos(t)*(radius+.09),y,y+.65,near?.27:.24,4);}
  if(near){
   for(let y=55;y<71;y+=3.3){const radius=4.05*(74.6-y)/28.55;const ff=face(tx+Math.sin(t+Math.PI/8)*radius*.925,tz+Math.cos(t+Math.PI/8)*radius*.925,t+Math.PI/8);panel('recess',pointed(.25,.54),ff,y,.05);}
  }
 }
 const root=b.finish();root.traverse(o=>{if(o.isMesh){o.geometry.deleteAttribute('bridgeLift');const old=o.geometry;o.geometry=mergeVertices(old,1e-5);old.dispose();o.geometry.rotateY(ANGLE);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();}});root.userData.elevationDatum=MANIFEST.elevationDatum;return root;
}
