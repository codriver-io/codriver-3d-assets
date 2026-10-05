// United States Capitol, Capitol Hill, Washington, D.C.
// Origin: area centroid of OSM way 66418809 (the building outline), measured in the Peregrine
// mercator frame. The walls run 0.12 degrees east of true north; rotation is baked here.
// East front (the principal entrance) looks toward bearing 90.12.
export const SPEC = {
  id: 'united-states-capitol',
  name: 'United States Capitol',
  kind: 'building',
  ready: true,
  origin: [-77.0090014, 38.8898134],
  height: 87.78, // 288 ft, east-front baseline to the top of the Statue of Freedom (Architect of the Capitol)
  padM: 125,
  frontageBearing: 90.12,
  terrainPad: {
    rings: [[[-77.009576,38.88878],[-77.008325,38.88878],[-77.008325,38.890845],[-77.009576,38.890845]]],
    refs: [[-77.00868,38.88981],[-77.00907,38.88981],[-77.00896,38.89061],[-77.00896,38.88902]],
    datum: 'median', featherM: 10,
  },
  rotationDeg: -0.12, // building +X (east) anticlockwise from true east, seen from above
};

// Day: white marble and painted cast iron. Night: the dome and facades are floodlit, so the
// stone stays pale; `light` is window glass (dark by day, warm when the rooms are lit) and
// `lamp` is the tholos glazing (the in-session lantern), darker than the stone by day.
export const PALETTES = {
  light: {
    stone: '#f2efe6',
    stone2: '#d5cec1',
    roof: '#849b9d',
    bronze: '#5b4838',
    light: '#3d4a56',
    lamp: '#3d4a56',
  },
  dark: {
    stone: '#ddd9ce',
    stone2: '#b4b0a5',
    roof: '#526873',
    bronze: '#9a7048',
    light: '#f0d09a',
    lamp: '#ffe3ad',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 is the east-front plaza, the Architect of the Capitol baseline for the 288 ft height. No absolute altitude and no terrain is baked in.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced: 288 ft to the Statue of Freedom, 751 ft 4 in north–south, 350 ft greatest width, dome exterior diameter 135 ft, 36 peristyle columns, 12 tholos columns; statue 19.5 ft on an 18.5 ft pedestal. The 22-column east portico, storey heights, dome profile between the sourced 135 ft diameter and 210 ft tholos balcony, window bays and west stair are estimated from the mapped outline and photographs.',
};
