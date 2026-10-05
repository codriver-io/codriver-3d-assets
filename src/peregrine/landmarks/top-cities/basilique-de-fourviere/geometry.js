import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { FOOTPRINTS, OSM_WAYS } from './footprint.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { chevet } from './basilique-de-fourviere-chevet.js';
import { fourviereKit } from './basilique-de-fourviere-kit.js';

// u runs east along the nave, v south, before the mapped clockwise 7-degree turn.
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const k = fourviereKit(b, detail==='near');
  // Low continuous footing follows the owned main OSM envelope, not a plaza disc.
  const outline=FOOTPRINTS[OSM_WAYS.indexOf(247450124)];
  const a=THREE.MathUtils.degToRad(SPEC.rotationDeg),cos=Math.cos(a),sin=Math.sin(a);
  const ring=outline.map(([lng,lat])=>{const x=(lng-SPEC.origin[0])*111320*Math.cos(SPEC.origin[1]*Math.PI/180),z=-(lat-SPEC.origin[1])*111320;return new THREE.Vector2(x*cos+z*sin,x*sin-z*cos);});
  const footing=new THREE.ExtrudeGeometry(new THREE.Shape(ring),{depth:.55,bevelEnabled:false});footing.rotateX(-Math.PI/2);k.put(footing,'stone');
  nave(k); west(k); chapel(k);
  for (const [u,v] of [[-25.3,-4.5],[-25.3,23],[31.7,-4.3],[31.8,22.7]]) tower(k,u,v);
  const root=b.finish();
  root.traverse(o=>{if(o.isMesh){
    o.geometry.rotateY(-THREE.MathUtils.degToRad(SPEC.rotationDeg));
    const g=o.geometry,p=g.attributes.position,n=g.attributes.normal,ix=g.index,keep=[];
    for(let i=0;i<ix.count;i+=3){const a=ix.getX(i),c=ix.getX(i+1),d=ix.getX(i+2);
      if(n.getY(a)<-.9 && p.getY(a)<.01 && p.getY(c)<.01 && p.getY(d)<.01)continue;
      keep.push(a,c,d);
    }g.setIndex(keep);const welded=mergeVertices(g,1e-4);o.geometry=welded;g.dispose();welded.computeBoundingBox();welded.computeBoundingSphere();
  }});
  root.userData.triangles=root.children.reduce((n,o)=>n+o.geometry.index.count/3,0);
  return root;
}

function nave(k) {
  const {box,roof,window,lathe,near,bar}=k;
  box('stone',[3.7,14.9,9.3],[52.8,29.8,19.4]);
  roof('roof',-23.1,29.9,-.6,19.2,29.65,35.1);
  box('metal',[3.4,35.12,9.3],[52.9,.2,.25]);
  chevet(k);
  for(const s of [-1,1]) {
    const v=s<0?-.4:19;
    box('trim',[3.4,29.4,v],[52.7,.75,.85]);
    box('trim',[3.4,8.1,v],[52.7,.65,.6]);
    for(let i=0;i<6;i++) {
      const u=-18.4+i*8.25;
      box('trim',[u-3.4,14.7,v+s*.25],[1.25,29.3,1.05]);
      box('trim',[u-3.4,26.7,v+s*.5],[1.65,1.3,1.3]);
      for(const d of [-1.25,1.25])window(s>0?'S':'N',v,u+d,15.5,1.65,10.1,'glow');
      window(s>0?'S':'N',v,u,3.4,2.2,3.8);
      if(near) {
        for(let j=0;j<3;j++)k.arc(s>0?'S':'N',v+s*.55,u-2.6+j*2.6,27.65,.8,28.7,.16,'trim',.16);
        box('trim',[u,12.1,v+s*.15],[4.8,.3,.45]);
      }
    }
    if(near)for(let i=0;i<52;i++)box('trim',[-22.4+i,29.93,v+s*.3],[.42,.5,.9]);
  }
  lathe('stone',[[0,0],[6,0],[6,15.8],[0,15.8]],3,21.7,near?16:10);
  lathe('roof',[[0,15.65],[6.2,15.65],[1.2,20],[0,20]],3,21.7,near?16:10);
  for(const a of [-.8,0,.8])k.radialWindow(3,21.7,6.05,a,6,1.35,7.2);
  if(near)for(let u=-21;u<29;u+=2)for(const s of [-1,1]) {
    const e=s<0?-.6:19.2;bar('metal',[u,29.78,e],[u,35.18,9.3],.055,.075);
  }
}

function west(k) {
  const {box,arc,column,window,near,bar}=k;
  box('stone',[-25.4,2.1,9.3],[4.1,4.2,18.5]);
  for(let i=0;i<12;i++)box('stone',[-28.7-i*.36,(4.2-i*.32)/2,9.3],[.37,4.2-i*.32,18.2]);
  for(const v of [2.9,9.3,15.7]) {
    arc('W',-27.45,v,14.8,5.35,15.2,.5,'trim',2.35);
    k.spandrel('W',-27.25,v,5.95,15.2,21.5,2.1);
    window('W',-22.78,v,4.35,3.5,6.8);
    if(near) {
      for(let i=0;i<13;i++) {
        const a=Math.PI*i/12,r=3.05;
        box('trim',[-27.65,15.2+Math.sin(a)*r,v+Math.cos(a)*r],[.5,.3,.32]);
      }
      for(let j=0;j<4;j++)arc('W',-27+j*.48,v,14.9,5.3,15.2,.12,'stone',.15);
    }
  }
  for(const v of [-.25,6.1,12.5,18.85]) {
    column(-26.8,v,4.2,14.9,.47);box('trim',[-26.8,14.9,v],[1.35,.8,1.4]);
    if(near){column(-25.85,v,4.2,14.9,.3);column(-27.5,v,4.2,14.9,.28);}
  }
  box('trim',[-25.4,21.6,9.3],[4.4,1,19.8]);
  for(let i=0;i<9;i++) {
    const v=.55+i*2.18;
    arc('W',-27.1,v,24.1,1.45,26.8,.24,'trim',1.45);
    k.spandrel('W',-26.95,v,2.18,26.8,28.5,1.3);
  }
  for(let i=0;i<=9;i++)column(-26.6,-.54+i*2.18,23.3,26.8,.2);
  box('glass',[-22.82,25.5,9.3],[.1,4.4,19.4]);
  box('stone',[-25.6,22.9,9.3],[2.6,1.6,19.8]);
  box('trim',[-25.6,28.8,9.3],[3.5,.75,20]);box('trim',[-25.2,30.2,9.3],[3.8,.6,20.1]);
  k.pediment(-26.95,-23.1,-.85,19.45,30.5,35.15);
  bar('trim',[-27.12,30.55,-.9],[-27.12,35.27,9.3],.36,.5);
  bar('trim',[-27.12,35.27,9.3],[-27.12,30.55,19.5],.36,.5);
  k.oculus('W',-27.08,9.3,32.25,.8,'gold');k.cross(-25.1,9.3,35.05,2.25,'trim');
  if(near) {
    for(let i=0;i<28;i++)box('trim',[-27.23,29.5,-.6+i*.72],[.5,.65,.33]);
    for(const v of [1.6,4.1,14.5,17])k.figure(-27.13,v,30.6,1.3,'trim');
    for(let i=0;i<14;i++) {
      const v=-.65+i*1.53,y=30.9+4.4*(1-Math.abs(v-9.3)/10);k.figure(-26.85,v,y,.5,'trim');
    }
  }
}

function tower(k,u,v) {
  const {lathe,near,box,column}=k;
  lathe('stone',[[0,0],[4.3,0],[4.25,4.8],[3.8,30.6],[3.8,32.7],[0,32.7]],u,v,8);
  lathe('trim',[[4.3,4.6],[4.48,5],[4.48,5.6],[4.18,5.85]],u,v,8);
  lathe('trim',[[3.8,31.5],[4.13,32],[4.18,32.7],[3.86,33.1]],u,v,8);
  for(let i=0;i<8;i++) {
    const a=i*Math.PI/4,ap=3.57,aa=a+Math.PI/8;
    k.radialArc(u,v,ap,a,34.3,1.85,39,.35,1.02);
    column(u+Math.sin(aa)*3.72,v+Math.cos(aa)*3.72,33,39.2,.27);
    if(near) {
      for(let j=0;j<10;j++) {
        const q=Math.PI*j/9,r=1.28,g=new THREE.BoxGeometry(.25,.26,.2);
        g.translate(Math.cos(q)*r,39+Math.sin(q)*r,0);k.radialPut(g,'trim',u,v,ap+.55,a);
      }
      k.bar('trim',[u+Math.sin(aa)*4.12,6,v+Math.cos(aa)*4.12],[u+Math.sin(aa)*3.8,31.4,v+Math.cos(aa)*3.8],.15,.2);
      k.radialArc(u,v,4.1,a,30.75,2.1,31.3,.14,.15);
    }
    for(const y of (near?[10.8,20.5,29]:[29]))k.radialOculus(u,v,y,a,4.26-(y-4.8)*.017,.42);
  }
  lathe('trim',[[0,40.2],[3.96,40.2],[4.45,41.1],[4.5,41.8],[4.12,42.05],[0,42.05]],u,v,8);
  for(let i=0;i<16;i++) {
    const a=i*Math.PI/8;
    box('trim',[u+Math.sin(a)*4.14,42.55,v+Math.cos(a)*4.14],[.42,1.4,.48],-a);
    if(near){const g=new THREE.ConeGeometry(.16,.35,4);g.translate(u+Math.sin(a)*4.16,43.38,v+Math.cos(a)*4.16);k.put(g,'trim');}
  }
  lathe('metal',[[0,41.7],[1.72,41.7],[.36,46],[0,46]],u,v,8);k.cross(u,v,45.65,2.35,'metal');
  if(near)for(let i=0;i<8;i++) {
    const a=i*Math.PI/4;
    for(const s of [-1,1])k.bar('trim',[u+Math.sin(a)*3.8+s*Math.cos(a)*.65,33.3,v+Math.cos(a)*3.8-s*Math.sin(a)*.65],[u+Math.sin(a)*3.8-s*Math.cos(a)*.65,35,v+Math.cos(a)*3.8+s*Math.sin(a)*.65],.1,.12);
  }
}

function chapel(k) {
  const {box,roof,window,lathe,near}=k;
  box('stone',[20,6.2,36.7],[39.5,12.4,13]);roof('roof',.25,39.75,30.2,43.2,12.2,17);
  for(let i=0;i<8;i++) {
    window('S',43.2,3+i*4.65,3.1,1.45,5.7);
    if(near)box('trim',[.8+i*4.65,6.2,43.4],[.48,12.3,.55]);
  }
  box('stone',[4.25,10.15,39.3],[7.6,20.3,7.6]);box('trim',[4.25,20.55,39.3],[8.1,.8,8.1]);
  for(const face of ['W','S','N','E']) {
    const p=face==='W'?.45:face==='E'?8.05:face==='S'?43.1:35.5,a=face==='W'||face==='E'?39.3:4.25;
    window(face,p,a,12.4,2.8,6.2);if(near)window(face,p,a,3,2.5,4.3);
  }
  lathe('stone',[[0,20.7],[3.58,20.7],[3.58,25.9],[0,25.9]],4.25,39.3,8);
  for(let i=0;i<8;i++)k.radialWindow(4.25,39.3,3.33,i*Math.PI/4,21.15,1.1,3.7);
  // Narrow pointed copper core inside an open cage of eight stone ribs.
  lathe('roof',[[0,25.7],[2.45,25.7],[2.35,28.4],[1.6,30.6],[.4,33],[0,33]],4.25,39.3,near?16:8);
  for(let i=0;i<8;i++) {
    const a=i*Math.PI/4;
    const profile=[[3.52,25.8],[3.4,27.1],[3.05,28.8],[2.45,30.5],[1.6,32],[.5,33.1]];
    for(let j=1;j<profile.length;j++) {
      const [ra,ya]=profile[j-1],[rb,yb]=profile[j];
      k.bar('trim',[4.25+Math.sin(a)*ra,ya,39.3+Math.cos(a)*ra],[4.25+Math.sin(a)*rb,yb,39.3+Math.cos(a)*rb],.2,.23);
    }
    k.pointedRadialArc(4.25,39.3,3.18,a+Math.PI/8,25.8,1.7,27.4,29.65,.18,.25);
  }
  lathe('trim',[[0,32.8],[.7,32.8],[.7,34.2],[0,34.2]],4.25,39.3,8);k.figure(4.25,39.3,34.15,3.8,'gold');
}
