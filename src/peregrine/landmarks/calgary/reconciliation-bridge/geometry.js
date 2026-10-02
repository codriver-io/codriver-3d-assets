import { BoxGeometry, BufferGeometry, Float32BufferAttribute, Matrix4, Vector3 } from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p, PANELS, PANEL, CHORD_Y, SPANS, ABUT_S, C0, TRUSS_D, KERB_D, WALK_IN, WALK_OUT, HALF, CLEAR, PIER_S } from './reconciliation-bridge-profile.js';
import { h, FOOT, SEAT, SLAB_TOP, SLAB_BOTTOM, BEAM_BOTTOM, panelS, chordY, TRUSSES, endPostAt, grip } from './reconciliation-bridge-structure.js';

const UP = new Vector3(0, 1, 0);

/**
 * Reconciliation Bridge (Langevin Bridge, 1910): two riveted steel Parker camelback through trusses of
 * eight panels on one concrete river pier and two abutments, carrying southbound 4 Street NE into
 * downtown Calgary between 1.5 m steel sidewalks with a lattice balustrade. Real metres, +X east, +Y up,
 * +Z south, built on the mapped roadway (reconciliation-bridge-profile.js) so it is one surface with the
 * car, the route and the HD road. The road surface is y = 0 (level with the approach streets).
 */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = bridgeBuilder(p, detail), L = p.BRIDGE_LENGTH;
  const P = (s, d, y) => new Vector3(...b.xyz(s, d, y));
  const put = (g, mat, lift = 1) => b.put(g, mat, 0, lift);
  const lateral = (s) => { const q = p.bridgePoint(s, 0); return new Vector3(-q.tz, 0, q.tx); };
  const along = (s) => { const q = p.bridgePoint(s, 0); return new Vector3(q.tx, 0, q.tz); };
  const D = (o) => C0 + o; // lateral offset from the structure's centre line

  // A box between two points with an exact frame: `w` across (horizontal, perpendicular to the member;
  // the bridge's lateral direction for a vertical member), `t` in the remaining direction. `up` slides
  // it along that remaining direction (the outer face of a chord).
  function member(mat, A, B, w, t, lift = 1, up = 0) {
    const axis = new Vector3().subVectors(B, A), len = axis.length();
    if (len < 1e-3) return;
    axis.divideScalar(len);
    const z = new Vector3().crossVectors(axis, UP);
    if (z.lengthSq() < 1e-6) z.copy(lateral(p.projectBridge(A.x, A.z).s)); else z.normalize();
    const y = new Vector3().crossVectors(z, axis).normalize();
    const g = new BoxGeometry(len, t, w);
    g.applyMatrix4(new Matrix4().makeBasis(axis, y, z).setPosition(A.clone().add(B).multiplyScalar(0.5).addScaledVector(y, up)));
    put(g, mat, lift);
  }

  // Thin double-sided flat bars (lacing, lattice, banners), batched per material: 4 triangles each.
  const flats = new Map();
  function bar(mat, A, B, normal, w) {
    const dir = new Vector3().subVectors(B, A);
    if (dir.lengthSq() < 1e-6) return;
    const e = new Vector3().crossVectors(normal, dir).normalize().multiplyScalar(w / 2);
    let f = flats.get(mat);
    if (!f) flats.set(mat, (f = { pos: [], idx: [] }));
    const quad = [A.clone().sub(e), A.clone().add(e), B.clone().add(e), B.clone().sub(e)];
    for (const side of [0, 1]) {
      const base = f.pos.length / 3;
      for (const v of quad) f.pos.push(v.x, v.y, v.z);
      f.idx.push(...(side ? [base, base + 2, base + 1, base, base + 3, base + 2] : [base, base + 1, base + 2, base, base + 2, base + 3]));
    }
  }

  // A closed prism along the alignment between two stations and two laterals, from `bottom` to `top`
  // above the road surface (caps at both ends). Sampled every 5 m and at alignment vertices.
  // `caps` [start, end]: an end that is always buried (an abutment's back against the approach fill) is
  // left open, so on the flat map, whose ground writes no depth, it never shows through the road.
  function prism(mat, s0, s1, dl, dr, top, bottom, lift = 1, caps = [true, true]) {
    const st = new Set([s0, s1]);
    for (let s = Math.ceil(s0 / 5) * 5; s < s1; s += 5) if (s > s0) st.add(s);
    for (const v of p.ALIGNMENT) if (v.s > s0 && v.s < s1) st.add(v.s);
    const ss = [...st].sort((u, v) => u - v), pos = [], idx = [];
    for (const s of ss) for (const [d, y] of [[dl, top], [dr, top], [dr, bottom], [dl, bottom]]) pos.push(...b.xyz(s, d, h(s) + y));
    // Faces: 0 top (0-1), 1 right (1-2), 2 bottom (2-3), 3 left (3-0); each ring has 4 vertices.
    // Separate vertices per face keep the edges sharp: rebuild per face.
    const out = [];
    const ring = (i) => pos.slice(i * 12, i * 12 + 12);
    const faces = [[0, 1], [1, 2], [2, 3], [3, 0]];
    for (let i = 1; i < ss.length; i++) {
      const a = ring(i - 1), c = ring(i);
      for (const [u, v] of faces) {
        const base = out.length / 3;
        out.push(...a.slice(u * 3, u * 3 + 3), ...a.slice(v * 3, v * 3 + 3), ...c.slice(v * 3, v * 3 + 3), ...c.slice(u * 3, u * 3 + 3));
        idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
      }
    }
    // (station, lateral, up) is a LEFT-handed frame, hence these windings (outward normals).
    for (const [i, flip, on] of [[0, true, caps[0]], [ss.length - 1, false, caps[1]]]) {
      if (!on) continue;
      const r = ring(i), base = out.length / 3;
      out.push(...r);
      idx.push(...(flip ? [base, base + 2, base + 1, base, base + 3, base + 2] : [base, base + 1, base + 2, base, base + 2, base + 3]));
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(out, 3)); g.setIndex(idx); g.computeVertexNormals();
    put(g, mat, lift);
  }

  // A lofted solid through horizontal rings (same vertex count), optional caps.
  function loft(mat, rings, lift, { capTop = true, capBottom = false } = {}) {
    const n = rings[0].length, pos = [], idx = [];
    for (let k = 0; k + 1 < rings.length; k++) for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, base = pos.length / 3;
      pos.push(...rings[k][i], ...rings[k][j], ...rings[k + 1][j], ...rings[k + 1][i]);
      idx.push(base, base + 2, base + 1, base, base + 3, base + 2);
    }
    // plan rings run clockwise seen from above
    const cap = (r, up) => { const base = pos.length / 3; for (const v of r) pos.push(...v); for (let i = 1; i < n - 1; i++) idx.push(...(up ? [base, base + i + 1, base + i] : [base, base + i, base + i + 1])); };
    if (capTop) cap(rings.at(-1), true);
    if (capBottom) cap(rings[0], false);
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    put(g, mat, lift);
  }

  // ---- The two trusses of each span -------------------------------------------------------------------
  const U = (k, i, d) => P(panelS(k, i), d, chordY(i));
  const Lo = (k, i, d) => P(panelS(k, i), d, CHORD_Y);
  for (let k = 0; k < 2; k++) {
    for (const d of TRUSSES) {
      const out = d > C0 ? 1 : -1, n = lateral(panelS(k, 4));
      // Camelback outline: end posts and the polygonal top chord (riveted boxes), joint blocks at the panel points.
      member('steel', Lo(k, 0, d), U(k, 1, d), 0.62, 0.52);
      for (let i = 1; i < PANELS - 1; i++) member('steel', U(k, i, d), U(k, i + 1, d), 0.62, 0.52);
      member('steel', U(k, PANELS - 1, d), Lo(k, PANELS, d), 0.62, 0.52);
      for (let i = 1; i < PANELS; i++) b.box('steel', panelS(k, i), d, chordY(i) - 0.02, 0.78, 0.7, 0.62);
      // The LED strips (2009) along the outline's top face: pale steel by day, lit at night.
      member('light', Lo(k, 0, d), U(k, 1, d), 0.26, 0.12, 1, 0.3);
      for (let i = 1; i < PANELS - 1; i++) member('light', U(k, i, d), U(k, i + 1, d), 0.26, 0.12, 1, 0.3);
      member('light', U(k, PANELS - 1, d), Lo(k, PANELS, d), 0.26, 0.12, 1, 0.3);
      // Bottom chord (eyebars, drawn as one member), with the end shoes over the bearings.
      member('steel', Lo(k, 0, d), Lo(k, PANELS, d), 0.5, 0.6);
      for (const i of [0, PANELS]) b.box('steel', panelS(k, i) + (i ? -0.3 : 0.3), d, CHORD_Y, 1.2, 0.68, 0.72);
      // Verticals: slender hip hangers at L1/L7, laced posts (two channels and zig-zag lacing) at L2..L6.
      for (let i = 1; i < PANELS; i++) {
        const s = panelS(k, i), y0 = CHORD_Y + 0.25, y1 = chordY(i) - 0.12;
        if (i === 1 || i === PANELS - 1) { member('steel', P(s, d, y0), P(s, d, y1), 0.32, 0.24); continue; }
        if (!near) { member('steel', P(s, d, y0), P(s, d, y1), 0.38, 0.46); continue; }
        const at = (u, dd, y) => P(s + u, d + dd, y);
        for (const u of [-0.18, 0.18]) member('steel', at(u, 0, y0), at(u, 0, y1), 0.38, 0.1);
        for (const f of [-0.205, 0.205]) {
          let y = y0 + 0.15, side = -1;
          while (y + 0.36 < y1) { bar('steel', at(0.18 * side, f, y), at(-0.18 * side, f, y + 0.36), n, 0.06); y += 0.36; side = -side; }
        }
      }
      // Diagonals: Pratt main diagonals sloping down toward mid-span, counters in the four middle panels.
      for (let i = 1; i <= 3; i++) member('steel', U(k, i, d), Lo(k, i + 1, d), 0.24, 0.34);
      for (let i = 4; i <= 6; i++) member('steel', U(k, i + 1, d), Lo(k, i, d), 0.24, 0.34);
      if (near) {
        for (const i of [1, 2, 3]) member('steel', Lo(k, i, d), U(k, i + 1, d), 0.16, 0.16);
        for (const i of [4, 5, 6]) member('steel', U(k, i, d), Lo(k, i + 1, d), 0.16, 0.16);
        // Art banners hung on the outer face of the laced posts.
        for (let i = 2; i <= 6; i++) bar('banner', P(panelS(k, i), d + out * 0.24, 5.2), P(panelS(k, i), d + out * 0.24, 6.8), n, 0.55);
      }
    }

    // Portals at both ends, in the plane of the inclined end posts: a laced girder under the hips and knee
    // braces that stay outside the carriageway, so nothing is lower than CLEAR over the road.
    const [A, B] = TRUSSES, yTop = chordY(1) - 0.5, yBot = CLEAR + 1.0;
    for (const end of [0, 1]) {
      const sT = endPostAt(k, end, yTop), sB = endPostAt(k, end, yBot);
      member('steel', P(sT, A + 0.3, yTop), P(sT, B - 0.3, yTop), 0.32, 0.32);
      member('steel', P(sB, A + 0.3, yBot), P(sB, B - 0.3, yBot), 0.32, 0.32);
      const sK = endPostAt(k, end, 4.6), sJ = endPostAt(k, end, yBot);
      for (const [dd, o] of [[A, 1], [B, -1]]) member('steel', P(sJ, D(o * -(TRUSS_D - 1.5)), yBot), P(sK, dd + o * 0.3, 4.6), 0.24, 0.24);
      if (near) {
        const e = new Vector3().subVectors(P(sT, C0, yTop), P(sB, C0, yBot)).normalize(), normal = new Vector3().crossVectors(lateral(sT), e).normalize();
        let d = A + 0.45, top = true;
        while (d + 0.6 < B - 0.3) { bar('steel', top ? P(sT, d, yTop) : P(sB, d, yBot), top ? P(sB, d + 0.6, yBot) : P(sT, d + 0.6, yTop), normal, 0.08); d += 0.6; top = !top; }
      } else {
        // far: the portal reads as a plate between its chords
        const mid = (yTop + yBot) / 2, sm = endPostAt(k, end, mid);
        member('steel', P(sm, A + 0.3, mid), P(sm, B - 0.3, mid), 0.12, yTop - yBot);
      }
    }
    // Top struts (laced girders) and knee braces at U2..U6; top lateral X bracing between the struts.
    for (let i = 2; i <= PANELS - 2; i++) {
      const s = panelS(k, i), y = chordY(i), lo = y - 0.75;
      member('steel', P(s, A + 0.3, y + 0.05), P(s, B - 0.3, y + 0.05), 0.24, 0.24);
      if (!near) { member('steel', P(s, A + 0.3, y - 0.35), P(s, B - 0.3, y - 0.35), 0.16, 0.75); continue; }
      member('steel', P(s, A + 0.3, lo), P(s, B - 0.3, lo), 0.22, 0.22);
      const t = along(s);
      let d = A + 0.4, top = true;
      while (d + 0.6 < B - 0.3) { bar('steel', P(s, d, top ? y : lo), P(s, d + 0.6, top ? lo : y), t, 0.06); d += 0.6; top = !top; }
      for (const [dd, o] of [[A, 1], [B, -1]]) member('steel', P(s, D(o * -(TRUSS_D - 1.4)), lo), P(s, dd + o * 0.22, y - 2.0), 0.16, 0.16);
    }
    if (near) for (let i = 1; i < PANELS - 1; i++) {
      member('steel', U(k, i, A), U(k, i + 1, B), 0.07, 0.07, 1, 0.05);
      member('steel', U(k, i, B), U(k, i + 1, A), 0.07, 0.07, 1, 0.05);
    }

    // Floor system: a floor beam under every panel point (cantilevered out under the sidewalks) and the
    // stringers between them; steel bearings on the pier cap and abutment seats.
    for (let i = 0; i <= PANELS; i++) {
      const s = panelS(k, i) + (i === 0 ? 0.35 : i === PANELS ? -0.35 : 0);
      // The beam at each outer end of the deck is the end diaphragm, seen end-on past the slab: `concrete`, not a dark steel line.
      const end = (k === 0 && i === 0) || (k === 1 && i === PANELS);
      b.box(end ? 'concrete' : 'steel', s, C0, (SLAB_TOP - 0.05 + BEAM_BOTTOM) / 2, 0.36, 2 * (TRUSS_D + 0.25), SLAB_TOP - 0.05 - BEAM_BOTTOM);
      if (near) for (const o of [-1, 1]) b.box('steel', s, D(o * (WALK_IN + WALK_OUT) / 2), -0.37, 0.3, WALK_OUT - WALK_IN + 0.1, 0.64);
    }
    if (near) for (const o of [-3.4, -1.3, 1.3, 3.4]) prism('steel', SPANS[k][0] + 0.3, SPANS[k][1] - 0.3, D(o - 0.15), D(o + 0.15), SLAB_BOTTOM + 0.05, -0.95);
    for (const i of [0, PANELS]) for (const d of TRUSSES) b.box('steel', panelS(k, i) + (i ? -0.3 : 0.3), d, (SEAT - 0.05 + CHORD_Y - 0.25) / 2, 0.9, 0.8, CHORD_Y - 0.25 - SEAT + 0.05);
  }

  // ---- The deck: road, kerbs, sidewalks, fascia, balustrade ----------------------------------------------
  const S_A = ABUT_S[0] - 1.4, S_B = ABUT_S[1] + 1.4;       // over the abutment backwalls
  b.strip('asphalt', 0, L, C0 - KERB_D, C0 + KERB_D, 0, 0);
  prism('concrete', S_A, S_B, C0 - KERB_D - 0.7, C0 + KERB_D + 0.7, SLAB_TOP, SLAB_BOTTOM, 1, [false, false]);
  for (const o of [-1, 1]) {
    const [dl, dr] = o < 0 ? [D(-TRUSS_D + 0.2), D(-KERB_D)] : [D(KERB_D), D(TRUSS_D - 0.2)];
    prism('concrete', S_A, S_B, dl, dr, 0.2, -0.32);                                                     // kerbs, into the bottom chord
    const w = o < 0 ? [D(-WALK_OUT - 0.05), D(-WALK_IN + 0.15)] : [D(WALK_IN - 0.15), D(WALK_OUT + 0.05)];
    prism('concrete', S_A, S_B, w[0], w[1], 0.25, -0.15);                                                // steel sidewalk plates (pale grey)
    const f = o < 0 ? [D(-HALF), D(-WALK_OUT)] : [D(WALK_OUT), D(HALF)];
    prism('deck', S_A, S_B, f[0], f[1], 0.32, -0.85);                                                     // outer stringer / fascia
    // Lattice balustrade on the fascia: rails, posts and the diamond lattice.
    const rd = D(o * (HALF - 0.07));
    prism('rail', S_A, S_B, rd - 0.06, rd + 0.06, 1.35, 1.24);
    if (near) {
      prism('rail', S_A, S_B, rd - 0.04, rd + 0.04, 0.46, 0.2);
      for (let s = S_A + 0.12; s <= S_B; s += PANEL / 2) b.box('rail', Math.min(s, S_B - 0.12), rd, 0.8, 0.1, 0.1, 1.0);
      const n = lateral(PIER_S), step = 0.42;
      for (let s = S_A + 0.1; s + 0.8 < S_B; s += step) {
        bar('rail', P(s, rd, 0.46), P(s + 0.79, rd, 1.24), n, 0.04);
        bar('rail', P(s + 0.79, rd, 0.46), P(s, rd, 1.24), n, 0.04);
      }
    } else for (let s = S_A + 0.12; s <= S_B; s += PANEL * 2) b.box('rail', Math.min(s, S_B - 0.12), rd, 0.8, 0.12, 0.12, 0.98);
  }
  // Lane paint (the HD pavement's own paint replaces it in the app): edge lines and the dashed lane line.
  for (const o of [-1, 1]) b.strip('paint', 0, L, D(o * 3.55) - 0.06, D(o * 3.55) + 0.06, 0.025, 0);
  if (near) for (let s = 2; s + 3 < L; s += 9) b.strip('paint', s, s + 3, C0 - 0.06, C0 + 0.06, 0.025, 0);

  // ---- Substructure: the river pier and both abutments (feet reach their own ground in Full 3D world) -----
  {
    const q = p.bridgePoint(PIER_S, C0), T = along(PIER_S), N = lateral(PIER_S);
    // Plan: straight sides along the river, a pointed cutwater upstream (+d, west) and a blunter one downstream.
    const plan = (a, w, up, dn, y) => [[-a, -w], [0, -w - dn], [a, -w], [a, w], [0, w + up], [-a, w]]
      .map(([u, v]) => [q.x + T.x * u + N.x * v, y, q.z + T.z * u + N.z * v]);
    loft('concrete', [plan(2.3, 7.6, 2.6, 1.6, FOOT), plan(1.7, 7.2, 2.0, 1.2, SEAT - 0.25)], grip(SEAT - 0.25), { capTop: true });
    loft('concrete', [plan(1.95, 7.45, 2.25, 1.45, SEAT - 0.27), plan(1.95, 7.45, 2.25, 1.45, SEAT)], 1, { capTop: true, capBottom: true });
  }
  for (const end of [0, 1]) {
    const face = ABUT_S[end], truss = end ? SPANS[1][1] : SPANS[0][0];
    // bearing seat under the truss end, and the backwall up under the deck
    // The seat's river face is the abutment wall seen from the water; its back is inside the bank.
    const seat = end ? [truss - 1.1, face] : [face, truss + 1.1];
    prism('concrete', seat[0], seat[1], D(-HALF - 0.3), D(HALF + 0.3), SEAT, FOOT, grip(SEAT), end ? [true, false] : [false, true]);
    // The backwall under the deck end is authored 2 mm tall: on the flat map (whose ground writes no
    // depth) it would show through the approach road; in Full 3D world its foot (weight 0) drops to the
    // bank's own ground, so it fills from the ground up to the deck.
    const back = end ? [face - 0.02, face + 1.4] : [face - 1.4, face + 0.02];
    prism('concrete', back[0], back[1], D(-HALF + 0.05), D(HALF - 0.05), -0.47, -0.472, (y) => (y < -0.471 ? 0 : 1), end ? [true, false] : [false, true]);
  }

  for (const [mat, f] of flats) {
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(f.pos, 3)); g.setIndex(f.idx); g.computeVertexNormals();
    put(g, mat, 1);
  }
  return b.finish();
}
