import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {LOCAL_RINGS} from './footprint.js';
import {kit} from './san-pedro-claver-cartagena-parts.js';
export const DOME_Z=-15.4;
export const TOWERS=[-10.5,10.5];
export function balconyPosts(x,detail='near'){const p=[],n=detail==='far'?3:6;for(let side=0;side<4;side++){const a=side*Math.PI/2;for(let i=0;i<=n;i++){const u=-2.8+5.6*i/n;p.push([x+u*Math.cos(a)+2.85*Math.sin(a),21.5,24.8-u*Math.sin(a)+2.85*Math.cos(a)]);}}return p;}
export function domeRadius(y){const t=Math.max(0,Math.min(1,(y-28.25)/9.75));return 5.6*Math.pow(Math.max(0,1-Math.pow(t,1.6)),.65)*(.973+.12*Math.sin(Math.PI*t));}
export function domePoint(a,u,y,inset=0){const r=domeRadius(y),ap=r*Math.cos(Math.PI/8)-inset,half=r*Math.sin(Math.PI/8);return[ap*Math.sin(a)+u*half*Math.cos(a),y,DOME_Z+ap*Math.cos(a)-u*half*Math.sin(a)];}
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,wall,bar,poly,cyl}=k;
 k.prism('stone',LOCAL_RINGS[0],0,.15);k.shell('stone',LOCAL_RINGS,0,13,[4.8,9.3],near?8:10);
 // Central nave and low tile aisles, with the mapped front facade owning its portal and rose.
 for(const sign of [-1,1])wall('stone',55.7,13,20.6,.75,sign*(7.4-.75),-.1,sign>0?Math.PI/2:-Math.PI/2,[-23,-15,-7,1,9,16].map(u=>({u,y:14.0,w:1.8,h:5.3,arch:true,mat:'glass'})));
 function roof(x,z,w,d,y,h){poly('roof',[[x-w/2,y,z-d/2],[x,y+h,z-d/2],[x,y+h,z+d/2],[x-w/2,y,z+d/2]],[0,2,1,0,3,2]);poly('roof',[[x,y+h,z-d/2],[x+w/2,y,z-d/2],[x+w/2,y,z+d/2],[x,y+h,z+d/2]],[0,2,1,0,3,2]);}
 roof(0,-.1,15.2,55.8,20.6,2.8);for(const sign of [-1,1])roof(sign*10.6,-1.5,6.4,53.0,13.0,1.25);
 wall('stone',14.8,0,21.3,.75,0,27.85,0,[{u:0,y:.2,w:4.8,h:7.2,arch:true},{u:0,y:14.0,w:4.6,h:4.6,circle:true,mat:'glass'},{u:0,y:10.0,w:1.6,h:2.7,arch:true,mat:'glass'}]);
 for(const y of [12.9,21.2])box('stone',0,y,28.6,15.2,.32,.55);
 for(const x of [-7,-4.0,4.0,7]){box('stone',x,10.7,28.7,.5,21.3,.6);box('stone',x,8.15,28.8,.8,.35,.85);box('stone',x,12.7,28.8,.8,.35,.85);}
 // Open lower portal with a red arched tympanum; no texture or copied carved doorwork.
 const arc=[[-2.4,4.6],[2.4,4.6],[2.4,5.0],...Array.from({length:near?13:7},(_,i)=>{const a=i*Math.PI/(near?12:6);return[2.4*Math.cos(a),5+2.4*Math.sin(a)];})];const door=new THREE.ShapeGeometry(new THREE.Shape(arc.map(v=>new THREE.Vector2(...v))));door.translate(0,0,28.15);k.put(door,'wood');
 function rose(x,y,r,z,mat){const tor=new THREE.TorusGeometry(r,.09,near?6:4,near?32:16);tor.translate(x,y,z);k.put(tor,mat);for(let i=0;i<(near?12:8);i++){const a=i*Math.PI*2/(near?12:8);bar(mat,[x,y,z],[x+r*.9*Math.sin(a),y+r*.9*Math.cos(a),z],.045);}}
 rose(0,16.3,2.3,28.57,'trim');
 // Small original robed figure in the central niche, intentionally simplified rather than traced.
 const robe=new THREE.ConeGeometry(.38,1.1,near?8:5);robe.translate(0,10.65,28.35);k.put(robe,'stone');k.sphere('stone',0,11.55,28.35,.18);box('stone',0,10.0,28.4,1.1,.2,.6);
 // Twin front towers with red roses and two genuinely open bell arches on every side.
 for(const x of TOWERS){
  k.block('stone',x,24.8,6.4,6.4,0,21.4,{south:[{u:0,y:.4,w:1.5,h:3.5,mat:'wood'},...[7.2,14.2].map(y=>({u:0,y,w:1.9,h:1.9,circle:true,mat:'glass'})),{u:0,y:17,w:.95,h:2.1,mat:'wood'}]});
  for(const y of [12.9,21.3])box('stone',x,y,24.8,6.8,.35,6.8);
  for(const y of [8.15,15.15])rose(x,y,.95,28.09,'wood');
  for(const s of [-1,1])box('stone',x+s*2.8,10.6,28.1,.5,21.2,.5);
  box('stone',x,21.4,24.8,6.65,.4,6.65);
  for(let i=0;i<4;i++){
   const a=i*Math.PI/2;wall('stone',6.4,21.5,26.8,.65,x+2.55*Math.sin(a),24.8+2.55*Math.cos(a),a,[-1.35,1.35].map(u=>({u,y:21.8,w:1.65,h:4.3,arch:true})));
  }
  box('stone',x,26.95,24.8,7.0,.5,7.0);
  for(const p of balconyPosts(x,detail))bar('trim',p,[p[0],22.5,p[2]],.12);
  for(let i=0;i<4;i++){const a=i*Math.PI/2,point=u=>[x+u*Math.cos(a)+2.85*Math.sin(a),22.4,24.8-u*Math.sin(a)+2.85*Math.cos(a)];bar('rail',point(-2.8),point(2.8),.11);}
  bar('metal',[x,25.1,24.8],[x,27.05,24.8],.14);k.lathe('metal',x,24.8,[[0,24.25],[.65,24.25],[.55,24.6],[.28,25.2],[0,25.3]],near?14:8);
  k.dome('roof',x,24.8,3.35,27.2,3.2);
  k.block('stone',x,24.8,2.25,2.25,30.35,33.5,Object.fromEntries(['south','north','east','west'].map(f=>[f,[{u:0,y:30.8,w:1.2,h:2.2,arch:true}]])));
  box('stone',x,33.45,24.8,2.75,.25,2.75);const hip=new THREE.ConeGeometry(1.85,2.0,4);hip.rotateY(Math.PI/4);hip.translate(x,34.5,24.8);k.put(hip,'metal');
 }
 // Original scroll outline with adjacent white/cream regions, a real clock aperture and no lettering.
 const outline=[[-7.2,21.3],[-7.2,22.05],[-5.7,22.05],[-4.8,22.9],[-3.3,22.5],[-3,25],[-2.2,25.5],[2.2,25.5],[3,25],[3.3,22.5],[4.8,22.9],[5.7,22.05],[7.2,22.05],[7.2,21.3]],inside=outline.map(([x,y])=>[Math.sign(x)*(Math.abs(x)-.2),Math.abs(y-21.3)<.01?y+.2:y-.2]),frame=new THREE.Shape(outline.map(v=>new THREE.Vector2(...v)));frame.holes.push(new THREE.Path(inside.map(v=>new THREE.Vector2(...v))));const fill=new THREE.Shape(inside.map(v=>new THREE.Vector2(...v))),ch=new THREE.Path();ch.absellipse(0,23.55,1.2,1.2,0,Math.PI*2,true);fill.holes.push(ch);
 for(const [shape,mat]of [[frame,'trim'],[fill,'cream']]){const g=new THREE.ShapeGeometry(shape);g.translate(0,0,28.71);k.put(g,mat);}
 const dial=new THREE.CircleGeometry(1.18,near?32:16);dial.translate(0,23.55,28.65);k.put(dial,'trim');for(let i=0;i<12;i++){const a=i*Math.PI/6;bar('metal',[.9*Math.sin(a),23.55+.9*Math.cos(a),28.73],[1.05*Math.sin(a),23.55+1.05*Math.cos(a),28.73],.04);}bar('metal',[0,23.55,28.74],[.65,24.15,28.74],.055);bar('metal',[0,23.55,28.74],[-.5,23.3,28.74],.045);
 // Pale octagonal drum with proper arched windows and integral edge pilasters.
 const dr=6,da=dr*Math.cos(Math.PI/8),dw=2*dr*Math.sin(Math.PI/8);
 cyl('trim',0,DOME_Z,6.15,6.15,22.4,22.8,8);
 for(let i=0;i<8;i++){
  const a=i*Math.PI/4;wall('cream',dw-.64,22.7,28.0,.65,(da-.65)*Math.sin(a),DOME_Z+(da-.65)*Math.cos(a),a,[{u:0,y:23.6,w:2.45,h:3.65,arch:true,mat:'glass'}]);
  for(const sign of [-1,1]){const u0=sign*(dw/2-.32),u1=sign*dw/2,point=(u,y)=>[da*Math.sin(a)+u*Math.cos(a),y,DOME_Z+da*Math.cos(a)-u*Math.sin(a)],v=[point(Math.min(u0,u1),22.7),point(Math.max(u0,u1),22.7),point(Math.max(u0,u1),28),point(Math.min(u0,u1),28)];poly('trim',v,[0,1,2,0,2,3]);}
 }
 cyl('trim',0,DOME_Z,6.2,6.2,27.95,28.35,8);
 // Eight ribbed curved panels. Oculi are cut from the shell, then rimmed with adjacent white annuli.
 for(let i=0;i<8;i++){
  const a=i*Math.PI/4,ys=[28.25,29.5,31,32.8,34.2,35.5,36.7,37.5,38];
  for(let j=0;j<ys.length-1;j++){
   const y0=ys[j],y1=ys[j+1];for(const [u0,u1]of [[-1,-.94],[.94,1]])poly('trim',[domePoint(a,u0,y0),domePoint(a,u1,y0),domePoint(a,u1,y1),domePoint(a,u0,y1)],y1===38?[0,1,2]:[0,1,2,0,2,3]);
   if(y0===32.8){const shape=new THREE.Shape([[-.94,y0],[.94,y0],[.94,y1],[-.94,y1]].map(v=>new THREE.Vector2(...v))),hole=new THREE.Path();hole.absellipse(0,33.5,.37,.6,0,Math.PI*2,true);shape.holes.push(hole);const g=new THREE.ShapeGeometry(shape,near?16:10),p=g.getAttribute('position');for(let v=0;v<p.count;v++){const q=domePoint(a,p.getX(v),p.getY(v));p.setXYZ(v,...q);}g.computeVertexNormals();k.put(g,'cream');
    const n=near?20:12;for(let v=0;v<n;v++){const b=v*Math.PI*2/n,c=(v+1)*Math.PI*2/n;poly('trim',[domePoint(a,.37*Math.cos(b),33.5+.6*Math.sin(b)),domePoint(a,.37*Math.cos(c),33.5+.6*Math.sin(c)),domePoint(a,.30*Math.cos(c),33.5+.48*Math.sin(c)),domePoint(a,.30*Math.cos(b),33.5+.48*Math.sin(b))],[0,1,2,0,2,3]);}
    const disc=new THREE.ShapeGeometry(new THREE.Shape(Array.from({length:n},(_,v)=>{const b=v*Math.PI*2/n;return new THREE.Vector2(.3*Math.cos(b),33.5+.48*Math.sin(b));})));const dp=disc.getAttribute('position');for(let v=0;v<dp.count;v++){const q=domePoint(a,dp.getX(v),dp.getY(v),.15);dp.setXYZ(v,...q);}disc.computeVertexNormals();k.put(disc,'glass');
   }else poly('cream',[domePoint(a,-.94,y0),domePoint(a,.94,y0),domePoint(a,.94,y1),domePoint(a,-.94,y1)],y1===38?[0,1,2]:[0,1,2,0,2,3]);
  }
 }
 cyl('trim',0,DOME_Z,1.25,1.25,37.8,38.2,8);
 for(let i=0;i<8;i++){const a=i*Math.PI/4,ap=1.0,w=2*Math.tan(Math.PI/8);wall('trim',w,38.15,41.5,.2,(ap-.2)*Math.sin(a),DOME_Z+(ap-.2)*Math.cos(a),a,[{u:0,y:38.55,w:.52,h:2.35,arch:true,mat:'glass'}]);}
 const top=new THREE.ConeGeometry(1.25,1.8,8);top.rotateY(Math.PI/8);top.translate(0,42.4,DOME_Z);k.put(top,'cream');k.sphere('trim',0,43.3,DOME_Z,.15);bar('rail',[0,43.3,DOME_Z],[0,44,DOME_Z],.065);bar('rail',[-.3,43.75,DOME_Z],[.3,43.75,DOME_Z],.06);
 return k.finish();
}
