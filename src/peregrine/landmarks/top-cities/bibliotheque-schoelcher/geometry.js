import * as THREE from 'three';import { SPEC, PALETTES } from './config.js';import { kit } from './parts.js';
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{box,wall,put,cyl,near}=k;
 box('plaster',0,.5,0,17.8,1,17.7);
 // Front faces west in the architectural frame. Three distinct arched bays carry the facade.
 wall('trim',8.9,1,14.1,.6,-8.5,0,-Math.PI/2,[{u:0,y:1,w:5.6,h:11.0,arch:true,mat:'glass'}]);
 for(const z of [-6.7,6.7])wall('trim',4.45,1,13.8,.6,-8.3,z,-Math.PI/2,[{u:0,y:4.1,w:2.65,h:6.3,arch:true,mat:'glass'}]);
 for(const s of [-1,1]){
  wall('trim',17.8,1,13.8,.6,0,s*8.25,s>0?0:Math.PI,[-5.65,0,5.65].map(u=>({u,y:4.1,w:3.6,h:6.3,arch:true,mat:'glass'})));
 }
 wall('trim',17.7,1,13.8,.6,8.3,0,Math.PI/2,[-5.5,0,5.5].map(u=>({u,y:4.1,w:3.2,h:6.2,arch:true,mat:'glass'})));
 function frontPart(g,mat,x,z,a){
  // Rear trim faces are buried in opaque masonry; retaining them creates false depth cycles.
  if(g.type==='BoxGeometry'){const idx=g.index.array,n=g.attributes.normal,keep=[];for(let i=0;i<idx.length;i+=3)if(n.getZ(idx[i])>-.9&&(!g.userData.hideEnds||Math.abs(n.getY(idx[i]))<.9||g.userData.keepTop&&n.getY(idx[i])>.9||g.userData.keepBottom&&n.getY(idx[i])<-.9))keep.push(idx[i],idx[i+1],idx[i+2]);g.setIndex(keep);g.clearGroups();}
  if(g.userData.clipZ){
   const min=g.userData.clipZ,ps=g.attributes.position,idx=g.index.array,out=[];
   for(let i=0;i<idx.length;i+=3){const poly=[0,1,2].map(k=>new THREE.Vector3().fromBufferAttribute(ps,idx[i+k]).toArray()),cut=[];for(let j=0;j<poly.length;j++){const p=poly[j],q=poly[(j+1)%poly.length],dp=p[2]-min,dq=q[2]-min;if(dp>=-1e-8)cut.push(p);if((dp>=0)!==(dq>=0)){const t=dp/(dp-dq);cut.push(p.map((v,k)=>v+(q[k]-v)*t));}}for(let j=1;j<cut.length-1;j++)out.push(...cut[0],...cut[j],...cut[j+1]);}
   const next=new THREE.BufferGeometry();next.setAttribute('position',new THREE.Float32BufferAttribute(out,3));next.computeVertexNormals();g.dispose();g=next;
  }
  g.rotateY(a);g.translate(x,0,z);put(g,mat);}
 function bay(x,z,a,u,w,y,h){
  const spring=y+h-w/2;
  for(let ring=0;ring<(near?3:0);ring++){
   const g=new THREE.TorusGeometry(w/2+.15+ring*.23,.11,3,near?20:10,Math.PI);g.translate(u,spring,.95);frontPart(g,ring===1?'gold':'trim',x,z,a);
  }
  if(near)for(const side of [-1,1]){const g=new THREE.BoxGeometry(.20,spring-y,.28);g.translate(u+side*(w/2+.23),(y+spring)/2,.74);frontPart(g,'trim',x,z,a);}
  // Every glazed bay keeps a coarse grid in far; entrance mullions extend to its sill.
  for(const j of (near?[-2,-1,0,1,2]:[-1,1])){
   const xx=u+j*w/6,top=spring+Math.sqrt(Math.max(0,(w/2)**2-(xx-u)**2));const g=new THREE.BoxGeometry(near?.075:.12,top-y,.13);g.translate(xx,(top+y)/2,.56);frontPart(g,'trim',x,z,a);
  }
  for(const yy of (near?[y+2,y+4]:[y+h/3,y+2*h/3])){const g=new THREE.BoxGeometry(w,near?.08:.12,.13);g.translate(u,yy,.56);frontPart(g,'trim',x,z,a);}
 }
 bay(-8.5,0,-Math.PI/2,0,5.6,1,11.0);
 for(const z of [-6.7,6.7])bay(-8.3,z,-Math.PI/2,0,2.65,4.1,6.3);
 for(const s of [-1,1])for(const u of [-5.65,0,5.65])bay(0,s*8.25,s>0?0:Math.PI,u,3.6,4.1,6.3);
 for(const u of [-5.5,0,5.5])bay(8.3,0,Math.PI/2,u,3.2,4.1,6.2);
 // Alternating physical pier sections, with no stacked facade decals.
 for(let face=0;face<4;face++){
  const a=face*Math.PI/2,band=face===3?12.95:11.6,columns=face===3?[-8.45,-4.1,4.1,8.45]:[-8.45,-2.825,2.825,8.45];
  for(const u of columns)for(let row=0;row<13;row++){
   const lo=1.025+row*.95,hi=lo+.95,parts=[[lo,Math.min(hi,band-.225)],[Math.max(lo,band+.225),hi]];
   for(const [y0,y1] of parts)if(y1-y0>.01){const g=new THREE.BoxGeometry(.48,y1-y0,.34);g.userData.hideEnds=true;g.userData.keepTop=row===12&&Math.abs(y1-hi)<1e-6;g.userData.keepBottom=row===0&&Math.abs(y0-lo)<1e-6;g.translate(u,(y0+y1)/2,face===3&&Math.abs(u)<5?9.15:8.78);if(face===3&&Math.abs(u)<5)g.userData.clipZ=9.1;frontPart(g,Math.abs(u)>8?'trim':row%2?'pink':'trim',0,0,a);}
  }
  const g=new THREE.BoxGeometry(17.9,.45,.4);g.translate(0,band,face===3?9.2:8.8);frontPart(g,'trim',0,0,a);
 }
 // Shallow lower hipped roof, with a projecting central chalet gable on the entrance face.
 const hip=new THREE.CylinderGeometry(5.0*Math.SQRT2,10.4*Math.SQRT2,2.8,4);hip.rotateY(Math.PI/4);hip.translate(0,15.2,0);put(hip,'roof');
 const gp=[[-10.4,13.8,-5.25],[-10.4,13.8,5.25],[-10.4,17.5,0],[-5.1,13.8,-5.25],[-5.1,13.8,5.25],[-5.1,17.5,0]];
 k.poly('roof',gp,[3,5,4,0,5,3,0,2,5,1,5,2,1,4,5,0,4,1,0,3,4]);
 // Vertical upper lattice gallery under the gable, with a restrained triangular tympanum.
 const tympanum=new THREE.Shape([new THREE.Vector2(-5.25,13.8),new THREE.Vector2(5.25,13.8),new THREE.Vector2(0,17.5)]);
 for(let i=0;i<7;i++){
  const u=-3.6+i*1.2,h=17.5-(Math.abs(u)+.42)/5.25*3.7-14.15,w=.83,path=new THREE.Path();path.moveTo(u-w/2,14.0);path.lineTo(u+w/2,14);path.lineTo(u+w/2,14+h);path.lineTo(u-w/2,14+h);path.closePath();tympanum.holes.push(path);
  const g=new THREE.PlaneGeometry(w,h);g.translate(u,14+h/2,-.12);frontPart(g,'gold',-10.4,0,-Math.PI/2);
 }
 frontPart(new THREE.ShapeGeometry(tympanum),'wood',-10.4,0,-Math.PI/2);
 // Bracket side faces are clipped to the masonry face and roof underside;
 // buried end caps are omitted, so their contacts cannot create reciprocal depth ranks.
 function bracket(u,face){
  const angle=face*Math.PI/2,wallZ=face===1?8.9:face===3?(Math.abs(u)<5?9.1:8.9):8.85;
  const start=new THREE.Vector3(u,12.2,wallZ),end=new THREE.Vector3(u,13.8,10.0),dir=end.clone().sub(start),len=dir.length();
  const g=new THREE.BoxGeometry(.16,len,.18);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir.clone().normalize()));g.translate(...start.clone().add(end).multiplyScalar(.5).toArray());
  const p=g.attributes.position,n=g.attributes.normal,ix=g.index.array,positions=[];
  const clip=(poly,dist)=>{const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=dist(a),db=dist(b);if(da>=-1e-8)out.push(a);if((da>=0)!==(db>=0)){const t=da/(da-db);out.push(a.map((v,k)=>v+(b[k]-v)*t));}}return out;};
  for(let i=0;i<ix.length;i+=3){const normal=new THREE.Vector3().fromBufferAttribute(n,ix[i]);if(Math.abs(normal.dot(dir.clone().normalize()))>.99)continue;let poly=[0,1,2].map(k=>new THREE.Vector3().fromBufferAttribute(p,ix[i+k]).toArray());poly=clip(clip(poly,p=>p[2]-wallZ),p=>13.8-p[1]);for(let j=1;j<poly.length-1;j++)positions.push(...poly[0],...poly[j],...poly[j+1]);}
  const out=new THREE.BufferGeometry();out.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));out.computeVertexNormals();out.rotateY(angle);put(out,'brace');g.dispose();
 }
 for(let face=0;face<4;face++)for(const u of (face===3?[-7.2,7.2]:[-7,-3.5,0,3.5,7]))bracket(u,face);
 // Main clerestory and the broad eaves beneath the glass cupola.
 for(let face=0;face<4;face++){
  const a=face*Math.PI/2;
  wall('wood',9.2,16.6,19.5,.4,4.2*Math.sin(a),4.2*Math.cos(a),a,Array.from({length:6},(_,i)=>({u:-3.75+i*1.5,y:16.95,w:1.0,h:2.0,mat:'gold'})));
 }
 box('roof',0,16.6,0,10.2,.35,10.2);box('trim',0,19.65,0,10.2,.4,10.2);
 const profile=[[5.0,19.85],[4.9,20.5],[4.2,21.5],[3.0,22.4],[1.0,22.8],[0,22.8]],seg=near?32:16;
 const dome=new THREE.LatheGeometry(profile.map(p=>new THREE.Vector2(...p)),seg);put(dome,'glass');
 for(let i=0;i<(near?24:16);i++){
  const a=i*Math.PI*2/(near?24:16);
  for(let j=0;j<profile.length-1;j++){
   const p=profile[j],q=profile[j+1];k.b.bar('trim',[p[0]*Math.sin(a),p[1],p[0]*Math.cos(a)],[q[0]*Math.sin(a),q[1],q[0]*Math.cos(a)],.075,.075);
  }
 }
 cyl('trim',0,0,.10,.10,22.8,23.65,6);
 // Mapped service annex behind the hall; no unrelated neighboring buildings are owned.
 box('plaster',11.2,4.2,0,4.6,8.4,9.5);box('roof',11.2,8.5,0,4.6,.25,9.7);
 // Entry steps stay within the small mapped westward spur and start at local grade.
 for(let i=0;i<6;i++)box('plaster',-13.2+i*.72,(i+1)*.16/2,0,i===5?1.4:.75,(i+1)*.16,2.1);
 return k.finish();
}
