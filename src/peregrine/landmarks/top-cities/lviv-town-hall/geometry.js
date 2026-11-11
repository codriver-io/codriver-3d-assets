import * as THREE from 'three';
import { SPEC, PALETTES } from './config.js';
import { LOCAL_RINGS, LOCAL_COURTYARD } from './footprint.js';
import { builder } from './lviv-town-hall-parts.js';
export function create({detail='near'}={}) {
 const {near,b,face,cap,frame,patch,walls,prism,rect,block,spin,cyl,hip,rows,finish}=builder(SPEC,PALETTES,detail);
const outer=LOCAL_RINGS[0].map(([x,z])=>[x< -32?-30.2:x,z]),inner=LOCAL_COURTYARD;outer.splice(5,1);
 const band=(f,lo,hi)=>{let y=lo;for(const h of [5.7,11.35,16.9,22.25])if(h>=lo&&h+.22<=hi){patch('ochre',f,0,f.l,y,h);patch('trim',f,0,f.l,h,h+.22);y=h+.22;}patch('ochre',f,0,f.l,y,hi);};
 const windows=(r,inward=false)=>r.forEach((a,i)=>{const f=frame(r,i);if(inward)f.out=f.out.map(v=>-v);const central=r===outer&&Math.abs(f.p(0,0)[0]+30.2)<.05&&f.l>20;const n=central?5:Math.max(1,Math.round(f.l/(near?3.6:9.5))),step=f.l/n;let low=0;for(const [lo,hi]of [[1.2,4.5],[6.8,central?11.1:10],[12,15.8],[18.2,20.8]]){band(f,low,lo);for(let j=0;j<n;j++){const a=j*step+step*.23,c=(j+1)*step-step*.23;patch(central&&lo>=6&&lo<17?'trim':'ochre',f,j*step,a,lo,hi);if(central&&lo===6.8){const sh=new THREE.Shape();sh.moveTo(a,lo);sh.lineTo(c,lo);sh.lineTo(c,hi);sh.lineTo(a,hi);sh.closePath();const u=(a+c)/2,r=(c-a)/2-.16,sy=hi-.16-r,arc=new THREE.Path();arc.moveTo(u-r,lo+.16);arc.lineTo(u-r,sy);arc.absarc(u,sy,r,Math.PI,0,true);arc.lineTo(u+r,lo+.16);arc.closePath();sh.holes.push(arc);for(const [shape,mat]of [[sh,'trim'],[new THREE.Shape(arc.getPoints(near?16:8)),'glass']]){const g=new THREE.ShapeGeometry(shape),p=g.attributes.position,ii=g.index.array;for(let k=0;k<ii.length;k+=3)face(mat,[ii[k],ii[k+1],ii[k+2]].map(j=>f.p(p.getX(j),p.getY(j))),f.out);}}else if(!near){patch('glass',f,a,c,lo,hi);}else{patch('trim',f,a,c,lo,lo+.16);patch('trim',f,a,c,hi-.16,hi);patch('trim',f,a,a+.14,lo+.16,hi-.16);patch('trim',f,c-.14,c,lo+.16,hi-.16);patch('glass',f,a+.14,c-.14,lo+.16,hi-.16);}patch(central&&lo>=6&&lo<17?'trim':'ochre',f,c,(j+1)*step,lo,hi);}low=hi;}band(f,low,22.7);});
 windows(outer);windows(inner,true);
 const shape=outer.map(p=>new THREE.Vector2(...p)),holes=[inner.map(p=>new THREE.Vector2(...p))],all=[...shape,...holes.flat()];for(const t of THREE.ShapeUtils.triangulateShape(shape,holes))face('roof',t.map(j=>[all[j].x,22.7,all[j].y]),[0,1,0]);
 const roof=(x,z,w,d,alongZ)=>{const r=rect(x,z,w,d),a=alongZ?[x,z-d*.38]:[x-w*.38,z],c=alongZ?[x,z+d*.38]:[x+w*.38,z];const top=alongZ?[a,a,c,c]:[a,c,c,a];for(let i=0;i<4;i++)face('roof',[[r[i][0],22.7,r[i][1]],[r[(i+1)%4][0],22.7,r[(i+1)%4][1]],[top[(i+1)%4][0],26.2,top[(i+1)%4][1]],[top[i][0],26.2,top[i][1]]],[0,1,0]);};
 roof(23.15,0,13.3,78.2,true);roof(-23.6,0,13.8,78.2,true);roof(-.2,29.0,33.5,20,false);roof(-.2,-31.4,33.5,15.9,false);
 const towerWall=(r,lo,hi,upper)=>r.forEach((a,i)=>{const f=frame(r,i),sh=new THREE.Shape();sh.moveTo(0,lo);sh.lineTo(f.l,lo);sh.lineTo(f.l,hi);sh.lineTo(0,hi);sh.closePath();
  const addRect=(w,y,h)=>{const p=new THREE.Path();p.moveTo(f.l/2-w/2,y);p.lineTo(f.l/2-w/2,y+h);p.lineTo(f.l/2+w/2,y+h);p.lineTo(f.l/2+w/2,y);p.closePath();sh.holes.push(p);patch('glass',f,f.l/2-w/2,f.l/2+w/2,y,y+h);};
  if(upper){addRect(1.45,46,3.2);addRect(.6,60,1);const p=new THREE.Path();p.absarc(f.l/2,54.8,1.9,0,Math.PI*2,true);sh.holes.push(p);
   const n=near?40:24,P=(r,t)=>f.p(f.l/2+r*Math.cos(t),54.8+r*Math.sin(t));for(let j=0;j<n;j++){const a=j*2*Math.PI/n,c=(j+1)*2*Math.PI/n;face('clock',[f.p(f.l/2,54.8),P(1.78,a),P(1.78,c)],f.out);face('hands',[P(1.78,a),P(1.9,a),P(1.9,c),P(1.78,c)],f.out);}
   const shift=p=>p.map((v,k)=>v+f.out[k]*.14);for(let j=0;j<12;j++){const t=j*Math.PI/6;b.bar('hands',shift(P(1.45,t)),shift(P(1.68,t)),.07,.07,0,true);}b.bar('hands',shift(P(0,0)),shift(P(1.3,Math.PI*.35)),.09,.09,0,true);b.bar('hands',shift(P(0,0)),shift(P(.9,Math.PI*1.1)),.11,.11,0,true);
  }else{const p=new THREE.Path();const u=f.l/2;p.moveTo(u-1.2,27.2);p.lineTo(u-1.2,32);p.absarc(u,32,1.2,Math.PI,0,true);p.lineTo(u+1.2,27.2);p.closePath();sh.holes.push(p);const pane=new THREE.Shape(p.getPoints(near?16:8));const g=new THREE.ShapeGeometry(pane);const pos=g.attributes.position;for(let j=0;j<pos.count;j++){const v=f.p(pos.getX(j),pos.getY(j));pos.setXYZ(j,...v);}g.computeVertexNormals();const ind=g.index.array;for(let j=0;j<ind.length;j+=3)face('glass',[ind[j],ind[j+1],ind[j+2]].map(k=>[pos.getX(k),pos.getY(k),pos.getZ(k)]),f.out);}
  const g=new THREE.ShapeGeometry(sh,near?32:16),pos=g.attributes.position,ind=g.index.array;for(let j=0;j<ind.length;j+=3)face('tower',[ind[j],ind[j+1],ind[j+2]].map(k=>f.p(pos.getX(k),pos.getY(k))),f.out);
 });
 towerWall(LOCAL_RINGS[1],0,43.2,false);cap('tower',LOCAL_RINGS[1],43.2);
 block(-3.4,-16.65,13.2,15.3,43.2,43.8,'tower','tower');const upper=rect(-3.4,-16.65,8.3,10.2);towerWall(upper,43.8,63.5,true);cap('roof',upper,63.5);
 const rail=rect(-3.4,-16.65,13,15.1);rail.forEach((a,i)=>{const f=frame(rail,i);b.bar('roof',f.p(0,45),f.p(f.l,45),.12,.12,0,true);for(let j=0;j<=Math.ceil(f.l/(near?1:2));j++){const u=f.l*j/Math.ceil(f.l/(near?1:2));b.bar('roof',f.p(u,43.8),f.p(u,45),.09,.09,0,true);}});
 for(const z of [-21.7,-11.6])block(-3.4,z,9.3,.45,63.5,64.4,'tower','tower');for(const x of [-7.55,.75])block(x,-16.65,.45,9.3,63.5,64.4,'tower','tower');
 for(const z of [-21.9,-11.4])for(let j=0;j<9;j++)block(-7.8+j*1.1,z,.5,.7,64.4,65,'tower','tower');for(const x of [-8,.95])for(let j=1;j<9;j++)block(x,-21.9+j*1.16,.7,.5,64.4,65,'tower','tower');
 // Four arched portico bays occupy the mapped west/south projection only.
 const s=new THREE.Shape();s.moveTo(-12,0);for(const u of [-9,-3,3,9]){s.lineTo(u-2.1,0);s.lineTo(u-2.1,3.3);for(let j=1;j<=(near?12:6);j++){const t=Math.PI-j*Math.PI/(near?12:6);s.lineTo(u+2.1*Math.cos(t),3.3+2.1*Math.sin(t));}s.lineTo(u+2.1,0);}s.lineTo(12,0);s.lineTo(12,6.2);s.lineTo(-12,6.2);s.closePath();const g=new THREE.ExtrudeGeometry(s,{depth:4.7,bevelEnabled:false});g.rotateY(Math.PI/2);g.translate(-34.9,0,0);b.put(g,'trim');

return finish();
}
