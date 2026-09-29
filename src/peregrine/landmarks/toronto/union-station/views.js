// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south).
// Each value is [eye, target]. Keys used by the catalog record's inspection views.
// The facade runs along Front Street at 73.65 degrees true; `w(u, y, v)` places a point in the
// facade frame (u along the street, v away from it) so the views stay square to the building.
const beta = 73.65 * Math.PI / 180, s = Math.sin(beta), c = Math.cos(beta);
const w = (u, y, v) => [+(u * s + v * c).toFixed(1), y, +(-u * c + v * s).toFixed(1)];

export const VIEWS = {
  overview: [w(-140, 95, -170), w(0, 12, 20)],
  facade: [w(-10, 9, -120), w(0, 11, -20)],
  roof: [w(-70, 75, 90), w(0, 22, 5)],
  structure: [w(150, 35, 90), w(20, 10, 40)],
  colonnade: [w(-45, 5, -58), w(-22, 10, -20)],
  pavilion: [w(-150, 15, -60), w(-108, 10, -14)],
  shed: [w(-50, 60, 200), w(0, 6, 90)],
};
