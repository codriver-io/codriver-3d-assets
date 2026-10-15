// Estimated bounded pool site; independent from the exact provider replacement rings.
export const SITE_RING = [[-3.718012813, 40.424144215], [-3.717044965, 40.42430712], [-3.716958349, 40.424008895], [-3.717926197, 40.42384599], [-3.718012813, 40.424144215]];
// Current reconstructed exterior; mapped sanctuary + two gates, not the original Nubian site.
export const SPEC = {
  id: 'templo-de-debod', name: 'Templo de Debod', kind: 'building', ready: true,
  origin: [-3.71778,40.42405], height: 7.0, padM: 53, frontageBearing: 77.5,
  rotation: 0.2176,
  terrainPad: { rings: [SITE_RING], refs: [[-3.71778,40.42405],[-3.71733,40.42412],[-3.71710,40.42416]], datum: 'median', featherM: 8 },
};
export const PALETTES = {
  light: { stone:'#bcaa86', weather:'#ad9875', cornice:'#c7b794', platform:'#bcb4a0', water:'#557e82', recess:'#37362e', bronze:'#423d31' },
  dark: { stone:'#71634a', weather:'#62563f', cornice:'#897347', platform:'#52524a', water:'#263f45', recess:'#171e22', bronze:'#22292a' },
};
export const MANIFEST = {
  elevationDatum: 'y=0 is the rigid pool basin at Parque de la Montaña; central stone island top y=0.50m; no DEM or sea-level height baked in.',
  attribution: 'Original procedural geometry by Codriver. Geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'OSM maps the ~20×12.6m sanctuary with a south annex, two gateways ~20.5m apart and a 77.5° axis. Photo-estimated 8% sanctuary wall batter, 0.8 m cavetto projection with torus rolls, four deep upper openings and proud columns; gateways rise 6.2/6.5 m above the island. Sanctuary roof reaches 6.52 m above the basin; the 12m stub height is not retained. Pool site envelope is estimated. Reflecting pool shown filled, although 2026 reference photographs show it drained. App appearance is checked separately from export and lifecycle certification.',
};
