import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';

const A = SPEC.planAngleDeg * Math.PI / 180, C = Math.cos(A), S = Math.sin(A);
// u points along the mapped 107.3-degree edge; v points along bearing 197.3.
export const world = ([u, y, v]) => [C * u - S * v, y, S * u + C * v];
const center = SPEC.towerCenter;
const tower = ([u, y, v]) => world([u + center[0], y, v + center[1]]);
const lerp = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const vec = (a) => new THREE.Vector3(...a);

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const batches = new Map();
  const triangle = (mat, a, c, d, twoSided = false) => {
    if (!batches.has(mat)) batches.set(mat, []);
    batches.get(mat).push(...a, ...c, ...d);
    if (twoSided) {
      const n=vec(c).sub(vec(a)).cross(vec(d).sub(vec(a))).normalize().multiplyScalar(-0.18);
      batches.get(mat).push(...vec(d).add(n).toArray(),...vec(c).add(n).toArray(),...vec(a).add(n).toArray());
    }
  };
  const quad = (mat, a, c, d, e) => { triangle(mat, a, c, d); triangle(mat, a, d, e); };
  // Facade surfaces are a partition of panes and joints. No overlay face sits behind a window.
  function facade(a, c, lo, hi, material = 'glass', pitch = 3.65, bay = 2.4, frame = 'trim') {
    const length = Math.hypot(c[0] - a[0], c[1] - a[1]);
    const rows = Math.max(1, Math.round((hi - lo) / pitch)), cols = Math.max(1, Math.round(length / bay));
    const at = (t, y) => tower([a[0] + (c[0] - a[0]) * t, y, a[1] + (c[1] - a[1]) * t]);
    const vgap = (frame === 'stone' ? 0.28 : near ? 0.085 : 0.13) / length;
    // Continuous joints cost two triangles per row/column; panes fill their complementary cells.
    const h = frame === 'stone' ? 0.28 : near ? 0.09 : 0.14;
    for (let j=0;j<=cols;j++) {
      const t=j/cols,t0=Math.max(0,t-vgap),t1=Math.min(1,t+vgap);
      quad(frame,at(t0,lo),at(t0,hi),at(t1,hi),at(t1,lo));
    }
    for (let r=0;r<=rows;r++) {
      const y=lo+(hi-lo)*r/rows;
      quad(frame,at(0,Math.max(lo,y-h)),at(0,Math.min(hi,y+h)),at(1,Math.min(hi,y+h)),at(1,Math.max(lo,y-h)));
    }
    for (let r = 0; r < rows; r++) for (let j = 0; j < cols; j++) {
      const s0 = j / cols, s1 = (j + 1) / cols, t0 = s0 + vgap, t1 = s1 - vgap;
      const y0 = lo + (hi - lo) * r / rows, y1 = lo + (hi - lo) * (r + 1) / rows;
      const hash=Math.sin(r*73.73+j*19.19+a[0]*47.51+a[1]*11.3)*43758.5453;
      const panel = (hash-Math.floor(hash)<0.055 && lo>=8 && lo<122) ? 'occupiedGlass' : material;
      quad(panel, at(t0, y0 + h), at(t0, y1 - h), at(t1, y1 - h), at(t1, y0 + h));
    }
  }
  function cap(ring, y, mat = 'roof', project = tower) {
    const shape = ring.map(([x, z]) => new THREE.Vector2(x, z));
    for (const indices of THREE.ShapeUtils.triangulateShape(shape, [])) {
      const q = indices.map((i) => project([ring[i][0], y, ring[i][1]]));
      if (vec(q[1]).sub(vec(q[0])).cross(vec(q[2]).sub(vec(q[0]))).y < 0) q.reverse();
      triangle(mat, ...q);
    }
  }
  // A folded twelve-edge curtain wall: central face ridges and progressively deeper clipped corners.
  function ring(w, d, cut) {
    return [[-w+cut,-d],[0,-d-0.7],[w-cut,-d],[w,-d+cut],[w+0.6,0],[w,d-cut],
      [w-cut,d],[0,d+0.7],[-w+cut,d],[-w,d-cut],[-w-0.6,0],[-w,-d+cut]];
  }
  const tiers = [[8,67,21.7,24.8,3.5],[67,96,21.3,24.4,8],[96,122,20.8,23.9,12],[122,130,17.2,20.3,10.8]];
  for (const [lo, hi, w, d, cut] of tiers) {
    const r = ring(w,d,cut);
    r.forEach((a,i) => facade(a,r[(i+1)%r.length],lo,hi,i%3===2?'blueGlass':'glass',near?3.65:7.3,near?2.4:4.8));
    cap(r,hi,'roof');
    // Corner setbacks terminate in pointed glass gables rather than pale terrace ledges.
    if(hi<130) for(const i of [2,5,8,11]) {
      const a=r[i],c=r[(i+1)%r.length],tip=[(a[0]+c[0])/2,hi+7,(a[1]+c[1])/2];
      paneTriangle(tower([a[0],hi,a[1]]),tower(tip),tower([c[0],hi,c[1]]),near?4:2,'roof');
    }
  }
  // Recessed glazed lobby and honed limestone gate piers face Congress Avenue.
  const lobby = ring(21.25,24.4,3.5);
  lobby.forEach((a,i)=>facade(a,lobby[(i+1)%lobby.length],0,8,'blueGlass',4,near?2.6:5.2));
  for (const v of [-17,-8,1,10,19,28]) {
    const g = new THREE.CylinderGeometry(0.48,0.48,7.4,near?10:6);
    g.translate(...world([-47.05,3.7,v])); b.put(g,'stone');
  }
  // The OSM envelope includes the low north retail wing and southeast parking podium.
  const localRing = FOOTPRINTS[0].slice(0,-1).map(([lng,lat]) => {
    const x=(lng-SPEC.origin[0])*111319.4908*Math.cos(SPEC.origin[1]*Math.PI/180),z=(SPEC.origin[1]-lat)*111319.4908;
    return [C*x+S*z,-S*x+C*z];
  });
  // One perimeter extrusion avoids double faces at the inside corner of the L-shaped base.
  const podiumH = 7.6;
  localRing.forEach((p,i) => {
    const q=localRing[(i+1)%localRing.length];
    // OSM rings run counterclockwise in east/south; reverse for outward normals.
    facade([q[0]-center[0],q[1]-center[1]],[p[0]-center[0],p[1]-center[1]],0,podiumH,'blueGlass',podiumH,near?3.8:7.6,'stone');
  });
  cap(localRing,podiumH,'stone',world);
  // Tall garage wing, east of the shaft; narrow recessed slots and full-height limestone ribs.
  const garage = [[1.5,-8.2],[55.6,-8.2],[55.6,42.0],[1.5,42.0]];
  // Use facade helper in the tower plan, with no geometry behind the grid.
  garage.forEach((p,i)=>{
    const q=garage[(i+1)%4];
    facade([p[0]-center[0],p[1]-center[1]],[q[0]-center[0],q[1]-center[1]],7.6,23,'blueGlass',near?3.0:6.0,near?1.7:3.4);
  });
  cap(garage,23,'stone',world);
  const plant=new THREE.BoxGeometry(13,2.4,12); plant.rotateY(-A); plant.translate(...world([29,24.2,17]));b.put(plant,'roof');

  // Four folded, pointed crown sails. Gaps between their rising edges reveal a small louvered core.
  // Each sail has a central ridge, two cyan facets, and an integrated silver lattice.
  function paneTriangle(a,c,d,n,glass='light') {
    const point=(i,j)=>a.map((v,k)=>v+(c[k]-v)*i/n+(d[k]-v)*j/n);
    function cell(p,q,r) {
      const mid=p.map((v,k)=>(v+q[k]+r[k])/3);
      const inset=[p,q,r].map(v=>lerp(v,mid,near?0.055:0.07));
      triangle(glass,...inset,true);
      [p,q,r].forEach((v,k)=>{
        const next=[p,q,r][(k+1)%3], inside=inset[k], inext=inset[(k+1)%3];
        triangle('trim',v,next,inext,true);triangle('trim',v,inext,inside,true);
      });
    }
    const inward=vec(c).sub(vec(a)).cross(vec(d).sub(vec(a))).normalize().multiplyScalar(-0.18);
    const outline=[a,c,d];
    for(let k=0;k<3;k++) {
      const p=outline[k],q=outline[(k+1)%3];
      quad('trim',q,p,vec(p).add(inward).toArray(),vec(q).add(inward).toArray());
    }
    for(let i=0;i<n;i++)for(let j=0;j<n-i;j++) {
      cell(point(i,j),point(i+1,j),point(i,j+1));
      if(i+j<n-1)cell(point(i+1,j),point(i+1,j+1),point(i,j+1));
    }
  }
  const rotate=([x,y,z],k)=>{for(let i=0;i<k;i++)[x,z]=[-z,x];return [x,y,z];};
  for(let k=0;k<4;k++) {
    const p=rotate([-7.3,130,-13.2],k), q=rotate([0,130,-20.5],k), r=rotate([7.3,130,-13.2],k), apex=rotate([0,156,-10.5],k);
    paneTriangle(tower(p),tower(apex),tower(q),near?8:4);
    paneTriangle(tower(q),tower(apex),tower(r),near?8:4);
    // Lightning terminal seated on each crown tip, 1 m high, not a fictitious central mast.
    b.bar('trim',tower(apex),tower([apex[0],157,apex[2]]),0.13,0.13);
  }
  const core=ring(6,6,2);
  core.forEach((p,i)=>facade(p,core[(i+1)%core.length],130,134,'roof',near?1.5:3,near?3:6));cap(core,134);
  // Frost's geometric rosette: sixteen curved-looking tapered petals, not a texture or wordmark.
  for(let k=0;k<4;k++) {
    const position=(x,y,depth)=>tower(rotate([x,y,-20.65-depth],k));
    for(let petal=0;petal<16;petal++) {
      const a=petal*Math.PI/8,delta=0.19;
      const xy=(r,t)=>[Math.sin(t)*r,126+Math.cos(t)*r];
      const q=[xy(1.35,a),xy(2.9,a+0.11),xy(3.15,a+0.3),xy(2.15,a+delta)];
      // All petals are >15 cm proud of the facade, on one material rank only.
      const points=q.map(([x,y])=>position(x,y,0.22));
      const normal=vec(points[1]).sub(vec(points[0])).cross(vec(points[2]).sub(vec(points[0])));
      const outward=vec(tower(rotate([0,0,-1],k))).sub(vec(tower([0,0,0])));
      if(normal.dot(outward)<0)points.reverse();
      quad('sign',...points);
    }
  }
  for (const [material,positions] of batches) {
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.computeVertexNormals();b.put(mergeVertices(geometry),material);
  }
  const model=b.finish();
  model.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift');});
  return model;
}
