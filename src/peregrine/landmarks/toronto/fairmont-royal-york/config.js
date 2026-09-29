// Fairmont Royal York, 100 Front St W, Toronto. See docs/3d-toronto-fairmont-royal-york.md.
// Dimensions: published height and OSM building:part heights; plan from OSM; storey rhythm, crown detail
// and everything on the facades are a visual reconstruction from photographs, not a survey.
export const SPEC = {
  id: 'fairmont-royal-york', name: 'Fairmont Royal York', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // Area centroid of OSM way 177879879 (the whole hotel outline).
  origin: [-79.3815238, 43.6459096],
  // Top of the finial on the crown of the stack. Published height: 124 m (407 ft); OSM ends the stack at 114 m.
  height: 124, padM: 100,
  // Bearing (degrees clockwise from north) the Front Street facade faces. The hotel's long axis runs 16.3 deg
  // north of east, the Toronto grid, so the frontage looks 16.3 deg east of south.
  frontageBearing: 163.7,
};

export const PALETTES = {
  light: {
    limestone: '#d4c9b1', plinth: '#8f897d', glass: '#4f5e66', glow: '#4f5e66',
    copper: '#76ac99', roof: '#a7a69e', awning: '#62202b', metal: '#6b7378', sign: '#efe3e1',
  },
  dark: {
    limestone: '#8c8676', plinth: '#5b5850', glass: '#25323a', glow: '#ffd08a',
    copper: '#4c7f70', roof: '#565a5e', awning: '#4a1c26', metal: '#4b5359', sign: '#ffdcea',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint and building-part heights © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Plan, slab heights and roof heights follow OSM building:part ways; the crown roof, dormers, turrets, stack, sign, arcades and window rhythm are reconstructed from photographs and are approximate. The crown of the stack (parapet, pyramid, lantern, finial) brings the model to the published 124 m; OSM ends the stack at 114 m.',
};
