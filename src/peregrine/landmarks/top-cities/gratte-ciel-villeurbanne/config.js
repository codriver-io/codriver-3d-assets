export const SPEC = {
  id: 'gratte-ciel-villeurbanne', name: 'Gratte-Ciel de Villeurbanne', kind: 'building',
  ready: true, origin: [4.87947, 45.76793], height: 65, padM: 190,
  frontageBearing: 87.8, gridAngle: 2.2 * Math.PI / 180,
};
export const PALETTES = {
  light: { stucco: '#ede7d9', trim: '#d1cbbb', glass: '#455d61', frame: '#b1b4ac', roof: '#8c8b80', metal: '#535d59', light: '#637477' },
  dark: { stucco: '#77858e', trim: '#677984', glass: '#243a47', frame: '#849397', roof: '#52616a', metal: '#44555e', light: '#e6bc79' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid buildings at local grade y=0; no absolute altitude or DEM baked into geometry.',
  attribution: 'Original procedural geometry for Codriver. Footprints © OpenStreetMap contributors (ODbL 1.0), https://www.openstreetmap.org/copyright. Reference photographs are comparison only, not shipped.',
  note: '1934 residential ensemble: two northern gateway towers and four mapped apartment wings; excludes Hôtel de Ville, TNP, streets, shops signage and courtyard neighbours. SVU publishes conflicting 61/65 m tower figures; 65 m selected from its key-dimensions table. Terrace heights, glazing rhythm, crown setbacks and roof rails estimated from photographs.',
};
