// Scotiabank Arena (Air Canada Centre until 2018), 40 Bay Street, Toronto.
// Sources, dimension table and approximations: docs/3d-toronto-scotiabank-arena.md.
// Mapped outlines (c) OpenStreetMap contributors, ODbL 1.0.
export const SPEC = {
  id: 'scotiabank-arena', name: 'Scotiabank Arena', kind: 'building',
  ready: true, // near/far GLBs exported, verified and catalogued
  // Area centroid of the mapped bowl-roof part (OSM way 1104128156), rounded to 6 decimals.
  origin: [-79.379057, 43.643449],
  // Crown of the shallow roof is 31 m; the tallest rooftop unit and the plaza sculpture stay under 32 m.
  // The 15-storey office tower (55 m, OSM way 187583789) is NOT part of this model.
  height: 32, padM: 125,
  // The plaza front (LED screen, red sign) faces west-south-west, normal to the bowl's west wall.
  frontageBearing: 242,
  // Geometry constants shared with the tests (metres above local grade).
  roof: { eave: 27, rise: 4 },
  facadeM: 19, // retained Postal Delivery Building limestone cornice
  atriumM: 19.5, // glazed plaza front and its canopy
  screen: { width: 15.2, height: 9.1 }, // published: 9.1 x 15.2 m video screen
};
export const PALETTES = {
  light: {
    limestone: '#d3c4a8', granite: '#918885', plinth: '#2b2b2e', glass: '#38525e', frame: '#5e6569',
    cladding: '#34373b', louvre: '#4b5056', roof: '#83878a', patina: '#77a08b',
    sign: '#d9232b', glow: '#2b2f3c', corten: '#6e4230',
  },
  dark: {
    limestone: '#8f887c', granite: '#5f5957', plinth: '#1b1c1f', glass: '#3a5f6d', frame: '#3e4448',
    cladding: '#16181a', louvre: '#2a2e33', roof: '#50565b', patina: '#4c6b5e',
    sign: '#ff5058', glow: '#7484bd', corten: '#583a2b',
  },
};
// Draw-call budget (docs/3d-toronto-scotiabank-arena.md): design names on the left, the exported material on the right.
// Near keeps all twelve (12 draws). Far folds look-alikes: the dark plinth into the dark cladding, the grey window frames
// into the grey louvres, the granite base into the grey roof tone and the thin patina band into the glazing's teal, which
// leaves eight (the lit screen, the red sign and the sculpture stay their own materials).
export const FOLD = {
  near: {},
  far: { plinth: 'cladding', frame: 'louvre', granite: 'roof', patina: 'glass' },
};
/** The exported material for a design name at a detail level. */
export const materialFor = (name, detail) => FOLD[detail]?.[name] ?? name;

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. Roof crown 31 m, limestone cornice 19 m and glazed front 19.5 m above that grade are estimates within the sourced 28 m clear height to the roof underside.',
  attribution: 'Original procedural mesh. Mapped footprints (c) OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Arena bowl, retained Art Deco limestone facade (east and south), glazed plaza front with LED screen, and the plaza sculpture. Heights are photo estimates; the office tower at 50 Bay Street and the Union Station skywalk annexes stay with the map provider.',
};
