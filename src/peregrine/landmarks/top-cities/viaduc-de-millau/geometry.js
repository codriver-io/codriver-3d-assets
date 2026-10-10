import * as THREE from 'three';
import {bridgeBuilder} from '../../asset-geometry.js';
import {PROFILE as p,L,START,END,PIERS,PIER_HEIGHTS,PYLON_HEIGHT,WIDTH} from './viaduc-de-millau-profile.js';
export const STAYS_PER_HALF=11,SPLIT_HEIGHT=90;
// Far fans consolidate eleven physical stays into four screen-readable strands.
const FAR_STAYS=new Set([0,3,7,10]);
export function create({detail='near'}={}){
 const near=detail==='near',b=bridgeBuilder({...p,meshStep:near?8:32},detail),h=p.deckHeight,xyz=b.xyz;
 const chunk=s=>near?Math.min(3,Math.max(0,Math.floor((s-START)/2460*4))):0;
 const clamp=x=>Math.max(0,Math.min(1,x));
 function mesh(pos,idx,mat,ck,lift=1){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();b.put(g,mat,ck,lift);}
 // Bevelled rectangular loft; distinct planar faces keep tapered shafts legible.
 function shaft(s,levels,mat,ck,lift=1){
  const pos=[],idx=[],n=8;
  for(const [y,u,length,width] of levels){const a=length/2,d=width/2,c=Math.min(.45,a/4,d/4);
   for(const [v,w] of [[-a+c,-d],[-a,-d+c],[-a,d-c],[-a+c,d],[a-c,d],[a,d-c],[a,-d+c],[a-c,-d]])pos.push(...xyz(s+u+v,w,y));}
  for(let k=1;k<levels.length;k++)for(let j=0;j<n;j++){const a=(k-1)*n+j,c=(k-1)*n+(j+1)%n,u=k*n+j,v=k*n+(j+1)%n;idx.push(a,c,u,c,v,u);}
  const end=(levels.length-1)*n;for(let j=1;j<n-1;j++)idx.push(0,j+1,j,end,end+j,end+j+1);
  mesh(pos,idx,mat,ck,lift);
 }
 // A closed shallow steel box, central 4.2 m soffit and sharp cantilever edges.
 function section(a,c,mat,ring){
  const ss=[a];for(let s=a+(near?8:24);s<c;s+=near?8:24)ss.push(s);ss.push(c);
  const pos=[],idx=[],n=ring.length;
  for(const s of ss)for(const [d,y] of ring)pos.push(...xyz(s,d,h(s)+y));
  for(let k=1;k<ss.length;k++)for(let j=0;j<n;j++){const u=(k-1)*n+j,v=(k-1)*n+(j+1)%n,w=k*n+j,t=k*n+(j+1)%n;idx.push(u,v,w,v,t,w);}
  const end=(ss.length-1)*n;for(let j=1;j<n-1;j++)idx.push(0,j+1,j,end,end+j,end+j+1);
  mesh(pos,idx,mat,chunk((a+c)/2));
 }
 const cuts=[START,START+615,START+1230,START+1845,END];
 for(let i=1;i<cuts.length;i++)section(cuts[i-1],cuts[i],'steel',[[-WIDTH/2,-.12],[WIDTH/2,-.12],[WIDTH/2,-.72],[8,-4.2],[-8,-4.2],[-WIDTH/2,-.72]]);
 function strip(mat,a,c,l,r,y=0,depth=0){
  for(let s=a;s<c-1e-5;){const e=Math.min(c,START+615*(Math.floor((s-START+1e-5)/615)+1));b.strip(mat,s,e,l,r,y,depth,chunk(s));s=e;}
 }
 strip('asphalt',0,L,-14.7,14.7,0);
 for(const d of [-15.1,15.1])strip('rail',START,END,d-.13,d+.13,.18,.3);
 // Four motorway lanes, hard shoulders and a central stay corridor.
 for(const d of [-12.3,-3.25,3.25,12.3])strip('paint',0,L,d-.075,d+.075,.035);
 if(near)for(const d of [-7.8,7.8])for(let s=0;s<L;s+=18)strip('paint',s,Math.min(s+6,L),d-.075,d+.075,.035);
 for(const d of [-2.25,2.25]){strip('rail',0,L,d-.12,d+.12,.76,.20);if(near)for(let s=START+2;s<END;s+=6)b.box('rail',s,d,h(s)+.37,.1,.12,.7,chunk(s));}
 // Continuous 3.2 m wind-screen skins; closed thin panels read from either side.
 // Near louvre bands retain the horizontal rhythm without hundreds of open posts.
 for(const d of [-15.7,15.7]){
  for(let i=1;i<cuts.length;i++)section(cuts[i-1],cuts[i],'glass',[[d-.06,3.2],[d+.06,3.2],[d+.06,.18],[d-.06,.18]]);
  strip('rail',START,END,d-.09,d+.09,3.25,.08);
  if(near)for(const y of [.9,1.7,2.5])strip('rail',START,END,d-.09,d+.09,y,.06);
 }
 for(let k=0;k<PIERS.length;k++){
  const s=PIERS[k],ck=chunk(s),deck=h(s),top=deck-4.2,foot=top-PIER_HEIGHTS[k],split=top-Math.min(SPLIT_HEIGHT,PIER_HEIGHTS[k]-4);
  const lift=y=>clamp((y-foot)/(top-foot));
  // Lower solid blade tapers into a pair of longitudinal shafts over the upper 90 m.
  shaft(s,[[foot,0,17,10+17*PIER_HEIGHTS[k]/245],[foot+3,0,16.8,9.8+17*PIER_HEIGHTS[k]/245],[split,0,17.2,11.2]],'concrete',ck,lift);
  for(const side of [-1,1])shaft(s,[[split,side*4.3,8.6,11.2],[top,side*5.5,5,10]],'concrete',ck,lift);
  for(const u of [-5.5,5.5])b.box('rail',s+u,0,top+.18,3.8,9.4,.36,ck);
  // Inverted-Y / A steel mast lies in the median's single cable plane, not across lanes.
  for(const side of [-1,1])shaft(s,[[deck,side*7,4.75,3.5],[deck+38,side*2.45,4.75,3.5]],'steel',ck);
  shaft(s,[[deck+38,0,9.7,3.5],[deck+PYLON_HEIGHT,0,2.4,3.5]],'steel',ck);
  for(const dir of [-1,1])for(let i=0;i<STAYS_PER_HALF;i++){
   if(!near&&!FAR_STAYS.has(i))continue;
   const reach=26+12.5*i,anchor=s+dir*reach,upper=deck+51+3.1*i;
   const from=xyz(s+dir*(4.85-3.65*(upper-deck-38)/49-.05),0,upper),to=xyz(anchor,0,h(anchor)+.4);
   // Deliberate LOD width compensation prevents thin cylinders aliasing into dots.
   b.bar('cable',from,to,near?.45:1.30,undefined,ck,true);
   if(near){b.box('steel',anchor,0,h(anchor)+.29,1.5,.7,.7,chunk(anchor));
    const a=new THREE.Vector3(...to),v=new THREE.Vector3(...from).sub(a).normalize();
    b.bar('rail',to,a.clone().addScaledVector(v,3.2).toArray(),.24,undefined,chunk(anchor),true);
   }
  }
  if(near){b.box('lamp',s,0,deck+86.7,.45,1.9,.25,ck);for(let u=-4;u<=4;u+=2)b.box('rail',s+u,0,deck+.25,.25,2.1,.5,ck);}
 }
 // Compact plateau abutments, no invented valley/hill mesh.
 for(const s of [START,END])b.box('concrete',s,0,h(s)-5.35,12,31.3,10,chunk(s),1);
 return b.finish();
}
