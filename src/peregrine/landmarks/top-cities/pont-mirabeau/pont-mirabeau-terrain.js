// Runtime-only: a cutting in the existing shared terrain lattice. Asset authoring
// never imports this module or bakes a DEM/absolute altitude into a GLB.
import { HeightField } from '../../../terrain/height-field.js';
import { lngToMercX, latToMercY, mercYToLat, mercStretch } from '../../../facade/geo.js';
import { PROFILE as p, MAIN_START as A, MAIN_END as Z } from './pont-mirabeau-profile.js';
const fields=new WeakMap(),smooth=t=>t*t*(3-2*t);
export function originalTerrain(terrain){
 if(!terrain?.mosaic||!terrain.near)return null;
 let saved=fields.get(terrain);
 const key=[terrain.near.step,terrain.near.demZ,terrain.far?.step,terrain.far?.demZ].join(':');
 if(!saved||saved.key!==key){
  const near=new HeightField({mosaic:terrain.mosaic,step:terrain.near.step,demZ:terrain.near.demZ});
  const far=terrain.far?new HeightField({mosaic:terrain.mosaic,step:terrain.far.step,demZ:terrain.far.demZ,anyZoom:true}):null;
  if(far)near.setFallback(far);
  saved={key,near,far,bakedAt(mx,my){const h=(terrain.nearActive===false?far:near)?.heightAt(mx,my);return h===null||h===undefined?null:h*mercStretch(mercYToLat(my))*terrain.k;}};
  fields.set(terrain,saved);
 }
 return saved;
}
const ox=lngToMercX(p.CHAMPLAIN.origin[0]),oy=latToMercY(p.CHAMPLAIN.origin[1]);
const point=(s,d=0)=>{const q=p.bridgePoint(s,d);return [ox+q.x*p.STRETCH,oy-q.z*p.STRETCH];};
// Enumerate the actual SW–NE TIN vertices, not a broad rectangular valley pad.
export function triangleNodes(mx,my,step){
 const x=mx/step,y=my/step,i=Math.floor(x),j=Math.floor(y);
 return x-i>=y-j?[[i,j],[i+1,j],[i+1,j+1]]:[[i,j],[i,j+1],[i+1,j+1]];
}
export function northApproachCut(terrain){
 const raw=originalTerrain(terrain);if(!raw)return null;
 const step=terrain.near.step,z=terrain.near.demZ,k=terrain.k;
 const ref=point(A),datumNative=terrain.mosaic.sample(...ref,z);
 const north=raw.bakedAt(...point(A)),south=raw.bakedAt(...point(Z)),end=raw.bakedAt(...point(0));
 if([datumNative,north,south,end].some(h=>h===null))return null;
 const datum=Math.max(north,south)/p.STRETCH,start=end/p.STRETCH;
 const nodes=new Map(),protectedNodes=new Set();
 // The endpoint's full cross-section keeps its original terrain and road join.
 for(let d=-10;d<=10;d+=.5)for(const ij of triangleNodes(...point(0,d),step))protectedNodes.add(ij.join(','));
 for(let s=0;s<=A;s+=1){
  const [left,right]=p.roadEdges(s)[0];
  for(let d=left-1;d<=right+1;d+=1)for(const ij of triangleNodes(...point(s,d),step))nodes.set(ij.join(','),ij);
 }
 const audit=[],terraces=[];
 for(const [key,[i,j]] of nodes){
  if(protectedNodes.has(key))continue;
  const mx=i*step,my=j*step,before=terrain.mosaic.sample(mx,my,z);if(before===null)return null;
  const q=p.projectBridge((mx-ox)/p.STRETCH,(oy-my)/p.STRETCH);
  const t=Math.max(0,Math.min(1,q.s/A));
  const floor=(start+(datum-start)*smooth(t)-.6)*p.STRETCH/(mercStretch(mercYToLat(my))*k);
  const after=Math.min(before,floor);if(before-after<.01)continue; // cutting only; never raise river/ground
  const r=step*.04,ring=[[mx-r,my-r],[mx+r,my-r],[mx+r,my+r],[mx-r,my+r]];
  terraces.push({ring,offsetM:(after-datumNative)*k,featherM:0});
  audit.push({i,j,mx,my,s:q.s,lateral:q.lateral,beforeM:before,afterM:after});
 }
 if(!terraces.length)return null;
 // The first terrace overrides the base ring; every patch holds just one
 // lattice node. TIN interpolation supplies the smooth floor between nodes.
 return {ring:terraces[0].ring,refs:[ref],terraces,featherM:0,stretch:p.STRETCH,
  audit:{stepM:step/p.STRETCH,clearanceM:.6,nodes:audit}};
}
