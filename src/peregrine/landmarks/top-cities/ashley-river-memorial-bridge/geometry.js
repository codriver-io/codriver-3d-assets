import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES,ROTATION} from './config.js';
export const PIERS=[-264.05,-232.9,-213.6,-192.1,-169,-146.1,-122.8,-99.3,-72.8,-19.5,7.0,30.3,53.4,76.5,99.8,122.85,146,169,192.1,213.6,232.9,264.05];
export const HINGES=[-72.8,-19.5],HALF=7.05;
export const height=x=>7-2.2*(Math.abs(x+46.15)/310.2)**1.5;
export function create({detail='near'}={}) {
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 const box=(m,x,y,z,w,h,d)=>b.box(m,[x,y,z],[w,h,d]);
 function shapePrism(m,pts,depth,z=0){const s=new THREE.Shape(pts.map(p=>new THREE.Vector2(...p))),g=new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:false,curveSegments:1});g.translate(0,0,z-depth/2);const ix=[];for(let i=0;i<g.attributes.position.count;i+=3){if(g.attributes.normal.getY(i)>.9)continue;ix.push(i,i+1,i+2);}g.setIndex(ix);b.put(g,m);}
 function tube(m,a,c,r,n=near?8:6){const A=new THREE.Vector3(...a),B=new THREE.Vector3(...c),v=B.clone().sub(A),g=new THREE.CylinderGeometry(r,r,v.length(),n,1,false);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));g.translate(...A.add(B).multiplyScalar(.5).toArray());b.put(g,m);}
 function topFree(g){const ids=[];const ix=g.index;for(let i=0;i<ix.count;i+=3)if(g.attributes.normal.getY(ix.getX(i))<.9)ids.push(ix.getX(i),ix.getX(i+1),ix.getX(i+2));g.setIndex(ids);return g;}
 function patch(m,x,y,z,w,d){const g=new THREE.PlaneGeometry(w,d);g.rotateX(-Math.PI/2);g.translate(x,y,z);b.put(g,m);}
 function poly(m,r0,r1,y0,y1,x,z,n=8){const g=new THREE.CylinderGeometry(r1,r0,y1-y0,n,1,false);g.translate(x,(y0+y1)/2,z);if(m==='roof'){const ix=[];for(let i=0;i<g.index.count;i+=3)if(g.attributes.normal.getY(g.index.getX(i))>-.9)ix.push(g.index.getX(i),g.index.getX(i+1),g.index.getX(i+2));g.setIndex(ix);}b.put(g,m);}
 function strip(m,a,c,z0,z1,yoff){const pa=[a,height(a)+yoff,z0,a,height(a)+yoff,z1,c,height(c)+yoff,z1,c,height(c)+yoff,z0],g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pa,3));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();b.put(g,m);}
 // Shallow haunched concrete arches under each mapped approach bay, with genuine open soffits.
 for(let j=1;j<PIERS.length;j++){
  const a=PIERS[j-1],c=PIERS[j],mid=(a+c)/2,move=a===HINGES[0];
  if(move){
   for(const sg of [-1,1]){const lo=sg<0?a:mid+.03,hi=sg<0?mid-.03:c;
    shapePrism('steel',[[lo,height(lo)-.20],[hi,height(hi)-.20],[hi,height(hi)-1.05],[lo,height(lo)-2.15]],2*HALF);
   }
  }else {
   const lo=a+1.4,hi=c-1.4,n=near?14:7,pts=[[a,height(a)-.18],[c,height(c)-.18],[c,1.2]];
   for(let i=n;i>=0;i--){const u=i/n,x=lo+(hi-lo)*u;pts.push([x,Math.min(height(x)-.85,1.35+3.75*(1-(2*u-1)**2))]);}
   pts.push([a,1.2]);shapePrism('concrete',pts,2*HALF);
  }
  // Shell tops stop below pavement. Sidewalks occupy their own strips, avoiding overlays.
  strip(move?'steel':'asphalt',a,c,-5.5,5.5,0);
  for(const sg of [-1,1]){const z=sg*6.28,sa=a+(HINGES.includes(a)?3:0),sc=c-(HINGES.includes(c)?3:0),sm=(sa+sc)/2;
   const g=topFree(new THREE.BoxGeometry(sc-sa,.48,1.55));g.rotateZ(Math.atan2(height(sc)-height(sa),sc-sa));g.translate(sm,(height(sa)+height(sc))/2+.02,z);b.put(g,move?'steel':'concrete');
   const inner=sg>0?[5.505,6.60]:[-6.60,-5.505];strip(move?'steel':'concrete',sa,sc,...inner,.26);
   // Balustrade: top and base rails bear on every post; bascule has thinner metal balusters.
   const mat=move?'steel':'stone',gap=near?(move?1.6:.85):2.55;
   const rail=(y,h,w)=>{const g=new THREE.BoxGeometry(sc-sa+.01,h,w);g.rotateZ(Math.atan2(height(c)-height(a),c-a));g.translate(sm,(height(sa)+height(sc))/2+y,sg*6.82);b.put(g,mat);};
   rail(.32,.16,.44);rail(1.32,.18,.44);
   for(let s=sa;s<=sc;s+=gap)box(mat,s,height(s)+.83,sg*6.82,move?.10:.18,.90,move?.10:.25);
   box(mat,sc,height(sc)+.83,sg*6.82,.2,.90,.25);
  }
 }
 for(const s of PIERS){const h=height(s)-.2,main=HINGES.includes(s);
  box('concrete',s,h/2,0,main?7.2:2.8,h,14.1);
  for(const z of [-8.4,8.4]){
   if(main){const g=topFree(new THREE.BoxGeometry(7.2,7,5.8));g.translate(s,3.5,z);b.put(g,'concrete');for(const dx of [-1,1])patch('concrete',s+dx*3.225,7,z,.75,5.8);for(const dz of [-1,1])patch('concrete',s,7,z+dz*2.75,5.7,.3);}
   else {box('concrete',s,2.0,z,5.7,1.0,4.2);for(const dx of [-1.8,0,1.8])box('concrete',s+dx,.75,z,.65,1.5,.65);}
  }
 }
 // Four square tender houses with real window openings, pale cornices and octagonal open lanterns.
 for(const s of HINGES)for(const sg of [-1,1]){
  const z=sg*8.45,y=7.0,w=5.2,d=4.7,H=5.4;
  box('stone',s,y+.18,z,w+.5,.36,d+.5);
  for(let f=0;f<4;f++){
   const width=f%2?d:w,shape=new THREE.Shape([new THREE.Vector2(-width/2,0),new THREE.Vector2(width/2,0),new THREE.Vector2(width/2,H),new THREE.Vector2(-width/2,H)]);
   for(const u of [-width*.24,width*.24])shape.holes.push(new THREE.Path([new THREE.Vector2(u-.47,1.5),new THREE.Vector2(u-.47,3.4),new THREE.Vector2(u+.47,3.4),new THREE.Vector2(u+.47,1.5)]));
   const g=new THREE.ExtrudeGeometry(shape,{depth:.40,bevelEnabled:false,curveSegments:1}),angle=f*Math.PI/2,dist=(f%2?w:d)/2;
   g.translate(0,y,dist-.4);g.rotateY(angle);g.translate(s,0,z);b.put(g,'stone');
   for(const u of [-width*.24,width*.24]){const glass=new THREE.PlaneGeometry(.94,1.9);glass.translate(u,y+2.45,dist-.55);glass.rotateY(angle);glass.translate(s,0,z);b.put(glass,'glass');}
  }
  box('stone',s,12.5,z,w+.65,.5,d+.65);
  poly('stone',2.22,2.05,12.75,13.1,s,z);
  for(let i=0;i<8;i++){const a=(i+.5)*Math.PI/4;poly('stone',.22,.18,13.1,15.25,s+1.65*Math.cos(a),z+1.65*Math.sin(a),near?8:5);}
  poly('stone',2.05,2.15,15.25,15.55,s,z);
  poly('roof',2.15,.35,15.55,17.2,s,z);poly('stone',.33,.2,17.2,17.55,s,z);poly('steel',.13,0,17.55,17.9,s,z);
 }
 // One slender mast, based in a lantern cap; the tip is deliberately free (not a beam/cable).
 tube('steel',[HINGES[0],17.8,-8.45],[HINGES[0],19.9,-8.45],.045,5);
 // Pile fenders alongside the navigation opening. Horizontal ties terminate on end piles.
 for(const sg of [-1,1])for(const t of HINGES){
  const z=sg*13.3;
  for(let dx=-12;dx<=12;dx+=3)tube('timber',[t+dx,0,z],[t+dx,3.3,z],.20,near?6:4);
  for(const y of [1.0,2.8])box('timber',t,y,z,24.4,.25,.25);
 }
 if(near){for(let x=-260;x<260;x+=18)for(const z of [-1.8,1.8])strip('paint',x,x+4,z-.06,z+.06,.03);}
 const root=b.finish();root.traverse(o=>{if(o.isMesh){o.geometry.rotateY(ROTATION);o.geometry.deleteAttribute('bridgeLift');}});return root;
}
