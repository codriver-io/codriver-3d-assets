import { FOOTPRINTS } from './footprint.js';
// Pedestal axis fitted to OSM part 1421908684; the front faces the Dnipro (NE).
export const SPEC = {
  id: 'motherland-monument', name: 'Motherland Monument', kind: 'building', ready: true,
  origin: [30.563060582456142,50.426552964912275], height: 102, padM: 82, frontageBearing: 56.5,
  figureBaseM: 40, figureHeightM: 62, swordLengthM: 16, shieldHeightM: 13, shieldWidthM: 8,
  terrainPad: { rings: FOOTPRINTS, datum: 'median', featherM: 8,
    refs: [[30.5630606,50.426553],[30.56318,50.42655],[30.56294,50.42655],[30.56306,50.42663],[30.56306,50.42648]] },
};
export const PALETTES = {
  light: { steel: '#aaaead', pedestal: '#737777', museum: '#918a7e', roof: '#73765e', glass: '#37464b', emblem: '#68716e' },
  dark: { steel: '#899699', pedestal: '#59666d', museum: '#63717a', roof: '#505e59', glass: '#243742', emblem: '#4d626b' },
};
export const MANIFEST = {
  elevationDatum: 'Local y=0 at museum entrance/plaza grade; rigid base, no hill or absolute elevation baked into the GLB.',
  attribution: 'Original procedural geometry. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Post-2023 Ukrainian trident version. Rotation baked once: front 56.5° from north. Cityscape and Full 3D world not tested; hillside pad/entrance residuals require separate integration review.',
};
