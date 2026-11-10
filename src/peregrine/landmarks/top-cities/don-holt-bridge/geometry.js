import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
// Station increases eastward; +v is the south edge. The rotation is applied once.
export const ANGLE=9.6*Math.PI/180, HALF=1665, TRUSS=245.5;
export const point=(u,v,y)=>[u*Math.cos(ANGLE)-v*Math.sin(ANGLE),y,u*Math.sin(ANGLE)+v*Math.cos(ANGLE)];
export function deckY(u){const a=Math.abs(u);if(a<=TRUSS)return 52-1.2*(a/TRUSS)**2;const t=(a-TRUSS)/(HALF-TRUSS);return 4+46.8*(1-t)*(1-t*.12);}
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),surfaces={};
 const quad=(mat,ps,out)=>{const a=surfaces[mat]??={p:[],i:[]},k=a.p.length/3;
 const n=new THREE.Vector3(...ps[1]).sub(new THREE.Vector3(...ps[0])).cross(new THREE.Vector3(...ps[2]).sub(new THREE.Vector3(...ps[0])));
 a.p.push(...ps.flat());a.i.push(...(n.dot(new THREE.Vector3(...out))>0?[k,k+1,k+2,k,k+2,k+3]:[k,k+2,k+1,k,k+3,k+2]));};
 const box=(mat,u,v,y,l,w,h)=>b.box(mat,point(u,v,y),[l,h,w],-ANGLE);
 const bar=(mat,a,c,w,d=w)=>b.bar(mat,point(...a),point(...c),w,d);
 function ribbon(mat,ss,left,right,off,depth=0,top=true){
  for(let i=1;i<ss.length;i++){const a=ss[i-1],c=ss[i],p=(u,v,o)=>point(u,v,deckY(u)+o);
   if(top)quad(mat,[p(a,left,off),p(c,left,off),p(c,right,off),p(a,right,off)],[0,1,0]);
   if(depth){quad(mat,[p(a,left,off-depth),p(c,left,off-depth),p(c,right,off-depth),p(a,right,off-depth)],[0,-1,0]);
    for(const v of [left,right])quad(mat,[p(a,v,off),p(c,v,off),p(c,v,off-depth),p(a,v,off-depth)],[-Math.sin(ANGLE)*Math.sign(v),0,Math.cos(ANGLE)*Math.sign(v)]);}
  }
  if(depth)for(const u of [ss[0],ss.at(-1)])quad(mat,[point(u,left,deckY(u)+off),point(u,right,deckY(u)+off),point(u,right,deckY(u)+off-depth),point(u,left,deckY(u)+off-depth)],[Math.sign(u)*Math.cos(ANGLE),0,Math.sign(u)*Math.sin(ANGLE)]);
 }
 const ss=[-HALF];for(let u=-HALF+25;u<HALF;u+=25)ss.push(u);ss.push(HALF);
 // Pavement is the slab's top surface, not a near-coplanar overlay.
 ribbon('concrete',ss,-14.25,14.25,0,1.2,false);ribbon('asphalt',ss,-13.7,13.7,0);
 for(const side of [-1,1]){ribbon('concrete',ss,side<0?-14.25:13.7,side<0?-13.7:14.25,0);
  for(let i=1;i<ss.length;i++)bar('concrete',[ss[i-1],side*14,deckY(ss[i-1])+.5],[ss[i],side*14,deckY(ss[i])+.5],.5,1.0);
 }
 for(let i=1;i<ss.length;i++)bar('concrete',[ss[i-1],0,deckY(ss[i-1])+.35],[ss[i],0,deckY(ss[i])+.35],.45,.7);
 const panel=2*TRUSS/20;
 // Parallel upper chords, sloping end posts, alternating Warren web. Far keeps every structural panel.
 for(const side of [-1,1]){
  const v=side*14.8;
  const upper=u=>Math.abs(u)>TRUSS-panel?deckY(u)-.45+(TRUSS-Math.abs(u))/panel*21.45:deckY(u)+21;
  for(let i=0;i<20;i++){
   const a=-TRUSS+i*panel,c=a+panel;
   bar('steel',[a,v,deckY(a)-.45],[c,v,deckY(c)-.45],.85,1.1);
   bar('steel',[a,v,upper(a)],[c,v,upper(c)],.85,1.05);
   if(i>0&&i<19)bar('steel',i%2?[a,v,upper(a)]:[a,v,deckY(a)-.45],i%2?[c,v,deckY(c)-.45]:[c,v,upper(c)],.64,.68);
   if(near&&i>0&&i<19)bar('steel',[c,v,deckY(c)-.45],[c,v,upper(c)],.24,.3);
  }
 }
 for(let i=0;i<=20;i++){
  const u=-TRUSS+i*panel;
  bar('steel',[u,-14.8,deckY(u)-.7],[u,14.8,deckY(u)-.7],.7,1.25);
  if(i>0&&i<20){bar('steel',[u,-14.8,deckY(u)+21],[u,14.8,deckY(u)+21],.5,.6);
   if(near&&i<19)bar('steel',[u,-14.8,deckY(u)+21],[u+panel,14.8,deckY(u+panel)+21],.3,.3);}
 }
 // Concrete twin-column bents and broad caps under all four truss bearings.
 const stations=[-TRUSS,-122,122,TRUSS];
 for(const side of [-1,1])for(let u=TRUSS+45;u<HALF-10;u+=45)stations.push(side*u);
 stations.push(-HALF,HALF);
 for(const u of stations){const main=Math.abs(u)<=TRUSS,h=deckY(u)-2.1;
  box('concrete',u,0,.65,main?9:5,main?33:28,1.3);
  for(const v of [-10.5,10.5])box('concrete',u,v,(h+1.3)/2,main?4.8:2.3,main?4.5:2.3,h-1.3);
  box('concrete',u,0,h+.45,main?6:3.8,30,.9);
 }
 // Continuous approach girders end on truss end bearings and terminal abutments.
 for(const side of [-1,1]){
  const run=[side*TRUSS,...ss.filter(u=>side*u>TRUSS&&side*u<HALF),side*HALF].sort((a,c)=>a-c);
  for(const v of near?[-11,-5,5,11]:[-11,11])ribbon('concrete',run,v-.35,v+.35,-1.2,.9);
 }
 for(const [mat,a]of Object.entries(surfaces)){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(a.p,3));g.setIndex(a.i);g.computeVertexNormals();b.put(g,mat);}
 const root=b.finish();root.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift');});return root;
}
