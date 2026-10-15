// Rheinturm, Stromstraße / Rheinufer, Düsseldorf. Harald Deilmann, 1979–81, reinforced concrete.
// 240.5 m to the beacon (234.2 m until the 2004 DVB-T aerial). Observation deck at 168 m,
// revolving restaurant in the lower storey of the pod. The Lichtzeitpegel (Horst H. Baumann,
// 1981) is the column of 62 portholes on the Rhine face. Mapped axis: centroid of OSM way
// 161648930. See docs/3d-top-cities-rheinturm.md.
export const SPEC = {
  id: 'rheinturm', name: 'Rheinturm', kind: 'building',
  ready: true,
  origin: [6.7616587, 51.2179636],
  height: 240.5,
  padM: 40, // the brim is 17 m across; the Rheinufer here is flat, no terrainPad
  frontageBearing: 270, // the clock and the river face look west
  // A 240 m tower on a flat riverbank is read from kilometres away.
  rangeM: 6000, minZoom: 12.5, nearM: 550,
};
export const PALETTES = {
  light: {
    concrete: '#c9c1b2', // sunlit shaft; shading supplies the grey side
    white: '#e4e0d6',
    metal: '#3c444a',
    red: '#d24b32',
    glass: '#24343e',
    dark: '#3a403c',
    glow: '#f4f0e4',
    light: '#ff4c38',
  },
  dark: {
    concrete: '#6a726e',
    white: '#b4bdc4',
    metal: '#2c3338',
    red: '#9a3e2e',
    glass: '#1c5874',
    dark: '#2a302e',
    glow: '#fff6de',
    light: '#ff3d2c',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. The site is about 36.6 m NHN, not baked in.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Published: 240.5 m tip, 168 m observation deck, 172.5 m public height, 62 portholes at 2.5 m on the west face showing 16:56:39. Mapped: the axis and the part rings. Estimated from photographs: the cone profile, the two glazed storeys, the brim (held inside the 17.7 m inscribed ring; OSM\'s mean radius is ~19 m) and the mast steps. The Landtag next door is not part of the model.',
};
