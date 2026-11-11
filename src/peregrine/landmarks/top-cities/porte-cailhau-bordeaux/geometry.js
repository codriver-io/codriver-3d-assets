import * as THREE from 'three';import { SPEC, PALETTES } from './config.js';import { kit } from './parts.js';
export const OUTER_DORMER={width:1.9,frontWidth:13.7,base:22.25,eave:24.0,apex:25.2,front:2.15,coneBase:21.7,coneTip:29.2,coneRadius:2.3};
export const coneRadius=y=>2.3*(29.2-y)/7.5;
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{box,cyl,wall,put,near,lathe}=k;
 for(const s of [-1,1]){
  wall('plaster',10.6,0,21.3,.65,0,s*2.05,s>0?0:Math.PI,[{u:0,y:0,w:3.45,h:6.1,arch:true},...[-2.9,2.9].map(u=>({u,y:12.0,w:1.7,h:2.4,mat:'glass'})),{u:0,y:16.7,w:1.35,h:2.5,mat:'glass'}]);
  for(const x of [-2.9,2.9]){box('plaster',x,13.1,s*2.83,.15,2.4,.32);box('plaster',x,13.1,s*2.83,1.7,.15,.32);}


  for(let x=-5;x<=5;x+=near?.7:1.4)box('plaster',x,20,s*2.63,.35,1.45,.6);
  // Brackets under the machicolated cornice; upper decorative window surround.
  for(const x of [-4.6,4.6])box('plaster',x,17.5,s*2.58,.3,3.6,.35);
  // Simplified connected stone royal figure in its central niche.
  box('plaster',0,9.1,s*2.75,2.0,.3,.7);
  lathe('plaster',0,s*2.68,[[0,9.25],[.4,9.25],[.31,10.5],[.38,11],[.18,11.25],[0,11.25]],near?10:6);
  const g=new THREE.SphereGeometry(.22,near?10:6,6);g.translate(0,11.4,s*2.68);put(g,'plaster');
 }
 box('plaster',0,7.7,0,10.6,.45,5.0);box('plaster',0,20.9,0,11.4,.6,5.5);
 for(const x of [-4.5,4.5]){
  cyl('plaster',x,0,2.05,2.05,0,21.3,near?24:16);
  cyl('plaster',x,0,2.35,2.35,20.9,21.7,near?24:16);
  // Subtract the gabled dormer volume from the front half of each cone.
  {const g=new THREE.ConeGeometry(2.3,7.5,near?24:12);g.translate(x,25.45,0);const p=g.attributes.position,ix=g.index.array,out=[],d=OUTER_DORMER;
   const clip=(poly,f)=>{const a=[];for(let j=0;j<poly.length;j++){const p=poly[j],q=poly[(j+1)%poly.length],dp=f(p),dq=f(q);if(dp>=-1e-7)a.push(p);if((dp>=0)!==(dq>=0)){const t=dp/(dp-dq);a.push(p.map((v,i)=>v+(q[i]-v)*t));}}return a;};
   const faces=[p=>p[2],p=>p[0]-x+d.width/2,p=>x+d.width/2-p[0],p=>p[1]-d.base,p=>d.apex-p[1]-(d.apex-d.eave)*(p[0]-x)/(d.width/2),p=>d.apex-p[1]+(d.apex-d.eave)*(p[0]-x)/(d.width/2)];
   for(let i=0;i<ix.length;i+=3){let inside=[0,1,2].map(j=>new THREE.Vector3().fromBufferAttribute(p,ix[i+j]).toArray());for(const f of faces){const outside=clip(inside,p=>-f(p));for(let j=1;j<outside.length-1;j++)out.push(...outside[0],...outside[j],...outside[j+1]);inside=clip(inside,f);if(inside.length<3)break;}}
   const cut=new THREE.BufferGeometry();cut.setAttribute('position',new THREE.Float32BufferAttribute(out,3));cut.computeVertexNormals();put(cut,'roof');g.dispose();
  }
  {const d=OUTER_DORMER;
   wall('plaster',d.width,d.base,d.eave,.35,x,d.front-.35,0,[{u:0,y:22.55,w:1.0,h:1.25,mat:'shadow'}]);
   k.poly('plaster',[[x-d.width/2,d.eave,d.front],[x+d.width/2,d.eave,d.front],[x,d.apex,d.front]],[0,1,2]);
   // Side cheeks stop exactly at the retained conical surface.
   for(const sign of [-1,1])for(let j=0;j<(near?4:2);j++){
    const n=near?4:2,y0=d.base+(d.eave-d.base)*j/n,y1=d.base+(d.eave-d.base)*(j+1)/n,xx=x+sign*d.width/2,z0=Math.sqrt(coneRadius(y0)**2-(d.width/2)**2),z1=Math.sqrt(coneRadius(y1)**2-(d.width/2)**2);
    const p=[[xx,y0,z0],[xx,y0,d.front],[xx,y1,d.front],[xx,y1,z1]];k.poly('plaster',p,sign>0?[0,2,1,0,3,2]:[0,1,2,0,2,3]);
   }
   // Two slate slopes meet the curved cone along their rear edge.
   for(const sign of [-1,1])for(let j=0;j<(near?4:2);j++){
    const n=near?4:2,u0=sign*d.width/2*j/n,u1=sign*d.width/2*(j+1)/n,y0=d.apex-(d.apex-d.eave)*Math.abs(u0)/(d.width/2),y1=d.apex-(d.apex-d.eave)*Math.abs(u1)/(d.width/2),z0=Math.sqrt(Math.max(0,coneRadius(y0)**2-u0*u0)),z1=Math.sqrt(Math.max(0,coneRadius(y1)**2-u1*u1));
    const p=[[x+u0,y0,d.front],[x+u1,y1,d.front],[x+u1,y1,z1],[x+u0,y0,z0]];k.poly('roof',p,sign>0?[0,1,2,0,2,3]:[0,2,1,0,3,2]);
   }
   box('plaster',x,23.175,2.02,1.12,.11,.18);box('plaster',x,23.175,2.02,.11,1.37,.18);
  }
  for(const y of [7.7,20.9])cyl('plaster',x,0,2.16,2.16,y,y+.45,near?24:16);
 }
 // Roof support stays closed beneath the five-pointed silhouette.
 box('plaster',0,21.5,0,9.5,.55,5.0);
 cyl('roof',0,0,3.4,1.0,21.7,28.6,8);
 for(const x of [-2.35,2.35]){
  cyl('plaster',x,1.35,.85,.85,20.7,23,near?12:8);cyl('roof',x,1.35,1.05,0,23,30.1,near?16:8);
 }
 // Central dormer with glazed opening on the river and town sides.
 for(const s of [-1,1]){
  wall('plaster',1.7,22.45,26.15,.6,0,s*1.9,s>0?0:Math.PI,[{u:0,y:23.5,w:.75,h:1.8,mat:'glass'}]);
  const p=[[-.85,26.15,s*2.5],[.85,26.15,s*2.5],[0,28.1,s*2.5],[-.85,26.15,s*.9],[.85,26.15,s*.9],[0,28.1,s*.9]];
  const front=s>0?[0,1,2]:[0,2,1];k.poly('plaster',p,front);
  const roof=[0,2,3,2,5,3,1,4,2,2,4,5,3,5,4];k.poly('roof',p,s>0?roof:roof.flatMap((_,i)=>i%3===0?[roof[i],roof[i+2],roof[i+1]]:[]));
 }
 cyl('roof',0,0,1.0,.68,28.6,30.0,8);cyl('plaster',0,0,.8,.8,30,30.3,8);
 for(let i=0;i<8;i++){const a=i*Math.PI/4;box('plaster',.61*Math.sin(a),31.15,.61*Math.cos(a),.14,1.7,.14);}
 cyl('plaster',0,0,.84,.84,32,32.3,8);cyl('roof',0,0,1.0,.02,32.3,34.8,8);cyl('plaster',0,0,.05,.05,34.8,35,6);
 return k.finish();
}
