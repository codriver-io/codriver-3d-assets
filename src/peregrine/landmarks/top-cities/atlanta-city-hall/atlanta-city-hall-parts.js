import * as THREE from 'three';
import { SPEC } from './config.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
const a=SPEC.rotationDeg*Math.PI/180,c=Math.cos(a),s=Math.sin(a);
export const world=(x,y,z)=>[x*c+z*s,y,-x*s+z*c];
export function localRing(ring) {
  const k=mercStretch(SPEC.origin[1]),ox=lngToMercX(SPEC.origin[0]),oz=-latToMercY(SPEC.origin[1]);
  return ring.slice(0,-1).map(([lng,lat])=>{const x=(lngToMercX(lng)-ox)/k,z=(-latToMercY(lat)-oz)/k;return [x*c-z*s,x*s+z*c];});
}
export function parts(b,near) {
  const put=(g,mat)=>{g.rotateY(a);b.put(g,mat);};
  const box=(mat,x,y,z,w,h,d)=>b.box(mat,world(x,y,z),[w,h,d],a);
  function quad(mat,points) {
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points.flat(),3));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();put(g,mat);
  }
  function roof(ring,y,mat='roof',holes=[]) {
    const shape=new THREE.Shape(ring.map(([x,z])=>new THREE.Vector2(x,-z)));
    shape.holes=holes.map(r=>new THREE.Path(r.map(([x,z])=>new THREE.Vector2(x,-z))));
    const g=new THREE.ShapeGeometry(shape);g.rotateX(-Math.PI/2);g.translate(0,y,0);put(g,mat);
  }
  // Actual apertures: no opaque backing wall behind the inset glass.
  function wall(from,to,y0,y1,cols,rows,{ww=1.45,wh=2.25,mat='stone',olive=false,arch=false,lit=false}={}) {
    const dx=to[0]-from[0],dz=to[1]-from[1],w=Math.hypot(dx,dz),u=[dx/w,dz/w],n=[-u[1],u[0]];
    const p=(q,y,d=0)=>[from[0]+u[0]*q-n[0]*d,y,from[1]+u[1]*q-n[1]*d];
    const rect=(m,l,r,bot,top,d=0)=>{if(r-l>1e-5&&top-bot>1e-5)quad(m,[p(l,bot,d),p(r,bot,d),p(r,top,d),p(l,top,d)]);};
    if(!cols||!rows){rect(mat,0,w,y0,y1);return;}
    const pitch=w/cols,rh=(y1-y0)/rows,windowW=Math.min(ww,pitch*.68),windowH=Math.min(wh,rh*.81),recess=near?.3:.65;
    for(let r=0;r<rows;r++)for(let j=0;j<cols;j++) {
      const left=j*pitch,right=left+pitch,l=left+(pitch-windowW)/2,h=l+windowW;
      const bottom=y0+r*rh,top=bottom+rh,low=bottom+(rh-windowH)/2,high=low+windowH;
      rect(mat,left,l,bottom,top);rect(mat,h,right,bottom,top);
      rect(olive?'spandrel':mat,l,h,bottom,low);rect(olive?'spandrel':mat,l,h,high,top);
      const glazed=lit&&((j+r)%5===0)?'light':'glass';
      const pointed=arch===true||(arch==='portal'&&Math.abs(j-(cols-1)/2)<=1);
      if(pointed){
        const shoulder=high-windowW*.48,mid=(l+h)/2;
        quad(glazed,[p(l,low,recess),p(h,low,recess),p(h,shoulder,recess),p(l,shoulder,recess)]);
        quad(glazed,[p(l,shoulder,recess),p(h,shoulder,recess),p(mid,high,recess),p(mid,high,recess)]);
        quad(mat,[p(l,shoulder),p(mid,high),p(l,high),p(l,high)]);
        quad(mat,[p(mid,high),p(h,shoulder),p(h,high),p(h,high)]);
        quad(mat,[p(l,shoulder),p(l,shoulder,recess),p(mid,high,recess),p(mid,high)]);
        quad(mat,[p(mid,high),p(mid,high,recess),p(h,shoulder,recess),p(h,shoulder)]);
      }else{
        rect(glazed,l,h,low,high,recess);
        quad(mat,[p(l,high),p(l,high,recess),p(h,high,recess),p(h,high)]);
      }
      const revealHigh=pointed?high-windowW*.48:high;
      quad(mat,[p(l,low),p(l,low,recess),p(l,revealHigh,recess),p(l,revealHigh)]);
      quad(mat,[p(h,revealHigh),p(h,revealHigh,recess),p(h,low,recess),p(h,low)]);
      quad(mat,[p(h,low),p(h,low,recess),p(l,low,recess),p(l,low)]);
      if(near){
        rect('trim',(l+h)/2-.04,(l+h)/2+.04,low,revealHigh,recess-.12);
        rect('trim',l,h,low+windowH*.5-.04,low+windowH*.5+.04,recess-.12);
      }
    }
  }
  function block(x,z,w,d,y0,y1,cols,rows,options={}) {
    const r=[[x-w/2,z-d/2],[x-w/2,z+d/2],[x+w/2,z+d/2],[x+w/2,z-d/2]];
    for(let i=0;i<4;i++)wall(r[i],r[(i+1)%4],y0,y1,cols,rows,options);
    return r;
  }
  function pyramid(x,z,w,d,y0,height,mat='roof') {
    const r=[[x-w/2,y0,z-d/2],[x+w/2,y0,z-d/2],[x+w/2,y0,z+d/2],[x-w/2,y0,z+d/2]],tip=[x,y0+height,z];
    for(let i=0;i<4;i++)quad(mat,[r[i],tip,r[(i+1)%4],r[(i+1)%4]]);
  }
  return {put,box,quad,roof,wall,block,pyramid};
}
