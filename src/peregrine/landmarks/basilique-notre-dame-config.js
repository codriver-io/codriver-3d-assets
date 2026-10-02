import { lngToMercX, latToMercY, mercStretch, mercXToLng, mercYToLat } from '../facade/geo.js';
import { NOTRE_DAME_FOOTPRINT } from './basilique-notre-dame-footprint.js';

export const NOTRE_DAME = {
  id: 'basilique-notre-dame', name: 'Basilique Notre-Dame de Montréal',
  origin: [-73.55659905, 45.50465125], rotation: 1.105663017477769,
  footprint: NOTRE_DAME_FOOTPRINT, osmWay: 4320792,
  width: 41, naveLength: 77, totalLength: 109.5, height: 66,
};
export const NOTRE_DAME_PALETTES = {
  light: { stone: '#706e67', concrete: '#99968a', roof: '#6c7673', glass: '#344443', iron: '#3d3530', museum: '#65716b' },
  dark: { stone: '#667981', concrete: '#9ba6a7', roof: '#3c505b', glass: '#42666e', iron: '#303d44', museum: '#586971' },
};
export const ND_STRETCH = mercStretch(NOTRE_DAME.origin[1]);
export const ND_OX = lngToMercX(NOTRE_DAME.origin[0]), ND_OZ = -latToMercY(NOTRE_DAME.origin[1]);
// u is across the façade toward Saint-Sulpice; v follows the nave to the rear.
// Only the authoring frame rotates; exported vertices are east/up/south.
export function notreDamePoint(u, y, v) {
  const c = Math.cos(NOTRE_DAME.rotation), s = Math.sin(NOTRE_DAME.rotation);
  return [u*c + v*s, y, -u*s + v*c];
}
export function notreDameLngLat(u, v) {
  const [x,,z] = notreDamePoint(u, 0, v);
  return [mercXToLng(ND_OX + x*ND_STRETCH), mercYToLat(-ND_OZ-z*ND_STRETCH)];
}
