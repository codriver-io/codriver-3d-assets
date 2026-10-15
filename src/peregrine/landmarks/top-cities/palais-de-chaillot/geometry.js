import * as THREE from "three";
import { assetBuilder } from "../../asset-geometry.js";
import { SPEC, PALETTES } from "./config.js";
import { siteLevel, siteOffset } from "./palais-de-chaillot-terrain.js";
import { world, CURVES, PAVILIONS, STATUES } from "./palais-de-chaillot-plan.js";

let terrainShift = () => -12;
// Every part is authored in the palace frame, then rotated once into east/up/south.
function put(b,g,mat,u=0,y=0,v=0,angle=0) {
 g.rotateY(angle);g.translate(u,y,v);
 const p=g.attributes.position;
 for(let i=0;i<p.count;i++) p.setXYZ(i,...world(p.getX(i),p.getY(i),p.getZ(i)));
 g.computeVertexNormals(); g.setAttribute("terrainOffset",new THREE.Float32BufferAttribute(Array.from({length:p.count},(_,i)=>terrainShift(p.getY(i),(p.getX(i)+p.getZ(i))*Math.SQRT1_2)),1)); b.put(g,mat);
}
function box(b,mat,u,y,v,w,h,d,angle=0) {put(b,new THREE.BoxGeometry(w,h,d),mat,u,y,v,angle);}
function quad(b,mat,pts) {
 const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(pts.flatMap(p=>world(...p)),3));
 g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();const p=g.attributes.position;g.setAttribute("terrainOffset",new THREE.Float32BufferAttribute(Array.from({length:p.count},(_,i)=>terrainShift(p.getY(i),(p.getX(i)+p.getZ(i))*Math.SQRT1_2)),1));b.put(g,mat);
}
function prism(b,mat,ring,y0,y1) {
 const s=new THREE.Shape();ring.forEach(([u,v],i)=>i?s.lineTo(u,-v):s.moveTo(u,-v));s.closePath();
 const g=new THREE.ExtrudeGeometry(s,{depth:y1-y0,bevelEnabled:false,curveSegments:1,steps:1});
 // Extrude x/y plane (u,-v) into local +y.
 g.rotateX(-Math.PI/2);g.translate(0,y0,0);put(b,g,mat);
}
function mix(a,c,t){return [a[0]+(c[0]-a[0])*t,a[1]+(c[1]-a[1])*t];}
function sampled(curve) {
 const rows=[];
 for(let i=0;i<curve.back.length-1;i++) {
  const a=curve.back[i],c=curve.back[i+1],f=curve.front[i],h=curve.front[i+1];
  const n=Math.ceil((Math.hypot(c[0]-a[0],c[1]-a[1])+Math.hypot(h[0]-f[0],h[1]-f[1]))/11);
  for(let k=0;k<n;k++) rows.push({back:mix(a,c,k/n),front:mix(f,h,k/n)});
 }
 rows.push({back:curve.back.at(-1),front:curve.front.at(-1)});return rows;
}
function pane(b,mat,a,c,y0,y1,normal,offset=.65) {
 const [nx,nz]=normal;
 // Quad winding explicitly points toward the visible normal.
 let pts=[[a[0]+nx*offset,y0,a[1]+nz*offset],[c[0]+nx*offset,y0,c[1]+nz*offset],[c[0]+nx*offset,y1,c[1]+nz*offset],[a[0]+nx*offset,y1,a[1]+nz*offset]];
 const dx=c[0]-a[0],dz=c[1]-a[1];if((-dz*nx+dx*nz)<0)pts.reverse();quad(b,mat,pts);
}
function wings(b,near) {
 for(const curve of CURVES){
  const rows=sampled(curve);
  const baseRing=[...curve.back,...curve.front.slice().reverse()];
  prism(b,"stone",baseRing,0,17.1);
  // Roof slab follows the same concave plan; broad fronts remain open colonnades.
  prism(b,"stone",baseRing,34.3,35.8);
  const roofRing=[...curve.back.map((p,i)=>mix(p,curve.front[i],.06)),...curve.front.map((p,i)=>mix(p,curve.back[i],.06)).reverse()];
  prism(b,"roof",roofRing,35.9,36.2);
  for(let i=0;i<rows.length-1;i++) {
   const a=rows[i],c=rows[i+1];
   const ba=mix(a.back,a.front,.78),bc=mix(c.back,c.front,.78);
   prism(b,"stone",[a.back,c.back,bc,ba],17.05,34.4);
   const dx=c.front[0]-a.front[0],dz=c.front[1]-a.front[1];
   // Gardenward normal from back-to-front.
   const f=mix(a.front,c.front,.5),r=mix(a.back,c.back,.5);
   const n=[f[0]-r[0],f[1]-r[1]],nl=Math.hypot(...n);n[0]/=nl;n[1]/=nl;
   // One square column per bay. It physically joins the podium and entablature.
   const angle=-Math.atan2(dz,dx);
   const cp=mix(a.front,c.front,.5);
   box(b,"stone",cp[0]-n[0]*1,25.8,cp[1]-n[1]*1,1.65,17.8,2.1,angle);
   for(const [y0,y1] of [[18.2,22.0],[23.2,27],[28.3,32.4]]) {
    const p=mix(ba,bc,.18),q=mix(ba,bc,.82);pane(b,"glass",p,q,y0,y1,n);
   }
   pane(b,"glass",mix(a.front,c.front,.27),mix(a.front,c.front,.73),12.5,15.7,n);
   // Back has discrete rows as well; no uninterrupted dark strip in far.
   const bn=[-n[0],-n[1]];
   for(const [y0,y1] of [[18.6,22],[24,27.4],[29.5,32.4]])pane(b,"glass",mix(a.back,c.back,.23),mix(a.back,c.back,.77),y0,y1,bn);
   if(near){
    box(b,"stone",cp[0]-n[0],17.6,cp[1]-n[1],2.2,.8,2.6,angle);
    box(b,"stone",cp[0]-n[0],33.7,cp[1]-n[1],2.3,.8,2.8,angle);
    for(const y of [20.1,25.1,30.35]) {
     const pm=mix(ba,bc,.5);box(b,"stone",pm[0]+n[0]*.7,y,pm[1]+n[1]*.7,.20,3.8,.18,angle);
    }
   }
  }
 }
}
function wallFace(b,a,c,y0,y1,near){
 const dx=c[0]-a[0],dz=c[1]-a[1],L=Math.hypot(dx,dz),n=[-dz/L,dx/L],angle=-Math.atan2(dz,dx);
 const count=Math.max(2,Math.round(L/5.4));
 for(let i=0;i<count;i++){
  const t=(i+.5)/count,p=mix(a,c,t);
  // Giant rectilinear order, kept in far. Front plane of each shaft is 2.5 m proud.
  box(b,"stone",p[0]+n[0]*1.1,(y0+y1)/2,p[1]+n[1]*1.1,1.8,y1-y0,2.5,angle);
  if(near)box(b,"stone",p[0]+n[0]*1.1,y1-.5,p[1]+n[1]*1.1,2.25,1,2.8,angle);
 }
 for(let i=0;i<count-1;i++){
  const half=.27/count;
  for(const [lo,hi] of [[y0+.8,y0+5.4],[y0+6.5,y0+11.1],[y0+12.2,y1-1.2]]) {
   if(hi<=lo)continue;
   pane(b,"glass",mix(a,c,(i+1)/count-half),mix(a,c,(i+1)/count+half),lo,hi,n);
  }
 }
}
function pavilions(b,near){
 for(const p of PAVILIONS){
  const {u0,u1,v0,v1,top}=p,w=u1-u0,d=v1-v0,cu=(u0+u1)/2,cv=(v0+v1)/2;
  box(b,"stone",cu,8.5,cv,w,17,d);
  box(b,"stone",cu,(17+top-3)/2,cv,w-4,top-20,d-4);
  box(b,"stone",cu,top-2.7,cv,w,1.3,d);
  // A slightly raised, smaller flat attic, echoing the curved inscription pediment.
  box(b,"stone",cu,top-1.05,cv,w*.66,2.1,d*.84);
  box(b,"roof",cu,top-.2,cv,w*.57,.35,d*.69);
  const a=u0+2,c=u1-2,e=v0+2,f=v1-2;
  if(!p.center)wallFace(b,[a,f],[c,f],17,top-3.1,near);
  else for(let row=0;row<(near?4:2);row++)for(let k=0;k<(near?17:10);k++)box(b,"gold",cu+(k-(near?8:4.5))*(near?1.25:2.1),31-row*.85,v1+.18,.68,.22,.18);
  wallFace(b,[c,e],[a,e],17,top-3.1,near);
  if(!p.center){wallFace(b,[a,e],[a,f],17,top-3.1,near);wallFace(b,[c,f],[c,e],17,top-3.1,near);}

  if(p.center){
   // Bowed stone inscription panel of each central pavilion, inside its mapped bulge.
   const arc=[[cu-10,18.5]];
   for(let i=0;i<=16;i++){const t=Math.PI-i*Math.PI/16;arc.push([cu+10*Math.cos(t),26.1-3.6*Math.sin(t)]);}
   arc.push([cu+10,18.5]);prism(b,"stone",arc,37.2,40.6);
  }
  // Front entrance and low doors of the museums.
  for(let i=-1;i<=1;i++)pane(b,"glass",[cu+i*4-1.3,v1],[cu+i*4+1.3,v1],12.2,16.2,[0,1]);
  if(near&&p.center){
   // Attic relief groups are standing draped figures in stone, above their panel.
   for(let k=-2;k<=2;k++)figure(b,"stone",cu+k*1.65,top-2.15,v1-.2,.65,near);
  }
 }
}
function figure(b,mat,u,y,v,s,near){
 box(b,"stone",u,y+.35*s,v,1.65*s,.7*s,1.65*s);
 // Two legs, tapered torso, head, arms: each is joined to the next volume.
 for(const side of [-1,1])box(b,mat,u+side*.24*s,y+1.2*s,v,.38*s,1.5*s,.55*s);
 put(b,new THREE.CylinderGeometry(.4*s,.62*s,1.7*s,near?6:4),mat,u,y+2.45*s,v);
 put(b,new THREE.SphereGeometry(.36*s,near?6:4,near?4:3),mat,u,y+3.55*s,v);
 for(const side of [-1,1]){
  const a=world(u+side*.39*s,y+2.9*s,v),c=world(u+side*.88*s,y+2.2*s,v+.12*s);
  const av=new THREE.Vector3(...a),cv=new THREE.Vector3(...c),g=new THREE.BoxGeometry(.22*s,av.distanceTo(cv),.25*s);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),cv.clone().sub(av).normalize()));g.translate(...av.add(cv).multiplyScalar(.5).toArray());const p=g.attributes.position;g.setAttribute("terrainOffset",new THREE.Float32BufferAttribute(Array.from({length:p.count},()=>-12),1));b.put(g,mat);
 }
}
function site(b,near){
 // Central parvis bridges the two wings at terrace height; no building closes the view.
 box(b,"stone",3.5,6,-1,52,12,63);
 // Front terrace and lower museum gallery, confined to the central axis.
 box(b,"stone",3.5,6,43,116,12,26);
 for(let i=0;i<18;i++){
  const u=-51+i*6.4;pane(b,"glass",[u,56],[u+3.4,56],2.0,8.7,[0,1]);
 }
 // Unbroken stairs from upper terrace to garden level, both flanks.
 for(const side of [-1,1]) {
  for(let i=0;i<30;i++){
   const v=57+i*1.7,top=12-(i+1)/3;
   terrainShift=(y)=>y<.001?Math.min(-12,siteLevel(v)-top):siteLevel(v)-top;
   box(b,"stone",3.5+side*52,top/2,v,12,top,1.7);
  }
 }
 terrainShift=()=>-12;
 // Two descending garden/promenade terraces; world follows individual short levels.
 for(const [v0,v1,h] of [[69,106,2],[106,151,1.2],[151,232,.55]]){
  const n=Math.ceil((v1-v0)/(near?2:10));
  for(let k=0;k<n;k++){const a=v0+(v1-v0)*k/n,c=v0+(v1-v0)*(k+1)/n,mid=(a+c)/2;
   terrainShift=(y,v)=>y<.001?siteLevel(v)-15:(v0===69?siteLevel(c)-h-.6:siteOffset(mid,h));
   for(const side of [-1,1]){
    box(b,"stone",3.5+side*42,h/2,mid,21,h,c-a);
    const g0=Math.max(a,v0+2),g1=Math.min(c,v1-2);
    if(g1>g0)box(b,"garden",3.5+side*39,h+.12,(g0+g1)/2,11,.22,g1-g0);
   }
  }
 }
 // Warsaw fountain: rectangular upper basins, central connector and long round-ended pool.
 terrainShift=(y,v)=>y<.001?siteLevel(v)-15:siteOffset(83,2.8);
 for(const side of [-1,1]) basin(b,3.5+side*20,83,30,19,2.8);
 terrainShift=(y,v)=>y<.001?siteLevel(v)-15:siteOffset(103,1.8);basin(b,3.5,103,17,20,1.8);
 // Rounded lower end via a custom polygon, with actual water below the rim.
 const outline=[[-14,112],[21,112],[21,211]];
 for(let i=0;i<=12;i++){const a=i*Math.PI/12;outline.push([3.5+17.5*Math.cos(a),211+17.5*Math.sin(a)]);}
 outline.push([-14,112]);
 const water=outline.map(([u,v])=>[3.5+(u-3.5)*.91,166+(v-166)*.975]);const clip=(r,a,c)=>{for(const [edge,keep] of [[a,1],[c,-1]]){const out=[];for(let i=0;i<r.length;i++){const p=r[i],q=r[(i+1)%r.length],pi=keep*(p[1]-edge)>=0,qi=keep*(q[1]-edge)>=0;if(pi)out.push(p);if(pi!==qi){const t=(edge-p[1])/(q[1]-p[1]);out.push([p[0]+(q[0]-p[0])*t,edge]);}}r=out;}return r;};
 for(let a=112;a<229;a+=(near?10:20)){const c=Math.min(229,a+(near?10:20)),mid=(a+c)/2;terrainShift=(y,v)=>y<.001?siteLevel(v)-15:siteOffset(mid,1);
  const r=clip(outline,a,c),w=clip(water,a,c);if(r.length>=3)prism(b,"stone",r,0,1);if(w.length>=3)prism(b,"water",w,1.08,1.15);
  if(c<228){const edge=clip(water,c-.02,c+.02),us=edge.map(p=>p[0]);if(us.length){const l=Math.min(...us),r=Math.max(...us),v=c+.03,g=new THREE.BufferGeometry();
   g.setAttribute('position',new THREE.Float32BufferAttribute([[l,1.15,v],[r,1.15,v],[r,1.15,v],[l,1.15,v]].flatMap(p=>world(...p)),3));
   g.setAttribute('normal',new THREE.Float32BufferAttribute(Array(4).fill(world(0,0,1)).flat(),3));g.setIndex([0,2,1,0,3,2]);
   g.setAttribute('terrainOffset',new THREE.Float32BufferAttribute([siteOffset(mid,1),siteOffset(mid,1),siteOffset(Math.min(229,c+(near?5:10)),1),siteOffset(Math.min(229,c+(near?5:10)),1)],1));b.put(g,'water');
  }}
 }
 // Geometric water jets remain anchored at the pool surface. Water shares one material.
 for(const v of [122,143,164,185,206])for(const u of [-7,14]){
  terrainShift=()=>siteOffset(112+Math.floor((v-112)/(near?10:20))*(near?10:20)+(near?5:10),1);
  put(b,new THREE.CylinderGeometry(.05,.32,near?5.5:4.8,near?5:3),"water",u,1.15+(near?5.5:4.8)/2,v);
 }
 terrainShift=(y,v)=>y<.001?siteLevel(v)-15:siteOffset(83,2.8);
 for(const v of [84,91])for(const u of [-24,-11,18,31])put(b,new THREE.CylinderGeometry(.08,.4,8,near?5:3),"water",u,6.98,v);
 // Broad water-cannon spray, kept opaque in the shared unlit path.
 for(const u of [-16,23]){put(b,new THREE.ConeGeometry(2.5,12,near?8:5),"spray",u,9,85);}
 terrainShift=()=>-12;
 // Eight gilded figures on the parvis edge, all planted on their plinths.
 for(const [u,y,v] of STATUES)figure(b,"gold",u,y,v,1.2,near);
}
function basin(b,u,v,w,d,h){
 box(b,"stone",u,h/2,v,w,h,d);
 box(b,"water",u,h+.12,v,w-2,.18,d-2);
}
export function create({detail="near"}={}){
 const near=detail!=="far",b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 terrainShift=()=>-12;site(b,near);terrainShift=()=>-12;wings(b,near);pavilions(b,near);
 const root=b.finish();root.traverse(m=>{if(!m.isMesh)return;const g=m.geometry,o=g.getAttribute('terrainOffset');m.userData.terrainOffsets=[];
  for(let i=0;i<o.count;){const value=o.getX(i);let end=i+1;while(end<o.count&&o.getX(end)===value)end++;if(value)m.userData.terrainOffsets.push([i,end-i,value]);i=end;}g.deleteAttribute('terrainOffset');g.deleteAttribute('bridgeLift');
 });return root;
}
