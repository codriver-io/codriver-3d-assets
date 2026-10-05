import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { BODY, REAR_ROOF } from './romanian-athenaeum-plan.js';

const ROT = SPEC.rotation * Math.PI / 180;
export const plan = (x,y,z) => [x*Math.cos(ROT)+z*Math.sin(ROT),y,-x*Math.sin(ROT)+z*Math.cos(ROT)];
export const unplan = (x,z) => [x*Math.cos(ROT)-z*Math.sin(ROT),x*Math.sin(ROT)+z*Math.cos(ROT)];
const DC = [-0.6,0.8];

export function create({detail='near'}={}) {
  const near=detail==='near', N=near?40:20;
  const b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  function put(g,mat,x=0,y=0,z=0,angle=0) { g.rotateY(angle);g.translate(x,y,z);g.rotateY(ROT);b.put(g,mat); }
  function box(mat,x,y,z,w,h,d,angle=0) { put(new THREE.BoxGeometry(w,h,d),mat,x,y,z,angle); }
  function bar(mat,a,c,w,depth=w) { b.bar(mat,plan(...a),plan(...c),w,depth); }
  function cyl(mat,x,z,y0,y1,r0,r1=r0,n=N) { put(new THREE.CylinderGeometry(r1,r0,y1-y0,n),mat,x,(y0+y1)/2,z); }
  function profile(mat,x,z,points,n=N) { put(new THREE.LatheGeometry(points.map(([r,y])=>new THREE.Vector2(r,y)),n),mat,x,0,z); }
  function prism(mat,points,y0,h) {
    const s=new THREE.Shape(points.map(([x,z])=>new THREE.Vector2(x,-z)));
    const g=new THREE.ExtrudeGeometry(s,{depth:h,bevelEnabled:false});g.rotateX(-Math.PI/2);put(g,mat,0,y0,0);
  }
  function triangle(mat,z,depth,half,bottom,top) {
    const s=new THREE.Shape([new THREE.Vector2(-half,bottom),new THREE.Vector2(half,bottom),new THREE.Vector2(0,top)]);
    put(new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:false}),mat,0,0,z);
  }
  function ring(mat,x,y,z,radius,tube,angle=0,sx=1,sy=1) {
    const g=new THREE.TorusGeometry(radius,tube,near?5:3,near?20:12);g.scale(sx,sy,1);put(g,mat,x,y,z,angle);
  }
  function circle(mat,x,y,z,r,angle=0,sx=1,sy=1) {
    const g=new THREE.CircleGeometry(r,near?20:12);g.scale(sx,sy,1);put(g,mat,x,y,z,angle);
  }

  // Exact mapped body, leaving the portico open.
  prism('stone',BODY,0,11);
  prism('trim',BODY.map(([x,z])=>[x*.999,z*.999]),11,.5);
  for(let i=0;i<BODY.length;i++) {
    const p=BODY[i],q=BODY[(i+1)%BODY.length],dx=q[0]-p[0],dz=q[1]-p[1],L=Math.hypot(dx,dz);
    const t=[dx/L,dz/L],normal=[-t[1],t[0]];
    const at=(s,out,y)=>[p[0]+t[0]*s+normal[0]*out,y,p[1]+t[1]*s+normal[1]*out];
    if(L<5)continue;
    const angle=Math.atan2(-t[1],t[0]);
    for(const [y,h,out] of [[1,.5,.08],[7.7,.3,.09],[10.75,.4,.18]])box('trim',...at(L/2,out,y),L-.08,h,.36,angle);
    const count=Math.floor(L/4.7);
    for(let j=0;j<count;j++) {
      const s=(j+.5)*L/count,c=at(s,.12,4.3);if(i===0&&Math.abs(c[0])<13)continue;
      box('glass',...c,1.9,4.8,.18,angle);
      if(near) {
        for(const d of [-1.06,1.06])box('trim',...at(s+d,.20,4.3),.20,5.1,.35,angle);
        for(const yy of [1.7,6.9])box('trim',...at(s,.22,yy),2.4,.26,.42,angle);
        box('wood',...at(s,.26,4.3),.08,4.6,.13,angle);
        for(const yy of [3.1,5.0])box('wood',...at(s,.25,yy),1.8,.10,.13,angle);
        box('trim',...at(s-L/count/2+.45,.18,6.1),.7,9.1,.35,angle);
        box('trim',...at(s-L/count/2+.45,.2,10.25),1.1,.4,.5,angle);
      }
    }
  }
  // Hipped wing roofs and irregular rear annex.
  prism('roof',BODY.map(([x,z])=>[x*.982,z*.982]),11.5,.15);
  for(const [x,z,w,d] of [[-19.7,1.3,9.5,29],[18.6,.7,9.2,29]]) {
    const s=new THREE.Shape([new THREE.Vector2(-w/2,11.5),new THREE.Vector2(w/2,11.5),new THREE.Vector2(w/2-2.1,13),new THREE.Vector2(-w/2+2.1,13)]);
    put(new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:false}),'roof',x,0,z-d/2);
  }
  prism('stone',REAR_ROOF,11.55,3.10);
  prism('glass',REAR_ROOF,14.65,.18);
  if(near)for(let i=1;i<REAR_ROOF.length;i+=2) {
    const [x,z]=REAR_ROOF[i];bar('roof',[-.6,14.86,-17.5],[x,14.86,z],.15);
  }

  // Steps, six front Ionic columns and the two returns.
  for(let i=0;i<5;i++)box('trim',0,.1+i*.1,25.0-i*.25,26.3,.2+i*.2,.5+i*.5);
  box('trim',0,.7,20.75,26.1,1.4,8.2);
  const columns=[...[-11,-6.6,-2.2,2.2,6.6,11].map(x=>[x,24.45]),[-11,19.1],[11,19.1]];
  for(const [x,z] of columns) {
    box('trim',x,1.48,z,1.5,.36,1.5);
    profile('trim',x,z,[[0,1.6],[.78,1.6],[.79,1.8],[.62,2.05],[.56,2.16],[.505,12.55],[.7,12.7],[.78,13.1],[0,13.1]],near?32:8);
    if(near) {
      for(let k=0;k<24;k++){const a=k*2*Math.PI/24;bar('trim',[x+.566*Math.sin(a),2.16,z+.566*Math.cos(a)],[x+.505*Math.sin(a),12.55,z+.505*Math.cos(a)],.065);}
      for(const d of [-.58,.58])ring('trim',x+d,12.91,z+.60,.29,.095);
    }
    box('trim',x,13.19,z,1.75,.3,1.5);
  }
  box('stone',0,14.06,20.8,26.4,1.45,8.35);
  box('trim',0,13.51,20.9,26.8,.22,8.55);
  box('trim',0,14.94,20.8,27.05,.35,8.65);
  triangle('stone',16.6,8.9,13.1,15.12,18.5);
  for(const z of [25.57,16.55])for(const sg of [-1,1])bar('trim',[sg*13.5,15.25,z],[0,18.77,z],.38,.5);
  box('trim',0,15.23,25.63,27.4,.32,.46);
  if(near) {
    for(let x=-12.5;x<13;x+=.42)box('trim',x,14.59,25.25,.19,.25,.3);
    for(let x=-12.1;x<12.5;x+=.45)box('trim',x,15.48,25.55,.13,.30,.25);
    box('trim',0,14.1,25.07,18,.72,.15); // inscription field; tiny lettering omitted
  }
  // Five mosaic medallions and oak doors in the recessed wall.
  for(const x of [-8.8,-4.4,0,4.4,8.8]) {
    box('wood',x,4.0,16.84,2.9,6.0,.2);
    box('glow',x,5.0,16.97,2.6,3.7,.13);
    circle('gold',x,10.4,16.98,.66);ring('trim',x,10.4,17.02,.72,.12);
    if(near) {
      const head=new THREE.SphereGeometry(.17,8,5);head.scale(1,1.2,.4);put(head,'wood',x,10.57,17.07);
      box('wood',x,10.18,17.04,.35,.28,.10);
      for(const dx of [-1.32,0,1.32])box('wood',x+dx,4.8,17.06,.09,5.0,.11);
      for(const yy of [2.7,4.3,6.3])box('wood',x,yy,17.06,2.6,.10,.11);
      for(const dx of [-1.60,1.60])box('trim',x+dx,4.6,17.0,.18,7.1,.35);
    }
  }
  // Crossed geometric frieze grilles alongside the portico.
  for(const x of [-22.7,-19.2,-15.7,15.7,19.2,22.7]) {
    box('glass',x,9.05,16.9,2.5,1.3,.2);
    for(const yy of [8.28,9.83])box('trim',x,yy,17.06,2.9,.18,.32);
    for(const dx of [-1.4,1.4])box('trim',x+dx,9.05,17.06,.16,1.5,.32);
    if(near)for(const sg of [-1,1])bar('trim',[x-1.12,9.05-sg*.48,17.14],[x+1.12,9.05+sg*.48,17.14],.10);
  }

  // Twenty oculi with lyre grilles, paired pilasters and circular cornices.
  const [cx,cz]=DC,R=SPEC.domeDiameter/2;
  cyl('stone',cx,cz,11.6,20.8,R);
  profile('trim',cx,cz,[[R,15.1],[R+.20,15.1],[R+.24,15.45],[R,15.6]]);
  profile('trim',cx,cz,[[R,20.4],[R+.3,20.4],[R+.5,20.8],[R+.5,21.1],[R+.25,21.35],[R,21.5]]);
  for(let i=0;i<20;i++) {
    const a=i*Math.PI*2/20;
    circle('glass',cx+(R+.06)*Math.sin(a),18.1,cz+(R+.06)*Math.cos(a),.91,a,1,1.22);
    ring('trim',cx+(R+.16)*Math.sin(a),18.1,cz+(R+.16)*Math.cos(a),1.01,.13,a,1,1.22);
    const loc=(dx,y,d)=>[cx+(R+d)*Math.sin(a)+dx*Math.cos(a),y,cz+(R+d)*Math.cos(a)-dx*Math.sin(a)];
    if(near) {
      for(const dx of [-.37,.37])bar('trim',loc(dx,17.30,.2),loc(dx*.8,18.86,.2),.08);
      for(const yy of [17.52,18.25,18.62])bar('trim',loc(-.32,yy,.2),loc(.32,yy,.2),.065);
      const bow=new THREE.TorusGeometry(.31,.045,4,12,Math.PI);bow.rotateZ(Math.PI);put(bow,'trim',...loc(0,17.72,.25),a);
      for(const dx of [-.17,0,.17])bar('gold',loc(dx,17.5,.28),loc(dx,18.65,.28),.035);
      for(const offset of [-.35,.35]){
        const aa=a+Math.PI/20+offset/R;
        box('trim',cx+(R+.13)*Math.sin(aa),18.04,cz+(R+.13)*Math.cos(aa),.3,4.35,.29,aa);
      }
      const aa=a+Math.PI/20;box('trim',cx+(R+.18)*Math.sin(aa),20.12,cz+(R+.18)*Math.cos(aa),1.13,.34,.48,aa);
    }
  }
  // Shallow zinc dome, forty radial seams and two-tier lantern with finial.
  const dome=[[R,21.35],[R,21.6],[13.4,22.35],[11.5,23.55],[8.5,24.5],[5.2,25.1],[4.8,25.25]];
  profile('roof',cx,cz,dome);
  for(let i=0;i<(near?40:20);i++) {
    const a=i*Math.PI*2/(near?40:20);
    for(let j=1;j<dome.length;j++){
      const [r0,y0]=dome[j-1],[r1,y1]=dome[j];
      bar('roof',[cx+r0*Math.sin(a),y0+.07,cz+r0*Math.cos(a)],[cx+r1*Math.sin(a),y1+.07,cz+r1*Math.cos(a)],near?.105:.16);
    }
  }
  cyl('trim',cx,cz,25.1,25.55,5.0);
  cyl('glass',cx,cz,25.55,26.8,4.55);
  for(let i=0;i<(near?20:10);i++){const a=i*2*Math.PI/(near?20:10);box('trim',cx+4.6*Math.sin(a),26.13,cz+4.6*Math.cos(a),.18,1.28,.3,a);}
  profile('roof',cx,cz,[[4.85,26.75],[4.9,27],[3.7,27.45],[2.1,27.85],[1.2,28.25],[0,28.3]]);
  // Repeated zinc crest leaves at the lantern foot and cornice; simplified botanical relief.
  for(let i=0;i<(near?20:10);i++) {
    const a=i*Math.PI*2/(near?20:10),r=4.85;
    const leaf=new THREE.SphereGeometry(near?.19:.22,near?8:5,near?5:3);
    leaf.scale(1,3,.7);put(leaf,'roof',cx+r*Math.sin(a),25.72,cz+r*Math.cos(a),a);
    if(near) {
      for(const sg of [-1,1]) {
        const curl=new THREE.TorusGeometry(.25,.055,4,10,Math.PI*1.6);
        curl.rotateZ(sg*.5);put(curl,'roof',cx+r*Math.sin(a)+sg*.22*Math.cos(a),25.7,cz+r*Math.cos(a)-sg*.22*Math.sin(a),a);
      }
      const rr=R-.3,sculpt=new THREE.SphereGeometry(.22,8,5);
      sculpt.scale(1,2.4,.6);put(sculpt,'roof',cx+rr*Math.sin(a),21.94,cz+rr*Math.cos(a),a);
    }
  }
  cyl('gold',cx,cz,28.2,28.65,.65,.48,near?12:6);
  profile('trim',cx,cz,[[.48,28.6],[.67,28.85],[.25,29.1],[.20,29.6],[0,29.65]],near?16:8);
  cyl('gold',cx,cz,29.35,31,.05,.05,near?8:5);
  // Small caps over the four spiral stair enclosures.
  for(const [x,z] of [[-17,10],[16,10],[-17,-11],[16,-11]]) {
    cyl('stone',x,z,11.62,12.5,3.4,3.4,near?16:8);
    profile('roof',x,z,[[3.6,12.4],[3.3,12.65],[2.4,13.3],[.55,13.85],[0,14]],near?16:8);
    if(near)cyl('gold',x,z,13.8,14.25,.12,.05,8);
  }
  return b.finish();
}
