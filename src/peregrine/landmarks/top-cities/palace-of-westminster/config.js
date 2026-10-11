// Palace of Westminster and Elizabeth Tower, Westminster, London SW1A 0AA.
// Charles Barry and Augustus Pugin, Perpendicular Gothic Revival, 1840-70; Elizabeth Tower completed 1859,
// Victoria Tower 1860. The present palace replaces the medieval palace burned in 1834; Westminster Hall
// (1097-99, roof 1390s) survives on the west. Original procedural model; see
// docs/3d-top-cities-palace-of-westminster.md. Contract: docs/3d-top-cities-landmarks.md.
//
// Origin: area centroid of OSM relation 1567699's outer ring (way 367642719). Rotation is baked: +z in the
// building frame points at the Thames, bearing 100.19°. Grade is the Embankment terrace, essentially flat.
export const SPEC = {
  id: 'palace-of-westminster',
  name: 'Palace of Westminster and Elizabeth Tower',
  kind: 'building',
  ready: true,
  origin: [-0.1245759, 51.4993173],
  height: 120.8, // m to the crown finial of the Victoria Tower flagstaff (98.5 + 22.3)
  padM: 175, // the outer ring reaches 162 m from the origin; Elizabeth Tower is inside that
  frontageBearing: 100.19, // the river front looks east-south-east, toward the Thames
};
// Light: honey Anston / Clipsham limestone, pale dressed trim, dark slate and iron roofs, gilt ironwork,
// opal clock dials (`glow`, unshaded: white by day, warm when the faces are lit). The Victoria Tower flag
// is the Union flag (`sign` navy, `red` cross). Night: stone and slate dim, gilt dulls, dials and the
// Ayrton light stay lit.
export const PALETTES = {
  light: {
    stone: '#d4c09a', trim: '#e7d7b6', roof: '#5c656e', glass: '#3a4650',
    gold: '#c6a04a', iron: '#2a2724', glow: '#f4f0e6', sign: '#1a2744', red: '#b4232c',
  },
  dark: {
    stone: '#8d7d64', trim: '#a89878', roof: '#3c444c', glass: '#1a242c',
    gold: '#8c7034', iron: '#1a1816', glow: '#ffd59a', sign: '#24345c', red: '#8e3034',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 is the yard and Embankment terrace beside the Thames. The site is flat floodplain; no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced: Elizabeth Tower 96.3 m, 12.2 m square, dials 6.9 m centred at 54.9 m; Victoria Tower 98.5 m to the flagstaff base and 120.8 m to the crown finial; Central Tower spire 91.4 m; palace about 300 m long. Estimated from photographs and the mapped parts: every other height, the bay rhythm, roof pitches, pinnacles, and the court layout simplified to the large courts plus the hall.',
};
