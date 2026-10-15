// Casa Presei Libere, the 1956 Stalinist printing house north of Bucharest.
// Masses follow the mapped parts: a 50 m central block, four roof turrets, a
// stepped tower and a spire to the published 91.6 m shoulder, then the 12.4 m
// television antenna. Wings stay at their tagged 24 m; the tempiettos on the
// outer ends are an estimate (OSM flattens them into the wing).
import * as THREE from 'three';
import { PARTS, H, ANGLE, FACADE, SPIRE, TOWER, xzOf, uvOf } from './casa-presei-libere-plan.js';

const PROUD = { near: 0.4, far: 0.72 };
const PIL = { near: 0.52, far: 0.8 };
const CORN = 0.86;

function area(ring) {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) a += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
  return a / 2;
}
function ccw(ring) { return area(ring) < 0 ? ring.slice().reverse() : ring.slice(); }
export function inside(ring, x, z) {
  let c = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, zi] = ring[i], [xj, zj] = ring[j];
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c;
  }
  return c;
}
function edgesOf(ring) {
  const out = [];
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], c = ring[(i + 1) % ring.length];
    const dx = c[0] - a[0], dz = c[1] - a[1], len = Math.hypot(dx, dz);
    if (len < 0.35) continue;
    const tx = dx / len, tz = dz / len;
    out.push({ a, c, len, tx, tz, nx: tz, nz: -tx, mx: (a[0] + c[0]) / 2, mz: (a[1] + c[1]) / 2 });
  }
  return out;
}
function at(e, t, y, d) {
  return [e.a[0] + e.tx * t + e.nx * d, y, e.a[1] + e.tz * t + e.nz * d];
}
// Lower neighbours bury only the lower wall. Keep the exposed storeys above
// each adjoining wing; deleting the whole edge left the west flank blank.
function exposedSpans(edge, part, y0, y1) {
  let spans = [[y0, y1]];
  const x = edge.mx + edge.nx * 0.75, z = edge.mz + edge.nz * 0.75;
  for (const o of PARTS) {
    if (o === part || !inside(o.ring, x, z)) continue;
    spans = spans.flatMap(([a, b]) => {
      if (o.min >= b || o.h <= a) return [[a, b]];
      return [[a, Math.min(b, o.min)], [Math.max(a, o.h), b]].filter(([lo, hi]) => hi - lo > 0.05);
    });
  }
  return spans;
}
function baysOf(len, bay) {
  const inset = Math.min(1.35, Math.max(0.45, len * 0.07));
  const usable = len - inset * 2;
  if (usable < bay * 0.55) return null;
  const n = Math.max(1, Math.round(usable / bay));
  const step = usable / n;
  const cols = [], wins = [];
  for (let i = 0; i <= n; i++) cols.push(inset + step * i);
  for (let i = 0; i < n; i++) wins.push(inset + step * (i + 0.5));
  return { n, step, cols, wins };
}

function scheduler(h, near, arch) {
  const bay = near ? 4.4 : 8.8;
  const winW = near ? 2.15 : 4.85;
  const winH = 1.9;
  if (h >= 40) {
    const rows = [];
    for (let y = 9.95; y + winH < 45.5; y += 3.24) rows.push([y, y + winH]);
    return {
      bay, winW, winH, base: [0.25, 3.4], roof: h,
      arches: arch ? { y0: 3.5, h: 4.5, w: near ? 2.4 : 4.7 } : null,
      rows, cornice: [46.15, h + 0.45], pil: [3.45, 46.0],
    };
  }
  if (h >= 20) {
    const rows = [];
    for (let y = 4.1; y + winH < h - 2.5; y += 3.4) rows.push([y, y + winH]);
    return { bay, winW, winH, base: [0.25, 3.15], arches: null, rows, cornice: [h - 2.3, h + 0.4], pil: [3.2, h - 2.35], roof: h };
  }
  const rows = [];
  const pitch = h > 11 ? 3.3 : 2.5;
  const wh = Math.min(1.55, h * 0.34);
  for (let y = Math.min(1.8, h * 0.28); y + wh < h - 1.15; y += pitch) rows.push([y, y + wh]);
  return { bay: near ? 5.4 : 9.2, winW: near ? 2.3 : 4.6, winH: wh, base: h > 8 ? [0.2, Math.min(1.4, h * 0.22)] : null, arches: null, rows, cornice: [h - 1.05, h + 0.3], pil: null, roof: h };
}

export function build(b, near) {
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
  const quad = (m, a, c, d, e, n) => { tri(m, a, c, d, n); tri(m, a, d, e, n); };
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
  const winD = near ? PROUD.near : PROUD.far;
  const pilD = near ? PIL.near : PIL.far;

  const cap = (ring, y) => {
    const idx = THREE.ShapeUtils.triangulateShape(ring.map(([x, z]) => new THREE.Vector2(x, z)), []);
    for (const [i, j, k] of idx) {
      const a = [ring[i][0], y, ring[i][1]], c = [ring[j][0], y, ring[j][1]], d = [ring[k][0], y, ring[k][1]];
      const ny = (c[2] - a[2]) * (d[0] - a[0]) - (c[0] - a[0]) * (d[2] - a[2]);
      if (ny >= 0) tri('stone', a, c, d, [0, 1, 0]);
      else tri('stone', a, d, c, [0, 1, 0]);
    }
  };
  // Closed cornice. Outer face is trim; the rest is stone, so trim only ever
  // sits in front of stone. innerFrom is the roof: the inward parapet face
  // starts there, clear of the wall. false skips it (the host solid closes
  // the back). Omit it for a free-standing band such as the portico.
  const slab = (e, y0, y1, d0, d1, outerMat, innerFrom) => {
    y0 = Math.max(y0, e.visibleMin ?? -Infinity);
    y1 = Math.min(y1, e.visibleMax ?? Infinity);
    if (y1 - y0 < 0.04 || e.len < 0.4) return;
    const ext = Math.min(0.42, e.len * 0.18);
    const t0 = -ext, t1 = e.len + ext;
    const N = [e.nx, 0, e.nz];
    quad(outerMat, at(e, t0, y0, d1), at(e, t0, y1, d1), at(e, t1, y1, d1), at(e, t1, y0, d1), N);
    quad('stone', at(e, t0, y1, d0), at(e, t1, y1, d0), at(e, t1, y1, d1), at(e, t0, y1, d1), [0, 1, 0]);
    if (y0 > 0.05) quad('stone', at(e, t0, y0, d0), at(e, t0, y0, d1), at(e, t1, y0, d1), at(e, t1, y0, d0), [0, -1, 0]);
    if (innerFrom !== false) {
      const iy0 = typeof innerFrom === 'number' ? Math.max(y0, innerFrom) : y0;
      // Inward geometric normal, so a ray from the roof sees the parapet front.
      if (y1 - iy0 > 0.05) quad('stone', at(e, t0, iy0, d0), at(e, t1, iy0, d0), at(e, t1, y1, d0), at(e, t0, y1, d0), [-e.nx, 0, -e.nz]);
    }
    // Ends match the outer band. Stone ends landed on the neighbouring trim and cycled.
    quad(outerMat, at(e, t0, y0, d0), at(e, t0, y1, d0), at(e, t0, y1, d1), at(e, t0, y0, d1), [-e.tx, 0, -e.tz]);
    quad(outerMat, at(e, t1, y0, d1), at(e, t1, y1, d1), at(e, t1, y1, d0), at(e, t1, y0, d0), [e.tx, 0, e.tz]);
  };
  const pane = (e, t, y0, y1, w, d, mat) => {
    y0 = Math.max(y0, e.visibleMin ?? -Infinity);
    y1 = Math.min(y1, e.visibleMax ?? Infinity);
    if (w < 0.08 || y1 - y0 < 0.08) return;
    quad(mat, at(e, t - w / 2, y0, d), at(e, t - w / 2, y1, d), at(e, t + w / 2, y1, d), at(e, t + w / 2, y0, d), [e.nx, 0, e.nz]);
  };
  const arch = (e, t, y0, h, w, d, mat) => {
    if (y0 < (e.visibleMin ?? -Infinity) || y0 + h > (e.visibleMax ?? Infinity)) return;
    const rise = Math.min(w * 0.46, h * 0.42);
    const spring = h - rise;
    pane(e, t, y0, y0 + spring, w, d, mat);
    const N = [e.nx, 0, e.nz];
    const fan = at(e, t, y0 + spring, d);
    const segs = near ? 5 : 3;
    for (let s = 0; s < segs; s++) {
      const a0 = Math.PI * (1 - s / segs), a1 = Math.PI * (1 - (s + 1) / segs);
      tri(mat, fan,
        at(e, t + Math.cos(a0) * (w / 2), y0 + spring + Math.sin(a0) * rise, d),
        at(e, t + Math.cos(a1) * (w / 2), y0 + spring + Math.sin(a1) * rise, d), N);
    }
  };
  const disc = (e, t, y, r, d) => {
    const N = [e.nx, 0, e.nz];
    const c = at(e, t, y, d);
    const segs = 8;
    for (let s = 0; s < segs; s++) {
      const a0 = (s / segs) * Math.PI * 2, a1 = ((s + 1) / segs) * Math.PI * 2;
      const p = (a) => at(e, t + Math.cos(a) * r, y + Math.sin(a) * r, d);
      // Flipped so the geometric normal points outward (see facade disc note in the plan).
      tri('trim', c, p(a1), p(a0), N);
    }
  };

  const isMain = (e) => {
    if (e.len < 40) return false;
    const dot = e.nx * FACADE.nx + e.nz * FACADE.nz;
    return dot > 0.98 && Math.hypot(e.mx - (FACADE.ax + FACADE.cx) / 2, e.mz - (FACADE.az + FACADE.cz) / 2) < 3;
  };

  function dress(edges, spec) {
    for (const e of edges) {
      if (spec.base && e.len > 4) pane(e, e.len / 2, spec.base[0], spec.base[1], e.len - 0.3, near ? 0.26 : 0.6, 'base');
      if (spec.cornice) slab(e, spec.cornice[0], spec.cornice[1], 0, CORN, 'trim', spec.roof);
      const layout = baysOf(e.len, spec.bay);
      if (!layout || e.len < 3.2) continue;
      const main = spec.arches && isMain(e);
      if (spec.pil) for (const t of layout.cols) pane(e, t, spec.pil[0], spec.pil[1], near ? 0.7 : 1.05, pilD, 'trim');
      const openings = main ? spec.arches : null;
      if (openings) {
        const midT = ((FACADE.ax + FACADE.cx) / 2 - e.a[0]) * e.tx + ((FACADE.az + FACADE.cz) / 2 - e.a[1]) * e.tz;
        for (const t of layout.wins) {
          const wide = Math.abs(t - midT) < openings.w;
          // Heads stay under the portico entablature (y 8.4).
          arch(e, t, openings.y0, openings.h, wide ? openings.w + 0.5 : openings.w, winD, 'glow');
          // Star-and-grape roundels sit on the stone band above the arch, off the portico.
          if (near && Math.abs(t - midT) > 6) disc(e, t, openings.y0 + openings.h + 0.85, 0.55, 0.42);
        }
      }
      for (const [y0, y1] of spec.rows) {
        for (const t of layout.wins) {
          if (near && spec.winW > 1.5) {
            const gap = 0.22, paneW = (spec.winW - gap) / 2, off = (paneW + gap) / 2;
            pane(e, t - off, y0, y1, paneW, winD, 'glow');
            pane(e, t + off, y0, y1, paneW, winD, 'glow');
            // Mullion on the wall, behind the glass by more than the near depth gap.
            pane(e, t, y0 + 0.08, y1 - 0.08, 0.14, 0.02, 'stone');
          } else pane(e, t, y0, y1, spec.winW, winD, 'glow');
        }
      }
      if (spec.rows.length > 1 && e.len > 8) {
        for (let i = 0; i < spec.rows.length - 1; i++) {
          const y = (spec.rows[i][1] + spec.rows[i + 1][0]) / 2;
          pane(e, e.len / 2, y - 0.11, y + 0.11, e.len - 1.6, near ? 0.34 : 0.72, 'trim');
        }
      }
    }
  }

  function prism(part, y0, y1, withRoof) {
    const ring = ccw(part.ring);
    const edges = [];
    for (const edge of edgesOf(ring)) {
      for (const [lo, hi] of exposedSpans(edge, part, y0, y1)) {
        const e = { ...edge, visibleMin: lo, visibleMax: hi === y1 ? Infinity : hi };
        edges.push(e);
        quad('stone',
          [e.a[0], lo, e.a[1]], [e.a[0], hi, e.a[1]], [e.c[0], hi, e.c[1]], [e.c[0], lo, e.c[1]],
          [e.nx, 0, e.nz]);
        const d = -0.12;
        const inn = (p, y) => [p[0] + e.nx * d, y, p[1] + e.nz * d];
        quad('stone', inn(e.a, hi), inn(e.a, lo), inn(e.c, lo), inn(e.c, hi), [-e.nx, 0, -e.nz]);
      }
    }
    if (withRoof) cap(ring, y1);
    return edges;
  }

  function rectEdges(x, z, su, sv) {
    const [cu, cv] = uvOf(x, z);
    const ring = [[-su / 2, -sv / 2], [su / 2, -sv / 2], [su / 2, sv / 2], [-su / 2, sv / 2]]
      .map(([u, v]) => xzOf(cu + u, cv + v));
    return edgesOf(ccw(ring));
  }
  function stage(x, z, su, sv, y0, y1, rows) {
    b.box('stone', [x, (y0 + y1) / 2, z], [su, y1 - y0, sv], ANGLE);
    const edges = rectEdges(x, z, su, sv);
    const winH = Math.min(1.85, (y1 - y0) * 0.42);
    const spec = {
      bay: near ? 3.8 : 7.2,
      winW: near ? 1.7 : 3.6,
      winH,
      base: null,
      arches: null,
      rows: rows.map((yc) => [yc - winH / 2, yc + winH / 2]),
      cornice: [y1 - 0.7, y1 + 0.28],
      pil: rows.length ? [y0 + 0.35, y1 - 0.75] : null,
      roof: y1,
    };
    dress(edges, spec);
    return edges;
  }

  // --- wings, podium, low links ---
  for (const part of PARTS) {
    if (part.role === 'spire' || part.role === 'tower' || part.role === 'turret') continue;
    const edges = prism(part, 0, part.h, true);
    dress(edges, scheduler(part.h, near, part.role === 'base'));
    if (part.role === 'endwing') lantern(part);
  }

  // --- corner turrets on the podium roof (OSM 50–57 m) plus a pinnacle ---
  for (const part of PARTS) if (part.role === 'turret') turret(part);

  // --- wedding-cake tower, inside the 50–70 m part ---
  const tower = PARTS.find((p) => p.role === 'tower');
  const tEdges = prism(tower, H.podium, 57.8, true);
  dress(tEdges, {
    bay: near ? 3.6 : 7, winW: near ? 1.55 : 3.3, winH: 2.05,
    base: null, arches: null,
    rows: [[51.15, 53.15], [54.05, 56.15]],
    cornice: [56.45, 58.15], pil: [50.4, 56.3], roof: 57.8,
  });
  // Centroid, not a corner average: the ring is chamfered.
  let tax = 0, taz = 0, ta = 0;
  for (let i = 0, j = tower.ring.length - 1; i < tower.ring.length; j = i++) {
    const cross = tower.ring[j][0] * tower.ring[i][1] - tower.ring[i][0] * tower.ring[j][1];
    ta += cross;
    tax += (tower.ring[j][0] + tower.ring[i][0]) * cross;
    taz += (tower.ring[j][1] + tower.ring[i][1]) * cross;
  }
  const tcx = tax / (3 * ta), tcz = taz / (3 * ta);
  const tw = TOWER.u1 - TOWER.u0, td = TOWER.v1 - TOWER.v0;
  // Broad vertical belvedere, its pilaster bays carried to the crown cornice.
  stage(tcx, tcz, tw * 0.86, td * 0.86, 57.8, H.towerShaft, [59.5, 62.2, 65, 67.8]);

  spire(tcx, tcz);
  portico();
  flush();

  function lantern(part) {
    // Find a full-sized pavilion within the mapped end, rather than shrinking
    // a kiosk around its farthest polygon corner. Sample candidate centres in
    // the facade frame and prefer the one farthest from the central tower.
    const uvs = part.ring.map(([px, pz]) => uvOf(px, pz));
    const u0 = Math.min(...uvs.map(p => p[0])), u1 = Math.max(...uvs.map(p => p[0]));
    const v0 = Math.min(...uvs.map(p => p[1])), v1 = Math.max(...uvs.map(p => p[1]));
    const su = 12.5, sv = 11;
    let x, z, best = -Infinity;
    for (let u = u0 + su / 2 + 0.5; u < u1 - su / 2; u += 1) {
      for (let v = v0 + sv / 2 + 0.5; v < v1 - sv / 2; v += 1) {
        const [px, pz] = xzOf(u, v);
        if (!rectEdges(px, pz, su, sv).every(e => inside(part.ring, e.a[0], e.a[1]) && inside(part.ring, e.mx, e.mz))) continue;
        const d = (px - SPIRE.x) ** 2 + (pz - SPIRE.z) ** 2;
        if (d > best) { best = d; x = px; z = pz; }
      }
    }
    if (x === undefined) throw new Error(`No full-size end pavilion fits ${part.id}`);
    b.box('stone', [x, (H.wing + 27.4) / 2, z], [su, 27.4 - H.wing, sv], ANGLE);
    const edges = rectEdges(x, z, su * 0.72, sv * 0.72);
    // Shaft of the tempietto, with one opening a side, then a pyramid and a needle.
    b.box('stone', [x, (27.4 + 31.6) / 2, z], [su * 0.72, 4.2, sv * 0.72], ANGLE);
    for (const e of edges) arch(e, e.len / 2, 27.7, 3.35, Math.min(2.3, e.len * 0.42), winD, 'glow');
    for (const e of edges) slab(e, 31.15, 31.85, -0.04, 0.45, 'trim', false);
    const [cu, cv] = uvOf(x, z);
    const base = 31.7, apex = 34.9;
    const hw = su * 0.3, hd = sv * 0.3;
    const corners = [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]].map(([u, v]) => xzOf(cu + u, cv + v));
    const tip = xzOf(cu, cv);
    for (let i = 0; i < 4; i++) {
      const a = corners[i], c = corners[(i + 1) % 4];
      const ax = c[0] - a[0], az = c[1] - a[1], ab = Math.hypot(ax, az);
      const nx = az / ab, nz = -ax / ab;
      tri('stone', [a[0], base, a[1]], [tip[0], apex, tip[1]], [c[0], base, c[1]], [nx, 0.45, nz]);
    }
    b.box('stone', [x, (apex + H.lantern) / 2, z], [0.42, H.lantern - apex, 0.42]);
  }

  function turret(part) {
    const y0 = H.podium, shaft = 55.3;
    const edges = prism(part, y0, shaft, false);
    dress(edges, {
      bay: 4.5, winW: near ? 1.35 : 2.4, winH: 2.4,
      base: null, arches: null, rows: [[51.2, 53.7]],
      cornice: [54.35, 55.7], pil: [50.35, 54.2], roof: shaft,
    });
    const ring = ccw(part.ring);
    let cx = 0, cz = 0;
    for (const p of ring) { cx += p[0]; cz += p[1]; }
    cx /= ring.length; cz /= ring.length;
    const apex = 59.3;
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], c = ring[(i + 1) % ring.length];
      const dx = c[0] - a[0], dz = c[1] - a[1], len = Math.hypot(dx, dz);
      tri('stone', [a[0], shaft, a[1]], [cx, apex, cz], [c[0], shaft, c[1]], [dz / len, 0.55, -dx / len]);
    }
    b.box('stone', [cx, (apex + H.turretTip) / 2, cz], [0.38, H.turretTip - apex, 0.38]);
  }

  function spire(x, z) {
    // Narrow square lantern and tapering needle above the broad belvedere.
    // 70–91.6 m stays below one third of the 34.9 m tower width.
    const wu = 6.2, wv = 6.2;
    stage(x, z, wu, wv, H.towerShaft, 77.8, [72.1, 75.2]);
    const [cu, cv] = uvOf(x, z);
    for (const [ou, ov] of [[-2.55, -2.55], [-2.55, 2.55], [2.55, -2.55], [2.55, 2.55]]) {
      const [rx, rz] = xzOf(cu + ou, cv + ov);
      b.box('trim', [rx, 78.15, rz], [0.6, 1.3, 0.6], ANGLE);
    }
    stage(x, z, 3.8, 3.8, 77.8, 81.1, [79.5]);
    const base = 81.1, top = H.shoulder, hw0 = 1.85, hw1 = 0.35;
    const corners = (h) => [[-h, -h], [h, -h], [h, h], [-h, h]].map(([u, v]) => xzOf(cu + u, cv + v));
    const lo = corners(hw0), hi = corners(hw1);
    for (let i = 0; i < 4; i++) {
      const a = lo[i], c = lo[(i + 1) % 4], d = hi[(i + 1) % 4], e = hi[i];
      const nx = (a[0] + c[0]) / 2 - x, nz = (a[1] + c[1]) / 2 - z, nl = Math.hypot(nx, nz) || 1;
      quad('stone', [a[0], base, a[1]], [e[0], top, e[1]], [d[0], top, d[1]], [c[0], base, c[1]], [nx / nl, 0.14, nz / nl]);
    }
    const idx = THREE.ShapeUtils.triangulateShape(hi.map((p) => new THREE.Vector2(p[0], p[1])), []);
    for (const [i, j, k] of idx) {
      const a = [hi[i][0], top, hi[i][1]], c = [hi[j][0], top, hi[j][1]], d = [hi[k][0], top, hi[k][1]];
      const ny = (c[2] - a[2]) * (d[0] - a[0]) - (c[0] - a[0]) * (d[2] - a[2]);
      if (ny >= 0) tri('stone', a, c, d, [0, 1, 0]);
      else tri('stone', a, d, c, [0, 1, 0]);
    }
    b.bar('metal', [x, top - 0.12, z], [x, H.tip, z], 0.36, 0.36);
    for (const [y, w] of [[96.4, 3.6], [99.6, 2.5], [102.2, 1.5]]) {
      b.bar('metal', [x - w / 2, y, z], [x + w / 2, y, z], 0.22, 0.22);
      b.bar('metal', [x, y, z - w / 2], [x, y, z + w / 2], 0.22, 0.22);
    }
  }

  function portico() {
    const len = FACADE.len;
    const tx = (FACADE.cx - FACADE.ax) / len, tz = (FACADE.cz - FACADE.az) / len;
    const edge = {
      a: [FACADE.ax, FACADE.az], c: [FACADE.cx, FACADE.cz], len, tx, tz,
      nx: FACADE.nx, nz: FACADE.nz,
    };
    const n = 6;
    const span = 16.8;
    const t0 = len / 2 - span / 2;
    for (let i = 0; i < n; i++) {
      const t = t0 + (span * i) / (n - 1);
      const p = at(edge, t, 0, 1.65);
      const g = new THREE.CylinderGeometry(near ? 0.4 : 0.46, near ? 0.48 : 0.52, 8.3, near ? 8 : 5);
      g.translate(p[0], 4.15, p[2]);
      b.put(g, 'stone');
      b.box('stone', [p[0], 8.05, p[2]], [1.15, 0.55, 1.15]);
    }
    // Entablature clear of the arches (those end at y 8.0) so stone stays off the glow.
    const p0 = at(edge, t0 - 1.1, 0, 0), p1 = at(edge, t0 + span + 1.1, 0, 0);
    slab({ a: [p0[0], p0[2]], c: [p1[0], p1[2]], len: span + 2.2, tx, tz, nx: edge.nx, nz: edge.nz }, 8.4, 9.55, 0.95, 2.25, 'trim');
  }
}
