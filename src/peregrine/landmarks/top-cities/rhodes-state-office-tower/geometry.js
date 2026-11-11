import * as THREE from 'three';import {SPEC,PALETTES} from './config.js';import {kit} from './rhodes-state-office-tower-kit.js';
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,wall,quad,poly,beam,cyl}=k;
 // Exact mapped podium perimeter, with the southeast notch retained.
 const p=[[-27.76,-29.45],[30.12,-29.11],[29.77,15.97],[17.6,15.88],[17.51,27.39],[-27.76,27.08]];
 const sh=new THREE.Shape(p.map(q=>new THREE.Vector2(...q)));const g=new THREE.ExtrudeGeometry(sh,{depth:6.6,bevelEnabled:false});g.rotateX(Math.PI/2);g.translate(0,6.6,0);k.put(g,'stone');
 const cx=-3,cz=-1,W=45,D=48,y0=6.6,H=184.5;
 // Tall east/west faces. Actual recessed window bands and giant four-bay crown openings.
 for(const side of [-1,1]){
  const a=side*Math.PI/2,x=cx+side*W/2,holes=[];
  for(let i=0;i<36;i++)holes.push({u:0,y:15+i*4.4,w:17.3,h:2.8,mat:'glass'});
  for(const u of [-4.5,4.5])holes.push({u,y:175.8,w:8.1,h:6.6,mat:'roof'});
  holes.push({u:0,y:7.2,w:17.3,h:5.5,mat:'glass'});
  wall('stone',D,y0,H,.8,x,cz,a,holes);
  // A 36% recessed central zone sits between two continuous, projecting granite shafts.
  for(const sign of [-1,1]){const h=sign===-side?191.72:180;box('stone',x+side*1.0,(h+y0)/2,cz+sign*16.325,2.8,h-y0,15.35);}
  // Separate rows and coarser central mullions survive in both LODs.
  for(const u of [-8.55,0,8.55])box('stone',x+side*.45,92,cz-u,.52,171.8,.48);
  if(near)for(let i=-5;i<=5;i++){const u=i*1.5;const X=x+side*.28;quad('metal',[X,15,cz+u-.045],[X,173,cz+u-.045],[X,173,cz+u+.045],[X,15,cz+u+.045],[side,0,0]);}
 }
 // Narrow north/south window strips flanked by solid service cores.
 for(const side of [-1,1]){
  const z=cz+side*D/2,a=side>0?0:Math.PI,holes=[];
  for(let i=0;i<36;i++)holes.push({u:0,y:15+i*4.4,w:14.4,h:2.8,mat:'glass'});
  wall('stone',W,y0,177,.8,cx,z,a,holes);
  for(const u of [-4.8,0,4.8])box('stone',cx+u,93,z+side*.45,.35,168,.45);
 }
 // Opposed shafts rise above the broad crown; they create the characteristic cleft skyline.
 for(const side of [-1,1]){
  box('stone',cx+side*18.5,(191.72+6.6)/2,cz-side*19.5,8,191.72-6.6,9);
  box('stone',cx-side*15.5,(180+6.6)/2,cz-side*20,6,180-6.6,8);
 }
 // Roof closes the tower without filling the mechanical recesses.
 box('roof',cx,174.8,cz,W-.5,.35,D-.5);
 // Antenna cage: open framing, not a solid rooftop spike.
 const ax=cx+18.5,az=cz-19.5;
 for(const x of [-2,2])for(const z of [-2,2])beam('metal',[ax+x,191.72,az+z],[ax+x,198.7,az+z],.24);
 for(const y of [192.3,195.1,198.2])for(const s of [-1,1]){beam('metal',[ax-2,y,az+s*2],[ax+2,y,az+s*2],.18);beam('metal',[ax+s*2,y,az-2],[ax+s*2,y,az+2],.18);}
 for(const s of [-1,1]){beam('metal',[ax-2,192.3,az+s*2],[ax+2,198.2,az+s*2],.14);beam('metal',[ax+s*2,192.3,az-2],[ax+s*2,198.2,az+2],.14);}
 for(const x of [-2,0,2])for(const z of [-2,2])cyl('metal',ax+x,az+z,.10,.06,198.2,201.72,near?8:5);
 const root=k.finish();root.userData.centralWindowRatio=17.3/D;root.userData.architecturalHeight=191.72;return root;
}
