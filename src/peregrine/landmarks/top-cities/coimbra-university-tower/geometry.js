import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {kit} from './coimbra-university-tower-parts.js';
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,wall,cyl,lathe,bar}=k;
 const holes=[{u:0,y:.25,w:1.3,h:2.8,arch:true,mat:'shadow'},...[6,10.2,14.4].map(y=>({u:0,y,w:.65,h:1.35,mat:'shadow'})),{u:0,y:18.8,w:1.5,h:.75,arch:true,mat:'shadow'}];
 for(let i=0;i<4;i++){const a=i*Math.PI/2;wall('stone',5.8,0,21.25,.6,2.3*Math.sin(a),2.3*Math.cos(a),a,holes);}
 // Tall corner pilasters and the horizontal entablatures are joined into the masonry.
 for(const x of [-2.65,2.65])for(const z of [-2.65,2.65])box('trim',x,11.2,z,.65,21.2,.65);
 for(const [y,w,h] of [[.2,6.0,.4],[20.7,6.25,.4],[21.5,6.65,.5],[22.175,6.35,.85],[28.3,6.35,.5],[28.9,6.7,.6]])box('trim',0,y,0,w,h,w);
 // Four genuinely open belfry arches, with the bell suspended from the lintel.
 for(let i=0;i<4;i++){
  const a=i*Math.PI/2;
  wall('stone',5.8,22.3,28.8,.6,2.3*Math.sin(a),2.3*Math.cos(a),a,[{u:0,y:22.6,w:2.45,h:5.7,arch:true}]);
  for(const sign of [-1,1])box('trim',sign*2.45*Math.cos(a)+2.7*Math.sin(a),25.5,-sign*2.45*Math.sin(a)+2.7*Math.cos(a),.45,5.9,.45);
 }
 box('trim',0,28.6,0,5.6,.3,5.6);
 bar('bell',[0,26.15,0],[0,28.65,0],.15);
 lathe('bell',0,0,[[0,24.9],[.85,24.9],[.78,25.15],[.56,25.9],[.38,26.35],[.18,26.45],[0,26.45]],near?16:10);
 // Clock faces are recessed inside real circular openings, with no lettering or numerals.
 for(let side=0;side<4;side++){
  const a=side*Math.PI/2,s=Math.sin(a),c=Math.cos(a);
  wall('stone',5.8,29.2,33.25,.6,2.3*s,2.3*c,a,[{u:0,y:29.65,w:2.45,h:2.45,circle:true}]);
  const disk=new THREE.CircleGeometry(1.25,near?32:20);disk.rotateY(a);disk.translate(2.65*s,30.875,2.65*c);k.put(disk,'clock');
  const rim=new THREE.TorusGeometry(1.3,.12,near?6:4,near?32:20);rim.rotateY(a);rim.translate(2.87*s,30.875,2.87*c);k.put(rim,'trim');
  const face=(u,y)=>[u*c+2.83*s,y,-u*s+2.83*c];
  for(let h=0;h<12;h++){const t=h*Math.PI/6;bar('metal',face(.98*Math.sin(t),30.875+.98*Math.cos(t)),face(1.1*Math.sin(t),30.875+1.1*Math.cos(t)),.06);}
  bar('metal',face(0,30.875),face(-.55,31.35),.09);bar('metal',face(0,30.875),face(.6,30.2),.07);
 }
 // Open astronomical observation terrace: four low parapets and supported corner ornaments.
 box('trim',0,33.2,0,6.4,.35,6.4);
 for(const s of [-1,1]){box('stone',0,33.65,s*2.9,5.8,.7,.35);box('stone',s*2.9,33.65,0,.35,.7,5.1);}
 for(const x of [-2.9,2.9])for(const z of [-2.9,2.9]){box('trim',x,33.55,z,.55,.5,.55);cyl('trim',x,z,.3,.17,33.8,34,near?10:6);}
 return k.finish();
}
