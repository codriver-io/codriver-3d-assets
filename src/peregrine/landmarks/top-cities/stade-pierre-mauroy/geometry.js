import * as THREE from 'three';import {SPEC,PALETTES} from './config.js';import {PLAN} from './footprint.js';import {kit} from './stade-pierre-mauroy-parts.js';
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,quad,put,box}=k;
 const points=PLAN[0].slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]),cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]),lo=[],hi=[];for(const p of points){while(lo.length>1&&cross(lo.at(-2),lo.at(-1),p)<=0)lo.pop();lo.push(p);}for(const p of points.slice().reverse()){while(hi.length>1&&cross(hi.at(-2),hi.at(-1),p)<=0)hi.pop();hi.push(p);}const raw=lo.slice(0,-1).concat(hi.slice(0,-1)),ring=[];
 for(let i=0;i<raw.length;i++){const a=raw[i],b=raw[(i+1)%raw.length],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/(near?4:8)));for(let j=0;j<n;j++)ring.push([a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n]);}
 // The ring is clockwise in the authoring x/z plane; each tile is oriented outwards explicitly.
 function panel(mat,pts,out){const a=new THREE.Vector3(...pts[0]),b=new THREE.Vector3(...pts[1]),c=new THREE.Vector3(...pts[2]),n=b.clone().sub(a).cross(c.clone().sub(a));if(n.dot(new THREE.Vector3(...out))<0)pts=[pts[0],pts[3],pts[2],pts[1]];quad(mat,...pts);}
 const profile=[[0,.95],[3,.985],[8,1],[14,1],[20,1],[26,.995],[31,.975],[35,.94],[38,.89]];
 for(let row=0;row<profile.length-1;row++)for(let i=0;i<ring.length;i++){
  const a=ring[i],c=ring[(i+1)%ring.length],lo=profile[row],hi=profile[row+1],out=[(a[0]+c[0])/2,0,(a[1]+c[1])/2],p=(u,v)=>{const s=lo[1]*(1-v)+hi[1]*v;return[(a[0]*(1-u)+c[0]*u)*s,lo[0]*(1-v)+hi[0]*v,(a[1]*(1-u)+c[1]*u)*s];},tile=(m,l,r,b,t)=>panel(m,[p(l,b),p(r,b),p(r,t),p(l,t)],out);
  tile('seam',0,.09,0,1);tile('shell',.09,1,.04,1);tile('seam',.09,1,0,.04);
 }
 // Roof annulus with a genuine rectangular opening. Use an inset shape with a hole, no dark slab.
 const outer=raw.map(([x,z])=>[x*.89,z*.89]),hole=PLAN[1],op=outer.map(([x,z])=>new THREE.Vector2(x,-z)),hp=hole.map(([x,z])=>new THREE.Vector2(x,-z));if(!THREE.ShapeUtils.isClockWise(op))op.reverse();if(THREE.ShapeUtils.isClockWise(hp))hp.reverse();const shape=new THREE.Shape(op);shape.holes.push(new THREE.Path(hp));
 const g=new THREE.ExtrudeGeometry(shape,{depth:2.6,bevelEnabled:false});g.rotateX(-Math.PI/2);g.translate(0,38,0);put(g,'roof');
 // Two permanent roof tracks, seated on the roof annulus on both sides of its opening.
 const hx=Math.max(...hole.map(p=>Math.abs(p[0]))),hz=Math.max(...hole.map(p=>Math.abs(p[1])));
 for(const s of [-1,1])box('roof',s*(hx+2),40.7,0,2.6,.6,SPEC.roofTrackLengthM);
 // Simplified closed seating bowl: broad stepped tiers, an empty field opening and solid sides.
 const N=near?64:32,rr=(a,b)=>Array.from({length:N},(_,i)=>{const t=i*2*Math.PI/N,c=Math.cos(t),s=Math.sin(t);return[a*Math.sign(c)*Math.abs(c)**.55,b*Math.sign(s)*Math.abs(s)**.55];});
 const levels=[[.4,36,55],[3,39,58],[10,48,68],[12,50,70],[22,62,85],[24,64,87],[31,73,98]];
 for(let j=0;j<levels.length-1;j++){const lo=levels[j],hi=levels[j+1],a=rr(lo[1],lo[2]),b=rr(hi[1],hi[2]);for(let i=0;i<N;i++){const n=(i+1)%N;panel(j%2?'concrete':'seat',[[a[i][0],lo[0],a[i][1]],[a[n][0],lo[0],a[n][1]],[b[n][0],hi[0],b[n][1]],[b[i][0],hi[0],b[i][1]]],[0,1,0]);}}
 box('pitch',0,.15,0,68,.1,105);
 // Low concrete base closes the space below the shell at flat local grade.
 k.prism('concrete',raw.map(([x,z])=>[x*.95,z*.95]),0,.1);
 return k.finish();
}
