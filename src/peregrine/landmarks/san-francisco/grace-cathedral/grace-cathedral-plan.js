import * as THREE from 'three';
import { SPEC } from './config.js';

// Plan and heights of Grace Cathedral in AXIS coordinates: x lateral (+x toward the north side, the viewer's
// right facing the front), z along the nave axis (+z toward the Taylor Street front, -z toward the apse), y up.
// The OSM outline (way 32946942), re-expressed in these axes, is a clean rectilinear plan:
//   front 26.8 m wide (x +-13.4), towers 8.2 x 10.8 m with the 10.3 m central bay between them, portal 1.8 m proud,
//   nave and aisles z -12.1..29.7, transepts z -25.0..-12.1 (43.4 m across), choir 17.6 m wide to z -42, apse to -53.4.
// Heights are metres above Taylor Street (y = 0). Sourced: towers 53, flèche 75, floor/doors 6.1. The rest is read
// from photographs (docs/3d-san-francisco-grace-cathedral.md).
export const AXIS_SKEW_DEG = 8.8; // mapped axis, degrees north of east
export const AXIS_SHIFT_X = 1.65; // the nave axis runs 1.65 m off the OSM centroid (x_a = -(w + 1.65))
export const PHI = THREE.MathUtils.degToRad(SPEC.rotationDeg);

export const FRONT_Z = 40.5; // tower fronts / outline
export const PORTAL_Z = 42.3; // the mapped porch line; the modelled canopy stands 1.1 m further out (PORCH_Z)
export const PORCH_Z = 43.4;
export const TOWER = { cx: 9.25, x0: 5.15, x1: 13.35, z0: 29.7, z1: 40.5, h: 53.0 };
export const NAVE = { x: 13.35, z0: -12.1, z1: 29.7, aisleWall: 12.2, clearX: 7.7, aisleTop: 24.5, eave: 34.5, ridge: 43.5 };
export const TRANSEPT = { x: 21.4, z0: -25.0, z1: -12.1, eave: 32.5, ridge: 41.5 };
export const CHOIR = { x: 8.8, z0: -42.0, z1: -25.0, top: 28.5, eave: 29.0, ridge: 37.0 };
export const APSE = { rx: 8.8, rz: 11.4, zc: -42.0 };
export const CROSSING_Z = -18.55; // centre of the transept span
export const FLECHE_AT = { x: 0.3, z: -20.4 }; // OSM building:part way 939433955 (height 75), about 3.3 m across
export const FLECHE_TIP = 75.0;
export const ENTRY_Y = 6.1; // church floor, doors and the top of the Great Stairs

// authoring (x, y, z) -> model metres east/up/south (the same transform the exporter bakes into the GLB)
export function toWorld(x, y, z) {
  const X = x + AXIS_SHIFT_X;
  return [X * Math.cos(PHI) + z * Math.sin(PHI), y, -X * Math.sin(PHI) + z * Math.cos(PHI)];
}
export function toAxis(wx, wz) { // model east/south -> authoring (x, z)
  const c = Math.cos(PHI), s = Math.sin(PHI);
  return [wx * c - wz * s - AXIS_SHIFT_X, wx * s + wz * c];
}
