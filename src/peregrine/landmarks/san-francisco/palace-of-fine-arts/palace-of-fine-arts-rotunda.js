import * as THREE from 'three';
import { AXIS_DEG, ROTUNDA } from './palace-of-fine-arts-site.js';

const rad = (d) => (d * Math.PI) / 180;
const TAN225 = Math.tan(rad(22.5));

// Vertical stack of the rotunda, metres above local grade (the foot of the steps). Mapped: the eight piers
// (36 m), the entablature ring (to 35 m), the attic drum (to 40 m), the dome part (r 16.2 m) and the
// 162 ft (49.4 m) total. Estimated from photographs: the floor, plinth, column and arch heights.
export const R = {
  floor: 1.6,        // podium / interior floor
  plinth: 3.4,       // corner plinths ("a high base"): OSM stair/plinth parts are 4-5 m
  shaft0: 4.3, shaft1: 24.4,
  cap1: 27.2, abacus1: 27.8,
  frieze1: 30.8, cornice1: 32.4,
  attic1: 35.4, atticCornice1: 36.8, // attic and its cornice: the dome and its drum rise ~25% of the height above it
  drum1: 40.2, domeBase: 41.0,
  columnR: 1.4,      // 2.8 m shafts, ~7:1
  archHalf: 5.9, archSpring: 19.8, archCrown: 25.7,
};

// An octagonal prism, apothem `a`, faces at AXIS_DEG + k*45 (the arches' own bearing); top cap optional,
// bottom cap optional. y0..y1.
function octagon(b, near, { matSide, matTop, matBottom, apothem, y0, y1, axis = AXIS_DEG }) {
  const rc = apothem / Math.cos(rad(22.5));
  const ring = [];
  for (let k = 0; k < 8; k++) {
    const phi = rad(axis + 45 * k + 22.5);
    ring.push([rc * Math.cos(phi), -rc * Math.sin(phi)]);
  }
  const g0 = (flipY) => {
    const shape = new THREE.Shape(ring.map(([x, z]) => new THREE.Vector2(x, -z)));
    const g = new THREE.ExtrudeGeometry(shape, { depth: y1 - y0, bevelEnabled: false, curveSegments: 1 });
    g.rotateX(-Math.PI / 2); g.translate(0, y0, 0); return g;
  };
  const keep = (g, test) => {
    const n = g.attributes.normal, index = [];
    for (let i = 0; i + 2 < n.count; i += 3) if (test(n.getY(i))) index.push(i, i + 1, i + 2);
    g.setIndex(index); return g;
  };
  b.put(keep(g0(), (a) => Math.abs(a) < 0.5), matSide);
  if (matTop) b.put(keep(g0(), (a) => a > 0.99), matTop);
  if (matBottom) b.put(keep(g0(), (a) => a < -0.99), matBottom);
}

export function buildRotunda(b, kit, near) {
  const { block, shaft, frustum, lathe, archWall } = kit;
  const seg = kit.seg;

  // ---- podium ----------------------------------------------------------------------------------
  octagon(b, near, { matSide: 'base', matTop: 'base', apothem: 30.0, y0: 0, y1: R.floor });

  // ---- corner groups: plinth, pier, paired columns, broken entablature, attic block, urn --------
  for (let k = 0; k < 8; k++) {
    const theta = AXIS_DEG + 45 * k + 22.5, th = rad(theta);
    const rx = Math.cos(th), rz = -Math.sin(th), tx = -Math.sin(th), tz = -Math.cos(th);
    const at = (rho, tau = 0) => [rho * rx + tau * tx, rho * rz + tau * tz];
    const slab = (mat, rho0, rho1, tau, y0, y1) => { const [x, z] = at((rho0 + rho1) / 2); block(mat, x, z, y0, y1, rho1 - rho0, tau, th); };

    slab('stone', 19.0, 28.0, 8.4, R.floor - 0.2, R.plinth);                  // plinth
    slab('stone', 19.8, 24.6, 6.0, R.plinth, R.abacus1);                      // pier
    if (near) slab('stone', 23.6, 27.8, 8.2, R.cap1, R.abacus1);              // abacus over both capitals
    slab('stone', 20.0, 28.2, 8.0, R.abacus1 - 0.15, R.cornice1 + 0.2);       // broken entablature over the pair, its soffit 15 cm below the glowing ceiling (no shared plane)
    slab('stone', 19.4, 27.0, 6.0, R.cornice1 + 0.2, near ? R.attic1 - 0.4 : R.attic1 + 0.2); // attic corner block (kept low: the dome shows above it)
    if (near) slab('stone', 20.0, 27.6, 6.8, R.attic1 - 0.4, R.attic1 + 0.2);  // its cap
    for (const tau of [-1.9, 1.9]) {
      const [x, z] = at(25.6, tau);
      if (near) block('stone', x, z, R.plinth, R.shaft0, 3.6, 3.6, th);          // column base
      shaft('stone', x, z, near ? R.shaft0 : R.plinth, R.shaft1, R.columnR, R.columnR * 0.9, near ? 24 : 5, near ? 0.07 : 0);
      frustum('stone', x, z, R.shaft1, R.cap1, R.columnR * 0.95, 1.85, near ? 12 : 5, 'top');
    }
    if (near) {
      // urn on the attic corner
      const [ux, uz] = at(24.2);
      frustum('stone', ux, uz, R.attic1 + 0.2, R.attic1 + 1.5, 0.75, 0.55, 8, true);
      frustum('stone', ux, uz, R.attic1 + 1.5, R.attic1 + 2.2, 0.55, 0.01, 8, false);
    }
  }

  // ---- arch walls: eight faces, each a 5 m thick slab with an open arch --------------------------
  // 16 m of the 18.6 m face: the slab ends stay buried in the corner piers and never poke into a neighbouring opening
  const wallW = 16.0;
  for (let k = 0; k < 8; k++) {
    const phi = rad(AXIS_DEG + 45 * k), a = ROTUNDA.apothem;
    const cx = a * Math.cos(phi), cz = -a * Math.sin(phi), yaw = phi + Math.PI / 2;
    archWall('stone', cx, cz, yaw, wallW, R.floor - 0.8, R.abacus1, 5.0, {
      half: R.archHalf, spring: R.archSpring, crown: R.archCrown, bottom: R.floor - 0.15, // the opening floor sinks 15 cm into the podium, whose top is the visible floor
    });
    if (!near) continue;
    // archivolt: a stone band proud of the face around the arch
    const n = seg(14, 0.5), pts = [];
    const ro = R.archHalf + 1.5, ri = R.archHalf, spring = R.archSpring;
    for (let i = 0; i <= n; i++) { const an = (i / n) * Math.PI; pts.push([ro * Math.cos(an), spring + ro * Math.sin(an)]); }
    for (let i = n; i >= 0; i--) { const an = (i / n) * Math.PI; pts.push([ri * Math.cos(an), spring + ri * Math.sin(an)]); }
    const g = new THREE.ExtrudeGeometry(new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y))), { depth: 0.7, bevelEnabled: false, curveSegments: 1 });
    g.rotateY(yaw); g.translate(cx, 0, cz);
    // the shape is built in the face frame (x along the face, z out of it); rotateY(yaw) maps +z to the outward normal
    b.put(g, 'stone');
  }

  // ---- entablature, attic drum, cornice ---------------------------------------------------------
  octagon(b, near, { matSide: 'stone', matTop: null, matBottom: 'glow', apothem: 24.2, y0: R.abacus1, y1: R.frieze1 });
  octagon(b, near, { matSide: 'stone', matTop: 'stone', matBottom: 'stoneDark', apothem: 25.6, y0: R.frieze1, y1: R.cornice1 });
  octagon(b, near, { matSide: 'stone', matTop: null, apothem: 20.2, y0: R.cornice1 - 0.2, y1: R.attic1 });
  octagon(b, near, { matSide: 'stone', matTop: 'stone', matBottom: 'stoneDark', apothem: 21.3, y0: R.attic1, y1: R.atticCornice1 });

  // relief panels in the attic (the frieze of "The Struggle for the Beautiful"), one per face
  if (near) {
    for (let k = 0; k < 8; k++) {
      const phi = rad(AXIS_DEG + 45 * k), a = 20.2 + 0.1;
      block('stoneDark', a * Math.cos(phi), -a * Math.sin(phi), R.cornice1 + 0.7, R.attic1 - 0.5, 0.4, 8.0, phi);
    }
  }

  // ---- drum and dome ------------------------------------------------------------------------------
  // A round drum (OSM part 456820274: r 17.2-18.4 m, to 40 m) and a cornice ring carry a steep dome: a squashed
  // superellipse of 16.2 m base radius (OSM dome part) rising 8.4 m to the 49.4 m crown.
  frustum('stone', 0, 0, R.atticCornice1, R.drum1, 17.2, 17.0, near ? 24 : 12, false);
  frustum('stone', 0, 0, R.drum1, R.domeBase, 17.8, 16.7, near ? 24 : 12, 'top');
  const rings = near ? 12 : 6, pts = [], rise = ROTUNDA.height - R.domeBase;
  for (let i = 0; i <= rings; i++) {
    const t = i / rings;
    pts.push([ROTUNDA.domeR * Math.sqrt(Math.max(0, 1 - Math.pow(t, 2.4))), R.domeBase + rise * t]);
  }
  pts[pts.length - 1][0] = 0.02;
  lathe('dome', 0, 0, pts, near ? 24 : 12);
}
