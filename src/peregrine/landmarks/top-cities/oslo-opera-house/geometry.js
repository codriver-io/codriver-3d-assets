import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { tri, triFacing, quadFacing, clipMaxV, clipMinV, clipMaxU, earcut, ringDist } from './oslo-opera-house-mesh.js';

// Facade runs at bearing 116° (west tip toward the south-east water edge).
// +u follows that edge, +v is inland (bearing 26°). Water is -v.
const ALONG = [Math.sin(116 * Math.PI / 180), -Math.cos(116 * Math.PI / 180)];
const INLAND = [Math.sin(26 * Math.PI / 180), -Math.cos(26 * Math.PI / 180)];
const K = mercStretch(SPEC.origin[1]);
const OX = lngToMercX(SPEC.origin[0]);
const OZ = -latToMercY(SPEC.origin[1]);

export const GLASS_U = [-38.3, 61.4];
export const GLASS_V = -34.55;
export const CREASE_V = -50.2;
export const TOWER = { u0: 3.05, u1: 26.75, v0: -26.35, v1: 3.82, top: 35 };

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const kw = (u) => clamp((u + 110) / 230, 0, 1);
const kg = (u) => clamp((u - GLASS_U[0]) / (GLASS_U[1] - GLASS_U[0]), -0.08, 1.06);

export function toLocal(lng, lat) {
  return [(lngToMercX(lng) - OX) / K, (-latToMercY(lat) - OZ) / K];
}
export function fromUV(u, v, y = 0) {
  return [ALONG[0] * u + INLAND[0] * v, y, ALONG[1] * u + INLAND[1] * v];
}
export function toUV(x, z) {
  return [x * ALONG[0] + z * ALONG[1], x * INLAND[0] + z * INLAND[1]];
}
function outwardUV(mid, interior) {
  const du = mid[0] - interior[0], dv = mid[1] - interior[1];
  const len = Math.hypot(du, dv) || 1;
  return [ALONG[0] * du / len + INLAND[0] * dv / len, 0, ALONG[1] * du / len + INLAND[1] * dv / len];
}
const waterDir = [-INLAND[0], 0, -INLAND[1]];
const landDir = [INLAND[0], 0, INLAND[1]];
const eastDir = [ALONG[0], 0, ALONG[1]];
const westDir = [-ALONG[0], 0, -ALONG[1]];

// Public marble. Low on the fjord edge, a kink at the crease, then a steeper climb inland.
export function yAt(u, v) {
  const k = kw(u);
  const yW = 0.42 + k * 0.5;
  const yC = yW + 1.65 + k * 1.15;
  if (v <= CREASE_V) {
    const t = clamp((v + 59.5) / (CREASE_V + 59.5), 0, 1);
    return yW + t * (yC - yW);
  }
  const t = clamp((v - CREASE_V) / 38, 0, 1);
  return yC + t * ((15.2 + k * 3.2) - yC);
}
export function yLip(u) { return 7.05 + kg(u) * 9.35; }
export function yRoof(u) { return 22.45 - clamp(kg(u), 0, 1) * 2.55; }

function uvRing(index) {
  const ring = FOOTPRINTS[index];
  const pts = ring.map(([lng, lat]) => toUV(...toLocal(lng, lat)));
  if (pts.length > 1 && Math.hypot(pts[0][0] - pts.at(-1)[0], pts[0][1] - pts.at(-1)[1]) < 1e-3) pts.pop();
  return pts;
}

function emitTerrain(top, side, ring, outline, interior) {
  if (ring.length < 3) return;
  const tris = earcut(ring);
  const P = (p, y) => fromUV(p[0], p[1], y);
  for (const [i, j, k] of tris) {
    const A = P(ring[i], yAt(ring[i][0], ring[i][1]));
    const B = P(ring[j], yAt(ring[j][0], ring[j][1]));
    const C = P(ring[k], yAt(ring[k][0], ring[k][1]));
    triFacing(top, A, B, C, [0, 1, 0]);
    triFacing(side, [A[0], 0, A[2]], [C[0], 0, C[2]], [B[0], 0, B[2]], [0, -1, 0]);
  }
  for (let e = 0; e < ring.length; e++) {
    const a = ring[e], b = ring[(e + 1) % ring.length];
    const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    if (ringDist(mid, outline) > 0.55) continue;
    const A = P(a, yAt(a[0], a[1])), B = P(b, yAt(b[0], b[1]));
    quadFacing(side, [A[0], 0, A[2]], [B[0], 0, B[2]], B, A, outwardUV(mid, interior));
  }
}

function addBox(dst, u0, v0, u1, v1, y0, y1) {
  const p = (u, v, y) => fromUV(u, v, y);
  const c = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
  const top = c.map(([u, v]) => p(u, v, y1));
  const bot = c.map(([u, v]) => p(u, v, y0));
  const ctr = [(u0 + u1) / 2, (v0 + v1) / 2];
  triFacing(dst, top[0], top[1], top[2], [0, 1, 0]);
  triFacing(dst, top[0], top[2], top[3], [0, 1, 0]);
  triFacing(dst, bot[0], bot[2], bot[1], [0, -1, 0]);
  triFacing(dst, bot[0], bot[3], bot[2], [0, -1, 0]);
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    quadFacing(dst, bot[i], bot[j], top[j], top[i], outwardUV([(c[i][0] + c[j][0]) / 2, (c[i][1] + c[j][1]) / 2], ctr));
  }
}

// Thin marble plane in front of the foyer glass. Low where it leaves the plaza on the
// west, rising to the east, then narrowing to the cantilevered point. Same mesh both LODs.
const BLADE_U0 = -41;
const BLADE_UG = 63;
const BLADE_UT = 96;
export function bladeProfile(u) {
  if (u >= BLADE_UT) return { vOut: -43.3, vIn: -43.3, yOut: 16.3, yIn: 16.3, thick: 0.42 };
  if (u >= BLADE_UG) {
    const t = clamp((u - BLADE_UG) / (BLADE_UT - BLADE_UG), 0, 1);
    return {
      vOut: -41.0 + (-43.3 + 41.0) * t,
      vIn: -35.05 + (-43.3 + 35.05) * t,
      yOut: 12.75 + (16.3 - 12.75) * t,
      yIn: 18.6 + (16.3 - 18.6) * t,
      thick: 0.62 - t * 0.2,
    };
  }
  const t = clamp((u - BLADE_U0) / (BLADE_UG - BLADE_U0), 0, 1);
  const quay = u < 44 ? CREASE_V - 0.02 : -45.4;
  const pull = u < 44 ? 0.15 : 4.4 * t;
  return {
    vOut: quay + pull,
    vIn: GLASS_V - 0.42,
    yOut: yAt(Math.min(u, 42), CREASE_V) + 0.18 + Math.pow(t, 2.15) * 9.4,
    yIn: 6.6 + t * 12.0,
    thick: 0.92 - t * 0.3,
  };
}

function addBlade(dst, segments) {
  const us = Array.from({ length: segments + 1 }, (_, i) => BLADE_U0 + (BLADE_UT - BLADE_U0) * i / segments);
  const P = us.map((u) => bladeProfile(u));
  const top = P.map((p, i) => [fromUV(us[i], p.vOut, p.yOut), fromUV(us[i], p.vIn, p.yIn)]);
  const bot = P.map((p, i) => [fromUV(us[i], p.vOut, p.yOut - p.thick), fromUV(us[i], p.vIn, p.yIn - p.thick * 0.8)]);
  for (let i = 0; i < segments; i++) {
    triFacing(dst, top[i][0], top[i + 1][0], top[i + 1][1], [0, 1, 0]);
    triFacing(dst, top[i][0], top[i + 1][1], top[i][1], [0, 1, 0]);
    triFacing(dst, bot[i][0], bot[i + 1][1], bot[i + 1][0], [0, -1, 0]);
    triFacing(dst, bot[i][0], bot[i][1], bot[i + 1][1], [0, -1, 0]);
    quadFacing(dst, bot[i][0], bot[i + 1][0], top[i + 1][0], top[i][0], waterDir);
    quadFacing(dst, bot[i + 1][1], bot[i][1], top[i][1], top[i + 1][1], landDir);
  }
  quadFacing(dst, bot[0][1], bot[0][0], top[0][0], top[0][1], westDir);
}

function addTaper(dst, u0, u1, y0a, y1a, y0b, y1b, v, thick, frontDir) {
  const f = (u, y) => fromUV(u, v, y);
  const bk = (u, y) => fromUV(u, v + thick, y);
  const fw0 = f(u0, y0a), fw1 = f(u0, y1a), fe0 = f(u1, y0b), fe1 = f(u1, y1b);
  const bw0 = bk(u0, y0a), bw1 = bk(u0, y1a), be0 = bk(u1, y0b), be1 = bk(u1, y1b);
  quadFacing(dst, fw0, fe0, fe1, fw1, frontDir);
  quadFacing(dst, bw0, bw1, be1, be0, [-frontDir[0], 0, -frontDir[2]]);
  quadFacing(dst, fw0, bw0, be0, fe0, [0, -1, 0]);
  quadFacing(dst, fw1, fe1, be1, bw1, [0, 1, 0]);
  quadFacing(dst, fw0, fw1, bw1, bw0, westDir);
  quadFacing(dst, fe0, be0, be1, fe1, eastDir);
}

function weave(dst, a, b, y0, y1, normal, near) {
  const width = Math.hypot(b[0] - a[0], b[2] - a[2]);
  const tx = (b[0] - a[0]) / width, tz = (b[2] - a[2]) / width;
  const putPanel = (s0, s1, ya, yb, proud) => {
    const q = (s, y, p) => [a[0] + tx * s + normal[0] * p, y, a[2] + tz * s + normal[2] * p];
    const o = 0.02;
    quadFacing(dst, q(s0, ya, proud), q(s1, ya, proud), q(s1, yb, proud), q(s0, yb, proud), normal);
    if (proud > o + 0.02) {
      quadFacing(dst, q(s0, ya, o), q(s0, yb, o), q(s0, yb, proud), q(s0, ya, proud), [-tx, 0, -tz]);
      quadFacing(dst, q(s1, ya, proud), q(s1, yb, proud), q(s1, yb, o), q(s1, ya, o), [tx, 0, tz]);
      quadFacing(dst, q(s0, ya, o), q(s1, ya, o), q(s1, ya, proud), q(s0, ya, proud), [0, -1, 0]);
      quadFacing(dst, q(s0, yb, proud), q(s1, yb, proud), q(s1, yb, o), q(s0, yb, o), [0, 1, 0]);
    }
  };
  if (!near) {
    for (let i = 1; i <= 4; i++) {
      const y = y0 + (y1 - y0) * i / 5;
      putPanel(0.55, width - 0.55, y - 0.16, y + 0.16, -0.05);
    }
    const du = 3.6, dv = 2.8;
    const cols = Math.max(1, Math.floor((width - 0.8) / du));
    const rows = Math.max(1, Math.floor((y1 - y0) / dv));
    const su = (width - 0.8) / cols, sv = (y1 - y0) / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const s0 = 0.4 + c * su, s1 = s0 + su * 0.9;
        if (s1 > width - 0.3) continue;
        putPanel(s0, s1, y0 + r * sv + 0.06, y0 + (r + 1) * sv - 0.06, 0.02);
      }
    }
    return;
  }
  const du = 1.6, dv = 1.2;
  const cols = Math.max(1, Math.floor((width - 0.7) / du));
  const rows = Math.max(1, Math.floor((y1 - y0) / dv));
  const su = (width - 0.7) / cols, sv = (y1 - y0) / rows;
  for (let r = 0; r < rows; r++) {
    const shift = (r % 2) * su * 0.5;
    for (let c = 0; c < cols; c++) {
      let s0 = 0.35 + c * su + shift, s1 = s0 + su * 0.92;
      if (s0 < 0.3 || s1 > width - 0.3) continue;
      const proud = ((c + r) % 2 === 0) ? 0.05 : 0.018;
      putPanel(s0, s1, y0 + r * sv + 0.04, y0 + (r + 1) * sv - 0.04, proud);
    }
  }
}

function joints(b, scale) {
  const bar = (u0, v0, u1, v1) => {
    const y0 = yAt(u0, v0), y1 = yAt(u1, v1);
    b.bar('joint', fromUV(u0, v0, y0 + 0.07), fromUV(u1, v1, y1 + 0.07), 0.055, 0.03);
  };
  for (let v = -58.2; v <= CREASE_V - 0.4; v += 1.7 * scale) bar(-100, v, 42, v);
  for (let u = -98; u <= 42; u += 1.7 * scale) bar(u, -58.2, u, CREASE_V - 0.15);
  for (let v = -46; v <= 38; v += 2.6 * scale) bar(-104, v, v < -8 ? -43 : -55, v);
  for (let u = -102; u <= -46; u += 2.6 * scale) bar(u, -47, u, 34);
  for (let u = -34; u <= 58; u += 3.4 * scale) {
    const p = bladeProfile(u);
    const yA = p.yOut + 0.05, yB = p.yIn + 0.05;
    b.bar('joint', fromUV(u, p.vOut + 0.35, yA), fromUV(u, p.vIn - 0.25, yB), 0.05, 0.028);
  }
}

function soup(builder, material, positions) {
  if (positions.length < 9) return;
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.computeVertexNormals();
  builder.put(g, material);
}

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const marble = [], granite = [], aluminium = [], glass = [], voidPts = [];
  const outline = uvRing(0);
  const south = clipMaxV(outline, CREASE_V);
  const west = clipMaxU(clipMinV(outline, CREASE_V), -40.2);
  emitTerrain(marble, granite, south, outline, [0, -55]);
  // Bands keep the west ramp a sequence of flat planes. One polygon across 100 m of rise dishes the middle.
  const cuts = [CREASE_V, -36, -18, 0, 22, 56];
  for (let i = 0; i < cuts.length - 1; i++) {
    const band = clipMaxV(clipMinV(west, cuts[i]), cuts[i + 1]);
    emitTerrain(marble, granite, band, outline, [-90, 0]);
  }

  // The blade crosses a tall glass wall that leans out over the fjord, so the glazing
  // reads as a face from the water, with glass above the blade on the west and under it on the east.
  addBlade(marble, 16);
  const [u0, u1] = GLASS_U;
  const GLASS_LEAN = 4.6;
  const vGlass = (y) => GLASS_V - GLASS_LEAN * clamp((y - 0.3) / 19.5, 0, 1);
  const addLeaned = (dst, ua, ub, y0a, y1a, y0b, y1b, proud, depth) => {
    const f = (u, y) => fromUV(u, vGlass(y) + proud, y);
    const bk = (u, y) => fromUV(u, vGlass(y) + proud + depth, y);
    const fw0 = f(ua, y0a), fw1 = f(ua, y1a), fe0 = f(ub, y0b), fe1 = f(ub, y1b);
    const bw0 = bk(ua, y0a), bw1 = bk(ua, y1a), be0 = bk(ub, y0b), be1 = bk(ub, y1b);
    quadFacing(dst, fw0, fe0, fe1, fw1, waterDir);
    quadFacing(dst, bw0, bw1, be1, be0, landDir);
    quadFacing(dst, fw0, bw0, be0, fe0, [0, -1, 0]);
    quadFacing(dst, fw1, fe1, be1, bw1, [0, 1, 0]);
    quadFacing(dst, fw0, fw1, bw1, bw0, westDir);
    quadFacing(dst, fe0, be0, be1, fe1, eastDir);
  };
  const sill = 0.42;
  const head = (u) => yRoof(u) - 1.2;
  const door0 = 6, door1 = 14, doorTop = 2.55;
  addLeaned(glass, u0, door0, sill, head(u0), sill, head(door0), -0.02, 0.2);
  addLeaned(glass, door1, u1, sill, head(door1), sill, head(u1), -0.02, 0.2);
  addLeaned(glass, door0, door1, doorTop, head(door0), doorTop, head(door1), -0.02, 0.2);
  addBox(voidPts, door0 + 0.2, GLASS_V + 0.22, door1 - 0.2, GLASS_V + 0.62, 0.12, doorTop - 0.12);

  const mullionStep = near ? 2.45 : 4.4;
  for (let u = u0 + 1.15; u < u1 - 0.5; u += mullionStep) {
    const y0 = (u > door0 && u < door1) ? doorTop + 0.2 : sill + 0.12;
    const y1 = head(u) - 0.12;
    b.bar('steel', fromUV(u, vGlass(y0) - 0.24, y0), fromUV(u, vGlass(y1) - 0.24, y1), near ? 0.11 : 0.18, 0.07);
  }
  for (const y of [6.2, 9.5, 12.7, 15.8]) {
    b.bar('steel', fromUV(u0 + 0.4, vGlass(y) - 0.26, y), fromUV(u1 - 0.4, vGlass(y) - 0.26, y), near ? 0.09 : 0.14, 0.06);
  }
  for (const y of [4.8, 8.0, 11.1, 14.15]) {
    b.bar('light', fromUV(u0 + 0.5, vGlass(y) - 0.2, y), fromUV(u1 - 0.5, vGlass(y) - 0.2, y), 0.26, 0.05);
  }
  // White diagonal foyer columns, proud of the dark glass so they read on an opaque wall.
  const diagCount = near ? 8 : 6;
  for (let i = 0; i < diagCount; i++) {
    const uA = u0 + 2.4 + i * ((u1 - u0 - 14) / diagCount);
    const uB = uA + (near ? 11.5 : 13);
    const yA = 1.7;
    const yB = Math.min(head(uB) - 0.7, 16.8);
    b.bar('steel', fromUV(uA, vGlass(yA) - 0.32, yA), fromUV(uB, vGlass(yB) - 0.32, yB), near ? 0.24 : 0.4, near ? 0.1 : 0.14);
  }

  // Foyer roof and fascia directly behind the glass, stopping short of the fly tower.
  const foyer = [];
  const fV0 = GLASS_V + 0.5, fV1 = TOWER.v0 - 0.28;
  const fSeg = 6;
  for (let i = 0; i < fSeg; i++) {
    const ua = -42 + (64 - -42) * i / fSeg, ub = -42 + (64 - -42) * (i + 1) / fSeg;
    triFacing(marble, fromUV(ua, fV0, yRoof(ua)), fromUV(ub, fV0, yRoof(ub)), fromUV(ub, fV1, yRoof(ub)), [0, 1, 0]);
    triFacing(marble, fromUV(ua, fV0, yRoof(ua)), fromUV(ub, fV1, yRoof(ub)), fromUV(ua, fV1, yRoof(ua)), [0, 1, 0]);
    quadFacing(marble, fromUV(ua, fV0, yRoof(ua) - 1.52), fromUV(ub, fV0, yRoof(ub) - 1.52), fromUV(ub, fV0 - 0.55, yRoof(ub) - 1.52), fromUV(ua, fV0 - 0.55, yRoof(ua) - 1.52), [0, -1, 0]);
    quadFacing(marble, fromUV(ua, fV0 - 0.55, yRoof(ua) - 1.52), fromUV(ub, fV0 - 0.55, yRoof(ub) - 1.52), fromUV(ub, fV0 - 0.55, yRoof(ub)), fromUV(ua, fV0 - 0.55, yRoof(ua)), waterDir);
    quadFacing(marble, fromUV(ua, fV0 - 0.55, yRoof(ua)), fromUV(ub, fV0 - 0.55, yRoof(ub)), fromUV(ub, fV0, yRoof(ub)), fromUV(ua, fV0, yRoof(ua)), [0, 1, 0]);
  }
  // Side halls run inland so the roof is one stepped block, not a row of separated boxes.
  addBox(granite, -43.5, fV0, -2.5, 47, 0, 15.4);
  addBox(granite, 28.2, fV0, 66, 18, 0, 16.2);
  addBox(marble, -43.5, fV0, -2.5, 47, 15.4, 15.85);
  addBox(marble, 28.2, fV0, 66, 18, 16.2, 16.65);
  // Close the slot between the west hall and the fly tower, and the slot before the east wing.
  addBox(granite, -2.3, -27, 2.85, 6.4, 0, 14.7);
  addBox(marble, -2.3, -27, 2.85, 6.4, 14.7, 15.1);
  addBox(granite, 65.6, -30, 70.4, 17.5, 0, 14.9);
  addBox(marble, 65.6, -30, 70.4, 17.5, 14.9, 15.3);
  void foyer;

  // Fly tower, Løvaas & Wagle weave on the near aluminium, four shadow courses on far.
  addBox(aluminium, TOWER.u0, TOWER.v0, TOWER.u1, TOWER.v1, 0, TOWER.top);
  const faces = [
    [fromUV(TOWER.u0, TOWER.v0, 0), fromUV(TOWER.u1, TOWER.v0, 0), waterDir],
    [fromUV(TOWER.u1, TOWER.v1, 0), fromUV(TOWER.u0, TOWER.v1, 0), landDir],
    [fromUV(TOWER.u0, TOWER.v1, 0), fromUV(TOWER.u0, TOWER.v0, 0), westDir],
    [fromUV(TOWER.u1, TOWER.v0, 0), fromUV(TOWER.u1, TOWER.v1, 0), eastDir],
  ];
  for (const [a, c, n] of faces) weave(aluminium, a, c, 0.45, TOWER.top - 0.4, n, near);

  // Smaller stage house, north-east of the tower.
  addBox(aluminium, 25.3, 21.1, 44.6, 42.4, 0, 25);
  const stageFaces = [
    [fromUV(25.3, 21.1, 0), fromUV(44.6, 21.1, 0), waterDir],
    [fromUV(44.6, 42.4, 0), fromUV(25.3, 42.4, 0), landDir],
    [fromUV(25.3, 42.4, 0), fromUV(25.3, 21.1, 0), westDir],
    [fromUV(44.6, 21.1, 0), fromUV(44.6, 42.4, 0), eastDir],
  ];
  for (const [a, c, n] of stageFaces) weave(aluminium, a, c, 0.4, 24.6, n, false);

  // East wing split so the taller middle (OSM height 23 / min_height 18) does not share a roof plane with the quay wing.
  // Corners are inside ways 910163883, 910589015 and 910884295.
  // Wing face sits just inland of the blade so the cantilever reads in front of it.
  addBox(granite, 70, -36.6, 108, -25.4, 0, 15.2);
  addBox(marble, 70, -36.6, 108, -25.4, 15.2, 15.7);
  addBox(granite, 70, -25.55, 108, -3.15, 0, 22.15);
  addBox(marble, 70, -25.55, 108, -3.15, 22.15, 22.6);
  addBox(granite, 70, -3.3, 108, 16.2, 0, 15.2);
  addBox(marble, 70, -3.3, 108, 16.2, 15.2, 15.7);
  addBox(granite, 68, -45.2, 108, -37.2, 0, 4.15);
  addBox(marble, 68, -45.2, 108, -37.2, 4.15, 4.5);
  for (const y of [6.2, 9.4, 12.4]) addBox(glass, 74, -36.82, 104, -36.62, y, y + 1.35);
  addBox(granite, 47, 16.2, 100, 58, 0, 16.4);
  addBox(marble, 47, 16.2, 100, 58, 16.4, 16.9);
  addBox(granite, -16, 6, 26, 50, 0, 14.6);
  addBox(marble, -16, 6, 26, 50, 14.6, 15.05);
  addBox(granite, 108.4, -38, 114.2, 8, 0, 9.4);
  addBox(marble, 108.4, -38, 114.2, 8, 9.4, 9.85);

  joints(b, near ? 1 : 2.15);
  soup(b, 'marble', marble);
  soup(b, 'granite', granite);
  soup(b, 'aluminium', aluminium);
  soup(b, 'glass', glass);
  soup(b, 'void', voidPts);
  return b.finish();
}


