import * as THREE from 'three';
import polygonClipping from 'polygon-clipping';
import { SPEC, PALETTES } from './config.js';
import { LOCAL_RINGS } from './footprint.js';
import { builder } from './stuttgart-hauptbahnhof-tower-parts.js';
export function create({detail='near'}={}) {
 const {near,b,face,cap,frame,patch,walls,prism,rect,block,spin,cyl,hip,rows,finish}=builder(SPEC,PALETTES,detail);
const w=15,d=13.3,xfront=-7.5;
 const holes=[];for(const [lo,hi]of [[21.5,23.4],[31.5,33.4],[45,51.5]])for(let j=-2;j<=2;j++)holes.push([j*1.04-.38,j*1.04+.38,lo,hi]);
 const s=new THREE.Shape();s.moveTo(-d/2,0);s.lineTo(d/2,0);s.lineTo(d/2,54.8);s.lineTo(-d/2,54.8);s.closePath();
 for(const [a,c,lo,hi]of holes){const p=new THREE.Path();p.moveTo(a,lo);p.lineTo(a,hi);p.lineTo(c,hi);p.lineTo(c,lo);p.closePath();s.holes.push(p);}
 const cp=new THREE.Path();cp.absarc(0,40.4,3.05,0,Math.PI*2,true);s.holes.push(cp);
 const pts=s.extractPoints(near?48:24),poly=[pts.shape.map(p=>[p.x,p.y]),...pts.holes.map(h=>h.map(p=>[p.x,p.y]))];
 const course=near?.65:1.3,unit=near?1.4:2.8;
 for(let j=0;j<Math.ceil(54.8/course);j++)for(let i=-7;i<7;i++){
  const a=i*unit+(j%2)*unit*.5,c=a+unit,lo=j*course,hi=Math.min(54.8,lo+course),parts=polygonClipping.intersection([poly],[[[a,lo],[c,lo],[c,hi],[a,hi],[a,lo]]]);
  for(const ring of parts){const sh=new THREE.Shape(ring[0].map(p=>new THREE.Vector2(...p)));sh.holes=ring.slice(1).map(r=>new THREE.Path(r.map(p=>new THREE.Vector2(...p))));const g=new THREE.ShapeGeometry(sh);g.rotateY(-Math.PI/2);g.translate(xfront,0,0);b.put(g,(i*7+j*13)%5===0?'stone':(i*7+j*13)%7===0?'stone':'stone');}
 }
 const masonry=(f,a,c,lo,hi)=>{for(let j=Math.floor(lo/course);j<Math.ceil(hi/course);j++)for(let i=Math.floor(a/unit)-1;i<Math.ceil(c/unit)+1;i++){const u=i*unit+(j%2)*unit*.5,v=u+unit;patch((i*7+j*13)%5===0?'stone':(i*7+j*13)%7===0?'stone':'stone',f,Math.max(a,u),Math.min(c,v),Math.max(lo,j*course),Math.min(hi,(j+1)*course));}};
 for(const [a,c,lo,hi]of holes){face('glass',[[xfront+.18,lo,-a],[xfront+.18,lo,-c],[xfront+.18,hi,-c],[xfront+.18,hi,-a]],[-1,0,0]);for(const u of [a,c])face('stone',[[xfront,lo,-u],[xfront+.18,lo,-u],[xfront+.18,hi,-u],[xfront,hi,-u]],[0,0,u>0?-1:1]);for(const y of [lo,hi])face('stone',[[xfront,y,-a],[xfront,y,-c],[xfront+.18,y,-c],[xfront+.18,y,-a]],[0,y===lo?1:-1,0]);}
 const ring=rect(0,0,w,d);for(let k=0;k<3;k++){const i=[0,1,2][k],f=frame(ring,i);// adjoining facade partitions
  const n=5,step=1.04;let low=0;for(const [lo,hi]of [[21.5,23.4],[31.5,33.4],[45,51.5]]){masonry(f,0,f.l,low,lo);const centre=f.l/2;let u=0;for(let j=-2;j<=2;j++){const a=centre+j*step-.38,c=a+.76;masonry(f,u,a,lo,hi);patch('glass',f,a,c,lo,hi);u=c;}masonry(f,u,f.l,lo,hi);low=hi;}masonry(f,0,f.l,low,54.8);
 }
 cap('roof',ring,54.8);
 // Flat clock disks partition, rather than overlay, the circular hole.
 const n=near?48:24;for(let j=0;j<n;j++){const a=j*2*Math.PI/n,c=(j+1)*2*Math.PI/n;const p=(r,t)=>[xfront,40.4+r*Math.sin(t),r*Math.cos(t)];face('clock',[[xfront,40.4,0],p(2.35,a),p(2.35,c)],[-1,0,0]);face((Math.floor(j/(n/12))%2)?'red':'clock',[p(2.35,a),p(2.9,a),p(2.9,c),p(2.35,c)],[-1,0,0]);face('brass',[p(2.9,a),p(3.05,a),p(3.05,c),p(2.9,c)],[-1,0,0]);}
 for(let j=0;j<12;j++){const t=j*Math.PI/6;const p=r=>[xfront-.12,40.4+r*Math.sin(t),r*Math.cos(t)];b.bar('brass',p(2.45),p(2.83),.09,.09,0,true);}
 b.bar('brass',[xfront-.22,40.4,0],[xfront-.22,42.2,-.8],.12,.12,0,true);b.bar('brass',[xfront-.22,40.4,0],[xfront-.22,39.5,2.0],.1,.1,0,true);
 block(-7.8,0,1.4,6.4,44.1,44.45,'stone','stone');for(const z of [-2.7,-1.35,0,1.35,2.7])block(-7.78,z,1.2,.25,43.5,44.1,'stone','stone');
 for(const z of [-6.5,6.5])block(0,z,15.4,.5,54.8,56,'stone','stone');for(const x of [-7.45,7.45])block(x,0,.5,12.5,54.8,56,'stone','stone');
return finish();
}
