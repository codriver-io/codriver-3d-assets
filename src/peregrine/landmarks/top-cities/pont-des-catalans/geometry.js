import { Shape, Path, ShapeGeometry, ExtrudeGeometry, BufferGeometry, Float32BufferAttribute } from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p, ARCHES, PIER_S, RIB_CENTRES, RIB_WIDTH, STRUCTURE_START as A, STRUCTURE_END as Z } from './pont-des-catalans-profile.js';

export const SPRING = 3.6, RISE = 9.75, RING = 1.05;
export const OCULUS_Y = 9.75, OCULUS_R = 2.15, OCULUS_BASE = 8.2;
const archPoint = (arch,t,offset=0) => [arch.mid - arch.span/2*Math.cos(t), SPRING + RISE*Math.sin(t) + offset];

/** Original masonry/RC construction, in the shared OSM station/lateral frame. */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = bridgeBuilder({ ...p, meshStep: near ? 2 : 5 },detail), L=p.BRIDGE_LENGTH;
  const chunk = s => near && s > L/2 ? 1 : 0;
  // Shape local X is station, local Y is up, extrusion Z is lateral.
  const extrude = (shape,mat,d,width,ck=0,lift=1) => {
    const g=new ExtrudeGeometry(shape,{depth:width,bevelEnabled:false,curveSegments:near?24:10,steps:1});
    const pos=g.attributes.position;
    for(let i=0;i<pos.count;i++) pos.setXYZ(i,...b.xyz(pos.getX(i),d+pos.getZ(i),pos.getY(i)));
    g.computeVertexNormals(); g.deleteAttribute('uv');
    const indexed=mergeVertices(g,0.0001);g.dispose();b.put(indexed,mat,ck,lift);
  };
  // Exterior ornament is a single face: no buried back face or coplanar
  // extrusion caps, and no hidden volume for each tiny masonry joint.
  const face = (shape,mat,d,side,ck=0,lift=1) => {
    const g=new ShapeGeometry(shape,near?16:8),pos=g.attributes.position;
    for(let i=0;i<pos.count;i++)pos.setXYZ(i,...b.xyz(pos.getX(i),d,pos.getY(i)));
    if(side<0)for(let i=0;i<g.index.count;i+=3){const a=g.index.getX(i);g.index.setX(i,g.index.getX(i+2));g.index.setX(i+2,a);}
    g.computeVertexNormals();b.put(g,mat,ck,lift);
  };
  // Vertical jambs under a semicircular crown, rather than a full round eye.
  const opening = (s,r=OCULUS_R,base=OCULUS_BASE) => {
    const q=new Path();q.moveTo(s-r,base);q.lineTo(s+r,base);q.lineTo(s+r,OCULUS_Y);
    q.absarc(s,OCULUS_Y,r,0,Math.PI,false);q.lineTo(s-r,base);q.closePath();return q;
  };
  const polygon = pts => { const shape=new Shape(); shape.moveTo(...pts[0]); for(const q of pts.slice(1))shape.lineTo(...q); shape.closePath(); return shape; };
  const samples = near ? 36 : 18;
  const ringShape = (arch,width=RING) => polygon([
    ...Array.from({length:samples+1},(_,i)=>archPoint(arch,Math.PI*i/samples)),
    ...Array.from({length:samples+1},(_,i)=>archPoint(arch,Math.PI*(samples-i)/samples,width)),
  ]);
  const weight = y => Math.max(0,Math.min(1,(y-SPRING)/(16-SPRING)));

  // Twin parallel barrel arches. The 9.90 m gap stays genuinely open below the slab.
  for(const d of RIB_CENTRES) {
    for(const arch of ARCHES) {
      extrude(ringShape(arch),'stone',d-RIB_WIDTH/2,RIB_WIDTH,chunk(arch.mid),weight);
      for(const side of [-1,1]) {
        const edge=d+side*RIB_WIDTH/2;
        face(ringShape(arch),'voussoir',edge+side*0.08,side,chunk(arch.mid),weight);
        if(side===Math.sign(d)) {
          // A narrow warm wash at the intrados represents the photographed
          // floodlit arches at night, without shipping a lighting texture.
          const wash=polygon([
            ...Array.from({length:samples+1},(_,i)=>archPoint(arch,Math.PI*i/samples,0.05)),
            ...Array.from({length:samples+1},(_,i)=>archPoint(arch,Math.PI*(samples-i)/samples,0.17)),
          ]);
          face(wash,'glow',edge+side*0.24,side,chunk(arch.mid),weight);
        }
        // Radial voussoir joints, solid geometry outside the face, never coplanar.
        if(near) for(let k=1;k<48;k++) {
          const t=Math.PI*k/48,eps=0.0025;
          face(polygon([archPoint(arch,t-eps),archPoint(arch,t+eps),archPoint(arch,t+eps,RING),archPoint(arch,t-eps,RING)]),'stone',edge+side*0.16,side,chunk(arch.mid),weight);
        }
      }
    }
    // One perforated spandrel body: its lower boundary follows all five arches.
    const bottom=[[A,SPRING+RING]];
    for(const arch of ARCHES) for(let i=0;i<=samples;i++)bottom.push(archPoint(arch,Math.PI*i/samples,RING));
    bottom.push([Z,SPRING+RING]);
    const wall=polygon([...bottom,[Z,14.48],[A,14.48]]);
    for(const s of PIER_S)wall.holes.push(opening(s));
    extrude(wall,'brick',d-RIB_WIDTH/2,RIB_WIDTH,0,weight);
    // Clipped horizontal masonry courses on the visible spandrel faces. Leave
    // both the main arches and the circular relief openings unobstructed.
    if(near) for(let y=5.0;y<14.55;y+=0.32) {
      const blocked=[];
      for(const arch of ARCHES) {
        const t=(y-SPRING-RING)/RISE;
        if(t<1) { const w=arch.span/2*Math.sqrt(Math.max(0,1-t*t)); blocked.push([arch.mid-w-0.08,arch.mid+w+0.08]); }
      }
      for(const s of PIER_S) if(y>OCULUS_BASE-0.15&&y<OCULUS_Y+OCULUS_R+0.55) {
        const w=y<=OCULUS_Y?OCULUS_R+0.55:Math.sqrt((OCULUS_R+0.55)**2-(y-OCULUS_Y)**2); blocked.push([s-w,s+w]);
      }
      blocked.sort((a,b)=>a[0]-b[0]); let cursor=A;
      const course=(a,z)=>{if(z-a<0.2)return;for(const side of [-1,1])face(polygon([[a,y-0.008],[z,y-0.008],[z,y+0.008],[a,y+0.008]]),'stone',d+side*(RIB_WIDTH/2+0.065),side,chunk((a+z)/2),weight);};
      for(const [a,z] of blocked) {course(cursor,a);cursor=Math.max(cursor,z);}course(cursor,Z);
    }
    // A thin white semicircular arch band with jambs and a level sill.
    for(const s of PIER_S) for(const side of [-1,1]) {
      const outer=opening(s,OCULUS_R+0.38,OCULUS_BASE-0.14);
      const sh=new Shape(outer.getPoints(near?16:8));sh.holes.push(opening(s));
      face(sh,'voussoir',d+side*(RIB_WIDTH/2+0.08),side,chunk(s),weight);
      b.box('voussoir',s,d+side*(RIB_WIDTH/2+0.10),OCULUS_Y+OCULUS_R+0.18,0.48,0.28,0.42,chunk(s),weight);
    }
  }

  // Flared, pointed cutwaters with recessed rusticated horizontal courses.
  const sideIndex=(d,n)=>d>0?n/4:3*n/4;
  function pier(s,d) {
    const n=near?16:8, rings=[];
    const levels=[{y:0,w:1.08},{y:0.25,w:1.08}];
    const courses=near?8:2,step=3.5/courses;
    for(let i=0;i<courses;i++) {
      const y=0.25+i*step;
      levels.push({y:y+0.06,w:0.97},{y:y+0.13,w:1},{y:y+step,w:1});
    }
    // Broad flared footing, recessed course joints, and a projecting capital.
    levels.push({y:4.0,w:0.84},{y:4.16,w:0.95},{y:4.5,w:0.95},{y:4.65,w:0.84});
    for(const {y,w} of levels) {
      const along=(4.45-y*0.24)*w,across=(3.25-y*0.24)*w;
      const ring=Array.from({length:n},(_,i)=>{
        const t=2*Math.PI*i/n;
        // Point the river-facing end into a stone starling/cutwater.
        const u=along*Math.cos(t),v=across*Math.sin(t);
        return b.xyz(s+u,d+v,y);
      });
      ring[sideIndex(d,n)]=b.xyz(s,d+Math.sign(d)*(across+0.6),y);
      rings.push(ring);
    }
    const pos=rings.flat(2),ix=[];
    for(let k=0;k<rings.length-1;k++)for(let i=0;i<n;i++) { const j=(i+1)%n,a=k*n+i,c=k*n+j,u=a+n,v=c+n;ix.push(a,u,c,c,u,v); }
    for(let i=1;i<n-1;i++)ix.push((rings.length-1)*n,(rings.length-1)*n+i+1,(rings.length-1)*n+i);
    const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setIndex(ix);g.computeVertexNormals();b.put(g,'stone',chunk(s),y=>Math.max(0,Math.min(1,y/16)));

  }
  for(const s of PIER_S)for(const d of RIB_CENTRES)pier(s,d);
  // End abutments contact the first/last springing and keep the banks out of the arches.
  for(const [a,z] of [[A,ARCHES[0].start],[ARCHES.at(-1).end,Z]]) {
    const s=(a+z)/2;
    for(const d of RIB_CENTRES)b.box('stone',s,d,2.35,z-a,4.6,4.7,chunk(s),y=>y/16);
  }

  // Deck structure ends at the real abutments. Approach surfaces share the same profile.
  const strip=(mat,a,z,l,r,off,t=0)=>{
    for(const [u,v] of a<L/2&&z>L/2?[[a,L/2],[L/2,z]]:[[a,z]])b.strip(mat,u,v,l,r,off,t,chunk((u+v)/2));
  };
  strip('concrete',A,Z,-11.25,11.25,-0.2,1.39);
  // Flat-map approach embankments meet the deck and grade continuously. Their
  // tops carry deck attachment weights; their feet remain on local grade.
  for(const [a,z] of [[0,A],[Z,L]]) {
    const pos=[],ix=[],n=Math.ceil((z-a)/(near?3:6));
    for(let i=0;i<=n;i++) {
      const s=a+(z-a)*i/n,top=Math.max(0.01,p.deckHeight(s)-0.2);
      for(const [d,y] of [[-11.17,top],[11.17,top],[-11.17,0],[11.17,0]])pos.push(...b.xyz(s,d,y));
      if(i){const u=(i-1)*4,v=i*4;ix.push(u,u+1,v,u+1,v+1,v,u,v,u+2,u+2,v,v+2,u+1,u+3,v+1,u+3,v+3,v+1);}
    }
    ix.push(0,2,1,1,2,3,n*4,n*4+1,n*4+2,n*4+1,n*4+3,n*4+2);
    const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setIndex(ix);g.computeVertexNormals();b.put(g,'stone',chunk((a+z)/2),y=>y>0.005?1:0);
  }
  strip('asphalt',0,L,-7,7,0);
  for(const side of [-1,1]) {
    const edge=side*11.25;
    strip('concrete',0,L,side<0?edge:7,side<0?-7:edge,0.2,0.4);
    // Cornice and open green cast-iron railing, with three horizontal members.
    strip('voussoir',A,Z,edge-0.13,edge+0.13,-0.16,0.42);
    for(const h of near?[0.38,0.78,1.35]:[0.38,1.35])strip('iron',A,Z,edge-0.16,edge-0.04,h,0.12);
    const step=near?0.85:5.1;
    for(let s=A;s<=Z;s+=step) {
      if(near)b.box('iron',s,edge-0.1,p.deckHeight(s)+0.79,0.08,0.1,1.12,chunk(s));
      else for(const facing of [-1,1])face(polygon([[s-0.04,p.deckHeight(s)+0.23],[s+0.04,p.deckHeight(s)+0.23],[s+0.04,p.deckHeight(s)+1.35],[s-0.04,p.deckHeight(s)+1.35]]),'iron',edge-0.1,facing,0);
    }
    for(let s=A+1;s<Z;s+=near?4.25:12.75)b.box('iron',s,edge-0.1,p.deckHeight(s)+0.82,0.18,0.2,1.22,chunk(s));
    // Cantilever brackets below the enlarged sidewalks.
    for(let s=A+2;s<Z-2;s+=near?3.3:9.9) {
      b.beam('iron',[s,side*8.25,p.deckHeight(s)-1.68],[s,side*10.95,p.deckHeight(s)-0.48],near?0.28:0.36,0.40,chunk(s));
      b.box('iron',s,side*9.72,p.deckHeight(s)-0.45,0.30,2.6,0.22,chunk(s));
    }
  }
  if(near)for(let s=A+2;s<Z;s+=4.3)b.box('concrete',s,0,p.deckHeight(s)-1.4,0.35,16.4,0.6,chunk(s));
  // Fallback markings are replaced with the provider's actual pavement/paint when available.
  for(const d of [-6.8,0,6.8])strip('paint',0,L,d-0.065,d+0.065,0.04);
  if(near)for(let s=3;s<L-3;s+=12)for(const d of [-3.5,3.5])strip('paint',s,s+3,d-0.065,d+0.065,0.04);

  // Double-headed historic candelabra. Kept at equal height in both LODs.
  for(let s=A+15;s<Z-10;s+=28)for(const side of [-1,1]) {
    const d=side*10.55,h=p.deckHeight(s),ck=chunk(s);
    b.box('iron',s,d,h+0.5,0.45,0.45,0.6,ck);
    b.beam('iron',[s,d,h+0.8],[s,d,h+5.3],0.17,0.17,ck);
    b.beam('iron',[s-0.85,d,h+5.15],[s+0.85,d,h+5.15],0.12,0.12,ck);
    for(const u of [-0.85,0.85]) {
      b.box('lamp',s+u,d,h+5.45,0.36,0.36,0.45,ck);
      b.box('iron',s+u,d,h+5.75,0.45,0.45,0.15,ck);
      if(near)b.box('iron',s+u,d,h+5.1,0.46,0.46,0.12,ck);
    }
  }
  const model=b.finish();
  // At a curved approach node, a carriageway edge can project onto the next
  // centreline segment. Evaluate fallback pavement/paint at its actual XY so
  // navigation and mesh vertices agree there as well as on the straight deck.
  for(const mesh of model.children) {
    const mat=mesh.material.name;
    if(mat!=='asphalt'&&mat!=='paint')continue;
    const pos=mesh.geometry.attributes.position;
    for(let i=0;i<pos.count;i++) {
      const s=p.projectBridge(pos.getX(i),pos.getZ(i)).s;
      pos.setY(i,p.deckHeight(s)+(mat==='paint'?0.04:0));
    }
    mesh.geometry.computeVertexNormals();mesh.geometry.computeBoundingBox();mesh.geometry.computeBoundingSphere();
  }
  return model;
}
