import * as THREE from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p,L,BRIDGE_START as A,BRIDGE_END as B,NORTH_TOWER as N,SOUTH_TOWER as S,TOWER_H,DECK_H,WIDTH,LANDING,CURVE } from './pont-de-normandie-profile.js';
export const STAYS_PER_FAN=23, CABLE_PLANES=[-10.95,10.95], HEAD_START=122;
// y / leg centre / longitudinal section / lateral section; photo interpretation.
// Six representative anchors per half-fan; outer reaches are identical to near.
export const FAR_STAY_INDICES=[0,4,9,13,18,22];
// Four-sided prism radius .9 m gives a minimum transverse width of 1.273 m.
export const FAR_STAY_RADIUS=.9;
export const LEG_LEVELS=[[1.6,20.7,8.4,5.6],[12,20.3,8.2,5.3],[48,15.8,7.2,4.4],[75,10.6,6.7,3.9],[105,4.7,6.1,3.4],[124,1.25,5.9,3.1]];
// 15 northern / 11 southern supports, matching operator counts. Stations are estimated.
export const PIER_STATIONS=[...Array.from({length:15},(_,i)=>A+45+i*43.5),...Array.from({length:11},(_,i)=>B-38-i*43.5)].sort((a,b)=>a-b);
export function stayEndpoints(tower,direction,plane,i) {
  const main=(tower===N&&direction===1)||(tower===S&&direction===-1);
  const u=i/(STAYS_PER_FAN-1),distance=main?40+378*u:24+174*u;
  const anchor=tower+direction*distance,y=HEAD_START+12+78*u;
  return {top:[tower+direction*2.65,Math.sign(plane)*2.1,y],bottom:[anchor,plane,p.deckHeight(anchor)+.20]};
}
export function create({detail='near'}={}) {
  const near=detail==='near',b=bridgeBuilder(p,detail),xyz=b.xyz,h=p.deckHeight;
  const chunk=s=>near?Math.max(0,Math.min(2,Math.floor(s/L*3))):0;
  const lift=(y)=>Math.max(0,Math.min(1,(y-1.6)/(DECK_H-1.6)));
  function mesh(pos,idx,mat,ck=0,weight=1) {
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();b.put(g,mat,ck,weight);
  }
  function samples(a,c) {
    const step=near?8:16,ss=new Set([a,c]);
    for(let s=Math.ceil(a/step)*step;s<c;s+=step)if(s>a)ss.add(s);
    for(const q of p.ALIGNMENT)if(q.s>a&&q.s<c)ss.add(q.s);
    for(const s of [LANDING,LANDING+CURVE,N-CURVE,N,S,S+CURVE,L-LANDING-CURVE,L-LANDING,A,B])if(s>a&&s<c)ss.add(s);
    return [...ss].sort((u,v)=>u-v);
  }
  function section(mat,a,c,ring) {
    const ss=samples(a,c),pos=[],idx=[],n=ring.length;
    for(const s of ss)for(const [d,y] of ring)pos.push(...xyz(s,d,h(s)+y));
    for(let k=1;k<ss.length;k++)for(let j=0;j<n;j++) {
      const u=(k-1)*n+j,v=(k-1)*n+(j+1)%n,w=k*n+j,t=k*n+(j+1)%n;
      idx.push(u,v,w,v,t,w);
    }
    const end=(ss.length-1)*n;
    for(let j=1;j<n-1;j++)idx.push(0,j+1,j,end,end+j,end+j+1);
    mesh(pos,idx,mat,chunk((a+c)/2));
  }
  function longitudinal(mat,a,c,ring) {
    for(let u=a;u<c-1e-5;) {const v=Math.min(c,(Math.floor((u+1e-6)/(L/3))+1)*L/3);section(mat,u,v,ring);u=v;}
  }
  function strip(mat,a,c,left,right,offset=0,depth=0) {
    if(depth)return longitudinal(mat,a,c,[[left,offset],[right,offset],[right,offset-depth],[left,offset-depth]]);
    for(let u=a;u<c-1e-5;) {
      const v=Math.min(c,(Math.floor((u+1e-6)/(L/3))+1)*L/3),ss=samples(u,v),pos=[],idx=[];
      const columns=mat==='asphalt'&&(u<100||v>L-100)?4:2;
      for(const s of ss)for(let k=0;k<columns;k++)pos.push(...xyz(s,left+(right-left)*k/(columns-1),h(s)+offset));
      for(let j=1;j<ss.length;j++)for(let k=0;k<columns-1;k++){const a=(j-1)*columns+k,c=j*columns+k;idx.push(a,a+1,c,a+1,c+1,c);}
      mesh(pos,idx,mat,chunk(u));u=v;
    }
  }
  function tube(mat,from,to,radius,ck=0,weight=1,sides=near?6:3) {
    const av=new THREE.Vector3(...xyz(...from)),bv=new THREE.Vector3(...xyz(...to)),axis=bv.clone().sub(av);
    const g=new THREE.CylinderGeometry(radius,radius,axis.length(),sides,1,false);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),axis.normalize()));g.translate(...av.add(bv).multiplyScalar(.5).toArray());b.put(g,mat,ck,weight);
  }
  function loft(s,side,levels,mat,ck,weight) {
    const pos=[],idx=[];
    for(const [y,d,len,width] of levels) {
      const a=len/2,w=width/2,c=.35;
      for(const [u,v] of [[-a+c,-w],[a-c,-w],[a,-w+c],[a,w-c],[a-c,w],[-a+c,w],[-a,w-c],[-a,-w+c]])pos.push(...xyz(s+u,side*d+v,y));
    }
    for(let k=1;k<levels.length;k++)for(let j=0;j<8;j++){const u=(k-1)*8+j,v=(k-1)*8+(j+1)%8,w=k*8+j,t=k*8+(j+1)%8;idx.push(u,w,v,v,w,t);}
    const last=(levels.length-1)*8;
    for(let j=1;j<7;j++)idx.push(0,j,j+1,last,last+j+1,last+j);
    mesh(pos,idx,mat,ck,weight);
  }
  // Thin aerofoil box: steel central 624 m, concrete over the towers and approaches.
  const steelStart=(N+S-624)/2,steelEnd=(N+S+624)/2;
  const ring=[[-WIDTH/2,-.055],[WIDTH/2,-.055],[10.9,-.7],[7.8,-3.25],[-7.8,-3.25],[-10.9,-.7]];
  longitudinal('concrete',A,steelStart,ring);longitudinal('steel',steelStart,steelEnd,ring);longitudinal('concrete',steelEnd,B,ring);
  for(const [l,r] of p.ROAD_EDGES)strip('asphalt',0,L,l,r);
  for(const side of [-1,1]) {
    const edge=side*10.95;
    strip('concrete',0,L,side<0?-11.8:9.85,side<0?-9.85:11.8,.15,.15);
    strip('blue',A,B,side<0?-11.84:11.64,side<0?-11.64:11.84,.05,.75);
    strip('rail',0,L,edge-.045,edge+.045,1.25,.09);
    strip('rail',0,L,edge-.03,edge+.03,.73,.065);
    if(near)for(let s=2;s<L;s+=2.8)b.box('rail',s,edge,h(s)+.64,.075,.08,1.23,chunk(s));
    for(const d of [side*.85,side*9.45])strip('paint',0,L,d-.06,d+.06,.025);
    if(near)for(let s=4;s<L-5;s+=18)strip('paint',s,s+5,side*4.8-.055,side*4.8+.055,.035);
  }
  strip('concrete',0,L,-.65,.65,.55,.55);
  strip('rail',0,L,-.06,.06,.82,.08);
  if(near)for(let s=2;s<L;s+=4)b.box('rail',s,0,h(s)+.67,.075,.09,.22,chunk(s));
  for(const s of PIER_STATIONS) {
    const top=h(s)-3.22,ck=chunk(s);if(top<1.6)continue;
    b.box('concrete',s,0,.75,8.5,14.4,1.5,ck,0);
    loft(s,1,[[1.5,0,6,7.5],[top-2,0,4.5,6.1],[top,0,4.8,11.8]],'concrete',ck,y=>Math.max(0,Math.min(1,(y-1.5)/(top-1.5))));
    b.box('concrete',s,0,top-.55,5.5,17.2,1.1,ck);
    if(near)for(const d of [-6,6])b.box('steel',s,d,top+.03,1.7,1.1,.22,ck);
  }
  for(const s of [N,S]) {
    const ck=chunk(s);
    for(const side of [-1,1]) {
      b.box('concrete',s,side*20.7,.8,13,10,1.6,ck,0);
      loft(s,side,LEG_LEVELS,'concrete',ck,lift);
    }
    // Above the inverted-Y fork the composite head is solid, with a recessed steel seam.
    loft(s,1,[[HEAD_START,0,6,5.1],[171,0,5.7,4.8],[TOWER_H,0,5.4,4.5]],'head',ck,1);
    b.box('concrete',s,0,DECK_H-2.0,7.2,35.4,2.45,ck);
    for(const direction of [-1,1]) {
      const seam=[];for(const [y,half] of [[HEAD_START+.1,3],[171,2.85],[TOWER_H-.1,2.7]])for(const d of [-.32,.32])seam.push(...xyz(s+direction*(half+.055),d,y));
      mesh(seam,direction===1?[0,2,1,1,2,3,2,4,3,3,4,5]:[0,1,2,1,3,2,2,3,4,3,5,4],'steel',ck);
      if(near)for(let y=12;y<HEAD_START-2;y+=3.4)for(const side of [-1,1]) {
        let k=1;while(LEG_LEVELS[k][0]<y)k++;
        const lo=LEG_LEVELS[k-1],hi=LEG_LEVELS[k],t=(y-lo[0])/(hi[0]-lo[0]),d=lo[1]+t*(hi[1]-lo[1]),len=lo[2]+t*(hi[2]-lo[2]);
        b.box('head',s+direction*(len/2+.02),side*d,y,.06,Math.max(.7,(lo[3]+t*(hi[3]-lo[3]))-.5),.07,ck,lift);
      }
      for(const plane of CABLE_PLANES)for(let i=0;i<STAYS_PER_FAN;i++) {
        if(!near&&!FAR_STAY_INDICES.includes(i))continue;
        const {top,bottom}=stayEndpoints(s,direction,plane,i);
        tube('cable',top,bottom,near?.084:FAR_STAY_RADIUS,ck,1,near?6:4);
        if(near) {
          const av=new THREE.Vector3(...bottom),dir=new THREE.Vector3(...top).sub(av).normalize();
          tube('steel',bottom,av.clone().addScaledVector(dir,3.2).toArray(),.18,chunk(bottom[0]));
          b.box('steel',bottom[0],plane,h(bottom[0])+.2,1,.4,.55,chunk(bottom[0]));
        }
      }
    }
  }
  // Regular road lights alternate carriageways, outside the vehicle bands.
  for(let s=A+18;s<B;s+=25) {
    const side=Math.floor((s-A)/25)%2?1:-1,d=side*10.2,y=h(s),ck=chunk(s);
    tube('rail',[s,d,y+.15],[s,d,y+8.5],.08,ck);
    if(near)b.beam('rail',[s,d,y+8.5],[s,d-side*1.8,y+8.65],.10,.10,ck);
    b.box(near?'lamp':'rail',s,d-side*1.8,y+8.61,.8,.42,.15,ck);
  }
  return b.finish();
}
