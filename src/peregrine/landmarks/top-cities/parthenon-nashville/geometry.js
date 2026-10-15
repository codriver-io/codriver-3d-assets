import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';

// Temple plan: +x northeast entrance, +z southeast flank. Rotation baked once.
const up = new THREE.Vector3(0, 1, 0);
export const plan = (x, y, z) => new THREE.Vector3(x, y, z).applyAxisAngle(up, SPEC.rotation).toArray();
export const PERISTYLE = [
  ...[-33.55, 33.55].flatMap(x => Array.from({ length: 8 }, (_, i) => [x, -14.18 + i * 28.36 / 7])),
  ...[-14.18, 14.18].flatMap(z => Array.from({ length: 15 }, (_, i) => [-33.55 + (i + 1) * 67.1 / 16, z])),
];
export const COLUMN_TOP = SPEC.platformY + SPEC.columnHeight;

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const put = (g, mat = 'aggregate') => { g.rotateY(SPEC.rotation); b.put(g, mat); };
  const faces = ['east', 'west', 'top', 'bottom', 'south', 'north'];
  function box(x, y, z, w, h, d, mat = 'aggregate', omit = []) {
    const g = new THREE.BoxGeometry(w, h, d);
    g.setIndex([...g.index.array].filter((_, i) => !omit.includes(faces[Math.floor(i / 6)])));
    g.translate(x, y, z); put(g, mat);
  }
  function member(a, c, width, depth = width) {
    const av = new THREE.Vector3(...a), cv = new THREE.Vector3(...c), dir = cv.clone().sub(av);
    const g = new THREE.BoxGeometry(width, dir.length(), depth);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(up, dir.normalize()));
    g.translate(...av.add(cv).multiplyScalar(.5).toArray()); put(g);
  }
  function lathe(x, z, profile, n = near ? 10 : 6) {
    const g = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), n);
    g.translate(x, 0, z); put(g);
  }
  // Three integral steps, matched to the published lower and upper dimensions.
  for (const [w,d,y0,y1] of [[72.5424,33.8328,0,.6],[71.0184,32.3088,.6,1.2],[69.4944,30.7848,1.2,1.8]])
    box(0,(y0+y1)/2,0,w,y1-y0,d,'aggregate',['bottom']);

  function column(x,z,r=.9144,top=COLUMN_TOP) {
    const foot=SPEC.platformY, neck=top-.66;
    // Split normals at each of the twelve flute ridges, smooth along their height.
    const n=near?36:9, levels=near?2:1, p=[], idx=[];
    const stride=near?n:n+1;
    for(let j=0;j<=levels;j++) {
      const t=j/levels, radius=r*(1-.19*t+.055*Math.sin(Math.PI*t));
      for(let i=0;i<stride;i++) {
        const angle=near?2*Math.PI*(Math.floor(i/3)+(i%3)/2)/12:2*Math.PI*i/n;
        const radiusAt=radius-(near && i%3===1?.095:0);
        p.push(x+radiusAt*Math.cos(angle),foot+(neck-foot)*t,z+radiusAt*Math.sin(angle));
        if(j && i && (!near || i%3!==0)) {
          const v=(j-1)*stride+i-1,w=j*stride+i-1;idx.push(v,w,v+1,v+1,w,w+1);
        }
      }
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();put(g);
    lathe(x,z,[[r*.81,neck],[r*.85,neck+.13],[r*1.14,top-.25],[r*1.14,top-.20]]);
    box(x,top-.10,z,r*2.34,.20,r*2.34,'aggregate',['bottom']);
    if(near) for(const dy of [.04]) lathe(x,z,[[r*.83,neck+dy],[r*.86,neck+dy+.035]],12);
  }
  for(const [x,z] of PERISTYLE) column(x,z);
  // Six-column pronaos at each end, visible behind the outer colonnade.
  for(const x of [-27.2,27.2]) for(let i=0;i<6;i++) column(x,-9.55+i*19.1/5,.8382,COLUMN_TOP);

  // Cella masonry with cut-out doorways, not dark surfaces on a box.
  for(const z of [-10.20,10.20]) box(0,6.95,z,47.2,10.3,1.0,'aggregate',['bottom']);
  for(const x of [-23.1,23.1]) {
    for(const z of [-6.6,6.6]) box(x,6.95,z,1.0,10.3,8.0,'aggregate',['bottom']);
    box(x,10.76,0,1.0,2.68,5.2,'aggregate',['bottom']);
    // Each pair of bronze leaves is 24ft tall and 14ft wide.
    box(x,5.4576,0,.36,7.3152,4.2672,'bronze');
    if(near) {
      const face=x+Math.sign(x)*.20;
      for(let i=0;i<2;i++) for(let j=0;j<5;j++) {
        const z=(i-.5)*2.13,y=2.52+j*1.43;
        box(face+Math.sign(x)*.035,y,z,.07,1.12,1.77,'bronze');
      }
    }
    box(x,11.95,0,1.25,.4,21.7);
    // Porch lintel supported by the six inner columns.
    box(x>0?27.2:-27.2,12.55,0,1.95,.7736,21.45);
  }

  // Continuous architrave and frieze rings; corner solids partitioned.
  function ring(y0,y1,hx,hz,thick) {
    for(const z of [-hz+thick/2,hz-thick/2]) box(0,(y0+y1)/2,z,2*hx,y1-y0,thick);
    for(const x of [-hx+thick/2,hx-thick/2]) box(x,(y0+y1)/2,0,thick,y1-y0,2*(hz-thick));
  }
  ring(COLUMN_TOP,13.45,34.7,15.32,1.95);
  ring(13.45,13.60,34.8,15.42,2.05);
  ring(13.60,14.95,34.7,15.32,1.95);
  ring(14.95,15.16,34.94,15.56,2.19);
  ring(15.16,15.40,35.12,15.74,2.37);
  // Triglyphs alternate with low human/horse reliefs on the complete Doric frieze.
  const along=Array.from({length:33},(_,i)=>-33.55+i*67.1/32);
  const across=Array.from({length:15},(_,i)=>-14.18+i*28.36/14);
  for(const s of [-1,1]) {
    for(const x of along) for(const dx of near?[-.24,0,.24]:[0]) box(x+dx,14.26,s*15.42,near?.14:.56,1.23,.20);
    for(const z of across) for(const dz of near?[-.24,0,.24]:[0]) box(s*34.80,14.26,z+dz,.20,1.23,near?.14:.56);
    if(near) {
      for(let i=0;i<32;i++) relief((along[i]+along[i+1])/2,s*15.38,'side',i);
      for(let i=0;i<14;i++) relief(s*34.76,(across[i]+across[i+1])/2,'end',i);
    }
  }
  function ellipsoid(x,y,z,sx,sy,sz,mat='aggregate') {
    const metope=y>13.5&&y<15;
    const g=new THREE.SphereGeometry(1,near&&!metope?6:4,near&&!metope?4:3);g.scale(sx,sy,sz);g.translate(x,y,z);put(g,mat);
  }
  function relief(x,z,axis,i) {
    const sign=Math.sign(axis==='side'?z:x);
    const at=(u,y,v)=>axis==='side'?[x+u,y,z+sign*v]:[x+sign*v,y,z+u];
    ellipsoid(...at(-.22,14.57,.07),.12,.13,.12);
    const a=at(-.22,14.42,.06),c=at(.03,14.00,.09);member(a,c,.18,.15);
    for(const [u,y] of [[-.45,14.2],[.37,14.38],[.27,13.78]]) member(c,at(u,y,.10),.10,.12);
    if(i%2===0) ellipsoid(...at(.36,14.16,.04),axis==='side'?.21:.12,.23,axis==='side'?.12:.21);
  }

  // Complete pitched roof. End triangles are separate tympana: no buried competing faces.
  const hx=34.85,hz=15.55,eave=15.40,ridge=18.55;
  const p=[-hx,eave,-hz,hx,eave,-hz,-hx,ridge,0,hx,ridge,0,-hx,eave,hz,hx,eave,hz];
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));
  g.setIndex([0,2,1,1,2,3,2,4,3,3,4,5,0,1,4,1,5,4]);
  const roof=g.toNonIndexed();roof.computeVertexNormals();put(roof);g.dispose();
  for(const s of [-1,1]) {
    const shape=new THREE.Shape([new THREE.Vector2(-hz,eave),new THREE.Vector2(hz,eave),new THREE.Vector2(0,ridge)]);
    const face=new THREE.ShapeGeometry(shape);face.rotateY(s*Math.PI/2);face.translate(s*hx,0,0);put(face,'recess');
    for(const z of [-hz,hz]) member([s*35.12,15.45,z],[s*35.12,18.64,0],.38,.5);
    box(s*35.12,15.52,0,.58,.24,31.7);
    pediment(s);
    // Palmette acroteria: central apex and both eave corners.
    for(const [z,y,scale] of [[0,18.64,1],[-15.5,15.48,.62],[15.5,15.48,.62]]) {
      box(s*35.12,y+.10,z,.45,.20,.55);
      const profile=[[0,y+.17],[.38*scale,y+.47*scale],[.29*scale,y+.79*scale],[.12*scale,y+1.172*scale],[0,y+1.172*scale],[-.12*scale,y+1.172*scale],[-.29*scale,y+.79*scale],[-.38*scale,y+.47*scale]];
      const sh=new THREE.Shape(profile.map(([u,v])=>new THREE.Vector2(u,v)));
      const ac=new THREE.ExtrudeGeometry(sh,{depth:.28,bevelEnabled:false});ac.rotateY(Math.PI/2);ac.translate(s*35.12-.14,0,z);put(ac);
    }
  }
  function pediment(s) {
    // Complete human groups: standing central gods, seated flanks, reclining corners.
    // Original silhouettes, no scan or tracing of the Kinney/Scholz sculptures.
    const figures=[[-12.5,.58,'lie'],[-10.5,.88,'sit'],[-8.7,1.12,'sit'],[-6.7,1.45,'sit'],[-4.7,1.78,'stand'],[-2.65,2.3,'stand'],[-.7,2.55,'stand'],[1.8,2.5,'stand'],[4.0,1.9,'stand'],[6.2,1.55,'sit'],[8.2,1.2,'sit'],[10.4,.85,'sit'],[12.5,.5,'lie']];
    for(let i=0;i<figures.length;i++) {
      const [z,h,pose]=figures[i],x=s*35.05,y=15.64;
      if(pose==='lie') {
        ellipsoid(x,y+h*.33,z,.27,h*.33,.79);
        ellipsoid(x,y+h*.72,z-Math.sign(z)*.70,.18,.18,.18);
        continue;
      }
      const hip=pose==='sit'?.35:.42;
      const hipY=y+h*hip,shoulder=y+h*.77,head=y+h*.90;
      ellipsoid(x,(hipY+shoulder)/2,z,.27,h*.25,.32);
      ellipsoid(x,head,z,.19,h*.10,.19);
      if(pose==='stand') {
        if(i%2===0) {
          // A low polygon draped skirt keeps the pediment reading as classical statuary.
          lathe(x,z,[[.38,y],[.27,hipY],[.23,hipY+.20]],near?6:5);
        } else for(const dz of [-.19,.19]) member([x,hipY,z+dz*.7],[x+s*.08,y,z+dz*1.7],.22,.23);
      }
      else {
        member([x,hipY,z],[x+s*.12,hipY-.08,z+.38],.25,.24);
        member([x+s*.12,hipY-.08,z+.38],[x+s*.15,y,z+.54],.20,.21);
        ellipsoid(x,y+.22,z-.10,.25,.24,.36);
      }
      for(const dz of [-1,1]) {
        const a=[x,shoulder-.08,z+dz*.22],c=[x+s*.15,shoulder-h*.14,z+dz*.48];
        member(a,c,.14,.14);
        member(c,[x+s*.26,shoulder+(i%3===0?.06:-.35)*h,z+dz*(i%2===0?.45:.62)],.12,.12);
      }
      if(near) for(const dz of [-.15,0,.15]) member([x+s*.23,hipY,z+dz],[x+s*.24,y+.08,z+dz*1.9],.045,.06);
    }
    for(const z of [-4.8,4.8]) {
      const x=s*35.18,y=15.64,dir=Math.sign(z);
      ellipsoid(x,y+.82,z,.26,.34,.74);
      for(const dz of [-.48,.48]) member([x,y+.78,z+dz],[x+s*.08,y,z+dz+.10],.13,.14);
      member([x,y+.85,z-dir*.53],[x,y+1.51,z-dir*.73],.30,.31);
      ellipsoid(x,y+1.55,z-dir*.89,.22,.23,.35);
    }
  }
  // Unbroken roof planes avoid subpixel cover-rib moire. Broad ridge and
  // widely spaced eave antefixes retain the roof's construction silhouette.
  box(0,18.59,0,69.7,.20,.42);
  if(near) for(let i=0;i<=44;i++) for(const s of [-1,1]) {
    const x=-34.5+i*69/44;
    lathe(x,s*15.48,[[.10,15.40],[.16,15.64],[.10,15.89],[0,15.98]],5);
  }
  return b.finish();
}
