import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { parts, local } from './catedral-de-alajuela-parts.js';

export function create({detail='near'}={}) {
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const {put,box,bar,plan,lathe,gable,column,face}=parts(b,near);
  const ring=FOOTPRINTS[0].slice(0,-1).map(local);
  // Recess the west entry behind its genuinely open column portico.
  const body=ring.map(([x,z])=>[Math.max(-22,Math.min(22,x)),Math.min(z,30.5)]);
  plan('wall',body,0,9.2);
  plan('roof',body,9.2,.12);
  plan('trim',ring,0,.35);
  // Long red-metal nave roof; the low side aisles flank a raised centre.
  gable(-.2,6.2,28.0,48.6,9.2,13.1);
  box('wall',-.2,11.1,6.2,13.0,3.8,48.6);gable(-.2,6.2,13.4,48.8,13,15.4);
  for(const side of [-1,1]){
    const f=face(side*14,5.8,side*Math.PI/2);
    for(let s=-19;s<=19;s+=6.3){f.arch('glass',s,2.1,2.1,4.8);f.trim(s,2.1,2.1,4.8);f.box('trim',s,1.95,2.7,.3,.1,.5);}
    const c=face(side*6.5,5.8,side*Math.PI/2);
    for(let s=-19;s<=19;s+=6.3){c.arch('glass',s,10.2,1.4,2.0);c.trim(s,10.2,1.4,2,.14);}
  }
  // Side transept porticoes, white triangular pediments, red metal roofs.
  for(const side of [-1,1]){
    const x=side*(side<0?25.4:25.0),z=-20.7,ang=side*Math.PI/2;
    // Low transept roof as a rotated local triangular extrusion.
    const shape=new THREE.Shape([new THREE.Vector2(-5.2,9.2),new THREE.Vector2(5.2,9.2),new THREE.Vector2(0,13.5)]);
    put(new THREE.ExtrudeGeometry(shape,{depth:11,bevelEnabled:false}).translate(0,0,-11).rotateY(ang).translate(x,0,z),'roof');
    const f=face(x,z,ang);f.wall('wall',10.3,.35,9.2,[[-3.3,.35,2.1,7.5],[0,.35,2.4,8.0],[3.3,.35,2.1,7.5]]);
    for(const s of [-4.8,-1.65,1.65,4.8])column(x+Math.cos(ang)*s,z-Math.sin(ang)*s,.35,8.1,.3);
    f.box('trim',0,9.3,10.8,.45,-.1,.5);
    const ped=new THREE.Shape([new THREE.Vector2(-5.4,9.6),new THREE.Vector2(5.4,9.6),new THREE.Vector2(0,13.5)]);
    put(new THREE.ExtrudeGeometry(ped,{depth:.45,bevelEnabled:false}).translate(0,0,-.2).rotateY(ang).translate(x,0,z),'wall');
    f.circle('glass',0,10.6,.7,.3);
    for(const [a,c] of [[[-5.6,9.6,.4],[0,13.65,.4]],[[0,13.65,.4],[5.6,9.6,.4]]])f.line('trim',a,c,.24);
  }
  // The broad red drum: twelve separately framed arched windows below the dome.
  const dz=-20.8,r=11.35,N=near?24:16;
  lathe('roof',0,dz,[[r,9.2],[r,15.3]],N);
  const panelR=r*Math.cos(Math.PI/12),panelW=2*r*Math.sin(Math.PI/12);
  for(let i=0;i<12;i++){
    const a=i*Math.PI/6,f=face(panelR*Math.sin(a),dz+panelR*Math.cos(a),a);
    f.wall('roof',panelW,15.3,21,[ [0,16.0,1.8,4.2] ],.3);
    f.arch('glass',0,16,1.8,4.2,-.16);f.trim(0,16,1.8,4.2,.16,.12);
    if(near)for(const s of [-.45,0,.45])f.box('wall',s,17.6,.055,3.1,.16,.29);
    if(near)for(const y of [17,18,19])f.box('wall',0,y,1.75,.055,.16,.29);
    if(near)for(let j=0;j<5;j++){const q=j*Math.PI/4;f.line('wall',[0,19.3,.28],[.78*Math.cos(q),19.3+.78*Math.sin(q),.28],.055);}
  }
  lathe('roof',0,dz,[[r+.12,15.15],[r+.12,15.45]],N);
  lathe('roof',0,dz,[[r+.12,20.8],[r+.12,21.0]],N);
  // The shell is a shallow elliptical dome, not a spire or hemispherical tower.
  const prof=[];for(let j=0;j<=(near?12:6);j++){const q=j*Math.PI/2/(near?12:6);prof.push([j===(near?12:6)?0:r*Math.cos(q),21+10.5*Math.sin(q)]);}
  // Broad flat standing-seam colour bands share the shell surface: no tiny
  // round tubes or floating overlays. Far keeps the clean red shell alone.
  if(!near)lathe('roof',0,dz,prof,24);
  else for(let i=0;i<24;i++){
    const start=i*Math.PI/12,band=.018;
    for(const [offset,span,mat] of [[0,band,'seam'],[band,Math.PI/12-band,'roof']]){
      const g=new THREE.LatheGeometry(prof.map(v=>new THREE.Vector2(...v)),4,start+offset,span).translate(0,0,dz);
      put(g,mat);
    }
  }
  if(near)for(let i=0;i<12;i++){
    const a=i*Math.PI/6,f=face((r+.16)*Math.sin(a),dz+(r+.16)*Math.cos(a),a);
    const rim=new THREE.Shape();rim.absarc(0,13.8,.62,0,Math.PI*2,false);
    const hole=new THREE.Path();hole.absarc(0,13.8,.46,0,Math.PI*2,true);rim.holes.push(hole);
    put(new THREE.ShapeGeometry(rim).translate(0,0,.15).rotateY(a).translate((r+.16)*Math.sin(a),0,dz+(r+.16)*Math.cos(a)),'wall');
    f.circle('glass',0,13.8,.46,.04);
  }
  // West facade: tall Corinthian portico and a clock in a triangular pediment.
  const front=36.0,back=30.5;
  for(let i=0;i<4;i++)box('trim',-.2,.06*(i+1),34.8-i*.25,27.4,.12*(i+1),3.0-i*.5);
  const f=face(-.2,back);
  for(const s of [-8,0,8]){
    f.arch('door',s,.35,s===0?3.1:2.6,4.8,.24);f.trim(s,.35,s===0?3.1:2.6,4.8,.28);
    f.arch('glass',s,5.7,1.9,3.0,.24);f.trim(s,5.7,1.9,3,.16);
    if(near)for(const y of [1.4,2.8])f.box('metal',s,y,2.3,.07,.28,.4);
  }
  for(const x of [-12.8,-9.8,-4.4,-1.9,1.9,4.4,9.8,12.8])column(x,front,.35,10.6,.44);
  box('wall',-.2,10.8,33.3,28,1.0,6.4);box('trim',-.2,11.45,33.3,28.5,.3,6.7);
  box('wall',-.2,14.8,31.1,18.5,6.4,1.2);
  // Engaged second-order columns, cornice and central arched opening.
  const upper=face(-.2,31.75);
  upper.arch('glass',0,12.5,2.5,4.3,.15);upper.trim(0,12.5,2.5,4.3,.22,.27);
  for(const x of [-8,-4.3,3.9,7.6])column(x,32.05,11.6,17.5,.30);
  box('wall',-.2,17.65,31.9,19.2,.55,1.6);
  const ped=new THREE.Shape([new THREE.Vector2(-10.2,17.9),new THREE.Vector2(9.8,17.9),new THREE.Vector2(-.2,22.1)]);
  put(new THREE.ExtrudeGeometry(ped,{depth:1,bevelEnabled:false}).translate(0,0,30.8),'wall');
  for(const [a,c] of [[[-10.4,17.9,32],[-.2,22.25,32]],[[-.2,22.25,32],[10,17.9,32]]])bar('trim',a,c,.27);
  const clock=face(-.2,31.8);clock.circle('trim',0,19.45,1.18,.2);clock.circle('wall',0,19.45,1.0,.32);
  for(let i=0;i<12;i++){const a=i*Math.PI/6;clock.line('glass',[.8*Math.sin(a),19.45+.8*Math.cos(a),.36],[.95*Math.sin(a),19.45+.95*Math.cos(a),.36],.055);}
  clock.line('glass',[0,19.45,.4],[.02,20.15,.4],.09);clock.line('glass',[0,19.45,.4],[.48,19.25,.4],.09);
  // Twin white bell turrets confirmed by the front reference and coordinator.
  for(const x of [-11.3,10.9]) {
    const z=32.5,w=4.6;
    box('wall',x,15.55,z,w,7.9,w);
    for(const a of [0,Math.PI/2,Math.PI,-Math.PI/2]) {
      const ff=face(x+Math.sin(a)*w/2,z+Math.cos(a)*w/2,a);
      ff.arch('glass',0,13.0,1.45,4.9,.22);ff.trim(0,13,1.45,4.9,.18);
      for(const s of [-1.95,1.95])column(x+Math.sin(a)*w/2+Math.cos(a)*s,z+Math.cos(a)*w/2-Math.sin(a)*s,11.7,19.2,.2);
    }
    box('trim',x,19.7,z,5.2,.45,5.2);
    // Additional square belfry: four real arched voids, corner pilasters.
    for(const a of [0,Math.PI/2,Math.PI,-Math.PI/2]){
      const ff=face(x+Math.sin(a)*2.3,z+Math.cos(a)*2.3,a);
      ff.wall('wall',4.6,19.92,25.65,[[0,20.45,2.0,4.6]],.42);
      for(const u of [-1.9,1.9])column(x+Math.sin(a)*2.3+Math.cos(a)*u,z+Math.cos(a)*2.3-Math.sin(a)*u,20.0,25.4,.20);
    }
    box('wall',x,25.8,z,5.5,.45,5.5);
    for(const a of [0,Math.PI/2,Math.PI,-Math.PI/2]){
      const ff=face(x+Math.sin(a)*2.45,z+Math.cos(a)*2.45,a);
      ff.box('wall',0,26.75,5.0,.22,-.12,.12);
      for(const u of [-2.2,-1.1,0,1.1,2.2])ff.box('wall',u,26.35,.16,.8,-.10,.10);
    }
    // Octagonal upper belfry and stepped bell cupola.
    for(let i=0;i<8;i++){
      const a=i*Math.PI/4,ff=face(x+Math.sin(a)*1.85,z+Math.cos(a)*1.85,a);
      ff.wall('wall',1.54,26.03,29.1,[[0,26.3,.94,2.4]],.3);
    }
    lathe('wall',x,z,[[2.45,29.1],[2.45,29.45],[2.0,29.65],[2.0,30.0],[1.8,30.2],[1.8,30.55],[1.45,30.75],[1.45,31.15],[1.15,31.7],[.62,32.3],[.55,33.05],[0,33.3]],near?16:8);
    box('metal',x,34.3,z,.12,2.5,.12);box('metal',x,34.8,z,1.35,.12,.12);
  }
  return b.finish();
}
