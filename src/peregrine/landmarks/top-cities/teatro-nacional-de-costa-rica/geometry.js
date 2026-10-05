import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, ANGLE } from './config.js';
import { parts } from './teatro-nacional-de-costa-rica-parts.js';

// Own architectural frame: u along the 32.46 m west front, v toward Calle 3.
// All ornament is authored from observation, not traced/captured geometry.
export function create({detail='near'}={}) {
  const near=detail==='near';
  const b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const {box,cyl,lathe,shape,onWall,arch,window,hip,statue}=parts(b,near);
  const facade=34.7, center=35.05, eave=14.3;
  box('stone',-15.6,15.6,0,14.0,-35.4,32);
  // The frontal entrance is a real recessed three-door bay, not painted on a solid.
  for(const s of [-1,1])box('rustication',s<0?-15.6:7.35,s<0?-7.35:15.6,0,6.1,32,facade);
  const wall=new THREE.Shape([[-7.35,0],[7.35,0],[7.35,6.1],[-7.35,6.1]].map(p=>new THREE.Vector2(...p)));
  for(const x of [-4.7,0,4.7]) {
    const hole=new THREE.Path();hole.moveTo(x-1.48,.7);hole.lineTo(x+1.48,.7);hole.lineTo(x+1.48,4.85);hole.lineTo(x-1.48,4.85);hole.closePath();wall.holes.push(hole);
    box('iron',x-1.48,x+1.48,.7,4.85,31.9,32.09);
    if(near) {
      box('roof',x-1.32,x+1.32,.82,4.55,32.1,32.17);
      for(const dx of [-.75,0,.75])box('iron',x+dx-.055,x+dx+.055,.8,4.8,32.19,32.28);
      for(const yy of [1.2,2.2,3.2,4.3])box('iron',x-1.36,x+1.36,yy,yy+.12,32.18,32.29);
    }
  }
  b.put(new THREE.ExtrudeGeometry(wall,{depth:center-32,bevelEnabled:false} ).translate(0,0,32),'rustication');
  box('rustication',-7.35,7.35,0,.7,32,35.65);
  box('stone',-15.6,-7.35,6.1,14.0,32,facade);
  box('stone',7.35,15.6,6.1,14.0,32,facade);
  box('stone',-7.35,7.35,6.1,15.15,32,center);
  // String course, lateral cornices and small projecting balcony.
  box('trim',-15.9,15.9,6.03,6.38,33.9,35.3);
  box('rustication',-7.65,7.65,5.55,6.0,34.5,36.03);
  for(const s of [-1,1]) {
    const x0=s<0?-15.9:7.65,x1=s<0?-7.65:15.9;
    box('trim',x0,x1,13.65,13.96,33.8,35.08);
    box('trim',x0-.08,x1+.08,14.03,eave,33.7,35.18);
    box('roof',x0,x1,14.32,14.55,33.8,34.95);
  }
  box('light',-7.8,7.8,14.82,15.24,33.9,35.45);
  box('trim',-8,8,15.31,15.56,33.9,35.6);
  // Three central tall arches, flanked by three narrower arches per wing.
  for(const x of [-4.7,0,4.7])window(x,7.1,center+.09,2.95,6.55,0,true);
  for(const s of [-1,1])for(const x of [9.12,11.83,14.5])window(s*x,7.0,facade+.09,1.82,5.98);
  // Engaged paired pilasters / columns, Ionic-like volutes and stylised acanthus.
  for(const x of [-7.05,-6.47,-2.35,2.35,6.47,7.05]) {
    box('trim',x-.33,x+.33,6.45,7.03,center-.08,center+.49);
    lathe('trim',x,7.03,center+.13,[[0,0],[.25,0],[.23,.22],[.19,6.35],[.26,6.45],[0,6.45]],near?16:7);
    box('light',x-.35,x+.35,13.52,14.05,center-.05,center+.5);
    if(near){
      for(const dx of [-.24,.24]) b.put(onWall(new THREE.TorusGeometry(.14,.045,5,10),x+dx,13.84,center+.51),'trim');
      for(const dx of [-.22,0,.22]){
        const g=new THREE.SphereGeometry(.095,6,4);g.scale(1,2.6,.7);g.translate(x+dx,13.59,center+.51);b.put(g,'trim');
      }
    }
  }
  for(const s of [-1,1])for(const x of [7.7,10.45,13.17,15.47]) {
    box('trim',s*x-.18,s*x+.18,6.5,13.1,facade-.08,facade+.24);
    box('trim',s*x-.3,s*x+.3,12.85,13.3,facade-.05,facade+.36);
  }
  // Continuous stone balustrade with open gaps, conspicuous below the main arches.
  box('trim',-7.65,7.65,6.38,6.58,35.08,35.99);
  box('trim',-7.65,7.65,7.35,7.53,35.24,35.91);
  for(let x=-7.3;x<7.4;x+=near?.57:1.14)lathe('trim',x,6.58,35.58,[[0,0],[.115,0],[.1,.16],[.15,.32],[.07,.5],[.12,.77],[0,.77]],near?8:4);
  for(const x of [-7.5,-2.35,2.35,7.5])box('trim',x-.18,x+.18,6.55,7.4,35.22,35.92);
  // Rusticated ashlar, door surrounds and two ground-level statue niches.
  if(near)for(let y=.4;y<5.8;y+=.45)for(const s of [-1,1]) {
    for(let x=7.5;x<15.5;x+=1.5)box('rustication',s<0?-Math.min(x+1.38,15.6):x,s<0?-x:Math.min(x+1.38,15.6),y,y+.36,facade+.055,facade+.18);
    for(const x of [-7,-2.35,2.35,7])box('rustication',x-.53,x+.53,y,y+.35,center+.07,center+.23);
  }
  for(const x of [-4.7,0,4.7]) {
    for(const dx of [-1.64,1.64])box('rustication',x+dx-.17,x+dx+.17,.7,4.97,center-.05,center+.31);
    box('trim',x-1.86,x+1.86,4.92,5.18,center+.025,center+.47);
  }
  for(const s of [-1,1]) {
    // A white figure against a dark arched recess, at Goethe / Calderón positions.
    b.put(onWall(new THREE.ShapeGeometry(shape(1.22,3.6),near?12:6),s*10.46,1.4,facade+.22),'iron');
    arch('trim',s*10.46,1.4,facade+.29,1.22,3.6,.12);
    statue(s*10.46,1.4,facade+.46,false,.72);
    for(const x of [8.1,12.9,14.9]) {
      box('glass',s*x-.59,s*x+.59,1.7,4.45,facade+.23,facade+.3);
      for(const dx of [-.69,.69])box('trim',s*x+dx-.075,s*x+dx+.075,1.6,4.5,facade+.35,facade+.46);
      box('trim',s*x-.75,s*x+.75,4.5,4.67,facade+.35,facade+.5);
    }
  }
  // Triangular pediment: recessed tympanum and three supported roof allegories.
  const ped=new THREE.Shape([[-7.8,15.56],[7.8,15.56],[0,18.05]].map(p=>new THREE.Vector2(...p)));
  b.put(new THREE.ExtrudeGeometry(ped,{depth:1.12,bevelEnabled:false}).translate(0,0,34.15),'stone');
  for(const s of [-1,1]) {
    b.bar('trim',[0,18.19,35.42],[s*8,15.66,35.42],.32,.35);
    b.bar('light',[0,17.8,35.5],[s*7.24,15.63,35.5],.13,.16);
  }
  if(near) {
    // Relief wreath/coat-of-arms; not a reproduction of the detailed carving.
    b.put(onWall(new THREE.TorusGeometry(.56,.16,6,16),0,16.66,35.43),'trim');
    for(const s of [-1,1])for(let i=0;i<5;i++) {
      const g=new THREE.SphereGeometry(.15,8,5);g.scale(2.1,.6,.55);g.rotateZ(s*(.2+i*.18));g.translate(s*(1+i*.44),16.3+Math.sin(i*.55)*.22,35.45);b.put(g,'trim');
    }
    // Sparse geometric inscription in its original Spanish.
    const strokes={T:[[0,1,1,1],[.5,1,.5,0]],E:[[0,0,0,1],[0,1,1,1],[0,.5,.8,.5],[0,0,1,0]],A:[[0,0,.5,1],[.5,1,1,0],[.2,.4,.8,.4]],R:[[0,0,0,1],[0,1,.8,1],[.8,1,1,.65],[1,.65,0,.5],[.4,.5,1,0]],O:[[.2,0,.8,0],[.8,0,1,.2],[1,.2,1,.8],[1,.8,.8,1],[.8,1,.2,1],[.2,1,0,.8],[0,.8,0,.2],[0,.2,.2,0]],N:[[0,0,0,1],[0,1,1,0],[1,0,1,1]],C:[[1,1,0,1],[0,1,0,0],[0,0,1,0]],I:[[.5,0,.5,1]],L:[[0,1,0,0],[0,0,1,0]]};
    const text='TEATRO NACIONAL',w=.43,h=.39,pitch=.57;
    for(let i=0;i<text.length;i++)for(const [x0,y0,x1,y1] of strokes[text[i]]||[])b.bar('iron',[-3.97+i*pitch+x0*w,14.34+y0*h,35.19],[-3.97+i*pitch+x1*w,14.34+y1*h,35.19],.045,.055);
  }
  statue(-7.55,15.93,34.75,false,.82);statue(7.55,15.93,34.75,false,.82);statue(0,18.2,34.79,true,1.03);
  // Front red hip and the taller auditorium roof behind it.
  hip('roof',-15.62,15.62,18,34.55,14.56,17.65,5.3);
  hip('roof',-15.75,15.75,-34.8,18.1,14.28,19.0,7);
  // Tall stage house, red drum and barrel crown, as in the official elevated photo.
  box('stone',-10.95,10.95,14.06,19.5,-34.5,-13.1);
  box('roof',-11.06,11.06,19.55,21.05,-34.58,-13.02);
  box('trim',-11.22,11.22,19.13,19.48,-34.72,-12.85);
  const crown=new THREE.Shape();crown.moveTo(-11.06,21.05);crown.lineTo(11.06,21.05);
  crown.absellipse(0,21.05,11.06,4.95,0,Math.PI,false);crown.closePath();
  b.put(new THREE.ExtrudeGeometry(crown,{depth:21.56,bevelEnabled:false,curveSegments:near?22:10}).translate(0,0,-34.58),'roof');
  for(const v of [-34.73,-12.85])for(const u of [-5.5,0,5.5]) {
    b.put(onWall(new THREE.CircleGeometry(.36,near?16:8),u,23.1,v,v<0&&v<-30?Math.PI:0),'glass');
    b.put(onWall(new THREE.TorusGeometry(.48,.13,5,near?14:7),u,23.1,v+(v<-30?-.08:.08),v<-30?Math.PI:0),'roof');
  }
  if(near)for(const v of [-34.55,-27.4,-20.2,-13.05]) {
    const pts=[];for(let i=0;i<=24;i++){const a=i*Math.PI/24;pts.push([11.12*Math.cos(a),21.05+5*Math.sin(a),v]);}
    for(let i=1;i<pts.length;i++)b.bar('roof',pts[i-1],pts[i],.11,.14);
  }
  // Side and rear elevations: subordinate to the surveyed envelope.
  for(const s of [-1,1]) {
    box('rustication',s<0?-15.68:15.6,s<0?-15.6:15.68,0,6.0,-35.3,31.95);
    box('trim',s<0?-15.85:15.5,s<0?-15.5:15.85,6.1,6.4,-35.4,33.6);
    box('trim',s<0?-16.05:15.45,s<0?-15.45:16.05,13.6,14.25,-35.4,33.6);
    const a=s*Math.PI/2;
    for(let v=-31;v<31;v+=near?4.8:9.6) {
      window(s*15.78,7.0,v,1.75,5.0,a);
      const g=new THREE.PlaneGeometry(1.65,2.8);b.put(onWall(g,s*15.8,3.25,v,a),'glass');
      if(near)for(const yy of [.5,1.1,1.7,2.3,2.9,3.5,4.1,4.7,5.3])box('rustication',s<0?-15.85:15.71,s<0?-15.71:15.85,yy,yy+.39,v-1.1,v+1.1);
    }
  }
  for(const x of [-12,-8,-4,0,4,8,12]){
    window(x,7.0,-35.52,1.5,4.8,Math.PI);
    b.put(onWall(new THREE.PlaneGeometry(1.4,2.6),x,3.1,-35.51,Math.PI),'glass');
  }
  box('trim',-15.85,15.85,13.68,14.27,-35.73,-35.28);
  // Long roof ventilation boxes, seen behind the frontage in the aerial reference.
  for(const s of [-1,1])for(const v of [-5,9]){
    box('roof',s<0?-12:-7.6,s<0?-7.6:12,16.05,16.75,v-3.8,v+3.8);
  }
  if(near) {
    // Standing seams retain the metal-roof reading without photographic textures.
    for(let v=-11;v<18;v+=1.18)for(const s of [-1,1])b.bar('roof',[s*.35,18.94,v],[s*15.57,14.4,v],.055,.07);
    for(const s of [-1,1])for(let u=7.8;u<15.6;u+=.62)box('trim',s*u-.12,s*u+.12,13.35,13.62,facade+.18,facade+.43);
  }
  const root=b.finish();
  // Bake rotation in vertices, so runtime placement cannot apply it twice.
  root.traverse(o=>{if(o.isMesh){o.geometry.rotateY(ANGLE);const g=mergeVertices(o.geometry,1e-5);o.geometry.dispose();o.geometry=g;g.computeBoundingBox();g.computeBoundingSphere();}});
  return root;
}
