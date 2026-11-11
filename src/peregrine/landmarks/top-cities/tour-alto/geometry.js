import{assetBuilder}from'../../asset-geometry.js';import{SPEC,PALETTES}from'./config.js';import{FOOTPRINTS}from'./footprint.js';import{local,simplify,surfaces}from'./tour-alto-parts.js';
export const PLAN=simplify(local(FOOTPRINTS[0],SPEC.origin),.23);if(PLAN.reduce((s,a,i)=>{const c=PLAN[(i+1)%PLAN.length];return s+a[0]*c[1]-c[0]*a[1];},0)<0)PLAN.reverse();
export const flare=y=>.62+.38*Math.pow(y/160,.85);
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),s=surfaces(b),rows=near?40:20,pitch=160/rows;
 PLAN.forEach((a,side)=>{const c=PLAN[(side+1)%PLAN.length],len=Math.hypot(c[0]-a[0],c[1]-a[1]),cols=Math.max(1,Math.round(len/(near?2.2:4.4)));
 const point=(u,y)=>[(a[0]+u*(c[0]-a[0]))*flare(y)-2*(1-y/160),y,(a[1]+u*(c[1]-a[1]))*flare(y)+2*(1-y/160)];
 for(let row=0;row<rows;row++){const y0=row*pitch,y1=(row+1)*pitch,band=near?.2:.3,offset=(row%2?1:-1)*.1/cols;
 const u=(i,upper)=>i/cols+((i===0||i===cols)?0:offset*(upper?-1:1));
 for(let col=0;col<cols;col++){
  const l0=u(col,false),r0=u(col+1,false),l1=u(col,true),r1=u(col+1,true),mw=Math.min(.18/len,(r0-l0)*.2),mat=(row+side+col)%5===0?'glassPale':'glass';
  const lb=l0+(l1-l0)*band/pitch,rb=r0+(r1-r0)*band/pitch;
  s.quad('frame',point(l0,y0),point(l1,y1),point(l1+mw,y1),point(l0+mw,y0));
  s.quad('frame',point(l0+mw,y0),point(lb+mw,y0+band),point(rb,y0+band),point(r0,y0));
  s.quad(mat,point(lb+mw,y0+band),point(l1+mw,y1),point(r1,y1),point(rb,y0+band));
 }
 }
 });s.cap(PLAN,160,'roof');s.cap(PLAN.map(([x,z])=>[x*.62-2,z*.62+2]),0,'frame',false);const model=s.finish();model.userData.identity='asymmetrical flaring vase and staggered glass scales';return model;
}
