// The row's plan, derived from the seven mapped outlines (footprint.js) so the model and the
// footprints that hide the provider's extrusions cannot drift apart. Real metres, +X east,
// +Z south, around SPEC.origin.
//
// Steiner Street's grid is rotated STREET_DEG from north. In the *street frame* the seven OSM
// outlines are axis-aligned rectangles: `u` runs along the street toward the south (the right
// hand of someone facing the fronts), `w` is the outward distance toward the west, i.e. toward
// Alamo Square and the fronts. Each house gets its own right-handed local frame
// (x = u, y up, z = w, origin on its wall plane) and a matrix into model metres.
import * as THREE from 'three';
import { FOOTPRINTS } from './footprint.js';
import { SPEC } from './config.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';

const k = mercStretch(SPEC.origin[1]);
const ox = lngToMercX(SPEC.origin[0]), oz = -latToMercY(SPEC.origin[1]);
/** The mapped rings in local metres [x east, z south], north to south. */
export const RINGS = FOOTPRINTS.map((ring) => ring.map(([lng, lat]) => [(lngToMercX(lng) - ox) / k, (-latToMercY(lat) - oz) / k]));

const phi = SPEC.streetDeg * Math.PI / 180;
/** Unit vector (x, z) along the street toward the south, and the outward (west) normal. */
export const ALONG = [Math.sin(phi), Math.cos(phi)];
export const OUT = [-Math.cos(phi), Math.sin(phi)];
/** Model metres (x, z) -> street frame (u, w). */
export const toStreet = (x, z) => [x * ALONG[0] + z * ALONG[1], x * OUT[0] + z * OUT[1]];
/** Street frame (u, w) -> model metres (x, z). */
export const fromStreet = (u, w) => [u * ALONG[0] + w * OUT[0], u * ALONG[1] + w * OUT[1]];

// The row, north to south (same order as FOOTPRINTS / OSM_WAYS). u0..u1 is the width of the
// front part of each mapped outline, inset 0.05 m (the outlines of 718, 716, 714, 712 and 710
// widen by 0.4-0.9 m behind the front part, toward the neighbour on the south side: the model
// keeps the front width all the way back). `wall` is the street-frame w of the wall plane
// (z = 0 in the house frame); the mapped front line is at w = 8.3 (6.8 for 722, whose mapped
// bays reach 8.3), so the bays and porches stand on the mapped line and the wall plane is
// set back behind it. `back` is the rear wall (the outlines end at w = -7.5 .. -7.8).
export const WALL = 7.2, BACK = -7.45, FRONT_LINE = 8.33;
export const STEP = 0.25; // m the street rises from one house to the next toward the south
export const HOUSES = [
  { number: 722, way: 261412887, u0: -26.04, u1: -17.0, wall: 6.8, back: -8.0, roof: 'hip', body: 'navy' },
  { number: 720, way: 261412899, u0: -16.03, u1: -9.17, wall: WALL, back: BACK, roof: 'gable', body: 'sage' },
  { number: 718, way: 261412879, u0: -9.08, u1: -2.88, wall: WALL, back: BACK, roof: 'gable', body: 'celadon' },
  { number: 716, way: 261412894, u0: -1.89, u1: 4.35, wall: WALL, back: BACK, roof: 'gable', body: 'yellow' },
  { number: 714, way: 261412900, u0: 5.07, u1: 11.52, wall: WALL, back: BACK, roof: 'gable', body: 'rose' },
  { number: 712, way: 261412895, u0: 12.38, u1: 18.86, wall: WALL, back: BACK, roof: 'gable', body: 'blue' },
  { number: 710, way: 261412896, u0: 19.58, u1: 25.85, wall: WALL, back: BACK, roof: 'gable', body: 'cream' },
].map((h, i) => ({ ...h, index: i, yb: i * STEP })); // yb: terrace height of the house's street level above y = 0

/** The house's matrix: house-local (x = u - uc, y, z = w - wall) -> model metres. */
export function houseMatrix(h) {
  const uc = (h.u0 + h.u1) / 2, [px, pz] = fromStreet(uc, h.wall);
  const theta = Math.atan2(OUT[0], OUT[1]); // local +z -> OUT, local +x -> ALONG
  return new THREE.Matrix4().makeRotationY(theta).setPosition(px, 0, pz);
}
export const halfWidth = (h) => (h.u1 - h.u0) / 2;
