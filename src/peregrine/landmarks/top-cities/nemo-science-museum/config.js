// Renzo Piano's 1997 museum, with the redeveloped 2025 rooftop square.
export const SPEC = {
  id: 'nemo-science-museum', name: 'NEMO Science Museum', kind: 'building', ready: true,
  origin: [4.91235, 52.37408], height: 32.57, padM: 78, frontageBearing: 273,
};
export const PALETTES = {
  light: { copper: '#508b83', patina: '#60968c', joints: '#386b65', terrace: '#d6cdb4', planting: '#737a4f', glass: '#233d40', roof: '#c9ceca', brick: '#995d47' },
  dark: { copper: '#2c5555', patina: '#386563', joints: '#244747', terrace: '#797a73', planting: '#424c3d', glass: '#172e35', roof: '#7e9094', brick: '#5b4945' },
};
export const MANIFEST = {
  elevationDatum: 'Local rigid grade y=0; no absolute water level, DEM or Mercator stretch baked in.',
  attribution: 'Original procedural mesh by Codriver. Geographic data © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Renzo Piano 1997 copper hull and 2025 rooftop square. Plan and 32.57 m maximum height from OSM/BAG. Hull taper, glazing, steps, planted beds and pavilion are photographic estimates. Cityscape and Full 3D world not tested yet; integration is checked separately. See docs/3d-top-cities-nemo-science-museum.md.',
};
