import * as THREE from'three';import{SPEC,PALETTES}from'./config.js';import{kit}from'./porte-de-la-craffe-parts.js';
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,put,box,wall,cyl}=k;
 for(const cx of[-6.94,6.94]){
  cyl('base',cx,0,4.93,4.6,0,3,near?20:12);
  const n=near?20:12,R=4.6,w=2*R*Math.tan(Math.PI/n);
  for(let i=0;i<n;i++){const a=i*2*Math.PI/n,exposed=i%(near?5:3)===0;wall('stone',w,3,17,.8,cx+(R-.8)*Math.sin(a),(R-.8)*Math.cos(a),a,exposed?[{u:0,y:6.2,w:.34,h:1.15,mat:'shadow'},{u:0,y:14.1,w:.31,h:1.2,mat:'shadow'}]:[]);}
  cyl('roof',cx,0,5.03,.55,17,24.9,near?24:16);cyl('roof',cx,0,.64,.64,24.9,25.05,near?10:6);
  for(let i=0;i<(near?6:4);i++){const a=i*2*Math.PI/(near?6:4);box('metal',cx+.38*Math.sin(a),25.65,.38*Math.cos(a),.12,1.2,.12);}
  cyl('roof',cx,0,.63,.63,26.2,26.3,near?10:6);cyl('roof',cx,0,.47,.025,26.3,28.25,near?10:6);cyl('metal',cx,0,.035,.035,28.2,28.5,near?6:4);
 }
 // One thick gatehouse with a bottom-open pointed notch: the passage has no hidden slab.
 const outline=[[-4,0],[-1.8,0],[-1.8,3.0],[-1.26,4.15],[0,5.2],[1.26,4.15],[1.8,3.0],[1.8,0],[4,0],[4,14],[-4,14]],shape=new THREE.Shape(outline.map(p=>new THREE.Vector2(...p)));
 const gate=new THREE.ExtrudeGeometry(shape,{depth:7.9,bevelEnabled:false});gate.translate(0,0,-3.95);put(gate,'stone');
 // Projecting defensive corbel table and a row of dark machicolation recesses.
 wall('stone',8.9,12,14,.45,0,4.15,0,[-3.6,-2.4,-1.2,0,1.2,2.4,3.6].map(u=>({u,y:12.2,w:.62,h:1.1,arch:true,mat:'shadow'})));
 for(const x of[-3.6,-2.4,-1.2,0,1.2,2.4,3.6])box('stone',x,11.86,4.05,.55,.8,.9);
 box('stone',0,13.8,0,9.2,.4,8.5);
 // Steep truncated hip/mansard, with a modest central lantern.
 const lo=[[-4.7,-4.4],[4.7,-4.4],[4.7,4.4],[-4.7,4.4]],hi=[[-2.8,-2.55],[2.8,-2.55],[2.8,2.55],[-2.8,2.55]];
 for(let i=0;i<4;i++){const j=(i+1)%4;k.quad('roof',[lo[i][0],14,lo[i][1]],[hi[i][0],18.8,hi[i][1]],[hi[j][0],18.8,hi[j][1]],[lo[j][0],14,lo[j][1]]);}
 box('roof',0,18.82,0,5.6,.04,5.1);cyl('roof',0,0,.94,.46,18.84,19.7,near?12:8);
 for(let i=0;i<4;i++){const a=i*Math.PI/2;box('metal',.3*Math.sin(a),20.1,.3*Math.cos(a),.12,.8,.12);}cyl('roof',0,0,.52,.05,20.5,21,near?8:6);cyl('metal',0,0,.04,.04,20.9,21.2,near?6:4);
 // Original plain architectural double cross, with no inscription or coat of arms.
 box('trim',0,10,4.05,.19,2.4,.24);box('trim',0,10.6,4.05,1.05,.18,.24);box('trim',0,9.95,4.05,1.55,.18,.24);
 const arch=new THREE.TorusGeometry(1.65,.10,near?6:4,near?16:10,Math.PI);arch.translate(0,9.8,4.04);put(arch,'stone');for(const x of[-1.65,1.65])box('stone',x,9.25,4.04,.2,1.1,.2);
 return k.finish();
}
