import { ARMS, FREE_PYLONS } from './palace-of-fine-arts-site.js';

// The two curving colonnades (peristyles). Photographs (Commons: "Palace of Fine Arts Columade-MG 4352",
// "Palace of Fine Arts Walkways") show PAIRS of fluted Corinthian columns, side by side across the 3 m
// mapped strip (OSM ways 288371306 / 288371310), under one continuous dentilled entablature. At intervals of
// ~22 m a cluster of heavier columns carries a big box with relief panels and a weeping-woman figure at each
// corner (the "pylons": OSM roofs 19 / 20 / 21 m). The pylon boxes stand on the entablature; the space
// beneath them is open between the columns.
// Estimated from photographs: column 1.24 m x 9 m shaft, entablature top 12.6 m, box 12.6-17.2 m, figures to 20 m.
export const C = {
  plinth: 1.0, shaft0: 1.0, shaft1: 9.2, cap1: 10.5, abacus1: 11.0,
  arch1: 11.7, frieze1: 12.1, cornice1: 12.6,
  colR: 0.62, pairOff: 0.72, bigR: 0.85,
  spacing: 3.7,
  boxTop: 16.0, boxCornice: 16.6, figTop: 19.4,
};

const polylineLengths = (pts) => { const s = [0]; for (let i = 1; i < pts.length; i++) s.push(s[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return s; };
function pointAt(pts, s, at) {
  let i = 1; while (i < pts.length - 1 && at[i] < s) i++;
  const f = Math.min(1, Math.max(0, (s - at[i - 1]) / ((at[i] - at[i - 1]) || 1)));
  const dx = pts[i][0] - pts[i - 1][0], dz = pts[i][1] - pts[i - 1][1];
  return { x: pts[i - 1][0] + dx * f, z: pts[i - 1][1] + dz * f, yaw: Math.atan2(-dz, dx) };
}
function project(pts, at, [px, pz]) {
  let best = { d: Infinity, s: 0 };
  for (let i = 1; i < pts.length; i++) {
    const ax = pts[i - 1][0], az = pts[i - 1][1], dx = pts[i][0] - ax, dz = pts[i][1] - az, l2 = dx * dx + dz * dz || 1;
    const f = Math.min(1, Math.max(0, ((px - ax) * dx + (pz - az) * dz) / l2)), d = Math.hypot(px - ax - dx * f, pz - az - dz * f);
    if (d < best.d) best = { d, s: at[i - 1] + Math.sqrt(l2) * f };
  }
  return best.s;
}

export function buildColonnades(b, kit, near) {
  const { block, shaft, frustum, sweep } = kit;

  // One Corinthian-ish column: plinth, fluted shaft, flared capital (abacus added by the caller).
  function column(x, z, yaw, r, y1 = C.shaft1, cap = C.cap1) {
    if (near) {
      block('stone', x, z, 0, C.plinth, r * 2 + 0.5, r * 2 + 0.5, yaw);
      shaft('stone', x, z, C.shaft0, y1, r, r * 0.88, 6, 0);
      frustum('stone', x, z, y1, cap, r * 0.9, r * 1.5, 6, 'top');
    } else {
      shaft('stone', x, z, 0, C.abacus1, r, r * 1.15, 5, 0); // far: one tapered prism up to the entablature, no capital
    }
  }

  // A pylon: a cluster of heavy columns carrying an entablature slab, a relief box and four weeping-woman figures.
  function pylon(x, z, yaw, along, across, extra = 0) {
    const cs = Math.cos(yaw), sn = Math.sin(yaw);
    const off = (a, c) => [x + a * cs + c * sn, z - a * sn + c * cs]; // along (local x), across (local z) -> world
    const na = along > 6.4 ? 3 : 2, nc = across > 9 ? 3 : 2, hA = along / 2 - 1.0, hC = across / 2 - 1.0;
    for (let i = 0; i < na; i++) for (let j = 0; j < nc; j++) {
      const [cx, cz] = off(na === 1 ? 0 : -hA + (2 * hA * i) / (na - 1), -hC + (2 * hC * j) / (nc - 1));
      column(cx, cz, yaw, C.bigR);
      if (near) block('stone', cx, cz, C.cap1, C.abacus1, 2.2, 2.2, yaw);
    }
    // the arm's own pair of columns passes through the middle of the cluster
    for (const sgn of [-1, 1]) {
      const [cx, cz] = off(0, sgn * C.pairOff);
      column(cx, cz, yaw, C.colR);
    }
    block('stone', x, z, C.abacus1, C.cornice1, along + 0.8, across + 0.8, yaw);          // entablature slab
    const top = C.boxTop + extra;
    block('stone', x, z, C.cornice1, top, along - 0.2, across - 0.2, yaw);                  // the box
    block('stone', x, z, top, C.boxCornice + extra, along + 0.7, across + 0.7, yaw);        // its cornice
    if (near) {
      const w = across - 1.6, w2 = along - 1.6;
      for (const [sx, sz, pw, pd] of [[1, 0, 0.25, w], [-1, 0, 0.25, w], [0, 1, w2, 0.25], [0, -1, w2, 0.25]]) {
        const [px, pz] = off(sx * (along / 2 - 0.1 + 0.08), sz * (across / 2 - 0.1 + 0.08));
        block('stoneDark', px, pz, C.cornice1 + 0.7, top - 0.7, pw, pd, yaw);                // relief panels, proud by ~0.2 m
      }
      block('stone', x, z, C.boxCornice + extra, C.boxCornice + extra + 0.5, along - 1.6, across - 1.6, yaw);   // planter lid
    }
    // weeping-woman figures at the four corners, standing on the cornice
    for (const sa of [-1, 1]) for (const sc of [-1, 1]) {
      const [fx, fz] = off(sa * (along / 2 - 0.2), sc * (across / 2 - 0.2));
      block('stone', fx, fz, C.boxCornice + extra, C.figTop + extra, 1.0, 1.0, yaw);
      if (near) block('stone', fx, fz, C.figTop + extra, C.figTop + extra + 0.6, 0.6, 0.6, yaw);
    }
  }

  for (const arm of ARMS) {
    const pts = arm.path, at = polylineLengths(pts);
    const swp = near ? pts : pts.filter((_, i) => i % 2 === 0 || i === pts.length - 1);
    // entablature over the pair of rows
    if (near) {
      sweep('stone', swp, 1.3, C.abacus1, C.arch1);
      sweep('stone', swp, 1.35, C.arch1, C.frieze1);
      sweep('stone', swp, 1.55, C.frieze1, C.cornice1);
    } else {
      sweep('stone', swp, 1.45, C.abacus1, C.cornice1);
    }
    // pylons (the drum at the rotunda end is a small pylon too)
    const occupied = [];
    for (const p of arm.pylons) {
      const s = project(pts, at, p.at), q = pointAt(pts, s, at);
      pylon(p.at[0], p.at[1], q.yaw, p.along, p.across, p.kind === 'end' ? 1.0 : 0);
      occupied.push([s - p.along / 2 - 0.5, s + p.along / 2 + 0.5]);
    }
    {
      const q = pointAt(pts, 0, at);
      pylon(arm.drum[0], arm.drum[1], q.yaw, 4.4, 4.4, 0);
      occupied.push([0, 3.4]);
    }
    occupied.sort((a, c) => a[0] - c[0]);
    // pairs of columns in the free intervals
    let cursor = 0; const free = [];
    for (const [lo, hi] of occupied) { if (lo > cursor + 2.5) free.push([cursor, lo]); cursor = Math.max(cursor, hi); }
    for (const [lo, hi] of free) {
      const n = Math.max(0, Math.round((hi - lo) / C.spacing) - 1);
      for (let i = 1; i <= n; i++) {
        const q = pointAt(pts, lo + ((hi - lo) * i) / (n + 1), at);
        const nx = Math.sin(q.yaw), nz = Math.cos(q.yaw); // across the arm
        for (const sgn of [-1, 1]) column(q.x + nx * sgn * C.pairOff, q.z + nz * sgn * C.pairOff, q.yaw, C.colR);
        if (near) block('stone', q.x, q.z, C.cap1, C.abacus1, 1.5, 3.0, q.yaw);
      }
    }
  }

  // detached cross-shaped pylons beside the two colonnade ends (a lone box on four columns)
  for (const f of FREE_PYLONS) pylon(f.at[0], f.at[1], (f.deg * Math.PI) / 180, f.size - 1.4, f.size - 1.4, 1.0);
}
