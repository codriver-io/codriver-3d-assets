import { PROFILE as p, START, END, PIERS } from './frederick-douglass-memorial-bridge-profile.js';
const pt=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return[q.x,q.y,q.z];},m=(START+END)/2;
export const VIEWS={
 overview:[pt(m,510,220),pt(m,0,20)], facade:[pt(m,560,52),pt(m,0,20)],
 back:[pt(m,-560,52),pt(m,0,20)], roof:[pt(m,25,590),pt(m,0,14)],
 deck:[pt(START+60,0,17),pt(m,0,28)], underside:[pt(m,75,4),pt(m,0,10)],
 tower:[pt(PIERS[0]-36,65,14),pt(PIERS[0],0,10)], detail:[pt(m-20,50,35),pt(m,18,43)],
};
