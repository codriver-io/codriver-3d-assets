// Oracle Park, 24 Willie Mays Plaza, San Francisco: home of the Giants (HOK, 2000). Open-air
// ballpark with a red-brick street facade, a seating bowl wrapped round home plate, six
// lattice floodlight frames, the centre-field scoreboard, the arched right-field arcade on
// McCovey Cove and, beyond left field, the Coca-Cola bottle and the four-fingered glove.
// Sourced: footprint and part outlines from OpenStreetMap (way 24352572, relation 7330762, parts
// 499568642-52), light-frame heights 62-70 m and bowl rim from the mapped building:part heights,
// 24 ft right-field wall, 80 ft bottle, 309 ft / 399 ft foul pole and centre-field distances.
// Estimated: facade heights, tier profile, window rhythm, tower heights. See docs/3d-san-francisco-oracle-park.md.
export const SPEC = {
  id: 'oracle-park', name: 'Oracle Park', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  origin: [-122.3895, 37.77855], // centre of the mapped stadium ring (bounding-box middle)
  height: 70, // m: the tallest light frames (OSM building:part height=70)
  padM: 150,
  frontageBearing: 305, // the Willie Mays Plaza entrance faces north-west; the field axis runs 86 degrees
};
export const PALETTES = {
  light: {
    brick: '#9b4e3d', stone: '#cdbfa3', concrete: '#b4b0a3', seat: '#2b6a4b', steel: '#3a4d46', glass: '#2c3a45',
    copper: '#4f9680', grass: '#4f9a3f', clay: '#b36b42', light: '#f1f3e8', glow: '#26303c', sign: '#ee5a22', roof: '#85867f',
  },
  dark: {
    brick: '#5e3a36', stone: '#8a8272', concrete: '#6c6e72', seat: '#1f4636', steel: '#33423e', glass: '#17232e',
    copper: '#33695a', grass: '#2d5a2a', clay: '#6e4631', light: '#fff1c4', glow: '#9cc4ff', sign: '#ff7a38', roof: '#505257',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 is street/concourse level at the ballpark; the playing field is drawn at y=0.1 on the same datum (its real few-metre drop below the concourse is not modelled). No absolute altitude, terrain or latitude stretch is baked in.',
  attribution: 'Original procedural mesh. Mapped footprint and part outlines © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Seating is stepped terraces, not seats. Wall heights, tier profile, window rhythm, tower heights and the shape of the bottle and glove are estimated from photographs; the plan, the 62-70 m light frames and the field outline are mapped. The mapped field opening is a hole in the provider extrusion and is not drawn as a roof.',
};
