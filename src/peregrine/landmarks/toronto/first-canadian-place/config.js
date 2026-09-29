// First Canadian Place, 100 King Street West, Toronto: Bank of Montreal's tower.
// Sourced: 298.1 m architectural height, 72 storeys (4 below grade), tip 355 m
// (CTBUH via Wikipedia), 1975, Bregman + Hamann with Edward Durell Stone, reclad 2009-2012 in
// white frit glass with bronze corners; 292 m roof, 57.65 x 55.04 m plan with square corner
// pockets and a 29.9 x 22.2 m penthouse (OpenStreetMap).
// Estimated: storey pitch, window and spandrel heights, bay width, the lobby, the roof
// equipment and the masts. See docs/3d-toronto-first-canadian-place.md.
export const SPEC = {
  id: 'first-canadian-place', name: 'First Canadian Place', kind: 'building',
  ready: true, // near/far GLBs exported, verified and catalogued
  origin: [-79.3816917, 43.6487652], // centre of the mapped 57.65 x 55.04 m tower plan (OSM way 27767627)
  height: 355, padM: 75, frontageBearing: 164, // King Street face looks south-south-east; 164 deg is the street grid's own bearing
};
export const PALETTES = {
  light: {
    frit: '#e9e9e4', glass: '#474b4d', bronze: '#2c2a29', mullion: '#a9aba8',
    concrete: '#cfd0ca', roof: '#bab49e', metal: '#5a6064', paint: '#efefea',
    sign: '#1f5fae', lamp: '#e2372b', light: '#ffffff', glow: '#343738',
  },
  dark: {
    frit: '#8e959b', glass: '#1d252c', bronze: '#191c1f', mullion: '#566067',
    concrete: '#7d858c', roof: '#5d5f5a', metal: '#3e454b', paint: '#a4abb1',
    sign: '#4a90ff', lamp: '#ff5d40', light: '#fff6e0', glow: '#ffc56a',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. Roof line 298.1 m and mast tip 355 m are above this local grade.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Plan, roof and penthouse are mapped (OSM); storey pitch, facade module, lobby, roof equipment and masts are estimates from published photographs. The podium wings and the King and Bay bank pavilion are not modelled and stay provider geometry.',
};
