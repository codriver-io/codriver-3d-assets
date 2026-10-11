import { WAYS } from './ponts-jumeaux-alignment.js';
import { HERITAGE, NORTH, SOUTH, PANEL_FRAME, WING_FRAME } from './ponts-jumeaux-profile.js';
// No building=* is replaced. Rings are the actual authored replacement envelopes,
// including the Lucas wall; OSM's protected outline covers only the central bridge.
const stripRing=(p,a,c,half)=>{
 const s=[a];for(let v=a+3;v<c;v+=3)s.push(v);s.push(c);
 const point=(v,d)=>{const q=p.bridgePoint(v,d);return p.bridgeLngLat(q.x,q.z);};
 return [...s.map(v=>point(v,-half)),...s.reverse().map(v=>point(v,half))];
};
export const FOOTPRINTS=[stripRing(HERITAGE,0,HERITAGE.BRIDGE_LENGTH,4.95),stripRing(PANEL_FRAME,0,PANEL_FRAME.BRIDGE_LENGTH,1.6),stripRing(WING_FRAME,0,WING_FRAME.BRIDGE_LENGTH,.7),... [NORTH,SOUTH].map(p=>stripRing(p,0,p.BRIDGE_LENGTH,p.halfWidth+0.25))];
export const OSM_WAYS=[905487561,80140902,1454773594,441406351,22689673];
export const HISTORIC_OSM_OUTLINE=WAYS[905487561];
// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
