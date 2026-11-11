// Exact mapped outer envelopes; ownership excludes adjacent structures. OSM © contributors, ODbL.
export const FOOTPRINTS = [[[11.5535937, 48.1745164], [11.5536527, 48.174542], [11.5537207, 48.1745537], [11.5537861, 48.174551], [11.5538471, 48.1745356], [11.5538986, 48.1745087], [11.5539358, 48.1744728], [11.5539507, 48.1744411], [11.5539553, 48.1744312], [11.5539554, 48.1744014], [11.5539554, 48.1743876], [11.5539361, 48.1743459], [11.553899, 48.17431], [11.5538477, 48.174283], [11.5537818, 48.1742667], [11.5537115, 48.1742653], [11.5536442, 48.1742789], [11.5535869, 48.1743061], [11.5535457, 48.174344], [11.5535248, 48.1743887], [11.5535262, 48.1744356], [11.5535501, 48.1744797], [11.5535937, 48.1745164]]];
export const OSM_WAYS = [18894695, 164084343, 164084344, 1049578248];
export const CONTROL_POINTS = [[11.5535937, 48.1745164], [11.5536527, 48.174542]];
import { SPEC } from './config.js';
const c=Math.cos(SPEC.rotationY),s=Math.sin(SPEC.rotationY),k=111320*Math.cos(SPEC.origin[1]*Math.PI/180);
export const LOCAL_RINGS=FOOTPRINTS.map(r=>r.slice(0,r.length-1).map(([lon,lat])=>{const x=(lon-SPEC.origin[0])*k,z=-(lat-SPEC.origin[1])*111320;return [c*x-s*z,s*x+c*z];}));
