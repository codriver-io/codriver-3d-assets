import {SPEC,PALETTES}from'./config.js';import{kit}from'./tour-des-archives-rouen-parts.js';
export function create({detail='near'}={}){const{near,box,cyl,wall,finish}=kit(SPEC,PALETTES,detail);const cx=-1.618,cz=1.00965,w=24.3294,d=12.1111;
// Separate tower footing; no adjoining administrative block or terrain.
box('concrete',cx,1.5,cz,w,3,d);box('core',cx,45.5,cz,w-1.6,85,d-1.6);
// Claustra is pierced masonry with a dark storage core 0.65 m behind it.
for(const sign of[-1,1]){const n=near?10:6,rows=near?30:16,holes=[];for(let j=0;j<rows;j++)for(let i=0;i<n;i++)holes.push({u:-w/2+(i+.5)*w/n,y:4.2+j*82/rows,w:w/n*.58,h:82/rows*.60});wall('screen',w,3,88,.22,cx,cz+sign*(d/2-.22),sign===1?0:Math.PI,holes);}
// Narrow flanks are solid concrete with recessed vertical service slots.
for(const sign of[-1,1]){const h=[];for(let j=0;j<(near?27:14);j++)h.push({u:0,y:4+j*82/(near?27:14),w:.45,h:1.65});wall('concrete',d-.44,3,88,.22,cx+sign*(w/2-.22),cz,sign===1?Math.PI/2:-Math.PI/2,h);}
box('concrete',cx,88.5,cz,w+.65,1,d+.65);box('metal',cx,89.08,cz,6,.16,5);cyl('metal',cx,cz,.15,.10,89.16,101.6,near?10:6);cyl('metal',cx,cz,.08,.02,101.6,104,near?8:5);return finish();}
