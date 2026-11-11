// Exact mapped outer envelopes; ownership excludes adjacent structures. OSM © contributors, ODbL.
export const FOOTPRINTS = [[[30.5267169, 50.4378784], [30.5267538, 50.4379131], [30.526808, 50.4379325], [30.5268778, 50.4379397], [30.5269489, 50.4379362], [30.5280673, 50.4375185], [30.5278436, 50.4373477], [30.5276076, 50.4371675], [30.5267632, 50.4377372], [30.5267747, 50.4377512], [30.5267288, 50.437782], [30.5267032, 50.4378355], [30.5267169, 50.4378784]]];
export const OSM_WAYS = [23648473, 300328720, 300328721, 300328722, 300328723];
export const CONTROL_POINTS = [[30.5269489, 50.4379362], [30.5280673, 50.4375185]];
import { SPEC } from './config.js';
const c=Math.cos(SPEC.rotationY),s=Math.sin(SPEC.rotationY),k=111320*Math.cos(SPEC.origin[1]*Math.PI/180);
export const LOCAL_RINGS=FOOTPRINTS.map(r=>r.slice(0,r.length-1).map(([lon,lat])=>{const x=(lon-SPEC.origin[0])*k,z=-(lat-SPEC.origin[1])*111320;return [c*x-s*z,s*x+c*z];}));
