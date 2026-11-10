import * as THREE from 'three';
import { SPEC,PALETTES,MANIFEST } from './config.js';
import { kit } from './parts.js';
// West front into Church Street; three porticoes and long octagonal needle.
export function create({detail='near'}={}) {
 const k=kit(SPEC,PALETTES,detail),{near,put,box,cyl,lathe,wall,portico,roof}=k,cx=-15.0;
 box('plaster',.25,.35,-.45,41.1,.7,20.8);
 for(const s of [-1,1]){
  const holes=Array.from({length:6},(_,i)=>({u:(s>0?1:-1)*(-5.8+i*4.55),y:3.15,w:2.15,h:7.2,arch:true,mat:'glass'}));
  wall('plaster',41.1,.7,12.0,.7,.25,s>0?9.25:-10.15,s>0?0:Math.PI,holes);
 }
 wall('plaster',20.8,.7,12.0,.7,-20.25,-.45,-Math.PI/2,[{u:0,y:.7,w:3.2,h:6.2,arch:true,mat:'shadow'},{u:-6.5,y:3.2,w:1.9,h:6.8,arch:true,mat:'glass'},{u:6.5,y:3.2,w:1.9,h:6.8,arch:true,mat:'glass'}]);
 wall('plaster',20.8,.7,12.0,.7,20.1,-.45,Math.PI/2,[{u:-7,y:3.2,w:2,h:6.8,arch:true,mat:'glass'},{u:7,y:3.2,w:2,h:6.8,arch:true,mat:'glass'}]);
 box('plaster',.25,12.1,-.45,41.6,.6,21.2);k.gable('plaster',-20.5,-8.7,12.4,17.5,21.2);
 k.quad('roof',[-8.7,12.4,-10.6],[-8.7,17.5,0],[20.8,17.5,0],[20.8,12.4,-10.6]);
 k.quad('roof',[-8.7,12.4,10.6],[20.8,12.4,10.6],[20.8,17.5,0],[-8.7,17.5,0]);
 k.poly('plaster',[[20.8,12.4,-10.6],[20.8,12.4,10.6],[20.8,17.5,0]],[0,2,1]);
 // Semi-circular eastern chancel, fitted to the mapped 4.4 m apse radius.
 cyl('plaster',20.6,-.45,4.5,4.5,.7,10.4,near?24:12);
 lathe('roof',20.6,-.45,[[0,10.4],[4.65,10.4],[4.2,11.1],[2.5,12],[0,12.4]],near?24:12);
 portico(-24.5,-20.2,12.3,.7,10.6,15.2,4);
 // North and south tetrastyle porticoes share the west vestibule; all column feet meet their podium.
 for(const side of [-1,1]){
  const z=side<0?-12.1:11.2;
  box('plaster',-14.65,.35,z,11.25,.7,3.65);
  for(let i=0;i<4;i++)lathe('plaster',-19.2+i*3.02,z+side*1.1,[[0,.7],[.7,.7],[.7,.95],[.58,1.12],[.48,10.05],[.7,10.3],[.75,10.6],[0,10.6]],near?16:8);
  box('plaster',-14.65,11.25,z,11.7,1.3,3.8);
  const sh=new THREE.Shape([new THREE.Vector2(-5.85,11.9),new THREE.Vector2(5.85,11.9),new THREE.Vector2(0,15.2)]);
  const g=new THREE.ExtrudeGeometry(sh,{depth:3.8,bevelEnabled:false});g.translate(-14.65,0,side<0?-14.0:9.3);put(g,'plaster');
 }
 // Square brick/stucco tower base, four circular oculi cut through its skin.
 for(let i=0;i<4;i++){const a=i*Math.PI/2;wall('plaster',9.1,14.5,22.15,.68,cx+3.87*Math.sin(a),3.87*Math.cos(a),a,[{u:0,y:18.25,w:1.85,h:1.85,circle:true,mat:'glass'}]);}
 box('plaster',cx,22.35,0,9.65,.4,9.65);
 lathe('plaster',cx,0,[[0,22.55],[4.8,22.55],[4.0,26.0],[4.0,26.5],[0,26.5]],8);
 function oct(r,y0,y1,opening,clock=false){
  const w=2*r*Math.tan(Math.PI/8);
  for(let i=0;i<8;i++){
   const a=i*Math.PI/4, h=opening?{u:0,y:y0+.75,w:opening[0],h:opening[1],arch:true,mat:"shadow"}:null;
   const isClock=clock && i%2===0;
   wall("plaster",w,y0,y1,.58,cx+(r-.58)*Math.sin(a),(r-.58)*Math.cos(a),a,isClock?[{u:0,y:y0+1.4,w:2.25,h:2.25,circle:true}]:h?[h]:[]);
   if(near&&h&&!isClock){
    // Each louvre crosses an actual aperture and ends in its jambs.
    for(let y=h.y+.2;y<h.y+h.h-.2;y+=near?.36:.7){const dy=Math.max(0,y-(h.y+h.h-h.w/2));const hw=dy?Math.sqrt(Math.max(0,(h.w/2)**2-dy**2)):h.w/2;
     const g=new THREE.BoxGeometry(2*hw,.10,.22);g.translate(0,y,r-.32);g.rotateY(a);g.translate(cx,0,0);put(g,"shadow");}
   }
   if(isClock){
    const cy=y0+2.525, face=new THREE.Shape();face.absarc(0,0,1.125,0,2*Math.PI,false);
    const holes=[];
    for(let j=0;j<12;j++){const t=j*Math.PI/6,st=Math.sin(t),ct=Math.cos(t);holes.push([[-.04,.80],[.04,.80],[.04,1.02],[-.04,1.02]].map(([u,v])=>[u*ct+v*st,-u*st+v*ct]));}
    // One non-self-intersecting pair of clock hands, partitioned into the dial.
    holes.push([[0,-.07],[.65,.34],[.59,.43],[0,.08],[-.44,.68],[-.53,.61],[-.07,-.02]]);
    for(const p of holes){const path=new THREE.Path(p.map(v=>new THREE.Vector2(...v)));path.closePath();face.holes.push(path);
     const g=new THREE.ShapeGeometry(new THREE.Shape(p.map(v=>new THREE.Vector2(...v))));g.translate(0,cy,r-.39);g.rotateY(a);g.translate(cx,0,0);put(g,"gold");}
    const g=new THREE.ShapeGeometry(face,near?24:12);g.translate(0,cy,r-.39);g.rotateY(a);g.translate(cx,0,0);put(g,"shadow");
   }
  }
 }
 oct(4.0,26.5,33.2,[1.65,5.1]);cyl('plaster',cx,0,4.4,4.4,33.2,33.85,8);
 oct(3.55,33.85,39.25,[1.15,3.2],true);cyl('plaster',cx,0,3.95,3.95,39.25,39.9,8);
 // Open octagonal upper belfry with pilastered corner piers.
 const rr=2.72,w=2*rr*Math.tan(Math.PI/8);
 for(let i=0;i<8;i++){const a=i*Math.PI/4;wall('plaster',w,39.9,45.05,.5,cx+(rr-.5)*Math.sin(a),(rr-.5)*Math.cos(a),a,[{u:0,y:40.25,w:1.38,h:4.4,arch:true}]);}
 cyl('plaster',cx,0,3.08,3.08,45.05,45.65,8);
 // Long weathered brown octagonal spire, unlike St Michael's short white ribbed needle.
 lathe('roof',cx,0,[[0,45.65],[1.88,45.65],[1.83,46.3],[1.47,47.1],[1.32,48.3],[.24,54.3],[0,54.9]],8);
 cyl('gold',cx,0,.07,.07,54.65,56,6);
 const orb=new THREE.SphereGeometry(.22,near?10:6,near?6:4);orb.translate(cx,54.8,0);put(orb,'gold');
 // Small gilded vane silhouette; no lettering.
 const vane=new THREE.BoxGeometry(.11,.22,.65);vane.translate(cx,55.8,0);put(vane,'gold');
 const r=k.finish();r.userData.elevationDatum=MANIFEST.elevationDatum;return r;
}
