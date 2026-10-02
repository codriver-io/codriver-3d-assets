// Plan data for Bankers Hall in local metres around `origin` (+x east, +z south), converted from the OpenStreetMap
// rings in footprint.js with the same Web-Mercator projection the app uses. Derived data © OpenStreetMap
// contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
//
// Each tower is two staggered rectangular blocks. In the tower's own frame (u along the mapped east-west axis, w
// along the mapped north-south axis, both turned 2.4-2.7 degrees clockwise from the compass, with the origin at the
// ring's vertex mean) the mapped ring reduces to: a MAIN rectangle, a NORTH ear that sticks out beyond its north end
// (the east block of the West tower, the west block of the East tower) and a SOUTH ear on the opposite side.
// Every vertex of the mapped ring is within 0.3 m of this reduction (the East tower's 2 m x 1.5 m jog in its south
// wall is the NOTCH; the smaller jogs in the West tower's ring are under 1 m and are not modelled).
export const TOWERS = {
  west: { id: 294875872, c: [-24.83, 6.0], deg: 2.41, main: { u: [-18.93, 15.85], w: [-35.07, 18.47] }, north: { u: [1.36, 15.85], w: [-41.17, -35.07] }, south: { u: [-18.93, -2.84], w: [18.47, 24.83] } },
  east: { id: 807001350, c: [42.77, 15.51], deg: 2.4, main: { u: [-20.88, 13.85], w: [-32.16, 21.3] }, north: { u: [-20.88, -5.72], w: [-39.2, -32.16] }, south: { u: [-1.83, 13.85], w: [21.3, 27.2] }, notch: { u: [-3.85, -1.83], w: [19.78, 21.3] } },
};
// Mapped rings, [x, z] in local metres.
export const COMPLEX = [[-56.05, 9.7], [-52.81, 9.83], [-54.22, 38.35], [-30.2, 39.53], [-29.77, 30.65], [-28.7, 30.45], [-28.65, 29.14], [-27.07, 29.21], [-27.6, 39.71], [-2.47, 40.91], [-2.5, 40.48], [9.17, 40.82], [37.7, 42.49], [38.03, 36.7], [38.09, 35.17], [40.1, 35.13], [39.81, 42.59], [47.76, 42.94], [55.27, 43.27], [56.05, 28.69], [56.79, 14.69], [57.89, -16.06], [47.26, -16.53], [47.82, -40.06], [37.17, -39.87], [8.78, -41.05], [-31.82, -42.74], [-53.83, -43.65], [-54.58, -25.67], [-55.33, -7.56]];
export const TOWER_RINGS = { west: [[-42.26, -29.83], [-22, -28.98], [-21.74, -35.07], [-7.26, -34.46], [-9.75, 24.67], [-9.77, 25.12], [-28.44, 24.33], [-28.65, 29.14], [-28.7, 30.45], [-29.77, 30.65], [-44.79, 30.01]], east: [[57.89, -16.06], [47.26, -16.53], [38.39, -16.84], [38.71, -23.89], [23.68, -24.51], [20.9, 35.83], [38.03, 36.7], [38.09, 35.17], [40.1, 35.13], [39.81, 42.59], [47.76, 42.94], [55.27, 43.27], [56.05, 28.69], [56.79, 14.69]] };
// Neighbouring buildings that share a wall with the complex and stay provider geometry (drawn by the map): the
// model never draws a wall where one of them is already taller, so the two cannot flicker. Heights from
// building:levels (estimated at about 4 m a level; the 26-level Royal Bank part about 100 m).
export const NEIGHBOURS = [
  { id: 1557739181, h: 13.5, ring: [[-64.93, -44.35], [-65.73, -26.16], [-54.58, -25.67], [-53.83, -43.65]] }, // Royal Bank Building, 3-level north part
  { id: 1557739182, h: 13.5, ring: [[-67.43, 9.61], [-56.05, 9.70], [-55.33, -7.56], [-66.64, -8.07]] }, // Royal Bank Building, 3-level west part
  { id: 1557739180, h: 100, ring: [[-64.93, -44.35], [-65.73, -26.16], [-54.58, -25.67], [-55.33, -7.56], [-66.64, -8.07], [-67.43, 9.61], [-67.46, 10.26], [-85.87, 9.41], [-85.71, 5.66], [-83.35, -45.20]] }, // Royal Bank Building, 26-level part
  { id: 548390398, h: 24, ring: [[47.26, -16.53], [47.82, -40.06], [59.45, -39.08], [68.50, -38.83], [70.83, -36.99], [68.45, 4.55], [67.73, 15.11], [56.79, 14.69], [57.89, -16.06]] }, // Hollinsworth Building, 6 levels
];
export const PODIUM = {
  p4: [[-56.05, 9.7], [-52.81, 9.83], [-43.86, 10.2], [-42.26, -29.83], [-22, -28.98], [-21.74, -35.07], [-7.26, -34.46], [-9.75, 24.67], [-4.99, 24.87], [-4.98, 24.55], [-1.84, 24.68], [-2.5, 40.48], [37.7, 42.49], [38.03, 36.7], [20.9, 35.83], [23.68, -24.51], [38.71, -23.89], [38.39, -16.84], [47.26, -16.53], [47.82, -40.06], [37.17, -39.87], [8.78, -41.05], [-31.82, -42.74], [-53.83, -43.65], [-54.58, -25.67], [-55.33, -7.56]], // building:part levels=4
  p5: [[-27.6, 39.71], [-27.07, 29.21], [-28.65, 29.14], [-28.44, 24.33], [-9.77, 25.12], [-9.75, 24.67], [-4.99, 24.87], [-4.98, 24.55], [-1.84, 24.68], [-2.5, 40.48], [-2.47, 40.91]], // levels=5, flat roof (south entrance)
  roof: [[-30.2, 39.53], [-54.22, 38.35], [-52.81, 9.83], [-43.86, 10.2], [-44.69, 29.91], [-29.77, 30.65]], // levels=3, layer=1 (south-west wing)
};
