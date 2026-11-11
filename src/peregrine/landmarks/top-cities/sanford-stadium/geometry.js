import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {SE_SERVICE,PRESS_ROOF,PRESS_CORE,LIFT_CORE,AERIAL_CONTROLS} from './controls.js';
import {tools} from './sanford-stadium-parts.js';
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),t=tools(b,near);

 const{rect,prism,face,cap,wall,flush}=t;
 // Field markings are adjacent turf/paint strips in the same raised plane, not decals.
 for(let i=0;i<25;i++){const x=-54.864+i*4.572,l=i===24?54.864:x+.12;if(i<24)cap(rect(4.452,48.768,x+2.346,0),.15,'turf');cap(rect(Math.max(.12,l-x),48.768,x+.06,0),.15,'paint');}
 // Thin privet hedge strips remain separated from the football playing surface.
 for(const z of[-28.8,28.8])prism(rect(116,1.4,0,z),.15,1.4,'turf');for(const x of[-59,59])prism(rect(1.4,58,x,0),.15,1.4,'turf');
 function rounded(w,d,r,n){const out=[];for(const[cx,cz,a0]of[[w/2-r,d/2-r,0],[-w/2+r,d/2-r,Math.PI/2],[-w/2+r,-d/2+r,Math.PI],[w/2-r,-d/2+r,Math.PI*1.5]])for(let i=0;i<n;i++){const a=a0+i*Math.PI/2/n;out.push([cx+r*Math.cos(a),cz+r*Math.sin(a)]);}return out;}
 const n=near?24:16,inner=rounded(150,82,28,n),outer=rounded(216,168,66,n),N=inner.length,rows=near?32:14;
 cap(inner,.15,'concrete',true,[rect(109.848,48.768,.06,0)]);
 const point=(i,f,y)=>[inner[i][0]+(outer[i][0]-inner[i][0])*f,y,inner[i][1]+(outer[i][1]-inner[i][1])*f];
 for(let i=0;i<N;i++){const j=(i+1)%N,aisle=i%(near?6:4)===0,out=[outer[i][0],0,outer[i][1]];
 for(let row=0;row<rows;row++){const f=row/rows,g=(row+1)/rows,y=1+23*f,Y=1+23*g;face(aisle?'concrete':'seat',[point(i,f,y),point(j,f,y),point(j,g,y),point(i,g,y)],[0,1,0]);if(row<rows-1)face('concrete',[point(i,g,y),point(j,g,y),point(j,g,Y),point(i,g,Y)],out.map(v=>-v));}
 face('concrete',[point(i,0,.3),point(i,1,22.2),point(j,1,22.2),point(j,0,.3)],[0,-1,0]);face('concrete',[point(i,1,22.2),point(i,1,1+23*(rows-1)/rows),point(j,1,1+23*(rows-1)/rows),point(j,1,22.2)],out);face('concrete',[point(i,0,.3),point(j,0,.3),point(j,0,1),point(i,0,1)],out.map(v=>-v));
 const a=outer[i],c=outer[j];wall(a,c,0,7.8,'brick',{floors:1,margin:.22});if(i%(near?3:2)===0)b.box('concrete',[a[0],11.1,a[1]],[1.5,22.2,1.5]);}
 // Separate straight upper decks; support columns keep their undercrofts visibly open.
 function deck(side,z0,z1,x0,x1,y0,y1,r,segments){const dx=(x1-x0)/segments;for(let i=0;i<segments;i++){const x=x0+i*dx,c=x+dx,aisle=i%4===0;for(let j=0;j<r;j++){const f=j/r,g=(j+1)/r,z=side*(z0+(z1-z0)*f),Z=side*(z0+(z1-z0)*g),y=y0+(y1-y0)*f,Y=y0+(y1-y0)*g;face(aisle?'concrete':'seat',[[x,y,z],[c,y,z],[c,y,Z],[x,y,Z]],[0,1,0]);if(j<r-1)face('concrete',[[x,y,Z],[c,y,Z],[c,Y,Z],[x,Y,Z]],[0,0,-side]);}
 face('concrete',[[x,y0-2.5,side*z0],[x,y1-2.5,side*z1],[c,y1-2.5,side*z1],[c,y0-2.5,side*z0]],[0,-1,0]);face('concrete',[[x,y1-2.5,side*z1],[x,y1-(y1-y0)/r,side*z1],[c,y1-(y1-y0)/r,side*z1],[c,y1-2.5,side*z1]],[0,0,side]);face('red',[[x,y0-2.5,side*z0],[c,y0-2.5,side*z0],[c,y0,side*z0],[x,y0,side*z0]],[0,0,-side]);
 if(i%4===0){b.box('concrete',[x,(y1-2.5)/2,side*(z1-1)],[1.5,y1-2.5,1.5]);b.bar('concrete',[x,7,side*(z1-1)],[x,y0-2.5,side*z0],1.2);}}
 for(const x of[x0,x1])face('concrete',[[x,y0-2.5,side*z0],[x,y1-2.5,side*z1],[x,y1-(y1-y0)/r,side*z1],[x,y0,side*z0]],[x===x0?-1:1,0,0]);}
 deck(-1,67,94,-78,80,27,45,near?22:10,near?32:16);deck(1,67,95,-78,75,27,45,near?22:10,near?32:16);deck(-1,95,114,-73,77,47,63,near?16:8,near?32:16);
 // North upper rear facade with a retained glazed rhythm; south two-level SkySuites.
 prism(rect(153,7,2,111),58,65,'concrete',{floors:1,bays:35,margin:.24,roof:'steel',bottom:false});
 prism(rect(100,14,22,100),46,61,'steel',{floors:2,bays:30,margin:.18,trim:'red',bottom:false,roof:'steel'});for(const x of[-24,0,24,48,72])b.box('concrete',[x,23,100],[1.8,46,1.8]);
 // Completed southeast service deck follows every mapped perimeter step in
 // both LODs. Roofed service units sit on the raised, otherwise open apron.
 prism(SE_SERVICE,0,7.8,'brick',{top:false,bottom:false});prism(SE_SERVICE,7.8,AERIAL_CONTROLS.concourseTopM,'concrete',{bottom:false});
 for(const[x,z,w,d]of[[122,17,7,9],[136,48,8,12],[122,78,11,7]])prism(rect(w,d,x,z),8,11.4,'concrete',{floors:1,bays:2,margin:.27,roof:'paint',bottom:false});
 // Current orthophoto controls replace the estimated rectangular overhang.
 // The curved founded core, glazed two-level roof and end lift tower join.
 prism(PRESS_CORE,0,39,'concrete',{floors:4,margin:.37,roof:'concrete',bottom:false});prism(PRESS_ROOF,39,53.5,'steel',{floors:2,margin:.15,trim:'red',roof:'steel',bottom:false});prism(LIFT_CORE,0,55,'steel',{roof:'steel',bottom:false});
 // West-end blank scoreboard on its concrete portal; no screen image or sponsor text.
 for(const z of[-13,13])b.box('concrete',[-104,18,z],[2.4,36,2.4]);b.box('steel',[-104,36,0],[2,17,33]);b.box('glass',[-102.4,36,0],[1.2,15.5,31.5]);
 // Four founded north lighting frames over the high deck.
 for(const x of[-62,-22,22,62]){for(const dx of[-2.5,2.5])b.box('steel',[x+dx,36,112],[.35,72,.35]);for(let y=64;y<72;y+=2){b.bar('steel',[x-2.5,y,112],[x+2.5,y+2,112],.18);b.bar('steel',[x+2.5,y,112],[x-2.5,y+2,112],.18);}b.box('steel',[x,72.25,112],[7,.5,.6]);for(const dx of[-2.5,-1.25,0,1.25,2.5])b.box('paint',[x+dx,73.75,112],[.8,2.5,.7]);}
 return flush(-25.8*Math.PI/180);
}
