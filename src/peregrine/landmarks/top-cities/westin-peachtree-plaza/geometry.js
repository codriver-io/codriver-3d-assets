import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { Surface, ringPoint, cap, drum, curtain } from './westin-peachtree-plaza-parts.js';

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', bays = near ? 80 : 32, rows = near ? 64 : 32;
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const m = Object.fromEntries(Object.keys(PALETTES.light).map(k => [k, new Surface()]));
  const scale = Math.cos(SPEC.origin[1] * Math.PI / 180) * 111319.49;
  const ring = FOOTPRINTS[0].slice(0, -1).map(([lng, lat]) => [(lng - SPEC.origin[0]) * scale, -(lat - SPEC.origin[1]) * 111319.49]);
  // Entire mapped hotel podium, excluding the garages and the skybridge.
  // Separate wall tiles preserve recessed-window rhythm without overlays.
  ring.forEach(([x,z], i) => {
    const [xx,zz] = ring[(i+1)%ring.length], n=Math.max(1,Math.round(Math.hypot(xx-x,zz-z)/(near?3:6)));
    const point = (t,y) => [x+(xx-x)*t,y,z+(zz-z)*t];
    const tile = (mat,a,c,y0,y1) => mat.quad(point(c,y0),point(c,y1),point(a,y1),point(a,y0));
    const floors=near?6:3, pitch=24/floors;
    for(let j=0;j<n;j++) {
      const a=j/n,c=(j+1)/n, left=a+0.18/n,right=c-0.18/n;
      tile(m.stone,a,left,0,24); tile(m.stone,right,c,0,24);
      for(let k=0;k<floors;k++) {
        const y=k*pitch;
        const sill=k===0?0.3:pitch*0.55;
        tile(m.stone,left,right,y,y+sill);
        tile(k===0?m.elevatorGlass:m.glassShade,left,right,y+sill,y+pitch);
      }
    }
  });
  const shape = new THREE.Shape(ring.map(([x,z])=>new THREE.Vector2(x,-z)));
  const roof = new THREE.ShapeGeometry(shape); roof.rotateX(-Math.PI/2); roof.translate(0,24,0); b.put(roof,'roof');
  const floor = new THREE.ShapeGeometry(shape); floor.rotateX(-Math.PI/2);
  for(let i=0;i<floor.index.count;i+=3) {
    const a=floor.index.getX(i); floor.index.setX(i,floor.index.getX(i+2)); floor.index.setX(i+2,a);
  }
  floor.computeVertexNormals(); b.put(floor,'stone');
  curtain(m, { radius: SPEC.radius, bottom: SPEC.podiumHeight, top: SPEC.restaurantBase, bays, rows });
  // Three-level Sun Dial restaurant drum: shallow projecting sill, panoramic
  // glazing, dark upper frieze and a thin flat cap. No enormous saucer.
  drum(m.frame,19.95,SPEC.restaurantBase,SPEC.restaurantBase+0.7,bays);
  for(let i=0;i<bays;i++) {
    const a=i*Math.PI*2/bays,c=(i+1)*Math.PI*2/bays,p=ringPoint,y=SPEC.restaurantBase;
    m.frame.quad(p(SPEC.radius,a,y),p(SPEC.radius,c,y),p(19.95,c,y),p(19.95,a,y));
    m.roof.quad(p(19.95,a,y+0.7),p(19.95,c,y+0.7),p(19.6,c,y+0.7),p(19.6,a,y+0.7));
  }
  curtain(m,{radius:19.6,bottom:SPEC.restaurantBase+0.7,top:SPEC.restaurantTop,bays,rows:3});
  drum(m.frame,19.95,SPEC.restaurantTop,SPEC.height,bays);
  cap(m.roof,19.95,SPEC.height,bays);
  // Underside of the cap's projecting lip only; not a disk through the tower.
  for(let i=0;i<bays;i++) {
    const a=i*Math.PI*2/bays,c=(i+1)*Math.PI*2/bays,p=ringPoint,y=SPEC.restaurantTop;
    m.frame.quad(p(19.6,a,y),p(19.6,c,y),p(19.95,c,y),p(19.95,a,y));
  }
  const bearing=SPEC.elevatorBearing*Math.PI/180;
  const sx=SPEC.elevatorOffset*Math.sin(bearing),sz=-SPEC.elevatorOffset*Math.cos(bearing);
  curtain(m,{radius:SPEC.elevatorRadius,bottom:24,top:SPEC.height,bays:near?16:8,rows:near?64:32,cx:sx,cz:sz,shaft:true});
  cap(m.roof,SPEC.elevatorRadius,SPEC.height,near?16:8,sx,sz);
  // Low western atrium skylight. Components meet along edges, not shared faces.
  b.box('roof',[-32,24.4,0],[13,0.8,25]);
  b.box('elevatorGlass',[-32,25.1,0],[11.8,0.6,23.8]);
  for(const [name,mesh] of Object.entries(m)) if(mesh.positions.length)b.put(mesh.geometry(),name);
  const root=b.finish();
  root.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift');});
  root.userData.elevationDatum='Rigid hotel grade y=0; no terrain baked in.';
  return root;
}
