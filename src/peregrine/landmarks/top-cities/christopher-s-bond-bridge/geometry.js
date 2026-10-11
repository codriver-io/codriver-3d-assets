import * as THREE from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p, TOWER_S as T, SOUTH_STAY_END as A, NORTH_STAY_END as C, DECK_HALF as W, STRUCTURE_START, STRUCTURE_END } from './christopher-s-bond-bridge-profile.js';
import { SPEC } from './config.js';

// Original diamond pylon and semi-fan stays. All geometry uses the roadway's station frame.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', L = p.BRIDGE_LENGTH;
  const b = bridgeBuilder(p, detail), h = p.deckHeight;
  const chunk = s => near ? Math.min(2, Math.floor(s / L * 3)) : 0;
  const lift = y => Math.max(0, Math.min(1, y / 25));
  const put = (g, mat, s, weight = 1) => b.put(g, mat, chunk(s), weight);
  // Closed ribbons: thin girder/slab skirts at the ramp feet are buried (< 2.6 m).
  function ribbon(mat, start, end, left, right, offset, thick) {
    const cuts = [start, ...p.ALIGNMENT.map(v => v.s).filter(s => s > start && s < end), end];
    const step = near ? 5 : 10;
    for (let s = start + step; s < end; s += step) if (s < A || s > C || Math.round(s) % 25 === 0) cuts.push(s);
    cuts.sort((a,b) => a-b);
    const ss = [...new Set(cuts)];
    for(let ck=0;ck<(near?3:1);ck++) {
      const pos=[],idx=[];
      const quad=(a,c,d,e)=>idx.push(a,c,d,a,d,e);
      for(let i=1;i<ss.length;i++) {
        const a=ss[i-1],c=ss[i]; if(chunk((a+c)/2)!==ck)continue;
        const n=pos.length/3;
        for(const s of [a,c])for(const [d,off] of [[left,offset],[right,offset],[left,offset-thick],[right,offset-thick]])pos.push(...b.xyz(s,d,h(s)+off));
        quad(n,n+1,n+5,n+4); quad(n+2,n+6,n+7,n+3);
        quad(n,n+4,n+6,n+2); quad(n+1,n+3,n+7,n+5);
        if(i===1)quad(n,n+2,n+3,n+1);
        if(i===ss.length-1)quad(n+4,n+5,n+7,n+6);
      }
      if(!pos.length)continue;
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();b.put(g,mat,ck);
    }
  }
  ribbon('concrete',0,L,-W,W,-0.16,0.9);
  ribbon('asphalt',0,L,-20.5,20.5,0,0.15);
  for(const d of [-W+0.45,W-0.45]) {
    ribbon('steel',0,L,d-0.28,d+0.28,-1.1,1.45);
    ribbon('concrete',0,L,d-0.35,d+0.35,0.9,0.95);
    ribbon('rail',0,L,d-0.075,d+0.075,1.28,0.12);
  }
  ribbon('concrete',0,L,-0.45,0.45,0.95,0.95);
  // Hollow diamond, extruded along the bridge, with true upper and lower openings.
  const outline=[[-9,0],[-27,25],[-3.5,SPEC.height],[3.5,SPEC.height],[27,25],[9,0]];
  const shape=new THREE.Shape(outline.map(([d,y])=>new THREE.Vector2(d,y)));
  for(const ring of [[[-21,28],[0,88.5],[21,28]],[[-6,4],[6,4],[20,21.5],[-20,21.5]]])shape.holes.push(new THREE.Path(ring.map(([d,y])=>new THREE.Vector2(d,y))));
  const g=new THREE.ExtrudeGeometry(shape,{depth:5.5,bevelEnabled:false,steps:1,curveSegments:1});
  const q=p.bridgePoint(T,0,0),N=new THREE.Vector3(-q.tz,0,q.tx),V=new THREE.Vector3(q.tx,0,q.tz);
  g.applyMatrix4(new THREE.Matrix4().set(N.x,0,-V.x,q.x+V.x*2.75,0,1,0,0,N.z,0,-V.z,q.z+V.z*2.75,0,0,0,1));
  put(g,'concrete',T,lift);
  // Foundation and bearing shoes connect to the strut and girders, without filling the diamond.
  b.box('concrete',T,0,0.9,9,22,1.8,chunk(T),0);
  for(const d of [-20.2,20.2])b.box('steel',T,d,23.5,6.3,2.2,0.5,chunk(T));
  // 40 stays: 10 main/back anchor stations in each of the two inclined cable planes.
  for(const side of [-1,1])for(const [end,sign] of [[A,-1],[C,1]])for(let i=0;i<10;i++) {
    const f=(i+1)/10,s=T+(end-T)*f;
    const y=64+26*f, d=side*(27-(y-25)*(23.5/(SPEC.height-25)));
    const a=b.xyz(T+sign*2.85,d,y),c=b.xyz(s,side*21.15,h(s)+0.8);
    b.bar('cable',a,c,near?0.135:0.17,undefined,chunk(T),true);
    if(near) {
      b.box('steel',s,side*21.15,h(s)+0.38,1.3,0.85,0.85,chunk(s));
      b.bar('steel',c,b.xyz(s+sign*2.6,side*21.15,h(s)+1.7),0.24,undefined,chunk(s),true);
    }
  }
  // Open approach bents. No pier in either cable-stayed span/navigation channel.
  const piers=[STRUCTURE_START,A,C,C+55,C+110,STRUCTURE_END];
  for(let s=35;s<L-20;s+=48)if(s<STRUCTURE_START-20||s>STRUCTURE_END+20)piers.push(s);
  for(const s of piers) {
    const top=h(s)-2.55;if(top<1)continue;
    for(const d of [-13,13]) {
      b.box('concrete',s,d,0.6,5,5,1.2,chunk(s),0);
      b.box('concrete',s,d,(top+0.6)/2,2.4,2.4,top-0.6,chunk(s),y=>Math.max(0,Math.min(1,y/top)));
    }
    b.box('concrete',s,0,top+0.5,3.5,43.6,1,chunk(s));
  }
  // Floor beams and underside lateral bracing make the blue edge-girder deck read from below.
  for(let s=12;s<L-8;s+=near?8:32)if(h(s)>3) {
    b.box('steel',s,0,h(s)-1.7,0.45,43.1,1.15,chunk(s));
    if(near&&s>A&&s<C)for(const sign of [-1,1])b.beam('steel',[s,-sign*19,h(s)-2.1],[s+8,sign*19,h(s+8)-2.1],0.14,0.22,chunk(s));
  }
  if(near) {
    for(let s=6;s<L-6;s+=2.8)for(const d of [-W+0.45,W-0.45])b.box('rail',s,d,h(s)+1.06,0.12,0.12,0.42,chunk(s));
    // 3 southbound / 4 northbound lanes; paint is fallback only under live HD pavement.
    for(const d of [-13.7,-7,5.4,10.5,15.6])for(let s=3;s<L-4;s+=12)b.box('paint',s,d,h(s)+0.025,3,0.13,0.015,chunk(s));
    for(const d of [-19.8,19.8])ribbon('paint',0,L,d-0.065,d+0.065,0.025,0.015);
    for(let s=30;s<L-20;s+=36) {
      const side=Math.floor(s/36)%2?1:-1,d=side*20.8;
      b.beam('rail',[s,d,h(s)+0.8],[s,d,h(s)+8.5],0.18,0.18,chunk(s));
      b.beam('rail',[s,d,h(s)+8.5],[s,d-side*2.2,h(s)+8.9],0.15,0.15,chunk(s));
      b.box('lamp',s,d-side*2.2,h(s)+8.85,1.2,0.6,0.2,chunk(s));
    }
    // Static blue representation of the real programmable edge-girder lighting panels.
    for(let s=A+3;s<C;s+=4)for(const d of [-W,W])b.box('glow',s,d,h(s)-1.65,2.6,0.08,0.5,chunk(s));
  }
  return b.finish();
}
