import { PROFILE as p,T,L } from './basarab-overpass-profile.js';
const q=(s,d,y)=>{const a=p.bridgePoint(s,d,y);return [a.x,a.y,a.z];};
export const VIEWS={southLanding:[q(0,-90,65),q(22,0,0)],northLanding:[q(L,85,55),q(L-22,0,0)],overview:[q(T+260,240,185),q(T+35,0,35)],facade:[q(T+185,105,95),q(T+50,0,48)],roof:[q(T+40,80,260),q(T+45,0,10)],deck:[q(T+190,14,23),q(T,8,45)],tower:[q(T-80,-100,90),q(T,0,64)],underside:[q(T+160,90,8),q(T+65,0,12)],back:[q(T-230,-170,115),q(T+15,0,40)],detail:[q(T+160,40,48),q(T+110,0,22)]};
