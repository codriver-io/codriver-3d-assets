import {PROFILE,LENGTH,RAMP} from './svinesund-bridge-profile.js';
// Follow transverse DEM for the first 80 m of each landing, then blend back
// to the absolute road at the structural abutment. Cityscape bypasses this.
export const LANDING=80;
export function landingWeight(s){const t=Math.max(0,Math.min(1,(Math.min(s,LENGTH-s)-LANDING)/(RAMP-LANDING)));return t*t*(3-2*t);}
export function landingRoadHeight(s,absolute,terrain,approach=0){if(s>=RAMP&&s<=LENGTH-RAMP)return absolute;const toe=terrain+approach;return toe+landingWeight(s)*(Math.max(toe,absolute)-toe);}
export function fitLandings(model,ground,approaches,roadApproaches=[0,0]){
 let known=true;
 model.traverse(mesh=>{
  if(!mesh.isMesh)return;
  const g=mesh.geometry,a=g.attributes.position,source=g.userData.champlainSource;if(!source)return;
  const weights=g.attributes._bridgelift||g.attributes.bridgeLift;let changed=false;
  for(let i=0;i<a.count;i++){
   const s=source.stations[i],weight=weights?.getX(i)??1;
   if(s>=RAMP&&s<=LENGTH-RAMP||!weight)continue;
   const terrain=ground.vertexGroundAt(a.getX(i),a.getZ(i));if(terrain===null){known=false;continue;}
   const absolute=PROFILE.deckHeight(s,approaches)+ground.bankYAt(s)/PROFILE.STRETCH;
   const target=landingRoadHeight(s,absolute,terrain/PROFILE.STRETCH,roadApproaches[s<LENGTH/2?0:1]);
   a.setY(i,a.getY(i)+(target-absolute)*weight);changed=true;
  }
  if(!changed)return;
  a.needsUpdate=true;g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();
  const n=g.attributes.normal,c=g.attributes.color;
  if(c){for(let i=0;i<n.count;i++)c.setXYZ(i,...Array(3).fill(.62+.38*Math.max(0,-.35*n.getX(i)+.83*n.getY(i)+.44*n.getZ(i))));c.needsUpdate=true;}
 });return known;
}
