// Opened 2016. Geometry is already oriented in east/up/south metres.
export const SPEC = {
  id: 'rogers-place', name: 'Rogers Place', kind: 'building', ready: true,
  origin: [-113.49778, 53.54694], height: 43, padM: 112,
  frontageBearing: 180.8,
};
export const PALETTES = {
  light: { silver: '#cdd3d6', highlight: '#e1e5e7', seam: '#aeb8bd', roof: '#cdd3d6', glass: '#4c696d', frame: '#818d8e', shadow: '#303c43', sign: '#ed3022' },
  dark: { silver: '#637787', highlight: '#8394a0', seam: '#556b7c', roof: '#788b99', glass: '#2e4f5d', frame: '#697e8a', shadow: '#202d39', sign: '#f23a26' },
};
export const MANIFEST = {
  elevationDatum: 'Local street grade y=0, rigid base. No altitude, DEM or Mercator scaling baked in.',
  attribution: 'Original procedural geometry by Codriver. Mapped footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '2016 arena and Ford Hall, stainless-steel wave shell, clerestory and raised glazed entrance. 43 m height and plan from OSM; shell profiles, glazing and 8 m underpass clearance are photo-based estimates. Orientation baked into exports. Neighbouring casino, community arena and LRT station excluded.',
};
