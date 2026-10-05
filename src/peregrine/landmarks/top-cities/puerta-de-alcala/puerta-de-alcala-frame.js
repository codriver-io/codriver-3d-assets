import * as THREE from 'three';

// Plan frame of OSM way 174805987, metres about SPEC.origin.
// +s runs along the facades toward south (bearing 170.4°). +t runs through the arches toward east
// (bearing 80.4°), the direction the inscribed facade faces. +y is up.
// (s, y, t) is left-handed, so the baked matrix has det -1 and place() reverses winding.
export const AX = 0.166980, AZ = 0.985960; // along, world east / south
export const TX = 0.985960, TZ = -0.166980; // through, world east / south
export const YAW = Math.atan2(AX, TX); // box local X → through, local Z → along

export const FRAME = new THREE.Matrix4().set(
  AX, 0, TX, 0,
  0, 1, 0, 0,
  AZ, 0, TZ, 0,
  0, 0, 0, 1,
);

export const SA = -0.05; // architectural centre, shifted a hair south of the vertex centroid
export const HALF_W = 21.15; // outer half-length → 42.30 m (published anchura 43.07; the outline corners are chamfered)
export const WEST = -3.50; // wall faces. Published depth 11.74 m is wall plus the central column projection.
export const EAST = 3.50;
export const DOOR_H = 6.10; // lintelled openings, restoration survey
export const CENTER_HALF = 3.30;
export const PAIR_OUT = 6.05;
export const SIDE_OUT = 11.20;
export const SINGLE_OUT = 13.95;
export const DOOR_OUT = 16.80;
export const SIDE_HALF = (SIDE_OUT - PAIR_OUT) / 2;
export const SIDE_U = (SIDE_OUT + PAIR_OUT) / 2;
// Semicircular arches on one spring. The survey's 9.28 m side opening sat under a tall
// blank belt; the photographed facade puts the central crown just under the architrave.
export const CENTER_CROWN = 13.35;
export const SPRING = CENTER_CROWN - CENTER_HALF; // 10.05
export const SIDE_CROWN = SPRING + SIDE_HALF; // 12.625
export const DOOR_HALF = (DOOR_OUT - SINGLE_OUT) / 2;
export const DOOR_U = (DOOR_OUT + SINGLE_OUT) / 2;
// Pierced wall stops at the architrave. The cornice is a projecting stack on the capitals,
// not a continuation of the blank wall. Cornice at 16.60 leaves the attic + finial at 30% of 23.79.
export const ENTABLATURE = 13.90;
export const BODY_TOP = ENTABLATURE;
export const CAP_TOP = 13.82;
export const CORNICE_TOP = 16.60;
export const SIDE_ATTIC = 18.20;
export const ATTIC_FACE = 3.40; // central attic half-depth; pediment projects past this
export const ATTIC_HALF = 6.15;
export const PED_HALF = 5.15;
export const PED_BASE = 19.72;
export const PED_APEX = 22.62; // rise 2.90 m over 5.15 m, about 29°
export const TIP = 23.79; // sculpture tip, restoration survey

export const PAIR_U = [3.92, 5.44]; // Ionic pair, ~0.4 m of daylight between the shafts
export const SINGLE_U = (SIDE_OUT + SINGLE_OUT) / 2;
export const CORNER_U = (DOOR_OUT + HALF_W) / 2;

export function P(s, y, t) {
  return [s * AX + t * TX, y, s * AZ + t * TZ];
}

// Custom geometry authored in (s, y, t). Boxes use slab() instead.
export function place(g) {
  g.applyMatrix4(FRAME);
  // ExtrudeGeometry is non-indexed. A sequential index lets the det -1 reflection
  // swap winding without rewriting the position buffer.
  if (!g.index) g.setIndex(Array.from({ length: g.attributes.position.count }, (_, i) => i));
  const index = g.index.array;
  for (let i = 0; i < index.length; i += 3) {
    const v = index[i];
    index[i] = index[i + 1];
    index[i + 1] = v;
  }
  g.index.needsUpdate = true;
  g.computeVertexNormals();
  return g;
}

// sizeS along the facade, sizeT through the gate.
export function slab(b, mat, s, y, t, sizeS, sizeY, sizeT) {
  if (sizeS < 1e-4 || sizeY < 1e-4 || sizeT < 1e-4) return;
  b.box(mat, P(s, y, t), [sizeT, sizeY, sizeS], YAW);
}
