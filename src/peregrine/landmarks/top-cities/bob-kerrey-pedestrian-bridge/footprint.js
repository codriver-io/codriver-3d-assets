import {OSM_RING,envelope,TOWERS,point,geographic,LANDINGS,landingRing} from './bob-kerrey-pedestrian-bridge-parts.js';
// Mapped pavement outline plus the sourced 24 ft frame / outrigger envelope
// and the two triangular pylon feet. No neighboring building or independent
// Baby Bob extension is owned; the dossier has no building/building:part here.
const foot = t => {
 const ring=[[-1.4742,-1.053],[1.4742,-1.053],[0,1.7269]].map(([s,d])=>{const p=point(t.s+s,0,t.d+d);return geographic(p[0],p[2]);});return [...ring,ring[0]];
};
export const FOOTPRINTS = [OSM_RING,envelope(),...TOWERS.map(foot),...LANDINGS.map(r=>landingRing(r))];
export const OSM_WAYS = [454976793];
