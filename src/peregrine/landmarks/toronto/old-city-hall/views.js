// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south).
// Each value is [eye, target]. Keys used by the catalog record's inspection views.
// Bearings are compass bearings of the direction the camera looks FROM the model
// toward the eye: 163 is in front of the Queen St facade, 343 behind (Albert St),
// 253 is Bay St (west), 73 is James St (east). The clock tower stands at about (8, 43).
const eye = (bearing, dist, y, [tx, ty, tz]) => {
  const a = (bearing * Math.PI) / 180;
  return [[Math.round(tx + dist * Math.sin(a)), y, Math.round(tz - dist * Math.cos(a))], [tx, ty, tz]];
};
export const VIEWS = {
  overview: eye(205, 175, 80, [0, 32, 0]),
  facade: eye(163, 135, 26, [0, 38, 0]),
  roof: eye(163, 55, 165, [0, 26, 0]),
  structure: eye(253, 120, 42, [0, 38, 0]),
  tower: eye(163, 60, 66, [8, 80, 43]),
  clock: eye(163, 30, 86, [8, 84, 43]),
  porch: eye(163, 28, 6, [20, 9, 39]),
  back: eye(343, 140, 55, [0, 34, 0]),
};
