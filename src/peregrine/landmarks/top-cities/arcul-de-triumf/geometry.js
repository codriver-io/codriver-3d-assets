import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';

// All helpers author in monument coordinates. Rotation is baked into every primitive once.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', a = SPEC.axisDeg * Math.PI / 180;
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const fold = m => !near && ['joint', 'lamp'].includes(m) ? 'stone' : m;
  const put = (g,m) => { g.rotateY(a); b.put(g,fold(m)); };
  const box = (m,p,s) => { const g = new THREE.BoxGeometry(...s); g.translate(...p); put(g,m); };
  const bar = (m,p,q,w,d=w) => {
    const v=new THREE.Vector3(...p), e=new THREE.Vector3(...q).sub(v);
    const g=new THREE.BoxGeometry(w,e.length(),d);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),e.clone().normalize()));
    g.translate(...v.add(e.multiplyScalar(0.5)).toArray()); put(g,m);
  };
  const ball = (m,p,s,segments=near?10:7) => {
    const g = new THREE.SphereGeometry(1,segments,near?6:4); g.scale(...s);g.translate(...p);put(g,m);
  };
  const ring = (m,p,r,t) => {
    const g = new THREE.TorusGeometry(r,t,near?4:3,near?28:16); g.translate(...p);put(g,m);
  };
  const panel = (m,x,y,z,w,h,depth=0.12) => box(m,[x,y,z],[w,h,depth]);
  const frame = (x,y,z,w,h) => {
    panel('trim',x,y-h/2,z,w+0.22,0.16,0.24);panel('trim',x,y+h/2,z,w+0.22,0.16,0.24);
    for(const s of [-1,1])panel('trim',x+s*w/2,y,z,0.16,h,0.24);
  };
  // One closed concave extrusion, with a real, ground-open semicircular passage.
  const r=SPEC.archWidth/2, spring=SPEC.archCrown-r, half=SPEC.width/2;
  const shape=new THREE.Shape();shape.moveTo(-half,0);shape.lineTo(-r,0);shape.lineTo(-r,spring);
  const n=near?40:16;
  for(let i=1;i<=n;i++){const t=Math.PI*(1-i/n);shape.lineTo(r*Math.cos(t),spring+r*Math.sin(t));}
  shape.lineTo(r,0);shape.lineTo(half,0);shape.lineTo(half,19.3);shape.lineTo(-half,19.3);shape.closePath();
  const core=new THREE.ExtrudeGeometry(shape,{depth:SPEC.depth,bevelEnabled:false,steps:1,curveSegments:n});
  core.translate(0,0,-SPEC.depth/2);
  // Ground faces are entirely buried in the two wider footing blocks.
  const cp=core.attributes.position, ci=[];
  for(let i=0;i<cp.count;i+=3)if(![i,i+1,i+2].every(k=>Math.abs(cp.getY(k))<1e-6))ci.push(i,i+1,i+2);
  core.setIndex(ci);put(core,'stone');

  // Separate footing blocks: no solid slab across the arch, and no road or roundabout ownership.
  for(const s of [-1,1]) {
    const x=s*8.63;
    box('trim',[x,0.22,0],[7.86,0.44,9.3]);
    box('stone',[x,0.78,0],[7.24,0.76,9.08]);
    box('trim',[x,1.24,0],[7.4,0.2,9.24]);
    box('stone',[x,2.12,0],[6.95,1.66,8.94]);
    box('trim',[x,3.1,0],[7.25,0.34,9.14]);
  }
  box('stone',[0,20.46,0],[24.8,2.34,8.7]);
  // Deep projecting entablature, fascia, dentil bed, cornice and shadow line.
  box('trim',[0,19.37,0],[25.0,0.25,9.0]);
  box('relief',[0,21.64,0],[25.2,0.28,9.3]);
  box('recess',[0,21.96,0],[25.62,0.3,9.56]);
  box('trim',[0,22.28,0],[25.92,0.4,10.08]);
  box('trim',[0,22.66,0],[26.14,0.34,10.42]);
  box('stone',[0,23.18,0],[23.15,0.85,8.55]);
  // The stepped attic is a shallow central roof house behind low perimeter parapets.
  box('stone',[0,24.30,0],[16.65,2.08,4.46]);
  box('trim',[0,25.38,0],[16.85,0.24,4.62]);
  for(const s of [-1,1]) {
    box('stone',[0,24.08,s*3.91],[22.55,1.18,0.65]);
    box('trim',[0,24.76,s*3.91],[22.75,0.22,0.9]);
    if(near)for(const x of [-9,-5.4,-1.8,1.8,5.4,9]) {
      box('trim',[x,24.1,s*4.35],[0.58,1.4,0.45]);
      ball('relief',[x,24.23,s*4.64],[0.21,0.33,0.12]);
      box('trim',[x,24.84,s*4.26],[0.73,0.16,0.68]);
    }
  }
  for(const s of [-1,1])box('stone',[s*11.12,24.07,0],[0.65,1.16,7.75]);

  // Both frontal elevations carry a deep archivolt, pier pilasters and upper frieze.
  for(const side of [-1,1]) {
    const face=side*4.35;
    for(const rr of [r+0.2,r+0.5,r+0.87]) {
      const g=new THREE.TorusGeometry(rr,near?0.12:0.16,near?4:3,near?40:16,Math.PI);
      g.translate(0,spring,face+side*0.16);put(g,'trim');
      for(const s of [-1,1])panel('trim',s*rr,spring/2,face+side*0.16,near?0.2:0.27,spring,0.35);
    }
    // Radial stone joints of the arch, just proud of the facade.
    if(near)for(let i=0;i<=30;i++) {
      const t=Math.PI*i/30;
      bar('joint',[(r+0.05)*Math.cos(t),spring+(r+0.05)*Math.sin(t),face+side*0.09],
        [(r+1.12)*Math.cos(t),spring+(r+1.12)*Math.sin(t),face+side*0.09],0.035,0.045);
    }
    for(const s of [-1,1]) {
      const x=s*8.65;
      // Slender edge pilasters, rather than generic columns.
      for(const edge of [-1,1])panel('trim',x+edge*2.68,11.1,face+side*0.12,0.32,15.6,0.25);
      panel('trim',x,18.78,face+side*0.18,6.5,0.26,0.46);
      panel('relief',x,3.93,face+side*0.12,5.9,1.05,0.24);
      frame(x,3.93,face+side*0.27,5.9,1.05);
      // Medallions on the south facade; floral allegories on the north.
      panel('relief',x,16.3,face+side*0.12,2.55,2.9,0.22);
      frame(x,16.3,face+side*0.25,2.55,2.9);
      ring('trim',[x,16.3,face+side*0.29],0.98,0.11);
      const disc=new THREE.CylinderGeometry(0.87,0.87,0.14,near?32:16);disc.rotateX(Math.PI/2);disc.translate(x,16.3,face+side*0.28);put(disc,'recess');
      if(side===1) {
        ball('trim',[x,16.53,face+side*0.44],[0.35,0.48,0.16]);
        ball('trim',[x+s*0.26,16.57,face+side*0.44],[0.19,0.11,0.13]);
        ball('trim',[x-s*0.08,15.91,face+side*0.43],[0.52,0.28,0.14]);
      } else if(near) {
        for(let k=0;k<8;k++) {const t=k*Math.PI/4;ball('trim',[x+0.48*Math.cos(t),16.3+0.48*Math.sin(t),face+side*0.41],[0.19,0.29,0.09]);}
      }
      if(near) {
        // Crown, garland and ribbons, estimated geometry rather than copied sculpture.
        panel('trim',x,18.02,face+side*0.22,0.85,0.13,0.28);
        for(let k=-2;k<=2;k++)bar('trim',[x+k*0.17,18.06,face+side*0.24],[x+k*0.2,18.39-Math.abs(k)*0.05,face+side*0.24],0.09,0.15);
        for(const d of [-1,1])for(let k=0;k<9;k++) {
          const t=k/8*1.6;ball('trim',[x+d*(1.25+0.12*Math.sin(t)),16.95-1.5*t/1.6,face+side*0.24],[0.14,0.17,0.1],8);
        }
        panel('recess',x,14.33,face+side*0.12,1.85,0.3,0.14);
        panel('trim',x,6.8,face+side*0.12,2.0,0.65,0.16);
        for(let k=0;k<4;k++)bar('relief',[x-0.8+k*0.5,6.58,face+side*0.25],[x-0.4+k*0.5,7.01,face+side*0.25],0.08,0.09);
      }
    }
    // Horizontal inscription plaque and allegorical reclining figures at its ends.
    panel('relief',0,20.55,face+side*0.13,14.8,1.75,0.2);
    frame(0,20.55,face+side*0.26,14.8,1.75);
    for(const s of [-1,1]) {
      panel('recess',s*10.12,20.5,face+side*0.14,3.72,1.8,0.19);
      ball('trim',[s*9.62,20.53,face+side*0.35],[0.37,0.5,0.12]);
      ball('trim',[s*9.58,21.13,face+side*0.35],[0.22,0.24,0.12]);
      bar('trim',[s*9.8,20.48,face+side*0.35],[s*11.48,19.94,face+side*0.35],0.27,0.21);
      bar('trim',[s*9.4,20.45,face+side*0.35],[s*8.65,20.87,face+side*0.35],0.16,0.17);
      if(near) {
        ball('trim',[s*10.6,20.1,face+side*0.36],[0.7,0.23,0.13]);
        for(let k=0;k<5;k++)bar('relief',[s*(9.9+k*0.2),20.22,face+side*0.49],[s*(10.3+k*0.2),19.99,face+side*0.49],0.045,0.05);
      }
      if(near)for(let k=0;k<7;k++)bar('relief',[s*9.9,20.7,face+side*0.3],[s*(10.15+k*0.2),21.23-k*0.09,face+side*0.3],0.09,0.12);
    }
    if(near) {
      // Broken shallow strokes convey carved inscription density without invented letters.
      for(let row=0;row<5;row++)for(let k=0;k<46;k++)if((k+row)%7!==0)
        panel('recess',-6.9+k*0.3,21.12-row*0.26,face+side*0.25,0.16,0.065,0.065);
      for(let k=0;k<36;k++)panel('trim',-12.1+k*0.69,22.0,side*4.91,0.32,0.3,0.27);
      // Subtle staggered masonry joints, confined to the exposed flat pier faces.
      for(const s of [-1,1])for(let y=4.8;y<18.5;y+=0.72) {
        if((y>6.3&&y<7.7)||(y>13.9&&y<18.5))continue;
        panel('joint',s*8.65,y,face+side*0.065,4.9,0.028,0.05);
        for(let k=0;k<3;k++)panel('joint',s*8.65-1.75+k*1.75+((Math.round(y*100)%2)?0.5:0),y+0.35,face+side*0.065,0.025,0.65,0.05);
      }
    }
  }
  if(near) {
    // Vault coffer frames lie on the curved intrados, spanning the full tunnel depth.
    // Their centres are outside the opening surface and their shallow fronts project into it.
    for(let i=0;i<16;i++) {
      const t=(i+0.5)*Math.PI/16, rr=r+0.035;
      for(const z of [-2.75,0,2.75]) {
        const g=new THREE.BoxGeometry(0.63,0.1,2.18);g.rotateZ(t-Math.PI/2);
        g.translate(rr*Math.cos(t),spring+rr*Math.sin(t),z);put(g,'relief');
        const h=new THREE.BoxGeometry(0.43,0.09,1.77);h.rotateZ(t-Math.PI/2);
        h.translate((rr-0.06)*Math.cos(t),spring+(rr-0.06)*Math.sin(t),z);put(h,'lamp');
      }
    }
    // Side elevations: horizontal masonry and the framed Ferdinand inscription panels.
    for(const s of [-1,1]) {
      box('relief',[s*12.47,16.0,0],[0.18,4.1,5.6]);
      for(const y of [13.88,18.12])box('trim',[s*12.57,y,0],[0.25,0.17,5.85]);
      for(const z of [-2.85,2.85])box('trim',[s*12.57,16,z],[0.25,4.24,0.17]);
      for(let y=4.5;y<19;y+=0.72)if(y<13.8||y>18.4)box('joint',[s*12.44,y,0],[0.05,0.025,8.52]);
      for(let k=0;k<11;k++)box('trim',[s*12.85,22, -4.1+k*0.8],[0.25,0.3,0.33]);
      for(const z of [-2.7,2.7])box('recess',[s*12.46,1.98,z],[0.17,1.3,0.82]);
    }
  }
  // Small Romanian tricolour, original folded geometry. Stone crown remains 25.50 m.
  const pole=new THREE.CylinderGeometry(0.035,0.045,1.5,near?8:5);pole.translate(0,26.25,0);put(pole,'iron');
  for(let k=0;k<3;k++) {
    const verts=[],idx=[];
    const steps=near?5:2;
    for(let i=0;i<=steps;i++) { const x=0.05+k*0.32+i*0.32/steps;const z=0.1*Math.sin(x*5);verts.push(x,26.82-0.12*x,z,x,26.12-0.12*x,z);if(i){const q=(i-1)*2;idx.push(q,q+1,q+2,q+1,q+3,q+2,q+2,q+1,q,q+2,q+3,q+1);}}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.setIndex(idx);const cloth=g.toNonIndexed();cloth.computeVertexNormals();put(cloth,['blue','yellow','red'][k]);
  }
  return b.finish();
}
