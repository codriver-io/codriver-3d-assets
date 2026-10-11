// Édifice Marie-Guyart: the plan in the model frame (+X east, +Z south, metres from SPEC.origin).
// Two plan grids, both fitted to the mapped edges (length-weighted): the tower (OSM way 27372377) runs 60.74 degrees east of north, the base wings
// (ways 1495832341, -44, -48 and the outline 38947693) 60.14 degrees. In each grid u runs along that bearing and v 90 degrees clockwise of it
// (v points toward 150 degrees, south-south-east). Rectangles are the mapped outlines with jogs under about a metre merged.

export const TOWER = {
  bearing: 60.74,
  u0: -21.2, u1: 20.8, v0: -24.0, v1: 23.1, // 42.0 m by 47.1 m (mapped: 42.1 by 47.2, 1989 m2 including its jogs)
  roof: 132,       // the piers and the crown band stand on the mapped envelope; OSM height=132, Wikipedia roof 132 m
  ground: 5.4,     // the glazed ground storey, set back under the upper storeys (RPCQ: "entierement vitre, dispose en retrait")
  floors: 30,      // 30 office floors over the ground storey: the 31 levels of OSM building:levels=31
  pitch: 4.16,     // 5.4 + 30 x 4.16 = 130.2 m, then the 1.8 m crown band (estimated from the photographs)
  lobby: 3.5,      // set-back of the glazed ground storey behind the corner piers (2.5 m behind the window frames above it)
  recess: 0.6,     // the window field is set this far behind the window frames
  pier: 1.0,       // the window frames, ribbons and field are set this far behind the corner piers and the crown band (the shafts stand 1 m proud)
  corner: 6.0,     // width of each corner pier (the plain, windowless, braced mechanical shafts) along the face
  capH: 1.5,       // the four corner piers stand this far above the roof
};

// All four faces carry the same grid (RPCQ: "sur les quatre elevations, ... l'alternance des fenetres en bandeaux et des panneaux rectangulaires de beton prefabrique
// legerement saillants"): above each floor line a continuous ribbon of glass, over it a row of square windows set in protruding precast frames. The
// narrow slots seen on the side faces in oblique photographs are the same square windows at a grazing angle.

export const BASE_BEARING = 60.14;
export const WING_H = 15.6; // 4 levels: a 4.8 m ground storey and three of 3.6 m (estimated)
export const CORE_H = 19.2; // 5 levels (the stair and plant cores)
export const WING_FLOORS = [4.8, 8.4, 12.0];

// [u0, u1, v0, v1] in the base grid from the tower centroid. Each is a flat-roofed box from y = 0 and the boxes only touch.
export const WINGS = [
  { id: 'south', rect: [-30.5, 107.4, 54.3, 81.6], h: WING_H, way: 1495832341 },  // the long wing, 138 m by 27 m
  { id: 'east', rect: [75.2, 103.1, -15.6, 48.2], h: WING_H, way: 1495832344 },
  { id: 'north', rect: [52.2, 105.5, -39.9, -21.6], h: WING_H, way: 1495832348 },
  { id: 'core-sw', rect: [-36.8, -30.5, 56.7, 78.2], h: CORE_H, way: 1495832340 },
  { id: 'core-se', rect: [107.4, 113.3, 56.8, 78.6], h: CORE_H, way: 1495832342 },
  { id: 'core-link', rect: [76.3, 98.7, 48.2, 54.3], h: CORE_H, way: 1495832343 },
  { id: 'core-ne', rect: [77.7, 99.9, -21.6, -15.6], h: CORE_H, way: 1495832345 },
  { id: 'core-n-east', rect: [105.5, 109.4, -36.0, -23.6], h: CORE_H, way: 1495832346 },
  { id: 'core-n-west', rect: [48.3, 52.2, -35.7, -23.4], h: CORE_H, way: 1495832347 },
];
