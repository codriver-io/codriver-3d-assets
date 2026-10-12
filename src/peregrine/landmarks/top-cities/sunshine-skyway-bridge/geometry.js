import * as THREE from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p,N,S,A,B,L,DECK_H,TOWER_H } from './sunshine-skyway-bridge-profile.js';
export const PYLON_LEVELS=[[0,9,8],[5,7.5,6],[DECK_H-4.5,5.5,4.6],[DECK_H,4.8,3.8],[94,3.4,3.1],[TOWER_H,2.6,2.6]];
export function stays(detail='near') {
 const result=[];
 for(const tower of [N,S])for(const sign of [-1,1])for(let i=0;i<21;i++) {
  if(detail==='far'&&i%2&&i!==20)continue;
  const main=(tower===N&&sign===1)||(tower===S&&sign===-1);
  const station=tower+sign*((main?25:16)+7.3*i);
  result.push({tower,sign,i,top:[tower+sign*1.25,0,96+1.5*i],foot:[station,0,p.deckHeight(station)+.8]});
 }
 return result;
}
export function pierStations() {
 const values=[A,B,A-73,B+73,A-146,B+146,A-219,B+219];
 for(let s=A-260;s>70;s-=41)if(p.deckHeight(s)>5.6)values.push(s);
 for(let s=B+260;s<L-70;s+=41)if(p.deckHeight(s)>5.6)values.push(s);
 return values.sort((a,b)=>a-b);
}
export function create({detail='near'}={}) {
 const near=detail==='near',b=bridgeBuilder({...p,meshStep:near?3:12},detail),xyz=b.xyz,h=p.deckHeight;
 const chunk=s=>near?Math.min(2,Math.floor(s/L*3)):0;
 // Closed longitudinal section, sampled at curve and mapped alignment stations.
 function loft(mat,a,c,section,lift=1) {
  for(let start=a;start<c-.001;) {
   const end=Math.min(c,(Math.floor((start+.001)/(L/3))+1)*L/3),ss=new Set([start,end]);
   for(let s=Math.ceil(start/(near?6:12))*(near?6:12);s<end;s+=near?6:12)ss.add(s);
   for(const q of p.ALIGNMENT)if(q.s>start&&q.s<end)ss.add(q.s);
   const stations=[...ss].sort((a,b)=>a-b),pos=[],idx=[],n=section.length;
   for(const s of stations)for(const [d,dy] of section)pos.push(...xyz(s,d,section.every(q=>q[1]<0)?Math.min(h(s)-.20,Math.max(0,h(s)+dy)):Math.max(0,h(s)+dy)));
   for(let k=1;k<stations.length;k++)for(let j=0;j<n;j++) {
    const a=(k-1)*n+j,c=(k-1)*n+(j+1)%n,u=k*n+j,v=k*n+(j+1)%n;idx.push(a,c,u,c,v,u);
   }
   for(let j=1;j<n-1;j++)idx.push(0,j+1,j,(stations.length-1)*n,(stations.length-1)*n+j,(stations.length-1)*n+j+1);
   let g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);if(near)g=g.toNonIndexed();g.computeVertexNormals();b.put(g,mat,chunk(start),lift);start=end;
  }
 }
 function tube(mat,a,c,r,sides=near?6:3) {
  const v=new THREE.Vector3(...xyz(...a)),w=new THREE.Vector3(...xyz(...c)),axis=w.clone().sub(v);
  const g=new THREE.CylinderGeometry(r,r,axis.length(),sides,1,false);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),axis.normalize()));g.translate(...v.add(w).multiplyScalar(.5).toArray());b.put(g,mat,chunk(a[0]));
 }
 const centralStart=A-260,centralEnd=B+260;
 // Single wide segmental box at the cable/balanced-cantilever section.
 loft('concrete',centralStart,centralEnd,[[-14.5,-.20],[14.5,-.20],[5,-4.5],[-5,-4.5]]);
 // Twin trapezoidal box girders and open median on the high approaches.
 for(const [a,c] of [[0,centralStart],[centralEnd,L]])for(const sign of [-1,1]) {
  const d=sign*7.65;loft('concrete',a,c,[[d-6.85,-.20],[d+6.85,-.20],[d+2.1,-3.4],[d-2.1,-3.4]]);
 }
 for(const sign of [-1,1]) {
  const left=sign<0?-13.7:1.95,right=sign<0?-1.95:13.7;
  b.strip('asphalt',0,L,left,right,0,0);
  const outer=[sign*14.5,sign*13.7].sort((a,b)=>a-b);loft('concrete',0,L,[[outer[0],1.12],[outer[1],1.12],[outer[1],-.20],[outer[0],-.20]]);
  for(const d of [left+.2,right-.2])b.strip(d*sign<3?'yellow':'paint',0,L,d-.065,d+.065,.035);
  if(near)for(let s=3;s<L-3;s+=12)b.strip('paint',s,Math.min(s+3,L),sign*7.8-.06,sign*7.8+.06,.035,0,chunk(s));
 }
 // Solid central anchorage plinth on the stayed bridge; paired inner barriers elsewhere.
 loft('median',centralStart,centralEnd,[[-1.9,1.12],[1.9,1.12],[1.9,-.2],[-1.9,-.2]]);
 for(const [a,c] of [[0,centralStart],[centralEnd,L]])for(const sign of [-1,1]){const ds=[sign*1.95,sign*.8].sort((a,b)=>a-b);loft('median',a,c,[[ds[0],1.12],[ds[1],1.12],[ds[1],-.2],[ds[0],-.2]]);}
 for(const s of pierStations()) {
  const central=s>=centralStart&&s<=centralEnd,top=h(s)-(central?4.5:3.4);
  for(const d of central?[0]:[-7.65,7.65]) {
   const width=central?7.8:3.8;
   b.box('concrete',s,d,top/2,3.6,width,top,chunk(s),y=>Math.max(0,Math.min(1,y/top)));
   b.box('concrete',s,d,top-.35,4.8,central?10:5.4,.7,chunk(s));
  }
 }
 for(const s of [N,S]) {
  const pos=[],idx=[];
  for(const [y,length,width] of PYLON_LEVELS){const a=length/2,d=width/2,c=.35;for(const [u,v] of [[-a+c,-d],[a-c,-d],[a,-d+c],[a,d-c],[a-c,d],[-a+c,d],[-a,d-c],[-a,-d+c]])pos.push(...xyz(s+u,v,y));}
  for(let k=1;k<PYLON_LEVELS.length;k++)for(let j=0;j<8;j++){const a=(k-1)*8+j,c=(k-1)*8+(j+1)%8,u=k*8+j,v=k*8+(j+1)%8;idx.push(a,u,c,c,u,v);}
  for(let j=1;j<7;j++)idx.push(0,j,j+1,40,40+j+1,40+j);
  let g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);if(near)g=g.toNonIndexed();g.computeVertexNormals();b.put(g,'tower',chunk(s),y=>Math.max(0,Math.min(1,y/(DECK_H-4.5))));
  b.box('concrete',s,0,1.25,16,24,2.5,chunk(s),0);
 }
 for(const q of stays(detail))tube('cable',q.top,q.foot,near?.11:.18);
 // Single-arm poles planted into the outer concrete barrier, no floating lamp ends.
 for(let s=100;s<L-100;s+=82)for(const sign of [-1,1]) {
  const d=sign*14.15,y=h(s);tube('rail',[s,d,y+.8],[s,d,y+8.5],.09);
  {b.beam('rail',[s,d,y+8.5],[s,d-sign*1.8,y+8.5],.12,.12,chunk(s));b.box('lamp',s,d-sign*1.8,y+8.5,1,.45,.18,chunk(s));}
 }
 return b.finish();
}
