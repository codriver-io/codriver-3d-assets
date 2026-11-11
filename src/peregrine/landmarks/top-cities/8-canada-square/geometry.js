import * as THREE from 'three';import{assetBuilder}from'../../asset-geometry.js';import{SPEC,PALETTES}from'./config.js';import{PARTS}from'./footprint.js';import{kit}from'./8-canada-square-geometry-kit.js';
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=kit(b,THREE),cos=Math.cos(SPEC.origin[1]*Math.PI/180),r=id=>PARTS.find(p=>p.id===id).ring.slice(0,-1).map(([x,y])=>[(x-SPEC.origin[0])*111320*cos,(SPEC.origin[1]-y)*111320]);
 function block(r,lo,hi,floors){const sign=Math.sign(k.area(r));r.forEach((a,i)=>{const c=r[(i+1)%r.length],len=Math.hypot(c[0]-a[0],c[1]-a[1]),out=[sign*(c[1]-a[1]),0,sign*(a[0]-c[0])],pt=(s,y)=>[a[0]+(c[0]-a[0])*s,y,a[1]+(c[1]-a[1])*s],patch=(m,s,t,y,z)=>k.face(m,[pt(s,y),pt(t,y),pt(t,z),pt(s,z)],out);if(len<1.5){patch('frame',0,1,lo,hi);return;}
  const cols=Math.max(1,Math.round(len/(near?2.6:5.2))),rows=near?floors:Math.ceil(floors/2),pad=Math.min(.18/cols,(near?.075:.14)/len);
  for(let v=0;v<rows;v++){const y=lo+(hi-lo)*v/rows,z=lo+(hi-lo)*(v+1)/rows,band=near?1.15:1.65;patch('frame',0,1,y,y+band);for(let j=0;j<cols;j++)patch('glass',j/cols+pad,(j+1)/cols-pad,y+band,z);for(let j=0;j<=cols;j++)patch('frame',Math.max(0,j/cols-pad),Math.min(1,j/cols+pad),y+band,z);}
 });k.cap('roof',r,hi);if(lo===0)k.cap('frame',r,0,false);}
 block(r(183242123),0,8,2);block(r(432780680),8,186.3,40);
 // The four rounded perimeter screens enclose an actual recessed plant well.
 for(const id of[432780681,432780682,432780683,432780684])k.prism('crown',r(id),186.3,200,'roof');
 k.prism('plant',r(432985855),186.3,191,'plant');k.prism('plant',r(432985936),191,197,'plant');
 k.flush();return b.finish();
}
