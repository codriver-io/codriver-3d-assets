import * as THREE from 'three';import {SPEC,PALETTES} from './config.js';import {kit} from './collegiate-saint-gertrude-nivelles-kit.js';
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,wall,roof,cyl,lathe,quad,poly,beam,put}=k;
 const cx=-1.4;
 function roofX(x0,x1,z,w,eave,peak){
  const p=[[x0,eave,z-w/2],[x1,eave,z-w/2],[x1,peak,z],[x0,peak,z],[x0,eave,z+w/2],[x1,eave,z+w/2]];
  quad('roof',p[0],p[1],p[2],p[3],[0,1,-1]);quad('roof',p[3],p[2],p[5],p[4],[0,1,1]);poly('roof',[p[0],p[3],p[4]],[0,1,2]);poly('roof',[p[1],p[5],p[2]],[0,1,2]);
 }
 // Upper nave, with clerestory bays only where the lower aisles do not conceal them.
 box('stone',cx,.3,-1,14,.6,61.0);
 for(const side of [-1,1])wall('stone',60.5,0,20.6,.6,cx+side*7.0,-1.5,side>0?Math.PI/2:-Math.PI/2,[-14,-8,-2,4,10].map(z=>({u:side>0?-z-1.5:z+1.5,y:15,w:1.7,h:4.0,arch:true,mat:'glass'})));
 roof('roof',cx,-1.5,14.3,61.0,20.6,27.0);
 // Lower nave aisles, independent punched arcades and shed roofs.
 for(const side of [-1,1]){
  const x=cx+side*13.8;
  wall('stone',32.2,0,10.6,.6,x,-1,side>0?Math.PI/2:-Math.PI/2,[-14,-8,-2,4,10].map(z=>({u:side>0?-z-1:z+1,y:2.9,w:1.9,h:5.3,arch:true,mat:'glass'})));
  const outer=cx+side*14.1,inner=cx+side*7.0;
  quad('roof',[outer,10.6,-17.2],[inner,14.0,-17.2],[inner,14.0,15.2],[outer,10.6,15.2],[0,1,0]);
  // Continuous end closures are buried against the transept walls, using the same stone.
  box('stone',(outer+inner)/2,5.3,-17.0,Math.abs(outer-inner),10.6,.6);box('stone',(outer+inner)/2,5.3,15.0,Math.abs(outer-inner),10.6,.6);
 }
 function transept(z,w,d,eave,peak,ornament=false){
  box('stone',cx,.3,z,w,.6,d);
  for(const side of [-1,1]){
   const holes=[-4.5,0,4.5].map(u=>({u,y:7.8,w:2.1,h:11.4,arch:true,mat:'glass'}));
   if(ornament)for(const [n,y] of [[7,23.0],[5,25.5],[3,27.8],[1,29.7]])for(let i=0;i<n;i++)holes.push({u:(i-(n-1)/2)*1.35,y,w:.72,h:1.1,arch:true,mat:'brick'});
   wall('stone',d,0,eave,.65,cx+side*w/2,z,side>0?Math.PI/2:-Math.PI/2,holes,peak);
   for(const u of [-d/2+.5,-d/6,d/6,d/2-.5])box('stone',cx+side*(w/2+.2),9.5,z+u,.7,19,.65);
  }
  // Long end walls have windows outside the attached central nave.
  for(const side of [-1,1])wall('stone',w,0,eave,.6,cx,z+side*d/2,side>0?0:Math.PI,[-w*.38,w*.38].map(u=>({u,y:5,w:1.9,h:9.0,arch:true,mat:'glass'})));
  roofX(cx-w/2,cx+w/2,z,d+.4,eave,peak);
 }
 transept(-24.5,39.6,15.0,20.6,27.5);
 transept(22.2,46.0,14.0,22.0,31.5,true);
 // Eastern flat choir and its small projecting semi-circular apse.
 for(const side of [-1,1])wall('stone',17.2,0,20.6,.6,cx+side*7.0,37.3,side>0?Math.PI/2:-Math.PI/2,[{u:0,y:8,w:2.0,h:9.5,arch:true,mat:'glass'}]);
 wall('stone',14,0,20.6,.6,cx,45.8,0,[-4.5,0,4.5].map(u=>({u,y:8,w:2.0,h:10.0,arch:true,mat:'glass'})),27.0);
 roof('roof',cx,37.3,14.4,17.0,20.6,27.0);
 box('stone',-11.5,5.0,40.5,5.5,10,10.7);roof('roof',-11.5,40.5,5.8,10.9,10,13.2);
 function apse(x,z,r,base,wallTop,roofTop,front=true,large=false){
  const N=large?16:8,a0=front?Math.PI/2:-Math.PI/2;
  const shape=new THREE.Shape();shape.moveTo(x-r,-z);for(let i=0;i<=N;i++){const a=a0+i*Math.PI/N,xx=x+r*Math.sin(a),zz=z+r*Math.cos(a);i?shape.lineTo(xx,-zz):shape.moveTo(xx,-zz);}shape.closePath();const floor=new THREE.ExtrudeGeometry(shape,{depth:.5,bevelEnabled:false});floor.rotateX(-Math.PI/2);put(floor,'stone');
  const facet=2*r*Math.sin(Math.PI/(2*N)),ap=r*Math.cos(Math.PI/(2*N));
  for(let i=0;i<N;i++){
   const a=a0+(i+.5)*Math.PI/N,xx=x+ap*Math.sin(a),zz=z+ap*Math.cos(a),holes=[];
   if(large&&[1,4,7,10,13].includes(i))holes.push({u:0,y:5.8,w:1.1,h:6.6,arch:true,mat:'glass'});
   if(!large&&i%2===1)holes.push({u:0,y:4,w:.7,h:5.8,arch:true,mat:'glass'});
   wall('stone',facet,base,wallTop,.35,xx,zz,a,holes);
   if(large)wall('stone',facet,wallTop,wallTop+2.7,.3,xx,zz,a,[{u:0,y:wallTop+.25,w:facet*.57,h:2.1,arch:true,mat:'glass'}]);
  }
  const y=wallTop+(large?2.7:0);cyl('roof',x,z,r+.25,.05,y,roofTop,large?(near?32:12):(near?16:8));
 }
 apse(cx,45.7,2.6,0,13.2,16.0,false,false);
 // Northern eastern chapel visible beside the main choir in the 2025 exterior.
 const ax=11.4,az=32.6,aw=12.0,ad=6.3;
 box('stone',ax,.3,az,aw,.6,ad);
 for(let i=0;i<4;i++){const a=i*Math.PI/2,w=i%2?ad:aw,x=ax+Math.sin(a)*aw/2,z=az+Math.cos(a)*ad/2,holes=[];if(i===0||i===1)for(const u of (i===0?[-3.6,0,3.6]:[-1.6,1.6])){holes.push({u,y:1.5,w:1.25,h:3.5,arch:true,mat:'glass'});holes.push({u,y:7.1,w:1.25,h:3.7,mat:'glass'});}wall('stone',w,0,12.6,.5,x,z,a,holes);}
 const hp=[[ax-6.15,12.6,az-3.3],[ax+6.15,12.6,az-3.3],[ax+6.15,12.6,az+3.3],[ax-6.15,12.6,az+3.3],[ax-3.5,15.5,az-.3],[ax+3.5,15.5,az-.3],[ax+3.5,15.5,az+.3],[ax-3.5,15.5,az+.3]];
 poly('roof',hp,[0,4,5,0,5,1,1,5,6,1,6,2,2,6,7,2,7,3,3,7,4,3,4,0,4,7,6,4,6,5]);

 // Broad western barlong mass: front twin-window rows and upper blind arcade.
 const wx=-1.05,wz=-39.0,ww=29.2,wd=14.0,wh=28.4;
 box('stone',wx,.3,wz,ww,.6,wd);
 const frontHoles=[];for(const u of [-11,11])frontHoles.push({u,y:14.0,w:1.3,h:3.0,arch:true,mat:'glass'});
 for(const u of [-11,-7,-3,3,7,11])for(const v of [-.55,.55])frontHoles.push({u:u+v,y:21.1,w:.8,h:2.6,arch:true,mat:'glass'});
 for(let i=0;i<15;i++)frontHoles.push({u:-12.6+i*1.8,y:25.2,w:.9,h:1.8,arch:true,mat:'glass'});
 wall('stone',ww,0,wh,.65,wx,wz-wd/2,Math.PI,frontHoles);
 wall('stone',ww,0,wh,.65,wx,wz+wd/2,0,[]);
 for(const side of [-1,1])wall('stone',wd,0,wh,.65,wx+side*ww/2,wz,side>0?Math.PI/2:-Math.PI/2,[-4.8,4.8].flatMap(u=>[14.0,21.1,25.2].map(y=>({u,y,w:y>25?.8:1.1,h:y>25?1.8:2.8,arch:true,mat:'glass'}))));
 roof('roof',wx,wz,ww+.3,wd-.5,28.4,31.5);
 apse(wx,-44.0,9.2,0,15.5,21.0,true,true);
 // Current octagonal tower (1984 reconstruction), rather than the pre-war Gothic steeple.
 const tx=wx,tz=-39.0;
 cyl('stone',tx,tz,6.6,6.2,28.4,33.6,8);
 const n=8,r=6.2,ap=r*Math.cos(Math.PI/8),facet=2*r*Math.sin(Math.PI/8);
 for(let i=0;i<n;i++){const a=(i+.5)*Math.PI/4;wall('stone',facet,33.5,40.3,.35,tx+ap*Math.sin(a),tz+ap*Math.cos(a),a,[-1.0,1.0].map(u=>({u,y:34.3,w:1.2,h:4.8,arch:true,mat:'glass'})));}
 cyl('roof',tx,tz,7.1,.08,40.25,48.8,8);beam('gold',[tx,48.7,tz],[tx,50.0,tz],.10);beam('gold',[tx-.38,49.65,tz],[tx+.38,49.65,tz],.08);
 for(const x of [-16.3,14.2]){
  const z=-39.4,r=2.75;
  cyl('stone',x,z,r,r,0,30.4,near?24:8);
  for(const y of [11.4,25.4,30.0])cyl('stone',x,z,r+.12,r+.12,y,y+.28,near?24:8);
  const N=12,ap=r*Math.cos(Math.PI/N),fw=2*r*Math.sin(Math.PI/N);
  for(let i=0;i<N;i++){const a=(i+.5)*2*Math.PI/N;wall('stone',fw,30.4,34.5,.22,x+ap*Math.sin(a),z+ap*Math.cos(a),a,[{u:0,y:30.8,w:.8,h:3.15,arch:true,mat:'glass'}]);}
  cyl('roof',x,z,3.2,.06,34.5,40.5,near?24:8);
 }
 // The small gilded jacquemart on the southern turret: helmet, torso and joined limbs.
 const sx=-19.05,sz=-39.4;box('stone',sx,30.0,sz,1.0,.35,1.0);
 for(const d of [-.15,.15])cyl('gold',sx+d,sz,.10,.10,30.1,30.8,near?6:5);
 lathe('gold',sx,sz,[[0,30.65],[.28,30.65],[.24,31.5],[.12,31.72],[0,31.72]],near?8:5);cyl('gold',sx,sz,.19,.19,31.7,32.05,near?8:5);cyl('gold',sx,sz,.24,.02,32.0,32.3,near?8:5);
 beam('gold',[sx,31.35,sz],[sx-.35,31.15,sz+.15],.12);beam('gold',[sx,31.35,sz],[sx+.35,31.6,sz+.12],.12);
 return k.finish();
}
