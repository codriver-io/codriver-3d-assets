import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
export const plan = (x,y,z) => new THREE.Vector3(x,y,z).applyAxisAngle(new THREE.Vector3(0,1,0),SPEC.rotation).toArray();
export function create({detail='near'}={}) {
  const near=detail==='near', trim=detail==='near'?'trim':'stone', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const put=(g,m)=>{g.rotateY(SPEC.rotation);b.put(g,m);};
  function box(m,x0,x1,y0,y1,z0,z1,omit=[]){
    const g=new THREE.BoxGeometry(x1-x0,y1-y0,z1-z0), faces=['east','west','top','bottom','south','north'];
    g.setIndex([...g.index.array].filter((_,i)=>!omit.includes(faces[Math.floor(i/6)])));
    g.translate((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);put(g,m);
  }
  function rod(m,a,c,r,segments=near?12:6){
    const av=new THREE.Vector3(...a),cv=new THREE.Vector3(...c),d=cv.clone().sub(av);
    const g=new THREE.CylinderGeometry(r,r,d.length(),segments);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()));g.translate(...av.add(cv).multiplyScalar(.5).toArray());put(g,m);
  }
  function slab(m,outline,y0,y1){
    const sh=new THREE.Shape(outline.map(([x,z])=>new THREE.Vector2(x,-z)));
    const g=new THREE.ExtrudeGeometry(sh,{depth:y1-y0,bevelEnabled:false,steps:1});g.rotateX(-Math.PI/2);g.translate(0,y0,0);put(g,m);
  }
  function quad(m,p){
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p.flat(),3));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();put(g,m);
  }
  // A true perforated facade: stone contains holes, glass is recessed into them.
  // No backing face behind the window and no depth ordering needed for windows.
  function facade(cx,z,angle,width,y0,y1,windows){
    const outer=new THREE.Shape([new THREE.Vector2(-width/2,y0),new THREE.Vector2(width/2,y0),new THREE.Vector2(width/2,y1),new THREE.Vector2(-width/2,y1)]);
    const at=(u,v,d=0)=>{const q=new THREE.Vector3(u,v,d).applyAxisAngle(new THREE.Vector3(0,1,0),angle);return [q.x+cx,q.y,q.z+z];};
    for(const [u,v,w,h,lit=false] of windows){
      const x0=u-w/2,x1=u+w/2,a=v-h/2,c=v+h/2;
      outer.holes.push(new THREE.Path([new THREE.Vector2(x0,a),new THREE.Vector2(x0,c),new THREE.Vector2(x1,c),new THREE.Vector2(x1,a)]));
      const pts=[[x0,a],[x1,a],[x1,c],[x0,c]];
      quad(lit?'glow':'glass',pts.map(([x,y])=>at(x,y,-.32)));
      // Returns close each hole, facing into its recess.
      for(let i=0;i<4;i++){const j=(i+1)%4;quad('stone',[at(...pts[i]),at(...pts[j]),at(...pts[j],-.32),at(...pts[i],-.32)]);}
      if(near){
        const framed=(a,c,r)=>rod('stone',at(...a,-.16),at(...c,-.16),r,4);
        framed([u,a],[u,c],.045); framed([x0,v],[x1,v],.04);
        framed([x0,v+h*.16],[x1,v+h*.16],.035);
        // Exterior lintels and sills, connected to facade by their inset back edges.
        const gg=new THREE.BoxGeometry(w+.35,.17,.38);gg.translate(u,c+.13,.04);gg.rotateY(angle);gg.translate(cx,0,z);put(gg,'stone');
        const gs=new THREE.BoxGeometry(w+.30,.14,.39);gs.translate(u,a-.10,.045);gs.rotateY(angle);gs.translate(cx,0,z);put(gs,'stone');
        if(v>5&&v<9&&h>3){
          const outline=Math.round(u/4.4)%2===0
            ? [[x0-.25,c+.22],[x1+.25,c+.22],[u,c+.78]]
            : Array.from({length:9},(_,i)=>{const a=Math.PI*i/8;return [u+(w/2+.25)*Math.cos(a),c+.22+.48*Math.sin(a)];});
          const sh=new THREE.Shape(outline.map(([x,y])=>new THREE.Vector2(x,y)));
          const hood=new THREE.ExtrudeGeometry(sh,{depth:.26,bevelEnabled:false});
          hood.translate(0,0,-.12);hood.rotateY(angle);hood.translate(cx,0,z);put(hood,'stone');
        }
      }
    }
    const g=new THREE.ShapeGeometry(outer);g.rotateY(angle);g.translate(cx,0,z);put(g,'stone');
  }
  const hx=SPEC.width/2, north=-14.05,south=north+SPEC.depth;
  const wins=[];
  for(let i=0;i<11;i++)for(const [v,h] of [[2.25,1.9],[7.1,3.25],[12.75,3.15]])wins.push([-22+i*4.4,v,1.55,h,i%4===1]);
  const northWins=wins.filter(w=>w[1]>4);
  // Tall center doorway, with a dark open-looking recess under the portico.
  northWins.splice(northWins.findIndex(w=>Math.abs(w[0])<.01&&w[1]===7.1),1,[0,6.8,2.2,3.8,false]);
  facade(0,south,0,SPEC.width,0,16.7,wins);
  facade(0,north,Math.PI,SPEC.width,0,16.7,northWins);
  const ends=[];for(let i=0;i<5;i++)for(const [v,h] of [[2.25,1.9],[7.1,3.25],[12.75,3.15]])ends.push([-10+i*5,v,1.5,h,i%3===1]);
  facade(hx,(north+south)/2,Math.PI/2,SPEC.depth,0,16.7,ends);
  facade(-hx,(north+south)/2,-Math.PI/2,SPEC.depth,0,16.7,ends);
  box('stone',-hx,hx,16.7,17.3,north,south,['bottom']);
  box('stone',-hx-.32,hx+.32,17.3,17.65,north-.32,south+.32,['bottom']);
  // Parapet rail and individual balusters preserve the airy roof edge at far LOD.
  function balustrade(x0,x1,z,y=18.288){
    box('stone',x0,x1,17.65,17.92,z-.21,z+.21,['bottom']);
    box('stone',x0,x1,y-.20,y,z-.22,z+.22);
    const count=Math.ceil((x1-x0)/(near?.72:1.5));
    for(let i=0;i<=count;i++)rod('stone',[x0+(x1-x0)*i/count,17.9,z],[x0+(x1-x0)*i/count,y-.18,z],near?.10:.13,near?8:4);
  }
  balustrade(-hx-.2,hx+.2,south+.1);balustrade(-hx-.2,-8.8,north-.1);balustrade(8.8,hx+.2,north-.1);
  for(const s of [-1,1]){
    box('stone',s*hx-.18,s*hx+.18,17.65,SPEC.parapetHeight,north,south);
    for(let z=north+.2;z<south;z+=near?.75:1.5)box('stone',s*hx-.20,s*hx+.20,17.92,18.10,z-.08,z+.08);
  }
  // Low hipped third-floor roof and recessed upper rooms.
  box('roof',-hx+.5,hx-.5,17.65,17.80,north+.5,south-.5,['bottom']);
  box('stone',-22.5,22.5,17.8,19.7,-10.8,8.6,['bottom','top']);
  const p=[[-22.8,19.7,-11.1],[22.8,19.7,-11.1],[22.8,19.7,8.9],[-22.8,19.7,8.9],[-20.9,SPEC.roofHeight,-9.2],[20.9,SPEC.roofHeight,-9.2],[20.9,SPEC.roofHeight,7.0],[-20.9,SPEC.roofHeight,7.0]];
  for(const face of [[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0],[4,7,6,5]])quad('roof',face.map(i=>p[i]));
  for(const x of [-20,-13,-5,4])for(const z of [-7,7]){
    box('stone',x-.9,x+.9,19.7,22.7,z-.6,z+.6,['bottom','top']);
    box('stone',x-1.05,x+1.05,22.7,23,z-.72,z+.72,['bottom']);
    if(near)box('iron',x-.65,x+.65,23,23.12,z-.3,z+.3,['bottom']);
  }
  // North portico: six tall Ionic columns (four across the front, two returns).
  const northColumns=[[-7,-24.5],[-7/3,-24.5],[7/3,-24.5],[7,-24.5],[-7,-18.6],[7,-18.6]];
  function column(x,z,y0,y1,r=.55){
    box(trim,x-r-.18,x+r+.18,y0,y0+.35,z-r-.18,z+r+.18,['bottom']);
    const g=new THREE.CylinderGeometry(r*.82,r,y1-y0-.8,near?16:8,near?3:1);g.translate(x,(y0+.35+y1-.45)/2,z);put(g,trim);
    box(trim,x-r-.25,x+r+.25,y1-.45,y1,z-r-.17,z+r+.17,['top']);
    if(near)for(const s of [-1,1]){const g=new THREE.TorusGeometry(.19,.065,4,10);g.translate(x+s*.50,y1-.27,z-.59);put(g,trim);}
  }
  box('stone',-8.2,8.2,0,3.6,-26.3,north,['bottom']);
  for(let i=0;i<(near?12:6);i++){const n=near?12:6;box('stone',-6.4,6.4,0,3.6*(i+1)/n,-27.1+3*i/n,-27.1+3*(i+1)/n,['bottom']);}
  for(const [x,z] of northColumns)column(x,z,3.6,16.7);
  box('stone',-8.55,8.55,16.7,17.4,-26.45,north,['top']);
  // Triangular pediment with proper closed sloping roof and underside.
  slab('stone',[[-8.7,-26.7],[8.7,-26.7],[8.7,north],[-8.7,north]],17.4,17.7);
  const v=[[-8.7,17.7,-26.7],[8.7,17.7,-26.7],[0,20.5,-26.7],[-8.7,17.7,north],[8.7,17.7,north],[0,20.5,north]];
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v.flat(),3));g.setIndex([0,2,1,3,4,5,0,3,2,2,3,5,2,5,1,1,5,4,0,1,3,1,4,3]);const pediment=g.toNonIndexed();pediment.computeVertexNormals();put(pediment,'stone');g.dispose();
  if(near)for(let x=-8;x<=8;x+=.62)box('stone',x-.1,x+.1,17.25,17.43,-26.85,-26.67);
  // South portico: curved platform and six columns, without a pediment.
  const ellipse=(rx,rz)=>Array.from({length:(near?32:16)+1},(_,i)=>{const a=Math.PI*i/(near?32:16);return [rx*Math.cos(a),south+rz*Math.sin(a)];});
  slab('stone',ellipse(9.4,7.3),0,3.6);
  slab('stone',ellipse(9.8,7.6),3.6,3.9);
  const southColumns=Array.from({length:6},(_,i)=>{const a=Math.PI*i/5;return [8.7*Math.cos(a),south+6.4*Math.sin(a)];});
  for(const [x,z]of southColumns)column(x,z,3.9,16.7,.53);
  slab('stone',ellipse(9.8,7.6),16.7,17.65);
  // Curved roof railing remains open, not a heavy solid cylinder.
  const seg=near?40:20, curve=ellipse(9.65,7.4);
  for(let i=0;i<curve.length-1;i++)rod('stone',[curve[i][0],18.17,curve[i][1]],[curve[i+1][0],18.17,curve[i+1][1]],.115,6);
  for(let i=0;i<=seg;i++){const a=Math.PI*i/seg;rod('stone',[9.65*Math.cos(a),17.65,south+7.4*Math.sin(a)],[9.65*Math.cos(a),18.16,south+7.4*Math.sin(a)],.105,near?8:4);}
  // West Colonnade roof, solid north/service wall and open south column rhythm.
  box('stone',-64.3,-hx,0,6.3,-3.0,-2.0,['bottom']);
  box('stone',-64.3,-hx,0,.35,-3.0,7.6,['bottom']);
  box('stone',-64.4,-hx,6.3,7,-3.1,7.7,['top']);
  box('roof',-64.2,-hx+.1,7,7.12,-2.9,7.5,['bottom']);
  for(let x=-62.5;x<-hx;x+=3.9)column(x,6.7,.35,6.3,.26);
  // Main West Wing and lower eastern office block, fitted to measured OSM bounds.
  box('stone',-109.8,-78.3,0,6.7,6.9,37.15,['bottom','top','north','south','east','west']);
  const ww=[];for(let x=-13;x<=13;x+=3.25)ww.push([x,3.8,1.35,2.45,x%6.5===0]);
  facade(-94.05,37.15,0,31.5,0,6.7,ww);facade(-94.05,6.9,Math.PI,31.5,0,6.7,ww);
  facade(-109.8,22.025,-Math.PI/2,30.25,0,6.7,ww);facade(-78.3,22.025,Math.PI/2,30.25,0,6.7,ww);
  box('stone',-110,-78.1,6.7,7.15,6.7,37.3,['bottom']);
  box('stone',-108.4,-79.9,7.15,8.5,8.4,35.6,['bottom']);
  // Mansard roof of West Wing upper floor.
  const w=[[-108.7,8.5,8.1],[-79.6,8.5,8.1],[-79.6,8.5,35.9],[-108.7,8.5,35.9],[-106.8,10,10],[-81.5,10,10],[-81.5,10,34],[-106.8,10,34]];
  for(const f of [[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0],[4,7,6,5]])quad('roof',f.map(i=>w[i]));
  box('stone',-78.3,-64.4,0,6.7,-3,35.6,['bottom','top']);box('roof',-78.5,-64.2,6.7,7,-3.2,35.8,['bottom']);
  // Oval Office bow, attached to the lower eastern office block.
  const oval=[];for(let i=0;i<= (near?24:12);i++){const a=Math.PI*i/(near?24:12);oval.push([-74.6+4.6*Math.cos(a),35.6+3*Math.sin(a)]);}
  slab('stone',oval,0,7.3);slab('roof',oval,7.3,7.65);
  // Flagpole anchored through the roof; original small flag with stripes as geometry.
  rod('iron',[0,20.8,-1],[0,26.4,-1],.055,near?8:5);
  const flagW=2.25,flagH=1.15;
  // Partition the canton/stripes rather than placing a blue overlay on them.
  // Two outward surfaces represent the front and back of a thin cloth.
  function cloth(m,x0,x1,y0,y1){
    quad(m,[[x0,y0,-.985],[x1,y0,-.985],[x1,y1,-.985],[x0,y1,-.985]]);
    quad(m,[[x1,y0,-1.015],[x0,y0,-1.015],[x0,y1,-1.015],[x1,y1,-1.015]]);
  }
  for(let i=0;i<13;i++){
    const y1=26.04-i*flagH/13,y0=26.04-(i+1)*flagH/13;
    if(i<7){cloth('blue',0,.92,y0,y1);cloth(i%2?'stone':'red',.92,flagW,y0,y1);}
    else cloth(i%2?'stone':'red',0,flagW,y0,y1);
  }
  return b.finish();
}
