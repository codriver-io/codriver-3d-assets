import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, WHEEL_ANGLE } from './config.js';

export const wheelPoint = (a, radius = 60, v = 0) => [Math.sin(a) * radius, SPEC.hubHeight + Math.cos(a) * radius, v];
export const worldPoint = ([u,y,v]) => [u*Math.cos(WHEEL_ANGLE)+v*Math.sin(WHEEL_ANGLE),y,-u*Math.sin(WHEEL_ANGLE)+v*Math.cos(WHEEL_ANGLE)];

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const contacts = [], capsules = [], parts = [], offsets = {};
  // Named component ranges survive material batching for surface contact tests.
  function part(name, geometry, material) {
    const start = offsets[material] || 0, count=geometry.attributes.position.count;
    parts.push({name,material,start,count});offsets[material]=start+count;b.put(geometry,material);
  }
  function box(name, material, center, size) {
    const g = new THREE.BoxGeometry(...size);g.translate(...center);part(name,g,material);
  }
  function tube(name, material, a, c, radius, supportA, supportB) {
    const av=new THREE.Vector3(...a),cv=new THREE.Vector3(...c),d=cv.clone().sub(av);
    const g=new THREE.CylinderGeometry(radius,radius,d.length(),near?5:3,1,false);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()));g.translate(...av.add(cv).multiplyScalar(0.5).toArray());part(name,g,material);
    if(supportA)contacts.push({name,a:worldPoint(a),c:worldPoint(c),supportA,supportB});
  }
  function ring(name,r,v,tubeR,material='steel') {
    const g=new THREE.TorusGeometry(r,tubeR,near?5:3,64);g.translate(0,69,v);part(name,g,material);
  }
  // Both inclined legs stand on the east/land side. No river-side A-frame.
  for(const u of [-13.5,13.5]) {
    const foot=`foundation-${u}`;
    box(foot,'concrete',[u,0.65,38],[5,1.3,5]);
    tube(`leg-${u}`,'steel',[u,1,38],[0,69,19],1.25,foot,'hub');
  }
  const axle=new THREE.CylinderGeometry(1.45,1.45,23,near?20:10);axle.rotateX(Math.PI/2);axle.translate(0,69,9.5);part('hub',axle,'steel');
  for(const v of [-2,2]) {
    const g=new THREE.CylinderGeometry(2.4,2.4,0.55,near?24:12);g.rotateX(Math.PI/2);g.translate(0,69,v);part(`flange-${v}`,g,'steel');
  }
  box('backstay-anchor','concrete',[0,0.6,76],[4.6,1.2,4.8]);
  for(const u of [-0.9,0.9])tube(`backstay-${u}`,'cable',[u,69,19],[u,1,76],0.14,'hub','backstay-anchor');

  // Open triangular-section rim, with thin tensioned bicycle-wheel spokes.
  ring('rim-front',60,-2.5,0.27,'light');ring('rim-back',60,2.5,0.27,'light');ring('rim-inner',56.5,0,0.23);
  const stations=64;
  for(let i=0;i<stations;i++) {
    const a=i*Math.PI*2/stations, next=(i+1)*Math.PI*2/stations;
    for(const v of [-2.5,2.5]) {
      const rim=v<0?'rim-front':'rim-back', flange=v<0?'flange--2':'flange-2';
      // 64 main spokes alternate hub flange faces; all terminate at inner rim.
      if((i%2===0)===(v<0))tube(`spoke-${i}`,'cable',[Math.sin(a)*1.9,69+Math.cos(a)*1.9,v<0?-2:2],wheelPoint(a,56.5,0),near?0.045:0.07,flange,'rim-inner');
      // Eight tangential rotation cables per face link outer rim to hub.
      if(i%8===0)tube(`rotation-cable-${i}-${v}`,'cable',[Math.sin(a+(v<0?0.45:-0.45))*1.9,69+Math.cos(a+(v<0?0.45:-0.45))*1.9,v<0?-2:2],wheelPoint(a,60,v),near?0.045:0.07,flange,rim);
      tube(`rim-tie-${i}-${v}`,'steel',wheelPoint(a,56.5,0),wheelPoint(a,60,v),0.095,'rim-inner',rim);
      if(near||i%2===0)tube(`rim-diagonal-${i}-${v}`,'steel',wheelPoint(a,60,v),wheelPoint(next,56.5,0),0.075,rim,'rim-inner');
    }
    if(near)tube(`rim-cross-${i}`,'steel',wheelPoint(a,60,-2.5),wheelPoint(a,60,2.5),0.08,'rim-front','rim-back');
  }
  // Upright external ovoid capsules, long axis parallel to axle. Glass and
  // lower belly partition the shell instead of overlaying opaque surfaces.
  const theta=1.8;
  for(let i=0;i<SPEC.capsules;i++) {
    const a=i*Math.PI*2/SPEC.capsules,[u,y]=wheelPoint(a,SPEC.capsuleRadius), name=`capsule-${i}`;
    capsules.push({center:worldPoint([u,y,0]),name});
    for(const [material,start,length] of [['glass',0,theta],['steel',theta,Math.PI-theta]]) {
      const g=new THREE.SphereGeometry(1,near?16:12,material==='glass'?(near?8:3):(near?4:2),0,Math.PI*2,start,length);g.scale(2.15,2.25,4);g.translate(u,y,0);part(name,g,material);
    }
    for(const v of [-2.5,2.5])tube(`capsule-mount-${i}-${v}`,'steel',wheelPoint(a,60,v),[u,y,v],0.12,v<0?'rim-front':'rim-back',name);
    for(const v of near?[-2.8,0,2.8]:[0,2.8]) {
      // Raised ribs separate the glass; retain two pale framing hoops in far.
      const scale=Math.sqrt(1-(v/4)**2),g=new THREE.TorusGeometry(1,near?0.045:0.055,3,near?12:8);
      g.scale(1.025,1.025,1);
      g.scale(2.15*scale,2.25*scale,1);g.translate(u,y,v);part(`pod-frame-${i}-${v}`,g,'steel');
    }
    if(near) {
      const g=new THREE.TorusGeometry(1,0.035,3,12);g.rotateX(Math.PI/2);g.scale(2.15,1,4);g.translate(u,y,0);part(`pod-sill-${i}`,g,'steel');
    }
  }
  // Low loading/service structures; neighbours and kiosks remain provider-owned.
  box('platform','deck',[0,1.35,0],[59,2.7,8]);
  for(const u of [-25,25])box(`drive-${u}`,'steel',[u,4.2,0],[4.5,3,6]);
  for(const u of [-25,25]) {
    box(`landing-${u}`,'deck',[u,1.35,10],[4.5,2.7,12]);
    for(let k=0;k<9;k++)box(`step-${u}-${k}`,'concrete',[u,0.15*(9-k),16+0.35*k],[4.5,0.3*(9-k),0.35]);
  }
  if(near)for(let i=0;i<32;i++)box(`lamp-${i}`,'light',wheelPoint(i*Math.PI/16,60.32,-2.5),[0.15,0.15,0.15]);
  const root=b.finish();
  root.traverse(o=>{if(o.isMesh){o.geometry.rotateY(WHEEL_ANGLE);o.geometry.deleteAttribute('bridgeLift');o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();}});
  // Test provenance is accessible without bloating exported JSON extras.
  for(const [key,value] of Object.entries({parts,contacts,capsules}))Object.defineProperty(root.userData,key,{value,enumerable:false});
  root.userData.capsulesUpright=true;
  return root;
}
