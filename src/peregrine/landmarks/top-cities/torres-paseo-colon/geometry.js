import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {kit} from './torres-paseo-colon-parts.js';
export const TOWERS=[{z:25.7,height:98.2,levels:19,step:3.3},{z:-24.8,height:101.4,levels:21,step:3.2}];
export function balconyEdge(z,detail='near'){const n=detail==='far'?2:8;return Array.from({length:n+1},(_,i)=>{const q=-14.4+i*28.8/n;return[-24.0-2.5*Math.cos(q*Math.PI/28.8),z+q];});}
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,wall,bar,poly}=k;
 function panel(m,a,b,y0,y1){const v=[[a[0],y0,a[1]],[b[0],y0,b[1]],[b[0],y1,b[1]],[a[0],y1,a[1]]];poly(m,v,[0,1,2,0,2,3]);}
 for(const t of TOWERS){
  const edge=balconyEdge(t.z,detail),ring=[...edge,[-4.6,t.z+14.4],[-4.6,t.z-14.4]],podium=[...edge,[25,t.z+14.4],[25,t.z-14.4]];
  // Low parking/commercial annex and western office floors share one rigid podium.
  box('stone',10.2,15.0,t.z,28.2,30,26.4);
  // Dark horizontal ventilation slots are real openings on the exposed annex faces.
  for(const sign of [-1,1]){
   const hs=Array.from({length:7},(_,i)=>({u:0,y:4.7+i*3.1,w:27.4,h:.7,mat:'shadow'}));
   wall('stone',29.6,0,30.4,.65,10.2,t.z+sign*14.4-(sign>0?.65:-.65),sign>0?0:Math.PI,hs);
  }
  // The annex core does not back-fill the ventilation slots: its inner mass is inset.
  for(let level=0;level<=9;level++){
   const y=level*3.35;k.prism('stone',podium,y,y+.28);
   if(level<9){for(let i=0;i<edge.length-1;i++)panel('glass',edge[i].map((v,j)=>j===0?v+.5:v),edge[i+1].map((v,j)=>j===0?v+.5:v),y+.28,y+3.35);}
  }
  for(const p of edge)bar('trim',[p[0]+.35,.25,p[1]],[p[0]+.35,30.4,p[1]],.12);
  // Upper end walls are blank central shear walls, with paired vertical window strips.
  for(const sign of [-1,1]){
   const openings=[];for(let j=0;j<t.levels;j++)for(const u of [-7.2,7.2])openings.push({u,y:30.5+j*t.step+.45,w:2.7,h:t.step-1.0,mat:'glass'});
   wall('stone',20.2,30.35,t.height,.65,-14.5,t.z+sign*14.4-(sign>0?.65:-.65),sign>0?0:Math.PI,openings);
  }
  // Rear wall rhythm and set-back glazing keep balcony recesses physically open.
  wall('stone',28.8,30.35,t.height,.65,-5.25,t.z,Math.PI/2,Array.from({length:t.levels},(_,j)=>({u:0,y:30.8+j*t.step,w:20,h:1.8,mat:'glass'})));
  for(let j=0;j<t.levels;j++){
   const y=30.4+j*t.step;
   k.prism('stone',ring,y,y+.30);
   panel('glass',[-21.0,t.z-13.6],[-21.0,t.z+13.6],y+.3,y+t.step);
   // Curving front fascia and supported metal guardposts, retained at both LODs.
   for(let i=0;i<edge.length;i++){
    const p=edge[i];bar('metal',[p[0]+.2,y+.18,p[1]],[p[0]+.2,y+1.25,p[1]],.09);
    if(i<edge.length-1){const q=edge[i+1];bar('rail',[p[0]+.2,y+1.18,p[1]],[q[0]+.2,y+1.18,q[1]],.075);}
   }
   for(const p of [edge[0],edge.at(-1)]){const q=[-4.6,p[1]];panel('stone',...(p[1]<t.z?[q,p]:[p,q]),y+.3,y+.85);}
  }
  // Stepped top: blue central penthouse, two lower wings and pale open terrace rim.
  const roofY=30.4+t.levels*t.step;
  k.prism('stone',ring,roofY,roofY+.35);
  // Rounded upper balcony screen follows the western plan curve; end shear walls stay tallest.
  for(let i=0;i<edge.length-1;i++){
   const p=edge[i],q=edge[i+1],high=v=>roofY+.8+(t.height-roofY-1.6)*Math.cos((v[1]-t.z)*Math.PI/28.8);
   const hp=high(p),hq=high(q);
   poly('glass',[[p[0]+1,roofY+.35,p[1]],[q[0]+1,roofY+.35,q[1]],[q[0]+1,hq,q[1]],[p[0]+1,hp,p[1]]],[0,1,2,0,2,3]);
   poly('stone',[[p[0],hp,p[1]],[q[0],hq,q[1]],[q[0],hq+.35,q[1]],[p[0],hp+.35,p[1]]],[0,1,2,0,2,3]);
   poly('stone',[[p[0],hp+.35,p[1]],[q[0],hq+.35,q[1]],[-5,hq+.35,q[1]],[-5,hp+.35,p[1]]],[0,1,2,0,2,3]);
  }
  for(const sign of [-1,1])box('stone',-14.7,roofY+.9,t.z+sign*12.6,18,1.1,1.0);
 }
 return k.finish();
}
