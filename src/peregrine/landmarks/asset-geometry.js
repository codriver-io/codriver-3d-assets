import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export const LANDMARK_PALETTES = {
  light:{steel:'#688d79',iron:'#625c50',stone:'#a49c89',concrete:'#c7c6ba',asphalt:'#555d63',rail:'#8d989d',paint:'#eceadf',lattice:'#e5e9e7',glass:'#536e74',museum:'#bcb7a3',roof:'#d5d7cc'},
  dark:{steel:'#4d8979',iron:'#79827e',stone:'#707b85',concrete:'#84919b',asphalt:'#303c47',rail:'#9daab7',paint:'#b9bdbe',lattice:'#b7d1d6',glass:'#3f646e',museum:'#73838b',roof:'#a0b4bd'},
};

export function assetBuilder(spec,detail='near') {
  const root=new THREE.Group();root.name=spec.name;
  root.userData={landmark:spec.id,units:'metres',origin:spec.origin,detail,provenance:'Original procedural geometry; mapped placement © OpenStreetMap contributors'};
  const batches=new Map(),materials=new Map();
  function put(geometry,material,chunk=0,lift=1) {
    if(detail==='far')chunk=0;
    geometry.deleteAttribute('uv');
    if(!geometry.index)geometry.setIndex(Array.from({length:geometry.attributes.position.count},(_,i)=>i));
    const p=geometry.attributes.position;
    geometry.setAttribute('bridgeLift',new THREE.Float32BufferAttribute(Array.from({length:p.count},(_,i)=>typeof lift==='function'?lift(p.getY(i)):lift),1));
    const key=`${chunk}:${material}`;
    if(!batches.has(key))batches.set(key,{material,chunk,geometries:[]});
    batches.get(key).geometries.push(geometry);
  }
  function box(material,center,size,angle=0,chunk=0,lift=1) {
    const g=new THREE.BoxGeometry(...size);g.rotateY(angle);g.translate(...center);put(g,material,chunk,lift);
  }
  function bar(material,a,b,width,depth=width,chunk=0,round=false,lift=1) {
    const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),direction=bv.clone().sub(av),length=direction.length();
    if(length<1e-5)return;
    const g=round?new THREE.CylinderGeometry(width,width,length,detail==='near'?5:3,1,true):new THREE.BoxGeometry(width,length,depth);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),direction.normalize()));
    g.translate(...av.add(bv).multiplyScalar(0.5).toArray());put(g,material,chunk,lift);
  }
  function finish(){
    let triangles=0;
    for(const {material,chunk,geometries} of batches.values()){
      const g=mergeGeometries(geometries);geometries.forEach(v=>v.dispose());g.computeBoundingBox();g.computeBoundingSphere();
      if(!materials.has(material)){const m=new THREE.MeshStandardMaterial({color:spec.palette?.[material]??LANDMARK_PALETTES.light[material],roughness:0.83,metalness:material==='lattice'?0.25:0});m.name=material;materials.set(material,m);}
      const mesh=new THREE.Mesh(g,materials.get(material));mesh.name=`${spec.id}-${chunk}-${material}`;root.add(mesh);triangles+=g.index.count/3;
    }
    root.userData.triangles=triangles;root.userData.drawCalls=root.children.length;return root;
  }
  return {root,put,box,bar,finish};
}

export function bridgeBuilder(profile,detail){
  const b=assetBuilder(profile.CHAMPLAIN,detail),p=profile.bridgePoint,h=profile.deckHeight;
  const xyz=(s,d,y)=>{const q=p(s,d,y);return [q.x,q.y,q.z];};
  const box=(material,s,d,y,length,width,height,chunk=0,lift=1)=>{const q=p(s,d,y);b.box(material,[q.x,q.y,q.z],[length,height,width],-Math.atan2(q.tz,q.tx),chunk,lift);};
  const beam=(mat,a,c,width,depth=width,chunk=0,lift=1)=>b.bar(mat,xyz(...a),xyz(...c),width,depth,chunk,false,lift);
  function strip(mat,a,c,l,r,offset=0,thickness=0,chunk=0){
    const samples=new Set([a,c]);
    // Dense only on vertical transitions. Flat spans still keep 25m width
    // samples and every alignment vertex, including the curved approaches.
    const step=profile.meshStep || 5;
    for(let s=Math.floor(a/step)*step+step;s<c;s+=step){
      const k=profile.knots.findIndex(v=>v[0]>=s),from=profile.knots[Math.max(0,k-1)],to=profile.knots[Math.max(0,k)];
      if(from[1]!==to[1] || s%25===0)samples.add(s);
    }
    for(const v of profile.ALIGNMENT)if(v.s>a&&v.s<c)samples.add(v.s);
    const stations=[...samples].sort((u,v)=>u-v);
    const count=stations.length-1,positions=[],indices=[],stride=thickness?4:2;
    for(let i=0;i<=count;i++){
      const s=stations[i];
      for(const [d,dy] of thickness?[[l,0],[r,0],[l,-thickness],[r,-thickness]]:[[l,0],[r,0]])positions.push(...xyz(s,d,h(s)+offset+dy));
      if(!i)continue;const x=(i-1)*stride,y=i*stride;
      indices.push(x,x+1,y,x+1,y+1,y);
      if(thickness)indices.push(x+2,y+2,x+3,x+3,y+2,y+3,x,y,x+2,x+2,y,y+2,x+1,x+3,y+1,x+3,y+3,y+1);
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();b.put(g,mat,chunk);
  }
  // Tapered pier with a pointed upstream icebreaker. Its toe stays planted.
  function pier(s,top,width=19,depth=6,ice=false,chunk=0){
    if(top<1)return;
    const outline=ice?[[-depth/2,-width/2],[depth/2,-width/2],[depth/2,width/2],[0,width/2+8],[-depth/2,width/2]]:[[-depth/2,-width/2],[depth/2,-width/2],[depth/2,width/2],[-depth/2,width/2]];
    const positions=[],indices=[],n=outline.length;
    for(const y of [-1,top])for(const [along,across] of outline){const scale=y<0?1.12:1;const d=ice && y>=0 && across>width/2 ? width/2 : across;positions.push(...xyz(s+along*scale,d*scale,y));}
    for(let i=0;i<n;i++){const j=(i+1)%n;indices.push(i,n+i,j,j,n+i,n+j);}
    for(let i=1;i<n-1;i++)indices.push(n,n+i+1,n+i,0,i,i+1);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();b.put(g,'stone',chunk,y=>Math.max(0,Math.min(1,(y+1)/(top+1))));
    box('concrete',s,0,top-0.3,depth+1,width+1,0.6,chunk);
  }
  return {...b,xyz,box,beam,strip,pier};
}
