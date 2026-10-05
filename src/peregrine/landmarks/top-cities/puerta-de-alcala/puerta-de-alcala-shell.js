import * as THREE from 'three';
import {
  ATTIC_FACE, ATTIC_HALF, BODY_TOP, CENTER_CROWN, CENTER_HALF, CORNICE_TOP, DOOR_H, DOOR_HALF, DOOR_U,
  EAST, ENTABLATURE, HALF_W, PED_APEX, PED_BASE, PED_HALF, SA, SIDE_ATTIC, SIDE_CROWN,
  SIDE_HALF, SIDE_U, SPRING, WEST, place, slab,
} from './puerta-de-alcala-frame.js';

// One granite prism with five holes: three semicircular arches and two rectangular doors.
// The hole is the whole passage, so the arch soffit is a real barrel and you can see through.
function signedArea(pts) {
  let a = 0;
  for (let i = 0, n = pts.length; i < n; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % n];
    a += x1 * y2 - x2 * y1;
  }
  return a;
}

function hole(pts) {
  const ring = signedArea(pts) > 0 ? pts.slice().reverse() : pts;
  const path = new THREE.Path();
  path.moveTo(ring[0][0], ring[0][1]);
  for (let i = 1; i < ring.length; i++) path.lineTo(ring[i][0], ring[i][1]);
  return path;
}

function archHole(s0, half, spring, crown, segs) {
  const pts = [[s0 - half, 0.08], [s0 + half, 0.08]];
  for (let i = 0; i <= segs; i++) {
    const a = (i / segs) * Math.PI;
    pts.push([s0 + half * Math.cos(a), spring + (crown - spring) * Math.sin(a)]);
  }
  return pts;
}

function doorHole(s0, half) {
  return [[s0 - half, 0.08], [s0 + half, 0.08], [s0 + half, DOOR_H], [s0 - half, DOOR_H]];
}

function band(b, y0, y1, projT, projS, mat = 'granite') {
  slab(b, mat, SA, (y0 + y1) / 2, 0, (HALF_W + projS) * 2, y1 - y0, (EAST - WEST) + projT * 2);
}

export function buildShell(b, near) {
  const segs = near ? 16 : 8;
  const shape = new THREE.Shape();
  // The sill starts above grade so the granite bottom is buried in the plinth, not coplanar with it.
  shape.moveTo(SA - HALF_W, 0.06);
  shape.lineTo(SA + HALF_W, 0.06);
  shape.lineTo(SA + HALF_W, BODY_TOP);
  shape.lineTo(SA - HALF_W, BODY_TOP);
  shape.closePath();
  const openings = [
    archHole(SA, CENTER_HALF, SPRING, CENTER_CROWN, segs),
    archHole(SA + SIDE_U, SIDE_HALF, SPRING, SIDE_CROWN, segs),
    archHole(SA - SIDE_U, SIDE_HALF, SPRING, SIDE_CROWN, segs),
    doorHole(SA + DOOR_U, DOOR_HALF),
    doorHole(SA - DOOR_U, DOOR_HALF),
  ];
  for (const pts of openings) shape.holes.push(hole(pts));
  const body = new THREE.ExtrudeGeometry(shape, { depth: EAST - WEST, bevelEnabled: false, curveSegments: 1, steps: 1 });
  body.translate(0, 0, WEST);
  b.put(place(body), 'granite');

  // Plinth, then architrave / frieze / corona / cymatium. Each band is wider than the wall, so the
  // wall face stops at the architrave and the cornice is its own stack.
  slab(b, 'graniteDark', SA, 0.26, 0, HALF_W * 2 + 0.08, 0.52, (EAST - WEST) + 0.4);
  band(b, ENTABLATURE, 14.48, 0.18, 0.02);
  band(b, 14.44, 15.18, 0.06, 0.00, 'graniteDark'); // recessed frieze
  band(b, 15.14, 15.95, 0.32, 0.02);
  band(b, 15.88, CORNICE_TOP, 0.42, 0.00);

  // Side wings, a low band, then the taller central attic. Caps close the wings. The central
  // block is deeper than the wing cap so the cap does not print across the inscription.
  const wingY0 = CORNICE_TOP - 0.08;
  slab(b, 'granite', SA, (wingY0 + SIDE_ATTIC) / 2, 0, HALF_W * 2 - 0.4, SIDE_ATTIC - wingY0, 6.15);
  slab(b, 'granite', SA, SIDE_ATTIC + 0.10, 0, HALF_W * 2 - 0.2, 0.20, 6.45);
  slab(b, 'granite', SA, (wingY0 + PED_BASE + 0.06) / 2, 0, ATTIC_HALF * 2, PED_BASE + 0.06 - wingY0, ATTIC_FACE * 2);

  // Pediment projects ~0.85 m past each attic face. A darker tympanum sits on each face so the
  // rake reads as a cornice with a shadow, not a shallow roof fin.
  pediment(b, PED_HALF, PED_BASE, PED_APEX, 8.50, -4.25, 'granite');
  // Tympanum is buried a few centimetres into the rake so the two faces do not share a plane.
  pediment(b, PED_HALF - 0.48, PED_BASE + 0.32, PED_APEX - 0.42, 0.22, 4.16, 'graniteDark');
  pediment(b, PED_HALF - 0.48, PED_BASE + 0.32, PED_APEX - 0.42, 0.22, -4.38, 'graniteDark');
  // Fillet under the overhang. Its top stops short of the pediment soffit.
  slab(b, 'graniteDark', SA, PED_BASE - 0.12, 0, PED_HALF * 2 + 0.15, 0.14, 8.15);
}

function pediment(b, half, y0, y1, depth, z0, mat) {
  const tri = new THREE.Shape();
  tri.moveTo(SA - half, y0);
  tri.lineTo(SA + half, y0);
  tri.lineTo(SA, y1);
  tri.closePath();
  const g = new THREE.ExtrudeGeometry(tri, { depth, bevelEnabled: false, curveSegments: 1 });
  g.translate(0, 0, z0);
  b.put(place(g), mat);
}
