// Surveyed AWS Terrarium z15 on 2026-10-15; samples in fix/g8a/palais-de-chaillot/dem-samples.json.
// Runtime terrain/index.js uses a z14 / 64-cell TIN. These literal grid constants
// keep the public generator independent of the terrain runtime.
import {world,local,geo,CURVES,PAVILIONS} from './palais-de-chaillot-plan.js';
export const PARVIS_REFS=[[-40,-30],[3.5,-30],[45,-30],[-40,0],[3.5,0],[45,0]].map(p=>geo(...p));
// Median place/parvis sample = 65.207 m. Preserve the rigid palace: parvis y12
// becomes world-relative zero. The garden's relative descent follows the DEM,
// rather than retaining the flat-map 12 m rise over its entire 230 m length.
export const SITE_PROFILE=[[56,0],[70,-2.4],[85,-5.6],[105,-10],[130,-17.5],[155,-24],[180,-28.2],[210,-32],[232,-33]];
export function siteLevel(v){if(v<=56)return 0;for(let i=1;i<SITE_PROFILE.length;i++){const a=SITE_PROFILE[i-1],b=SITE_PROFILE[i];if(v<=b[0])return a[1]+(b[1]-a[1])*(v-a[0])/(b[0]-a[0]);}return -33;}
export function siteOffset(v,flatTop){return siteLevel(v)-flatTop;}
const R=6378137,stretch=1/Math.cos(48.86234*Math.PI/180),step=2*Math.PI*R/2**14/64;
const ox=R*2.28807*Math.PI/180,oy=R*Math.log(Math.tan(Math.PI/4+48.86234*Math.PI/360));
const inside=(u,v,r)=>{let hit=false;for(let i=0,j=r.length-1;i<r.length;j=i++)if((r[i][1]>v)!=(r[j][1]>v)&&u<(r[j][0]-r[i][0])*(v-r[i][1])/(r[j][1]-r[i][1])+r[i][0])hit=!hit;return hit;};
const wings=CURVES.map(c=>[...c.back,...c.front.slice().reverse()]);
const owns=(u,v)=>wings.some(r=>inside(u,v,r))||PAVILIONS.some(p=>u>=p.u0&&u<=p.u1&&v>=p.v0&&v<=p.v1)||(u>=-55&&u<=62&&v>=-32.5&&v<=232&&(v<=56||Math.abs(u-3.5)>=31.5||Math.abs(u-3.5)<=18||v<114));
// Terrain is immediately below the structural surfaces; the theatre's front
// wall retains its full height, rather than being filled in up to the parvis.
export function floorLevel(u,v){
 if(v<=29||Math.abs(u-3.5)>64)return -.25;
 if(v<=56)return -12.3;
 if(v<69)return Math.min(siteLevel(v)-.6,-12.3+(v-56)*.7);
 if(v<106)return siteLevel(v)-1;
 return siteLevel(v)-4.5;
}
const nodes=new Map();
// Enumerate precisely the TIN vertices holding the modeled surfaces, rather
// than a convex/disc halo over the whole Trocadéro gardens and approach roads.
for(let u=-210;u<=218;u+=2)for(let v=-33;v<=233;v+=2){if(!owns(u,v))continue;
 const [x,,z]=world(u,0,v),gx=(ox+x*stretch)/step,gy=(oy-z*stretch)/step,i=Math.floor(gx),j=Math.floor(gy);
 const ij=gx-i>=gy-j?[[i,j],[i+1,j],[i+1,j+1]]:[[i,j],[i,j+1],[i+1,j+1]];
 for(const [a,b]of ij){const key=`${a},${b}`;const level=floorLevel(u,v);nodes.set(key,Math.min(nodes.get(key)??Infinity,level));}
}
const ll=(mx,my)=>[mx/R*180/Math.PI,(2*Math.atan(Math.exp(my/R))-Math.PI/2)*180/Math.PI];
export const PAD_NODES=[...nodes].map(([key,offsetM])=>{const[i,j]=key.split(',').map(Number),mx=i*step,my=j*step,r=.04*step;return{i,j,offsetM,ring:[[mx-r,my-r],[mx+r,my-r],[mx+r,my+r],[mx-r,my+r]].map(p=>ll(...p))};});
export const TERRAIN_PAD={rings:[PAD_NODES[0].ring],refs:PARVIS_REFS,datum:'median',featherM:0,terraces:PAD_NODES.map(n=>({ring:n.ring,offsetM:n.offsetM,featherM:0}))};
