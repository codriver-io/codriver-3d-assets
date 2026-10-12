import clipping from 'polygon-clipping';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { SPEC } from './config.js';
import { FOOTPRINTS, OSM_WAYS } from './footprint.js';
const k = mercStretch(SPEC.origin[1]), ox = lngToMercX(SPEC.origin[0]), oz = -latToMercY(SPEC.origin[1]);
export const local = ([lng, lat]) => [(lngToMercX(lng) - ox) / k, (-latToMercY(lat) - oz) / k];
export const RINGS = Object.fromEntries(OSM_WAYS.map((id, i) => [id, FOOTPRINTS[i].map(local)]));
const roof = RINGS[360433185], len = Math.hypot(roof[2][0]-roof[1][0], roof[2][1]-roof[1][1]);
export const U = [(roof[2][0]-roof[1][0])/len, (roof[2][1]-roof[1][1])/len], V = [-U[1], U[0]];
export const xyz = (u,y,v) => [u*U[0]+v*V[0],y,u*U[1]+v*V[1]];
export const uv = ([x,z]) => [x*U[0]+z*U[1],x*V[0]+z*V[1]];
export const union = ids => clipping.union(...ids.map(id => [RINGS[id]]));
export const difference = clipping.difference;
export const TIERS = [
  { y0:0,y1:15,plan:union([139571554]) },
  { y0:15,y1:40,plan:union([360433180,360433181,360433184]) },
  { y0:40,y1:45,plan:union([360433182,360433183,360433184,361647573,361647575,361647576]) },
  { y0:45,y1:50,plan:union([360433182,360433183,360433184,361647574,361647576]) },
  { y0:50,y1:60,plan:union([360433182,360433183,360433184]) },
  { y0:60,y1:80,plan:union([360433184]) },
];
