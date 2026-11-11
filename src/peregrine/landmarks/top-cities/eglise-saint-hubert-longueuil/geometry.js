import {SPEC,PALETTES} from './config.js';
import {kit} from './eglise-saint-hubert-longueuil-kit.js';
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,wall,roof,cyl,lathe,beam}=k;
 const front=-27.0,back=10.7,w=22.9;
 box('stone',0,.3,(front+back)/2,w,.6,back-front);
 for(const side of [-1,1]){
  wall('stone',back-front,.6,10.6,.65,side*w/2,(front+back)/2,side>0?Math.PI/2:-Math.PI/2,[-20.5,-13.9,-7.3,-.7,5.9].map(z=>({u:side>0?-z+(front+back)/2:z-(front+back)/2,y:3.6,w:1.8,h:5.5,arch:true,pointed:true,mat:'glass'})));
  for(const z of [-24,-17.5,-11,-4.5,2,8.5]){
   box('stone',side*11.45,3.3,z,.95,5.4,1.0);box('stone',side*11.45,7.8,z,.66,3.5,.75);
  }
 }
 roof('roof',0,(front+back)/2,w-.5,back-front-.7,10.6,17.0);
 wall('stone',w,.6,10.6,.6,0,back,0,[{u:0,y:3.2,w:1.8,h:5.2,arch:true,pointed:true,mat:'glass'}],17);
 // Low rear sacristy is separate from the pitched nave and remains within the mapped annex ring.
 box('stone',2.5,.3,19.3,10.0,.6,17.8);
 for(const zz of [10.4,28.2])wall('stone',10,.6,6.6,.35,2.5,zz,zz<19?Math.PI:0,zz>19?[{u:0,y:1.2,w:1.3,h:3.0,mat:'door'}]:[]);roof('roof',2.5,19.3,10.3,18.1,6.6,9.4);
 for(const side of [-1,1])wall('stone',16.6,.7,6.4,.35,2.5+side*5.0,19.3,side>0?Math.PI/2:-Math.PI/2,[-5.3,0,5.3].map(u=>({u,y:2.1,w:1.1,h:2.4,arch:true,mat:'glass'})));
 // Three frontal panels avoid any hidden wall behind their Gothic door/window apertures.
 for(const x of [-7.7,7.7])wall('stone',7.7,.6,16.2,.8,x,front,Math.PI,[{u:0,y:.6,w:2.9,h:5.6,arch:true,pointed:true,mat:'door'},{u:0,y:9,w:1.8,h:5.4,arch:true,pointed:true,mat:'glass'}]);
 wall('stone',7.7,.6,25.0,.8,0,front-.12,Math.PI,[{u:0,y:.6,w:4.6,h:6.5,arch:true,pointed:true,mat:'door'},{u:0,y:11,w:2.1,h:8.4,arch:true,pointed:true,mat:'glass'},{u:0,y:21.6,w:1.2,h:1.7,arch:true,mat:'glass'}]);
 for(const side of [-1,1])wall('stone',7.4,16.5,25,.5,side*3.85,front+3.5,side>0?Math.PI/2:-Math.PI/2,[{u:0,y:20.2,w:1.5,h:3.5,arch:true,mat:'glass'}]);
 wall('stone',7.7,16.5,25,.5,0,front+7.2,0,[{u:0,y:20.2,w:1.5,h:3.5,arch:true,mat:'glass'}]);
 // Stepped buttress jambs frame the portals and tall central lancet.
 for(const x of [-11.0,-4.0,4.0,11.0]){
  box('stone',x,5.3,front-.36,1.0,9.4,1.0);box('stone',x,12.1,front-.25,.72,4.2,.8);
 }
 box('trim',0,25.0,front+3.5,8.4,.5,8.4);
 const tz=front+3.5,r=3.7,N=8,apothem=r*Math.cos(Math.PI/8),facet=2*r*Math.sin(Math.PI/8);
 for(let i=0;i<N;i++){
  const a=(i+.5)*Math.PI/4;
  wall('silver',facet,25.3,31,.24,apothem*Math.sin(a),tz+apothem*Math.cos(a),a,[{u:0,y:25.65,w:1.75,h:4.8,arch:true}]);
 }
 cyl('silver',0,tz,4.0,4.0,31,31.5,8);
 cyl('silver',0,tz,3.7,.10,31.5,47.0,8);
 for(const y of [35.3,39.4,43.5]){const r=3.7-(y-31.5)/15.5*3.6;cyl('silver',0,tz,r+.10,r+.08,y,y+.14,8);}
 beam('silver',[0,46.8,tz],[0,48.5,tz],.10);beam('silver',[-.48,48,tz],[.48,48,tz],.10);
 function pinnacle(x,z,base,top,r){
  cyl('trim',x,z,r,r,base,base+.4,8);
  const count=near?8:4;
  for(let i=0;i<count;i++){const a=i*2*Math.PI/count,xx=x+r*.7*Math.sin(a),zz=z+r*.7*Math.cos(a);cyl('silver',xx,zz,.11,.11,base+.35,base+2.6,near?6:4);}
  cyl('silver',x,z,r,r,base+2.6,base+2.85,8);cyl('silver',x,z,r,.03,base+2.85,top,8);
 }
 for(const x of [-3.3,3.3])for(const z of [tz-3.3,tz+3.3])pinnacle(x,z,25.3,35.1,.72);
 for(const x of [-9.7,9.7]){
  box('stone',x,16.8,front+.2,1.7,1.8,1.7);pinnacle(x,front+.2,17.7,23.7,.78);
 }
 // Three visible entrance treads terminate against the stone plinth.
 for(let j=0;j<3;j++)box('stone',0,.1+j*.1,front-1.2+j*.3,6.3,.2+j*.2,.6);
 return k.finish();
}
