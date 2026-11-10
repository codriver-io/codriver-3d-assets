import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {FOOTPRINTS,CENTERLINE} from './footprint.js';
const k=111320,cos=Math.cos(SPEC.origin[1]*Math.PI/180);
export const local=([lon,lat])=>[(lon-SPEC.origin[0])*k*cos,(SPEC.origin[1]-lat)*k];
const line=CENTERLINE.map(local);export const stations=[0];for(let i=1;i<line.length;i++)stations.push(stations.at(-1)+Math.hypot(line[i][0]-line[i-1][0],line[i][1]-line[i-1][1]));
export const LENGTH=stations.at(-1),START=51,END=126;
export function center(s){let i=stations.findIndex(v=>v>=s);i=Math.max(1,i<0?stations.length-1:i);const a=line[i-1],c=line[i],t=Math.max(0,Math.min(1,(s-stations[i-1])/(stations[i]-stations[i-1]))),len=stations[i]-stations[i-1];return {x:a[0]+(c[0]-a[0])*t,z:a[1]+(c[1]-a[1])*t,tx:(c[0]-a[0])/len,tz:(c[1]-a[1])/len};}
export const deckY=s=>s<START?.8+3.4*Math.sin(Math.PI/2*s/START):s>END?.8+3.4*Math.sin(Math.PI/2*(LENGTH-s)/(LENGTH-END)):4.2;
export function point(s,d=0,y=deckY(s)){const p=center(s);return [p.x-p.tz*d,y,p.z+p.tx*d];}
function project(x,z){let best={dist:Infinity,s:0};for(let i=1;i<line.length;i++){const a=line[i-1],c=line[i],dx=c[0]-a[0],dz=c[1]-a[1],l2=dx*dx+dz*dz,t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/l2)),dist=Math.hypot(x-a[0]-t*dx,z-a[1]-t*dz);if(dist<best.dist)best={dist,s:stations[i-1]+t*Math.sqrt(l2)};}return best.s;}
export function arch(t,side){const a=center(START),c=center(END),dx=c.x-a.x,dz=c.z-a.z,L=Math.hypot(dx,dz),bow=Math.sin(Math.PI*t),d=side*(3.4+3.2*bow);return [a.x+dx*t-dz/L*d,4.0+16.764*4*t*(1-t),a.z+dz*t+dx/L*d];}
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),acc={};
 function face(mat,pts,out){const a=acc[mat]??={p:[],i:[]},n=pts.length,k=a.p.length/3;const norm=new THREE.Vector3(...pts[1]).sub(new THREE.Vector3(...pts[0])).cross(new THREE.Vector3(...pts[2]).sub(new THREE.Vector3(...pts[0])));a.p.push(...pts.flat());const flip=norm.dot(new THREE.Vector3(...out))<0;for(let i=1;i<n-1;i++)a.i.push(...(flip?[k,k+i+1,k+i]:[k,k+i,k+i+1]));}
 const ring=FOOTPRINTS[0].slice(0,-1).map(local),ys=ring.map(([x,z])=>deckY(project(x,z))),area=ring.reduce((s,p,i)=>s+p[0]*ring[(i+1)%ring.length][1]-ring[(i+1)%ring.length][0]*p[1],0);
 for(const tri of THREE.ShapeUtils.triangulateShape(ring.map(p=>new THREE.Vector2(...p)),[])){
  face('deck',tri.map(i=>[ring[i][0],ys[i],ring[i][1]]),[0,1,0]);face('deck',tri.map(i=>[ring[i][0],ys[i]-.5,ring[i][1]]),[0,-1,0]);
 }
 // Mapped polygon includes the event platform; no overlapping second slab.
 for(let i=0;i<ring.length;i++){const j=(i+1)%ring.length,a=ring[i],c=ring[j],out=[Math.sign(area)*(c[1]-a[1]),0,Math.sign(area)*(a[0]-c[0])];face('deck',[[...a.slice(0,1),ys[i],a[1]],[c[0],ys[j],c[1]],[c[0],ys[j]-.5,c[1]],[a[0],ys[i]-.5,a[1]]],out);
  const len=Math.hypot(c[0]-a[0],c[1]-a[1]);if(len<3.7&&(i<2||i===29||i===30))continue; // open pedestrian landings
  const count=Math.max(1,Math.ceil(len/(near?2.5:4.5)));
  for(let k=0;k<count;k++){const t=k/count,u=(k+1)/count,A=[a[0]+(c[0]-a[0])*t,ys[i]+(ys[j]-ys[i])*t,a[1]+(c[1]-a[1])*t],C=[a[0]+(c[0]-a[0])*u,ys[i]+(ys[j]-ys[i])*u,a[1]+(c[1]-a[1])*u];
   b.bar('rail',[A[0],A[1]-.08,A[2]],[A[0],A[1]+1.067,A[2]],.065);
   for(const h of near?[.32,.67,1.067]:[1.067])b.bar('rail',[A[0],A[1]+h,A[2]],[C[0],C[1]+h,C[2]],h===1.067?.06:.025);
  }
 }
 // Terminal posts at the two open landings support the last rail segment.
 for(const j of [0,29])b.bar('rail',[ring[j][0],ys[j]-.08,ring[j][1]],[ring[j][0],ys[j]+1.067,ring[j][1]],.065);
 // Closed tubular arch sweeps; near/far share springings, apex and lean.
 for(const side of [-1,1]){
  const n=near?48:24,pts=Array.from({length:n+1},(_,i)=>new THREE.Vector3(...arch(i/n,side))),curve=new THREE.CatmullRomCurve3(pts),tube=new THREE.TubeGeometry(curve,n,near?.36:.38,near?8:6,false);b.put(tube,'arch');
  for(const t of [0,1]){const a=arch(t,side);b.box('concrete',[a[0],2,a[2]],[1.8,4,1.8]);}
  const h=near?14:7;
  for(let j=1;j<h;j++){const t=j/h,s=START+(END-START)*t,top=arch(t,side),bot=point(s,side*2.8,deckY(s)-.12);b.bar('cable',top,bot,near?.045:.065,undefined,0,true);b.box('arch',bot,[.22,.25,.22]);}
 }
 // Pier caps meet the slab soffit; ground feet stop at the local datum.
 for(const s of [0,18,36,START,END,144,162,180,198,216,LENGTH]){
  const p=center(s),h=deckY(s)-.5;
  for(const d of [-2.2,2.2]){const q=point(s,d,h/2);b.box('concrete',q,[.65,h,.65]);}
  b.box('concrete',[p.x,h-.24,p.z],[1.15,.48,6.3],-Math.atan2(p.tz,p.tx));
 }
 // The mapped platform has its own pile group and a low curved seat, no invented canopy.
 const platform=[-79.968901,32.871881],q=local(platform),sy=4.2;
 for(const dx of [-1.7,1.7])for(const dz of [-4,4])b.box('concrete',[q[0]+dx,(sy-.5)/2,q[1]+dz],[.7,sy-.5,.7]);
 const n=near?16:8;
 for(let j=0;j<n;j++){const a=-1.4+j*2.8/n,c=-1.4+(j+1)*2.8/n;const A=[q[0]+1.4*Math.cos(a),sy+.35,q[1]+4.5*Math.sin(a)],C=[q[0]+1.4*Math.cos(c),sy+.35,q[1]+4.5*Math.sin(c)];b.bar('seat',A,C,.7,.7);}
 for(const [mat,a]of Object.entries(acc)){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(a.p,3));g.setIndex(a.i);g.computeVertexNormals();b.put(g,mat);}
 const root=b.finish();root.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift');});return root;
}
