import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {tools} from './astrodome-parts.js';
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),t=tools(b,near);

 const{ellipse,rect,wall,face,cap,prism,cyl,flush}=t,R=107,n=near?144:72;
 // One opaque drum surface, with windows cut into the entrance arcs and the full clerestory band.
 const ring=ellipse(R,R,n);for(let i=0;i<n;i++){const a=ring[i],c=ring[(i+1)%n],ang=(i+.5)*2*Math.PI/n,entry=[0,Math.PI/2,Math.PI].some(x=>Math.abs(Math.atan2(Math.sin(ang-x),Math.cos(ang-x)))<.18);if(entry){wall(a,c,0,8,'metal',{floors:1,bays:1,margin:.18,trim:'trim'});wall(a,c,8,25.5,'stone');}else wall(a,c,0,25.5,'stone');wall(a,c,25.5,31.8,'metal',{floors:1,bays:1,margin:.10,trim:near?'trim':null});}cap(ring,0,'stone',false);
 // Original 72 structural perimeter ribs: diamond taper, founded at grade and contacting the upper drum.
 for(let i=0;i<72;i++){const a=i*2*Math.PI/72,ca=Math.cos(a),sa=Math.sin(a),cx=107.6*ca,cz=107.6*sa,radial=[ca,sa],tangent=[-sa,ca],ys=[0,12.75,25.5],ws=[.45,1.15,.45],rs=ys.map((y,j)=>{const w=ws[j],d=.6;return[[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2]].map(([u,v])=>[cx+tangent[0]*u+radial[0]*v,cz+tangent[1]*u+radial[1]*v]);});t.loft(rs,ys,'trim');}
 // Radial white/gray roof bands are adjacent faces on the dome, never overlapping decals.
 const steps=near?16:10,rr=Array.from({length:steps+1},(_,j)=>Math.max(1.5,R*(1-j/steps))),Y=r=>31.8+23.5*(1-(r/R)**2);
 for(let j=0;j<steps;j++)for(let i=0;i<n;i++){const a=i*2*Math.PI/n,A=(i+1)*2*Math.PI/n,r=rr[j],s=rr[j+1],mat=j<2?'roof':i%2?'roofWhite':'roof';face(mat,[[r*Math.cos(a),Y(r),r*Math.sin(a)],[r*Math.cos(A),Y(r),r*Math.sin(A)],[s*Math.cos(A),Y(s),s*Math.sin(A)],[s*Math.cos(a),Y(s),s*Math.sin(a)]],[0,1,0]);}
 cap(ellipse(1.5,1.5,near?24:12),Y(1.5),'metal');cyl('metal',0,0,1.2,Y(1.5),55.7784,1.0,near?24:12);
 // Narrow horizontal clerestory transoms and entry canopies, with founded short supports.
 for(const y of[27.65,29.7]){const r0=ellipse(R+.05,R+.05,n),r1=ellipse(R+.05,R+.05,n);for(let i=0;i<n;i++){const a=r0[i],c=r1[(i+1)%n];face('metal',[[a[0],y,a[1]],[c[0],y,c[1]],[c[0],y+.1,c[1]],[a[0],y+.1,a[1]]],[a[0],0,a[1]]);}}
 for(const a of[0,Math.PI/2,Math.PI]){const x=109*Math.cos(a),z=109*Math.sin(a);b.box('metal',[x,7.8,z],[18,.4,5],-a+Math.PI/2);for(const u of[-7.5,7.5]){const X=x-Math.sin(a)*u,Z=z+Math.cos(a)*u;b.bar('metal',[X,0,Z],[X,7.6,Z],.3);}}
 return flush(1.4*Math.PI/180);
}
