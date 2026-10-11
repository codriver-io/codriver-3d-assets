import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';

const TAU = Math.PI * 2, ROT = SPEC.majorAxisDegrees * Math.PI / 180;
const cs = Math.cos(ROT), sn = Math.sin(ROT);
const frame = (u, y, v) => [u * cs - v * sn, y, u * sn + v * cs];
// Convert the mapped outline to the stadium's long/short axis frame.
const ring = FOOTPRINTS[0].slice(0, -1).map(([lng, lat]) => {
  const x = (lng - SPEC.origin[0]) * 111320 * Math.cos(SPEC.origin[1] * Math.PI / 180);
  const z = (SPEC.origin[1] - lat) * 111320;
  return [x * cs + z * sn, -x * sn + z * cs];
});
function boundary(t) {
  const dx = 116 * Math.cos(t), dz = 96 * Math.sin(t);
  let radius = Infinity;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], c = ring[(i + 1) % ring.length], ex = c[0] - a[0], ez = c[1] - a[1];
    const den = dx * ez - dz * ex;
    if (Math.abs(den) < 1e-9) continue;
    const r = (a[0] * ez - a[1] * ex) / den, s = (a[0] * dz - a[1] * dx) / den;
    if (r > 0 && s >= 0 && s <= 1) radius = Math.min(radius, r);
  }
  return [dx * radius, dz * radius];
}
export function stadiumPoint(t, f, y) { const p = boundary(t); return frame(p[0] * f, y, p[1] * f); }
export function aperturePoint(t, y) { return frame(50 * Math.cos(t), y, 42.5 * Math.sin(t)); }

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const mat = (m) => !near && m === 'glass' ? 'glow' : !near && m === 'shadow' ? 'cable' : !near && m === 'paint' ? 'steel' : m;
  function quad(m, a, c, d, e, want) {
    const ab = new THREE.Vector3(...c).sub(new THREE.Vector3(...a));
    const ac = new THREE.Vector3(...d).sub(new THREE.Vector3(...a));
    const flip = ab.cross(ac).dot(new THREE.Vector3(...want)) < 0;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...c, ...d, ...e], 3));
    g.setIndex(flip ? [0, 2, 1, 0, 3, 2] : [0, 1, 2, 0, 2, 3]);
    g.computeVertexNormals(); b.put(g, mat(m));
  }
  function strip(m, f1, y1, f2, y2, n = near ? 144 : 48, facing = 'out') {
    for (let i = 0; i < n; i++) {
      const t = TAU * i / n, s = TAU * (i + 1) / n;
      const out = stadiumPoint((t + s) / 2, 1, 0);
      const want = facing === 'up' ? [0, 1, 0] : facing === 'down' ? [0, -1, 0] : facing === 'in' ? out.map(v => -v) : out;
      quad(m, stadiumPoint(t, f1, y1), stadiumPoint(s, f1, y1), stadiumPoint(s, f2, y2), stadiumPoint(t, f2, y2), want);
    }
  }
  // Closed concrete drum with a recessed teal clerestory.
  strip('concrete', .86, 0, .89, 17);
  strip('concrete', .89, 17, .94, 18.2, undefined, 'down');
  strip('glow', .925, 18.2, .925, 27.7);
  strip('concrete', .94, 18.2, .925, 18.2, undefined, 'up');
  strip('concrete', .925, 27.7, .94, 27.7, undefined, 'down');
  strip('concrete', .94, 27.7, .94, 30);
  strip('steel', .94, 30, .86, 31, undefined, 'up');
  strip('concrete', .86, 31, .80, 26, undefined, 'in');
  strip('glass', .922, 30.6, .922, 33.85);
  const tiers = near ? 18 : 4;
  for (let i = 0; i < tiers; i++) {
    const f1 = .80 - .31 * i / tiers, f2 = .80 - .31 * (i + 1) / tiers;
    const y1 = 26 - 21 * i / tiers, y2 = 26 - 21 * (i + 1) / tiers;
    strip('seats', f1, y1, f2, y1, near ? 108 : 48, 'up');
    strip('concrete', f2, y1, f2, y2, near ? 108 : 48, 'in');
  }
  strip('concrete', .49, 5, .46, .25, undefined, 'in');
  const pitch = new THREE.BoxGeometry(105, .2, 68); pitch.rotateY(-ROT); pitch.translate(0, .1, 0); b.put(pitch, 'field');
  if (near) {
    for (const v of [-33, 33]) b.bar('paint', frame(-51,.23,v), frame(51,.23,v), .18);
    for (const u of [-51, 0, 51]) b.bar('paint', frame(u,.23,-33), frame(u,.23,33), .18);
    const circle = new THREE.TorusGeometry(9.15, .10, 4, 40); circle.rotateX(Math.PI/2); circle.translate(0,.24,0); b.put(circle,'paint');
  }
  // Vertical facade piers and recessed entrance bays.
  const piers = near ? 72 : 36;
  for (let i = 0; i < piers; i++) {
    const t = i * TAU / piers;
    b.bar('concrete', stadiumPoint(t,.89,1),stadiumPoint(t,.929,27.7), near ? .48 : .7);
    if (near) {
      if (i % 9 === 0) {
        const dt = .058;
        quad('glass', stadiumPoint(t-dt,.878,1),stadiumPoint(t+dt,.878,1),stadiumPoint(t+dt,.883,11),stadiumPoint(t-dt,.883,11),stadiumPoint(t,.9,0));
        for (const off of [-.039,-.02,0,.02,.039]) b.bar('steel', stadiumPoint(t+off,.881,1), stadiumPoint(t+off,.886,11), .20);
      }
      b.bar('steel', stadiumPoint(t,.932,18.3),stadiumPoint(t,.932,27.7), .15);
    }
  }
  if (near) for (const y of [20.6,23,25.3]) strip('steel',.933,y,.933,y+.14);
  // Retain all 36 white tapered, outward leaning masts even at far LOD.
  function mast(a,c) {
    const av = new THREE.Vector3(...a), cv = new THREE.Vector3(...c), v = cv.clone().sub(av);
    const g = new THREE.CylinderGeometry(.45,1.35,v.length(),near ? 8 : 5);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));
    g.translate(...av.add(cv).multiplyScalar(.5).toArray()); b.put(g,'steel');
  }
  // 36 scalloped fixed membrane bays, closed at their inner/outer edges.
  // Retractable centre is OPEN, exposing the radial cable net and storage pod.
  const angular = near ? 6 : 2, radial = near ? 12 : 3;
  const roofAt = (t, r, underside = false) => {
    const outer = stadiumPoint(t,.922,34), inner = aperturePoint(t,43);
    const phase = (t / TAU * 36) % 1;
    const bulge = (1.8 * Math.sin(Math.PI*r) + (near ? 1.8 * Math.sin(3*Math.PI*r)**2 : 0)) * Math.sin(Math.PI * phase);
    return [outer[0]*(1-r)+inner[0]*r,34+9*r+bulge-(underside?.24:0),outer[2]*(1-r)+inner[2]*r];
  };
  for (let i=0;i<36*angular;i++) for(let k=0;k<radial;k++) {
    const t=TAU*i/(36*angular),s=TAU*(i+1)/(36*angular),r=k/radial,q=(k+1)/radial;
    quad('roof',roofAt(t,r),roofAt(s,r),roofAt(s,q),roofAt(t,q),[0,1,0]);
    quad('roof',roofAt(t,r,true),roofAt(s,r,true),roofAt(s,q,true),roofAt(t,q,true),[0,-1,0]);
  }
  for(let i=0;i<36*angular;i++) {
    const t=TAU*i/(36*angular),s=TAU*(i+1)/(36*angular);
    quad('roof',roofAt(t,0,true),roofAt(s,0,true),roofAt(s,0),roofAt(t,0),stadiumPoint(t,1,0));
    quad('steel',roofAt(t,1),roofAt(s,1),roofAt(s,1,true),roofAt(t,1,true),stadiumPoint(t,-1,0));
    if (near) for (const r of [1/3, 2/3]) {
      const lift = p => [p[0], p[1]+.16, p[2]];
      quad('steel',lift(roofAt(t,r-.0015)),lift(roofAt(s,r-.0015)),lift(roofAt(s,r+.0015)),lift(roofAt(t,r+.0015)),[0,1,0]);
    }
  }
  for (let i=0;i<36;i++) {
    const t=i*TAU/36,tip=stadiumPoint(t,.985,77.5),base=stadiumPoint(t,.883,30);
    mast(base,tip);
    const next=(i+1)*TAU/36;
    b.bar('steel',stadiumPoint(t,.94,30.4),stadiumPoint(next,.94,30.4),1.0);
    b.bar('steel',base,stadiumPoint(t,.94,39),.7);
    const steps=near?12:3;
    let last=tip;
    for(let j=1;j<=steps;j++) {
      const f=j/steps, end=aperturePoint(t,48), p=[tip[0]*(1-f)+end[0]*f,77.5*(1-f)+48*f-12*Math.sin(Math.PI*f),tip[2]*(1-f)+end[2]*f];
      b.bar('cable',last,p,near?.20:.30);last=p;
      if(near&&j<steps&&j%2===0) b.bar('cable',p,roofAt(t,f),.11);
    }
    for(let j=0;j<radial;j++) b.bar('cable',roofAt(t,j/radial),roofAt(t,(j+1)/radial),near?.15:.22);
    b.bar('cable',aperturePoint(t,48),frame(9*Math.cos(t),50,8*Math.sin(t)),near?.16:.24);
    b.bar('steel',aperturePoint(t,43.15),aperturePoint(next,43.15),.34);
  }
  const pod=new THREE.CylinderGeometry(10,9,3,near?36:18);pod.translate(0,48.5,0);b.put(pod,'roof');
  b.box('shadow',[0,39,0],[12,7,10]);
  for(const u of [-5,5]) b.bar('cable',frame(u,42.5,0),frame(u,47,0),.3);
  const root = b.finish();
  // Weld the continuous fabric after batching, for smooth cushion normals and
  // fewer duplicated vertices in both exports. Keep hard facade/steel edges.
  const fabric = root.children.find(o => o.material.name === 'roof');
  fabric.geometry.deleteAttribute('normal');
  const welded = mergeVertices(fabric.geometry, .0001);
  fabric.geometry.dispose(); fabric.geometry = welded;
  welded.computeVertexNormals(); welded.computeBoundingBox(); welded.computeBoundingSphere();
  return root;
}
