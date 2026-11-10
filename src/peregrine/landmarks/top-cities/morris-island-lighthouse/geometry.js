import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';

// Continuous surfaces meet at section boundaries; material bands replace surfaces,
// never overlay another cylinder. Window apertures replace shaft facets in both LODs.
export function create({detail='near'}={}) {
 const near=detail==='near', n=near?64:32;
 const b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 const buckets=new Map();
 function tri(m,a,c,d){if(!buckets.has(m))buckets.set(m,[]);buckets.get(m).push(...a,...c,...d);}
 function quad(m,a,c,d,e,out){const u=new THREE.Vector3(...c).sub(new THREE.Vector3(...a)),v=new THREE.Vector3(...d).sub(new THREE.Vector3(...a));if(u.cross(v).dot(new THREE.Vector3(...out))<0){tri(m,a,e,d);tri(m,a,d,c);}else{tri(m,a,c,d);tri(m,a,d,e);}}
 const P=(r,y,a)=>[r*Math.sin(a),y,r*Math.cos(a)];
 function shell(m,y0,y1,r0,r1,windows=false){for(let i=0;i<n;i++){
  const a=i*2*Math.PI/n,c=(i+1)*2*Math.PI/n,mid=(a+c)/2;
  const opening=windows && (i===Math.floor(n/2)-1 || near && i===Math.floor(n/2));
  const m2=opening?'glass':m, inset=opening?0.24:0;
  quad(m2,P(r0-inset,y0,a),P(r0-inset,y0,c),P(r1-inset,y1,c),P(r1-inset,y1,a),[Math.sin(mid),0,Math.cos(mid)]);
  if(opening){for(const ang of [a,c])quad('brick',P(r0,y0,ang),P(r1,y1,ang),P(r1-inset,y1,ang),P(r0-inset,y0,ang),[Math.cos(ang),0,-Math.sin(ang)]);}
 }}
 function annulus(m,y,ri,ro){for(let i=0;i<n;i++){const a=i*2*Math.PI/n,c=(i+1)*2*Math.PI/n;quad(m,P(ri,y,a),P(ro,y,a),P(ro,y,c),P(ri,y,c),[0,1,0]);}}
 // 72 ft sheet-pile cofferdam, solid fill top and original octagonal masonry footing.
 shell('iron',0,1.65,10.973,10.973);annulus('stone',1.65,5.25,10.973);
 shell('base',1.65,3.1,5.25,5.25);annulus('base',3.1,4.95,5.25);
 if(near)for(let i=0;i<96;i++){let a=i*2*Math.PI/96; b.bar('iron',P(10.99,0,a),P(10.99,1.7,a),0.10,0.14);}
 const R=y=>4.95-(y-3.1)/(39.7-3.1)*(4.95-2.54);
 const ys=[3.1,12.0,15.1,19.1,25.5,28.6,32.3,38.0,39.7];
 for(let k=0;k<ys.length-1;k++){let y=ys[k],z=ys[k+1];const color=y<19.1?'brick':y<25.5?'white':y<32.3?'brick':'white';shell(color,y,z,R(y),R(z),k===1||k===5);}
 // Corbelled upper gallery and black service room below the lantern.
 shell('iron',39.7,40.0,2.54,2.65);shell('iron',40.0,42.7,2.65,2.40);
 annulus('iron',42.7,0,3.65);shell('iron',42.7,42.94,3.65,3.65);
 shell('iron',42.94,45.1,2.42,2.42);annulus('iron',45.1,0,2.95);shell('iron',45.1,45.25,2.95,2.95);
 // Main gallery brackets touch the tower and the outer platform.
 for(let i=0;i<12;i++){let a=i*2*Math.PI/12;b.bar('iron',P(2.63,40.15,a),P(3.56,42.7,a),near?0.16:0.20);}
 // Open lantern: glass panels only, framed by columns and horizontal rings.
 shell('glass',45.1,47.85,1.94,1.94);shell('iron',47.85,48.02,2.12,2.12);
 shell('iron',48.02,48.93,2.12,0.12);shell('base',48.93,49.07,0.12,0.10);
 for(let i=0;i<8;i++){let a=i*2*Math.PI/8;b.bar('iron',P(1.98,45.1,a),P(1.98,47.85,a),0.09);}
 for(const [y,r] of [[44,3.65],[46.15,2.95]]){
  const yb=y===44?42.94:45.25;
  for(let i=0;i<24;i++){let a=i*2*Math.PI/24,c=(i+1)*2*Math.PI/24;b.bar('iron',P(r,y,a),P(r,y,c),0.045);b.bar('iron',P(r,yb,a),P(r,y,a),0.045);}
 }
 for(const [m,pos] of buckets){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.computeVertexNormals();b.put(g,m);}
 return b.finish();
}
