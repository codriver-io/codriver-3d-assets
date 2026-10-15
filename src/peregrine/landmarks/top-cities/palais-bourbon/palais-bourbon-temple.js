// Palais Bourbon: the Seine front (twelve-column Corinthian portico, pediment, perron, statues) and the
// courtyard front on the Rue de l'Université side. Both are built in their own frames (local +z points away from
// the front) and carried into the shared metre frame by a Matrix4.
import * as THREE from 'three';
import { Kit, frame, local, partById, PARTS } from './palais-bourbon-parts.js';

const COLUMN_IDS = [1459801044, 1459801046, 1459801047, 1459801048, 1459801049, 1459801050, 1459801051, 1459801052, 1459801053, 1459801054, 1459801055, 1459801056];
const centroid = (p) => [p.pts.reduce((s, q) => s + q[0], 0) / p.pts.length, p.pts.reduce((s, q) => s + q[1], 0) / p.pts.length];

// The mapped column centres fix the north front: centre, bearing of the colonnade and its spacing.
export function templeFrame() {
  const cs = COLUMN_IDS.map((id) => centroid(partById(id))).sort((a, b) => a[0] - b[0]);
  const first = cs[0], last = cs[cs.length - 1];
  const theta = Math.atan2(last[1] - first[1], last[0] - first[0]);
  return { cx: (first[0] + last[0]) / 2, cz: (first[1] + last[1]) / 2, theta, span: Math.hypot(last[0] - first[0], last[1] - first[1]) };
}
export const TEMPLE = templeFrame();

// Dimensions in the temple frame: x across (east-ish), y up, z back; the colonnade line is z = 0, the front faces -z.
export const T = {
  stylobateY: 4.6, columnTop: 18.4, corniceTop: 20.62, apex: 27.4,
  halfWide: 20.7, stairHalf: 19.15, cheekOuter: 20.9, stairFront: -11.95, stairBack: -1.3, cellaFront: 5.2, cellaBack: 13.7,
};

function column(s, x, z, y0, h, r0, near) {
  const k = h / 13.8, seg = near ? 16 : 8;
  s.lathe(x, z, [[1.0,0],[1.0,.28],[.9,.4],[.85,.55],[.845,3],[.805,9],[.73,12.1],[.72,12.3],[.88,12.9],[1.0,13.42],[0,13.42]].map(([r,y])=>[r*r0/.85,y*k]),seg,y0);
  // Two acanthus whorls and projecting corner volutes keep the Corinthian order readable.
  const leaves = near ? 8 : 4;
  for (let row=0; row<(near?2:1); row++) for(let j=0;j<leaves;j++) {
    const a=2*Math.PI*(j+row*.5)/leaves, r=r0*(row? .96: .88), leaf=new THREE.SphereGeometry(1,near?5:4,near?4:3);
    leaf.scale(.18*r0/.85,.43*k,.3*r0/.85); leaf.rotateY(a); leaf.translate(x+Math.sin(a)*r,y0+(12.6+row*.42)*k,z+Math.cos(a)*r); s.geo(leaf);
  }
  s.box(x-1.12*r0/.85,x+1.12*r0/.85,y0+13.42*k,y0+h,z-1.12*r0/.85,z+1.12*r0/.85,['bottom']);
}
function statue(s,x,z,y0,h,near) {
  const seg=near?8:5, sc=h/3;
  s.lathe(x,z,[[.55,0],[.5,.3],[.44,1.1],[.35,1.8],[.43,2.0],[.22,2.4],[0,2.4]].map(([r,y])=>[r*sc,y*sc]),seg,y0);
  const head=new THREE.SphereGeometry(.29*sc,near?7:5,near?5:4); head.translate(x,y0+2.65*sc,z); s.geo(head);
  for(const sg of [-1,1]) {
    const arm=new THREE.CylinderGeometry(.13*sc,.17*sc,.95*sc,near?6:4);
    arm.rotateZ(sg*.3); arm.translate(x+sg*.43*sc,y0+1.73*sc,z-.06*sc); s.geo(arm);
  }
}
// A raking cornice bar: outer edge p0->p1 (x,y), thickness t measured down/in, between z0 and z1 (front first).
function rake(s, p0, p1, t, z0, z1) {
  const dx = p1[0] - p0[0], dy = p1[1] - p0[1], l = Math.hypot(dx, dy), n = [dy / l, -dx / l];
  const inw = n[1] > 0 ? [-n[0], -n[1]] : n; // points down into the pediment
  const a = [...p0], b = [...p1], c = [p1[0] + inw[0] * t, p1[1] + inw[1] * t], d = [p0[0] + inw[0] * t, p0[1] + inw[1] * t];
  const P = (q, z) => [q[0], q[1], z];
  s.quad(P(a, z0), P(b, z0), P(c, z0), P(d, z0), [0, 0, -1]);
  s.quad(P(a, z0), P(b, z0), P(b, z1), P(a, z1), [-inw[0], -inw[1], 0]);
  s.quad(P(d, z0), P(c, z0), P(c, z1), P(d, z1), [inw[0], inw[1], 0]);
}

export function buildTemple(K, near) {
  const F = frame(K, 'temple', TEMPLE.cx, TEMPLE.cz, -TEMPLE.theta);
  const st = F('stone'), sp = F('steps'), rl = F('relief'), wg = F('wing'), sl = F('slate'), wn = F('window');
  const { stylobateY: Y0, columnTop: Y1, corniceTop: YC, apex, halfWide: HW, stairHalf: SH, cheekOuter: CO } = T;
  const half = TEMPLE.span / 11;
  // perron: 30 risers from the street to the stylobate, between two cheek walls
  const n = near ? 30 : 10, rise = Y0 / n, run = (T.stairBack - T.stairFront) / n;
  for (let i = 0; i < n; i++) {
    const zf = T.stairFront + i * run, y0 = i * rise, y1 = (i + 1) * rise;
    sp.quad([-SH, y0, zf], [SH, y0, zf], [SH, y1, zf], [-SH, y1, zf], [0, 0, -1]);
    sp.quad([-SH, y1, zf], [SH, y1, zf], [SH, y1, zf + run], [-SH, y1, zf + run], [0, 1, 0]);
  }
  sp.quad([-SH, Y0, T.stairBack], [SH, Y0, T.stairBack], [SH, Y0, T.cellaFront], [-SH, Y0, T.cellaFront], [0, 1, 0]);
  for (const sg of [-1, 1]) {
    const x0 = sg > 0 ? SH : -CO, x1 = sg > 0 ? CO : -SH;
    st.box(x0, x1, 0, Y0, T.stairFront, T.cellaFront, ['bottom']);
    // Six simplified flanking figures: the four ministers and Athena/Themis.
    for (const z of [-10.9, -5.8, -1.8]) {
      const x = sg * 20.025;
      st.box(x - 0.75, x + 0.75, Y0, Y0 + 1.7, z - 0.75, z + 0.75, ['bottom']);
      st.box(x - 0.88, x + 0.88, Y0 + 1.7, Y0 + 1.95, z - 0.88, z + 0.88, ['bottom']);
      statue(rl, x, z, Y0 + 1.95, 3.2, near);
    }
  }
  // Solid rigid basement beneath the landing and cella; stair treads close the sloping forepart.
  st.box(-SH,SH,0,Y0,T.stairBack,T.cellaFront,['top','bottom','north']);
  st.box(-20.65,20.65,0,Y0,T.cellaFront,T.cellaBack,['top','bottom']);
  // twelve columns, the end ones against the antae
  for (let i = 0; i < 12; i++) column(st, -TEMPLE.span / 2 + i * half, 0, Y0, Y1 - Y0, 0.85, near);
  // cella wall behind the porch, with its three portals and end returns
  wg.box(-20.65, 20.65, Y0, YC, T.cellaFront, T.cellaBack, ['bottom', 'top']);
  for (const sg of [-1, 1]) st.box(sg > 0 ? 19.9 : -20.65, sg > 0 ? 20.65 : -19.9, Y0, Y1, -0.8, T.cellaFront, ['bottom', 'top']);
  for (const x of [-7.1, 0, 7.1]) {
    wn.quad([x - 1.4, Y0, T.cellaFront - 0.12], [x + 1.4, Y0, T.cellaFront - 0.12], [x + 1.4, Y0 + 5.2, T.cellaFront - 0.12], [x - 1.4, Y0 + 5.2, T.cellaFront - 0.12], [0, 0, -1]);

  }
  sp.quad([-20.65, Y0, -0.8], [20.65, Y0, -0.8], [20.65, Y0, T.cellaFront], [-20.65, Y0, T.cellaFront], [0, 1, 0]);
  // entablature: architrave, frieze, two-stage cornice
  st.box(-HW, HW, Y1, Y1 + 1.05, -1.0, T.cellaFront, ['top','bottom']);
  wg.quad([-HW,Y1,-1], [HW,Y1,-1], [HW,Y1,T.cellaFront], [-HW,Y1,T.cellaFront], [0,-1,0]);
  wg.box(-HW - 0.02, HW + 0.02, Y1 + 1.05, Y1 + 1.65, -1.06, T.cellaFront, ['bottom', 'top']);
  st.box(-HW - 0.08, HW + 0.08, Y1 + 1.65, Y1 + 1.9, -1.45, T.cellaFront, ['bottom']);
  st.box(-HW - 0.2, HW + 0.2, Y1 + 1.9, YC, -1.85, T.cellaFront, ['bottom']);
  for (const sg of [-1, 1]) st.box(sg > 0 ? 20.65 : -20.95, sg > 0 ? 20.95 : -20.65, Y1 + 1.65, YC, T.cellaFront, T.cellaBack, ['bottom']);
  // pediment: recessed tympanum, raking cornice, relief group
  const wide = HW + 0.2;
  wg.tri([-wide, YC, -1.0], [wide, YC, -1.0], [0, apex, -1.0], [0, 0, -1]);
  rake(st, [-wide, YC], [0, apex], 0.66, -1.85, -0.9); rake(st, [wide, YC], [0, apex], 0.66, -1.85, -0.9);
  const room = (x) => (apex - YC) * (1 - Math.abs(x) / wide) - 0.7;
  // Low-relief allegorical group: central standing figure, seated flanks and reclining ends.
  // All drapery is attached to the tympanum, at most 0.46 m proud of its backing.
  const relief=(x,y,rx,ry,rz=.17)=>{const g=new THREE.SphereGeometry(1,near?8:6,near?6:4);g.scale(rx,ry,rz);g.translate(x,y,-1.23);rl.geo(g);};
  const limb=(a,b,w)=>{const d=new THREE.Vector3(...b).sub(new THREE.Vector3(...a)),g=new THREE.CylinderGeometry(w,w,d.length(),near?6:4);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()));g.scale(1,1,.34);g.translate((a[0]+b[0])/2,(a[1]+b[1])/2,-1.24);rl.geo(g);};
  for(const [x,h]of [[0,4.9],[-2.6,4.2],[2.6,4.1],[-5.4,3.4],[5.4,3.4],[-8.4,2.7],[8.4,2.7],[-11.5,1.9],[11.5,1.9],[-14.8,1.0],[14.8,1.0]]){
    const hh=Math.min(h,room(x)-.15),base=YC+.1,lean=x===0?0:-Math.sign(x)*.28;
    relief(x,base+hh*.34,.72,hh*.32,.18);
    relief(x+lean,base+hh*.65,.51,hh*.20,.20);
    relief(x+lean,base+hh*.91,.27,hh*.085,.16);
    limb([x-.4,base+hh*.65,0],[x-1.0,base+hh*.43,0],.21);
    limb([x+.4,base+hh*.65,0],[x+1.0,base+hh*.48,0],.21);
    limb([x,base+hh*.3,0],[x+(x===0?.25:1.0),base+.16,0],.24);
  }
  for(const sg of [-1,1])relief(sg*16.6,YC+.38,1.65,.27,.18);
  // Restrained original stroke lettering on the recessed frieze; one merged ivory material.
  const glyph={A:['01110','10001','10001','11111','10001','10001','10001'],S:['01111','10000','10000','01110','00001','00001','11110'],E:['11111','10000','10000','11110','10000','10000','11111'],M:['10001','11011','10101','10101','10001','10001','10001'],B:['11110','10001','10001','11110','10001','10001','11110'],L:['10000','10000','10000','10000','10000','10000','11111'],N:['10001','11001','11001','10101','10011','10011','10001'],T:['11111','00100','00100','00100','00100','00100','00100'],I:['111','010','010','010','010','010','111'],O:['01110','10001','10001','10001','10001','10001','01110']};
  const text='ASSEMBLEE NATIONALE',cell=.065,advance=.45,start=-text.length*advance/2;
  for(let j=0;j<text.length;j++)for(const [row,bits]of (glyph[text[j]]||[]).entries())for(let k=0;k<bits.length;k++)if(bits[k]==='1'){
    const x=start+j*advance+k*cell,y=Y1+1.12+(6-row)*cell;
    rl.quad([x,y,-1.19],[x+cell*.8,y,-1.19],[x+cell*.8,y+cell*.8,-1.19],[x,y+cell*.8,-1.19],[0,0,-1]);
  }
  // gabled slate roof running back to the hemicycle, and its back gable
  for (const sg of [-1, 1]) sl.quad([sg * 20.65, YC, -1.0], [sg * 20.65, YC, T.cellaBack], [0, apex, T.cellaBack], [0, apex, -1.0], [sg * (apex - YC), 20.65, 0]);
  st.tri([-20.65, YC, T.cellaBack], [20.65, YC, T.cellaBack], [0, apex, T.cellaBack], [0, 0, 1]);
}

// Courtyard front: four columns under a clock attic, blue door, perron.
export function buildSouth(K, near) {
  const p = partById(1459531667), o = p.obb;
  const ux = o.ux > 0 ? o.ux : -o.ux, uz = o.ux > 0 ? o.uz : -o.uz, th = Math.atan2(uz, ux), out = [-uz, ux];
  const F = frame(K, 'south', o.cx, o.cz, Math.PI - th);
  const st = F('stone'), sp = F('steps'), rl = F('relief'), sl = F('slate'), wn = F('window'), dr = F('door');
  const wall = partById(1459531665), c0 = [o.cx, o.cz];
  const oWall = Math.max(...wall.pts.map((q) => (q[0] - c0[0]) * out[0] + (q[1] - c0[1]) * out[1]));
  const Z = (d) => -d; // outward distance -> frame z
  const W = 6.15, y0 = 2.0, y1 = 12.4, colO = oWall + 2.9;
  sp.box(-W, W, 0, y0, Z(oWall + 3.8), Z(oWall), ['bottom', 'south']);
  for (let i = 0; i < (near ? 8 : 4); i++) {
    const k = near ? 8 : 4, d1 = oWall + 7.2 - i * 3.4 / k, d0 = d1 - 3.4 / k, ya = i * y0 / k, yb = (i + 1) * y0 / k;
    sp.quad([-4.4, ya, Z(d1)], [4.4, ya, Z(d1)], [4.4, yb, Z(d1)], [-4.4, yb, Z(d1)], [0, 0, -1]);
    sp.quad([-4.4, yb, Z(d0)], [4.4, yb, Z(d0)], [4.4, yb, Z(d1)], [-4.4, yb, Z(d1)], [0, 1, 0]);
  }
  void sp;
  for (const x of [-5.1, -1.7, 1.7, 5.1]) column(st, x, Z(colO), y0, y1 - y0, 0.62, near);
  st.box(-W, W, y1, y1 + 1.6, Z(oWall + 4.4), Z(oWall), ['bottom']);
  st.box(-4.7, 4.7, y1 + 1.6, y1 + 4.2, Z(oWall + 1.4), Z(oWall), ['bottom']);
  st.box(-5.1, 5.1, y1 + 4.2, y1 + 4.6, Z(oWall + 1.8), Z(oWall), ['bottom']);
  sl.quad([-5.1, y1 + 4.6, Z(oWall + 1.8)], [5.1, y1 + 4.6, Z(oWall + 1.8)], [3.2, 18.4, Z(oWall + 0.6)], [-3.2, 18.4, Z(oWall + 0.6)], [0, 0.6, -1]);
  sl.quad([-5.1, y1 + 4.6, Z(oWall)], [5.1, y1 + 4.6, Z(oWall)], [3.2, 18.4, Z(oWall + 0.6)], [-3.2, 18.4, Z(oWall + 0.6)], [0, 0.6, 1]);
  rl.box(-1.15, 1.15, y1 + 1.2, y1 + 3.5, Z(oWall + 1.52), Z(oWall + 1.4), ['bottom']);
  wn.quad([-0.85, y1 + 1.5, Z(oWall + 1.64)], [0.85, y1 + 1.5, Z(oWall + 1.64)], [0.85, y1 + 3.2, Z(oWall + 1.64)], [-0.85, y1 + 3.2, Z(oWall + 1.64)], [0, 0, -1]);
  const dz = Z(oWall + 0.12), r = 1.7, cy = y0 + 7.0;
  dr.quad([-r, y0, dz], [r, y0, dz], [r, cy, dz], [-r, cy, dz], [0, 0, -1]);
  const arc = []; for (let i = 0; i <= (near ? 10 : 5); i++) { const a = Math.PI * i / (near ? 10 : 5); arc.push([r * Math.cos(a), cy + r * Math.sin(a)]); }
  for (let i = 0; i < arc.length - 1; i++) dr.tri([0, cy, dz], [arc[i][0], arc[i][1], dz], [arc[i + 1][0], arc[i + 1][1], dz], [0, 0, -1]);
  for (const x of [-4.6, 4.6]) wn.quad([x - 0.8, y0 + 0.8, dz], [x + 0.8, y0 + 0.8, dz], [x + 0.8, y0 + 6.4, dz], [x - 0.8, y0 + 6.4, dz], [0, 0, -1]);
}
export { PARTS, local, Kit };
