import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, MANIFEST } from './config.js';
import { makeKit, THETA } from './bromo-seltzer-tower-parts.js';

export function create({detail='near'}={}) {
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=makeKit(b,near),half=SPEC.shaftWidth/2;
  const box=(m,x,y,z,w,h,d,a=0)=>b.box(m,[x,y,z],[w,h,d],a);
  function horizontal(mat,y,outer,inner=0,up=true) {
    const s=new THREE.Shape();s.moveTo(-outer/2,-outer/2);s.lineTo(outer/2,-outer/2);s.lineTo(outer/2,outer/2);s.lineTo(-outer/2,outer/2);s.closePath();
    if(inner>0){const p=new THREE.Path();p.moveTo(-inner/2,-inner/2);p.lineTo(-inner/2,inner/2);p.lineTo(inner/2,inner/2);p.lineTo(inner/2,-inner/2);p.closePath();s.holes.push(p);}
    const g=new THREE.ShapeGeometry(s);g.rotateX(up?-Math.PI/2:Math.PI/2);g.translate(0,y,0);b.put(g,mat);
  }
  // Bands have only exposed horizontal ledges; no hidden full-size caps stacked
  // close to the next material's cap, which would create far-LOD depth cycles.
  function band(mat,y,w,h,inner=0) {
    for(let f=0;f<4;f++)k.rect(mat,0,y,w,h,w/2,f*Math.PI/2);
    if(inner){horizontal(mat,y+h/2,w,inner);horizontal(mat,y-h/2,w,inner,false);}
  }
  function faceBox(mat,u,y,d,w,h,t,a) {box(mat,u*Math.cos(a)+d*Math.sin(a),y,-u*Math.sin(a)+d*Math.cos(a),w,h,t,a);}
  // Rigid masonry plinth, not a street/plaza pad. The upper cornice sets the mapped envelope.
  band('stone',.30,11.5,.60,10.85);band('brick',2.95,10.85,4.7);band('stone',5.45,11,.30,10.6);
  const rows=Array.from({length:13},(_,i)=>7.1+i*3.8),bays=[-3.48,-1.16,1.16,3.48];
  for(let f=0;f<4;f++) {
    const a=f*Math.PI/2;
    // Cut actual apertures. Glass is recessed, with masonry jambs, rather than painted over a box.
    const s=new THREE.Shape();s.moveTo(-half,5.6);s.lineTo(half,5.6);s.lineTo(half,56.7);s.lineTo(-half,56.7);s.closePath();
    for(const y of rows)for(const u of bays) {
      const p=new THREE.Path();p.moveTo(u-.49,y-1.12);p.lineTo(u-.49,y+1.12);p.lineTo(u+.49,y+1.12);p.lineTo(u+.49,y-1.12);p.closePath();s.holes.push(p);
      k.rect('glass',u,y,.98,2.24,half-.20,a);
      if(near) {
        faceBox('stone',u,y-1.17,half+.10,1.19,.15,.32,a);
        k.rect('metal',u,y,.98,.085,half-.08,a);k.rect('stone',u,y+1.20,1.20,.16,half+.12,a);
      }
    }
    const shaft=new THREE.ExtrudeGeometry(s,{depth:.6,bevelEnabled:false});
    // Opaque glass closes every aperture: the interior back skin cannot be seen.
    const normals=shaft.attributes.normal,indices=[];
    for(let i=0;i<normals.count;i+=3)if(normals.getZ(i)>-.99)indices.push(i,i+1,i+2);
    shaft.setIndex(indices);k.face(shaft,'brick',a,half-.6);
    if(f===3) {
      k.rect('ink',0,1.95,2.2,3.3,5.56,a);
      for(const u of [-1.25,1.25])faceBox('stone',u,2.1,5.59,.28,3.65,.28,a);
      faceBox('stone',0,4,5.59,2.78,.35,.28,a);
      if(near)k.rect('glass',0,2.35,1.68,1.6,5.72,a);
    } else for(const u of bays)k.rect('glass',u,2.75,.98,1.9,5.57,a);
    // Four arched machicolation niches below the clock neck and measured small upper windows.
    for(const u of bays) {
      const arch=k.arch(u,54.5,1.24,56.5);
      k.face(new THREE.ShapeGeometry(new THREE.Shape(arch.getPoints())),'glass',a,half+.14);
      for(const side of [-1,1])faceBox('stone',u+side*.78,55.4,half+.28,.31,1.6,.7,a);
      if(near) {
        const ar=new THREE.Shape();ar.absarc(u,56.5,.81,0,Math.PI,false);ar.lineTo(u-.62,56.5);ar.absarc(u,56.5,.62,Math.PI,0,true);ar.closePath();
        k.face(new THREE.ShapeGeometry(ar,10),'stone',a,half+.38);
      }
    }
    for(const u of bays)k.rect('glass',u,59.85,.92,1.22,half+.16,a);
  }
  band('brick',59.4,SPEC.shaftWidth,5.4);
  band('stone',58.2,11.2,.38,10.6);band('stone',58.65,11.05,.20,10.6);band('stone',61.45,11.3,.40,10.6);
  for(let f=0;f<4;f++) {
    const a=f*Math.PI/2,hole=new THREE.Path();hole.absarc(0,SPEC.clockY,3.79,0,Math.PI*2,true);
    k.wall('brick',SPEC.shaftWidth,61.65,72.5,half,a,[hole]);
    k.ring('stone',3.66,3.93,SPEC.clockY,half+.16,a);
    k.ring('glow',2.43,SPEC.clockDiameter/2,SPEC.clockY,half+.22,a);k.disk('ink',2.42,SPEC.clockY,half+.22,a);
    k.ring('glow',2.26,2.40,SPEC.clockY,half+.24,a);k.ring('glow',1.18,1.23,SPEC.clockY,half+.24,a);
    const letters=[['B',-60],['R',-30],['O',0],['M',30],['O',60],['S',-90],['E',-120],['L',-150],['T',180],['Z',150],['E',120],['R',90]];
    for(const [ch,deg] of letters) {
      const t=deg*Math.PI/180,rot=Math.abs(deg)>85?Math.PI-t:-t;
      k.letter(ch,3.04*Math.sin(t),SPEC.clockY+3.04*Math.cos(t),rot,half+.37,a);
    }
    for(let i=0;i<(near?60:12);i++) {
      const t=i/(near?60:12)*Math.PI*2,r=near?2.32:2.28;
      k.line('metal',[[r*Math.sin(t),SPEC.clockY+r*Math.cos(t)],[(r-.11)*Math.sin(t),SPEC.clockY+(r-.11)*Math.cos(t)]],.035,half+.37,a);
    }
    const romans=['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];
    for(let i=0;i<12;i++) {
      const t=i*Math.PI/6,word=romans[i];
      for(let j=0;j<word.length;j++) {
        const u=(j-(word.length-1)/2)*.17;
        k.letter(word[j],1.83*Math.sin(t)+u*Math.cos(t),SPEC.clockY+1.83*Math.cos(t)-u*Math.sin(t),-t,half+.37,a,.5,'glow');
      }
    }
    // Static posed hands, broad counterweights and hub; no clock animation dependency.
    k.line('metal',[[-.42,SPEC.clockY-.13],[2.31,SPEC.clockY+.73]],.18,half+.54,a);
    k.line('metal',[[.44,SPEC.clockY-.10],[-1.95,SPEC.clockY+.44]],.26,half+.54,a);k.disk('metal',.27,SPEC.clockY,half+.55,a);
  }
  band('brick',73,10.6,1);
  // Closed tapered machicolation casing behind the projecting corbel ribs.
  const casing=new THREE.CylinderGeometry(6.03*Math.SQRT2,5.30*Math.SQRT2,3.3,4,1,true);
  casing.rotateY(Math.PI/4);casing.translate(0,74.15,0);b.put(casing,'trim');
  for(let f=0;f<4;f++) {
    const a=f*Math.PI/2;
    for(const u of [-4.8,-2.4,0,2.4,4.8]) {
      const shape=new THREE.Shape();shape.moveTo(5.28,72.5);shape.lineTo(6.35,75.9);shape.lineTo(5.28,75.9);shape.closePath();
      const g=new THREE.ExtrudeGeometry(shape,{depth:.5,bevelEnabled:false}),p=g.attributes.position;
      for(let i=0;i<p.count;i++){const r=p.getX(i),y=p.getY(i),t=p.getZ(i)-.25+u;p.setXYZ(i,t,y,r);}const reverse=[];for(let i=0;i<p.count;i+=3)reverse.push(i,i+2,i+1);g.setIndex(reverse);g.computeVertexNormals();g.rotateY(a);b.put(g,'stone');
    }
    for(const u of [-3.6,-1.2,1.2,3.6]) {
      const low=72.95,high=74.4,depth=y=>5.3+.73*(y-72.5)/3.3+.12;
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([u-.18,low,depth(low),u+.18,low,depth(low),u+.18,high,depth(high),u-.18,high,depth(high)],3));
      g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();k.face(g,'glass',a);
    }
  }
  band('trim',76.1,12.8,.6);band('stone',76.6,12.8,.4);horizontal('stone',76.8,12.8);horizontal('trim',75.8,12.8,12.7,false);
  // The square crenellated terrace is distinct from the narrower octagonal belfry.
  for(let f=0;f<4;f++) {
    const a=f*Math.PI/2;
    faceBox('brick',0,77.45,5.9,12.2,1.3,.65,a);faceBox('stone',0,78.15,5.9,12.4,.15,.8,a);
    for(const u of [-5.45,-2.72,0,2.72,5.45]) {
      faceBox('brick',u,78.7,5.9,.76,1.1,.65,a);faceBox('stone',u,79.29,5.9,.91,.14,.8,a);
    }
  }
  const apo=3.9,facet=2*apo*Math.tan(Math.PI/8);
  for(let f=0;f<8;f++) {
    const a=f*Math.PI/4+Math.PI/8;
    k.wall('brick',facet,77,86.8,apo,a,[k.arch(0,78.95,1.86,82.12)]);
    const arc=new THREE.Shape();arc.absarc(0,82.12,1.13,0,Math.PI,false);arc.lineTo(-.93,82.12);arc.absarc(0,82.12,.93,Math.PI,0,true);arc.closePath();
    k.face(new THREE.ExtrudeGeometry(arc,{depth:.16,bevelEnabled:false,curveSegments:near?12:6}),'stone',a,apo+.02);
    for(const u of [-1.21,1.21])faceBox('stone',u,80.7,apo+.08,.30,.20,.72,a);
    for(const u of [-.78,.78])k.face(new THREE.ShapeGeometry(new THREE.Shape(k.arch(u,84.05,.64,84.98).getPoints())),'trim',a,apo+.15);
    faceBox('stone',0,85.85,apo+.1,facet+.05,.24,.25,a);faceBox('stone',0,86.72,apo+.1,facet+.05,.16,.25,a);
    for(const u of [-.98,.98]) {
      faceBox('brick',u,87.33,apo-.22,.63,1.18,.62,a);faceBox('stone',u,87.96,apo-.22,.76,.08,.74,a);
    }
  }
  const innerRadius=(apo-.55)/Math.cos(Math.PI/8);
  const cap=new THREE.CylinderGeometry(innerRadius,innerRadius,.20,8);cap.translate(0,86.6,0);b.put(cap,'trim');
  const root=b.finish();
  root.traverse(o=>{if(o.isMesh){const old=o.geometry;o.geometry=mergeVertices(old,1e-4);old.dispose();o.geometry.deleteAttribute('bridgeLift');o.geometry.rotateY(THETA);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();}});
  root.userData.elevationDatum=MANIFEST.elevationDatum;return root;
}
