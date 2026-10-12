import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { OUTER_TERRACE, LOWER_TERRACE, MIDDLE_TERRACE, UPPER_TERRACE } from './footprint.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';

const k = mercStretch(SPEC.origin[1]), ox = lngToMercX(SPEC.origin[0]), oz = latToMercY(SPEC.origin[1]);
export const plan = (x,y,z) => new THREE.Vector3(x,y,z).applyAxisAngle(new THREE.Vector3(0,1,0),SPEC.rotation).toArray();
export function mapPoint([lng,lat]) {
  return new THREE.Vector3((lngToMercX(lng)-ox)/k,0,-(latToMercY(lat)-oz)/k).applyAxisAngle(new THREE.Vector3(0,1,0),-SPEC.rotation).toArray();
}
// NPS 26-column peristyle and 12-column octastyle portico. OSM's mapped
// individual shafts are incomplete (7 front shafts); use the USGS setting plan
// and mapped radius/bearing to restore the centered entrance and bay rhythm.
export const EXTERIOR_COLUMNS = [
  ...Array.from({length:26},(_,i)=>{const a=(45+270*i/25)*Math.PI/180;return [22.2*Math.sin(a),-22.2*Math.cos(a)];}),
  ...Array.from({length:8},(_,i)=>[-13.3+26.6*i/7,-28.5]),
  ...[-13.3,13.3].flatMap(x=>[-24.6,-20.8].map(z=>[x,z])),
];
export const INTERIOR_COLUMNS = Array.from({length:4},(_,side)=>[-4.8,-1.6,1.6,4.8].map(x=>{
  const a=side*Math.PI/2; return [x*Math.cos(a)+11.2*Math.sin(a), -x*Math.sin(a)+11.2*Math.cos(a)];
})).flat();

export function create({detail='near'}={}) {
  const near=detail==='near', seg=near?64:24;
  const b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  function put(g,mat='stone'){g.rotateY(SPEC.rotation);b.put(g,mat);}
  function box(mat,x,y,z,w,h,d,angle=0){const g=new THREE.BoxGeometry(w,h,d);g.rotateY(angle);g.translate(x,y,z);put(g,mat);}
  function turned(profile,mat='stone',segments=seg,x=0,z=0){const g=new THREE.LatheGeometry(profile.map(([r,y])=>new THREE.Vector2(r,y)),segments);g.translate(x,0,z);put(g,mat);}
  function sphere(mat,x,y,z,rx,ry,rz){const g=new THREE.SphereGeometry(1,near?10:6,near?6:4);g.scale(rx,ry,rz);g.translate(x,y,z);put(g,mat);}
  function rod(mat,a,c,r){const av=new THREE.Vector3(...a),cv=new THREE.Vector3(...c),d=cv.clone().sub(av),g=new THREE.CylinderGeometry(r,r,d.length(),near?8:5);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()));g.translate(...av.add(cv).multiplyScalar(.5).toArray());put(g,mat);}
  function terrace(ring,y0,y1){
    const shape=new THREE.Shape(ring.slice(0,-1).map(p=>{const [x,,z]=mapPoint(p);return new THREE.Vector2(x,-z);}));
    const g=new THREE.ExtrudeGeometry(shape,{depth:y1-y0,steps:1,bevelEnabled:false});g.rotateX(-Math.PI/2);g.translate(0,y0,0);put(g,'granite');
  }
  // Lawn is an open graded bank, not a three-metre granite-sided disk.
  // Each radial section meets the lower stone terrace at y=3 and local grade
  // at the exact mapped outer perimeter; terrain placement uses the rigid pad.
  const outerBank=OUTER_TERRACE.slice(0,-1).map(p=>{const [x,,z]=mapPoint(p);return [x,z];});
  const innerBank=LOWER_TERRACE.slice(0,-1).map(p=>{const [x,,z]=mapPoint(p);return [x,z];});
  const bankInner=([x,z])=>{
    const length=Math.hypot(x,z),dx=x/length,dz=z/length;let radius=0;
    for(let i=0;i<innerBank.length;i++){
      const a=innerBank[i],c=innerBank[(i+1)%innerBank.length],ex=c[0]-a[0],ez=c[1]-a[1],den=dx*ez-dz*ex;
      if(Math.abs(den)<1e-8)continue;
      const r=(a[0]*ez-a[1]*ex)/den,t=(a[0]*dz-a[1]*dx)/den;
      if(r>0&&t>=-1e-6&&t<=1+1e-6)radius=Math.max(radius,r);
    }
    radius=Math.min(length,radius);return [dx*radius,3,dz*radius];
  };
  const turf=[];
  for(let i=0;i<outerBank.length;i++){
    const a=outerBank[i],c=outerBank[(i+1)%outerBank.length],ia=bankInner(a),ic=bankInner(c),oa=[a[0],0,a[1]],oc=[c[0],0,c[1]];
    for(const points of [[ia,oa,oc],[ia,oc,ic]]){
      const v=points.map(p=>new THREE.Vector3(...p)),normal=v[1].clone().sub(v[0]).cross(v[2].clone().sub(v[0]));
      if(normal.length()<1e-5)continue;if(normal.y<0)points.reverse();turf.push(...points.flat());
    }
  }
  const lawn=new THREE.BufferGeometry();lawn.setAttribute('position',new THREE.Float32BufferAttribute(turf,3));lawn.computeVertexNormals();put(lawn,'turf');
  terrace(LOWER_TERRACE,0,3.3);
  terrace(MIDDLE_TERRACE,3.3,3.65);
  terrace(UPPER_TERRACE,3.65,4);
  // Stairs rise from the north plaza to the circular upper stylobate.
  const count=near?24:12;
  for(let i=0;i<count;i++){
    const z=-51.3+i*20.5/count, h=4*(i+1)/count;
    box('granite',0,h/2,z+10.25/count,near?45:45,h,20.5/count);
  }
  for(const s of [-1,1]) {
    // Granite buttresses follow the stair rise, with a horizontal upper landing.
    for(let i=0;i<8;i++){const h=.5+4*(i+1)/8;box('granite',s*24,h/2,-49.8+i*2.6,2.4,h,2.6);}
  }
  // Actual unfluted Ionic shafts: Attic bases, taper, echinus, scrolls and abaci.
  const top=SPEC.floorY+SPEC.columnHeight;
  function column(x,z,inside=false){
    const floor=SPEC.floorY, ct=inside?floor+11.938:top;
    const profile=near?[[0,floor],[.98,floor],[.98,floor+.17],[.91,floor+.28],[.95,floor+.43],[.80,floor+.57],[.80,floor+.68],[.69,ct-.7],[.87,ct-.52],[0,ct-.52]]:[[0,floor],[.93,floor],[.80,floor+.6],[.69,ct-.52],[0,ct-.52]];
    turned(profile,'stone',near?12:5,x,z);
    const angle=Math.atan2(x,-z);
    box('stone',x,ct-.38,z,1.55,.28,1.12,angle);
    box('stone',x,ct-.12,z,2.04,.24,1.39,angle);
    for(const u of [-.74,.74])for(const v of (near?[-.53,.53]:[-.53])){
      const dx=u*Math.cos(angle)+v*Math.sin(angle),dz=-u*Math.sin(angle)+v*Math.cos(angle);
      const g=new THREE.CylinderGeometry(.28,.28,.19,near?12:4);g.rotateX(Math.PI/2);g.rotateY(angle);g.translate(x+dx,ct-.43,z+dz);put(g);
      if(near&&v<0){const t=new THREE.TorusGeometry(.16,.045,3,10,Math.PI*1.8);t.rotateY(angle);t.translate(x+dx,ct-.43,z+dz+Math.cos(angle)*.115);put(t);}
    }
  }
  EXTERIOR_COLUMNS.forEach(([x,z])=>column(x,z));
  INTERIOR_COLUMNS.forEach(([x,z])=>column(x,z,true));
  // Four curved wall quadrants; cardinal openings stay real negative space.
  const r=13.75, opening=.43;
  for(let q=0;q<4;q++){
    const shape=new THREE.Shape(), a=q*Math.PI/2+opening, c=(q+1)*Math.PI/2-opening;
    shape.absarc(0,0,r,a,c,false);shape.absarc(0,0,r-1.1,c,a,true);shape.closePath();
    const g=new THREE.ExtrudeGeometry(shape,{depth:17.1-SPEC.floorY,steps:1,bevelEnabled:false,curveSegments:near?24:4});
    g.rotateX(-Math.PI/2);g.translate(0,SPEC.floorY,0);put(g,'interior');
  }
  // The annular entablature closes both the soffit and cornice while retaining
  // the colonnade's empty bays. Stepped profile produces real shadow ledges.
  const outer=SPEC.rotundaDiameter/2;
  turned([[13.5,top],[24.3,top],[24.3,top+.45],[24.55,top+.45],[24.55,top+.70],[24.3,top+.70],[24.3,19.1],[24.72,19.1],[24.72,19.40],[outer,19.68],[outer,19.85],[17.05,19.85],[17.05,20.05],[13.5,20.05],[13.5,top]]);
  // Inner frieze and true dome underside; the chamber is never a solid cylinder.
  turned([[12.4,15.938],[13.5,15.938],[13.5,20.05],[12.4,20.05],[12.4,15.938]],'interior');
  // Solid ring drum above the open chamber, with two projecting mouldings.
  turned([[12.4,20.05],[17.05,20.05],[17.05,20.4],[17.2,20.4],[17.2,20.68],[16.75,20.68],[16.75,23.65],[17.15,23.65],[17.15,24.05],[17.2,24.05],[17.2,24.6],[12.4,24.6],[12.4,20.05]],'stone');
  // A shallow ellipsoidal dome, original lofted shell; outer and inward normals.
  const levels=near?12:6, cap=[];
  for(let j=0;j<=levels;j++){const a=j*Math.PI/2/levels;cap.push([17.2*Math.cos(a),24.6+(SPEC.height-24.6)*Math.sin(a)]);}
  cap[cap.length-1][0]=0;
  turned(cap,'stone');
  const inner=[];
  for(let j=levels;j>=0;j--){const a=j*Math.PI/2/levels;inner.push([12.4*Math.cos(a),24.6+(SPEC.height-1.2192-24.6)*Math.sin(a)]);}
  inner[0][0]=0;turned(inner,'interior');
  // Pedimented octastyle portico, NPS 102 x 45 feet. Roof rotation is baked.
  const w=SPEC.porticoWidth, front=-30.1, back=front+SPEC.porticoDepth, base=19.8496, apex=22.8976;
  box('stone',0,(top+base)/2,(front+back)/2,w,base-top,back-front);
  const ped=new THREE.Shape([new THREE.Vector2(-w/2,base),new THREE.Vector2(w/2,base),new THREE.Vector2(0,apex)]);
  const pg=new THREE.ExtrudeGeometry(ped,{depth:back-front,steps:1,bevelEnabled:false});pg.translate(0,0,front);put(pg);
  // Carved pediment relief: standing Jefferson and four seated committee figures.
  // Every part intersects the pediment stone; these are silhouettes, not a scan.
  const reliefZ=front-.18;
  box('stone',0,20.32,reliefZ,3.4,.22,.42);
  box('stone',0,20.66,reliefZ,3.0,.20,.43);
  for(const [x,standing] of [[-4.8,false],[-2.6,false],[0,true],[2.6,false],[4.8,false]]){
    const y=standing?21.2:20.9;
    sphere('stone',x,y,reliefZ,.30,standing?.65:.40,.31);
    sphere('stone',x,y+(standing?.71:.48),reliefZ,.22,.25,.23);
    rod('stone',[x-.2,y-.18,reliefZ],[x-.55,20.10,reliefZ],.12);
    rod('stone',[x+.2,y-.18,reliefZ],[x+.55,20.10,reliefZ],.12);
  }
  if(near){
    // Dentil cornice and pediment sloping mouldings, same stone material.
    for(let x=-14.5;x<=14.5;x+=.75)box('stone',x,19.55,front-.18,.31,.22,.34);
    rod('stone',[-w/2,base+.08,front-.15],[0,apex+.08,front-.15],.14);
    rod('stone',[0,apex+.08,front-.15],[w/2,base+.08,front-.15],.14);
  }
  // Standing 19 ft bronze Jefferson on the 6 ft Minnesota granite pedestal.
  const plinth=SPEC.floorY+1.8288;
  box('bronze',0,SPEC.floorY+.9144,0,2.8,1.8288,2.8);
  box('bronze',0,plinth+.08,0,3.05,.16,3.05);
  for(const s of [-1,1]){
    rod('bronze',[s*.27,plinth+.16,-.10],[s*.30,plinth+2.4,.02],.23);
    box('bronze',s*.29,plinth+.10,-.23,.46,.20,.83);
  }
  // Coat tails and torso are separate recognizable human volumes.
  sphere('bronze',0,plinth+2.85,.12,.67,1.48,.44);
  sphere('bronze',0,plinth+4.07,0,.70,.89,.39);
  sphere('bronze',0,plinth+5.30,-.04,.34,.49,.33);
  sphere('bronze',0,plinth+4.95,0,.25,.27,.24);
  for(const s of [-1,1]){
    rod('bronze',[s*.61,plinth+4.38,0],[s*.72,plinth+3.15,-.18],.19);
    sphere('bronze',s*.72,plinth+3.08,-.18,.17,.24,.16);
  }
  box('bronze',.80,plinth+3.12,-.30,.18,.83,.24);
  return b.finish();
}
