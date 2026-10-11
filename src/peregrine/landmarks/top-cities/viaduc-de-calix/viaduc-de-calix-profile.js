import { createBridgeProfile } from '../../bridge-profile.js';
import { CENTERLINE, STRUCTURE_LINE } from './viaduc-de-calix-alignment.js';
import { SPEC, PALETTES } from './config.js';
export const SPANS = [50.3,70,70,113,156,113,70,70,70,70,70,70,70,70,50.3];
export const STRUCTURAL_LENGTH = 1182.6, TOP = 38, BOX_CENTRES = [-4.8,4.8], BOX_WIDTH = 3.82;
const frame = createBridgeProfile({ ...SPEC, width: 23.39, clipStandardEnds: true,
  centerline: CENTERLINE, palette: PALETTES.light, roadEdges: [[-6.75,-0.45],[0.45,6.75]],
  roadEdgesAt: s => [[-halfWidth(s)+1.5,-0.45],[0.45,halfWidth(s)-1.5]],
  profile: ({ length }) => [[0,'start'],[500,TOP],[length,'end']],
});
export const LENGTH = frame.BRIDGE_LENGTH, STRUCTURE_START = frame.stationAt(STRUCTURE_LINE[0]);
export const STRUCTURE_END = frame.stationAt(STRUCTURE_LINE.at(-1));
export const PIER_S = [STRUCTURE_START];
for (const span of SPANS) PIER_S.push(PIER_S.at(-1)+span);
export const MAIN_PIERS = [PIER_S[4],PIER_S[5]], CREST = (MAIN_PIERS[0]+MAIN_PIERS[1])/2;
export function halfWidth(s) {
  // Original 1976 cross-section opens to six lanes at the southern interchange.
  const u = Math.max(0,Math.min(1,(s-(STRUCTURE_END-150))/150));
  const taper = s>STRUCTURE_END ? Math.max(0,1-(s-STRUCTURE_END)/(LENGTH-STRUCTURE_END)) : 1;
  return 8.25+(11.695-8.25)*u*u*(3-2*u)*taper;
}
// Flat Cityscape: 25 m end and 50 m crest vertical curves, constant grade between.
// The same fixed crest in world mode joins independently sampled shore datums.
export function deckHeight(s, approaches=[0,0]) {
  s=Math.max(0,Math.min(LENGTH,s));
  const north=s<=CREST, run=north?CREST:LENGTH-CREST, u=north?s:LENGTH-s, foot=approaches[north?0:1];
  const k=25,c=50,g=(TOP-foot)/(run-(k+c)/2);
  if(u<k) return foot+g*u*u/(2*k);
  if(run-u<c) return TOP-g*(run-u)**2/(2*c);
  return foot+g*(u-k/2);
}
export function girderDepth(s) {
  const next=PIER_S.findIndex(p=>p>s);
  const i=next<0?SPANS.length-1:Math.max(0,next-1);
  const a=PIER_S[i],c=PIER_S[i+1],t=Math.max(0,Math.min(1,(s-a)/(c-a)));
  const peak=k=>k===4||k===5?9.7:4;
  const mid=i===4?2.6:1.9;
  return t<0.5?mid+(peak(i)-mid)*(1-2*t)**2:mid+(peak(i+1)-mid)*(2*t-1)**2;
}
const bridgePoint=(s,d=0,y=null)=>frame.bridgePoint(s,d,y??deckHeight(s));
const bridgeRoadHeight=(lng,lat,heading,approaches,joins,sections)=>{
  if(frame.bridgeRoadHeight(lng,lat,heading,approaches,joins,sections)===null)return null;
  const q=frame.bridgeLocal(lng,lat);
  const station=frame.projectBridge(q.x,q.z);
  if(Math.abs(station.lateral)<.32)return null;
  return deckHeight(station.s,approaches);
};
// HD section unions include the interchange slip roads. They remain useful for
// pavement/height ownership, but must never pull the rigid slab, median or rails
// sideways through a lane. Calix's surveyed-width structure keeps its own frame.
export const PROFILE={...frame,deckHeight,bridgePoint,bridgeRoadHeight,fittedLateral:(_s,d)=>d};
