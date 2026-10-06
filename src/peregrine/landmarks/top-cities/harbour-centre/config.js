import { FOOTPRINTS } from './footprint.js';
// Harbour Centre, completed 1977, 555 W Hastings Street; origin is the mapped mast axis.
export const SPEC = {
  id: 'harbour-centre', name: 'Harbour Centre (Vancouver Lookout)', kind: 'building',
  ready: true,
  origin: [-123.11221471052632, 49.28468226842105],
  height: 177.1, padM: 85, frontageBearing: 224.367,
  angle: 0.7964502720107914, officeRoofM: 116, crownDiameterM: 38.5,
  rangeM: 6500, minZoom: 12.5, nearM: 650,
  terrainPad: { rings: [FOOTPRINTS[1]], refs: FOOTPRINTS[1], datum: 'median', featherM: 8 },
};
export const PALETTES = {
  light: { concrete: '#a8957c', sill: '#cec5b4', glass: '#26363d', shadow: '#66645e',
    metal: '#b9bcb6', heritage: '#b4a084', glow: '#56636a', red: '#be3432' },
  dark: { concrete: '#635d55', sill: '#7e8a92', glass: '#111e29', shadow: '#35434e',
    metal: '#899ba6', heritage: '#5e626c', glow: '#e3c78f', red: '#8e3139' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local grade y=0; no terrain or sea-level elevation baked in; bounded median terrain pad pending app validation.',
  attribution: 'Original procedural mesh. Mapped outline and building parts © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '116 m office roof, 38.5 m crown envelope and 177 m mast follow mapped parts; 177.1 m tip follows published pinnacle convention. Crown glazing/soffit, facade recesses, lifts, aerial collars and podium details are photo estimates. Published 147 m architectural height and advertised 168 m lookout elevation use different datums; neither is the office roof height. Entrances have a reported 6.4 m grade difference: flat export simplifies the podium base; terrain integration remains untested.',
};
