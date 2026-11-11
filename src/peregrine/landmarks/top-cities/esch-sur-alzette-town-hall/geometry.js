import * as THREE from 'three';import polygonClipping from 'polygon-clipping';import {SPEC,PALETTES} from './config.js';import {kit} from './esch-sur-alzette-town-hall-kit.js';
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,wall,roof,poly,quad,cyl,lathe,beam,put}=k;
 const W=53.6,D=20.6,H=14.8,front=-9.8;
 box('stone',0,.175,0,W,.35,D);
 const rows=[[1.15,2.1],[4.7,2.35],[8.25,2.35],[11.85,2.0]];
 function frame(x,z,a,u,y,w,h){
  const F=(v,yy)=>[x+Math.sin(a)*.34+v*Math.cos(a),yy,z+Math.cos(a)*.34-v*Math.sin(a)],out=[Math.sin(a),0,Math.cos(a)];
  const V=(uu,yy,ww,hh)=>quad('trim',F(uu-ww/2,yy-hh/2),F(uu+ww/2,yy-hh/2),F(uu+ww/2,yy+hh/2),F(uu-ww/2,yy+hh/2),out);
  V(u,y+h/2,.065,h-.08);for(const f of near?[1/3,2/3]:[.5])V(u,y+h*f,w-.08,.065);
 }
 function facade(w,x,z,a,bays,levels=rows){const holes=[];for(const u of bays)for(const [y,h] of levels)holes.push({u,y,w:1.45,h,mat:'glass'});wall('stone',w,.35,H,.55,x,z,a,holes);for(const u of bays)for(const [y,h] of levels)frame(x,z,a,u,y,1.45,h);}
 // Two street-facing wings; the central risalit owns its own facade.
 for(const side of [-1,1])facade(17.6,side*18.0,front,Math.PI,[-6.6,-3.3,0,3.3,6.6]);
 facade(W,0,9.8,0,Array.from({length:15},(_,i)=>(i-7)*3.45));
 for(const side of [-1,1])facade(D,side*26.25,0,side>0?Math.PI/2:-Math.PI/2,[-7.4,-3.7,0,3.7,7.4]);
 const cz=-11.8,cx=.3,cw=18.35,holes=[];
 for(const u of [-6.4,-3.2,0,3.2,6.4]){holes.push({u,y:4.6,w:1.65,h:6.1,mat:'glass'});holes.push({u,y:12.0,w:1.65,h:2.05,mat:'glass'});}
 for(const u of [-3.6,0,3.6])holes.push({u,y:.3,w:1.8,h:3.3,mat:'door'});
 wall('stone',cw,.3,H,.6,cx,cz,Math.PI,holes,19.55);
 for(const u of [-6.4,-3.2,0,3.2,6.4]){frame(cx,cz,Math.PI,u,4.6,1.65,6.1);frame(cx,cz,Math.PI,u,12,1.65,2.05);}
 // Side cheeks close the central forward projection.
 for(const side of [-1,1])box('stone',cx+side*cw/2,H/2,-10.8,.55,H,2.1);
 for(const u of [-8,-4.8,-1.6,1.6,4.8,8])box('stone',cx-u,7.5,cz-.58,.55,6.7,.45);
 box('stone',cx,11.35,cz-.2,cw+.4,.55,1.1);
 // Four square piers carry a shallow entrance canopy; all feet meet the raised threshold.
 box('stone',cx,.15,-11.9,11.5,.3,2.8);
 for(const x of [-4.5,-1.5,1.5,4.5]){box('stone',cx+x,2.1,-12.7,.68,3.6,.68);box('stone',cx+x,3.8,-12.7,.9,.25,.9);}
 box('stone',cx,4.05,-12.1,11.4,.45,2.3);
 box('stone',cx,.06,-13.5,10.5,.12,.45);
 // Broken-slope hipped roof: full corner hips, not a giant gable extrusion.
 function hip(w0,d0,y0,w1,d1,y1){const p=[[-w0/2,y0,-d0/2],[w0/2,y0,-d0/2],[w0/2,y0,d0/2],[-w0/2,y0,d0/2],[-w1/2,y1,-d1/2],[w1/2,y1,-d1/2],[w1/2,y1,d1/2],[-w1/2,y1,d1/2]];poly('roof',p,[0,4,5,0,5,1,1,5,6,1,6,2,2,6,7,2,7,3,3,7,4,3,4,0,4,7,6,4,6,5]);}
 hip(54.1,21.0,14.8,51.2,17.0,17.2);hip(51.2,17,17.2,41.5,.8,21.2);
 // Small slate cap behind the projected stone pediment.
 roof('roof',cx,-10.8,18.4,2.2,14.8,19.6);
 for(const side of [-1,1])for(const x of (near?[12.8,16.4,20.0,23.6]:[13.2,18.4,23.3])){
  const xx=side*x,z=-9.0;
  wall('stone',1.35,16.2,18.35,.22,xx,z,Math.PI,[{u:0,y:16.8,w:.9,h:1.2,mat:'glass'}]);
  box('stone',xx,17.4,z+.65,1.35,1.4,1.3);roof('roof',xx,z+.45,1.65,1.65,18.3,18.75);
 }
 // Roof photovoltaic fields are muted flat panels, following the real plane, with no branding.
 // Near-only solar fields follow the measured roof plane, on four short supports per panel.
 if(near)for(const x of [-19.5,-16.5,-13.5])for(const z of [-7.2,-5.7,-4.2,-2.7]){
  const Y=z=>17.2+(z+8.5)*4/8.1,dy=.28;
  quad('glass',[x,Y(z)+dy,z],[x+2.6,Y(z)+dy,z],[x+2.6,Y(z+1.25)+dy,z+1.25],[x,Y(z+1.25)+dy,z+1.25],[0,1,0]);
  for(const xx of [x+.12,x+2.48])for(const zz of [z+.12,z+1.13])box('roof',xx,Y(zz)+dy/2,zz,.06,dy,.06);
 }
 // Two joined human groups span 79% of the tympanum around a blank central panel.
 box('trim',cx,17.0,cz-.68,1.9,1.8,.30);
 const silhouettes=[],limbs=[];
 function shape(p){silhouettes.push(p);}
 function limb(p,w){for(let i=0;i<p.length-1;i++){const a=p[i],b=p[i+1],d=Math.hypot(b[0]-a[0],b[1]-a[1]),nx=-(b[1]-a[1])*w/(2*d),ny=(b[0]-a[0])*w/(2*d);shape([[a[0]+nx,a[1]+ny],[b[0]+nx,b[1]+ny],[b[0]-nx,b[1]-ny],[a[0]-nx,a[1]-ny]]);}for(const [x,y] of p)shape(Array.from({length:8},(_,i)=>[x+w/2*Math.cos(i*Math.PI/4),y+w/2*Math.sin(i*Math.PI/4)]));}
 // Inner upright, seated figure: broad shoulder/waist silhouette, separate head and bent legs.
 shape([[1.72,17.65],[2.15,17.82],[2.62,17.62],[2.98,17.05],[3.08,16.48],[2.74,16.12],[2.13,16.18],[1.78,16.57],[1.56,17.12]]);
 shape([[1.98,17.65],[2.34,17.65],[2.38,17.94],[2.0,17.94]]);
 limb([[1.8,17.45],[1.3,17.05],[.92,17.22]],.34);
 limb([[2.6,17.4],[3.25,17.0],[3.8,16.45],[4.35,16.3]],.38);
 limb([[2.6,16.4],[3.95,15.62],[5.25,15.08]],.46);
 limb([[2.45,16.35],[2.95,15.55],[2.55,15.06],[3.35,15.04]],.39);
 // Outer reclining figure joins the first at the hands; its bent knee and foot extend outward.
 shape([[4.28,16.5],[4.7,16.65],[5.15,16.4],[5.60,15.95],[5.27,15.53],[4.55,15.54],[4.16,15.95]]);
 limb([[4.35,16.4],[3.8,16.55],[3.35,16.93]],.32);
 limb([[5.1,16.3],[5.85,15.82],[6.65,15.56]],.30);
 limb([[5.15,15.78],[6.02,15.12],[7.08,15.08]],.38);
 limb([[4.95,15.7],[5.35,15.05],[6.22,15.05]],.34);
 const joined=polygonClipping.union(...silhouettes.map(p=>[[[...p,p[0]]]]));
 for(const side of [-1,1]){
  for(const polygon of joined){const outline=polygon[0].map(([x,y])=>[-(cx+side*x),y]);k.panel('sculpture',outline,.42,0,cz-.50,Math.PI,polygon.slice(1).map(p=>({points:p.map(([x,y])=>[-(cx+side*x),y])})));}
  for(const [x,y,r] of [[2.16,18.07,.30],[4.59,16.90,.27]]){
   const head=new THREE.SphereGeometry(r,near?12:8,near?8:5);head.scale(1,1.08,.78);head.translate(cx+side*x,y,cz-.78);put(head,'sculpture');
   // A small nose and brow make the head distinct from a finial, without facial texture.
   const nose=new THREE.SphereGeometry(r*.28,6,4);nose.scale(.7,1,.8);nose.translate(cx+side*x,y-.03,cz-1.01);put(nose,'sculpture');
  }
 }
 const root=k.finish();root.userData.relief={groups:2,figuresPerGroup:2,span:14.54,tympanumWidth:cw,componentsPerGroup:joined.length};return root;
}
