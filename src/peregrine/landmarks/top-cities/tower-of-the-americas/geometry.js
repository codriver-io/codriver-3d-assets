import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';

// Original radial massing, distinct lateral tiers and fluted shaft; no pasted window skins.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', n = near ? 96 : 48;
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const turn = SPEC.elevatorBearing * Math.PI / 180;
  const xyz = (r, y, a) => [r * Math.sin(a), y, -r * Math.cos(a)];
  function lathe(mat, points, segments = n) {
    b.put(new THREE.LatheGeometry(points.map(([r, y]) => new THREE.Vector2(r, y)), segments), mat);
  }
  function ring(mat, y, inner, outer) { lathe(mat, [[outer, y], [inner, y]]); }
  function surface(mat, r0, r1, y0, y1) { lathe(mat, [[r0, y0], [r1, y1]]); }
  function cylinder(mat, r0, r1, y0, y1, segments = n) {
    const g = new THREE.CylinderGeometry(r1, r0, y1 - y0, segments);
    g.translate(0, (y0 + y1) / 2, 0); b.put(g, mat);
  }
  // Twelve shallow flutes are part of the concrete surface, not coloured shaft stripes.
  const positions = [], indices = [], shaftN = near ? 192 : 96;
  const y0 = 9.4, y1 = SPEC.houseBottomY;
  const radial = (a, y) => {
    const taper = 1 - 0.032 * ((y - y0) / (y1 - y0));
    const f = (a - turn) / (Math.PI * 2) * 12;
    const groove = Math.pow((1 + Math.cos(f * Math.PI * 2)) / 2, 6);
    return (SPEC.shaftRadius - 0.48 * groove) * taper;
  };
  for (const y of [y0, y1]) for (let i = 0; i <= shaftN; i++) {
    const a = i / shaftN * Math.PI * 2; positions.push(...xyz(radial(a, y), y, a));
  }
  for (let i = 0; i < shaftN; i++) {
    const a = i, c = i + shaftN + 1;
    indices.push(a, c, a + 1, a + 1, c, c + 1);
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); g.setIndex(indices); g.computeVertexNormals(); b.put(g, 'concrete');
  // Elevator channel, fixed track uprights and horizontal guide rhythm.
  // Vertical structure terminates on pavilion roof and top-house soffit.
  const elevatorR = 6.72;
  const elevator = new THREE.BoxGeometry(1.5, y1 - y0, 0.35);
  elevator.rotateY(-turn); elevator.translate(...xyz(elevatorR, (y0 + y1) / 2, turn)); b.put(elevator, 'glass');
  for (const d of [-0.95, 0.95]) {
    const p = xyz(elevatorR, 0, turn), t = [Math.cos(turn), 0, Math.sin(turn)];
    b.bar('metal', [p[0] + d*t[0], y0, p[2] + d*t[2]], [p[0] + d*t[0], y1, p[2] + d*t[2]], 0.22, 0.3);
  }
  for (let y = 11; y < 164; y += near ? 3.6 : 7.2) b.box('metal', xyz(elevatorR + 0.22, y, turn), [1.8, 0.18, 0.35], -turn);
  b.box('metal', xyz(elevatorR + 0.42, 38, turn), [2.0, 3.6, 1.0], -turn);
  b.box('glow', xyz(elevatorR + 1.0, 38.1, turn), [1.55, 2.5, 0.15], -turn);

  // Broad underside dish and radial structural soffit ribs.
  lathe('stone', [[6.45, y1], [14.25, y1 + 2.0]]);
  surface('stone', 14.25, 14.65, 168.43, 170.5);
  for (let i = 0; i < (near ? 48 : 24); i++) {
    const a = i * Math.PI * 2 / (near ? 48 : 24);
    b.bar('concrete', xyz(6.5, y1 - 0.04, a), xyz(14.18, 168.33, a), near ? 0.23 : 0.3, 0.3);
  }
  // Glass and masonry occupy adjacent intervals to avoid material-overlay depth cycles.
  for (const [mat, r0, r1, lo, hi] of [
    ['glow', 14.65, 15.22, 170.5, 176.45],
    ['stone', 15.22, 15.58, 176.45, 179.8],
    ['glass', 15.58, 16.03, 179.8, 184.3],
    ['stone', 16.03, 16.18, 184.3, 185.55],
    ['glass', 16.18, 16.18, 185.55, 188.1],
    ['roof', 16.18, SPEC.houseRadius, 188.1, SPEC.roofY],
  ]) surface(mat, r0, r1, lo, hi);
  // Slim mullions retain the close bay rhythm in both LODs.
  for (const [lo, hi, r0, r1] of [[170.5,176.45,14.65,15.22],[179.8,184.3,15.58,16.03],[185.55,188.1,16.18,16.18]]) {
    for (let i = 0; i < (near ? 64 : 32); i++) {
      const a = i * Math.PI * 2 / (near ? 64 : 32);
      b.bar('metal', xyz(r0 + 0.18, lo, a), xyz(r1 + 0.18, hi, a), near ? 0.18 : 0.28, 0.5);
    }
  }
  ring('roof',SPEC.roofY,0,SPEC.houseRadius);
  cylinder('antenna', 0.56, 0.56, SPEC.roofY, 198.0, near ? 12 : 8);
  cylinder('antenna', 0.36, 0.27, 198, 218.0, near ? 10 : 6);
  cylinder('antenna', 0.18, 0.08, 218, 229, near ? 8 : 6);
  if (near) for (let y = 199; y < 217; y += 2.7) b.box('antenna', [0, y, 0], [1.8, 0.14, 0.22]);

  // Low circular entrance/café and mapped northern annex. No forecourt ground pad.
  cylinder('stone', 13.1, 13.1, 0, 0.65);
  surface('glass', 13.1, 13.1, 0.65, 6.2);
  for (let i=0; i<(near?40:20); i++) {
    const a=i*Math.PI*2/(near?40:20);
    b.bar('metal', xyz(13.25,0.65,a), xyz(13.25,6.2,a), 0.22, 0.4);
  }
  ring('roof',6.2,0,13.4);
  cylinder('concrete',6.6,SPEC.shaftRadius,6.2,9.4);
  const local = p => [(p[0]-SPEC.origin[0])*111320*Math.cos(SPEC.origin[1]*Math.PI/180), -(p[1]-SPEC.origin[1])*111320];
  function roofPolygon(ring, topY, bottomY, slope=false) {
    const pts=ring.slice(0,-1).map(local);
    if(pts.reduce((s,[x,z],i)=>{const q=pts[(i+1)%pts.length];return s+x*q[1]-q[0]*z;},0)<0)pts.reverse();
    const shape=new THREE.Shape(pts.map(([x,z])=>new THREE.Vector2(x,-z)));
    const top=new THREE.ShapeGeometry(shape), p=top.attributes.position;
    for(let i=0;i<p.count;i++) { const x=p.getX(i),z=-p.getY(i),r=Math.hypot(x,z); p.setXYZ(i,x,slope?9.4-(r-13.4)*0.24:topY,z); }
    top.computeVertexNormals(); top.normalizeNormals(); b.put(top,'roof');
    const bot=new THREE.ShapeGeometry(shape), bp=bot.attributes.position, bi=bot.index;
    for(let i=0;i<bp.count;i++)bp.setXYZ(i,bp.getX(i),bottomY,-bp.getY(i));
    for(let i=0;i<bi.count;i+=3){const v=bi.getX(i+1);bi.setX(i+1,bi.getX(i+2));bi.setX(i+2,v);}
    bot.computeVertexNormals();b.put(bot,'roof');
    const pos=[],idx=[];
    for(let i=0;i<pts.length;i++) {
      const [x,z]=pts[i], [xx,zz]=pts[(i+1)%pts.length];
      const y=slope?9.4-(Math.hypot(x,z)-13.4)*0.24:topY, yy=slope?9.4-(Math.hypot(xx,zz)-13.4)*0.24:topY;
      const k=pos.length/3;pos.push(x,bottomY,z,x,y,z,xx,bottomY,zz,xx,yy,zz);idx.push(k,k+1,k+2,k+1,k+3,k+2);
    }
    const side=new THREE.BufferGeometry();side.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));side.setIndex(idx);side.computeVertexNormals();b.put(side,'roof');
  }
  // Way 351672060 is an annular crescent, its north gap meeting the annex.
  roofPolygon(FOOTPRINTS[5],9.4,6.2,true);
  for (const bearing of [30,75,120,165,210,255,290]) {
    const p=xyz(22.7,0,bearing*Math.PI/180);
    const col=new THREE.CylinderGeometry(0.24,0.3,6.2,near?10:6);
    col.translate(p[0],3.1,p[2]);b.put(col,'metal');
  }
  const annexShape=new THREE.Shape(FOOTPRINTS[1].slice(0,-1).map(local).map(([x,z])=>new THREE.Vector2(x,-z)));
  for(const [mat,lo,hi] of [['stone',0,0.65],['glass',0.65,5.4],['stone',5.4,6.1]]) {
    const annex=new THREE.ExtrudeGeometry(annexShape,{depth:hi-lo,bevelEnabled:false});annex.rotateX(-Math.PI/2);annex.translate(0,lo,0);b.put(annex,mat);
  }
  roofPolygon(FOOTPRINTS[1],6.6,6.1);
  const model=b.finish();model.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift');});return model;
}
