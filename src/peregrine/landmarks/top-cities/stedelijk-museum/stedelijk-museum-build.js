import { meshKit } from './stedelijk-museum-kit.js';
import {
  LEVEL, PROUD, TOWERS, PAVILION, LETTERS, tubPlan,
  ccw, center, sub, add, mul, lerp, len, unit, dot, outward, toward, area,
} from './stedelijk-museum-plan.js';

const UP = [0, 1, 0];

function xz(p, y) { return [p[0], y, p[1]]; }
function edgeLen(a, b) { return Math.hypot(b[0] - a[0], b[1] - a[1]); }

function sampleChain(chain, step) {
  const out = [chain[0]];
  for (let i = 0; i < chain.length - 1; i++) {
    const a = chain[i], b = chain[i + 1];
    const n = Math.max(1, Math.round(edgeLen(a, b) / step));
    for (let k = 1; k <= n; k++) out.push(lerp(a, b, k / n));
  }
  return out;
}

function closestOnRing(p, ring) {
  let best = ring[0], bd = Infinity;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length];
    const ab = sub(b, a);
    const l2 = dot(ab, ab) || 1;
    let t = dot(sub(p, a), ab) / l2;
    t = Math.max(0, Math.min(1, t));
    const q = add(a, mul(ab, t));
    const d = len(sub(p, q));
    if (d < bd) { bd = d; best = q; }
  }
  return best;
}

function cornerLift(p, chain) {
  let best = Infinity;
  for (const v of chain) best = Math.min(best, len(sub(p, v)));
  const t = Math.min(1, best / 7);
  const s = t * t * (3 - 2 * t);
  return 1 - s;
}

export function buildStedelijk(builder, near) {
  const k = meshKit();
  const plan = tubPlan();
  const proud = near ? PROUD.near : PROUD.far;
  buildBlock(k, plan, near, proud);
  const hems = buildTub(k, plan, near);
  buildGlass(k, plan, hems, near, proud);
  buildScreen(k, plan, near, proud);
  k.flush(builder);
  return plan;
}

function buildBlock(k, plan, near, proud) {
  const H = plan.historic;
  k.walls('brick', H, 0, LEVEL.eave);
  for (const ring of Object.values(TOWERS)) {
    k.walls('brick', ring, 0, LEVEL.eave + 0.08);
    towerRoof(k, ccw(ring), near, proud);
  }
  const P = ccw(PAVILION);
  k.walls('brick', P, 0, LEVEL.eave);
  gable(k, P, plan, near, proud);
  hip(k, H, P, near, proud);
  bands(k, H, proud, plan);
  for (const ring of Object.values(TOWERS)) bands(k, ccw(ring), proud);
  windows(k, H, plan, near, proud);
  for (const ring of Object.values(TOWERS)) towerWindows(k, ccw(ring), H, near, proud);
  if (near) dentils(k, H, plan, proud);
}

function towerRoof(k, ring, near, proud) {
  const c = center(ring);
  const yE = LEVEL.eave + 0.1;
  // Steep slate with an eave flare, narrowing to a small platform under an
  // open lantern. A blunt 38% pyramid read as a truncated hip.
  const scales = [
    [1.04, yE],
    [0.72, yE + 1.85],
    [0.46, yE + 3.55],
    [0.28, yE + 4.85],
    [0.18, yE + 5.75],
  ];
  const at = (s) => ring.map((p) => lerp(c, p, s));
  for (let s = 0; s < scales.length - 1; s++) {
    const A = at(scales[s][0]), B = at(scales[s + 1][0]);
    const y0 = scales[s][1], y1 = scales[s + 1][1];
    for (let i = 0; i < ring.length; i++) {
      const j = (i + 1) % ring.length;
      const mid = lerp(A[i], A[j], 0.5);
      const o = unit(sub(mid, c));
      k.quad('slate', xz(A[i], y0), xz(A[j], y0), xz(B[j], y1), xz(B[i], y1), [o[0], 0.72, o[1]]);
    }
  }
  const yP = scales[scales.length - 1][1];
  const plat = at(0.18);
  k.cap('slate', plat, yP, 1);
  // Open lantern: taller posts, a stone head, slate cap and spike to 24 m.
  const posts = at(0.145);
  const yL = yP + 2.7;
  const ax = unit(sub(ring[1], ring[0]));
  const az = [-ax[1], 0, ax[0]];
  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    k.box('stone', [p[0], (yP + yL) / 2 - 0.04, p[1]], [ax[0], 0, ax[1]], UP, az, near ? 0.42 : 0.52, yL - yP + 0.08, near ? 0.42 : 0.52);
    const q = posts[(i + 1) % posts.length];
    const mid = lerp(p, q, 0.5);
    const o = unit(sub(mid, c));
    const along = sub(q, p);
    const half = 0.28;
    k.quad('glass',
      [mid[0] - along[0] * half + o[0] * proud, yP + 0.45, mid[1] - along[1] * half + o[1] * proud],
      [mid[0] + along[0] * half + o[0] * proud, yP + 0.45, mid[1] + along[1] * half + o[1] * proud],
      [mid[0] + along[0] * half + o[0] * proud, yL - 0.28, mid[1] + along[1] * half + o[1] * proud],
      [mid[0] - along[0] * half + o[0] * proud, yL - 0.28, mid[1] - along[1] * half + o[1] * proud],
      [o[0], 0, o[1]]);
  }
  k.walls('stone', posts, yL, yL + 0.32);
  const yC = yL + 0.32;
  const cap = at(0.2);
  for (let i = 0; i < cap.length; i++) {
    const j = (i + 1) % cap.length;
    const o = unit(sub(lerp(cap[i], cap[j], 0.5), c));
    k.face('slate', [xz(cap[i], yC), xz(cap[j], yC), xz(c, 23.15)], [o[0], 0.9, o[1]]);
  }
  k.box('slate', [c[0], (23.15 + LEVEL.tower) / 2, c[1]], [ax[0], 0, ax[1]], UP, az, 0.22, LEVEL.tower - 23.15, 0.22);
}

// Crow-stepped trapgevel on the Paulus Potterstraat face of the north risalit.
// A thin screen in that plane, not a stack of shrinking boxes: the slate hip
// stays visible on either side, the way the 1895 gable actually stands.
function gable(k, P, plan, near, proud) {
  const ring = ccw(P);
  const hc = center(plan.historic);
  let fi = 0, fd = -Infinity;
  for (let i = 0; i < ring.length; i++) {
    const mid = lerp(ring[i], ring[(i + 1) % ring.length], 0.5);
    const d = len(sub(mid, hc));
    if (d > fd) { fd = d; fi = i; }
  }
  const a = ring[fi], b = ring[(fi + 1) % ring.length];
  const along = unit(sub(b, a));
  const width = edgeLen(a, b);
  const mid = lerp(a, b, 0.5);
  const street = mul(toward(mid, outward(b[0] - a[0], b[1] - a[1]), hc), -1);
  const ax = [along[0], 0, along[1]];
  const az = [street[0], 0, street[1]];
  const thick = 0.62;
  const at = (u, y, extra = 0) => [
    mid[0] + along[0] * u + street[0] * (proud + thick / 2 + extra),
    y,
    mid[1] + along[1] * u + street[1] * (proud + thick / 2 + extra),
  ];
  const steps = near ? 6 : 5;
  const rise = 1.16;
  const inset = (width / 2 - 1.25) / steps;
  let half = width / 2 - 0.2;
  for (let i = 0; i < steps; i++) {
    const y0 = LEVEL.eave + i * rise;
    const w = half * 2;
    k.box('brick', at(0, y0 + (rise - 0.14) / 2), ax, UP, az, w, rise - 0.14, thick, 'noTop');
    // Coping sits clear of the brick face by `proud` (the layered-face gap).
    k.box('stone', at(0, y0 + rise - 0.1, thick / 2 + proud + 0.08), ax, UP, az, w + 0.3, 0.16, 0.16, 'sides');
    half -= inset;
  }
  const neck = LEVEL.eave + steps * rise;
  // Lid over the part of the risalit that projects past the main hip.
  const n = ring.length;
  const backR = ring[(fi + 2) % n], backL = ring[(fi + 3) % n];
  const yLid = LEVEL.eave + 0.2;
  k.quad('slate',
    xz(a, yLid), xz(b, yLid), xz(lerp(b, backR, 0.55), yLid), xz(lerp(a, backL, 0.55), yLid),
    [0, 1, 0]);
  clock(k, at(0, LEVEL.eave + 3.35, thick / 2 + proud + 0.1), ax, az, near);
  k.box('stone', at(0, LEVEL.eave + 1.7, thick / 2 + proud + 0.1), ax, UP, az, 3.4, 1.15, 0.12);
  if (near) {
    for (const s of [-1, 1]) {
      const u = s * width * 0.28;
      k.quad('glass',
        at(u - 0.42, LEVEL.eave + 0.55, thick / 2 + proud),
        at(u + 0.42, LEVEL.eave + 0.55, thick / 2 + proud),
        at(u + 0.42, LEVEL.eave + 2.35, thick / 2 + proud),
        at(u - 0.42, LEVEL.eave + 2.35, thick / 2 + proud),
        az);
    }
  }
  // Open belfry, then a needle whose tip is the tagged 28 m.
  const bay = 0.72;
  for (const s of [-1, 1]) {
    k.box('stone', at(s * bay, neck + 1.05, 0), ax, UP, az, 0.32, 2.05, thick);
    k.box('stone', at(s * bay, neck + 1.05, -0.85), ax, UP, az, 0.32, 2.05, 0.32);
  }
  k.box('stone', at(0, neck + 2.15, -0.4), ax, UP, az, bay * 2 + 0.5, 0.24, 1.15);
  const capY = neck + 2.42;
  k.box('slate', at(0, capY, -0.4), ax, UP, az, 2.15, 0.2, 1.35);
  k.box('slate', at(0, capY + 0.45, -0.4), ax, UP, az, 1.15, 0.55, 0.75);
  const needle0 = capY + 0.85;
  k.box('slate', at(0, (needle0 + LEVEL.spire) / 2, -0.4), ax, UP, az, 0.18, LEVEL.spire - needle0, 0.18);
  k.box('slate', at(0, LEVEL.spire - 0.45, -0.4), ax, UP, az, 1.35, 0.06, 0.08);
  k.box('slate', at(0.48, LEVEL.spire - 0.7, -0.4), ax, UP, az, 0.08, 0.42, 0.08);
}

function clock(k, center, ax, az, near) {
  const seg = near ? 10 : 8;
  const r = 0.92;
  for (let i = 0; i < seg; i++) {
    const ang = ((i + 0.5) / seg) * Math.PI * 2;
    const tx = Math.cos(ang), ty = Math.sin(ang);
    const dir = [ax[0] * tx, ty, ax[2] * tx];
    const tang = [-ax[0] * ty, tx, -ax[2] * ty];
    k.box('stone', [
      center[0] + dir[0] * r, center[1] + dir[1] * r, center[2] + dir[2] * r,
    ], tang, dir, az, 0.36, 0.2, 0.1);
  }
  k.box('slate', center, ax, UP, az, 1.35, 1.35, 0.08);
  const hand = (ang, len) => {
    const tx = Math.sin(ang), ty = Math.cos(ang);
    const dir = [ax[0] * tx, ty, ax[2] * tx];
    const tang = [ax[0] * ty, -tx, ax[2] * ty];
    k.box('stone', [
      center[0] + dir[0] * len / 2 + az[0] * 0.08,
      center[1] + dir[1] * len / 2 + az[1] * 0.08,
      center[2] + dir[2] * len / 2 + az[2] * 0.08,
    ], tang, dir, az, 0.08, len, 0.06);
  };
  hand(0.15, 0.7);
  hand(2.2, 0.5);
}

function hip(k, H, pavilion, near, proud) {
  const ring = ccw(H);
  const c = center(ring);
  let li = 0, ll = 0;
  for (let i = 0; i < ring.length; i++) {
    const L = edgeLen(ring[i], ring[(i + 1) % ring.length]);
    if (L > ll) { ll = L; li = i; }
  }
  const along = unit(sub(ring[(li + 1) % ring.length], ring[li]));
  const shortL = edgeLen(ring[(li + 1) % ring.length], ring[(li + 2) % ring.length]);
  const half = Math.max(6, (ll - shortL) / 2);
  const ridgeA = add(c, mul(along, -half));
  const ridgeB = add(c, mul(along, half));
  const yE = LEVEL.eave, yR = LEVEL.ridge;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length];
    const parallel = Math.abs(dot(unit(sub(b, a)), along)) > 0.85;
    const mid = lerp(a, b, 0.5);
    const o = outward(b[0] - a[0], b[1] - a[1]);
    if (parallel) {
      const ra = dot(sub(a, c), along) > 0 ? ridgeB : ridgeA;
      const rb = dot(sub(b, c), along) > 0 ? ridgeB : ridgeA;
      k.quad('slate', xz(a, yE), xz(b, yE), xz(rb, yR), xz(ra, yR), [o[0], 0.55, o[1]]);
      dormersOn(k, a, b, ra, rb, pavilion, near, proud, o);
    } else {
      const end = len(sub(mid, ridgeA)) < len(sub(mid, ridgeB)) ? ridgeA : ridgeB;
      k.face('slate', [xz(a, yE), xz(b, yE), xz(end, yR)], [o[0], 0.55, o[1]]);
    }
  }
}

function dormersOn(k, a, b, ra, rb, pavilion, near, proud, out) {
  const pc = center(ccw(pavilion));
  const n = near ? 4 : 3;
  const along = unit(sub(b, a));
  const ax = [along[0], 0, along[1]];
  const az = [out[0], 0, out[1]];
  for (let i = 0; i < n; i++) {
    const s = (i + 0.5) / n;
    if (Math.hypot(lerp(a, b, s)[0] - pc[0], lerp(a, b, s)[1] - pc[1]) < 12) continue;
    const t = 0.4;
    const e = lerp(a, b, s);
    const r = lerp(ra, rb, s);
    const p = lerp(e, r, t);
    const y = LEVEL.eave + (LEVEL.ridge - LEVEL.eave) * t;
    const front = 0.15 + 0.675;
    const cy = y + 0.35;
    k.box('brick', [p[0] + out[0] * 0.15, cy, p[1] + out[1] * 0.15], ax, UP, az, 2.15, 1.45, 1.35, 'noBottom');
    k.box('slate', [p[0] + out[0] * 0.15, cy + 0.85, p[1] + out[1] * 0.15], ax, UP, az, 2.55, 0.28, 1.7);
    const wx = p[0] + out[0] * (front + proud);
    const wz = p[1] + out[1] * (front + proud);
    k.quad('glass',
      [wx - along[0] * 0.42, cy - 0.35, wz - along[1] * 0.42],
      [wx + along[0] * 0.42, cy - 0.35, wz + along[1] * 0.42],
      [wx + along[0] * 0.42, cy + 0.4, wz + along[1] * 0.42],
      [wx - along[0] * 0.42, cy + 0.4, wz - along[1] * 0.42],
      [out[0], 0, out[1]]);
  }
}

function bands(k, ring, proud, plan) {
  const r = ccw(ring);
  const courses = [[0.08, 1.15], [4.4, 5.0], [8.2, 8.8], [13.2, LEVEL.eave + 0.06]];
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length];
    if (plan && sameEdge(a, b, plan.southWall)) continue;
    const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz) || 1;
    const o = [dz / L, -dx / L];
    const ax = [dx / L, 0, dz / L];
    const mid = lerp(a, b, 0.5);
    for (const [y0, y1] of courses) {
      k.box('stone',
        [mid[0] + o[0] * (proud + 0.06), (y0 + y1) / 2, mid[1] + o[1] * (proud + 0.06)],
        ax, UP, [o[0], 0, o[1]], L, y1 - y0, 0.14, 'sides');
    }
  }
}

function sameEdge(a, b, wall) {
  if (!wall) return false;
  const [p, q] = wall;
  const on = (u) => {
    const ab = sub(q, p), l2 = dot(ab, ab) || 1;
    const t = dot(sub(u, p), ab) / l2;
    if (t < -0.05 || t > 1.05) return false;
    return len(sub(u, add(p, mul(ab, Math.max(0, Math.min(1, t)))))) < 1.2;
  };
  return on(a) && on(b);
}

function windows(k, H, plan, near, proud) {
  const r = ccw(H);
  const floors = [
    { y: 1.6, h: 2.45, arch: false },
    { y: 5.2, h: 1.85, arch: true },
    { y: 9.05, h: 2.15, arch: false },
  ];
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length];
    if (sameEdge(a, b, plan.southWall)) continue;
    const L = edgeLen(a, b);
    const inset = L > 60 ? 14 : 11;
    bayRun(k, a, b, inset, inset, floors, near, proud, 2.05);
  }
  // Risalit front lights, ground and piano, already partly in the gable. Street wall of the pavilion.
  const P = ccw(PAVILION);
  const hc = center(r);
  let faceI = 0, faceD = -Infinity;
  for (let i = 0; i < P.length; i++) {
    const mid = lerp(P[i], P[(i + 1) % P.length], 0.5);
    const d = len(sub(mid, hc));
    if (d > faceD) { faceD = d; faceI = i; }
  }
  bayRun(k, P[faceI], P[(faceI + 1) % P.length], 0.7, 0.7, floors, near, proud, 2.3);
}

function bayRun(k, a, b, inset0, inset1, floors, near, proud, winW) {
  const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz) || 1;
  const usable = L - inset0 - inset1;
  if (usable < 2.2) return;
  const n = Math.max(1, Math.round(usable / 4.8));
  const w = usable / n;
  const ux = dx / L, uz = dz / L;
  const ox = dz / L, oz = -dx / L;
  for (let i = 0; i < n; i++) {
    const s = inset0 + (i + 0.5) * w;
    const cx = a[0] + ux * s, cz = a[1] + uz * s;
    for (const f of floors) windowAt(k, cx, cz, ox, oz, ux, uz, f, near, proud, Math.min(winW, w - 1.3));
  }
}

function windowAt(k, cx, cz, ox, oz, ux, uz, f, near, proud, winW) {
  const archH = f.arch ? winW * 0.48 : 0;
  const top = f.y + f.h + archH;
  const glass = (x0, y0, x1, y1) => k.quad('glass',
    [cx + ux * x0 + ox * proud, y0, cz + uz * x0 + oz * proud],
    [cx + ux * x1 + ox * proud, y0, cz + uz * x1 + oz * proud],
    [cx + ux * x1 + ox * proud, y1, cz + uz * x1 + oz * proud],
    [cx + ux * x0 + ox * proud, y1, cz + uz * x0 + oz * proud],
    [ox, 0, oz]);
  glass(-winW / 2, f.y, winW / 2, f.y + f.h);
  if (f.arch) {
    const seg = near ? 5 : 3;
    const r = winW / 2;
    for (let i = 0; i < seg; i++) {
      const t0 = Math.PI * i / seg, t1 = Math.PI * (i + 1) / seg;
      k.face('glass', [
        [cx + ox * proud, f.y + f.h, cz + oz * proud],
        [cx + ux * (-r * Math.cos(t0)) + ox * proud, f.y + f.h + r * Math.sin(t0), cz + uz * (-r * Math.cos(t0)) + oz * proud],
        [cx + ux * (-r * Math.cos(t1)) + ox * proud, f.y + f.h + r * Math.sin(t1), cz + uz * (-r * Math.cos(t1)) + oz * proud],
      ], [ox, 0, oz]);
    }
  }
  if (!near) return;
  const ax = [ux, 0, uz], az = [ox, 0, oz];
  const depth = 0.16;
  const frame = (y, h, w) => k.box('stone',
    [cx + ox * (proud + depth / 2), y, cz + oz * (proud + depth / 2)],
    ax, UP, az, w, h, depth, 'sides');
  const t = 0.16;
  frame(f.y - t / 2, t, winW + t * 2);
  frame(top + t / 2, t, winW + t * 2);
  k.box('stone',
    [cx + ux * (-winW / 2 - t / 2) + ox * (proud + depth / 2), f.y + (top - f.y) / 2, cz + uz * (-winW / 2 - t / 2) + oz * (proud + depth / 2)],
    ax, UP, az, t, top - f.y, depth, 'sides');
  k.box('stone',
    [cx + ux * (winW / 2 + t / 2) + ox * (proud + depth / 2), f.y + (top - f.y) / 2, cz + uz * (winW / 2 + t / 2) + oz * (proud + depth / 2)],
    ax, UP, az, t, top - f.y, depth, 'sides');
}

function towerWindows(k, ring, H, near, proud) {
  const c = center(ring);
  const hc = center(ccw(H));
  const floors = [{ y: 2.1, h: 1.7, arch: false }, { y: 6.0, h: 1.7, arch: true }, { y: 9.7, h: 1.55, arch: false }];
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length];
    const mid = lerp(a, b, 0.5);
    if (dot(sub(mid, c), sub(c, hc)) < 0.2 && len(sub(mid, hc)) < len(sub(c, hc))) continue;
    // Keep the two faces that look away from the block.
    if (dot(unit(sub(mid, hc)), unit(sub(mid, c))) < 0.15) continue;
    bayRun(k, a, b, 0.7, 0.7, floors, near, proud, 1.35);
  }
}

function dentils(k, H, plan, proud) {
  const r = ccw(H);
  for (let i = 0; i < r.length; i++) {
    if (i === plan.northIndex || (i + 2) % r.length === plan.southWall && false) {
      /* north and the street-facing long side: northIndex */
    }
    if (i !== plan.northIndex && i !== (plan.northIndex + 1) % r.length && i !== (plan.northIndex + 3) % r.length) continue;
    const a = r[i], b = r[(i + 1) % r.length];
    if (sameEdge(a, b, plan.southWall)) continue;
    const L = edgeLen(a, b);
    const dx = (b[0] - a[0]) / L, dz = (b[1] - a[1]) / L;
    const ox = dz, oz = -dx;
    const n = Math.floor((L - 8) / 1.35);
    for (let t = 0; t < n; t++) {
      const s = 4 + (t + 0.5) * 1.35;
      if (s > L - 4) break;
      k.box('stone',
        [a[0] + dx * s + ox * (proud + 0.16), 12.75, a[1] + dz * s + oz * (proud + 0.16)],
        [dx, 0, dz], UP, [ox, 0, oz], 0.32, 0.48, 0.22);
    }
  }
}

function vsub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function vcross(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
function vadd(n, a) { n[0] += a[0]; n[1] += a[1]; n[2] += a[2]; }

// One closed white skin. The roof lip is the first row; the cheek stays on
// the outer plan for most of its height, then tucks to the glass. Averaged
// normals so the panels shade as one volume instead of a folded sheet.
function smoothGrid(k, mat, grid, outwardAt) {
  const rows = grid.length, cols = grid[0].length;
  const N = Array.from({ length: rows }, () => Array.from({ length: cols }, () => [0, 0, 0]));
  const tris = [];
  for (let s = 0; s < rows - 1; s++) {
    for (let i = 0; i < cols - 1; i++) {
      const idx = [[s, i], [s, i + 1], [s + 1, i + 1], [s + 1, i]];
      const p = idx.map(([ss, ii]) => grid[ss][ii]);
      const want = outwardAt(p[0], p[2]);
      for (const [i0, i1, i2] of [[0, 1, 3], [1, 2, 3]]) {
        let n = vcross(vsub(p[i1], p[i0]), vsub(p[i2], p[i0]));
        let order = [i0, i1, i2];
        if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] < 0) {
          n = [-n[0], -n[1], -n[2]];
          order = [i0, i2, i1];
        }
        vadd(N[idx[order[0]][0]][idx[order[0]][1]], n);
        vadd(N[idx[order[1]][0]][idx[order[1]][1]], n);
        vadd(N[idx[order[2]][0]][idx[order[2]][1]], n);
        tris.push(order.map((k) => idx[k]));
      }
    }
  }
  for (let s = 0; s < rows; s++) {
    for (let i = 0; i < cols; i++) {
      const n = N[s][i];
      if (s === 0) n[1] += Math.hypot(n[0], n[2]) * 0.22;
      const l = Math.hypot(n[0], n[1], n[2]) || 1;
      n[0] /= l; n[1] /= l; n[2] /= l;
    }
  }
  const positions = [], normals = [], map = new Map();
  const vid = (s, i) => {
    const key = `${s}:${i}`;
    if (map.has(key)) return map.get(key);
    const id = positions.length / 3;
    map.set(key, id);
    positions.push(...grid[s][i]);
    normals.push(...N[s][i]);
    return id;
  };
  k.smooth(mat, positions, normals, tris.flatMap((t) => t.map(([s, i]) => vid(s, i))));
}

function buildTub(k, plan, near) {
  k.cap('white', plan.roof, LEVEL.tubTop, 1);
  const hems = [];
  const step = near ? 2.4 : 4.8;
  const gc = center(plan.glass);
  // h is the tuck toward the glass, v is the drop from the roof lip to the hem.
  // The cheek is a vertical white wall for most of its height. Only the last
  // metre rounds back to the glass, so a street view sees the face, not a soffit.
  const stations = near
    ? [[0, 0], [0.004, 0.06], [0.01, 0.4], [0.016, 0.7], [0.03, 0.84], [0.12, 0.92], [0.42, 0.97], [1, 1]]
    : [[0, 0], [0.012, 0.35], [0.025, 0.75], [0.16, 0.9], [1, 1]];
  for (const chain of plan.shell) {
    if (chain.length < 2) continue;
    const samples = sampleChain(chain, step);
    const row = samples.map((p) => {
      const g = closestOnRing(p, plan.glass);
      const hem = add(g, mul(unit(sub(g, gc)), 0.15));
      const lift = cornerLift(p, chain);
      const y = LEVEL.glassMid + (LEVEL.glassCorner - LEVEL.glassMid) * lift * 0.22;
      hems.push({ x: hem[0], z: hem[1], y });
      return { roof: p, hem, y };
    });
    const grid = stations.map(([h, v]) => row.map((sample) => {
      const p = lerp(sample.roof, sample.hem, h);
      return [p[0], LEVEL.tubTop + (sample.y - LEVEL.tubTop) * v, p[1]];
    }));
    smoothGrid(k, 'white', grid, (a, c) => {
      const mx = (a[0] + c[0]) / 2, mz = (a[2] + c[2]) / 2;
      const o = unit([mx - gc[0], mz - gc[1]]);
      const y = (a[1] + c[1]) / 2;
      // Outward on the vertical run. Only the hem tuck points down, or the
      // whole cheek shades as the underside of a thin sheet.
      const down = y < LEVEL.glassCorner + 0.6 ? -0.4 : 0.12;
      return [o[0], down, o[1]];
    });
  }
  return hems;
}

function buildGlass(k, plan, hems, near, proud) {
  const g = plan.glass;
  const spacing = near ? 2.2 : 3.3;
  const hemY = (p) => {
    let best = Infinity, y = LEVEL.glassMid;
    for (const h of hems) {
      const d = Math.hypot(h.x - p[0], h.z - p[1]);
      if (d < best) { best = d; y = h.y; }
    }
    return best < 10 ? y : LEVEL.glassMid + 0.25;
  };
  for (let i = 0; i < g.length; i++) {
    const a = g[i], b = g[(i + 1) % g.length];
    const L = edgeLen(a, b);
    const n = Math.max(1, Math.round(L / spacing));
    const dx = (b[0] - a[0]) / L, dz = (b[1] - a[1]) / L;
    const ox = dz, oz = -dx;
    for (let s = 0; s < n; s++) {
      const t0 = s / n, t1 = (s + 1) / n;
      const p0 = lerp(a, b, t0), p1 = lerp(a, b, t1);
      const y0 = hemY(p0) - 0.02, y1 = hemY(p1) - 0.02;
      k.quad('light', xz(p0, 0.06), xz(p1, 0.06), [p1[0], y1, p1[1]], [p0[0], y0, p0[1]], [ox, 0, oz]);
      const mid = lerp(p0, p1, 0.5);
      const yTop = Math.min(y0, y1);
      const mullion = (q) => k.box('mesh',
        [q[0] + ox * (proud * 0.5), (0.06 + yTop) / 2, q[1] + oz * (proud * 0.5)],
        [dx, 0, dz], UP, [ox, 0, oz], 0.1, Math.max(0.4, yTop - 0.16), 0.12);
      mullion(p0);
      if (s === n - 1) mullion(p1);
      k.box('mesh',
        [mid[0] + ox * (proud * 0.5), yTop * 0.62, mid[1] + oz * (proud * 0.5)],
        [dx, 0, dz], UP, [ox, 0, oz], edgeLen(p0, p1), 0.1, 0.12);
    }
  }
}

function buildScreen(k, plan, near, proud) {
  const { outer, out, along, thick } = plan.screen;
  const [s, e] = outer;
  const width = edgeLen(s, e);
  const mid = lerp(s, e, 0.5);
  const ax = [along[0], 0, along[1]];
  const az = [out[0], 0, out[1]];
  // The screen stands on the canopy edge and reaches the tagged 17 m.
  const cx = mid[0] - out[0] * thick / 2;
  const cz = mid[1] - out[1] * thick / 2;
  const base = 2.15;
  k.box('mesh', [cx, LEVEL.screen / 2, cz], ax, UP, az, width, LEVEL.screen, thick);
  // Lit doorway on the street face, clear of the perforated skin.
  k.box('light', [
    s[0] + along[0] * width * 0.78 + out[0] * (proud + 0.06),
    1.15,
    s[1] + along[1] * width * 0.78 + out[1] * (proud + 0.06),
  ], ax, UP, az, 1.4, 2.05, 0.12);
  // Ribs suggest the perforated skin. Same material, so they do not form a layered pair.
  const ribs = near ? 18 : 9;
  for (let i = 0; i < ribs; i++) {
    const t = (i + 0.5) / ribs;
    const p = lerp(s, e, t);
    k.box('mesh',
      [p[0] + out[0] * 0.06, base + (LEVEL.screen - base) / 2, p[1] + out[1] * 0.06],
      ax, UP, az, near ? 0.08 : 0.14, LEVEL.screen - base - 0.15, 0.1);
  }
  const depth = near ? 0.22 : 0.36;
  // Viewer's right when facing the screen, so the words read left to right.
  const read = [out[1], -out[0]];
  const rax = [read[0], 0, read[1]];
  const left = dot(read, s) < dot(read, e) ? s : e;
  const right = left === s ? e : s;
  for (const [ch, u, y] of LETTERS) {
    const p = lerp(left, right, u);
    const strokes = GLYPHS[ch] || [[0, 0, 0.72, 1.05]];
    for (const [lx, ly, w, h] of strokes) {
      k.box('sign', [
        p[0] + read[0] * lx + out[0] * (proud + depth / 2),
        y + ly,
        p[1] + read[1] * lx + out[1] * (proud + depth / 2),
      ], rax, UP, az, w, h, depth);
    }
  }
}

// Block strokes, metres from the letter's own centre. Open counters so the
// dark screen shows through and the cloud reads as three words, not tiles.
const GLYPHS = {
  A: [[-0.32, 0.02, 0.16, 1.12], [0.32, 0.02, 0.16, 1.12], [0, 0.5, 0.8, 0.16], [0, 0.05, 0.48, 0.14]],
  M: [[-0.5, 0, 0.16, 1.2], [0.5, 0, 0.16, 1.2], [-0.18, 0.22, 0.16, 0.72], [0.18, 0.22, 0.16, 0.72], [0, -0.12, 0.16, 0.48]],
  S: [[0, 0.48, 0.72, 0.16], [0, 0, 0.62, 0.15], [0, -0.48, 0.72, 0.16], [-0.28, 0.24, 0.16, 0.36], [0.28, -0.24, 0.16, 0.36]],
  T: [[0, 0.5, 0.78, 0.16], [0, -0.08, 0.16, 1.0]],
  E: [[-0.28, 0, 0.16, 1.16], [0.06, 0.5, 0.52, 0.15], [0.02, 0, 0.44, 0.14], [0.06, -0.5, 0.52, 0.15]],
  D: [[-0.32, 0, 0.16, 1.16], [0.02, 0.48, 0.52, 0.16], [0.02, -0.48, 0.52, 0.16], [0.32, 0, 0.16, 0.84]],
  L: [[-0.22, 0.06, 0.16, 1.16], [0.08, -0.48, 0.55, 0.16]],
  I: [[0, 0, 0.16, 1.16]],
  J: [[0.16, 0.08, 0.16, 1.0], [-0.08, -0.46, 0.48, 0.16], [-0.26, -0.28, 0.16, 0.28]],
  K: [[-0.28, 0, 0.16, 1.16], [0.06, 0.28, 0.42, 0.16], [0.1, -0.22, 0.46, 0.16], [0.22, 0.08, 0.16, 0.36]],
  U: [[-0.28, 0.08, 0.16, 1.05], [0.28, 0.08, 0.16, 1.05], [0, -0.46, 0.72, 0.16]],
  R: [[-0.3, 0, 0.16, 1.16], [0.02, 0.46, 0.46, 0.15], [0.02, 0.05, 0.42, 0.14], [0.28, 0.26, 0.16, 0.32], [0.22, -0.32, 0.16, 0.5]],
};

export function shellContacts(model) {
  // Bottom vertices of the white shell should meet the glazed lobby.
  const whites = [];
  model.traverse((o) => {
    if (o.isMesh && (o.material.name === 'white' || o.material.name === 'soffit')) whites.push(o);
  });
  const lights = [];
  model.traverse((o) => { if (o.isMesh && o.material.name === 'light') lights.push(o); });
  return { whites, lights };
}

void area;
