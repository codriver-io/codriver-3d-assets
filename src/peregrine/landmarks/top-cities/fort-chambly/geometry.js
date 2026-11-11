import {SPEC,PALETTES} from './config.js';
import {kit} from './fort-chambly-kit.js';
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,wall,quad,cyl,roof}=k;
 // The courtyard remains open. Its paving top is 0.16 m above grade.
 box('paving',0,.10,0,27.5,.12,27.5);
 const sidePoint=(x,y,z,a)=>[x*Math.cos(a)+z*Math.sin(a),y,-x*Math.sin(a)+z*Math.cos(a)];
 function shed(a,z0,z1,y0,y1){
  const P=(x,y,z)=>sidePoint(x,y,z,a),x0=-17.7,x1=17.7,t=.24;
  quad('roof',P(x0,y0,z0),P(x1,y0,z0),P(x1,y1,z1),P(x0,y1,z1),[0,1,0]);
  quad('roof',P(x0,y0-t,z0),P(x0,y1-t,z1),P(x1,y1-t,z1),P(x1,y0-t,z0),[0,-1,0]);
  for(const x of [x0,x1])quad('roof',P(x,y0-t,z0),P(x,y0,z0),P(x,y1,z1),P(x,y1-t,z1),sidePoint(x<0?-1:1,0,0,a));
  quad('roof',P(x0,y0-t,z0),P(x1,y0-t,z0),P(x1,y0,z0),P(x0,y0,z0),sidePoint(0,0,-1,a));
  quad('roof',P(x0,y1-t,z1),P(x0,y1,z1),P(x1,y1,z1),P(x1,y1-t,z1),sidePoint(0,0,1,a));
 }
 const slitPositions=[-13,-8,-3,3,8,13];
 for(let i=0;i<4;i++){
  const a=i*Math.PI/2,front=i===2,outer=sidePoint(0,0,22.0,a),inner=sidePoint(0,0,14.6,a);
  const holes=[];
  for(const u of slitPositions)for(const y of [3.5,8.4])holes.push({u,y,w:near?.18:.25,h:1.0,mat:'glass'});
  if(front)holes.push({u:0,y:.16,w:2.5,h:5.2});
  wall('stone',35.5,0,12.2,1.0,outer[0],outer[2],a,holes);
  const arcades=[-14,-8.4,-2.8,2.8,8.4,14].map(u=>({u,y:.16,w:2.8,h:3.65,arch:true,mat:'glass'}));
  if(front){arcades.length=0;arcades.push({u:0,y:.16,w:2.5,h:5.2});}
  wall('stone',35.5,0,8.4,.7,inner[0],inner[2],a+Math.PI,arcades);
  shed(a,14.3,22.0,8.4,11.9);
  // Flat cap is embedded into the top of the curtain, not a coplanar veneer.
  const pc=sidePoint(0,12.15,22.35,a);box('stone',...pc,35.7,.35,1.4,a);
  if(!front)for(const u of [-13,-6.5,0,6.5,13]){
   const p=sidePoint(u,0,16.1,a);
   // Roof dormers: actual small front apertures and a closed pitched cap.
   wall('stone',1.8,8.9,10.6,.3,p[0],p[2],a+Math.PI,[{u:0,y:9.1,w:.9,h:1.25,mat:'glass'}],11.3);
   const q=sidePoint(u,10.5,17.0,a);box('roof',q[0],q[1],q[2],1.9,.3,2.1,a);
  }
 }
 // Four bastions are hollow stone towers with separate gun openings at three levels.
 for(const sx of [-1,1])for(const sz of [-1,1]){
  const x=sx*21.3,z=sz*21.5,w=9.2,d=9.2;
  box('stone',x,.25,z,w,.5,d);
  for(let side=0;side<4;side++){
   const a=side*Math.PI/2,xx=x+Math.sin(a)*w/2,zz=z+Math.cos(a)*d/2;
   wall('stone',w,0,15.0,.65,xx,zz,a,[{u:-1.9,y:3.3,w:.75,h:.8,arch:true,mat:'glass'},{u:1.9,y:3.3,w:.75,h:.8,arch:true,mat:'glass'},{u:0,y:7.5,w:.95,h:.9,arch:true,mat:'glass'},{u:0,y:11.9,w:.65,h:.85,mat:'glass'}]);
  }
  box('roof',x,14.93,z,w+.3,.3,d+.3);
  // Projecting pale wooden sentry boxes, supported by a corbel that meets the bastion.
  const xx=x+sx*3.1,zz=z+sz*3.1;
  cyl('trim',xx,zz,.15,.82,12.6,14.0,4);
  for(let side=0;side<4;side++){
   const a=side*Math.PI/2;
   wall('trim',1.25,14,16.3,.16,xx+Math.sin(a)*.62,zz+Math.cos(a)*.62,a,[{u:0,y:14.7,w:.38,h:.85,mat:'glass'}]);
  }
  cyl('roof',xx,zz,1.08,.03,16.3,17.2,4);
 }
 // Pediment over the west gate; a recessed dark door remains inside its real cutout.
 quad('glass',[-1.2,.16,-22.3],[1.2,.16,-22.3],[1.2,5.2,-22.3],[-1.2,5.2,-22.3],[0,0,-1]);
 const gateZ=-23.15;
 for(const x of [-1.65,1.65])box('trim',x,3.1,gateZ,.6,6.2,.65);
 box('trim',0,6.45,gateZ,4.0,.6,.65);
 wall('trim',3.5,6.7,9.4,.7,0,gateZ,Math.PI,[-.9,0,.9].map(u=>({u,y:7.0,w:.46,h:1.65,mat:'glass'})),10.6);
 return k.finish();
}
