// Scotia Plaza, 40 King Street West, Toronto (WZMH Architects, 1988) and the 1951
// Bank of Nova Scotia building at 44 King Street West that it wraps.
// Height and levels: OSM way 141694075 (height=274.9, building:levels=68), which
// agrees with Wikipedia's 274.9 m / 68 storeys. Everything else is documented,
// with its confidence, in docs/3d-toronto-scotia-plaza.md.
export const SPEC = {
  id: 'scotia-plaza', name: 'Scotia Plaza', kind: 'building',
  ready: true, // near/far GLBs exported, verified and catalogued
  // Centroid of the mapped tower outline (OSM way 141694075).
  origin: [-79.3795541, 43.6494885],
  height: 274.9, padM: 100,
  // Outward bearing (degrees from true north) of the King Street frontage: the
  // street grid here runs 17.13 degrees east of north, so King Street's normal is 162.9.
  frontageBearing: 163,
  // Rotation of the authoring (u, v) site axes about +Y, degrees. u runs along King
  // Street (bearing 72.87), v along Bay Street toward King (bearing 162.87). It was
  // fitted to the mapped tower outline (length-weighted edge direction), not assumed.
  siteAngleDeg: 17.13122,
};

// Napoleon Red granite (Sweden, cut in Italy) is a deep brown-red; the windows are
// dark bronze glass. The layer shades every face from its normal (0.66..1.0 of the
// palette colour), so the light palette is the sunlit colour and vertical faces
// read 20-35% darker, which is what the photographs show.
export const PALETTES = {
  light: {
    granite: '#a95a48', glass: '#33231f', curtain: '#3f3230', glow: '#4a322d',
    roof: '#5b4d4a', sign: '#e0262c', stone: '#ddd0b6', metal: '#82878a',
  },
  dark: {
    granite: '#7a4a40', glass: '#1b1413', curtain: '#2b2322', glow: '#ffcf8a',
    roof: '#3a3335', sign: '#c9222a', stone: '#8f8878', metal: '#4d5358',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. Sites, plazas and the below-grade levels are not modelled.',
  attribution: 'Original procedural mesh. Mapped footprints and heights © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Tower massing, the stepped-chevron recess, the sawtooth corners and the two six-level wings follow OSM building parts; facade module, window size, floor pitch, granite colour, roof equipment and the logo are estimated from photographs. The 44 King Street West heritage building is OSM massing with a simplified limestone facade; the glazed canopies and atria beside the tower are not modelled.',
};
