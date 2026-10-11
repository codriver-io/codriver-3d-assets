import {PROFILE as p,PIERS,START} from './viaduc-de-millau-profile.js';
const q=(s,d,y)=>{const v=p.bridgePoint(s,d,y);return [v.x,v.y,v.z];};
const s=PIERS[1],h=p.deckHeight(s);
export const VIEWS={
 overview:[[1800,580,950],[20,-50,0]],
 facade:[[1950,240,150],[20,-50,0]],
 back:[[-1950,280,-250],[20,-50,0]],
 roof:[[1600,2300,1200],[20,10,0]],
 deck:[q(s-110,-8,p.deckHeight(s-110)+2.4),q(s+160,-7,h+20)],
 tower:[q(s-95,130,h+70),q(s,0,h+37)],
 detail:[q(s+40,85,h-42),q(s,0,h-60)],
 underside:[q(s+110,100,h-155),q(s,0,h-95)],
 footing:[q(s+60,95,h-220),q(s,0,h-236)],
};
