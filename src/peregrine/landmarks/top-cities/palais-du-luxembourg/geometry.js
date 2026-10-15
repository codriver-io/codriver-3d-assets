import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { MASSES, world } from './palais-du-luxembourg-plan.js';

// All source coordinates are palace metres. Rotation and the 5 m axis offset are
// baked at emission; no app-runtime dependencies, textures, or third-party meshes.
const bounds=r=>({u0:Math.min(...r.map(p=>p[0])),u1:Math.max(...r.map(p=>p[0])),v0:Math.min(...r.map(p=>p[1])),v1:Math.max(...r.map(p=>p[1]))});
const inside=(u,v,r)=>{let yes=false;for(let i=0,j=r.length-1;i<r.length;j=i++){const a=r[i],c=r[j];if((a[1]>v)!==(c[1]>v)&&u<(c[0]-a[0])*(v-a[1])/(c[1]-a[1])+a[0])yes=!yes;}return yes;};

export function create({detail='near'}={}) {
 const near=detail!=='far', b=assetBuilder({...SPEC,palette:PALETTES.light},near?'near':'far');
 function poly(mat,pts,normal){
  if(pts.length<3)return;
  const p=pts.map(q=>new THREE.Vector3(...world(...q)));
  const n=new THREE.Vector3().crossVectors(p[1].clone().sub(p[0]),p[2].clone().sub(p[0]));
  if(normal && n.dot(new THREE.Vector3(...world(normal[0],normal[1],normal[2])).sub(new THREE.Vector3(...world(0,0,0))))<0)p.reverse();
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p.flatMap(v=>v.toArray()),3));
  const idx=[];for(let i=1;i<p.length-1;i++)idx.push(0,i,i+1);g.setIndex(idx);g.computeVertexNormals();b.put(g,mat);
 }
 function box(mat,u,y,v,w,h,d){
  const g=new THREE.BoxGeometry(w,h,d),p=g.attributes.position;
  for(let i=0;i<p.count;i++)p.setXYZ(i,...world(u+p.getX(i),y+p.getY(i),v+p.getZ(i)));
  g.computeVertexNormals();b.put(g,mat);
 }
 function cylinder(mat,u,v,y,h,r,rt=r,n=near?12:8){
  const g=new THREE.CylinderGeometry(rt,r,h,n,1,false),p=g.attributes.position;
  for(let i=0;i<p.count;i++)p.setXYZ(i,...world(u+p.getX(i),y+h/2+p.getY(i),v+p.getZ(i)));
  g.computeVertexNormals();b.put(g,mat);
 }
 function beam(mat,a,c,w){b.bar(mat,world(...a),world(...c),w,w);}
 function wallPrism(r,h,y0=0){
  const signed=r.reduce((s,p,i)=>s+p[0]*r[(i+1)%r.length][1]-r[(i+1)%r.length][0]*p[1],0);
  for(let i=0;i<r.length;i++){
   const a=r[i],c=r[(i+1)%r.length],du=c[0]-a[0],dv=c[1]-a[1];
   poly('stone',[[a[0],y0,a[1]],[c[0],y0,c[1]],[c[0],h,c[1]],[a[0],h,a[1]]],signed>0?[dv,0,-du]:[-dv,0,du]);
  }
  // Roof meshes close the top. No hidden horizontal slab under sloping roofs.
 }
 function hip(r,y,top,pavilion=false){
  const q=bounds(r),cx=(q.u0+q.u1)/2,cz=(q.v0+q.v1)/2;
  const x0=q.u0+.55,x1=q.u1-.55,z0=q.v0+.55,z1=q.v1-.55;
  const ix=pavilion?(x1-x0)*.28:Math.min(3,(x1-x0)*.39),iz=pavilion?(z1-z0)*.28:Math.min(3,(z1-z0)*.39);
  const X0=x0+ix,X1=x1-ix,Z0=z0+iz,Z1=z1-iz;
  const low=y-.15;
  for(const p of [
   [[x0,low,z0],[x1,low,z0],[X1,top,Z0],[X0,top,Z0]],
   [[x1,low,z0],[x1,low,z1],[X1,top,Z1],[X1,top,Z0]],
   [[x1,low,z1],[x0,low,z1],[X0,top,Z1],[X1,top,Z1]],
   [[x0,low,z1],[x0,low,z0],[X0,top,Z0],[X0,top,Z1]],
   [[X0,top,Z0],[X1,top,Z0],[X1,top,Z1],[X0,top,Z1]],
  ])poly('roof',p,[0,1,0]);
  if(!pavilion)return;
  // Two substantial pale chimneys per pavilion, with flared stone crowns.
  for(const side of [-1,1]){
   const u=cx+side*(x1-x0)*.34,v=cz-(z1-z0)*.16;
   box('stone',u,30.3,v,1.15,7.4,1.1);
   box('stone',u,34.05,v,1.65,.42,1.5);
   if(near)for(const a of [-.4,.4])box('roof',u+a,34.42,v,.21,.35,.3);
  }
  // Separate dormer windows and pedimented hoods in the great pavilion roofs.
  for(const s of [-1,1])for(const u of [cx-4.4,cx,cx+4.4]){
   const v=cz+s*((z1-z0)/2-1.0);
   box('stone',u,24.6,v,1.65,1.4,1.2);
   poly('glass',[[u-.48,24.1,v+s*.67],[u+.48,24.1,v+s*.67],[u+.48,25.05,v+s*.67],[u-.48,25.05,v+s*.67]],[0,0,s]);
   poly('roof',[[u-.96,25.3,v-s*.45],[u+.96,25.3,v-s*.45],[u,26.05,v+s*.9]],[0,1,0]);
  }
 }
 // Surface rectangles use an outward normal. Stone surrounds never span glazing.
 function facade(a,c,h,{pavilion=false,plain=false,id=null}={}){
  if(id===1460356439&&Math.abs(a[1]-c[1])<.4&&Math.abs(c[0]-a[0])>20){
   const left=Math.min(a[0],c[0]),right=Math.max(a[0],c[0]),v=(a[1]+c[1])/2;
   for(const [lo,hi] of [[left,-6.7],[6.7,right]]){
    if(c[0]>a[0])facade([lo,v],[hi,v],h,{pavilion,plain,id});
    else facade([hi,v],[lo,v],h,{pavilion,plain,id});
   }
   return;
  }
  const du=c[0]-a[0],dv=c[1]-a[1],L=Math.hypot(du,dv);if(L<2.2)return;
  const tx=du/L,tz=dv/L,nx=tz,nz=-tx;
  const pt=(t,y,off)=>[a[0]+tx*t+nx*off,y,a[1]+tz*t+nz*off];
  const face=(mat,t0,t1,y0,y1,off)=>poly(mat,[pt(t0,y0,off),pt(t1,y0,off),pt(t1,y1,off),pt(t0,y1,off)],[nx,0,nz]);
  const strip=(t0,t1,y0,y1,off=.35)=>{
   face('trim',t0,t1,y0,y1,off);
   if(near&&t1-t0<1.5&&(y1-y0>2||off===.73)){
    poly('trim',[pt(t0,y0,0),pt(t0,y0,off),pt(t0,y1,off),pt(t0,y1,0)],[-tx,0,-tz]);
    poly('trim',[pt(t1,y0,off),pt(t1,y0,0),pt(t1,y1,0),pt(t1,y1,off)],[tx,0,tz]);
   }
   if(t1-t0>4&&y1-y0<.9){poly('trim',[pt(t0,y1,0),pt(t0,y1,off),pt(t1,y1,off),pt(t1,y1,0)],[0,1,0]);}
  };
  for(const [y0,y1] of [[.1,.65],[7.9,8.45],[15.1,15.65],[h-.7,h+.12]])if(y1<h+.2)strip(.05,L-.05,y0,y1,near?.58:.20);
  const count=id===1460356441&&L>9?3:Math.max(1,Math.round(L/(pavilion?6.5:5.8))),step=L/count;
  const rows=h>22?[{y:3.8,w:2.05,h:4.4,arch:true},{y:11.7,w:1.9,h:4.8},{y:19.6,w:1.9,h:4.8}]:h>18?[{y:3.8,w:2,h:4.4,arch:true},{y:11.7,w:1.9,h:4.85},{y:18,w:1.5,h:2.8}]:h>12?[{y:3.8,w:2.05,h:4.4,arch:true},{y:11.6,w:1.9,h:4.8}]:[{y:3.8,w:2,h:4.4,arch:true}];
  for(let i=0;i<count;i++){
   const t=step*(i+.5);if(L<3.4)continue;
   if(id===1460356439&&Math.abs(a[1]-c[1])<.4&&Math.abs(a[1]-28.8)<1&&Math.abs(a[0]+tx*t)<7)continue;
   for(const row of rows){
    const sample=pt(t,row.y,.40);
    if(id&&ordered.some(other=>other.id!==id&&other.h>row.y+1&&inside(sample[0],sample[2],other.ring)))continue;
    const w=Math.min(row.w,step*.55),l=t-w/2,r=t+w/2,bottom=row.y-row.h/2,top=row.y+row.h/2;
    const material=(i%5===2&&row.y>7)?'glow':'glass';
    if(row.arch){
     const spring=top-w/2;face(material,l,r,bottom,spring,.26);
     const n=near?8:5;
     for(let j=0;j<n;j++){
      const aa=Math.PI*j/n,ab=Math.PI*(j+1)/n;
      const q0=pt(t+w/2*Math.cos(aa),spring+w/2*Math.sin(aa),.26),q1=pt(t+w/2*Math.cos(ab),spring+w/2*Math.sin(ab),.26);
      poly(material,[pt(t,spring,.26),q0,q1],[nx,0,nz]);
      const rr=w/2+.28;
      if(near)
      poly('stone',[pt(t+w/2*Math.cos(aa),spring+w/2*Math.sin(aa),.43),pt(t+w/2*Math.cos(ab),spring+w/2*Math.sin(ab),.43),pt(t+rr*Math.cos(ab),spring+rr*Math.sin(ab),.43),pt(t+rr*Math.cos(aa),spring+rr*Math.sin(aa),.43)],[nx,0,nz]);
     }
     if(near){strip(l-.27,l,bottom-.15,spring);strip(r,r+.27,bottom-.15,spring);}
    }else{
     face(material,l,r,bottom,top,.26);
     if(near){strip(l-.26,l,bottom-.12,top+.12,.43);strip(r,r+.26,bottom-.12,top+.12,.43);
     strip(l-.26,r+.26,top,top+.26,.43);}
    }
    if(near)strip(l-.32,r+.32,bottom-.22,bottom,.45);
    if(near){
     face('frame',t-.065,t+.065,bottom,top-(row.arch?w/2:0),id===1460356441?.64:.44);
     face('frame',l,r,row.y-.07,row.y+.07,id===1460356441?.64:.44);
     if(!row.arch)strip(l-.45,r+.45,top+.38,top+.65,.53);
    }
   }
  }
  if(pavilion){
   const t=L/2,w=2.3,y=h+.12,off=near?.60:.26;
   poly('stone',[pt(t-w,y,off),pt(t+w,y,off),pt(t,y+1.65,off)],[nx,0,nz]);
   poly('stone',[pt(t-w,y,0),pt(t-w,y,off),pt(t,y+1.65,off),pt(t,y+1.65,0)],[0,1,0]);
   poly('stone',[pt(t,y+1.65,0),pt(t,y+1.65,off),pt(t+w,y,off),pt(t+w,y,0)],[0,1,0]);
  }
  // Rusticated vertical orders between bays, each with a grounded base and capital.
  if(near&&!plain)for(let i=0;i<=count;i++){
   const t=Math.max(.48,Math.min(L-.48,step*i)),w=pavilion?.48:.34;
   for(const [lo,hi] of [[.7,7.8],[8.45,15.1],[15.65,h-.8]]){
    if(hi-lo<1.1)continue;
    strip(t-w,t+w,lo,hi,.46);
    strip(t-w-.12,t+w+.12,lo,lo+.3,.58);strip(t-w-.15,t+w+.15,hi-.35,hi,.59);
    if(pavilion)for(let y=lo+.5;y<hi-.6;y+=.86)strip(t-w-.13,t+w+.13,y,y+.46,.73);
   }
  }
 }
 const ordered=MASSES.map(m=>{
  if(m.h!==23.6&&m.id!==1460226387&&m.id!==1460226392)return {...m};
  const q=bounds(m.ring),d=.65;
  return {...m,ring:[[q.u0+d,q.v0+d],[q.u1-d,q.v0+d],[q.u1-d,q.v1-d],[q.u0+d,q.v1-d]]};
 });
 for(const m of ordered){
  wallPrism(m.ring,m.h);
  const pavilion=m.h===23.6;
  if(m.id!==1460356441)hip(m.ring,m.h,m.roof,pavilion);
  let ring=m.ring;
  const area=ring.reduce((s,p,i)=>s+p[0]*ring[(i+1)%ring.length][1]-ring[(i+1)%ring.length][0]*p[1],0);
  if(area<0)ring=[...ring].reverse();
  for(let i=0;i<ring.length;i++){
   const a=ring[i],c=ring[(i+1)%ring.length],du=c[0]-a[0],dv=c[1]-a[1],L=Math.hypot(du,dv);if(L<2.2)continue;
   const u=(a[0]+c[0])/2+dv/L*.65,v=(a[1]+c[1])/2-du/L*.65;
   // Adjacent ranges hide their meeting walls; no window grids inside another mass.
   if(ordered.some(other=>other.id!==m.id&&other.h>=m.h-.1&&inside(u,v,other.ring)))continue;
   facade(a,c,m.h,{pavilion,id:m.id});
  }
 }
 // West return included in the main OSM multipolygon, omitted by part-only captures.
 const annex=[[-72,-95.3],[-44.5,-97],[-44.5,-85.7],[-72,-84.8]];
 wallPrism(annex,14.8);hip(annex,14.8,18.5);
 facade(annex[0],annex[1],14.8,{plain:true});facade(annex[2],annex[3],14.8,{plain:true});
 // Court-facing corps-de-logis portico and its blocked-in classical order.
 for(const v of [-16.2,40.5])for(const u of (v>0?[-3.2,-1.4,2.1,3.9]:[-4.9,-3.1,3.1,4.9])){
  cylinder('stone',u,v,.6,14.5,.40,.36,near?8:5);
  cylinder('stone',u,v,.6,.7,.57,.57,8);cylinder('stone',u,v,14.7,.5,.62,.62,8);
  if(near)for(let y=1.6;y<14.7;y+=.8)cylinder('stone',u,v,y,.12,.44,.44,8);
 }
 // Rue de Vaugirard retains its smaller circular dome; the garden shell below is square-plan.
 function dome(u,v,y,r,h,lanternTop){
  const segments=near?24:16,rings=near?7:4;
  for(let j=0;j<rings;j++)for(let i=0;i<segments;i++){
   const t0=j/rings*Math.PI/2,t1=(j+1)/rings*Math.PI/2,a=i/segments*Math.PI*2,c=(i+1)/segments*Math.PI*2;
   const at=(t,a,extra=0)=>[u+(r*Math.cos(t)+extra)*Math.cos(a),y+h*Math.sin(t),v+(r*Math.cos(t)+extra)*Math.sin(a)];
   poly('roof',[at(t0,a),at(t0,c),at(t1,c),at(t1,a)],[Math.cos((a+c)/2),1,Math.sin((a+c)/2)]);
  }
  // Lead meridians follow the dome rather than standing above the crown.
  if(near)for(let i=0;i<8;i++)for(let j=0;j<rings-1;j++){
   const a=i/8*Math.PI*2,t0=j/rings*Math.PI/2,t1=(j+1)/rings*Math.PI/2;
   const at=(t,a)=>[u+(r*Math.cos(t)+.09)*Math.cos(a),y+h*Math.sin(t)+.08,v+(r*Math.cos(t)+.09)*Math.sin(a)];
   poly('metal',[at(t0,a-.02),at(t0,a+.02),at(t1,a+.02),at(t1,a-.02)],[Math.cos(a),1,Math.sin(a)]);
  }
  const base=y+h-.12,cap=lanternTop-.7;
  cylinder('metal',u,v,base,.3,1.0,1.0);
  for(let i=0;i<8;i++){
   const a=i/8*Math.PI*2;
   cylinder('stone',u+.69*Math.cos(a),v+.69*Math.sin(a),base+.15,cap-base,.105,.105,near?6:4);
  }
  cylinder('metal',u,v,cap,.7,1.05,.12);
 }
 // Garden pavilion: four curved slate faces spring directly from the full-width
 // square/rectangular eaves. No cylindrical drum or narrow round cap.
 const domeSteps=near?8:5,across=near?6:3;
 const shell=(side,s,t)=>{
  const f=.16+.84*Math.cos(t*Math.PI/2),x=5.75*f,z=4.6*f,y=21.1+7.1*Math.sin(t*Math.PI/2);
  return side===0?[s*x,y,34.5-z]:side===1?[x,y,34.5+s*z]:side===2?[-s*x,y,34.5+z]:[-x,y,34.5-s*z];
 };
 for(let side=0;side<4;side++)for(let j=0;j<domeSteps;j++)for(let i=0;i<across;i++){
  const s0=-1+2*i/across,s1=-1+2*(i+1)/across,t0=j/domeSteps,t1=(j+1)/domeSteps;
  poly('roof',[shell(side,s0,t0),shell(side,s1,t0),shell(side,s1,t1),shell(side,s0,t1)],[0,1,0]);
 }
 poly('roof',[[-.92,28.2,33.764],[.92,28.2,33.764],[.92,28.2,35.236],[-.92,28.2,35.236]],[0,1,0]);
 // Open lantern held between its metal crown plinth and conical roof cap.
 cylinder('metal',0,34.5,27.98,.3,1,1);
 for(let i=0;i<8;i++){
  const a=i*Math.PI/4;
  cylinder('stone',.69*Math.cos(a),34.5+.69*Math.sin(a),28.13,2.72,.105,.105,near?6:4);
 }
 cylinder('metal',0,34.5,30.7,.7,1.05,.12);
 // Broad segmental stone pediment rises above the central three bays. Its
 // curved cornice returns into the pavilion and physically carries the clock.
 const pedimentN=near?16:10;
 for(let i=0;i<pedimentN;i++){
  const x0=-5.75+11.5*i/pedimentN,x1=-5.75+11.5*(i+1)/pedimentN;
  const yy=x=>21.1+3.15*Math.sqrt(Math.max(0,1-(x/5.75)**2));
  poly('stone',[[x0,21.05,39.43],[x1,21.05,39.43],[x1,yy(x1),39.43],[x0,yy(x0),39.43]],[0,0,1]);
  poly('stone',[[x0,yy(x0),39.05],[x0,yy(x0),39.60],[x1,yy(x1),39.60],[x1,yy(x1),39.05]],[0,1,0]);
 }

 // Flag mast (flag cloth deliberately omitted to keep both-LOD silhouettes stable).
 cylinder('metal',0,34.5,31.3,2.5,.055,.055,5);
 // Garden clock at the curved central pediment: pale dial and dark hands.
 function clock(u,v,y,out){
  const points=[];for(let i=0;i<24;i++){const a=i*Math.PI/12;points.push([u+1.05*Math.cos(a),y+1.05*Math.sin(a),v]);}
  poly('metal',points,[0,0,out]);
  const inner=[];for(let i=0;i<24;i++){const a=i*Math.PI/12;inner.push([u+.78*Math.cos(a),y+.78*Math.sin(a),v+out*.22]);}poly('frame',inner,[0,0,out]);
  if(near){beam('glass',[u,y,v+out*.35],[u-.38,y+.42,v+out*.35],.1);beam('glass',[u,y,v+out*.35],[u+.5,y+.10,v+out*.35],.1);}
 }
 clock(0,39.72,22.35,1);
 // Curved pediment and flanking allegorical figures, modeled as draped bodies,
 // heads and bent arms, not a row of anonymous spheres.
 for(const side of [-1,1]){
  const u=side*2.7,v=39.6;
  cylinder('stone',u,v,18.1,1.5,.45,.24,near?7:5);
  cylinder('stone',u,v,19.5,.48,.23,.27,near?8:5);
  beam('stone',[u,19.2,v],[u+side*.62,18.65,v+.15],.21);
  beam('stone',[u+side*.62,18.65,v+.15],[u+side*.7,18.2,v+.14],.18);
 }
 // Rue de Vaugirard: low transverse entrance gallery, true recessed arch,
 // taller central two-storey pavilion and its smaller circular drum and dome.
 for(const [a,c] of [[-28.6,-3],[3,30.2]]){
  box('stone',(a+c)/2,4.1,-88.4,c-a,8.2,8.0);
  facade([a,-92.4],[c,-92.4],8.2,{plain:false});
  facade([c,-84.4],[a,-84.4],8.2,{plain:false});
  box('stone',(a+c)/2,8.5,-88.4,c-a,.6,8.0);
 }
 const R=2.5,cy=3.5,front=-94.2,back=-82.2;
 for(const side of [-1,1])wallPrism([[-5.7,-92.1],[-3.4,-94.1],[-2.5,-94.1],[-2.5,-82.2],[-3.4,-82.2],[-5.7,-84.3]].map(([u,v])=>[u*side,v]),8.5);
 for(let i=0;i<12;i++){
  const a=i*Math.PI/12,c=(i+1)*Math.PI/12;
  const l=R*Math.cos(a),r=R*Math.cos(c),yl=cy+R*Math.sin(a),yr=cy+R*Math.sin(c);
  poly('stone',[[l,yl,front],[r,yr,front],[r,8.5,front],[l,8.5,front]],[0,0,-1]);
  poly('stone',[[l,yl,back],[r,yr,back],[r,8.5,back],[l,8.5,back]],[0,0,1]);
  poly('stone',[[l,yl,front],[l,yl,back],[r,yr,back],[r,yr,front]],[-(l+r)/2,-1,0]);
 }
 // Recessed gate at the centre of the passage; pickets remain visibly separated.
 poly('glass',[[-2.45,.2,-88.4],[2.45,.2,-88.4],[2.45,5.3,-88.4],[-2.45,5.3,-88.4]],[0,0,-1]);
 if(near)for(let u=-2.2;u<2.4;u+=.43)box('metal',u,2.8,-88.6,.07,5.2,.1);
 const portalRing=[[-5.6,-92.1],[-3.5,-94.1],[3.5,-94.1],[5.6,-92.1],[5.6,-84.4],[3.5,-82.8],[-3.5,-82.8],[-5.6,-84.4]];
 wallPrism(portalRing,15.6,8.5);
 for(const faceV of [-94.6,-82.4])for(const u of [-4.6,-3.2,3.2,4.6]){
  const v=faceV+(Math.abs(u)>4?(faceV<-90?1.3:-1.3):0);
  cylinder('stone',u,v,.3,7.7,.4,.38,near?8:5);
  cylinder('stone',u,v,8.6,6.5,.4,.36,near?8:5);
  cylinder('stone',u,v,7.7,.5,.6,.6,8);cylinder('stone',u,v,14.8,.5,.6,.6,8);
 }
 wallPrism(portalRing,15.95,15.45);
 poly('stone',portalRing.map(([u,v])=>[u,15.95,v]),[0,1,0]);
 cylinder('stone',0,-88.5,15.9,5.6,4.4,4.4,near?24:16);
 dome(0,-88.5,21.5,4.4,4.2,28.8);
 clock(0,-93.08,18.4,-1);clock(0,-83.92,18.4,1);
 // Keep the central upper opening visible between the rusticated columns.
 for(const out of [-1,1]){
  const v=-88.5+out*5.95;
  poly('glass',[[-1.6,9,v],[1.6,9,v],[1.6,14.4,v],[-1.6,14.4,v]],[0,0,out]);
  if(near){box('frame',0,11.7,v+out*.12,.1,5.4,.12);box('frame',0,11.7,v+out*.12,3.2,.1,.12);}
 }
 const root=b.finish();
 root.traverse(o=>{if(o.isMesh){const old=o.geometry;o.geometry=mergeVertices(old,1e-4);old.dispose();}});
 return root;
}
