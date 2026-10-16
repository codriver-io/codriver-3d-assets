// Literal geographic pad corners, precomputed from the mapped -17° building frame.
// A 50 m building-frame halo covers the 38.2 m near terrain lattice at this latitude;
// references stay on the level headquarters site rather than the widened edge.
export const TERRAIN_PAD = {
  rings: [[[-75.578287217, 6.2464286], [-75.576852658, 6.245992614], [-75.577423352, 6.244137038], [-75.57885791, 6.244573023], [-75.578287217, 6.2464286]]],
  refs: [[-75.57785,6.2453],[-75.578086,6.245476],[-75.577704,6.245593],[-75.577995,6.244986],[-75.577613,6.245103]],
  datum: 'median', featherM: 25,
};
export const SPEC = {
  id: 'edificio-inteligente-epm', name: 'Edificio Inteligente EPM', kind: 'building',
  ready: true, origin: [-75.57785, 6.2453], height: 70, padM: 74,
  frontageBearing: 287,
  terrainPad: TERRAIN_PAD,
};
export const PALETTES = {
  light: { concrete: '#c4c3b9', core: '#b4a286', aluminium: '#c6ccc8', glass: '#526e70', shadow: '#35484a', glow: '#78918d' },
  dark: { concrete: '#647074', core: '#766e5e', aluminium: '#7f8e91', glass: '#233e49', shadow: '#1b2c35', glow: '#90a498' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local grade y=0; absolute altitude, DEM heights and latitude stretch excluded.',
  attribution: 'Original procedural model by Codriver. Mapped outline © OpenStreetMap contributors, ODbL 1.0, https://www.openstreetmap.org/copyright. Photo references: John Gómez, Edificio Inteligente, CC BY-SA 3.0; SajoR, Edificio EPM-FachadaEste-Medellin, public domain; FilMedellín location photograph, reference only. No photographs redistributed.',
  note: 'Fourteen-storey EPM headquarters; revised twin buff plaza cores reach a photo-estimated 70 m, with the office roof at 58.6 m (the published 62 m is a floor-count estimate). Stepped glass wings, floor fins, six pilotis and recessed lobby; service details are abstracted. Widened rigid median pad with 25 m feather; no DEM height is baked into the model. Cityscape and Full 3D world verified in static near/street views at bearings 107/287; transitions, terrain eviction, exaggeration and device performance remain untested.',
};
