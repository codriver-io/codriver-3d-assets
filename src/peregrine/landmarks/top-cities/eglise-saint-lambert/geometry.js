import { SPEC, PALETTES } from './config.js';
import { kit } from './eglise-saint-lambert-kit.js';
// +Z runs from the avenue Lorne facade to the chancel. The mapped east-west yaw is baked once.
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,wall,roof,cyl,beam}=k;
 const w=20.5,d=41.2,front=-20.4,back=20.8,eave=11.7,peak=22.1;
 box('stone',0,.3,.2,w,.6,d);
 const bays=[-14,-7.2,-.4,6.4,13.2];
 for(const s of [-1,1]){
  wall('stone',d,.55,eave,.65,s*w/2,.2,s>0?Math.PI/2:-Math.PI/2,bays.map(u=>({u:s>0?-u:u,y:4.0,w:1.18,h:4.6,arch:true,pointed:true,mat:'glass'})));
  for(const z of [-18,-10.6,-3.5,3.5,10.6,18])box('stone',s*10.25,5.8,z,.8,10.4,.8);
 }
 const holes=[-5.2,0,5.2].map(u=>({u,y:.6,w:u===0?2.3:1.7,h:3.3,arch:true,mat:'door'}));
 holes.push({u:0,y:7.3,points:[[-1.5,0],[1.5,0],[1.5,7.2],[3,7.2],[3,8.2],[1.5,8.2],[1.5,10.2],[-1.5,10.2],[-1.5,8.2],[-3,8.2],[-3,7.2],[-1.5,7.2]],mat:'glass'});
 for(const u of [-6.1,6.1])holes.push({u,y:6.6,w:.85,h:4.1,arch:true,mat:'glass'});
 // The long stone mullion and crossbar divide the cruciform glazing rather than overlaying a wall.
 wall('stone',w,.55,eave,.7,0,front,Math.PI,holes,peak);
 box('stone',0,12.4,front-.38,.48,10.2,.55);
 box('stone',0,15.0,front-.38,5.9,.32,.55);
 wall('stone',w,.55,eave,.65,0,back,0,[{u:0,y:5,w:1.6,h:5.4,arch:true,mat:'glass'}],peak);
 // Roof is a closed ridge prism, inset behind the stone gable ends.
 roof('roof',0,.2,w-.45,d-.9,eave,peak-.25);
 // Stepped nave buttresses and facade jambs retain the masonry rhythm without
 // inventing annex ownership outside the mapped church envelope.
 for(const u of [-9.5,-4,4,9.5])box('stone',u,4.6,front-.23,.7,8.1,.8);
 for(const side of [-1,1])for(const zz of [-17,-10,-3,4,11,18]){
  box('stone',side*10.25,3.2,zz,.95,5.4,.9);
  box('stone',side*10.25,7.3,zz,.65,2.8,.65);
 }
 // Offset octagonal campanile; its broad facets contain actual louvre apertures.
 const tx=7.0,tz=-16.6,r=3.35,n=8,apothem=r*Math.cos(Math.PI/8),facet=2*r*Math.sin(Math.PI/8);
 for(let i=0;i<n;i++){
  const a=(i+.5)*2*Math.PI/n,x=tx+apothem*Math.sin(a),z=tz+apothem*Math.cos(a);
  const openings=[{u:0,y:1.2,w:.65,h:2.1,arch:true,mat:'glass'},{u:0,y:7.5,w:.48,h:13.5,mat:'glass'},{u:0,y:23.1,w:1.38,h:2.7,mat:'glass'}];
  wall('stone',facet,0,26.8,.36,x,z,a,openings);
  for(let j=0;j<(near?7:4);j++)box('copper',x,23.35+j*(near?.33:.60),z,1.25,.13,.15,a);
 }
 cyl('stone',tx,tz,3.45,3.45,26.6,27.1,8);
 cyl('copper',tx,tz,3.65,.16,27.1,34.9,8);
 beam('trim',[tx,34.7,tz],[tx,35.8,tz],.09);beam('trim',[tx-.36,35.45,tz],[tx+.36,35.45,tz],.08);
 // Cross on the front ridge, with its foot seated in the roof.
 beam('stone',[0,21.9,front+.2],[0,22.9,front+.2],.25);beam('stone',[-.3,22.6,front+.2],[.3,22.6,front+.2],.2);
 return k.finish();
}
