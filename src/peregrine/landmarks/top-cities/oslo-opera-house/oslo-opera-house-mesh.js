// Polygon clip, ear cut, and flat-shaded triangle soup for the opera house.
// Faces stay unwelded so roof creases keep a hard normal.

export function tri(dst, a, b, c) {
  const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
  const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
  const cx = uy * vz - uz * vy, cy = uz * vx - ux * vz, cz = ux * vy - uy * vx;
  if (cx * cx + cy * cy + cz * cz < 1e-10) return;
  dst.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
}

export function triFacing(dst, a, b, c, dir) {
  const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
  const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
  const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
  if (nx * dir[0] + ny * dir[1] + nz * dir[2] < 0) tri(dst, a, c, b);
  else tri(dst, a, b, c);
}

export function quadFacing(dst, a, b, c, d, dir) {
  triFacing(dst, a, b, c, dir);
  triFacing(dst, a, c, d, dir);
}

export function dedupe(ring, eps = 0.05) {
  const out = [];
  for (const p of ring) {
    const q = out[out.length - 1];
    if (!q || Math.hypot(p[0] - q[0], p[1] - q[1]) > eps) out.push(p);
  }
  if (out.length > 1 && Math.hypot(out[0][0] - out[out.length - 1][0], out[0][1] - out[out.length - 1][1]) <= eps) out.pop();
  return out;
}

export function clipPoly(ring, inside, hit) {
  if (!ring.length) return [];
  const output = [];
  for (let i = 0; i < ring.length; i++) {
    const cur = ring[i], prev = ring[(i + ring.length - 1) % ring.length];
    const cin = inside(cur), pin = inside(prev);
    if (cin) {
      if (!pin) output.push(hit(prev, cur));
      output.push(cur);
    } else if (pin) output.push(hit(prev, cur));
  }
  return dedupe(output);
}

export function clipMaxV(ring, vmax) {
  return clipPoly(ring, (p) => p[1] <= vmax + 1e-6, (a, b) => {
    const t = (vmax - a[1]) / ((b[1] - a[1]) || 1e-9);
    return [a[0] + (b[0] - a[0]) * t, vmax];
  });
}
export function clipMinV(ring, vmin) {
  return clipPoly(ring, (p) => p[1] >= vmin - 1e-6, (a, b) => {
    const t = (vmin - a[1]) / ((b[1] - a[1]) || 1e-9);
    return [a[0] + (b[0] - a[0]) * t, vmin];
  });
}
export function clipMaxU(ring, umax) {
  return clipPoly(ring, (p) => p[0] <= umax + 1e-6, (a, b) => {
    const t = (umax - a[0]) / ((b[0] - a[0]) || 1e-9);
    return [umax, a[1] + (b[1] - a[1]) * t];
  });
}
export function clipMinU(ring, umin) {
  return clipPoly(ring, (p) => p[0] >= umin - 1e-6, (a, b) => {
    const t = (umin - a[0]) / ((b[0] - a[0]) || 1e-9);
    return [umin, a[1] + (b[1] - a[1]) * t];
  });
}

function area(ring) {
  let a = 0;
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i], q = ring[(i + 1) % ring.length];
    a += p[0] * q[1] - q[0] * p[1];
  }
  return a * 0.5;
}

// Returns CCW triangles as index triples. Falls back to a fan if an ear cannot be cut.
export function earcut(ring) {
  const n = ring.length;
  if (n < 3) return [];
  const ccw = area(ring) > 0;
  const pts = ring.map((p, i) => ({ x: p[0], z: p[1], i }));
  if (!ccw) pts.reverse();
  const cross = (a, b, c) => (b.x - a.x) * (c.z - a.z) - (b.z - a.z) * (c.x - a.x);
  const inside = (a, b, c, p) => cross(a, b, p) >= -1e-7 && cross(b, c, p) >= -1e-7 && cross(c, a, p) >= -1e-7;
  const tris = [];
  const next = pts.slice();
  let guard = 0;
  while (next.length > 3 && guard++ < n * n) {
    let cut = false;
    for (let i = 0; i < next.length; i++) {
      const a = next[(i + next.length - 1) % next.length], b = next[i], c = next[(i + 1) % next.length];
      if (cross(a, b, c) <= 1e-8) continue;
      let ok = true;
      for (const p of next) if (p !== a && p !== b && p !== c && inside(a, b, c, p)) { ok = false; break; }
      if (!ok) continue;
      tris.push([a.i, b.i, c.i]);
      next.splice(i, 1);
      cut = true;
      break;
    }
    if (!cut) break;
  }
  if (next.length === 3) tris.push([next[0].i, next[1].i, next[2].i]);
  else if (next.length > 3) {
    for (let i = 1; i < next.length - 1; i++) tris.push([next[0].i, next[i].i, next[i + 1].i]);
  }
  return tris;
}

export function pointSegDist(p, a, b) {
  const dx = b[0] - a[0], dz = b[1] - a[1];
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dz) / (dx * dx + dz * dz || 1)));
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dz);
}

export function ringDist(p, ring) {
  let m = Infinity;
  for (let i = 0; i < ring.length; i++) m = Math.min(m, pointSegDist(p, ring[i], ring[(i + 1) % ring.length]));
  return m;
}
