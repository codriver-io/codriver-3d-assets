import * as THREE from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p, STRUCTURE_START as A, STRUCTURE_END as Z, DECK_H as H, PIVOT_S, deckEdges } from './pont-de-la-fonderie-profile.js';

/** Original plate-girder swing bridge. Station runs NW → SE; all geometry is in mapped metres. */
export function create({detail='near'}={}) {
  const near=detail==='near', b=bridgeBuilder(p,detail), xyz=b.xyz;
  const point=(s,d,y)=>new THREE.Vector3(...xyz(s,d,y));
  function beam(mat,a,z,w,depth=w,lift=1) {
    const v=point(...a),q=point(...z),axis=q.clone().sub(v),len=axis.length(); if(len<.001)return;
    axis.divideScalar(len);
    let across=new THREE.Vector3().crossVectors(axis,new THREE.Vector3(0,1,0));
    if(across.lengthSq()<1e-8){const f=p.bridgePoint(a[0]);across.set(-f.tz,0,f.tx);}else across.normalize();
    const up=new THREE.Vector3().crossVectors(across,axis).normalize();
    const g=new THREE.BoxGeometry(len,depth,w);
    g.applyMatrix4(new THREE.Matrix4().makeBasis(axis,up,across).setPosition(v.add(q).multiplyScalar(.5)));
    b.put(g,mat,0,lift);
  }
  function cylinder(mat,s,d,y,r0,r1,height,n=near?20:10,lift=1) {
    const g=new THREE.CylinderGeometry(r1,r0,height,n);g.translate(...xyz(s,d,y+height/2));b.put(g,mat,0,lift);
  }
  // Closed loft with explicit end faces. The shared strip intentionally has open caps.
  function ribbonPoint(s,d,y) {
    // The structural end sections use the span tangent; approaches share those caps.
    if(Math.abs(s-A)<1e-6||Math.abs(s-Z)<1e-6){const q=p.bridgePoint(s),f=p.bridgePoint(Math.abs(s-A)<1e-6?A+.001:Z-.001);return [q.x-f.tz*d,y,q.z+f.tx*d];}
    const at=p.ALIGNMENT.findIndex(q=>Math.abs(q.s-s)<1e-6);
    if(at<=0||at>=p.ALIGNMENT.length-1)return xyz(s,d,y);
    const a=p.ALIGNMENT[at-1],q=p.ALIGNMENT[at],z=p.ALIGNMENT[at+1];
    const u=new THREE.Vector2(q.x-a.x,q.z-a.z).normalize(),v=new THREE.Vector2(z.x-q.x,z.z-q.z).normalize();
    const n=new THREE.Vector2(-u.y-v.y,u.x+v.x).normalize(),den=n.dot(new THREE.Vector2(-u.y,u.x));
    return [q.x+n.x*d/den,y,q.z+n.y*d/den];
  }
  function ribbon(mat,a,z,left,right,top,thick,lift=1,step=near?1:2) {
    const cuts=new Set([a,z]);for(let s=a+step;s<z;s+=step)cuts.add(s);
    for(const q of p.ALIGNMENT)if(q.s>a&&q.s<z)cuts.add(q.s);
    const stations=[...cuts].sort((a,b)=>a-b),vertices=[],indices=[];
    const val=(f,s)=>typeof f==='function'?f(s):f;
    for(const s of stations){const y=val(top,s),l=val(left,s),r=val(right,s),depth=val(thick,s);for(const [d,h] of [[l,y],[r,y],[l,y-depth],[r,y-depth]])vertices.push(...ribbonPoint(s,d,h));}
    for(let i=1;i<stations.length;i++){const x=(i-1)*4,y=i*4;indices.push(x,x+1,y,x+1,y+1,y,x+2,y+2,x+3,x+3,y+2,y+3,x,y,x+2,x+2,y,y+2,x+1,x+3,y+1,x+3,y+3,y+1);}
    const e=(stations.length-1)*4;indices.push(0,2,1,1,2,3,e,e+1,e+2,e+1,e+3,e+2);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();b.put(g,mat,0,lift);
  }
  const edge=(side,s)=>deckEdges(s)[side];
  // Fallback two-lane asphalt; OSM lane_markings=no. Runtime HD remains authoritative.
  ribbon('asphalt',A,Z,-3,3,H,.045);
  ribbon('iron',A+.03,Z-.03,s=>edge(0,s),s=>edge(1,s),H-.07,.28);
  for(const side of [0,1]) {
    const outer=s=>edge(side,s),inner=side===0?-3:3;
    ribbon('concrete',A+.03,Z-.03,side===0?outer:inner,side===0?inner:outer,H+.15,.18);
    ribbon('concrete',A+.03,Z-.03,side===0?-3.13:3,side===0?-3:3.13,H+.22,.25);
    // Solid riveted side webs with lower counterweight tail and stepped main side.
    const webD=s=>outer(s)+(side===0?.14:-.14);
    const top=s=>H+(s<A+3.1?.64:1.55),low=H-.49;
    for(const [a,z,high] of [[A+.04,A+3.1,H+.64],[A+3.1,Z-.04,H+1.55]]) {
      ribbon('steel',a,z,s=>webD(s)-.045,s=>webD(s)+.045,high,high-low);
      if(a>A+3)ribbon('edge',a,z,s=>webD(s)-.18,s=>webD(s)+.18,high+.055,.11);
    }
    // Dark end plates and a deeper cap identify the short counterweight tail.
    ribbon('iron',A+.04,A+3.1,s=>webD(s)-.19,s=>webD(s)+.19,H+.72,.16);
    b.box('iron',A+.12,webD(A+.12),(H+.64+low)/2,.24,.35,H+.64-low);
    ribbon('edge',A+.04,Z-.04,s=>webD(s)-.16,s=>webD(s)+.16,low+.065,.185);
    const N=near?17:9;
    for(let i=0;i<=N;i++) {
      const s=A+.12+(Z-A-.24)*i/N,high=top(s);
      for(const sign of [-1,1]) {
        b.box('edge',s,webD(s)+sign*.095,(high+low)/2,.075,.16,high-low-.06);
        if(near)for(let y=low+.14;y<high-.08;y+=.16) {
          // Closed hexagonal rivet heads along the angle straps, no image decals.
          const g=new THREE.CylinderGeometry(.018,.018,.026,6);
          const q=p.bridgePoint(s);g.rotateX(Math.PI/2);g.rotateY(-Math.atan2(q.tz,q.tx));
          g.translate(...xyz(s,webD(s)+sign*.185,y));b.put(g,'steel');
        }
      }
    }
    const railStart=A+3.2,railEnd=Z-.12;
    beam('rail',[railStart,webD(railStart),H+1.97],[railEnd,webD(railEnd),H+1.97],.07,.07);
    for(let i=0;i<= (near?12:6);i++){const s=railStart+(railEnd-railStart)*i/(near?12:6);beam('rail',[s,webD(s),H+1.55],[s,webD(s),H+1.97],.06);}
  }
  // Floorbeam grid, longitudinal stringers and open X wind bracing.
  const ns=near?10:5;
  for(let i=0;i<=ns;i++) {
    const s=A+.25+(Z-A-.5)*i/ns,[l,r]=deckEdges(s);
    beam('iron',[s,l+.13,H-.43],[s,r-.13,H-.43],.14,.24);
    if(i<ns){const z=A+.25+(Z-A-.5)*(i+1)/ns;beam('iron',[s,l+.23,H-.59],[z,deckEdges(z)[1]-.23,H-.59],.065,.065);beam('iron',[s,r-.23,H-.59],[z,deckEdges(z)[0]+.23,H-.59],.065,.065);}
  }
  for(const d of [-2,0,2])beam('iron',[A+.05,d,H-.40],[Z-.05,d,H-.40],.10,.24);
  // Concrete counterweight enclosed in low NW tail; turntable touches the floor structure.
  b.box('concrete',A+1.55,-.12,H-.59,2.8,7.7,.45);
  // Quay walls and the slewing drum stand on the canal banks below the flush deck: fixed at their
  // foot (weight 0), following the deck at their head.
  const FOOT=H-2.6,grip=y=>Math.max(0,Math.min(1,(y-FOOT)/(H-.66-FOOT)));
  cylinder('stone',PIVOT_S,-.08,FOOT,2.75,2.75,H-.96-FOOT,near?24:12,grip);
  cylinder('iron',PIVOT_S,-.08,H-.96,3.85,3.85,.35,near?32:16);
  cylinder('iron',PIVOT_S,-.08,H-.61,.42,.42,.28);
  // Bank-side foundations only: no pier obstructs the navigable channel.
  for(const [a,z] of [[A+.03,A+9.35],[Z-.88,Z-.03]]) {
    if(a<A+1) {
      // Two bank wings expose the circular slewing assembly in the middle.
      ribbon('stone',a,z,s=>edge(0,s)+.18,-3.15,H-1.05,H-1.05-FOOT,grip);
      ribbon('stone',a,z,3.15,s=>edge(1,s)-.18,H-1.05,H-1.05-FOOT,grip);
    } else ribbon('stone',a,z,s=>edge(0,s)+.18,s=>edge(1,s)-.18,H-.70,H-.70-FOOT,grip);
    if(near)for(let y=FOOT+.24;y<(a<A+1?H-1.10:H-.75);y+=.3)for(const side of [0,1]) {
      const dd=s=>edge(side,s)+(side===0?.16:-.16);
      beam('stone',[a,dd(a),y],[z,dd(z),y],.045,.04,grip);
    }
  }
  for(const d of [-3.8,3.8])b.box('iron',Z-.48,d,H-.585,.7,.6,.23);
  // Compact road-side safety housings/posts; no barriers across the lanes.
  for(const [s,d] of [[A+.65,-3.65],[Z-.7,3.7]]) {
    b.box('iron',s,d,H+.35,.32,.30,.7);
    beam('iron',[s,d,H+.65],[s,d,H+1.85],.075);
    b.box('iron',s,d,H+1.6,.22,.18,.36);
  }
  return b.finish();
}
