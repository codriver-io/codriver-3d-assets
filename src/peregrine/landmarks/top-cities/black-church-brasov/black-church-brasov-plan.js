// Plan of the Black Church in its own frame: +u runs along the nave from the west tower to the apse
// (bearing 72° from true north, the long edges of OSM way/866090448 and way/866090447), +v is 90° clockwise
// (south-south-east), y is up. Every number below was read off the mapped rings (local metres from the
// origin, +x east, +z south) and rotated into this frame; geometry.js rotates the model back once.
export const ALPHA = Math.PI / 10; // 18°: u axis → (cos 18°, −sin 18°) in (x, z)
export const toWorld = (u, y, v) => [u * Math.cos(ALPHA) + v * Math.sin(ALPHA), y, -u * Math.sin(ALPHA) + v * Math.cos(ALPHA)];
export const toLocal = (x, y, z) => [x * Math.cos(ALPHA) - z * Math.sin(ALPHA), y, x * Math.sin(ALPHA) + z * Math.cos(ALPHA)];

export const VC = 0.9; // centre line of the nave (v)
export const NAVE = { u0: -29.6, u1: 21.6, half: 12.4, eave: 22.5, ridge: 41 };
export const CHOIR = { u0: 21.6, u1: 42.7, vc: 1.3, half: 8.6, eave: 21.5, ridge: 37.5 };
export const APSE = { u: 42.7, v: 1.3, r: 8.6, faces: 5 };
// Tower: the SOUTH one of the two west towers that were planned (only it was built above the roof; de.wikipedia
// "Schwarze Kirche (Brașov)"). An 11.2 m square shaft at the south-west corner, 0.3 m proud of the west wall and
// 0.5 m proud of the south wall (clear of the roof's eave overhang), so the west front shows the nave gable to the north of it, as every photograph does.
export const TOWER = { u0: -29.9, u1: -18.7, half: 5.6, shaft: 40, skirt: 46.5, drum: 50, cone: 57.5, spire: 63.6, top: 65 };
TOWER.v = VC + NAVE.half + 0.5 - TOWER.half; // tower centre across the nave: south face 0.5 m proud of the south wall, clear of the eave
// Six nave bays between the west bay and the choir; the 2nd and 3rd carry the cross gables.
export const BAY0 = -17.2;
export const BAY = (NAVE.u1 - TOWER.u1) / 6;
export const NAVE_BAYS = Array.from({ length: 7 }, (_, i) => BAY0 + i * BAY);
export const CROSS = { u0: NAVE_BAYS[1], u1: NAVE_BAYS[3], ridge: 33, depth: 9 };
export const CHOIR_BAYS = [0, 1, 2, 3].map(i => CHOIR.u0 + i * (CHOIR.u1 - CHOIR.u0) / 3);
// Apse polygon vertices (u, v) from the north side round the east to the south side.
export const APSE_PTS = Array.from({ length: APSE.faces + 1 }, (_, i) => {
  const t = Math.PI * i / APSE.faces; // 0 = north (−v), π = south (+v)
  return [APSE.u + APSE.r * Math.sin(t), APSE.v - APSE.r * Math.cos(t)];
});
