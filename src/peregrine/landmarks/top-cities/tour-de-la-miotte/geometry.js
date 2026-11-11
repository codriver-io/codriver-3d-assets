import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {kit} from './tour-de-la-miotte-parts.js';
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{box,wall,cyl,near}=k;
 const W=4.78,D=3.62;
 box('stone',0,.23,0,W,.46,D);
 // Four hollow thick walls; slits and arched entrance remain true recessed holes.
 for(let i=0;i<4;i++){
  const a=i*Math.PI/2,w=i%2?D:W,r=i%2?W/2:D/2,holes=[];
  if(i===0)holes.push({u:0,y:.46,w:1.04,h:2.25,arch:true,mat:'shadow'});
  if(i===0||i===2)for(const y of [4.6,8.15])holes.push({u:0,y,w:.28,h:1.03,arch:true,mat:'shadow'});
  wall('stone',w,.46,10.8,.42,(r-.42)*Math.sin(a),(r-.42)*Math.cos(a),a,holes);
 }
 // Corbelled crown: small arched recesses separated by real stone piers.
 for(let i=0;i<4;i++){
  const a=i*Math.PI/2,w=i%2?D+.4:W+.4,r=(i%2?W:D)/2+.2;
  wall('trim',w,10.8,12.0,.48,(r-.48)*Math.sin(a),(r-.48)*Math.cos(a),a,[-1.5,-.75,0,.75,1.5].filter(x=>Math.abs(x)<w/2-.35).map(u=>({u,y:10.84,w:.42,h:.74,arch:true,mat:'shadow'})));
 }
 box('stone',0,12.07,0,W+.65,.25,D+.65);
 // Open flat-topped parapet, with raised corner merlons.
 for(const s of [-1,1]){box('stone',0,12.48,s*(D/2+.10),W+.44,.60,.32);box('stone',s*(W/2+.10),12.48,0,.32,.60,D+.44);}
 for(const x of [-W/2+.1,W/2-.1])for(const z of [-D/2+.1,D/2-.1])box('stone',x,12.89,z,.60,.22,.60);
 box('stone',0,12.15,0,W,.10,D);
 cyl('metal',.5,0,.035,.035,12.15,14.8,near?6:4);
 return k.finish();
}
