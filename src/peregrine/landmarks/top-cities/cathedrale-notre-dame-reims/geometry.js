import * as THREE from 'three';import {SPEC,PALETTES} from './config.js';import {PLAN} from './footprint.js';import {kit} from './cathedrale-notre-dame-reims-parts.js';
const BAYS=[-46,-39,-32,-25,-18,-11,-4,44,51];
export const FLYING_ANCHORS=BAYS.flatMap(x=>[-1,1].map(s=>({inner:[x,35.9,s*9.1],outer:[x,29.4,s*22]})));
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,put,box,wall,cyl,gable}=k;
 k.prism('stone',PLAN[0],0,.18);
 // Aisles and long clerestory. Openings are cut through thick walls, with recessed glazing.
 for(const s of [-1,1]){
  wall('stone',110,.18,13,.9,2.8,s*16.6,s>0?0:Math.PI,[-45,-38,-31,-24,-17,-10,-3,45].map(u=>({u,y:2.2,w:3.0,h:8.5,pointed:true,mat:'glass'})));
  wall('stone',110,13,42,.9,2.8,s*8.4,s>0?0:Math.PI,[-42.5,-35.5,-28.5,-21.5,-14.5,-7.5,-.5,43].map(u=>({u,y:25,w:3.1,h:14.3,pointed:true,mat:'glass'})));
 }
 // Low aisle roofs connect to the upper nave; the main lead roof is distinctly steep.
 gable('roof',-52.5,58,13,22.5,35);
 gable('roof',-52.5,58,42,59.4,18.6);
 // Transept, with Gothic end windows and steep crossing roofs.
 for(const s of [-1,1])wall('stone',35,.18,42,.9,20.8,s*27.1,s>0?0:Math.PI,[-10,0,10].map(u=>({u,y:18,w:5.6,h:20,pointed:true,mat:'glass'})));
 const sh=new THREE.Shape([new THREE.Vector2(-8.15,42),new THREE.Vector2(8.15,42),new THREE.Vector2(0,59.4)]);
 const tg=new THREE.ExtrudeGeometry(sh,{depth:56,bevelEnabled:false});tg.translate(20.8,0,-28);put(tg,'roof');
 // Chevet: polygonal upper apse and five radiating chapels follow mapped axes.
 const apse=[];for(let i=0;i<=8;i++){const a=-Math.PI/2+i*Math.PI/8;apse.push([57.5+9.3*Math.cos(a),9.3*Math.sin(a)]);}apse.push([49.1,9.3],[49.1,-9.3]);
 // Partition the apse facade into real Gothic windows rather than overlaying an extrusion.
 for(let i=0;i<apse.length;i++){const a=apse[i],c=apse[(i+1)%apse.length],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),nx=dz/len,nz=-dx/len,ang=Math.atan2(nx,nz);wall('stone',len,.18,42,.8,(a[0]+c[0])/2-nx*.8,(a[1]+c[1])/2-nz*.8,ang,i<8?[{u:0,y:26,w:Math.min(2.4,len-.7),h:13.5,pointed:true,mat:'glass'}]:[]);}
 for(let i=0;i<apse.length;i++){const a=apse[i],c=apse[(i+1)%apse.length];k.poly('roof',[[57.5,59.4,0],[c[0],42,c[1]],[a[0],42,a[1]]],[0,1,2]);}
 for(const [x,z]of [[58.8,-18.6],[69,-10.2],[75.8,3.0],[69.4,11.7],[59.2,19.5]]){const r=6.0;const n=near?8:6;for(let i=0;i<n;i++){const a=(i+.5)*2*Math.PI/n,nx=Math.sin(a),nz=Math.cos(a),rr=r*Math.cos(Math.PI/n),w=2*r*Math.sin(Math.PI/n);wall('stone',w,.18,15,.7,x+(rr-.7)*nx,z+(rr-.7)*nz,a,nx*(x-57.5)+nz*z>Math.hypot(x-57.5,z)*.4?[{u:0,y:4.1,w:1.75,h:7.3,pointed:true,mat:'glass'}]:[]);}cyl('roof',x,z,r+.15,0,15,21,near?12:8);}
 // West front: three real recessed pointed portals, a large rose and a royal arcade.
 const front=-65.7;
 wall('stone',39.2,.18,54,1,front+1,0,-Math.PI/2,[...[-12.6,0,12.6].map(u=>({u,y:.2,w:7.2,h:14.8,pointed:true,mat:'shadow'})),{u:0,y:25.8,w:12,h:12,circle:true,mat:'glass'},...[-12.6,12.6].map(u=>({u,y:25,w:4.7,h:14.7,pointed:true,mat:'glass'})),...Array.from({length:near?21:11},(_,i)=>({u:-18+i*36/(near?20:10),y:44,w:near?1.1:2.1,h:4.4,pointed:true,mat:'shadow'}))]);
 // The block behind the screen closes its short sides and seats the belfries.
 for(const s of [-1,1])wall('stone',13.3,.18,54,1,-59.15,s*18.6,s>0?0:Math.PI,[{u:0,y:24,w:4,h:14,pointed:true,mat:'glass'}]);
 wall('stone',39.2,.18,54,1,-53.4,0,Math.PI/2,[]);box('stone',-59.5,53.8,0,12.6,.4,39.2);
 for(const z of [-12.6,0,12.6]){const top=z===0?24.6:22.7;const pts=[[front-2.2,15.2,z-5.25],[front-2.2,15.2,z+5.25],[front-2.2,top,z],[front+.1,15.2,z-5.25],[front+.1,15.2,z+5.25],[front+.1,top,z]];k.poly('stone',pts,[0,1,2,3,5,4,0,5,3,0,2,5,1,5,2,1,4,5,0,4,1,0,3,4]);}
 // Projecting portal archivolts, facade ribs and the central Gothic gable.
 for(const z of [-19,-6.5,6.5,19]){box('stone',front-.6,26.6,z,1.8,52.8,1.25);cyl('stone',front-.65,z,.65,.65,52.8,55.5,near?6:4);cyl('stone',front-.65,z,.95,0,55.5,59.0,near?6:4);}
 const pointed=(w,h,y)=>[[-w/2,y],[w/2,y],[w/2,y+h-w*.65],[w*.35,y+h-w*.30],[0,y+h],[-w*.35,y+h-w*.30],[-w/2,y+h-w*.65]];
 for(const z of [-12.6,0,12.6]){const shape=new THREE.Shape(pointed(9.4,17.5,.18).map(p=>new THREE.Vector2(...p))),hole=new THREE.Path(pointed(7.2,14.8,.25).map(p=>new THREE.Vector2(...p)));shape.holes.push(hole);const g=new THREE.ExtrudeGeometry(shape,{depth:1.7,bevelEnabled:false});g.rotateY(-Math.PI/2);g.translate(front+.1,0,z);put(g,'stone');}
 const roseRim=new THREE.TorusGeometry(6,.33,near?6:4,near?24:16);roseRim.rotateY(Math.PI/2);roseRim.translate(front-.1,31.8,0);put(roseRim,'stone');
 {const sh=new THREE.Shape([new THREE.Vector2(-6.3,54),new THREE.Vector2(6.3,54),new THREE.Vector2(0,63)]);for(const z of [-2.1,2.1])sh.holes.push(new THREE.Path(pointed(1.7,4.7,54.8).map(([u,v])=>new THREE.Vector2(u+z,v))));const g=new THREE.ExtrudeGeometry(sh,{depth:.8,bevelEnabled:false});g.rotateY(-Math.PI/2);g.translate(front+.3,0,0);put(g,'stone');}
 for(const x of [5,15,27,37])for(const z of [-30,30]){box('stone',x,19.6,z,1.6,39.2,1.6);cyl('stone',x,z,1.05,0,39.2,44,near?6:4);}
 // Rose spokes sit within the actual circular aperture and meet its rim.
 for(let i=0;i<(near?16:8);i++){const a=i*2*Math.PI/(near?16:8);k.b.bar('stone',[front+.30,31.8,0],[front+.30,31.8+6.08*Math.sin(a),6.08*Math.cos(a)],near?.18:.26);}
 // Grouped petal tracery follows the existing spoke/rim system in both LODs.
 for(let i=0;i<8;i++){const a=i*Math.PI/4,g=new THREE.TorusGeometry(1.2,.15,3,near?12:8);g.rotateY(Math.PI/2);g.translate(front+.20,31.8+3.9*Math.sin(a),3.9*Math.cos(a));put(g,'stone');}
 box('stone',front-.35,48.85,0,.9,.5,38.3);
 const hub=new THREE.SphereGeometry(.5,near?8:6,near?6:4);hub.scale(.35,1,1);hub.translate(front+.30,31.8,0);put(hub,'stone');
 // Small grouped human figures have heads, shoulders and robes rather than flat slabs.
 function figure(x,y,z,h=3,wing=false){cyl('stone',x,z,h*.19,h*.13,y,y+h*.72,near?7:5);const head=new THREE.SphereGeometry(h*.13,near?8:5,near?6:4);head.translate(x,y+h*.86,z);put(head,'stone');box('stone',x,y+h*.6,z,h*.48,h*.15,h*.28);if(wing)for(const s of [-1,1]){const g=new THREE.SphereGeometry(1,near?8:5,near?6:4);g.scale(.18,h*.38,h*.20);g.rotateX(s*.5);g.translate(x+.2,y+h*.58,z+s*h*.23);put(g,'stone');}}
 for(let i=0;i<(near?21:11);i++)figure(front-.15,44.1,-18+i*36/(near?20:10),3.3);
 // Paired open belfries: two tall lancets on all four sides, gabled crowns and corner pinnacles.
 for(const z of [-12.6,12.6]){
  const cx=-59.15,r=5.75;
  for(let i=0;i<4;i++){const a=i*Math.PI/2;wall('stone',11.5,54,78,.95,cx+(r-.95)*Math.sin(a),z+(r-.95)*Math.cos(a),a,[-2.65,2.65].map(u=>({u,y:56,w:3.15,h:20.4,pointed:true})));
   const outline=new THREE.Shape([new THREE.Vector2(-3.9,78),new THREE.Vector2(3.9,78),new THREE.Vector2(0,81.2)]),g=new THREE.ExtrudeGeometry(outline,{depth:.55,bevelEnabled:false});g.translate(0,0,r-.55);g.rotateY(a);g.translate(cx,0,z);put(g,'stone');}
  for(const dx of [-5.4,5.4])for(const dz of [-5.4,5.4]){cyl('stone',cx+dx,z+dz,.44,.44,75.5,79.7,near?8:5);cyl('stone',cx+dx,z+dz,.65,0,79.7,81.5,near?8:5);}
 }
 // Flying arches terminate in named nave masonry and grounded outer buttress piers.
 for(const x of BAYS)for(const s of [-1,1]){
  box('stone',x,16,s*22,2.6,32,3.2);cyl('stone',x,s*22,1.3,0,32,36,near?6:4);
  const upper=[],lower=[],n=near?10:5;for(let i=0;i<=n;i++){const t=i/n,z=s*(9.1+12.9*t),y=36.6-3.5*t-3*t*t;upper.push([z,y]);lower.unshift([z,y-1.4]);}
  const g=new THREE.ExtrudeGeometry(new THREE.Shape(upper.concat(lower).map(v=>new THREE.Vector2(...v))),{depth:1.3,bevelEnabled:false});g.rotateY(-Math.PI/2);g.translate(x+.65,0,0);put(g,'buttress');
 }
 // Slender rear flèche and its small angel reach the documented separate maximum.
 const sx=59,sz=0;cyl('roof',sx,sz,2.7,2.7,56.4,62,near?8:6);cyl('roof',sx,sz,2.7,.18,62,84.8,near?8:6);figure(sx,84.8,sz,2.2,true);
 return k.finish();
}
