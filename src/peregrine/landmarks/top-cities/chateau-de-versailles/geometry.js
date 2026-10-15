import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { assetBuilder } from "../../asset-geometry.js";
import { SPEC, PALETTES } from "./config.js";
import { RINGS, world, local, CHAPEL } from "./chateau-de-versailles-plan.js";
import { BASINS } from "./footprint.js";
const area=r=>r.reduce((s,p,i)=>s+p[0]*r[(i+1)%r.length][1]-r[(i+1)%r.length][0]*p[1],0);
// Wind all exposed walls with their outward normal on the right.
const rings=RINGS.map((r,i)=>area(r)*(i? -1:1)<0?[...r].reverse():r);

export function create({detail="near"}={}){
 const near=detail!=="far",b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 function poly(mat,pts,normal){
  if(!near&&mat==="glow")mat="glass";
  const p=pts.map(q=>new THREE.Vector3(...world(...q)));
  if(normal){const n=new THREE.Vector3(...world(...normal));if(new THREE.Vector3().crossVectors(p[1].clone().sub(p[0]),p[2].clone().sub(p[0])).dot(n)<0)p.reverse();}
  const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(p.flatMap(q=>q.toArray()),3));
  const idx=[];for(let i=1;i<p.length-1;i++)idx.push(0,i,i+1);g.setIndex(idx);g.computeVertexNormals();b.put(g,mat);
 }
 function box(mat,u,y,v,w,h,d){const g=new THREE.BoxGeometry(w,h,d);g.rotateY(-22*Math.PI/180);g.translate(...world(u,y,v));b.put(g,mat);}
 function beam(mat,a,c,w,d=w){b.bar(mat,world(...a),world(...c),w,d);}
 function cyl(mat,u,y,v,h,r,rt=r,n=near?6:4){const g=new THREE.CylinderGeometry(rt,r,h,n);g.translate(u,y+h/2,v);g.rotateY(-22*Math.PI/180);b.put(g,mat);}
 // Basin Nord/Midi: low limestone lips, inset water at local grade.
 // The provider tags their rims as building=yes; never keep the tall white
 // generic extrusion behind the palace's garden balustrade.
 for(const basin of BASINS){
  const outer=basin[0].slice(0,-1).map(local),inner=basin[1].slice(0,-1).map(local);
  const shapes=[outer,inner].map(r=>r.map(p=>new THREE.Vector2(...p))),flat=shapes.flat();
  for(const tri of THREE.ShapeUtils.triangulateShape(shapes[0],shapes.slice(1)))poly("trim",tri.map(i=>[flat[i].x,.32,flat[i].y]),[0,1,0]);
  for(const [ring,inward] of [[outer,false],[inner,true]])for(let i=0;i<ring.length;i++){
   const a=ring[i],c=ring[(i+1)%ring.length],sign=(area(ring)>0?1:-1)*(inward?-1:1);
   poly("stone",[[a[0],0,a[1]],[c[0],0,c[1]],[c[0],.32,c[1]],[a[0],.32,a[1]]],[sign*(c[1]-a[1]),0,sign*(a[0]-c[0])]);
  }
  const water=inner.map(p=>new THREE.Vector2(...p));for(const t of THREE.ShapeUtils.triangulateShape(water,[]))poly("glass",t.map(i=>[water[i].x,.04,water[i].y]),[0,1,0]);
 }
 // Flat roofs triangulate the real outline, including seven open lightwells.
 const shapes=rings.map(r=>r.map(p=>new THREE.Vector2(...p))),flat=shapes.flat(),tri=THREE.ShapeUtils.triangulateShape(shapes[0],shapes.slice(1));
 const roofG=new THREE.BufferGeometry(),roofP=flat.flatMap(([u,v])=>world(u,20.6,v));roofG.setAttribute("position",new THREE.Float32BufferAttribute(roofP,3));roofG.setIndex(tri.flatMap(t=>{const p=t.map(i=>new THREE.Vector3(...roofP.slice(i*3,i*3+3)));return new THREE.Vector3().crossVectors(p[1].clone().sub(p[0]),p[2].clone().sub(p[0])).y>0?t:[...t].reverse();}));roofG.computeVertexNormals();b.put(roofG,"lead");
 function wall(a,c,mat="stone",h=20.6,y0=0){poly(mat,[[a[0],y0,a[1]],[c[0],y0,c[1]],[c[0],h,c[1]],[a[0],h,a[1]]],[c[1]-a[1],0,a[0]-c[0]]);}
 function facade(a,c,{brick=false,h=20.6,chapel=false,balustrade=false}={}){
  const du=c[0]-a[0],dv=c[1]-a[1],L=Math.hypot(du,dv);if(L<2.4){wall(a,c,brick?"brick":"stone",h);return;}
  const tx=du/L,tz=dv/L,nx=tz,nz=-tx,pt=(t,y,o)=>[a[0]+tx*t+nx*o,y,a[1]+tz*t+nz*o];
  const face=(mat,l,r,y0,y1,o)=>poly(mat,[pt(l,y0,o),pt(r,y0,o),pt(r,y1,o),pt(l,y1,o)],[nx,0,nz]);
  function strip(l,r,y0,y1,o=.38){
   face("trim",l,r,y0,y1,o);
   if(near&&(r-l>4)){poly("trim",[pt(l,y1,0),pt(l,y1,o),pt(r,y1,o),pt(r,y1,0)],[0,1,0]);
   if(r-l<1.6){poly("trim",[pt(l,y0,0),pt(l,y0,o),pt(l,y1,o),pt(l,y1,0)],[-tx,0,-tz]);poly("trim",[pt(r,y0,o),pt(r,y0,0),pt(r,y1,0),pt(r,y1,o)],[tx,0,tz]);}}
  }
  for(const y of (chapel?[29.9]:(near?[.65,6.4,15.8,20.1]:[])))strip(0,L,y,y+.45,near?.42:.21);
  const n=Math.max(1,Math.round(L/(chapel?5.8:(near?5.4:12.0)))),step=L/n;
  const rows=chapel?[[4.4,6.5,2.0],[14.0,8.0,2.2],[25.0,8.2,3.25]]:[[3.7,4.7,2.0],[11,6.2,2.15],[18,2.8,1.85]];
  // Masonry is cut around each pane; inset glass never overlays a full wall.
  const wallMat=brick?"brick":"stone";
  let lastY=0;
  for(const [y,hh,ww] of rows){
   const y0=y-hh/2,y1=y+hh/2;
   if(y0>lastY)face(wallMat,0,L,lastY,y0,0);
   let lastT=0;
   for(let i=0;i<n;i++){
    const t=(i+.5)*step,W=Math.min(ww,Math.min(2.15,step*.52)),lo=t-W/2,hi=t+W/2;
    face(wallMat,lastT,lo,y0,y1,0);lastT=hi;
    if(chapel||(near&&y<7)){
     const spring=y1-W/2,N=near?7:2;
     for(let j=0;j<N;j++){const a=j*Math.PI/N,c=(j+1)*Math.PI/N,ta=t+W/2*Math.cos(a),tc=t+W/2*Math.cos(c);poly(wallMat,[pt(ta,spring+W/2*Math.sin(a),0),pt(tc,spring+W/2*Math.sin(c),0),pt(tc,y1,0),pt(ta,y1,0)],[nx,0,nz]);}
    }
   }
   face(wallMat,lastT,L,y0,y1,0);lastY=y1;
  }
  if(lastY<h)face(wallMat,0,L,lastY,h,0);
  for(let i=0;i<n;i++){
   const t=(i+.5)*step,w=Math.min(2.15,step*.52);
   for(const [y,hh,ww] of rows){
    const W=Math.min(ww,w),lo=t-W/2,hi=t+W/2,y0=y-hh/2,y1=y+hh/2,mat=i%7===2?"glow":"glass";
    // Quads remain individually spaced in far; no full-height stripes.
    if(chapel||(near&&y<7)){
     const spring=y1-W/2;face(mat,lo,hi,y0,spring,-.18);
     for(let j=0;j<(near?7:2);j++){const a=j*Math.PI/(near?7:2),c=(j+1)*Math.PI/(near?7:2);poly(mat,[pt(t,spring,-.18),pt(t+W/2*Math.cos(a),spring+W/2*Math.sin(a),-.18),pt(t+W/2*Math.cos(c),spring+W/2*Math.sin(c),-.18)],[nx,0,nz]);}
    }else face(mat,lo,hi,y0,y1,-.18);
    if(near){strip(lo-.22,lo,y0-.12,y1+.12,.46);strip(hi,hi+.22,y0-.12,y1+.12,.46);strip(lo-.28,hi+.28,y0-.24,y0,.49);strip(lo-.25,hi+.25,y1,y1+.27,.46);
     face("gold",t-.055,t+.055,y0,y1,.51);face("gold",lo,hi,y-.055,y+.055,.51);
     if(y>7&&y<16)strip(lo-.4,hi+.4,y1+.38,y1+.58,.59);
    }
   }
   if(near||brick){
    const width=brick?.43:.32;
    strip(t-step*.5+width*.5,t-step*.5+width*1.5,7,15.6,.50);
    if(near){strip(t-step*.5+.05,t-step*.5+.95,15.35,15.7,.65);strip(t-step*.5+.05,t-step*.5+.95,6.8,7.15,.65);}
   }
  }
  // Garden-front open balustrade and trophies stand on the roof cornice.
  if(balustrade){
   const at=(t,y)=>pt(t,y,-.32);
   if(near){beam("trim",at(.1,20.95),at(L-.1,20.95),.45,.48);beam("trim",at(.1,22.1),at(L-.1,22.1),.42,.52);}
   else {face("trim",.1,L-.1,20.6,21.15,-.32);face("trim",.1,L-.1,21.9,22.3,-.32);}
   const spacing=near?1.15:2.35;
   for(let t=.3;t<L;t+=spacing){const p=at(t,21.1);face("trim",t-.11,t+.11,20.95,22.1,-.32);if(near)poly("trim",[pt(t,20.95,-.44),pt(t,20.95,-.20),pt(t,22.1,-.20),pt(t,22.1,-.44)],[tx,0,tz]);}
   for(let t=3;t<L-1;t+=near?16:40){const p=at(t,22.0);statue(p[0],p[2],22.0);}
  }
 }
 function statue(u,v,y){
  if(!near){
   box("trim",u,y+.2,v,.95,.4,.9);
   poly("trim",[[u-.38,y+.4,v],[u+.38,y+.4,v],[u+.22,y+1.75,v],[u-.22,y+1.75,v]],[0,0,1]);
   poly("trim",[[u,y+.4,v-.38],[u,y+.4,v+.38],[u,y+1.75,v+.22],[u,y+1.75,v-.22]],[1,0,0]);
   cyl("trim",u,y+1.75,v,.50,.23,.18,4);return;
  }
  // Plinth, draped torso, separate neck/head and bent arms: grouped figures.
  box("trim",u,y+.22,v,.95,.44,.9);cyl("trim",u,y+.44,v,1.2,.42,.23);
  cyl("trim",u,y+1.64,v,.18,.15);cyl("trim",u,y+1.82,v,.44,.24,.20);
  if(near){beam("trim",[u-.22,y+1.4,v],[u-.58,y+.95,v+.18],.20);beam("trim",[u+.22,y+1.4,v],[u+.60,y+1.8,v],.19);}
 }
 // The whole OSM envelope is closed: walls follow the actual stepped silhouette.
 for(let k=0;k<rings.length;k++)for(let i=0;i<rings[k].length;i++){
  const a=rings[k][i],c=rings[k][(i+1)%rings[k].length],mx=(a[0]+c[0])/2,mv=(a[1]+c[1])/2;
  const brick=k===0&&mx<76&&mx>12&&mv>-38&&mv<15;
  facade(a,c,{brick,balustrade:k===0&&(mx<4||mv>40&&mx<84||mv<-60&&mx<84)});
 }
 // Subtract the mapped service-court openings from every sloped roof face.
 const holeBounds=rings.slice(1).map(r=>[Math.min(...r.map(p=>p[0])),Math.max(...r.map(p=>p[0])),Math.min(...r.map(p=>p[1])),Math.max(...r.map(p=>p[1]))]);
 function clip(p,axis,value,positive){
  const out=[];for(let i=0;i<p.length;i++){
   const a=p[i],c=p[(i+1)%p.length],ia=positive?a[axis]>=value:a[axis]<=value,ic=positive?c[axis]>=value:c[axis]<=value;
   if(ia)out.push(a);if(ia!==ic){const t=(value-a[axis])/(c[axis]-a[axis]);out.push(a.map((x,j)=>x+(c[j]-x)*t));}
  }return out;
 }
 function roofFace(p,mat="roof"){
  let pieces=[p];for(const [u0,u1,v0,v1] of holeBounds){
   const next=[];for(const q of pieces){
    if(Math.max(...q.map(p=>p[0]))<=u0||Math.min(...q.map(p=>p[0]))>=u1||Math.max(...q.map(p=>p[2]))<=v0||Math.min(...q.map(p=>p[2]))>=v1){next.push(q);continue;}
    const left=clip(q,0,u0,false),right=clip(q,0,u1,true),mid=clip(clip(q,0,u0,true),0,u1,false);
    for(const r of [left,right,clip(mid,2,v0,false),clip(mid,2,v1,true)])if(r.length>=3)next.push(r);
   }pieces=next;
  }for(const q of pieces)poly(mat,q,[0,1,0]);
 }
 function hip(u0,u1,v0,v1,y,top,gilded=false,mat="roof"){
  const inset=Math.min(3.9,(u1-u0)*.32,(v1-v0)*.32),U0=u0+inset,U1=u1-inset,V0=v0+inset,V1=v1-inset;
  for(const p of [ [[u0,y,v0],[u1,y,v0],[U1,top,V0],[U0,top,V0]],[[u1,y,v0],[u1,y,v1],[U1,top,V1],[U1,top,V0]],[[u1,y,v1],[u0,y,v1],[U0,top,V1],[U1,top,V1]],[[u0,y,v1],[u0,y,v0],[U0,top,V0],[U0,top,V1]],[[U0,top,V0],[U1,top,V0],[U1,top,V1],[U0,top,V1]] ])roofFace(p,mat);
  if(gilded){
   // Grounded ridge crest and corner finials; the top edge is supported by slate.
   if(near){beam("gold",[U0,top+.12,V0],[U1,top+.12,V0],.25);beam("gold",[U0,top+.12,V1],[U1,top+.12,V1],.25);}

   for(const [u,v] of [[U0,V0],[U1,V0],[U0,V1],[U1,V1]]){cyl("gold",u,top,v,1.25,.18,.08);}
  }
 }
 // Louis XIII corps de logis and returns: blue slate, gilded ridges and dormers.
 const hips=[[-5,14,-59,38,20.6,27.0],[14,43,-58,-22,20.6,26.6],[43,69,-58,-30,20.6,26.6],[14,43,3,38,20.6,26.6],[43,69,11,38,20.6,26.6]];
 for(const q of hips)hip(...q,true);
 for(const [u0,u1,v0,v1,y,top] of hips){
  for(const v of [v0+4.2,v1-4.2])for(let u=u0+5;u<u1-3;u+=near?8:11){
   if(near){
    const out=v<(v0+v1)/2?-1:1,front=v+out*.6,back=v-out*.6;
    poly("trim",[[u-.75,21.95,back],[u+.75,21.95,back],[u+.75,24.45,back],[u-.75,24.45,back]],[0,0,-out]);
    for(const x of [u-.75,u+.75])poly("trim",[[x,21.95,back],[x,21.95,front],[x,24.45,front],[x,24.45,back]],[x<u?-1:1,0,0]);
    const rect=(mat,x0,x1,y0,y1,depth)=>poly(mat,[[x0,y0,depth],[x1,y0,depth],[x1,y1,depth],[x0,y1,depth]],[0,0,out]);
    rect("gold",u-.75,u-.425,21.95,24.45,front);rect("gold",u+.425,u+.75,21.95,24.45,front);
    rect("gold",u-.425,u+.425,21.95,22.6,front);rect("gold",u-.425,u+.425,24.0,24.45,front);
    rect("glass",u-.425,u+.425,22.6,24.0,front-out*.12);
   }else box("trim",u,23.2,v,1.5,2.5,1.2);
   hip(u-.95,u+.95,v-.85,v+.85,24.45,25.35);
  }
  for(let v=v0+9;v<v1-5;v+=20){box("stone",u0+3,26.45,v,1.05,4.3,1.25);box("trim",u0+3,28.55,v,1.5,.35,1.65);}
 }
 // Central clock pavilion at the head of Cour de Marbre, rich but low relief.
 box("brick",12.7,22.1,-9,3.0,3.0,20.6);

 hip(1.0,14.2,-19.3,1.3,23.6,29.6,true);
 // Carved pediment carries the clock: its back sinks into the slate roof.
 for(let i=0;i<16;i++){
  const v0=-15.6+13.2*i/16,v1=-15.6+13.2*(i+1)/16;
  const yy=v=>23.6+5.0*Math.sqrt(Math.max(0,1-((v+9)/6.6)**2));
  poly("trim",[[14.42,23.6,v0],[14.42,23.6,v1],[14.42,yy(v1),v1],[14.42,yy(v0),v0]],[1,0,0]);
  poly("trim",[[12.1,yy(v0),v0],[14.42,yy(v0),v0],[14.42,yy(v1),v1],[12.1,yy(v1),v1]],[0,1,0]);
 }
 // Clock face in the roof of the central court pavilion (faces the approach).
 function clock(){
  const u=14.85,y=25.9,v=-9,n=near?24:12;
  for(let i=0;i<n;i++){
   const a=i*Math.PI*2/n,c=(i+1)*Math.PI*2/n;
   const at=(r,t)=>[u,y+r*Math.sin(t),v+r*Math.cos(t)];
   poly("gold",[at(.93,a),at(1.18,a),at(1.18,c),at(.93,c)],[1,0,0]);
  }
  const q=[];for(let i=0;i<n;i++){const a=i*Math.PI*2/n;q.push([u,y+.93*Math.sin(a),v+.93*Math.cos(a)]);}poly("glass",q,[1,0,0]);
  beam("gold",[u+.24,y,v],[u+.24,y+.65,v],.10);beam("gold",[u+.24,y,v],[u+.24,y+.16,v+.62],.10);
 }

 clock();
 for(const v of [-13,-5])statue(14.7,v,23.6);
 // Royal Chapel: longitudinal nave u=95.3..127.5, east semicircular apse.
 // The mapped south/north eaves are v=-73.1/-95.1; the old transverse
 // pavilion roof concealed the nave's 44 m silhouette above the 21 m wings.
 const C=CHAPEL,u0=C.u-C.length/2,u1=C.u+C.length/2,v0=C.v-C.width/2,v1=C.v+C.width/2;
 const nave=[[u0,v0],[u1,v0],[u1,v1],[u0,v1]];
 // Outward winding follows the same convention as the palace envelope.
 for(const [a,c] of [[nave[0],nave[1]],[nave[2],nave[3]],[nave[3],nave[0]]])facade(a,c,{chapel:true,h:C.eaves});
 const apse=[];const count=near?12:8;
 for(let i=0;i<=count;i++){const a=-Math.PI/2+i*Math.PI/count;apse.push([u1+C.width/2*Math.cos(a),C.v+C.width/2*Math.sin(a)]);}
 for(let i=0;i<count;i++)facade(apse[i],apse[i+1],{chapel:true,h:C.eaves});
 // Two steep roof planes end in a rounded radial half-cone over the apse.
 const ridge=43.65;
 poly("roof",[[u0,C.eaves,v0],[u1,C.eaves,v0],[u1,ridge,C.v],[u0,ridge,C.v]],[0,1,-1]);
 poly("roof",[[u1,C.eaves,v1],[u0,C.eaves,v1],[u0,ridge,C.v],[u1,ridge,C.v]],[0,1,1]);
 poly("stone",[[u0,C.eaves,v1],[u0,C.eaves,v0],[u0,ridge,C.v]],[-1,0,0]);
 for(let i=0;i<count;i++)poly("roof",[[...apse[i].slice(0,1),C.eaves,apse[i][1]],[...apse[i+1].slice(0,1),C.eaves,apse[i+1][1]],[u1,ridge,C.v]],[1,1,0]);
 // Gilded crest rests on the slate ridge; no unsupported old lantern.
 beam("gold",[u0,ridge+.12,C.v],[u1,ridge+.12,C.v],.24);
 for(const u of [u0+1,u1-1])cyl("gold",u,ridge,C.v,.35,.20,.08);
 for(let u=u0+3;u<u1-1;u+=near?6:10)for(const v of [v0+.55,v1-.55])statue(u,v,C.eaves-.05);
 // North/South wing roofs remain low and broadly horizontal from the gardens.
 // Low inner slate strips sit behind the balustrade, never a high repeated roof.
 for(const [lo,hi] of [[-208,-134],[-131,-97],[54,74],[101,149],[184,197]]){
  hip(78,91,lo,hi,20.6,23.0,false,"lead");
  if(near)for(let v=lo+7;v<hi-2;v+=18){box("stone",86,23.35,v,1.1,2.5,1.4);}
 }
 // Gilded Royal Gate spans the east mouth between the Gabriel/Dufour pavilions.
 // Every picket reaches grade; each rail terminates in the named stone piers.
 const gu=136.4,gv0=-39.6,gv1=20.4;
 for(const v of [gv0,gv1,-16,-2]){box("stone",gu,2.5,v,1.25,5,1.25);box("trim",gu,5.15,v,1.65,.3,1.65);cyl("gold",gu,5.3,v,.85,.38,.12);}
 for(const [lo,hi] of [[gv0,-16],[-16,-2],[-2,gv1]]){
  for(const y of [1.0,3.5,4.4])beam("gold",[gu, y,lo],[gu,y,hi],.16,.16);
  const step=near?.85:1.7;for(let v=lo+.4;v<hi;v+=step){beam("gold",[gu,.05,v],[gu,4.65,v],.10);if(near)cyl("gold",gu,4.6,v,.35,.16,0);}
 }
 // Crown and scroll silhouette above the middle gate, anchored into the top rail.
 for(let i=0;i<(near?12:7);i++){const v=-16+14*i/((near?12:7)-1),h=4.5+2.1*Math.sin(Math.PI*(v+16)/14);beam("gold",[gu,4.4,v],[gu,h,v],.14);}
 // Marble paving belongs only to the inset Marble Court, not the provider mask.
 for(let u=16;u<43;u+=near?2.4:5.4)for(let v=-20;v<1;v+=near?2.4:5.4)poly((Math.round((u-16)/(near?2.4:5.4)) + Math.round((v+20)/(near?2.4:5.4)))%2?"marble":"trim",[[u,.025,v],[Math.min(u+(near?2.3:5.3),43),.025,v],[Math.min(u+(near?2.3:5.3),43),.025,Math.min(v+(near?2.3:5.3),1)],[u,.025,Math.min(v+(near?2.3:5.3),1)]],[0,1,0]);
 const root=b.finish();root.traverse(o=>{if(o.isMesh){const old=o.geometry;o.geometry=mergeVertices(old,1e-4);old.dispose();}});return root;
}
