// Exact mapped outer envelopes; ownership excludes adjacent structures. OSM © contributors, ODbL.
export const FOOTPRINTS = [[[35.2214618, 31.7745658], [35.221442, 31.7747495], [35.2217647, 31.7747745], [35.2217804, 31.7746281], [35.221512, 31.7746073], [35.22154, 31.774347], [35.2215527, 31.7742281], [35.2215747, 31.7740229], [35.221877, 31.7740464], [35.2218937, 31.7738912], [35.2212949, 31.7738447], [35.2212671, 31.774103], [35.2213987, 31.7741133], [35.2213648, 31.774429], [35.2212368, 31.774419], [35.221223, 31.7745472], [35.2214618, 31.7745658]]];
export const OSM_WAYS = [44169052];
export const CONTROL_POINTS = [[35.2218937, 31.7738912], [35.2212949, 31.7738447]];
import { SPEC } from './config.js';
const c=Math.cos(SPEC.rotationY),s=Math.sin(SPEC.rotationY),k=111320*Math.cos(SPEC.origin[1]*Math.PI/180);
export const LOCAL_RINGS=FOOTPRINTS.map(r=>r.slice(0,r.length-1).map(([lon,lat])=>{const x=(lon-SPEC.origin[0])*k,z=-(lat-SPEC.origin[1])*111320;return [c*x-s*z,s*x+c*z];}));
