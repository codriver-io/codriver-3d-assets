import { layout } from './tbilisi-tv-tower-structure.js';
import * as THREE from 'three';
import { SPEC, PALETTES } from './config.js';
import { LOCAL_RINGS } from './footprint.js';
import { builder } from './tbilisi-tv-tower-parts.js';
export function create({detail='near'}={}) {
 const {near,b,face,cap,frame,patch,walls,prism,rect,block,spin,cyl,hip,rows,finish}=builder(SPEC,PALETTES,detail);
const L=layout(detail),C=L.axis;
 spin([[4.8,0],[3.4,70],[2.2,137]],'white',C[0],C[1],near?28:16);
 for(const F of L.feet)cyl(F[0],F[1],1.3,0,1.6,'roof',near?12:8);
 for(const m of L.legs)b.bar('leg',m.a,m.b,.7,.7,0,true);
 for(const p of L.joints){const q=new THREE.SphereGeometry(.9,near?8:6,near?6:4);q.translate(...p);b.put(q,'white');}
 for(const m of L.braces)b.bar('brace',m.a,m.b,.45,.45);
 prism([[-13.77,-14.54],[1.28,9.21],[-25.03,9.25]],69,72,'white','roof');
 const pod=[[4.6,137],[7,142],[9.2,148],[9.7,151],[9.7,153.7],[9.9,154.3],[9.4,155]];spin(pod,'lamp',C[0],C[1],near?36:20,(k,j)=>k===3&&j%5?'glass':'lamp');
 const mast=[];for(let j=0;j<=16;j++){const t=j/16;mast.push([2.15*(1-t)+.18*t,155+(274.5-155)*t]);}spin(mast,'red',C[0],C[1],near?12:8,k=>k%2?'red':'white');cyl(C[0],C[1],.16,274.5,278,'white',near?8:5);
 for(const y of [185,218,246])cyl(C[0],C[1],y<220?2.4:1.6,y-.28,y+.28,'white',near?20:12);
 // Two mapped low operator blocks, gabled within their own outlines.
 for(const r of [LOCAL_RINGS[1],LOCAL_RINGS[2]]){walls(r,0,3,'white',[[.7,2.1]],near?3:6,'glass',.36);let best=[0,0,0];r.forEach((a,i)=>{const c=r[(i+1)%r.length],d=Math.hypot(c[0]-a[0],c[1]-a[1]);if(d>best[0])best=[d,(c[0]-a[0])/d,(c[1]-a[1])/d];});const ux=best[1],uz=best[2],v=r.map(p=>-uz*p[0]+ux*p[1]),mid=(Math.min(...v)+Math.max(...v))/2;const ridge=p=>{const u=ux*p[0]+uz*p[1];return [ux*u-uz*mid,5,uz*u+ux*mid];};r.forEach((a,i)=>{const c=r[(i+1)%r.length],A=ridge(a),B=ridge(c),end=Math.abs(ux*(c[0]-a[0])+uz*(c[1]-a[1]))<.2;face(end?'white':'roof',[[a[0],3,a[1]],[c[0],3,c[1]],B,A],end?frame(r,i).out:[0,1,0]);});}

return finish();
}
