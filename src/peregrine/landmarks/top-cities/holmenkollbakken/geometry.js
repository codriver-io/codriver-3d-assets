// Holmenkollbakken, the 2010 steel jump. Original geometry, no textures.
// The landing is a closed graded embankment under the snow.
// The white-clad cantilever leaves one slender start tower and a short raked
// root support. Stepped stands continue around the horseshoe outrun. y = 0 is the outrun on the flat Cityscape map.
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS, OSM_WAYS } from './footprint.js';
import { quads } from './holmenkollbakken-mesh.js';
import {
  CERT, INRUN, GATE, HOUSE, ARCH, LETTER_U, LIP_Y, CROWN,
  D_HAT, R_HAT, world, uvOfLngLat, inrunAt, landingY, landingSlope, landingHalf, archNode,
} from './holmenkollbakken-plan.js';

const UP = [0, 1, 0];
const DOWN = [0, -1, 0];
const RIGHT = [R_HAT[0], 0, R_HAT[1]];
const LEFT = [-R_HAT[0], 0, -R_HAT[1]];
const DOWNHILL = [D_HAT[0], 0, D_HAT[1]];
const UPHILL = [-D_HAT[0], 0, -D_HAT[1]];
const SOLE = 0.08;

const STAND_IDS = new Set([81147230, 173145219, 173048162, 173048163]);
const FLARE_IDS = new Set([923958455, 923958456]);
const RINGS = OSM_WAYS.map((id, i) => ({
  id,
  uv: FOOTPRINTS[i].map(([lng, lat]) => uvOfLngLat(lng, lat)),
}));

function pip(uv, u, v) {
  let inside = false;
  for (let i = 0, j = uv.length - 1; i < uv.length; j = i++) {
    const [xi, yi] = uv[i], [xj, yj] = uv[j];
    if ((yi > v) !== (yj > v) && u < ((xj - xi) * (v - yi)) / ((yj - yi) || 1e-12) + xi) inside = !inside;
  }
  return inside;
}

function covered(ids, u, v) {
  for (const ring of RINGS) {
    if (ids.has(ring.id) && pip(ring.uv, u, v)) return true;
  }
  return false;
}

function bandsAt(u, ids) {
  const bands = [];
  let start = null;
  let prev = -68;
  for (let v = -68; v <= 68.01; v += 0.8) {
    if (covered(ids, u, v)) {
      if (start === null) start = v;
    } else if (start !== null) {
      bands.push([start, prev]);
      start = null;
    }
    prev = v;
  }
  if (start !== null) bands.push([start, prev]);
  return bands;
}

function standBands(u) {
  const snow = landingHalf(u) + 0.85;
  const out = [];
  for (const [a, c] of bandsAt(u, STAND_IDS)) {
    if (a < -snow) out.push([a + 0.55, Math.min(c, -snow) - 0.35]);
    if (c > snow) out.push([Math.max(a, snow) + 0.35, c - 0.55]);
  }
  // The OSM stand rings overlap in plan but their separate scan bands left
  // gaps between the upper terraces and the outer outrun block. Join each
  // flank's intervals before longitudinal interpolation.
  const joined = [];
  for (const sign of [-1, 1]) {
    const side = out.filter(([a, c]) => (a + c) * sign > 0);
    if (u >= ARCH.uFoot && u < 72) side.push(sign < 0
      ? [-32, -snow - 0.35] : [snow + 0.35, 32]);
    // Carry the jumper-right outer terrace back to the upper stand. The
    // thin isolated OSM band here otherwise vanishes during scan matching.
    if (sign > 0 && u >= 128 && u <= 188) {
      const f = (u - 128) / 60;
      side.push([14 + 24 * f, 48 + 10 * f]);
    }
    if (side.length) joined.push([Math.min(...side.map(([a]) => a)), Math.max(...side.map(([, c]) => c))]);
  }
  return joined.filter(([a, c]) => c - a > 2.4);
}

function unit(v) {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
}

function thicken(faces, gap) {
  const extra = [];
  for (const face of faces) {
    const n = unit(face.out);
    extra.push(face);
    extra.push({
      pts: face.pts.map((p) => [p[0] - n[0] * gap, p[1] - n[1] * gap, p[2] - n[2] * gap]),
      out: [-n[0], -n[1], -n[2]],
    });
  }
  return extra;
}

function subdivide(keys, parts, near) {
  if (!near) return keys.slice();
  const us = [];
  for (let i = 0; i < keys.length - 1; i++) {
    for (let k = 0; k < parts; k++) us.push(keys[i] + ((keys[i + 1] - keys[i]) * k) / parts);
  }
  us.push(keys[keys.length - 1]);
  return us;
}

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  inrun(b, near);
  landing(b, near);
  arch(b, near);
  stands(b, near);
  horseshoe(b, near);
  judge(b, near);
  house(b, near);
  supports(b, near);
  lights(b, near);
  letters(b);
  lines(b);
  return b.finish();
}

function inrun(b, near) {
  const mesh = [], soffit = [], track = [];
  const tw = CERT.trackW / 2;
  for (let i = 0; i < INRUN.length - 1; i++) {
    const a = INRUN[i], c = INRUN[i + 1];
    for (const sign of [-1, 1]) {
      const va = sign * (a.half - 0.16), vc = sign * (c.half - 0.16);
      b.bar('mesh', world(a.u, va, a.y + a.screen), world(c.u, vc, c.y + c.screen), 0.34, 0.28);
      b.bar('mesh', world(a.u, va, a.y - a.depth), world(c.u, vc, c.y - c.depth), 0.34, 0.28);
      const sa = sign * (a.half - 0.58), sc = sign * (c.half - 0.58);
      mesh.push({
        pts: [
          world(a.u, sa, a.y - a.depth + 0.2), world(c.u, sc, c.y - c.depth + 0.2),
          world(c.u, sc, c.y + c.screen - 0.18), world(a.u, sa, a.y + a.screen - 0.18),
        ],
        out: sign > 0 ? RIGHT : LEFT,
      });
    }
    soffit.push({
      pts: [
        world(a.u, -(a.half - 0.36), a.y - a.depth + 0.02),
        world(a.u, a.half - 0.36, a.y - a.depth + 0.02),
        world(c.u, c.half - 0.36, c.y - c.depth + 0.02),
        world(c.u, -(c.half - 0.36), c.y - c.depth + 0.02),
      ],
      out: DOWN,
    });
    track.push({
      pts: [
        world(a.u, -tw, a.y + 0.18), world(a.u, tw, a.y + 0.18),
        world(c.u, tw, c.y + 0.18), world(c.u, -tw, c.y + 0.18),
      ],
      out: UP,
    });
    track.push({
      pts: [
        world(a.u, tw, a.y + 0.02), world(a.u, tw, a.y + 0.18),
        world(c.u, tw, c.y + 0.18), world(c.u, tw, c.y + 0.02),
      ],
      out: RIGHT,
    });
    track.push({
      pts: [
        world(a.u, -tw, a.y + 0.18), world(a.u, -tw, a.y + 0.02),
        world(c.u, -tw, c.y + 0.02), world(c.u, -tw, c.y + 0.18),
      ],
      out: LEFT,
    });
  }
  quads(b, 'mesh', thicken(mesh, 0.16));
  // Close the continuous side cladding at the top, deck and both ends.
  const closure = [];
  for (let i = 0; i < INRUN.length - 1; i++) {
    const a = INRUN[i], c = INRUN[i + 1];
    for (const sign of [-1, 1]) {
      const va = sign * (a.half - 0.58), vc = sign * (c.half - 0.58);
      closure.push({ pts: [world(a.u, va, a.y + a.screen - 0.18), world(c.u, vc, c.y + c.screen - 0.18), world(c.u, vc - sign * 0.16, c.y + c.screen - 0.18), world(a.u, va - sign * 0.16, a.y + a.screen - 0.18)], out: UP });
    }
    closure.push({ pts: [world(a.u, -a.half + 0.58, a.y), world(a.u, a.half - 0.58, a.y), world(c.u, c.half - 0.58, c.y), world(c.u, -c.half + 0.58, c.y)], out: UP });
  }
  for (const [st, out] of [[INRUN[0], UPHILL], [INRUN.at(-1), DOWNHILL]]) closure.push({ pts: [world(st.u, -st.half + 0.58, st.y - st.depth + 0.2), world(st.u, st.half - 0.58, st.y - st.depth + 0.2), world(st.u, st.half - 0.58, st.y), world(st.u, -st.half + 0.58, st.y)], out });
  quads(b, 'mesh', closure);
  quads(b, 'mesh', soffit);
  quads(b, 'track', track);
  if (!near) return;
  for (let i = 0; i < INRUN.length; i++) {
    const s = INRUN[i];
    for (const sign of [-1, 1]) {
      const v = sign * (s.half - 0.43);
      b.bar('mesh', world(s.u, v, s.y - s.depth + 0.25), world(s.u, v, s.y + s.screen - 0.22), 0.14, 0.14);
    }
    if (!i) continue;
    const p = INRUN[i - 1];
    for (const sign of [-1, 1]) {
      const va = sign * (p.half - 0.43), vc = sign * (s.half - 0.43);
      for (const f of [0.33, 0.66]) {
        const ya = (p.y - p.depth) + f * (p.screen + p.depth);
        const yc = (s.y - s.depth) + f * (s.screen + s.depth);
        b.bar('concrete', world(p.u, va, ya), world(s.u, vc, yc), 0.09, 0.09);
      }
      b.bar('concrete', world(p.u, va, p.y - p.depth + 0.35), world(s.u, vc, s.y + s.screen - 0.3), 0.08, 0.08);
      if (i % 2 === 0) b.bar('concrete', world(p.u, va, p.y + p.screen - 0.3), world(s.u, vc, s.y - s.depth + 0.35), 0.08, 0.08);
    }
  }
}

// The embankment is a deliberately bounded flat-map stand-in, separate from
// provider replacement rings and from the live terrain datum.
function ridgeY(u) {
  const rear = HOUSE.u0 - 15;
  if (u < HOUSE.u0) return SOLE + (HOUSE.grate - SOLE) * Math.max(0, (u - rear) / 15);
  if (u < 1.6) return HOUSE.grate + (landingY(1.6) - HOUSE.grate) * ((u - HOUSE.u0) / (1.6 - HOUSE.u0));
  return Math.max(0.45, landingY(u));
}
function earthHalf(u) {
  const h = u < 1.6 ? 5 : landingHalf(u);
  const stands = standBands(u);
  const outline = Math.max(h, ...stands.flatMap(([a, c]) => [Math.abs(a), Math.abs(c)]));
  // Bound the Cityscape stand-in to 15 m beyond the local landing/stand
  // envelope instead of widening in proportion to the full hill height.
  return Math.min(outline + 15, h + Math.max(4, 1.35 * (ridgeY(u) - SOLE)));
}
function embankmentY(u, v) {
  const h = u < 1.6 ? 5 : landingHalf(u);
  const t = Math.max(0, Math.min(1, (Math.abs(v) - h) / (earthHalf(u) - h)));
  return SOLE + (ridgeY(u) - SOLE) * (1 - t);
}
function landing(b, near) {
  const keys = [HOUSE.u0 - 15, HOUSE.u0, -60, -30, 1.6, 16, 36, 62, 72, 105, 125, 144, 156, 168, 196, 210, 230];
  const us = subdivide(keys, near ? 4 : 2, true);
  // The exterior envelope uses the same piecewise-linear stations in both
  // LODs; fine surface sampling must not grow new plan extrema.
  const toes = keys.map(earthHalf);
  const toeAt = (u) => {
    let i = 0;
    while (i < keys.length - 2 && keys[i + 1] < u) i++;
    const f = (u - keys[i]) / (keys[i + 1] - keys[i]);
    return toes[i] + (toes[i + 1] - toes[i]) * f;
  };
  const snow = [], earth = [], shoulders = [];
  for (let i = 0; i < us.length - 1; i++) {
    const u = us[i], c = us[i + 1], h = u < 1.6 ? 5 : landingHalf(u), hc = c < 1.6 ? 5 : landingHalf(c);
    const y = ridgeY(u), yc = ridgeY(c), toe = toeAt(u), toec = toeAt(c);
    const crown = { pts: [world(u, -h, y), world(u, h, y), world(c, hc, yc), world(c, -hc, yc)], out: UP };
    (u >= 1.6 ? snow : earth).push(crown);
    for (const sign of [-1, 1]) {
      const n = near ? 4 : 2;
      for (let k = 0; k < n; k++) {
        const f = k / n, g = (k + 1) / n;
        shoulders.push({ pts: [world(u, sign * (h + (toe - h) * f), SOLE + (y - SOLE) * (1 - f)), world(c, sign * (hc + (toec - hc) * f), SOLE + (yc - SOLE) * (1 - f)), world(c, sign * (hc + (toec - hc) * g), SOLE + (yc - SOLE) * (1 - g)), world(u, sign * (h + (toe - h) * g), SOLE + (y - SOLE) * (1 - g))], out: UP });
      }
    }
    earth.push({ pts: [world(u, -toe, SOLE), world(u, toe, SOLE), world(c, toec, SOLE), world(c, -toec, SOLE)], out: DOWN });
  }
  for (const [u, out] of [[us[0], UPHILL], [us.at(-1), DOWNHILL]]) {
    const h = u < 1.6 ? 5 : landingHalf(u), y = ridgeY(u), toe = toeAt(u);
    earth.push({ pts: [world(u, -toe, SOLE), world(u, toe, SOLE), world(u, h, y), world(u, -h, y)], out });
  }
  quads(b, 'track', snow);
  quads(b, 'earth', earth);
  quads(b, 'shoulder', shoulders);
}

function arch(b, near) {
  const n = near ? 28 : 16;
  const nodes = [], tops = [];
  for (let i = 0; i <= n; i++) {
    nodes.push(archNode(i / n, false));
    tops.push(archNode(i / n, true));
  }
  const mesh = [], wings = [];
  for (let i = 0; i < n; i++) {
    const a = nodes[i], c = nodes[i + 1], at = tops[i], ct = tops[i + 1];
    b.bar('steel', world(a.u, a.v, a.y), world(c.u, c.v, c.y), 0.38, 0.32);
    b.bar('steel', world(at.u, at.v, at.y), world(ct.u, ct.v, ct.y), 0.38, 0.32);
    b.bar('steel', world(a.u, a.v, a.y), world(at.u, at.v, at.y), 0.26, 0.26);
    mesh.push({
      pts: [
        world(a.u - 0.45, a.v, a.y + 0.25), world(c.u - 0.45, c.v, c.y + 0.25),
        world(ct.u - 0.45, ct.v, ct.y - 0.25), world(at.u - 0.45, at.v, at.y - 0.25),
      ],
      out: DOWNHILL,
    });
    if (near) {
      b.bar('steel', world(a.u, a.v, a.y), world(ct.u, ct.v, ct.y), 0.12, 0.12);
      if (i % 2 === 0) b.bar('steel', world(at.u, at.v, at.y), world(c.u, c.v, c.y), 0.12, 0.12);
    }
    if (Math.abs(a.v) < 8 && Math.abs(c.v) < 8) continue;
    const drop = (p) => Math.max(0, Math.min(8, p.y - landingY(p.u) - 1.6));
    const da = drop(a), dc = drop(c);
    if (da < 1.2 && dc < 1.2) continue;
    wings.push({
      pts: [
        world(a.u - 0.35, a.v, a.y - da), world(c.u - 0.35, c.v, c.y - dc),
        world(c.u - 0.35, c.v, c.y - 0.2), world(a.u - 0.35, a.v, a.y - 0.2),
      ],
      out: DOWNHILL,
    });
  }
  const last = nodes[n], lastT = tops[n];
  b.bar('steel', world(last.u, last.v, last.y), world(lastT.u, lastT.v, lastT.y), 0.26, 0.26);
  quads(b, 'mesh', thicken(mesh, 0.18));
  quads(b, 'mesh', thicken(wings, 0.16));
  const feet = [];
  for (const sign of [-1, 1]) {
    const foot = sign < 0 ? nodes[0] : nodes[n];
    const y0 = Math.max(SOLE, embankmentY(foot.u, foot.v) - 0.2);
    const u0 = foot.u - 2.2, u1 = foot.u + 2.4;
    const v0 = foot.v - sign * 1.6, v1 = foot.v + sign * 1.6;
    const top = foot.y;
    feet.push(
      { pts: [world(u0, v0, top), world(u1, v0, top), world(u1, v1, top), world(u0, v1, top)], out: UP },
      { pts: [world(u0, v1, y0), world(u1, v1, y0), world(u1, v1, top), world(u0, v1, top)], out: sign > 0 ? RIGHT : LEFT },
      { pts: [world(u1, v0, y0), world(u0, v0, y0), world(u0, v0, top), world(u1, v0, top)], out: sign > 0 ? LEFT : RIGHT },
      { pts: [world(u1, v0, y0), world(u1, v1, y0), world(u1, v1, top), world(u1, v0, top)], out: DOWNHILL },
      { pts: [world(u0, v1, y0), world(u0, v0, y0), world(u0, v0, top), world(u0, v1, top)], out: UPHILL },
    );
  }
  quads(b, 'concrete', feet);
}

function slopeY(u) {
  if (u < 72) {
    const f = Math.max(0, (u - ARCH.uFoot) / (72 - ARCH.uFoot));
    return archNode(0, false).y * (1 - f) + (landingY(72) - 0.4) * f;
  }
  return Math.max(0.55, landingY(u) - 0.4);
}

function bowlY(u, v) {
  const inner = landingHalf(u) + 1;
  const t = Math.max(0, (Math.abs(v) - inner) / 34);
  return 0.55 + Math.min(1, t) * 4.2 + Math.max(0, Math.abs(v) - inner) * 0.16;
}

function treadAt(u, v) {
  return landingY(u) > 9 ? slopeY(u) : bowlY(u, v);
}

function stands(b, near) {
  const keys = [ARCH.uFoot];
  for (let u = 72; u <= 252; u += 12) keys.push(u);
  const us = subdivide(keys, near ? 4 : 1, true);
  const atKey = new Map(keys.map((u) => [u, standBands(u)]));
  const concrete = [], seats = [], backing = [];
  const bandAt = (u) => {
    let k = 0;
    while (k < keys.length - 2 && keys[k + 1] < u - 1e-6) k++;
    const f = (u - keys[k]) / (keys[k + 1] - keys[k] || 1);
    const out = [];
    for (const band of atKey.get(keys[k])) {
      const mid = (band[0] + band[1]) / 2;
      const next = atKey.get(keys[k + 1]).find((o) => (o[0] + o[1]) * mid > 0 && o[1] > band[0] && o[0] < band[1]);
      if (!next) continue;
      out.push([band[0] + (next[0] - band[0]) * f, band[1] + (next[1] - band[1]) * f]);
    }
    return out;
  };
  for (let i = 0; i < us.length - 1; i++) {
    const u0 = us[i], u1 = us[i + 1];
    const b0 = bandAt(u0), b1 = bandAt(u1);
    for (const band of b0) {
      const mid = (band[0] + band[1]) / 2;
      const next = b1.find((o) => (o[0] + o[1]) * mid > 0 && o[1] > band[0] + 0.4 && o[0] < band[1] - 0.4);
      if (!next) continue;
      const va0 = band[0], vc0 = band[1], va1 = next[0], vc1 = next[1];
      const pos = mid > 0;
      const slope = landingY(u0) > 9;
      const span = Math.min(vc0 - va0, vc1 - va1);
      const nV = near ? Math.max(1, Math.round(span / 3.6)) : 1;
      for (let k = 0; k < nV; k++) {
        const f0 = k / nV, f1 = (k + 1) / nV;
        const p00 = va0 + (vc0 - va0) * f0, p01 = va0 + (vc0 - va0) * f1;
        const p10 = va1 + (vc1 - va1) * f0, p11 = va1 + (vc1 - va1) * f1;
        const y00 = slope ? slopeY(u0) : bowlY(u0, p00);
        const y01 = slope ? slopeY(u0) : bowlY(u0, p01);
        const y10 = slope ? slopeY(u0) : bowlY(u1, p10);
        const y11 = slope ? slopeY(u0) : bowlY(u1, p11);
        concrete.push({
          pts: [world(u0, p00, y00), world(u0, p01, y01), world(u1, p11, y11), world(u1, p10, y10)],
          out: UP,
        });
        if (slope) {
          const yNext = slopeY(u1);
          if (y00 - yNext > 0.28) {
            concrete.push({
              pts: [world(u1, p10, yNext), world(u1, p11, yNext), world(u1, p11, y00), world(u1, p10, y00)],
              out: DOWNHILL,
            });
          }
        } else if ((pos && k < nV - 1) || (!pos && k > 0)) {
          const outerA = pos ? p01 : p00, outerB = pos ? p11 : p10;
          const yOut0 = pos ? y01 : y00, yOut1 = pos ? y11 : y10;
          const yIn0 = pos ? y00 : y01, yIn1 = pos ? y10 : y11;
          if (yOut0 - yIn0 > 0.28) {
            concrete.push({
              pts: [world(u0, outerA, yIn0), world(u1, outerB, yIn1), world(u1, outerB, yOut1), world(u0, outerA, yOut0)],
              out: pos ? RIGHT : LEFT,
            });
          }
        }
        if (near) {
          const back = slope ? slopeY(u0) : (y00 + y01) / 2;
          b.bar('steel', world(u0 + 0.28, p00 + (p01 - p00) * 0.12, back + 0.38), world(u0 + 0.28, p01 - (p01 - p00) * 0.12, back + 0.38), 0.12, 0.28);
        }
        if (near && i % 2 === 0) {
          const seatV0 = p00 + (p01 - p00) * 0.18;
          const seatV1 = p00 + (p01 - p00) * 0.8;
          const s10 = p10 + (p11 - p10) * 0.18;
          const s11 = p10 + (p11 - p10) * 0.8;
          seats.push({
            pts: [
              world(u0 + 0.12, seatV0, y00 + 0.14), world(u0 + 0.12, seatV1, y01 + 0.14),
              world(u1 - 0.1, s11, y11 + 0.14), world(u1 - 0.1, s10, y10 + 0.14),
            ],
            out: UP,
          });
        }
      }
      const outer0 = pos ? vc0 : va0, outer1 = pos ? vc1 : va1;
      const inner0 = pos ? va0 : vc0, inner1 = pos ? va1 : vc1;
      const yo0 = treadAt(u0, outer0), yo1 = treadAt(u1, outer1);
      const bo0 = yo0 - 0.6, bo1 = yo1 - 0.6;
      const yi0 = treadAt(u0, inner0), yi1 = treadAt(u1, inner1);
      const outN = pos ? RIGHT : LEFT;
      const inN = pos ? LEFT : RIGHT;
      concrete.push(
        { pts: [world(u0, outer0, bo0), world(u1, outer1, bo1), world(u1, outer1, yo1), world(u0, outer0, yo0)], out: outN },
        { pts: [world(u1, inner1, yi1 - 0.6), world(u0, inner0, yi0 - 0.6), world(u0, inner0, yi0), world(u1, inner1, yi1)], out: inN },
        { pts: [world(u0, inner0, SOLE), world(u0, outer0, bo0), world(u1, outer1, bo1), world(u1, inner1, SOLE)], out: DOWN },
      );
      backing.push({ pts: [world(u0, outer0, bo0), world(u1, outer1, bo1), world(u1, outer1 + (pos ? 1 : -1) * Math.min(15, Math.max(4, bo1)), SOLE), world(u0, outer0 + (pos ? 1 : -1) * Math.min(15, Math.max(4, bo0)), SOLE)], out: UP });
      if (near) {
        const railV0 = outer0 - (pos ? 0.55 : -0.55);
        const railV1 = outer1 - (pos ? 0.55 : -0.55);
        b.bar('steel', world(u0, railV0, yo0 + 0.85), world(u1, railV1, yo1 + 0.85), 0.1, 0.12);
        if (i % 2 === 0) {
          b.bar('steel', world(u0, railV0, yo0 + 0.15), world(u0, railV0, yo0 + 0.85), 0.1, 0.1);
        }
      }
    }
  }
  quads(b, 'concrete', concrete);
  quads(b, 'seat', seats);
  quads(b, 'shoulder', backing);
}

function judge(b, near) {
  const glass = near ? 'glass' : 'steel';
  const u0 = 98, u1 = 114, v0 = -28.6, v1 = -20.4;
  const floor = landingY(u1) - 0.2, roof = floor + 6.4;
  const faces = [
    { pts: [world(u0, v0, roof), world(u1, v0, roof), world(u1, v1, roof), world(u0, v1, roof)], out: UP },
    { pts: [world(u0, v0, floor), world(u0, v1, floor), world(u0, v1, roof), world(u0, v0, roof)], out: UPHILL },
    { pts: [world(u1, v1, floor), world(u1, v0, floor), world(u1, v0, roof), world(u1, v1, roof)], out: DOWNHILL },
    { pts: [world(u0, v0, floor), world(u1, v0, floor), world(u1, v0, roof), world(u0, v0, roof)], out: LEFT },
    { pts: [world(u1, v1, floor), world(u0, v1, floor), world(u0, v1, roof - 1.4), world(u1, v1, roof - 1.4)], out: RIGHT },
  ];
  quads(b, 'concrete', faces);
  quads(b, glass, thicken([{
    pts: [
      world(u1 - 0.12, v1 + 0.15, floor + 1.5), world(u0 + 0.12, v1 + 0.15, floor + 1.5),
      world(u0 + 0.12, v1 + 0.15, roof - 0.45), world(u1 - 0.12, v1 + 0.15, roof - 0.45),
    ],
    out: RIGHT,
  }], 0.1));
}

function house(b, near) {
  const glass = near ? 'glass' : 'steel';
  const { u0, u1, v, floor, roof, rail, grate } = HOUSE;
  const deck0 = u0 - 0.3, deck1 = GATE.u - 0.2, dv = 4.15;
  const deckY = GATE.y;
  quads(b, 'steel', [
    { pts: [world(deck0, -dv, deckY), world(deck1, -dv, deckY), world(deck1, dv, deckY), world(deck0, dv, deckY)], out: UP },
    { pts: [world(deck0, dv, deckY - 0.4), world(deck1, dv, deckY - 0.4), world(deck1, dv, deckY), world(deck0, dv, deckY)], out: RIGHT },
    { pts: [world(deck1, -dv, deckY - 0.4), world(deck0, -dv, deckY - 0.4), world(deck0, -dv, deckY), world(deck1, -dv, deckY)], out: LEFT },
    { pts: [world(deck0, dv, deckY - 0.4), world(deck0, -dv, deckY - 0.4), world(deck0, -dv, deckY), world(deck0, dv, deckY)], out: UPHILL },
  ]);
  quads(b, 'steel', [{
    pts: [world(u0 - 3.1, -2.3, grate), world(u0 - 0.2, -2.3, grate), world(u0 - 0.2, 2.3, grate), world(u0 - 3.1, 2.3, grate)],
    out: UP,
  }]);
  quads(b, 'steel', [
    { pts: [world(u0, -v, roof), world(u1, -v, roof), world(u1, v, roof), world(u0, v, roof)], out: UP },
    { pts: [world(u0, v, floor), world(u0, -v, floor), world(u0, -v, roof), world(u0, v, roof)], out: UPHILL },
    { pts: [world(u1, -v, floor), world(u1, v, floor), world(u1, v, roof), world(u1, -v, roof)], out: DOWNHILL },
  ]);
  quads(b, glass, thicken([
    { pts: [world(u0 + 0.35, v - 0.2, floor + 0.4), world(u1 - 0.25, v - 0.2, floor + 0.4), world(u1 - 0.25, v - 0.2, roof - 0.35), world(u0 + 0.35, v - 0.2, roof - 0.35)], out: RIGHT },
    { pts: [world(u1 - 0.25, -v + 0.2, floor + 0.4), world(u0 + 0.35, -v + 0.2, floor + 0.4), world(u0 + 0.35, -v + 0.2, roof - 0.35), world(u1 - 0.25, -v + 0.2, roof - 0.35)], out: LEFT },
    { pts: [world(u1 + 0.04, -v + 0.45, floor + 0.5), world(u1 + 0.04, v - 0.45, floor + 0.5), world(u1 + 0.04, v - 0.45, roof - 0.4), world(u1 + 0.04, -v + 0.45, roof - 0.4)], out: DOWNHILL },
  ], 0.1));
  const railFaces = [];
  const band = (ua, va, ub, vb) => {
    railFaces.push(
      { pts: [world(ua, va, rail), world(ub, va, rail), world(ub, vb, rail), world(ua, vb, rail)], out: UP },
      { pts: [world(ua, vb, roof), world(ub, vb, roof), world(ub, vb, rail), world(ua, vb, rail)], out: RIGHT },
      { pts: [world(ub, va, roof), world(ua, va, roof), world(ua, va, rail), world(ub, va, rail)], out: LEFT },
    );
  };
  band(u0 - 0.4, -v - 0.35, u0 + 0.15, v + 0.35);
  band(u1 - 0.15, -v - 0.35, u1 + 0.45, v + 0.35);
  band(u0, v - 0.1, u1, v + 0.45);
  band(u0, -v - 0.45, u1, -v + 0.1);
  quads(b, 'steel', railFaces);
  const e0 = u0 - 2.7, e1 = u0 - 0.25, ev = 1.25;
  quads(b, glass, thicken([
    { pts: [world(e0 + 0.12, ev, grate + 0.3), world(e1 - 0.08, ev, grate + 0.3), world(e1 - 0.08, ev, roof - 0.2), world(e0 + 0.12, ev, roof - 0.2)], out: RIGHT },
    { pts: [world(e1 - 0.08, -ev, grate + 0.3), world(e0 + 0.12, -ev, grate + 0.3), world(e0 + 0.12, -ev, roof - 0.2), world(e1 - 0.08, -ev, roof - 0.2)], out: LEFT },
    { pts: [world(e0, -ev + 0.1, grate + 0.3), world(e0, ev - 0.1, grate + 0.3), world(e0, ev - 0.1, roof - 0.2), world(e0, -ev + 0.1, roof - 0.2)], out: UPHILL },
  ], 0.1));
  for (const vv of [-ev, ev]) {
    b.bar('steel', world(e0, vv, grate + 0.2), world(e0, vv, roof), 0.28, 0.28);
    b.bar('steel', world(e1, vv, grate + 0.2), world(e1, vv, roof), 0.28, 0.28);
  }
}

function supports(b) {
  const u0 = HOUSE.u0 + 0.6, u1 = HOUSE.u1 - 0.4, v = 2.85;
  const bottom = HOUSE.grate - 0.2, top = GATE.y - 0.4;
  const faces = [
    { pts: [world(u0, -v, bottom), world(u1, -v, bottom), world(u1, -v, top), world(u0, -v, top)], out: LEFT },
    { pts: [world(u1, v, bottom), world(u0, v, bottom), world(u0, v, top), world(u1, v, top)], out: RIGHT },
    { pts: [world(u0, v, bottom), world(u0, -v, bottom), world(u0, -v, top), world(u0, v, top)], out: UPHILL },
    { pts: [world(u1, -v, bottom), world(u1, v, bottom), world(u1, v, top), world(u1, -v, top)], out: DOWNHILL },
    { pts: [world(u0, -v, bottom), world(u0, v, bottom), world(u1, v, bottom), world(u1, -v, bottom)], out: DOWN },
  ];
  quads(b, 'mesh', faces);
  // One short raked root strut: grounded on the ridge, not on the outrun.
  const st = inrunAt(52), footU = st.u - 12;
  b.bar('mesh', world(footU, 0, ridgeY(footU) - 0.15), world(st.u, 0, st.y - st.depth + 0.15), 2.8, 3.2);
}

function horseshoe(b, near) {
  const faces = [], backing = [], rows = near ? 12 : 6, arcs = near ? 44 : 22;
  const at = (t, row, y) => {
    const a = Math.PI * t, f = row / rows;
    return world(190 + (40 + 20 * f) * Math.sin(a), (16 + 34 * f) * Math.cos(a), y);
  };
  for (let i = 0; i < arcs; i++) {
    const t = i / arcs, c = (i + 1) / arcs;
    for (let r = 0; r < rows; r++) {
      const y = 0.65 + (r + 1) * 11 / rows, below = 0.65 + r * 11 / rows;
      faces.push({ pts: [at(t, r, y), at(c, r, y), at(c, r + 1, y), at(t, r + 1, y)], out: UP });
      const mid = Math.PI * (t + c) / 2;
      const out = [-Math.sin(mid) * D_HAT[0] - Math.cos(mid) * R_HAT[0], 0, -Math.sin(mid) * D_HAT[1] - Math.cos(mid) * R_HAT[1]];
      faces.push({ pts: [at(t, r, below), at(c, r, below), at(c, r, y), at(t, r, y)], out });
    }
    backing.push({ pts: [at(t, rows, 11.65), at(c, rows, 11.65), at(c, rows * 1.25, SOLE), at(t, rows * 1.25, SOLE)], out: UP });
  }
  quads(b, 'concrete', faces);
  quads(b, 'shoulder', backing);
}

function lights(b, near) {
  const masts = [
    [96, -27.2, landingY(96) + 28],
    [96, 29.5, landingY(96) + 28],
    [176, -40, 26],
    [198, 46, 22],
  ];
  for (const [u, v, top] of masts) {
    b.bar('steel', world(u, v, 0.45), world(u, v, top), 0.55, 0.55);
    if (near) {
      b.bar('light', world(u - 1.3, v, top - 1.1), world(u + 1.3, v, top - 1.1), 0.35, 0.28);
      b.bar('light', world(u, v - 1.1, top - 1.1), world(u, v + 1.1, top - 1.1), 0.28, 0.35);
    }
  }
}

const GLYPHS = {
  O: [[0, 0.78, 1, 1], [0, 0, 1, 0.2], [0, 0, 0.2, 1], [0.8, 0, 1, 1]],
  S: [[0, 0.8, 1, 1], [0, 0.45, 0.22, 1], [0, 0.4, 1, 0.6], [0.78, 0, 1, 0.55], [0, 0, 1, 0.2]],
  L: [[0, 0, 0.22, 1], [0, 0, 1, 0.2]],
};

function letters(b) {
  const u0 = LETTER_U;
  const y0 = landingY(u0);
  const slope = landingSlope(u0);
  const len = Math.hypot(1, slope) || 1;
  const tu = -1 / len, ty = -slope / len;
  const nu = -slope / len, ny = 1 / len;
  const out = [nu * D_HAT[0], ny, nu * D_HAT[1]];
  const inn = [-out[0], -out[1], -out[2]];
  const H = 3.5, W = 2.9, gap = 0.6, lift = 0.28, thick = 0.18;
  const word = ['O', 'S', 'L', 'O'];
  let x = -(word.length * W + (word.length - 1) * gap) / 2;
  const at = (v, along, n) => {
    const u = u0 + along * tu + nu * (lift + n);
    const y = y0 + along * ty + ny * (lift + n);
    return world(u, -v, y);
  };
  const faces = [];
  for (const g of word) {
    for (const [x0, a0, x1, a1] of GLYPHS[g]) {
      const v0 = x + x0 * W, v1 = x + x1 * W, b0 = a0 * H, b1 = a1 * H;
      const A = at(v0, b0, 0), B = at(v1, b0, 0), C = at(v1, b1, 0), D = at(v0, b1, 0);
      const A2 = at(v0, b0, thick), B2 = at(v1, b0, thick), C2 = at(v1, b1, thick), D2 = at(v0, b1, thick);
      faces.push(
        { pts: [A2, B2, C2, D2], out },
        { pts: [D, C, B, A], out: inn },
        { pts: [A, B, B2, A2], out: DOWNHILL },
        { pts: [C, D, D2, C2], out: UPHILL },
        { pts: [B, C, C2, B2], out: LEFT },
        { pts: [D, A, A2, D2], out: RIGHT },
      );
    }
    x += W + gap;
  }
  quads(b, 'steel', faces);
}

function lines(b) {
  const us = [];
  for (let u = 10; u <= 160; u += 4) us.push(u);
  for (const [sign, material] of [[-1, 'red'], [1, 'blue']]) {
    const faces = [];
    for (let i = 0; i < us.length - 1; i++) {
      const u = us[i], c = us[i + 1];
      const put = (uu) => {
        const slope = landingSlope(uu);
        const len = Math.hypot(1, slope) || 1;
        const nFix = -slope / len;
        const ny = 1 / len;
        const y = landingY(uu);
        const v = sign * (landingHalf(uu) - 0.7);
        return [
          world(uu + nFix * 0.16, v - sign * 0.16, y + ny * 0.16),
          world(uu + nFix * 0.16, v + sign * 0.16, y + ny * 0.16),
        ];
      };
      const a = put(u), cpt = put(c);
      faces.push({ pts: [a[0], a[1], cpt[1], cpt[0]], out: UP });
    }
    quads(b, material, faces);
  }
}
