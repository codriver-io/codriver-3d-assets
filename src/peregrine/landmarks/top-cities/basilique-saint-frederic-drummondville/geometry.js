import * as THREE from 'three';import {SPEC,PALETTES} from './config.js';import {kit} from './basilique-saint-frederic-drummondville-kit.js';
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,wall,roof,cyl,lathe,beam,poly,put}=k;
 const cx=.65,front=25.8,back=-28.7,w=16.0;
 box('base',cx,.8,(front+back)/2,w,1.6,front-back);
 // Long nave with real Gothic window holes; the rear crossing is wider than its front.
 for(const side of [-1,1]){
  wall('stone',47.8,1.6,12.8,.6,cx+side*w/2,1.4,side>0?Math.PI/2:-Math.PI/2,[-18,-11,-4,3,10,17].map(z=>({u:side>0?-z+1.4:z-1.4,y:4,w:2.0,h:6.2,arch:true,pointed:true,mat:'glass'})));
  for(const z of [-21.5,-14.5,-7.5,-.5,6.5,13.5,20.5]){box('stone',cx+side*8.15,5.7,z,.8,8.2,.9);box('stone',cx+side*8.05,10.8,z,.5,2.0,.6);}
 }
 roof('copper',cx,1.4,16.2,47.0,12.8,20.2);
 // Broad rear sanctuary/vestry envelope and green crossing gable.
 box('base',.4,.8,-13.1,26.4,1.6,31.6);
 for(const side of [-1,1])wall('stone',31.4,1.6,12.7,.6,.4+side*13.2,-13.0,side>0?Math.PI/2:-Math.PI/2,[-9.0,0,9].map(u=>({u,y:4.0,w:2.1,h:6.3,arch:true,pointed:true,mat:'glass'})));
 wall('stone',26.4,1.6,12.7,.65,.4,-28.7,Math.PI,[-7.4,0,7.4].map(u=>({u,y:4.4,w:2.0,h:6.4,arch:true,pointed:true,mat:'glass'})),21.3);
 roof('copper',.4,-13.0,26.3,31.0,12.7,21.1);
 // Low rear apse inside the mapped altar projection.
 const rz=-28.7;for(let i=0;i<8;i++){const a=Math.PI/2+(i+.5)*Math.PI/8,r=3.8,ap=r*Math.cos(Math.PI/16),fw=2*r*Math.sin(Math.PI/16);wall('stone',fw,1.6,9.5,.4,.4+ap*Math.sin(a),rz+ap*Math.cos(a),a,[{u:0,y:3.2,w:.8,h:4.4,arch:true,pointed:true,mat:'glass'}]);}cyl('copper',.4,rz,4.0,.1,9.5,12.6,16);
 // Current facade: three pointed portals and a traceried centre group, set above the steps.
 const holes=[-3.8,0,3.8].map(u=>({u,y:1.8,w:u===0?2.5:2.0,h:u===0?4.7:4.2,arch:true,pointed:true,mat:'door'}));
 holes.push({u:0,y:9.8,w:5.4,h:7.3,arch:true,pointed:true,mat:'glass'});
 wall('stone',10.5,1.6,12.8,.75,.65,front,0,holes,20.1);
 // Pale stone mullions sit within the actual large window aperture.
 for(const x of [-.9,2.2])box('trim',x,11.45,front+.34,.11,3.3,.12);
 box('trim',.65,13.05,front+.34,.11,6.5,.12);
 box('trim',.65,13.0,front+.34,3.8,.10,.12);
 // Main tower at the viewer's right (+X in this mapped architectural frame).
 const tx=9.6,tz=25.35,tw=7.32;
 for(let i=0;i<4;i++){
  const a=i*Math.PI/2,opens=[];
  for(const u of [-1.4,1.4])opens.push({u,y:3.8,w:1.6,h:5.9,arch:true,pointed:true,mat:'glass'});
  for(const u of [-2.0,0,2.0])opens.push({u,y:15.1,w:1.0,h:8.0,arch:true,pointed:true,mat:'glass'});
  wall('base',tw,0,1.6,.65,tx+Math.sin(a)*tw/2,tz+Math.cos(a)*tw/2,a,[]);
  wall('stone',tw,1.6,25.4,.65,tx+Math.sin(a)*tw/2,tz+Math.cos(a)*tw/2,a,opens);
  for(const u of [-tw/2+.28,tw/2-.28]){const x=tx+Math.sin(a)*tw/2+u*Math.cos(a),z=tz+Math.cos(a)*tw/2-u*Math.sin(a);box('stone',x,13.3,z,.45,23.4,.45);}
 }
 for(const y of [2.0,11.4,13.2,25.7])box((near&&y>3)||y>25?'trim':'stone',tx,y,tz,8.2,.55,8.2);
 // Open louvred belfry: Gothic apertures and independent dark slats.
 for(let i=0;i<4;i++){
  const a=i*Math.PI/2,x=tx+Math.sin(a)*3.1,z=tz+Math.cos(a)*3.1;
  wall('iron',6.2,26,32.0,.35,x,z,a,[{u:0,y:26.5,w:3.2,h:4.6,arch:true,pointed:true,mat:'glass'}]);
  for(let j=0;j<(near?9:5);j++)box('iron',x+Math.sin(a)*.12,26.8+j*(near?.42:.81),z+Math.cos(a)*.12,3.05,.13,.22,a);
 }
 box('iron',tx,32.0,tz,7.1,.35,7.1);
 cyl('copper',tx,tz,2.7,.08,32.0,43.8,8);
 for(const y of [35.0,38.2,41.2]){const r=2.7-(y-32)/11.8*2.62;cyl('iron',tx,tz,r+.10,r+.10,y,y+.12,8);}
 for(const x of [tx-3.0,tx+3.0])for(const z of [tz-3.0,tz+3.0]){cyl('iron',x,z,.24,.24,25.8,30.1,6);cyl('copper',x,z,.5,.02,30.1,33.6,6);}
 beam('iron',[tx,43.65,tz],[tx,45.72,tz],.10);beam('iron',[tx-.47,45.1,tz],[tx+.47,45.1,tz],.10);
 // Small asymmetrical tower and a joined human statue on its roof pedestal.
 const sx=-6.65,sz=24.25;
 for(let i=0;i<4;i++){const a=i*Math.PI/2;wall('base',4.3,0,1.6,.5,sx+Math.sin(a)*2.15,sz+Math.cos(a)*2.15,a,[]);wall('stone',4.3,1.6,17.0,.5,sx+Math.sin(a)*2.15,sz+Math.cos(a)*2.15,a,[{u:0,y:4,w:1.3,h:6.5,arch:true,pointed:true,mat:'glass'}]);}
 box('iron',sx,17.05,sz,4.7,.3,4.7);cyl('copper',sx,sz,2.6,.5,17.2,19.0,4);
 function saint(x,z,y,h){
  cyl('trim',x,z,.34,.34,y,y+.15,8);lathe('trim',x,z,[[0,y+.1],[.27,y+.1],[.22,y+h*.68],[.12,y+h*.78],[0,y+h*.78]],8);
  cyl('trim',x,z,.16,.16,y+h*.76,y+h*.93,8);cyl('trim',x,z,.18,.02,y+h*.9,y+h,8);
  beam('trim',[x-.1,y+h*.60,z],[x-.34,y+h*.42,z+.08],.12);beam('trim',[x+.1,y+h*.60,z],[x+.32,y+h*.66,z+.1],.12);
 }
 saint(sx,sz,19.0,2.34);
 for(const x of [sx-1.85,sx+1.85])for(const z of [sz-1.85,sz+1.85]){cyl('iron',x,z,.12,.12,17.0,18.7,5);cyl('copper',x,z,.27,.02,18.7,20.2,5);}
 for(const x of [-4.6,5.8]){box('stone',x,12.0,front+.45,.75,.35,.8);saint(x,front+.4,12.15,1.7);}
 box('stone',.65,18.9,front+.3,.7,.35,.65);saint(.65,front+.3,19.05,1.0);
 beam('iron',[.65,20.0,front],[.65,21.1,front],.10);beam('iron',[.33,20.8,front],[.97,20.8,front],.1);
 // Broad stepped approach: upper treads clear local grade, with no scene/DEM datum.
 for(let j=0;j<10;j++)box('base',.3,.09*(j+1),30.0-j*.35,18.5,.18*(j+1),.45);
 box('base',.3,.9,26.5,18.5,1.8,.5);
 return k.finish();
}
