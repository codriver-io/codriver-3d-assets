import * as THREE from 'three';
import { SPEC, PALETTES } from './config.js';
import { LOCAL_RINGS } from './footprint.js';
import { builder } from './berlin-fernsehturm-parts.js';
export function create({detail='near'}={}) {
 const {near,b,face,cap,frame,patch,walls,prism,rect,block,spin,cyl,hip,rows,finish}=builder(SPEC,PALETTES,detail);
 const shaft=[[16,0],[8,5],[7.8,35],[6.3,145],[4.6,196],[4.5,228]];
 spin(shaft,'stone',0,0,near?40:24,k=>k===4?'metal':'stone');
 cyl(0,0,6.3,191.4,192.1,'stone',near?40:24);cyl(0,0,5.9,194.5,195.2,'stone',near?40:24);
 const yy=new Set([196,228,202,205,207,210]);for(let y=196;y<=228;y+=near?2:4)yy.add(y);const sphere=[...yy].sort((a,b)=>a-b).map(y=>[Math.sqrt(Math.max(0,256-(y-212)**2)),y]);
 spin(sphere,'lamp',0,0,near?48:28,(k,j)=>{const y=(sphere[k][1]+sphere[k+1][1])/2;return (y>=202&&y<205||y>=207&&y<210)&&j%(near?7:5)!==0?'glass':'lamp';});
 spin([[4.6,228],[5.2,235],[5.2,246],[6,246],[6,248],[4.5,248.78]],'metal',0,0,near?32:20);
 const mast=[];for(let i=0;i<=16;i++){const t=i/16,y=248.78+t*(368.03-248.78),r=2.8*(1-t)+.15*t;mast.push([r,y]);}spin(mast,'metal',0,0,near?12:8,k=>k%2?'red':'metal');
return finish();
}
