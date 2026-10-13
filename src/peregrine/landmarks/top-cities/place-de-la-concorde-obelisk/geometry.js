import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';

// Original metre-scale geometry. No reference texture, no literal transcription.
const ROT = -26 * Math.PI / 180;
export const FOUNTAINS = [[27.60754,-57.39060,7.65],[-27.76641,57.53405,7.50]];
// Four nearest rostral lamp columns: representative photographic placement,
// not mapped street-lamp nodes (the supplementary OSM request timed out).
export const COLUMNS = FOUNTAINS.flatMap(([x,z])=>[-1,1].map(s=>[x+s*12*.898794,z+s*12*.438371]));
export function create({ detail = 'near' } = {}) {
 const near = detail === 'near', b = assetBuilder({...SPEC,palette:PALETTES.light},detail);
 const seg = near ? 32 : 16;
 const put=(g,mat,x=0,z=0)=>{g.translate(x,0,z); b.put(g,mat);};
 const cyl=(mat,x,z,y,r,h,rt=r,n=seg)=>put(new THREE.CylinderGeometry(rt,r,h,n).translate(0,y+h/2,0),mat,x,z);
 const lathe=(mat,x,z,profile,n=seg)=>put(new THREE.LatheGeometry(profile.map(([r,y])=>new THREE.Vector2(r,y)),n),mat,x,z);
 const ball=(mat,pos,scale)=>{const g=new THREE.SphereGeometry(1,near?8:5,near?5:3);g.scale(...scale);g.translate(...pos);b.put(g,mat);};
 const box=(mat,y,w,h,d=w)=>{const g=new THREE.BoxGeometry(w,h,d).translate(0,y+h/2,0).rotateY(ROT);b.put(g,mat);};
 // Stacked steps taper into the squared granite pedestal. Adjacent layers meet,
 // rather than putting a second coloured surface in front of a full box.
 box('stone',0,9.5,.3);box('stone',.3,8.5,.3);box('stone',.6,7.5,.3);
 box('stone',.9,5.0,.7);box('stone',1.6,4.35,.45);
 box('stone',2.05,3.86,7.02);box('stone',9.07,4.2,.4);box('stone',9.47,4.65,.4);box('stone',9.87,3.4,.5);
 // Shaft square batter and integrated incisions: holes are triangulated in the
 // face itself; the engraving lies 14 cm inward with stone reveals, no overlay.
 const y0=10.37, ys=30.57, w0=2.55, wt=1.62;
 const half=y=> (w0+(wt-w0)*(y-y0)/(ys-y0))/2;
 const facePoint=(face,u,y,inset=0)=>new THREE.Vector3(u,y,half(y)-inset).applyAxisAngle(new THREE.Vector3(0,1,0),face*Math.PI/2+ROT);
 const positions=[], indices=[], recess=[], ri=[];
 function quad(arr,ix,ps){const k=arr.length/3;ps.forEach(v=>arr.push(...v.toArray()));ix.push(k,k+1,k+2,k,k+2,k+3);}
 for(let face=0;face<4;face++){
  const rows=near?25:1;
  for(let row=0;row<rows;row++){
   const lo=y0+(ys-y0)*row/rows,hi=y0+(ys-y0)*(row+1)/rows;
   const outer=[new THREE.Vector2(-half(lo),lo),new THREE.Vector2(half(lo),lo),new THREE.Vector2(half(hi),hi),new THREE.Vector2(-half(hi),hi)];
   const holes=[];
   if(near) for(let col=-1;col<=1;col++){
    const yy=(lo+hi)/2,xx=col*half(yy)*.57,ww=.10,hh=.20;
    // Oval/cross/angular abstract carvings retain the three inscription columns.
    const shape=(row+col+4)%3;
    let pts=shape===0?Array.from({length:8},(_,i)=>new THREE.Vector2(xx+ww*Math.cos(i*Math.PI/4),yy+hh*Math.sin(i*Math.PI/4))):shape===1?[[xx-ww,yy-hh],[xx+ww,yy-hh],[xx+ww,yy-.04],[xx+.05,yy-.04],[xx+.05,yy+hh],[xx-.05,yy+hh],[xx-.05,yy-.04],[xx-ww,yy-.04]].map(v=>new THREE.Vector2(...v)):[[xx-ww,yy-hh],[xx+ww,yy-hh],[xx+ww,yy+hh],[xx+.04,yy+hh],[xx+.04,yy-.1],[xx-ww,yy-.1]].map(v=>new THREE.Vector2(...v));
    holes.push(pts.reverse());
   }
   const verts=[...outer,...holes.flat()],k=positions.length/3;
   verts.forEach(v=>positions.push(...facePoint(face,v.x,v.y).toArray()));
   THREE.ShapeUtils.triangulateShape(outer,holes).forEach(t=>indices.push(...t.map(v=>k+v)));
   for(const hole of holes){
    const off=recess.length/3;
    hole.forEach(v=>recess.push(...facePoint(face,v.x,v.y,.14).toArray()));
    THREE.ShapeUtils.triangulateShape([...hole].reverse(),[]).forEach(t=>ri.push(...t.map(v=>off+hole.length-1-v)));
    for(let i=0;i<hole.length;i++){const a=hole[i],c=hole[(i+1)%hole.length];quad(positions,indices,[facePoint(face,a.x,a.y),facePoint(face,c.x,c.y),facePoint(face,c.x,c.y,.14),facePoint(face,a.x,a.y,.14)]);}
   }
  }
 }
 const mesh=(ps,ix,mat)=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(ps,3));g.setIndex(ix);g.computeVertexNormals();b.put(g,mat);};
 mesh(positions,indices,'granite');if(near)mesh(recess,ri,'engraving');
 // Square pyramidion is closed on four outward faces, not a rotational cone.
 const pp=[],ii=[];
 const corners=[[-wt/2,ys,wt/2],[wt/2,ys,wt/2],[wt/2,ys,-wt/2],[-wt/2,ys,-wt/2]].map(v=>new THREE.Vector3(...v).applyAxisAngle(new THREE.Vector3(0,1,0),ROT));
 for(let i=0;i<4;i++){let k=pp.length/3;pp.push(...corners[i].toArray(),...corners[(i+1)%4].toArray(),0,SPEC.height,0);ii.push(k,k+1,k+2);}mesh(pp,ii,'gold');
 // Human groups: bent legs, clothed hips, shoulders, heads and posed arms.
 function person(x,z,base,angle,scale=1,seated=false){
  const at=(u,y,v)=>[x+scale*(u*Math.cos(angle)+v*Math.sin(angle)),base+scale*y,z+scale*(-u*Math.sin(angle)+v*Math.cos(angle))];
  const limb=(a,c,r,mat='bronze')=>b.bar(mat,at(...a),at(...c),r*scale,r*scale,0,true);
  ball('patina',at(0,.65,0),[.43*scale,.58*scale,.34*scale]);
  ball('bronze',at(0,1.30,0),[.4*scale,.55*scale,.28*scale]);
  ball('bronze',at(0,1.99,0),[.24*scale,.31*scale,.24*scale]);
  if(seated){for(const u of [-.22,.22]){limb([u,.7,0],[u,.36,.5],.22,'patina');limb([u,.36,.5],[u,0,.66],.18,'patina');ball(near?'gold':'patina',at(u,.05,.76),[.19*scale,.11*scale,.27*scale]);}}
  else for(const u of [-.2,.2]){limb([u,.7,0],[u,.32,.08],.17,'patina');limb([u,.32,.08],[u,0,.16],.14,'patina');}
  limb([-.35,1.58,0],[-.63,1.12,.25],.13);limb([-.63,1.12,.25],[-.26,1.08,.48],.11);
  limb([.35,1.58,0],[.57,1.34,.35],.13);limb([.57,1.34,.35],[.39,1.68,.52],.11);
  if(near)ball('gold',at(0,2.20,0),[.27*scale,.10*scale,.26*scale]);
 }
 for(const [x,z,R] of FOUNTAINS){
  // Solid below-grade foundation skirt; grade hides it in Cityscape. Keep its
  // top inset inside the basin wall, so no new exposed layered rim is added.
  cyl('stone',x,z,-1.5,R-.25,1.5);
  // Profile closes round the outer wall and floor; water is recessed below rim.
  lathe('stone',x,z,[[R-.7,0],[R-.25,0],[R,.15],[R,1.0],[R-.35,1.12],[R-.7,1.0],[R-.7,.30],[R-.7,0]]);
  put(new THREE.RingGeometry(1.86,R-.71,seg).rotateX(-Math.PI/2).translate(0,.76,0),'water',x,z);
  lathe('patina',x,z,[[0,.3],[1.7,.3],[1.85,.7],[1.65,1.3],[1.1,1.8],[.82,4.35],[1.5,4.5],[2.7,4.85],[3.7,5.35],[4.1,5.8],[4.18,6.0],[4.0,6.1],[3.72,5.82],[2.5,5.25],[.8,5.05],[0,5.05]]);
  lathe('gold',x,z,[[3.95,5.82],[4.22,5.92],[4.22,6.08],[4.05,6.16],[3.95,6.02]]);
  cyl('patina',x,z,5.05,.68,3.2,.45);
  lathe('patina',x,z,[[0,8.25],[.45,8.25],[.85,8.45],[1.5,8.6],[2.0,8.72],[2.08,8.84],[1.95,9.05],[1.35,9.20],[.6,9.4],[0,9.45]]);
  lathe('gold',x,z,[[1.94,8.72],[2.10,8.76],[2.10,8.93],[1.97,8.98]]);
  for(let j=0;j<6;j++){
   const a=j*Math.PI/3,dx=Math.sin(a),dz=Math.cos(a);
   person(x+dx*1.18,z+dz*1.18,1.35,a,1.42,true);
   cyl('patina',x+dx*5.15,z+dz*5.15,.3,.42,.5,.38,near?8:5);
   person(x+dx*5.15,z+dz*5.15,.76,a+Math.PI,.91,false);
   // Fish held across the outer figures; golden dolphins beside the central plinth.
   ball('gold',[x+dx*5.15,.76+1.25,z+dz*5.15],[.52,.17,.17]);
   ball('gold',[x+dx*2.08,1.38,z+dz*2.08],[.24,.45,.26]);
   // Six decorated basin rim piers, including conical green caps.
   cyl('stone',x+dx*(R-.35),z+dz*(R-.35),.05,.46,1.15,.42,near?10:6);
   cyl('patina',x+dx*(R-.35),z+dz*(R-.35),1.20,.65,.43,.18,near?12:6);
   ball('patina',[x+dx*(R-.35),1.79,z+dz*(R-.35)],[.22,.22,.22]);
  }
  for(let j=0;j<3;j++){const a=j*2*Math.PI/3,xx=x+Math.sin(a)*.72,zz=z+Math.cos(a)*.72;cyl('patina',xx,zz,5.0,.42,.15);person(xx,zz,5.15,a,1.4,false);}
  // Gilded radial ribs are attached to the bowl underside, never free spokes.
  if(near)for(let j=0;j<24;j++){const a=j*Math.PI/12;const profile=[[1.5,4.55],[2.7,4.93],[3.6,5.39],[4,5.85]];for(let k=1;k<profile.length;k++){let [r,y]=profile[k-1],[s,t]=profile[k];b.bar('gold',[x+r*Math.sin(a),y,z+r*Math.cos(a)],[x+s*Math.sin(a),t,z+s*Math.cos(a)],.045,.045,0,true);}}
 }
 for(const [x,z] of COLUMNS){
  cyl('stone',x,z,-1.5,.85,1.5,.85,8);
  cyl('stone',x,z,0,.85,.3,.8,8);cyl('patina',x,z,.3,.65,.5,.45,8);
  cyl('patina',x,z,.8,.30,7.8,.23,near?12:8);
  for(const y of [1.1,3.2,5.4,7.8])cyl(near?'gold':'patina',x,z,y,.36,.18,.36,near?12:8);
  // Opposing ship prows visibly emerge from the column shaft, two tiers.
  for(const y of [3.5,5.7])for(const s of [-1,1]){
   const g=new THREE.CylinderGeometry(.18,.40,1.25,near?5:3).rotateZ(-s*Math.PI/2).translate(x+s*.55,y,z);
   b.put(g,'patina');
   b.box(near?'gold':'patina',[x+s*.87,y+.12,z],[.48,.15,.48]);
  }
  cyl('patina',x,z,8.6,.48,.35,.65,8);
  cyl('gold',x,z,8.95,.4,.78,.32,near?8:6);
  cyl('patina',x,z,9.73,.6,.45,0,near?8:6);
  ball('gold',[x,10.26,z],[.12,.18,.12]);
 }
 const model=b.finish();model.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift');});return model;
}
