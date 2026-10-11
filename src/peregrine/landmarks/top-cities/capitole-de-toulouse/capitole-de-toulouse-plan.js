import { SPEC } from './config.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
// Control points (1.4438694,43.6047453) → (1.4439014,43.6045964):
// mapped main-facade tangent bearing 171.2°, outward normal west-southwest.
const A = 8.8 * Math.PI / 180;
export const U = [Math.sin(A), Math.cos(A)];
export const V = [-Math.cos(A), Math.sin(A)];
export const world = (u,y,v) => [U[0]*u+V[0]*v,y,U[1]*u+V[1]*v];
export const uv = (x,y,z) => [U[0]*x+U[1]*z,y,V[0]*x+V[1]*z];
export const local = ([lng,lat]) => {
  const k = mercStretch(SPEC.origin[1]);
  const x = (lngToMercX(lng)-lngToMercX(SPEC.origin[0]))/k;
  const z = (latToMercY(SPEC.origin[1])-latToMercY(lat))/k;
  return [U[0]*x+U[1]*z,V[0]*x+V[1]*z];
};
export const COLUMNS = [-11.7,-10.1,-6.9,-5.3,0.3,1.9,5.1,6.7];
export const CENTER = -2.5;
