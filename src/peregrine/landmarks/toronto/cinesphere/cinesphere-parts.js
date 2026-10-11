import * as THREE from 'three';

// Small builders shared by the pods, the truss walkways and the Cinesphere's
// entrance works. Every function takes the landmark's `assetBuilder` (`b`), works
// in metres (+X east, +Y up, +Z south) and only ever adds merged geometry.

const UP = new THREE.Vector3(0, 1, 0);

/** Vertical or arbitrary cylinder between two points (closed, flat rim; `caps = false` leaves the ends open, for pipes
 *  whose ends sit inside a plate or under the lake level). */
export function pipe(b, material, a, c, radius, segments = 8, caps = true) {
  const av = new THREE.Vector3(...a), cv = new THREE.Vector3(...c), d = cv.clone().sub(av), len = d.length();
  if (len < 1e-4) return;
  const g = new THREE.CylinderGeometry(radius, radius, len, segments, 1, !caps);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, d.normalize()));
  g.translate(...av.add(cv).multiplyScalar(0.5).toArray());
  b.put(g, material);
}

/** Box aligned to a local frame (origin + yaw) so parts can be authored axis-aligned. */
export function frame(origin, yaw) {
  const c = Math.cos(yaw), s = Math.sin(yaw);
  // Local +x is "along", +z is "across" (south when yaw = 0). Y is untouched.
  const p = (x, y, z) => [origin[0] + x * c + z * s, y, origin[1] - x * s + z * c];
  const box = (b, material, x, y, z, w, h, d) => b.box(material, p(x, y, z), [w, h, d], yaw);
  const bar = (b, material, u, v, width, depth = width) => b.bar(material, p(...u), p(...v), width, depth);
  return { p, box, bar, yaw, origin };
}

/** A hollow rectangle of railings: posts every `step`, two rails. */
export function railLoop(b, f, material, x0, x1, z0, z1, y, height = 1.1, step = 2.4, near = true) {
  const edges = [[[x0, z0], [x1, z0]], [[x1, z0], [x1, z1]], [[x1, z1], [x0, z1]], [[x0, z1], [x0, z0]]];
  for (const [[ax, az], [bx, bz]] of edges) {
    f.bar(b, material, [ax, y + height, az], [bx, y + height, bz], 0.04);
    if (near) f.bar(b, material, [ax, y + height * 0.5, az], [bx, y + height * 0.5, bz], 0.025);
    const n = Math.max(1, Math.round(Math.hypot(bx - ax, bz - az) / step));
    if (near) for (let i = 0; i <= n; i++) {
      const t = i / n, x = ax + (bx - ax) * t, z = az + (bz - az) * t;
      f.bar(b, material, [x, y, z], [x, y + height, z], 0.03);
    }
  }
}

/** Fire-escape style stair tower: stacked flights with landings and rails. */
export function stairTower(b, f, x, z, y0, y1, { width = 1.6, run = 3.2, near = true } = {}) {
  const levels = Math.max(1, Math.round((y1 - y0) / 3.3)), rise = (y1 - y0) / levels;
  for (let i = 0; i < levels; i++) {
    const y = y0 + i * rise, dir = i % 2 ? -1 : 1;
    f.box(b, 'white', x, y + rise, z + dir * (run / 2 + 0.6), width, 0.14, 1.4); // landing
    // flight: an inclined slab from one landing to the next
    f.bar(b, 'white', [x, y, z - dir * (run / 2 - 0.4)], [x, y + rise, z + dir * (run / 2 - 0.4)], width / 2 * 0.98, 0.12);
    if (near) {
      f.bar(b, 'white', [x - width / 2, y + 1, z - dir * (run / 2 - 0.4)], [x - width / 2, y + rise + 1, z + dir * (run / 2 - 0.4)], 0.03);
      f.bar(b, 'white', [x + width / 2, y + 1, z - dir * (run / 2 - 0.4)], [x + width / 2, y + rise + 1, z + dir * (run / 2 - 0.4)], 0.03);
    }
  }
  for (const dz of [-run / 2, run / 2 + 0.9]) for (const dx of [-width / 2, width / 2]) f.bar(b, 'white', [x + dx, y0, z + dz], [x + dx, y1 + 1.1, z + dz], 0.05);
}

/** Warren-truss walkway: glazed tube, white truss diagonals, canopy and paired pipe supports.
 *  `a` and `c` are [x, z] deck-centre ends, `y` is the deck's top surface. */
export function walkway(b, a, c, y, { width = 4, height = 3.2, spacing = 14, near = true, bay = 4.2 } = {}) {
  const dx = c[0] - a[0], dz = c[1] - a[1], len = Math.hypot(dx, dz);
  if (len < 0.5) return;
  const yaw = Math.atan2(-dz, dx), f = frame([(a[0] + c[0]) / 2, (a[1] + c[1]) / 2], yaw), hl = len / 2, hw = width / 2;
  f.box(b, 'deck', 0, y - 0.3, 0, len, 0.6, width);                       // deck slab
  f.box(b, 'white', 0, y + height + 0.2, 0, len, 0.35, width + 0.8);      // canopy
  for (const s of [-1, 1]) {
    f.box(b, 'glass', 0, y + height * 0.5, s * hw, len, height - 0.5, 0.1); // glazing
    f.bar(b, 'white', [-hl, y + height, s * hw + s * 0.1], [hl, y + height, s * hw + s * 0.1], 0.14, 0.22);
    if (near) f.bar(b, 'white', [-hl, y + 0.05, s * hw + s * 0.1], [hl, y + 0.05, s * hw + s * 0.1], 0.14, 0.22); // the sill chord lies on the deck edge: far drops it
    const bays = near ? Math.max(2, Math.round(len / bay)) : 0; // far drops the truss diagonals: sub-pixel members
    for (let i = 0; i < bays; i++) {
      const up = i % 2 === 0, x0 = -hl + (i / bays) * len, x1 = -hl + ((i + 1) / bays) * len;
      f.bar(b, 'white', [x0, up ? y + 0.05 : y + height, s * hw + s * 0.1], [x1, up ? y + height : y + 0.05, s * hw + s * 0.1], 0.1, 0.16);
    }
  }
  // Pipe supports in pairs down to the water (never below grade).
  const pairs = Math.max(1, Math.round(len / spacing));
  for (let i = 0; i < pairs; i++) for (const s of [-1, 1]) {
    const q = f.p(-hl + (i + 0.5) * len / pairs, 0, s * (hw - 0.5));
    b.box('white', [q[0], (y - 0.6) / 2, q[2]], [0.55, y - 0.6, 0.55], yaw);
  }
}

/** Trussed stair ramp: an inclined deck between two 3D centre-line ends, with a Warren truss and hand rail
 *  on each side, as on the pods' lake faces. `a` and `c` are [x, y, z]; width is the walking width. */
export function ramp(b, a, c, { width = 2, near = true } = {}) {
  const dx = c[0] - a[0], dy = c[1] - a[1], dz = c[2] - a[2], run = Math.hypot(dx, dz), len = Math.hypot(run, dy);
  if (len < 0.5) return;
  const yaw = Math.atan2(-dz, dx), slope = Math.atan2(dy, run), side = [Math.sin(yaw), Math.cos(yaw)];
  const deck = new THREE.BoxGeometry(len, 0.2, width);
  deck.rotateZ(slope); deck.rotateY(yaw); deck.translate((a[0] + c[0]) / 2, (a[1] + c[1]) / 2, (a[2] + c[2]) / 2);
  b.put(deck, 'deck');
  const at = (t, lift, s) => [a[0] + dx * t + side[0] * s, a[1] + dy * t + lift, a[2] + dz * t + side[1] * s];
  for (const s of [-1, 1]) {
    const o = s * width / 2;
    b.bar('white', at(0, 1.1, o), at(1, 1.1, o), 0.05, 0.08);            // hand rail / top chord
    if (near) b.bar('white', at(0, -0.15, o), at(1, -0.15, o), 0.05, 0.1); // bottom chord (far: under the deck, not drawn)
    const bays = near ? Math.max(2, Math.round(len / 1.7)) : 0; // far keeps the chords and the deck, not the diagonals
    for (let i = 0; i < bays; i++) {
      const up = i % 2 === 0, t0 = i / bays, t1 = (i + 1) / bays;
      b.bar('white', at(t0, up ? -0.15 : 1.1, o), at(t1, up ? 1.1 : -0.15, o), 0.04, 0.06);
    }
  }
}
