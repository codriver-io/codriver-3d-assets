import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {PROFILE as profile,L,MID,TRUSS,deckHeight,authoredLateral,landingBlend} from './don-holt-bridge-profile.js';
export {TRUSS} from './don-holt-bridge-profile.js';
// Approved truss coordinates are retained about u=0; only the roadway frame changes.
export const point=(u,v,y)=>{const q=profile.bridgePoint(MID+u,authoredLateral(MID+u,v),y);return [q.x,q.y,q.z];};
export const deckY=u=>deckHeight(MID+u);
export function pierStations(){const stations=[-TRUSS,-122,122,TRUSS];
 for(const side of [-1,1])for(let u=TRUSS+45;u<(side<0?MID:L-MID)-10;u+=45)if(deckY(side*u)>4)stations.push(side*u);
 return stations.sort((a,b)=>a-b);
}
export function create({detail='near',audit=false}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),surfaces={},members=[],supports=new Map();
 const put=b.put; b.put=(g,mat,...args)=>{if(audit){const name=b.auditName;if(name){if(!supports.has(name))supports.set(name,[]);supports.get(name).push(g.clone());}}put(g,mat,...args);};
 const quad=(mat,ps,out)=>{const a=surfaces[mat]??={p:[],i:[]},k=a.p.length/3;
 const n=new THREE.Vector3(...ps[1]).sub(new THREE.Vector3(...ps[0])).cross(new THREE.Vector3(...ps[2]).sub(new THREE.Vector3(...ps[0])));
 if(n.lengthSq()<1e-14)return;
 a.p.push(...ps.flat());a.i.push(...(n.dot(new THREE.Vector3(...out))>0?[k,k+1,k+2,k,k+2,k+3]:[k,k+2,k+1,k,k+3,k+2]));};
 const box=(mat,u,v,y,l,w,h,lift=1,name)=>{const q=profile.bridgePoint(MID+u),g=new THREE.BoxGeometry(l,h,w);g.rotateY(-Math.atan2(q.tz,q.tx));g.translate(...point(u,v,y));b.auditName=name;b.put(g,mat,0,lift);b.auditName=null;};
 const bar=(mat,a,c,w,d=w,name,sa,sc)=>{const av=new THREE.Vector3(...point(...a)),cv=new THREE.Vector3(...point(...c)),dir=cv.clone().sub(av),g=new THREE.BoxGeometry(w,dir.length(),d);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize()));g.translate(...av.clone().add(cv).multiplyScalar(.5));b.auditName=name;b.put(g,mat);b.auditName=null;if(audit&&sa)members.push({name,ends:[av.toArray(),cv.toArray()],supports:[sa,sc]});};
 function ribbon(mat,ss,left,right,off,depth=0,top=true,name,sa,sc){
  const first=surfaces[mat]?.p.length??0,firstIndex=surfaces[mat]?.i.length??0;
  const value=(x,u)=>typeof x==='function'?x(u):x;
  for(let i=1;i<ss.length;i++){const a=ss[i-1],c=ss[i],p0=profile.bridgePoint(MID+(a+c)/2),p=(u,v,o)=>point(u,v,deckY(u)+value(o,u));
   if(top)quad(mat,[p(a,left,off),p(c,left,off),p(c,right,off),p(a,right,off)],[0,1,0]);
   if(depth){quad(mat,[p(a,left,u=>value(off,u)-value(depth,u)),p(c,left,u=>value(off,u)-value(depth,u)),p(c,right,u=>value(off,u)-value(depth,u)),p(a,right,u=>value(off,u)-value(depth,u))],[0,-1,0]);
    for(const v of [left,right])quad(mat,[p(a,v,off),p(c,v,off),p(c,v,u=>value(off,u)-value(depth,u)),p(a,v,u=>value(off,u)-value(depth,u))],[-p0.tz*(v===left?-1:1),0,p0.tx*(v===left?-1:1)]);}
  }
  if(depth)for(const u of [ss[0],ss.at(-1)]){const q=profile.bridgePoint(MID+u),sign=u===ss[0]?-1:1;
   quad(mat,[point(u,left,deckY(u)+value(off,u)),point(u,right,deckY(u)+value(off,u)),point(u,right,deckY(u)+value(off,u)-value(depth,u)),point(u,left,deckY(u)+value(off,u)-value(depth,u))],[sign*q.tx,0,sign*q.tz]);}

  if(audit&&name){const a=surfaces[mat],g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(a.p.slice(first),3));g.setIndex(a.i.slice(firstIndex).map(i=>i-first/3));supports.set(name,[g]);
   if(sa)members.push({name,ends:[ss[0],ss.at(-1)].map(u=>point(u,(left+right)/2,deckY(u)+value(off,u)-value(depth,u)/2)),supports:[sa,sc]});}
 }
 // Prior near/far live DEM probes keep clearance below 2 m through about
 // s=202 m west and L-s=167 m east. Retain a margin around those bank zones;
 // the elevated roadway uses 25 m near / 40 m far longitudinal chords.
 const fineEnds=[240,210],samples=new Set([-MID,L-MID,-TRUSS,TRUSS,-MID+150,L-MID-150,-MID+fineEnds[0],L-MID-fineEnds[1]]);
 for(let s=0;s<L;s+=near?25:40)samples.add(s-MID);
 for(const [end,extent] of fineEnds.entries())for(let s=0;s<=extent;s+=5)samples.add((end?L-s:s)-MID);
 for(const q of profile.ALIGNMENT)samples.add(q.s-MID);
 const ss=[...samples].sort((a,b)=>a-b),nose=u=>1-landingBlend(MID+u);
 const roadStep=near?2:2.5;
 const banks=fineEnds.map((extent,end)=>{const stations=new Set([0,extent]);for(let s=0;s<extent;s+=near?2:3)stations.add(s);return [...stations].map(s=>(end?L-s:s)-MID).sort((a,b)=>a-b);});
 const high=ss.filter(u=>u>=fineEnds[0]-MID-1e-6&&u<=L-MID-fineEnds[1]+1e-6);
 // Each landing follows its own carriageway; the median gap is genuine air.
 for(const [left,right] of [[-14.25,-.225],[.225,14.25]]){
  ribbon('concrete',ss,left,right,0,u=>1.2*nose(u),false);
  const roadLeft=Math.max(left,-13.7),roadRight=Math.min(right,13.7);
  // Fine cells are confined to terrain-contact zones. Across the elevated
  // deck one full-width quad per carriageway preserves the same surface.
  for(const stations of banks)for(let d=roadLeft;d<roadRight;d+=roadStep)ribbon('asphalt',stations,d,Math.min(roadRight,d+roadStep),0);
  ribbon('asphalt',high,roadLeft,roadRight,0);
 }
 for(const side of [-1,1]){
  ribbon('concrete',ss,side<0?-14.25:13.7,side<0?-13.7:14.25,0,0,true,`rim-${side}`);
  ribbon('concrete',ss,side*14-.25,side*14+.25,u=>nose(u),u=>nose(u),true,`rail-${side}`,`rim-${side}`,`rim-${side}`);
 }
 // The median remains the approved width across the rigid deck and ends on it.
 const median=ss.filter(u=>MID+u>=150&&MID+u<=L-150);
 ribbon('concrete',median,-.225,.225,.7,.7);
 const panel=2*TRUSS/20;
 // Parallel upper chords, sloping end posts, alternating Warren web. Far keeps every structural panel.
 for(const side of [-1,1]){
  const v=side*14.8;
  const upper=u=>Math.abs(u)>TRUSS-panel?deckY(u)-.45+(TRUSS-Math.abs(u))/panel*21.45:deckY(u)+21;
  for(let i=0;i<20;i++){
   const a=-TRUSS+i*panel,c=a+panel;
   bar('steel',[a,v,deckY(a)-.45],[c,v,deckY(c)-.45],.85,1.1,`lower-${side}-${i}`,i?`lower-${side}-${i-1}`:'floor-0',i<19?`lower-${side}-${i+1}`:'floor-20');
   bar('steel',[a,v,upper(a)],[c,v,upper(c)],.85,1.05,`upper-${side}-${i}`,i?`upper-${side}-${i-1}`:`lower-${side}-0`,i<19?`upper-${side}-${i+1}`:`lower-${side}-19`);
   if(i>0&&i<19)bar('steel',i%2?[a,v,upper(a)]:[a,v,deckY(a)-.45],i%2?[c,v,deckY(c)-.45]:[c,v,upper(c)],.64,.68,`web-${side}-${i}`,`${i%2?'upper':'lower'}-${side}-${i}`,`${i%2?'lower':'upper'}-${side}-${i}`);
   if(near&&i>0&&i<19)bar('steel',[c,v,deckY(c)-.45],[c,v,upper(c)],.24,.3,`vertical-${side}-${i}`,`lower-${side}-${i}`,`upper-${side}-${i}`);
  }
 }
 for(let i=0;i<=20;i++){
  const u=-TRUSS+i*panel;
  bar('steel',[u,-14.8,deckY(u)-.7],[u,14.8,deckY(u)-.7],.7,1.25,`floor-${i}`,`lower--1-${Math.min(i,19)}`,`lower-1-${Math.min(i,19)}`);
  if(i>0&&i<20){bar('steel',[u,-14.8,deckY(u)+21],[u,14.8,deckY(u)+21],.5,.6,`tie-${i}`,`upper--1-${Math.min(i,19)}`,`upper-1-${Math.min(i,19)}`);
   if(near&&i<19)bar('steel',[u,-14.8,deckY(u)+21],[u+panel,14.8,deckY(u+panel)+21],.3,.3,`top-brace-${i}`,`tie-${i}`,`tie-${i+1}`);}
 }
 // Concrete twin-column bents and broad caps under all four truss bearings.
 // One ground-to-cap attachment gradient keeps plinth/shaft contacts intact;
 // low bank supports bury cleanly rather than pushing a rigid plinth into lanes.
 const stations=pierStations();
 for(const u of stations){const main=Math.abs(u)<=TRUSS,h=deckY(u)-2.1;
  box('concrete',u,0,.65,main?9:5,main?33:28,1.3,y=>y<.001?0:Math.max(0,Math.min(1,y/h)),`foot-${u}`);
  for(const v of [-10.5,10.5])box('concrete',u,v,(h+1.3)/2,main?4.8:2.3,main?4.5:2.3,h-1.3,y=>y<.001?0:Math.max(0,Math.min(1,y/h)),`shaft-${u}-${v}`);
  box('concrete',u,0,h+.45,main?6:3.8,30,.9,1,`cap-${u}`);
 }
 // Continuous approach girders end on truss end bearings and terminal abutments.
 for(const side of [-1,1]){
  const run=[side*TRUSS,...ss.filter(u=>side*u>TRUSS&&side*u<(side<0?MID:L-MID)),side*(side<0?MID:L-MID)].sort((a,c)=>a-c);
  for(const v of near?[-11,-5,5,11]:[-11,11])ribbon('concrete',run,v-.35,v+.35,u=>-1.2*nose(u),u=>.9*nose(u),true,`girder-${side}-${v}`,side<0?'ground':`cap-${TRUSS}`,side<0?`cap-${-TRUSS}`:'ground');
 }
 for(const [mat,a]of Object.entries(surfaces)){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(a.p,3));g.setIndex(a.i);g.computeVertexNormals();b.put(g,mat);}
 const root=b.finish();if(audit)root.userData.audit={supports,members};return root;
}
