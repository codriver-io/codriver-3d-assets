// Plan of San Francisco City Hall in building axes: x = depth (+x toward the Polk Street front,
// bearing 80.9), z = along the front (+z toward Grove/McAllister, bearing 170.9), origin at the
// centroid of the mapped outline. Numbers are read from OSM relation 7261820 (outer way 494810795).
export const PLAN = {
  planeE: 43.55, // Polk Street wing plane (the front)
  planeW: -42.65, // Van Ness Avenue wing plane
  centerX: 0.45, // middle of the two wing planes
  planeN: 61.5, // McAllister/Grove wing plane at the middle of the long sides (z = -planeN is north)
  endZ: 59.1, // where the end pavilions of the E/W fronts end
  cornerZ: 60.2, // the wing plane runs on to here before the mapped corner notch
  dome: [0.4, 0.4], // centre of the mapped rotunda parts (OSM way 494810785)
  centralHalf: 15.6, // half width of the central pavilions on the E and W fronts
  endFrom: 48.2, // end pavilions of the E/W fronts span endFrom..endZ
  sideInner: 22.4, // N/S front: wing plane for |s| < sideInner, pavilions for sideInner..sidePavTo
  sidePavTo: 39.6,
  sideEnd: 43.1,
  bay: 4.07, // column spacing of the wing colonnades, as photographed
};

// Storey heights above local grade (estimated from photographs, wing parapet about 26 m).
export const LEVELS = {
  base: 6.5, // rusticated storey
  colTop: 20.9, // top of the wing columns
  cornice: 23.4, // top of the entablature
  parapet: 26.0, // wing parapet
  pavColTop: 23.6, // central pavilion columns
  pavCornice: 28.8, // central pavilion entablature and attic
  pediment: 4.5, // central pediment rise (apex 33.3 m)
  spineEave: 31.0, // eave of the roof spine behind the pediments
  spineRise: 4.4,
};
