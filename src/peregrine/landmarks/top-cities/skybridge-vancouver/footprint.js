import { MAPPED_OUTLINE, STATION_RING, STATION_ACCESS, NW_EMBANKMENT_RING } from './skybridge-vancouver-alignment.js';
import { point,lngLat,TOWERS,stations,halfWidth,START,END } from './skybridge-vancouver-profile.js';
// Exact bridge outline plus the original portal footing envelopes outside the narrow guideway.
// Own both adjacent Scott Road access structures to remove intersecting provider blocks.
export const FOOTPRINTS=[MAPPED_OUTLINE,STATION_RING,NW_EMBANKMENT_RING,...STATION_ACCESS.map(p=>p.ring), ...[START-3].map(s=>[[-5,-6.5],[5,-6.5],[5,6.5],[-5,6.5]].map(([u,d])=>{const p=point(s+u,d);return lngLat([p[0],p[2]]);})),[...stations.map(s=>{const p=point(s,-halfWidth(s)-.25);return lngLat([p[0],p[2]]);}),...stations.slice().reverse().map(s=>{const p=point(s,halfWidth(s)+.25);return lngLat([p[0],p[2]]);})],...[START,END].map(s=>[[-3,-5],[3,-5],[3,5],[-3,5]].map(([u,d])=>{const p=point(s+u,d);return lngLat([p[0],p[2]]);})),...TOWERS.map(s=>[[-5,-10],[5,-10],[5,10],[-5,10]].map(([u,d])=>{const p=point(s+u,d);return lngLat([p[0],p[2]]);} ))];
export const OSM_WAYS=[527265987,37226895,425639371,834757714,425639390,923938536,923938537,689527849,...STATION_ACCESS.map(p=>p.id)];
// Rail ways continue beyond this model; the SE boundary is inside the mapped station hall.
// © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
