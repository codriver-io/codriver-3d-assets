import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';

// Original Greek-cross church, in metre coordinates. Each face is authored in a
// south-facing frame then quarter-turned; the final mapped yaw is baked here.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const Y = SPEC.terraceHeight;
  const put = (g,m) => b.put(g,m);
  const box = (m,x,y,z,w,h,d,a=0) => b.box(m,[x,y,z],[w,h,d],a);
  const cylinder = (m,x,z,r,y0,y1,n=near?24:12,rt=r) => {
    const g=new THREE.CylinderGeometry(rt,r,y1-y0,n);g.translate(x,(y0+y1)/2,z);put(g,m);
  };
  const lathe = (m,x,z,pts,n=near?24:12) => {
    const g=new THREE.LatheGeometry(pts.map(([r,y])=>new THREE.Vector2(r,y)),n);g.translate(x,0,z);put(g,m);
  };
  const turn=(x,z,a)=>[x*Math.cos(a)+z*Math.sin(a),z*Math.cos(a)-x*Math.sin(a)];
  function face(a) {
    return {
      box(m,x,y,z,w,h,d){const [u,v]=turn(x,z,a);box(m,u,y,v,w,h,d,a);},
      put(g,m){g.rotateY(a);put(g,m);},
      col(x,z,y0,y1,r){const [u,v]=turn(x,z,a);cylinder('stone',u,v,r,y0,y1,near?10:5,r*.86);},
    };
  }
  function triangle(f,m,w,y,rise,z,depth) {
    const s=new THREE.Shape();s.moveTo(-w/2,y);s.lineTo(w/2,y);s.lineTo(0,y+rise);s.closePath();
    const g=new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:false});g.translate(0,0,z-depth);f.put(g,m);
  }
  function statue(f,x,z,y) {
    // Feet, robe, shoulders, separate head and one raised bent arm: a human silhouette.
    f.box('zinc',x,y+.12,z,.65,.24,.6);
    const g=new THREE.CylinderGeometry(.28,.48,1.55,near?7:5);g.translate(x,y+.98,z);f.put(g,'zinc');
    f.box('zinc',x,y+1.72,z,.86,.5,.42);
    const head=new THREE.IcosahedronGeometry(.28,0);head.translate(x,y+2.22,z);f.put(head,'zinc');
    f.box('zinc',x+.43,y+1.92,z,.25,.7,.25);
    if(near)f.box('zinc',x-.45,y+1.55,z,.22,.72,.24);
  }
  // Continuous solid footing and physically stepped Senate Square approach.
  box('granite',0,Y/2,0,81,Y,73);
  const steps=near?40:20, depth=20/steps;
  // One closed stepped solid: no coincident internal stair-box faces.
  const stairShape=new THREE.Shape();stairShape.moveTo(-56.5,0);
  for(let i=0;i<steps;i++) {
    const z=56.5-i*depth,top=Y*(i+1)/steps;
    stairShape.lineTo(-z,top);stairShape.lineTo(-(z-depth),top);
  }
  stairShape.lineTo(-36.5,0);stairShape.closePath();
  const stair=new THREE.ExtrudeGeometry(stairShape,{depth:60,bevelEnabled:false});
  stair.translate(0,0,-30);stair.rotateY(Math.PI/2);put(stair,'granite');
  // Side retaining parapets are grounded in the podium and stop at the last tread.
  box('granite',-36,Y/2,44,12,Y,15);box('granite',36,Y/2,44,12,Y,15);
  // Central square, four arms, four smaller corner drum bases.
  box('stone',0,Y+10,0,26,20,26);
  for(let i=0;i<4;i++) {
    const f=face(i*Math.PI/2);
    f.box('stone',0,Y+10,18.6,25.2,20,12.3);
    f.box('stone',0,Y+.5,26.9,25.5,1,7.4);
    // Arm roof hidden behind the pediment except the copper gable slopes.
    triangle(f,'copper',25,Y+20,3.5,25,12);
    f.box('stone',0,Y+16.7,27.5,26.1,1.8,5.2);
    f.box('stone',0,Y+18.1,27.5,26.4,.8,5.6);
    triangle(f,'stone',26.4,Y+18.5,3.5,30.3,5.6);
    triangle(f,'relief',24.5,Y+19,2.6,30.48,.16);
    // Pediment raking cornices; endpoints land in the continuous triangular block.
    for(const sign of [-1,1]) {
      const g=new THREE.BoxGeometry(Math.hypot(13.2,3.5),.42,.6);
      g.rotateZ(sign*-Math.atan2(3.5,13.2));g.translate(sign*6.6,Y+20.25,30.55);f.put(g,'relief');
    }
    // Recessed frieze and dentils below the projecting cornice.
    f.box('relief',0,Y+17.4,30.24,25,.55,.28);
    if(near)for(let x=-12;x<=12;x+=.9)f.box('relief',x,Y+18.35,30.4,.34,.32,.34);
    // Six Corinthian columns, independently visible in BOTH LODs.
    for(const x of [-10.5,-6.3,-2.1,2.1,6.3,10.5]) {
      f.col(x,28.5,Y+1,Y+15.3,.72);
      f.box('stone',x,Y+1.2,28.5,1.85,.4,1.85);
      f.box('stone',x,Y+15.7,28.5,1.9,1,1.9);
      if(near)for(const s of [-1,1]) {
        f.box('stone',x+s*.6,Y+15.65,28.5,.38,.72,1.9);
      }
    }
    // Rear door and distinct square window rows behind the open portico.
    f.box('glass',0,Y+3,24.86,3.4,4,.18);
    for(const x of [-8,0,8]) {
      f.box('glass',x,Y+6.6,24.95,2.7,2.8,.18);
      f.box('relief',x,Y+8.35,25.06,3.5,.45,.45);
      f.box('relief',x,Y+12.5,25.02,3.5,2.5,.22);
      if(near)for(const dx of [-.72,0,.72])f.box('relief',x+dx,Y+6.6,25.13,.1,2.8,.14);
    }
    // Side walls: keep individual bays in far, same warm-grey pilasters/courses.
    for(const side of [-1,1]) {

      // Long arm flanks transform explicitly rather than patching broad dark bands.
      for(const z of [16.6,21.5]) {
        const g=new THREE.BoxGeometry(.18,3.5,2);g.translate(side*12.72,Y+6.5,z);f.put(g,'glass');
        const trim=new THREE.BoxGeometry(.35,.45,2.8);trim.translate(side*12.84,Y+8.5,z);f.put(trim,'relief');
      }
      f.box('relief',side*12.8,Y+10,19, .45,.5,11.5);
      f.box('stone',side*12.85,Y+19.65,19,.65,1.3,12.2);
      for(const z of [13.6,24])f.box('relief',side*12.79,Y+9.9,z,.36,17.8,.75);
    }
    // Three apostles per arm: two corners and one at the pediment apex.
    statue(f,-12,29.5,Y+18.9);statue(f,12,29.5,Y+18.9);statue(f,0,29.5,Y+22);
  }
  for(const x of [-13,13])for(const z of [-13,13]) {
    box('stone',x,Y+12.75,z,8.2,25.5,8.2);
    box('stone',x,Y+26,z,8.8,1,8.8);
    for(let i=0;i<4;i++) {
      const a=i*Math.PI/2,[u,v]=turn(0,4.21,a);
      box('relief',x+u,Y+23,z+v,3,3.7,.26,a);
      box('relief',x+u,Y+20.3,z+v,8.2,.65,.3,a);
      for(const side of [-1,1]) {
        const [px,pz]=turn(side*3.25,4.2,a);
        box('relief',x+px,Y+22.2,z+pz,.42,5.8,.3,a);
      }
    }
    box('stone',x,Y+28,z,6.7,3,6.7);
    // Recess-like arched niches on the four square belfry drums.
    for(let i=0;i<4;i++) {
      const a=i*Math.PI/2,[u,v]=turn(0,3.48,a);
      box('relief',x+u,Y+27.9,z+v,2.6,2.8,.2,a);
    }
    cylinder('stone',x,z,3.6,Y+29.2,Y+30);
    const profile=[[3.25,Y+29.8],[3.25,Y+30.5]];
    for(let i=1;i<= (near?8:4);i++) {const t=i/(near?8:4)*Math.PI/2;profile.push([3.25*Math.cos(t),Y+30.5+3.5*Math.sin(t)]);}
    lathe('copper',x,z,profile,near?20:10);
    lathe('lamp',x,z,[[.1,Y+33.8],[.48,Y+34.4],[.2,Y+35],[.12,Y+36]],near?8:6);
    box('lamp',x,Y+36.2,z,.18,3.6,.18);box('lamp',x,Y+36.7,z,1.8,.18,.18);
  }
  // The central drum has a cylindrical white lower base and windowed upper order.
  cylinder('stone',0,0,7.65,Y+21,Y+44.5);
  for(const [y,r,h] of [[24,8.05,.7],[31.8,8.4,.9],[41,8.15,1],[43.4,8.35,1],[45,7.8,.7]])cylinder('stone',0,0,r,Y+y,Y+y+h);
  const bays=12;
  for(let i=0;i<bays;i++) {
    const a=i*2*Math.PI/bays,f=face(a);
    for(const [y,h] of [[34,3],[38.1,3.8]]) f.box('glass',0,Y+y,7.65,1.9,h,.32);
    for(const s of [-1,1])f.box('relief',s*1.33,Y+36.5,7.71,.38,9,.4);
    if(near)for(const y of [33.1,34,34.9,36.7,37.7,38.7,39.7])f.box('relief',0,Y+y,7.9,1.9,.09,.12);
    // Gold stars are omitted; the main copper shell is muted green.
  }
  // Four clocks on the upper drum (separate disks, supported by its wall).
  for(let i=0;i<4;i++) {
    const f=face(i*Math.PI/2),g=new THREE.CircleGeometry(.93,near?20:10);g.translate(0,Y+42,7.91);f.put(g,'copper');
    if(near) {f.box('lamp',0,Y+42.3,8.02,.08,.7,.1);f.box('lamp',.23,Y+42,8.02,.5,.08,.1);}
  }
  const dome=[[7.6,Y+45.3],[7.6,Y+45.7]];
  for(let i=1;i<= (near?12:6);i++){const t=i/(near?12:6)*Math.PI/2;dome.push([7.6*Math.cos(t),Y+45.7+7.3*Math.sin(t)]);}
  lathe('copper',0,0,dome,near?32:16);
  lathe('copper',0,0,[[.2,Y+52.7],[1.4,Y+53.2],[1.2,Y+54],[.6,Y+55],[.2,Y+56]],near?16:8);
  lathe('lamp',0,0,[[.15,Y+55.8],[.7,Y+56.5],[.55,Y+57],[.15,Y+57.5]],near?12:6);
  box('lamp',0,Y+59.1,0,.22,3.8,.22);box('lamp',0,Y+59.7,0,2.1,.22,.22);
  const root=b.finish();root.rotation.y=SPEC.yaw;root.updateMatrixWorld(true);
  // Bake placement into vertex positions, never leave a transform for the host to repeat.
  for(const mesh of root.children) {mesh.geometry.applyMatrix4(root.matrixWorld);mesh.geometry.computeBoundingBox();mesh.geometry.computeBoundingSphere();}
  root.rotation.y=0;root.updateMatrixWorld(true);return root;
}
