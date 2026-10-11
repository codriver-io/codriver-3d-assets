import * as THREE from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE,DECK,SPAN,ARCH_START,ARCH_END,DECK_START,DECK_END,LENGTH,pathD,pathWidth,archPoint } from './walterdale-bridge-profile.js';

export function create({detail='near'}={}) {
 const near=detail==='near',b=bridgeBuilder({...PROFILE,meshStep:near?6:12},detail),h=PROFILE.deckHeight;
 // Main 22.4 m traffic deck, west sidewalk and three northbound lanes.
 for(const [a,c,k] of [[0,DECK_START,0],[DECK_START,DECK_END,1],[DECK_END,LENGTH,2]]) {
  b.strip('concrete',a,c,-11.2,11.2,-.22,.65,k);
  b.strip('asphalt',a,c,-7.1,8.9,-.16,0,k);
  b.strip('concrete',a,c,-10.9,-7.65,.04,.2,k);
  for(const d of [-7.5,9.65])b.strip('concrete',a,c,d-.24,d+.24,.83,1.05,k);
  for(const d of [-10.98,11.02]) {
   b.strip('rail',a,c,d-.045,d+.045,1.3,.09,k);
   if(near)b.strip('rail',a,c,d-.026,d+.026,.7,.052,k);
   for(let s=a;s<c;s+=near?2.3:14)b.beam('rail',[s,d,h(s)],[s,d,h(s)+1.25],.075,.075,k);
  }
  if(near) {
   for(const d of [-6.9,8.7])b.strip('paint',a,c,d-.075,d+.075,-.1,0,k);
   for(let s=Math.ceil(a/12)*12;s<c-3;s+=12)for(const d of [-1.7,3.5])b.strip('paint',s,s+3,d-.065,d+.065,-.1,0,k);
  }
 }
 // Suspended longitudinal I-beams and transverse floor beams.
 for(const d of [-10,-5,0,5,10]) {
  b.strip('girder',DECK_START,DECK_END,d-.15,d+.15,-.9,1.3,1);
  if(near)b.strip('girder',DECK_START,DECK_END,d-.42,d+.42,-2.13,.14,1);
 }
 for(let s=DECK_START+5;s<DECK_END;s+=near?5:15)b.box('girder',s,0,DECK-1.65,.3,22,1,1);
 // Independent curved SUP with flared landings and a real gap from traffic deck.
 const step=near?2.5:5;
 for(let s=DECK_START;s<DECK_END-.001;s+=step) {
  const end=Math.min(DECK_END,s+step),mid=(s+end)/2,d=pathD(mid),w=pathWidth(mid);
  const pts=[],idx=[0,1,4,1,5,4,2,6,3,3,6,7,0,4,2,2,4,6,1,3,5,3,7,5];
  for(const a of [s,end])for(const [side,y] of [[-1,DECK-.05],[1,DECK-.05],[-1,DECK-.95],[1,DECK-.95]])pts.push(...b.xyz(a,pathD(a)+side*pathWidth(a)/2,y));
  if(s===DECK_START)idx.push(0,2,1,1,2,3);
  if(end===DECK_END)idx.push(4,5,6,5,7,6);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));g.setIndex(idx);g.computeVertexNormals();b.put(g,'concrete',1);
  for(const side of [-1,1]) {
   const edge=a=>pathD(a)+side*(pathWidth(a)/2-.08);
   b.beam('rail',[s,edge(s),DECK+1.3],[end,edge(end),DECK+1.3],.08,.08,1);
   if(near)b.beam('rail',[s,edge(s),DECK+.7],[end,edge(end),DECK+.7],.035,.035,1);
   b.beam('rail',[mid,d+side*(w/2-.08),DECK-.04],[mid,d+side*(w/2-.08),DECK+1.3],.065,.065,1);
  }
  if(near) {
   // High-backed timber wind/noise screen and continuous seating along west SUP edge.
   b.box('wood',mid,d-w/2+.35,DECK+.38,end-s-.12,.6,.14,1);
   b.box('wood',mid,d-w/2+.1,DECK+.77,end-s-.12,.12,1.45,1);
  }
 }
 // Inclined tapered box-section ribs, swept as continuous closed indexed meshes.
 const N=near?120:48;
 for(const sign of [-1,1]) {
  const verts=[],indices=[];
  for(let i=0;i<=N;i++) {
   const t=i/N,[s,d,y]=archPoint(t,sign),depth=2.5+1.1*Math.abs(2*t-1),width=2.1+.4*Math.abs(2*t-1);
   for(const [a,z] of [[-1,-1],[1,-1],[1,1],[-1,1]])verts.push(...b.xyz(s,d+a*width/2,Math.max(.25,y+z*depth/2)));
   if(i)for(let j=0;j<4;j++){const k=(j+1)%4,a=(i-1)*4+j,c=(i-1)*4+k,e=i*4+j,f=i*4+k;indices.push(a,c,e,c,f,e);}
  }
  indices.push(0,3,1,1,3,2,N*4,N*4+1,N*4+3,N*4+1,N*4+2,N*4+3);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.setIndex(indices.flatMap((v,i,a)=>i%3===0?[v,a[i+2],a[i+1]]:[]));g.computeVertexNormals();b.put(g,'arch',1,y=>Math.max(0,Math.min(1,y/DECK)));
  // Sixteen 10m-pitch hangers per main-deck plane and the third eastern SUP plane.
  for(let i=0;i<16;i++) {
   const u=28+i*10,t=u/SPAN,[s,d,y]=archPoint(t,sign),endD=sign*9.9;
   b.beam('cable',[s,d,y-1.18],[s,endD,DECK-.78],near?.095:.14,near?.095:.14,1);
   if(sign===1)b.beam('cable',[s,d+.65,y-1.18],[s,pathD(s),DECK-.6],near?.095:.14,near?.095:.14,1);
   if(near){b.box('girder',s,endD,DECK-.6,.55,.45,.65,1);if(sign===1)b.box('girder',s,pathD(s),DECK-.6,.55,.45,.65,1);}
  }
  for(const s of [ARCH_START,ARCH_END]) {
   b.box('concrete',s,sign*13.5,.32,10,6,.64,1,0);
   const end=s===ARCH_START?DECK_START:DECK_END;
   b.beam('concrete',[s,sign*13.5,.64],[end,sign*9.6,DECK-2.2],2.2,2.3,1,y=>Math.max(0,Math.min(1,y/(DECK-2.2))));
  }
 }
 // Open ladder of cross-braces between converging ribs.
 for(const t of [.19,.29,.39,.5,.61,.71,.81]){const [s,d,y]=archPoint(t,1);b.beam('arch',[s,-d,y-.3],[s,d,y-.3],.55,.65,1);}
 for(const s of [DECK_START,DECK_END])b.box('concrete',s,0,DECK-2.5,3,22.8,1.4,1);
 // Low-key pathway lights and road luminaires.
 for(let s=DECK_START+15;s<DECK_END;s+=near?25:100) {
  const d=-10.7;b.beam('rail',[s,d,DECK+.2],[s,d,DECK+8.5],.14,.14,1);
  b.beam('rail',[s,d,DECK+8.5],[s,d+2.7,DECK+8.5],.1,.1,1);
  b.box('lamp',s,d+2.7,DECK+8.4,.6,.7,.12,1);
  b.box('lamp',s,pathD(s)-pathWidth(s)/2+.14,DECK+.7,.6,.15,.1,1);
 }
 return b.finish();
}
