import {PROFILE as p,TOWERS,MID,DECK_H,L,BRIDGE_END} from './dames-point-bridge-profile.js';
const q=(s,d,y)=>{const v=p.bridgePoint(s,d,y);return [v.x,v.y,v.z];};
export const VIEWS={
 overview:[q(MID-500,-1100,320),q(MID+150,0,40)],
 facade:[q(MID,-560,18),q(MID,0,62)],
 back:[q(MID+150,620,30),q(MID,0,62)],
 roof:[q(L/2,-200,4200),q(L/2,0,0)],
 tower:[q(TOWERS[0]-230,-170,95),q(TOWERS[0],0,85)],
 deck:[q(TOWERS[0]-260,6,DECK_H+5),q(TOWERS[0]+80,6,DECK_H+40)],
 underside:[q(TOWERS[1]+60,-70,8),q(TOWERS[1],0,40)],
 detail:[q(TOWERS[1]-35,-70,125),q(TOWERS[1],-10,110)],
 approach:[q(BRIDGE_END-300,-260,40),q(BRIDGE_END,0,15)],
};
