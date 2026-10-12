import * as THREE from 'three';
import { SPEC } from './config.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';

// Control points on the south wall of way 749268115: east-running nave is 2.86° south of east.
export const THETA = -Math.atan2(0.0000216 * 111319.49, 0.0007149 * 111319.49 * Math.cos(SPEC.origin[1] * Math.PI / 180));
export const toWorld = (u, y, v) => [u * Math.cos(THETA) + v * Math.sin(THETA), y, -u * Math.sin(THETA) + v * Math.cos(THETA)];
export function localRing(ring) {
  const ox = lngToMercX(SPEC.origin[0]), oz = -latToMercY(SPEC.origin[1]), k = mercStretch(SPEC.origin[1]);
  return ring.map(([lng, lat]) => {
    const x = (lngToMercX(lng) - ox) / k, z = (-latToMercY(lat) - oz) / k;
    return [x * Math.cos(THETA) - z * Math.sin(THETA), x * Math.sin(THETA) + z * Math.cos(THETA)];
  });
}
export function makeKit(b, near) {
  const segments = near ? 12 : 5;
  const poly = (material, points, indices) => {
    const g = new THREE.BufferGeometry();g.setAttribute('position', new THREE.Float32BufferAttribute(points.flat(), 3));g.setIndex(indices);g.computeVertexNormals();b.put(g, material);
  };
  const solid = (material, points, low, high) => {
    const s=new THREE.Shape(points.map(([x,z])=>new THREE.Vector2(x,-z)));
    const g=new THREE.ExtrudeGeometry(s,{depth:high-low,bevelEnabled:false});g.rotateX(-Math.PI/2);g.translate(0,low,0);b.put(g,material);
  };
  const cylinder = (material, x, z, bottom, height, radius, top=radius) => {
    const g=new THREE.CylinderGeometry(top,radius,height,near?8:4);g.translate(x,bottom+height/2,z);b.put(g,material);
  };
  const ball = (material,x,y,z,r,scale=[1,1,1]) => {const g=new THREE.SphereGeometry(r,near?8:4,near?6:3);g.scale(...scale);g.translate(x,y,z);b.put(g,material);};
  const arc = (material, center, r, a, c, thickness, orient='z') => {
    const n=segments, p=[];for(let i=0;i<=n;i++){const t=a+(c-a)*i/n;const pt=orient==='z'?[center[0]+r*Math.cos(t),center[1]+r*Math.sin(t),center[2]]:[center[0],center[1]+r*Math.sin(t),center[2]+r*Math.cos(t)];p.push(pt);if(i)b.bar(material,p[i-1],pt,near?thickness:thickness/2,near?thickness:thickness/2,0,!near);}
  };
  // All facade details lie in a local (horizontal, vertical, outward-depth) frame.
  const facePoint = (face, a, y, depth) => face==='south'?[a,y,depth]:face==='north'?[a,y,-depth]:face==='west'?[-depth,y,a]:[depth,y,a];
  const faceGeometry = (g,face,position) => {
    if(face==='north')g.rotateY(Math.PI);if(face==='west')g.rotateY(-Math.PI/2);if(face==='east')g.rotateY(Math.PI/2);
    g.translate(...facePoint(face,...position));return g;
  };
  const archPath = (a,bottom,width,height,n=segments) => {
    const r=width/2, spring=bottom+height-r,p=[[a-r,bottom],[a+r,bottom],[a+r,spring]];
    for(let i=1;i<=n;i++){const t=Math.PI*i/n;p.push([a+r*Math.cos(t),spring+r*Math.sin(t)]);}return p;
  };
  const window = (face,a,bottom,width,height,depth,{frame=true,mat='glass',mullions=true}={}) => {
    const pts=archPath(0,0,width,height),s=new THREE.Shape(pts.map(p=>new THREE.Vector2(...p)));
    b.put(faceGeometry(new THREE.ShapeGeometry(s,segments),face,[a,bottom,depth-0.18]),mat);
    if(frame){
      const outer=archPath(0,-0.23,width+0.46,height+0.46),inner=archPath(0,0,width,height);
      const ring=new THREE.Shape(outer.map(p=>new THREE.Vector2(...p)));ring.holes.push(new THREE.Path(inner.map(p=>new THREE.Vector2(...p))));
      b.put(faceGeometry(new THREE.ShapeGeometry(ring,segments),face,[a,bottom,depth+0.22]),'stone');
    }
    if(mullions){
      const xCount=near?3:1;
      for(let i=0;i<xCount;i++){const dx=(i-(xCount-1)/2)*width/4;const top=bottom+height-width/2+Math.sqrt(width*width/4-dx*dx);b.bar('stone',facePoint(face,a+dx,bottom,depth+0.24),facePoint(face,a+dx,top,depth+0.24),near?0.085:0.14);}
      for(let y=bottom+height/(near?4:2);y<bottom+height-width/2;y+=height/(near?5:1))b.bar('stone',facePoint(face,a-width/2,y,depth+0.24),facePoint(face,a+width/2,y,depth+0.24),near?0.075:0.12);
    }
  };
  const wall = (face, a, depth, width, bottom, height, windows=[],material='brick') => {
    const s=new THREE.Shape([new THREE.Vector2(-width/2,0),new THREE.Vector2(width/2,0),new THREE.Vector2(width/2,height),new THREE.Vector2(-width/2,height)]);
    for(const w of windows){const p=archPath(w.a-a,w.bottom-bottom,w.width,w.height);s.holes.push(new THREE.Path(p.map(q=>new THREE.Vector2(...q))));}
    const g=new THREE.ExtrudeGeometry(s,{depth:0.38,bevelEnabled:false,curveSegments:segments});g.translate(0,0,-0.38);b.put(faceGeometry(g,face,[a,bottom,depth]),material);
    for(const w of windows)window(face,w.a,w.bottom,w.width,w.height,depth,w);
  };
  const surfaceBar = (face,a,y,width,height,depth,material='stone') => {
    const p=[[-width/2,-height/2],[width/2,-height/2],[width/2,height/2],[-width/2,height/2]].map(([x,v])=>facePoint(face,a+x,y+v,depth));
    if(face==='south'||face==='west')poly(material,p,[0,1,2,0,2,3]);else poly(material,p,[0,2,1,0,3,2]);
  };
  const gable = (face,a,depth,width,eave,ridge) => {
    const pts=[[a-width/2,eave],[a+width/2,eave],[a,ridge]].map(([x,y])=>facePoint(face,x,y,depth));
    poly('brick',pts,face==='south'||face==='west'?[0,1,2]:[0,2,1]);
    b.bar('stone',pts[0],pts[2],0.3);b.bar('stone',pts[1],pts[2],0.3);
  };
  const roof = (u,v,length,width,eave,ridge) => {
    const p=[[u-length/2,eave,v-width/2],[u+length/2,eave,v-width/2],[u-length/2,ridge,v],[u+length/2,ridge,v],[u-length/2,eave,v+width/2],[u+length/2,eave,v+width/2]];
    poly('roof',p,[0,2,1,1,2,3,2,4,3,3,4,5]);
    b.bar('metal',p[2],p[3],near?0.16:0.22);
  };
  const squareLoft = (material, stages) => {
    const p=[]; for(const [y,w] of stages)p.push([-w/2,y,-w/2],[w/2,y,-w/2],[w/2,y,w/2],[-w/2,y,w/2]);
    const idx=[];for(let i=0;i<stages.length-1;i++)for(let j=0;j<4;j++){let a=i*4+j,c=i*4+(j+1)%4;idx.push(a,a+4,c,c,a+4,c+4);}poly(material,p,idx);
  };
  return {...b,poly,solid,cylinder,ball,arc,facePoint,faceGeometry,archPath,window,wall,surfaceBar,gable,roof,squareLoft,near};
}
