// Dallas City Hall, the 1978 I. M. Pei building, not the former Municipal Building.
export const SPEC = {
  id: 'dallas-city-hall', name: 'Dallas City Hall', kind: 'building', ready: true,
  origin: [-96.796935, 32.776255], height: 37.1856, padM: 138,
  frontageBearing: 345, ownTolM: 0.8,
  lengthM: 170.688, roofY: 33.4, leanDeg: 34,
};
export const PALETTES = {
  light: { concrete: '#bfb7a5', glass: '#333e41', joint: '#8d887c', paving: '#b4ad9e', water: '#607f7e', bronze: '#554d3f', glow: '#3c4646' },
  dark: { concrete: '#85888a', glass: '#293b44', joint: '#60676b', paving: '#6c7479', water: '#365962', bronze: '#403e38', glow: '#77745d' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local plaza grade y=0; no DEM or sea-level height is baked in. Rotation is exported once.',
  attribution: 'Original procedural geometry. Mapped building outline © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '1978 Dallas City Hall; HABS length 560 ft and height 122 ft, PCF&P 34-degree north lean and 180-foot pool. Roof, bay placement, pylon diameters, plaza detail and three distinct rounded fin/hook/C sculpture forms on their plinth estimated from references. Cityscape and Full 3D world integration not tested yet.',
};
