// The de Young's plan, in metres in the BUILDING frame: u along the museum's long axis (towards the north-east),
// v across it (towards the south-east, the entrance front). (u, v) = (0, 0) is the origin in config.js. The
// geometry authors in this frame and rotates once (THETA) into +X east / +Z south, so the rotation is baked in.
//   x = u cos(THETA) + v sin(THETA),  z = -u sin(THETA) + v cos(THETA)
// Source: OpenStreetMap relation 1652482 (outline and five courtyard holes), way 444230154 and the eight Hamon
// Tower building:parts (1418750068-73, 1418972816-17), (c) OpenStreetMap contributors, ODbL 1.0.
export const THETA = 41.9 * Math.PI / 180; // measured from the long edges of the mapped outline (bearing 48 deg)

export const ROOF_Y = 13;     // OSM height of the museum (relation tag height=13); the photographs agree within ~1 m
export const SOFFIT_Y = 6;    // underside of the cantilevered upper volume (estimated from the photographs)
export const TOP_Y = 44;      // 144 ft, the Hamon Tower cap

// Roof outline (clockwise on screen as drawn u right, v down). The north-east end carries a small mapped notch
// next to the tower base. The tower overhang is the tower's own.
export const OUTLINE = [
  [-72.5, -37.8], [72.2, -37.8], [72.2, -9.9], [66.4, -9.9], [69.3, -3.3], [72.2, -3.3], [72.2, 38.0], [-72.5, 38.0],
];
export const FRONT_V = 38.0;

// Courtyards cut through the museum (open to the sky; the walls run to the ground). The two OSM holes that share
// an edge (120480157 and 888799028) are one court here.
export const HOLES = [
  [[-6.8, -9.9], [-22, -15.6], [-59.1, -15.1], [-65.3, -15.2], [-61.5, -11.9], [-59.1, -10.6], [-56.9, -9.4]],
  [[63.1, -9.9], [52.2, -10.5], [1.6, -10.3], [34.3, -4], [62.6, -4.1]],
  [[18.6, 7.7], [34.4, 5.1], [42.3, 7.8], [56.4, 12.8], [34.2, 21], [32.1, 20.6], [18.6, 18.3]],
  [[-69.5, 5.5], [-69.5, 21], [-59, 19.1], [-32.9, 14.3], [-25.9, 13], [-59, 7.3]],
];

// The cantilever: the upper volume overhangs a recessed, glazed ground floor on the entrance front.
export const RECESS = { u0: -58, u1: 60, depth: 6 };

// Hamon Tower slabs from OSM (the eight building:parts), bottom to top, as quads of [u, v] corners in the building frame.
// Corners 0->1 and 2->3 are the long faces. The mapped plan is a shear-twist: the two short faces stay parallel to the
// museum (v = -37.8 and -9.9), while the long faces swing from running across the museum (slab 13-18 m) to running
// with the city grid (slab 38-43 m): a ruled, twisting prism of constant plan area (about 254 m2).
export const TOWER_QUADS = [
  [[62.9, -37.8], [63.1, -9.9], [72.2, -9.9], [72.0, -37.9]], // 13-18 m
  [[65.2, -37.8], [62.1, -9.9], [71.3, -9.9], [74.3, -37.8]], // 18-23
  [[67.6, -37.8], [61.2, -9.9], [70.3, -9.9], [76.7, -37.9]], // 23-28
  [[69.8, -37.8], [60.3, -9.9], [69.4, -9.9], [78.9, -37.8]], // 28-33
  [[72.3, -37.8], [59.3, -9.8], [68.5, -9.9], [81.4, -37.8]], // 33-38
  [[74.8, -37.8], [58.3, -9.8], [67.4, -9.9], [83.9, -37.9]], // 38-43
];
export const OBSERVATION_QUAD = [[75.1, -37.4], [59.1, -10.3], [67.2, -10.3], [83.2, -37.5]]; // glazed level (OSM 43-46 m)
export const CAP_QUAD = [[74.6, -38.3], [57.5, -9.3], [67.6, -9.5], [84.6, -38.3]];            // solid copper lid (OSM 46-51 m)
// OSM stacks the tower 13 -> 51 m in six 5 m trunk slabs plus the glazed level and the lid; the published top is
// 144 ft (44 m), and the photographs show a deep lid (about 7 m), so the heights here are re-cut: the six slab
// plans keep their order and spacing, the trunk runs 13 -> 34.5 m (about 3.6 m a storey), the glazed observation
// level 34.5 -> 37 m and the solid lid 37 -> 44 m.
export const TOWER_TRUNK_TOP = 34.5;
export const TOWER_GLASS_TOP = 37;
