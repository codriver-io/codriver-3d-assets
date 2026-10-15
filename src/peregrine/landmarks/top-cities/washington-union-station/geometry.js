// Derived data © OpenStreetMap contributors, ODbL 1.0 (facade rotation, statue and column positions).
import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, PLAN } from './config.js';

const A = PLAN.angleDeg * Math.PI / 180;
// Plan metres (u along the facade, y up, v toward the front) to model metres (east, up, south).
export const plan = (u, y, v) => [u * Math.cos(A) - v * Math.sin(A) - PLAN.shiftX, y, u * Math.sin(A) + v * Math.cos(A) - PLAN.shiftZ];

// Plan-frame dimensions (m). Facade and column positions are mapped (OSM); heights are estimated from photographs.
export const D = {
  wingTop: 14.2, parapetTop: 15.5, hallSpring: 22, hallCrown: 30.5, hallV: [-12, 24.0], hallU: [-31.4, 30.6],
  pavU: [-29.6, 28.8], pavFront: 28.6, pavBack: 24.0, colV: 30.2, entablature: [17.6, 20.2], atticTop: 25.2,
  // Mapped column centres (the six statue nodes) and the three main portal centres between them.
  columns: [-26.75, -20.2, -7.25, 5.55, 18.3, 25.05],
  arches: [[-23.5, 3.0, 5.6], [-13.7, 9.4, 13.2], [-0.85, 10.0, 14.2], [11.9, 9.4, 13.2], [21.7, 3.2, 5.8]], // centre, width, crown
  wingFace: 24.4, endFace: 26.2, concourseTop: 7.25,
};

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const put = (g, mat) => { g.rotateY(-A); g.translate(-PLAN.shiftX, 0, -PLAN.shiftZ); b.put(g, mat); };
  const names = ['east', 'west', 'top', 'bottom', 'south', 'north'];
  // Box in plan coordinates; `omit` drops faces nobody sees, `faces` re-materials individual faces.
  function box(mat, u0, u1, y0, y1, v0, v1, omit = [], faces = null) {
    const g = new THREE.BoxGeometry(u1 - u0, y1 - y0, v1 - v0), ix = [...g.index.array];
    g.translate((u0 + u1) / 2, (y0 + y1) / 2, (v0 + v1) / 2);
    if (!faces) { g.setIndex(ix.filter((_, i) => !omit.includes(names[Math.floor(i / 6)]))); put(g, mat); return; }
    for (let f = 0; f < 6; f++) {
      if (omit.includes(names[f])) continue;
      const p = g.clone(); p.setIndex(ix.slice(f * 6, f * 6 + 6)); put(p, faces[names[f]] || mat);
    }
    g.dispose();
  }
  const quad = (mat, u0, u1, y0, y1, v) => { const g = new THREE.PlaneGeometry(u1 - u0, y1 - y0); g.translate((u0 + u1) / 2, (y0 + y1) / 2, v); put(g, mat); };
  const lathe = (mat, u, v, pts, seg = near ? 10 : 6) => {
    const g = new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg); g.translate(u, 0, v); put(g, mat);
  };
  function rod(mat, a, c, r, seg = near ? 6 : 4) {
    const av = new THREE.Vector3(...a), cv = new THREE.Vector3(...c), d = cv.clone().sub(av);
    const g = new THREE.CylinderGeometry(r, r, d.length(), seg, 1, false);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()));
    g.translate(...av.add(cv).multiplyScalar(0.5).toArray()); put(g, mat);
  }
  // Arch outline: straight jambs to `spring`, then an elliptical head to `crown`.
  const archPts = (cu, w, y0, spring, crown, n = near ? 12 : 6) => {
    const pts = [new THREE.Vector2(cu - w / 2, y0), new THREE.Vector2(cu - w / 2, spring)];
    for (let i = 1; i < n; i++) { const t = Math.PI - Math.PI * i / n; pts.push(new THREE.Vector2(cu + w / 2 * Math.cos(t), spring + (crown - spring) * Math.sin(t))); }
    pts.push(new THREE.Vector2(cu + w / 2, spring), new THREE.Vector2(cu + w / 2, y0));
    return pts;
  };
  const glaze = (mat, cu, w, y0, crown, v) => {
    const spring = crown - w / 2, g = new THREE.ShapeGeometry(new THREE.Shape(archPts(cu, w, y0, spring, crown)), 1);
    g.translate(0, 0, v); put(g, mat);
  };
  const extrude = (shape, depth) => new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: near ? 12 : 6 });

  // ---- Head house: two wings with arcaded fronts, a raised end pavilion at each end, and the central block ----
  const WT = D.wingTop;
  const wingBlocks = [[-96.4, -74.9, D.endFace], [-75.4, -29.0, D.wingFace], [28.2, 75.1, D.wingFace], [74.6, 96.4, D.endFace]];
  for (const [u0, u1, vf] of wingBlocks) {
    box('stone', u0, u1, 0, WT, -39, vf, ['bottom'], { top: 'tar' });
    box('base', u0, u1, 0, 1.2, vf - 0.2, vf + 0.35, ['bottom', 'north', 'west', 'east']);   // water table
  }
  box('stone', -29.2, 28.6, 0, WT, -39, D.pavBack, ['bottom'], { top: 'tar' });
  // Wing parapets and cornices; bays of arched doors over rectangular windows between flat pilasters.
  function wingFace(u0, u1, vf, pitch) {
    const nb = Math.max(1, Math.round((u1 - u0) / pitch)), pw = (u1 - u0) / nb;
    box('trim', u0, u1, 12.9, WT, vf, vf + 0.8, ['bottom', 'north']);                       // cornice
    box('stone', u0, u1, WT, D.parapetTop, vf - 0.5, vf + 0.2, ['bottom', 'north'], { top: 'trim' });
    for (let i = 0; i <= nb; i++) {
      const u = Math.min(u1 - 0.45, Math.max(u0 + 0.45, u0 + i * pw));
      if (near || i % 2 === 0) box('trim', u - 0.45, u + 0.45, 1.2, 12.9, vf, vf + 0.4, ['bottom', 'north']);
    }
    for (let i = 0; i < nb; i++) {
      const cu = u0 + (i + 0.5) * pw, w = Math.min(3.6, pw - 2.0);
      glaze('glow', cu, w, 1.25, 1.25 + 4.4 + w / 2, vf + 0.15);
      // Upper windows: kept as separate quads in far too, so the wing walls keep their bay rhythm.
      quad('glass', cu - 0.85, cu + 0.85, 8.4, 11.6, vf + 0.15);
      if (near) box('trim', cu - 1.15, cu + 1.15, 8.1, 8.4, vf, vf + 0.3, ['bottom', 'north']);
    }
  }
  wingFace(-96.4, -74.9, D.endFace, 5.4); wingFace(-75.4, -29.6, D.wingFace, 5.75);
  wingFace(29.6, 75.1, D.wingFace, 5.75); wingFace(74.6, 96.4, D.endFace, 5.4);
  // Corner returns of the end pavilions carry the cornice around.
  for (const [u, s] of [[-96.4, -1], [96.4, 1]]) box('trim', u + (s < 0 ? 0 : -0.8), u + (s < 0 ? 0.8 : 0), 12.9, WT, -39, D.endFace, ['bottom'], { top: 'tar' });

  // ---- Central pavilion: the triple portal after the Arch of Constantine ----
  const [pu0, pu1] = D.pavU, H = D.entablature[0];
  const wall = new THREE.Shape();
  wall.moveTo(pu0, 0);
  for (const [cu, w, crown] of D.arches) {
    const pts = archPts(cu, w, 0, crown - w / 2, crown);
    for (const p of pts) wall.lineTo(p.x, p.y);
  }
  wall.lineTo(pu1, 0); wall.lineTo(pu1, H); wall.lineTo(pu0, H); wall.closePath();
  { const g = extrude(wall, D.pavFront - D.pavBack); g.translate(0, 0, D.pavBack); put(g, 'stone'); }
  // Portal glazing set back in each opening (lit amber at night), with a transom and door mullions.
  for (const [cu, w, crown] of D.arches) {
    glaze('glow', cu, w - 0.1, 0.35, crown - 0.05, D.pavBack + 0.8);
    if (near && w > 5) {
      const spring = crown - w / 2;
      box('glass', cu - 0.12, cu + 0.12, 0.35, crown - 0.1, D.pavBack + 0.6, D.pavBack + 1.0, ['bottom', 'north']);
      for (const y of [3.0, spring]) box('glass', cu - w / 2 + 0.05, cu + w / 2 - 0.05, y - 0.1, y + 0.1, D.pavBack + 0.6, D.pavBack + 1.0, ['bottom', 'north']);
      for (const s of [-1, 1]) box('glass', cu + s * w / 4 - 0.07, cu + s * w / 4 + 0.07, 0.35, spring, D.pavBack + 0.6, D.pavBack + 1.0, ['bottom', 'north']);
    }
  }
  // Archivolt bands round the three main openings.
  if (near) for (const [cu, w, crown] of D.arches.slice(1, 4)) {
    const rx = w / 2, ry = crown - (crown - w / 2), spring = crown - w / 2, inner = [], outer = [];
    for (let i = 0; i <= 14; i++) { const t = Math.PI - Math.PI * i / 14; inner.push([cu + rx * Math.cos(t), spring + (crown - spring) * Math.sin(t)]); outer.push([cu + (rx + 0.8) * Math.cos(t), spring + (crown - spring + 0.8) * Math.sin(t)]); }
    const sh = new THREE.Shape([...inner, ...outer.reverse()].map(([x, y]) => new THREE.Vector2(x, y)));
    const g = extrude(sh, 0.3); g.translate(0, 0, D.pavFront); put(g, 'trim'); void ry;
  }
  // Entablature (projecting over the columns), attic, cornice and the inscription panels.
  box('trim', pu0, pu1, D.entablature[0], D.entablature[1], D.pavBack, D.pavFront + 1.0, ['bottom']);
  box('stone', pu0 + 0.4, pu1 - 0.4, D.entablature[1], 24.4, D.pavBack, D.pavFront, ['bottom']);
  box('trim', pu0 - 0.2, pu1 + 0.2, 24.4, D.atticTop, D.pavBack, D.pavFront + 0.7, ['bottom']);
  for (let i = 0; i < 5; i++) {
    const a = i === 0 ? pu0 + 1.2 : D.columns[i - 1] + 2.1, c = i === 4 ? pu1 - 1.2 : D.columns[i + 1] - 2.1;
    if (i === 0 || i === 5 - 1) continue;                  // outer bays stay plain
    box('base', a, c, 21.2, 23.6, D.pavFront - 0.05, D.pavFront + 0.12, ['bottom', 'north']);
  }
  // Six free-standing Corinthian columns on plinths, a projecting entablature block and a statue above each.
  for (const u of D.columns) {
    box('base', u - 1.6, u + 1.6, 0, 2.2, D.colV - 1.6, D.colV + 1.6, ['bottom']);
    const seg = near ? 24 : 8, levels = near ? 3 : 1, y0 = 2.2, y1 = 16.0, pos = [], idx = [];
    for (let j = 0; j <= levels; j++) {
      const t = j / levels, r = 1.2 - 0.17 * t + 0.04 * Math.sin(Math.PI * t);
      for (let i = 0; i <= seg; i++) { const a = 2 * Math.PI * i / seg, rr = near && i % 2 ? r - 0.07 : r; pos.push(u + rr * Math.cos(a), y0 + (y1 - y0) * t, D.colV + rr * Math.sin(a)); if (j && i) { const p = (j - 1) * (seg + 1) + i - 1, q = j * (seg + 1) + i - 1; idx.push(p, q, p + 1, p + 1, q, q + 1); } }
    }
    const shaft = new THREE.BufferGeometry(); shaft.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); shaft.setIndex(idx); shaft.computeVertexNormals(); put(shaft, 'stone');
    lathe('trim', u, D.colV, [[1.0, 15.95], [1.08, 16.1], [1.25, 16.6], [1.5, 17.2], [1.55, 17.45], [0, 17.45]], near ? 16 : 8);
    box('trim', u - 1.75, u + 1.75, 17.45, 17.6, D.colV - 1.75, D.colV + 1.75, ['bottom']);
    box('trim', u - 2.05, u + 2.05, D.entablature[0], D.entablature[1], D.pavFront, D.colV + 1.9, ['bottom', 'north'], { top: 'trim' });
  }
  // Statues: robed figures, about 5.2 m, on pedestals over the columns (Prometheus, Thales, Themis, Apollo, Ceres, Archimedes).
  const attrs = ['torch', 'sphere', 'staff', 'lyre', 'sheaf', 'lever'];
  D.columns.forEach((u, i) => {
    const y0 = D.entablature[1], v = D.colV - 0.2;
    box('trim', u - 1.4, u + 1.4, y0, y0 + 1.1, v - 1.4, v + 1.4, ['bottom']);
    const yb = y0 + 1.1;
    // Robe flaring at the hem, pinched at the waist, broad square shoulders, a narrow neck and a full head: the
    // silhouette has to read against the attic of the same white granite, so the waist and neck are cut deep.
    lathe('trim', u, v, [[0, yb], [1.0, yb], [1.08, yb + 0.45], [0.82, yb + 1.7], [0.62, yb + 2.65], [0.84, yb + 3.3],
      [0.98, yb + 3.62], [0.72, yb + 3.86], [0.24, yb + 3.98], [0.22, yb + 4.08], [0, yb + 4.08]], near ? 10 : 6);
    const head = new THREE.SphereGeometry(0.48, near ? 8 : 5, near ? 6 : 4); head.translate(u, yb + 4.5, v); put(head, 'trim');
    const side = i % 2 ? -1 : 1;
    rod('trim', [u + side * 0.62, yb + 3.55, v], [u + side * 1.3, yb + 5.0, v], 0.21, near ? 6 : 4);  // raised arm, both LODs
    if (near && (attrs[i] === 'staff' || attrs[i] === 'lever')) rod('trim', [u - side * 1.1, yb, v + 0.3], [u - side * 1.1, yb + 5.2, v + 0.3], 0.07);
  });

  // ---- Main Hall: barrel vault parallel to the facade, 219 x 120 ft, segmental in section ----
  const [hu0, hu1] = D.hallU, [hv0, hv1] = D.hallV;
  box('stone', hu0, hu1, WT, D.hallSpring, hv0, hv1, ['bottom', 'top']);
  const vc = (hv0 + hv1) / 2, half = (hv1 - hv0) / 2, rise = D.hallCrown - D.hallSpring, R = (half * half + rise * rise) / (2 * rise);
  const arcY = (vv) => D.hallSpring + Math.sqrt(R * R - vv * vv) - (R - rise);
  const n = near ? 20 : 10, pos = [], idx = [];
  for (let i = 0; i <= n; i++) { const vv = -half + 2 * half * i / n, y = arcY(vv); pos.push(hu0, y, vc + vv, hu1, y, vc + vv); if (i) { const p = (i - 1) * 2, q = i * 2; idx.push(p, q, p + 1, p + 1, q, q + 1); } }
  const vault = new THREE.BufferGeometry(); vault.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); vault.setIndex(idx); vault.computeVertexNormals(); put(vault, 'roof');
  // Standing-seam ribs over the vault (near only): thin prisms following the arc.
  if (near) for (let u = hu0 + 3.1; u < hu1; u += 4.4) {
    const yc = D.hallSpring - (R - rise), m = 14, ps = [];
    for (let i = 0; i <= m; i++) { const vv = -half + 2 * half * i / m, y = arcY(vv), d = new THREE.Vector2(vv, y - yc).normalize(); ps.push([vc + vv, y, d.x, d.y]); }
    const P = [], I = [];
    for (const [v, y, dv, dy] of ps) for (const du of [-0.22, 0.22]) { P.push(u + du, y - 0.05, v); P.push(u + du, y + 0.2 * dy + 0.0, v + 0.2 * dv); }
    // per sample: 0 base-left, 1 top-left, 2 base-right, 3 top-right
    for (let i = 0; i < m; i++) { const a = i * 4, c = a + 4; I.push(a + 1, a + 3, c + 1, a + 3, c + 3, c + 1, a, a + 1, c, a + 1, c + 1, c, a + 2, c + 2, a + 3, a + 3, c + 2, c + 3); }
    const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); rg.setIndex(I); rg.computeVertexNormals(); put(rg, 'trim');
  }
  // Gable end walls, with a thermal-window lunette and a raised archivolt band along the arch.
  const prof = []; for (let i = 0; i <= n; i++) { const vv = -half + 2 * half * i / n; prof.push([vc + vv, arcY(vv)]); }
  for (const s of [-1, 1]) {
    const uE = s < 0 ? hu0 : hu1, sx = s < 0 ? 1 : -1;       // shape x = sx * v; rotateY keeps the outward normal
    const orient = (g, off) => { g.rotateY(s < 0 ? -Math.PI / 2 : Math.PI / 2); g.translate(uE + s * off, 0, 0); put(g, 'stone'); return g; };
    const capShape = new THREE.Shape([new THREE.Vector2(sx * hv0, WT - 0.2), new THREE.Vector2(sx * hv1, WT - 0.2), ...prof.slice().reverse().map(([v, y]) => new THREE.Vector2(sx * v, y))]);
    orient(new THREE.ShapeGeometry(capShape), 0);
    if (near) {
      const band = [...prof.map(([v, y]) => [v, y - 0.2]), ...prof.map(([v, y]) => [v, y - 1.6]).reverse()].map(([v, y]) => new THREE.Vector2(sx * v, y));
      const bg = new THREE.ExtrudeGeometry(new THREE.Shape(band), { depth: 0.3, bevelEnabled: false }); orient(bg, 0);
    }
    // thermal window
    const lun = []; for (let i = 0; i <= 12; i++) { const t = Math.PI * i / 12; lun.push(new THREE.Vector2(sx * (vc + 6.2 * Math.cos(t)), 17.4 + 6.2 * Math.sin(t))); }
    const lg = new THREE.ShapeGeometry(new THREE.Shape(lun)); lg.rotateY(s < 0 ? -Math.PI / 2 : Math.PI / 2); lg.translate(uE + s * 0.15, 0, 0); put(lg, 'glow');
  }

  // ---- Rear concourse: low flat shell the length of the head house (OSM height 7.25 m) ----
  const outline = [[-103.2, -39], [-103.2, -79.3], [-99.4, -89.2], [-94.9, -93.4], [-94.9, -94.1], [93.1, -93.8], [96.2, -92], [96.2, -39]];
  const cs = new THREE.Shape(outline.map(([u, v]) => new THREE.Vector2(u, -v)));          // shape y = -v so that after rotateX(-90) z = v
  const cg = new THREE.ExtrudeGeometry(cs, { depth: D.concourseTop, bevelEnabled: false });
  cg.rotateX(-Math.PI / 2); put(cg, 'stone');
  const roofGeo = new THREE.ShapeGeometry(cs); roofGeo.rotateX(-Math.PI / 2); roofGeo.translate(0, D.concourseTop + 0.02, 0); put(roofGeo, 'tar');
  // The extrusion's own cap is dropped by covering it: roofGeo sits 2 cm above it only on the roof plane (cap faces the same way, so offset >= 2 cm is enough).
  box('glass', -88, 88, D.concourseTop, D.concourseTop + 0.9, -80, -74, ['bottom']);
  box('glass', -88, 88, D.concourseTop, D.concourseTop + 0.9, -66, -60, ['bottom']);
  box('trim', -1.3 - 1.6, -1.3 + 1.6, D.concourseTop, D.concourseTop + 2.7, -72.9 - 1.5, -72.9 + 1.5, ['bottom']);   // OSM elevator housing
  // Rear wall windows, facing out (toward -v), at the same 6 m bays in both LODs so the back is not a blank slab.
  for (let u = -92; u <= 90; u += 6) { const g = new THREE.PlaneGeometry(1.6, 2.8); g.rotateY(Math.PI); g.translate(u, 3.8, -94.1 + (u + 94.9) * 0.3 / 188 - 0.15); put(g, 'glass'); }   // wall runs v -94.1 -> -93.8
  // Stylobate before the pavilion.
  box('base', -30.8, 30.0, 0, 0.5, D.pavBack, 32.3, ['bottom']);
  return b.finish();
}
