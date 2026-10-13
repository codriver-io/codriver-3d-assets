import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, ANGLE } from './config.js';

// Architectural u across the south frontage, v towards Parque Morazán.
// Rotation is baked into vertices; no runtime modules or image textures.
export function create({detail='near'}={}) {
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 const box=(m,x0,x1,y0,y1,z0,z1)=>b.box(m,[(x0+x1)/2,(y0+y1)/2,(z0+z1)/2],[x1-x0,y1-y0,z1-z0]);
 const front=21.05,eave=12.0;
 const frame=(g,x,y,z,a=0)=>g.rotateY(a).translate(x,y,z);
 const rect=(w,h)=>new THREE.Shape([[-w/2,0],[w/2,0],[w/2,h],[-w/2,h]].map(p=>new THREE.Vector2(...p)));
 const ring=(w,h,t)=>{const s=rect(w,h),p=new THREE.Path();p.moveTo(-w/2+t,t);p.lineTo(-w/2+t,h-t);p.lineTo(w/2-t,h-t);p.lineTo(w/2-t,t);p.closePath();s.holes.push(p);return s;};
 const arc=(w,base)=>{const s=new THREE.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.absarc(0,base,w/2,0,Math.PI,false);s.lineTo(-w/2,0);return s;};
 function cap(x,y,z,w,kind='triangle') {
  const pts=kind==='triangle'?[[-w/2,0],[w/2,0],[0,.62]]:null;
  const s=pts?new THREE.Shape(pts.map(p=>new THREE.Vector2(...p))):arc(w,.05);
  b.put(frame(new THREE.ExtrudeGeometry(s,{depth:.23,bevelEnabled:false,curveSegments:near?12:6}),x,y,z),'trim');

 }
 // Each wall has real holes and inset glazing. No glass layered over solid walls.
 function wall(cx,cz,length,a,height,centers,{hero=false,doors=[],panels=false}={}) {
  const shape=rect(length,height),windows=[];
  for(const x of centers)for(const level of [0,1]) {
   const door=level===0&&doors.some(d=>Math.abs(d-x)<.1);
   const y=level?7.1:.9,w=door?2.65:hero&&height>14&&Math.abs(x)<5?2.55:2.15,h=level?(hero&&height>14&&Math.abs(x)<5?5.0:4.4):4.55;
   const path=new THREE.Path();path.moveTo(x-w/2,y);path.lineTo(x-w/2,y+h);path.lineTo(x+w/2,y+h);path.lineTo(x+w/2,y);path.closePath();shape.holes.push(path);
   windows.push({x,y,w,h,door,level});
  }
  if(hero&&height>14)for(const x of centers){
   const fan=arc(1.9,.05),path=new THREE.Path(fan.getPoints(near?12:6).map(p=>new THREE.Vector2(p.x+x,p.y+12.72)));shape.holes.push(path);
  }
  b.put(frame(new THREE.ExtrudeGeometry(shape,{depth:.5,bevelEnabled:false}).translate(0,0,-.5),cx,0,cz,a),'panel');
  const place=(g,x,y,z,m)=>b.put(frame(g,cx+x*Math.cos(a)+z*Math.sin(a),y,cz-x*Math.sin(a)+z*Math.cos(a),a),m);
  for(const q of windows) {
   const {x,y,w,h,door,level}=q;
   place(new THREE.BoxGeometry(w,h,.10),x,y+h/2,-.27,door?'door':'glass');
   place(near?new THREE.ExtrudeGeometry(ring(w+.28,h+.26,.14),{depth:.13,bevelEnabled:false}):new THREE.ShapeGeometry(ring(w+.28,h+.26,.14)),x,y-.13,.12,'trim');
   // Mullions live in the opening, in front of recessed panes, not in front of a wall.
   for(const dx of near?[-w/3,0,w/3]:[0])place(near?new THREE.BoxGeometry(.055,h,.12):new THREE.PlaneGeometry(.09,h),x+dx,y+h/2,-.10,'trim');
   for(let yy=y+(near?.68:1.25);yy<y+h-.2;yy+=near?.68:1.25)place(near?new THREE.BoxGeometry(w,.06,.12):new THREE.PlaneGeometry(w,.075),x,yy,-.10,'trim');
   if(hero&&!level){
    const g=new THREE.BoxGeometry(w+.55,.20,.46);place(g,x,y+h+.22,.20,'trim');
    // Arch / triangular window hoods alternate, as on the metal school frontage.
    // Hood geometry is added in the shared facade frame below.
   }
  }
  // Projecting steel posts and string courses; all share trim material.
  for(let x=-length/2+.28;x<length/2;x+=hero?4.4:4.8) {
   place(new THREE.BoxGeometry(hero?.20:.14,height-.3,.30),x,height/2+.15,.17,'trim');
   if(near&&hero)for(const yy of [.35,5.8,6.45,11.6,13.5].filter(y=>y<height))place(new THREE.BoxGeometry(.45,.22,.39),x,yy,.21,'trim');
  }
  for(const yy of [.30,6.25,height-.25])place(new THREE.BoxGeometry(length,.21,.30),0,yy,.17,'trim');
  // Embossed iron cassette panels remain in the solid webs between openings.
  if(panels){
   const webs=centers.slice(1).map((x,i)=>(x+centers[i])/2);
   for(const x of webs)for(const y of near?[1.0,2.05,3.1,4.15,5.2,7.05,8.1,9.15,10.2,11.25]:[2.3,4.5,8.0,10.2]) {
    const w=1.45,h=near?.72:1.35;
    if(windows.some(q=>Math.abs(q.x-x)<(q.w+w)/2+.12 && y<q.y+q.h && y+h>q.y))continue;
    if(near){
     // Four bevelled slopes plus central face, all original pressed-panel geometry.
     const v=[[-w/2,0,0],[w/2,0,0],[w/2,h,0],[-w/2,h,0],[-w/2+.13,.12,.07],[w/2-.13,.12,.07],[w/2-.13,h-.12,.07],[-w/2+.13,h-.12,.07]];
     const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v.flat(),3));g.setIndex([0,1,5,0,5,4,1,2,6,1,6,5,2,3,7,2,7,6,3,0,4,3,4,7,4,5,6,4,6,7]);g.computeVertexNormals();place(g,x,y,.15,'relief');
    }
   }
  }
 }
 const bays=Array.from({length:13},(_,i)=>(i-6)*4.4);
 // Raised central 5 bays; outer wings retain the lower cornice.
 for(const [x0,x1,height] of [[-29.65,-11.0,eave],[-11,11,14.5],[11,29.9,eave]]) {
  const c=(x0+x1)/2;wall(c,front,x1-x0,0,height,bays.filter(x=>x>x0+1.3&&x<x1-1.3).map(x=>x-c),{hero:true,doors:[-17.6,0,17.6].map(x=>x-c),panels:true});
 }
 // Other elevations and all courtyard walls; the notched garden stays genuinely open.
 wall(0,-21.25,59.4,Math.PI,eave,[-25,-20,-15,-10,-5,0,5,10,15,20,25]);
 wall(-29.65,-.1,42.3,-Math.PI/2,eave,[-17,-12,-7,-2,3,8,13,18]);
 wall(29.9,-.1,42.3,Math.PI/2,eave,[-17,-12,-7,-2,3,8,13,18]);
 wall(-17.7,-3.65,28.3,Math.PI/2,11.7,[-10,-5,0,5,10]);
 wall(20.25,-3.65,28.3,-Math.PI/2,11.7,[-10,-5,0,5,10]);
 wall(1.3,-17.95,37.95,0,11.7,[-15,-10,-5,0,5,10,15]);
 wall(-14.05,9.95,7.3,Math.PI,11.7,[-1.9,1.9]);
 wall(15.2,9.95,10.1,Math.PI,11.7,[-2.6,2.6]);
 wall(-10.4,3.0,13.9,-Math.PI/2,11.7,[-4.5,0,4.5]);
 wall(10.15,3.0,13.9,Math.PI/2,11.7,[-4.5,0,4.5]);
 wall(-.125,-3.95,20.55,Math.PI,11.7,[-7.5,-2.5,2.5,7.5]);
 // Base panels follow the outer shell only; no generic ground pad or courtyard slab.
 for(const [x0,x1] of [[-29.65,29.9]])box('panel',x0,x1,0,.32,front-.50,front+.12);
 box('panel',-29.65,29.9,0,.32,-21.45,-20.75);
 box('panel',-29.85,-29.1,0,.32,-21.25,front);box('panel',29.35,30.1,0,.32,-21.25,front);
 for(const x of bays) {
  cap(x,5.67,front+.17,2.7,Math.abs(x/4.4)%2===0?'triangle':'arch');
  if(Math.abs(x)>11)cap(x,11.55,front+.12,2.6,'arch');
 }
 // Five small transom arches crown the central pavilion; a true dark fanlight hole.
 for(const x of [-8.8,-4.4,0,4.4,8.8]) {
  const s=arc(1.9,.05);
  b.put(frame(new THREE.ShapeGeometry(s,near?12:6),x,12.72,front-.24),'glass');
  const out=arc(2.15,.05),hole=new THREE.Path(s.getPoints(near?12:6));out.holes.push(hole);
  b.put(frame(new THREE.ShapeGeometry(out,near?12:6),x,12.72,front+.36),'trim');
  if(near)box('trim',x-.035,x+.035,12.73,13.55,front+.36,front+.44);
 }
 // Flat, projecting cornices cap all three front masses.
 for(const [x0,x1,h] of [[-29.7,-11,12],[-11,11,14.5],[11,29.9,12]]) {
  box('trim',x0,x1,h-.10,h+.12,front,front+.35);
  box('trim',x0,x1,h+.20,h+.38,front,front+.44);
 }
 // Main pediment and low end pediments are original geometric pressed-metal assemblies.
 function pediment(cx,half,y,apex) {
  const shape=new THREE.Shape([[-half,y],[half,y],[0,apex]].map(p=>new THREE.Vector2(...p)));
  b.put(new THREE.ExtrudeGeometry(shape,{depth:.25,bevelEnabled:false}).translate(cx,0,front),'panel');
  for(const sign of [-1,1])b.bar('trim',[cx,apex+.07,front+.38],[cx+sign*(half+.18),y-.01,front+.38],.24,.24);
  box('trim',cx-half-.2,cx+half+.2,y-.1,y+.1,front,front+.5);
 }
 pediment(0,6.2,14.88,17.0);pediment(-26.4,2.8,12.45,13.35);pediment(26.4,2.8,12.45,13.35);
 // Small crest and round finials are seated on cornices/pediment supports.
 b.put(frame(new THREE.TorusGeometry(.43,.105,5,near?16:8),0,13.9,front+.37),'iron');
 for(const x of [-29.35,-22,-11,-4.4,4.4,11,22,29.4,0]) {
  const y=x===0?17.0:Math.abs(x)<11?14.88:Math.abs(x)===11?14.88:12.38;
  box('trim',x-.15,x+.15,y,y+.25,front,front+.30);
  const g=new THREE.SphereGeometry(.18,near?10:5,near?6:4);g.scale(1,1.5,1);g.translate(x,y+.4,front+.04);b.put(g,'trim');
 }
 // Hipped pale standing-seam roof volumes, bounded by the mapped exterior and garden.
 function hip(x0,x1,z0,z1,h,rise) {
  const dx=x1-x0,dz=z1-z0,alongX=dx>dz,offset=Math.min(dx,dz)*.35;
  const v=[[x0,h,z0],[x1,h,z0],[x1,h,z1],[x0,h,z1]];
  if(alongX)v.push([x0+offset,h+rise,(z0+z1)/2],[x1-offset,h+rise,(z0+z1)/2]);
  else v.push([(x0+x1)/2,h+rise,z0+offset],[(x0+x1)/2,h+rise,z1-offset]);
  const inds=alongX?[0,4,1,1,4,5,1,5,2,2,5,3,3,5,4,3,4,0]:[0,4,1,1,4,2,2,4,5,2,5,3,3,5,0,0,5,4];
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v.flat(),3));g.setIndex(inds);g.computeVertexNormals();b.put(g,'roof');
  if(near){
   // Seams sit on the roof itself and use its material, avoiding material cycles.
   if(alongX)for(let x=x0+offset;x<x1-offset;x+=1.0)for(const s of [-1,1])b.bar('roof',[x,h+rise+.035,(z0+z1)/2],[x,h+.035,s<0?z0:z1],.04,.04);
   else for(let z=z0+offset;z<z1-offset;z+=1.0)for(const s of [-1,1])b.bar('roof',[(x0+x1)/2,h+rise+.035,z],[s<0?x0:x1,h+.035,z],.04,.04);
  }
 }
 hip(-29.55,-17.8,-21.1,20.9,12.1,2.05);hip(20.35,29.75,-21.1,20.9,12.1,1.7);
 hip(-17.8,20.35,10.1,20.9,12.1,1.9);hip(-17.8,20.35,-21.1,-18.05,12.1,.85);
 hip(-10.25,10.0,-3.8,10.1,12.1,2.1);
 // Central raised frontage has its own shallow roof behind the pediment.
 hip(-10.85,10.85,16.4,20.8,14.58,.95);
 const root=b.finish();
 root.traverse(o=>{if(o.isMesh){o.geometry.rotateY(ANGLE);const g=mergeVertices(o.geometry,1e-5);o.geometry.dispose();o.geometry=g;g.computeBoundingBox();g.computeBoundingSphere();}});
 return root;
}
