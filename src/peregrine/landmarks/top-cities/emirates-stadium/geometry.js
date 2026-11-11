import*as THREE from'three';import{assetBuilder}from'../../asset-geometry.js';import{SPEC,PALETTES}from'./config.js';import{OUTER_RING,INNER_RING}from'./footprint.js';import{kit}from'./emirates-stadium-geometry-kit.js';
const C=Math.cos(.02116),S=Math.sin(.02116),LAT=Math.cos(SPEC.origin[1]*Math.PI/180),local=([x,y])=>[(x-SPEC.origin[0])*111320*LAT,(SPEC.origin[1]-y)*111320],OUT=OUTER_RING.slice(0,-1).map(local),IN=INNER_RING.slice(0,-1).map(local);
export const pitchPoint=(u,y,v)=>[u*C-v*S,y,u*S+v*C];
function radius(r,t){const dx=Math.cos(t),dz=Math.sin(t);let far=0;for(let i=0;i<r.length;i++){const a=r[i],c=r[(i+1)%r.length],vx=c[0]-a[0],vz=c[1]-a[1],den=dx*vz-dz*vx;if(Math.abs(den)<1e-8)continue;const d=(a[0]*vz-a[1]*vx)/den,u=(a[0]*dz-a[1]*dx)/den;if(d>=0&&u>=-1e-8&&u<=1+1e-8)far=Math.max(far,d);}return far;}
const point=(t,r,y)=>[r*Math.cos(t),y,r*Math.sin(t)],outerY=t=>36+4*Math.cos(t-.02116)**2,innerY=t=>31+3*Math.cos(t-.02116)**2;
const roofAt=(t,r)=>{const a=radius(IN,t),c=radius(OUT,t),f=Math.max(0,Math.min(1,(r-a)/(c-a)));return innerY(t)+(outerY(t)-innerY(t))*f;};
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=kit(b,THREE),angles=near?[...new Set([...OUT,...IN].map(p=>(Math.atan2(p[1],p[0])+2*Math.PI)%(2*Math.PI)).concat(near?Array.from({length:64},(_,i)=>i*2*Math.PI/64):[]))].sort((a,c)=>a-c):Array.from({length:48},(_,i)=>i*2*Math.PI/48);
 function annulus(mat,a,c,ra,rc,sa,sc,ya,yc,za,zc,up=1){k.face(mat,[point(a,ra,ya),point(c,rc,yc),point(c,sc,zc),point(a,sa,za)],[0,up,0]);}
 // Rounded playing-area boundary, independent of terrain; the field fits inside it.
 const frontRadius=t=>{const dx=Math.cos(t-.02116),dz=Math.sin(t-.02116),rx=40,rz=59.5,p=5;return 1/Math.pow((Math.abs(dx)/rx)**p+(Math.abs(dz)/rz)**p,1/p);};
 for(let i=0;i<angles.length;i++){
  const a=angles[i],c=i===angles.length-1?angles[0]+2*Math.PI:angles[i+1],oa=radius(OUT,a),oc=radius(OUT,c),ia=radius(IN,a),ic=radius(IN,c),ma=ia+(oa-ia)*.28,mc=ic+(oc-ic)*.28;
  // Flush radial ribs and circumferential purlins partition the roof panes.
  const roofPoint=(s,f)=>{const ra=ia+(oa-ia)*f,rc=ic+(oc-ic)*f,A=point(a,ra,roofAt(a,ra)),C=point(c,rc,roofAt(c,rc));return A.map((v,j)=>v+(C[j]-v)*s);},rib=Math.min(.25,(near?.5:.7)/Math.max(.1,Math.hypot((oa*Math.cos(a)-oc*Math.cos(c)),(oa*Math.sin(a)-oc*Math.sin(c)))));
  k.face('steel',[roofPoint(0,0),roofPoint(rib,0),roofPoint(rib,1),roofPoint(0,1)],[0,1,0]);
  for(const[lo,hi,mat]of[[0,.015,'steel'],[.015,.28,'roofglass'],[.28,.295,'steel'],[.295,.59,'roof'],[.59,.605,'steel'],[.605,.985,'roof'],[.985,1,'steel']])k.face(mat,[roofPoint(rib,lo),roofPoint(1,lo),roofPoint(1,hi),roofPoint(rib,hi)],[0,1,0]);
  annulus('roof',a,c,ia,ic,oa,oc,innerY(a)-.6,innerY(c)-.6,outerY(a)-.6,outerY(c)-.6,-1);
  k.face('roof',[point(a,oa,outerY(a)-.6),point(c,oc,outerY(c)-.6),point(c,oc,outerY(c)),point(a,oa,outerY(a))],[Math.cos((a+c)/2),0,Math.sin((a+c)/2)]);
  k.face('roof',[point(a,ia,innerY(a)-.6),point(c,ic,innerY(c)-.6),point(c,ic,innerY(c)),point(a,ia,innerY(a))],[-Math.cos((a+c)/2),0,-Math.sin((a+c)/2)]);
  const A=point(a,oa*.94,0),D=point(c,oc*.94,0),len=Math.hypot(D[0]-A[0],D[2]-A[2]),cols=Math.max(1,Math.round(len/(near?4:8))),out=[Math.cos((a+c)/2),0,Math.sin((a+c)/2)],at=(s,y)=>[A[0]+(D[0]-A[0])*s,y,A[2]+(D[2]-A[2])*s],patch=(m,s,t,y,z)=>k.face(m,[at(s,y),at(t,y),at(t,z),at(s,z)],out);
  patch('stone',0,1,0,3);for(const[y,z]of[[3,10.5],[10.5,18.5],[18.5,27]]){patch('stone',0,1,y,y+.6);for(let j=0;j<cols;j++){const s=j/cols,t=(j+1)/cols,pad=.06/cols;patch('stone',s,s+pad,y+.6,z);patch('glass',s+pad,t-pad,y+.6,z);patch('stone',t-pad,t,y+.6,z);}}
  // Setback upper gallery, visibly inside the white roof-support cores.
  annulus('stone',a,c,oa*.91,oc*.91,oa*.94,oc*.94,27,27,27,27);
  const aa=point(a,oa*.91,27),cc=point(c,oc*.91,27),ha=roofAt(a,oa*.91)-.6,hc=roofAt(c,oc*.91)-.6;
  k.face('glass',[aa,cc,point(c,oc*.91,hc),point(a,oa*.91,ha)],out);
  // Coarse stepped red bowl, closed with risers and coarser repeated tiers in far.
  const fa=frontRadius(a),fc=frontRadius(c),tiers=near?14:4;
  k.face('stone',[point(a,fa,0),point(c,fc,0),point(c,fc,2),point(a,fa,2)],[-Math.cos((a+c)/2),0,-Math.sin((a+c)/2)]);
  annulus('stone',a,c,oa*.88,oc*.88,oa*.91,oc*.91,27,27,27,27);
  for(let j=0;j<tiers;j++){const f=j/tiers,g=(j+1)/tiers,ra=fa+(oa*.88-fa)*f,rc=fc+(oc*.88-fc)*f,sa=fa+(oa*.88-fa)*g,sc=fc+(oc*.88-fc)*g,y=2+25*f,z=2+25*g;annulus('seats',a,c,ra,rc,sa,sc,y,y,y,y);k.face('seats',[point(a,sa,y),point(c,sc,y),point(c,sc,z),point(a,sa,z)],[-Math.cos((a+c)/2),0,-Math.sin((a+c)/2)]);}
 }
 // Adjacent turf and boundary/midfield strips share one plane; no layered paint.
 const rect=(mat,x0,x1,z0,z1)=>k.face(mat,[pitchPoint(x0,.16,z0),pitchPoint(x1,.16,z0),pitchPoint(x1,.16,z1),pitchPoint(x0,.16,z1)],[0,1,0]);
 rect('stone',-34,34,-52.5,-52.3);rect('stone',-34,34,52.3,52.5);rect('stone',-34,-33.8,-52.3,52.3);rect('stone',33.8,34,-52.3,52.3);rect('stone',-33.8,33.8,-.1,.1);rect('pitch',-33.8,33.8,-52.3,-.1);rect('pitch',-33.8,33.8,.1,52.3);
 for(const p of structureParts(detail))b.put(p.geometry,p.material);
 k.flush();return b.finish();
}
export function structureParts(detail='near'){
 const near=detail==='near',parts=[],coreAngles=[Math.PI/6,Math.PI/3,2*Math.PI/3,5*Math.PI/6,7*Math.PI/6,4*Math.PI/3,5*Math.PI/3,11*Math.PI/6],cores=coreAngles.map(t=>point(t,radius(OUT,t)*.94,0));
 for(let i=0;i<cores.length;i++){const p=cores[i],g=new THREE.BoxGeometry(4,29.5,4);g.rotateY(-.02116);g.translate(p[0],14.75,p[2]);parts.push({name:'core'+i,geometry:g,material:'stone'});}
 const pairs=[[1,6],[2,5],[0,3],[7,4]],segments=near?12:6;
 function bar(name,a,c,w,supports){const A=new THREE.Vector3(...a),B=new THREE.Vector3(...c),d=B.clone().sub(A),g=new THREE.BoxGeometry(w,d.length(),w);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()));g.translate(...A.add(B).multiplyScalar(.5).toArray());parts.push({name,a,c,geometry:g,supports,material:'steel'});}
 for(const[ia,ib]of pairs){const a=cores[ia],c=cores[ib],len=Math.hypot(c[0]-a[0],c[2]-a[2]),px=-(c[2]-a[2])/len,pz=(c[0]-a[0])/len;for(const i of[ia,ib]){const p=cores[i],A=[p[0]-3*px,32.8,p[2]-3*pz],C=[p[0]+3*px,32.8,p[2]+3*pz],base=[p[0],29.5,p[2]];bar('cap'+i,A,C,.5,['fork'+i+'-0','fork'+i+'-1']);bar('fork'+i+'-0',base,A,.55,['core'+i,'cap'+i]);bar('fork'+i+'-1',base,C,.55,['core'+i,'cap'+i]);}}
 for(const[t,[ia,ib]]of pairs.entries()){
  const a=cores[ia],c=cores[ib],p=(i,top)=>{const s=i/segments;return[a[0]+(c[0]-a[0])*s,(top?39.3:32.8)+2*Math.sin(Math.PI*s),a[2]+(c[2]-a[2])*s];};
  for(let i=0;i<segments;i++)for(const top of[false,true]){const tag=top?'top':'bottom',name=`${t}-${tag}${i}`,left=top?(i?`${t}-top${i-1}`:`${t}-post0`):(i?`${t}-bottom${i-1}`:`cap${ia}`),right=top?(i<segments-1?`${t}-top${i+1}`:`${t}-post${segments}`):(i<segments-1?`${t}-bottom${i+1}`:`cap${ib}`);bar(name,p(i,top),p(i+1,top),.4,[left,right]);}
  for(let i=0;i<=segments;i++)bar(`${t}-post${i}`,p(i,false),p(i,true),near?.24:.28,[`${t}-bottom${Math.min(i,segments-1)}`,`${t}-top${Math.min(i,segments-1)}`]);
  for(let i=0;i<segments;i++){const up=i%2===0;bar(`${t}-web${i}`,p(i,!up),p(i+1,up),near?.23:.28,[`${t}-${up?'bottom':'top'}${i}`,`${t}-${up?'top':'bottom'}${i}`]);}
 }
 return parts;
}
