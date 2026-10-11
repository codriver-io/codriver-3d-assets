import { PROFILE as p,L,LANDING } from './pont-de-normandie-profile.js';
export const LANDING_BLEND=100;
export function landingHeight(s,height,approaches=[0,0]) {
  const distance=Math.min(s,L-s),end=s<L/2?0:1;
  if(distance>=LANDING_BLEND)return height;
  if(distance<=LANDING)return approaches[end];
  const t=(distance-LANDING)/(LANDING_BLEND-LANDING),weight=(1-Math.cos(Math.PI*t))/2;
  return approaches[end]+(height-approaches[end])*weight;
}
// Run immediately after the shared immutable surface fit; preserve rail/paint offsets.
export function fitLandings(model,ground,approaches) {
  let known=true;
  model.traverse(o=>{
    if(!o.isMesh)return;
    const g=o.geometry,a=g.attributes.position,source=g.userData.champlainSource?.positions,w=g.attributes._bridgelift||g.attributes.bridgeLift;
    if(!source||!w)return;
    for(let i=0;i<a.count;i++) {
      if(w.getX(i)<.99)continue;
      const s=p.projectBridge(source[i*3],source[i*3+2]).s;if(Math.min(s,L-s)>=LANDING_BLEND)continue;
      const dem=ground.vertexGroundAt(a.getX(i),a.getZ(i));if(dem===null){known=false;continue;}
      const groundM=dem/p.STRETCH,offset=source[i*3+1]-p.deckHeight(s);
      a.setY(i,groundM+offset+landingHeight(s,a.getY(i)-groundM-offset,approaches));
    }
    a.needsUpdate=true;g.computeBoundingBox();g.computeBoundingSphere();
  });
  return known;
}
