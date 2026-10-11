import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { ANGLE, kit, localRing } from './altare-della-patria-parts.js';

export function create({detail='near'}={}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const {box,slab,cylinder,column,figure,horse,pediment}=kit(b,near);
  // Building frame: -Z toward Piazza Venezia; X along facade. Rotation baked below.
  const C=-7;
  slab(localRing(FOOTPRINTS[0]),0,2.8);
  // The attached museum behind the monument follows its independent mapped envelope.
  slab(localRing(FOOTPRINTS[1]),0,31);
  slab(localRing(FOOTPRINTS[1]),31,.7,'trim');
  box('stone',C,9.9,24,112,14.2,61);
  box('stone',C,26,37,110,18,34);
  // Central and propylaea floors share 42 m; narrow upper riser avoids a giant blank podium.
  box('stone',C,38.4,44,69.6,6.8,20);
  for(const y of [35.6,38.4,41.3])box('trim',C,y,33.9,69,.4,.4);
  for(const x of [-34.6,34.6])box('trim',C+x,38.4,33.9,.8,6.8,.5);
  // Lower forecourt terrace, stairs and monumental central retaining wall.
  box('stone',C,5,-27,109,4.4,31);
  box('trim',C,7.6,-27,109.5,.8,31.5);
  const stairs=(x,w,z0,z1,y0,y1,n)=>{
    // Single closed staircase extrusion: continuous risers, no floating treads.
    const profile=[[z0,y0],[z1,y0],[z1,y1]];
    for(let i=n-1;i>=0;i--){profile.push([z0+i*(z1-z0)/n,y0+(i+1)*(y1-y0)/n]);profile.push([z0+i*(z1-z0)/n,y0+i*(y1-y0)/n]);}
    const sh=new THREE.Shape(profile.map(([z,y])=>new THREE.Vector2(z,y)));
    const g=new THREE.ExtrudeGeometry(sh,{depth:w,bevelEnabled:false});g.rotateY(-Math.PI/2);g.translate(x+w/2,0,0);b.put(g,'stone');
  };
  // Each stair tread is a thin riser/tread band; structural terraces close the underside.
  const ns=near?36:18;
  stairs(C,37,-79,-51,2.8,8,ns);
  box('stone',C,4.6,-63,36,3.6,23);
  stairs(C,44,-49,-31,8,17,near?30:15);
  box('stone',C,11,-39,43,6,16);
  box('stone',C,20,-13,68,6,21);
  box('trim',C,23.4,-13,69,.8,21.8);
  // Flanking diagonal-looking terrace steps split around the equestrian base.
  for(const s of [-1,1]){
    const x=C+s*43;
    box('stone',x,21.3,7,18,8.6,40);
    stairs(x,17,-13,21,25.6,42,near?30:15);
    box('stone',x,29.3,8,17,7.4,26);
    box('trim',x,41.6,23,17,1.2,6);
    // Rails follow the rising stair instead of floating above a lower terrace.
    const level=z=>25.6+(z+13)*16.4/34, rx=x+s*8.7;
    for(const [offset,width] of [[.25,.65],[2.1,.65]])b.bar('trim',[rx,level(-10)+offset,-10],[rx,level(21)+offset,21],width);
    for(let i=0;i<(near?24:9);i++){
      const z=-10+i*31/(near?23:8);
      cylinder('trim',rx,level(z)+.1,z,.27,1.75,.25,near?8:4);
    }
  }
  // Altar of Rome and Tomb of the Unknown Soldier: gilded niche with marble figure.
  box('relief',C,20.3,-23.85,8,5.8,1.3);
  box('gold',C,20.4,-24.56,3.5,5.2,.12);
  for(const s of [-1,1])column(C+s*2.25,-24.7,17.2,5.8,.32);
  figure('trim',C,17.5,-24.7,4.8);
  box('trim',C,17.5,-25.2,6,.8,2);
  box('bronze',C,16.5,-26.25,2.7,.8,.8);
  for(const s of [-1,1]){box('bronze',C+s*2.7,18.075,-25.8,.6,.35,.65);cylinder('glow',C+s*2.7,18.25,-25.8,.22,.55,.04,5);}
  // Processional bas-reliefs across the face of the altar retaining wall.
  if(near)for(let i=0;i<34;i++){const x=C-32+i*64/33;if(Math.abs(x-C)<5)continue;figure('relief',x,18.2,-24,3.2);}
  // King on horseback, on the sculptured oval pedestal (strong road-visible silhouette).
  cylinder('trim',C,23.8,-12,7.2,1.3,6.8,near?32:12);
  cylinder('stone',C,25.1,-12,5.9,7.3,5.1,near?32:12);
  cylinder('trim',C,32.4,-12,5.7,1.2,6.0,near?32:12);
  if(near)for(let i=0;i<12;i++){const a=i*Math.PI/6;figure('relief',C+Math.cos(a)*5.85,26,-12+Math.sin(a)*5.85,3.8);}
  horse(C,33.6,-12,1.7);
  figure('bronze',C+.15,39.25,-12,4.2);
  // Sixteen 15 m Corinthian columns: shallow concave arc, 70 m overall portico.
  const arc=x=>38+4*(1-Math.pow(x/35,2));
  for(let i=0;i<16;i++)column(C-33.4+i*66.8/15,arc(-33.4+i*66.8/15),42,15);
  // Curved colonnade slabs and back wall, generated as a closed plan polygon.
  const pts=Array.from({length:near?33:17},(_,i)=>-35+70*i/(near?32:16));
  const band=(front,back)=>[...pts.map(x=>[C+x,arc(x)+front]),...pts.toReversed().map(x=>[C+x,arc(x)+back])];
  slab(band(-2.0,8),41,1.18,'trim');
  slab(band(6.8,8),42,15,'stone');
  slab(band(6.61,6.79),42.15,14.7,'recess');
  slab(band(-2.1,8.3),57,1.2,'trim');
  slab(band(-1.65,8),58.2,5.8,'stone');
  slab(band(-2.25,8.6),64,1,'trim');
  // Gilded decoration of the portico's recessed rear wall, visible between columns.
  slab(band(6.4,6.59),46.5,3.5,'gold');
  for(let i=0;i<16;i++){
    const x=-33.4+i*66.8/15,z=arc(x);
    if(near){box('relief',C+x,61.2,z-1.82,2.7,3.8,.18);box('trim',C+x,60,z-2.05,1.4,.15,.15);box('trim',C+x,62.6,z-2.05,1.4,.15,.15);}
    figure('trim',C+x,65,z+1.4,3.1);
  }
  // Two open propylaea: full-height lower pylons, four columns, pediment and stepped attic.
  for(const s of [-1,1]){
    const x=C+s*45,z=37;
    box('stone',x,38.4,z,20,6.8,23);
    box('trim',x,41.5,z,21,1,24);
    // Rear closure is recessed, leaving the column bays genuinely open.
    box('stone',x,52,z+9.5,20,20,2);
    box('recess',x,52,z+8.35,19.8,19.6,.3);
    for(const xx of [-7,-2.35,2.35,7])column(x+xx,z-8,42,20,1.05);
    for(const side of [-1,1])for(const zz of [-2,4])column(x+side*8,z+zz,42,20,1.05);
    box('trim',x,62.6,z,21.8,1.2,24);
    pediment(x,63.2,z-12.5,20.8,4.2,24.7);
    // Smaller inset tympanum gives the triangular front a visible border and physical depth.
    pediment(x,63.6,z-12.65,17.6,3.25,.24,'relief');
    box('stone',x,68.5,z,20,2.6,22);
    box('trim',x,69.8,z,21,.4,23);
    // Quadriga platform, four horses abreast and winged Victory in chariot.
    box('bronze',x,70.5,z,11,1,7.5);
    for(const dx of [-3.15,-1.05,1.05,3.15])horse(x+dx,71,z-1.3,1.28,-Math.PI/2);
    box('bronze',x,73.4,z+3.4,2.5,3,3);
    figure('bronze',x,74.5,z+3.4,5.909090909,true,.35);
    for(const dx of [-1.5,1.5]){const wheel=new THREE.TorusGeometry(1.15,.16,3,near?10:6);wheel.rotateY(Math.PI/2);wheel.translate(x+dx,72.55,z+3.4);b.put(wheel,'bronze');};
    // Lower portal panels and massive corner pilasters.
    box('recess',x,38.3,z-11.62,3.8,5.2,.2);
    for(const dx of [-8.2,8.2])box('trim',x+dx,38.5,z-11.8,1.1,6.5,.6);
    box('trim',x,40.7,z-11.9,7,.5,.65);
    if(near){box('relief',x,41.5,z-11.85,9,.65,.5);for(const dx of [-2.6,2.6])box('trim',x+dx,41.5,z-12.18,.25,.6,.2);}
  }
  // Four triumphal marble columns and bronze winged victories below the portico.
  for(const s of [-1,1])for(const dx of [0,13]){
    const x=C+s*(40+dx),z=7;
    box('stone',x,29,z,4,2,4);column(x,z,30,7,.7);figure('bronze',x,37,z,4.6,true);
  }
  // Sculptural groups at the lower terrace corners.
  for(const s of [-1,1]){const x=C+s*48;box('trim',x,9.7,-30,5,3.4,5);figure('trim',x,11.4,-30,4.5);if(near){figure('trim',x+1.4,11.4,-29,2.8);figure('trim',x-1.5,11.4,-30.5,3.2);}}
  // Rear elevations are estimated: quiet museum windows and articulated wall piers.
  for(let i=0;i<14;i++){
    const x=C-49+i*98/13;
    for(const y of [11,23,40])box('recess',x,y,54.65,2.5,4,.18);
    box('trim',x,41,54.7,.75,12,.35);
  }
  for(const s of [-1,1]){
    for(const z of [0,9,18,27,36,45]){box('recess',C+s*56.13,12,z,.18,3.4,2);box('trim',C+s*56.15,18,z,.35,11,.8);}
    box('trim',C+s*56.2,16.8,24,.5,.6,60);
  }
  // Cornice dentils and marble joints give scale without per-element draw calls.
  if(near){
    for(let i=0;i<110;i++){const x=C-54+i*108/109;box('trim',x,34.5,19.75,.38,.6,.7);}
    for(const y of [5,10,14,19,24,29,32])box('relief',C,y,19.92,109,.075,.12);
    for(const s of [-1,1])for(const y of [8,16,23,30])box('relief',C+s*56.04,y,30,.12,.09,47);
    for(let i=0;i<60;i++){const x=C-34+i*68/59;box('trim',x,63.75,arc(x)-1.85,.3,.3,.7);}
  }
  const root=b.finish();
  root.traverse(o=>{if(o.isMesh){o.geometry.deleteAttribute('bridgeLift');o.geometry.rotateY(ANGLE);o.geometry=mergeVertices(o.geometry,1e-4);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();}});
  return root;
}
