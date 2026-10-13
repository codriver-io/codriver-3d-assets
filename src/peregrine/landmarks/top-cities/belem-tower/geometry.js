import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { BASE, OUTLINE, COURT, ANGLE } from './belem-tower-plan.js';

// All architectural features use the same limestone material. Openings are cut through
// the masonry, with recessed dark backs; there are no stacked facade veneers.
export function create({ detail = 'near' } = {}) {
 const near = detail === 'near', b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
 const segments = near ? 24 : 8;
 const box = (c,s) => b.box('stone',c,s);
 function prism(ring, y, h, holes=[], mat='stone', capsOnly=false) {
  const shape = new THREE.Shape(ring.map(p=>new THREE.Vector2(...p)));
  for(const r of holes) shape.holes.push(new THREE.Path(r.map(p=>new THREE.Vector2(...p))));
  const g = new THREE.ExtrudeGeometry(shape,{depth:h,bevelEnabled:false,curveSegments:near?8:3});
  if(capsOnly) {const group=g.groups.find(g=>g.materialIndex===0);const index=Array.from({length:group.count},(_,i)=>group.start+i);g.setIndex(index);g.clearGroups();}
  g.rotateX(Math.PI/2);g.translate(0,y+h,0);b.put(g,mat);
 }
 function arch(x,y,w,h) {
  const p=new THREE.Path(); const r=w/2;
  p.moveTo(x-r,y);p.lineTo(x+r,y);p.lineTo(x+r,y+h-r);
  p.absarc(x,y+h-r,r,0,Math.PI,false);p.lineTo(x-r,y);return p;
 }
 function wall(p,q,y0,y1,openings=[],depth=.9) {
  const dx=q[0]-p[0],dz=q[1]-p[1],L=Math.hypot(dx,dz),tx=dx/L,tz=dz/L,nx=tz,nz=-tx;
  const shape=new THREE.Shape();shape.moveTo(0,y0);shape.lineTo(L,y0);shape.lineTo(L,y1);shape.lineTo(0,y1);shape.closePath();
  for(const o of openings) shape.holes.push(o.rect ? new THREE.Path([new THREE.Vector2(o.x-o.w/2,o.y),new THREE.Vector2(o.x+o.w/2,o.y),new THREE.Vector2(o.x+o.w/2,o.y+o.h),new THREE.Vector2(o.x-o.w/2,o.y+o.h)]) : arch(o.x,o.y,o.w,o.h));
  const matrix = new THREE.Matrix4().set(tx,0,-nx,p[0], 0,1,0,0, tz,0,-nz,p[1], 0,0,0,1);
  const g=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:near?8:3});g.applyMatrix4(matrix);b.put(g,'stone');
  for(const o of openings) {
   const sh=new THREE.Shape([new THREE.Vector2(o.x-o.w/2,o.y),new THREE.Vector2(o.x+o.w/2,o.y),new THREE.Vector2(o.x+o.w/2,o.y+o.h),new THREE.Vector2(o.x-o.w/2,o.y+o.h)]);
   const back = new THREE.ShapeGeometry(sh);const idx=back.index.array;for(let k=0;k<idx.length;k+=3)[idx[k+1],idx[k+2]]=[idx[k+2],idx[k+1]];back.computeVertexNormals();back.translate(0,0,depth+.12);back.applyMatrix4(matrix);b.put(back,'recess');
  }
  return {L, at:(u,y,d=0)=>[p[0]+tx*u+nx*d,y,p[1]+tz*u+nz*d], angle:-Math.atan2(tz,tx), p,q,tx,tz,nx,nz};
 }
 function bandEdge(p,q,y,w,h) {
  const dx=q[0]-p[0],dz=q[1]-p[1];
  b.box('stone',[(p[0]+q[0])/2,y,(p[1]+q[1])/2],[Math.hypot(dx,dz),h,w],-Math.atan2(dz,dx));
 }
 function shield(e,u,y,w=.65) {
  const at=(s,yy,d)=>e.at(u+s,yy,d);
  const pts=[at(-w/2,y+.65,.15),at(w/2,y+.65,.15),at(w/2,y+.2,.15),at(0,y-.08,.15),at(-w/2,y+.2,.15)];
  const g=new THREE.BufferGeometry().setFromPoints(pts.map(p=>new THREE.Vector3(...p)));g.setIndex([0,2,1,0,3,2,0,4,3]);g.computeVertexNormals();
  // Match winding to the outward normal of this edge.
  const n=g.attributes.normal;if(n.getX(0)*e.nx+n.getZ(0)*e.nz<0){g.setIndex([0,1,2,0,2,3,0,3,4]);g.computeVertexNormals();}b.put(g,'stone');
  if(near) {b.bar('stone',at(0,y+.06,.22),at(0,y+.58,.22),.1,.1);b.bar('stone',at(-.2,y+.36,.22),at(.2,y+.36,.22),.1,.1);}
 }
 function turret(x,z,low,top) {
  const shaftTop=top-2.4,shaftBottom=low+2.05;
  const profile=[[.12,low],[.45,low+.35],[.68,low+.8],[.96,low+1.6],[1.13,shaftBottom],[1.13,shaftBottom+.16],[.94,shaftBottom+.34],[.94,shaftTop],[1.12,shaftTop+.1],[1.12,shaftTop+.3],[1.03,shaftTop+.55],[.82,shaftTop+1.05],[.47,shaftTop+1.42],[.14,shaftTop+1.65],[.34,shaftTop+1.72],[.16,shaftTop+1.92],[.18,top-.26],[0,top]];
  const g=new THREE.LatheGeometry(profile.map(([r,y])=>new THREE.Vector2(r,y)),segments);// Lobed cupola skin forms integral ribs, rather than unsupported applied bars.
  if(near) {const pos=g.attributes.position;for(let i=0;i<pos.count;i++){const y=pos.getY(i);if(y>shaftTop+.3 && y<shaftTop+1.65){const scale=1+.055*Math.cos(8*Math.atan2(pos.getZ(i),pos.getX(i)));pos.setX(i,pos.getX(i)*scale);pos.setZ(i,pos.getZ(i)*scale);}}g.computeVertexNormals();}
  g.translate(x,0,z);b.put(g,'stone');

 }
 prism(BASE,0,1.2);
 prism(OUTLINE,1.2,2.04,[],'stone',true);
 prism(OUTLINE,3.24,2.46,[COURT],'stone',true);
 for(let i=0;i<COURT.length;i++)wall(COURT[(i+1)%COURT.length],COURT[i],3.24,5.7,[],.6);
 // The lower bastion cap itself forms the courtyard floor at mapped 3.24 m.
 for(let i=0;i<OUTLINE.length;i++) {
  const p=OUTLINE[i],q=OUTLINE[(i+1)%OUTLINE.length],dx=q[0]-p[0],dz=q[1]-p[1],L=Math.hypot(dx,dz);
  if(L<6 || (p[1]<4 && q[1]<4)){wall(p,q,1.2,5.7);continue;}
  const pp=p,qq=q;
  const count=i===8?1:Math.round(L/4.2),ops=Array.from({length:count},(_,k)=>({x:(k+.5)*L/count,y:2.15,w:1.05,h:.85,rect:true}));
  const e=wall(pp,qq,1.2,5.7,ops,.9);
  bandEdge(p,q,5.7,.75,.32);bandEdge(p,q,6.3,.62,.9);
  const n=Math.round(L/1.8);
  for(let k=0;k<n;k++) {const u=(k+.5)*L/n;b.box('stone',e.at(u,7.0,-.1),[.88,.95,.72],e.angle);shield(e,u,6.7);}
  if(near) for(let k=0;k<Math.round(L/.85);k++)b.box('stone',e.at((k+.5)*L/Math.round(L/.85),5.35,-.05),[.28,.65,.55],e.angle);
 }
 // Northeast entry: a real arched gate under the small mapped defensive annex.
 wall([12.62,-7.03],[12.62,-4.28],1.2,7.65,[{x:1.375,y:1.2,w:1.55,h:2.75}],1);
 wall([7,-7.03],[12.62,-7.03],5.7,7.65,[],.7);
 wall([12.62,-4.28],[7,-4.28],5.7,7.65,[],.7);
 box([9.8,7.78,-5.65],[5.6,.34,2.75]);
 // Six bastion bartizans remain in the far silhouette.
 for(const [x,z] of [[-11.7,4.0],[11.7,3.8],[-11.5,27.0],[11.5,27.1],[-4.7,33.4],[4.7,33.6]])turret(x,z,4.5,11.7);
 // Square four-storey keep. Genuine cut-out arched facade bays.
 const corners=[[-6.05,-6.05],[6.05,-6.05],[6.05,6.05],[-6.05,6.05]];
 for(let side=0;side<4;side++) {
  const p=corners[side],q=corners[(side+1)%4],river=side===2;
  const ops=[{x:6.05,y:8,w:1.25,h:2.3},{x:5.43,y:17.8,w:.88,h:1.85},{x:6.67,y:17.8,w:.88,h:1.85},{x:5.43,y:23.2,w:.9,h:1.85},{x:6.67,y:23.2,w:.9,h:1.85}];
  if(!river)ops.push({x:5.43,y:13.1,w:.85,h:2},{x:6.67,y:13.1,w:.85,h:2});
  else ops.push({x:6.05,y:6.0,w:1.65,h:2.1});
  const e=wall(p,q,5.7,26.2,ops,1.0);
  for(const y of [20.7,21.2,26.15])bandEdge(p,q,y,y===20.7?1.65:1.0,y===20.7?.45:.26);
  const n=near?16:8;
  for(let i=0;i<n;i++) b.box('stone',e.at((i+.5)*12.1/n,20.3,.4),[near?.3:.5,.75,.8],e.angle);
  for(let i=0;i<7;i++){
   b.box('stone',e.at((i+.5)*12.1/7,21.95,.35),[.9,1.05,.5],e.angle);shield(e,(i+.5)*12.1/7,21.5,.75);
   b.box('stone',e.at((i+.5)*12.1/7,26.7,0),[.36,1.05,.55],e.angle);
   const g=new THREE.ConeGeometry(.38,.43,4);g.rotateY(Math.PI/4);g.translate(...e.at((i+.5)*12.1/7,27.45,0));b.put(g,'stone');
  }
  if(near && !river) { // Supported projecting middle balcony beneath paired windows.
   b.box('stone',e.at(6.05,12.92,.35),[2.6,.34,1.4],e.angle);
   for(const u of [5.05,7.05])b.box('stone',e.at(u,12.35,.12),[.28,.95,.65],e.angle);
   b.box('stone',e.at(6.05,13.6,.94),[2.6,.9,.25],e.angle);
  }
 }
 // The broad south loggia: seven real arches, projecting on seven large corbels.
 const lp=[6.85,7.4],lq=[-6.85,7.4],length=13.7;
 wall(lp,lq,12.8,16.1,Array.from({length:7},(_,k)=>({x:(k+.5)*length/7,y:13.45,w:1.38,h:2.15})),.65);
 box([0,12.72,6.7],[13.7,.32,2.3]);box([6.55,14.3,6.7],[.6,3.1,2.3]);box([-6.55,14.3,6.7],[.6,3.1,2.3]);
 for(let k=0;k<7;k++)box([(k-3)*1.95,12.12,6.45],[.42,1.2,1.1]);
 const roof=new THREE.BufferGeometry();roof.setAttribute('position',new THREE.Float32BufferAttribute([-6.85,16.1,7.45,6.85,16.1,7.45,6.85,16.9,5.65,-6.85,16.9,5.65],3));roof.setIndex([0,1,2,0,2,3]);roof.computeVertexNormals();b.put(roof,'stone');
 // Solid roof slab, open above it; core base continues to water-level footing.
 box([0,2.85,0],[12.1,5.7,12.1]);box([0,25.95,0],[12.1,.5,12.1]);
 for(const [x,z] of corners)turret(x,z,24.1,30);
 // Court edge balustrades with repeated stone piers and open gaps.
 for(const x of [-2.86,3.1]) {
  box([x,6.8,16.2],[.25,.25,11.4]);
  for(let i=0;i<9;i++)box([x,6.2,10.55+i*1.42],[.25,1.2,.3]);
 }
 const root=b.finish();root.rotation.y=-ANGLE;root.updateMatrixWorld(true);
 return root;
}
