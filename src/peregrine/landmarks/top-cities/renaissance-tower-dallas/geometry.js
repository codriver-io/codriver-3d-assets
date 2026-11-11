import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {tools} from './renaissance-tower-dallas-parts.js';
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),t=tools(b,near);

 const {rect,prism,wall,cap,face,flush}=t;
 function clip(poly,slope,bound,positive){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],c=poly[(i+1)%poly.length],da=a[1]-slope*a[0]-bound,dc=c[1]-slope*c[0]-bound,ia=positive?da>=0:da<=0,ic=positive?dc>=0:dc<=0;if(ia)out.push(a);if(ia!==ic){const t=da/(da-dc);out.push([a[0]+(c[0]-a[0])*t,a[1]+(c[1]-a[1])*t]);}}return out;}
 const ring=rect(56.6,57.3,17.55,-6.9);
 ring.forEach((a,i)=>{const c=ring[(i+1)%4],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),rows=near?56:28,cols=near?16:8,out=[dz,0,-dx],p=(s,y)=>[a[0]+dx*s,y,a[1]+dz*s];
  // Flush curtain-wall tiles retain the large X motif without a layered overlay.
  for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
   const l=col/cols,r=(col+1)/cols,lo=row*220/rows,hi=(row+1)*220/rows,mu=(near?.035:.025)/cols,my=near?.12:.2;
   if(col===0){face('stone',[p(0,lo),p(1,lo),p(1,lo+my),p(0,lo+my)],out);face('stone',[p(0,hi-my),p(1,hi-my),p(1,hi),p(0,hi)],out);}
   face('stone',[p(l,lo+my),p(l+mu,lo+my),p(l+mu,hi-my),p(l,hi-my)],out);face('stone',[p(r-mu,lo+my),p(r,lo+my),p(r,hi-my),p(r-mu,hi-my)],out);
   let polys=[[[l+mu,(lo+my)/220],[r-mu,(lo+my)/220],[r-mu,(hi-my)/220],[l+mu,(hi-my)/220]]];
   for(const[slope,offset]of [[1,0],[-1,1]]){const next=[];for(const poly of polys){const low=clip(poly,slope,offset-.007,false),high=clip(poly,slope,offset+.007,true),band=clip(clip(poly,slope,offset-.007,true),slope,offset+.007,false);if(low.length>=3)next.push(low);if(high.length>=3)next.push(high);if(band.length>=3)face('stone',band.map(([x,y])=>p(x,y*220)),out);}polys=next;}
   for(const poly of polys)face('glass',poly.map(([x,y])=>p(x,y*220)),out);
  }
 });cap(ring,220,'roof');cap(ring,0,'stone',false);
 function mast(cx,cz,height,radius){const steps=near?8:4;const level=i=>{const y=220+height*i/steps,r=radius*(1-i/steps);return [[cx-r,y,cz-r],[cx+r,y,cz-r],[cx+r,y,cz+r],[cx-r,y,cz+r]];};for(let i=0;i<steps;i++){const a=level(i),c=level(i+1);for(let k=0;k<4;k++){b.bar('metal',a[k],c[k],near?.45:.6);if(i<steps-1)b.bar('metal',c[k],c[(k+1)%4],near?.27:.35);b.bar('metal',a[k],c[(k+1)%4],near?.23:.30);}}}
 mast(17.55,-6.9,50,4.7);for(const x of [-6,41])for(const z of [-31,17])mast(x,z,12,2.1);
 // Separate low glass pavilion; footprint is the actual mapped trapezoid.
 const pav=[[-47.1,22],[-16.2,22],[-29.4,9.2],[-34.9,3.9],[-48,-8.8]];
 prism(pav,0,5,'stone',{floors:1,margin:.05});const apex=[-36,14,12];pav.forEach((p,i)=>{const q=pav[(i+1)%pav.length];face('glass',[[p[0],5,p[1]],[q[0],5,q[1]],apex],[0,1,0]);});
 return flush(14*Math.PI/180);
}
