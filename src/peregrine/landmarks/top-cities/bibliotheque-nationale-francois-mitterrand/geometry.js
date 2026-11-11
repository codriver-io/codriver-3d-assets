import{assetBuilder}from'../../asset-geometry.js';import{SPEC,PALETTES}from'./config.js';import{FOOTPRINTS}from'./footprint.js';import{local,simplify,surfaces}from'./bibliotheque-nationale-francois-mitterrand-parts.js';
export const BOOKS=FOOTPRINTS.map(r=>simplify(local(r,SPEC.origin),.12));
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),s=surfaces(b);
 for(const plan of BOOKS)s.shell(plan,79,{pitch:79/(near?22:11),bay:near?2.5:5,band:near?.28:.45,mullion:near?.09:.14,glass:(side,col,y)=>side%3===1&&(col+Math.round(y/(79/(near?22:11))))%(near?4:2)<(near?3:1)&&y>16?'wood':'glass'});
 const model=s.finish();model.userData.identity='four inward-facing79 m open-book glass towers';return model;
}
