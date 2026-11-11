import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {kit} from './fortin-heredia-parts.js';
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,poly,bar,box}=k,n=near?8:5;
 const path=p=>{const q=new THREE.Path(p.map(v=>new THREE.Vector2(...v)));q.closePath();return q;};
 const oval=(u,y,w,h)=>Array.from({length:n},(_,i)=>{const a=i*Math.PI*2/n;return[u+w*.5*Math.cos(a),y+h*.5*Math.sin(a)];});
 // Four intersecting round lobes: a semicircle per lobe, with concave diagonal waists.
 const clover=(size)=>{const r=size/4,segments=near?6:4,p=[];for(let l=0;l<4;l++){const a=l*Math.PI/2,cx=r*Math.cos(a),cy=r*Math.sin(a);for(let j=0;j<segments;j++){const t=a-Math.PI/2+j*Math.PI/segments;p.push([cx+r*Math.cos(t),12.13+cy+r*Math.sin(t)]);}}return p;};
 function face(shape,mat,a,z,t){const g=new THREE.ExtrudeGeometry(shape,{depth:t,bevelEnabled:false,steps:1});// Buried straight hole tubes are replaced by the actual tapered pale embrasures.
 const pa=g.getAttribute('position'),ix=[];const holes=shape.holes.map(h=>h.getPoints());for(let i=0;i<pa.count;i+=3){const v=[0,1,2].map(j=>new THREE.Vector3().fromBufferAttribute(pa,i+j));const side=Math.max(...v.map(p=>p.z))-Math.min(...v.map(p=>p.z))>.1;const covered=side&&holes.some(h=>v.every(p=>h.some(q=>Math.hypot(p.x-q.x,p.y-q.y)<.002)));if(!covered)ix.push(i,i+1,i+2);}g.setIndex(ix);
 g.rotateY(a);g.translate(z*Math.sin(a),0,z*Math.cos(a));k.put(g,mat);}
 function splay(p,inner,a,z0,z1){const turn=([x,y,z])=>[x*Math.cos(a)+z*Math.sin(a),y,-x*Math.sin(a)+z*Math.cos(a)];for(let i=0;i<p.length;i++){const j=(i+1)%p.length;poly('trim',[turn([...p[i],z0]),turn([...p[j],z0]),turn([...inner[j],z1]),turn([...inner[i],z1])],[0,1,2,0,2,3]);}}
 // Square rubble-stone base, with a concave cornice profile instead of a blank cube.
 for(let side=0;side<4;side++){
  const a=side*Math.PI/2,w=8.8,profile=Array.from({length:near?13:8},(_,i)=>{const x=-w/2+i*w/(near?12:7);return[x,6-1.2*Math.sin((x+w/2)*Math.PI/w)];});
  const sh=new THREE.Shape([[-w/2,0],[w/2,0],...profile.toReversed().map(([x,y])=>[x,y-.2])].map(p=>new THREE.Vector2(...p)));
  for(const [count,y]of [[3,2.7],[4,3.85]])for(let i=0;i<count;i++){
   const u=(i-(count-1)/2)*1.3,p=oval(u,y,.8,1.1),q=oval(u,y,.16,.45);sh.holes.push(path(p));splay(p,q,a,4.4,3.72);
  }
  if(side!==2){const p=[[-.6,.05],[.6,.05],[.6,1.65],[.42,2.03],[0,2.2],[-.42,2.03],[-.6,1.65]];sh.holes.push(path(p));}
  face(sh,'stone',a,3.7,.7);
  const turn=([x,y,z])=>[x*Math.cos(a)+z*Math.sin(a),y,-x*Math.sin(a)+z*Math.cos(a)];for(let i=0;i<profile.length-1;i++){const p=profile[i],q=profile[i+1];poly('stone',[turn([p[0],p[1]-.2,4.4]),turn([q[0],q[1]-.2,4.4]),turn([q[0]*.72,6,3.15]),turn([p[0]*.72,6,3.15])],[0,1,2,0,2,3]);}
  const corn=new THREE.Shape([...profile,...profile.toReversed().map(([x,y])=>[x,y-.2])].map(p=>new THREE.Vector2(...p)));face(corn,'trim',a,3.63,.85);
 }
 box('stone',0,5.3,0,6.4,1.4,6.4);
 k.cyl('stone',0,0,3.4,3.4,4.6,6,near?24:16);
 // Brick cylinder: four alternating loophole rows with outward-splayed pale embrasures.
 const sides=16,r=3.4,ap=r*Math.cos(Math.PI/sides),width=2*r*Math.sin(Math.PI/sides);
 for(let i=0;i<sides;i++){
  const a=i*Math.PI*2/sides,sh=new THREE.Shape([[-width/2,6],[width/2,6],[width/2,11],[-width/2,11]].map(p=>new THREE.Vector2(...p)));
  for(const y of i%2?[7.65,10.05]:[6.65,9.05]){
   const large=i===0&&y===6.65,p=oval(0,large?7.0:y,large?.8:.52,large?1.5:.9),q=oval(0,large?7.0:y,large?.36:.12,large?1.05:.42);sh.holes.push(path(p));splay(p,q,a,ap,ap-.62);
  }
  face(sh,'brick',a,ap-.62,.62);
 }
 k.lathe('trim',0,0,[[3.35,10.9],[3.5,11.0],[3.5,11.15],[3.3,11.25]],near?24:16);
 // Octagonal open crown: eight real clover-shaped lights, no invented battlements.
 const cr=3.35,ca=cr*Math.cos(Math.PI/8),cw=2*cr*Math.sin(Math.PI/8);
 for(let i=0;i<8;i++){
  const a=i*Math.PI/4,sh=new THREE.Shape([[-cw/2,11.25],[cw/2,11.25],[cw/2,13],[-cw/2,13]].map(p=>new THREE.Vector2(...p))),p=clover(.84),q=clover(.80);sh.holes.push(path(p));face(sh,'brick',a,ca-.45,.45);splay(p,q,a,ca,ca-.45);
 }
 const cap=new THREE.CylinderGeometry(cr,cr,.06,8);cap.rotateY(Math.PI/8);cap.translate(0,12.97,0);k.put(cap,'brick');
 const posts=Array.from({length:8},(_,i)=>{const a=(i+.5)*Math.PI/4;return[3.0*Math.sin(a),3.0*Math.cos(a)];});
 for(let i=0;i<8;i++){const p=posts[i],q=posts[(i+1)%8];bar('metal',[p[0],12.98,p[1]],[p[0],13.9,p[1]],.075);for(const y of near?[13.35,13.8]:[13.8])bar('rail',[p[0],y,p[1]],[q[0],y,q[1]],.065);}
 return k.finish();
}
