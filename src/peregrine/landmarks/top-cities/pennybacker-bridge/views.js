import { PROFILE, ARCH_START, ARCH_END, DECK, LENGTH } from './pennybacker-bridge-profile.js';
const p=(s,d,y)=>{const q=PROFILE.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
const mid=(ARCH_START+ARCH_END)/2;
export const VIEWS={
 overview:[p(mid-120,-310,190),p(mid,0,25)],
 facade:[p(mid,-380,45),p(mid,0,25)],
 back:[p(mid+80,360,120),p(mid,0,25)],
 roof:[p(mid,40,440),p(mid,0,0)],
 deck:[p(ARCH_START+12,-5,DECK+2),p(mid,-5,DECK+18)],
 underside:[p(mid,60,5),p(mid,0,DECK-2)],
 tower:[p(ARCH_START+22,-55,32),p(ARCH_START+29,-12.8,26)],
};
