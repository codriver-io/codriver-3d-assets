import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, LOWER_AZIMUTH } from './config.js';

export function create({detail='near'}={}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const parts=[], contacts=[], spheres=[], offsets={};
  function part(name,g,material) {
    parts.push({name,material,start:offsets[material]||0,count:g.attributes.position.count});
    offsets[material]=(offsets[material]||0)+g.attributes.position.count;b.put(g,material);
  }
  function box(name,material,c,size,angle=0) {
    const g=new THREE.BoxGeometry(...size);g.rotateY(angle);g.translate(...c);part(name,g,material);
  }
  function member(name,a,c,radius,supportA,supportB,material='tube',rect=false) {
    const av=new THREE.Vector3(...a),cv=new THREE.Vector3(...c),dir=cv.clone().sub(av);
    const g=rect?new THREE.BoxGeometry(radius,dir.length(),radius):new THREE.CylinderGeometry(radius,radius,dir.length(),near?16:10,1,false);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir.clone().normalize()));
    g.translate(...av.add(cv).multiplyScalar(0.5).toArray());part(name,g,material);
    contacts.push({name,a,c,supportA,supportB,rect});
  }
  // Orthonormal projection of a regular cube: its [111] diagonal is vertical.
  // Each unit bit contributes edge/sqrt(3) vertically and edge*sqrt(2/3) laterally.
  const h=SPEC.cubeEdge/Math.sqrt(3),r=SPEC.cubeEdge*Math.sqrt(2/3),bottom=SPEC.height-9-3*h;
  const nodes=[];
  for(let bits=0;bits<8;bits++) {
    const p=[0,bottom,0];
    for(let i=0;i<3;i++)if(bits&(1<<i)) {
      const a=LOWER_AZIMUTH+i*2*Math.PI/3;p[0]+=r*Math.cos(a);p[1]+=h;p[2]+=r*Math.sin(a);
    }
    nodes.push(p);
  }
  nodes.push([0,bottom+1.5*h,0]);
  for(let i=0;i<9;i++) {
    const name=`sphere-${i}`,center=nodes[i];spheres.push({name,center});
    const g=new THREE.SphereGeometry(9,near?32:20,near?20:14),pos=g.attributes.position,idx=g.index.array;
    const steel=[],glass=[];
    for(let k=0;k<idx.length;k+=3) {
      const q=new THREE.Vector3();for(let j=0;j<3;j++)q.add(new THREE.Vector3().fromBufferAttribute(pos,idx[k+j]));q.divideScalar(3);
      const az=Math.atan2(q.z,q.x), sector=Math.floor((az+Math.PI)/(Math.PI/6));
      // Individual triangular windows partition the sphere shell: no overlays.
      const window=Math.abs(q.y)<1.7 && sector%2===0 && k/3%2===0;
      (window?glass:steel).push(idx[k],idx[k+1],idx[k+2]);
    }
    for(const [mat,indices]of [['steel',steel],['glass',glass]]) {
      const shell=g.clone();shell.setIndex(indices);shell.translate(...center);part(name,shell,mat);
    }
    g.dispose();
    // Small night lamps form a sparse network of points on the shell.
    for(let j=0;j<(near?24:12);j++) {
      const az=j*Math.PI*2/(near?24:12),dy=j%2?3.8:-3.8,rr=Math.sqrt(81-dy*dy);
      const lamp=new THREE.SphereGeometry(near?0.095:0.14,4,3);
      lamp.translate(center[0]+(rr+0.04)*Math.cos(az),center[1]+dy,center[2]+(rr+0.04)*Math.sin(az));part(`lamp-${i}-${j}`,lamp,'glow');
    }
  }
  // Twelve cube edges plus eight centre-to-corner half-diagonals = 20 tubes.
  function link(i,j,name) {
    const a=new THREE.Vector3(...nodes[i]),c=new THREE.Vector3(...nodes[j]),v=c.clone().sub(a).normalize();
    // Stop inside the shell by 0.22 m; caps are entirely buried, no free ends.
    member(name,a.addScaledVector(v,8.78).toArray(),c.addScaledVector(v,-8.78).toArray(),1.65,`sphere-${i}`,`sphere-${j}`);
  }
  for(let i=0;i<8;i++)for(let axis=0;axis<3;axis++){const j=i^(1<<axis);if(j>i)link(i,j,`edge-${i}-${j}`);}
  for(let i=0;i<8;i++)link(i,8,`diagonal-${i}`);
  // Three open bipods underneath the three lower lateral spheres.
  for(const i of [1,2,4]) {
    const c=nodes[i],rad=new THREE.Vector3(c[0],0,c[2]).normalize(),t=new THREE.Vector3(-rad.z,0,rad.x),tops=[],feet=[];
    for(const side of [-1,1]) {
      const foot=[c[0]+t.x*side*5.1,0.65,c[2]+t.z*side*5.1];
      const top=[c[0]+t.x*side*2.3,c[1]-8.3,c[2]+t.z*side*2.3];
      box(`foot-${i}-${side}`,'concrete',foot,[3.5,1.3,3.5]);
      member(`bipod-${i}-${side}`,foot,top,1.8,`foot-${i}-${side}`,`sphere-${i}`,'support',true);
      feet.push(foot);tops.push(top);
    }
    // Stair landings traverse the actual inclined support rails.
    for(let j=1;j<=4;j++) {
      const f=j/5,a=feet[0].map((v,k)=>v+(tops[0][k]-v)*f),c=feet[1].map((v,k)=>v+(tops[1][k]-v)*f);
      member(`landing-${i}-${j}`,a,c,0.42,`bipod-${i}--1`,`bipod-${i}-1`,'support',true);
    }
  }
  // Circular 26 m entrance pavilion. Wall panes alternate around its perimeter.
  const roof=new THREE.CylinderGeometry(13,13,0.45,near?48:24);roof.translate(0,2.375,0);part('pavilion-roof',roof,'tube');
  const plinth=new THREE.CylinderGeometry(13,13,0.3,near?48:24);plinth.translate(0,0.15,0);part('pavilion-base',plinth,'concrete');
  for(let i=0;i<24;i++) {
    const a=i*Math.PI/12,g=new THREE.CylinderGeometry(12.65,12.65,1.85,1,1,true,a,Math.PI/12);
    g.translate(0,1.225,0);part(`pavilion-pane-${i}`,g,i%3===0?'support':'glass');
  }
  member('ground-lift',[0,0.3,0],[0,bottom-8.78,0],1.65,'pavilion-base','sphere-0');
  const root=b.finish();
  root.traverse(o=>{if(o.isMesh){o.geometry.deleteAttribute('bridgeLift');if(o.material.name==='steel'){o.material.metalness=0.65;o.material.roughness=0.25;}if(o.material.name==='tube'){o.material.metalness=0.35;o.material.roughness=0.42;}}});
  for(const [key,value]of Object.entries({parts,contacts,spheres}))Object.defineProperty(root.userData,key,{value,enumerable:false});
  return root;
}
