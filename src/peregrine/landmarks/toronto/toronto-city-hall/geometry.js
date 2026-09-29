import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import {
  GRID, uv, polar, TOWERS, CHAMBER, PODIUM, ROOF_GARDENS, POOL, ARCHES, SIGN, WALKWAY, RAMP,
} from './toronto-city-hall-site.js';
import { Soup, prism, ribbon, orientedBox, lathe } from './toronto-city-hall-mesh.js';

const DEG = Math.PI / 180;
const gc = Math.cos(GRID), gs = Math.sin(GRID);
// Grid axes in model space: u east-along-the-grid, v south-along-the-grid.
const EU = [gc, 0, -gs], EV = [gs, 0, gc], UP = [0, 1, 0];
const hash = (a, b, c) => (((a * 73856093) ^ (b * 19349663) ^ (c * 83492791)) >>> 0) % 1000 / 1000;
const steps = (a, b, step) => { const n = Math.max(1, Math.ceil(Math.abs(b - a) / step)); return Array.from({ length: n + 1 }, (_, i) => a + (b - a) * i / n); };

/**
 * Toronto City Hall and Nathan Phillips Square, in metres: +X east, +Y up, +Z south, origin = the
 * chamber's central column, y = 0 the plaza. Authoring only (exporter, inspector, tests); never the map.
 *
 * near: ribbed towers with recessed ribbon glazing, ledges, mullions, lit windows, strut ring, arch lamps,
 * lettered sign. far: same silhouette and negative space (towers, saucer, podium, arches, walkway loop) with
 * coarser ribs, grouped floors, and no lamps, mullions, windows or lettering.
 */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const soups = new Map();
  const soup = (mat) => { if (!soups.has(mat)) soups.set(mat, new Soup()); return soups.get(mat); };
  const put = (g, mat) => b.put(g, mat);
  // Box aligned with the street grid: centre (u, y, v), sizes along u, y, v.
  const gbox = (mat, u, y, v, su, sy, sv) => { const [x, z] = uv(u, v); b.box(mat, [x, y, z], [su, sy, sv], GRID); };
  // Box along a grid-space segment a -> b, `len` extra, width w across, at height y (centre) with thickness h.
  const segBox = (mat, a, c, y, h, w, pad = 0, off = 0) => {
    const du = c[0] - a[0], dv = c[1] - a[1], L = Math.hypot(du, dv), nu = -dv / L, nv = du / L;
    const [x, z] = uv((a[0] + c[0]) / 2 + nu * off, (a[1] + c[1]) / 2 + nv * off);
    const dir = uv(du / L, dv / L), ang = Math.atan2(-(dir[1]), dir[0]); // box x-axis -> segment direction
    b.box(mat, [x, y, z], [L + 2 * pad, h, w], ang);
  };

  const podiumRoof = PODIUM.roof;
  // Layers that sit on another surface stand off it by this much: enough to keep depth precision honest
  // from the distance the far model is drawn at.
  const stand = near ? 0.12 : 0.3;

  // ---------------------------------------------------------------- towers
  function tower(t) {
    const H = t.roof, fh = (H - podiumRoof) / t.floors, bodyTop = H - 1.0, phiMax = t.span;
    const pitch = near ? 1.5 : 3.6, amp = near ? 0.38 : 0.45;
    // Outer wall: the ribbed convex back, S -> N. Trapezoid ribs, crest = the mapped OSM curve. The groove
    // floors are remembered so they can be laid with a darker course (the runtime has no shadows).
    const outer = [], grooves = [];
    for (let phi = 0; phi < phiMax - 0.05;) {
      const dphi = pitch / t.rOuter(phi) / DEG, row = [];
      for (const [f, off] of [[0, 0], [0.15, 0], [0.3, -amp], [0.7, -amp], [0.85, 0]]) {
        const ph = phi + f * dphi; if (ph >= phiMax) break;
        const p = t.at(ph, t.rOuter(ph) + off); outer.push(p); row.push([ph, off, p]);
      }
      if (row.length >= 4) grooves.push([row[2], row[3]]);
      phi += dphi;
    }
    outer.push(t.at(phiMax, t.rOuter(phiMax)));
    // Inner face, N -> S: smooth end block, recessed ribbon glazing, deeper slot, ribbed pylon at S.
    const rec = 1.1, recSlot = 1.9, slotEnd = t.pylon + t.slot, blockStart = phiMax - t.block;
    const inner = [];
    const add = (ph, off) => inner.push(t.at(ph, t.rGlass(ph) + off));
    for (const ph of steps(phiMax, blockStart, 4)) add(ph, 0);
    for (const ph of steps(blockStart, slotEnd, near ? 3 : 8)) add(ph, rec);
    for (const ph of steps(slotEnd, t.pylon, 2)) add(ph, recSlot);
    for (const ph of steps(t.pylon, 0, 4)) add(ph, 0);
    // The S end face is ribbed too (the pylon reads as one fluted piece round its corner).
    {
      const I = inner[inner.length - 1], O = outer[0], dx = O[0] - I[0], dz = O[1] - I[1], L = Math.hypot(dx, dz);
      const [ax, az] = t.at(-1.5, 0.5 * (t.rGlass(0) + t.rOuter(0))), [bx, bz] = t.at(1.5, 0.5 * (t.rGlass(0) + t.rOuter(0)));
      let nx = -dz / L, nz = dx / L; if (nx * (ax - bx) + nz * (az - bz) < 0) { nx = -nx; nz = -nz; } // outward = away from the tower
      const m = Math.max(2, Math.floor(L / pitch));
      for (let k = 0; k < m; k++) {
        for (const [f, off] of [[0, 0], [0.15, 0], [0.3, -amp], [0.7, -amp], [0.85, 0]]) {
          const q = (k + f) / m; if (q <= 0.001 || q >= 0.999) continue;
          inner.push([I[0] + dx * q + nx * off, I[1] + dz * q + nz * off]);
        }
      }
    }
    put(prism(outer.concat(inner), podiumRoof - 0.4, bodyTop), 'concrete');
    for (const [a, c] of grooves) {
      const push = ([x, z]) => { const l = Math.hypot(x, z), d = near ? 0.05 : 0.2; return [x + x / l * d, z + z / l * d]; };
      const pa = push(a[2]), pc = push(c[2]);
      soup('concreteDark').quad([pa[0], podiumRoof - 0.3, pa[1]], [pc[0], podiumRoof - 0.3, pc[1]], [pc[0], bodyTop, pc[1]], [pa[0], bodyTop, pa[1]], [pa[0] * 3, (podiumRoof + bodyTop) / 2, pa[1] * 3]);
    }
    // Parapet coping round the outer edge, and the two belt courses on the ribbed back.
    const smooth = steps(0, phiMax, 3).map((ph) => ph);
    const band = (dOut, dIn, y0, y1, mat) => {
      const o = smooth.map((ph) => t.at(ph, t.rOuter(ph) + dOut)), i = smooth.map((ph) => t.at(ph, t.rOuter(ph) + dIn)).reverse();
      put(prism(o.concat(i), y0, y1), mat);
    };
    band(0.0, -0.95, bodyTop, H, 'concreteDark');
    for (const k of [0.34, 0.68]) { const y = podiumRoof + (H - podiumRoof) * k; band(0.22, -0.4, y, y + 0.55, 'concrete'); }

    // Glazed face: floors as bands (near: one per floor; far: groups of three), ledges between them.
    const group = near ? 1 : 3, bands = [];
    for (let f = 0; f < t.floors;) {
      const kind = t.dark.includes(f) ? 'darkGlass' : t.louvre.includes(f) ? 'darkGlass' : 'glass';
      let n = 1; while (n < group && f + n < t.floors && (t.dark.includes(f + n) ? 'darkGlass' : t.louvre.includes(f + n) ? 'darkGlass' : 'glass') === kind) n++;
      bands.push({ f, n, kind }); f += n;
    }
    const main = steps(slotEnd, blockStart, near ? 3 : 8);
    const glassR = (ph, off) => t.at(ph, t.rGlass(ph) + rec + off);
    for (const { f, n, kind } of bands) {
      const y0 = podiumRoof + f * fh, y1 = Math.min(y0 + n * fh - 0.12, bodyTop - 0.05);
      ribbon(soup(kind), main.map((ph) => glassR(ph, -stand)), y0 + 0.85, y1, [0, y0 + 2, 0]);
      // Ledge: a thin projecting course under each band.
      const o = main.map((ph) => glassR(ph, 0.02)), i = main.map((ph) => glassR(ph, -stand - 0.35)).reverse();
      put(prism(o.concat(i), y0, y0 + 0.34), 'concrete');
      if (near && kind === 'glass') {
        // Lit windows, a deterministic ~22 % of bays, for the night palette.
        const arc = (blockStart - slotEnd) * DEG * (t.rGlass((slotEnd + blockStart) / 2) + rec);
        const bays = Math.round(arc / 3.0);
        for (let j = 0; j < bays; j++) {
          if (hash(f, j, t.floors) > 0.22) continue;
          const pa = slotEnd + (blockStart - slotEnd) * (j + 0.1) / bays, pb = slotEnd + (blockStart - slotEnd) * (j + 0.9) / bays;
          ribbon(soup('light'), [glassR(pa, -stand - 0.1), glassR(pb, -stand - 0.1)], y0 + 1.0, y0 + fh - 0.3, [0, y0 + 2, 0]);
        }
      }
    }
    // The vertical slot of glazing beside the pylon, full height.
    ribbon(soup('glass'), steps(t.pylon, slotEnd, 1.5).map((ph) => t.at(ph, t.rGlass(ph) + recSlot - stand)), podiumRoof + 0.5, bodyTop - 0.05, [0, 30, 0]);
    // Mullions (near only): thin vertical fins standing off the recessed glass.
    if (near) {
      const yc = (podiumRoof + bodyTop) / 2, hh = bodyTop - podiumRoof - 0.1;
      for (let ph = slotEnd; ph < blockStart;) {
        const th = t.theta(ph) * DEG, r = t.rGlass(ph) + rec - stand - 0.11;
        const er = [Math.cos(th), 0, Math.sin(th)], et = [-Math.sin(th), 0, Math.cos(th)];
        const [x, z] = polar(t.theta(ph), r);
        put(orientedBox([x, yc, z], [et, UP, er], [0.14, hh, 0.3]), 'concreteDark');
        ph += 1.8 / (t.rGlass(ph) + rec) / DEG;
      }
    }
    return { H, fh };
  }
  tower(TOWERS.west);
  tower(TOWERS.east);
  // Aerial mast on the east tower's north block (estimated 6 m).
  {
    const t = TOWERS.east, [x, z] = t.at(t.span - 7, 35.5);
    b.bar('metal', [x, t.roof - 0.5, z], [x, t.roof + 6, z], near ? 0.16 : 0.3);
  }

  // ---------------------------------------------------------------- chamber
  {
    const C = CHAMBER, seg = near ? 72 : 36;
    // Saucer: underside disc, sloping soffit, rim lip, then a shallow spherical cap up to the 25 m crown.
    const capR = 23.0, capY = 18.9, rise = C.crown - capY, R = (capR * capR + rise * rise) / (2 * rise), cy = C.crown - R;
    const prof = [[0.01, C.floor], [13.0, C.floor], [21.5, 15.4], [23.6, 16.2], [23.7, 18.0], [capR, capY]];
    for (let i = 1; i <= (near ? 14 : 7); i++) { const r = capR * (1 - i / (near ? 14 : 7)); prof.push([Math.max(r, 0.01), cy + Math.sqrt(R * R - r * r)]); }
    put(lathe(prof, seg), 'dome');
    // Glazed cone under the dome, and its base ring on the podium roof.
    put(lathe([[17.6, podiumRoof + 0.6], [21.0, 15.5]], seg), 'darkGlass');
    put(lathe([[17.3, podiumRoof], [19.1, podiumRoof], [19.1, podiumRoof + 0.7], [17.3, podiumRoof + 0.7]], seg), 'concrete');
    // 23 pairs of V-shaped struts: apex low on the ring, arms up to the rim soffit.
    const N = 23, strut = near ? 0.5 : 0.7;
    for (let k = 0; k < N; k++) {
      const a = (k / N) * 360, base = polar(a, 18.3);
      for (const side of [-1, 1]) {
        const top = polar(a + side * 180 / N, 21.6);
        b.bar('concrete', [base[0], podiumRoof + 0.5, base[1]], [top[0], 15.3, top[1]], strut);
      }
    }
  }

  // ---------------------------------------------------------------- podium
  {
    const ring = PODIUM.ring.map(([u, v]) => uv(u, v));
    put(prism(ring, 0, podiumRoof), 'concrete');
    put(prism(ring, podiumRoof, podiumRoof + 0.06), 'concreteDark'); // paved deck
    for (const g of ROOF_GARDENS) put(prism(g.map(([u, v]) => uv(u, v)), podiumRoof + 0.06, podiumRoof + (near ? 0.34 : 0.3)), 'grass');
    // The colonnaded south fronts: recessed glazing, a cantilevered fascia, round columns.
    for (const [a, c] of PODIUM.fronts) {
      const du = c[0] - a[0], dv = c[1] - a[1], L = Math.hypot(du, dv), nu = -dv / L, nv = du / L, out = 4.4;
      const p = (t, d, y) => { const [x, z] = uv(a[0] + du * t + nu * d, a[1] + dv * t + nv * d); return [x, y, z]; };
      soup('darkGlass').quad(p(0, stand, 0.3), p(1, stand, 0.3), p(1, stand, 5.5), p(0, stand, 5.5), p(0.5, 20, 3));
      segBox('concrete', a, c, 6.8, 2.4, out, 0.15, out / 2);
      const cols = Math.max(2, Math.round(L / 6.2));
      for (let i = 0; i <= cols; i++) {
        const [x, , z] = p(i / cols, out - 0.7, 0);
        const g = new THREE.CylinderGeometry(0.42, 0.42, 5.6, near ? 10 : 6); g.translate(x, 2.8, z); put(g, 'concrete');
      }
    }
  }

  // ---------------------------------------------------------------- ceremonial ramp
  {
    const halfW = 4.6, parapet = 1.0, pts = RAMP.map(([u, v]) => uv(u, v));
    const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const total = len[len.length - 1], heightAt = (i) => podiumRoof * len[i] / total;
    const side = pts.map((p, i) => {
      const a = pts[Math.max(0, i - 1)], c = pts[Math.min(pts.length - 1, i + 1)];
      const tx = c[0] - a[0], tz = c[1] - a[1], L = Math.hypot(tx, tz), nx = -tz / L, nz = tx / L; // left of travel
      return { L: [p[0] + nx * halfW, p[1] + nz * halfW], R: [p[0] - nx * halfW, p[1] - nz * halfW], n: [nx, nz] };
    });
    for (let i = 0; i + 1 < pts.length; i++) {
      const s = side[i], q = side[i + 1], y0 = heightAt(i), y1 = heightAt(i + 1);
      const P = (e, y) => [e[0], y, e[1]];
      soup('concreteDark').quad(P(s.L, y0), P(s.R, y0), P(q.R, y1), P(q.L, y1), [s.L[0], y0 + 10, s.L[1]]);
      for (const [key, sign] of [['L', 1], ['R', -1]]) {
        const out = [s[key][0] + sign * s.n[0] * 10, 0, s[key][1] + sign * s.n[1] * 10];
        soup('concrete').quad(P(s[key], 0), P(q[key], 0), P(q[key], y1 + parapet), P(s[key], y0 + parapet), [out[0], (y0 + y1) / 2, out[2]]);
        const inn = [s[key][0] - sign * s.n[0] * 10, 0, s[key][1] - sign * s.n[1] * 10];
        soup('concrete').quad(P(s[key], y0 + parapet), P(q[key], y1 + parapet), P([q[key][0] - sign * q.n[0] * 0.4, q[key][1] - sign * q.n[1] * 0.4], y1 + parapet), P([s[key][0] - sign * s.n[0] * 0.4, s[key][1] - sign * s.n[1] * 0.4], y0 + parapet), [s[key][0], y0 + 10, s[key][1]]);
        soup('concrete').quad(P([s[key][0] - sign * s.n[0] * 0.4, s[key][1] - sign * s.n[1] * 0.4], y0 + parapet), P([q[key][0] - sign * q.n[0] * 0.4, q[key][1] - sign * q.n[1] * 0.4], y1 + parapet), P([q[key][0] - sign * q.n[0] * 0.4, q[key][1] - sign * q.n[1] * 0.4], y1), P([s[key][0] - sign * s.n[0] * 0.4, s[key][1] - sign * s.n[1] * 0.4], y0), [inn[0], (y0 + y1) / 2, inn[2]]);
      }
    }
  }

  // ---------------------------------------------------------------- elevated walkway loop
  {
    const W = 6.2, deckY = 6.0, corners = WALKWAY;
    for (let i = 0; i + 1 < corners.length; i++) {
      const a = corners[i], c = corners[i + 1], L = Math.hypot(c[0] - a[0], c[1] - a[1]);
      const pad = W / 2;
      segBox('concrete', a, c, deckY - 0.4, 0.8, W, pad, 0);
      for (const s of [-1, 1]) segBox('concrete', a, c, deckY + 0.45, 0.9, 0.35, pad, s * (W / 2 - 0.18));
      const n = Math.max(1, Math.round(L / (near ? 7.5 : 12)));
      for (let k = 0; k <= n; k++) {
        const t = k / n, [x, z] = uv(a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t);
        const g = new THREE.CylinderGeometry(0.42, 0.42, deckY - 0.8, near ? 8 : 5); g.translate(x, (deckY - 0.8) / 2, z); put(g, 'concrete');
      }
    }
  }

  // ---------------------------------------------------------------- reflecting pool
  {
    const cu = (POOL.u0 + POOL.u1) / 2, cv = (POOL.v0 + POOL.v1) / 2, du = POOL.u1 - POOL.u0, dv = POOL.v1 - POOL.v0, w = 0.9, h = 0.5;
    gbox('water', cu, 0.16, cv, du, 0.32, dv);
    gbox('concrete', cu, h / 2, POOL.v0 - w / 2, du + 2 * w, h, w);
    gbox('concrete', cu, h / 2, POOL.v1 + w / 2, du + 2 * w, h, w);
    gbox('concrete', POOL.u0 - w / 2, h / 2, cv, w, h, dv);
    gbox('concrete', POOL.u1 + w / 2, h / 2, cv, w, h, dv);
  }

  // ---------------------------------------------------------------- Freedom Arches
  for (const a of ARCHES) {
    const span = a.v1 - a.v0, half = span / 2, rise = 0.345 * span, R = (half * half + rise * rise) / (2 * rise), cy = rise - R, hw = 0.65, depth = 0.85;
    const phiE = Math.acos(-cy / (R + hw)), phiI = Math.acos(-cy / (R - hw)), n = near ? 28 : 12;
    const pts = [];
    for (let i = 0; i <= n; i++) { const ph = -phiE + 2 * phiE * i / n; pts.push(new THREE.Vector2((R + hw) * Math.sin(ph), cy + (R + hw) * Math.cos(ph))); }
    for (let i = n; i >= 0; i--) { const ph = -phiI + 2 * phiI * i / n; pts.push(new THREE.Vector2((R - hw) * Math.sin(ph), cy + (R - hw) * Math.cos(ph))); }
    const g = new THREE.ExtrudeGeometry(new THREE.Shape(pts), { depth, bevelEnabled: false, steps: 1 });
    g.translate(0, 0, -depth / 2);
    const [x, z] = uv(a.u, (a.v0 + a.v1) / 2);
    const m = new THREE.Matrix4().makeBasis(new THREE.Vector3(...EV), new THREE.Vector3(...UP), new THREE.Vector3(-EU[0], 0, -EU[2]));
    m.setPosition(x, 0, z); g.applyMatrix4(m); put(g, 'concrete');
    if (near) {
      // The lamp cans that hang under each arch.
      const lamps = 13;
      for (let k = 0; k < lamps; k++) {
        const ph = -phiI * 0.86 + 2 * phiI * 0.86 * k / (lamps - 1), r = R - hw - 0.25;
        const lv = a.v0 + half + r * Math.sin(ph), ly = cy + r * Math.cos(ph), [lx, lz] = uv(a.u, lv);
        const c = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 8); c.translate(lx, ly, lz); put(c, 'metal');
      }
    }
  }

  // ---------------------------------------------------------------- TORONTO sign (near only)
  if (near) {
    const H = 3.0, D = 0.9, stroke = 0.66, gw = 2.8, gap = 0.42;
    const total = 7 * gw + 6 * gap, u0 = (SIGN.u0 + SIGN.u1) / 2 - total / 2;
    const place = (g, u, y = 0) => {
      const [x, z] = uv(u, SIGN.v);
      const m = new THREE.Matrix4().makeBasis(new THREE.Vector3(...EU), new THREE.Vector3(...UP), new THREE.Vector3(...EV));
      m.setPosition(x, y, z); g.applyMatrix4(m); put(g, 'sign');
    };
    const bar = (u, y, w, h) => new THREE.BoxGeometry(w, h, D).translate(u + w / 2, y + h / 2, 0);
    const diag = (x0, y0, x1, y1) => {
      const len = Math.hypot(x1 - x0, y1 - y0), g = new THREE.BoxGeometry(len, stroke, D);
      g.rotateZ(Math.atan2(y1 - y0, x1 - x0)); g.translate((x0 + x1) / 2, (y0 + y1) / 2, 0); return g;
    };
    const ring = () => {
      const s = new THREE.Shape(), hole = new THREE.Path(); s.absellipse(gw / 2, H / 2, gw / 2, H / 2, 0, Math.PI * 2, false, 0);
      hole.absellipse(gw / 2, H / 2, gw / 2 - stroke, H / 2 - stroke, 0, Math.PI * 2, true, 0); s.holes.push(hole);
      return new THREE.ExtrudeGeometry(s, { depth: D, bevelEnabled: false, curveSegments: 18 }).translate(0, 0, -D / 2);
    };
    const glyph = {
      T: () => [bar(0, H - stroke, gw, stroke), bar(gw / 2 - stroke / 2, 0, stroke, H - stroke)],
      O: () => [ring()],
      R: () => [bar(0, 0, stroke, H), bar(0, H - stroke, gw - 0.5, stroke), bar(0, H / 2 - stroke / 2, gw - 0.5, stroke), bar(gw - 0.5 - 0.04, H / 2, stroke, H / 2 - 0.02), diag(gw * 0.35, H / 2, gw - 0.3, 0.26)],
      N: () => [bar(0, 0, stroke, H), bar(gw - stroke, 0, stroke, H), diag(stroke * 0.6, H - 0.26, gw - stroke * 0.6, 0.26)],
    };
    [...'TORONTO'].forEach((ch, i) => { for (const g of glyph[ch]()) place(g, u0 + i * (gw + gap)); });
  }

  for (const [mat, s] of soups) if (!s.empty) put(s.geometry(), mat);
  return b.finish();
}
