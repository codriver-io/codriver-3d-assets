import * as THREE from "three";
import { SPEC, PALETTES, MANIFEST } from "./config.js";
import { kit } from "./parts.js";
// A square lower tower, three diminishing octagons, and fluted needle.
// The lower two octagons are closed except for real louvred apertures; the lantern is open.
export function create({detail="near"}={}){
 const k=kit(SPEC,PALETTES,detail),{near,put,box,cyl,lathe,wall,portico,roof}=k;
 const cx=-11.6;
 box("plaster",.8,.38,0,33.8,.76,20.15);
 const bays=Array.from({length:6},(_,i)=>-13+i*5.55);
 for(const s of [-1,1]){
  const holes=[];for(const x of bays)for(const y of [2.0,7.5])holes.push({u:x,y,w:2.05,h:3.55,arch:true,mat:"glass"});
  wall("plaster",33.8,.75,12.3,.65,.8,s*9.45,s>0?0:Math.PI,holes.map(o=>({...o,u:s>0?o.u:-o.u})));
  for(let i=0;i<7;i++)box("plaster",-15.4+i*5.55,6.55,s*10.0,.65,11.6,.34);
 }
 wall("plaster",20.1,.76,12.3,.65,-16.1,0,-Math.PI/2,[{u:0,y:.76,w:2.8,h:6,arch:true,mat:"shadow"},{u:-6.35,y:.76,w:1.55,h:3.1,mat:"shadow"},{u:6.35,y:.76,w:1.55,h:3.1,mat:"shadow"},{u:-6.35,y:6,w:1.8,h:1.8,circle:true,mat:"glass"},{u:6.35,y:6,w:1.8,h:1.8,circle:true,mat:"glass"}]);
 wall("plaster",20.1,.76,12.3,.65,17.0,0,Math.PI/2,[{u:-6.8,y:6,w:1.8,h:4,arch:true,mat:"glass"},{u:6.8,y:6,w:1.8,h:4,arch:true,mat:"glass"}]);
 box("plaster",18.8,5.0,0,3.6,9.8,9.8);k.gable("plaster",17.0,20.7,9.9,12.5,10.0);
 box("plaster",.8,12.3,0,34.4,.55,20.7);roof(-16.4,17.9,12.6,18.5,20.8);
 portico(-20.25,-16.0,16.2,.76,11.6,16.8,4);
 // Pediment oculus is inset in the solid tympanum, with a separately cut opening.
 // Square tower rises directly through the vestibule roof.
 for(let i=0;i<4;i++){
  const a=i*Math.PI/2;
  wall("plaster",8.9,14.15,26.45,.65,cx+3.8*Math.sin(a),3.8*Math.cos(a),a,[{u:0,y:24.35,w:1.25,h:1.25,mat:"glass"}]);
 }
 box("plaster",cx,26.65,0,9.5,.45,9.5);
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
 oct(4.35,26.9,35.0,[1.6,5.8]);cyl("plaster",cx,0,4.8,4.8,35,35.7,8);
 oct(3.66,35.7,41.3,[1.45,3.7],true);cyl("plaster",cx,0,4.15,4.15,41.3,41.9,8);
 // Balustrade outside the upper clock tier stays open in both LODs.
 for(let i=0;i<8;i++){
  const a=i*Math.PI/4,r=3.86,w=2*r*Math.tan(Math.PI/8);
  const g=new THREE.BoxGeometry(w,.16,.18);g.translate(0,36.65,r);g.rotateY(a);g.translate(cx,0,0);put(g,"plaster");
  for(let j=0;j<5;j++){const g=new THREE.BoxGeometry(.12,.7,.12);g.translate(-w/2+j*w/4,36.22,r);g.rotateY(a);g.translate(cx,0,0);put(g,"plaster");}
 }
 // Open upper lantern: eight corner piers and curved spandrels, no dark infill.
 const rr=2.95,w=2*rr*Math.tan(Math.PI/8);
 for(let i=0;i<8;i++){const a=i*Math.PI/4;wall("plaster",w,41.9,48.4,.48,cx+(rr-.48)*Math.sin(a),(rr-.48)*Math.cos(a),a,[{u:0,y:42.1,w:1.77,h:5.75,arch:true}]);}
 cyl("plaster",cx,0,3.28,3.28,48.4,49,8);
 lathe("plaster",cx,0,[[0,49],[1.65,49],[1.20,50],[.71,53.1],[.4,53.45],[.34,54.8],[0,54.8]],8);
 // Arris ribs remain structural continuations of the needle.
 if(near)for(let i=0;i<8;i++){const a=i*Math.PI/4; k.b.bar("plaster",[cx+1.5*Math.sin(a),49.1,1.5*Math.cos(a)],[cx+.62*Math.sin(a),53.2,.62*Math.cos(a)],.10);}
 cyl("gold",cx,0,.12,.12,54.5,56.7,8);
 const orb=new THREE.SphereGeometry(.40,near?12:8,near?8:5);orb.translate(cx,55,0);put(orb,"gold");
 const r=k.finish();r.userData.elevationDatum=MANIFEST.elevationDatum;return r;
}
