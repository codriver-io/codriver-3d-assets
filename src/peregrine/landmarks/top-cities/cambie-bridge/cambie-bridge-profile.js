import {createBridgeProfile} from '../../bridge-profile.js';
import {SPEC,PALETTES} from './config.js';
import {SB,NB} from './cambie-bridge-mapped.js';
export const DECK=18.5,TAPER=85,CURVE=25;
const clamp=t=>Math.max(0,Math.min(1,t));
const smooth=t=>{t=clamp(t);return t*t*(3-2*t);};
// Distinct station axes preserve the mapped Nelson/Smithe fork and its landings.
export function makeProfile(key,centerline,edges,left,right){
 const base=createBridgeProfile({...SPEC,palette:PALETTES.light,centerline,width:Math.max(Math.abs(left),right)*2+2,
  deck:DECK,roadEdges:[edges],terrainPolicy:'absolute-deck',clipStandardEnds:true,
  lateralBankFit:{blendM:110,terrainClamp:true,clearanceM:0},
  profile:({length})=>[[0,'start'],[length,'end']]});
 const L=base.BRIDGE_LENGTH;
 const station=lat=>base.stationAt([centerline.reduce((best,p)=>Math.abs(p[1]-lat)<Math.abs(best[1]-lat)?p:best,centerline[0])[0],lat]);
 const marine=[station(49.2708),station(49.27305)];
 const blend=s=>Math.min(smooth(s/TAPER),smooth((L-s)/TAPER));
 function rise(u,len,a,b){const g=(b-a)/(len-CURVE);if(u<CURVE)return a+g*u*u/(2*CURVE);if(u>len-CURVE)return b-g*(len-u)**2/(2*CURVE);return a+g*(u-CURVE/2);}
 function deckHeight(s,approaches=[0,0]){s=Math.max(0,Math.min(L,s));if(s<marine[0])return rise(s,marine[0],approaches[0],DECK);if(s>marine[1])return rise(L-s,L-marine[1],approaches[1],DECK);return DECK;}
 const landingEdges=(s,width=6)=>[[-width/2,width/2]];
 function roadEdges(s,joins,sections){const t=1-blend(s),measured=base.roadEdges(s,joins,sections);
  const target=(joins?.[s<L/2?0:1]?.[0]||sections?.some(v=>v.edges?.[0]))?measured[0]:landingEdges(s)[0];return [edges.map((v,i)=>v+(target[i]-v)*t)];}
 const remap=(d,from,to,shoulder=1)=>d<from[0]?to[0]+(d-from[0])*shoulder:d>from[1]?to[1]+(d-from[1])*shoulder:to[0]+(d-from[0])/(from[1]-from[0])*(to[1]-to[0]);
 const authoredLateral=(s,d)=>remap(d,edges,roadEdges(s)[0],blend(s));
 const fittedLateral=(s,d,joins,sections)=>remap(d,roadEdges(s)[0],roadEdges(s,joins,sections)[0]);
 function bridgeRoadHeight(lng,lat,heading,approaches,joins,sections){const v=base.bridgeLocal(lng,lat),q=base.projectBridge(v.x,v.z),[a,b]=roadEdges(q.s,joins,sections)[0];
  if(q.beyond||q.lateral<a-.3||q.lateral>b+.3)return null;
  if(Number.isFinite(heading)){const h=heading*Math.PI/180;if(Math.abs(Math.sin(h)*q.tx-Math.cos(h)*q.tz)<.8)return null;}return deckHeight(q.s,approaches);}
 // Three estimated marine bays of approximately 83.4m, shorter 33m land bays.
 const piers=[marine[0],marine[0]+(marine[1]-marine[0])/3,marine[0]+2*(marine[1]-marine[0])/3,marine[1]];
 for(let s=marine[0]-33;s>100;s-=33)piers.push(s);for(let s=marine[1]+33;s<L-85;s+=33)piers.push(s);piers.sort((a,b)=>a-b);
 const p={...base,key,L,marine,piers,left,right,edges,blend,landingEdges,roadEdges,authoredLateral,fittedLateral,deckHeight,bridgeRoadHeight,
  bridgePoint:(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s)),knots:[[0,'start'],[marine[0],DECK],[marine[1],DECK],[L,'end']]};
 p.ring=()=>{const stations=[...new Set([0,L,...base.ALIGNMENT.map(v=>v.s),...Array.from({length:Math.ceil(L/10)},(_,i)=>i*10)])].sort((a,b)=>a-b);
  const side=d=>stations.map(s=>{const v=p.bridgePoint(s,authoredLateral(s,d)+(d<0?-.5:.5));return p.bridgeLngLat(v.x,v.z);});const ring=[...side(left),...side(right).reverse()];return [...ring,ring[0]];};
 p.CHAMPLAIN.buildingFootprints=[p.ring()];return p;
}
export const PROFILES=[makeProfile('sb',SB,[-3.3,3.3],-8.8,5.15),makeProfile('nb',NB,[-5.1,5.1],-5.35,10.4)];
export const PROFILE={...PROFILES[0],resampleBridgeLine:line=>PROFILES.reduce((v,p)=>p.resampleBridgeLine(v),line)};
