import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {kit} from './torre-reloj-cartagena-parts.js';
export const CX=.8;
export const SHUTTERS=[...Array.from({length:4},(_,i)=>({a:(i*2+1)*Math.PI/4,ap:3.5*Math.cos(Math.PI/8),y:14.2,w:1.45,h:3.7})),...Array.from({length:8},(_,i)=>({a:i*Math.PI/4,ap:2.6*Math.cos(Math.PI/8),y:19.75,w:1.15,h:3.0}))];
export function slatRows(s,detail='near'){const n=detail==='far'?5:10,spring=s.h-s.w*.8;return Array.from({length:n},(_,i)=>{const y=(i+.5)*s.h/n,w=s.w*(y>spring?1-Math.asin(Math.min(1,(y-spring)/(s.h-spring)))*2/Math.PI:1)+.06;return{y:s.y+y,w};});}
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,wall,poly,bar,cyl}=k;
 // One extruded profile makes three genuine barrel-vaulted tunnels through the entire mapped gate.
 const sh=new THREE.Shape([[-27.03,0],[27.03,0],[27.03,6.6],[-27.03,6.6]].map(p=>new THREE.Vector2(...p)));
 for(const [x,w,h]of [[-13,4.4,4.5],[CX,5.3,5.2],[14,4.4,4.5]]){const r=w/2,p0=[[-r,0],[r,0],[r,h-r]];for(let i=1;i<=(near?12:6);i++){const a=i*Math.PI/(near?12:6);p0.push([r*Math.cos(a),h-r+r*Math.sin(a)]);}const p=p0.map(([u,y])=>new THREE.Vector2(x+u,y));sh.holes.push(new THREE.Path(p));}
 const full=new THREE.ExtrudeGeometry(sh,{depth:15.58,bevelEnabled:false,steps:1,curveSegments:near?12:6}),p=full.getAttribute('position'),front=[],back=[];
 for(let i=0;i<p.count;i+=3){const dst=[0,1,2].every(j=>Math.abs(p.getZ(i+j))<.001)?back:front;for(let j=0;j<3;j++)dst.push(p.getX(i+j),p.getY(i+j),p.getZ(i+j)-7.79);}
 for(const [v,m]of [[front,'stone'],[back,'yellow']]){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.computeVertexNormals();k.put(g,m);}full.dispose();
 // Grounded tower base on the vault roof. Neighbouring buildings are not part of this asset.
 // Full-depth clock base: the front stone pediment and rear chevron are integral coloured regions.
 for(const sign of [-1,1]){const x=CX+sign*4.1,v=sign>0?[[x,6.6,7.79],[x,6.6,-7.79],[x,13.4,-7.79],[x,13.4,7.79]]:[[x,6.6,-7.79],[x,6.6,7.79],[x,13.4,7.79],[x,13.4,-7.79]];poly('yellow',v,[0,1,2,0,2,3]);}
 const nx=near?12:6,breaks=[-4.1,...Array.from({length:nx+1},(_,i)=>4.75-i*9.5/nx).filter(x=>x>-4.1&&x<4.1),4.1].sort((a,b)=>a-b),curve=x=>10.25+2.05*Math.sin((x+4.75)*Math.PI/9.5);
 for(let i=0;i<breaks.length-1;i++){const a=breaks[i],b=breaks[i+1],A=curve(a),B=curve(b);poly('stone',[[CX+a,6.6,7.79],[CX+b,6.6,7.79],[CX+b,B,7.79],[CX+a,A,7.79]],[0,1,2,0,2,3]);poly('yellow',[[CX+a,A,7.79],[CX+b,B,7.79],[CX+b,13.4,7.79],[CX+a,13.4,7.79]],[0,1,2,0,2,3]);}
 const backQuad=(mat,x0,x1,a,b,c,d)=>poly(mat,[[CX+x0,a,-7.79],[CX+x1,b,-7.79],[CX+x1,c,-7.79],[CX+x0,d,-7.79]],[0,2,1,0,3,2]);
 backQuad('yellow',-4.1,4.1,6.6,6.6,10.3,10.3);backQuad('trim',-4.1,4.1,10.3,10.3,10.5,10.5);
 for(const [a,b]of [[-4.1,0],[0,4.1]]){const y=x=>13.05-2.35*Math.abs(x)/4.1,A=y(a),B=y(b);backQuad('yellow',a,b,10.5,10.5,B-.1,A-.1);backQuad('trim',a,b,A-.1,B-.1,B+.1,A+.1);backQuad('yellow',a,b,A+.1,B+.1,13.4,13.4);}
 box('trim',CX,13.4,0,8.7,.35,15.58);
 // Original simplified curved Baroque pediment on the exposed-stone outer side.
 wall('stone',9.5,6.6,10.25,.5,CX,7.55,0);
 const ped=new THREE.Shape([[-4.75,10.25],[4.75,10.25],...Array.from({length:near?13:7},(_,i)=>{const x=4.75-i*9.5/(near?12:6);return[x,10.25+2.05*Math.sin((x+4.75)*Math.PI/9.5)];})].map(v=>new THREE.Vector2(...v)));
 const pg=new THREE.ExtrudeGeometry(ped,{depth:.5,bevelEnabled:false});pg.translate(CX,0,7.55);k.put(pg,'stone');
 for(let i=1;i<breaks.length;i++)bar('trim',[CX+breaks[i-1],curve(breaks[i-1]),8.13],[CX+breaks[i],curve(breaks[i]),8.13],.20,.18);
 for(const sign of [-1,1]){box('stone',CX+sign*4.1,9.2,7.95,.7,5.2,.8);box('stone',CX+sign*4.1,11.8,7.95,1.0,.35,1.0);}
 // Clock stage: cardinal clock faces, diagonal pointed shutters, continuous octagonal silhouette.
 const R=3.5,ap=R*Math.cos(Math.PI/8),w=2*R*Math.sin(Math.PI/8);
 for(let i=0;i<8;i++){
  const a=i*Math.PI/4,clock=i%2===0,holes=clock?[{u:0,y:15.2,w:2.35,h:2.35,circle:true}]:[{u:0,y:14.2,w:1.45,h:3.7,arch:true}];
  wall('yellow',w,13.4,19.1,.8,CX+(ap-.8)*Math.sin(a),(ap-.8)*Math.cos(a),a,holes);
  if(clock){
   const face=(u,y,depth=ap-.1)=>[CX+u*Math.cos(a)+depth*Math.sin(a),y,-u*Math.sin(a)+depth*Math.cos(a)];
   const g=new THREE.CircleGeometry(1.15,near?32:20);g.rotateY(a);g.translate(...face(0,16.375));k.put(g,'clock');
   const rim=new THREE.TorusGeometry(1.2,.065,near?6:4,near?32:20);rim.rotateY(a);rim.translate(...face(0,16.375,ap+.01));k.put(rim,'trim');
   for(let j=0;j<12;j++){const b=j*Math.PI/6;bar('metal',face(.88*Math.sin(b),16.375+.88*Math.cos(b),ap-.025),face(1.03*Math.sin(b),16.375+1.03*Math.cos(b),ap-.025),.035);}
   bar('metal',face(0,16.375,ap-.015),face(.62,16.6,ap-.015),.055);bar('metal',face(0,16.375,ap-.015),face(-.35,17.1,ap-.015),.04);
  }
 }
 cyl('trim',CX,0,3.6,3.6,19.0,19.15,8);
 // The smaller octagonal lantern retains all eight pointed louvered openings.
 const lr=2.6,la=lr*Math.cos(Math.PI/8),lw=2*lr*Math.sin(Math.PI/8);
 for(let i=0;i<8;i++){const a=i*Math.PI/4;wall('yellow',lw,19.05,23.5,.8,CX+(la-.8)*Math.sin(a),(la-.8)*Math.cos(a),a,[{u:0,y:19.75,w:1.15,h:3,arch:true}]);}
 for(const s of SHUTTERS){
  const path=new THREE.Shape(k.arch(s.w,s.h).map(([u,v])=>new THREE.Vector2(u,v+s.y))),g=new THREE.ShapeGeometry(path);g.rotateY(s.a);g.translate(CX+(s.ap-.72)*Math.sin(s.a),0,(s.ap-.72)*Math.cos(s.a));k.put(g,'shadow');
  for(const row of slatRows(s,detail)){const x=CX+(s.ap-.08)*Math.sin(s.a),z=(s.ap-.08)*Math.cos(s.a);box('trim',x,row.y,z,row.w,.08,.12,s.a);}
 }
 // White triangular crown frames and yellow infill adjoin without duplicate planes.
 function gable(a,ap,w,y,h){const outer=[[-w/2,y],[w/2,y],[0,y+h]],inner=[[-w*.32,y+.2],[w*.32,y+.2],[0,y+h-.28]],s=new THREE.Shape(outer.map(v=>new THREE.Vector2(...v)));s.holes.push(new THREE.Path(inner.map(v=>new THREE.Vector2(...v))));for(const [shape,mat]of [[s,'trim'],[new THREE.Shape(inner.map(v=>new THREE.Vector2(...v))),'yellow']]){const g=new THREE.ShapeGeometry(shape);g.rotateY(a);g.translate(CX+ap*Math.sin(a),0,ap*Math.cos(a));k.put(g,mat);}}
 for(let i=0;i<4;i++)gable(i*Math.PI/2,3.5,3.0,18.85,1.6);
 cyl('trim',CX,0,2.72,2.72,23.4,23.7,8);
 for(let i=0;i<8;i++)gable(i*Math.PI/4,2.55,1.7,23.2,1.2);
 // Slender eight-sided spire: integral pale edge strips, not oversized floating ribs.
 for(let i=0;i<8;i++){
  const a=(i+.5)*Math.PI/4,b=a+Math.PI/4,A=[CX+1.95*Math.sin(a),23.65,1.95*Math.cos(a)],B=[CX+1.95*Math.sin(b),23.65,1.95*Math.cos(b)],C=[CX+.28*Math.sin(b),29.7,.28*Math.cos(b)],D=[CX+.28*Math.sin(a),29.7,.28*Math.cos(a)],mix=(p,q,t)=>p.map((x,j)=>x+(q[j]-x)*t),L=mix(A,B,.06),U=mix(D,C,.06),R=mix(B,A,.06),V=mix(C,D,.06);
  poly('trim',[A,L,U,D],[0,1,2,0,2,3]);poly('yellow',[L,R,V,U],[0,1,2,0,2,3]);poly('trim',[R,B,C,V],[0,1,2,0,2,3]);
 }
 cyl('trim',CX,0,.38,.27,29.65,29.95,near?12:8);k.sphere('trim',CX,30.15,0,.30);
 bar('metal',[CX,30.1,0],[CX,31.5,0],.055);
 // Simple non-lettered wind vane silhouette, connected at the central spindle.
 bar('metal',[CX-.45,31.0,0],[CX+.45,31.0,0],.045);
 return k.finish();
}
