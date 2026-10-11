import * as THREE from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE, SPAN, CROWN, DECK, PATH_WIDTH, ARCH_D, ARCH_START, ARCH_END, LENGTH } from './margaret-mcdermott-bridge-profile.js';

// Every component uses the same station/lateral frame as the app's accepted road surface.
export function create({ detail='near' }={}) {
  const near=detail==='near', b=bridgeBuilder({ ...PROFILE, meshStep: near?15:25 },detail), h=PROFILE.deckHeight;
  const chunk=s=>near ? s<ARCH_START ? 0 : s>ARCH_END ? 2 : 1 : 0;
  const bounds=[0,ARCH_START,ARCH_END,LENGTH];
  const bands=[[-55.5,-43.5],[-42,-2],[2,42],[43.5,55.5]];
  // Concrete freeway and frontage decks stay independent of the steel pedestrian arches.
  for(let k=1;k<bounds.length;k++) {
    const a=bounds[k-1],c=bounds[k],ck=chunk((a+c)/2);
    for(const [l,r] of bands) {
      b.strip('concrete',a,c,l-.4,r+.4,-.22,1.1,ck);
      b.strip('asphalt',a,c,l,r,-.17,0,ck);
      for(const d of [l-.2,r+.2]) b.strip('concrete',a,c,d-.18,d+.18,.95,1.12,ck);
      if(near) {
        for(const d of [l+.35,r-.35]) b.strip('paint',a,c,d-.07,d+.07,-.12,0,ck);
        const lanes=(r-l)>20 ? 10 : 3;
        for(let s=Math.ceil(a/12)*12+1;s<c-3;s+=12) for(let lane=1;lane<lanes;lane++) {
          const d=l+(r-l)*lane/lanes;
          b.strip('paint',s,Math.min(s+3,c),d-.065,d+.065,-.115,0,ck);
        }
      }
      // Repeated longitudinal I girders: real underside rhythm, merged by material/chunk.
      for(let d=l+1.5;d<r;d+=near?3.1:12.4) {
        b.strip('girder',Math.max(a,66),Math.min(c,LENGTH-66),d-.14,d+.14,-1.3,1.65,ck);
        if(near)b.strip('girder',Math.max(a,66),Math.min(c,LENGTH-66),d-.5,d+.5,-2.85,.14,ck);
      }
    }
    for(const d of ARCH_D) {
      const l=d-PATH_WIDTH/2,r=d+PATH_WIDTH/2;
      b.strip('arch',a,c,l,r,-.18,.85,ck);
      // A raised 7ft pedestrian strip alongside the cycle lanes.
      b.strip('concrete',a,c,l+.12,l+2.13,.04,.18,ck);
      for(const e of [l+.09,r-.09]) {
        b.strip('rail',a,c,e-.06,e+.06,1.25,.1,ck);
        if(near) b.strip('rail',a,c,e-.035,e+.035,.7,.06,ck);
        for(let s=Math.ceil(a/(near?2.5:20))*(near?2.5:20);s<c;s+=near?2.5:20) b.beam('rail',[s,e,h(s)],[s,e,h(s)+1.23],near?.085:.11,near?.085:.11,ck);
      }
      // White steel edge box, visible below the path on the river span.
      b.strip('arch',Math.max(a,50),Math.min(c,LENGTH-50),l-.15,l+.12,-.42,1.2,ck);
      b.strip('arch',Math.max(a,50),Math.min(c,LENGTH-50),r-.12,r+.15,-.42,1.2,ck);
    }
  }
  // Concrete bents carry the freeway. No central columns beneath the cycle spans.
  for(let s=45;s<LENGTH-35;s+=near?37:74) {
    const y=h(s),ck=chunk(s);
    if(y<4)continue;
    for(const [l,r] of bands) {
      const top=y-2.99,depth=.9;
      b.box('concrete',s,(l+r)/2,top-depth/2,2.2,r-l+1.1,depth,ck);
      for(const d of [l+2.5,r-2.5]) {
        const columnTop=top-depth;
        b.beam('concrete',[s,d,.3],[s,d,columnTop],1.55,1.55,ck, y=>Math.max(0,Math.min(1,y/columnTop)));
        if(near)b.box('concrete',s,d,.3,2.7,2.7,.6,ck,0);
      }
    }
    if(s<ARCH_START-12 || s>ARCH_END+12) for(const d of ARCH_D) {
      b.beam('concrete',[s,d,0],[s,d,y-1.65],1.5,1.5,ck,y=>Math.max(0,Math.min(1,y/(h(s)-1.65))));
      b.box('concrete',s,d,y-1.35,2,PATH_WIDTH,.6,ck);
    }
  }
  // White tapered arch bands with long closed openings in the forked feet.
  // Shape lives in the longitudinal vertical plane, then is transformed into mapped east/south.
  const N=near?128:48, foot=14;
  const outer=t=>[SPAN*t,CROWN*4*t*(1-t)];
  const inner=t=>[foot+(SPAN-2*foot)*t,(CROWN-2.25)*4*t*(1-t)];
  const shape=new THREE.Shape();
  shape.moveTo(...outer(0));
  for(let i=1;i<=N;i++)shape.lineTo(...outer(i/N));
  for(let i=N;i>=0;i--)shape.lineTo(...inner(i/N));
  shape.closePath();
  for(const right of [false,true]) {
    const hole=new THREE.Path(),steps=near?32:14;
    const points=[];
    for(let i=0;i<=steps;i++) {
      const t=.018+.225*i/steps, u=right?1-t:t, a=outer(u),c=inner(u);
      const spread=.30*Math.sin(Math.PI*i/steps)**.45;
      points.push(a.map((v,k)=>v+(c[k]-v)*(.5-spread)));
    }
    for(let i=steps;i>=0;i--) {
      const t=.018+.225*i/steps,u=right?1-t:t,a=outer(u),c=inner(u);
      const spread=.30*Math.sin(Math.PI*i/steps)**.45;
      points.push(a.map((v,k)=>v+(c[k]-v)*(.5+spread)));
    }
    hole.moveTo(...points[0]);points.slice(1).forEach(p=>hole.lineTo(...p));hole.closePath();shape.holes.push(hole);
  }
  for(const d of ARCH_D) {
    const g=new THREE.ExtrudeGeometry(shape,{depth:2.2,bevelEnabled:false,curveSegments:1});
    const p=g.attributes.position;
    for(let i=0;i<p.count;i++) {const q=PROFILE.bridgePoint(ARCH_START+p.getX(i),d+p.getZ(i)-1.1,p.getY(i));p.setXYZ(i,q.x,q.y,q.z);}
    // Ground cap is covered by its concrete footing; omit it to avoid coplanar undersides.
    const keep=[];
    for(let i=0;i<p.count;i+=3) if(![i,i+1,i+2].every(j=>Math.abs(p.getY(j))<1e-5))keep.push(i,i+1,i+2);
    g.setIndex(keep);g.computeVertexNormals();b.put(g,'arch',1,y=>Math.max(0,Math.min(1,y/DECK)));
    for(const s of [ARCH_START,ARCH_END]) b.box('concrete',s,d,.8,17,5.2,1.6,1,0);
    // Paired slightly inclined suspenders connect the arch to both deck-edge anchor plates.
    const pitch=near?8.7:17.4;
    for(let u=22;u<SPAN-21;u+=pitch) {
      const y=(CROWN-1.1)*4*(u/SPAN)*(1-u/SPAN),s=ARCH_START+u;
      for(const sign of [-1,1]) {
        const e=d+sign*(PATH_WIDTH/2-.2);
        b.beam('cable',[s,d+sign*.8,y],[s,e,DECK+.17],near?.075:.13,near?.075:.13,1);
        if(near)b.box('arch',s,e,DECK+.22,.5,.4,.45,1);
      }
    }
  }
  // Freeway luminaires and edge lighting. Retain a few lamps in far for night recognition.
  for(let s=65,i=0;s<LENGTH-40;s+=near?45:180,i++) for(const d of [-42.3,42.3]) {
    const ck=chunk(s),y=h(s),sign=Math.sign(d);
    b.beam('rail',[s,d,y+.9],[s,d,y+10],.16,.16,ck);
    b.beam('rail',[s,d,y+10],[s,d-sign*2.7,y+10.5],.13,.13,ck);
    b.box('lamp',s,d-sign*2.7,y+10.42,1.2,.42,.15,ck);
  }
  return b.finish();
}
