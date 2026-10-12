import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, ANGLE } from './config.js';

// u along the long façade, v toward Calle 2. Original observed ornament.
export function create({detail='near'}={}) {
 const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 const box=(mat,x0,x1,y0,y1,z0,z1)=>b.box(mat,[(x0+x1)/2,(y0+y1)/2,(z0+z1)/2],[x1-x0,y1-y0,z1-z0]);
 const lathe=(mat,x,y,z,profile,seg=near?8:5)=>b.put(new THREE.LatheGeometry(profile.map(([r,h])=>new THREE.Vector2(r,h)),seg).translate(x,y,z),mat);
 const omitBottom=(g,y)=>{
  if(!g.index)g.setIndex(Array.from({length:g.attributes.position.count},(_,i)=>i));
  const p=g.attributes.position,a=Array.from(g.index.array),out=[];
  for(let i=0;i<a.length;i+=3)if(!a.slice(i,i+3).every(j=>Math.abs(p.getY(j)-y)<1e-4))out.push(...a.slice(i,i+3));
  g.setIndex(out);return g;
 };
 const onWall=(g,x,y,z,a=0)=>g.rotateY(a).translate(x,y,z);
 const archShape=(w,h)=>{const s=new THREE.Shape(),r=w/2;s.moveTo(-r,0);s.lineTo(r,0);s.lineTo(r,h-r);s.absarc(0,h-r,r,0,Math.PI,false);s.lineTo(-r,0);return s;};
 const arch=(mat,x,y,z,w,h,t)=>{
  const s=archShape(w+2*t,h+t),q=archShape(w,h);
  // Hole rises t above outer base, preserving a closed ring.
  const pts=q.getPoints(near?14:6).map(p=>new THREE.Vector2(p.x,p.y+t));s.holes.push(new THREE.Path(pts));
  b.put(onWall(new THREE.ExtrudeGeometry(s,{depth:.23,bevelEnabled:false,curveSegments:near?12:5}),x,y-t,z),mat);
 };
 const rectWindow=(x,y,z,w,h,a=0)=>{
  b.put(onWall(new THREE.PlaneGeometry(w,h),x,y+h/2,z,a),'glass');
  if(near){
   for(const dx of [-w/2,w/2])b.put(onWall(new THREE.BoxGeometry(.14,h+.2,.25),x+Math.cos(a)*dx,y+h/2,z-Math.sin(a)*dx+.18*Math.cos(a),a),'trim');
   for(const yy of [y,y+h])b.put(onWall(new THREE.BoxGeometry(w+.22,.16,.25),x,yy,z+.18*Math.cos(a),a),'trim');
   b.put(onWall(new THREE.BoxGeometry(.085,h,.1),x,y+h/2,z+.1*Math.cos(a),a),'iron');
   b.put(onWall(new THREE.BoxGeometry(w,.09,.1),x,y+h*.55,z+.1*Math.cos(a),a),'iron');
  }
 };
 // Rigid plinth; frontage strip is pierced so the arcade has real recesses.
 box('base',-38.2,38.2,0,1.15,-14.95,14.5);
 for(const [l,r] of [[-38.2,-5.2],[5.2,38.2]])box('base',l,r,0,1.15,14.5,15.08);
 box('stone',-38.2,38.2,1.15,16.8,-14.95,10.8);
 const centers=[-35,-29.6,-25,-20.4,-15.8,-11.2,-6.7,-3.35,0,3.35,6.7,11.2,15.8,20.4,25,29.6,35];
 const front=x=>Math.abs(x)<=8.95?14.5:Math.abs(x)>=32.3?14.35:13.8;
 const widths=centers.map(x=>Math.abs(x)<4?2.38:Math.abs(x)<8?1.85:Math.abs(x)>32?2.65:2.4);
 // Separate facade bay shells with arched ground holes and tall upper openings.
 for(let i=0;i<centers.length;i++) {
  const x=centers[i],l=i===0?-38.2:(x+centers[i-1])/2,r=i===centers.length-1?38.2:(x+centers[i+1])/2,z=front(x),w=widths[i];
  const s=new THREE.Shape([new THREE.Vector2(l,1.15),new THREE.Vector2(r,1.15),new THREE.Vector2(r,16.8),new THREE.Vector2(l,16.8)]);
  const q=archShape(w,6.05).getPoints(near?14:6).map(p=>new THREE.Vector2(p.x+x,p.y+1.15));s.holes.push(new THREE.Path(q));
  s.holes.push(new THREE.Path([[x-w/2,9.35],[x+w/2,9.35],[x+w/2,15.45],[x-w/2,15.45]].map(p=>new THREE.Vector2(...p))));
  b.put(new THREE.ExtrudeGeometry(s,{depth:z-10.8,bevelEnabled:false}).translate(0,0,10.8),'stone');
  b.put(onWall(new THREE.ShapeGeometry(archShape(w,6.05),near?14:6),x,1.15,z-.65),'iron');
  // Full-height window divided into two rows: original upper mezzanine rhythm.
  rectWindow(x,9.35,z-.5,w,3.65);rectWindow(x,13.25,z-.5,w,2.2);
  box('trim',x-w/2,x+w/2,13.0,13.25,z-.48,z-.2);
  arch('trim',x,1.15,z+.12,w,6.05,.22);
  box('trim',x-w/2-.2,x+w/2+.2,9.05,9.33,z-.12,z+.34);
  for(const dx of [-w/2-.2,w/2+.2])box('trim',x+dx-.09,x+dx+.09,9.35,15.5,z-.08,z+.27);
  box('trim',x-w/2-.25,x+w/2+.25,15.48,15.78,z-.08,z+.43);
  // Iron door bars and half-circle fanlight, set deeply in the arch opening.
  if(near){
   for(let dx=-w/2+.22;dx<w/2;dx+=.32)box('iron',x+dx-.04,x+dx+.04,1.2,5.8,z-.52,z-.42);
   for(const yy of [2.2,3.5,5.7])box('iron',x-w/2,x+w/2,yy,yy+.07,z-.52,z-.42);
   for(let j=0;j<=8;j++){const a=j*Math.PI/8;b.bar('trim',[x,6.0,z-.39],[x+Math.cos(a)*w*.43,6+Math.sin(a)*w*.43,z-.39],.055,.07);}
  }
 }
 if(near)for(const x of [-6.7,-3.35,0,3.35,6.7]){
   const z=front(x);
   box('trim',x-.47,x+.47,15.86,16.4,z+.12,z+.28);
   b.put(onWall(new THREE.TorusGeometry(.17,.055,4,8),x,16.13,z+.4),'trim');
  }
 // A continuous belt and deeply projecting cornice, supported by paired columns.
 for(const [x0,x1,z] of [[-38.2,-32.3,14.35],[-32.3,-8.95,13.8],[-8.95,8.95,14.5],[8.95,32.3,13.8],[32.3,38.2,14.35]]) {
  box('trim',x0,x1,7.45,7.85,z-.25,z+.75);
  box('trim',x0,x1,8.0,8.4,z-.15,z+.57);
  box('trim',x0,x1,16.12,16.58,z-.15,z+.45);
  box('trim',x0,x1,16.55,16.95,z-.3,z+.62);
  box('trim',x0,x1,17.05,17.4,z-.4,z+.85);
 }
 const pillars=[-37.7,-31.7,-27.3,-22.7,-18.1,-13.5,-8.3,-5,-1.65,1.65,5,8.3,13.5,18.1,22.7,27.3,31.7,37.7];
 for(const x of pillars) {
  const z=front(x)+.13;
  for(const dx of [-.32,.32]) {
   const xx=x+dx;
   for(const [y,h,r] of [[1.15,6.3,.27],[8.4,7.5,.25]]) {
    lathe('trim',xx,y,z,near?[[0,0],[r+.13,0],[r+.13,.18],[r,.4],[r*.87,h-.48],[r+.1,h-.25],[r+.13,h],[0,h]]:[[0,0],[r,0],[r*.87,h],[0,h]],near?7:4);
    box('trim',xx-.4,xx+.4,y+h-.02,y+h+.29,z-.33,z+.4);
    if(near && y>8)for(const d of [-.26,.26])b.put(onWall(new THREE.TorusGeometry(.115,.038,4,6),xx+d,y+h+.12,z+.44),'trim');
   }
  }
 }
 // Open balustrades at upper sills and the roof skyline, with simplified urns.
 const balustrade=(x0,x1,y,z,height,roof=false)=>{
  box('trim',x0,x1,y,y+.18,z-.18,z+.18);
  box('trim',x0,x1,y+height-.18,y+height,z-.22,z+.22);
  for(let x=x0+.3;x<x1;x+=near?.55:1.4){if(near)lathe('trim',x,y+.18,z,[[0,0],[.095,0],[.12,.22],[.07,height-.36],[0,height-.36]],5);else box('trim',x-.075,x+.075,y+.18,y+height-.18,z-.075,z+.075);}
  if(roof)for(let x=x0+.4;x<x1;x+=4.6){box('trim',x-.17,x+.17,y,y+height+.05,z-.22,z+.22);lathe('trim',x,y+height+.05,z,near?[[0,0],[.18,0],[.12,.22],[.24,.38],[.12,.55],[0,.68]]:[[0,0],[.2,0],[.2,.4],[0,.68]],near?8:4);}
 };
 for(const x of centers)balustrade(x-widths[centers.indexOf(x)]/2,x+widths[centers.indexOf(x)]/2,8.45,front(x)+.41,.86);
 for(const [l,r] of [[-31.8,-18],[-12.7,-7.8],[7.8,12.7],[18,31.8]])balustrade(l,r,17.43,14.02,1.08,true);
 // Central raised attic: sloping shoulders, carved crest, legible geometric inscription.
 const attic=new THREE.Shape();attic.moveTo(-7.55,16.8);attic.lineTo(7.55,16.8);attic.lineTo(7.55,18.8);
 attic.bezierCurveTo(6.4,19.15,5.5,19.75,5.5,20.35);attic.lineTo(5.5,21.1);attic.lineTo(-5.5,21.1);attic.lineTo(-5.5,20.35);
 attic.bezierCurveTo(-5.5,19.75,-6.4,19.15,-7.55,18.8);attic.closePath();
 b.put(omitBottom(new THREE.ExtrudeGeometry(attic,{depth:4.0,bevelEnabled:false,curveSegments:near?10:4}).translate(0,0,10.5),16.8),'stone');
 box('trim',-5.8,5.8,21.12,21.48,10.2,14.85);
 balustrade(-5.55,5.55,21.5,14.28,.5);
 // Wreath/coat of arms and scrollwork are abstract original relief, never a traced sculpture.
 // Convex inscription ribbon joins the upper facade, with two proud moulded borders.
 const inscriptionY=x=>18.45+.72*(1-(x/6.45)**2);
 const ribbonSegments=near?24:8,borderSegments=near?16:8;
 const ribbon=new THREE.Shape();ribbon.moveTo(-6.6,inscriptionY(-6.6)-.15);
 for(let j=1;j<=ribbonSegments;j++){const x=-6.6+j*13.2/ribbonSegments;ribbon.lineTo(x,inscriptionY(x)-.15);}
 for(let j=ribbonSegments;j>=0;j--){const x=-6.6+j*13.2/ribbonSegments;ribbon.lineTo(x,inscriptionY(x)+.65);}ribbon.closePath();
 // Back lies in the supporting attic; the front keeps a single depth relationship to trim.
 if(near)b.put(new THREE.ExtrudeGeometry(ribbon,{depth:.34,bevelEnabled:false}).translate(0,0,14.40),'stone');
 else b.put(new THREE.ShapeGeometry(ribbon).translate(0,0,14.74),'trim');
 for(const dy of [-.15,.65])for(let j=1;j<=borderSegments;j++){
  const x0=-6.6+(j-1)*13.2/borderSegments,x1=-6.6+j*13.2/borderSegments;
  b.bar('trim',[x0,inscriptionY(x0)+dy,14.98],[x1,inscriptionY(x1)+dy,14.98],.17,.26);
 }
 b.put(onWall(new THREE.TorusGeometry(.89,.20,near?7:4,near?20:10),0,19.82,15.05),'trim');
 b.put(onWall(new THREE.CircleGeometry(.69,near?20:10),0,19.82,14.96),'trim');
 for(const s of [-1,1]){
  b.bar('trim',[s*.8,19.8,15.03],[s*2.2,20.5,15.03],.38,.35);
  b.put(onWall(new THREE.TorusGeometry(.38,.14,near?6:3,near?14:8,Math.PI*1.75),s*1.55,20.25,15.02),'trim');
  for(let j=0;j<4;j++){const g=new THREE.SphereGeometry(.24,near?8:5,4);g.scale(2.2,.9,1);g.rotateZ(s*.4);g.translate(s*(1.4+j*.55),20.40-j*.16,15.03);b.put(g,'trim');}
 }
 const strokes={C:[[1,1,0,1],[0,1,0,0],[0,0,1,0]],O:[[0,0,1,0],[1,0,1,1],[1,1,0,1],[0,1,0,0]],R:[[0,0,0,1],[0,1,1,1],[1,1,1,.55],[1,.55,0,.55],[.4,.55,1,0]],E:[[0,0,0,1],[0,1,1,1],[0,.5,.8,.5],[0,0,1,0]],S:[[1,1,0,1],[0,1,0,.5],[0,.5,1,.5],[1,.5,1,0],[1,0,0,0]],Y:[[0,1,.5,.5],[1,1,.5,.5],[.5,.5,.5,0]],T:[[0,1,1,1],[.5,1,.5,0]],L:[[0,1,0,0],[0,0,1,0]],G:[[1,1,0,1],[0,1,0,0],[0,0,1,0],[1,0,1,.5],[1,.5,.5,.5]],A:[[0,0,.5,1],[.5,1,1,0],[.2,.4,.8,.4]],F:[[0,0,0,1],[0,1,1,1],[0,.5,.8,.5]]};
 const text='CORREOS Y TELEGRAFOS',pitch=.65,w=.49,h=.55;
 if(near)for(let i=0;i<text.length;i++)for(const [x0,y0,x1,y1] of strokes[text[i]]||[]){
  const x=-6.15+i*pitch,yy=inscriptionY(x);
  // Follow both the ribbon height and its slope instead of a straight text baseline.
  b.bar('iron',[x+x0*w,yy+y0*h-.035*x*x0,15.10],[x+x1*w,yy+y1*h-.035*x*x1,15.10],.065,.12);
 }
 // Curved baroque pavilion pediments and low corner domes, not hemispherical towers.
 for(const x of [-35,-15.8,15.8,35]) {
  const wide=Math.abs(x)>30?5.7:5.5,z=front(x);
  const s=new THREE.Shape();s.moveTo(-wide/2,16.8);s.lineTo(wide/2,16.8);s.lineTo(wide/2,17.7);s.absellipse(0,17.7,wide/2,2.1,0,Math.PI,false);s.closePath();
  b.put(omitBottom(new THREE.ExtrudeGeometry(s,{depth:2.7,bevelEnabled:false,curveSegments:near?16:7}).translate(x,0,z-2.7),16.8),'stone');
  const pts=[];for(let j=0;j<=(near?20:10);j++){const a=j*Math.PI/(near?20:10);pts.push([x+Math.cos(a)*wide/2,17.7+Math.sin(a)*2.1,z+.23]);}
  for(let j=1;j<pts.length;j++)b.bar('trim',pts[j-1],pts[j],.24,.29);
  b.put(onWall(new THREE.TorusGeometry(.61,.12,near?6:4,near?16:8),x,18.36,z+.28),'trim');
  if(near)for(let j=0;j<12;j++){const a=j*Math.PI*2/12;b.bar('trim',[x+Math.cos(a)*.74,18.36+Math.sin(a)*.74,z+.32],[x+Math.cos(a)*1.12,18.36+Math.sin(a)*1.12,z+.32],.1,.1);}
  if(Math.abs(x)>30){
   lathe('roof',x,17.45,10.8,[[0,0],[2.4,0],[2.4,.4],[2.0,1.2],[1.0,2.0],[0,2.35]],near?20:10);
   box('trim',x-.35,x+.35,19.8,20.1,z-1.0,z-.3);
   lathe('trim',x,20.1,z-.65,[[0,0],[.23,0],[.17,.25],[0,.48]],near?8:5);
  }
 }
 // Roof is subordinate to the ornamented parapets; the unseen rear roof is estimated.
 box('roof',-37.7,37.7,16.83,17.02,-14.65,10.4);
 for(const s of [-1,1]) {
  box('trim',s<0?-38.45:38.2,s<0?-38.2:38.45,7.5,7.84,-14.9,13.4);
  box('trim',s<0?-38.55:38.2,s<0?-38.2:38.55,16.6,17.3,-15,13.4);
  for(const v of [-11,-6,-1,4,9])for(const y of [2,10])rectWindow(s*38.38,y,v,2.3,y===2?4.2:5.1,s*Math.PI/2);
 }
 box('trim',-38.4,38.4,7.5,7.84,-15.25,-14.8);box('trim',-38.5,38.5,16.6,17.3,-15.35,-14.8);
 for(let x=-34;x<=34;x+=5.5)for(const y of [2,10])rectWindow(x,y,-15.08,2.2,y===2?4.2:5.1,Math.PI);
 // Entrance steps stay within the mapped street edge; no freestanding plaza slab.
 for(let j=0;j<5;j++)box('base',-5.2,5.2,j*.23,(j+1)*.23,14.5,15.25-j*.15);
 const root=b.finish();
 root.traverse(o=>{if(o.isMesh){o.geometry.rotateY(ANGLE);const g=mergeVertices(o.geometry,1e-5);o.geometry.dispose();o.geometry=g;g.computeBoundingBox();g.computeBoundingSphere();}});
 return root;
}
