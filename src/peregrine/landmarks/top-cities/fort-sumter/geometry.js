import * as THREE from 'three';
import polygonClipping from 'polygon-clipping';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {ISLAND,WALL,HUGER} from './footprint.js';
const V=([x,z])=>new THREE.Vector2(x,-z);
export const BATTERY_FRAME=(s,d)=>[s*.746+d*.666,-5-s*.666+d*.746];
export function create({detail='near'}={}) {
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 const box=(m,x,y,z,w,h,d,angle=0)=>b.box(m,[x,y,z],[w,h,d],angle);
 function split(g,m,top=m){if(m===top){b.put(g,m);return;}const base=[],cap=[],ix=g.index;const N=ix?ix.count:g.attributes.position.count;
  for(let i=0;i<N;i+=3){const a=ix?ix.getX(i):i,c=ix?ix.getX(i+1):i+1,d=ix?ix.getX(i+2):i+2;(g.attributes.normal.getY(a)>.9?cap:base).push(a,c,d);}
  for(const [ii,mat] of [[base,m],[cap,top]])if(ii.length){const gg=g.clone();gg.setIndex(ii);b.put(gg,mat);}
 }
 function solid(m,ring,y0,y1,top=m,holes=[]){const sh=new THREE.Shape(ring.map(V));for(const r of holes)sh.holes.push(new THREE.Path(r.map(V)));const g=new THREE.ExtrudeGeometry(sh,{depth:y1-y0,bevelEnabled:false,curveSegments:1});g.rotateX(-Math.PI/2);g.translate(0,y0,0);split(g,m,top);}
 function tube(m,a,c,r,n=near?8:5){const A=new THREE.Vector3(...a),B=new THREE.Vector3(...c),v=B.clone().sub(A),g=new THREE.CylinderGeometry(r,r,v.length(),n,1,false);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));g.translate(...A.add(B).multiplyScalar(.5).toArray());b.put(g,m);}
 function frame(i){const a=WALL[i],c=WALL[(i+1)%5],dx=c[0]-a[0],dz=c[1]-a[1],L=Math.hypot(dx,dz);return{a,c,L,ux:dx/L,uz:dz/L,angle:-Math.atan2(dz,dx)};}
 function at(i,s,d){const f=frame(i);return[f.a[0]+f.ux*s+f.uz*d,f.a[1]+f.uz*s-f.ux*d];}
 function edgeShape(i,shape,depth,inset=0,m='brick',top=m){const f=frame(i),g=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:near?10:5});g.translate(0,0,-depth-inset);g.rotateY(f.angle);g.translate(f.a[0],0,f.a[1]);split(g,m,top);}
 const rect=(a,y,c,h)=>new THREE.Shape([[a,y],[c,y],[c,h],[a,h]].map(p=>new THREE.Vector2(...p)));
 // Low island plinth with separate top material; no terrain surface or sea-level offset.
 const islandShape=new THREE.Shape(ISLAND.map(V)),islandG=new THREE.ExtrudeGeometry(islandShape,{depth:1.2,bevelEnabled:false,curveSegments:1});islandG.rotateX(-Math.PI/2);
 const sideIds=[];for(let k=0;k<islandG.attributes.position.count;k+=3)if(Math.abs(islandG.attributes.normal.getY(k))<.9)sideIds.push(k,k+1,k+2);islandG.setIndex(sideIds);b.put(islandG,'rock');
 function surface(m,p,y){const sh=new THREE.Shape(p[0].map(V));for(const h of p.slice(1))sh.holes.push(new THREE.Path(h.map(V)));const g=new THREE.ShapeGeometry(sh);g.rotateX(-Math.PI/2);g.translate(0,y,0);b.put(g,m);}
 const stairSites=[[-8,-6.2],[16,-10.8]],stairFootprints=stairSites.map(([s,d])=>[BATTERY_FRAME(s-1.1,d-8.3),BATTERY_FRAME(s+1.1,d-8.3),BATTERY_FRAME(s+1.1,d+.3),BATTERY_FRAME(s-1.1,d+.3)]);
 for(const p of polygonClipping.difference([ISLAND],[WALL]))surface('grass',p,1.2);
 for(const p of polygonClipping.difference(polygonClipping.intersection([ISLAND],[WALL]),...stairFootprints.map(r=>[r])))surface('ground',p,1.2);
 const inner=WALL.map(([x,z])=>[x*.975,z*.975]);
 const fillMask=[BATTERY_FRAME(-160,12.5),BATTERY_FRAME(160,12.5),BATTERY_FRAME(160,160),BATTERY_FRAME(-160,160)];
 const filled=polygonClipping.intersection([inner],[fillMask]);
 for(const p of filled){surface('grass',p,5.2);
  // Curtain walls conceal the lower earth-fill side faces: keep only the exposed part of each retaining edge.
  for(let j=0;j<p[0].length-1;j++){const A=p[0][j],C=p[0][j+1],mx=(A[0]+C[0])/2,mz=(A[1]+C[1])/2;
   let closest=Infinity,edge=0;for(let i=0;i<5;i++){const f=frame(i),dist=Math.abs((mx-f.a[0])*f.uz-(mz-f.a[1])*f.ux);if(dist<closest){closest=dist;edge=i;}}
   const low=closest<2.1?Math.min(5.2,[5.3,6.0,3.6,4.7,2.7][edge]):1.2;if(low>=5.2)continue;
   const g=new THREE.BufferGeometry(),v=[[A[0],low,A[1]],[C[0],low,C[1]],[C[0],5.2,C[1]],[A[0],5.2,A[1]]];g.setAttribute('position',new THREE.Float32BufferAttribute(v.flat(),3));g.setIndex([0,2,1,0,3,2]);g.computeVertexNormals();b.put(g,'stone');
  }
 }
 // Pentagon curtain: current standing height varies; outer gun embrasures remain genuine holes.
 const heights=[5.3,6.0,3.6,4.7,2.7];
 for(let i=0;i<5;i++){
  const f=frame(i),top=heights[i],sh=rect(0,1.2,f.L,top);
  const count=Math.floor(f.L/6.8);
  for(let j=1;j<count;j++){
   const s=f.L*j/count;
   if(i===3&&Math.abs(s-f.L*.52)<5)continue;
   if(top<3.5||j%3===0)continue;
   sh.holes.push(new THREE.Path([[s-.65,2],[s-.65,3.05],[s+.65,3.05],[s+.65,2]].map(p=>new THREE.Vector2(...p))));
  }
  // Through sally port, cut to the ground rather than represented by a dark door panel.
  if(i===3){const gate=f.L*.52;sh.holes.push(new THREE.Path([[gate-2,1.19],[gate-2,3.7],[gate+2,3.7],[gate+2,1.19]].map(p=>new THREE.Vector2(...p))));}
  edgeShape(i,sh,1.524);
 }
 // Preserved right-face gunrooms: segmental arches and vaulted open interior, roof material assigned to top faces only.
 {const i=1,f=frame(i),count=Math.floor(f.L/6.276),bay=f.L/count;
  for(let k=0;k<count;k++){
   const a=k*bay+.15,c=(k+1)*bay-.15,pts=[[a,1.2],[a,5.85],[c,5.85],[c,1.2],[c-.8,1.2],[c-.8,3.4]],n=near?12:6;
   for(let j=0;j<=n;j++){const t=j/n;pts.push([c-.8-(c-a-1.6)*t,3.4+1.0*Math.sin(Math.PI*t)]);}
   pts.push([a+.8,1.2]);edgeShape(i,new THREE.Shape(pts.map(p=>new THREE.Vector2(...p))),6.73,1.524,'brick','stone');
  }
 }
 // Ruined left-face casemate/barracks partitions, retained as low masonry rhythm rather than rebuilt stories.
 function ruin(i,s0,s1,d0,d1,top){const ring=[at(i,s0,d0),at(i,s1,d0),at(i,s1,d1),at(i,s0,d1)];for(const p of polygonClipping.difference([ring],[HUGER],filled))solid('brick',p[0],1.2,top,'brick',p.slice(1));}
 for(const i of [2,3,4]){const f=frame(i),step=near?6.3:12.6;
  for(let s=4;s<f.L-3;s+=step){if(i===3&&Math.abs(s-f.L*.52)<5)continue;ruin(i,s-.45,s+.45,1.5,7.5,2.3);}
  ruin(i,3,f.L-3,7.55,8.45,2);
 }
 // Battery Huger occupies its mapped irregular footprint, with an open southern gun pit.
 const pitCentre=BATTERY_FRAME(-25,8),pit=Array.from({length:near?24:12},(_,i)=>[pitCentre[0]+6*Math.cos(i*Math.PI*2/(near?24:12)),pitCentre[1]+6*Math.sin(i*Math.PI*2/(near?24:12))]);
 const battery=polygonClipping.difference([HUGER],[pit]);
 for(const p of battery)solid('battery',p[0],1.2,7.9056,'battery',p.slice(1));
 // Recessed gun-pit floor, no cap hiding the opening.
 solid('battery',pit,1.2,2.0);
 // A narrow museum roof at the northern end, an estimated simple pitched cap.
 const roofRing=[BATTERY_FRAME(16,-10),BATTERY_FRAME(36,-10),BATTERY_FRAME(36,2),BATTERY_FRAME(16,2)];
 solid('battery',roofRing,7.9056,8.8);
 const p0=BATTERY_FRAME(16,-10),p1=BATTERY_FRAME(36,-10),p2=BATTERY_FRAME(36,2),p3=BATTERY_FRAME(16,2),r0=BATTERY_FRAME(16,-4),r1=BATTERY_FRAME(36,-4);
 const pos=[[p0[0],8.8,p0[1]],[p1[0],8.8,p1[1]],[p2[0],8.8,p2[1]],[p3[0],8.8,p3[1]],[r0[0],10,r0[1]],[r1[0],10,r1[1]]];
 const geom=new THREE.BufferGeometry();geom.setAttribute('position',new THREE.Float32BufferAttribute(pos.flat(),3));geom.setIndex([0,4,5,0,5,1,3,2,5,3,5,4,0,3,4,1,5,2]);const roof=geom.toNonIndexed();roof.computeVertexNormals();b.put(roof,'roof');
 // Surface stairs connect low parade and battery roof; no detached ramp ends.
 for(const [s,d] of stairSites){const a=-Math.atan2(.746,.666);for(let k=0;k<18;k++){const h=(7.9056-1.2)*(k+1)/18,[x,z]=BATTERY_FRAME(s,d-7.65+k*.45);box('battery',x,1.2+h/2,z,.48,h,2.2,a);}}
 // Main pole and five small bare historic-flag poles, rooted in the raised site; flags/insignia omitted.
 const fp=BATTERY_FRAME(-6,23);tube('metal',[fp[0],5.2,fp[1]],[fp[0],24,fp[1]],near?.12:.17);
 // Pole is planted directly in the raised earthwork; no overlapping decorative base.
 for(let k=0;k<5;k++){const a=(k-2)*.5,p=BATTERY_FRAME(-6+10*Math.sin(a),25+8*Math.cos(a));tube('metal',[p[0],5.2,p[1]],[p[0],14,p[1]],near?.075:.11);}
 // A few surviving cannon silhouettes in the low parade, with solid cradles contacting the barrels.
 if(near)for(let k=0;k<5;k++){const [x,z]=BATTERY_FRAME(k*9-20,-24);box('battery',x,1.9,z,1.4,1.4,1.2);tube('battery',[x-1.5,2.5,z],[x+1.5,2.7,z],.25);}
 const root=b.finish();root.traverse(o=>{if(!o.isMesh)return;const g=o.geometry,ix=g.index,keep=[],N=ix?ix.count:g.attributes.position.count;
  // Grounded solids have no visible underside; remove buried bottom caps instead of stacking faces at grade.
  for(let k=0;k<N;k+=3){const ids=[0,1,2].map(j=>ix?ix.getX(k+j):k+j);if(ids.every(j=>g.attributes.normal.getY(j)<-.9 && g.attributes.position.getY(j)<=1.21))continue;keep.push(...ids);}
  g.setIndex(keep);g.deleteAttribute('bridgeLift');});return root;
}
