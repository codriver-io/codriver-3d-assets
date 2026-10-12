import * as THREE from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p, L, NORTH_TOWER, SOUTH_TOWER, CABLE_START, CABLE_END, DECK_H, TOWER_H, TAPER, authoredLateral, landingBlend, roadEdges } from './alex-fraser-bridge-profile.js';

// The editable semantic ledger pins supports to actual authored triangle ranges.
// Kept outside GLB extras; tests select these same ranges from the merged source.
const ledgers=new WeakMap();
export const inspectionLedger=model=>ledgers.get(model);
export const UPPER_CROSSBEAM=96, LOWER_CROSSBEAM=49;
export const STAY_PLANES=[-14.55,14.55];
export function create({detail='near'}={}) {
  const near=detail==='near',b=bridgeBuilder(p,detail),h=p.deckHeight;
  const xyz=(s,d,y)=>b.xyz(s,authoredLateral(s,d),y);
  const keep=s=>1-landingBlend(s);
  const chunk=s=>near?Math.min(3,Math.floor(s/L*4)):0;
  const ledger={supports:{},members:[],piers:[],towers:[]},counts=new Map();
  const clamp=v=>Math.max(0,Math.min(1,v));
  function put(g,mat,s,lift=1,name=null) {
    const ck=chunk(s),key=`${ck}:${mat}`,first=counts.get(key)||0;
    const count=g.index?.count??g.attributes.position.count;
    if(name)(ledger.supports[name]??=[]).push({material:mat,chunk:ck,first,count});
    counts.set(key,first+count);b.put(g,mat,ck,lift);
  }
  function box(mat,s,d,y,length,width,height,name=null,lift=1) {
    const q=p.bridgePoint(s,authoredLateral(s,d),y),g=new THREE.BoxGeometry(length,height,width);
    g.rotateY(-Math.atan2(q.tz,q.tx));g.translate(q.x,q.y,q.z);put(g,mat,s,lift,name);
  }
  function bar(mat,A,B,r,s,name=null,lift=1) {
    const a=new THREE.Vector3(...xyz(...A)),c=new THREE.Vector3(...xyz(...B)),axis=c.clone().sub(a);
    const g=new THREE.CylinderGeometry(r,r,axis.length(),near?6:3,1,false);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),axis.normalize()));g.translate(...a.add(c).multiplyScalar(.5).toArray());put(g,mat,s,lift,name);
  }
  // Closed, capped sampled ribbons. Both LODs keep identical vertical ramp curves.
  function strip(mat,a,c,left,right,offset=0,thick=0,name=null) {
    for(let start=a;start<c-.0001;) {
      const end=Math.min(c,(Math.floor((start+.0001)/(L/4))+1)*L/4),ss=new Set([start,end]);
      for(let s=Math.ceil(start/5)*5;s<end;s+=5)if((s<CABLE_START||s>CABLE_END)?(near||s%10===0):s%25===0)ss.add(s);
      for(const k of p.knots)if(k[0]>start&&k[0]<end)ss.add(k[0]);
      for(const t of [20,TAPER,L-TAPER,L-20])if(t>start&&t<end)ss.add(t);
      for(const v of p.ALIGNMENT)if(v.s>start&&v.s<end)ss.add(v.s);
      const stations=[...ss].sort((a,c)=>a-c),pos=[],idx=[],stride=thick?4:2;
      for(const s of stations)for(const [d,dy] of thick?[[left,0],[right,0],[left,-thick],[right,-thick]]:[[left,0],[right,0]]){
        const y=h(s)+(offset+dy)*(name?.startsWith('walk:')||name?.startsWith('barrier:')||name?.startsWith('rail:')||name==='movable-median'?keep(s):1);
        if(name==='movable-median'){
          const edges=roadEdges(s),lateral=(edges[0][1]+edges[1][0])/2+(d-(left+right)/2)*keep(s),q=p.bridgePoint(s,lateral,y);
          pos.push(q.x,q.y,q.z);
        }else pos.push(...xyz(s,d,y));
      }
      for(let i=1;i<stations.length;i++) {
        const u=(i-1)*stride,v=i*stride;idx.push(u,u+1,v,u+1,v+1,v);
        if(thick)idx.push(u+2,v+2,u+3,u+3,v+2,v+3,u,v,u+2,u+2,v,v+2,u+1,u+3,v+1,u+3,v+3,v+1);
      }
      if(thick){const z=(stations.length-1)*4;idx.push(0,2,1,1,2,3,z,z+1,z+2,z+1,z+3,z+2);}
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();put(g,mat,start,1,name?`${name}:${chunk(start)}`:null);start=end;
    }
  }
  let first=0,last=L;while(h(first)<3.3)first++;while(h(last)<3.3)last--;
  // Thin composite slab, exposed longitudinal plate girders and seven-lane roadway.
  strip('concrete',first,last,-16,16,-.2,.55,'slab');
  for(const d of [-14.55,0,14.55])strip('steel',first,last,d-.35,d+.35,-.75,2.25,`girder:${d}`);
  strip('asphalt',0,L,-12.45,-1.85,0,0,'road:east');
  strip('asphalt',0,L,-1.5,12.55,0,0,'road:west');
  for(const side of [-1,1]) {
    strip('concrete',0,L,side<0?-16:12.55,side<0?-12.45:16,.18,.18,`walk:${side}`);
    strip('concrete',0,L,side*12.8-.16,side*12.8+.16,1.05,.87,`barrier:${side}`);
    const railStart=20,railEnd=L-20;
    strip('rail',railStart,railEnd,side*15.85-.06,side*15.85+.06,1.45,.12,`rail:${side}`);
    for(let s=railStart;s<railEnd;s+=near?4:L){
      box('concrete',s,side*15.85,h(s)+.755*keep(s),.14,.14,1.15*keep(s),`rail-post:${side}:${s}`);
    }
    box('concrete',railEnd,side*15.85,h(railEnd)+.755*keep(railEnd),.14,.14,1.15*keep(railEnd),`rail-end:${side}`);
    ledger.members.push({name:`handrail:${side}`,ends:[xyz(railStart,side*15.85,h(railStart)+1.4*keep(railStart)),xyz(railEnd,side*15.85,h(railEnd)+1.4*keep(railEnd))],supports:[`rail-post:${side}:${railStart}`,`rail-end:${side}`]});
  }
  strip('concrete',0,L,-1.85,-1.5,.90,.90,'movable-median');
  if(near)for(const d of [-12.15,12.25])strip('paint',TAPER,L-TAPER,d-.06,d+.06,.12);
  if(near)for(let s=TAPER+4;s<L-TAPER-4;s+=12)for(const d of [-8.8,-5.35,2,5.45,8.9])strip('paint',s,s+3,d-.055,d+.055,.12);
  for(const s of [first,last])box('concrete',s,0,(h(s)-.2)/2,4.5,32,h(s)-.2,`abutment:${s}`,y=>clamp(y/(h(s)-.2)));
  for(const d of [-14.55,0,14.55])ledger.members.push({name:`longitudinal-girder:${d}`,ends:[xyz(first,d,h(first)-1.6),xyz(last,d,h(last)-1.6)],supports:[`abutment:${first}`,`abutment:${last}`]});
  // Transverse framing lands on the three longitudinal girders.
  for(let s=first+10;s<last;s+=near?13:39) {
    box('steel',s,0,h(s)-1.6,.38,29.1,1.65,`floorbeam:${s}`);
    ledger.members.push({name:`floorbeam:${s}`,ends:[xyz(s,-14.55,h(s)-1.6),xyz(s,14.55,h(s)-1.6)],supports:[`girder:-14.55:${chunk(s)}`,`girder:14.55:${chunk(s)}`]});
  }
  // Approach viaduct supports, including the side-span end anchor stations.
  const piers=[];
  for(let s=first+15;s<CABLE_START;s+=55)piers.push(s);
  piers.push(CABLE_START,CABLE_END);
  for(let s=CABLE_END+55;s<last-10;s+=55)piers.push(s);
  for(const s of piers) {
    const top=h(s)-3;if(top<1.5)continue;
    const cap=`pier-cap:${s}`;
    box('concrete',s,0,top-.65,3.8,30,1.3,cap);
    for(const d of [-9,9]){
      const leg=`pier-leg:${s}:${d}`;
      box('concrete',s,d,(top-1.2)/2,2.4,2.7,top-1.2,leg,y=>clamp(y/(top-1.2)));
      box('concrete',s,d,.6,4,4.8,1.2,`foot:${s}:${d}`,0);
      ledger.piers.push({s,d,top:top-1.2,leg,cap});
    }
    ledger.members.push({name:cap,ends:[xyz(s,-9,top-1.25),xyz(s,9,top-1.25)],supports:[`pier-leg:${s}:-9`,`pier-leg:${s}:9`]});
  }
  // Straight upper shafts and outward lower legs: two true open H frames, no mast proxy.
  for(const s of [NORTH_TOWER,SOUTH_TOWER]) {
    const legs=[];
    for(const side of [-1,1]) {
      const name=`tower:${s}:${side}`,levels=[[0,side*19,5,4.8],[57,side*16,4.4,4.2],[60,side*16,4.4,4.2],[154,side*16,4.4,4.2]],pos=[],idx=[];
      for(const [y,d,w,len] of levels)for(const [u,v] of [[-len/2,-w/2],[len/2,-w/2],[len/2,w/2],[-len/2,w/2]])pos.push(...xyz(s+u,d+v,y));
      for(let k=1;k<levels.length;k++)for(let j=0;j<4;j++){const a=(k-1)*4+j,c=(k-1)*4+(j+1)%4,u=k*4+j,v=k*4+(j+1)%4;idx.push(a,u,c,c,u,v);}
      idx.push(0,1,2,0,2,3,12,14,13,12,15,14);
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();put(g,'tower',s,y=>clamp(y/57),name);legs.push(name);
      box('concrete',s,side*19,.75,8,7,1.5,`tower-foot:${s}:${side}`,0);
    }
    for(const [y,t] of [[LOWER_CROSSBEAM,7],[UPPER_CROSSBEAM,5.5]]) {
      const name=`crossbeam:${s}:${y}`;
      box('tower',s,0,y,4.4,32,t,name);
      ledger.members.push({name,ends:[xyz(s,-16,y),xyz(s,16,y)],supports:legs});
    }
    // Deck girder bearing shelf, contacting the tower frame immediately below the road.
    box('concrete',s,0,56.4,5,30,1.2,`tower-bearing:${s}`);
    ledger.towers.push({s,legs});
    for(const direction of [-1,1])for(const d of STAY_PLANES)for(let i=0;i<18;i++) {
      if(!near&&i%2&&i!==17)continue;
      const main=(s===NORTH_TOWER&&direction===1)||(s===SOUTH_TOWER&&direction===-1);
      const reach=main?230:180,anchor=s+direction*(18+(reach-18)*i/17),upperY=111+41*i/17;
      const support=`stay-anchor:${s}:${d}:${direction}:${i}`;
      box('concrete',anchor,d,DECK_H+.65,1.25,1.05,1.3,support);
      const A=[s+direction*2.10,Math.sign(d)*16,upperY],B=[anchor,d,DECK_H+1.20];
      bar('cable',A,B,near?.115:.16,s);
      ledger.members.push({name:`stay:${support}`,ends:[xyz(...A),xyz(...B)],supports:[legs[d<0?0:1],support]});
    }
  }
  // Low-key side lamps, grounded in the raised walks, outside all lanes.
  if(near)for(let s=90;s<L-90;s+=45)for(const side of [-1,1]) {
    const d=side*13.9,y=h(s),base=`lamp-base:${s}:${side}`,head=`lamp-head:${s}:${side}`;
    box('rail',s,d,y+.35,.6,.6,.34,base);
    box('lamp',s,d,y+9.5,1.2,.6,.25,head);
    bar('rail',[s,d,y+.35],[s,d,y+9.5],.095,s);
    ledger.members.push({name:`lamp-pole:${s}:${side}`,ends:[xyz(s,d,y+.35),xyz(s,d,y+9.5)],supports:[base,head]});
  }
  const model=b.finish();
  model.traverse(mesh=>{if(!mesh.isMesh||mesh.material.name!=='asphalt')return;
    const pos=mesh.geometry.attributes.position,col=[];
    for(let i=0;i<pos.count;i++){const s=p.projectBridge(pos.getX(i),pos.getZ(i)).s,c=new THREE.Color(p.CHAMPLAIN.palette.asphalt).lerp(new THREE.Color(0xf2f3f6),landingBlend(s));col.push(c.r,c.g,c.b);}
    mesh.geometry.setAttribute('color',new THREE.Float32BufferAttribute(col,3));mesh.material.color.setHex(0xffffff);mesh.material.vertexColors=true;
  });
  ledgers.set(model,ledger);return model;
}
