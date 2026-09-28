import * as THREE from 'three';
import { assetBuilder } from './asset-geometry.js';
import { TOUR_DE_L_HORLOGE as spec, HORLOGE_PALETTES } from './tour-de-l-horloge-config.js';

// Original procedural study. Fine reliefs are intentionally geometric hints.
// This module is authoring-only; the runtime layer imports numeric config only.
export function createTourDeLHorloge({ detail='near' }={}) {
  const b=assetBuilder(spec,detail), near=detail==='near', segments=near?48:20;
  const box=(m,x,y,z,w,h,d)=>b.box(m,[x,y,z],[w,h,d],0,0,0);
  const put=(g,m)=>b.put(g,m,0,0);
  const cylinder=(m,x,y,z,top,bottom,h,n=segments)=>{
    const g=new THREE.CylinderGeometry(top,bottom,h,n);g.translate(x,y,z);put(g,m);
  };
  const pyramid=(x,y,z,width,height)=>{
    const g=new THREE.CylinderGeometry(0,width/Math.sqrt(2),height,4);g.rotateY(Math.PI/4);g.translate(x,y,z);put(g,'roof');
  };
  function trim(x,y,width,depth,h=0.22) { box('concrete',x,y,0,width,h,depth); }
  // Square base and tall shaft: thin engaged corner columns reinforce verticality.
  box('stone',0,0.4,0,8.1,0.8,7.2);
  box('concrete',0,3.6,0,7.5,5.6,6.72);
  trim(0,6.5,7.8,7.0,0.45);
  box('concrete',0,20.2,0,6.65,27.0,6.22);
  for(const x of [-3.32,3.32])for(const z of [-3.11,3.11]){
    box('concrete',x,20.1,z,0.5,27.2,0.5);
    box('roof',x,31.1,z,0.87,0.5,0.87);
    if(near){ // Small abstract eagles, not a captured sculpture.
      b.bar('concrete',[x-.48,31.6,z],[x+.48,31.6,z],0.16,0.48,0,false,0);
      cylinder('concrete',x,31.6,z,0.12,0.24,0.7,6);
    }
  }
  box('concrete',0,34.6,0,6.8,6.9,6.3);
  trim(0,37.75,7.2,6.7,0.4);
  // Four working-looking but static dials; all geometry, no raster textures.
  function faceGeometry(g,side,depth){g.translate(0,0,depth);g.rotateY(side*Math.PI/2);g.translate(0,33.6,0);put(g,'iron');}
  for(let side=0;side<4;side++){
    const depth=side%2?3.425:3.175;
    const disc=new THREE.CircleGeometry(1.86,segments);faceGeometry(disc,side,depth+.06);
    const ring=new THREE.RingGeometry(1.87,2.02,segments);ring.translate(0,0,depth+.04);ring.rotateY(side*Math.PI/2);ring.translate(0,33.6,0);put(ring,'roof');
    const dial=new THREE.CircleGeometry(1.12,segments);dial.translate(0,0,depth+.10);dial.rotateY(side*Math.PI/2);dial.translate(0,33.6,0);put(dial,'paint');
    function stroke(x1,y1,x2,y2,width,mat='paint'){
      const len=Math.hypot(x2-x1,y2-y1),g=new THREE.BoxGeometry(width,len,0.028);
      g.rotateZ(-Math.atan2(x2-x1,y2-y1));g.translate((x1+x2)/2,(y1+y2)/2,depth+.15);
      g.rotateY(side*Math.PI/2);g.translate(0,33.6,0);put(g,mat);
    }
    const roman=['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];
    for(let hour=0;hour<12;hour++){
      const angle=hour*Math.PI/6,tx=Math.sin(angle),ty=Math.cos(angle);
      if(!near){stroke(tx*1.39,ty*1.39,tx*1.68,ty*1.68,.11);continue;}
      const letters=roman[hour];
      for(let j=0;j<letters.length;j++){
        const offset=(j-(letters.length-1)/2)*.14;
        const point=(x,y)=>[tx*(1.52+y)+ty*(offset+x),ty*(1.52+y)-tx*(offset+x)];
        const line=(ax,ay,bx,by)=>stroke(...point(ax,ay),...point(bx,by),.035);
        if(letters[j]==='I')line(0,-.14,0,.14);
        if(letters[j]==='V'){line(-.05,.14,0,-.14);line(0,-.14,.05,.14);}
        if(letters[j]==='X'){line(-.05,-.14,.05,.14);line(-.05,.14,.05,-.14);}
      }
    }
    stroke(0,0,-.58,.42,.12,'iron');stroke(0,0,.35,.98,.09,'iron');
  }
  // Open observation crown. Separate piers/arch spandrels retain true holes.
  trim(0,38.25,4.3,4.3,0.65);
  for(const x of [-1.43,1.43])for(const z of [-1.43,1.43])box('concrete',x,40.55,z,.62,4.5,.62);
  for(let side=0;side<4;side++){
    const shape=new THREE.Shape();shape.moveTo(-1.12,41.2);shape.lineTo(-1.12,42.8);shape.lineTo(1.12,42.8);shape.lineTo(1.12,41.2);
    for(let i=0;i<=(near?16:6);i++){const a=i*Math.PI/(near?16:6);shape.lineTo(Math.cos(a)*1.12,41.2+Math.sin(a)*1.12);}
    shape.closePath();const g=new THREE.ExtrudeGeometry(shape,{depth:.55,bevelEnabled:false,curveSegments:8});
    g.translate(0,0,1.15);g.rotateY(side*Math.PI/2);put(g,'concrete');
  }
  trim(0,42.9,3.9,3.9,.28);pyramid(0,43.65,0,3.9,1.35);
  cylinder('roof',0,44.65,0,0.05,.28,.7,8);
  // Four corner finials surround the recessed, open crown.
  for(const x of [-3.12,3.12])for(const z of [-2.87,2.87]){
    box('concrete',x,38.12,z,.55,.7,.55);cylinder('roof',x,38.95,z,.04,.23,1.1,near?8:4);
  }
  // Curtain wall occupies only its thin mapped strip, not a solid enclosure.
  const end=spec.turretStation, wallStart=-3.5,wallEnd=end+1.7;
  box('stone',(wallStart+wallEnd)/2,.38,1.0,wallStart-wallEnd,.76,1.05);
  box('concrete',(wallStart+wallEnd)/2,3.45,1.0,wallStart-wallEnd,5.5,.72);
  box('roof',(wallStart+wallEnd)/2,6.35,1.0,wallStart-wallEnd,.3,1.02);
  for(let x=wallEnd+2.5;x<wallStart-1;x+=4){box('concrete',x,3.6,1,.34,5.9,1.03);box('roof',x,6.65,1,.6,.26,1.16);}
  // Smaller counterpoint turret, with pilasters, scroll shoulders and obelisk.
  box('stone',end,.38,0,3.65,.76,3.6);
  box('concrete',end,5.65,0,3.25,9.8,3.22);
  trim(end,4.5,3.6,3.5,.35);trim(end,10.65,3.7,3.65,.4);
  for(const x of [-1.4,1.4])for(const z of [-1.39,1.39])box('concrete',end+x,5.85,z,.3,9.4,.3);
  for(const x of [-1,1]){
    const g=new THREE.TorusGeometry(.43,.16,4,near?12:6,Math.PI*1.55);g.rotateZ(x>0?0:Math.PI/2);g.translate(end+x,11.17,0);put(g,'roof');
  }
  box('roof',end,11.17,0,.85,.65,.85);pyramid(end,12.08,0,.65,1.44);
  // Recessed entrances, memorial panels and irregular landward shaft windows.
  box('glass',3.83,1.95,0,.03,2.8,1.25);
  box('stone',0,2.8,-3.44,2.15,3.5,.05);
  box('iron',0,1.2,-3.50,1.7,.68,.035);
  if(near){
    for(const side of [-1,1])for(const x of [-2.65,2.65])box('roof',x,3.8,side*3.4,.28,4.8,.2);
    for(const [x,y] of [[-1,18],[1,18],[-1,22],[1,26]])box('glass',x,y,3.19,.68,1.8,.035);
    for(const side of [-1,1])for(const x of [-1,0,1])box('glass',x,27.5,side*3.19,.38,1.15,.04);
  }
  const root=b.finish();root.rotation.y=spec.rotationY;
  root.traverse(mesh=>{if(mesh.isMesh){mesh.material.color.set(HORLOGE_PALETTES.light[mesh.material.name]);mesh.geometry.deleteAttribute('bridgeLift');}});
  root.userData.elevationDatum='Base y=0 on flat rendered quay; no surveyed elevation or drivable surface';
  return root;
}
