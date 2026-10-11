import { FOOTPRINTS } from './footprint.js';
// Tower axis from OSM 466820799; hall long edge bearing 104°.
export const SPEC = {
  id: 'liberty-memorial', name: 'Liberty Memorial (National WWI Museum)', kind: 'building',
  ready: true, origin: [-94.585953, 39.081066], height: 72.7416,
  towerHeight: 66.1416, courtyardY: 6.6, baseDiameter: 10.9728, topDiameter: 8.5344,
  padM: 88, frontageBearing: 194, nearM: 650,
  terrainPad: { rings: [FOOTPRINTS[0]], datum: 'median', featherM: 8,
    refs: [[-94.58618,39.080704],[-94.58586,39.080641],[-94.58571,39.080665]] },
};
export const PALETTES = {
  light: { stone:'#c6b99e', trim:'#dfd1b4', joint:'#a89a80', glass:'#1e343d', bronze:'#655744', roof:'#758b83', glow:'#c6a37a' },
  dark: { stone:'#696967', trim:'#96918a', joint:'#515557', glass:'#101d26', bronze:'#444642', roof:'#435756', glow:'#ff8b39' },
};
export const MANIFEST = {
  elevationDatum: 'y=0 is estimated lower south museum entrance grade. Memorial Courtyard is y=6.6 m; tower rises 66.1416 m above it. No park hill or absolute altitude baked in.',
  attribution: 'Original procedural mesh by Codriver. Footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '217 ft tower, 36/28 ft taper and 40 ft Guardian Spirits from the National WWI Museum. Hall heights, courtyard rise, steps, urns and abstract sculpture are photo estimates. OSM tower ring maps narrower top; full base stays within memorial envelope. Terrain pad requires separate in-app validation.',
};
