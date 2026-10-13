import { SPEC } from './config.js';
import { FOOTPRINTS } from './footprint.js';
// Local equirectangular metric frame; at this 170 m site its error is below 2 cm.
export const local = ([lng, lat]) => [(lng-SPEC.origin[0])*111320*Math.cos(SPEC.origin[1]*Math.PI/180), -(lat-SPEC.origin[1])*111320];
export const RINGS = FOOTPRINTS.map(r => r.map(local));
export const TOWER = [[-123.1097118, 49.2780861], [-123.1096454, 49.2780496], [-123.1095835, 49.2779497], [-123.1095477, 49.277869], [-123.1095575, 49.2777776], [-123.1095868, 49.2776841], [-123.1096389, 49.277614], [-123.1096773, 49.2775823], [-123.1097365, 49.2776062], [-123.1097938, 49.2776293], [-123.1100435, 49.2777301], [-123.1101221, 49.277768], [-123.1101435, 49.2778145], [-123.1101257, 49.2778563], [-123.1101057, 49.2778752], [-123.1100865, 49.2778934], [-123.1100331, 49.2779236]] .map(local);
export const DRUM = { x: -3, z: -54, r: 16, height: 32 };
export function inside(p, ring) { let yes=false; for(let i=0,j=ring.length-1;i<ring.length;j=i++) {const a=ring[i], b=ring[j]; if((a[1]>p[1])!==(b[1]>p[1]) && p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0]) yes=!yes;} return yes; }
