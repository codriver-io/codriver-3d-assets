// Plan of the Hôtel du Parlement in the model's building frame: x runs along the main (north-east) front toward the viewer's right,
// z runs out of that front (toward the Fontaine de Tourny, compass bearing 48.9), y is up, and (0, 0) is the area centroid of the mapped
// outer ring (SPEC.origin). `angle` is the rotateY that turns this frame onto east/up/south: +z (the front) lands on bearing 48.9.
//
// Plan numbers are read from the mapped ring and its courtyard hole (relation 196002, converted to this frame: the front edge runs
// x = -46.6 .. 46.6 at z = 45.8, the back z = -46 .. -45.3 with a 14 m rear projection to -47.2, the sides |x| = 46.0 .. 46.8; the
// courtyard is x -30 .. 30.5, z -31 .. 27 around a central T-shaped body). The model's walls stand 0.6-1.5 m inside that ring so
// every cornice stays within it. Heights come from photographs (see the docs); only the tower is sourced (52.4 m).
export const PLAN = {
  angle: (180 - 48.9) * Math.PI / 180,
  bearing: 48.9,
  // wall planes: wings, pavilions / central block, tower; sides; back
  zW: 43.0, zP: 44.0, zT: 44.9,
  xW: 44.8, xP: 45.6,
  zBW: -44.2, zBP: -44.9, zRear: -45.9, rear: [-7, 7],
  court: { x0: -30.0, x1: 30.2, z0: -30.8, z1: 27.4 },
  pavIn: 32.4,                       // inner edge of the four corner pavilions (|x|)
  block: { x0: -14.5, x1: 14.5 },    // the projecting central frontispiece under the tower
  tower: { x0: -5.5, x1: 5.5, z0: 34.1 },   // 11.0 m wide and 10.8 m deep (was 9.6 x 9.3 m, 15 % too slim on the obliques; a frontal check against the photograph reads the shaft at about 10.6 m)
  body: { x0: -13.9, x1: 14.9, z0: -12.4, z1: 11.0 }, // the central chamber body in the courtyard (OSM notch)
  stem: { x0: -4.8, x1: 6.5, z0: 11.0, z1: 28.4 },
  // heights
  plinth: 1.2,
  s1: 5.7, s2: 11.4, frieze: 16.9,   // string courses (bottom of each)
  corniceW: 19.2, deckW: 22.8,       // wing cornice top, mansard deck
  corniceB: 23.0,                    // central block cornice top
  corniceP: 25.6, breakP: 31.0, topP: 32.8, mastP: 38.4, // pavilions: cornice, mansard break, ridge, mast tip
  bodyTop: 17.0,
  tower_: { cornice1: 24.4, belfry: 34.2, shaftTop: 44.1, apex: 52.4, crest: 57.0, pole: 64.8 },
};
