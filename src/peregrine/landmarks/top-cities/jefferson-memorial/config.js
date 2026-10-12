import { FOOTPRINTS } from './footprint.js';
// +X east, +Y up, +Z south. Grade at the terrace foot, not Ohio Drive roadway.
export const SPEC = {
  id: 'jefferson-memorial', name: 'Jefferson Memorial', kind: 'building', ready: true,
  origin: [-77.0365547, 38.881383], height: 33.1592, padM: 48,
  frontageBearing: 0.432, rotation: -0.432 * Math.PI / 180,
  floorY: 4, columnHeight: 13.1064, columnDiameter: 1.6002,
  porticoWidth: 31.0896, porticoDepth: 13.716,
  rotundaDiameter: 50.292, domeDiameter: 34.4,
  terrainPad: { rings: FOOTPRINTS, refs: [[-77.03655,38.88178],[-77.03687,38.88139],[-77.03625,38.88139],[-77.03655,38.88113]], datum: 'median', featherM: 7 },
};
export const PALETTES = {
  light: { stone: '#deded5', interior: '#85867b', granite: '#aaa89c', turf: '#61794e', bronze: '#343830', lamp: '#ded5bb' },
  dark: { stone: '#858e95', interior: '#7b817e', granite: '#555f68', turf: '#303e34', bronze: '#45483e', lamp: '#d9c59c' },
};
export const MANIFEST = {
  elevationDatum: 'Local y=0 at terrace foot, chamber floor at 4 m; rigid structure with no absolute/DEM altitude. Roadway-to-apex 129 ft 4 in is a different datum.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'NPS 54 columns, 43 ft column height, 102 ft portico, 19 ft statue; historic booklet 91 ft 8 in interior ceiling plus estimated 4 ft exterior shell. Grade-to-floor, drum tiers, dome curvature, ornaments and interior wall thickness estimated; inscriptions omitted. Mapped rotation baked once. Cityscape and Full 3D world integration not tested yet.',
};
