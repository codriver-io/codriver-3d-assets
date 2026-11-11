import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {LOCAL_RINGS} from './footprint.js';
import {kit} from './iglesia-merced-san-jose-parts.js';
export const TIERS=[{y:10.2,h:4.2,n:2},{y:15.8,h:3.5,n:2},{y:21.1,h:3.6,n:1}];
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,wall,poly,bar}=k;
 // Lower mapped cross and the raised central nave. The tower owns the west projection.
 k.shell('stone',LOCAL_RINGS,0,7.1,[1.1],near?6:8);
 for(const x of [-6.7,6.7])wall('stone',59.6,7.1,11,.7,x,0,x>0?Math.PI/2:-Math.PI/2,Array.from({length:near?9:6},(_,i)=>({u:(i-(near?4:2.5))*5.7,y:7.6,w:1.6,h:2.5,arch:true,mat:'glass'})));
 // Long nave roof and the two low aisle planes meet actual wall bearings.
 function planeRoof(a,b,c,d){const p=[a,b,c,d],n=new THREE.Vector3(...b).sub(new THREE.Vector3(...a)).cross(new THREE.Vector3(...c).sub(new THREE.Vector3(...a)));if(n.y<0)p.reverse();poly('roof',p,[0,1,2,0,2,3]);}
 planeRoof([-7.4,11.0,-29.8],[0,15,-29.8],[0,15,29.7],[-7.4,11.0,29.7]);
 planeRoof([0,15,-29.8],[7.4,11.0,-29.8],[7.4,11.0,29.7],[0,15,29.7]);
 for(const s of [-1,1])planeRoof([s*5.7,8.9,-.6],[s*8.05,7.1,-.6],[s*8.05,7.1,29.8],[s*5.7,8.9,29.8]);
 for(const z of [-29.8,29.7])poly('stone',[[-7.4,11.0,z],[7.4,11.0,z],[0,15,z]],z>0?[0,1,2]:[0,2,1]);
 // Transept at the mapped rear cross; gabled end walls keep its roof grounded.
 for(const x of [-20,19.1])wall('stone',16.3,7.0,10.7,.7,x,-9.6,x>0?Math.PI/2:-Math.PI/2,[{u:0,y:7.3,w:2.8,h:3,arch:true,mat:'glass'}]);
 for(const z of [-17.1,-1.0])wall('stone',39.3,7.0,10.7,.7,-.45,z,z> -2?0:Math.PI);
 k.gable('roof',-20.4,19.5,10.7,14.1,17,-9.3);
 // Front: side pointed lights, sloped shoulders, corner buttresses, projecting porch.
 wall('stone',15.6,7.1,12.2,.65,0,29.25,0,[-5.1,5.1].map(u=>({u,y:7.25,w:2.65,h:4.6,arch:true,mat:'glass'})));
 for(const s of [-1,1]){
  poly('stone',[[s*2.75,16,29.9],[s*7.8,12.2,29.9],[s*2.75,12.2,29.9]],s>0?[0,2,1]:[0,1,2]);
  for(const z of [29.8,19,8]){box('trim',s*7.7,5.0,z,.65,10,.9);box('trim',s*7.7,10,z,.85,.35,1.1);}
 }
 // Main single tower and its genuine pointed windows/open upper bell arches.
 const tz=31.0;
 const front=[{u:0,y:.4,w:3.3,h:5.3,arch:true,mat:'glass'},...TIERS.flatMap(t=>Array.from({length:t.n},(_,i)=>({u:(i-(t.n-1)/2)*2.15,y:t.y,w:t.n===1?2.9:1.65,h:t.h,arch:true,...(t.y<16?{mat:'glass'}:{})})))];
 for(let i=0;i<4;i++){const a=i*Math.PI/2;wall('stone',5.6,0,25.5,.55,2.25*Math.sin(a),tz+2.25*Math.cos(a),a,i===0?front:TIERS.filter(t=>t.y>=15).flatMap(t=>Array.from({length:t.n},(_,j)=>({u:(j-(t.n-1)/2)*2.15,y:t.y,w:t.n===1?2.9:1.65,h:t.h,arch:true}))));}
 for(const y of [.3,9.3,14.9,20.2,25.6])box('trim',0,y,tz,5.95,.35,5.95);
 for(const x of [-2.9,2.9])for(const z of [28.1,33.9]){box('trim',x,17.7,z,.38,15.6,.38);}
 // Tall pyramidal red spire, clock gable and smaller flanking pinnacles.
 function spire(x,z,r,y,h){const g=new THREE.ConeGeometry(r,h,4,1,false);g.rotateY(Math.PI/4);g.translate(x,y+h/2,z);k.put(g,'roof');}
 spire(0,tz,4.15,25.5,15.0);
 for(const s of [-1,1]){box('stone',s*3.5,13.25,tz,.9,4.0,1.1);spire(s*3.5,tz,.85,15.25,4.5);bar('metal',[s*3.5,19.6,tz],[s*3.5,20.2,tz],.09);}
 const gf=new THREE.Shape([[-2.8,25.7],[2.8,25.7],[0,29.8]].map(p=>new THREE.Vector2(...p)));
 const hole=new THREE.Path();hole.absellipse(0,27.5,.68,.68,0,Math.PI*2,true);gf.holes.push(hole);const gg=new THREE.ExtrudeGeometry(gf,{depth:.3,bevelEnabled:false});gg.translate(0,0,34);k.put(gg,'stone');
 const dial=new THREE.CircleGeometry(.7,near?24:12);dial.translate(0,27.5,34.14);k.put(dial,'clock');
 bar('metal',[0,27.5,34.2],[.38,27.9,34.2],.07);bar('metal',[0,27.5,34.2],[-.35,27.2,34.2],.06);
 bar('metal',[0,40.3,tz],[0,41.8,tz],.1);bar('metal',[-.45,41.3,tz],[.45,41.3,tz],.1);
 // Entrance gable and real recessed lancet porch, with no copied stained glass.
 wall('trim',5.2,0,6.4,.45,0,34.0,0,[{u:0,y:.3,w:3.8,h:5.6,arch:true,mat:'glass'}]);
 poly('stone',[[-2.6,6.4,34.45],[2.6,6.4,34.45],[0,9.4,34.45]],[0,1,2]);
 for(const s of [-1,1])box('trim',s*2.65,3.3,34.1,.55,6.6,.85);
 // Small scale rhythm on the long spire, reduced to its four ridges at far.
 if(near)for(const s of [-1,1])for(let j=0;j<10;j++){const y=27+j*1.15,r=2.85*(1-(y-25.5)/15);box('trim',s*r,y,tz+r,.12,.16,.16);}

 return k.finish();
}
