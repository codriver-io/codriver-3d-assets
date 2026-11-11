// Exact mapped outer envelopes; ownership excludes adjacent structures. OSM © contributors, ODbL.
export const FOOTPRINTS = [[[26.1036462, 44.4369857], [26.1034798, 44.4369417], [26.1033292, 44.4368892], [26.1031985, 44.4368304], [26.1030722, 44.436751], [26.1031146, 44.4366124], [26.1031763, 44.4364803], [26.1032514, 44.4363501], [26.1033367, 44.4362354], [26.103514, 44.4362352], [26.1036711, 44.436249], [26.1038053, 44.4362754], [26.1039516, 44.4363183], [26.1045066, 44.4365221], [26.1044256, 44.4366776], [26.1045283, 44.4367046], [26.1044149, 44.4369348], [26.104313, 44.4369099], [26.1039609, 44.43761], [26.1040118, 44.437623], [26.1039217, 44.4378021], [26.1038737, 44.4377898], [26.1038297, 44.4378773], [26.10327, 44.4377338], [26.1036462, 44.4369857]]];
export const OSM_WAYS = [41542957];
export const CONTROL_POINTS = [[26.10327, 44.4377338], [26.1036462, 44.4369857]];
import { SPEC } from './config.js';
const c=Math.cos(SPEC.rotationY),s=Math.sin(SPEC.rotationY),k=111320*Math.cos(SPEC.origin[1]*Math.PI/180);
export const LOCAL_RINGS=FOOTPRINTS.map(r=>r.slice(0,r.length-1).map(([lon,lat])=>{const x=(lon-SPEC.origin[0])*k,z=-(lat-SPEC.origin[1])*111320;return [c*x-s*z,s*x+c*z];}));
