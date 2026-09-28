// Mapped base outline © OpenStreetMap contributors, ODbL 1.0.
// OSM API map extract retrieved 2026-09-27. Dimensions/datum: docs/3d-place-ville-marie.md.
import { lngToMercX, latToMercY, mercStretch, mercXToLng, mercYToLat } from '../facade/geo.js';

export const PLACE_VILLE_MARIE = {
  id: 'place-ville-marie', name: 'Place Ville Marie + L’Anneau',
  origin: [-73.5686328, 45.50158465],
  height: 188.1, towerHalfSpan: 43, wingHalfWidth: 12.5,
  siteAngle: 0.6026788354713581,
  footprintWay: 108457145,
  ring: { origin: [-73.5700011, 45.5014131], node: 11191781037,
    diameter: 30, tubeRadius: 0.45, centerHeight: 18.5 },
  datum: 'Y=0 is local flat-map grade, not sea level; plaza rises to 1.8 m on a solid plinth. Tower height 188.1 m includes the crown; beacon reaches 191.1 m.',
};
export const PVM_FOOTPRINT = [[-73.5694371,45.5014818],[-73.5690593,45.5012996],[-73.5690476,45.501313],[-73.5689453,45.5012649],[-73.568831,45.5012112],[-73.5688414,45.5012002],[-73.568474,45.5010204],[-73.5682279,45.5012772],[-73.5682436,45.5012844],[-73.5681617,45.5013671],[-73.5680908,45.5014386],[-73.5680779,45.5014305],[-73.5678285,45.5016875],[-73.568194,45.5018636],[-73.5682061,45.5018526],[-73.5683004,45.5018997],[-73.5684212,45.5019566],[-73.568409,45.5019677],[-73.5686067,45.5020643],[-73.5687715,45.5021448],[-73.5690237,45.5018874],[-73.5690058,45.5018814],[-73.5690754,45.5018099],[-73.5691508,45.5017324],[-73.5691716,45.5017421],[-73.5694371,45.5014818]];
export const PVM_STRETCH = mercStretch(PLACE_VILLE_MARIE.origin[1]);
const ox = lngToMercX(PLACE_VILLE_MARIE.origin[0]), oz = -latToMercY(PLACE_VILLE_MARIE.origin[1]);
const c = Math.cos(PLACE_VILLE_MARIE.siteAngle), s = Math.sin(PLACE_VILLE_MARIE.siteAngle);
export function pvmLocal(lng, lat) { return [(lngToMercX(lng)-ox)/PVM_STRETCH, (-latToMercY(lat)-oz)/PVM_STRETCH]; }
export function pvmLngLat(x, z) { return [mercXToLng(ox+x*PVM_STRETCH), mercYToLat(-oz-z*PVM_STRETCH)]; }
// Authoring site axes: u toward René-Lévesque (SE), v toward Mansfield (SW).
export function pvmSite(u, y, v) { return [u*c-v*s, y, u*s+v*c]; }
export function pvmUnsite(x,z) { return [x*c+z*s,-x*s+z*c]; }
export const PVM_RING_SITE = pvmUnsite(...pvmLocal(...PLACE_VILLE_MARIE.ring.origin));
export const PVM_PALETTES = {
  light: { concrete:'#c7c5ba', lattice:'#b9bec1', glass:'#34434a', roof:'#828886', paint:'#ced2d0', rail:'#5a6266', museum:'#a3a9a9', stone:'#9f9f95', iron:'#ebe5d5', steel:'#fff0d0' },
  dark: { concrete:'#77838c', lattice:'#89979e', glass:'#263d4c', roof:'#4d5965', paint:'#b8cbd4', rail:'#637482', museum:'#526676', stone:'#596975', iron:'#ded4b9', steel:'#ffe8ab' },
};
