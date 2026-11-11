import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {kit} from './cristo-rei-almada-parts.js';
export function create({detail='near'}={}){
 const p=kit(SPEC,PALETTES,detail),near=detail!=='far';
 // Four continuous arched frames form the four corner pylons; no infill occupies the tall void.
 for(let i=0;i<4;i++){
  const a=i*Math.PI/2,holes=[{u:0,y:12.5,w:11,h:62.5,arch:true}];
  if(i===0||i===2)holes.push({u:0,y:.2,w:4.6,h:6.5,mat:'bronze'},{u:0,y:7.1,w:10.4,h:4.6,mat:'bronze'});
  p.wall('concrete',25,0,82,6.5,6*Math.sin(a),6*Math.cos(a),a,holes);
 }
 p.box('concrete',0,81.7,0,26,.6,26);
 const pedestal=p.finish();
 // Uniform plan taper is applied only to the pedestal, after yaw (uniform scaling commutes with it).
 pedestal.traverse(o=>{if(!o.isMesh)return;const a=o.geometry.attributes.position;for(let i=0;i<a.count;i++){const f=1-.28*Math.max(0,Math.min(82,a.getY(i)))/82;a.setX(i,a.getX(i)*f);a.setZ(i,a.getZ(i)*f);}a.needsUpdate=true;o.geometry.computeVertexNormals();o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();o.name=`${SPEC.id}-pedestal-${o.material.name}`;});
 const s=kit(SPEC,PALETTES,detail),{box,cyl,bar}=s;
 // The 28 m image begins at the official 82 m platform. Feet and hem meet that platform.
 for(const x of [-1.25,1.25])box('statue',x,82.3,.65,1.5,.6,3.1);
 const sections=[[82.5,2.8,1.65],[87,3.0,1.8],[93,3.35,1.95],[98,3.8,2.1],[101,4.0,2.15],[103.5,2.25,1.6],[104.5,1.45,1.15]];
 const N=near?28:16,verts=[],ix=[];
 for(const [y,rx,rz] of sections)for(let i=0;i<N;i++){const a=i*2*Math.PI/N,fold=1+(near?.025:.018)*Math.cos(a*10);verts.push([rx*Math.sin(a)*fold,y,rz*Math.cos(a)*fold]);}
 for(let j=0;j<sections.length-1;j++)for(let i=0;i<N;i++){const a=j*N+i,b=j*N+(i+1)%N,c=(j+1)*N+i,d=(j+1)*N+(i+1)%N;ix.push(a,b,c,b,d,c);}
 for(let i=1;i<N-1;i++){ix.push(0,i+1,i,(sections.length-1)*N,(sections.length-1)*N+i,(sections.length-1)*N+i+1);}
 s.poly('statue',verts,ix);
 // Long horizontal arms use broad closed, flaring sleeves; they are not thin Y-shaped rods.
 for(const sign of [-1,1]){
  const sec=[[3.2,102.0,96.8,1.85],[7.1,101.9,97.3,1.5],[11.7,101.5,99.0,.9]],v=[];
  for(const [x,top,bottom,rz] of sec)v.push([sign*x,top,-rz],[sign*x,top,rz],[sign*x,bottom,rz],[sign*x,bottom,-rz]);
  const ids=[];for(let j=0;j<sec.length-1;j++)for(let i=0;i<4;i++){const a=j*4+i,b=j*4+(i+1)%4,c=(j+1)*4+i,d=(j+1)*4+(i+1)%4;ids.push(a,c,b,b,c,d);}
  ids.push(0,1,2,0,2,3,8,10,9,8,11,10);if(sign>0)for(let i=0;i<ids.length;i+=3)[ids[i+1],ids[i+2]]=[ids[i+2],ids[i+1]];
  s.poly('statue',v,ids);
  bar('statue',[sign*11.4,101,0],[sign*13.0,101,0],.78,.65);
  const hand=new THREE.SphereGeometry(1,near?14:8,near?8:6);hand.scale(1,.6,.42);hand.translate(sign*13,101,0);s.put(hand,'statue');
 }
 // Joined neck, 4.05 m head, hair/beard and simple nose give a readable human profile from either bank.
 cyl('statue',0,0,.95,.95,103.9,106.5,near?16:10);
 const hn=near?20:12,hv=[],hi=[],hs=[[105.95,.8,.9],[106.4,1.2,1.15],[107.2,1.55,1.4],[108.5,1.65,1.5],[109.45,1.3,1.25],[110,.45,.55]];
 for(const [y,rx,rz] of hs)for(let i=0;i<hn;i++){const a=i*2*Math.PI/hn;hv.push([rx*Math.sin(a),y,rz*Math.cos(a)]);}
 for(let j=0;j<hs.length-1;j++)for(let i=0;i<hn;i++){const a=j*hn+i,b=j*hn+(i+1)%hn,c=(j+1)*hn+i,d=(j+1)*hn+(i+1)%hn;hi.push(a,b,c,b,d,c);}
 for(let i=1;i<hn-1;i++)hi.push(0,i+1,i,(hs.length-1)*hn,(hs.length-1)*hn+i,(hs.length-1)*hn+i+1);
 s.poly('statue',hv,hi);
 // A compact wedge suggests the nose; hair/chin are part of the head profile, not floating spheres.
 s.poly('statue',[[-.26,108.2,1.37],[.26,108.2,1.37],[0,107.55,1.98],[-.26,107.3,1.37],[.26,107.3,1.37]],[0,2,1,0,3,2,1,2,4,3,4,2,0,4,3,0,1,4]);
 const statue=s.finish();for(const m of statue.children)m.name=`${SPEC.id}-image-${m.material.name}`;
 const root=new THREE.Group();root.name=SPEC.name;root.userData={...pedestal.userData,triangles:pedestal.userData.triangles+statue.userData.triangles,drawCalls:pedestal.userData.drawCalls+statue.userData.drawCalls,features:['four tapering open arches','82m pedestal','28m robed Christ','28m finger span']};
 root.add(...[...pedestal.children],...[...statue.children]);return root;
}
