import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES,ROTATION} from './config.js';
export const TOWERS=[-235.6104,235.6104], END=720, HALF=19.5;
export const deckHeight=x=>62-7.2*(x/END)**2;
export function stays(detail='near') {
 const out=[];
 for(const t of TOWERS)for(const side of [-1,1])for(const dir of [-1,1])for(let i=0;i<16;i++) {
  if(detail==='far'&&i%2&&i!==15)continue;
  const y=143.5+i*1.72, z=side*(1.55+(174.9552-y)*21.3/114.9552),s=t+dir*(25+13.0*i);
  out.push({top:[t+dir*2.8,y,z],foot:[s,deckHeight(s)+.42,side*18.9]});
 }
 return out;
}
export function create({detail='near'}={}) {
 const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 const put=(g,m)=>b.put(g,m),box=(m,x,y,z,w,h,d)=>b.box(m,[x,y,z],[w,h,d]);
 function faces(m,positions,index){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions.flat(),3));g.setIndex(index);g.computeVertexNormals();put(g,m);}
 function tube(m,a,c,r,n=near?6:4){const A=new THREE.Vector3(...a),B=new THREE.Vector3(...c),v=B.clone().sub(A);const g=new THREE.CylinderGeometry(r,r,v.length(),n,1,false);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));g.translate(...A.add(B).multiplyScalar(.5).toArray());put(g,m);}
 // Shared sampled deck: top asphalt and concrete shell meet on edges, never overlapping planes.
 const step=near?12:24;
 for(let x=-END;x<END;x+=step){const e=Math.min(END,x+step),a=deckHeight(x),c=deckHeight(e);
  faces('asphalt',[[x,a,-HALF],[x,a,15.6],[e,c,15.6],[e,c,-HALF]],[0,1,2,0,2,3]);
  faces('concrete',[[x,a,15.6],[x,a,HALF],[e,c,HALF],[e,c,15.6]],[0,1,2,0,2,3]);
  faces('concrete',[[x,a,-HALF],[e,c,-HALF],[e,c-2,-HALF],[x,a-2,-HALF],[x,a,HALF],[x,a-2,HALF],[e,c-2,HALF],[e,c,HALF],[x,a-2,-HALF],[e,c-2,-HALF],[e,c-2,HALF],[x,a-2,HALF]],[0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11]);
  // Barrier and median supported continuously by the slab; no raised asphalt overlays.
  for(const z of [-18.9,0,15.3,18.9]){const mid=(x+e)/2,g=new THREE.BoxGeometry(e-x+.015,1.1,.55);g.rotateZ(Math.atan2(c-a,e-x));g.translate(mid,(a+c)/2+.53,z);put(g,'concrete');}
  // Distinct south pedestrian walk: integrated light concrete strip replaces the asphalt face here.
 }
 for(const x of [-END,END]){const h=deckHeight(x);faces('concrete',[[x,h,-HALF],[x,h-2,-HALF],[x,h-2,HALF],[x,h,HALF]],x<0?[0,1,2,0,2,3]:[0,2,1,0,3,2]);}
 // Towers are true hollow diamond prisms; the road passes through the widest opening.
 for(const t of TOWERS){
  const shape=new THREE.Shape([[-5,4],[-25,60],[-3.0,174.9552],[3.0,174.9552],[25,60],[5,4]].map(p=>new THREE.Vector2(...p)));
  shape.holes.push(new THREE.Path([[0,15],[19.0,61],[0,163.8],[-19.0,61]].map(p=>new THREE.Vector2(...p))));
  const g=new THREE.ExtrudeGeometry(shape,{depth:5.6,bevelEnabled:false,curveSegments:1});g.rotateY(Math.PI/2);g.translate(t-2.8,0,0);put(g,'tower');
  box('tower',t,deckHeight(t)-3.3,0,7,4.5,44);
  box('concrete',t,3.2,0,15,4.4,18);
  const island=new THREE.CylinderGeometry(1,1.23,2,near?24:12);island.scale(29,1,23);island.translate(t,1,0);put(island,'rock');
 }
 for(const q of stays(detail))tube('cable',q.top,q.foot,near?.17:.24,near?5:4);
 // Deep edge members and transverse floorbeams are part of the slab material, with actual bearing contacts.
 for(const sg of [-1,1])for(let s=0;s<5;s++){
  const x=sg*(462+s*64.5),h=deckHeight(x)-2;
  for(const z of [-11,11])box('concrete',x,(h-2)/2,z,3.4,h-2,3.4);
  box('concrete',x,h-1.2,0,4.8,2.4,38.8);
 }
 // Fine railing on the pedestrian edge, with terminal posts and all intermediate supports.
 const railY=x=>deckHeight(x)+1.8;
 for(let x=-END;x<END;x+=near?12:24){const e=Math.min(END,x+(near?12:24));tube('metal',[x,railY(x),18.9],[e,railY(e),18.9],near?.075:.12);}
 for(let x=-END;x<=END;x+=near?6:24)tube('metal',[x,deckHeight(x)+1.08,18.9],[x,railY(x),18.9],near?.06:.10);
 if(near)for(let x=-END+6;x<END-5;x+=18)for(const z of [-14.0,-10.1,-6.2,4.0,7.9,11.8]){
  const y=deckHeight(x)+.03;faces('paint',[[x,y,z-.07],[x,y,z+.07],[x+4,deckHeight(x+4)+.03,z+.07],[x+4,deckHeight(x+4)+.03,z-.07]],[0,1,2,0,2,3]);
 }
 const root=b.finish();root.traverse(o=>{if(o.isMesh){o.geometry.rotateY(ROTATION);o.geometry.deleteAttribute('bridgeLift');}});
 return root;
}
