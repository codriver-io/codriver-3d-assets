import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import alignment from './arlington-memorial-bridge-alignment.js';
const distance=(a,b)=>Math.hypot((b[0]-a[0])*111319.49*Math.cos(SPEC.origin[1]*Math.PI/180),(b[1]-a[1])*111319.49);
function head(line,metres){const out=[line[0]];let total=0;for(let i=1;i<line.length;i++){const d=distance(line[i-1],line[i]);if(total+d>=metres){out.push(line[i-1].map((v,k)=>v+(line[i][k]-v)*(metres-total)/d));return out;}total+=d;out.push(line[i]);}throw new Error('Mapped approach too short');}
const west=head(alignment.west,45),east=head(alignment.east,45);
export const PROFILE=createBridgeProfile({...SPEC,modelDir:'bridges',palette:PALETTES.light,terrainPolicy:'absolute-deck',width:39,roadEdges:[[-9.144,9.144]],centerline:[...west.slice(1).reverse(),...alignment.road,...east.slice(1)],profile:({length})=>[[0,'start'],[150,9.5],[length-150,9.5],[length,'end']]});
export const START=45+5.5,END=45+664.8;
// Rounded OSM nose stations, bank piers bound nine river arches plus two road openings.
export const PIERS=[40,102,165,230,297,366,432,496,558,620].map(s=>s+45);
export const HALF=14.15,ROAD_HALF=9.144;
