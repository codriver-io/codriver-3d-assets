import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { kit } from './catedral-primada-de-colombia-parts.js';

// Nave authoring u eastward at bearing 122°, v southward at 212°.
// Only the main cathedral is authored: its southern neighbours are excluded.
export function create({ detail='near' }={}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail), K=kit(b,near);
  const {box,put,panel,relief,window,cylinder,lathe,shell,gable}=K;
  // Aisles and chapel walls; roof profiles are closed solids.
  box('rubble',-13.3,64,0,13,-17.7,22.1);
  gable('roof',-12.8,63.7,-17.8,22.2,12.9,18);
  box('plaster',-13,62.8,12.8,20,-7.2,11.6);
  gable('roof',-13,63.4,-7.3,11.7,19.8,24.8);
  box('trim',-13,63,19.6,20.15,-7.45,-7.0);
  box('trim',-13,63,19.6,20.15,11.4,11.9);
  // Crossing drum, hemispherical dark dome and small lantern.
  cylinder('stone',36,2.2,21.0,29.2,7.2,7.2,near?32:16);
  cylinder('trim',36,2.2,28.9,29.6,7.5,7.5,near?32:16);
  const dp=[[7.25,29.5]];
  for(let i=1;i<=(near?10:5);i++){const a=i*Math.PI/2/(near?10:5);dp.push([7.25*Math.cos(a),29.5+7.25*Math.sin(a)]);}
  dp.push([0,36.8]); lathe('metal',36,2.2,dp,near?32:16);
  cylinder('trim',36,2.2,36.4,37,1.6,1.6);
  cylinder('stone',36,2.2,36.8,39.1,1.1,1.1);
  lathe('metal',36,2.2,[[1.6,39],[1.3,39.5],[.7,40.1],[0,40.6]]);
  cross(36,2.2,40.2,42,.65);
  for(let k=0;k<(near?16:8);k++){
    const a=k*2*Math.PI/(near?16:8),r=7.28;
    window(36+Math.sin(a)*r,2.2+Math.cos(a)*r,a,24.2,1.05,3.4);
  }
  // West front: eight principal pilasters, three doors, great central attic.
  box('stone',-22.8,-13.2,0,17,-17.7,22.1);
  box('stone',-22.8,-19.1,17,28.8,-5.6,10.0);
  for(const [y,h] of [[.5,.45],[14.8,.6],[16.2,.75],[17.15,.45]]) box('trim',-23.05,-12.95,y,y+h,-18.0,22.4);
  for(const v of [-16.5,-11.5,-5.6,-2.4,6.8,10.0,16.0,20.8]){
    box('trim',-23.3,-22.6,1,14.8,v-.48,v+.48);
    box('trim',-23.4,-22.5,.55,1.25,v-.75,v+.75);
    box('trim',-23.4,-22.5,13.65,14.85,v-.78,v+.78);
    if(near) for(const d of [-.24,0,.24]) box('stone',-23.38,-23.28,1.7,13.4,v+d-.04,v+d+.04);
  }
  for(const [v,w,h] of [[2.2,3.6,7.2],[-11,2.8,5.6],[15.4,2.8,5.6]]){
    const door=[[-w/2,.5],[w/2,.5],[w/2,h+.5],[-w/2,h+.5]];
    relief('wood',door,-22.92,v,-Math.PI/2,.12);
    // Independent paired round portal columns and moulded overdoor.
    for(const d of [-w/2-.7,w/2+.7]){
      cylinder('trim',-23.15,v+d,.5,h+1.4,.28,.25);
      cylinder('trim',-23.15,v+d,h+.9,h+1.4,.48,.48);
    }
    box('trim',-23.45,-22.75,h+1.35,h+1.75,v-w/2-1.1,v+w/2+1.1);
    relief('trim',[[-w/2-1.1,h+1.8],[w/2+1.1,h+1.8],[0,h+3.0]],-23.2,v,-Math.PI/2,.18);
    if(near){
      for(let row=0;row<4;row++) for(const d of [-w/4,w/4]){
        box('metal',-23.11,-23.04,.95+row*(h-1)/4,1.04+row*(h-1)/4,v+d-.1,v+d+.1);
        box('wood',-23.13,-23.08,1.25+row*(h-1)/4,1.25+row*(h-1)/4+(h-1)/4-.25,v+d-w/5,v+d+w/5);
      }
    }
  }
  window(-22.9,2.2,-Math.PI/2,20,3,6,'stone');
  for(const v of [-4.6,-2.8,7.2,9]){
    box('trim',-23.12,-22.6,18.1,27.7,v-.34,v+.34);
    box('trim',-23.3,-22.5,27.3,28,v-.65,v+.65);
  }
  box('trim',-23.05,-18.9,28,28.9,-5.9,10.3);
  relief('stone',[[-8.1,28.9],[8.1,28.9],[0,33.5]],-22.85,2.2,Math.PI/2,3.5);
  for(const s of [-1,1]) b.bar('trim',[-23.1,29,2.2+s*8.15],[-23.1,33.6,2.2],.4,.4,0,false,0);
  box('trim',-23.3,-22.8,28.85,29.2,-6.2,10.6);
  // Five simplified rooftop finials including the central Marian figure.
  for(const [v,y] of [[-5.4,29.2],[-2.0,31.1],[2.2,33.6],[6.4,31.1],[9.8,29.2]]) statue(-21.6,v,y,near?1.8:1.5);
  // Towers preserve real open belfries in both LODs.
  for(const v of [-11.4,15.8]) tower(-17.9,v);
  // North rubble wall, buttresses and the Puerta Falsa.
  for(let x=-10;x<62;x+=8.4){
    box('stone',x-.42,x+.42,0,13,-18.05,-17.65);
    // North street wall has few openings; only the portal is modeled below.
    window(x,-7.48,Math.PI,15,2.0,3.8);
    window(x,11.82,0,15,2.0,3.8);
    window(x,22.24,0,7.4,1.7,3.0);
  }
  
  box('trim',5.8,12.2,0,10.6,-18.3,-17.5);
  window(9,-18.4,Math.PI,.4,4.2,8,'wood');
  // Back east windows and masonry quoins.
  for(const v of [-13,-5,2.2,9.4,17.4]) window(64.1,v,Math.PI/2,6.0,2,4);
  if(near){
    // Small relief rubble patches capture the distinctive exposed north wall.
    let seed=13;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    for(let row=0;row<23;row++) for(let x=-12.3;x<63;x+=1.3){
      const w=.65+rnd()*.45,y=.35+row*.54;
      if(Math.abs(x-9)<3&&y<10)continue;
      panel(rnd()>.55?'stone':'rubble',[[0,y],[w,y+.03],[w*.9,y+.33],[.08,y+.38]],x,-17.84,Math.PI);
    }
    // Roof tile courses, ridge rolls, stone dentils and tower ornament.
    for(let x=-11;x<63;x+=1.8){
      b.bar('roof',[x,20,-7.25],[x,24.85,2.2],.09,.09,0,false,0);
      b.bar('roof',[x,20,11.65],[x,24.85,2.2],.09,.09,0,false,0);
    }
    for(let v=-17.4;v<22;v+=.66) box('stone',-23.18,-22.98,15.5,16.0,v,v+.27);
  }
  const root=b.finish();
  let triangles=0;
  root.traverse(o=>{if(o.isMesh){
    const g=o.geometry,p=g.attributes.position,old=g.index.array,indices=[];
    for(let i=0;i<p.count;i++)if(Math.abs(p.getY(i))<1e-5)p.setY(i,0);
    for(let i=0;i<old.length;i+=3){
      const ys=[p.getY(old[i]),p.getY(old[i+1]),p.getY(old[i+2])];
      // Omit buried foundation undersides and door thresholds. The visible
      // walls and jambs still meet grade; no mixed-material coplanar bottoms.
      if(ys.every(y=>Math.abs(y)<1e-5))continue;
      if(o.material.name==='wood' && ys.every(y=>Math.abs(y-.5)<1e-5))continue;
      indices.push(old[i],old[i+1],old[i+2]);
    }
    g.setIndex(indices);triangles+=indices.length/3;
    g.rotateY(-SPEC.rotationDeg*Math.PI/180);g.computeBoundingBox();g.computeBoundingSphere();
  }});
  root.userData.triangles=triangles;
  return root;

  function cross(x,z,y0,y1,w){box('metal',x-.07,x+.07,y0,y1,z-.07,z+.07);box('metal',x-.07,x+.07,y1-.65,y1-.51,z-w,z+w);}
  function statue(x,z,y,h){
    cylinder('trim',x,z,y,y+.22,.38,.38);
    cylinder('stone',x,z,y+.2,y+h-.38,.35,.2,near?8:5);
    const g=new THREE.SphereGeometry(.24,near?10:5,near?7:4);g.translate(x,y+h-.18,z);put(g,'trim');
  }
  function band(x,z,w,y,h=.4){box('trim',x-w/2,x+w/2,y,y+h,z-w/2,z+w/2);}
  function tower(x,z){
    // Square lower and upper stages with four-sided arch openings.
    shell(x,z,8.5,17.6,29.4,20.4,2.7,6.0);
    band(x,z,9.1,17.55,.55);band(x,z,9.5,28.5,.6);band(x,z,9.0,29.2,.4);
    shell(x,z,6.9,29.55,40.5,33,2.15,5.1);
    band(x,z,7.65,30,.6);band(x,z,7.85,39.4,.55);band(x,z,8.2,40.2,.55);
    for(const y of [17.9,30.8]) for(let k=0;k<4;k++){
      const a=k*Math.PI/2,r=y<20?4.36:3.58,L=y<20?10.4:8;
      for(const d of [-2.75,2.75]){
        const X=x+Math.sin(a)*r+Math.cos(a)*d,Z=z+Math.cos(a)*r-Math.sin(a)*d;
        cylinder('trim',X,Z,y,y+L,.23,.21,near?10:5);
        cylinder('trim',X,Z,y+L-.4,y+L,.4,.4,near?10:5);
        if(near) for(let f=0;f<8;f++){
          const t=f*Math.PI/4;
          cylinder('stone',X+Math.cos(t)*.23,Z+Math.sin(t)*.23,y+.4,y+L-.5,.035,.035,4);
        }
      }
    }
    // Curved stepped masonry caps; small lantern and slender cross.
    lathe('stone',x,z,[[4.0,40.75],[4,41.15],[3.25,41.35],[3.25,42],[2.65,42.25],[2.5,43],[1.8,44.7],[1.2,45.3],[1.1,45.7]],near?24:12);
    cylinder('trim',x,z,45.4,46.1,1.45,1.45);
    shell(x,z,1.85,46.05,48.7,46.35,.65,1.8);
    lathe('stone',x,z,[[1.2,48.6],[1.15,49],[.6,49.6],[.2,50.0],[0,50.4]],near?16:8);
    cross(x,z,50,52,.75);
    if(near){
      for(const y of [28.2,39.1]) for(let k=0;k<4;k++){
        const a=k*Math.PI/2,r=y<30?4.45:3.65;
        for(let d=-3;d<=3;d+=.6) {
          const X=x+Math.sin(a)*r+Math.cos(a)*d,Z=z+Math.cos(a)*r-Math.sin(a)*d;
          b.box('stone',[X,y,Z],[.26,.3,.3],a,0,0);
        }
      }
      for(const d of [-3.3,3.3]) for(const e of [-3.3,3.3]) statue(x+d,z+e,30.6,.85);
    }
    // The northern tower alone bears the clock below the second cornice.
    if(z<0){
      const g=new THREE.CircleGeometry(.9,near?24:10);g.translate(0,27.1,0);g.rotateY(-Math.PI/2);g.translate(x-4.33,0,z);put(g,'trim');
      b.bar('metal',[x-4.39,27.1,z],[x-4.39,27.73,z],.08,.08,0,false,0);
      b.bar('metal',[x-4.4,27.1,z],[x-4.4,27.35,z+.42],.08,.08,0,false,0);
    }
  }
}
