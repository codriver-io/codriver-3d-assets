import { loft, orb, slab, rod } from './motherland-monument-mesh.js';
// Each named sculptural part is independently available for attachment/raycast tests.
export function sculptureParts(detail='near') {
  const near=detail==='near', parts=[];
  const add=(name,g,material='steel')=>{ if(name==='robe'||name==='bodice') {const flat=g.toNonIndexed();g.dispose();g=flat;g.computeVertexNormals();} parts.push({name,geometry:g,material}); };
  add('robe',loft([[.65,40,0,6.2,3.75],[.65,41,0,6.2,3.75],[.4,49,.2,6.15,3.85],[-.35,56,.3,6.4,3.65],[-.45,60,.15,5.8,3.25],[0,63,.1,4.5,2.65],[0,65,.1,4.4,2.6]],near?80:40,20,.23));
  add('bodice',loft([[0,62.8,0,4.45,2.7],[0,64.5,0,4.5,2.7],[-.1,67.5,.1,5.6,3.45],[0,70.5,0,6.25,3.1],[0,72.0,0,5.6,2.65],[0,73,0,3.2,1.9]],near?48:24,12,.16));
  add('belt',loft([[0,63.5,0,4.6,2.9],[0,64.3,0,4.6,2.9]],near?40:20));
  // Draped shoulder sleeves reach down beside the robe; broad flared cuffs meet forearms.
  for(const side of [-1,1]) {
    add('sleeve-'+side,loft([[side*6.4,57.5,-.65,1.8,3.0],[side*6.4,63,-.6,2.35,3.25],[side*6.0,68,-.6,2.6,3.15],[side*6.0,72.0,-.2,2.8,2.65],[side*8.4,74.0,.0,2.15,2.0],[side*9.7,76,.1,1.55,1.5]],near?32:16,8,.22));
    const handY=side<0?87:82.5, elbowY=side<0?79.1:78;
    add('forearm-'+side,loft([[side*8.7,74.6,.0,1.75,1.6],[side*11.0,elbowY,.15,1.4,1.45],[side*13.7,handY-2,.3,1.0,1.1],[side*14.5,handY,.5,.85,.95]],near?24:12,6,.025));
    add('hand-'+side,orb([side*14.5,handY+.2,.6],[1.05,1.45,1.05],near));
    if(near) for(let j=0;j<4;j++) add('finger-'+side+'-'+j,orb([side*14.5+(j-1.5)*.39,handY+.35,1.45],[.25,.9,.3],true));
  }
  // Neck, jaw, forehead, cheek planes and swept-back hair make a readable human head.
  add('neck',loft([[0,71.3,0,1.65,1.4],[0,75.5,0,1.4,1.35]],near?24:12));
  add('head',orb([0,78.25,.3],[2.05,3.0,1.7],near));
  add('face',slab([[-1.5,79.7],[0,80],[1.5,79.7],[1.55,78.0],[1.05,76.2],[0,75.6],[-1.05,76.2],[-1.55,78.0]],1.5,.45));
  for(const x of [-1,1]) {
    add('cheek-'+x,slab([[x*.65,78.4],[x*1.6,78.5],[x*1.3,77.15],[x*.7,77.0]],1.8,.3));
    add('brow-'+x,slab([[x*.25,79.0],[x*1.45,79.1],[x*1.45,79.35],[x*.25,79.3]],1.85,.45));
    add('eye-'+x,slab([[x*.3,78.65],[x*1.25,78.7],[x*1.25,78.85],[x*.3,78.85]],2.15,.08),'emblem');
    add('ear-'+x,orb([x*2.0,78,.0],[.35,.75,.5],near));
    add('hair-side-'+x,loft([[x*1.7,75.2,-.7,.9,.8],[x*2.0,77.5,-.4,1.0,1.0],[x*1.8,80.0,-.25,.75,.85]],near?16:8,4,.14));
  }
  add('hair-cap',orb([0,79.7,-.5],[2.25,1.8,1.75],near));
  add('nose',slab([[-.38,78.9],[.25,78.9],[.48,77.6],[-.48,77.6]],1.7,.75));
  add('mouth',slab([[-.65,76.7],[.65,76.7],[.45,76.85],[-.45,76.85]],1.95,.25));
  add('chin',slab([[-.65,76.5],[.65,76.5],[.5,76.0],[-.5,76.0]],1.65,.45));
  // Sculpted hair waves are kept coarse in far, instead of a smooth helmet.
  for(let k=0;k<(near?7:4);k++) {
    const y=76.3+k*(near?.68:1.2);
    add('hair-wave-'+k,loft([[-2.0,y,-.6,.28,.4],[-1.2,y+.2,-1.6,.28,.4],[0,y+.15,-2.0,.3,.4],[1.3,y,-1.5,.28,.4],[2,y-.3,-.65,.25,.35]],near?8:5));
  }
  // Sword is sixteen metres overall (grip 86-89, blade 89-102), with crossguard and pointed tip.
  add('sword-grip',rod([-14.5,86,.7],[-14.5,89.25,.7],.42,near));
  add('sword-guard',slab([[-17.0,89.05],[-16.6,89.6],[-12.4,89.6],[-12,89.05]],.35,.75));
  add('sword-blade',slab([[-15.25,89.45],[-15.25,101],[-14.5,102],[-13.75,101],[-13.75,89.45]],.5,.42));
  // Rounded rectangular escutcheon, 13 x 8 m. Modern trident, no Soviet emblem.
  add('shield',slab([[10.5,89.1],[11.5,89.75],[14.5,90],[17.5,89.75],[18.5,89.1],[18.5,81.9],[18.1,80.2],[17.1,78.6],[14.5,77],[11.9,78.6],[10.9,80.2],[10.5,81.9]],1.35,.8));
  // Embossed open three-prong tryzub: rods lie 0.25 m proud of shield, with angular base.
  const lines=[[[14.5,86.9],[14.5,80.2]],[[12.3,86.4],[12.3,82.2]],[[16.7,86.4],[16.7,82.2]],
    [[12.3,82.2],[14.5,80.2]],[[16.7,82.2],[14.5,80.2]],[[12.3,83.0],[13.5,82.0]],[[13.5,82.0],[14.5,83.4]],
    [[16.7,83.0],[15.5,82.0]],[[15.5,82.0],[14.5,83.4]],[[12.3,86.4],[13.2,85.0]],[[16.7,86.4],[15.8,85.0]]];
  for(let i=0;i<lines.length;i++) { const [a,c]=lines[i];add('tryzub-'+i,rod([...a,2.55],[...c,2.55],.22,near),'emblem'); }
  // Carved front robe folds carry down from the collar; no independently floating rails.
  if(near) for(const x of [-3.2,-1.6,0,1.6,3.2]) add('bodice-fold-'+x,loft([[x,64.2,2.4,.22,.25],[x,68,2.85,.24,.27],[x*.8,71.8,2.2,.2,.25]],8));
  return parts;
}
