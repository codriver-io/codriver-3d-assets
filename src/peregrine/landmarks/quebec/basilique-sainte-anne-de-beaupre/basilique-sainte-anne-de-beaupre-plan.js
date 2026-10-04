import * as THREE from 'three';
import { SPEC } from './config.js';

// Plan and heights of the Basilique Sainte-Anne-de-Beaupré in AXIS coordinates: x lateral (+x toward the viewer's right
// facing the front, i.e. south-east), z along the nave axis (+z toward the south-west front, -z toward the apse), y up.
// The OSM outline (way 104582533), re-expressed in these axes, is a clean plan symmetric about x = 0 (+-0.1 m):
//   front 43.6 m wide between the tower flanks (x +-21.9) and 49.8 m with their side buttresses (x +-24.8), the front at
//   z = 47.2 (pier groups to 48.6), five-aisle nave 41.6 m wide (x +-20.8) from z = 33.6 to z = 5.4, transept and crossing
//   z = 1.2 to -29 (arms to x +-26.4, apsidal ends of 5 m radius at z = -14.5), choir to z = -34.2, apse centre (0, -33.4),
//   seven radiating chapels of 3.4 m radius on a 15.2 m circle round the apse, axial chapel to z = -51.3.
// Heights are metres above the plaza (y = 0). Sourced: spire tips 91 m. The rest is read from photographs
// (docs/3d-quebec-basilique-sainte-anne-de-beaupre.md).
export const PHI = THREE.MathUtils.degToRad(SPEC.rotationDeg); // -55.5 deg

export const FLOOR = 2.2; // church floor, doors and the top of the front stairs
export const FRONT_Z = 47.2; // plane of the tower fronts and the central bay
export const PIER_Z = 48.6; // front of the two pier groups beside the great arch
export const WALL_X = 21.9; // outer face of the tower bases (and of the facade block)
export const TOWER = {
  cx: 16.1, cz: 40.4, z0: 33.6, x0: 10.5, // tower axis; plan of the base block x 10.5..21.9, z 33.6..47.2
  half: 5.1, cornice: 35.0, top: 56.0, tip: 87.6, cross: 91.0, spireR: 4.4, // stage 2 is 10.2 m square, spire tip 87.6, cross tip 91
};
export const NAVE = { hw: 7.4, ais1: 14.2, ais2: 20.8, z0: 5.4, z1: 33.6, clere: 29.5, ridge: 37.5 };
export const AISLE = { wall2: 11.0, roof2: 14.9, wall1: 20.5, roof1: 25.4 }; // outer aisle wall / lean-to top, inner aisle wall / lean-to top
export const TRANSEPT = { x: 26.4, zc: -14.4, hw: 8.6, z0: -23.0, z1: -5.8, apseR: 5.0, apseZ: -14.5, low: 14.8 };
export const CHOIR = { cz: -33.4, apseR: 7.4, ambR: 12.2, chapelRing: 15.2, chapelR: 3.4, ambWall: 11.0, chapelWall: 8.5, zRear: -34.2 };
export const CHAPEL_ANGLES = [25.7, 49.8, 75.5]; // degrees from the axis, both sides
export const AXIAL = { hw: 5.4, z0: -51.3, z1: -44.5, wall: 9.0, ridge: 13.4 };

// authoring (x, y, z) -> model metres east/up/south (the same transform the exporter bakes into the GLB)
export function toWorld(x, y, z) {
  return [x * Math.cos(PHI) + z * Math.sin(PHI), y, -x * Math.sin(PHI) + z * Math.cos(PHI)];
}
export function toAxis(wx, wz) { // model east/south -> authoring (x, z)
  const c = Math.cos(PHI), s = Math.sin(PHI);
  return [wx * c - wz * s, wx * s + wz * c];
}
