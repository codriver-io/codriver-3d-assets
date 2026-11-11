// Exact mapped outer envelopes; ownership excludes adjacent structures. OSM © contributors, ODbL.
export const FOOTPRINTS = [[[11.5819684, 48.1523404], [11.5820418, 48.1523242], [11.5821179, 48.1523073], [11.5821918, 48.152291], [11.582269, 48.1522739], [11.582312, 48.1523602], [11.5822349, 48.1523773], [11.5821689, 48.1523919], [11.5821606, 48.1523937], [11.5820861, 48.1524102], [11.5820113, 48.1524268], [11.5819684, 48.1523404]], [[11.582319409829266, 48.152368469781074], [11.582267753808624, 48.15226443527797], [11.581960990170733, 48.152332230218924], [11.582012646191375, 48.15243626472203], [11.582319409829266, 48.152368469781074]]];
export const OSM_WAYS = [22727580];
export const CONTROL_POINTS = [[11.5820113, 48.1524268], [11.5819684, 48.1523404]];
import { SPEC } from './config.js';
const c=Math.cos(SPEC.rotationY),s=Math.sin(SPEC.rotationY),k=111320*Math.cos(SPEC.origin[1]*Math.PI/180);
export const LOCAL_RINGS=FOOTPRINTS.map(r=>r.slice(0,r.length-1).map(([lon,lat])=>{const x=(lon-SPEC.origin[0])*k,z=-(lat-SPEC.origin[1])*111320;return [c*x-s*z,s*x+c*z];}));
