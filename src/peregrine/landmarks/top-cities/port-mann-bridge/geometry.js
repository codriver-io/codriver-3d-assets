import * as THREE from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p, DECK_H, TOWER_H, NORTH_TOWER, SOUTH_TOWER, CABLE_START, CABLE_END, HALF_WIDTH, MEDIAN_HALF, LANDING, SIDE_SPAN, CURVE, L } from './port-mann-bridge-profile.js';
import { NORTH_BLEND_END } from './port-mann-bridge-landing.js';

// Chamfered single-mast section. Dimensions are visual estimates; tower rise is sourced.
export const PYLON_LEVELS=[[0,12,9],[8,11.4,8.8],[DECK_H-5,9.6,7.8],[DECK_H+1,8.5,7],[DECK_H+35,7.6,6.5],[TOWER_H,6.6,5.8]];
export const CABLE_PLANES=[-31.1,-6.1,6.1,31.1];

export function create({detail='near'}={}) {
  const near=detail==='near',b=bridgeBuilder(p,detail),xyz=b.xyz,h=p.deckHeight;
  const chunk=s=>near?Math.min(3,Math.floor(s/L*4)):0;
  const clamp=v=>Math.max(0,Math.min(1,v));
  // Closed strips sample the actual road profile through both vertical curves.
  function strip(mat,a,c,left,right,offset=0,thick=0) {
    const boundary=L/4,step=near?4:8;
    const curves=[[LANDING,LANDING+CURVE],[CABLE_START-CURVE,CABLE_START],[CABLE_END,CABLE_END+CURVE],[L-LANDING-CURVE,L-LANDING]];
    for(let start=a;start<c-.0001;) {
      const end=Math.min(c,(Math.floor((start+.0001)/boundary)+1)*boundary,start<NORTH_BLEND_END?NORTH_BLEND_END:Infinity);
      const set=new Set([start,end]);
      for(const [a,c] of curves) {
        for(const s of [a,c])if(s>start&&s<end)set.add(s);
        for(let s=Math.ceil(Math.max(start,a)/step)*step;s<Math.min(end,c);s+=step)if(s>start)set.add(s);
      }
      for(let s=Math.ceil(start/(near?25:75))*(near?25:75);s<end;s+=near?25:75)if(s>start)set.add(s);
      if(start<NORTH_BLEND_END)for(let s=Math.ceil(start/8)*8;s<end;s+=8)if(s>start)set.add(s);
      for(const s of [CABLE_START,CABLE_END])if(s>start&&s<end)set.add(s);
      for(const v of p.ALIGNMENT)if(v.s>start&&v.s<end)set.add(v.s);
      const ss=[...set].sort((x,y)=>x-y),pos=[],idx=[];
      const columns=!thick&&mat==='asphalt'&&start<NORTH_BLEND_END?Math.ceil((right-left)/4)+1:2;
      const stride=thick?4:columns;
      for(const s of ss)for(const [d,dy] of thick?[[left,0],[right,0],[left,-thick],[right,-thick]]:Array.from({length:columns},(_,i)=>[left+(right-left)*i/(columns-1),0]))pos.push(...xyz(s,d,h(s)+offset+dy));
      for(let i=1;i<ss.length;i++) {
        const a0=(i-1)*stride,c0=i*stride;
        for(let j=0;j<(thick?1:columns-1);j++)idx.push(a0+j,a0+j+1,c0+j,a0+j+1,c0+j+1,c0+j);
        if(thick)idx.push(a0+2,c0+2,a0+3,a0+3,c0+2,c0+3,a0,c0,a0+2,a0+2,c0,c0+2,a0+1,a0+3,c0+1,a0+3,c0+3,c0+1);
      }
      if(thick){const z=(ss.length-1)*stride;idx.push(0,2,1,1,2,3,z,z+1,z+2,z+1,z+3,z+2);}
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();b.put(g,mat,chunk(start));start=end;
    }
  }
  function cylinder(mat,a,c,r0,r1=r0,sides=near?8:4,ck=0,lift=1) {
    const v=new THREE.Vector3(...a),w=new THREE.Vector3(...c),axis=w.clone().sub(v);
    const g=new THREE.CylinderGeometry(r1,r0,axis.length(),sides,1,false);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),axis.normalize()));g.translate(...v.add(w).multiplyScalar(.5).toArray());b.put(g,mat,ck,lift);
  }
  // Closed octagonal loft: flat broad faces and short chamfers, preserving the single mast.
  function pylon(s) {
    const pos=[],idx=[];
    for(const [y,length,width] of PYLON_LEVELS) {
      const a=length/2,d=width/2,c=.7;
      for(const [u,v] of [[-a+c,-d],[a-c,-d],[a,-d+c],[a,d-c],[a-c,d],[-a+c,d],[-a,d-c],[-a,-d+c]])pos.push(...xyz(s+u,v,y));
    }
    for(let k=1;k<PYLON_LEVELS.length;k++)for(let j=0;j<8;j++){const a=(k-1)*8+j,c=(k-1)*8+(j+1)%8,u=k*8+j,v=k*8+(j+1)%8;idx.push(a,u,c,c,u,v);}
    for(let j=1;j<7;j++)idx.push(0,j,j+1,40,40+j+1,40+j);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
    b.put(g,'tower',chunk(s),y=>clamp(y/(DECK_H-5)));
  }
  let first=LANDING,last=L-LANDING;
  while(h(first)<4.4)first++;while(h(last)<4.4)last--;
  // Twin decks keep the 10 m open median. Three box girders per deck read in underside views.
  for(const side of [-1,1]) {
    const left=side<0?-HALF_WIDTH:MEDIAN_HALF,right=side<0?-MEDIAN_HALF:HALF_WIDTH;
    strip('concrete',first,last,left,right,-.22,.75);
    const road=side<0?[-28.5,-5.6]:[5.6,31.8];strip('asphalt',0,L,...road,0);
    strip('concrete',0,L,left,road[0],.16,.16);
    strip('concrete',0,L,road[1],right,.16,.16);
    for(const d of [side*7,side*18,side*30.4])strip('steel',first,last,d-.75,d+.75,-.98,3.02);
    for(const d of [side*5.3,side*32.18])strip('concrete',0,L,d-.20,d+.20,1.15,.92);
    for(const d of [road[0]+.25,road[1]-.25])strip('paint',0,L,d-.065,d+.065,.035);
    if(near)for(let s=4;s<L-4;s+=12)for(let i=1;i<5;i++) {
      const d=side*(8+3.8*i);b.strip('paint',s,Math.min(s+3,L),d-.055,d+.055,.035,0,chunk(s));
    }
  }
  // East-side pedestrian/cycle path, separated from northbound traffic.
  strip('concrete',0,L,-28.95,-28.6,1.1,.87);
  strip('rail',0,L,-32.23,-32.12,1.68,.10);
  if(near)for(let s=3;s<L;s+=3)b.box('rail',s,-32.17,h(s)+1.25,.085,.085,.85,chunk(s));
  for(let i=0;i<=116;i++) {
    if(!near&&i%4&&i!==116)continue;
    const s=CABLE_START+(CABLE_END-CABLE_START)*i/116;
    b.box('steel',s,0,h(s)-2.65,.45,61.5,1.7,chunk(s));
    if(near)for(const side of [-1,1])b.beam('steel',[s,side*6,h(s)-3.85],[s,side*29,h(s)-1.1],.22,.28,chunk(s));
  }
  // 13 northern and 8 southern support stations, including the cable-section anchor supports.
  const piers=[];
  for(let i=1;i<=13;i++)piers.push(LANDING+(CABLE_START-LANDING)*i/13);
  for(let i=0;i<8;i++)piers.push(CABLE_END+(L-LANDING-CABLE_END)*i/8);
  for(const s of piers) {
    const top=h(s)-4;if(top<2.2)continue;
    for(const side of [-1,1]) {
      for(const d of [side*10,side*26])cylinder('concrete',xyz(s,d,0),xyz(s,d,top-.8),1.6,1.3,near?10:5,chunk(s),y=>clamp(y/(top-.8)));
      b.box('concrete',s,side*18,top-.2,4.2,27.5,1.5,chunk(s));
    }
  }
  for(const s of [NORTH_TOWER,SOUTH_TOWER]) {
    pylon(s);
    b.box('concrete',s,0,DECK_H-4.7,11.2,63,1.5,chunk(s));
    // 4 planes × 18 stays × two longitudinal fans per mast = 144 per mast, 288 total.
    for(const direction of [-1,1])for(const d of CABLE_PLANES)for(let i=0;i<18;i++) {
      if(!near&&i%2&&i!==17)continue;
      const main=(s===NORTH_TOWER&&direction===1)||(s===SOUTH_TOWER&&direction===-1),reach=main?230:SIDE_SPAN-2;
      const length=22+(reach-22)*i/17,anchor=s+direction*length;
      const upperY=DECK_H+32+41*i/17;
      cylinder('cable',xyz(s+direction*3.15,Math.sign(d)*2.0,upperY),xyz(anchor,d,h(anchor)+1.15),near?.13:.19,near?.13:.19,near?6:3,chunk(s));
      if(near)b.box('steel',anchor,d,h(anchor)+.75,.9,.65,.9,chunk(anchor));
    }
    if(near)for(let y=DECK_H+30;y<TOWER_H-1;y+=2.8)for(const direction of [-1,1]) {
      let k=1;while(PYLON_LEVELS[k][0]<y)k++;
      const a=PYLON_LEVELS[k-1],c=PYLON_LEVELS[k],u=(y-a[0])/(c[0]-a[0]);
      b.box('steel',s+direction*((a[1]+(c[1]-a[1])*u)/2+.04),0,y,.20,4.4,.16,chunk(s));
    }
  }
  for(let s=LANDING+20;s<L-LANDING;s+=32)for(const side of [-1,1]) {
    const d=side<0?-29.6:31.3,y=h(s),ck=chunk(s);
    cylinder('rail',xyz(s,d,y+.16),xyz(s,d,y+10),.14,.10,near?6:3,ck);
    if(near){b.beam('rail',[s,d,y+10],[s+1.6,d-side*2,y+10.5],.14,.14,ck);b.box('lamp',s+1.6,d-side*2,y+10.45,1.1,.5,.16,ck);}
  }
  return b.finish();
}
