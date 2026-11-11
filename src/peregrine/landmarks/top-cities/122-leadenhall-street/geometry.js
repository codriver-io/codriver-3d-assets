import*as THREE from'three';import{assetBuilder}from'../../asset-geometry.js';import{SPEC,PALETTES}from'./config.js';import{PARTS}from'./footprint.js';import{kit}from'./122-leadenhall-street-geometry-kit.js';
const ANG=-.00482,C=Math.cos(ANG),S=Math.sin(ANG),SOUTH=30.7,NORTH=-6.2,HALF=23.4,TOP=224.0;
export const framePoint=(u,y,v)=>[u*C-v*S,y,u*S+v*C];
export const frontAt=y=>SOUTH-Math.tan(10.62*Math.PI/180)*Math.max(0,y-28.5);
const position=(u,y,v)=>framePoint(u,y,v);
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=kit(b,THREE),cos=Math.cos(SPEC.origin[1]*Math.PI/180),r=id=>PARTS.find(p=>p.id===id).ring.slice(0,-1).map(([x,y])=>[(x-SPEC.origin[0])*111320*cos,(SPEC.origin[1]-y)*111320]);
 function block(r,lo,hi,rows,mat='backglass'){if(!near){r=r.map(p=>[...p]);let changed=true;while(changed&&r.length>3){changed=false;for(let i=0;i<r.length;i++){const a=r[(i+r.length-1)%r.length],p=r[i],c=r[(i+1)%r.length],dx=c[0]-a[0],dz=c[1]-a[1],l=dx*dx+dz*dz,t=((p[0]-a[0])*dx+(p[1]-a[1])*dz)/l;if(t>0&&t<1&&Math.abs(dx*(p[1]-a[1])-dz*(p[0]-a[0]))/Math.sqrt(l)<.12){r.splice(i,1);changed=true;break;}}}}const sign=Math.sign(k.area(r));r.forEach((a,i)=>{const c=r[(i+1)%r.length],len=Math.hypot(c[0]-a[0],c[1]-a[1]),cols=Math.max(1,(near?Math.round(len/3):Math.ceil(len/10))),out=[sign*(c[1]-a[1]),0,sign*(a[0]-c[0])],pt=(s,y)=>[a[0]+(c[0]-a[0])*s,y,a[1]+(c[1]-a[1])*s],patch=(m,s,t,y,z)=>k.face(m,[pt(s,y),pt(t,y),pt(t,z),pt(s,z)],out),count=near?rows:Math.max(1,Math.ceil(rows/3)),pad=Math.min(.17/cols,.14/Math.max(1,len));for(let v=0;v<count;v++){const y=lo+(hi-lo)*v/count,z=lo+(hi-lo)*(v+1)/count,band=v===0&&lo===0?1.2:(near?Math.min(.65,(z-y)*.18):Math.max(.65,z-y-11.45));patch(v===0&&lo===0?'steel':(near?'frame':'steel'),0,1,y,y+band);for(let j=0;j<cols;j++)patch(mat,j/cols+pad,(j+1)/cols-pad,y+band,z);for(let j=0;j<=cols;j++)patch((near?'frame':'steel'),Math.max(0,j/cols-pad),Math.min(1,j/cols+pad),y+band,z);}});k.cap('roof',r,hi);if(lo>0)k.cap((near?'frame':'steel'),r,lo,false);}
 // Exact mapped service/podium pieces; the south gallery retains daylight underneath.
 block(r(309415710),0,218.5,48);
 block(r(309415707),0,196,43);
 block(r(1138764582),0,130,28);block(r(1138764583),0,65,14);
 for(const[id,lo,hi,rows]of[[717955963,4,20.5,4],[717955965,20.5,24.5,1],[717955964,24.5,28.5,1]])block(r(id),lo,hi,rows,'glass');
 // Glazed wedge set inside the steel frame, sloped at the sourced 10.62 degrees.
 const H=HALF-1.3,front=y=>Math.max(NORTH+.18,frontAt(y)-1.3),rows=near?46:20;
 function surface(point,out,len){const cols=Math.max(2,(near?Math.round(len/2.7):Math.ceil(len/10)));for(let v=0;v<rows;v++){const y=28.5+(TOP-28.5)*v/rows,z=28.5+(TOP-28.5)*(v+1)/rows,mid=y+(near?.35:.65),pad=.06/cols,patch=(m,s,t,lo,hi)=>k.face(m,[point(s,lo),point(t,lo),point(t,hi),point(s,hi)],out);patch((near?'frame':'steel'),0,1,y,mid);for(let j=0;j<cols;j++)patch('glass',j/cols+pad,(j+1)/cols-pad,mid,z);for(let j=0;j<=cols;j++)patch((near?'frame':'steel'),Math.max(0,j/cols-pad),Math.min(1,j/cols+pad),mid,z);}}
 surface((s,y)=>position(-H+2*H*s,y,front(y)),[0,0,1],2*H);
 for(const side of[-1,1])surface((s,y)=>position(side*H,y,NORTH+(front(y)-NORTH)*s),[side,0,0],SOUTH-NORTH);
 k.face('roof',[position(-H,28.5,NORTH),position(H,28.5,NORTH),position(H,28.5,front(28.5)),position(-H,28.5,front(28.5))],[0,-1,0]);
 k.face('roof',[position(-H,TOP,NORTH),position(H,TOP,NORTH),position(H,TOP,front(TOP)),position(-H,TOP,front(TOP))],[0,1,0]);
 // Roof trough: closed wall sections, open top, plant seated on the service roof.
 const rim=r(309415710);for(let i=0;i<rim.length;i++){const a=rim[i],c=rim[(i+1)%rim.length],len=Math.hypot(c[0]-a[0],c[1]-a[1]);if(len<.1)continue;b.box('service',[(a[0]+c[0])/2,220.95,(a[1]+c[1])/2],[len,4.9,.7],-Math.atan2(c[1]-a[1],c[0]-a[0]));}
 for(const u of(near?[-16,-8,0,8,16]:[-16,0,16]))b.box('roof',position(u,219.4,NORTH-4),[3,1.8,2]);
 for(const p of structureParts(detail))b.put(p.geometry,p.material??'steel');
 k.flush();return b.finish();
}
export function structureParts(detail='near'){
 const near=detail==='near',parts=[],back=NORTH-8,levels=Array.from({length:8},(_,i)=>28.5+(TOP-28.5)*i/7),cols=[-HALF,0,HALF];
 function bar(name,a,c,w,supports){const A=new THREE.Vector3(...a),B=new THREE.Vector3(...c),d=B.clone().sub(A),g=new THREE.BoxGeometry(w,d.length(),w);if(!near){g.setIndex([...g.index.array.slice(0,12),...g.index.array.slice(24)]);g.clearGroups();}g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()));g.translate(...A.add(B).multiplyScalar(.5).toArray());parts.push({name,a,c,geometry:g,supports});}
 function foot(name,u,v){const g=new THREE.BoxGeometry(1.4,.6,1.4);g.rotateY(ANG);g.translate(...position(u,.3,v));parts.push({name,geometry:g,material:'steel'});}
 cols.forEach((u,i)=>{foot('footF'+i,u,SOUTH);foot('footB'+i,u,back);bar('frontLow'+i,position(u,0,SOUTH),position(u,28.5,SOUTH),near?1.1:1.2,['footF'+i,'frontCol'+i]);bar('frontCol'+i,position(u,28.5,frontAt(28.5)),position(u,TOP,frontAt(TOP)),near?1.1:1.2,['frontLow'+i,'frontBeam7']);bar('backCol'+i,position(u,0,back),position(u,TOP,back),near?1.1:1.2,['footB'+i,'backBeam7']);});
 levels.forEach((y,j)=>{bar('frontBeam'+j,position(-HALF,y,frontAt(y)),position(HALF,y,frontAt(y)),near?.9:1.0,['frontCol0','frontCol2']);bar('backBeam'+j,position(-HALF,y,back),position(HALF,y,back),near?.9:1.0,['backCol0','backCol2']);for(const[i,u]of[[0,-HALF],[2,HALF]])bar('sideBeam'+i+'-'+j,position(u,y,frontAt(y)),position(u,y,back),near?.9:1.0,['frontCol'+i,'backCol'+i]);});
 for(let j=0;j<levels.length-1;j++){const y=levels[j],z=levels[j+1];for(const side of['front','back'])for(let i=0;i<2;i++){const v=t=>side==='front'?frontAt(t):back;bar(side+'DiagA'+i+'-'+j,position(cols[i],y,v(y)),position(cols[i+1],z,v(z)),near?.7:.85,[side==='front'?'frontCol'+i:'backCol'+i,side==='front'?'frontCol'+(i+1):'backCol'+(i+1)]);bar(side+'DiagB'+i+'-'+j,position(cols[i+1],y,v(y)),position(cols[i],z,v(z)),near?.7:.85,[side==='front'?'frontCol'+(i+1):'backCol'+(i+1),side==='front'?'frontCol'+i:'backCol'+i]);}
 for(const[i,u]of[[0,-HALF],[2,HALF]]){bar('sideDiagA'+i+'-'+j,position(u,y,frontAt(y)),position(u,z,back),near?.7:.85,['frontCol'+i,'backCol'+i]);bar('sideDiagB'+i+'-'+j,position(u,y,back),position(u,z,frontAt(z)),near?.7:.85,['backCol'+i,'frontCol'+i]);}}
 return parts;
}
