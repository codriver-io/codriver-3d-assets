import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';import {kit} from './cathedral-transfiguration-markham-kit.js';
const NAVE=[[-9.643,25.221],[-9.613,16.129],[-11.657,16.122],[-11.638,13.56],[-15.15,10.055],[-15.076,4.334],[-11.694,1.017],[-11.638,-1.758],[-9.615,-1.755],[-9.615,-21.463],[12.805,-21.524],[12.865,-1.708],[14.761,-1.694],[14.768,0.531],[18.267,4.237],[18.212,10.107],[14.712,13.453],[14.731,16.054],[12.745,16.041],[12.75,25.187],[12.071,25.191],[12.073,28.929],[5.926,35.126],[-2.739,35.109],[-8.9,29.113],[-8.892,25.254]];
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,wall,roof,cyl,lathe,poly,beam,put}=k;
 const circle=(r)=>Array.from({length:near?20:10},(_,i)=>[r*Math.cos(i*2*Math.PI/(near?20:10)),r+r*Math.sin(i*2*Math.PI/(near?20:10))]);
 const shape=new THREE.Shape(NAVE.map(([x,z])=>new THREE.Vector2(x,-z)));const floor=new THREE.ExtrudeGeometry(shape,{depth:.5,bevelEnabled:false});floor.rotateX(-Math.PI/2);put(floor,'stone');
 for(let i=0;i<NAVE.length;i++){
  const a=NAVE[i],b=NAVE[(i+1)%NAVE.length],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),angle=Math.PI-Math.atan2(dz,dx),cx=(a[0]+b[0])/2,cz=(a[1]+b[1])/2;
  if(a[1]<-20&&b[1]<-20)continue; // attached tower backs own this shared internal wall
  const holes=[],n=Math.floor(len/5.4);
  if(len>5)for(let j=0;j<n;j++){
   const u=(j-(n-1)/2)*len/n;
   holes.push({u,y:2.0,w:1.7,h:7.0,arch:true,mat:'glass'});
   holes.push({u,y:12.4,points:circle(.8),mat:'glass'});
  }
  wall('stone',len,.5,17,.55,cx,cz,angle,holes);
  if(len>6)for(let j=0;j<=n;j++){const t=j/Math.max(1,n),x=a[0]+dx*t,z=a[1]+dz*t;box('stone',x,8.8,z,.65,16.3,.65);}
 }
 for(const x of [-6.3,9.3])wall('stone',3.1,.5,17,.55,x,-21.4,Math.PI,[{u:0,y:1,w:1.5,h:3.7,arch:true,mat:'door'}]);
 // Central ridge, apsidal hipped roof and transept roofs; subdued dark copper is the photographed material.
 roof('copper',1.5,1.8,21.8,46.2,17,25);
 cyl('copper',1.5,25.7,10.7,2.8,17.2,24.5,8);
 for(const side of [-1,1])roof('copper',1.5+side*12.8,7.1,7.3,17.5,17.0,23.2);
 function hat(x,z,w,base,top,r){
  const h=w/2,p=[[x-h,base,z-h],[x+h,base,z-h],[x+h,base,z+h],[x-h,base,z+h],[x-r,top,z-r],[x+r,top,z-r],[x+r,top,z+r],[x-r,top,z+r]];
  poly('copper',p,[0,4,5,0,5,1,1,5,6,1,6,2,2,6,7,2,7,3,3,7,4,3,4,0,4,7,6,4,6,5]);
 }
 function onion(x,z,base,top,r,mat='copper'){
  const h=top-base;
  lathe(mat,x,z,[[0,base],[r*.64,base],[r*.91,base+h*.15],[r,base+h*.37],[r*.85,base+h*.63],[r*.45,base+h*.84],[r*.18,top],[0,top]],near?28:16);
 }
 function tower(x,z,w,shaft,bulbBase,bulbTop,cageTop,goldTop,top){
  const half=w/2;
  for(let side=0;side<4;side++){
   const a=side*Math.PI/2,xx=x+Math.sin(a)*half,zz=z+Math.cos(a)*half;
   const holes=[{u:0,y:1,w:2.0,h:4.0,arch:true,mat:'door'},{u:0,y:7,w:2.0,h:6.0,arch:true,mat:'glass'},{u:0,y:16,w:1.85,h:6.8,arch:true,mat:'glass'}];
   if(shaft>33)for(const u of [-1.35,1.35])holes.push({u,y:27,w:1.45,h:7.8,arch:true,mat:'glass'});
   wall('stone',w,0,shaft,.65,xx,zz,a,holes);
   // Narrow vertical pilasters, not window stripes.
   for(const u of [-half+.35,half-.35]){const px=xx+u*Math.cos(a),pz=zz-u*Math.sin(a);box('stone',px,shaft/2,pz,.55,shaft,.55);}
  }
  for(const y of [5.4,15.1,shaft+.3])box(near||y>shaft?'trim':'stone',x,y,z,w+2.0,.6,w+2.0);
  hat(x,z,w+1.2,shaft,bulbBase,w*.31);
  onion(x,z,bulbBase,bulbTop,w*.46);
  const rr=w*.15;
  cyl('copper',x,z,rr*1.2,rr*1.2,bulbTop-.15,bulbTop+.25,8);
  // Actual dark lantern apertures survive the far model.
  for(let i=0;i<8;i++){const a=(i+.5)*Math.PI/4,ap=rr*Math.cos(Math.PI/8),fw=2*rr*Math.sin(Math.PI/8);wall('copper',fw,bulbTop+.2,cageTop,.16,x+ap*Math.sin(a),z+ap*Math.cos(a),a,[{u:0,y:bulbTop+.55,w:fw*.56,h:cageTop-bulbTop-.9,arch:true}]);}
  cyl('copper',x,z,rr*1.28,rr*1.28,cageTop-.1,cageTop+.2,8);
  onion(x,z,cageTop,goldTop,w*.14,'gold');
  beam('gold',[x,goldTop-.05,z],[x,top,z],.09);beam('gold',[x-.45,top-.6,z],[x+.45,top-.6,z],.08);
 }
 tower(1.5,-27.4,12.4,39,44,54,58.2,62.3,64);
 tower(-11.8,-25.3,7.9,29,32,38.1,41.0,43.6,45);
 tower(14.8,-25.3,7.9,29,32,38.1,41.0,43.6,45);
 // The smaller crossing dome and cupola are visible behind the three front towers.
 const cx=1.5,cz=7.2;
 cyl('stone',cx,cz,8.2,8.2,17,25,16);
 lathe('copper',cx,cz,[[0,25],[8.4,25],[7.8,26.2],[5.8,28.3],[2.1,29],[0,29]],near?28:16);
 onion(cx,cz,28.8,34.4,2.15);cyl('copper',cx,cz,.62,.62,34.3,36.5,8);onion(cx,cz,36.4,39.0,.94,'gold');beam('gold',[cx,38.9,cz],[cx,40,cz],.08);
 // Portal frontage thresholds are rigid with their top 0.16 m above grade.
 box('stone',1.5,.08,-33.5,8,.16,.9);
 return k.finish();
}
