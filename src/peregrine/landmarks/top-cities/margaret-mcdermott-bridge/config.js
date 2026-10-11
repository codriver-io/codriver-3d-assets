// Current I-30 crossing: concrete freeway, separate white pedestrian thrust arches.
export const SPEC = {
  id: 'margaret-mcdermott-bridge', name: 'Margaret McDermott Bridge', kind: 'bridge',
  ready: true, origin: [-96.817955425, 32.77028005], height: 106.68,
  padM: 65, frontageBearing: 76.6, footprintless: true,
  terrainPolicy: 'absolute-deck', rangeM: 4500, nearM: 1350,
};
export const PALETTES = {
  light: { arch: '#f3f2eb', cable: '#b8bdc2', concrete: '#c5c0b3', girder: '#ada99f', asphalt: '#58616a', rail: '#b2b7bc', paint: '#efeee6', lamp: '#fff1ce' },
  dark: { arch: '#a0aab3', cable: '#697886', concrete: '#717d88', girder: '#596772', asphalt: '#303c47', rail: '#8494a3', paint: '#b8bec3', lamp: '#ffda8e' },
};
export const MANIFEST = {
  elevationDatum: 'Local metres, y=0 flat Cityscape grade. Deck 19.812 m and arch crown 106.68 m above that datum. Full 3D world uses a separate absolute-deck profile (estimated river datum 118 m), never baked into the GLB; foundations refit to the DEM.',
  attribution: 'Original procedural geometry. Alignment © OpenStreetMap contributors (ODbL 1.0), https://www.openstreetmap.org/copyright. Reference photographs used for visual study only; no imagery or third-party mesh included.',
  note: 'Published arch span 1,125 ft (342.9 m), arch height 350 ft (106.68 m), 285 ft above deck (86.868 m), pedestrian width 20 ft 4 in (6.1976 m). Cross-section, fork openings, cable pitch, concrete bents, deck datum and flat approach profile are visual estimates; no engineering survey. Mapped 337.5 m straight cycle-path segments locate the published span to within 3 m per end. World elevation is approximate; integration verification is recorded separately.',
};
