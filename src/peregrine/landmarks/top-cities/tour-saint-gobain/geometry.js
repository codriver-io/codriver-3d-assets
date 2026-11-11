import{assetBuilder}from'../../asset-geometry.js';import{SPEC,PALETTES}from'./config.js';import{FOOTPRINTS}from'./footprint.js';import{local,simplify,surfaces}from'./tour-saint-gobain-parts.js';
export const BODY=simplify(local(FOOTPRINTS[0],SPEC.origin),.25),SHOWROOM=simplify(local(FOOTPRINTS[1],SPEC.origin),.25),CROWN=BODY.map(([x,z])=>[x*.92+1.2,z*.92-.6]);
const minX=Math.min(...CROWN.map(p=>p[0])),maxX=Math.max(...CROWN.map(p=>p[0]));export const crownY=(x,z)=>178-6*(x-minX)/(maxX-minX);
const lo=Math.min(...SHOWROOM.map(p=>p[1])),hi=Math.max(...SHOWROOM.map(p=>p[1]));export const showroomY=(x,z)=>20+7*(z-lo)/(hi-lo);
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),s=surfaces(b);
 s.shell(BODY,154,{glass:(side,col,y)=>(side===0||side===2)&&col===(near?2:1)&&y>27?'garden':'glass',pitch:near?3.65:7.3,bay:near?2.4:4.8,band:near?.5:.7,mullion:near?.08:.13});
 s.shell(CROWN,crownY,{bottom:154,pitch:near?3.3:6.6,bay:near?1.6:3.2,band:near?.15:.22,mullion:near?.08:.13,glass:'glassPale'});
 s.shell(SHOWROOM,showroomY,{pitch:near?3.5:7,bay:near?2:4,band:.12,mullion:.1,glass:'glassPale'});
 const model=s.finish();model.userData.identity='three rhombohedral glass crystals: tall ribboned body,upper lantern and sloping showroom';return model;
}
