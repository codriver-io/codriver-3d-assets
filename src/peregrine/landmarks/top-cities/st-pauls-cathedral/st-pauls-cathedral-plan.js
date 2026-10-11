// St Paul's Cathedral, Ludgate Hill. Building axes, metres: +u toward the apse (east along the
// nave), +v toward the south transept, +y up. The mapped nave axis bears 83.8° (OSM tower
// midpoints to the dome centroid), so a +6.2° yaw takes building axes onto east/up/south.
//
// Sourced (Wikipedia specifications, which match the 1911 Britannica within a foot, and the
// OSM building:part stack): 365 ft to the cross, 278 ft outer dome, 221 ft towers, 518 ft
// length, 121 ft nave width, 246 ft across the transepts, outer dome diameter cited as 112 ft.
// The plan positions below are the mapped outline (way 369161987) and its parts, in this frame.

export const AXIS_DEG = 83.8;
export const ROTATION_DEG = 90 - AXIS_DEG;

const ROT = (ROTATION_DEG * Math.PI) / 180;
const COS = Math.cos(ROT), SIN = Math.sin(ROT);

/** Building (u, y, v) → model metres (east, up, south). */
export function toWorld(u, y, v) {
  return [u * COS + v * SIN, y, -u * SIN + v * COS];
}

export const H = {
  cross: 111.25, // 365 ft × 0.3048
  domeCrown: 84.73, // 278 ft, top of the outer dome at the lantern
  tower: 67.36, // 221 ft to the pineapple
  wall: 33.4, // two-storey screen; OSM building height 35 is the cornice
  cornice: 34.9,
  step: 1.7,
};

// Dome ellipse: widest at the springing, neck (lantern) at the published crown.
export const DOME = {
  spring: 66.2,
  radius: 16.7,
  rise: 19.2,
  neck: 4.4,
  // colonnade, from the OSM peristyle ring (±20.8 m) and the drum photo
  columnR: 19.7,
  columnN: 32,
  galleryR: 20.5,
};

export function domePoint(t) {
  return { r: DOME.radius * Math.cos(t), y: DOME.spring + DOME.rise * Math.sin(t) };
}
export function domeTAtNeck() {
  return Math.acos(DOME.neck / DOME.radius);
}

export const PLAN = {
  naveHalf: 17.7, // outline pinches to 18.1 m on the choir's north wall; published width is 18.5 m
  spineHalf: 8.7,
  // west towers, OSM footprints ~14 m square
  towerU: -77.5,
  towerV: 20.5,
  towerHalf: 5.8, // west face stays east of the outline, which cuts the tower at u −83.6
  westWall: -82.2, // back wall of the portico
  westTip: -86.0, // steps, the outline's west tip
  eastSpine: 61.4,
  apseU: 61.2,
  apseR: 7.6, // chord corners of the faceted apse stay west of the outline tip (~u 69.6)
  // transept arm ends where the semicircular portico begins
  armV: 32.2,
  porchV: 30.6,
  porchR: 7.7,
};

// Paired columns of the two-storey west portico (Wren, after Mansart's Val-de-Grâce).
// Pair centres along +v (south). Lower order spans the aisle width; upper order the nave.
export const WEST_PAIRS = {
  lower: [-11.6, -7.0, -2.4, 2.4, 7.0, 11.6],
  upper: [-6.6, -2.2, 2.2, 6.6],
  gap: 0.48, // columns in a pair nearly touch; the bay between pairs is several times wider
};
