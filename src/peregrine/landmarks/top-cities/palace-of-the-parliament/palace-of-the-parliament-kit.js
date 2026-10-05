import * as THREE from 'three';
import {
  SHELL, COURTS, H, PIANO, UPPER, BASTION_ROWS, SETBACK_TIERS, TOWER_ROWS, BAY, COL_BAY,
  SCREEN, BULK, PORTICO, RECESS_X0, RECESS_X1, WING_Z, BASTION_RINGS,
} from './palace-of-the-parliament-plan.js';

// Palace of the Parliament, authored in the building frame (+x north along the Unirii front,
// +z east out of that front, y up). geometry.js applies the one rotateY onto the mapped ring.
// Quads are batched per material. Far reuses stone for trim and stoneDark so it stays at 8 draws.
export function build(b, near) {
  const T = near ? 'trim' : 'stone';
  const D = near ? 'stoneDark' : 'stone';
  const buckets = new Map();
  const bucket = (m) => {
    let k = buckets.get(m);
    if (!k) { k = { p: [], n: [], i: [] }; buckets.set(m, k); }
    return k;
  };
  const tri = (m, a, c, d, n) => {
    const k = bucket(m), o = k.p.length / 3;
    k.p.push(a[0], a[1], a[2], c[0], c[1], c[2], d[0], d[1], d[2]);
    k.n.push(n[0], n[1], n[2], n[0], n[1], n[2], n[0], n[1], n[2]);
    k.i.push(o, o + 1, o + 2);
  };
  const quad = (m, a, c, d, e, n) => {
    const k = bucket(m), o = k.p.length / 3;
    for (const v of [a, c, d, e]) { k.p.push(...v); k.n.push(...n); }
    k.i.push(o, o + 1, o + 2, o, o + 2, o + 3);
  };
  const flush = () => {
    for (const [m, k] of buckets) {
      if (!k.i.length) continue;
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(k.p, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(k.n, 3));
      g.setIndex(k.i);
      b.put(g, m);
    }
  };

  const edgeOf = (a, c) => {
    const dx = c[0] - a[0], dz = c[1] - a[1], len = Math.hypot(dx, dz);
    if (len < 0.2) return null;
    return { a, c, len, tx: dx / len, tz: dz / len, nx: dz / len, nz: -dx / len };
  };
  const ringEdges = (ring) => ring.map((p, i) => edgeOf(p, ring[(i + 1) % ring.length])).filter(Boolean);
  // Point on an edge: t along it from a toward c, y up, d outward.
  const at = (e, t, y, d) => [
    e.a[0] + e.tx * t + e.nx * d,
    y,
    e.a[1] + e.tz * t + e.nz * d,
  ];
  const face = (e, y0, y1, m) => quad(m,
    [e.a[0], y0, e.a[1]], [e.a[0], y1, e.a[1]], [e.c[0], y1, e.c[1]], [e.c[0], y0, e.c[1]],
    [e.nx, 0, e.nz]);
  // Horizontal band standing proud of a wall. Close exposed ends and the inner parapet face.
  const slab = (e, y0, y1, d0, d1, m) => {
    if (y1 - y0 < 0.02 || d1 - d0 < 0.02) return;
    const ext = Math.min(0.5, e.len * 0.2);
    const t0 = -ext, t1 = e.len + ext;
    const N = [e.nx, 0, e.nz];
    quad(m, at(e, t0, y0, d1), at(e, t0, y1, d1), at(e, t1, y1, d1), at(e, t1, y0, d1), N);
    quad(m, at(e, t0, y1, d0), at(e, t1, y1, d0), at(e, t1, y1, d1), at(e, t0, y1, d1), [0, 1, 0]);
    if (y0 > 0.04) quad(m, at(e, t0, y0, d0), at(e, t0, y0, d1), at(e, t1, y0, d1), at(e, t1, y0, d0), [0, -1, 0]);
    if (d0 > 0.08 || d0 < 0) quad(m, at(e, t1, y0, d0), at(e, t1, y1, d0), at(e, t0, y1, d0), at(e, t0, y0, d0), [-e.nx, 0, -e.nz]);
    quad(m, at(e, t0, y0, d0), at(e, t0, y1, d0), at(e, t0, y1, d1), at(e, t0, y0, d1), [-e.tx, 0, -e.tz]);
    quad(m, at(e, t1, y0, d1), at(e, t1, y1, d1), at(e, t1, y1, d0), at(e, t1, y0, d0), [e.tx, 0, e.tz]);
  };
  const pane = (e, t, y0, y1, w, d, m) => quad(m,
    at(e, t - w / 2, y0, d), at(e, t - w / 2, y1, d), at(e, t + w / 2, y1, d), at(e, t + w / 2, y0, d),
    [e.nx, 0, e.nz]);
  // Full semicircular head, so the arch reads at street distance and not as a flat top.
  const archPane = (e, t, y0, h, w, d, m) => {
    const rise = w * 0.5;
    const spring = Math.max(0.5, h - rise);
    pane(e, t, y0, y0 + spring, w, d, m);
    const segs = near ? 5 : 3;
    const N = [e.nx, 0, e.nz];
    const fan = at(e, t, y0 + spring, d);
    for (let s = 0; s < segs; s++) {
      const a0 = Math.PI * (1 - s / segs), a1 = Math.PI * (1 - (s + 1) / segs);
      tri(m, fan,
        at(e, t + Math.cos(a0) * (w / 2), y0 + spring + Math.sin(a0) * rise, d),
        at(e, t + Math.cos(a1) * (w / 2), y0 + spring + Math.sin(a1) * rise, d), N);
    }
  };
  const rhythm = (len, bay = BAY) => {
    const inset = Math.min(1.15, len * 0.08);
    const usable = len - inset * 2;
    if (usable < 2.4) return null;
    const bays = Math.max(1, Math.round(usable / bay));
    const step = usable / bays;
    const cols = [], wins = [];
    for (let i = 0; i <= bays; i++) cols.push(inset + step * i);
    for (let i = 0; i < bays; i++) wins.push(inset + step * (i + 0.5));
    return { bays, step, cols, wins };
  };
  const xAt = (e, t) => e.a[0] + e.tx * t;

  // Giant order. Shafts stand proud of the wall; the bay behind them is glass, set back.
  const colonnade = (e, skip) => {
    const r = rhythm(e.len, COL_BAY);
    if (!r || e.len < 12) return;
    const shaft = H.ent0 - 1.35;
    r.cols.forEach((t, i) => {
      if (skip && skip(xAt(e, t))) return;
      if (!near && i % 2 === 1 && i !== r.cols.length - 1) return;
      const p = at(e, t, 0, 0.78);
      const g = new THREE.CylinderGeometry(0.7, 0.7, shaft, near ? 12 : 5, 1, true);
      g.translate(p[0], 1.35 + shaft / 2, p[2]);
      b.put(g, 'stone');
    });
    r.wins.forEach((t, i) => {
      if (skip && skip(xAt(e, t))) return;
      const mat = i % 3 === 0 ? 'glow' : 'glass';
      const w = Math.min(5.6, r.step * 0.64);
      for (const [y0, y1] of [[2.05, 7.3], [8.65, 14.0], [15.35, H.ent0 - 0.4]]) {
        pane(e, t, y0, y1, w, 0.05, mat);
        // Stone jambs and central sash stay behind the giant shafts in both LODs.
        if (near) {
          pane(e, t - w / 2 - 0.13, y0 - 0.1, y1 + 0.1, 0.24, 0.2, T);
          pane(e, t + w / 2 + 0.13, y0 - 0.1, y1 + 0.1, 0.24, 0.2, T);
          pane(e, t, y0, y1, 0.13, 0.23, T);
        }
      }

    });
  };
  const windows = (e, rows, { frames, arches, skip, bay }) => {
    const r = rhythm(e.len, bay || BAY);
    if (!r) return;
    rows.forEach((row, ri) => {
      r.wins.forEach((t, i) => {
        if (!near && e.nz < 0.5 && i % 2 === 1) return;
        if (skip && skip(xAt(e, t), row)) return;
        const w = Math.min(row.w, r.step * 0.68);
        const mat = row.glow || row.arch || i % 3 === 0 ? 'glow' : 'glass';
        if (row.arch && arches) archPane(e, t, row.y, row.h, w, 0.18, mat);
        else pane(e, t, row.y, row.y + row.h, w, 0.18, mat);
        if (!frames) return;
        pane(e, t, row.y - 0.22, row.y + 0.05, w + 0.5, 0.36, T);
        if (!row.arch) pane(e, t, row.y + row.h - 0.02, row.y + row.h + 0.26, w + 0.5, 0.36, T);
      });
      if (frames && ri + 1 < rows.length) {
        const gap0 = row.y + row.h + 0.35, gap1 = rows[ri + 1].y - 0.3;
        if (gap1 - gap0 > 0.35) slab(e, (gap0 + gap1) / 2 - 0.16, (gap0 + gap1) / 2 + 0.16, 0.04, 0.24, T);
      }
    });
  };
  const order = (e) => {
    slab(e, 0, 1.55, 0, 0.4, D);
    if (near) slab(e, H.ent0 - 0.7, H.ent0, 0.04, 0.34, 'stone');
    slab(e, H.ent0, H.ent1, 0.04, 1.52, T);
  };
  // The band that separates the arched piano nobile from the rectangular floors above it.
  const tier = (e, y) => slab(e, y, y + 1.25, 0.06, 1.12, T);
  const crown = (e, y0, y1) => {
    if (near) slab(e, y0 - 1.35, y0 - 0.55, 0.02, 0.5, T);
    slab(e, y0 - 0.55, y0, 0.02, 0.95, T);
    slab(e, y0, y1, -0.8, 0.42, 'stone');
  };
  const isRecess = (e) => {
    const mx = (e.a[0] + e.c[0]) / 2;
    return e.nz > 0.9 && e.len > 20 && mx > RECESS_X0 + 1 && mx < RECESS_X1 - 1;
  };
  const rich = (e) => e.nz > 0.35 || Math.abs(e.nx) > 0.6;

  const bastionEdge = (e) => (e.a[1] + e.c[1]) / 2 > 94;
  const dress = (e, roof, parapet, rows, { arches = true, frames } = {}) => {
    if (e.len < 5) return;
    const show = frames ?? (near && rich(e));
    order(e);
    colonnade(e);
    // The continuous giant shafts span three storeys; balcony bands/spandrels
    // cross only the recessed wall plane, behind their outer surface.
    for (const y of [7.3, 14.0]) {
      slab(e, y, y + 1.35, 0.04, 0.3, 'stone');
      if (near) pane(e, e.len / 2, y + 0.15, y + 0.42, e.len, 0.45, T);
    }
    windows(e, [PIANO], { frames: show, arches, bay: COL_BAY });
    tier(e, 33.45);
    if (rows.length) windows(e, rows, { frames: show, arches, bay: BAY });
    crown(e, roof, parapet);
  };

  // ---- shell: bastions at 40 m, outer wings at 48 m, courts open ----
  for (const e of ringEdges(SHELL)) {
    if (isRecess(e)) continue;
    const bastion = bastionEdge(e);
    const roof = bastion ? H.bastionRoof : H.wingRoof;
    const parapet = bastion ? H.bastion : H.wing;
    face(e, 0, roof, 'stone');
    dress(e, roof, parapet, bastion ? BASTION_ROWS : UPPER, { arches: near || e.nz > 0.5 });
  }
  for (const court of COURTS) {
    for (const e of ringEdges(court)) face(e, 0, H.wingRoof, 'stone');
    const cx = court.reduce((s, p) => s + p[0], 0) / court.length;
    const cz = court.reduce((s, p) => s + p[1], 0) / court.length;
    for (let i = 0; i < court.length; i++) {
      const a = court[i], c = court[(i + 1) % court.length];
      const n = new THREE.Vector3(c[0] - cx, 0, c[1] - cz).cross(new THREE.Vector3(a[0] - cx, 0, a[1] - cz));
      const A = [cx, 0.16, cz], B = [a[0], 0.16, a[1]], C = [c[0], 0.16, c[1]];
      // (C-center) × (A-center) points up when A,B,C faces the ground, so that branch swaps.
      if (n.y >= 0) tri('void', A, C, B, [0, 1, 0]);
      else tri('void', A, B, C, [0, 1, 0]);
    }
  }

  const rect = (s) => [[s.x0, s.z0], [s.x1, s.z0], [s.x1, s.z1], [s.x0, s.z1]];
  // The footprint shell supports the broad first tier; omit the buried roof
  // rather than laying a second coplanar plate beneath the courtyard walls.
  cap(SHELL, [rect(SETBACK_TIERS[0]), ...BASTION_RINGS], H.wingRoof, 'stone');
  for (const ring of BASTION_RINGS) {
    cap(ring, [], H.bastionRoof, 'stone');
    let step = edgeOf(ring[ring.length - 1], ring[0]);
    if (step && step.nz < 0) step = edgeOf(ring[0], ring[ring.length - 1]);
    if (step) face(step, H.bastionRoof, H.wingRoof, 'stone');
  }

  // Ground-level central frontage joins the outer wing but its roof now leads
  // into a succession of setback terraces, rather than one full-height screen.
  const front = edgeOf([SCREEN.x1, SCREEN.z1], [SCREEN.x0, SCREEN.z1]);
  boxFaces(SCREEN.x0, SCREEN.x1, 0, H.wingRoof, SCREEN.z0, SCREEN.z1, 'stone', 'bud');
  dress(front, H.wingRoof, H.wing, UPPER, { arches: true, frames: near });

  // Full intermediate volumes: broad 58/66 m courtyard rings, both with
  // visible two-storey facades and profiled cornices.
  for (let i = 0; i < SETBACK_TIERS.length; i++) {
    const s = SETBACK_TIERS[i], ring = rect(s);
    for (const e of ringEdges(ring)) {
      face(e, s.base, s.roof, 'stone');
      windows(e, s.rows, { frames: near, arches: true, bay: BAY });
      for (const y of [s.base + 0.2, s.rows[0].y + s.rows[0].h + 0.3]) slab(e, y, y + 0.45, 0.04, 0.5, T);
      crown(e, s.roof, s.top);
    }
    if (s.courts) for (const court of COURTS) for (const e of ringEdges(court)) face(e, s.base, s.roof, 'stone');
    const next = i + 1 < SETBACK_TIERS.length ? SETBACK_TIERS[i + 1] : BULK;
    // Every terrace surrounds the courts and its smaller next tier.
    cap(ring, [...(s.courts ? COURTS : []), rect(next)], s.roof, 'stone');
  }

  const topRing = rect(BULK);
  for (const e of ringEdges(topRing)) {
    face(e, SETBACK_TIERS[1].roof, H.towerRoof, 'stone');
    windows(e, TOWER_ROWS, { frames: near, arches: true, bay: BAY });
    slab(e, 77.25, 77.7, 0.04, 0.52, T);
    crown(e, H.towerRoof, H.tower);
  }
  cap(topRing, [], H.towerRoof, 'stone');

  // Door in the screen, behind the portico.
  const doorT = front.len / 2;
  pane(front, doorT, 0.4, 12.4, 8.2, 0.12, 'void');
  if (near) {
    pane(front, doorT - 4.5, 0.3, 12.8, 0.55, 0.5, T);
    pane(front, doorT + 4.5, 0.3, 12.8, 0.55, 0.5, T);
    pane(front, doorT, 12.45, 13.05, 9.4, 0.5, T);
  }

  // Portico, both LODs, kept inside the wing front so it does not change the footprint envelope.
  const px0 = PORTICO.x0, px1 = PORTICO.x1, pz0 = PORTICO.z0, pz1 = PORTICO.z1;
  const shaft = H.ent0 - 1.35;
  boxFaces(px0, px1, 0, 1.35, pz0, pz1, 'stone', 'bd');
  boxFaces(px0 - 0.45, px1 + 0.45, H.ent0, H.ent1, pz0 + 0.2, pz1 + 0.55, T, 'bd');
  boxFaces(px0 - 0.2, px1 + 0.2, H.ent1, H.ent1 + 1.15, pz0 + 0.15, pz1 + 0.25, 'stone', 'bd');
  const pN = 8;
  for (let i = 0; i < pN; i++) {
    const x = px0 + 1.6 + (px1 - px0 - 3.2) * (i + 0.5) / pN;
    const g = new THREE.CylinderGeometry(0.92, 0.92, shaft, near ? 12 : 5, 1, true);
    g.translate(x, 1.35 + shaft / 2, pz1 - 1.35);
    b.put(g, 'stone');
  }
  if (near) {
    for (let i = 0; i < 5; i++) flag(px0 + 3 + i * (px1 - px0 - 6) / 4, H.ent1 + 0.2, pz1 - 0.15, 0.42, 0.7);
  }

  // Roof flag. Hoist (blue) is the south end; the cloth flies north. The pole is the highest point.
  const hx = (SCREEN.x0 + SCREEN.x1) / 2;
  const hz = BULK.z1 - 2.4;
  b.box('iron', [hx - 2.55, (H.towerRoof + H.pole) / 2, hz], [0.36, H.pole - H.towerRoof, 0.36]);
  flag(hx - 2.15, 84.6, hz, 1.8, 3.15);

  flush();

  // Faces of an axis-aligned box. Letters: +z e-front, -z back, +x north, -x south, u, d.
  // Winding matches an outward normal (CCW when the normal points at the viewer).
  function boxFaces(x0, x1, y0, y1, z0, z1, m, omit) {
    const q = (a, c, d, e, n) => quad(m, a, c, d, e, n);
    if (!omit.includes('e')) q([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1]);
    if (!omit.includes('b')) q([x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [0, 0, -1]);
    if (!omit.includes('n')) q([x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [1, 0, 0]);
    if (!omit.includes('s')) q([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [-1, 0, 0]);
    if (!omit.includes('u')) q([x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0], [0, 1, 0]);
    if (!omit.includes('d')) q([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0]);
  }
  // Three stripes, blue at the hoist (smaller x), cloth flying +x. Thickness is in z; both faces show.
  function flag(x, y, z, stripe, h) {
    const t = 0.06;
    for (const [m, i] of [['sign', 0], ['flagY', 1], ['flagR', 2]]) {
      const x0 = x + i * stripe;
      boxFaces(x0, x0 + stripe - 0.02, y, y + h, z - t / 2, z + t / 2, m, '');
    }
  }
  function cap(outer, holes, y, m) {
    const pts = (ring) => ring.map(([x, z]) => new THREE.Vector2(x, -z));
    const area = (p) => {
      let a = 0;
      for (let i = 0, j = p.length - 1; i < p.length; j = i++) a += p[j].x * p[i].y - p[i].x * p[j].y;
      return a;
    };
    const outerPts = pts(outer);
    const shape = new THREE.Shape(outerPts);
    const sign = Math.sign(area(outerPts)) || 1;
    for (const hole of holes) {
      let h = pts(hole);
      if (Math.sign(area(h)) === sign) h = h.slice().reverse();
      shape.holes.push(new THREE.Path(h));
    }
    const g = new THREE.ShapeGeometry(shape);
    g.rotateX(-Math.PI / 2);
    g.translate(0, y, 0);
    const p = g.attributes.position, idx = g.index;
    // Shape triangulation around holes is not one winding. Face each triangle up on its own.
    if (idx && idx.count >= 3) {
      for (let i = 0; i < idx.count; i += 3) {
        const i0 = idx.getX(i), i1 = idx.getX(i + 1), i2 = idx.getX(i + 2);
        const ny = (p.getZ(i1) - p.getZ(i0)) * (p.getX(i2) - p.getX(i0)) - (p.getX(i1) - p.getX(i0)) * (p.getZ(i2) - p.getZ(i0));
        if (ny < 0) { idx.setX(i + 1, i2); idx.setX(i + 2, i1); }
      }
    }
    g.computeVertexNormals();
    b.put(g, m);
  }
}
