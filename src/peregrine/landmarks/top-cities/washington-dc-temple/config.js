// 1974 temple exterior, following the 2022 renovation; source facts in the asset doc.
import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  id: 'washington-dc-temple', name: 'Washington D.C. Temple', kind: 'building',
  ready: true,
  origin: [-77.0656083, 39.014052],
  height: 87.7824, wallHeight: 40, statueHeight: 5.4864,
  padM: 54, frontageBearing: 359.72,
  // Rigid footing; median avoids the depressed wooded slopes around this hilltop site.
  // Resident DEM coverage and edge feather remain an integration gate.
  terrainPad: { rings: FOOTPRINTS,
    refs: [[-77.0656083,39.014052],[-77.0656083,39.014501],[-77.0656083,39.014677]],
    datum: 'median', featherM: 10 },
};
export const PALETTES = {
  light: { stone:'#e8e6df', flute:'#c3c4bc', roof:'#929b9c', glass:'#a5b7ba', lamp:'#bfa25f', bronze:'#806741', glow:'#b9c7c0' },
  dark: { stone:'#a9b7bd', flute:'#84969f', roof:'#505f6d', glass:'#617b8d', lamp:'#c9ad65', bronze:'#756446', glow:'#e1d6a6' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat footing y=0; east/up/south metres. No DEM or absolute elevation baked in.',
  attribution: 'Original procedural geometry by Codriver. Geographic data © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '87.7824 m (288 ft) including the 5.4864 m (18 ft) Moroni statue is sourced. Mapped plans and six tower anchors are retained; white tower tiers, lesser spire heights, marble fluting and the untagged enclosed link are photo estimates. OSM height=100 is not used. Rotation is already in the exported mapped geometry. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
