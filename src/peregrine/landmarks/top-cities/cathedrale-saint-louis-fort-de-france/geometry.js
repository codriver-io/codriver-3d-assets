import * as THREE from 'three';import { SPEC, PALETTES } from './config.js';import { kit } from './parts.js';
export const SPIRE={x:-31.2,z:0,base:34.0,tip:58.1,r:4.0,levels:[35.2,38.5,41.8,45.1,48.4,51.7,55.0]};
export const radius=y=>SPIRE.r*(SPIRE.tip-y)/(SPIRE.tip-SPIRE.base);
export function archPoint(y,i,t){const a=i*Math.PI/4,b=(i+1)*Math.PI/4,yy=y+.7*Math.sin(Math.PI*t),r=radius(yy);return [SPIRE.x+r*((1-t)*Math.sin(a)+t*Math.sin(b)),yy,r*((1-t)*Math.cos(a)+t*Math.cos(b))];}
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{box,wall,put,near,cyl}=k;
 const bays=Array.from({length:8},(_,i)=>-26+i*7.5);
 box('plaster',0,.35,0,60.6,.7,24.5);
 for(const s of [-1,1]){
  wall('plaster',60.5,.7,13.8,.65,0,s*11.6,s>0?0:Math.PI,bays.map(u=>({u:s>0?u:-u,y:4,w:3.1,h:7.5,arch:true,mat:'glass'})));
  wall('plaster',57.4,.7,22.0,.65,1.6,s*5.0,s>0?0:Math.PI,bays.map(u=>({u:s>0?u-1.6:-(u-1.6),y:18.2,w:2.8,h:3.2,arch:true,mat:'glass'})));
  // Independent lean-to aisle roofs leave the clerestory windows visible.
  const outline=[[ -s*12.35,13.8],[-s*5.65,17.2],[-s*5.65,17.0],[-s*12.35,13.6]];
  const sh=new THREE.Shape(outline.map(p=>new THREE.Vector2(...p))),g=new THREE.ExtrudeGeometry(sh,{depth:60.8,bevelEnabled:false});g.rotateY(Math.PI/2);g.translate(-30.4,0,0);const pos=g.attributes.position,keep=[];for(let j=0;j<pos.count;j+=3)if(![0,1,2].every(k=>Math.abs(Math.abs(pos.getZ(j+k))-5.65)<1e-4))keep.push(j,j+1,j+2);g.setIndex(keep);put(g,'roof');
  for(let j=0;j<9;j++){
   const x=-29.8+j*7.45;box('metal',x,7.1,s*12.34,.25,13.0,.20);
  }
 }
 // The nave roof begins at the rear tower face; the buried centre of its front cap is absent.
 {const x0=-27.1,x1=30.5,w=5.8,top=27.1,eave=22.0;
 const pp=[[x0,eave,-w],[x0,eave,w],[x0,top,0],[x1,eave,-w],[x1,eave,w],[x1,top,0]];
 k.poly('roof',pp,[3,5,4,0,5,3,0,2,5,1,5,2,1,4,5,0,4,1,0,3,4]);
 const inner=4.1,yi=top-inner/w*(top-eave);for(const s of [-1,1])k.poly('roof',[[x0,eave,s*inner],[x0,eave,s*w],[x0,yi,s*inner]],s>0?[0,1,2]:[0,2,1]);
 }
 // Lower west wings, each with its own door and pair of round-arched windows.
 for(const s of [-1,1])wall('plaster',7.4,.7,18.8,.65,-29.65,s*8.55,-Math.PI/2,[{u:-1.8,y:12.5,w:1.85,h:4.9,arch:true,mat:'shadow'},{u:1.8,y:12.5,w:1.85,h:4.9,arch:true,mat:'shadow'},{u:0,y:.7,w:3.0,h:7.0,arch:true,mat:'glass'}]);
 wall('plaster',24.5,.7,17.0,.65,29.65,0,Math.PI/2,[-8,0,8].map(u=>({u,y:5,w:2.9,h:6.7,arch:true,mat:'glass'})));
 box('plaster',32.35,6.9,0,4.5,13.8,12.8);k.roof(30.1,34.7,13.8,17.5,13.0);
 // Cream square tower, including a real circular rose opening in the west face.
 const cx=SPIRE.x,w=8.2;
 box('plaster',cx,.35,0,8.4,.7,8.4);for(let i=0;i<3;i++)box('plaster',-36.07+i*.27,(i+1)*.23/2,0,.30,(i+1)*.23,7.6);
 for(let face=0;face<4;face++){
  const a=face*Math.PI/2,holes=[];
  if(face===3){holes.push({u:0,y:.7,w:3.8,h:6.8,arch:true,mat:'shadow'});holes.push({u:0,y:10.5,w:5.6,h:5.6,circle:true,mat:'glass'});}
  if(face!==1)for(const u of [-2.3,0,2.3])holes.push({u,y:21.5,w:1.35,h:4.5,arch:true,mat:'glass'});
  for(const u of [-1.8,1.8])holes.push({u,y:28,w:2.3,h:5.3,arch:true,mat:'shadow'});
  wall('plaster',w,.7,33.8,.65,cx+3.45*Math.sin(a),3.45*Math.cos(a),a,holes);
  // Outward-facing cladding strips have no buried rear faces.
  for(const u of [-3.75,-3.15,3.15,3.75]){const g=new THREE.PlaneGeometry(.35,33);g.translate(u,17.2,.66);g.rotateY(a);g.translate(cx+3.45*Math.sin(a),0,3.45*Math.cos(a));put(g,'metal');}
  for(const y of [7.8,10.1,17.8,20.6,27.0,33.7]){const g=new THREE.PlaneGeometry(8.4,.35);g.translate(0,y,.66);g.rotateY(a);g.translate(cx+3.45*Math.sin(a),0,3.45*Math.cos(a));put(g,'metal');}
  // Recessed louvres terminate inside their own bell-chamber jambs.
  for(const u of [-1.8,1.8])for(let y=28.3;y<32.1;y+=near?.48:.96){const g=new THREE.BoxGeometry(2.5,.14,.35);g.translate(u,y,3.8);g.rotateY(a);g.translate(cx,0,0);put(g,'metal');}
  // Four triangular gables at the spring of the open needle.
  const sh=new THREE.Shape([new THREE.Vector2(-4.1,33.8),new THREE.Vector2(4.1,33.8),new THREE.Vector2(0,36.3)]),hole=new THREE.Path();hole.absarc(0,34.7,.58,0,Math.PI*2,true);sh.holes.push(hole);
  const g=new THREE.ExtrudeGeometry(sh,{depth:.2,bevelEnabled:false,curveSegments:near?12:6});g.translate(0,0,3.9);g.rotateY(a);g.translate(cx,0,0);put(g,'plaster');
  const clock=new THREE.CircleGeometry(.58,near?24:12);clock.translate(0,34.7,4.02);clock.rotateY(a);clock.translate(cx,0,0);put(clock,'glass');
  const fp=p=>new THREE.Vector3(...p).applyAxisAngle(new THREE.Vector3(0,1,0),a).add(new THREE.Vector3(cx,0,0)).toArray();k.b.bar('metal',fp([0,34.7,4.05]),fp([.32,34.7,4.05]),.05,.05);k.b.bar('metal',fp([0,34.7,4.05]),fp([0,35.05,4.05]),.05,.05);
 }
 box('plaster',cx,33.8,0,8.2,.5,8.2);
 // West rose: restrained radial tracery across a genuine round aperture.
 const ring=new THREE.TorusGeometry(2.8,.13,3,near?32:16);ring.rotateY(-Math.PI/2);ring.translate(cx-4.32,13.3,0);put(ring,'metal');
 for(let i=0;i<(near?12:8);i++){const a=i*Math.PI*2/(near?12:8);k.b.bar('metal',[cx-3.9,13.3,0],[cx-3.9,13.3+2.7*Math.sin(a),2.7*Math.cos(a)],.07,.07);}
 // Open post-2016 cast-iron needle: eight continuous ribs and curved cross-arches.
 for(let i=0;i<8;i++){
  const a=i*Math.PI/4;k.b.bar('lattice',[cx+SPIRE.r*Math.sin(a),SPIRE.base,SPIRE.r*Math.cos(a)],[cx+.04*Math.sin(a),SPIRE.tip,.04*Math.cos(a)],.12,.12,0,true);
 }
 const levels=near?SPIRE.levels:SPIRE.levels.filter((_,i)=>i%2===0),steps=near?5:3;
 for(const y of levels)for(let i=0;i<8;i++)for(let j=0;j<steps;j++)k.b.bar('brace',archPoint(y,i,j/steps),archPoint(y,i,(j+1)/steps),near?.075:.085,near?.075:.085,0,true);
 // Small connected golden rooster and supporting stem, not a logo.
 cyl('gold',cx,0,.055,.055,58.1,58.45,6);
 const bird=new THREE.SphereGeometry(1,near?10:6,6);bird.scale(.21,.12,.10);bird.translate(cx,58.5,0);put(bird,'gold');
 const head=new THREE.SphereGeometry(.075,near?8:5,5);head.translate(cx+.17,58.68,0);put(head,'gold');k.b.bar('gold',[cx+.10,58.55,0],[cx+.17,58.65,0],.05,.05);cyl('gold',cx+.17,0,.025,.025,58.72,58.8,5);
 return k.finish();
}
