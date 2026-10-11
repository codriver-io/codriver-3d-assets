import * as THREE from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE,DECK,DECK_START,DECK_END,LENGTH,ARCH_START,ARCH_END,SPAN,HANGERS,PIERS,archSection } from './svinesund-bridge-profile.js';

export function create({detail='near'}={}) {
 const near=detail==='near',b=bridgeBuilder({...PROFILE,meshStep:near?10:20},detail),h=PROFILE.deckHeight;
 const chunks=[[0,DECK_START,0],[DECK_START,ARCH_START,1],[ARCH_START,ARCH_END,2],[ARCH_END,LENGTH,3]];
 // Independent steel boxes either side of the six-metre central light slot.
 for(const [start,end,k] of chunks)for(const sign of [-1,1]) {
  const l=sign<0?-14:3,r=sign<0?-3:14;
  b.strip('girder',start,end,l,r,-.3,near?2.6:2.6,k);
  b.strip('asphalt',start,end,l+.45,r-.45,-.16,0,k);
  for(const d of [l+.23,r-.23]) {
   // Narrow edge plinths and open metal guardrails, not solid concrete walls.
   b.strip('concrete',start,end,d-.16,d+.16,.08,.34,k);
   b.strip('rail',start,end,d-.06,d+.06,1.18,.11,k);
   if(near)b.strip('rail',start,end,d-.05,d+.05,.72,.08,k);
   for(let s=start+.4;s<end;s+=near?2.5:12)b.beam('rail',[s,d,h(s)+.02],[s,d,h(s)+1.18],.09,.09,k);
  }
  if(near) {
   for(const d of [l+.72,r-.72])b.strip('paint',start,end,d-.07,d+.07,-.1,0,k);
   for(let s=Math.ceil(start/12)*12;s<end-3;s+=12)b.strip('paint',s,s+3,(l+r)/2-.065,(l+r)/2+.065,-.1,0,k);
   // Lower longitudinal webs/flanges expose the shallow double-cell box profile.
   if(start>=DECK_START&&end<=DECK_END)for(const d of [l+.6,(l+r)/2,r-.6])b.strip('girder',start,end,d-.1,d+.1,-2.96,.22,k);
  }
 }
 // Slender centrally located approach columns: no separate pier under each deck.
 for(const s of PIERS) {
  const top=DECK-2.85,foot=.6,k=s<ARCH_START?1:3;
  b.box('concrete',s,0,.3,7,7,.6,k,0);
  const vertices=[],indices=[];
  for(const [y,w,d] of [[foot,3.8,3.6],[top-1.0,2.8,2.8]])for(const [x,z] of [[-1,-1],[-1,1],[1,1],[1,-1]])vertices.push(...b.xyz(s+x*d/2,z*w/2,y));
  for(let i=0;i<4;i++){const j=(i+1)%4;indices.push(i,j,i+4,j,j+4,i+4);}
  indices.push(0,2,1,0,3,2,4,5,6,4,6,7);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();b.put(g,'concrete',k,y=>Math.max(0,Math.min(1,(y-foot)/(top-foot))));
  // Crossheads transfer load into both boxes while leaving the viaduct sides open.
  b.box('girder',s,0,top-.45,1.7,27.8,1.2,k);
  if(near)for(const side of [-1,1])b.box('girder',s,side*8.5,top+.12,3,1.1,.8,k);
 }
 for(const s of [DECK_START,DECK_END])b.box('concrete',s,0,DECK-3.65,3,28,1.5,s===DECK_START?1:3);
 // One closed continuously swept arch. Sections taper to the thin four-metre crown.
 const count=near?144:48,positions=[],indices=[];
 for(let i=0;i<=count;i++) {
  const q=archSection(i/count);
  for(const [side,v] of [[-1,-1],[1,-1],[1,1],[-1,1]])positions.push(...b.xyz(q.s,side*q.width/2,q.y+v*q.depth/2));
  if(i)for(let j=0;j<4;j++){const n=(j+1)%4,a=(i-1)*4+j,c=(i-1)*4+n,e=i*4+j,f=i*4+n;indices.push(a,e,c,c,e,f);}
 }
 indices.push(0,1,3,1,2,3,count*4,count*4+3,count*4+1,count*4+1,count*4+3,count*4+2);
 const arch=new THREE.BufferGeometry();arch.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));arch.setIndex(indices);arch.computeVertexNormals();b.put(arch,'arch',2,y=>Math.max(0,Math.min(1,y/DECK)));
 for(const s of [ARCH_START,ARCH_END])b.box('concrete',s,0,.3,9,7.6,.6,2,0);
 // Six symmetric hanger pairs anchored on the arch side faces and inner girder edges.
 for(const s of HANGERS){const q=archSection((s-ARCH_START)/SPAN);
  for(const side of [-1,1]){
   b.beam('cable',[s,side*(q.width/2-.04),q.y-.15],[s,side*3.16,DECK-1.5],near?.12:.17,near?.12:.17,2);
   if(near){b.box('girder',s,side*3.18,DECK-.9,.65,.36,1.2,2);b.box('rail',s,side*(q.width/2),q.y-.13,.46,.25,.5,2);}
  }
  b.box('girder',s,0,DECK-2.32,.65,27.6,.7,2);
 }
 // Junction crossbeams support both boxes where the arch passes through road level.
 for(const s of [DECK_START+363.27,DECK_START+551.73])b.box('girder',s,0,DECK-2.1,2.1,27.8,1.4,2);
 // Repeated inner-edge luminaires stay outside the traffic lanes.
 for(let s=DECK_START+20;s<DECK_END;s+=near?40:80){
  for(const side of [-1,1]){
   const d=side*3.45,k=s<ARCH_START?1:s<ARCH_END?2:3;
   b.beam('rail',[s,d,DECK+.05],[s,d,DECK+8.1],.14,.14,k);
   b.beam('rail',[s,d,DECK+8.1],[s,d+side*2.6,DECK+8.1],.11,.11,k);
   b.box('lamp',s,d+side*2.6,DECK+8.02,.85,.42,.14,k);
  }
 }
 return b.finish();
}
