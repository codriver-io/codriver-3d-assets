import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {LOCAL_RINGS} from './footprint.js';
import {kit} from './padrao-descobrimentos-parts.js';
const ring=LOCAL_RINGS[0].slice(0,-1);
export const hullHeight=z=>.6+(z+20)*.47;
function section(z){const xs=[];for(let i=0;i<ring.length;i++){const a=ring[i],b=ring[(i+1)%ring.length];if((a[1]<=z&&b[1]>z)||(b[1]<=z&&a[1]>z))xs.push(a[0]+(b[0]-a[0])*(z-a[1])/(b[1]-a[1]));}return[Math.min(...xs),Math.max(...xs)];}
export const PROCESSION=[];
for(const side of [-1,1])for(let i=0;i<16;i++){const z=-16+i*2.1,[l,r]=section(z),x=side<0?l+1.65:r-1.65;PROCESSION.push({x,z,base:hullHeight(z),scale:i%6===0?.82:.93+.08*(i%4)+(side>0?.035:0),side,index:i});}
PROCESSION.push({x:0,z:21.0,base:hullHeight(21.0),scale:1.42,side:0,index:32});
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,cyl,sphere}=k;
 const bar=(m,a,b,w,d=w)=>{if(near)return k.bar(m,a,b,w,d);const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),v=bv.clone().sub(av),g=new THREE.CylinderGeometry(w*.6,w*.6,v.length(),3);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));g.translate(...av.add(bv).multiplyScalar(.5).toArray());k.put(g,m);};
 k.prism('stone',ring,0,.35);
 // The caravel's solid hull rises continuously to the pointed prow; no unsupported stage boxes.
 let r=[...ring];const area=r.reduce((s,p,i)=>{const q=r[(i+1)%r.length];return s+p[0]*q[1]-q[0]*p[1];},0);if(area>0)r.reverse();
 const v=[...r.map(([x,z])=>[x,.35,z]),...r.map(([x,z])=>[x,Math.max(.4,hullHeight(z)),z])],ix=[],N=r.length;
 for(let i=0;i<N;i++){const j=(i+1)%N;ix.push(i,j,N+i,j,N+j,N+i);}
 const top=THREE.ShapeUtils.triangulateShape(r.map(p=>new THREE.Vector2(...p)),[]);
 for(const t of top){const p=t.map(i=>new THREE.Vector3(...v[N+i])),normal=p[1].clone().sub(p[0]).cross(p[2].clone().sub(p[0]));ix.push(...(normal.y>0?t:[t[0],t[2],t[1]]).map(i=>N+i));}
 k.poly('stone',v,ix);
 function sail(x,width,outer=false){
  const s=new THREE.Shape();s.moveTo(-20,.35);s.lineTo(20,19.4);s.lineTo(13,28);
  if(!outer){s.bezierCurveTo(13.8,36,12.1,41,10,44);s.lineTo(10,52);s.lineTo(-10,52);s.lineTo(-10,35);}
  else {s.bezierCurveTo(12,36,1,41,-10,43.8);s.lineTo(-10,35);}
  s.bezierCurveTo(-3,32,-2,26,-5,20);s.bezierCurveTo(-9,11,-15,5,-20,.35);s.closePath();
  const g=new THREE.ExtrudeGeometry(s,{depth:width,steps:1,bevelEnabled:false,curveSegments:near?14:7});g.rotateY(-Math.PI/2);g.translate(x+width/2,0,0);k.put(g,'stone');
 }
 sail(0,3.45);sail(-2.65,1.65,true);sail(2.65,1.65,true);
 function figure(f){
  const {x,z,base,scale:S,index}=f,b=base,headY=b+5.55*S,B=S*(index%6===0?1.28:index%3===0?1.12:1.0);
  // Planted legs extend into the continuous sloping stone hull.
  for(const a of [-1,1]){
   if(index%6===0){const knee=[x+a*.4*B,b+1.0*S,z+.45*S];bar('carving',[x+a*.32*B,b-.42,z],knee,.55*B);bar('carving',knee,[x+a*.27*B,b+2.35*S,z],.5*B);}
   else bar('carving',[x+a*.3*B,b-.42,z],[x+a*.27*B,b+2.35*S,z],.5*B,.55*B);
  }
  cyl('carving',x,z,1.0*B,.9*B,b+1.9*S,b+4.55*S,near?10:4);
  const cloak=new THREE.SphereGeometry(1,near?12:5,near?8:3);cloak.scale(1.1*B,.7*S,.8*B);cloak.translate(x,b+4.0*S,z);k.put(cloak,'carving');
  cyl('carving',x,z,.25*S,.25*S,b+4.45*S,b+5.25*S,near?10:4);
  const head=new THREE.SphereGeometry(.59*S,near?12:5,near?8:3);head.scale(.92,1.05,.9);head.translate(x,headY,z);k.put(head,'carving');
  for(const a of [-1,1]){
   const elbow=[x+a*1.02*B,b+(index%3===1?3.9:3.6)*S,z+.16*S],hand=[x+a*.44*S,b+3.05*S,z+.7*S];
   bar('carving',[x+a*.6*B,b+4.2*S,z],elbow,.45*B);bar('carving',elbow,hand,.33*S);
  }
  if(index%4===0||index===32)cyl('carving',x,z,.78*S,.7*S,b+6.05*S,b+6.25*S,near?10:4);
  // Several followers carry a geometric book/scroll, but no illegible text or detached thin poles.
  if(index%3===0&&index!==32)box('carving',x,b+3.15*S,z+.7*S,1.0*S,.75*S,.32*S);
  if(index%7===4){
   const g=new THREE.TorusGeometry(.52*S,.085*S,near?6:3,near?16:6);g.translate(x,b+3.12*S,z+.78*S);k.put(g,'carving');
   const h=g.clone();h.translate(-x,-b-3.12*S,-z-.78*S);h.rotateY(Math.PI/2);h.translate(x,b+3.12*S,z+.78*S);k.put(h,'carving');
  }
 }
 for(const f of PROCESSION)figure(f);
 // Henry's miniature vessel is supported directly by his bent forearms.
 const h=PROCESSION.at(-1),by=h.base+3.05*h.scale+.18;
 k.poly('boat',[[-1,by,22],[1,by,22],[.8,by-.55,22.6],[-.8,by-.55,22.6],[-1,by,21.5],[1,by,21.5],[.8,by-.55,21.7],[-.8,by-.55,21.7]],[0,1,2,0,2,3,4,6,5,4,7,6,0,4,5,0,5,1,1,5,6,1,6,2,2,6,7,2,7,3,3,7,4,3,4,0]);
 bar('boat',[0,by,21.9],[0,by+1.8,21.9],.12);box('boat',.37,by+1.15,21.9,.72,1.1,.12);
 const model=k.finish();model.userData.features=['52m central fin','three curved caravel sails','pointed rising hull','33 joined robed figures','Henry miniature caravel'];return model;
}
