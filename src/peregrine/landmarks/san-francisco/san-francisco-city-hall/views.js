// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south).
// The Polk Street front looks toward bearing 80.9 (ENE), Van Ness Avenue is the rear (260.9),
// Grove Street is the north side (350.9) and McAllister Street the south side (170.9).
// `eye(bearing, distance, height, target)` places the camera that far toward `bearing` from the target.
const eye = (bearing, dist, y, [tx, ty, tz]) => {
  const a = (bearing * Math.PI) / 180;
  return [[Math.round(tx + dist * Math.sin(a)), y, Math.round(tz - dist * Math.cos(a))], [tx, ty, tz]];
};
export const VIEWS = {
  overview: eye(118, 230, 85, [0, 40, 0]),
  facade: eye(81, 175, 22, [0, 36, 0]),
  roof: eye(81, 70, 150, [0, 40, 0]),
  dome: eye(81, 105, 62, [0, 70, 0]),
  portico: eye(81, 105, 9, [43, 16, -6]),
  colonnade: eye(55, 62, 9, [47, 14, 25]),
  rear: eye(261, 175, 22, [0, 36, 0]),
  side: eye(171, 160, 30, [0, 38, 0]),
};
