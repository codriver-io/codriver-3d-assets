import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { PARTS, ROTATION, TOWER } from './gare-de-lyon-clock-tower-site.js';

/** Original texture-free construction in a mapped facade frame, rotated once. */
export function create({detail='near'}={}) {
  const near=detail==='near', n=near?24:12;
  const raw=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  // Carved limestone and the wall share one draw/depth layer: buried cornice faces
  // can never create reciprocal material ordering. Clock marks have their own outward layer.
  const fold=m=>m==='trim'?'stone':m;
  const b={...raw,put:(g,m,...r)=>raw.put(g,fold(m),...r),box:(m,...r)=>raw.box(fold(m),...r),bar:(m,...r)=>raw.bar(fold(m),...r)};
  const named=new Map(), members=[];
  function namedBox(name,m,a,c,y0,y1,d,e){
    const g=new THREE.BoxGeometry(c-a,y1-y0,e-d);g.translate((a+c)/2,(y0+y1)/2,(d+e)/2);
    named.set(name,g.clone());b.put(g,m);
  }
  function namedBar(name,a,c,width,supportA,supportB){
    const av=new THREE.Vector3(...a),cv=new THREE.Vector3(...c),delta=cv.clone().sub(av);
    const g=new THREE.BoxGeometry(width,delta.length(),width);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize()));g.translate(...av.add(cv).multiplyScalar(.5).toArray());
    named.set(name,g.clone());b.put(g,'iron');members.push({name,a,c,supportA,supportB});
  }
  const box=(m,u0,u1,y0,y1,v0,v1)=>b.box(m,[(u0+u1)/2,(y0+y1)/2,(v0+v1)/2],[u1-u0,y1-y0,v1-v0]);
  function poly(m,pts,y0,y1) {
    const s=new THREE.Shape(pts.map(([u,v])=>new THREE.Vector2(u,-v)));
    const g=new THREE.ExtrudeGeometry(s,{depth:y1-y0,bevelEnabled:false,steps:1});
    g.rotateX(-Math.PI/2);g.translate(0,y0,0);b.put(g,m);
  }
  function loft(m,tiers) {
    const p=[],ix=[];
    for(const [a,c,d,e,y] of tiers)p.push(a,y,d,c,y,d,c,y,e,a,y,e);
    for(let j=0;j<tiers.length-1;j++)for(let i=0;i<4;i++) {const a=j*4+i,c=j*4+(i+1)%4;ix.push(a,a+4,c,c,a+4,c+4);}
    const k=(tiers.length-1)*4;ix.push(k,k+2,k+1,k,k+3,k+2);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(ix);g.computeVertexNormals();b.put(g,m);
  }
  function reverse(g){const a=g.index.array;for(let i=0;i<a.length;i+=3){const t=a[i+1];a[i+1]=a[i+2];a[i+2]=t;}g.computeVertexNormals();return g;}
  const rect=(a,c,y0,y1)=>{const s=new THREE.Path();s.moveTo(a,y0);s.lineTo(a,y1);s.lineTo(c,y1);s.lineTo(c,y0);s.closePath();return s;};
  function arch(c,w,y0,top) {
    const r=w/2,s=new THREE.Path();s.moveTo(c-r,y0);s.lineTo(c-r,top-r);
    s.absarc(c,top-r,r,Math.PI,0,true);s.lineTo(c+r,y0);s.closePath();return s;
  }
  function wall(a,c,y0,y1,v,holes,mat='stone') {
    const s=new THREE.Shape();s.moveTo(a,y0);s.lineTo(c,y0);s.lineTo(c,y1);s.lineTo(a,y1);s.closePath();
    for(const h of holes)s.holes.push(h);
    const g=new THREE.ExtrudeGeometry(s,{depth:.7,bevelEnabled:false,curveSegments:near?12:4});g.translate(0,0,v);b.put(g,mat);
    for(const h of holes){const pane=new THREE.Shape(h.getPoints(near?12:4));const g=new THREE.ShapeGeometry(pane,near?12:4);reverse(g);g.translate(0,0,v+.55);b.put(g,'glow');}
  }
  function arcTrim(c,r,spring,v,width=.35) {
    const s=new THREE.Shape();s.absarc(c,spring,r+width,0,Math.PI,false);s.lineTo(c-r,spring);s.absarc(c,spring,r,Math.PI,0,true);s.closePath();
    const g=new THREE.ExtrudeGeometry(s,{depth:.2,bevelEnabled:false,curveSegments:near?12:4});g.translate(0,0,v);b.put(g,'trim');
  }
  function sphere(m,c,r,scale=[1,1,1]) {const g=new THREE.SphereGeometry(r,near?8:5,near?6:4);g.scale(...scale);g.translate(...c);b.put(g,m);}
  function cyl(m,c,r0,r1,h,sides=n) {const g=new THREE.CylinderGeometry(r1,r0,h,sides);g.translate(...c);b.put(g,m);}
  // Complete owned outline: rigid station platform, not a surrounding plaza.
  poly('stone',PARTS[1161318094],0,.6);
  poly('stone',PARTS[115948491],.6,23.5);
  loft('roof',[[-68,-48,-24,62,23.5],[-64,-51,-19,59,29.8]]);
  poly('stone',PARTS[115928131],.6,23.6);
  poly('roof',PARTS[115928131],23.6,24.0);
  // Punched headhouse facade: seven fanlights and upper restaurant window rhythm.
  const cs=[-25,-14.7,-4.4,5.9,16.2,26.5,36.8];
  const holes=cs.map(c=>arch(c,7.0,2.4,15.4));
  for(let u=-28;u<45;u+=3.4)holes.push(rect(u-.8,u+.8,18.7,22.1));
  wall(-32,46,.6,23.6,-26,holes);
  box('stone',-32,46,.6,23.6,-25.3,-11.1);
  for(const c of cs){
    arcTrim(c,3.5,11.9,-26.25,.55);
    box('trim',c-4.05,c-3.5,2.3,11.9,-26.25,-25.95);box('trim',c+3.5,c+4.05,2.3,11.9,-26.25,-25.95);
    if(near){
      box('iron',c-.075,c+.075,2.4,15.2,-25.65,-25.5);
      for(const y of [5.3,8.6,11.9])box('iron',c-3.45,c+3.45,y,y+.12,-25.65,-25.5);
      for(let j=1;j<6;j++){const a=j*Math.PI/6;b.bar('iron',[c,11.9,-25.6],[c+3.4*Math.cos(a),11.9+3.4*Math.sin(a),-25.6],.1);}
    }
  }
  for(const [lo,hi,depth] of [[1,1.55,.25],[16.2,16.8,.38],[17.7,18.25,.55],[23.4,24.15,.6]])box('trim',-32,46,lo,hi,-26-depth,-11);
  loft('roof',[[-32,46,-26,-11,24.15],[-30,44,-22,-14,28.6],[-29.4,43.4,-21.5,-14.5,30]]);
  loft('roof',[[-42.2,46,-11,1.2,20],[-41.8,45.5,-5,-4.8,25]]);
  for(let u=-27;u<45;u+=near?5.15:10.3){
    box('trim',u-.8,u+.8,25.1,27.35,-25.3,-23.1);
    box('glass',u-.5,u+.5,25.5,26.9,-25.55,-25.31);
    loft('roof',[[u-1,u+1,-25.6,-22.9,27.35],[u-.4,u+.4,-25.1,-23.3,28.2]]);
  }
  if(near){
    for(let u=-31;u<46;u+=1.25)box('trim',u,u+.5,22.9,23.35,-26.4,-25.9);
    // Grouped allegorical heads and draped bodies, supported by attic pedestals.
    for(const c of [-20,6,32]){
      box('trim',c-2.3,c+2.3,24.1,24.65,-26.2,-23.8);
      for(const [dx,h] of [[-1.25,1.8],[0,2.5],[1.25,1.8]]){
        sphere('trim',[c+dx,24.65+h/2,-24.9],.5,[.8,h,.7]);sphere('trim',[c+dx,24.65+h+.24,-24.9],.3);
        b.bar('trim',[c+dx,25.6,-24.9],[c+dx+(dx<0?-.8:.8),25.05,-25],.32);
      }
    }
  }
  // Front end pavilion on the return wing; preserves the station's enclosing L-shaped facade.
  for(const c of [-61,-52]) {
    const h=arch(c,5.0,3.2,14.7),g=new THREE.ShapeGeometry(new THREE.Shape(h.getPoints(near?12:4)));
    reverse(g);g.translate(0,0,-28.25);b.put(g,'glow');
    arcTrim(c,2.5,12.2,-28.5,.45);
    for(const y of [17.5,21])box('glass',c-1.25,c+1.25,y,y+2,-28.3,-28.1);
  }
  for(const y of [1.2,16,23.4])box('trim',-66.5,-47.7,y,y+.45,-28.55,-27.9);
  for(const u of [-66,-56.5,-48.2])box('trim',u-.35,u+.35,1.6,23.4,-28.45,-28.1);
  // Pilasters divide the great facade bays; roundels punctuate the attic.
  for(let u=-30;u<45;u+=10.3){
    box('trim',u-.32,u+.32,1.6,16.25,-26.48,-26.04);
    box('trim',u-.62,u+.62,15.6,16.25,-26.63,-26.04);
  }
  function sidePane(x,y,v,w,h,positive=false){
    const g=new THREE.PlaneGeometry(w,h);g.rotateY(positive?Math.PI/2:-Math.PI/2);g.translate(x,y+h/2,v+w/2);b.put(g,'glass');
  }
  // Separate window bays survive in far detail.
  for(let v=-16;v<59;v+=near?4:8)for(const y of [4.5,10.6,17.5]){
    sidePane(-69.25,y,v,2.3,3);
    box('trim',-69.5,-69.19,y-.25,y,v-.15,v+2.45);
  }
  // Follow the Chalon range's actual exterior edges, including its diagonal front return.
  const east=PARTS[115928131];
  const area=east.reduce((sum,q,i)=>{const r=east[(i+1)%east.length];return sum+q[0]*r[1]-r[0]*q[1];},0);
  for(let i=0;i<east.length;i++){
    const a=east[i],c=east[(i+1)%east.length],du=c[0]-a[0],dv=c[1]-a[1],length=Math.hypot(du,dv);
    if(length<3.5||(a[0]+c[0])/2<49)continue;
    const count=Math.max(1,Math.floor(length/(near?3.6:7.2))),w=Math.min(1.8,length/(count+1)),sgn=area>0?1:-1;
    const nu=sgn*dv/length,nv=-sgn*du/length;
    for(let j=0;j<count;j++)for(const y of [4.5,10.6,17.5]){
      const t=(j+.5)/count,cu=a[0]+du*t+nu*.27,cv=a[1]+dv*t+nv*.27;
      const g=new THREE.BufferGeometry(),p=[];
      for(const [d,yy] of [[-w/2,y],[w/2,y],[w/2,y+3],[-w/2,y+3]])p.push(cu+du/length*d,yy,cv+dv/length*d);
      g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(area>0?[0,2,1,0,3,2]:[0,1,2,0,2,3]);g.computeVertexNormals();b.put(g,'glass');
    }
  }
  // Hall 1: 189 m glass/iron shed behind the head building.
  const ua=-38.7,uc=45.7,va=1.5,vc=189,span=uc-ua,mid=(ua+uc)/2;
  const segments=near?16:8, roofY=u=>20+10*Math.sqrt(Math.max(0,1-((u-mid)/(span/2))**2));
  for(let i=0;i<segments;i++){
    const u0=ua+span*i/segments,u1=ua+span*(i+1)/segments;
    const p=[u0,roofY(u0),va,u0,roofY(u0),vc,u1,roofY(u1),vc,u1,roofY(u1),va];
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();b.put(g,i%4===0?'roof':'glass');
  }
  const rows=near?20:10, pitch=(vc-va)/rows;
  for(const [j,u] of [ua,uc].entries()){
    namedBox('plinth-'+j,'stone',u-.25,u+.25,.6,3.4,va,vc);
    for(let k=0;k<=rows;k++){
      const v=va+k*pitch;
      namedBox(`post-${j}-${k}`,'iron',u-.28,u+.28,3.3,20.3,v-.28,v+.28);
    }
    namedBox('eave-'+j,'iron',u-.3,u+.3,19.65,20.3,va,vc);
    members.push({name:'eave-'+j,a:[u,20,va],c:[u,20,vc],supportA:`post-${j}-0`,supportB:`post-${j}-${rows}`});
  }
  for(let k=0;k<=rows;k++)for(let i=0;i<segments;i++){
    const a=ua+span*i/segments,c=ua+span*(i+1)/segments,v=va+k*pitch;
    const left=i===0?'eave-0':'purlin-'+i,right=i===segments-1?'eave-1':'purlin-'+(i+1);
    namedBar(`rib-${k}-${i}`,[a,roofY(a)+.1,v],[c,roofY(c)+.1,v],near?.22:.32,left,right);
  }
  for(let i=1;i<segments;i++){
    const u=ua+span*i/segments,y=roofY(u)+.15;
    namedBox('purlin-'+i,'iron',u-.1,u+.1,y-.1,y+.1,va,vc);
    members.push({name:'purlin-'+i,a:[u,y,va],c:[u,y,vc],supportA:`rib-0-${i}`,supportB:`rib-${rows}-${i}`});
  }
  // Lower modern Hall 2 follows the southeast footprint.
  poly('roof',[[46,129],[102,128],[102,124],[137,124],[137,162],[141.5,162],[141.5,183],[46,183]],.6,10.5);
  for(const [a,c,d,e] of [[47,74,130,182],[75,102,130,182],[103,136,125,182]]){
    loft('roof',[[a,c,d,e,10.5],[a+8,c-6,d,e,13.6]]);
    for(let v=d+4;v<e;v+=near?6:12)box('glass',a+9,c-7,13.48,13.61,v,v+2.7);
  }
  // Tour de l'Horloge: stem, four pale 6.4 m dials, ribbed dome and lantern.
  const [tu,tv]=TOWER;
  box('stone',tu-4.65,tu+4.65,.6,37.3,tv-4.35,tv+4.35);
  for(const side of [-1,1])for(const u of [tu-4.6,tu+3.65])box('trim',u,u+.95,1,37.3,tv+side*4.25-.25,tv+side*4.25+.25);
  for(const angle of [0,Math.PI/2,Math.PI,Math.PI*1.5]){
    const map=(x,y,z)=>[tu+x*Math.cos(angle)+z*Math.sin(angle),y,tv-x*Math.sin(angle)+z*Math.cos(angle)];
    function localBox(m,c,s,rot=0){const g=new THREE.BoxGeometry(...s);g.rotateZ(rot);g.translate(...c);g.rotateY(angle);g.translate(tu,0,tv);b.put(g,m);}
    const recess=arch(0,3.2,18.5,31.9),sg=new THREE.ShapeGeometry(new THREE.Shape(recess.getPoints(near?12:4)));
    reverse(sg);sg.translate(0,0,-4.92);sg.rotateY(angle);sg.translate(tu,0,tv);b.put(sg,'glass');
    for(const x of [-1.9,0,1.9])localBox('glass',[x,34.7,-4.95],[.8,2.6,.12]);
    if(near)for(const y of [19.6,23,26.4,29.8])localBox('trim',[0,y,-5.1],[3.5,.25,.38]);
    for(const x of (near?[-3.7,-2.45,-1.2,0,1.2,2.45,3.7]:[-3.7,0,3.7]))localBox('trim',[x,37.5,-4.7],[.45,1.0,.65]);
    const dial=new THREE.CircleGeometry(3.2,near?48:24);dial.rotateY(Math.PI);dial.translate(0,44.1,-5.32);dial.rotateY(angle);dial.translate(tu,0,tv);b.put(dial,'clock');
    const ring=new THREE.RingGeometry(3.24,3.65,near?48:24);ring.rotateY(Math.PI);ring.translate(0,44.1,-5.36);ring.rotateY(angle);ring.translate(tu,0,tv);b.put(ring,'trim');
    for(let i=0;i<12;i++){
      const a=i*Math.PI/6,x=Math.sin(a)*2.75,y=44.1+Math.cos(a)*2.75;
      localBox('mark',[x,y,-5.57],[.14,i%3===0?.65:.42,.12],-a);
      if(near&&i%3===0)for(const dx of [-.19,.19])localBox('mark',[x+dx,y,-5.57],[.09,.55,.12],-a);
    }
    for(const [a,len] of [[Math.PI/3,2.25],[-Math.PI/2,1.7]])b.bar('iron',map(0,44.1,-5.69),map(Math.sin(a)*len,44.1+Math.cos(a)*len,-5.69),.18,.13);
    sphere('iron',map(0,44.1,-5.72),.2);
  }
  box('stone',tu-5.05,tu+5.05,38,50,tv-5.05,tv+5.05);
  for(const [y,w,h] of [[37.2,10.1,.8],[38.2,10.6,.65],[50,10.75,.7],[51.2,10.2,1],[52.2,9.3,.7]])box('trim',tu-w/2,tu+w/2,y,y+h,tv-w/2,tv+w/2);
  for(const du of [-4,4])for(const dv of [-4,4]){
    box('trim',tu+du-.55,tu+du+.55,50.6,53.5,tv+dv-.55,tv+dv+.55);sphere('trim',[tu+du,53.55,tv+dv],.6);
  }
  cyl('roof',[tu,53.3,tv],4.15,4.15,1.2);
  const profile=[[4.15,53.8],[4.05,55.5],[3.4,58.5],[2.3,61.3],[1.25,62.7]];
  const dome=new THREE.LatheGeometry(profile.map(([r,y])=>new THREE.Vector2(r,y)),n);dome.translate(tu,0,tv);b.put(dome,'roof');
  for(let j=0;j<(near?16:8);j++)for(let i=0;i<profile.length-1;i++){
    const a=j*2*Math.PI/(near?16:8),p=profile[i],q=profile[i+1];
    b.bar('trim',[tu+(p[0]+.07)*Math.sin(a),p[1],tv+(p[0]+.07)*Math.cos(a)],[tu+(q[0]+.07)*Math.sin(a),q[1],tv+(q[0]+.07)*Math.cos(a)],.12);
  }
  cyl('trim',[tu,63,tv],1.45,1.45,.7);cyl('roof',[tu,64.1,tv],.85,.7,1.5);
  cyl('trim',[tu,65.2,tv],1.05,.45,.7);cyl('roof',[tu,66.05,tv],.48,.05,1);
  sphere('trim',[tu,66.7,tv],.3);
  const root=b.finish();
  root.traverse(o=>{if(o.isMesh){o.geometry.deleteAttribute('bridgeLift');o.geometry.rotateY(ROTATION);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();}});
  // Non-exported inspection geometry records the actual merged members and their named supports.
  root.structuralQA={named,members};
  return root;
}
