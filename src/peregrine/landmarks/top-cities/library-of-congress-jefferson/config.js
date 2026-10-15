// Library of Congress, Thomas Jefferson Building, First Street SE, Washington, D.C.
// Origin: area centroid of OSM way 42363196 (relation 1029374). The walls run
// 0.171° north of east; that yaw is baked into the geometry. The principal
// front faces the Capitol, bearing about 270.17°.
export const SPEC = {
  id: 'library-of-congress-jefferson',
  name: 'Library of Congress (Thomas Jefferson Building)',
  kind: 'building',
  ready: true,
  origin: [-77.0047094, 38.8886833],
  height: 195 * 0.3048, // gold Flame of Knowledge, the 195 ft dome Casey and Green built
  padM: 120,
  frontageBearing: 270.17,
  rotationDeg: 0.171,
};

// Day: cool New Hampshire granite, blue-grey metal roofs, green copper dome,
// gilt flame. Night: floodlit stone stays pale; `light` is glass (dark by day,
// warm when the rooms are lit). The dome reads green in both themes.
export const PALETTES = {
  light: {
    stone: '#d2d4d0',
    stone2: '#9aa29c',
    roof: '#3c5160',
    copper: '#4a7362',
    patina: '#2a4a3c',
    gold: '#f0c84a',
    light: '#31424c',
    bronze: '#8d6b45',
  },
  dark: {
    stone: '#b7bec2',
    stone2: '#6e777c',
    roof: '#2c3d4a',
    copper: '#356656',
    patina: '#1e352c',
    gold: '#ffe08a',
    light: '#f3d7a6',
    bronze: '#d4b483',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 is the First Street sidewalk at the Court of Neptune. No absolute altitude and no terrain is baked in.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced: 195 ft exterior to the Flame of Knowledge, copper dome gilded until the 1930s, gilt finial, Beaux-Arts granite, split stair and Court of Neptune, three arched bronze portals. Storey heights, bay pitch, dome profile between the 195 ft tip and the roof, court rectangles and the east pavilion steps are estimated from the mapped outline and photographs.',
};
