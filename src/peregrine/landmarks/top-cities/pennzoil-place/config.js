// Pennzoil Place, Houston. Two 36-storey trapezoidal towers (Johnson/Burgee, 1975)
// on the block bounded by Louisiana, Milam, Capitol and Rusk. Heights and the
// ten-foot slot are the published figures; the plan rings are the mapped parts.
// Contract: docs/3d-top-cities-landmarks.md.
export const SPEC = {
  id: 'pennzoil-place',
  name: 'Pennzoil Place',
  kind: 'building',
  ready: true,
  // Centroid of OSM way 580965929 (the complex outline), mercator metres.
  origin: [-95.3656194, 29.7601240],
  height: 159.41, // 523 ft roof, Hines / Wikipedia infobox
  padM: 85,
  // Outward normal of the Louisiana Street face (711 Louisiana, south tower).
  frontageBearing: 214.6,
};

// Day colours are the bronze curtain wall in sun (OSM building:colour #52503C,
// darkened to the smoked glass in the street photos). Night dims the bronze and
// lets the `light` panes carry the warm office glow. `light` is unshaded.
export const PALETTES = {
  light: {
    glass: '#3c3832',
    mullion: '#161411',
    light: '#a88858',
    lobby: '#6a736c',
    atrium: '#8ea3ad',
    frame: '#f2f5f6',
  },
  dark: {
    glass: '#241f1b',
    mullion: '#0c0b0a',
    light: '#ffd7a1',
    lobby: '#3a4440',
    atrium: '#8ea3ab',
    frame: '#c9d3d8',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Ridge 523 ft (159.41 m). Each tower is the mapped trapezoid with a 45° skillion from that ridge down to the slot. The clear throat is opened from the mapped ~2.2 m to the published 10 ft (3.05 m). Atrium pyramids peak at the published 115 ft (35.05 m). Mullions are paired to a 5 ft bay (the curtain wall is 2.5 ft). Downtown grade is flat; no terrain pad.',
};
