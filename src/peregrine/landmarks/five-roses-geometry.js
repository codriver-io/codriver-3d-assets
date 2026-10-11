import * as THREE from 'three';
import { assetBuilder } from './asset-geometry.js';
import { FIVE_ROSES, FIVE_ROSES_SILOS, FIVE_ROSES_COLORS, fiveRosesPoint as p } from './five-roses-config.js';

// Original block-capital outlines, including open counters; no font/texture
// dependencies. Coordinates are fractions of letter width and height.
const GLYPHS = {
  F: [[[0,0],[.22,0],[.22,.43],[.82,.43],[.82,.61],[.22,.61],[.22,.82],[1,.82],[1,1],[0,1]]],
  E: [[[0,0],[1,0],[1,.18],[.22,.18],[.22,.43],[.82,.43],[.82,.61],[.22,.61],[.22,.82],[1,.82],[1,1],[0,1]]],
  I: [[[0,0],[1,0],[1,1],[0,1]]],
  N: [[[0,0],[.22,0],[.22,.65],[.78,0],[1,0],[1,1],[.78,1],[.78,.35],[.22,1],[0,1]]],
  V: [[[0,1],[.23,1],[.5,.23],[.77,1],[1,1],[.65,0],[.35,0]]],
  A: [[[0,0],[.23,0],[.31,.27],[.69,.27],[.77,0],[1,0],[.66,1],[.34,1]],[[.37,.45],[.5,.83],[.63,.45]]],
  O: [[[.16,0],[.84,0],[1,.13],[1,.87],[.84,1],[.16,1],[0,.87],[0,.13]],[[.23,.18],[.23,.82],[.77,.82],[.77,.18]]],
  R: [[[0,0],[.22,0],[.22,.4],[.48,.4],[.77,0],[1,0],[.69,.43],[.94,.55],[1,.69],[1,.86],[.85,1],[0,1]],[[.22,.6],[.22,.82],[.72,.82],[.78,.76],[.78,.67],[.72,.6]]],
  S: [[[0,.12],[.15,0],[.85,0],[1,.14],[1,.45],[.84,.56],[.22,.76],[.22,.83],[.78,.83],[.78,.7],[1,.7],[1,.88],[.84,1],[.16,1],[0,.86],[0,.58],[.16,.47],[.78,.27],[.78,.18],[.22,.18],[.22,.31],[0,.31]]],
};
// BoxGeometry face order: +x,-x,+y,-y,+z,-z. A solid keeps only the faces somebody can see.
const NX=1,NY=3,PZ=4,NZ=5;
function solid(w,h,d,skip=[]) {
  const src=new THREE.BoxGeometry(w,h,d),pos=src.attributes.position,nor=src.attributes.normal,P=[],N=[],I=[];
  let n=0;
  for(let f=0;f<6;f++) {
    if(skip.includes(f))continue;
    for(let v=f*4;v<f*4+4;v++){P.push(pos.getX(v),pos.getY(v),pos.getZ(v));N.push(nor.getX(v),nor.getY(v),nor.getZ(v));}
    for(let i=f*6;i<f*6+6;i++)I.push(src.index.getX(i)-f*4+n);
    n+=4;
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(N,3));g.setIndex(I);
  src.dispose();return g;
}
// Upright bin with its roof but no floor: the ground face is never seen.
function bin(radius,height,segments) {
  const P=[0,height,0],N=[0,1,0],I=[];
  for(let i=0;i<=segments;i++) {
    const a=i/segments*Math.PI*2,x=Math.sin(a),z=Math.cos(a);
    P.push(x*radius,0,z*radius,x*radius,height,z*radius,x*radius,height,z*radius);N.push(x,0,z,x,0,z,0,1,0);
  }
  for(let i=0;i<segments;i++) {
    const b0=1+i*3,b1=b0+3;I.push(b0,b1,b1+1,b0,b1+1,b0+1,0,b0+2,b1+2);
  }
  return new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(P,3)).setAttribute('normal',new THREE.Float32BufferAttribute(N,3)).setIndex(I);
}
const names = { stone:'brick', concrete:'silo', iron:'trim', steel:'frame', glass:'window', roof:'roof', paint:'white', museum:'red', rail:'neon' };
export function createFiveRoses({detail='near'}={}) {
  const b=assetBuilder(FIVE_ROSES,detail), near=detail==='near';
  const box=(mat,u,y,v,w,h,d,skip=[])=>{const g=solid(w,h,d,skip);g.rotateY(-FIVE_ROSES.angle);g.translate(...p(u,y,v));b.put(g,mat,0,0);};
  const bar=(mat,a,c,w=.13)=>b.bar(mat,p(...a),p(...c),w,w,0,false,0);
  // No floor on the ground and none under the roof slab; `skip` also drops a face buried against a taller neighbour.
  function block(u0,u1,v0,v1,h,mat='stone',skip=[]) {
    box(mat,(u0+u1)/2,h/2,(v0+v1)/2,u1-u0,h,v1-v0,[NY,...skip]);
    box('roof',(u0+u1)/2,h+.16,(v0+v1)/2,u1-u0,.32,v1-v0,[NY,...skip]);
  }
  block(35.7,68.3,-57.4,29.4,39);
  block(35.9,58.1,-90.2,-57.4,18,'stone',[PZ]); // its south face abuts the mill
  block(-5.7,57.9,-151.3,-90.2,13);
  block(-4.8,17.8,29,73.8,9);
  block(-3.3,22.4,73.8,80.3,7);
  // Ten-storey brick mill: vertical recessed window strips and projecting bays.
  const bays=[-54,-9,25],inBay=(v,half)=>bays.some(bv=>Math.abs(v-bv)<1.55+half);
  for (const u of [35.64,68.36]) {
    const inner=u<50?0:NX; // the face looking into the mill is buried in its wall
    for (let v=-54;v<28;v+=4.4) {
      if(!inBay(v,.25))box('stone',u,19.5,v, .3,39,.5);
      if(inBay(v+1.9,.64))continue; // a window inside a projecting bay would be embedded in it
      if (near) for(let floor=0;floor<9;floor++) {
        box('iron',u,2+floor*3.8,v+1.9,.15,2.8,1.28,[inner]);
        box('glass',u+(u<50?-.2:.2),2+floor*3.8,v+1.9,.12,2.5,1.03);
      } else box('glass',u+(u<50?-.2:.2),17.4,v+1.9,.12,33.2,1.05);
      box('iron',u,37.4,v+1.9,.15,1.3,1.1,[inner]);
    }
    box('iron',u,35.8,-14,.26,.22,86.8);
    for(const v of [-54,-9,25])box('stone',u,21,v,1.4,42,3.1);
  }
  // The north end wall is covered by the 18 m annex up to its roof, so its glazing starts above it.
  for(const v of [-57.48,29.48])for(let u=39;u<67;u+=4.4){
    const lo=v<0?18.4:2,back=v<0?PZ:NZ;
    box('glass',u,(lo+34)/2,v,1.2,34-lo,.16,[back]);
    if(near)for(let y=3;y<35;y+=3.8)if(y>lo)box('iron',u,y,v,1.25,.18,.22,[back]);
  }
  // Rooftop ends flank the open sign frames.
  block(36,68,-57,-49,43);block(36,68,21,29,42);
  block(38,48,8,26,47,'concrete');
  for(const y of [8,17,26,35,44])box('glass',37.94,y,17,.15,1.9,y===44?12:2);
  // Two banks of 6 x 3 mapped cylindrical bins, retaining scalloped outlines
  // and the road gap. Far still retains all cylinders and open galleries.
  for(const u of FIVE_ROSES_SILOS)for(const v of [11.1,18.1,25.1]) {
    const g=bin(3.5,29.8,near?20:10);
    g.translate(...p(u,0,v));b.put(g,'concrete',0,0);
    if(near){const rim=new THREE.CylinderGeometry(3.55,3.55,.3,20);rim.translate(...p(u,29.7,v));b.put(rim,'iron',0,0);}
  }
  for(const [a,c] of [[-59.5,-18],[-6.5,35]]) {
    box('roof',(a+c)/2,30.15,18.1,c-a,.6,21,[NY]);
    box('iron',(a+c)/2,31.6,18.1,c-a,2.3,4);
    if(near)for(let u=a+1;u<c;u+=3)box('glass',u,31.7,20.13,1.4,.7,.1);
  }
  box('iron',-12.25,31.6,18.1,11.5,2.3,4); // elevated conveyor, rue Mill stays open
  for(const v of [16,20])bar('steel',[-18,30.3,v],[-6.5,30.3,v],.35);
  // Rear lightweight conveyor, no continuous ground plinth.
  box('iron',74.8,11,-70,3.8,2.5,163);
  for(let v=-148;v<10;v+=25)for(const u of [73.5,76.1])bar('steel',[u,0,v],[u,10,v],.25);
  box('iron',71.5,11,10,10.3,2.5,3.5);
  // Paired freestanding scaffold signs along the mill's long ESE/ WNW faces.
  function sign(face) {
    const u=52+face*1.6, back=52-face*1.6, centerV=-17;
    if(face>0) for (const su of [u,back]) {
      for(let v=centerV-16;v<=centerV+16;v+=4){
        const top=Math.abs(v-centerV)<=12?57.4:51.6;
        bar('steel',[su,39.3,v],[su,top,v],.16);
        for(let y=39;v<centerV+16 && y+4<=Math.min(top,Math.abs(v+4-centerV)<=12?57.4:51.6);y+=4){bar('steel',[su,y,v],[su,y+4,v+4],near?.1:.14);}
      }
      for(const [y,w] of [[42,32],[46,32],[51.4,32],[52.7,24],[57.4,24]])bar('steel',[su,y,centerV-w/2],[su,y,centerV+w/2],.17);
    }
    if(face>0) for(let v=centerV-16;v<=centerV+16;v+=4)for(const y of [39,46,51.4])bar('steel',[u,y,v],[back,y,v],.15);
    // Each face is independently authored left-to-right to avoid mirrored text.
    function line(text,y) {
      const widths=[...text].map(ch=>ch===' '?1.7:ch==='I'?.72:2.52), gap=.54;
      const length=widths.reduce((a,c)=>a+c,0)+gap*(text.length-1);let cursor=-length/2;
      [...text].forEach((ch,i)=>{
        const w=widths[i];if(ch!==' '){
          const rings=GLYPHS[ch],shape=new THREE.Shape(rings[0].map(([x,y])=>new THREE.Vector2(x*w,y*FIVE_ROSES.letterHeight)));
          for(const hole of rings.slice(1))shape.holes.push(new THREE.Path(hole.map(([x,y])=>new THREE.Vector2(x*w,y*FIVE_ROSES.letterHeight))));
          const g=new THREE.ExtrudeGeometry(shape,{depth:.13,bevelEnabled:false,curveSegments:1});
          const pos=g.attributes.position;
          for(let k=0;k<pos.count;k++)pos.setXYZ(k,...p(u+face*(.25+pos.getZ(k)),y+pos.getY(k),centerV-face*(cursor+pos.getX(k))));
          g.computeVertexNormals();b.put(g,'steel',0,0);
          const front=new THREE.ShapeGeometry(shape),fp=front.attributes.position;
          for(let k=0;k<fp.count;k++)fp.setXYZ(k,...p(u+face*.5,y+fp.getY(k),centerV-face*(cursor+fp.getX(k))));
          front.computeVertexNormals();b.put(front,'museum',0,0);
          // 20 cm pale face edging separates the letters from the scaffold.
          // Single-sided bands leave the opposite sign's rear dark; white
          // boxes here create a second, mirrored outline through every gap.
          for(const ring of rings){
            const points=ring.map(([x,y])=>new THREE.Vector2(x*w,y*FIVE_ROSES.letterHeight));
            const offsets=points.map((a,k)=>{
              const incoming=a.clone().sub(points[(k+points.length-1)%points.length]).normalize(),outgoing=points[(k+1)%points.length].clone().sub(a).normalize();
              return new THREE.Vector2(-incoming.y-outgoing.y,incoming.x+outgoing.x).multiplyScalar(.1/(1+incoming.dot(outgoing)));
            });
            for(let k=0;k<points.length;k++){
              const j=(k+1)%points.length,a=points[k],c=points[j];
              const rim=new THREE.ShapeGeometry(new THREE.Shape([a.clone().add(offsets[k]),a.clone().sub(offsets[k]),c.clone().sub(offsets[j]),c.clone().add(offsets[j])])),rp=rim.attributes.position;
              for(let n=0;n<rp.count;n++)rp.setXYZ(n,...p(u+face*.56,y+rp.getY(n),centerV-face*(cursor+rp.getX(n))));
              rim.computeVertexNormals();b.put(rim,'paint',0,0);
            }
          }
        }cursor+=w+gap;
      });
    }
    line('FIVE ROSES',46);line('FARINE',52.7);
  }
  sign(1);sign(-1);
  if(near)for(let v=-45;v<15;v+=12){box('roof',52,40,v,3,2,3,[NY]);bar('iron',[54,39.3,v],[54,43,v],.4);}
  const root=b.finish();
  root.traverse(o=>{if(!o.isMesh)return;o.geometry.deleteAttribute('bridgeLift');const key=names[o.material.name];o.material.name=`five-roses:${key}`;o.material.color.set(FIVE_ROSES_COLORS.light[key]);if(key==='red'){o.material.emissive.set('#bd160e');o.material.emissiveIntensity=.08;}});
  root.userData.signFaces=['ESE (96.88°)','WNW (276.88°)'];return root;
}
