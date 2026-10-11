import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { parts } from './borgund-stave-church-parts.js';

export function create({ detail = 'near' } = {}) {
  const b=assetBuilder({...SPEC,palette:PALETTES.light},detail),p=parts(b,detail),near=detail==='near';
  const {box,bar,wall,gallery,gable,hip,panel,dragon}=p;
  // Exact mapped plinth, closed at grade, in the global east/south frame.
  const ring=FOOTPRINTS[0].slice(0,-1).map(([lng,lat])=>new THREE.Vector2((lng-SPEC.origin[0])*111320*Math.cos(SPEC.origin[1]*Math.PI/180),-(lat-SPEC.origin[1])*111320));
  const shape=new THREE.Shape(ring);const g=new THREE.ExtrudeGeometry(shape,{depth:.23,bevelEnabled:false});
  // Shape x,y become world x,z with extrusion becoming vertical.
  g.rotateX(Math.PI/2);g.translate(0,.23,0);b.put(g,'stone');
  // Raised central nave, narrow choir and apse; outer gallery remains genuinely open above its boards.
  box('timber',-1.65,4.24,0,7.7,8.0,5.65);
  box('timber',4.4,2.97,0,3.8,5.48,3.7);
  for(const s of [-1,1]) {
    wall([-5.5,s*2.86],[2.2,s*2.86],5.65,8.24);
    wall([2.6,s*1.88],[6.3,s*1.88],3.6,5.7);
    gallery([-6.55,s*4.36],[3.28,s*4.36]);
    gallery([3.28,s*3.0],[6.15,s*3.0]);
    wall([3.28,s*4.36],[3.28,s*3.0],.24,2.44);
  }
  // West gallery portal has a clear doorway rather than a painted rectangle.
  gallery([-6.55,-4.36],[-6.55,-1.0]);gallery([-6.55,1.0],[-6.55,4.36]);
  box('timber',-5.54,1.35,0,.10,2.22,1.9); // recessed actual door at the inner wall
  box('worn',-7.08,.32,0,1.3,.18,1.9);
  for(const v of [-.93,.93])bar('trim',[-7.62,.23,v],[-7.62,2.8,v],.18);
  gable(-7.78,-5.72,0,2.25,2.65,4.55);
  // Two nave roof skirts and the great steep gable; openings between eave and gallery retained.
  hip(-5.4,2.2,3.25,-6.75,3.48,4.64,3.8,2.48);
  hip(-5.58,2.3,2.78,-6.26,3.10,4.10,6.45,4.13);
  gable(-5.96,2.66,0,6.62,8.27,12.75);
  // Choir skirts, steep roof and rounded eastern apse.
  hip(3.20,6.15,1.94,3.15,6.35,3.10,3.8,2.5);
  gable(2.66,6.60,0,4.45,5.78,8.5);
  const segments=near?18:10;
  for(let i=0;i<segments;i++) {
    const a=-Math.PI/2+i*Math.PI/segments,c=-Math.PI/2+(i+1)*Math.PI/segments;
    const xy=(r,t)=>[6.1+r*Math.cos(t),r*Math.sin(t)];
    const q=xy(2.42,a),r=xy(2.42,c);
    gallery(q,r);
    const innerA=xy(1.6,a),innerC=xy(1.6,c);
    panel([innerA[0],3.8,innerA[1]],[innerC[0],3.8,innerC[1]],[r[0],2.5,r[1]],[q[0],2.5,q[1]]);
    wall(xy(1.54,a),xy(1.54,c),.24,5.50);
    const oA=xy(1.88,a),oC=xy(1.88,c);
    panel([6.10,6.9,0],[6.10,6.9,0],[oC[0],5.5,oC[1]],[oA[0],5.5,oA[1]],false);
  }
  // South and north projecting gabled entrances, fitting the mapped little side portals.
  for(const s of [-1,1]) {
    box('timber',-1.7,1.3,s*4.42,2.35,2.16,.12);
    for(const u of [-3.0,-.42])bar('trim',[u,.23,s*5.28],[u,2.45,s*5.28],.16);
    // A transverse gable is constructed with panels along the v axis.
    const v0=s*3.3,v1=s*5.53;
    panel([-1.7,4.75,v0],[-1.7,4.75,v1],[-.28,2.5,v1],[-.28,2.5,v0]);
    panel([-1.7,4.75,v1],[-1.7,4.75,v0],[-3.13,2.5,v0],[-3.13,2.5,v1]);
    bar('trim',[-3.13,2.48,v1],[-1.7,4.8,v1],.17);
    bar('trim',[-1.7,4.8,v1],[-.28,2.48,v1],.17);
    if(near)for(const u of [-2.6,-2.2,-1.8,-1.4,-1.0,-.6]){
      const top=4.66-Math.abs(u+1.7)*1.57;
      bar('worn',[u,2.65,v1],[u,top,v1],.10);
    }
    bar('trim',[-1.7,4.75,v0],[-1.7,4.75,v1],.18);
    bar('trim',[-1.7,4.72,v1],[-1.7,5.38,v1],.10);
    bar('trim',[-1.94,5.12,v1],[-1.46,5.12,v1],.10);
  }
  // Three diminishing square stages of the ridge turret and pointed top roof.
  box('timber',-1.64,12.93,0,2.22,2.16,2.22);
  hip(-2.75,-.53,1.11,-3.14,-.14,1.50,14.18,13.64);
  // Turret's steep roof comes to a short ridge, rather than a generic cone.
  gable(-3.14,-.14,0,3.0,13.64,15.05);
  box('timber',-1.64,15.18,0,1.45,.72,1.45);
  hip(-2.36,-.92,.72,-2.65,-.63,1.01,15.6,15.18);
  gable(-2.65,-.63,0,2.02,15.18,16.75);
  box('timber',-1.64,16.92,0,.72,.64,.72);
  // Four triangular slopes on the top spire, closed shell, each retains scale shingles.
  const apex=[-1.64,19.18,0];
  const corners=[[-2.20,17.25,-.56],[-1.08,17.25,-.56],[-1.08,17.25,.56],[-2.20,17.25,.56]];
  for(let i=0;i<4;i++)panel(apex,apex,corners[(i+1)%4],corners[i]);
  bar('trim',[-1.64,19.05,0],[-1.64,19.95,0],.10);
  bar('trim',[-1.80,19.68,0],[-1.48,19.68,0],.08);
  // Pierced louver rhythm on the turret, visible behind the overhanging tier roofs.
  for(const s of [-1,1]) {
    for(let i=0;i<(near?7:4);i++) {
      const u=-2.62+i*(near?.29:.58);
      box('trim',u,13.06,s*1.15,.16,1.35,.10);
    }
    box('worn',-1.64,13.68,s*1.17,2.02,.12,.12);
  }
  // Four large dragon heads at the great nave and choir gable ends, plus turret ornaments.
  dragon(-5.92,12.69,0,-1,.70);dragon(2.62,12.69,0,1,.70);
  dragon(6.55,8.45,0,1,.60);
  dragon(-3.1,15.0,0,-1,.43);dragon(-.18,15.0,0,1,.43);
  // Exposed corner staves and broad timber frames; no surrounding ground clutter.
  for(const u of [-5.35,2.1])for(const v of [-2.7,2.7])bar('trim',[u,.23,v],[u,8.26,v],.25);
  if(near) {
    for(const u of [-5.94,2.64]) {
      for(let i=0;i<15;i++){
        const v=-2.90+i*.415,top=12.50-Math.abs(v)*1.35;
        bar('worn',[u,8.35,v],[u,top,v],.055,.08);
      }
      // Shallow geometric interlace on the gable under the dragon, attached to the boards.
      for(let i=0;i<6;i++)bar('trim',[u,8.55,-1.7+i*.6],[u,10.25,-1.1+i*.6],.065);
    }
  }
  const model=b.finish();model.userData.dimensionBasis='OSM plan; photograph-estimated elevations';return model;
}
