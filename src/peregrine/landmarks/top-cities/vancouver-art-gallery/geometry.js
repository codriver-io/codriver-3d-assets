import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { ANGLE, PARTS } from './vancouver-art-gallery-site.js';
import { kit } from './vancouver-art-gallery-kit.js';

export function create({detail='near'}={}) {
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=kit(b,near);
  const outer=PARTS.find(p=>p.id===69701736).ring;
  // The OSM outline includes the portico floor; its upper volume is genuinely open.
  const left=outer.findIndex(([u,v])=>u===-32.633&&v===-22.211);
  const right=outer.findIndex(([u,v])=>u===28.614&&v===-21.546);
  // Keep the two wing fronts straight and put the entrance 6.4 m behind the shafts.
  const body=[...outer.slice(0,left+1),[-11.65,-22.202],[-11.65,-19.5],
    [6.817,-19.5],[6.817,-21.456],...outer.slice(right)];
  k.prism('foundation',outer,0,3.2,true);
  k.prism('stone',body,3.2,13.15,true);
  // Front/rear low roof terraces and the two clerestory cross-wings.
  for(const p of PARTS.filter(p=>[361964121,361964123,361964125,361964126].includes(p.id))){
    k.prism('stone',p.ring,13.15,14.0);
    const r=p.ring;for(let i=0;i<r.length;i++){
      const a=r[i],c=r[(i+1)%r.length],len=Math.hypot(c[0]-a[0],c[1]-a[1]);if(len<5)continue;
      b.bar('stone',[a[0],14.65,a[1]],[c[0],14.65,c[1]],.23,.26);
      const count=Math.floor(len/(near?1.0:2.2));for(let j=0;j<=count;j++){
        const t=j/count;k.cyl('stone',a[0]+(c[0]-a[0])*t,a[1]+(c[1]-a[1])*t,14.0,14.58,.11,.11,near?6:4);
      }
    }
  }
  for(const p of PARTS.filter(p=>[361964117,361964119].includes(p.id))){
    k.prism('stone',p.ring,13.15,14.0);k.roof(p.ring,14,18);
  }
  // Raised square rotunda block, beneath the dome; front wall is behind the portico.
  const core=[[-11.65,-19.5],[6.817,-19.5],[7.25,11.9],[-11.0,11.9]];
  k.prism('stone',core,13.15,18.9,true);
  const cx=-2.23,cz=-5.6;
  k.drum([[cx-6.1,cz-6.1],[cx+6.1,cz-6.1],[cx+6.1,cz+6.1],[cx-6.1,cz+6.1]],18.9,22.2);
  // A broad shallow copper cupola, rather than an onion or a tall hemisphere.
  const prof=[[6.1,22.2],[6.1,22.45],[5.8,23.0],[5.2,24.0],[4.15,24.9],[2.65,25.65],[1.65,25.8],[1.65,26.0],[1.2,26.1],[.85,26.35],[.1,26.5],[0,26.5]];
  k.profile('copper',cx,cz,prof);
  if(near)for(let i=0;i<24;i++){
    const a=i*Math.PI/12;for(let j=1;j<6;j++){
      const [r,y]=prof[j],[rr,yy]=prof[j+1];b.bar('copper',[cx+Math.sin(a)*(r+.025),y,cz+Math.cos(a)*(r+.025)],[cx+Math.sin(a)*(rr+.025),yy,cz+Math.cos(a)*(rr+.025)],.06);
    }
  }
  // Main Georgia-facing portico: four tapered Ionic shafts, supported roof and real gaps.
  b.box('stone',[-2.25,15.85,-23.8],[19.1,.9,6.5]);
  b.box('stone',[-2.25,16.475,-23.8],[19.9,.35,6.9]);
  b.box('stone',[-2.25,16.75,-23.8],[20.4,.2,7.3]);
  k.pediment(-2.25,-23.8,20.0,16.85,3.0,6.5,.55);
  for(const x of [-9.0,-4.5,0,4.5])k.column(x,-25.9,3.2,15.4,.68);
  // Full-depth framing piers connect to the recessed wall and hold the cornice ends.
  for(const x of [-11.65,7.15]){
    b.box('foundation',[x,1.6,-22.45],[2.1,3.2,6.15]);
    b.box('stone',[x,9.3,-22.45],[1.8,12.2,5.9]);
    b.box('stone',[x,3.4,-22.45],[2.1,.4,6.15]);
    b.box('stone',[x,15.85,-22.45],[2.3,.9,6.4]);
  }
  // Raised plinth and contiguous stair flight, with two lion plinths at its sides.
  for(let i=0;i<16;i++){const h=3.2-i*.2;b.box('foundation',[-2.25,h/2,-27.0-(i+.5)*.34],[13.5,h,.34]);}
  for(const x of [-10.55,6.05]){
    b.box('foundation',[x,1.45,-29.2],[2.8,2.9,4.0]);b.box('foundation',[x,3.03,-29.2],[3.05,.26,4.2]);
    // Reclining lions: haunches, elongated bodies, raised manes, muzzles and paws.
    k.put(new THREE.SphereGeometry(1,near?10:6,near?7:4).scale(.62,.65,1.27).translate(x,3.75,-29.0),'stone');
    k.put(new THREE.SphereGeometry(1,near?10:6,near?7:4).scale(.63,.90,.67).translate(x,4.12,-30.05),'stone');
    k.put(new THREE.SphereGeometry(.48,near?10:6,near?7:4).translate(x,4.70,-30.30),'stone');
    k.put(new THREE.SphereGeometry(1,near?8:5,near?6:3).scale(.33,.23,.4).translate(x,4.57,-30.65),'stone');
    for(const dx of [-.39,.39])b.box('stone',[x+dx,3.37,-30.1],[.38,.45,1.4]);
  }
  // Six tall paired bays per wing in BOTH LODs, separated by engaged Ionic columns.
  for(const [a,c,za,zc]of [[-32.633,-11.65,-22.211,-22.202],[6.817,28.614,-21.456,-21.546]]){
    const z=x=>za+(zc-za)*(x-a)/(c-a),span=c-a;
    for(let i=1;i<6;i++){
      const x=a+span*i/6;k.column(x,z(x)-.08,3.5,12.85,.4,true,'stone');
    }
    for(const x of [a+.65,c-.65]){
      b.box('stone',[x,8.2,z(x)-.10],[1.05,9.3,.5]);
      b.box('stone',[x,3.4,z(x)-.10],[1.3,.4,.65]);
      b.box('stone',[x,12.85,z(x)-.10],[1.35,.55,.75]);
    }
    // Set each projecting course into the wall, with no isolated strips in front.
    const angle=Math.atan2(-(zc-za),span),center=[(a+c)/2,(za+zc)/2];
    b.box('stone',[center[0],3.35,center[1]-.12],[span,.3,.55],angle);
    b.box('stone',[center[0],13.15,center[1]-.22],[span+.3,.6,1.0],angle);
    b.box('stone',[center[0],13.65,center[1]-.32],[span+.6,.4,1.35],angle);
    b.box('stone',[center[0],13.975,center[1]-.40],[span+.8,.25,1.65],angle);
    if(near)for(let x=a+.35;x<c;x+=.65)b.box('stone',[x,12.72,z(x)-.30],[.23,.25,.65]);
  }
  // Rear central pediment and engaged column entrance; the rear photo shows no deep porch.
  k.pediment(-1.9,12.03,18.1,14.05,2.7,1.0);
  for(const x of [-8.8,4.95])k.column(x,12.17,3.2,13.9,.42);
  b.box('stone',[-1.9,13.8,12.12],[17.9,.5,1.2]);
  for(let i=0;i<12;i++){const h=3.2-i*3.2/12;b.box('foundation',[-1.9,h/2,12.1+(i+.5)*.35],[11.7,h,.35]);}
  // Southwest Hooper addition: mapped two-storey connector and intersecting gabled hall.
  for(const p of PARTS.filter(p=>[380105927,380105931].includes(p.id))){
    k.prism('stone',p.ring,13.15,14.0);k.roof(p.ring,14,18);
  }
  const m=b.finish();m.rotation.y=-ANGLE;m.updateMatrixWorld(true);
  for(const mesh of m.children){mesh.geometry.applyMatrix4(m.matrixWorld);mesh.geometry=mergeVertices(mesh.geometry);mesh.geometry.computeBoundingBox();mesh.geometry.computeBoundingSphere();}
  m.rotation.y=0;m.updateMatrixWorld(true);return m;
}
