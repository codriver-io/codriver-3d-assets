// Exact mapped outer envelopes; ownership excludes adjacent structures. OSM © contributors, ODbL.
export const FOOTPRINTS = [[[9.176136, 48.7728402], [9.1761636, 48.7728313], [9.1761609, 48.7728277], [9.1761749, 48.7728231], [9.1761776, 48.7728267], [9.1762285, 48.7728101], [9.1762258, 48.7728066], [9.1762317, 48.7728046], [9.1762345, 48.7728084], [9.1762712, 48.7727964], [9.1762694, 48.772794], [9.1762876, 48.7727881], [9.1762895, 48.7727905], [9.1763097, 48.772784], [9.1763144, 48.7727824], [9.1763628, 48.7728453], [9.1763196, 48.7728639], [9.1763566, 48.7729212], [9.1763662, 48.7729366], [9.176315, 48.7729531], [9.176271, 48.7729672], [9.1762642, 48.7729694], [9.176136, 48.7728402]]];
export const OSM_WAYS = [108689300];
export const CONTROL_POINTS = [[9.1762642, 48.7729694], [9.176136, 48.7728402]];
import { SPEC } from './config.js';
const c=Math.cos(SPEC.rotationY),s=Math.sin(SPEC.rotationY),k=111320*Math.cos(SPEC.origin[1]*Math.PI/180);
export const LOCAL_RINGS=FOOTPRINTS.map(r=>r.slice(0,r.length-1).map(([lon,lat])=>{const x=(lon-SPEC.origin[0])*k,z=-(lat-SPEC.origin[1])*111320;return [c*x-s*z,s*x+c*z];}));
