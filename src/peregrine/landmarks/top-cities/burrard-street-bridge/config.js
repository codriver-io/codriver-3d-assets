// Burrard Bridge, 1932 structure with the 2017 walking/cycling arrangement.
export const SPEC = {
  id: 'burrard-street-bridge', name: 'Burrard Street Bridge', kind: 'bridge', ready: true,
  origin: [-123.1368002926185, 49.275523599305906], height: 40.65, padM: 400,
  frontageBearing: 64.4, footprintless: true,
};
export const PALETTES = {
  light: { stone: '#c8c2a5', concrete: '#ded9bf', steel: '#717a72', asphalt: '#555d63', paint: '#eceadf', yellow: '#d6b83d', roof: '#655d48', glass: '#374e4a', mosaic: '#72a8a2', lamp: '#f1dcc0' },
  dark: { stone: '#7f867f', concrete: '#9a9e91', steel: '#71888c', asphalt: '#303c47', paint: '#bbc2bb', yellow: '#a89951', roof: '#4d5c66', glass: '#25444d', mosaic: '#51767c', lamp: '#ffd490' },
};
export const MANIFEST = {
  elevationDatum: 'Local y=0 is flat-map river/ground grade. Estimated deck 24 m; no DEM or Mercator stretch baked in. Absolute-deck terrain policy keeps the central structure rigid and fits ramp ends/support feet to terrain.',
  attribution: 'Original procedural geometry. Mapped roadway and bridge outline © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'SEABC/IABSE 2017: 96.2 m main through-truss; four marine deck-truss spans 56.8/70.7/70.7/56.3 m. Dossier/Wikipedia gives 89.6 m; differing span conventions unresolved. Deck height, truss rise, portal dimensions and ornament proportions are photographic estimates. Four vehicle lanes, two 2.5 m protected cycle lanes, two 2.6 m sidewalks; OSM still tags five vehicle lanes. Extended mapped approaches give a 1042.8 m fitting corridor, versus the 865.0 m mapped bridge and published 836 m original structure. Simplified busts, ship prows and coat of arms; texture-free.',
};
