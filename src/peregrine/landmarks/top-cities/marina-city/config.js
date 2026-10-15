// Marina City, Chicago. Bertrand Goldberg, 1964-68. Twin corncob towers.
// Contract: docs/3d-top-cities-landmarks.md. Dimensions: marina-city-shape.js.
export const SPEC = {
  id: 'marina-city',
  name: 'Marina City',
  kind: 'building',
  ready: true,
  origin: [-87.62876, 41.88799],
  height: 179.2, // red aviation lamp, OSM roof 179.2 m / published 587 ft
  padM: 90,
  frontageBearing: 180, // south, the Chicago River and Wacker Drive
  rangeM: 3400,
  minZoom: 13,
  nearM: 750,
};

// Weathered warm concrete. Glow is unshaded: dark glass by day, warm panes at night.
// The lamp is the red beacon in both themes (brighter at night). Car colours are separate
// materials because vertex colour is overwritten by the map shading.
export const PALETTES = {
  light: {
    concrete: '#d9d3c6',
    concreteDark: '#4b4c48',
    glass: '#27363a',
    glow: '#344447',
    metal: '#8e8983',
    lamp: '#c4564c',
    roof: '#cfc7b8',
    carLight: '#a9aaa4',
    carDark: '#666e72',
    carRed: '#75534e',
  },
  dark: {
    concrete: '#8c9296',
    concreteDark: '#5e656b',
    glass: '#1c2a30',
    glow: '#f0c98a',
    metal: '#6c7378',
    lamp: '#ff5a45',
    roof: '#7c848a',
    carLight: '#c8c2b6',
    carDark: '#2c3236',
    carRed: '#6e342e',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Twin 179.2 m corncob towers. Balcony radii follow the mapped petal polygons, pulled in at the cusps. Parking is 19 stacked open decks (the real spiral is the inner aisle; the outer arches stack in columns). Theatre saddle, podium bite and window pattern are estimated.',
};
