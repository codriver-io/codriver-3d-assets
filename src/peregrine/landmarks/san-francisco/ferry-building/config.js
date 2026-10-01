// San Francisco Ferry Building, 1 Ferry Building, The Embarcadero at the foot of Market Street.
// A. Page Brown, 1892-1898 (Beaux-Arts, 245 ft clock tower), restored 2002. Original procedural
// model; see docs/3d-san-francisco-ferry-building.md for sources, the dimension table and what is
// estimated. Contract: docs/3d-san-francisco-landmarks.md.
export const SPEC = {
  id: 'ferry-building', name: 'Ferry Building', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // Anchor: the middle of the mapped 201.6 x 47.2 m rectangle (OSM way 558731934), on the long
  // axis halfway between the two ends and on the centre line between the city and bay walls.
  origin: [-122.3934298, 37.7955383],
  // Highest point: the flagpole above the cupola. Wikipedia and the Port of San Francisco give the
  // tower as 245 ft (75 m); OSM maps the lantern at 68.2 m, the dome at 70 m and the pole at 83.1 m,
  // photographs give about 75 m to the pole top. Local grade y = 0 is the Embarcadero plaza
  // (OSM ele=1: no relief is baked in).
  height: 75,
  // Disc round the origin that Full 3D world flattens: the farthest corner of the block, the pavilion
  // corner and the bay-side walkway are 104 m out.
  padM: 108,
  // Bearing the city front (the Market Street pavilion) faces: west-south-west.
  frontageBearing: 233.8,
  // Bearing of the long axis, +u, toward the north-north-west end (the Embarcadero), measured from the
  // 100 m long edges of the OSM outline (323.8 degrees, the edges agree to 0.1 m over 100 m).
  axisBearing: 323.8,
};

// Same keys in light and dark. Dark is the night look: dimmer stone, warm lit windows, the clock faces,
// the tower floodlit, the "PORT OF SAN FRANCISCO" sign in red neon. `glow`, `lamp`, `light` and `sign` are drawn
// unshaded by the layer: `lamp` is the belfry and lantern void (dark by day, lit warm at night), `sign` the dark roof letters by day.
export const PALETTES = {
  light: {
    stone: '#a9b5bb', pale: '#e4e5df', base: '#8a9298', roof: '#5c605e', glass: '#4b5b63',
    glow: '#667a84', lamp: '#23292c', light: '#f3eddb', copper: '#8a7458', metal: '#383e41', sign: '#2b3033',
  },
  dark: {
    stone: '#6a7480', pale: '#e6dcc0', base: '#4b5258', roof: '#35393b', glass: '#2a363d',
    glow: '#ffd68a', lamp: '#ffd68a', light: '#ffe6a6', copper: '#5e5242', metal: '#22282b', sign: '#ff4634',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 is the Embarcadero plaza on the flat Peregrine basemap; no absolute altitude (OSM ele=1 m), no relief, no Mercator scale. The bay-side walkway and the building stand on the same datum.',
  attribution: 'Original procedural mesh. Mapped footprint, orientation and tower plan © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Plan, bearing (323.8 degrees), pavilion projection and tower position come from the mapped OSM outline; the 16.1 m pavilion and the 245 ft tower are sourced (OSM, Wikipedia). The storey heights, wing window sizes, the stepped tower stage heights (photograph proportions scaled to 75 m), roof profile, bay-side glazing and the Port of San Francisco sign are estimates from photographs. Interior, ferry gates and the piers behind the building are not modelled.',
};
