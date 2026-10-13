import {PROFILE,ARCHES,ARCH_D} from './sixth-street-viaduct-profile.js';
import {accessPaths} from './sixth-street-viaduct-access.js';
const p=(s,d,y)=>{const q=PROFILE.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
const s=ARCHES[3].center;
const access=accessPaths();
const rampView=id=>{const r=access.find(r=>r.id===id),v=r.samples[Math.floor(r.samples.length/2)];return [[v.x+45,v.y+30,v.z-70],[v.x,v.y,v.z]];};
export const VIEWS={
 overview:[[50,310,720],[0,15,0]],
 facade:[[0,80,-600],[0,15,0]],
 roof:[[-20,1550,0],[-20,0,0]],
 deck:[p(s-120,0,38),p(s+50,0,22)],
 underside:[p(s,65,7),p(s,0,14)],
 tower:[p(s-56,62,38),p(s,ARCH_D,26)],
 detail:[p(s-13,39,28),p(s,ARCH_D,30)],
 helix:rampView('helix'),
 westAccess:rampView('west'),
 westLanding:[p(-30,-20,12),p(35,0,2)],
 eastLanding:[p(PROFILE.BRIDGE_LENGTH-30,25,15),p(PROFILE.BRIDGE_LENGTH,0,0)],
};
