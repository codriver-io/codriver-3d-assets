import * as THREE from 'three';

// Small modelling kit for Union Station, all in the facade frame (u along Front Street,
// y up, v away from the street). Every helper feeds the shared assetBuilder, so
// everything merges by semantic material and nothing here creates a draw call.
export function unionStationKit(b, near) {
  const seg = (n, f = 1) => (near ? n : Math.max(3, Math.round(n * f)));
  const ok = (...pairs) => pairs.every(([lo, hi]) => hi - lo > 1e-4);

  const box = (mat, u0, u1, y0, y1, v0, v1) => {
    if (!ok([u0, u1], [y0, y1], [v0, v1])) return;
    b.box(mat, [(u0 + u1) / 2, (y0 + y1) / 2, (v0 + v1) / 2], [u1 - u0, y1 - y0, v1 - v0]);
  };

  // Keep the triangles of a non-indexed geometry that pass `keep(normalY)`.
  function filtered(g, keep) {
    const n = g.attributes.normal, index = [];
    for (let i = 0; i + 2 < n.count; i += 3) if (keep(n.getY(i), n.getY(i + 1), n.getY(i + 2))) index.push(i, i + 1, i + 2);
    g.setIndex(index);
    return g;
  }

  // Drop the triangles of a non-indexed geometry whose flat normal satisfies `drop(nx, ny, nz)` and rebuild it with only
  // the kept vertices (an index would leave the dropped ones in the GLB).
  function without(g, drop) {
    const p = g.attributes.position, n = g.attributes.normal, pos = [], nor = [];
    for (let i = 0; i + 2 < n.count; i += 3) {
      if (drop(n.getX(i), n.getY(i), n.getZ(i))) continue;
      for (let j = i; j < i + 3; j++) { pos.push(p.getX(j), p.getY(j), p.getZ(j)); nor.push(n.getX(j), n.getY(j), n.getZ(j)); }
    }
    const out = new THREE.BufferGeometry();
    out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    return out;
  }

  // A prism over a plan polygon [[u, v], ...] from y0 to y1: sides in matSide, top in matTop, no floor.
  function prism(matTop, matSide, pts, y0, y1) {
    const shape = new THREE.Shape(pts.map(([u, v]) => new THREE.Vector2(u, -v)));
    const make = () => {
      const g = new THREE.ExtrudeGeometry(shape, { depth: y1 - y0, bevelEnabled: false });
      g.rotateX(-Math.PI / 2); g.translate(0, y0, 0); return g;
    };
    if (matSide) b.put(filtered(make(), (a) => Math.abs(a) < 0.5), matSide);
    if (matTop) b.put(filtered(make(), (a) => a > 0.99), matTop);
  }

  // Convex faces, each oriented away from `centre`, flat-shaded. faces: [[[u,y,v],...], ...]
  function poly(mat, faces, centre) {
    const pos = [];
    for (const f of faces) {
      for (let i = 1; i + 1 < f.length; i++) {
        let [p, q, r] = [f[0], f[i], f[i + 1]];
        const a = new THREE.Vector3(...p), c = new THREE.Vector3(...q), d = new THREE.Vector3(...r);
        const n = c.clone().sub(a).cross(d.clone().sub(a));
        const mid = a.clone().add(c).add(d).divideScalar(3).sub(new THREE.Vector3(...centre));
        if (n.dot(mid) < 0) [q, r] = [r, q];
        pos.push(...p, ...q, ...r);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.computeVertexNormals();
    b.put(g, mat);
  }

  // Hipped roof over a plan rectangle, ridge along the longer side. Returns nothing.
  function hip(mat, u0, u1, v0, v1, y0, rise) {
    const w = u1 - u0, d = v1 - v0, alongU = w >= d, half = Math.min(w, d) / 2;
    let r0, r1;
    if (alongU) { const vm = (v0 + v1) / 2; r0 = [u0 + half, y0 + rise, vm]; r1 = [u1 - half, y0 + rise, vm]; }
    else { const um = (u0 + u1) / 2; r0 = [um, y0 + rise, v0 + half]; r1 = [um, y0 + rise, v1 - half]; }
    const A = [u0, y0, v0], B = [u1, y0, v0], C = [u1, y0, v1], D = [u0, y0, v1];
    const faces = alongU
      ? [[A, B, r1, r0], [D, C, r1, r0], [A, D, r0], [B, C, r1]]
      : [[A, D, r1, r0], [B, C, r1, r0], [A, B, r0], [D, C, r1]];
    poly(mat, faces, [(u0 + u1) / 2, y0 + rise / 3, (v0 + v1) / 2]);
  }

  // Low pyramid on a rectangle.
  function pyramid(mat, u0, u1, v0, v1, y0, rise) {
    const t = [(u0 + u1) / 2, y0 + rise, (v0 + v1) / 2];
    const A = [u0, y0, v0], B = [u1, y0, v0], C = [u1, y0, v1], D = [u0, y0, v1];
    poly(mat, [[A, B, t], [B, C, t], [C, D, t], [D, A, t]], [t[0], y0 + rise / 3, t[2]]);
  }

  // Outline path of a rectangular or round-headed opening in (u, y).
  function openingPoints(h) {
    const pts = [[h.u0, h.y0], [h.u1, h.y0]];
    if (h.arch) {
      const r = (h.u1 - h.u0) / 2, spring = h.y1 - r, cu = (h.u0 + h.u1) / 2, n = seg(14, 0.45);
      pts.push([h.u1, spring]);
      for (let i = 1; i < n; i++) { const a = (i / n) * Math.PI; pts.push([cu + r * Math.cos(a), spring + r * Math.sin(a)]); }
      pts.push([h.u0, spring]);
    } else pts.push([h.u1, h.y1], [h.u0, h.y1]);
    return pts;
  }

  // A wall slab in the (u, y) plane with openings punched through it, `t` thick. The slab's outward
  // face sits at v = vFace, `facing` -1 looking toward the street (-v), +1 looking away.
  function wallU(mat, u0, u1, y0, y1, vFace, t, holes, facing = -1) {
    const shape = new THREE.Shape([[u0, y0], [u1, y0], [u1, y1], [u0, y1]].map(([x, y]) => new THREE.Vector2(x, y)));
    for (const h of holes) shape.holes.push(new THREE.Path(openingPoints(h).map(([x, y]) => new THREE.Vector2(x, y))));
    const g = new THREE.ExtrudeGeometry(shape, { depth: t, bevelEnabled: false, curveSegments: 1 });
    g.translate(0, 0, facing < 0 ? vFace : vFace - t);
    // The slab's back cap lies against the mass behind it (or the pane tucked into it): never seen, and it shared its plane
    // with that mass and the glass, so it is dropped (a third of the slab's triangles).
    b.put(without(g, (nx, ny, nz) => (facing < 0 ? nz > 0.99 : nz < -0.99)), mat);
  }
  // The same in the (v, y) plane, facing -u (-1) or +u (+1). Holes give v0/v1 in their u0/u1 slots.
  function wallV(mat, v0, v1, y0, y1, uFace, t, holes, facing = 1) {
    // Author with x = -v so that rotateY(+90deg) maps x to +v.
    const shape = new THREE.Shape([[-v1, y0], [-v0, y0], [-v0, y1], [-v1, y1]].map(([x, y]) => new THREE.Vector2(x, y)));
    for (const h of holes) {
      const flipped = { ...h, u0: -h.u1, u1: -h.u0 };
      shape.holes.push(new THREE.Path(openingPoints(flipped).map(([x, y]) => new THREE.Vector2(x, y))));
    }
    const g = new THREE.ExtrudeGeometry(shape, { depth: t, bevelEnabled: false, curveSegments: 1 });
    g.rotateY(Math.PI / 2);
    g.translate(facing < 0 ? uFace : uFace - t, 0, 0);
    b.put(without(g, (nx) => (facing < 0 ? nx > 0.99 : nx < -0.99)), mat); // back cap dropped, as in wallU
  }

  // Glass (or any infill) filling one opening: a whisker proud of the body face at v = vFace, on
  // the side the viewer stands (facing -1: street side, so smaller v).
  function paneU(mat, h, vFace, facing = -1) {
    if (h.arch) {
      const cu = (h.u0 + h.u1) / 2;
      const g = new THREE.ShapeGeometry(new THREE.Shape(openingPoints(h).map(([x, y]) => new THREE.Vector2(x - cu, y))), seg(14, 0.45));
      if (facing < 0) g.rotateY(Math.PI); // ShapeGeometry faces +z; flip it toward the street
      g.translate(cu, 0, vFace + (facing < 0 ? -0.03 : 0.03)); b.put(g, mat);
    } else if (facing < 0) box(mat, h.u0, h.u1, h.y0, h.y1, vFace - 0.05, vFace);
    else box(mat, h.u0, h.u1, h.y0, h.y1, vFace, vFace + 0.05);
  }
  function paneV(mat, h, uFace, facing = 1) {
    if (facing > 0) box(mat, uFace, uFace + 0.05, h.y0, h.y1, h.u0, h.u1);
    else box(mat, uFace - 0.05, uFace, h.y0, h.y1, h.u0, h.u1);
  }

  // Stacked slabs = a cornice that closes its own corners. layers: [[height, projection], ...] from y0 up.
  // `sides` says which of n(-v) / s(+v) / w(-u) / e(+u) the slab may project past; a side that abuts
  // a neighbour must not, or two same-facing tops would overlap and shimmer.
  function slabs(mat, u0, u1, v0, v1, y0, layers, sides = 'nswe') {
    let y = y0;
    for (const [h, p] of layers) {
      box(mat, u0 - (sides.includes('w') ? p : 0), u1 + (sides.includes('e') ? p : 0), y, y + h,
        v0 - (sides.includes('n') ? p : 0), v1 + (sides.includes('s') ? p : 0));
      y += h;
    }
    return y;
  }

  // A round Tuscan column: plinth, torus base, tapered shaft with entasis, astragal, echinus, abacus.
  function column(u, v, scale = 1) {
    const r = 0.875 * scale, pts = near
      ? [[1.02 * scale, 0.45], [1.0 * scale, 0.62], [0.95 * scale, 0.78], [r, 0.98], [0.9 * scale, 3.5], [0.86 * scale, 6.5], [0.76 * scale, 10.2],
        [0.8 * scale, 10.28], [0.8 * scale, 10.42], [0.74 * scale, 10.5], [0.86 * scale, 10.78], [1.0 * scale, 11.06], [1.1 * scale, 11.3]]
      : [[1.0 * scale, 0.45], [r, 1.0], [0.8 * scale, 10.3], [1.05 * scale, 11.1], [1.1 * scale, 11.3]];
    // no pole caps: the plinth and abacus boxes close both ends, and a cap at r = 0 is a fan of degenerate triangles
    const g = new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg(18, 0.45));
    g.translate(u, 0, v); b.put(g, 'stone');
    box('stone', u - 1.16 * scale, u + 1.16 * scale, 0, 0.45, v - 1.16 * scale, v + 1.16 * scale);
    box('stone', u - 1.16 * scale, u + 1.16 * scale, 11.3, 12.0, v - 1.16 * scale, v + 1.16 * scale);
  }

  // A shallow round-headed barrel over a rectangle, axis along v (glass vaults of the atrium).
  function barrelU(mat, u0, u1, v0, v1, ySpring, sagitta, steps = 12) {
    const w = u1 - u0, R = (w * w / 4 + sagitta * sagitta) / (2 * sagitta), cy = ySpring + sagitta - R;
    const rows = [];
    for (let i = 0; i <= steps; i++) { const u = u0 + (w * i) / steps, x = u - (u0 + u1) / 2; rows.push([u, cy + Math.sqrt(R * R - x * x)]); }
    const pos = [];
    for (let i = 0; i < steps; i++) {
      const [ua, ya] = rows[i], [ub, yb] = rows[i + 1];
      pos.push(ua, ya, v0, ub, yb, v0, ub, yb, v1, ua, ya, v0, ub, yb, v1, ua, ya, v1);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    // Wind the strip so the normals point up: (ua,v0) -> (ub,v0) -> (ub,v1) with v pointing south.
    g.computeVertexNormals();
    const n = g.attributes.normal; // flip if it faces down
    if (n.getY(0) < 0) { const arr = g.attributes.position.array; for (let i = 0; i < arr.length; i += 9) for (let k = 0; k < 3; k++) { const t = arr[i + 3 + k]; arr[i + 3 + k] = arr[i + 6 + k]; arr[i + 6 + k] = t; } g.computeVertexNormals(); }
    b.put(g, mat);
    return { yAt: (u) => cy + Math.sqrt(R * R - (u - (u0 + u1) / 2) ** 2) };
  }

  return { seg, box, prism, poly, hip, pyramid, openingPoints, wallU, wallV, paneU, paneV, slabs, column, barrelU };
}
