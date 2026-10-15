import { FLYERS } from './cathedrale-saint-jean-lyon-kit.js';
// u along the nave to the river; v toward the south aisle. All heights are local metres.
export function buildCathedral(k) {
 const west=-41.9,cv=4.0,face=-Math.PI/2;
 // High nave with six distinct clerestory bays. Side walls have actual cut-outs.
 for(const s of [-1,1]){
  const v=s<0?-3.4:11.4,a=s<0?Math.PI:0;
  const openings=[-35.4,-27.7,-20,-12.3,-4.6,3.1].map(u=>({x:s<0?-u-15.35:u+15.35,y:22.3,w:5.0,h:10.1}));
  k.wall(47.3,33.8,-15.35,0,v,a,openings);
  k.box('trim',-15.35,33.65,v,47.3,.36,.5);
 }
 k.wall(14.8,33.8,8.3,0,cv,Math.PI/2,[],1.0);
 k.roof(-39.0,8.4,-3.6,11.6,34.03,41.1);
 // Low aisle roofs step with the mapped chapel envelope, rather than a broad rectangular pad.
 const wings=[[-38.8,-35.3,-12.5,-3.5],[-35.3,8.3,-15.5,-3.5],[-38.8,-30.9,11.5,21.5],[-30.9,-3.1,11.5,28.4],[-3.1,8.3,11.5,25.4]];
 for(const [u0,u1,v0,v1] of wings){
  const side=v0<0?-1:1,outer=side<0?v0:v1,a=side<0?Math.PI:0,m=(u0+u1)/2;
  const count=Math.max(1,Math.round((u1-u0)/7.5)),win=[];
  for(let i=0;i<count;i++){const u=u0+(i+.5)*(u1-u0)/count;win.push({x:(u-m)*(side<0?-1:1),y:2.0,w:Math.min(4.3,(u1-u0)/count-1.6),h:9.7,round:false});}
  k.wall(u1-u0,13.6,m,0,outer,a,win);
  for(const [u,n] of [[u0,-1],[u1,1]])k.wall(v1-v0,13.6,u,0,(v0+v1)/2,n<0?-Math.PI/2:Math.PI/2,[],.6);
  k.roof(u0,u1,v0,v1,13.6,18.0);
  k.box('trim',m,13.3,outer,u1-u0,.34,.55);
 }
 // Attached south sacristy, exactly the thin mapped rectangle, distinct from the Manécanterie.
 k.wall(14.6,6.3,-23.5,0,31.3,0,[-4.3,0,4.3].map(x=>({x,y:2,w:1.1,h:2.7,round:true})));k.wall(14.6,6.3,-23.5,0,28.9,Math.PI);for(const u of [-30.8,-16.2])k.wall(2.4,6.3,u,0,30.1,u< -20?-Math.PI/2:Math.PI/2);k.roof(-30.8,-16.2,28.9,31.3,6.3,7.8);
 // Closed masonry flying arches touch their named nave wall and outer buttress pier.
 for(const f of FLYERS){
  const [u,,v]=f.pier;
  k.box('stone',u,0,v,1.1,22.2,1.3);k.box('trim',u,21.95,v,1.4,.38,1.6);k.pinnacle(u,v,22.33,3.2,.38);
  k.flyer(f.wall,f.pier,.72);
  const inner=f.wall[2];k.box('stone',u,20,inner,.7,13.7,.9);
 }
 // Transverse body and the two large, spireless Romanesque belfries.
 k.box('stone',13.6,0,cv,10.6,27,22.2);
 k.roof(8.3,19.0,-7.1,15.1,27.05,31.0);
 tower(13.6,-13.7,10.6,11.2,42.15,true);
 tower(13.6,21.5,10.6,11.2,42.15,true);
 // Lower choir and a faceted Romanesque apse: tall lower lancets and paired upper arcades.
 for(const s of [-1,1]){
  const v=s<0?-6.1:12.7,a=s<0?Math.PI:0;
  k.wall(12.0,26.9,25,0,v,a,[{x:-2.7,y:2,w:2.8,h:14.6,round:true},{x:2.7,y:2,w:2.8,h:14.6,round:true},{x:0,y:20,w:4.4,h:5.1,round:true}]);
 }
 k.roof(19,31,-6.2,12.8,26.95,31.8);
 const center=[31,3.3],R=9.0,angles=[-Math.PI/2,-Math.PI*3/10,-Math.PI/10,Math.PI/10,Math.PI*3/10,Math.PI/2];
 const pts=angles.map(a=>[center[0]+Math.cos(a)*R,center[1]+Math.sin(a)*R]);
 for(let i=0;i<pts.length-1;i++){
  const p=pts[i],q=pts[i+1],u=(p[0]+q[0])/2,v=(p[1]+q[1])/2,w=Math.hypot(q[0]-p[0],q[1]-p[1]);
  // Tangent vector in a wall's local +X is (cos(a), -sin(a)).
  const faceA=Math.atan2((u-center[0]),(v-center[1]));
  k.wall(w,26.9,u,0,v,faceA,[{x:0,y:1.8,w:2.5,h:15.4,round:true},{x:-w*.22,y:20.3,w:1.45,h:4.6,round:true},{x:w*.22,y:20.3,w:1.45,h:4.6,round:true}],.85);
  k.bar('trim',[p[0],26.95,p[1]],[q[0],26.95,q[1]],.42);
  k.box('stone',p[0],0,p[1],.85,27.1,.85);
  if(k.near)k.box('trim',p[0],18.6,p[1],.72,.35,.72);
 }
 k.apseRoof(center,pts,26.95,31.8);
 // Attached south-east chapel fits the cathedral's extended southern envelope.
 k.wall(12.6,12.7,25.1,0,27.1,0,[-3.1,2.7].map(x=>({x,y:2,w:3,h:7.8})));for(const u of [18.8,31.4])k.wall(14,12.7,u,0,20.1,u<20?-Math.PI/2:Math.PI/2);k.roof(18.8,31.4,13.1,27.1,12.7,17.1);
 // Western tower bodies sit behind the broad Gothic screen.
 tower(-36.35,-6.25,7.7,7.2,36.5,false);
 tower(-36.25,14.95,7.7,7.4,36.5,false);
 // Flat screen: three deep portal silhouettes, gallery, rose and two unspired tower wings.
 const portal=[{x:-11.8,y:.04,w:5.0,h:9.0,m:'recess'},{x:0,y:.04,w:7.1,h:11.6,m:'recess'},{x:11.6,y:.04,w:5.0,h:9.0,m:'recess'}];
 for(const o of portal)o.portal=true;
 const gallery=Array.from({length:k.near?26:18},(_,i)=>({x:-16.1+(i+.5)*32.2/(k.near?26:18),y:13.3,w:32.2/(k.near?26:18)-.22,h:2.5,round:true,m:'roof'}));
 k.wall(34.0,33.0,west,0,cv,face,[...portal,...gallery,{x:0,y:24.2,circle:true,r:4.2}],2.5);
 for(const o of portal){
  const v=cv+o.x;
  k.poly('door',k.profile(o.w*.56,4.6,true),west-.10,.06,v,face);
  const arch=k.profile(o.w-.6,o.h-.4);const cut=4.9;const upper=[[-(o.w-.6)/2,cut],[(o.w-.6)/2,cut],...arch.filter(p=>p[1]>cut)];k.poly('stone',upper,west+.6,0,v,face);
  for(let j=1;j<=(k.near?4:2);j++)k.frame(o.w+j*.34,o.h+j*.19,.16,west-.19-j*.15,.04,v,face);
  k.poly('stone',[[-o.w*.61,0],[o.w*.61,0],[0,o.x===0?7.2:5.5]],west-.5,o.h+.25,v,face,.28);
  const H=o.x===0?7.2:5.5;
  for(const s of [-1,1])k.bar('trim',[west-.88,o.h+.25,v+s*o.w*.61],[west-.88,o.h+.25+H,v],.18);
  k.disc('glass',o.w*.18,west-.85,o.h+H*.45,v,face);k.rose(west-.98,o.h+H*.45,v,face,o.w*.18);
  k.pinnacle(west-.5,v,o.h+H+.25,1.3,.19);
 }
 // Repeated blind arcade across the projecting gallery.
 for(const y of [12.65,16.7,33.0])k.box('trim',west-.25,y,cv,.66,.35,34.0);
 const galleryN=k.near?26:18;
 for(let i=0;i<galleryN;i++){let v=cv-16.1+(i+.5)*32.2/galleryN;k.frame(32.2/galleryN-.15,2.5,.13,west-.48,13.3,v,face,true);}
 for(let i=0;i<(k.near?28:18);i++){let v=cv-16+(i+.5)*32/(k.near?28:18);k.ring('trim',.32,.43,west-.63,17.5,v,face);}
 k.box('trim',west-.27,18.1,cv,.68,.28,34.0);
 k.rose(west-.22,24.2,cv,face,4.2);
 // A small historic clock to the north and three slender statue canopies to the south.
 k.box('recess',west-.21,21.6,cv-10.9,.18,3.0,2.9);
 k.disc('recess',1.2,west-.4,23.1,cv-10.9,face);k.ring('trim',1.12,1.22,west-.53,23.1,cv-10.9,face);
 for(let i=0;i<12;i++){let a=i*Math.PI/6;k.bar('trim',[west-.61,23.1+Math.sin(a)*.91,cv-10.9+Math.cos(a)*.91],[west-.61,23.1+Math.sin(a)*1.08,cv-10.9+Math.cos(a)*1.08],.07);}
 k.bar('trim',[west-.65,23.1,cv-10.9],[west-.65,23.8,cv-10.5],.10);
 for(const v of [cv-10.9,cv+9.4,cv+11.1,cv+12.8]){
  if(v!==cv-10.9)k.frame(.78,3.6,.14,west-.3,22.2,v,face);
  k.pinnacle(west-.3,v,25.8,2.2,.25);
 }
 for(const v of [cv-12.1,cv+12.1]){
  k.wall(9.8,5.9,west,33.35,v,face,[{x:0,y:.9,w:2.1,h:4.4}],2.5);
  k.box('trim',west-.25,39.3,v,.65,.36,9.8);
  for(const dv of [-4.4,0,4.4])k.pinnacle(west-.18,v+dv,39.66,1.4,.20);
 }
 // A high, thin triangular west gable, not a third spire or belfry.
 k.poly('stone',[[-7.6,0],[7.6,0],[0,9.8]],west,33.35,cv,face,.42);
 k.poly('glass',k.profile(2.1,4.8),west-.48,34.1,cv,face);k.frame(2.5,5.05,.24,west-.61,34.05,cv,face);
 for(const s of [-1,1])k.bar('trim',[west-.65,33.35,cv+s*7.6],[west-.65,43.15,cv],.18);
 k.pinnacle(west-.30,cv,43.15,.85,.13);
 if(k.near)for(let i=1;i<9;i++)for(const s of [-1,1])k.pinnacle(west-.3,cv+s*7.6*(1-i/9),33.35+9.8*i/9,.45,.09);
 // Four projecting front piers terminate in grouped stone figures/canopies.
 for(const v of [-12.6,-2.1,10.0,19.25]){
  k.box('stone',west-.65,0,v,1.2,10.8,.95);k.pinnacle(west-.65,v,10.8,2.3,.36);
  if(k.near)for(const dv of [-.28,.28]){k.box('trim',west-.95,5.2,v+dv,.25,1.5,.22);k.pinnacle(west-.95,v+dv,6.7,.35,.14);}
 }
 function tower(u,v,w,d,top,east){
  for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5]){
   const nx=Math.sin(a),nz=Math.cos(a),span=Math.abs(nx)>.5?d:w,rad=Math.abs(nx)>.5?w/2:d/2;
   const windows=east?[{x:-span*.22,y:31.2,w:span*.23,h:9.3,round:true,m:'recess'},{x:span*.22,y:31.2,w:span*.23,h:9.3,round:true,m:'recess'},{x:-span*.18,y:23.4,w:span*.20,h:5.8,round:true},{x:span*.18,y:23.4,w:span*.20,h:5.8,round:true}]:[{x:0,y:31.8,w:2.4,h:4.1}];
   const inner=!east&&((v<0&&a===0)||(v>0&&a===Math.PI));
   k.wall(span,top,u+nx*rad,0,v+nz*rad,a,inner?[]:windows,.85);
   if(east&&k.near)for(let yy=32;yy<38.8;yy+=.52)for(const xx of [-span*.22,span*.22]){
    const p=k.point(u+nx*rad,0,v+nz*rad,a,xx,yy,-.25);k.bar('roof',k.point(...p,a,-span*.10,0),k.point(...p,a,span*.10,0),.15,.18);
   }
  }
  for(const y of east?[18.2,30.0,41.6]:[28.0,36.2])k.box('stone',u,y,v,w+.34,.38,d+.34);
  k.hip(u,v,w+.2,d+.2,top,east?1.85:1.5);
  if(east)for(const du of [-w*.45,w*.45])for(const dv of [-d*.45,d*.45])k.box('stone',u+du,0,v+dv,.6,top,.6);
 }
}
