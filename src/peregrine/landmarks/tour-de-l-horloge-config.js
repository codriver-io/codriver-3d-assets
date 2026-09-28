// OSM way 161206731 v10 (2023-04-10), retrieved 2026-09-27.
// Mapped data © OpenStreetMap contributors, ODbL 1.0.
// Local ground is the flat rendered quay, NOT sea level or an orthometric datum.
export const TOUR_DE_L_HORLOGE = {
  id: 'tour-de-l-horloge', name: 'Tour de l’Horloge',
  origin: [-73.5457102, 45.5122339], height: 45, turretHeight: 12.8,
  rotationY: -0.20406922434886193, wallBearing: 281.69230528369815,
  towerWidth: 7.5, towerDepth: 6.72, turretStation: -21.12,
  footprint: [
    [-73.5457412,45.5122692],[-73.5456868,45.5122613],[-73.5456488,45.5122558],
    [-73.5456663,45.5121967],[-73.5457716,45.512212],[-73.5457672,45.5122267],
    [-73.5460013,45.5122606],[-73.5459926,45.5122899],[-73.5459495,45.5122836],
    [-73.545956,45.5122618],[-73.5457521,45.5122322],[-73.5457412,45.5122692],
  ],
};

export const HORLOGE_PALETTES = {
  light: { concrete:'#f1eee3', stone:'#b9b2a3', iron:'#233236', paint:'#e5f0ed', roof:'#e3ddca', glass:'#3c4b50' },
  dark: { concrete:'#a9bdcb', stone:'#798a96', iron:'#182b36', paint:'#fff0c7', roof:'#92a9bc', glass:'#293e4a' },
};

// Authoring (u,v) follows the quay; exported coordinates are east/up/south.
export function horlogePoint(u, y, v) {
  const a = TOUR_DE_L_HORLOGE.rotationY, c = Math.cos(a), s = Math.sin(a);
  return [u*c+v*s, y, -u*s+v*c];
}
