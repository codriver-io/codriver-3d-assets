// Hardangerbrua, the completed 2013 suspension bridge over Eidfjorden.
export const SPEC = {
  id: 'hardanger-bridge', name: 'Hardanger Bridge', kind: 'bridge', ready: true,
  origin: [6.83033, 60.47848], height: 201.5, padM: 35,
  frontageBearing: 148.8, footprintless: true, terrainPolicy: 'absolute-deck',
};
export const PALETTES = {
  light: { concrete: '#c5c6bd', steel: '#76878b', cable: '#bac3bd', asphalt: '#555d63', paint: '#ebece3', yellow: '#d7b83c', lamp: '#e1e7dc' },
  dark: { concrete: '#738089', steel: '#566c7b', cable: '#899fa8', asphalt: '#303c47', paint: '#b9bdbe', yellow: '#a79242', lamp: '#ffe0a2' },
};
export const MANIFEST = {
  elevationDatum: 'Local y=0 is the nominal water/footing reference, not a baked DEM. Authored tower top 201.5 m; box underside 55 m at midspan. World uses absolute-deck; Cityscape lowers the portal deck to 4 m and ramps over short mapped tunnel entries.',
  attribution: 'Original procedural geometry. Mapped roadway © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Published design: main span 1310 m, tower height 201.5 m, box width 18.3 m and depth 3.25 m, vertical radius 20000 m, cable diameter 0.6 m, sag/span 1:10.8. Estimated: tower sections/crossbeam, portals, hanger spacing, backstays, roadway partition and lamps. No fjord terrain, textures, underground roundabout or full tunnel model.',
};
