import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, PLAN } from './config.js';
const A = PLAN.angleDeg * Math.PI / 180;
export const plan = (u,y,v) => [u*Math.cos(A)-v*Math.sin(A),y,u*Math.sin(A)+v*Math.cos(A)];
export const D = { hallU:[-36,28], hallV:[-22,24], arches:[-25,-4,17], archWidth:12.5, spring:19.4, crown:25.65, parapet:31.8, wing:16.8, northEnd:-150.3 };

export function create({detail='near'}={}) {
 const near=detail==='near', n=near?20:10;
 const b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 const put=(g,m)=>{g.rotateY(-A);b.put(g,m==='trim'?'stone':m);};
 const faceNames=['east','west','top','bottom','front','back'];
 function box(m,u0,u1,y0,y1,v0,v1,omit=[]) {
  const g=new THREE.BoxGeometry(u1-u0,y1-y0,v1-v0), ix=[...g.index.array];
  g.setIndex(ix.filter((_,i)=>!omit.includes(faceNames[Math.floor(i/6)])));
  g.translate((u0+u1)/2,(y0+y1)/2,(v0+v1)/2);put(g,m);
 }
 const plane=(m,u,y,w,h,v,reverse=false)=>{const g=new THREE.PlaneGeometry(w,h);if(reverse)g.rotateY(Math.PI);g.translate(u,y,v);put(g,m);};
 const poly=(pts)=>new THREE.Shape(pts.map(([u,v])=>new THREE.Vector2(u,-v)));
 function mass(pts,h,m='stone') {
  const g=new THREE.ExtrudeGeometry(poly(pts),{depth:h,bevelEnabled:false});g.rotateX(-Math.PI/2);
  // Remove top cap: its replacement roof is exactly at h, with no layered surface.
  const ix=[...g.index?.array||[]];
  if(ix.length) { const pos=g.attributes.position;g.setIndex(ix.filter((q,i)=>{const start=Math.floor(i/3)*3;return !ix.slice(start,start+3).every(k=>Math.abs(pos.getY(k)-h)<0.001);})); }
  else { const pos=g.attributes.position, keep=[];for(let i=0;i<pos.count;i+=3)if(![i,i+1,i+2].every(k=>Math.abs(pos.getY(k)-h)<.001))for(let k=i;k<i+3;k++)keep.push(k);g.setIndex(keep); }
  put(g,m);const roof=new THREE.ShapeGeometry(poly(pts));roof.rotateX(-Math.PI/2);roof.translate(0,h,0);put(roof,'roof');
 }
 function archPts(c,w,y0,spring,crown) {
  const pts=[new THREE.Vector2(c-w/2,y0),new THREE.Vector2(c-w/2,spring)];
  for(let i=1;i<=n;i++){const t=Math.PI-i*Math.PI/n;pts.push(new THREE.Vector2(c+w/2*Math.cos(t),spring+(crown-spring)*Math.sin(t)));}
  pts.push(new THREE.Vector2(c+w/2,y0));return pts;
 }
 function archGlass(c,w,y0,spring,crown,v,rev=false) {
  const g=new THREE.ShapeGeometry(new THREE.Shape(archPts(c,w,y0,spring,crown)));
  if(rev)g.rotateY(Math.PI);g.translate(rev?2*c:0,0,v);put(g,'glass');
 }
 function facade(v,reverse=false) {
  const shape=new THREE.Shape([new THREE.Vector2(-36,0),new THREE.Vector2(28,0),new THREE.Vector2(28,30.2),new THREE.Vector2(-36,30.2)]);
  for(const c of D.arches)shape.holes.push(new THREE.Path(archPts(c,12.5,1.4,D.spring,D.crown)));
  const wall=new THREE.ExtrudeGeometry(shape,{depth:1.0,bevelEnabled:false});wall.translate(0,0,reverse?v:v-1);put(wall,'stone');
  const sign=reverse?-1:1, glassV=v-sign*1.1;
  for(const c of D.arches){
   archGlass(c,12.5,1.4,D.spring,D.crown,glassV,reverse);
   // Recessed iron muntins stay inside the arch silhouette in both LODs.
   for(const du of [-4,-2,0,2,4]){
    const top=D.spring+6.25*Math.sqrt(1-du*du/(6.25*6.25));
    box('metal',c+du-.10,c+du+.10,1.4,top,glassV-.15,glassV+.15);
   }
   for(const y of near?[4,8,12,16,19.4,22]:[4,12,19.4]){
    const half=y<=D.spring?6.25:6.25*Math.sqrt(1-((y-D.spring)/6.25)**2);
    box('metal',c-half,c+half,y-.10,y+.10,glassV-.15,glassV+.15);
   }
   // Stone arch ring, with a real extruded intrados and no wall beneath the glass.
   const outer=archPts(c,14.3,1.4,D.spring,D.crown+.9), inner=archPts(c,12.5,1.4,D.spring,D.crown);
   const ring=new THREE.Shape(outer);ring.holes.push(new THREE.Path(inner));
   const g=new THREE.ExtrudeGeometry(ring,{depth:.45,bevelEnabled:false});g.translate(0,0,reverse?v-.45:v);put(g,'trim');
   if(near)for(let i=0;i<=12;i++){
    const t=Math.PI*i/12, u=c+6.72*Math.cos(t), y=D.spring+6.72*Math.sin(t);
    const g=new THREE.BoxGeometry(.11,.85,.12);g.rotateZ(t-Math.PI/2);g.translate(u,y,v+sign*.5);put(g,'base');
   }
  }
  // Massive pilasters and their block capitals frame the three arches.
  for(const u of [-34.5,-14.5,6.5,26.5]){
   const va=reverse?v-.7:v, vb=reverse?v:v+.7;
   box('trim',u-.75,u+.75,1.4,27.6,va,vb);
   box('trim',u-1.2,u+1.2,27.6,28.4,reverse?v-1:v,reverse?v:v+1);
  }
  if(near) {
   // Subdued limestone joints on the narrow piers and a projecting dentil cornice.
   for(const u of [-34.5,-14.5,6.5,26.5])for(let y=2.4;y<27;y+=1.25)
    plane('base',u,y,1.45,.055,v+sign*.75,reverse);
   for(let u=-35;u<28;u+=1.45)box('trim',u-.28,u+.28,28.45,28.85,reverse?v-.95:v+.35,reverse?v-.35:v+.95);
  }
  box('trim',-36.4,28.4,28.8,30.2,v-.6,v+.8);
  box('stone',-36.2,28.2,30.2,31.3,v-.5,v+.3);
  box('trim',-36.6,28.6,31.3,31.8,v-.8,v+.8);
 }
 // Long low limestone wings. Individual punched window rows survive the far model.
 mass([[-80.5,-22],[-36,-22],[-36,24],[-44,24],[-44,19.5],[-70,19.5],[-70,21.2],[-80.5,21.2]],D.wing);
 mass([[28,-22],[37,-22],[37,-23],[74,-23],[74,20.5],[62.5,20.5],[62.5,18.7],[36.5,18.7],[36.5,24],[28,24]],D.wing);
 // Western Science City/service wing and northwest block, wholly inside the station's owned envelope.
 mass([[-113,-22],[-81,-22],[-81,9.7],[-113,9.7]],12.5);
 mass([[-68.7,-68.5],[-64.6,-68.5],[-63.4,-136.5],[-28.5,-136.5],[-28.5,-22.3],[-69,-22.3]],10.5);
 const rows=near?[3.9,8.4,12.8]:[3.9,8.4,12.8];
 for(const [a,c,v] of [[-69,-36,19.5],[36.5,62,18.7],[-80,-70,21.2],[63,73.5,20.5]]){
  for(let u=a+2;u<c-1;u+=4.5)for(const y of rows){plane('glass',u,y,1.85,2.65,v+.2);if(near)box('trim',u-1.15,u+1.15,y-1.7,y-1.35,v,v+.4);}
  box('trim',a,c,15.1,16,v-.2,v+.55);box('stone',a,c,16,17.6,v-.3,v+.1);box('trim',a,c,17.6,18,v-.4,v+.5);
 }
 for(const [u,s,v0,v1] of [[74,1,-23,20.5],[-80.5,-1,-22,21.2]]){
  for(let v=v0+3;v<v1-2;v+=4.6)for(const y of rows){const g=new THREE.PlaneGeometry(1.85,2.65);g.rotateY(s*Math.PI/2);g.translate(u+s*.2,y,v);put(g,'glass');}
  box('trim',u-.4,u+.4,15.1,16,v0,v1);box('stone',u-.3,u+.3,16,17.6,v0,v1);box('trim',u-.5,u+.5,17.6,18,v0,v1);
 }
 // Two raised wing skylight monitor structures visible from Liberty Memorial.
 for(const [u,v,w,d] of [[-55,5,17,13],[45,-9,16,12]]){
  box('base',u-w/2,u+w/2,16.8,18,v-d/2,v+d/2);
  box('glass',u-w/2+.5,u+w/2-.5,18,19.6,v-d/2+.5,v+d/2-.5);
  box('trim',u-w/2,u+w/2,19.6,20.1,v-d/2,v+d/2);
 }
 // Tall Grand Hall: genuine punched triple-arch facades, tall solid end walls and parapet.
 facade(24);facade(-22,true);
 box('stone',-36,-35,0,30.2,-22,24);box('stone',27,28,0,30.2,-22,24);
 box('roof',-35,27,29.8,30.1,-21,23);
 for(const u of [-36,28]){
  box('trim',u-.5,u+.5,28.8,30.2,-22,24);box('stone',u-.3,u+.3,30.2,31.3,-22,24);box('trim',u-.6,u+.6,31.3,31.8,-22,24);
  for(let v=-17;v<22;v+=7.5){const g=new THREE.PlaneGeometry(2.6,6);g.rotateY(u<0?-Math.PI/2:Math.PI/2);g.translate(u+(u<0?-.2:.2),20,v);put(g,'glass');}
 }
 // Low hipped metal roof is set inside the flat parapet, preserving the long roof silhouette.
 const roofPos=[[-35,30.1,-21],[27,30.1,-21],[27,30.1,23],[-35,30.1,23],[-30,32.8,1],[22,32.8,1]];
 const rg=new THREE.BufferGeometry();rg.setAttribute('position',new THREE.Float32BufferAttribute(roofPos.flat(),3));rg.setIndex([0,4,1,1,4,5,1,5,2,2,5,3,3,5,4,3,4,0]);rg.computeVertexNormals();put(rg,'roof');
 // Northern waiting hall: long perpendicular roof and repeated tall arched bays.
 box('stone',-28.3,21.5,0,20.8,-150.3,-22,['top','front']);
 box('trim',-28.8,22,20.8,21.6,-150.3,-22);
 // Gabled roof with closed end triangles.
 const nr=new THREE.BufferGeometry();nr.setAttribute('position',new THREE.Float32BufferAttribute([-28.3,21.6,-150.3,21.5,21.6,-150.3,-3.4,25.4,-150.3,-28.3,21.6,-22,21.5,21.6,-22,-3.4,25.4,-22],3));nr.setIndex([0,3,2,2,3,5,2,5,1,1,5,4,0,2,1]);nr.computeVertexNormals();put(nr,'roof');
 for(const [u,s] of [[-28.3,-1],[21.5,1]])for(let v=-142;v<-27;v+=11){
  const sh=new THREE.Shape(archPts(-s*v,5.4,7.5,15.8,18.5));const g=new THREE.ShapeGeometry(sh);g.rotateY(s*Math.PI/2);g.translate(u+s*.2,0,0);put(g,'glass');
  if(near)box('trim',u-.45,u+.45,1,20.8,v+4.6,v+5.2);
 }
 for(let u=-22;u<20;u+=7)plane('glass',u,10,3,8,-150.5,true);
 // Planetarium on the western shoulder: low polygonal drum and faceted blue-grey dome.
 const drum=new THREE.CylinderGeometry(11.8,11.8,7,near?12:8);drum.translate(-84.5,3.5,-54.5);put(drum,'stone');
 const dome=new THREE.SphereGeometry(11.8,near?16:10,near?6:4,0,Math.PI*2,0,Math.PI/2);dome.scale(1,.55,1);dome.translate(-84.5,7,-54.5);put(dome,'roof');
 // Grounded front pilaster feet / entrance steps are confined to mapped entrance projections.
 for(const u of [-25,17]){box('stone',u-4.6,u+4.6,0,.25,24,28.6);box('trim',u-4.6,u+4.6,.25,.5,24,27.5);}
 // Dark entrance transoms and shallow supported steel canopies at the three arch bases.
 for(const u of D.arches){
  if(near)box('metal',u-6.1,u+6.1,1.4,3.8,22.9,23.25);
  if(near)for(const du of [-3.7,0,3.7])plane('glass',u+du,2.1,2.5,2.7,23.5);
  if(near){
   box('metal',u-4.6,u+4.6,3.7,4.05,23,25.2);
   for(const du of [-4.4,4.4])box('metal',u+du-.12,u+du+.12,0,3.7,24.8,25.05);
  }
 }
 // Six-foot clock as a geometric dial in the central recess; interior mechanism schematically visible.
 const clock=new THREE.CylinderGeometry(.9144,.9144,.20,near?24:12);clock.rotateX(Math.PI/2);clock.translate(-4,14.5,23.4);put(clock,'glow');
 const rim=new THREE.TorusGeometry(.94,.1,4,near?24:12);rim.translate(-4,14.5,23.55);put(rim,'metal');
 box('metal',-4.06,-3.94,14.5,15.2,23.55,23.7);box('metal',-4.65,-4,14.44,14.56,23.55,23.7);
 if(near)for(let i=0;i<12;i++){const t=i*Math.PI/6;const g=new THREE.BoxGeometry(.07,.16,.08);g.rotateZ(-t);g.translate(-4+.74*Math.sin(t),14.5+.74*Math.cos(t),23.65);put(g,'metal');}
 return b.finish();
}
