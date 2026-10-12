import { PROFILE as p,L } from './golden-ears-bridge-profile.js';
// The modeled road/cycle-path envelope replaces only this elevated crossing.
// No building ways exist in the supplied extract. Nearby docks remain provider geometry.
const stations=[0,...p.ALIGNMENT.map(v=>v.s),L];
const at=(s,d)=>{const q=p.bridgePoint(s,d);return p.bridgeLngLat(q.x,q.z);};
export const FOOTPRINTS=[[...stations.map(s=>at(s,-16.7)),...stations.slice().reverse().map(s=>at(s,16.7))]];
export const OSM_WAYS=[128363957,181029022,460814862,460814863,567046707,567046714,128363956,133593023,1349938060];
// © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright
