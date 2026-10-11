// St Paul's Cathedral, Ludgate Hill, London. Wren's English Baroque cathedral, completed 1710.
// Origin is the centroid of the mapped outer dome (OSM way 664613340), which is the crossing.
// The nave bears 83.8°; rotation is baked into the geometry (see st-pauls-cathedral-plan.js).
export const SPEC = {
  id: 'st-pauls-cathedral',
  name: "St Paul's Cathedral",
  kind: 'building',
  ready: true,
  origin: [-0.0983108, 51.5137866],
  height: 111.25, // 365 ft to the cross
  padM: 98, // half-diagonal of the outline is about 90 m; the churchyard platform is level
  frontageBearing: 263.8, // the west front looks down Ludgate Hill
  rotationDeg: 6.2,
};

// Portland stone, warm grey lead, black clock dials, gilded cross and pineapples.
// `lamp` and `light` are unshaded: gold reads as gold by day and brighter when floodlit;
// `light` is dark glass by day and the warm windows at night. Lead is a warm mid grey, not blue.
// The dome ribs are a lighter grey than the panels so the hemisphere still reads when the sun is flat.
export const PALETTES = {
  light: {
    stone: '#efe6d6',
    stone2: '#d4c6ae',
    lead: '#8f9294',
    rib: '#c5c3be',
    glass: '#3a444c',
    light: '#3a3228',
    lamp: '#e0b44a',
    clock: '#14120e',
  },
  dark: {
    stone: '#d9d0be',
    stone2: '#b7aa94',
    lead: '#4d5154',
    rib: '#6e706c',
    glass: '#161c22',
    light: '#ffd09a',
    lamp: '#ffe7a8',
    clock: '#0c0d10',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap (the churchyard pavement); no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Cross 111.25 m (365 ft), outer dome crown 84.7 m (278 ft) and tower pineapples 67.4 m (221 ft) are the published figures. The plan, the 83.8° nave bearing and the dome/tower positions are the OSM outline and building:parts. Bay rhythm, column counts, the ogee cupolas and the entablature heights are estimated from photographs.',
};
