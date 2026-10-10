import {createBridgeProfile} from '../../bridge-profile.js';
import {SPEC,PALETTES} from './config.js';
import alignment from './pont-neuf-toulouse-alignment.js';
const bankA=[1.4377326,43.5991142],bankB=[1.4404057,43.5996014];
const dist=(a,b)=>Math.hypot((a[0]-b[0])*111319.49*Math.cos(SPEC.origin[1]*Math.PI/180),(a[1]-b[1])*111319.49);
function head(line,length){const out=[line[0]];let sum=0;for(let i=1;i<line.length;i++){const d=dist(line[i-1],line[i]);if(sum+d>=length){out.push(line[i-1].map((v,k)=>v+(line[i][k]-v)*(length-sum)/d));return out;}sum+=d;out.push(line[i]);}throw Error('short mapped approach');}
const ia=alignment.findIndex(q=>q[0]===bankA[0]),ib=alignment.findIndex(q=>q[0]===bankB[0]);
const west=head(alignment.slice(0,ia+1).reverse(),110).reverse(),east=head(alignment.slice(ib),110);
const centerline=[...west.slice(0,-1),...alignment.slice(ia,ib+1),...east.slice(1)];
const raw=createBridgeProfile({...SPEC,width:32,roadEdges:[[-3.5,3.5]],centerline,profile:({length})=>[[0,'start'],[110,8],[110+(length-220)*.56,11],[length-110,8],[length,'end']]});
export const START=raw.stationAt(bankA),END=raw.stationAt(bankB);
export const PIERS=[19.8,43.3,72.5,109,151.6,191.8].map(s=>s+START);
export const HALF=10,CENTER=2.1,ROAD_HALF=3.5;
export const PROFILE=createBridgeProfile({...raw.CHAMPLAIN,modelDir:'bridges',palette:PALETTES.light,terrainPolicy:'bank-fit',meshStep:2});
// Sourced extremes; intermediate widths constrained by mapped pier rhythm.
export const SPANS=[13.47,16.2,21.2,28.5,31.70,29.9,20.4];
export const ARCHES=SPANS.map((width,i)=>{const supports=[START,...PIERS,END];const mid=(supports[i]+supports[i+1])/2;return {a:mid-width/2,c:mid+width/2,mid,width,peak:PROFILE.deckHeight(mid)-1.35};});

// Photographic review proportions, not surveyed dimensions.
export const FLOOD_RADIUS=2.3575, FLOOD_SURROUND_RADIUS=3.45, FLOOD_DROP=3.65;
export const ARCH_BAND_SCALE=1.30;
