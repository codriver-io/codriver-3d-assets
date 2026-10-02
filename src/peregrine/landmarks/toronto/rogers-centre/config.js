// Rogers Centre (SkyDome until 2005), 1 Blue Jays Way, Toronto. Modelled with the roof
// CLOSED, the state most drivers see from the road and the one on the postcards.
// Sourced: 86 m greatest roof height (published, above the field; also the OSM height tag),
// 205 m (674 ft) roof span, four roof panels (one fixed, three moving), 31 storeys,
// 11,000 t of roof steel, 1989, Rod Robbie and Michael Allen (RAN Consortium).
// Mapped: the building envelope, the hotel terraces, the roof outline (OSM way 7969701 and
// its building:part ways). Estimated: everything about the roof surface (profile, laps,
// seams), the facade rhythm and every height other than the tags above.
// See docs/3d-toronto-rogers-centre.md.
export const SPEC = {
  id: 'rogers-centre', name: 'Rogers Centre', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // Centre of the roof circle fitted to the mapped dome outline, which is also the middle
  // of the mapped east and west walls; the field's centre sits close to it.
  origin: [-79.38916, 43.64153],
  height: 86, padM: 190,
  // Bearing (clockwise from north) of the stadium's long axis toward the lake end, where the
  // main gates and the home-plate end are.
  frontageBearing: 163.9,
  // The mapped building envelope is 220 m wide and the wings and canopies stand right at
  // its edge, so the default 0.8 m tolerance is kept.
};
export const PALETTES = {
  light: {
    concrete: '#bab5a9', concrete_dark: '#8b877d', louvre: '#a7a294',
    glass: '#56707c', glass_hotel: '#7d98a6', glow: '#3d4a52',
    roof: '#eef1f1', roof_seam: '#c1c8cc', steel: '#8a9095',
    sign: '#d7222e', bronze: '#c39a47', jays: '#20509f', light: '#cfe6ff',
  },
  dark: {
    concrete: '#7b8087', concrete_dark: '#5a6066', louvre: '#6e7276',
    glass: '#2f4450', glass_hotel: '#445f6e', glow: '#ffc56a',
    roof: '#aab6be', roof_seam: '#7d8991', steel: '#596067',
    sign: '#ff4453', bronze: '#8a6c33', jays: '#2c5fb8', light: '#9fd0ff',
  },
};
// Draw-call budget (docs/3d-toronto-rogers-centre.md): design names on the left, the exported material on the right.
// Near keeps all thirteen (13 draws). Far folds the 4-triangle team-colour banner and the prow glass bands into the
// hotel glass (a pale blue-grey window tone), which leaves eight.
export const FOLD = {
  near: {},
  far: { jays: 'glass_hotel', glass: 'glass_hotel' },
};
/** The exported material for a design name at a detail level. */
export const materialFor = (name, detail) => FOLD[detail]?.[name] ?? name;

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap (street and concourse level); no absolute altitude. The 86 m crown (published, and the OSM height tag) is taken as height over this grade; distant photographs scaled against the CN Tower put the crown about 55 m over the 32 m concrete wall, consistent with it.',
  attribution: 'Original procedural mesh. Mapped footprint and hotel terraces © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Roof modelled closed. Roof profile, panel laps and seams, facade bays, signs and the prow sculptures are estimates from photographs; the plan, hotel terrace heights and the 86 m crown come from OpenStreetMap and published figures.',
};
