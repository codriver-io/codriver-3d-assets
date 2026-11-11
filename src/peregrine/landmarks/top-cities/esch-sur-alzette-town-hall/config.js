import { FOOTPRINTS } from './footprint.js';
// Geographic yaw from two mapped controls is baked into vertices; local y=0 is rigid foundation grade.
export const SPEC = {
  id: "esch-sur-alzette-town-hall",
  name: "Hôtel de Ville Esch-sur-Alzette",
  kind: "building",
  ready: true,
  origin: [
    5.9846487,
    49.4963099
  ],
  height: 21.2,
  padM: 34,
  frontageBearing: 144.5595393446563,
  rotation: 3.760145380449048
};
SPEC.terrainPad = { rings: FOOTPRINTS, refs: [[5.9844295,49.4960947],[5.9850337,49.496374]], datum: 'median', featherM: 2 };
export const PALETTES = {
  "light": {
    "stone": "#b2a38a",
    "trim": "#c8c1ad",
    "roof": "#525963",
    "glass": "#4d626d",
    "door": "#414d53",
    "sculpture": "#9a8b70"
  },
  "dark": {
    "stone": "#737c7b",
    "trim": "#8d9995",
    "roof": "#313f4c",
    "glass": "#304b5b",
    "door": "#2d424d",
    "sculpture": "#748886"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is rigid foundation grade; no DEM, sea-level height, terrain exaggeration or Mercator stretch is baked into the asset.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Current 1935–1937 Isidore Engler town hall: symmetrical pale stone wings, five tall council-chamber windows, four-pier entrance portico, triangular central pediment, slate hipped roof and dormers. Mapped plan about 53.6 × 20.7 m with an 18.4 m central projection. Overall 21.2 m and floor/roof splits are photographic estimates; OSM has a rounded, unsurveyed 20 m height. The roof includes muted solar-panel fields. Two joined two-figure human relief groups span 79% of the pediment around a blank panel; heraldry, inscription, branding, flags and temporary banners are omitted. Geographic yaw baked once; plaza and neighbouring buildings are excluded. Cityscape: not tested. Full 3D world: not tested."
};
