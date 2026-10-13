import * as THREE from 'three';
import {bridgeBuilder} from '../../asset-geometry.js';
import {PROFILE as p,L,MID,WIDTH,STEEL_START,STEEL_END,MAIN_PIERS,authoredLateral,landingBlend,roadEdges} from './oak-street-bridge-profile.js';
const ledgers=new WeakMap();
export const inspectionLedger=m=>ledgers.get(m);
export function create({detail='near'}={}){
 const near=detail==='near',b=bridgeBuilder(p,detail),h=p.deckHeight,ledger={supports:{},members:[],piers:[],girders:[]},counts=new Map();
 const chunk=s=>near?Math.min(3,Math.floor(s/L*4)):0,keep=s=>1-landingBlend(s);
 const xyz=(s,d,y)=>{const q=p.bridgePoint(s,authoredLateral(s,d),y);return[q.x,q.y,q.z];};
 function put(g,mat,s,lift=1,name=null){const ck=chunk(s),key=`${ck}:${mat}`,first=counts.get(key)||0,count=g.index?.count??g.attributes.position.count;if(name)(ledger.supports[name]??=[]).push({material:mat,chunk:ck,first,count});counts.set(key,first+count);b.put(g,mat,ck,lift);}
 function box(mat,s,d,y,length,width,height,name=null,lift=1){const q=p.bridgePoint(s,authoredLateral(s,d),y),g=new THREE.BoxGeometry(length,height,width);g.rotateY(-Math.atan2(q.tz,q.tx));g.translate(q.x,q.y,q.z);put(g,mat,s,lift,name);}
 function bar(mat,A,B,width,depth=width,name=null,lift=1){const a=new THREE.Vector3(...xyz(...A)),c=new THREE.Vector3(...xyz(...B)),axis=c.clone().sub(a),g=new THREE.BoxGeometry(width,axis.length(),depth);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),axis.normalize()));g.translate(...a.add(c).multiplyScalar(.5).toArray());put(g,mat,A[0],lift,name);}
 function member(name,A,B,supports){ledger.members.push({name,ends:[xyz(...A),xyz(...B)],supports});}
 // Closed capped ribbons, sampled identically at curve/control stations in both LODs.
 function strip(mat,a,c,left,right,top=0,depth=0,name=null,fade=false){
  for(let start=a;start<c-.0001;){const end=Math.min(c,(Math.floor((start+.0001)/(L/4))+1)*L/4),ss=new Set([start,end]);
   for(let s=Math.ceil(start/(near?8:32))*(near?8:32);s<end;s+=near?8:32)ss.add(s);
   for(const v of p.ALIGNMENT)if(v.s>start&&v.s<end)ss.add(v.s);
   for(const s of [...p.knots.map(k=>k[0]),20,100,L-100,L-20,...(name?.startsWith('girder:')?pierStations:[])])if(s>start&&s<end)ss.add(s);
   const stations=[...ss].sort((a,b)=>a-b),pos=[],idx=[],solid=typeof depth==='function'||depth>0,stride=solid?4:2;
   for(const s of stations){const dy=(typeof top==='function'?top(s):top)*(fade?keep(s):1),thick=(typeof depth==='function'?depth(s):depth)*(fade?keep(s):1);for(const [d,off]of solid?[[left,dy],[right,dy],[left,dy-thick],[right,dy-thick]]:[[left,dy],[right,dy]]){
     if(name==='median'){const edges=roadEdges(s),middle=(edges[0][1]+edges[1][0])/2,q=p.bridgePoint(s,middle+d*keep(s),h(s)+off);pos.push(q.x,q.y,q.z);}else pos.push(...xyz(s,d,h(s)+off));
    }}
   for(let i=1;i<stations.length;i++){const u=(i-1)*stride,v=i*stride;idx.push(u,u+1,v,u+1,v+1,v);if(solid)idx.push(u+2,v+2,u+3,u+3,v+2,v+3,u,v,u+2,u+2,v,v+2,u+1,u+3,v+1,u+3,v+3,v+1);}
   if(solid){const z=(stations.length-1)*4;idx.push(0,2,1,1,2,3,z,z+1,z+2,z+1,z+3,z+2);}
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();put(g,mat,start,1,name);start=end;
  }
 }
 let first=100,last=L-100;while(h(first)<5)first++;while(h(last)<5)last--;
 const river=[STEEL_START,MAIN_PIERS[0]-60.9,...MAIN_PIERS,MAIN_PIERS[3]+60.9,STEEL_END];
 const northCount=Math.ceil((STEEL_START-first)/18),southCount=Math.ceil((last-STEEL_END)/18);
 const pierStations=[...Array.from({length:northCount},(_,i)=>first+i*(STEEL_START-first)/northCount),...river,...Array.from({length:southCount},(_,i)=>STEEL_END+(i+1)*(last-STEEL_END)/southCount)];
 strip('concrete',first,last,-WIDTH/2,WIDTH/2,-.2,.35,'slab');
 for(const [side,left,right]of [['west',-7.25,-.25],['east',.25,7.25]])strip('asphalt',0,L,left,right,0,0,`road:${side}`);
 for(const side of[-1,1]){
  strip('concrete',0,L,side<0?-WIDTH/2:7.25,side<0?-7.25:WIDTH/2,.16,.16,`walk:${side}`,true);
  strip('rail',20,L-20,side*9.55-.055,side*9.55+.055,1.2,.11,`rail:${side}`,true);
  strip('rail',20,L-20,side*9.55-.04,side*9.55+.04,.68,.08,`rail-low:${side}`,true);
  const stations=[20];for(let s=20+(near?2.4:9.6);s<L-20;s+=near?2.4:9.6)stations.push(s);stations.push(L-20);
  for(const s of stations){const post=`rail-post:${side}:${s}`;box('rail',s,side*9.55,h(s)+.68*keep(s),.1,.1,1.04*keep(s),post);member(post,[s,side*9.55,h(s)+.16*keep(s)],[s,side*9.55,h(s)+1.2*keep(s)],[`walk:${side}`,`rail:${side}`]);}
  for(const s of[20,L-20])for(const rail of['rail','rail-low'])member(`${rail}-terminal:${side}:${s}`,[s,side*9.55,h(s)+(rail==='rail'?1.145:.64)*keep(s)],[s,side*9.55,h(s)+(rail==='rail'?1.145:.64)*keep(s)],[`rail-post:${side}:${s}`,`rail-post:${side}:${s}`]);
  member(`walk-terminal:${side}`,[0,side*8.5,0],[L,side*8.5,0],[side<0?'road:west':'road:east',side<0?'road:west':'road:east']);
 }
 // Raised central divider collapses to the connected provider separator at grade.
 strip('concrete',0,L,-.22,.22,.55,.55,'median',true);
 function girderDepth(s){let i=1;while(i<pierStations.length-1&&pierStations[i]<s)i++;const a=pierStations[i-1],c=pierStations[i],t=Math.max(0,Math.min(1,(s-a)/(c-a)));return 1.35+1.35*(2*t-1)**2;}
 // Five longitudinal strings, yellow weathered steel on the river and concrete on approaches.
 for(const [a,c,mat]of[[first,STEEL_START,'concrete'],[STEEL_START,STEEL_END,'ochre'],[STEEL_END,last,'concrete']])for(const d of[-7.8,-3.9,0,3.9,7.8]){
  const name=`girder:${d}:${a}`;strip(mat,a,c,d-.2,d+.2,-.55,girderDepth,name);ledger.girders.push({name,a,c,d});
  const support=s=>`cap:${s}`;member(name,[a,d,h(a)-3.25],[c,d,h(c)-3.25],[support(a),support(c)]);
 }
 for(const s of pierStations){const top=h(s)-3.25,cap=`cap:${s}`;box('concrete',s,0,top-.7,2.8,17.8,1.4,cap);
  for(const d of[-5.2,5.2]){const foot=`foot:${s}:${d}`,leg=`leg:${s}:${d}`;box('concrete',s,d,.4,3.5,3.1,.8,foot,0);box('concrete',s,d,(top-1.4+.6)/2,1.9,1.8,top-2,leg,y=>Math.max(0,Math.min(1,(y-.6)/(top-2))));ledger.piers.push({s,d,top,cap,leg,foot});member(leg,[s,d,.6],[s,d,top-1.4],[foot,cap]);}
 }
 // Vertical web stiffeners read in the yellow side elevation; transverse beams close on stringers.
 for(let s=STEEL_START+3;s<STEEL_END;s+=near?3:12)for(const side of[-1,1]){const name=`web:${side}:${s}`,host=ledger.girders.find(g=>g.d===side*7.8&&g.a===STEEL_START).name;box('steel',s,side*8.04,h(s)-.55-girderDepth(s)/2,.10,.12,girderDepth(s),name);member(name,[s,side*8.04,h(s)-.55],[s,side*8.04,h(s)-.55-girderDepth(s)],[host,host]);}
 for(let s=STEEL_START+8;s<STEEL_END;s+=near?12:36){const d=7.8,y=h(s)-1;bar('steel',[s,-d,y],[s,d,y],.2,.32,`cross:${s}`);const host=ledger.girders.find(g=>g.d===-d&&g.a===STEEL_START)?.name,other=ledger.girders.find(g=>g.d===d&&g.a===STEEL_START)?.name;member(`cross:${s}`,[s,-d,y],[s,d,y],[host,other]);}
 // Simple bent lamp necks, anchored on sidewalks, outside all four lanes.
 for(let s=120;s<L-120;s+=60)for(const side of[-1,1]){
  const name=`pole:${side}:${s}`,d=side*8.4,base=h(s)+.16;
  bar('rail',[s,d,base],[s,d,base+7.3],.17,.17,name);member(name,[s,d,base],[s,d,base+7.3],[`walk:${side}`,`neck:${side}:${s}`]);
  bar('rail',[s,d,base+7.3],[s,d-side*.65,base+8],.15,.15,`neck:${side}:${s}`);
  bar('rail',[s,d-side*.65,base+8],[s,d-side*1.8,base+8],.13,.13,`arm:${side}:${s}`);
  member(`neck:${side}:${s}`,[s,d,base+7.3],[s,d-side*.65,base+8],[name,`arm:${side}:${s}`]);
  box(near?'lamp':'rail',s,d-side*1.8,base+7.97,.65,.32,.18,`head:${side}:${s}`);
  member(`arm:${side}:${s}`,[s,d-side*.65,base+8],[s,d-side*1.8,base+8],[`neck:${side}:${s}`,`head:${side}:${s}`]);
 }
 if(near){for(const d of[-7.05,7.05])strip('paint',120,L-120,d-.065,d+.065,.12);for(const d of[-3.75,3.75])for(let s=120;s<L-120;s+=12)strip('paint',s,Math.min(s+4,L-120),d-.075,d+.075,.12);}
 const model=b.finish();ledgers.set(model,ledger);return model;
}
