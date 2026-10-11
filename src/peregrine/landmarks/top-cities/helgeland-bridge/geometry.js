import * as THREE from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p, L, NORTH_TOWER as N, SOUTH_TOWER as S, CABLE_START as A, CABLE_END as B, BRIDGE_START, BRIDGE_END, NORTH_H, SOUTH_H, DECK_H, LANDING, CURVE } from './helgeland-bridge-profile.js';

export const CABLE_PLANES=[-5.65,5.65];
export const STAYS_PER_FAN=18;
export const PIER_STATIONS=[BRIDGE_START+32,BRIDGE_START+81,A,A+54,B-54,B,B+45,B+90,B+135,BRIDGE_END-10];
// The towers are modified diamonds, not straight vertical portal legs.
// y / lateral centre / along section / transverse section; interpreted from reference photos.
export const towerLevels=height=>[[2,3.4,6,3.6],[9,3.4,6,3.5],[DECK_H-1,8.3,6,2.6],[DECK_H+3,8.2,5.7,2.2],[height-28,2.7,4.6,2.2],[height-14,1.3,4.4,2.2],[height,1.1,4.2,2.2]];

export function create({detail='near'}={}) {
  const near=detail==='near', b=bridgeBuilder(p,detail), xyz=b.xyz,h=p.deckHeight;
  const chunk=s=>near?Math.min(2,Math.floor(s/L*3)):0;
  const clamp=v=>Math.max(0,Math.min(1,v));
  function cylinder(mat,from,to,r0,r1=r0,sides=near?8:4,ck=0,lift=1) {
    const a=new THREE.Vector3(...from),c=new THREE.Vector3(...to),axis=c.clone().sub(a);
    const g=new THREE.CylinderGeometry(r1,r0,axis.length(),sides,1,false);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),axis.normalize()));
    g.translate(...a.add(c).multiplyScalar(.5).toArray());b.put(g,mat,ck,lift);
  }
  function stations(a,c) {
    const set=new Set([a,c]);
    for(let s=Math.ceil(a/(near?8:16))*(near?8:16);s<c;s+=near?8:16)if(s>a)set.add(s);
    for(const v of p.ALIGNMENT)if(v.s>a&&v.s<c)set.add(v.s);
    for(const s of [LANDING,LANDING+CURVE,N-CURVE,N,S,S+CURVE,L-LANDING-CURVE,L-LANDING,BRIDGE_START,BRIDGE_END,160,L-160])if(s>a&&s<c)set.add(s);
    return [...set].sort((x,y)=>x-y);
  }
  // Closed longitudinal prism, including end closures and the thin central soffit.
  function section(mat,a,c,ring) {
    const ss=stations(a,c),pos=[],idx=[],n=ring.length;
    for(const s of ss)for(const [d,offset] of ring)pos.push(...xyz(s,d,h(s)+offset));
    for(let k=1;k<ss.length;k++)for(let j=0;j<n;j++) {
      const u=(k-1)*n+j,v=(k-1)*n+(j+1)%n,w=k*n+j,t=k*n+(j+1)%n;
      idx.push(u,v,w,v,t,w);
    }
    const end=(ss.length-1)*n;
    for(let j=1;j<n-1;j++)idx.push(0,j+1,j,end,end+j,end+j+1);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();b.put(g,mat,chunk((a+c)/2));
  }
  function strip(mat,a,c,left,right,offset=0,thickness=0) {
    for(let start=a;start<c-1e-6;) {
      const end=Math.min(c,(Math.floor((start+1e-6)/(L/3))+1)*L/3);
      if(thickness)section(mat,start,end,[[left,offset],[right,offset],[right,offset-thickness],[left,offset-thickness]]);
      else {
        const ss=stations(start,end),pos=[],idx=[];
        const columns=mat==='asphalt'&&(start<160||end>L-160)?4:2;
        for(const s of ss)for(let j=0;j<columns;j++)pos.push(...xyz(s,left+(right-left)*j/(columns-1),h(s)+offset));
        for(let i=1;i<ss.length;i++)for(let j=0;j<columns-1;j++){const a0=(i-1)*columns+j,c0=i*columns+j;idx.push(a0,a0+1,c0,a0+1,c0+1,c0);}
        const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();b.put(g,mat,chunk(start));
      }
      start=end;
    }
  }
  // Main concrete slab: 0.40 m centrally, 1.20 m at the outer edge.
  for(let a=BRIDGE_START;a<BRIDGE_END-1e-6;) {
    const c=Math.min(BRIDGE_END,(Math.floor((a+1e-6)/(L/3))+1)*L/3);
    section('concrete',a,c,[[-6,-.04],[6,-.04],[6,-1.2],[3,-.44],[-3,-.44],[-6,-1.2]]);a=c;
  }
  strip('asphalt',0,L,-5.45,3.3,0);
  strip('concrete',0,L,3.4,5.95,.16,.16); // Raised western walkway.
  strip('concrete',0,L,-5.95,-5.5,.13,.13);
  // Fallback centre marking is Norwegian yellow; provider HD paint takes priority.
  for(const d of [-1.2,-1.02])strip('paint',0,L,d-.045,d+.045,.03);
  for(const d of [-5.12,3.05])strip('rail',0,L,d-.035,d+.035,.025);
  // Rail edge silhouette survives far; near retains the characteristic closely spaced posts.
  for(const d of [-5.92,5.92]) {
    strip('rail',0,L,d-.05,d+.05,1.33,.10);
    strip('rail',0,L,d-.035,d+.035,.82,.07);
    if(near)for(let s=2;s<L;s+=2.5)b.box('rail',s,d,h(s)+.70,.065,.08,1.25,chunk(s));
  }
  strip('rail',0,L,3.38,3.45,1.08,.07);
  if(near)for(let s=2;s<L;s+=3)b.box('rail',s,3.415,h(s)+.64,.065,.07,.94,chunk(s));
  // Slender blade piers: no support inside the 425 m navigation span.
  for(const s of PIER_STATIONS) {
    const top=h(s)-1.1,ck=chunk(s);
    b.box('concrete',s,0,1.1,5.8,9.2,2.2,ck,0);
    b.box('concrete',s,0,(top+1.5)/2,3.8,5.2,top-2.5,ck,y=>clamp((y-2)/(top-2)));
    b.box('concrete',s,0,top-.1,4.4,11.8,1.25,ck);
    if(near)for(const d of [-4.2,4.2])b.box('steel',s,d,top+.42,1.2,.7,.32,ck);
  }
  function tower(s,height) {
    const levels=towerLevels(height),ck=chunk(s);
    b.box('concrete',s,0,1,9,13.6,2,ck,0);
    for(const side of [-1,1]) {
      const pos=[],idx=[];
      for(const [y,d,length,width] of levels) {
        const a=length/2,w=width/2,c=.18;
        for(const [u,v] of [[-a+c,-w],[a-c,-w],[a,-w+c],[a,w-c],[a-c,w],[-a+c,w],[-a,w-c],[-a,-w+c]])pos.push(...xyz(s+u,side*d+v,y));
      }
      for(let k=1;k<levels.length;k++)for(let j=0;j<8;j++){const a=(k-1)*8+j,c=(k-1)*8+(j+1)%8,u=k*8+j,v=k*8+(j+1)%8;idx.push(a,u,c,c,u,v);}
      const end=(levels.length-1)*8;
      for(let j=1;j<7;j++)idx.push(0,j,j+1,end,end+j+1,end+j);
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();b.put(g,'tower',ck,y=>clamp((y-2)/(DECK_H-2)));
    }
    // Deck-level crossbeam completes the H opening without occupying the road.
    b.box('tower',s,0,DECK_H-2.1,6.2,18.1,2.2,ck);
    // Crown tie closes the apex: a small solid zone atop the long tapered opening.
    b.box('tower',s,0,height-6.5,4.1,1.0,13,ck);
    if(near) {
      for(const side of [-1,1])b.box('steel',s+side*2.05,0,height-.6,.10,3.4,.12,ck);
      b.box('steel',s,0,height-.6,4.1,.1,.12,ck);
    }
    for(const direction of [-1,1])for(const d of CABLE_PLANES)for(let i=0;i<STAYS_PER_FAN;i++) {
      if(!near&&i%2&&i!==STAYS_PER_FAN-1)continue;
      const main=(s===N&&direction===1)||(s===S&&direction===-1);
      const reach=main?MAIN_REACH:174,dist=18+(reach-18)*i/(STAYS_PER_FAN-1),anchor=s+direction*dist;
      const y=height-34+32*i/(STAYS_PER_FAN-1),sign=Math.sign(d);
      // Interpolated leg centre puts every upper anchor on concrete.
      let k=1;while(levels[k][0]<y)k++;
      const l=levels[k-1],u=levels[k],across=l[1]+(u[1]-l[1])*(y-l[0])/(u[0]-l[0]);
      const top=xyz(s+direction*2.0,sign*across,y),bottom=xyz(anchor,d,h(anchor)+.28);
      cylinder('cable',top,bottom,near?.115:.16,near?.115:.16,near?6:3,ck);
      if(near) {
        b.box('steel',anchor,d,h(anchor)+.22,1.05,.45,.65,chunk(anchor));
        // Steel protection sleeve, plus small visible stay damper collars.
        const v=new THREE.Vector3(...top).sub(new THREE.Vector3(...bottom)).normalize();
        cylinder('steel',bottom,new THREE.Vector3(...bottom).addScaledVector(v,2.8).toArray(),.22,.18,6,chunk(anchor));
        if(i>5)for(const distance of [9,16]) {
          const center=new THREE.Vector3(...bottom).addScaledVector(v,distance);
          cylinder('steel',center.clone().addScaledVector(v,-.25).toArray(),center.clone().addScaledVector(v,.25).toArray(),.22,.22,6,ck);
        }
      }
    }
  }
  tower(N,NORTH_H);tower(S,SOUTH_H);
  // Unobtrusive walkway lamps present in the dossier; no invented tower floodlights.
  for(let s=BRIDGE_START+18;s<BRIDGE_END;s+=32) {
    const d=5.15,y=h(s),ck=chunk(s);
    cylinder('rail',xyz(s,d,y+.16),xyz(s,d,y+7.5),.09,.07,near?6:3,ck);
    if(near)b.beam('rail',[s,d,y+7.5],[s,d-1.3,y+7.65],.09,.09,ck);
    b.box('lamp',s,d-1.3,y+7.6,.65,.4,.12,ck);
  }
  return b.finish();
}
const MAIN_REACH=204;
