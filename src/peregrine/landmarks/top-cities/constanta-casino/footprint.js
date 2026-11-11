// Exact mapped outer envelopes; ownership excludes adjacent structures. OSM © contributors, ODbL.
export const FOOTPRINTS = [[[28.6638233, 44.1705265], [28.6638223, 44.1705641], [28.6637416, 44.1706757], [28.6637188, 44.1706675], [28.6637175, 44.1706839], [28.6637036, 44.1707003], [28.6636819, 44.1707102], [28.6636522, 44.170713], [28.6636176, 44.1707024], [28.6635998, 44.1706839], [28.6631668, 44.1705187], [28.6632084, 44.170457], [28.6631421, 44.1704329], [28.6632345, 44.1703213], [28.6632827, 44.1703415], [28.6633157, 44.1703009], [28.6633909, 44.1703324], [28.6634269, 44.1702881], [28.6637774, 44.1704339], [28.6637872, 44.1704608], [28.6638181, 44.170476], [28.6638295, 44.1704935], [28.6638302, 44.1705102], [28.6638233, 44.1705265]]];
export const OSM_WAYS = [24786437];
export const CONTROL_POINTS = [[28.6635998, 44.1706839], [28.6631668, 44.1705187]];
import { SPEC } from './config.js';
const c=Math.cos(SPEC.rotationY),s=Math.sin(SPEC.rotationY),k=111320*Math.cos(SPEC.origin[1]*Math.PI/180);
export const LOCAL_RINGS=FOOTPRINTS.map(r=>r.slice(0,r.length-1).map(([lon,lat])=>{const x=(lon-SPEC.origin[0])*k,z=-(lat-SPEC.origin[1])*111320;return [c*x-s*z,s*x+c*z];}));
