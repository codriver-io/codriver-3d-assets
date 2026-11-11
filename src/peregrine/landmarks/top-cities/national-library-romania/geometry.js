import * as THREE from 'three';
import polygonClipping from 'polygon-clipping';
import { SPEC, PALETTES } from './config.js';
import { LOCAL_RINGS, LOCAL_COURTYARDS } from './footprint.js';
import { builder } from './national-library-romania-parts.js';
export function create({detail='near'}={}) {
 const {near,b,face,cap,frame,patch,walls,prism,rect,block,spin,cyl,hip,rows,finish}=builder(SPEC,PALETTES,detail);
const original=[LOCAL_RINGS[0],...LOCAL_COURTYARDS],wing=polygonClipping.intersection(original,[[[-100,-100],[-20.4,-100],[-20.4,100],[-100,100],[-100,-100]]]),main=polygonClipping.difference(original,...wing);
 const capPoly=(mat,poly,y)=>{const p=poly[0].slice(0,-1).map(v=>new THREE.Vector2(...v)),hs=poly.slice(1).map(r=>r.slice(0,-1).map(v=>new THREE.Vector2(...v))),all=[...p,...hs.flat()];for(const t of THREE.ShapeUtils.triangulateShape(p,hs))face(mat,t.map(j=>[all[j].x,y,all[j].y]),[0,1,0]);};
 const joined=(a,c)=>Math.abs(a[0]+20.4)<.01&&Math.abs(c[0]+20.4)<.01;
 const grid=(r,lo,hi,pitch=4.2,inward=false)=>r.forEach((a,i)=>{if(joined(a,r[(i+1)%r.length]))return;const f=frame(r,i);if(inward)f.out=f.out.map(v=>-v);const n=Math.max(1,Math.round(f.l/(near?1.9:3.8))),step=f.l/n;let base=lo;for(const [low,high]of rows(lo+.25,hi,pitch,pitch-(near?.25:.45))){patch('mullion',f,0,f.l,base,low);for(let j=0;j<n;j++){patch('mullion',f,j*step,j*step+(near?.08:.15),low,high);patch('glass',f,j*step+(near?.08:.15),(j+1)*step,low,high);}base=high;}patch('mullion',f,0,f.l,base,hi);});
 for(const poly of wing){grid(poly[0],0,31.6,near?4.2:8.4);poly[0].forEach((a,i)=>{const c=poly[0][(i+1)%poly[0].length];if(joined(a,c))return;const f=frame(poly[0],i),n=Math.max(1,Math.round(f.l/(near?2.5:5)));patch('stone',f,0,f.l,31.6,31.9);for(let j=0;j<n;j++){patch('stone',f,j*f.l/n,(j+.35)*f.l/n,31.9,33.2);patch('vent',f,(j+.35)*f.l/n,(j+1)*f.l/n,31.9,33.2);}patch('stone',f,0,f.l,33.2,33.5);});capPoly('roof',poly,33.5);}
 for(const poly of main){poly[0].forEach((a,i)=>{const c=poly[0][(i+1)%poly[0].length],f=frame(poly[0],i);if(joined(a,c)){patch('stone',f,0,f.l,33.5,35);return;}const classic=Math.abs(a[1]+59.6)<.2&&Math.abs(c[1]+59.6)<.2&&f.l>40;if(classic)return;
  const white=f.l<6||(Math.abs((a[1]+c[1])/2+56.9)<.4&&Math.min(a[0],c[0])>-11&&Math.max(a[0],c[0])<3);if(white){patch('stone',f,0,f.l,0,33.8);}else{const n=Math.max(1,Math.round(f.l/(near?1.9:3.8))),step=f.l/n;let base=0;for(const [lo,hi]of rows(.3,33.8,near?4.2:8.4,near?3.9:7.95)){patch('mullion',f,0,f.l,base,lo);for(let j=0;j<n;j++){patch('mullion',f,j*step,j*step+.1,lo,hi);patch('glass',f,j*step+.1,(j+1)*step,lo,hi);}base=hi;}patch('mullion',f,0,f.l,base,33.8);}patch('stone',f,0,f.l,33.8,35);
 });for(const h of poly.slice(1))grid(h,0,35,near?4.2:8.4,true);capPoly('roof',poly,35);}
 // Riverfront classical plane, with its glass curtain wall physically behind the columns.
 const front=frame([[1.6,-59.6],[52.4,-59.6],[52.4,-55],[1.6,-55]],0);
 let low=0;for(const [a,c]of [[1,4.5],[6.4,10.6]]){patch('stone',front,0,front.l,low,a);const n=9,step=front.l/n;for(let j=0;j<n;j++){patch('stone',front,j*step,j*step+step*.38,a,c);patch('glass',front,j*step+step*.38,(j+1)*step,a,c);}low=c;}patch('stone',front,0,front.l,low,11.5);
 const back=[[1.6,-56.7],[52.4,-56.7],[52.4,-55],[1.6,-55]];const f=frame(back,0);let y=11.5;for(const [a,c]of rows(11.7,29.2,near?3.7:7.4,near?3.4:6.8)){patch('mullion',f,0,f.l,y,a);const n=Math.round(f.l/(near?1.8:3.6));for(let j=0;j<n;j++){patch('mullion',f,j*f.l/n,j*f.l/n+.08,a,c);patch('glass',f,j*f.l/n+.08,(j+1)*f.l/n,a,c);}y=c;}patch('mullion',f,0,f.l,y,29.2);
 for(let k=0;k<9;k++){const x=4.2+k*5.65,z=-58.5;block(x,z,1.7,1.7,11.5,12.2,'stone','stone');const n=near?20:12;for(let j=0;j<n;j++){const a=j*2*Math.PI/n,c=(j+1)*2*Math.PI/n;face('column',[[x+.56*Math.cos(a),12.2,z+.56*Math.sin(a)],[x+.56*Math.cos(c),12.2,z+.56*Math.sin(c)],[x+.56*Math.cos(c),28.5,z+.56*Math.sin(c)],[x+.56*Math.cos(a),28.5,z+.56*Math.sin(a)]],[Math.cos((a+c)/2),0,Math.sin((a+c)/2)]);}block(x,z,1.7,1.7,28.5,29.2,'stone','stone');}
 block(27,-57.3,50.8,4.6,29.2,30.6,'cornice','cornice');
 const attic=frame([[1.6,-58.9],[52.4,-58.9],[52.4,-55],[1.6,-55]],0);patch('stone',attic,0,attic.l,30.6,31.1);const n=13;for(let j=0;j<n;j++){patch('stone',attic,j*attic.l/n,(j+.77)*attic.l/n,31.1,32.1);patch('vent',attic,(j+.77)*attic.l/n,(j+1)*attic.l/n,31.1,32.1);}patch('stone',attic,0,attic.l,32.1,33.5);walls(rect(27,-57.3,50.8,4.6),33.5,35,'cornice');
 // Shallow glass barrel roof spans only the mapped central atrium; the four small courts remain open.
 const r=LOCAL_COURTYARDS[0],xmin=Math.min(...r.map(p=>p[0])),xmax=Math.max(...r.map(p=>p[0])),zmin=Math.min(...r.map(p=>p[1])),zmax=Math.max(...r.map(p=>p[1])),N=near?16:8,M=near?24:12;
 const point=(x,z)=>[x,31.5+2*Math.sin((z-zmin)/(zmax-zmin)*Math.PI),z];for(let i=0;i<N;i++)for(let j=0;j<M;j++){const a=xmin+i*(xmax-xmin)/N,c=xmin+(i+1)*(xmax-xmin)/N,b=zmin+j*(zmax-zmin)/M,d=zmin+(j+1)*(zmax-zmin)/M;face(i%4===0||j%4===0?'mullion':'glass',[point(a,b),point(c,b),point(c,d),point(a,d)],[0,1,0]);}

return finish();
}
