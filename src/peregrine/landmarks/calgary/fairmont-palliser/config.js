// Fairmont Palliser Hotel, 133 9 Avenue SW, Calgary. See docs/3d-calgary-fairmont-palliser.md.
// Dimensions: the published 12 storeys and OSM's height=60 m / building:levels per part; the plan is the OSM
// outline and its eleven building:part ways. Everything on the facades is a visual reconstruction from
// photographs, not a survey.
export const SPEC = {
  id: 'fairmont-palliser', name: 'Fairmont Palliser Hotel', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // Area centroid of OSM way 213930558 (the whole hotel outline).
  origin: [-114.0649533, 51.0443112],
  // Top of the slate roof of the 15-level penthouse that carries the sign; OSM height=60 for the whole building.
  height: 60,
  // The farthest corner of the hotel is 46 m from the origin; downtown Calgary is flat here (< 2 m), so the pad
  // just covers the hotel and no terrainPad is declared.
  padM: 54,
  // Bearing the 9 Avenue facade faces (degrees clockwise from north). The hotel's long axis runs 2.7 deg
  // clockwise of east (the Calgary grid is 2.7 deg off cardinal here), so the frontage looks 2.7 deg west of south.
  frontageBearing: 182.7,
};

export const PALETTES = {
  light: {
    brick: '#b8ab92', stone: '#bdb6a8', plinth: '#7d776a', glass: '#4f5d66', glow: '#4f5d66',
    roof: '#8d8a83', slate: '#48535d', panel: '#a7bab5', canopy: '#1d4152', sign: '#c9cac6', lamp: '#fff3d2',
  },
  dark: {
    brick: '#6e6450', stone: '#7a766b', plinth: '#433f3a', glass: '#202b32', glow: '#ffd48a',
    roof: '#4a4c50', slate: '#2d363e', panel: '#5e726f', canopy: '#16313e', sign: '#ffd979', lamp: '#ffe8ae',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint and building-part levels © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Plan and storey counts follow the OSM outline and its eleven building:part ways; the storey height (3.77 m above a 7.2 m ground storey, so that 15 levels reach the mapped 60 m), the stone base and its dark granite band, window rhythm, cornices (including the 1 m cornice at the roofline), canopy, penthouse roof and sign lettering are reconstructed from photographs and are approximate.',
};
