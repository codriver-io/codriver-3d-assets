import * as THREE from 'three';import { SPEC, PALETTES } from './config.js';import { CORE, CURTAIN } from './plan.js';import { kit } from './parts.js';
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,wall,put}=k;
 function slab(ring,y,h,mat='plaster'){
  const s=new THREE.Shape(ring.map(([x,z])=>new THREE.Vector2(x,-z)));const g=new THREE.ExtrudeGeometry(s,{depth:h,bevelEnabled:false});g.rotateX(-Math.PI/2);g.translate(0,y,0);put(g,mat);
 }
 slab(CORE,0,.4);slab(CORE,30.1,.4);
 // Continuous surface: no separate wall end caps at the many mapped curve vertices.
 const transformed=(g,x,z,a,mat)=>{g.rotateY(a);g.translate(x,0,z);put(g,mat);};
 const localQuad=(mat,p,x,z,a)=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p.flat(),3));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();transformed(g,x,z,a,mat);};
 for(let i=0;i<CORE.length-1;i++){
  const [x,z]=CORE[i],[xx,zz]=CORE[i+1],dx=xx-x,dz=zz-z,len=Math.hypot(dx,dz);if(len<.01)continue;
  const a=-Math.atan2(dz,dx),cx=(x+xx)/2,cz=(z+zz)/2;
  const shape=new THREE.Shape([new THREE.Vector2(-len/2,0),new THREE.Vector2(len/2,0),new THREE.Vector2(len/2,30.5),new THREE.Vector2(-len/2,30.5)]);
  if(len>3.7)for(const y of [11.5,20.5,25.7]){
   const l=-.275,r=.275,t=y+1.6,dep=-.35,path=new THREE.Path();path.moveTo(l,y);path.lineTo(r,y);path.lineTo(r,t);path.lineTo(l,t);path.closePath();shape.holes.push(path);
   localQuad('glass',[[l,y,dep],[r,y,dep],[r,t,dep],[l,t,dep]],cx,cz,a);
   localQuad('plaster',[[l,y,0],[l,y,dep],[l,t,dep],[l,t,0]],cx,cz,a);
   localQuad('plaster',[[r,y,dep],[r,y,0],[r,t,0],[r,t,dep]],cx,cz,a);
   localQuad('plaster',[[l,y,dep],[l,y,0],[r,y,0],[r,y,dep]],cx,cz,a);
   localQuad('plaster',[[l,t,0],[l,t,dep],[r,t,dep],[r,t,0]],cx,cz,a);
  }
  transformed(new THREE.ShapeGeometry(shape),cx,cz,a,'plaster');
 }
 // One joined parapet ring; the inner terrace remains open at the original roof slab.
 const outer=CORE.slice(0,-1),cx=outer.reduce((n,p)=>n+p[0],0)/outer.length,cz=outer.reduce((n,p)=>n+p[1],0)/outer.length;
 const inner=outer.map(([x,z])=>[cx+(x-cx)*.88,cz+(z-cz)*.88]);
 for(let i=0;i<outer.length;i++){
  const j=(i+1)%outer.length,a=outer[i],b=outer[j],c=inner[j],d=inner[i];
  k.poly('plaster',[[a[0],30.5,a[1]],[b[0],30.5,b[1]],[b[0],31.55,b[1]],[a[0],31.55,a[1]]],[0,1,2,0,2,3]);
  k.poly('plaster',[[d[0],30.5,d[1]],[c[0],30.5,c[1]],[c[0],31.55,c[1]],[d[0],31.55,d[1]]],[0,2,1,0,3,2]);
  k.poly('plaster',[[a[0],31.55,a[1]],[b[0],31.55,b[1]],[c[0],31.55,c[1]],[d[0],31.55,d[1]]],[0,1,2,0,2,3]);
 }
 // Even stations keep the machicolations independent of the OSM curve tessellation.
 const edges=CORE.slice(0,-1).map((p,i)=>({a:p,b:CORE[i+1],len:Math.hypot(CORE[i+1][0]-p[0],CORE[i+1][1]-p[1])}));
 const total=edges.reduce((n,e)=>n+e.len,0),count=Math.round(total/2.25);
 for(let j=0;j<count;j++){
  let station=(j+.5)*total/count,e=edges[0];for(const q of edges){if(station<=q.len){e=q;break;}station-=q.len;}
  const t=station/e.len,dx=e.b[0]-e.a[0],dz=e.b[1]-e.a[1],nx=-dz/e.len,nz=dx/e.len,a=-Math.atan2(dz,dx),px=e.a[0]+t*dx,pz=e.a[1]+t*dz;
  const g=new THREE.BoxGeometry(1.05,1.65,.95);g.rotateY(a);g.translate(px-nx*.08,32.375,pz-nz*.08);put(g,'plaster');
  if(near){const g=new THREE.BoxGeometry(.35,1.0,.55);g.rotateY(a);g.translate(px+nx*.15,29.9,pz+nz*.15);put(g,'plaster');}
 }
 // Highest north-west keep, rectangular and differently crowned from the low rounded parapet.
 const tx=-3.6,tz=-3.2,w=8.1,d=8.4;
 for(let i=0;i<4;i++){
  const a=i*Math.PI/2,wide=i%2?d:w,r=i%2?w/2:d/2;
  wall('plaster',wide,30.1,40.7,.75,tx+(r-.75)*Math.sin(a),tz+(r-.75)*Math.cos(a),a,[{u:-1.8,y:34,w:.65,h:1.8,arch:true,mat:'glass'},{u:1.8,y:37.2,w:.65,h:1.8,mat:'glass'}]);
  for(let j=0;j<4;j++){
   const g=new THREE.BoxGeometry(1.2,1.3,.85);g.translate(-wide/2+.8+j*(wide-1.6)/3,41.35,r-.3);g.rotateY(a);g.translate(tx,0,tz);put(g,'plaster');
  }
 }
 box('plaster',tx,40.2,tz,w,.45,d);box('plaster',tx,40.55,tz,w+.25,.3,d+.25);
 // A subdued low clay-tile roof inside the lower terrace; cap contacts the terrace slab.
 k.gable('roof',.5,8.5,30.5,34.2,6.0);
 // Attached east curtain wall, with the real mapped alignment baked directly into the source.
 const [a,b]=CURTAIN,dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),ang=-Math.atan2(dz,dx);
 const g=new THREE.BoxGeometry(len+1.5,5.8,3.0);g.rotateY(ang);g.translate((a[0]+b[0])/2+dz/len*1.5-dx/len*.75,2.9,(a[1]+b[1])/2-dx/len*1.5-dz/len*.75);put(g,'trim');
 return k.finish();
}
