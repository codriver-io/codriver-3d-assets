import * as THREE from 'three';
import { assetBuilder } from './asset-geometry.js';
import { GRANDE_ROUE as SPEC, GRANDE_ROUE_PALETTES, WHEEL_ANGLE } from './grande-roue-config.js';

// Author in a vertical u/y plane, then bake the mapped east/up/south frame.
// Static gondolas remain upright: only their centres follow the rim.
export function createGrandeRoue({ detail='near' }={}) {
  const b=assetBuilder(SPEC,detail),near=detail==='near',r=SPEC.diameter/2,h=SPEC.hubHeight;
  const p=(a,radius=r,v=0)=>[Math.sin(a)*radius,h+Math.cos(a)*radius,v];
  const beam=(a,c,radius,mat='lattice')=>b.bar(mat,a,c,radius,radius,0,true,0);
  const box=(mat,at,size)=>b.box(mat,at,size,0,0,0);
  const cylinder=(at,radius,length,mat='lattice',segments=near?16:8)=>{
    const g=new THREE.CylinderGeometry(radius,radius,length,segments,1,false);
    g.rotateX(Math.PI/2);g.translate(...at);b.put(g,mat,0,0);
  };
  const ring=(radius,v,tube,mat='lattice',segments=near?168:84)=>{
    const g=new THREE.TorusGeometry(radius,tube,near?6:4,segments);
    g.translate(0,h,v);b.put(g,mat,0,0);
  };

  // Foundations meet the plaza. No fabricated hill, road deck, or sea datum.
  box('concrete',[0,0.10,0],[34,0.2,26]);
  for(const side of [-1,1])for(const u of [-14,0,14]) {
    const v=side*(u===0?12:9);
    box('concrete',[u,0.45,v],[3.1,0.7,3.1]);
    beam([u,0.8,v],[0,h,side*2.1],0.64);
    if(near)for(const t of [0.2,0.5,0.8]) {
      const a=new THREE.Vector3(u,0.8,v),c=new THREE.Vector3(0,h,side*2.1),d=c.clone().sub(a).normalize();
      const center=a.lerp(c,t),g=new THREE.CylinderGeometry(0.70,0.70,0.12,12);
      g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d));
      g.translate(...center.toArray());b.put(g,'roof',0,0);
    }
  }
  cylinder([0,h,0],1.55,5.3);
  for(const v of [-2.85,2.85])cylinder([0,h,v],2.05,0.22,'roof',near?42:24);

  // Two shallow rims with cross-ties, not an opaque disk. The innermost rings
  // are thin circumferential tension ties visible in the manufacturer's photo.
  // Rim chords are 0.52 m tubes and spokes at least 0.28 m, so they still read from a distance.
  for(const v of [-1.12,1.12])ring(r,v,0.26);
  if(near)for(const radius of [9,15,22])ring(radius,0,0.05,'lattice',84);
  for(let i=0;i<SPEC.cabins;i++) {
    const a=i*Math.PI*2/SPEC.cabins,next=(i+1)*Math.PI*2/SPEC.cabins;
    beam(p(a,r,-1.12),p(a,r,1.12),near?0.2:0.22);
    // 21 paired trussed radial members; near includes their open zigzag web.
    if(i%2===0) {
      // Far merges the pair into one flat 0.5 m ribbon in the wheel plane; near keeps both tubes and the zigzag web.
      if(near)for(const v of [-1.12,1.12])beam(p(a,1.7,v*0.75),p(a,r,v),0.14);
      else b.bar('lattice',p(a,1.7,0),p(a,r,0),0.5,0.16,0,false,0);
      if(near)for(let j=0;j<8;j++)beam(p(a,2+j*(r-2)/8,j%2?-1.12:1.12),p(a,2+(j+1)*(r-2)/8,j%2?1.12:-1.12),0.06);
    } else if(near)beam(p(a,1.8,0),p(a,r,0),0.05);
    if(near)beam(p(a,r,-1.12),p(next,r,1.12),0.06);

    const [u,y]=p(a),cy=y-1.62;
    beam([u,y,-1.2],[u,y,1.2],0.1,'iron');
    for(const v of [-0.9,0.9])beam([u,y,v],[u,y-0.72,v],0.055);
    // A dark, chamfered glass body with white roof, sill and door mullions.
    // Opaque glazing avoids 42 transparent draws and sorting artefacts.
    const outline=[[-1.0,-1.05],[1.0,-1.05],[1.16,-0.7],[1.16,0.7],[1.0,1.05],[-1.0,1.05],[-1.16,0.7],[-1.16,-0.7]];
    const shape=new THREE.Shape(outline.map(([x,z])=>new THREE.Vector2(x,z)));
    const g=new THREE.ExtrudeGeometry(shape,{depth:1.62,bevelEnabled:false,steps:1});
    g.rotateX(Math.PI/2);g.translate(u,cy+0.81,0);b.put(g,'glass',0,0);
    for(const dy of [-0.88,0.91])box('roof',[u,cy+dy,0],[2.35,0.19,2.15]);
    if(near) {
      for(const du of [-0.99,0.99])for(const v of [-1.065,1.065])box('lattice',[u+du,cy,v],[0.085,1.68,0.085]);
      for(const v of [-1.065,1.065])box('lattice',[u,cy,v],[0.065,1.62,0.04]);
      box('iron',[u,cy+1.07,0],[0.75,0.16,0.70]);
    }
    // Small subdued light caps on the rim; no point lights or animation.
    if(i%2===0)for(const v of [-1.3,1.3])box('paint',[u,y,v],[0.14,0.14,0.08]);
  }

  // Raised loading platform under the bottom cabins; open rails and access
  // stairs. Adjacent café/ticket buildings remain provider-owned.
  // The deck top is 0.45 m: the lowest cabin sill passes about 0.11 m above it instead of sinking into it.
  box('iron',[0,0.325,0],[14,0.25,6]);
  for(const v of [-3,3]) {
    for(const y of [1.0,1.5])beam([-7,y,v],[7,y,v],0.045);
    for(let u=-7;u<=7;u+=2)beam([u,0.45,v],[u,1.5,v],0.045);
    box('concrete',[0,0.1625,v+Math.sign(v)*0.4],[3,0.325,0.6]);
  }
  if(near) {
    // Drive/service landing and lattice staircase at the northern lower rim.
    box('iron',[-12,5,2.8],[3.5,0.2,2.5]);
    for(const v of [1.55,4.05]) {
      beam([-14,0.8,v],[-12,5,v],0.11);
      beam([-14,1.8,v],[-12,6,v],0.045);
    }
    for(let i=0;i<16;i++)box('roof',[-14+i/8,0.9+i*0.265,2.8],[0.28,0.08,2.4]);
    for(const u of [-13.2,-10.8])cylinder([u,5.5,0],0.5,0.7,'iron',12);
  }
  const root=b.finish();
  root.traverse(o=>{
    if(!o.isMesh)return;
    o.geometry.deleteAttribute('bridgeLift');
    o.geometry.rotateY(WHEEL_ANGLE);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();
    o.material.color.set(GRANDE_ROUE_PALETTES.light[o.material.name]);
    if(o.material.name==='paint'){o.material.emissive.set('#a6bdc8');o.material.emissiveIntensity=0.12;}
  });
  root.userData.cabins=SPEC.cabins;root.userData.cabinsUpright=true;
  root.userData.elevationDatum=SPEC.elevationDatum;
  return root;
}
