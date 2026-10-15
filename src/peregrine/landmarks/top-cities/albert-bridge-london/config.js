// Present-day Albert Bridge (1873, Ordish; Bazalgette chains 1884-87; GLC central piers 1973),
// carrying the A3031 between Chelsea Embankment and Battersea, in its 1992 pastel scheme.
export const SPEC = {
  id: 'albert-bridge-london', name: 'Albert Bridge', kind: 'bridge', ready: true,
  // The mapped 1973 central piers, mid-river: the structure's anchor.
  origin: [-0.1666947, 51.4822574],
  height: 33, // flat-map deck 4.6 m at the towers + 28.4 m to the finials
  padM: 140, frontageBearing: 163, rangeM: 3000, nearM: 800,
  terrainPolicy: 'absolute-deck',
  // Approach pavement and booth aprons follow local crossfall where it rises above the ramp.
  lateralBankFit: { terrainClamp: true, clearanceM: 0.10 },
};
export const PALETTES = {
  light: { chain: '#e8e6de', asphalt: '#4f5458', paving: '#a8a397', stone: '#9d978a', pink: '#dcaeb8', white: '#e8e6de', glow: '#d3d6b2', blue: '#9db3d3', gold: '#c4a24f', iron: '#aeaba2', concrete: '#bab5a8', booth: '#c3c977', roof: '#3c4148', light: '#f2f0e6' },
  dark: { chain: '#a9b2b8', asphalt: '#262f38', paving: '#55606a', stone: '#4f5a64', pink: '#86707a', white: '#a9b2b8', glow: '#f3d79c', blue: '#5d7290', gold: '#a88c4a', iron: '#5c6670', concrete: '#66717a', booth: '#7b8152', roof: '#1f2730', light: '#ffe2a4' },
};
export const MANIFEST = {
  elevationDatum: 'Local y=0 is flat-map grade (the river is flat in Cityscape). Flat-map roadway 4.6 m at the towers, 5.42 m at mid-span; finials 28.4 m above the roadway. In Full 3D world (absolute-deck) the span lifts to 1.8 m above the higher bank. No DEM is baked into the mesh.',
  attribution: 'Original procedural geometry authored for Codriver. Mapped alignment, piers and toll booths © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'Published: 710 ft overall, 384 ft 9 in central span (clear, pier face to pier face), 41 ft deck, 27 ft roadway, 32 stays from four octagonal cast-iron columns, two 1973 concrete central piers. Mapped: tower piers 121.9 m apart, toll booth and pier circles. Column, lantern and spire heights are photographic estimates scaled from the mapped span; stay anchor stations, chain sag, girder depth and colours are visual estimates. Flat-map ramps are a compromise; the real deck sits above both embankments. No textures or third-party meshes.',
};
