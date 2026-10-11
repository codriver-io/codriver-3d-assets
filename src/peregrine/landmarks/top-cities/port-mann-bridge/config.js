// Current 2012 crossing, excluding its demolished orange tied-arch predecessor.
export const SPEC = {
  id: 'port-mann-bridge', name: "Port Mann Bridge", kind: 'bridge',
  ready: true,
  origin: [-122.81306, 49.21972], // North pylon anchor, projected onto the averaged mapped roadway.
  height: 121, // 46 m visual road datum + published 75 m tower rise. Footing-to-crown is 163 m.
  padM: 1250,
  frontageBearing: 164.7,
  rangeM: 7000, nearM: 1800,
  terrainPolicy: 'absolute-deck',
};
export const PALETTES = {
  light: { tower:'#d0cec0', concrete:'#b9bbae', steel:'#8e989b', cable:'#eceddf', asphalt:'#555d63', paint:'#eceadf', rail:'#b9c3c6', lamp:'#fff0cb' },
  dark: { tower:'#84959f', concrete:'#677780', steel:'#657f90', cable:'#b8ccd6', asphalt:'#303c47', paint:'#b9bdbe', rail:'#819aa8', lamp:'#ffe0a4' },
};
export const MANIFEST = {
  elevationDatum: 'Local y=0 is the visual water/flat-map grade. Road 46 m, girder soffit 42 m, crown 121 m. Published 163 m is measured from deep footings: that submerged/buried portion is omitted. No DEM, latitude stretch or moving scene datum is baked into the GLB.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Published 470 m main span, 190 m back spans, 850 m cable-supported section, 65 m width, 10 lanes, 288 stays, 75 m tower rise above road; source widths differ (SEABC 67 m, TYLin 52 m deck). Estimated local road datum, pylon sections/anchor spacing, girder and fairing sections, lamp details and approach pier stations. Ramps are a flat-map convention; tower station inferred from dossier north-pylon anchor, not surveyed.',
};
