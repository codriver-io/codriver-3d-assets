import * as THREE from 'three';
import {bridgeBuilder} from '../../asset-geometry.js';
import {PROFILE as p,L,MAIN_N,MAIN_S,MAIN_SPAN,NORTH_MAIN,DECK_H,authoredEdges,roadWidth,outerEdge,authoredLateral,landingBlend,girderDepth} from './knight-street-bridge-profile.js';
const ledgers=new WeakMap();
export const inspectionLedger=model=>ledgers.get(model);
export function create({detail='near'}={}){
 const near=detail==='near',b=bridgeBuilder(p,detail),h=p.deckHeight,ledger={supports:{},members:[],piers:[]},counts=new Map();
 const chunk=s=>near?Math.min(2,Math.floor(s/L*3)):0;
 const xyz=(s,d,y)=>{const q=p.bridgePoint(s,authoredLateral(s,d),y);return [q.x,q.y,q.z];};
 function put(g,mat,s,name,lift=1){const ck=chunk(s),key=`${ck}:${mat}`,first=counts.get(key)||0,count=g.index?.count??g.attributes.position.count;
  if(name)(ledger.supports[name]??=[]).push({material:mat,chunk:ck,first,count});counts.set(key,first+count);b.put(g,mat,ck,lift);}
 function box(mat,s,d,y,len,width,height,name,lift=1){const q=p.bridgePoint(s,authoredLateral(s,d),y),g=new THREE.BoxGeometry(len,height,width);g.rotateY(-Math.atan2(q.tz,q.tx));g.translate(q.x,q.y,q.z);put(g,mat,s,name,lift);}
 function bar(mat,A,B,r,s,name){const a=new THREE.Vector3(...xyz(...A)),c=new THREE.Vector3(...xyz(...B)),v=c.clone().sub(a),g=new THREE.CylinderGeometry(r,r,v.length(),near?6:4,1,false);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));g.translate(...a.add(c).multiplyScalar(.5).toArray());put(g,mat,s,name);}
 // Capped metric lofts, separate carriageways: no slab across the open centre gap.
 function strip(mat,a,c,left,right,top=()=>0,depth=()=>0,name){
  for(let start=a;start<c-.0001;){const end=Math.min(c,(Math.floor((start+.0001)/(L/3))+1)*L/3),samples=new Set([start,end]);
   const step=near?8:20;for(let s=Math.ceil(start/step)*step;s<end;s+=step)samples.add(s);
   // Denser ramp pavement stays above the terrain lattice between samples.
   if(mat==='asphalt'||name?.startsWith('walk:')){const fine=mat==='asphalt'?(near?2:6):(near?4:8);for(let s=Math.ceil(start/fine)*fine;s<end;s+=fine)if(s<NORTH_MAIN+140||s>L-200)samples.add(s);}
   for(const v of p.ALIGNMENT)if(v.s>start&&v.s<end)samples.add(v.s);
   for(const [s] of p.knots)if(s>start&&s<end)samples.add(s);
   for(const s of [75,L-75,MAIN_N,MAIN_S,NORTH_MAIN-MAIN_SPAN/2,NORTH_MAIN+MAIN_SPAN/2])if(s>start&&s<end)samples.add(s);
   const ss=[...samples].sort((a,c)=>a-c),solid=ss.some(s=>depth(s)>0),stride=solid?4:2,pos=[],idx=[];
   for(const s of ss){const l=left(s),r=right(s),y=h(s)+top(s),dep=depth(s);for(const [d,yy] of solid?[[l,y],[r,y],[l,y-dep],[r,y-dep]]:[[l,y],[r,y]])pos.push(...xyz(s,d,yy));}
   for(let i=1;i<ss.length;i++){const u=(i-1)*stride,v=i*stride;idx.push(u,u+1,v,u+1,v+1,v);if(solid)idx.push(u+2,v+2,u+3,u+3,v+2,v+3,u,v,u+2,u+2,v,v+2,u+1,u+3,v+1,u+3,v+3,v+1);}
   if(solid){const z=(ss.length-1)*4;idx.push(0,2,1,1,2,3,z,z+1,z+2,z+1,z+3,z+2);}
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();put(g,mat,start,name?`${name}:${chunk(start)}`:null);start=end;
  }
 }
 let first=0,last=L;while(h(first)<3.6)first++;while(h(last)<3.6)last--;
 ledger.first=first;ledger.last=last;
 for(const side of [-1,1]){
  const index=side<0?0:1,edges=s=>authoredEdges(s)[index];
  strip('asphalt',0,L,s=>edges(s)[0],s=>edges(s)[1],()=>0,()=>0,`pavement:${side}`);
  strip('concrete',first,last,s=>side<0?outerEdge(s,side):.55,s=>side<0?-.55:outerEdge(s,side),()=>-.14,()=>.6,`slab:${side}`);
  // Deep haunched box girder per independent structure; approach stringer ribs.
  const centre=s=>side*(roadWidth(s)/2+.55);
  strip('girder',first,last,s=>centre(s)-3.4,s=>centre(s)+3.4,()=>-.74,s=>girderDepth(s)-.74,`girder:${side}`);
  for(const d of [-3.9,3.9])strip('girder',first,last,s=>centre(s)+d-.23,s=>centre(s)+d+.23,()=>-.74,()=>1.1,`stringer:${side}:${d}`);
  const keep=s=>1-landingBlend(s);
  strip('concrete',0,L,s=>side<0?outerEdge(s,side):-(-edges(s)[1]),s=>side<0?edges(s)[0]:outerEdge(s,side),s=>.2*keep(s),s=>.2*keep(s),`walk:${side}`);
  strip('concrete',0,L,s=>side*(roadWidth(s)+.75)-.16,s=>side*(roadWidth(s)+.75)+.16,s=>1.05*keep(s),s=>.85*keep(s),`barrier:${side}`);
  strip('concrete',0,L,()=>side<0?-.55:.18,()=>side<0?-.18:.55,s=>.85*keep(s),s=>.85*keep(s),`median:${side}`);
  const rail=s=>outerEdge(s,side)-side*.14;
  strip('rail',20,L-20,s=>rail(s)-.055,s=>rail(s)+.055,s=>1.4*keep(s),()=>.11,`rail:${side}`);
  const posts=new Set([20,L-20]);for(let s=20;s<L-20;s+=near?3:18)posts.add(s);
  for(const s of posts){box('rail',s,rail(s),h(s)+.8*keep(s),.12,.12,1.2*keep(s),`rail-post:${side}:${s}`);
   ledger.members.push({name:`rail-post:${side}:${s}`,ends:[xyz(s,rail(s),h(s)+.2*keep(s)),xyz(s,rail(s),h(s)+1.4*keep(s))],supports:[`walk:${side}:${chunk(s)}`,`rail:${side}:${chunk(s)}`]});}
  for(const kind of ['walk','barrier','median']){const d=s=>kind==='walk'?outerEdge(s,side):kind==='barrier'?side*(roadWidth(s)+.75):side*.35;ledger.members.push({name:`${kind}:${side}`,ends:[xyz(0,d(0),0),xyz(L,d(L),0)],supports:[`pavement:${side}:0`,`pavement:${side}:${chunk(L)}`]});}
  ledger.members.push({name:`handrail:${side}`,ends:[xyz(20,rail(20),h(20)+1.35*keep(20)),xyz(L-20,rail(L-20),h(L-20)+1.35*keep(L-20))],supports:[`rail-post:${side}:20`,`rail-post:${side}:${L-20}`]});
  for(const s of [first,last]){const top=h(s)-.14,name=`abutment:${side}:${s}`;box('concrete',s,centre(s),top/2,4,roadWidth(s)+2.5,top,name,y=>Math.max(0,Math.min(1,y/top)));}
  for(const kind of ['girder','stringer'])for(const d of kind==='girder'?[0]:[-3.9,3.9])ledger.members.push({name:`${kind}:${side}:${d}`,ends:[xyz(first,centre(first)+d,h(first)-1.3),xyz(last,centre(last)+d,h(last)-1.3)],supports:[`abutment:${side}:${first}`,`abutment:${side}:${last}`]});
  // Pier spacing is estimated; the navigation main span is kept fully open.
  const main=[NORTH_MAIN-MAIN_SPAN/2,NORTH_MAIN+MAIN_SPAN/2,MAIN_N,MAIN_S],piers=[...main];
  for(let s=first+30;s<last-20;s+=45)if(!main.some(v=>Math.abs(s-v)<22)&&!(s>main[0]&&s<main[1])&&!(s>MAIN_N&&s<MAIN_S))piers.push(s);
  for(const s of piers.sort((a,c)=>a-c)){
   const top=h(s)-girderDepth(s);if(top<1.5)continue;const c=centre(s),shaft=`pier:${side}:${s}`,cap=`cap:${side}:${s}`,foot=`foot:${side}:${s}`;
   box('concrete',s,c,(top-.9)/2,2.4,3.8,top-.5,shaft,y=>Math.max(0,Math.min(1,y/(top-.7))));
   box('concrete',s,c,top-.35,3.2,9.7,.7,cap);box('concrete',s,c,-.55,4,6.2,.7,foot,0);
   ledger.piers.push({s,side,centre:c,top,shaft,cap,foot});
   ledger.members.push({name:cap,ends:[xyz(s,c-1.5,top-.7),xyz(s,c+1.5,top-.7)],supports:[shaft,shaft]});
  }
  // The western underside carries the documented maintenance walk and pipes.
  if(side===1){strip('rail',MAIN_N,MAIN_S,s=>centre(s)-1.4,s=>centre(s)+1.4,()=>-1.9,()=>.14,'maintenance-walk');
   for(const s of [MAIN_N,MAIN_S])box('girder',s,centre(s),h(s)-1.9,1.2,6.8,.5,`maintenance-seat:${s}`);
   ledger.members.push({name:'maintenance-walk',ends:[xyz(MAIN_N,centre(MAIN_N),h(MAIN_N)-1.97),xyz(MAIN_S,centre(MAIN_S),h(MAIN_S)-1.97)],supports:[`maintenance-seat:${MAIN_N}`,`maintenance-seat:${MAIN_S}`]});
  }
  // Both LODs retain lamp silhouette; far drops subordinate heads and paint.
  for(let s=90;s<L-90;s+=near?45:90){const d=side*(roadWidth(s)+1.5),y=h(s),base=`lamp-base:${side}:${s}`,head=`lamp-head:${side}:${s}`,bend=`lamp-bend:${side}:${s}`;
   box('rail',s,d,y+.24,.45,.45,.48,base);box('rail',s,d,y+8.7,.24,.24,.3,bend);
   const A=[s,d,y+.24],B=[s,d,y+8.7],C=[s,d-side*2.4,y+8.85];bar('rail',A,B,.09,s);bar('rail',B,C,.08,s);
   box(near?'lamp':'rail',s,C[1],C[2],.7,.4,.18,head);
   ledger.members.push({name:`lamp-pole:${side}:${s}`,ends:[xyz(...A),xyz(...B)],supports:[base,bend]},{name:`lamp-arm:${side}:${s}`,ends:[xyz(...B),xyz(...C)],supports:[bend,head]});
  }
  if(near){strip('paint',75,L-75,s=>edges(s)[0]+.2,s=>edges(s)[0]+.32,()=>.12);
   strip('paint',75,L-75,s=>edges(s)[1]-.32,s=>edges(s)[1]-.2,()=>.12);
   for(let s=78;s<L-78;s+=12){const lanes=s<NORTH_MAIN+70?3:2;for(let i=1;i<lanes;i++)strip('paint',s,s+3,u=>edges(u)[0]+roadWidth(u)*i/lanes-.055,u=>edges(u)[0]+roadWidth(u)*i/lanes+.055,()=>.12);}
  }
 }
 const model=b.finish();ledgers.set(model,ledger);return model;
}
