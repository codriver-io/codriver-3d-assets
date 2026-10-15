import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';

// Axial frame from OSM way 5936475's north facade controls:
// [-3.7041103,40.4165332] to [-3.7034625,40.4165912].
// u east along facade, v south into block. Export rotation is already baked.
const ANGLE = .122, C=Math.cos(ANGLE), S=Math.sin(ANGLE);
export const world=(u,y,v)=>[u*C+v*S,y,-u*S+v*C];
const rect=(x0,y0,x1,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
function face(b,mat,pts,normal){
  const p=pts.map(q=>world(...q)),n=new THREE.Vector3(...world(...normal));
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p.flat(),3));
  const cross=new THREE.Vector3(...p[1]).sub(new THREE.Vector3(...p[0])).cross(new THREE.Vector3(...p[2]).sub(new THREE.Vector3(...p[0])));
  const ix=[];for(let i=1;i<p.length-1;i++)ix.push(...(cross.dot(n)>0?[0,i,i+1]:[0,i+1,i]));
  g.setIndex(ix);g.computeVertexNormals();b.put(g,mat);
}
function box(b,mat,u,y,v,w,h,d){b.box(mat,world(u,y,v),[w,h,d],ANGLE);}
function bar(b,mat,a,c,w,d=w){b.bar(mat,world(...a),world(...c),w,d);}
function cyl(b,mat,u,y,v,h,r0,r1,seg){const g=new THREE.CylinderGeometry(r1,r0,h,seg);g.translate(u,y+h/2,v);g.rotateY(ANGLE);b.put(g,mat);}
function sphere(b,mat,u,y,v,r,near,scale=[1,1,1]){const g=new THREE.SphereGeometry(r,near?10:6,near?6:3);g.scale(...scale);g.translate(u,y,v);g.rotateY(ANGLE);b.put(g,mat);}
function roof(b,x0,x1,z0,z1,y,rise,mat='roof'){
  const inset=Math.min((x1-x0)/2,(z1-z0)/2)*.85;
  const lo=[[x0,y,z0],[x1,y,z0],[x1,y,z1],[x0,y,z1]],hi=[[x0+inset,y+rise,z0+inset],[x1-inset,y+rise,z0+inset],[x1-inset,y+rise,z1-inset],[x0+inset,y+rise,z1-inset]];
  for(let i=0;i<4;i++)face(b,mat,[lo[i],lo[(i+1)%4],hi[(i+1)%4],hi[i]],[0,1,0]);
  face(b,mat,hi,[0,1,0]);
}
const ROWS=[[.8,4.8,1.65],[6.1,7.85,1.65],[9.5,14.7,1.75]];
// Every window is an actual hole in the wall, not a dark overlay on a solid box.
function bay(b,a,t,n,length,near,stoneOnly=false){
  const p=(s,y,d=0)=>[a[0]+t[0]*s+n[0]*d,y,a[1]+t[1]*s+n[1]*d];
  const holes=ROWS.map(([lo,hi,w])=>({lo,hi,x0:(length-w)/2,x1:(length+w)/2}));
  const panel=(x0,y0,x1,y1,mat)=>{if(x1-x0>.001&&y1-y0>.001)face(b,mat,rect(x0,y0,x1,y1).map(q=>p(...q)),[n[0],0,n[1]]);};
  const fill=(lo,hi)=>{
    const cuts=[lo,...[.55,5.3,5.65,8.55,8.95,15.5].filter(y=>y>lo&&y<hi),hi];
    for(let j=0;j<cuts.length-1;j++){
      const low=cuts[j],high=cuts[j+1],y=(low+high)/2;
      const stone=stoneOnly||y<.55||y>15.5||(y>5.3&&y<5.65)||(y>8.55&&y<8.95);
      if(stone)panel(0,low,length,high,'stone');
      else{panel(0,low,.38,high,'stone');panel(.38,low,length-.38,high,'brick');panel(length-.38,low,length,high,'stone');}
    }
  };
  let prev=0;
  for(const h of holes){
    fill(prev,h.lo-.24);
    panel(0,h.lo-.24,.38,h.hi+.24,'stone');panel(length-.38,h.lo-.24,length,h.hi+.24,'stone');
    panel(.38,h.lo-.24,h.x0-.24,h.hi+.24,stoneOnly?'stone':'brick');panel(h.x1+.24,h.lo-.24,length-.38,h.hi+.24,stoneOnly?'stone':'brick');
    panel(h.x0-.24,h.lo-.24,h.x1+.24,h.lo,'stone');panel(h.x0-.24,h.hi,h.x1+.24,h.hi+.24,'stone');
    panel(h.x0-.24,h.lo,h.x0,h.hi,'stone');panel(h.x1,h.lo,h.x1+.24,h.hi,'stone');
    prev=h.hi+.24;
  }
  fill(prev,17);
  for(const h of holes){
    const r=rect(h.x0,h.lo,h.x1,h.hi),depth=near?.36:0;
    face(b,'glass',r.map(q=>p(...q,-depth)),[n[0],0,n[1]]);
    for(let i=0;near&&i<4;i++)face(b,'stone',[p(...r[i]),p(...r[(i+1)%4]),p(...r[(i+1)%4],-depth),p(...r[i],-depth)],[t[0]*(length/2-(r[i][0]+r[(i+1)%4][0])/2),8-(r[i][1]+r[(i+1)%4][1])/2,t[1]*(length/2-(r[i][0]+r[(i+1)%4][0])/2)]);
    if(near){
      bar(b,'iron',p(length/2,h.lo,-.18),p(length/2,h.hi,-.18),.065);
      bar(b,'iron',p(h.x0,(h.lo+h.hi)/2,-.18),p(h.x1,(h.lo+h.hi)/2,-.18),.065);
      if(h.lo>9){ // Juliet rails touch the sill and their end posts.
        const z=.35;bar(b,'iron',p(h.x0,h.lo+.85,z),p(h.x1,h.lo+.85,z),.065);
        for(let k=0;k<=6;k++){const s=h.x0+(h.x1-h.x0)*k/6;bar(b,'iron',p(s,h.lo,.25),p(s,h.lo+.85,z),.045);}
        bar(b,'stone',p(h.x0-.2,h.lo-.08,.18),p(h.x1+.2,h.lo-.08,.18),.28,.5);
      }
    }
  }
}
function polygonWall(b,outer,holes,v,near){
  const all=[outer,...holes].flat(),tri=THREE.ShapeUtils.triangulateShape(outer.map(q=>new THREE.Vector2(...q)),holes.map(r=>r.map(q=>new THREE.Vector2(...q))));
  for(const ids of tri)face(b,'stone',ids.map(i=>[all[i][0],all[i][1],v]),[0,0,-1]);
  for(const r of holes){face(b,'glass',r.map(([u,y])=>[u,y,v-.0+.5]),[0,0,-1]);
    for(let i=0;i<r.length;i++){const a=r[i],c=r[(i+1)%r.length];face(b,'stone',[[...a,v],[...c,v],[...c,v+.5],[...a,v+.5]],[0,0,-1]);}
  }
}
function clock(b,u,v,y,side,near){
  const n=[Math.sin(side),-Math.cos(side)],t=[Math.cos(side),Math.sin(side)],p=(s,h,d)=>[u+t[0]*s+n[0]*d,h,v+t[1]*s+n[1]*d];
  const g=new THREE.CircleGeometry(1.35,near?40:20);g.rotateY(Math.PI-side);g.translate(u+n[0]*2.7,y,v+n[1]*2.7);g.rotateY(ANGLE);b.put(g,'clock');
  for(let i=0;i<12;i++){const a=i*Math.PI/6;bar(b,'iron',p(Math.sin(a)*1.06,y+Math.cos(a)*1.06,2.85),p(Math.sin(a)*1.2,y+Math.cos(a)*1.2,2.85),near?.075:.11);}
  bar(b,'iron',p(0,y,2.9),p(-.72,y+.42,2.9),.09);bar(b,'iron',p(0,y,2.9),p(.2,y+.98,2.9),.075);
}
export function create({detail='near'}={}){
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  // Main rectangular ranges fitted inside the mapped rounded-corner outline.
  const x0=-32.35,x1=36.6,z0=-17.9,z1=31.7,centre=2.25;
  const exterior=[[[x0,z0],[1,0],[0,-1],x1-x0],[[x1,z0],[0,1],[1,0],z1-z0],[[x1,z1],[-1,0],[0,1],x1-x0],[[x0,z1],[0,-1],[-1,0],z1-z0]];
  for(let f=0;f<exterior.length;f++){
    const [a,t,n,len]=exterior[f],count=f===0?15:f%2?(near?11:8):(near?15:11),step=len/count;
    for(let i=0;i<count;i++){
      const aa=[a[0]+t[0]*i*step,a[1]+t[1]*i*step];
      if(f===0&&i>=6&&i<=8)continue;
      bay(b,aa,t,n,step,near,f%2===1&&i%5===0);
    }
    for(const [y,h,d] of [[5.45,.28,.35],[8.75,.38,.45],[16.65,.55,.65],[17.12,.35,.9]]){
      const mid=[a[0]+t[0]*len/2+n[0]*.12,y,a[1]+t[1]*len/2+n[1]*.12];
      box(b,'stone',...mid,f%2?d:len,h,f%2?len:d);
    }
    // Brick inset parapet panels, separated stone posts, no stacked material faces.
    const countP=f%2?15:21;
    for(let i=0;i<countP;i++){
      const s=(i+.5)*len/countP,w=len/countP;
      box(b,'brick',a[0]+t[0]*s,17.9,a[1]+t[1]*s,f%2?.55:w-.45,1.1,f%2?w-.45:.55);
      box(b,'stone',a[0]+t[0]*(i*len/countP),17.9,a[1]+t[1]*(i*len/countP),f%2?.75:.45,1.1,f%2?.45:.75);
    }
    box(b,'stone',a[0]+t[0]*len/2,18.5,a[1]+t[1]*len/2,f%2?.8:len,.22,f%2?len:.8);
  }
  // Modern covered double courtyard: low glazed hip shell and visible central division.
  for(const [a,t,n,len] of [[[-18.5,-4.2],[1,0],[0,1],41.1],[[22.6,-4.2],[0,1],[-1,0],22.5],[[22.6,18.3],[-1,0],[0,-1],41.1],[[-18.5,18.3],[0,-1],[1,0],22.5]]){
    const count=near?Math.round(len/4.1):Math.ceil(len/6.8);for(let i=0;i<count;i++)bay(b,[a[0]+t[0]*i*len/count,a[1]+t[1]*i*len/count],t,n,len/count,near,true);
  }
  roof(b,x0,x1,z0,-4.2,17.3,1.5);roof(b,x0,x1,18.3,z1,17.3,1.5);
  roof(b,x0,-18.5,-4.2,18.3,17.3,1.5);roof(b,22.6,x1,-4.2,18.3,17.3,1.5);
  roof(b,-18.5,22.6,-4.2,18.3,14.9,1.2,'glass');
  box(b,'stone',2.25,15.3,7.05,2.1,1.2,22.5);
  if(near)for(let u=-17.5;u<22;u+=2.05)bar(b,'iron',[u,15,-4.2],[u,15,18.3],.07);
  // Three-bay projecting granite portal, monumental balcony and triangular heraldic pediment.
  const left=x0+6*(x1-x0)/15,right=x0+9*(x1-x0)/15,front=-18.2;
  const arch=[[centre-1.6,.15],[centre+1.6,.15],[centre+1.6,4.0]];
  for(let i=1;i<=16;i++){const a=i*Math.PI/16;arch.push([centre+1.6*Math.cos(a),4+1.6*Math.sin(a)]);}
  const holes=[arch];for(const u of [centre-4.3,centre+4.3])holes.push(rect(u-.8,.8,u+.8,4.8),rect(u-.8,6.1,u+.8,7.85));
  for(const u of [centre-4.3,centre,centre+4.3])holes.push(rect(u-.95,9.4,u+.95,14.7));
  polygonWall(b,rect(left,0,right,17.25),holes,front,near);
  for(const u of [left,right])box(b,'stone',u,8.5,-18.2,.45,17,1);
  // Three upper lintels with sculpted keystones.
  for(const u of [centre-4.3,centre,centre+4.3]){box(b,'stone',u,15.25,-18.4,2.4,.35,.5);if(near){sphere(b,'stone',u,15.55,-18.45,.28,near,[2,1,.5]);}}
  if(near){for(let y=.6;y<8.4;y+=.43)for(const u of [centre-2.1,centre+2.1])box(b,'stone',u,y,-18.36,.58,.12,.3);}
  box(b,'stone',centre,8.8,-18.65,12.8,.5,2.3);
  for(const u of [centre-4.7,centre+4.7]){bar(b,'stone',[u,8.1,-18.1],[u,8.65,-19.3],.6);sphere(b,'stone',u,8.05,-18.3,.35,near);}
  for(const v of [-19.7,-17.8]){bar(b,'iron',[left,9.9,v],[right,9.9,v],.08);for(let i=0;i<= (near?48:24);i++){const u=left+(right-left)*i/(near?48:24);bar(b,'iron',[u,9,v],[u,9.9,v],near?.04:.065);}}
  for(const u of [left,right])bar(b,'iron',[u,9.9,-19.7],[u,9.9,-17.8],.08);
  face(b,'stone',[[left-.4,17.25,-18.55],[right+.4,17.25,-18.55],[centre,20.5,-18.55]],[0,0,-1]);
  for(const u of [left-.4,right+.4])bar(b,'stone',[u,17.25,-18.65],[centre,20.5,-18.65],.35,.5);
  bar(b,'stone',[left-.6,17.2,-18.65],[right+.6,17.2,-18.65],.4,.5);
  // Original abstract royal arms: shield, crown, paired reclining heraldic figures.
  sphere(b,'stone',centre,18.25,-18.75,.68,near,[.85,1.1,.32]);
  for(const s of [-1,1]){sphere(b,'stone',centre+s*2.4,17.9,-18.78,.34,near,[1,1,.65]);bar(b,'stone',[centre+s*1.0,17.5,-18.8],[centre+s*2.35,17.65,-18.8],.48);bar(b,'stone',[centre+s*2.35,17.65,-18.8],[centre+s*3.1,17.4,-18.8],.32);}
  box(b,'stone',centre,19.15,-18.7,1.0,.28,.4);
  // Clock shoulders and tall square tower. Brick panels are cut into exposed stone wall faces.

  const tower=(x0,x1,y0,y1,z0,z1,clockBand=false)=>{
    for(const [a,t,n,len] of [[[x0,z0],[1,0],[0,-1],x1-x0],[[x1,z0],[0,1],[1,0],z1-z0],[[x1,z1],[-1,0],[0,1],x1-x0],[[x0,z1],[0,-1],[-1,0],z1-z0]]){
      const p=(s,y)=>[a[0]+t[0]*s,y,a[1]+t[1]*s];
      const xx=clockBand?[0,1,len-1,len]:[0,.65,len-.65,len],yy=clockBand?[y0,21.4,22.4,23.9,27.1,y1]:[y0,y0+1.3,y1-1.3,y1];
      for(let i=0;i<3;i++)for(let j=0;j<yy.length-1;j++)face(b,i===1&&(clockBand?(j===1||j===3):j===1)?'brick':'stone',[p(xx[i],yy[j]),p(xx[i+1],yy[j]),p(xx[i+1],yy[j+1]),p(xx[i],yy[j+1])],[n[0],0,n[1]]);
    }
    face(b,'stone',[[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]],[0,1,0]);
  };
  for(const [a,c] of [[centre-6.5,centre-2.5],[centre+2.5,centre+6.5]])tower(a,c,18.7,22.7,-17.9,-10.7);
  // Clock tower starts above shoulders; front panel is shallower, matching the stone pedestal.
  tower(centre-2.5,centre+2.5,18.7,28.2,-18.0,-13.0,true);
  // Horizontal quoin courses stay stone-on-stone, avoiding cross-material depth cycles.
  if(near)for(let y=23;y<28.2;y+=.55)for(const u of [centre-2.25,centre+2.25])box(b,'stone',u,y,-18.05,.5,.1,.25);
  for(const side of [0,Math.PI/2,Math.PI,3*Math.PI/2])clock(b,centre,-15.5,25.65,side,near);
  box(b,'stone',centre,28.35,-15.5,5.6,.3,5.6);
  // Tiny four pediments around open octagonal belfry, never a solid dark tower cap.
  for(let i=0;i<4;i++){const a=i*Math.PI/2,n=[Math.sin(a),-Math.cos(a)],t=[Math.cos(a),Math.sin(a)];const p=(s,y)=>[centre+n[0]*2.7+t[0]*s,y,-15.5+n[1]*2.7+t[1]*s];face(b,'stone',[p(-2.7,28.5),p(2.7,28.5),p(0,29.5)],[n[0],0,n[1]]);}
  cyl(b,'iron',centre,28.6,-15.5,.3,1.92,1.92,8);
  for(let i=0;i<8;i++){const a=(i*45+22.5)*Math.PI/180,u=centre+1.75*Math.cos(a),v=-15.5+1.75*Math.sin(a);bar(b,'iron',[u,28.7,v],[u,32,v],near?.11:.17);}
  cyl(b,'iron',centre,31.9,-15.5,.3,1.92,1.92,8);
  const cap=new THREE.LatheGeometry([[1.92,0],[1.85,.45],[1.5,.95],[.9,1.25],[0,1.4]].map(p=>new THREE.Vector2(...p)),near?16:8);cap.translate(centre,32.2,-15.5);cap.rotateY(ANGLE);b.put(cap,'iron');
  bar(b,'iron',[centre,29,-15.5],[centre,33.5,-15.5],.09);
  cyl(b,'gold',centre,30.1,-15.5,.8,.65,.3,near?14:8); // suspended bell, flared mouth down
  sphere(b,'gold',centre,29.9,-15.5,.35,near); // New Year's ball on its central guide
  bar(b,'iron',[centre,33.25,-15.5],[centre,34.6,-15.5],.06);
  if(near)bar(b,'iron',[centre-.45,34.15,-15.5],[centre+.45,34.15,-15.5],.05);
  // Km 0 plaque is a tiny flush bronze/stone insert, without owning plaza pavement.
  face(b,'gold',[[centre-.42,.04,-20.6],[centre+.42,.04,-20.6],[centre+.42,.04,-20.1],[centre-.42,.04,-20.1]],[0,1,0]);
  const group=b.finish();
  group.traverse(o=>{if(o.isMesh){const old=o.geometry;o.geometry=mergeVertices(old,1e-4);old.dispose();}});
  return group;
}
