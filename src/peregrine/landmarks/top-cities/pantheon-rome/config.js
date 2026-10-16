import { FOOTPRINTS } from './footprint.js';
// Current surviving Roman building; historic bell towers and pediment sculpture are absent.
export const SPEC = {
  id: 'pantheon-rome', name: 'Pantheon', kind: 'building', ready: true,
  origin: [12.47683355, 41.898555], height: 44.0, padM: 48,
  frontageBearing: 356.4617, rotation: 0.06175448276768935,
  interiorDiameter: 43.3, drumDiameter: 57.4, drumHeight: 28.3,
  oculusDiameter: 9.1, shaftHeight: 11.9, shaftDiameter: 1.5,
  porticoWidth: 36.4, porticoDepth: 15.6, porticoRidge: 24.4,
  terrainPad: { rings: FOOTPRINTS, refs: [[12.47683355,41.898555],[12.4767962,41.8989997],[12.47685,41.89830]], datum: 'median', featherM: 3 },
};
export const PALETTES = {
  light: { stone: '#c8b99c', granite: '#89867c', brick: '#79604f', lead: '#88877c', bronze: '#575244', recess: '#433c32' },
  dark: { stone: '#827d6c', granite: '#5b605d', brick: '#625e54', lead: '#6a7376', bronze: '#333c38', recess: '#252e31' },
};
export const MANIFEST = {
  elevationDatum: 'Local y=0 at present exterior grade; portico floor y=0.25m. Rigid metres, no terrain or absolute altitude baked in.',
  attribution: 'Original procedural geometry by Codriver. Geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '43.3m internal span, 9.1m open oculus, 11.9×1.5m granite shafts and sixteen Corinthian columns. 28.3m drum from OSM; 44m exterior rim, mouldings, brick relieving arches, rear annex height and weathering are estimates. Orientation from OSM northern facade endpoints, baked once. Modern present-day exterior, without removed bell towers or ancient sculpture. Cityscape and Full 3D world integration not tested yet.',
};
