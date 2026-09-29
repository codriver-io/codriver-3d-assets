import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// Original, texture-free architectural studies. Coordinates are metres in an
// east/up/south tangent frame; y=0 is the local foundation plane, not sea level.
export const PARIS_ICONS = Object.freeze([
  { id:'paris-tour-eiffel', name:'Tour Eiffel', origin:[2.2944962,48.8582620], rotation:Math.PI/4, footprint:[125,125], height:330, pad:68,
    palette:{iron:'#765b43',trim:'#9b7955',glass:'#5b7378',stone:'#aaa99d',roof:'#a98b62',gold:'#cba445'} },
  { id:'paris-arc-de-triomphe', name:'Arc de Triomphe', origin:[2.2950373,48.8737780], rotation:1.0214, footprint:[44.8,22.2], height:50, pad:27,
    palette:{stone:'#d8ceb7',trim:'#e4d8c3',relief:'#b7ae9a',roof:'#bcb5a6',glass:'#77756e'} },
  { id:'paris-notre-dame', name:'Notre-Dame de Paris', origin:[2.3499095,48.8529723], rotation:-2.1286, footprint:[48,127], height:96, pad:69,
    palette:{stone:'#c8c0ae',trim:'#e0d5c2',roof:'#63636a',glass:'#353b47',iron:'#6d6a64',relief:'#a89e8a'} },
  { id:'paris-sacre-coeur', name:'Sacré-Cœur', origin:[2.3430193,48.8867699], rotation:0.112, footprint:[75,85], height:84, pad:48,
    palette:{stone:'#e8e7dd',trim:'#f4f1e8',roof:'#dadbd4',glass:'#596570',relief:'#d1cfc4',gold:'#cfb985'} },
  { id:'paris-invalides', name:'Dôme des Invalides', origin:[2.31254,48.85505], rotation:0, footprint:[58,70], height:107, pad:38,
    palette:{stone:'#d2c5aa',trim:'#ead9b9',roof:'#788073',glass:'#526270',gold:'#cda637',relief:'#ae9b79'} },
]);
export const PARIS_ICON_BY_ID=Object.fromEntries(PARIS_ICONS.map(v=>[v.id,v]));

function builder(spec, detail) {
  const near=detail==='near', batches=new Map(), palette=spec.palette;
  const root=new THREE.Group();root.name=spec.name;root.userData={id:spec.id,detail,units:'metres',origin:spec.origin,provenance:'Original Codriver-commissioned procedural model'};
  const add=(g,m)=>{g.deleteAttribute('uv');if(!g.index)g.setIndex(Array.from({length:g.attributes.position.count},(_,i)=>i));if(!batches.has(m))batches.set(m,[]);batches.get(m).push(g);};
  const box=(m,x,y,z,w,h,d)=>{const g=new THREE.BoxGeometry(w,h,d);g.translate(x,y,z);add(g,m);};
  const beam=(m,a,c,r=.35)=>{const av=new THREE.Vector3(...a),cv=new THREE.Vector3(...c),v=cv.clone().sub(av);if(v.length()<.01)return;const g=new THREE.CylinderGeometry(r,r,v.length(),near?6:4);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.clone().normalize()));g.translate(...av.add(cv).multiplyScalar(.5).toArray());add(g,m);};
  const cylinder=(m,x,y,z,rb,rt,h,n=near?24:12)=>{const g=new THREE.CylinderGeometry(rt,rb,h,n);g.translate(x,y,z);add(g,m);};
  const disk=(m,x,y,z,r,depth=.35)=>{const g=new THREE.CylinderGeometry(r,r,depth,near?24:12);g.rotateX(Math.PI/2);g.translate(x,y,z);add(g,m);};
  const sphere=(m,x,y,z,rx,ry,rz,n=near?24:12,hemi=false)=>{const g=new THREE.SphereGeometry(1,n,near?12:7,0,Math.PI*2,0,hemi?Math.PI/2:Math.PI);g.scale(rx,ry,rz);g.translate(x,y,z);add(g,m);};
  const cone=(m,x,y,z,r,h,n=near?16:8)=>cylinder(m,x,y,z,r,0,h,n);
  const roof=(m,x,y,z,w,d,rise)=>{const g=new THREE.BufferGeometry(),p=[-w/2,0,-d/2,w/2,0,-d/2,0,rise,-d/2,-w/2,0,d/2,w/2,0,d/2,0,rise,d/2],ix=[0,1,2,3,5,4,0,3,1,1,3,4,1,4,5,1,5,2,2,5,3,2,3,0];g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(ix);g.computeVertexNormals();g.translate(x,y,z);add(g,m);};
  const arc=(m,cx,cy,cz,rx,ry,a0,a1,r=.5,steps=near?18:9,axis='x')=>{for(let i=0;i<steps;i++){const a=a0+(a1-a0)*i/steps,b=a0+(a1-a0)*(i+1)/steps;const point=t=>axis==='x'?[cx+rx*Math.cos(t),cy+ry*Math.sin(t),cz]:[cx,cy+ry*Math.sin(t),cz+rx*Math.cos(t)];beam(m,point(a),point(b),r);}};
  const archBand=(m,cx,cy,cz,rx,ry,width=1.6,depth=.85,axis='x')=>{
    const shape=new THREE.Shape(),steps=near?24:12;
    for(let i=0;i<=steps;i++){const t=Math.PI*i/steps,x=rx*Math.cos(t),y=ry*Math.sin(t);if(i===0)shape.moveTo(x,y);else shape.lineTo(x,y);}
    for(let i=steps;i>=0;i--){const t=Math.PI*i/steps;shape.lineTo((rx+width)*Math.cos(t),(ry+width)*Math.sin(t));}
    shape.closePath();const g=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:steps});
    if(axis==='x')g.translate(cx,cy,cz-depth/2);else{g.rotateY(Math.PI/2);g.translate(cx-depth/2,cy,cz);}
    add(g,m);
  };
  const archCap=(m,cx,cy,cz,rx,ry,top,depth)=>{
    // Stone between the curved portal crown and attic, through the wall.
    const shape=new THREE.Shape(),steps=near?32:16;
    for(let i=0;i<=steps;i++){
      const t=Math.PI-Math.PI*i/steps,x=cx+rx*Math.cos(t),y=cy+ry*Math.sin(t);
      if(!i)shape.moveTo(x,y);else shape.lineTo(x,y);
    }
    shape.lineTo(cx+rx,top);shape.lineTo(cx-rx,top);shape.closePath();
    const g=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:steps});
    g.translate(0,0,cz-depth/2);add(g,m);
  };
  const finish=()=>{for(const [name,geoms] of batches){const g=mergeGeometries(geoms);geoms.forEach(v=>v.dispose());const mat=new THREE.MeshStandardMaterial({color:palette[name]||'#aaaaaa',roughness:name==='gold'?.48:.86,metalness:name==='gold'?.72:name==='iron'?.42:0,side:THREE.DoubleSide});mat.name=name;const mesh=new THREE.Mesh(g,mat);mesh.name=name;root.add(mesh);}root.rotation.y=spec.rotation;return root;};
  return {near,box,beam,cylinder,disk,sphere,cone,roof,arc,archBand,archCap,finish};
}

function eiffel(b) {
  const {near,box,beam,cylinder,arc}=b;
  // Four separate footings and rising curved lattice legs keep all four ground
  // passages open. The 125 m datum and deck heights are published dimensions.
  const levels=near?20:10,foot=51;
  for(const sx of [-1,1])for(const sz of [-1,1]){
    box('stone',sx*foot,1,sz*foot,23,2,23);
    const center=t=>{const y=276*t,spread=4+47*Math.pow(1-t,2.25);return [sx*spread,y,sz*spread];};
    for(let k=0;k<levels;k++){
      const p=center(k/levels),q=center((k+1)/levels),side=near?2.2:3.2;
      for(const dx of [-1,1])for(const dz of [-1,1])beam('iron',[p[0]+dx*side,p[1],p[2]+dz*side],[q[0]+dx*side*.65,q[1],q[2]+dz*side*.65],near?.85:1.25);
      if(near||k%2===0){beam('trim',[p[0]-side,p[1],p[2]-side],[q[0]+side*.65,q[1],q[2]+side*.65],.38);beam('trim',[p[0]+side,p[1],p[2]-side],[q[0]-side*.65,q[1],q[2]+side*.65],.38);}
      if(k%2===0){const h=p[1];beam('iron',[p[0]-side,h,p[2]-side],[p[0]+side,h,p[2]-side],.45);beam('iron',[p[0]-side,h,p[2]+side],[p[0]+side,h,p[2]+side],.45);}
    }
  }
  for(const [y,w,d] of [[57,67,67],[115,37,37],[276,16,16]]){
    // Framed decks have open center wells, not a solid tower core.
    for(const s of [-1,1]){box('iron',s*(w/2-2),y,0,4,3,d);box('iron',0,y,s*(d/2-2),w-8,3,4);}
    for(let i=-w/2+3;i<w/2-2;i+=near?5:10){beam('trim',[i,y+1.5,-d/2],[i,y+1.5,d/2],.25);}
    for(const s of [-1,1])for(let k=-w/2;k<=w/2;k+=near?4:8)beam('trim',[k,y+1.5,s*d/2],[k,y+4,s*d/2],.15);
  }
  // Sweeping four base arches on the cardinal facades, below first deck.
  for(const side of [-1,1]){arc('trim',0,10,side*48,50,45,0,Math.PI,1.0,near?30:14);arc('trim',side*48,10,0,50,45,0,Math.PI,1.0,near?30:14,'z');}
  for(let y=278;y<311;y+=7)cylinder('iron',0,y+3.5,0,6-(y-278)*.12,5-(y-278)*.12,7);
  cylinder('iron',0,315,0,2.1,.8,17);cylinder('trim',0,326,0,.55,.28,8);
}

function triomphe(b){
  const {near,box,beam,arc,archBand,archCap}=b;
  // Main opening across the east-west avenue; transverse portal stays open.
  const W=44.8,D=22.2;
  for(const sx of [-1,1])for(const sz of [-1,1]){
    box('stone',sx*14.7,16.75,sz*7.5,15.2,33.5,7.2);
    box('trim',sx*14.7,2,sz*7.5,15.4,3.5,8);
    if(near){box('relief',sx*15.3,13,sz*11.3,8,13,.55);box('relief',sx*22.5,13,sz*7.5,.5,12,5.5);}
  }
  // Arch voussoirs trace both visible faces and the crossing tunnel roof.
  for(const z of [-11.15,11.15]){archBand('trim',0,15,z,7.3,14.2,1.8,.9);archBand('stone',0,15,z,9.1,15.3,.8,1.2);}
  for(const x of [-22.4,22.4])archBand('trim',x,10.2,0,4.2,8.5,1.2,.9,'z');
  for(const z of [-8,0,8])arc('stone',0,15,z,8.4,14.7,0,Math.PI,.55,near?14:7);
  for(const x of [-18,18])arc('stone',x,10.2,0,4.8,9.1,0,Math.PI,.45,near?12:6,'z');
  archCap('stone',0,15,0,7.3,14.2,33.5,D);
  box('stone',0,36.5,0,W,6,D);box('trim',0,40,0,W+1,1.8,D+1);
  box('stone',0,45.5,0,W,9.5,D);box('trim',0,49.4,0,W+1.4,1.3,D+1.2);
  if(near)for(const z of [-11.2,11.2]){for(let x=-16;x<=16;x+=3.2)box('relief',x,45.5,z,2.1,3.5,.4);for(let x=-21;x<=21;x+=3)box('trim',x,49.6,z,.6,1.2,.7);}
}

function notreDame(b){
  const {near,box,beam,cylinder,disk,cone,roof,arc}=b;
  // West facade is at z=+58.7. East apse is negative z.
  box('stone',0,16,0,31,32,93);box('stone',0,10,0,48,20,84);
  box('stone',0,23,48,27,46,22);
  box('stone',0,16,-49,36,32,22);cylinder('stone',0,16,-49,14,14,32,near?24:12);
  box('stone',0,18,-4,48,36,27);
  roof('roof',0,32,0,32,94,14);roof('roof',0,36,-4,48,27,11);
  for(const x of [-17,17]){
    box('stone',x,34,48,18,68,19);
    box('trim',x,68.2,48,19,1.4,20);
    for(const z of [58,38.1]){
      box('glass',x,29,z,7,11,.3);arc('trim',x,34,z+.2,4.1,3.3,0,Math.PI,.35);
      for(const dx of [-3.5,3.5]){box('glass',x+dx,52,z,3.1,13,.3);arc('trim',x+dx,58,z+.2,2,3,0,Math.PI,.3);}
    }
    if(near)for(const ix of [-1,1])for(const iz of [-1,1])box('trim',x+ix*7.5,65,48+iz*8,.9,8,.9);
  }
  // Three western portals, gallery and rose; details remain shallow.
  for(const x of [-13,0,13]){box('glass',x,7,58.9,8,13,.35);arc('trim',x,12,59.2,4.4,5.5,0,Math.PI,.55);}
  disk('glass',0,36,59,7.8);arc('trim',0,36,59.4,8.5,8.5,0,Math.PI*2,.55,near?32:16);
  for(let i=0;i<(near?12:6);i++){const t=i*Math.PI*2/(near?12:6);beam('trim',[0,36,59.7],[7.5*Math.cos(t),36+7.5*Math.sin(t),59.7],.18);}
  box('trim',0,25,59,44,1.3,1);box('trim',0,47,59,44,1.2,1);
  for(let x=-18;x<=18;x+=near?3:6)box('trim',x,49.5,59.2,.55,5,.8);
  // Flying buttresses: curved struts from aisle piers up to the clerestory.
  for(let z=-40;z<=35;z+=near?8:15)for(const s of [-1,1]){
    box('stone',s*25,10,z,2.2,20,2.5);
    beam('trim',[s*25,20,z],[s*17,31,z],near?.65:.95);
    arc('trim',s*21,18,z,4,13,0,Math.PI,.35,near?8:5);
  }
  // Octagonal rebuilt spire above crossing: 96 m published tip.
  cylinder('roof',0,54,-4,5.5,4.3,16,8);cone('roof',0,78,-4,5.2,32,8);beam('iron',[0,94,-4],[0,96,-4],.35);
}

function sacreCoeur(b){
  const {near,box,cylinder,sphere,cone,roof,arc}=b;
  box('stone',0,13,-2,48,26,76);box('stone',0,15,-7,54,30,25);box('stone',0,15,31,51,30,20);
  box('stone',0,12,-41,34,24,19);roof('roof',0,24,-41,34,19,8);
  for(const [x,z,r,base,h] of [[0,-8,19,28,55],[-18,-8,8,26,22],[18,-8,8,26,22],[-16,25,7,27,19],[16,25,7,27,19]]){
    cylinder('trim',x,base+3,z,r,r,6);
    if(near)for(let i=0;i<12;i++){const t=i*Math.PI/6;box('glass',x+(r+.08)*Math.cos(t),base+3,z+(r+.08)*Math.sin(t),1.1,3,.3);}
    sphere('roof',x,base+6,z,r,h*.68,r,near?28:14,true);
    cylinder('trim',x,base+h*.68+6,z,2.5,2,4);cone('roof',x,base+h*.68+11,z,3,7);
  }
  // Bell tower northeast of apse, visibly separate from the central dome.
  box('stone',21,32,-31,12,64,12);for(const y of [28,44,57])for(const z of [-37.2,-24.8])box('glass',21,y,z,6,8,.4);
  box('stone',21,66.5,-31,12,5,12);cone('roof',21,76.5,-31,8,15);
  // Triple front portico at southern approach; no solid facade across arches.
  for(const x of [-21,-13,-5,5,13,21])cylinder('stone',x,12,42,.95,.95,24,near?12:6);
  for(const x of [-14,0,14])box('glass',x,10,41.3,9,14,.35);
  box('trim',0,24.5,42,48,2,6);roof('stone',0,25.5,42,48,7,9);
  for(const x of [-14,0,14])arc('trim',x,8,45.2,6,11,0,Math.PI,.75);
  // Terraces are independent stepped pedestrian volumes within the forecourt.
  for(let i=0;i<5;i++)box('stone',0,(i+1)*.42,54+i*2,48-i*3,.85,2.05);
}

function invalides(b){
  const {near,box,beam,cylinder,sphere,cone,roof}=b;
  // Bounded church cross and short wings only; excludes the 15 ha complex.
  box('stone',0,16,-1,42,32,66);box('stone',0,16,14,56,32,28);
  for(const x of [-23.5,23.5]){box('stone',x,13,-2,10,26,44);roof('roof',x,26,-2,10,44,7);}
  roof('roof',0,32,-1,42,66,8);
  box('trim',0,34,14,47,3,28);
  cylinder('stone',0,44,14,20,18,20,near?32:16);
  for(let i=0;i<(near?24:12);i++){const t=i*Math.PI*2/(near?24:12);cylinder('trim',Math.cos(t)*18,47,14+Math.sin(t)*18,.85,.85,19,near?8:5);
    if(i%2===0)box('glass',Math.cos(t)*19,47,14+Math.sin(t)*19,2.4,8,.35);}
  cylinder('trim',0,57,14,21,20,5,near?32:16);
  sphere('gold',0,61,14,20,29,20,near?32:16,true);
  for(let i=0;i<(near?16:8);i++){const t=i*Math.PI*2/(near?16:8);beam('trim',[Math.sin(t)*19,61,14+Math.cos(t)*19],[Math.sin(t)*3,88,14+Math.cos(t)*3],.32);}
  cylinder('gold',0,91,14,4,3,8);cone('gold',0,99,14,4,8);beam('gold',[0,103,14],[0,107,14],.33);
  // Stone portico toward Place Vauban and repeated shallow wing bays.
  for(const x of [-15,-9,-3,3,9,15])cylinder('trim',x,11,35,.85,.85,22,near?10:6);
  for(const x of [-12,0,12])box('glass',x,11,32.4,6,14,.35);
  box('trim',0,23,35,39,2,4);roof('stone',0,24,35,39,5,7);
  box('trim',0,18,33.5,52,1.4,1);
  if(near)for(const x of [-28,-19,19,28])for(const z of [-14,0,14])box('glass',x,13,z,2.4,7,.3);
}

const makers={'paris-tour-eiffel':eiffel,'paris-arc-de-triomphe':triomphe,'paris-notre-dame':notreDame,'paris-sacre-coeur':sacreCoeur,'paris-invalides':invalides};
export function createParisIcon(id,{detail='near'}={}){const spec=PARIS_ICON_BY_ID[id];if(!spec)throw Error('Unknown Paris icon: '+id);const b=builder(spec,detail);makers[id](b);return b.finish();}
