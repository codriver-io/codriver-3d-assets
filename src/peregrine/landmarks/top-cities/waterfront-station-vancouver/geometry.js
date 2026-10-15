import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, ANGLE } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { stationKit } from './waterfront-station-vancouver-parts.js';

// Facade frame: u toward Seymour Street, v toward Cordova. Ten giant-order
// freestanding shafts; the end bays use attached white pilasters.
export const COLUMN_U = Array.from({ length: 10 }, (_, i) => -24.2 + i * 5.7);
export const COLUMN_V = 32.0;
export const localPoint = (u, y, v) => [u * Math.cos(ANGLE) - v * Math.sin(ANGLE), y, u * Math.sin(ANGLE) + v * Math.cos(ANGLE)];

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const k = stationKit(b, near), { box, wall, cap, cylinder } = k;
  const bay = (u, y0, y1, w, arch = false) => ({ u, y0, y1, w, arch });
  const centers = (a, z, n) => Array.from({ length: n }, (_, i) => a + (i + .5) * (z - a) / n);
  // The original footprint has a straight street frontage and an oblique rail
  // frontage. Keep the latter taper rather than using a rectangular station box.
  const outline = [[-56.5,29.5],[-31.5,29.5],[-31.5,31.9],[36.3,31.9],[36.3,29.5],[60.7,29.5],[60.7,8.8],[49.7,8.8],[40.6,-11.0],[-56.5,9.6]];
  cap('base', outline, 0, .8);
  // Seat the roof against the inner face of the projecting attic wall.
  const roofOutline=outline.map(([u,v])=>[u,v===31.9?30.5:v]);
  cap('roof', roofOutline, 20.45, 20.65);

  // Street facade wings: round-headed entrance glazing, mezzanine and attic.
  // Windows are punched openings, retained as separate bays in both LODs.
  for (const [a,z] of [[-56.5,-31.5],[36.3,60.7]]) {
    const cs = centers(a,z,4);
    const lower = cs.flatMap(u => [bay(u,1.1,8.5,3.5,true),bay(u,10.1,13.25,2.8)]);
    wall([a,29.5],[z,29.5],.8,14.1,lower,'brick');
    box('stone',a,z,14.1,15.5,29.0,30.0);
    wall([a,29.5],[z,29.5],15.5,20.45,cs.map(u => bay(u,16.5,19.55,2.7)),'brick');
    box('stone',a,z,20.45,20.95,28.85,30.15);
    box('stone',a,z,20.95,21.25,28.65,30.35);
    if (near) for (const u of cs) {
      box('stone',u-1.6,u+1.6,19.55,19.85,29.5,29.85);
      box('stone',u-1.55,u+1.55,9.65,9.9,29.5,29.8);
      k.archTrim(u,1.1,8.5,3.5,29.5);
    }
  }
  const cs = centers(-29.5,34.3,11);
  wall([-31.5,27.5],[36.3,27.5],.8,14.1,
    cs.flatMap(u => [bay(u,1.1,8.6,3.4,true),bay(u,10.1,13.2,2.65)]),'brick');
  // Close the recessed loggia. Columns and projecting entablature leave a
  // genuinely open 3.5 m deep screen above a rigid continuous plinth.
  wall([-31.5,29.5],[-31.5,27.5],.8,14.1,[],'brick',true);
  wall([36.3,27.5],[36.3,29.5],.8,14.1,[],'brick',true);
  box('stone',-31.5,36.3,14.1,14.65,27.5,33.05);
  box('stone',-31.8,36.6,14.65,15.35,27.5,33.3);
  box('stone',-32.0,36.8,15.35,15.7,27.5,33.5);
  wall([-31.5,31.3],[36.3,31.3],15.7,21.25,
    cs.map(u => bay(u,17.0,20.1,2.7)),'brick');
  box('stone',-31.5,36.3,15.7,16.05,31.3,31.65);
  box('stone',-31.8,36.6,21.25,21.65,30.8,31.8);
  box('stone',-32.0,36.8,21.65,22.0,30.6,32.0);
  box('stone',-12.0,16.8,22.0,22.65,30.8,31.8);
  box('stone',-12.2,17.0,22.65,23.0,30.6,32.0);
  // Attached end pilasters, distinct from the ten freestanding Ionic shafts.
  for (const u of [-30.6,35.4]) {
    box('stone',u-.68,u+.68,.8,13.45,27.3,32.6);
    box('stone',u-.95,u+.95,13.45,14.1,27.3,32.95);
  }
  for (const u of COLUMN_U) {
    box('stone',u-1.0,u+1.0,.8,1.15,COLUMN_V-1.0,COLUMN_V+1.0);
    k.column(u,COLUMN_V);
    // Paired Ionic volutes survive in far too.
    for (const du of [-.63,.63]) cylinder('stone',u+du,13.65,COLUMN_V+.12,.29,.30,near?10:6,'z');
    box('stone',u-.98,u+.98,13.9,14.1,COLUMN_V-.95,COLUMN_V+.95);
  }
  for (const [v0,v1,h] of [[32.9,33.12,.22],[32.6,32.9,.44],[31.8,32.6,.65]])
    box('base',-31.3,36.1,0,h,v0,v1);
  if (near) {
    for (let u=-31;u<36;u+=1.08) box('stone',u,u+.38,20.94,21.25,31.3,31.75);
    for (const u of cs) box('stone',u-1.6,u+1.6,20.1,20.36,31.3,31.6);
  }

  // End and rail facades follow the tapered outline; far keeps their bay grid.
  for (const [a,z,n] of [[[-56.5,9.6],[-56.5,29.5],3],[[60.7,29.5],[60.7,8.8],3],[[60.7,8.8],[49.7,8.8],1],[[49.7,8.8],[40.6,-11],3],[[40.6,-11],[-56.5,9.6],15]]) {
    const len=Math.hypot(z[0]-a[0],z[1]-a[1]);
    const holes=centers(0,len,n).flatMap(s => [bay(s,2.0,6.7,2.6),bay(s,10.1,13.3,2.6),bay(s,16.3,19.4,2.6)]);
    wall(a,z,.8,14.1,holes.filter(h=>h.y1<14.1),'brick',true);
    wall(a,z,15.05,20.45,holes.filter(h=>h.y0>15.05),'brick',true);
    k.edgeBox('stone',a,z,14.1,15.05,.8);
    k.edgeBox('stone',a,z,20.45,21.05,1.1);
  }
  // Low rooflights are seated on the existing flat roof.
  for (const u of [-20,3,26]) {
    box('base',u-6,u+6,20.65,20.95,11,15);
    box('glass',u-5.8,u+5.8,20.95,21.2,11.2,14.8);
  }
  // Attached rear circulation/canopy, OSM 208599561. All mapped perimeter
  // corners have grounded posts; continuous glazing supports the roof edge.
  const c=Math.cos(SPEC.origin[1]*Math.PI/180), ca=Math.cos(ANGLE),sa=Math.sin(ANGLE);
  const annex=FOOTPRINTS[1].slice(0,-1).map(([lng,lat])=>{
    const x=(lng-SPEC.origin[0])*111320*c,z=(SPEC.origin[1]-lat)*111320;
    return [x*ca+z*sa,-x*sa+z*ca];
  });
  cap('base',annex,0,.35);
  cap('roof',annex,6.35,6.7);
  for (let i=0;i<annex.length;i++) {
    const a=annex[i],z=annex[(i+1)%annex.length],len=Math.hypot(z[0]-a[0],z[1]-a[1]);
    k.edgeBox('glass',a,z,.35,6.35,.22,true);
    box('metal',a[0]-.18,a[0]+.18,.35,6.35,a[1]-.18,a[1]+.18);
    if (near) for(let d=3;d<len-1;d+=3) {
      const u=a[0]+(z[0]-a[0])*d/len,v=a[1]+(z[1]-a[1])*d/len;
      box('metal',u-.10,u+.10,.35,6.35,v-.10,v+.10);
    }
  }
  const root=b.finish();
  for (const mesh of root.children) mesh.geometry.rotateY(-ANGLE);
  root.updateMatrixWorld(true);
  return root;
}
