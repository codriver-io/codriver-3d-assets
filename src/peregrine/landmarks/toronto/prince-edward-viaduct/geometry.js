import { BoxGeometry, BufferGeometry, Float32BufferAttribute, Matrix4, Vector3 } from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p, PIER_S, PIER_BASE, DECK_CENTER as C0, DECK_HALF as HW, ROAD_EDGES, RIB_D, STRUCTURE_START, STRUCTURE_END } from './prince-edward-viaduct-profile.js';
import { h, ARCHES, UNDER, ROOM_FLOOR, SLAB_BOTTOM, deckBottom, roomRange, WEST_RUN, EAST_RUN, grip } from './prince-edward-viaduct-structure.js';

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const [KERB_N, KERB_S] = ROAD_EDGES[0];           // -9.2, +11.2 (lateral, + = right of travel = south)
const EDGE_N = C0 - HW, EDGE_S = C0 + HW;         // -12.0, +14.2: the mapped deck outline
const SIDES = [EDGE_N, EDGE_S];
const outward = (edge) => (edge < C0 ? -1 : 1);

/**
 * Prince Edward Viaduct, Don Valley section: five steel crescent arches on six stone piers
 * carrying Bloor Street and, below it, the TTC Line 2 subway room, with the Luminous Veil
 * along both edges. Real metres, +X east, +Y up, +Z south, built on the mapped roadway
 * (prince-edward-viaduct-profile.js) so it is one surface with the car, the route and the HD road.
 */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  // meshStep 2: the ramps are steep, and a 5 m chord sags 0.2 m below the HD overlay the road is draped on.
  const b = bridgeBuilder({ ...p, meshStep: 2 }, detail), L = p.BRIDGE_LENGTH;
  // Ranges that start or end exactly on the mapped bridge nodes are nudged in, or the strip's sample
  // at the alignment vertex lands 1e-8 m from its own end and leaves a zero-area sliver.
  const S_A = STRUCTURE_START + 0.02, S_B = STRUCTURE_END - 0.02;
  const chunk = (s) => (near && s >= L / 2 ? 1 : 0);
  const P = (s, d, y) => new Vector3(...b.xyz(s, d, y));
  const put = (g, mat, ck = 0, lift = 1) => b.put(g, mat, ck, lift);

  // A ribbon along the roadway, split at mid-length so the near model has two spatial chunks.
  function strips(mat, a, c, l, r, off = 0, thick = 0) {
    const cuts = near && a < L / 2 && c > L / 2 ? [a, L / 2, c] : [a, c];
    for (let i = 1; i < cuts.length; i++) b.strip(mat, cuts[i - 1], cuts[i], l, r, off, thick, chunk(cuts[i - 1]));
  }

  // A box between two points with an exact frame: `w` across (horizontal, perpendicular to the
  // member), `t` in the vertical-ish direction. The builder's own `beam` twists on a skewed bridge.
  function member(mat, A, B, w, t, ck = 0, lift = 1) {
    const axis = new Vector3().subVectors(B, A), len = axis.length();
    if (len < 1e-3) return;
    axis.divideScalar(len);
    const z = new Vector3().crossVectors(axis, new Vector3(0, 1, 0));
    if (z.lengthSq() < 1e-6) { // vertical member: across = the bridge's lateral direction
      const r = p.bridgePoint(p.projectBridge(A.x, A.z).s, 0); z.set(-r.tz, 0, r.tx);
    } else z.normalize();
    const y = new Vector3().crossVectors(z, axis).normalize();
    const g = new BoxGeometry(len, t, w);
    g.applyMatrix4(new Matrix4().makeBasis(axis, y, z).setPosition(A.clone().add(B).multiplyScalar(0.5)));
    put(g, mat, ck, lift);
  }
  const at = (s, d, off) => P(s, d, h(s) + off); // a point at a height above the road surface

  // A solid body between two stations across [dl, dr] from a fixed base up to the slab, with the
  // top and both faces (used for the abutments, where the deck meets the ground).
  function solid(mat, s0, s1, dl, dr, base, topOff = -0.5) {   // top inside the 0.9 m slab, so it is never coplanar with the road layers
    const n = Math.max(2, Math.ceil((s1 - s0) / 4)), pos = [], idx = [];
    for (let i = 0; i <= n; i++) {
      const s = s0 + (s1 - s0) * i / n, top = Math.max(h(s) + topOff, base + 0.02);
      for (const [d, y] of [[dl, top], [dr, top], [dl, base], [dr, base]]) pos.push(...b.xyz(s, d, y));
      if (!i) continue;
      const u = (i - 1) * 4, v = i * 4;
      idx.push(u, u + 1, v, u + 1, v + 1, v,          // top
        u, v, u + 2, u + 2, v, v + 2,                 // left face
        u + 1, u + 3, v + 1, u + 3, v + 3, v + 1);    // right face
    }
    // end walls, so the fill is closed where the girder run begins and at the ground
    idx.push(0, 2, 1, 1, 2, 3, n * 4, n * 4 + 1, n * 4 + 2, n * 4 + 1, n * 4 + 3, n * 4 + 2);
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    put(g, mat, chunk((s0 + s1) / 2), (y) => (y > base + 0.05 ? 1 : 0));
  }

  // A lofted stone pier: octagonal rings from the footing up through a shaft and a flared capital.
  function ring(s, y, along, across, ch) {
    const q = p.bridgePoint(s, C0), T = [q.tx, q.tz], N = [-q.tz, q.tx], a = along / 2, w = across / 2;
    const pts = [[-a + ch, -w], [a - ch, -w], [a, -w + ch], [a, w - ch], [a - ch, w], [-a + ch, w], [-a, w - ch], [-a, -w + ch]];
    return pts.map(([u, v]) => [q.x + T[0] * u + N[0] * v, y, q.z + T[1] * u + N[1] * v]);
  }
  function loft(mat, rings, { capTop = false, capBottom = false } = {}, ck = 0, lift = 1) {
    const n = rings[0].length, pos = rings.flat(), idx = [];
    for (let k = 0; k + 1 < rings.length; k++) for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, a = k * n + i, c = k * n + j, u = (k + 1) * n + i, v = (k + 1) * n + j;
      idx.push(a, u, c, c, u, v);
    }
    const cap = (k, up) => { for (let i = 1; i < n - 1; i++) idx.push(...(up ? [k * n, k * n + i + 1, k * n + i] : [k * n, k * n + i, k * n + i + 1])); };
    if (capTop) cap(rings.length - 1, true);
    if (capBottom) cap(0, false);
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(pos.flat(), 3)); g.setIndex(idx); g.computeVertexNormals();
    put(g, mat, ck, lift);
  }
  function pier(s, { base = PIER_BASE, top: topW = 6.4, across = [22.4, 20.6], cap = [7.0, 28.2], capH = 2.2, foot = 1.6 } = {}) {
    const top = h(s) - 1.4, ck = chunk(s);
    if (top < 1.6) return;
    const shaftTop = top - capH, y0 = top > 5 ? foot : 0.3;
    if (top > 5) loft('concrete', [ring(s, 0, base + 1.4, across[0] + 1.6, 0.8), ring(s, foot, base + 1.4, across[0] + 1.6, 0.8)], { capTop: true }, ck, 0);
    if (shaftTop - y0 > 0.3) {
      const span = shaftTop - y0;
      loft('stone', [ring(s, y0, base, across[0], 1.2), ring(s, y0 + span * 0.5, (base + topW) / 2 + 0.2, (across[0] + across[1]) / 2, 1.05), ring(s, shaftTop, topW, across[1], 0.9)],
        {}, ck, (y) => clamp01((y - y0) / span));
    }
    loft('stone', [ring(s, shaftTop, cap[0], across[1] + 3.4, 0.9), ring(s, top - capH * 0.4, cap[0], cap[1], 0.7), ring(s, top, cap[0], cap[1], 0.7)],
      { capTop: true, capBottom: true }, ck, 1);
    // The arched niche on each long face, under the capital: a lighter proud panel with a keystone.
    if (near && top > 12) for (const side of [-1, 1]) {
      const d = C0 + side * (across[1] / 2 + 0.1);
      b.box('concrete', s, d, shaftTop - 2.6, 3.0, 0.18, 4.9, ck, 1);
      b.box('concrete', s, d, shaftTop - 0.3, 1.0, 0.24, 0.9, ck, 1);
    }
  }

  // ---- The deck: slab, edge beams, sidewalks, parapets, roadway -------------------------------
  const [wA0, wA1] = WEST_RUN, [eA0, eA1] = EAST_RUN;
  // The slab and girder tops are hidden under the asphalt and sidewalks: they sit 18 cm below the road layers
  // (their bottoms are unchanged), so no road layer ever grazes a structural face. The edge beams stay at -0.12:
  // the sidewalks and parapets rest on them.
  const SLAB_TOP = -0.3;
  for (const [a, c] of [[0, wA0], [wA1, eA0], [eA1, L]]) strips('concrete', a, c, EDGE_N + 0.8, EDGE_S - 0.8, SLAB_TOP, 1.02 + SLAB_TOP);   // slab between the edge beams
  for (const [d0, d1] of [[EDGE_N, EDGE_N + 0.8], [EDGE_S - 0.8, EDGE_S]]) strips('concrete', 0, L, d0, d1, -0.12, 2.0);
  // Beyond the last arches: a solid girder on evenly spaced concrete piers while the ramp is high,
  // then a solid ramp on fill down to the approach road.
  for (const [a, c] of [[wA0, wA1], [eA0, eA1]]) {
    strips('concrete', a, c, EDGE_N + 0.8, EDGE_S - 0.8, SLAB_TOP, 2.12 + SLAB_TOP);
    const n = Math.max(1, Math.round((c - a) / 19));
    for (let i = 1; i < n; i++) pier(a + (c - a) * i / n, { base: 4.0, top: 3.4, across: [21, 19.8], cap: [4.2, 25.0], capH: 1.4 });
  }
  solid('concrete', 0, wA0, EDGE_N, EDGE_S, 0);                           // west ramp on fill
  solid('concrete', eA1, L, EDGE_N, EDGE_S, 0);                           // east ramp on fill
  strips('asphalt', 0, L, KERB_N, KERB_S, 0, 0);
  strips('concrete', 0, L, KERB_S, EDGE_S - 0.55, 0.15, 0.27);            // south sidewalk
  strips('concrete', 0, L, EDGE_N + 0.55, KERB_N, 0.15, 0.27);            // north sidewalk
  strips('stone', 0, L, EDGE_S - 0.55, EDGE_S, 1.05, 1.17);               // parapets, red-aggregate stone, flush with the edge beam below
  strips('stone', 0, L, EDGE_N, EDGE_N + 0.55, 1.05, 1.17);
  // cornice under the parapet: only the 16 cm that projects beyond the edge beam (the rest lies inside it, and its
  // top and inner face would be coplanar with the beam's)
  if (near) for (const [d0, d1] of [[EDGE_N - 0.16, EDGE_N], [EDGE_S, EDGE_S + 0.16]]) strips('stone', 0, L, d0, d1, -0.12, 0.34);

  // Lane paint (the HD pavement's own paint replaces it in the app): edge lines, dashes, yellow centre.
  // The yellow sits 5 cm up, not 2.5: it was the one marking that grazed the asphalt's plane on the 35 % ramps.
  const line = (mat, d, w = 0.13, a = 0, c = L) => strips(mat, a, c, d - w / 2, d + w / 2, mat === 'yellow' ? 0.05 : 0.025, 0);
  const CENTRE = KERB_N + 1.5 + 6.6;   // -1.1: two westbound lanes left of it, three eastbound right
  line('paint', KERB_N + 1.5); line('paint', KERB_S - 1.5);
  line('yellow', CENTRE - 0.1, 0.11); line('yellow', CENTRE + 0.1, 0.11);
  if (near) for (let s = 3; s < L - 3; s += 12) for (const d of [CENTRE - 3.3, CENTRE + 3.6, CENTRE + 7.2]) b.strip('paint', s, Math.min(s + 3, L), d - 0.06, d + 0.06, 0.025, 0, chunk(s));

  // ---- Steel section: girders, floor beams, the subway room --------------------------------------
  const steelA = PIER_S[0] - PIER_BASE / 2, steelB = PIER_S[5] + PIER_BASE / 2;   // the rest of the deck beyond is concrete
  for (const d of [C0 - RIB_D, C0 + RIB_D]) strips('steel', steelA, steelB, d - 0.5, d + 0.5, -SLAB_BOTTOM + 0.6, 1.5);
  if (near) for (let s = steelA + 2.95; s < steelB; s += 5.9) member('steel', at(s, C0 - 12.4, -1.85), at(s, C0 + 12.4, -1.85), 0.45, 1.0, chunk(s));
  const [r0, r1] = roomRange();
  // The room sits INSIDE the ribs and their spandrel columns, so the columns read in front of its dark side.
  const ROOM = RIB_D - 0.6;
  strips('steel', r0, r1, C0 - ROOM - 0.2, C0 + ROOM + 0.2, -ROOM_FLOOR, 0.8);
  for (const d of [C0 - ROOM, C0 + ROOM]) strips('steel', r0, r1, d - 0.09, d + 0.09, -SLAB_BOTTOM - 0.05, ROOM_FLOOR - SLAB_BOTTOM - 0.05);
  if (near) for (let s = r0 + 3; s < r1; s += 5.9) for (const d of [C0 - ROOM - 0.25, C0 + ROOM + 0.25])
    b.box('lamp', s, d, h(s) - 3.6, 0.5, 0.18, 0.2, chunk(s));   // the amber lamps seen from the valley

  // ---- Piers -------------------------------------------------------------------------------------
  for (const s of PIER_S) pier(s);

  // ---- The five steel arches ------------------------------------------------------------------------
  for (const arch of ARCHES) {
    const N = Math.max(near ? 6 : 4, Math.round(arch.span / (near ? 5.9 : 11.7))), ck = chunk(arch.mid);
    const us = Array.from({ length: N + 1 }, (_, k) => k / N);
    const ss = us.map((u) => arch.station(u));
    const topY = us.map((u) => arch.top(u)), botY = us.map((u, k) => Math.min(arch.bottom(u), topY[k] - 0.6));
    const gp = (y) => grip(y);
    for (const d of [C0 - RIB_D, C0 + RIB_D]) {
      for (let k = 0; k < N; k++) {
        member('steel', P(ss[k], d, topY[k]), P(ss[k + 1], d, topY[k + 1]), 1.45, 1.2, ck, gp);      // extrados chord
        member('steel', P(ss[k], d, botY[k]), P(ss[k + 1], d, botY[k + 1]), 1.3, 1.05, ck, gp);      // intrados chord
        if (near) {
          if (k % 2 === 0) member('steel', P(ss[k], d, botY[k]), P(ss[k + 1], d, topY[k + 1]), 0.7, 0.45, ck, gp);
          else member('steel', P(ss[k], d, topY[k]), P(ss[k + 1], d, botY[k + 1]), 0.7, 0.45, ck, gp);
        }
      }
      for (let k = 0; k <= N; k++) {
        const s = ss[k], yTop = h(s) - SLAB_BOTTOM - 0.15, y0 = topY[k], g0 = gp(y0);
        if (near && k > 0 && k < N) member('steel', P(s, d, botY[k]), P(s, d, topY[k]), 0.7, 0.5, ck, gp);   // web posts
        if (yTop - y0 > 0.8) {                                                                                 // spandrel columns to the deck
          member('steel', P(s, d, y0), P(s, d, yTop), 1.2, 0.8, ck, (y) => g0 + (1 - g0) * clamp01((y - y0) / (yTop - y0)));
        }
      }
      if (near) for (let k = 0; k < N; k++) {                                                             // spandrel bracing
        const y0 = topY[k], y1 = topY[k + 1], t0 = h(ss[k]) - SLAB_BOTTOM - 0.15, t1 = h(ss[k + 1]) - SLAB_BOTTOM - 0.15;
        if (t0 - y0 < 2.5 || t1 - y1 < 2.5) continue;
        const g0 = gp(y0), g1 = gp(y1), lo = Math.min(y0, y1), hi = Math.max(t0, t1), gl = Math.min(g0, g1);
        const lift = (y) => gl + (1 - gl) * clamp01((y - lo) / (hi - lo));
        // diagonals sit in the lower part of the panel, below the room floor's level
        const ya = deckBottom(ss[k]), yb = deckBottom(ss[k + 1]);
        if (k % 2 === 0) member('steel', P(ss[k], d, y0), P(ss[k + 1], d, yb), 0.65, 0.42, ck, lift);
        else member('steel', P(ss[k], d, ya), P(ss[k + 1], d, y1), 0.65, 0.42, ck, lift);
      }
    }
    if (near) for (const [s, y] of [[ss[0], botY[0]], [ss[N], botY[N]]]) for (const d of [C0 - RIB_D, C0 + RIB_D])
      b.box('steel', s, d, y + 0.35, 2.0, 2.0, 1.3, ck, gp);                                                // hinge shoes on the pier
    if (near) for (let k = 1; k < N; k++) {                                                               // cross bracing between the ribs
      member('steel', P(ss[k], C0 - RIB_D, topY[k]), P(ss[k], C0 + RIB_D, topY[k]), 0.55, 0.55, ck, gp);
      member('steel', P(ss[k], C0 - RIB_D, botY[k]), P(ss[k + 1], C0 + RIB_D, botY[k + 1]), 0.4, 0.4, ck, gp);
      member('steel', P(ss[k], C0 + RIB_D, botY[k]), P(ss[k + 1], C0 - RIB_D, botY[k + 1]), 0.4, 0.4, ck, gp);
    }
  }

  // ---- The Luminous Veil and lamp standards ----------------------------------------------------------
  const post = near ? 4.4 : 13.2, LEAN = 0.95, TOP = 5.65, FOOT = 1.05;
  for (const edge of SIDES) {
    const o = outward(edge), inner = edge - o * 0.3;
    strips('rail', S_A, S_B, inner + o * (LEAN + 0.15) - 0.13, inner + o * (LEAN + 0.15) + 0.13, TOP + 0.13, 0.26);  // top rail, follows the deck
    for (let s = STRUCTURE_START; s <= STRUCTURE_END + 0.01; s += post) {
      const ss = Math.min(s, STRUCTURE_END);
      member('rail', at(ss, inner, FOOT), at(ss, inner + o * LEAN, TOP), 0.17, 0.2, chunk(ss));
      if (near) member('rail', at(ss, inner + o * LEAN, TOP - 0.35), at(ss, inner - o * 0.1, FOOT + 0.3), 0.1, 0.12, chunk(ss));
      if (near) b.box('stone', ss, inner, h(ss) + 1.2, 0.85, 0.7, 0.3, chunk(ss));
    }
    if (near) {   // the wires: ~9,000 stainless rods in reality, thin ribbons here, drawn as a sheet of vertical lines
      const pos = [], idx = [], step = 0.62, w = 0.045;
      for (let s = STRUCTURE_START + 0.4; s < STRUCTURE_END; s += step) {
        const a = p.bridgePoint(s, inner - o * 0.05, h(s) + FOOT), c = p.bridgePoint(s, inner + o * LEAN, h(s) + TOP);
        const base = pos.length / 3;
        pos.push(a.x, a.y, a.z, a.x + a.tx * w, a.y, a.z + a.tz * w, c.x + c.tx * w, c.y, c.z + c.tz * w, c.x, c.y, c.z);
        idx.push(base, base + 1, base + 2, base, base + 2, base + 3, base, base + 2, base + 1, base, base + 3, base + 2);
      }
      const g = new BufferGeometry();
      g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
      put(g, 'veil', 0, 1);
    }
  }
  {
    let side = 0;
    for (let s = STRUCTURE_START + 14; s < STRUCTURE_END - 8; s += 30) {
      const edge = side++ % 2 ? KERB_N - 0.35 : KERB_S + 0.35, o = edge > C0 ? -1 : 1, ck = chunk(s);
      // The lamp standards are the tallest part of the bridge (50 m, the Veil tops out at 46): the far LOD keeps each
      // as one bare post to the arm's height, so its silhouette height matches the near one.
      member('rail', at(s, edge, 0.15), at(s, edge, near ? 9.2 : 9.75), 0.22, 0.22, ck);
      if (near) {
        member('rail', at(s, edge, 9.2), at(s, edge + o * 2.3, 9.75), 0.14, 0.16, ck);
        b.box('lamp', s, edge + o * 2.3, h(s) + 9.7, 0.95, 0.4, 0.22, ck);
      }
    }
  }
  return b.finish();
}
