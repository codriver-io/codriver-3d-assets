import * as THREE from 'three';
import { SPEC, PALETTES } from './config.js';
import { LOCAL_RINGS } from './footprint.js';
import { builder } from './shrine-of-the-book-parts.js';
export function create({detail='near'}={}) {
 const {near,b,face,cap,frame,patch,walls,prism,rect,block,spin,cyl,hip,rows,finish}=builder(SPEC,PALETTES,detail);
const n=near?36:24,profile=[[10.8,.35],[10.6,1.6],[9.5,3],[8,4.1],[6,5],[4.1,5.9],[2.5,6.8],[1.35,7.3],[1.35,8],[1.05,8],[1.1,7.5],[1.7,5.8],[2.6,4.3]];
 cyl(0,0,10.8,0,.35,'stone',n);
 for(let k=0;k<profile.length-1;k++)for(let j=0;j<n;j++){const a=j*2*Math.PI/n,c=(j+1)*2*Math.PI/n,[r,y]=profile[k],[R,Y]=profile[k+1],p=[[r*Math.cos(a),y,r*Math.sin(a)],[r*Math.cos(c),y,r*Math.sin(c)],[R*Math.cos(c),Y,R*Math.sin(c)],[R*Math.cos(a),Y,R*Math.sin(a)]],mid=(a+c)/2;face('lamp',p,k===8?[0,1,0]:k>8?[-Math.cos(mid),0,-Math.sin(mid)]:[Math.cos(mid),0,Math.sin(mid)]);}
 const circle=r=>Array.from({length:n},(_,i)=>[r*Math.cos(i*2*Math.PI/n),r*Math.sin(i*2*Math.PI/n)]);cap('inside',circle(2.6),4.3);
 for(let j=0;j<n;j++){const a=j*2*Math.PI/n,c=(j+1)*2*Math.PI/n,P=(r,y,t)=>[r*Math.cos(t),y,r*Math.sin(t)],out=[Math.cos((a+c)/2),0,Math.sin((a+c)/2)];face('water',[P(10.8,.18,a),P(12.55,.18,a),P(12.55,.18,c),P(10.8,.18,c)],[0,1,0]);face('stone',[P(12.55,.32,a),P(12.8,.32,a),P(12.8,.32,c),P(12.55,.32,c)],[0,1,0]);face('stone',[P(12.8,0,a),P(12.8,.32,a),P(12.8,.32,c),P(12.8,0,c)],out);face('stone',[P(12.55,.18,a),P(12.55,.32,a),P(12.55,.32,c),P(12.55,.18,c)],out.map(v=>-v));}
 block(24,-8,1.5,14,0,8.5,'basalt','basalt');
const root=finish();
 // Weld shading across the jar's curved panels only; keep its flat lip crisp.
 for(const mesh of root.children.filter(m=>m.material.name==='lamp')){const g=mesh.geometry,p=g.attributes.position,n=g.attributes.normal,sums=new Map(),key=i=>[p.getX(i),p.getY(i),p.getZ(i)].map(v=>v.toFixed(5)).join(',');for(let i=0;i<p.count;i++){if(n.getY(i)>.999)continue;const k=key(i),v=sums.get(k)??new THREE.Vector3();v.add(new THREE.Vector3(n.getX(i),n.getY(i),n.getZ(i)));sums.set(k,v);}for(let i=0;i<p.count;i++){if(n.getY(i)>.999)continue;const v=sums.get(key(i)).clone().normalize();n.setXYZ(i,v.x,v.y,v.z);}}
 return root;
}
