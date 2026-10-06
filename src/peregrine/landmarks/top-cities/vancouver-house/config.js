// Vancouver House, BIG / DIALOG for Westbank, completed 2020.
export const SPEC = {
  id: 'vancouver-house', name: 'Vancouver House', kind: 'building', ready: true,
  origin: [-123.1310292, 49.274925625], height: 155.6, padM: 88,
  frontageBearing: 90, planAngle: -46, width: 43.3, depth: 28.8, floors: 52,
};
export const PALETTES = {
  light: { white: '#dddeda', glass: '#60818c', rail: '#a4b7bb', metal: '#727c80', light: '#627f87', roof: '#abb0ac' },
  dark: { white: '#677680', glass: '#203a48', rail: '#455d69', metal: '#374a57', light: '#e6be7a', roof: '#4a5961' },
};
export const MANIFEST = {
  elevationDatum: 'y=0 is local flat-map street grade; rigid foundation, no absolute altitude or baked terrain.',
  attribution: 'Original procedural geometry, Codriver, 2026. Mapped outlines © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Current Skyscraper Center: 155.6 m, 52 floors, 2020; Westbank markets 59 storeys; dossier/OSM counts 49. Plate, rotation and site mapped; expansion curve, balcony pattern, podium heights and materials estimated. No textures or external meshes.',
};
