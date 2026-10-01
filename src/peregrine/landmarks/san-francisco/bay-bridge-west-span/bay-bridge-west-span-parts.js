import { BufferGeometry, Float32BufferAttribute, Vector3 } from 'three';

/**
 * Low-level mesh helpers for the West Span, in the profile's (station, lateral, height) frame.
 * Every mesh is indexed; thin members share their vertices (smooth shading suits a 1 m steel bar and
 * halves the bytes), slabs and blocks duplicate them per face so their edges stay crisp.
 */
export function parts(profile, b, detail) {
  const near = detail === 'near';
  const P = (s, d, y) => { const q = profile.bridgePoint(s, d, y); return [q.x, y, q.z]; };
  const tangent = (s) => { const q = profile.bridgePoint(s, 0); return new Vector3(q.tx, 0, q.tz); };
  const lateral = (s) => { const q = profile.bridgePoint(s, 0); return new Vector3(-q.tz, 0, q.tx); };

  function mesh(mat, positions, indices, chunk = 0, lift = 1) {
    if (!indices.length) return;
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(positions, 3));
    g.setIndex(indices); g.computeVertexNormals();
    b.put(g, mat, chunk, lift);
  }

  /** Sorted station samples on [s0, s1]: every `step` metres plus the alignment's own vertices. */
  function samples(s0, s1, step) {
    const at = typeof step === 'function' ? step : () => step, set = new Set([s0, s1]);
    for (let s = s0 + at(s0); s < s1 - 0.3; s += at(s)) set.add(s);
    for (const v of profile.ALIGNMENT) if (v.s > s0 + 0.3 && v.s < s1 - 0.3) set.add(v.s);
    return [...set].sort((u, v) => u - v);
  }

  /**
   * A closed or open section swept along stations. `section(s)` returns [[d, y], ...] (counter-clockwise
   * seen looking toward +s for outward normals on a closed section). `flat` duplicates vertices per
   * face (crisp slabs); otherwise the ring is shared (smooth bars).
   */
  function sweep(mat, stations, section, { closed = true, flat = false, chunk = 0, lift = 1 } = {}) {
    const pos = [], idx = [];
    const rings = stations.map((s) => section(s).map(([d, y]) => P(s, d, y)));
    const n = rings[0].length, faces = closed ? n : n - 1;
    if (flat) {
      for (let k = 0; k + 1 < rings.length; k++) for (let i = 0; i < faces; i++) {
        const j = (i + 1) % n, base = pos.length / 3;
        pos.push(...rings[k][i], ...rings[k][j], ...rings[k + 1][i], ...rings[k + 1][j]);
        idx.push(base, base + 2, base + 1, base + 1, base + 2, base + 3);
      }
    } else {
      for (const r of rings) for (const p of r) pos.push(...p);
      for (let k = 0; k + 1 < rings.length; k++) for (let i = 0; i < faces; i++) {
        const j = (i + 1) % n, a = k * n + i, c = k * n + j, u = (k + 1) * n + i, v = (k + 1) * n + j;
        idx.push(a, u, c, c, u, v);
      }
    }
    mesh(mat, pos, idx, chunk, lift);
  }
  /** A slab between lateral edges dl(s)..dr(s), top at top(s), `thick` deep, with its sides. */
  const slab = (mat, stations, dl, dr, top, thick, opts) => sweep(mat, stations, (s) => {
    const t = top(s), l = dl(s), r = dr(s);
    return [[l, t], [l, t - thick], [r, t - thick], [r, t]];
  }, { flat: true, ...opts });
  /** A single upward-facing surface (road, paint). */
  const surface = (mat, stations, dl, dr, y, opts) => sweep(mat, stations, (s) => [[dr(s), y(s)], [dl(s), y(s)]], { closed: false, flat: true, ...opts });
  /** A rectangular bar along stations centred on (d, yc(s)): w across, t tall. */
  const chord = (mat, stations, d, yc, w, t, opts) => sweep(mat, stations, (s) => {
    const y = yc(s);
    return [[d - w / 2, y + t / 2], [d - w / 2, y - t / 2], [d + w / 2, y - t / 2], [d + w / 2, y + t / 2]];
  }, opts);

  /**
   * A four-sided bar between two points, no end caps (they are always buried in a joint).
   * `side` is the bar's width direction (unit Vector3), defaulting to horizontal across the axis.
   */
  function bar(mat, A, B, w, t, { side = null, chunk = 0, lift = 1, round = false, flat = false } = {}) {
    const a = new Vector3(...A), c = new Vector3(...B), axis = c.clone().sub(a), len = axis.length();
    if (len < 0.05) return;
    axis.divideScalar(len);
    let u = side ? side.clone() : new Vector3().crossVectors(axis, new Vector3(0, 1, 0));
    u.addScaledVector(axis, -u.dot(axis));
    if (u.lengthSq() < 1e-6) u = new Vector3(1, 0, 0).addScaledVector(axis, -axis.x);
    u.normalize();
    const v = new Vector3().crossVectors(axis, u).normalize();
    const sides = round ? (near ? 6 : 4) : 4;
    const ring = (p) => Array.from({ length: sides }, (_, i) => {
      const ang = round ? (i / sides) * Math.PI * 2 : (i + 0.5) * Math.PI / 2;
      const cu = Math.cos(ang) * (round ? w : w / Math.SQRT2), cv = Math.sin(ang) * (round ? w : t / Math.SQRT2);
      return p.clone().addScaledVector(u, cu).addScaledVector(v, cv);
    });
    const r0 = ring(a), r1 = ring(c), idx = [];
    if (flat) {   // plated members: crisp faces
      const pos = [];
      for (let i = 0; i < sides; i++) {
        const j = (i + 1) % sides, base = pos.length / 3;
        pos.push(...r0[i].toArray(), ...r0[j].toArray(), ...r1[i].toArray(), ...r1[j].toArray());
        idx.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
      }
      return mesh(mat, pos, idx, chunk, lift);
    }
    const pos = [...r0, ...r1].flatMap((p) => p.toArray());
    for (let i = 0; i < sides; i++) { const j = (i + 1) % sides; idx.push(i, j, sides + i, j, sides + j, sides + i); }
    mesh(mat, pos, idx, chunk, lift);
  }

  /** A closed box (crisp faces) with an exact frame: `along` the bridge tangent at s, `across`, `tall`. */
  function block(mat, s, d, y0, y1, along, across, { chunk = 0, lift = 0, taper = 0 } = {}) {
    const t = tangent(s), n = lateral(s), c = P(s, d, 0);
    const corners = (y, k) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([i, j]) => new Vector3(c[0], y, c[2])
      .addScaledVector(t, i * (along / 2 - k)).addScaledVector(n, j * (across / 2 - k)));
    const lo = corners(y0, 0), hi = corners(y1, taper), pos = [], idx = [];
    const quad = (p0, p1, p2, p3) => { const base = pos.length / 3; pos.push(...p0.toArray(), ...p1.toArray(), ...p2.toArray(), ...p3.toArray()); idx.push(base, base + 1, base + 2, base, base + 2, base + 3); };
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; quad(lo[i], lo[j], hi[j], hi[i]); }
    quad(hi[0], hi[1], hi[2], hi[3]);
    mesh(mat, pos, idx.map((v, i) => idx[i - (i % 3) + [0, 2, 1][i % 3]]), chunk, lift);
  }

  /** Rings of a chamfered rectangle (8 points) at height y, centred on (s, d). */
  function octRing(s, d, y, along, across, ch) {
    const t = tangent(s), n = lateral(s), c = P(s, d, 0), a = along / 2, w = across / 2;
    return [[-a + ch, -w], [a - ch, -w], [a, -w + ch], [a, w - ch], [a - ch, w], [-a + ch, w], [-a, w - ch], [-a, -w + ch]]
      .map(([i, j]) => new Vector3(c[0], y, c[2]).addScaledVector(t, i).addScaledVector(n, j).toArray());
  }
  /** Loft rings (same point count) with optional caps; shared vertices. */
  function loft(mat, rings, { capTop = false, chunk = 0, lift = 0 } = {}) {
    const n = rings[0].length, pos = rings.flat(2), idx = [];
    for (let k = 0; k + 1 < rings.length; k++) for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, a = k * n + i, c = k * n + j, u = (k + 1) * n + i, v = (k + 1) * n + j;
      idx.push(a, u, c, c, u, v);
    }
    if (capTop) { const k = rings.length - 1; for (let i = 1; i < n - 1; i++) idx.push(k * n, k * n + i + 1, k * n + i); }
    mesh(mat, pos, idx, chunk, lift);
  }

  return { near, P, tangent, lateral, mesh, samples, sweep, slab, surface, chord, bar, block, octRing, loft };
}
