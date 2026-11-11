import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {kit} from './tour-de-lille-parts.js';
// Simplified four-corner rings extracted from mapped parts; centimetre facade serrations omitted.
const TOWER_LO=[[-5.4525,-16.1243],[18.6296,-19.7276],[20.5113,7.8065],[-3.8282,7.7954]];
const TOWER_HI=[[-.3458,-21.0687],[18.3108,-24.3631],[20.8203,12.3994],[1.8875,11.8692]];
const TOE=[[-57.5568,-8.3313],[-6.2201,-16.0065],[-4.6064,7.7949],[-56.6927,7.757]];
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,quad,put,box}=k;
 // Closed loft partitioned into adjoining opaque spandrels and individual panes.
 function skin(lo,hi,y0,ys,rows){
  for(let i=0;i<lo.length;i++){
   const j=(i+1)%lo.length,n=Math.max(2,Math.ceil(Math.hypot(hi[j][0]-hi[i][0],hi[j][1]-hi[i][1])/(near?2.1:4.2)));
   const point=(u,v)=>{const x0=lo[i][0]*(1-u)+lo[j][0]*u,z0=lo[i][1]*(1-u)+lo[j][1]*u,x1=hi[i][0]*(1-u)+hi[j][0]*u,z1=hi[i][1]*(1-u)+hi[j][1]*u,y1=ys[i]*(1-u)+ys[j]*u;return[x0*(1-v)+x1*v,y0+(y1-y0)*v,z0*(1-v)+z1*v];};
   const tile=(m,a,b,c,d)=>quad(m,point(a,c),point(a,d),point(b,d),point(b,c));
   for(let row=0;row<rows;row++)for(let col=0;col<n;col++){
    const a=col/n,b=(col+1)/n,c=row/rows,d=(row+1)/rows,pad=near?.13:.12,low=c+(d-c)*.22,high=c+(d-c)*.83,l=a+(b-a)*pad,r=b-(b-a)*pad;
    tile('panel',a,b,c,low);tile('panel',a,b,high,d);tile('panel',a,l,low,high);tile('panel',r,b,low,high);tile('glass',l,r,low,high);
   }
  }
  const top=new THREE.Shape(hi.map(([x,z])=>new THREE.Vector2(x,-z))),g=new THREE.ShapeGeometry(top);const p=g.attributes.position;for(let v=0;v<p.count;v++){const x=p.getX(v),z=-p.getY(v);let best=Infinity,height=ys[0];for(let q=0;q<hi.length;q++){const dist=Math.hypot(x-hi[q][0],z-hi[q][1]);if(dist<best){best=dist;height=ys[q];}}p.setXYZ(v,x,height,z);}g.computeVertexNormals();put(g,'metal');
  const base=new THREE.ShapeGeometry(new THREE.Shape(lo.map(([x,z])=>new THREE.Vector2(x,z))));base.rotateX(Math.PI/2);base.translate(0,y0,0);put(base,'shadow');
 }
 // Real open space beneath the suspended boot; concrete supports meet its underside.
 box('concrete',-49,11.5,-.3,6.5,23,11.5);
 box('concrete',8.6,11.5,-4.3,13.2,23,18.5);
 // Lower service volumes belong to the tower, not the adjacent station.
 box('shadow',-58,8,-3.5,12,16,9);
 skin(TOE,TOE,23,[38,42,42,38],near?5:3);
 skin(TOWER_LO,TOWER_HI,23,[91,89,89,91],near?19:10);
 // Narrow structural edge strips connect the slab edge to the roof without floating.
 if(near)for(const i of [0,3]){const a=TOWER_LO[i],c=TOWER_HI[i];k.b.bar('metal',[a[0],23,a[1]],[c[0],91,c[1]],.23,.23);}
 return k.finish();
}
