import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { xyz } from './notre-dame-de-la-garde-frame.js';
import { gardeKit } from './notre-dame-de-la-garde-kit.js';

// Original procedural architecture. u runs toward the southeast apse; v southwest.
export function create({ detail='near' }={}) {
  const b=assetBuilder({...SPEC,palette:PALETTES.light},detail), k=gardeKit(b,detail==='near');
  site(k); church(k); tower(k); dome(k); statue(k);
  const root=b.finish();
  root.traverse(o=>{if(o.isMesh){
    const g=o.geometry,p=g.attributes.position;
    for(let i=0;i<p.count;i++)p.setXYZ(i,...xyz(p.getX(i),p.getY(i),p.getZ(i)));
    // Bake mapped rotation once, retaining outward normals and hard face edges.
    const n=g.attributes.normal;
    for(let i=0;i<n.count;i++)n.setXYZ(i,...xyz(n.getX(i),n.getY(i),n.getZ(i)));
    const welded=mergeVertices(g,1e-4);o.geometry=welded;g.dispose();welded.computeBoundingBox();welded.computeBoundingSphere();
  }});
  root.userData.triangles=root.children.reduce((n,o)=>n+o.geometry.index.count/3,0);
  return root;
}
function polygon(k,pts,y,height,mat='stone') {
  const shape=new THREE.Shape(pts.map(([u,v])=>new THREE.Vector2(u,-v)));
  const g=new THREE.ExtrudeGeometry(shape,{depth:height,bevelEnabled:false});g.rotateX(-Math.PI/2);g.translate(0,y,0);k.put(g,mat);
}
function mapped(k,ring,y,height,mat='stone') {
  const a=131*Math.PI/180;
  const pts=ring.map(([lng,lat])=>{
    const x=(lng-5.371)*111320*Math.cos(43.2841*Math.PI/180),z=-(lat-43.2841)*111320;
    return [x*Math.sin(a)-z*Math.cos(a),x*Math.cos(a)+z*Math.sin(a)];
  });polygon(k,pts,y,height,mat);
}
function site(k) {
  polygon(k,[[-18,-15],[54,-15],[54,14],[-8,14],[-18,7]],0,.4);
  polygon(k,[[-6,-11],[51,-11],[51,11],[-6,11]],.4,4.6);
  // Low crypt/bastion and northeast annex follow their exact owned mapped outline.
  mapped(k,FOOTPRINTS[2],0,5.05);mapped(k,FOOTPRINTS[3],0,4.9);
  k.roof(-2.7,9.7,-30.2,-17.35,5.05,7.2,'roof');
  for(const side of [-1,1]) {
    k.box('trim',[22.5,5.2,side*11],[56.9,.4,.7]);
    for(let u=8;u<50;u+=5.5)k.window(side>0?'v+':'v-',side*11.02,{q:u,bottom:1.3,spring:3.25,width:.85});
    // Stone balustrade with real gaps, continuous footing and supported cap.
    k.box('trim',[22.5,6.12,side*10.9],[56.9,.22,.4]);
    for(let u=-5.7;u<=50.7;u+=k.near?1.35:4.05)k.box('trim',[u,5.65,side*10.9],[.32,.78,.34]);
  }
  // Two continuous flights climb from the lower fort terrace to the entrance.
  for(const v of [-7.7,7.7])for(let i=0;i<20;i++) {
    const h=.4+(i+1)*.23;k.box('stone',[-17.8+(i+.5)*.58,h/2,v],[.58,h,3.4]);
  }
  k.box('stone',[-4.55,2.7,0],[3,4.6,21.3]);
  // Front approach lands on the 5 m parvis, then a short central entry stair.
  for(let i=0;i<4;i++)k.box('trim',[-2.1+i*.35,5+(i+1)*.11,0],[.35,(i+1)*.22,3.1]);
}
function church(k) {
  const bays=[12.5,19.3,26.1,35.0,44.7];
  for(const s of [-1,1]) {
    const side=s>0?'v+':'v-',p=s>0?8.15:-7.75;
    const wins=bays.map(q=>({q,bottom:12.1,spring:17.3,width:1.85}));
    k.wall(side,p,7.0,49.2,5,22,wins,.75);
    for(const w of wins) {
      k.window(side,p-s*.7,w);
      k.arch(side,p+s*.2,w.q,w.bottom-.2,w.spring,w.width,.28,'trim',.18);
      k.arch(side,p+s*.25,w.q,18.25,18.6,5.6,.48,'trim',.25,true);
      if(k.near) {
        const u=w.q,z=p+s*.32;
        k.bar('trim',[u,w.bottom,z],[u,w.spring+.78,z],.08,.08);
        k.box('trim',[u,14.6,z],[1.85,.08,.08]);
      }
      k.window(side,p+s*.03,{q:w.q,bottom:5.7,spring:6.8,width:1.15});
    }
    for(const u of [7.6,9.2,16.1,22.9,29.6,31.2,39.9,48.5]) {
      k.wall(side,p+s*.42,u-.55,u+.55,5,21.825,[],.9);
      k.box('trim',[u,22.5,p+s*.25],[1.4,1.35,1.35]);
    }
    k.box('trim',[28.1,22.1,p+s*.15],[42.2,.55,.75]);
    // The lower courses remain continuous; no layered belt is needed here.
    if(k.near)for(let u=7.5;u<49;u+=2.55) {
      k.arch(side,p+s*.35,u,22.45,22.55,.62,.16,'trim',.22);
      k.box('trim',[u,23.52,p+s*.05],[.38,.3,.5]);
    }
  }
  // Solid rear facade, with a tall grouped three-light opening and rose.
  const end=[{q:-2.25,bottom:12.2,spring:17.4,width:1.55},{q:.2,bottom:12.2,spring:17.4,width:1.55},{q:2.65,bottom:12.2,spring:17.4,width:1.55}];
  k.wall('u+',49.3,-7.75,8.15,5,22,end,.75);
  for(const w of end){k.window('u+',48.58,w);k.arch('u+',49.5,w.q,w.bottom,w.spring,w.width,.27);}
  k.roof(7,49.7,-7.9,8.3,22.35,26.0);
  // Transept side pediments rise around the central octagonal drum.
  for(const s of [-1,1]) {
    const p=s>0?8.15:-7.75,face=s>0?'v+':'v-';
    k.solid([[29.6,22],[40.4,22],[35,27.3]],1.2,'stone',face,p+s*.15);
    k.bar('trim',[29.3,22.3,p+s*.3],[35,27.55,p+s*.3],.35,.48);
    k.bar('trim',[35,27.55,p+s*.3],[40.7,22.3,p+s*.3],.35,.48);
    const g=new THREE.CylinderGeometry(1.04,1.04,.16,k.near?16:10);g.rotateX(Math.PI/2);g.translate(35,24.5,p+s*.33);k.put(g,'glass');
    if(k.near)k.arch(face,p+s*.75,35,24.5,24.5,2.15,.22,'trim',.16);
  }
  k.box('stone',[7.35,13.5,.2],[.8,17,15.9]);
}
function tower(k) {
  const u=2.9,v=.12,h=3.85;
  const sides=[['u-',u-h,v],['u+',u+h,v],['v-',v-h,u],['v+',v+h,u]];
  for(const [face,p,q] of sides) {
    const wins=[{q,bottom:5.8,spring:9.6,width:3.15},{q,bottom:13,spring:17.2,width:1.0},{q,bottom:23.1,spring:27.3,width:1.0}];
    k.wall(face,p,q-h,q+h,5,30.85,wins,.9);
    for(const w of wins){k.window(face,p+(face.endsWith('+')?-.82:.82),w);k.arch(face,p+(face.endsWith('+')?.2:-.2),w.q,w.bottom,w.spring,w.width,w.width>2?.4:.19,'trim',.2,w.width>2);}
    // Two five-bay blind arcades; the central bay is genuinely recessed glazing.
    for(const [bottom,spring] of [[12.7,17.2],[22.8,27.3]])for(let i=k.near?-2:-1;i<=(k.near?2:1);i++) {
      k.arch(face,p+(face.endsWith('+')?.28:-.28),q+i*1.22,bottom,spring,1.02,.16,'trim',.2);
    }
    for(const y of [11.8,20.4,29.5]) {
      if(face.startsWith('u'))k.box('trim',[p,y,q],[.7,.55,8.0]);
      else k.box('trim',[q,y,p],[8.0,.55,.7]);
    }
  }
  // Four banded corner pilasters rise continuously into the open belfry.
  for(const a of [-1,1])for(const c of [-1,1]) {
    const uu=u+a*3.6,vv=v+c*3.6;
    const period=k.near?1.08:2.16,pale=period*.63;
    for(let y=31.35;y<37.5;y+=period){
      const hi=Math.min(37.5,y+period),mid=Math.min(hi,y+pale);
      k.box('stone',[uu,(y+mid)/2,vv],[.88,mid-y,.88]);
      if(hi>mid)k.box('green',[uu,(mid+hi)/2,vv],[.88,hi-mid,.88]);
    }
  }
  k.box('trim',[u,31.1,v],[8.5,.45,8.5]);
  for(const [face,p,q] of sides) {
    const windows=[-2.12,0,2.12].map(d=>({q:q+d,bottom:31.35,spring:37.5,width:1.65}));
    k.wall(face,p,q-h,q+h,37.5,39.65,windows,.55);
    for(const w of windows)k.arch(face,p+(face.endsWith('+')?.12:-.12),w.q,37.5,37.5,w.width,.3,'trim',.3,true);
    for(const d of [-1.06,1.06]) {
      const uu=face.startsWith('u')?p:q+d,vv=face.startsWith('u')?q+d:p;
      k.column(uu,vv,31.3,37.55,.24);
    }
    // Louver blades are recessed into each opening, and touch the side supports.
    for(const w of windows)for(let y=32;y<36.9;y+=k.near?.65:1.8) {
      if(face.startsWith('u'))k.box('glass',[p+(face.endsWith('+')?-.6:.6),y,w.q],[.13,.22,1.98]);
      else k.box('glass',[w.q,y,p+(face.endsWith('+')?-.6:.6)],[1.98,.22,.13]);
    }
  }
  k.box('trim',[u,40.1,v],[9.1,.9,9.1]);
  k.box('trim',[u,40.65,v],[9.7,.3,9.7]);
  // Balcony parapet has a heavy supported base, small open balusters and cap.
  for(const a of [-1,1]) {
    k.box('trim',[u,41.85,v+a*4.55],[9.3,.25,.38]);
    k.box('trim',[u+a*4.55,41.85,v],[.38,.25,9.3]);
    for(let d=-4.35;d<=4.35;d+=k.near?.62:1.86) {
      k.box('trim',[u+d,41.25,v+a*4.55],[.28,.85,.28]);k.box('trim',[u+a*4.55,41.25,v+d],[.28,.85,.28]);
    }
  }
  if(k.near)for(let i=-4;i<=4;i++)for(const s of [-1,1]) {
    k.box('trim',[u+i,39.64,v+s*4.25],[.36,.45,.75]);k.box('trim',[u+s*4.25,39.64,v+i],[.75,.45,.36]);
  }
  // Cylindrical 12.5 m pedestal above the published 41 m square-tower datum.
  k.lathe('stone',[[0,40.8],[2.8,40.8],[2.8,43.25],[2.5,44.1],[2.5,45.3],[0,45.3]],u,v,k.near?24:12);
  k.lathe('trim',[[0,45.2],[2.85,45.2],[2.85,45.7],[0,45.7]],u,v,k.near?24:12);
  for(let i=0;i<16;i++) {
    const a=2*Math.PI*i/16;k.column(u+Math.sin(a)*2.38,v+Math.cos(a)*2.38,45.65,49.35,.17,'granite',k.near?6:4);
  }
  k.lathe('trim',[[0,49.15],[2.85,49.15],[2.85,49.7],[2.5,50.1],[0,50.1]],u,v,k.near?24:12);
  k.lathe('stone',[[0,49.9],[2.52,49.9],[2.3,50.5],[1.55,52.2],[1.3,52.9],[0,52.9]],u,v,k.near?24:12);
  k.lathe('roof',[[0,52.75],[1.42,52.75],[1.42,53.5],[0,53.5]],u,v,k.near?16:8);
  // Corner trumpet angels: grouped bodies, heads, wings and supported arms.
  for(const s of [-1,1])for(const t of [-1,1]) {
    const a=u+s*4.28,c=v+t*4.28;
    k.box('trim',[a,42.18,c],[.82,.6,.82]);
    k.lathe('trim',[[0,42.3],[.5,42.3],[.32,44.2],[0,44.2]],a,c,6);
    k.sphere('trim',a,44.45,c,.26,.35,.28);
    k.bar('trim',[a,43.5,c],[a+s*.8,44.35,c+t*.4],.21,.3);
    k.bar('trim',[a+s*.8,44.35,c+t*.4],[a+s*1.25,44.7,c+t*.7],.15,.15);
    for(const side of [-1,1])k.sphere('trim',a+side*.47,43.5,c+.25,.25,.7,.12);
  }
}
function dome(k) {
  const u=35,v=.2,apothem=5.35;
  // Eight cut-wall facets form a drum, preserving tall arched windows at far LOD.
  for(let i=0;i<8;i++) {
    const a=i*Math.PI/4;
    const temp=assetBuilder({...SPEC,palette:PALETTES.light},k.near?'near':'far'), t=gardeKit(temp,k.near);
    const w={q:0,bottom:26.3,spring:30.25,width:1.85};
    t.wall('v+',apothem,-2.215,2.215,25,32,[w],.65,true);
    t.window('v+',apothem-.6,w);t.arch('v+',apothem+.15,0,w.bottom,w.spring,w.width,.23);
    t.solid([[-2.24,31.6],[2.24,31.6],[0,33.6]],.7,'stone','v+',apothem+.2);
    t.arch('v+',apothem+.36,0,31.65,31.65,3.2,.3,'trim',.2,true);
    const g=temp.finish();g.traverse(o=>{if(o.isMesh){o.geometry.rotateY(a);o.geometry.translate(u,0,v);k.put(o.geometry.clone(),o.material.name);o.geometry.dispose();o.material.dispose();}});
    const aa=a+Math.PI/8;k.column(u+Math.sin(aa)*5.72,v+Math.cos(aa)*5.72,25,31.9,.22,'trim',k.near?8:4);
  }
  k.lathe('trim',[[0,24.5],[5.75,24.5],[5.75,25.1],[0,25.1]],u,v,8);
  const base=31.55,ry=6.05,r=5.55,profile=[[0,base],[r,base]];
  for(let i=1;i<=(k.near?12:6);i++) {
    const a=i*Math.PI/2/(k.near?12:6);profile.push([r*Math.cos(a),base+ry*Math.sin(a)]);
  }profile.push([0,base+ry]);k.lathe('roof',profile,u,v,k.near?32:16);
  // Narrow pale ribs hug the cupola; all start on the drum and meet the crown.
  for(let i=0;i<(k.near?16:8);i++) {
    const a=i*2*Math.PI/(k.near?16:8),steps=k.near?10:6;
    for(let j=0;j<steps;j++){
      const p=j*Math.PI/2/steps,q=(j+1)*Math.PI/2/steps;
      k.bar('trim',[u+Math.sin(a)*(r+.06)*Math.cos(p),base+ry*Math.sin(p),v+Math.cos(a)*(r+.06)*Math.cos(p)],[u+Math.sin(a)*(r+.06)*Math.cos(q),base+ry*Math.sin(q),v+Math.cos(a)*(r+.06)*Math.cos(q)],k.near?.17:.24,.2);
    }
  }
  k.lathe('trim',[[0,37.5],[.4,37.5],[.3,38.15],[0,38.15]],u,v,8);k.cross(u,v,38,1.8);
}
function statue(k) {
  const u=2.9,v=.12;
  // 11.2 m gilded Virgin and Child, measured from 53.5 to the 64.7 m crown.
  // An asymmetric robed silhouette, two distinct heads, supported infant and arms.
  k.lathe('gold',[[0,53.5],[1.25,53.5],[1.4,54.05],[1.17,55.1],[.96,57.6],[.72,59.0],[.83,60.2],[1.15,61.1],[1.02,61.6],[.48,62.2],[0,62.2]],u,v,k.near?12:8);
  k.sphere('gold',u,62.9,v-.04,.5,.77,.49);
  k.lathe('gold',[[0,63.45],[.52,63.45],[.42,63.85],[.1,64.7],[0,64.7]],u,v,6);
  k.sphere('gold',u-1.65,61.35,v-.55,.52,.96,.45);
  k.sphere('gold',u-1.8,62.65,v-.53,.35,.43,.35);
  k.bar('gold',[u-.45,60.2,v-.35],[u-1.9,60.55,v-.55],.5,.5);
  k.bar('gold',[u-1.9,60.55,v-.55],[u-1.65,61.3,v-.55],.45,.42);
  k.bar('gold',[u+.68,61.45,v-.1],[u+1.25,60.05,v-.3],.42,.42);
  k.bar('gold',[u+1.25,60.05,v-.3],[u+.9,59.5,v-.9],.35,.36);
  // Blessing arm of the child, with a separate outward hand.
  k.bar('gold',[u-1.85,61.8,v-.55],[u-2.45,62.25,v-.75],.23,.23);
  k.sphere('gold',u-2.53,62.35,v-.75,.15,.23,.15);
  // Broad asymmetric mantle is part of the robe, present in both LODs.
  k.sphere('gold',u+.65,57.75,v+.1,.65,3.05,.6);
  if(k.near)for(const d of [-.65,-.25,.3,.65])k.bar('gold',[u+d,54.15,v-1.0],[u+d*.6,59.0,v-.68],.16,.18);
}
