import { PROFILE as p, L, LANDING } from './helgeland-bridge-profile.js';
export const LANDING_BLEND=160;
// World-only height ABOVE queried terrain. Both end landings follow the actual
// transverse ground, with a cosine C1 blend back to the shared absolute deck.
export function landingHeight(s,relative,approaches=[0,0]) {
  const end=s>L/2?1:0,distance=end?L-s:s;
  if(distance>=LANDING_BLEND)return relative;
  const t=Math.max(0,Math.min(1,(distance-LANDING)/(LANDING_BLEND-LANDING)));
  const weight=(1-Math.cos(Math.PI*t))/2,base=approaches[end];
  return base+weight*(Math.max(base,relative)-base);
}
export function fitLandings(model,ground,surface,approaches) {
  let known=true;
  model.traverse(mesh=>{
    if(!mesh.isMesh)return;
    const g=mesh.geometry,a=g.attributes.position,source=g.userData.champlainSource;
    if(!source)return;
    const weights=g.attributes._bridgelift||g.attributes.bridgeLift;
    for(let i=0;i<a.count;i++) {
      const s=source.stations[i],weight=weights?.getX(i)??1;
      if(Math.min(s,L-s)>=LANDING_BLEND||weight===0)continue;
      const terrain=ground.vertexGroundAt(a.getX(i),a.getZ(i));
      if(terrain===null){known=false;continue;}
      const absolute=p.deckHeight(s,surface)+ground.bankYAt(s)/p.STRETCH;
      const localGround=terrain/p.STRETCH;
      a.setY(i,a.getY(i)+weight*(localGround+landingHeight(s,absolute-localGround,approaches)-absolute));
    }
    a.needsUpdate=true;g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();
    const normal=g.attributes.normal,color=g.attributes.color;
    if(color){for(let i=0;i<normal.count;i++){const v=.62+.38*Math.max(0,-.35*normal.getX(i)+.83*normal.getY(i)+.44*normal.getZ(i));color.setXYZ(i,v,v,v);}color.needsUpdate=true;}
  });
  return known;
}
