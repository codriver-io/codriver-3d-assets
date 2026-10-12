import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, WHEEL_ANGLE } from './config.js';

// Authored in u/up/v: u is along the wheel, v along the axle. Named part
// ranges describe real triangles after material batching, for contact tests.
export function create({ detail='near' }={}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const offsets={},parts={},members=[];
  const put=(id,g,material='structure')=>{
    const first=offsets[material]||0, count=g.attributes.position.count;
    parts[id]={material,first,count};offsets[material]=first+count;b.put(g,material,0,0);
  };
  const box=(id,at,size,mat='structure')=>{const g=new THREE.BoxGeometry(...size);g.translate(...at);put(id,g,mat);};
  const beam=(id,a,c,r,from,to,mat='structure')=>{
    const av=new THREE.Vector3(...a),cv=new THREE.Vector3(...c),dir=cv.clone().sub(av);
    const g=new THREE.CylinderGeometry(r,r,dir.length(),near?6:4,1,false);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize()));g.translate(...av.add(cv).multiplyScalar(.5).toArray());put(id,g,mat);
    members.push({id,a,c,from,to,tolerance:.8});
  };
  const cylinder=(id,at,r,length,mat='structure')=>{const g=new THREE.CylinderGeometry(r,r,length,near?24:12);g.rotateX(Math.PI/2);g.translate(...at);put(id,g,mat);};
  const ring=(id,r,v,tube,mat='structure')=>{const g=new THREE.TorusGeometry(r,tube,near?6:(tube>.2?4:3),near?180:(tube>.2?90:60));g.translate(0,SPEC.hubHeight,v);put(id,g,mat);};
  const p=(a,r=SPEC.radius,v=0)=>[Math.sin(a)*r,SPEC.hubHeight+Math.cos(a)*r,v];
  const h=SPEC.hubHeight,r=SPEC.radius;

  cylinder('axle',[0,h,0],3.0,10.8);
  for(const v of [-5.5,5.5])cylinder('bearing'+v,[0,h,v],3.4,.45,'hardware');
  // Four paired inclined tubes on each side, individually founded.
  // Western bases fit the open attraction pockets east of aquarium way
  // 331551654; their entire foot and rising tube stay clear of its roof.
  for(const side of [-1,1])for(const u of [-28,-23,23,28]) {
    const v=side<0?side*(Math.abs(u)===28?19:16):(Math.abs(u)===28?10:8),id=`foot-${side}-${u}`;
    box(id,[u,.7,v],[3.8,1.4,4.1],'concrete');
    beam('leg-'+id,[u,1.1,v],[0,h,side*5.2],.88,id,'axle');
  }
  for(const side of [-1,1]) {
    const v=side*2.2;
    ring('rim'+side,r,v,.40,side<0?'light':'glow');
    for(const q of [19,33,45])ring(`tension-${side}-${q}`,q,v,near?.11:.13);
  }
  for(let i=0;i<SPEC.capsules;i++) {
    const a=i*2*Math.PI/SPEC.capsules,next=(i+1)*2*Math.PI/SPEC.capsules;
    for(const side of [-1,1]) {
      const v=side*2.2,spoke=`spoke-${i}-${side}`;
      beam(spoke,p(a,2.85,v),p(a,r,v),near?.19:.23,'axle','rim'+side);
      if(near)for(const [q,t] of [[19,33],[33,45],[45,r]])beam(`web-${i}-${side}-${q}`,p(a,q,v),p(next,t,v),.075,spoke,`spoke-${(i+1)%30}-${side}`);
    }
    beam('rim-tie-'+i,p(a,r,-2.2),p(a,r,2.2),.17,'rim-1','rim1');
    if(near)beam('rim-diagonal-'+i,p(a,r,-2.2),p(next,r,2.2),.10,'rim-1','rim1');
    const [u,cy]=p(a,SPEC.capsuleOrbit);
    const capsule=`capsule-${i}`;
    // Chamfered capsules, kept upright. Glass and white bands share edges;
    // frames partition panes rather than cover a second coplanar surface.
    const outline=[[-2.0,-1.9],[2.0,-1.9],[2.3,-1.5],[2.3,1.5],[2.0,1.9],[-2.0,1.9],[-2.3,1.5],[-2.3,-1.5]];
    const shell=(id,low,high,sl,sh,mat,windows=false)=>{
      const pos=[],idx=[];
      const quad=(q)=>{const n=pos.length/3;pos.push(...q.flat());idx.push(n,n+2,n+1,n,n+3,n+2);};
      for(let j=0;j<8;j++) {
        const l=outline[j],t=outline[(j+1)%8];
        if(windows&&near&&j%4===0) {
          // Three panes along each broad front/rear face. Narrow white
          // mullions have disjoint triangle surfaces at the same envelope.
          const widths=[0,.32,.35,.65,.68,1];
          for(let k=0;k<widths.length-1;k++) {
            const f=widths[k],e=widths[k+1],x=l[0]+(t[0]-l[0])*f,x2=l[0]+(t[0]-l[0])*e,z=l[1],z2=t[1];
            const g=new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute([[u+x,cy+low,z],[u+x2,cy+low,z2],[u+x2,cy+high,z2],[u+x,cy+high,z]].flat(),3)).setIndex([0,2,1,0,3,2]);g.computeVertexNormals();put(`${id}-${j}-${k}`,g,k%2?'structure':'glass');
          }
        } else quad([[u+l[0]*sl,cy+low,l[1]*sl],[u+t[0]*sl,cy+low,t[1]*sl],[u+t[0]*sh,cy+high,t[1]*sh],[u+l[0]*sh,cy+high,l[1]*sh]]);
      }
      if(!windows) {
        const y=high>0?high:low,scale=high>0?sh:sl;
        for(let j=1;j<7;j++) {
          const n=pos.length/3,pts=[outline[0],outline[j],outline[j+1]].map(([x,z])=>[u+x*scale,cy+y,z*scale]);pos.push(...pts.flat());idx.push(...(y>0?[n,n+2,n+1]:[n,n+1,n+2]));
        }
      }
      if(pos.length){const g=new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(pos,3)).setIndex(idx);g.computeVertexNormals();put(id,g,mat);}
    };
    shell(capsule+'-sill',-2.5,-1.8,.88,1,'structure');
    shell(capsule+'-glass',-1.8,1.8,1,1,'glass',true);
    shell(capsule+'-roof',1.8,2.5,1,.88,'structure');
    // Cabin mounting yokes run from the double rim to the white sill.
    for(const side of [-1,1])beam(`yoke-${i}-${side}`,p(a,r,side*2.2),[u,cy-2.05,side*1.82],.14,'rim'+side,capsule+'-sill');
    if(near)box(capsule+'-ac',[u,cy+2.64,0],[1.25,.28,1.9],'hardware');
  }
  // Primary double rim carries the LED colour at night; no floating strips
  // or layered surfaces. Day palettes keep both rings white.
  // Low boarding deck with direct grade access; adjoining ticket building
  // and aquarium are deliberately left to their provider geometry.
  box('boarding',[0,.45,0],[15,.9,8],'concrete');
  for(const side of [-1,1])box('boarding-step'+side,[0,.20,side*4.75],[9,.4,1.5],'concrete');
  const root=b.finish();
  root.traverse(o=>{if(o.isMesh){o.geometry.deleteAttribute('bridgeLift');o.geometry.rotateY(WHEEL_ANGLE);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();}});
  root.userData.parts=parts;root.userData.members=members;root.userData.capsules=30;root.userData.uprightCapsules=true;
  return root;
}
