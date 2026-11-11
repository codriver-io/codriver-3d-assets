import * as THREE from 'three';import{assetBuilder}from'../../asset-geometry.js';import{SPEC,PALETTES}from'./config.js';import{PARTS}from'./footprint.js';import{kit}from'./one-canada-square-geometry-kit.js';
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=kit(b,THREE),cos=Math.cos(SPEC.origin[1]*Math.PI/180),r=id=>PARTS.find(p=>p.id===id).ring.slice(0,-1).map(([x,y])=>[(x-SPEC.origin[0])*111320*cos,(SPEC.origin[1]-y)*111320]);
 function block(r,lo,hi,floors){const sign=Math.sign(k.area(r));r.forEach((a,i)=>{const c=r[(i+1)%r.length],len=Math.hypot(c[0]-a[0],c[1]-a[1]),out=[sign*(c[1]-a[1]),0,sign*(a[0]-c[0])],pt=(s,y)=>[a[0]+(c[0]-a[0])*s,y,a[1]+(c[1]-a[1])*s],patch=(m,s,t,y,z)=>k.face(m,[pt(s,y),pt(t,y),pt(t,z),pt(s,z)],out);if(len<1.5){patch('frame',0,1,lo,hi);return;}
  const cols=Math.max(1,Math.round(len/(near?2.8:5.6))),rows=near?floors:Math.ceil(floors/2),pad=Math.min(.18/cols,(near?.22:.35)/len);
  for(let v=0;v<rows;v++){const y=lo+(hi-lo)*v/rows,z=lo+(hi-lo)*(v+1)/rows,band=near?.65:1.0;patch('frame',0,1,y,y+band);for(let j=0;j<cols;j++)patch('glass',j/cols+pad,(j+1)/cols-pad,y+band,z);for(let j=0;j<=cols;j++)patch('frame',Math.max(0,j/cols-pad),Math.min(1,j/cols+pad),y+band,z);}
 });k.cap('roof',r,hi);if(lo===0)k.cap('base',r,0,false);}
 const outer=r(5986754),upper=r(432777467),crown=r(432777466);block(outer,0,194,46);block(upper,194,210,4);
 // Full square pyramid; near/far preserve its 25 m rise and four planar slopes.
 const center=crown.reduce((a,p)=>[a[0]+p[0]/crown.length,a[1]+p[1]/crown.length],[0,0]);
 const point=(p,y)=>[center[0]+(p[0]-center[0])*(235-y)/25,y,center[1]+(p[1]-center[1])*(235-y)/25];
 const rows=near?30:12;for(let i=0;i<crown.length;i++){const a=crown[i],c=crown[(i+1)%crown.length],out=[(a[0]+c[0])/2-center[0],12,(a[1]+c[1])/2-center[1]];for(let j=0;j<rows;j++){const y=210+25*j/rows,z=210+25*(j+1)/rows,band=y+(near?.14:.23);k.face('vent',[point(a,y),point(c,y),point(c,band),point(a,band)],out);if(j===rows-1)k.face('roof',[point(a,band),point(c,band),[center[0],235,center[1]]],out);else k.face('roof',[point(a,band),point(c,band),point(c,z),point(a,z)],out);}}
 k.flush();return b.finish();
}
