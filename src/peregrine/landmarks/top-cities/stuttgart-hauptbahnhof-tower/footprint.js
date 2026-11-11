// Exact mapped outer envelopes; ownership excludes adjacent structures. OSM © contributors, ODbL.
export const FOOTPRINTS = [[[9.1826529, 48.7833489], [9.1827574, 48.7834627], [9.1827794, 48.7834553], [9.1829131, 48.7834018], [9.1828924, 48.7833792], [9.1828068, 48.7832864], [9.1827884, 48.7832938], [9.1826724, 48.7833412], [9.1826529, 48.7833489]]];
export const OSM_WAYS = [27153443];
export const CONTROL_POINTS = [[9.1826529, 48.7833489], [9.1827574, 48.7834627]];
import { SPEC } from './config.js';
const c=Math.cos(SPEC.rotationY),s=Math.sin(SPEC.rotationY),k=111320*Math.cos(SPEC.origin[1]*Math.PI/180);
export const LOCAL_RINGS=FOOTPRINTS.map(r=>r.slice(0,r.length-1).map(([lon,lat])=>{const x=(lon-SPEC.origin[0])*k,z=-(lat-SPEC.origin[1])*111320;return [c*x-s*z,s*x+c*z];}));
