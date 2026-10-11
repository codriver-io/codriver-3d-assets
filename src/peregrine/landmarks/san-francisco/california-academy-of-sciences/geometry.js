import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import {
  site, dir, THETA, OUTLINE, WALL, WALL_TOP, SKIRT_OUT, SKIRT_BOT, CAN_BOT, CAN_TOP, RIM_BOT, RIM_TOP, ROOF_Y,
  ROOF_HALF, PIAZZA, TERRACE, HILLS, CAP, roofHeight, roofNormal, insetPolygon, outwardNormals,
} from './california-academy-of-sciences-site.js';

// The California Academy of Sciences: a 161 x 103 m glass-and-concrete box under Renzo Piano's
// living roof. The roof is a height field (seven hills; the two largest cover the planetarium and
// rainforest spheres and carry round vents, the rainforest crown breaks through as a glass cap),
// edged by a thin white fascia, with the glazed piazza roof and the railed terrace on top. Round
// the walls runs an 11.9 m flat photovoltaic canopy with a fine white rim on slender columns. The
// entrance hall (lit glass) faces north-west across the Music Concourse. Authored in (u, y, v)
// and rotated by site() into the exported +X east, +Y up, +Z south. y = 0 is entrance grade.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const put = (g, mat) => b.put(g, mat, 0, 0);

  // ---- helpers -------------------------------------------------------------------------
  // Accumulate triangles (positions are world points); every triangle is wound to face
  // `faceDir`, so nothing is inside out. Flushed once per material.
  function acc() {
    const pos = [], idx = [];
    const tri = (a, c, d, face) => {
      if (face) {
        const ux = pos[c * 3] - pos[a * 3], uy = pos[c * 3 + 1] - pos[a * 3 + 1], uz = pos[c * 3 + 2] - pos[a * 3 + 2];
        const vx = pos[d * 3] - pos[a * 3], vy = pos[d * 3 + 1] - pos[a * 3 + 1], vz = pos[d * 3 + 2] - pos[a * 3 + 2];
        const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
        if (nx * face[0] + ny * face[1] + nz * face[2] < 0) { idx.push(a, d, c); return; }
      }
      idx.push(a, c, d);
    };
    return {
      vertex(p) { pos.push(...p); return pos.length / 3 - 1; },
      tri,
      quad(p0, p1, p2, p3, face) { const i = pos.length / 3; pos.push(...p0, ...p1, ...p2, ...p3); tri(i, i + 1, i + 2, face); tri(i, i + 2, i + 3, face); },
      flush(mat) {
        if (!idx.length) return;
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); put(g, mat);
      },
    };
  }
  const boxUV = (mat, u, y, v, lu, h, lv) => b.box(mat, site(u, y, v), [lu, h, lv], THETA, 0, 0);
  const Y = [0, 1, 0], NY = [0, -1, 0];

  // A closed ring-shaped prism around `poly` (u, v), w thick, from y0 to y1: outer, inner, top
  // and bottom faces.
  function ringPrism(a, poly, w, y0, y1) {
    const inner = insetPolygon(poly, w), out = outwardNormals(poly), n = poly.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, o = dir(out[i][0], 0, out[i][1]), io = [-o[0], 0, -o[2]];
      a.quad(site(...[poly[i][0], y0, poly[i][1]]), site(poly[j][0], y0, poly[j][1]), site(poly[j][0], y1, poly[j][1]), site(poly[i][0], y1, poly[i][1]), o);
      a.quad(site(inner[i][0], y0, inner[i][1]), site(inner[j][0], y0, inner[j][1]), site(inner[j][0], y1, inner[j][1]), site(inner[i][0], y1, inner[i][1]), io);
      a.quad(site(poly[i][0], y1, poly[i][1]), site(poly[j][0], y1, poly[j][1]), site(inner[j][0], y1, inner[j][1]), site(inner[i][0], y1, inner[i][1]), Y);
      a.quad(site(poly[i][0], y0, poly[i][1]), site(poly[j][0], y0, poly[j][1]), site(inner[j][0], y0, inner[j][1]), site(inner[i][0], y0, inner[i][1]), NY);
    }
  }
  // A cylinder along `normal` (world), base point `p`, from `lo` to `hi` along the axis; the
  // bottom cap is dropped (it is buried), the top cap is kept.
  const up = new THREE.Vector3(0, 1, 0);
  function cyl(mat, p, normal, radius, lo, hi, seg) {
    const g = new THREE.CylinderGeometry(radius, radius, hi - lo, seg, 1, false);
    const cut = g.groups[2]; g.setIndex(Array.from(g.index.array).slice(0, cut.start));
    g.translate(0, (hi + lo) / 2, 0);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(up, new THREE.Vector3(...normal)));
    g.translate(...p); g.clearGroups(); put(g, mat);
  }

  // ---- the roof: a height field, a fascia skirt, the hills' round vents -------------------
  {
    const nu = near ? 84 : 36, nv = near ? 48 : 22, cols = nu + 1;
    const a = acc(), ids = [];
    for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
      const u = -ROOF_HALF.u + (2 * ROOF_HALF.u * i) / nu, v = -ROOF_HALF.v + (2 * ROOF_HALF.v * j) / nv;
      ids.push(a.vertex(site(u, roofHeight(u, v), v)));
    }
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
      const p = ids[j * cols + i], q = ids[j * cols + i + 1], r = ids[(j + 1) * cols + i], s = ids[(j + 1) * cols + i + 1];
      a.tri(p, r, q, Y); a.tri(q, r, s, Y);
    }
    a.flush('green');
    // the fascia: a white skirt from just under the canopy up to the roof edge, all round
    const w = acc(), hu = ROOF_HALF.u, hv = ROOF_HALF.v;
    const rect = [[-hu, -hv], [hu, -hv], [hu, hv], [-hu, hv]];
    for (let k = 0; k < 4; k++) {
      const p = rect[k], q = rect[(k + 1) % 4], o = outwardNormals(rect)[k];
      w.quad(site(p[0], SKIRT_BOT, p[1]), site(q[0], SKIRT_BOT, q[1]), site(q[0], ROOF_Y, q[1]), site(p[0], ROOF_Y, p[1]), dir(o[0], 0, o[1]));
    }
    w.flush('white');
  }

  // round vents: a pale rim and a dark glazed lid, tilted to the hill's slope
  {
    const seg = near ? 12 : 8;
    for (const h of HILLS) {
      const { n, r0, r1, phase } = h.holes;
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) / n, r = Math.sqrt(r0 * r0 + (r1 * r1 - r0 * r0) * t), ang = phase + i * 2.39996;
        const u = h.u + r * Math.cos(ang), v = h.v + r * Math.sin(ang), y = roofHeight(u, v);
        const nm = roofNormal(u, v), nw = dir(nm[0], nm[1], nm[2]);
        const s = (d) => [site(u, y, v)[0] + nw[0] * d, y + nw[1] * d, site(u, y, v)[2] + nw[2] * d];
        if (near) {
          cyl('white', s(0), nw, 1.55, -1.9, 0.45, seg);
          cyl('glass', s(0), nw, 1.28, 0.38, 0.58, seg);
        } else {
          const g = new THREE.CircleGeometry(1.45, seg);
          g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(...nw)));
          g.translate(...s(0.45)); put(g, 'glass');
        }
      }
    }
  }

  // ---- the rainforest sphere's glass crown, in a white collar, with glazing ribs --------------
  {
    const seg = near ? 40 : 20;
    const g = new THREE.SphereGeometry(CAP.Rs, near ? 40 : 20, near ? 10 : 5, 0, Math.PI * 2, 0, CAP.theta);
    g.translate(...site(CAP.u, CAP.cy, CAP.v)); put(g, 'glass');
    // the collar: an outer wall rising 0.65 m over the green, and its flat top out to the glass
    const wall = new THREE.CylinderGeometry(CAP.rc, CAP.rc, CAP.collarTop - CAP.collarBot, seg, 1, true);
    wall.translate(...site(CAP.u, (CAP.collarTop + CAP.collarBot) / 2, CAP.v)); put(wall, 'white');
    const top = new THREE.RingGeometry(CAP.rin, CAP.rc, seg, 1).rotateX(-Math.PI / 2);
    top.translate(...site(CAP.u, CAP.collarTop, CAP.v)); put(top, 'white');
    if (near) {
      // meridian and parallel ribs standing 0.08 m proud of the shell
      const R = CAP.Rs + 0.08, pt = (th, ph) => site(CAP.u + R * Math.sin(th) * Math.cos(ph), CAP.cy + R * Math.cos(th), CAP.v + R * Math.sin(th) * Math.sin(ph));
      const thEnd = CAP.theta - 0.03;
      for (let m = 0; m < 8; m++) for (let i = 0; i < 4; i++) b.bar('white', pt((thEnd * i) / 4, (m * Math.PI) / 4), pt((thEnd * (i + 1)) / 4, (m * Math.PI) / 4), 0.14, 0.14, 0, false, 0);
      for (const th of [thEnd * 0.4, thEnd * 0.72]) for (let i = 0; i < 24; i++) b.bar('white', pt(th, (i * Math.PI) / 12), pt(th, ((i + 1) * Math.PI) / 12), 0.14, 0.14, 0, false, 0);
    }
  }

  // ---- the glazed piazza roof (22 x 30 m) in its white kerb ----------------------------------
  {
    const { hu, hv, edge, rise, kerb, kerbTop } = PIAZZA, c = PIAZZA;
    const kerbPoly = [[-hu - kerb, -hv - kerb], [hu + kerb, -hv - kerb], [hu + kerb, hv + kerb], [-hu - kerb, hv + kerb]];
    const a = acc();
    ringPrism(a, kerbPoly, kerb + 0.2, ROOF_Y - 0.4, kerbTop);
    a.flush('white');
    const nu = near ? 8 : 4, nv = near ? 10 : 4, ids = [], g = acc();
    const hgt = (u, v) => edge + rise * (1 - Math.pow(Math.max(Math.abs(u - c.u) / (hu + 0.2), Math.abs(v - c.v) / (hv + 0.2)), 2.4));
    for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
      const u = c.u - hu - 0.2 + ((2 * hu + 0.4) * i) / nu, v = c.v - hv - 0.2 + ((2 * hv + 0.4) * j) / nv;
      ids.push(g.vertex(site(u, hgt(u, v), v)));
    }
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
      const p = ids[j * (nu + 1) + i], q = ids[j * (nu + 1) + i + 1], r = ids[(j + 1) * (nu + 1) + i], s = ids[(j + 1) * (nu + 1) + i + 1];
      g.tri(p, r, q, Y); g.tri(q, r, s, Y);
    }
    g.flush('glow');
  }

  // ---- the railed observation terrace and its glass lift ------------------------------------
  {
    const t = TERRACE, h = t.half;
    boxUV('stone', t.u, (t.deckTop + t.deckBot) / 2, t.v, 2 * h, t.deckTop - t.deckBot, 2 * h);
    if (near) {
      const hh = h - 0.1, n = 8, st = (2 * hh) / n;
      for (let k = 0; k < n; k++) {
        const s = -hh + k * st;
        for (const [pu, pv] of [[s, -hh], [hh, s], [-s, hh], [-hh, -s]]) boxUV('white', t.u + pu, t.deckTop + 0.54, t.v + pv, 0.1, 1.08, 0.1);
      }
      for (const sv of [-1, 1]) boxUV('white', t.u, t.deckTop + 1.1, t.v + sv * hh, 2 * hh + 0.1, 0.1, 0.1);
      for (const su of [-1, 1]) boxUV('white', t.u + su * hh, t.deckTop + 0.95, t.v, 0.1, 0.1, 2 * hh - 0.1);
    }
    boxUV('glass', t.u + h - 2.2, t.deckTop + 2.6, t.v + h - 2.2, 2.8, 5.2, 2.8);
    boxUV('white', t.u + h - 2.2, t.deckTop + 5.3, t.v + h - 2.2, 3.2, 0.2, 3.2);
  }

  // ---- walls: stone, with window bays; the lit entrance hall faces the Concourse ------------
  {
    const wu = WALL.u, wv = WALL.v, T = 0.5, H = WALL_TOP, HALL = 24, BACK = 18;
    boxUV('stone', -(wu + HALL) / 2, H / 2, -wv + T / 2, wu - HALL, H, T);
    boxUV('stone', (wu + HALL) / 2, H / 2, -wv + T / 2, wu - HALL, H, T);
    boxUV('glow', 0, H / 2, -wv + T / 2, 2 * HALL, H, T);
    boxUV('stone', -(wu + BACK) / 2, H / 2, wv - T / 2, wu - BACK, H, T);
    boxUV('stone', (wu + BACK) / 2, H / 2, wv - T / 2, wu - BACK, H, T);
    boxUV('glass', 0, H / 2, wv - T / 2, 2 * BACK, H, T);
    boxUV('stone', wu - T / 2, H / 2, 0, T, H, 2 * (wv - T));
    boxUV('stone', -wu + T / 2, H / 2, 0, T, H, 2 * (wv - T));
    if (near) {
      const D = 0.36, pitch = 6; // window bays proud of the stone by 0.16 m
      const bayY = 4.8, bayH = 4.6;
      for (let u = -wu + 3; u < wu - 2; u += pitch) {
        if (Math.abs(u) > HALL + 2.5) boxUV('glass', u, bayY, -wv + 0.02, 3.6, bayH, D);
        if (Math.abs(u) > BACK + 2.5) boxUV('glass', u, bayY, wv - 0.02, 3.6, bayH, D);
      }
      for (let v = -wv + 9; v < wv - 6; v += pitch) { boxUV('glass', wu - 0.02, bayY, v, D, bayH, 3.6); boxUV('glass', -wu + 0.02, bayY, v, D, bayH, 3.6); }
      // mullions and transoms of the entrance hall and the cafe glazing, sunk into the glass
      for (let k = -HALL; k <= HALL; k += 3) boxUV('white', k, (H - 0.15) / 2, -wv - 0.05, 0.2, H - 0.15, 0.2);
      for (const y of [4.8, 9.1]) boxUV('white', 0, y, -wv - 0.05, 2 * HALL, 0.18, 0.2);
      for (let k = -BACK; k <= BACK; k += 3) boxUV('white', k, (H - 0.15) / 2, wv + 0.05, 0.2, H - 0.15, 0.2);
      for (const y of [4.8, 9.1]) boxUV('white', 0, y, wv + 0.05, 2 * BACK, 0.18, 0.2);
    }
    // the red entrance banner pylon, in the arcade under the canopy
    boxUV('sign', -17, 3.2, -wv - 5, 0.9, 6.4, 0.3);
  }

  // ---- the canopy: flat photovoltaic glass on slender columns, a fine white rim -------------
  {
    const outer = insetPolygon(OUTLINE, 0.15);
    const holePts = [[-WALL.u, -WALL.v], [WALL.u, -WALL.v], [WALL.u, WALL.v], [-WALL.u, WALL.v]];
    const all = [...outer, ...holePts];
    const tris = THREE.ShapeUtils.triangulateShape(outer.map(([u, v]) => new THREE.Vector2(u, v)), [holePts.map(([u, v]) => new THREE.Vector2(u, v))]);
    const top = acc(), under = acc();
    const topIds = all.map(([u, v]) => top.vertex(site(u, CAN_TOP, v))), underIds = all.map(([u, v]) => under.vertex(site(u, CAN_BOT, v)));
    for (const [i, j, k] of tris) { top.tri(topIds[i], topIds[j], topIds[k], Y); under.tri(underIds[i], underIds[j], underIds[k], NY); }
    top.flush('pv'); under.flush('white');
    const rim = acc();
    ringPrism(rim, insetPolygon(OUTLINE, 0.12), 0.3, RIM_BOT, RIM_TOP);
    rim.flush('white');
    // columns every ~6.4 m (every ~13 m in the far model) just inside the rim
    const line = insetPolygon(OUTLINE, 1.0), spacing = near ? 6.4 : 12.8;
    for (let i = 0; i < line.length; i++) {
      const p = line[i], q = line[(i + 1) % line.length], len = Math.hypot(q[0] - p[0], q[1] - p[1]), n = Math.max(1, Math.round(len / spacing));
      for (let k = 0; k < n; k++) {
        const u = p[0] + ((q[0] - p[0]) * k) / n, v = p[1] + ((q[1] - p[1]) * k) / n;
        b.bar('white', site(u, 0, v), site(u, CAN_BOT + 0.2, v), 0.17, 0.17, 0, true, 0);
      }
    }
  }
  return b.finish();
}
