// Shared dimensions and the bridge frame for the Lefty O'Doul (Third Street) Bridge, so the geometry,
// the inspector cameras and the tests agree on one set of numbers.
//
// Frame. The model is authored in the bridge's own coordinates and turned once onto the mapped axis:
//   B  metres along the axis, 0 at the middle of the movable leaf, positive toward the NORTH-NORTH-WEST
//      end (the ballpark end, where the heel tower and the counterweights stand);
//   y  metres above the provider's Third Street pavement (= local flat-map grade, y = 0);
//   V  metres across the axis from the centre line of the roadway, positive toward the east-north-east
//      (the Oracle Park / Bay side), negative toward the west.
// The axis bearing (towards +B) comes from the mapped OSM carriageway and sidewalk ways (327.4 to
// 327.6 degrees); the model's origin sits on the centre line, B0 metres from the leaf centre, so the
// pad is centred on the whole structure rather than on the leaf.
export const BEARING = 327.5; // degrees clockwise from north, toward +B
export const B0 = 8.0; // origin offset along the axis from the leaf centre (middle of the structure)
export const YAW = (90 - BEARING) * Math.PI / 180; // rotation about +Y that carries +B onto the bearing

// Bridge coordinate (B, y, V) -> scene metres (x east, y up, z south), relative to SPEC.origin.
export function toScene(b, y, v) {
  const u = b - B0, c = Math.cos(YAW), s = Math.sin(YAW);
  return [u * c + v * s, y, -u * s + v * c];
}
// Scene point -> bridge coordinate, the inverse of toScene.
export function toBridge(x, y, z) {
  const c = Math.cos(YAW), s = Math.sin(YAW);
  return { b: x * c - z * s + B0, y, v: x * s + z * c };
}

// Sourced: 295 ft overall, 143 ft movable leaf, 81 ft wide overall, 71.5 ft roadway (HistoricBridges /
// SF Landmark #194 notes), mapped outline (OSM way 1088314479: leaf 44.6 m, 24.5 m wide).
// Everything else is read from photographs (see docs/3d-san-francisco-lefty-odoul-bridge.md).
export const DIM = {
  leafHalf: 22.3, // leaf toe at B = -22.3, heel at +22.3 (OSM outline 44.6 m; published 143 ft = 43.6 m)
  trussE: 10.2, // centre of the east truss and its heel frame (the Oracle Park side)
  trussW: -6.7, // centre of the west truss and its heel frame. The roadway is cantilevered out beyond this line (HistoricBridges), so the westernmost lane (OSM centre line V -9.1) runs just outside it: its low steel (shoe plates, 1.4 m wide) stops at V -7.4, the lane's inner edge for 3.3 m lanes
  railV: 12.3, // outer edge of each sidewalk: the black pipe railing
  topChordY: 8.8, // centre line of the leaf's top chord above the road
  apex: { b: 26.0, y: 22.8 }, // leaf trunnion knuckle at the head of the heel frame
  towerB: 39.0, // heel tower column
  tailEndB: 52.5, // end of the counterweight tail (outline of the mapped bridge)
  block: { b0: 44.8, b1: 52.4, y0: 6.3, y1: 17.6, thick: 3.6 }, // each concrete counterweight, hung just inboard of its frame
  lanes: [[-9.1, 1.65], [-2.45, 3.3], [3.6, 1.65], [7.75, 1.65]], // mapped lane / cycle-track centre lines (OSM ways 674496104, 1006830791, 27656674, 834052363) and half widths (3.3 m lanes; the two-lane way has two)
  roadClear: 5.4, // minimum clear height over the carriageway: nothing structural below this between the trusses
};
