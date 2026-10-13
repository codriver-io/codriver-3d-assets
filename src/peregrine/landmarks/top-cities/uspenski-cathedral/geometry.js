import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';

// Original metre geometry: north/south cruciform arms, east apses, west porch,
// south bell tower. Mapped yaw is baked into every mesh at the end.
export function create({ detail = 'near' } = {}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const box=(m,x,y,z,w,h,d,a=0)=>b.box(m,[x,y,z],[w,h,d],a);
  const put=(g,m)=>b.put(g,m);
  // Remove internal caps where the roof closes the masonry shell; these faces
  // formerly formed reciprocal copper/brick depth layers in far LOD.
  function withoutFaces(g,predicate){const n=g.attributes.normal,index=g.index?.array??Array.from({length:n.count},(_,i)=>i),keep=[];for(let i=0;i<index.length;i+=3){if(!predicate(n.getX(index[i]),n.getY(index[i]),n.getZ(index[i])))keep.push(index[i],index[i+1],index[i+2]);}g.setIndex(keep);return g;}

  const seg=near?20:10, arcSeg=near?10:3;
  const turn=(x,z,a)=>[x*Math.cos(a)+z*Math.sin(a),z*Math.cos(a)-x*Math.sin(a)];
  function cyl(m,x,z,r,y0,y1,n=seg,rt=r){const g=new THREE.CylinderGeometry(rt,r,y1-y0,n);g.translate(x,(y0+y1)/2,z);put(g,m);}
  function lathe(m,x,z,p,n=seg){const g=new THREE.LatheGeometry(p.map(([r,y])=>new THREE.Vector2(r,y)),n);g.translate(x,0,z);put(g,m);}
  function archShape(w,bot,spring){const r=w/2,s=new THREE.Shape();s.moveTo(-r,bot);s.lineTo(r,bot);for(let i=0;i<=arcSeg;i++){const t=i*Math.PI/arcSeg;s.lineTo(r*Math.cos(t),spring+r*Math.sin(t));}s.closePath();return s;}
  // A real pierced wall, with inset single-sided panes. No glass laid over a box.
  function wall(x,z,a,w,top,windows,mat='brick',bottom=.7,open=false){
    const s=new THREE.Shape();s.moveTo(-w/2,bottom);s.lineTo(w/2,bottom);s.lineTo(w/2,top);s.lineTo(-w/2,top);s.closePath();
    if(open){const [cx,bot,spring,ww]=windows[0],r=ww/2;s.curves=[];s.moveTo(-w/2,bottom);s.lineTo(cx-r,bottom);s.lineTo(cx-r,spring);for(let i=arcSeg;i>=0;i--){const t=i*Math.PI/arcSeg;s.lineTo(cx+r*Math.cos(t),spring+r*Math.sin(t));}s.lineTo(cx+r,bottom);s.lineTo(w/2,bottom);s.lineTo(w/2,top);s.lineTo(-w/2,top);s.closePath();}
    if(!open)for(const q of windows){const [cx,bot,spring,ww]=q;const h=archShape(ww,bot,spring);s.holes.push(new THREE.Path(h.getPoints(arcSeg).map(p=>new THREE.Vector2(p.x+cx,p.y))));}
    const g=new THREE.ExtrudeGeometry(s,{depth:.48,bevelEnabled:false});g.translate(0,0,-.48);g.rotateY(a);g.translate(x,0,z);put(g,mat);
    if(!open)for(const [cx,bot,spring,ww] of windows){
      const pane=new THREE.ShapeGeometry(archShape(ww,bot,spring));pane.translate(cx,0,-.22);pane.rotateY(a);pane.translate(x,0,z);put(pane,'glass');
      // Stepped brick archivolts and paired jambs are structural relief in both
      // LODs. Far retains one broad tier; near adds the recessed outer order.
      const r=ww/2;
      for(const [inner,outer,proud] of near?[[r,r+.30,.34],[r+.30,r+.60,.17]]:[[r,r+.53,.34]]){
        const band=new THREE.Shape();
        for(let i=0;i<=arcSeg;i++){const t=i*Math.PI/arcSeg;(i?band.lineTo:band.moveTo).call(band,outer*Math.cos(t),spring+outer*Math.sin(t));}
        for(let i=arcSeg;i>=0;i--){const t=i*Math.PI/arcSeg;band.lineTo(inner*Math.cos(t),spring+inner*Math.sin(t));}band.closePath();
        const frame=near?new THREE.ExtrudeGeometry(band,{depth:proud+.2,bevelEnabled:false}):new THREE.ShapeGeometry(band);frame.translate(cx,0,near?-.2:proud);frame.rotateY(a);frame.translate(x,0,z);put(frame,'brick');
        for(const side of [-1,1]){const [u,v]=turn(cx+side*(inner+outer)/2,(proud-.2)/2,a);if(near)box('brick',x+u,(bot+spring)/2,z+v,outer-inner,spring-bot,proud+.2,a);else {const shaft=new THREE.PlaneGeometry(outer-inner,spring-bot);shaft.translate(cx+side*(inner+outer)/2,(bot+spring)/2,proud);shaft.rotateY(a);shaft.translate(x,0,z);put(shaft,'brick');}}
      }
      const [u,v]=turn(cx,.03,a);if(bot>1){const sill=new THREE.PlaneGeometry(ww+.35,.22);sill.rotateY(a);sill.translate(x+u,bot-.12,z+v);put(sill,'trim');}
      if(near&&bot>1){const [u,v]=turn(cx,-.08,a),height=spring+r-bot-.15;const sash=new THREE.PlaneGeometry(.075,height);sash.rotateY(a);sash.translate(x+u,bot+height/2,z+v);put(sash,'trim');}
    }
  }
  function cross(x,z,base,h){box('lamp',x,base+h/2,z,.10,h,.10);box('lamp',x,base+h*.70,z,h*.59,.10,.10);if(near){box('lamp',x,base+h*.88,z,h*.32,.07,.09);const g=new THREE.BoxGeometry(h*.39,.07,.09);g.rotateZ(-.22);g.translate(x,base+h*.3,z);put(g,'lamp');}}
  function onion(x,z,y,r,h){lathe('lamp',x,z,[[r*.34,y],[r*.75,y+h*.12],[r,y+h*.36],[r*.91,y+h*.58],[r*.48,y+h*.80],[r*.12,y+h],[0,y+h+.12]],near?16:5);cross(x,z,y+h-.04,h>.9?1.8:1.2);}
  function gable(x,z,a,w,y,rise,depth){const s=new THREE.Shape();s.moveTo(-w/2,y);s.lineTo(w/2,y);s.lineTo(0,y+rise);s.closePath();if(rise>5)s.holes.push(new THREE.Path(archShape(3.4,y+.5,y+2.3).getPoints(arcSeg)));const g=new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:false});withoutFaces(g,(nx,ny)=>ny<-.99);g.translate(0,0,-depth);g.rotateY(a);g.translate(x,0,z);put(g,'brick');
    if(rise>5){
      const spring=y+2.3,r=1.7,outer=r+.55,band=new THREE.Shape();
      for(let i=0;i<=arcSeg;i++){const t=i*Math.PI/arcSeg;(i?band.lineTo:band.moveTo).call(band,outer*Math.cos(t),spring+outer*Math.sin(t));}
      for(let i=arcSeg;i>=0;i--){const t=i*Math.PI/arcSeg;band.lineTo(r*Math.cos(t),spring+r*Math.sin(t));}band.closePath();
      const surround=new THREE.ExtrudeGeometry(band,{depth:.65,bevelEnabled:false});surround.translate(0,0,-.18);surround.rotateY(a);surround.translate(x,0,z);put(surround,'brick');
      for(const side of [-1,1]){const [px,pz]=turn(side*(r+.275),.12,a);box('brick',x+px,y+1.4,z+pz,.55,1.8,.6,a);}
      // Stepped brick cornice follows the triangular gable, ending in the
      // continuous horizontal cornice rather than unsupported tips.
      for(const side of [-1,1]){
        const [px,pz]=turn(side*(w/2-.3),.20,a),[qx,qz]=turn(0,.20,a);
        b.bar('brick',[x+px,y+.12,z+pz],[x+qx,y+rise-.3,z+qz],.42,.5);
      }
    }
    // Two continuous copper roof slopes, with a closed triangular underside.
    const rr=w/2+(!near&&rise<2?-.05:.25),shape=new THREE.Shape([new THREE.Vector2(-rr,y+rise*.03),new THREE.Vector2(0,y+rise+.2),new THREE.Vector2(rr,y+rise*.03),new THREE.Vector2(rr,y+rise*.03-.16),new THREE.Vector2(0,y+rise+.02),new THREE.Vector2(-rr,y+rise*.03-.16)]);
    const roof=new THREE.ExtrudeGeometry(shape,{depth:depth+.2,bevelEnabled:false});if(!near)withoutFaces(roof,(nx,ny,nz)=>Math.abs(nz)>.99);roof.translate(0,0,-depth);roof.rotateY(a);roof.translate(x,0,z);put(roof,'copper');
  }
  // Low granite plinth follows the church's chamfered plan, not a neighbourhood pad.
  const plan=[[-7.4,-12.7],[7.4,-12.7],[12.7,-7.4],[12.7,7.4],[7.4,12.7],[-7.4,12.7],[-12.7,7.4],[-12.7,-7.4]];
  const footing=new THREE.Shape(plan.map(([x,z])=>new THREE.Vector2(x,-z)));
  const fg=new THREE.ExtrudeGeometry(footing,{depth:.7,bevelEnabled:false});fg.rotateX(-Math.PI/2);put(fg,'granite');
  // Eight external pierced facades: long sides have two rows; corner walls one.
  for(let i=0;i<plan.length;i++){
    const p=plan[i],q=plan[(i+1)%plan.length],dx=q[0]-p[0],dz=q[1]-p[1],w=Math.hypot(dx,dz),a=Math.atan2(dz,-dx),x=(p[0]+q[0])/2,z=(p[1]+q[1])/2;
    const cardinal=i%2===0,windows=[];
    for(const u of cardinal?[-4.7,0,4.7]:[-1.8,1.8]){
      windows.push(i===6&&u===0?[.82,.9,3.4,1.55]:[u,3.0,6.0,cardinal?1.45:1.15]);
      if(cardinal)windows.push([u,10.6,12.3,1.4]);
    }
    wall(x,z,a,w,cardinal?15:12.7,windows);
    const [ox,oz]=turn(0,.1,a);for(const y of [8.8,9.3,14.7])box('brick',x+ox,y,z+oz,w+.25,.36,1.1,a);box('brick',x,cardinal?15.12:12.85,z,w+.3,.4,1.2,a);
    for(const u of cardinal?[-7.1,-2.5,2.5,7.1]:[-w/2+.3,w/2-.3]){const [px,pz]=turn(u,.16,a);box('brick',x+px,7.7,z+pz,.8,14,.95,a);}
    if(cardinal){
      gable(x,z,a,14.8,15,6,5.3);
      // The tall centre arch in each arm's pediment is separate and dark.
      const g=new THREE.ShapeGeometry(archShape(3.4,15.5,17.3));g.translate(0,0,-.22);g.rotateY(a);g.translate(x,0,z);put(g,'glass');
      if(near)for(let k=-6.3;k<=6.3;k+=.9){const [u,v]=turn(k,.21,a);box('brick',x+u,14.4,z+v,.26,.5,.24,a);}
    }
  }
  // Corner hip roofs are closed, low copper pyramids over the chamfer masses.
  for(const sx of [-1,1])for(const sz of [-1,1]){const g=new THREE.ConeGeometry(4.1,2.0,4);g.rotateY(Math.PI/4);g.translate(sx*9.8,13.7,sz*9.8);put(g,'copper');}
  // Central upper square crossing and its broad copper shoulder.
  box('brick',-.12,16.0,0,14.65,7.0,14.65);
  lathe('copper',-.12,0,[[7.3,19.3],[7.3,19.8],[4.95,21.8]],near?24:12);
  // Twelve arched windows around the tall central drum: actual pierced facets.
  const n=12,r=4.75,apothem=r*Math.cos(Math.PI/n),width=2*r*Math.sin(Math.PI/n);
  for(let i=0;i<n;i++){
    const a=i*2*Math.PI/n,[x,z]=turn(0,apothem,a);wall(x-.12,z,a,width,28.1,[[0,22.4,26.2,1.65]],'brick',21.7);
    const [u,v]=turn(0,apothem+.1,a);box('brick',u-.12,28.1,v,width+.06,.4,.8,a);
  }
  // Aerial reference: steep copper shoulder, tall narrow lantern and small
  // gilded onion. Redistribute the crown height without moving the cross.
  const crown=[[5.2,28.0],[5.2,28.15],[4.9,28.65],[3.4,30.65],
    [3.2,30.9],[1.8,31.15],[1.75,33.2],[1.45,33.45],[.7,34.3],[.7,34.6],[0,34.6]];
  lathe('copper',-.12,0,crown,near?24:12);
  for(let i=0;i<12;i++){
    if(!near)continue;
    const a=i*Math.PI/6;
    // Every rib follows the roof surface and ends at a shoulder/lantern seat.
    for(const [k,j] of [[2,3],[5,6]]){
      const p=turn(crown[k][0],0,a),q=turn(crown[j][0],0,a);
      b.bar('copper',[p[0]-.12,crown[k][1],p[1]],[q[0]-.12,crown[j][1],q[1]],.13,.13);
    }
  }
  onion(-.12,0,34.6,.88,1.48);
  // Four larger intermediate turrets on the arm ridges.
  for(const [x,z] of [[-.1,-11.3],[-11.2,.27],[-.17,11.22],[11.13,-.08]]){
    for(let i=0;i<8;i++){const a=i*Math.PI/4,[u,v]=turn(0,1.17,a);wall(x+u,z+v,a,.97,23,[[0,20.6,22.0,.44]],'brick',19.2);}if(near)cyl('copper',x,z,1.4,22.7,23.1);
    lathe('copper',x,z,[[1.35,23.0],[1.30,23.7],[.85,24.8],[.42,25]],near?12:8);onion(x,z,25,0.85,1.0);
  }
  // Eight corner pinnacles, supported continuously by full-height brick buttresses.
  for(const [x,z] of [[-6.91,-12.82],[6.62,-12.99],[12.69,-6.79],[12.74,6.53],[6.55,12.98],[-6.71,13.09],[-13.03,-6.54],[-12.82,7.04]]){
    box('brick',x,9.1,z,1.6,16.8,1.6);box('brick',x,16.8,z,2.2,.55,2.2);box('brick',x,17.8,z,1.9,1.5,1.9);
    cyl('brick',x,z,1.35,18.2,18.9,near?8:4);lathe('copper',x,z,[[1.45,18.8],[1.35,19.4],[.32,22]],near?8:4);onion(x,z,22,.40,.65);
  }
  // East semicircular apse and two lower side apses, all within mapped envelopes.
  for(const [x,z,rx,rz,y] of [[15.7,.24,3.15,5.25,12],[13.45,-8.1,1.75,3.0,7.3],[13.55,8.6,1.75,3.0,7.3]]){
    const count=near?16:10;
    for(let i=0;i<count;i++){
      const t=i*2*Math.PI/count,u=(i+1)*2*Math.PI/count;
      const p=[x+rx*Math.cos(t),z+rz*Math.sin(t)],q=[x+rx*Math.cos(u),z+rz*Math.sin(u)],dx=q[0]-p[0],dz=q[1]-p[1];
      const w=Math.hypot(dx,dz),a=Math.atan2(dz,-dx),cx=(p[0]+q[0])/2,cz=(p[1]+q[1])/2;
      wall(cx,cz,a,w,y,i%2===0&&Math.cos((t+u)/2)>.3?[[0,2.2,y-2.4,Math.min(.9,w*.55)]]:[]);
    }
    const roof=new THREE.ConeGeometry(1,y>10?4:1.5,count);roof.scale(rx+.18,1,rz+.18);roof.translate(x,y+(y>10?2:.75),z);put(roof,'copper');
  }
  // Low south connector and small, square, open bell-tower stage.
  const connector=withoutFaces(new THREE.BoxGeometry(4.8,7.8,12),(nx,ny)=>ny>.99);connector.translate(-.5,3.9,18.75);put(connector,'brick');gable(-.5,24.5,0,4.8,7.8,1.1,12);
  box('brick',-.3,4.7,25.88,5.65,9.4,5.65);box('copper',-.3,9.6,25.88,5.95,.35,5.95);
  for(let i=0;i<4;i++){const a=i*Math.PI/2,[u,v]=turn(0,2.12,a);wall(u-.21,v+25.88,a,4.25,15.6,[[-.98,11,13.6,1.15],[.98,11,13.6,1.15]],'brick',9.8);}
  box('brick',-.21,15.9,25.88,4.65,.6,4.65);
  const cap=new THREE.ConeGeometry(2.2,4.6,4);cap.rotateY(Math.PI/4);cap.translate(-.12,18.4,25.88);put(cap,'copper');onion(-.12,25.88,20.6,.42,.65);
  // West porch: granite columns actually hold a pierced brick arch and gabled roof.
  box('granite',-14.1,.45,.82,3.25,.9,3.2);
  for(const z of [-.48,2.12])cyl('granite',-15.30,z,.35,.9,4.2,near?12:6);
  wall(-15.45,.82,-Math.PI/2,3.25,6.5,[[0,4.1,4.55,2.2]],'brick',4.2,true);
  gable(-15.5,.82,-Math.PI/2,3.4,6.5,1,3.0);
  const steps=near?6:3;for(let i=0;i<steps;i++)box('granite',-16.5+i*.30,.9*(i+1)/steps/2,.82,.3,.9*(i+1)/steps,2.4);
  const root=b.finish();
  root.rotation.y=SPEC.yaw;root.updateMatrixWorld(true);
  for(const m of root.children){m.geometry.applyMatrix4(root.matrixWorld);const old=m.geometry;m.geometry=mergeVertices(old,1e-4);old.dispose();m.geometry.computeBoundingBox();m.geometry.computeBoundingSphere();}
  root.rotation.y=0;root.updateMatrixWorld(true);return root;
}
