import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { makeKit } from './catedral-metropolitana-de-medellin-kit.js';

// u along the 121.35° facade, w toward Parque Bolívar; yaw baked once at finish.
export function create({detail='near'}={}) {
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),K=makeKit(b,near);
  const {box,wall,window,frame,patch,gable,hip,disc,cross,polygon}=K;
  const h=(c,b,r,s)=>({c,b,r,s});
  const front=48.4,centers=[-13.45,13.45];
  // Front portals: three recessed copper-clad dark doors, heavy archivolts, choir lancets.
  const main=[h(0,0.8,4.9,6.5),...[-4.8,0,4.8].map(c=>h(c,21.2,1.28,28.3))];
  wall('S',front,-7.35,7.35,0,31.7,main);
  for(const q of main)window('S',front,q.c,q.b,q.r,q.s,{back:q.b>1});
  patch('S',front-.8,0,.8,4.9,6.5,'door');
  for(let i=0;i<3;i++)frame('S',front+.2+i*.19,0,.8,4.92+i*.48,6.5,.34,i===1?'recess':'trim',.28);
  box('trim',-5.1,5.1,6.1,6.5,front-.1,front+.45);
  for(const x of [-7.0,7.0])box('trim',x-.48,x+.48,0,31.8,front-.3,front+.48);
  for(const x of [-1.65,1.65])box('trim',x-.24,x+.24,.8,6.4,front-.4,front+.35);
  gable('brick',-7.35,7.35,46.7,front,31.6,36.45);
  for(const side of [-1,1])b.bar('trim',[0,36.52,front+.12],[side*7.5,31.62,front+.12],.34,.35);
  disc('S',front+.08,0,32.9,1.35,'recess');disc('S',front+.26,0,32.9,1.02,'glass');
  const clock=new THREE.RingGeometry(1.02,1.31,near?32:16);clock.translate(0,32.9,front+.33);b.put(clock,'trim');
  if(near){for(let i=0;i<12;i++){const a=i*Math.PI/6; b.bar('trim',[.84*Math.sin(a),32.9+.84*Math.cos(a),front+.37],[.98*Math.sin(a),32.9+.98*Math.cos(a),front+.37],.07,.06);} b.bar('trim',[0,32.9,front+.39],[.1,33.6,front+.39],.08,.07); b.bar('trim',[0,32.9,front+.39],[.58,32.75,front+.39],.07,.06);}
  for(const c of centers) {
    const x0=c-5.95,x1=c+5.95,z0=36.45,z1=front;
    const openings=[h(c,.8,2.3,5.9),h(c-2.25,21,1.05,28),h(c+2.25,21,1.05,28)];
    wall('S',z1,x0,x1,0,33.2,openings);
    for(const q of openings)window('S',z1,q.c,q.b,q.r,q.s,{back:q.b>1});
    patch('S',z1-.8,c,.8,2.3,5.9,'door');
    if(near)for(const u of [c-2.25,c+2.25]){box('trim',u-.1,u+.1,21,28.5,z1-.2,z1+.23);for(const du of [-.53,.53])frame('S',z1+.23,u+du,21,.40,27.9,.14);}frame('S',z1+.35,c,.8,2.65,5.9,.33,'trim');
    box('trim',c-2.4,c+2.4,5.65,6,z1-.1,z1+.48);
    for(const face of ['E','W']){
      const plane=face==='E'?x1:x0;
      const holes=[h(40.5,21,1.05,28),h(44.6,21,1.05,28)];wall(face,plane,z0,z1,0,33.2,holes);
      for(const q of holes)window(face,plane,q.c,q.b,q.r,q.s);
    }
    wall('N',z0,x0,x1,0,33.2);
    // Continuous cornice belts with tightly spaced corbels, four corner buttresses.
    for(const y of [16.6,32.7,37.5,47.4]) {
      box('trim',x0-.2,x1+.2,y,y+.48,z0-.2,z1+.2);
      if(near)for(let x=x0+.35;x<x1;x+=.73)for(const z of [z0-.28,z1+.28])box('recess',x-.13,x+.13,y-.32,y+.04,z-.2,z+.2);
    }
    for(const x of [x0+.2,x1-.2])for(const z of [z0+.2,z1-.2])box('trim',x-.48,x+.48,0,33.1,z-.48,z+.48);
    // Small blind arcade below the bell stage (retained as dark arch rhythm in far).
    for(const [face,plane] of [['S',z1],['N',z0],['E',x1],['W',x0]]) {
      const span=face==='S'||face==='N'?[x0,x1]:[z0,z1],sign=face==='N'||face==='W'?-1:1;
      for(let i=0;i<5;i++){
        const u=span[0]+1.45+i*2.16;
          patch(face,plane+sign*.08,u,34.1,.68,35.7,'recess');
        if(near)frame(face,plane+sign*.23,u,34.1,.68,35.7,.2);
      }
      wall(face,plane,span[0],span[1],33.1,38);
      const holes=[h((span[0]+span[1])/2-2.55,38.8,1.62,44.55),h((span[0]+span[1])/2+2.55,38.8,1.62,44.55)];
      wall(face,plane,span[0],span[1],38,47.8,holes);
      for(const q of holes) {
        window(face,plane,q.c,q.b,q.r,q.s,{back:false});
        // Twin smaller arches within each bell opening, plus central stone mullion.
        if(near){for(const du of [-.8,.8])frame(face,plane+sign*.18,q.c+du,39,.66,44.3,.16,'trim',.26);}
        if(face==='S'||face==='N')box('trim',q.c-.12,q.c+.12,38.7,44.5,plane-.18,plane+.18);
        else box('trim',plane-.18,plane+.18,38.7,44.5,q.c-.12,q.c+.12);
      }
    }
    box('recess',x0+.4,x1-.4,37.75,38.05,z0+.4,z1-.4); // dark internal belfry floor
    box('trim',x0-.1,x1+.1,47.85,48.35,z0-.1,z1+.1);
    hip('copper',x0-.05,x1+.05,z0-.05,z1+.05,48.30,50.4);cross(c,(z0+z1)/2,50.4,53.2);
    if(near)for(const x of [x0+.35,x1-.35])for(const z of [z0+.35,z1-.35]){box('trim',x-.25,x+.25,48.15,48.8,z-.25,z+.25);hip('copper',x-.36,x+.36,z-.36,z+.36,48.75,49.2);}
  }
  // Low shoulders at each outer edge of the front, entirely inside the mapped narthex.
  for(const s of [-1,1]) {
    const x0=s<0?-26.0:19.6,x1=s<0?-19.6:26;
    box('brick',x0,x1,0,16.6,43.5,front);
    hip('roof',x0,x1,43.5,front,16.55,18.4);
    box('trim',x0,x1,16.15,16.8,43.45,front+.13);
    patch('S',front+.09,(x0+x1)/2,7.9,.5,12.9);frame('S',front+.2,(x0+x1)/2,7.9,.5,12.9);
  }
  box('stone',-26.7,26.7,0,.2,48.45,48.95);
  box('stone',-26.5,26.5,.17,.4,48.3,48.75);
  // Nave: walls pierced by the eight clerestory windows on each side.
  const stations=Array.from({length:8},(_,i)=>33.4-i*4.8);
  for(const face of ['E','W']) {
    const plane=face==='E'?7.25:-7.25,holes=stations.map(c=>h(c,22.1,.91,28.4));
    wall(face,plane,-39.6,46.8,0,31.4,holes);
    for(const q of holes)window(face,plane,q.c,q.b,q.r,q.s);
  }
  gable('roof',-7.5,7.5,-39.6,46.7,31.3,35.8);
  box('roof',-.16,.16,35.7,36,-39.5,46.7);
  // Aisles with eight narrow arched windows and alternating buttresses.
  for(const s of [-1,1]) {
    const face=s<0?'W':'E',plane=s<0?-20.8:20.5;
    const holes=stations.map(c=>h(c,5.4,1.0,12.4));wall(face,plane,-4.5,39.5,0,17.1,holes);
    for(const q of holes)window(face,plane,q.c,q.b,q.r,q.s);
    box('brick',s<0?-20.8:7.25,s<0?-7.25:20.5,0,17,36.1,39.5);
    box('brick',s<0?-20.8:7.25,s<0?-7.25:20.5,0,17,-4.5,-3.0);
    const inner=s*7.2,outer=plane+s*.15;
    polygon('roof',[[[inner,24.5,36.1],[outer,17,36.1],[outer,17,-4.5],[inner,24.5,-4.5]],[[inner,24.5,36.1],[inner,24.3,36.1],[outer,16.8,36.1],[outer,17,36.1]],[[outer,17,-4.5],[outer,16.8,-4.5],[inner,24.3,-4.5],[inner,24.5,-4.5]],[[outer,16.8,-4.5],[outer,16.8,36.1],[inner,24.3,36.1],[inner,24.3,-4.5]]],[s*13,16,16]);
    for(const z of stations.map(v=>v+2.2)){
      box('trim',plane-.38,plane+.38,0,16.9,z-.42,z+.42);
      if(near)hip('roof',plane-.46,plane+.46,z-.55,z+.55,16.8,17.45);
    }
    box('trim',plane-.2,plane+.2,16.5,17.2,-4.45,36.4);
  }
  // Transverse nave, crossing lantern and its gable roof; not a dome.
  box('brick',-29.35,34.1,0,27,-21.9,-6.5);
  box('brick',-20.8,34.1,0,27,-6.5,-2.3);
  // Gabled roof along u: turn an ordinary nave gable through 90°.
  const roofKit=makeKit({ ...b, put:(g,mat)=>{g.rotateY(Math.PI/2);g.translate(2.4,0,-14.2);b.put(g,mat);} },near);
  roofKit.gable('roof',-7.6,7.6,-31.6,31.6,26.9,32.1);
  for(const face of ['E','W']) {
    const plane=face==='E'?34.1:-29.35;
    for(const z of [-18.5,-14.2,-9.9]){patch(face,plane+(face==='E'?.09:-.09),z,15.5,1.15,24.1);frame(face,plane+(face==='E'?.2:-.2),z,15.5,1.15,24.1);}
    patch(face,plane+(face==='E'?.09:-.09),-14.2,.8,1.7,6,'door');frame(face,plane+(face==='E'?.2:-.2),-14.2,.8,1.7,6);
    const sign=face==='E'?1:-1;
    for(const z of [-21.3,-7.05])box('trim',plane-.4,plane+.4,0,27.1,z-.48,z+.48);
    box('trim',plane-.16,plane+.16,26.5,27.1,-21.5,-6.6);
  }
  box('brick',-7.2,7.2,27,37,-21.2,-7.2);
  for(const [face,plane] of [['S',-7.2],['N',-21.2],['E',7.2],['W',-7.2]]) {
    for(const c of (face==='S'||face==='N'?[-4.5,0,4.5]:[-18.7,-14.2,-9.7])){const s=face==='N'||face==='W'?-1:1;patch(face,plane+s*.09,c,32.2,.8,35.15);frame(face,plane+s*.2,c,32.2,.8,35.15);}
  }
  box('trim',-7.35,7.35,36.6,37.2,-21.35,-7.05);
  gable('roof',-7.45,7.45,-21.4,-7,37.1,41.8);cross(0,-14.2,41.8,44.1,'trim');
  // Rear lower rooms follow the full mapped envelope and support the three apses.
  box('brick',-29.3,30.9,0,11.8,-48.7,-22);
  for(const [a,c] of [[-29.3,-8],[8,30.9]])gable('roof',a,c,-48.7,-22,11.7,15.2);
  for(const face of ['N','E','W']) {
    const plane=face==='N'?-48.7:face==='E'?30.9:-29.3;
    const values=face==='N'?[-25,-20,-15,-10,10,15,20,25]:[-44.5,-38.5,-32.5,-26.5];
    for(const c of values){const s=face==='N'||face==='W'?-1:1;patch(face,plane+s*.09,c,4.8,.8,8.7);frame(face,plane+s*.2,c,4.8,.8,8.7);}
  }
  // Semicircular brick apse at the nave's end; exposed upper wall above the low rooms.
  for(const [x,r,top] of [[0,7.25,28.5],[-13.7,4.2,19],[13.7,4.2,19]]) {
    const z=-40.7,seg=near?24:12;
    const drum=new THREE.CylinderGeometry(r,r,top-11.7,seg,1,true,Math.PI/2,Math.PI);drum.translate(x,(top+11.7)/2,z);b.put(drum,'brick');
    const cap=new THREE.ConeGeometry(r+.12,4.5,seg,1,false,Math.PI/2,Math.PI);cap.translate(x,top+2.25,z);b.put(cap,'roof');
    for(let i=1;i<6;i++) {
      const a=Math.PI/2+i*Math.PI/6,u=x+r*Math.sin(a),v=z+r*Math.cos(a);
      // Pilasters around the apse: embedded, not suspended trim.
      b.box('trim',[u,(top+11.8)/2,v],[.45,top-11.8,.45]);
    }
  }
  if(near) {
    // Brick corbel rhythm and shallow course lines, rather than a photograph texture.
    for(const s of [-1,1]) {
      for(let z=-38.5;z<35;z+=1.25)box('recess',s*7.25-.15,s*7.25+.15,30.4,31.1,z-.2,z+.2);
      for(let y=1.6;y<16;y+=1.15)box('recess',s*20.65-.17,s*20.65+.17,y,y+.055,-3.8,35.9);
    }
    for(const c of centers)for(let y=2;y<32;y+=.9)for(const side of [-1,1])box('recess',c+side*5.5-.4,c+side*5.5+.4,y,y+.05,front-.02,front+.09);
    for(let y=1.2;y<16;y+=.65)for(const c of centers)for(const s of [-1,1])box('recess',c+s*4.8-.7,c+s*4.8+.7,y,y+.035,front-.05,front+.075);
    // Brick dentils beneath the choir cornice and outer shoulder eaves.
    for(let x=-26;x<26;x+=.8)box('recess',x-.13,x+.13,16.35,16.7,front-.08,front+.19);
  }
  const root=b.finish();const angle=SPEC.rotationDeg*Math.PI/180;
  root.traverse(o=>{if(!o.isMesh)return;const g=o.geometry,p=g.attributes.position,n=g.attributes.normal,idx=g.index,keep=[];
    for(let i=0;i<idx.count;i+=3){const a=idx.getX(i),c=idx.getX(i+1),d=idx.getX(i+2);if(n.getY(a)<-.9&&[a,c,d].every(j=>p.getY(j)<.015))continue;keep.push(a,c,d);}g.setIndex(keep);g.rotateY(angle);o.geometry=mergeVertices(g,1e-4);g.dispose();o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();});
  root.userData.triangles=root.children.reduce((n,m)=>n+m.geometry.index.count/3,0);
  return root;
}
