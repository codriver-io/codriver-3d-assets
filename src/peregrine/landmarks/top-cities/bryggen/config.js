// Bryggen, Bergen. The Hanseatic wharf on the east side of Vågen: the front row of
// gabled wooden tenements a driver sees from the quay. Contract: docs/3d-top-cities-landmarks.md.
export const SPEC = {
  id: 'bryggen',
  name: 'Bryggen',
  kind: 'building',
  ready: true,
  // Placement origin: mercator centroid of the original fourteen quay fronts.
  // The two restored tenements sit inside that span, so the origin is unchanged.
  origin: [5.323184, 60.397329],
  height: 16.25, // tallest ridge is the OSM 16 m houses; a ridge cap adds about 0.12 m
  padM: 90, // the row is ~130 m along the quay and the quay itself is flat
  // Compass bearing of the gable faces, toward the harbour (Vågen), not inland.
  frontageBearing: 219.1,
};
// Day colours are the painted wood and tile as they read in sun. Night dims the
// timber and keeps shop glass and a scatter of upper windows warm (glow is unshaded).
export const PALETTES = {
  light: {
    red: '#8e2a24',
    ochre: '#d4922c',
    pink: '#c45d6c',
    white: '#f3f0e6',
    brown: '#5c2a22',
    roof: '#7a3b2a',
    roofDark: '#3c3834',
    trim: '#b7b8a4',
    timber: '#3a2a22',
    glass: '#3d5158',
    glow: '#f0c98a',
  },
  dark: {
    red: '#5a1c18',
    ochre: '#8a5c1c',
    pink: '#7d4450',
    white: '#969288',
    brown: '#3a1c16',
    roof: '#4a261c',
    roofDark: '#2a2622',
    trim: '#686a5e',
    timber: '#241814',
    glass: '#243038',
    glow: '#ffd59a',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Front-row tenements only, one unbroken quay line. Per-house ridges follow OSM height (12–16 m) except ways 331274562 and 331274575 (no height tag; ridges estimated at 15 m and 13 m) and the unmapped closure between 292320261 and 331274562 (ochre, ridge 14 m). Paint follows the quay panorama: oxblood dominant, white, ochre, one pink. Most roofs are dark red-brown tile; a few are grey-brown. The shop floor is set 0.82 m back under the jetty; eaves cross the mapped wall by about 0.24 m.',
};
