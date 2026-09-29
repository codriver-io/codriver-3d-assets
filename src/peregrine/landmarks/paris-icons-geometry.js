import { PARIS_BUILDING_FRAMES, applyParisBuildingFrame } from './paris-building-placement.js';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { architecture } from './paris-architecture.js';

// Original, texture-free architectural studies. Coordinates are metres in an
// east/up/south tangent frame; y=0 is the local foundation plane, not sea level.
export const PARIS_ICONS = Object.freeze([
  { id:'paris-tour-eiffel', name:'Tour Eiffel', ...PARIS_BUILDING_FRAMES['paris-tour-eiffel'], footprint:[125,125], height:330, pad:68,
    palette:{iron:'#765b43',trim:'#9b7955',glass:'#5b7378',stone:'#aaa99d',roof:'#a98b62',gold:'#cba445'} },
  { id:'paris-arc-de-triomphe', name:'Arc de Triomphe', ...PARIS_BUILDING_FRAMES['paris-arc-de-triomphe'], footprint:[44.8,22.2], height:50, pad:27,
    palette:{stone:'#d8ceb7',trim:'#e4d8c3',relief:'#b7ae9a',roof:'#bcb5a6',glass:'#77756e'} },
  { id:'paris-notre-dame', name:'Notre-Dame de Paris', ...PARIS_BUILDING_FRAMES['paris-notre-dame'], footprint:[48,127], height:96, pad:69,
    palette:{stone:'#c8c0ae',trim:'#e0d5c2',roof:'#63636a',glass:'#353b47',iron:'#6d6a64',relief:'#a89e8a'} },
  { id:'paris-sacre-coeur', name:'Sacré-Cœur', ...PARIS_BUILDING_FRAMES['paris-sacre-coeur'], footprint:[75,85], height:84, pad:48,
    palette:{stone:'#e8e7dd',trim:'#f4f1e8',roof:'#dadbd4',glass:'#596570',relief:'#d1cfc4',bronze:'#63877d',gold:'#cfb985'} },
  { id:'paris-invalides', name:'Dôme des Invalides', ...PARIS_BUILDING_FRAMES['paris-invalides'], footprint:[58,70], height:107, pad:38,
    palette:{stone:'#d2c5aa',trim:'#ead9b9',roof:'#788073',glass:'#526270',gold:'#cda637',relief:'#ae9b79'} },
]);
export const PARIS_ICON_BY_ID=Object.fromEntries(PARIS_ICONS.map(v=>[v.id,v]));

function builder(spec, detail) {
  const near=detail==='near', batches=new Map(), palette=spec.palette;
  const root=new THREE.Group();root.name=spec.name;root.userData={id:spec.id,detail,units:'metres',origin:spec.origin,provenance:'Original Codriver-commissioned procedural model'};
  const add=(g,m)=>{g.deleteAttribute('uv');if(!g.index)g.setIndex(Array.from({length:g.attributes.position.count},(_,i)=>i));if(!batches.has(m))batches.set(m,[]);batches.get(m).push(g);};
  const box=(m,x,y,z,w,h,d)=>{const g=new THREE.BoxGeometry(w,h,d);g.translate(x,y,z);add(g,m);};
  const beam=(m,a,c,r=.35,sides=near?6:4,openEnded=false)=>{const av=new THREE.Vector3(...a),cv=new THREE.Vector3(...c),v=cv.clone().sub(av);if(v.length()<.01)return;const g=new THREE.CylinderGeometry(r,r,v.length(),sides,1,openEnded);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.clone().normalize()));g.translate(...av.add(cv).multiplyScalar(.5).toArray());add(g,m);};
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
  const finish=()=>{for(const [name,geoms] of batches){const g=mergeGeometries(geoms);geoms.forEach(v=>v.dispose());const mat=new THREE.MeshStandardMaterial({color:palette[name]||'#aaaaaa',roughness:name==='gold'?.48:.86,metalness:name==='gold'?.72:name==='iron'?.42:0,side:THREE.DoubleSide});mat.name=name;const mesh=new THREE.Mesh(g,mat);mesh.name=name;root.add(mesh);}return applyParisBuildingFrame(root,spec.id);};
  return {near,box,beam,cylinder,disk,sphere,cone,roof,arc,archBand,archCap,finish,detail:architecture(add,near)};
}

function eiffel(b) {
  const {near,box,cylinder}=b;
  // Four-sided structural sections keep the dense lattice inexpensive.
  const beam=(m,a,c,r)=>b.beam(m,a,c,r,4,true);
  // Official 125 m base / 25 m piers, floors 57 / 115 / 276 m, 330 m tip.
  // Curved chord stations and secondary lattice proportions are photo estimates.
  const corners=[[-1,-1],[1,-1],[1,1],[-1,1]];
  const lerp=(a,c,t)=>a.map((v,i)=>v+(c[i]-v)*t);
  function panel(a,c,d,e,r,subdivisions){
    beam('iron',a,d,r);beam('iron',a,c,r*.65);
    for(let k=0;k<subdivisions;k++){
      const q=k/subdivisions,t=(k+1)/subdivisions;
      const l=lerp(a,d,q),rr=lerp(c,e,q),u=lerp(a,d,t),v=lerp(c,e,t);
      beam('iron',l,v,r*.42);beam('iron',rr,u,r*.42);
      beam('trim',u,v,r*.38);
      if(near){
        // Secondary diamond web inside each main structural panel.
        const mid=lerp(l,v,.5),top=lerp(u,v,.5),bottom=lerp(l,rr,.5);
        beam('iron',bottom,top,r*.23);
        for(const point of [lerp(l,u,.5),lerp(rr,v,.5)])beam('trim',point,mid,r*.20);
        for(const point of [l,rr])box('iron',...point,r*1.8,r*2,r*1.8);
      }
    }
  }
  const stations=[[2,50,11.5],[15,44,10],[30,37.3,8.4],[44,31.8,7.1],[57,27,6.1],[73,22.7,5.1],[94,18.5,4.3],[115,15,3.5]];
  for(const sx of [-1,1])for(const sz of [-1,1]){
    box('stone',sx*50,1,sz*50,25,2,25);
    for(let k=1;k<stations.length;k++){
      const [y,c,w]=stations[k-1],[yy,cc,ww]=stations[k];
      const p=(j,hi)=>{const [u,v]=corners[j];return hi?[sx*cc+u*ww,yy,sz*cc+v*ww]:[sx*c+u*w,y,sz*c+v*w];};
      for(let j=0;j<4;j++)panel(p(j,false),p((j+1)%4,false),p(j,true),p((j+1)%4,true),near?.52:.65,near?3:1);
      // Paired inclined lift rails, with landings inside the four piers.
      if(near)for(const offset of [-1.1,1.1])beam('roof',[sx*c+offset,y,sz*c],[sx*cc+offset,yy,sz*cc],.24);
    }
  }
  const shaft=[[115,18.5],[132,15.5],[151,12.7],[171,10.5],[194,8.6],[219,6.8],[245,5.2],[276,4.1]];
  for(let k=1;k<shaft.length;k++){
    const [y,w]=shaft[k-1],[yy,ww]=shaft[k];
    for(let j=0;j<4;j++){
      const [x,z]=corners[j],[u,v]=corners[(j+1)%4];
      panel([x*w,y,z*w],[u*w,y,v*w],[x*ww,yy,z*ww],[u*ww,yy,v*ww],.42,near?Math.ceil((yy-y)/5.5):2);
    }
  }
  // Central lifts are a slim separate run, rather than an opaque solid shaft.
  for(const x of [-1.25,1.25])for(const z of [-1.25,1.25])beam('roof',[x,116,z],[x,274,z],near?.22:.30);
  for(const [y,w,band,depth] of [[57,70,7,6],[115,40,5,4.5],[276,18,4,2.5]]){
    for(let face=0;face<4;face++){
      const p=(u,h,d=0)=>face===0?[u,h,w/2+d]:face===1?[-u,h,-w/2-d]:face===2?[w/2+d,h,-u]:[-w/2-d,h,u];
      const alongX=face<2;
      box('iron',...p(0,y),alongX?w:band,1,alongX?band:w);
      for(const h of [y-depth,y-.5,y+2])beam('trim',p(-w/2,h),p(w/2,h),.32);
      const n=Math.round(w/(near?2:5));
      for(let i=0;i<n;i++){
        const u=-w/2+i*w/n,v=u+w/n;
        beam('iron',p(u,y-depth),p(v,y-.5),.18);
        beam('iron',p(u,y-.5),p(v,y-depth),.18);
        beam('iron',p(u,y+.4),p(u,y+2),.095);
        if(near)beam('trim',p(u,y+1.2),p(v,y+1.2),.075);
      }
      // Glazed restaurant / observation strips inset behind the balustrade.
      if(y<276){
        const d=-band*.5;
        box('glass',...p(0,y+2.4,d),alongX?w-13:2.8,2.8,alongX?2.8:w-13);
        for(let u=-w/2+7;u<w/2-6;u+=near?2.5:6)beam('trim',p(u,y+1,d-1.5),p(u,y+3.8,d-1.5),.10);
        beam('iron',p(-w/2+5,y+4,-1.5),p(w/2-5,y+4,-1.5),.38);
      }
    }
  }
  // Four broad arches, curved with the legs, with a spandrel web up to floor one.
  for(let face=0;face<4;face++){
    const n=near?48:20,point=(t,offset=0)=>{
      const u=38*Math.cos(t),y=14+36*Math.sin(t)+offset,d=50-(y-2)*.40;
      return face===0?[u,y,d]:face===1?[u,y,-d]:face===2?[d,y,u]:[-d,y,u];
    };
    for(let i=0;i<n;i++){
      const t=Math.PI*i/n,q=Math.PI*(i+1)/n;
      beam('iron',point(t),point(q),.65);beam('iron',point(t,2),point(q,2),.34);
      beam('trim',point(t),point(q,2),.17);
      if(near&&i%2===0){const p=point(t,2),top=point(t,54-p[1]+2);beam('iron',p,top,.19);}
    }
  }
  // Two-storey summit gallery and the narrowing lattice crown below radio aerials.
  for(const y of [276,280]){
    box('glass',0,y+1.4,0,11.8,2.8,11.8);box('iron',0,y+3,0,14,.55,14);
    for(const side of [-1,1])for(let u=-5;u<=5;u+=near?1.25:2.5){box('trim',u,y+1.4,side*6,.12,2.8,.15);box('trim',side*6,y+1.4,u,.15,2.8,.12);}
  }
  for(let y=284;y<301;y+=3.4){const w=4.5-(y-284)*.17,ww=w-.58;
    for(let j=0;j<4;j++){const [x,z]=corners[j],[u,v]=corners[(j+1)%4];panel([x*w,y,z*w],[u*w,y,v*w],[x*ww,y+3.4,z*ww],[u*ww,y+3.4,v*ww],.24,1);}}
  cylinder('iron',0,307,0,1.7,1,13);cylinder('trim',0,321.5,0,.65,.22,17);
  for(const y of [303,307,311,315,320])cylinder('roof',0,y,0,y<314?2.3:1.1,y<314?2.3:1.1,.38,near?16:8);
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
  for(const sign of [-1,1]){
    const z=sign*11.38;
    for(const y of [32.9,34.1,38.8,41.2,48.4])box('trim',0,y,z,44.6,.32,.35);
    for(const x of [-15.3,15.3]){
      for(const dx of [-4.4,4.4])box('trim',x+dx,13,z,.25,14,.4);
      for(const y of [6,20])box('trim',x,y,z,9,.35,.4);
      if(near)for(let i=0;i<5;i++){
        const u=x-3+i*1.5,base=7+(i%2)*1.7;
        b.cylinder('relief',u,base+2,z+sign*.4,.45,.7,4,7);
        b.sphere('trim',u,base+4.7,z+sign*.5,.48,.58,.26,8);
        beam('relief',[u,base+3.5,z+sign*.4],[u+1,base+2,z+sign*.4],.26);
      }
    }
    if(near)for(let y=3;y<32;y+=1.7)for(const x of [-15.3,15.3])box('relief',x,y,z,14.1,.055,.035);
  }
  if(near)for(const z of [-11.2,11.2]){for(let x=-16;x<=16;x+=3.2)box('relief',x,45.5,z,2.1,3.5,.4);for(let x=-21;x<=21;x+=3)box('trim',x,49.6,z,.6,1.2,.7);}
}

function notreDame(b){
  const {near,box,beam,cylinder,disk,cone,roof,arc,archCap}=b, a=b.detail;
  // Official plan: 43.5m west facade; 69m towers; 9.7m west rose;
  // 13.1m transept roses; 127m length. Wall thicknesses remain estimates.
  box('stone',0,7.5,-1,40,15,102);
  box('stone',0,24,-1,17,18,104);
  roof('roof',0,33,-1,18,104,10);
  for(const x of [-14,14])roof('roof',x,15,-1,12,101,5);
  cylinder('stone',0,8,-49,20,20,16,near?32:16);
  cylinder('stone',0,24,-49,9,9,18,near?24:16);
  a.dome('roof',0,33,-49,9,10);
  box('stone',0,17,-5,48,34,14);roof('roof',0,34,-5,48,15,9);
  // Western gallery and portal wall; belfries above it have actual openings.
  box('stone',0,22.5,51,43.5,45,20);
  for(const x of [-15.3,15.3]){
    const w=12.9;
    for(const u of [-w/2+.6,w/2-.6])for(const z of [41.5,60.5])box('stone',x+u,56.5,z,1.2,23,1.2);
    for(const z of [41.2,60.8]){
      for(const u of [-5.6,0,5.6])box('stone',x+u,53.5,z,u===0?1.1:1.6,17,1.1);
      for(const u of [-2.8,2.8])archCap('stone',x+u,57,z,2.25,5.8,67,1.2);
    }
    for(const side of [-1,1]){
      const xx=x+side*w/2;
      box('stone',xx,64.5,51,1.1,5,20);
      for(const z of [43,51,59])box('stone',xx,53.5,z,1.1,17,1.2);
      for(const z of [47,55])a.arch('trim',xx,57,z,6.7,5.3,.5,1.1,Math.PI/2);
    }
    box('trim',x,68,51,14,1.3,21.4);
    a.balustrade('stone',x,67.7,61.7,13);
    a.balustrade('stone',x,67.7,40.3,13);
  }
  for(const x of [-14,0,14]){
    a.window(x,1,61.12,x===0?8:7,15,{pointed:true,stone:'trim'});
    for(let ring=0;ring<(near?4:2);ring++){
      const r=(x===0?4:3.5)+ring*.48;
      for(const side of [-1,1])beam('trim',[x+side*r,1,61.4+ring*.12],[x+side*r,9,61.4+ring*.12],.16);
      // Two curved pointed archivolts meeting over each door.
      for(const side of [-1,1])for(let j=0;j<8;j++){
        const point=t=>[x+side*r*(1-t*t),9+(6+ring*.25)*t,61.4+ring*.12];beam('trim',point(j/8),point((j+1)/8),.16);
      }
    }
  }
  box('trim',0,18.8,61.3,43.5,1,1.1);box('trim',0,24.1,61.3,43.5,1,1.1);
  // Gallery of kings: sculptural bays, not a featureless horizontal band.
  for(let i=0;i<28;i++){
    const x=-20.2+i*40.4/27;box('glass',x,21.4,61.15,1.0,3.8,.12);
    if(near){cylinder('trim',x,21,61.5,.27,.38,2.4,6);b.sphere('trim',x,22.5,61.5,.32,.37,.3,8);}
  }
  function rose(x,y,z,r,yaw=0){
    const p=(u,v,d)=>[x+u*Math.cos(yaw)+d*Math.sin(yaw),y+v,z-u*Math.sin(yaw)+d*Math.cos(yaw)];
    const g=new THREE.CylinderGeometry(r,r,.18,near?48:24);g.rotateX(Math.PI/2);a.place(g,'glass',x,y,z,yaw);
    for(const rr of [r,r*.38])for(let i=0;i<(near?40:20);i++){
      const t=i*2*Math.PI/(near?40:20),q=(i+1)*2*Math.PI/(near?40:20);
      beam('trim',p(rr*Math.cos(t),rr*Math.sin(t),.2),p(rr*Math.cos(q),rr*Math.sin(q),.2),rr===r?.28:.16);
    }
    for(let i=0;i<(near?16:8);i++){const t=i*Math.PI*2/(near?16:8);beam('trim',p(r*.12*Math.cos(t),r*.12*Math.sin(t),.25),p(r*.94*Math.cos(t),r*.94*Math.sin(t),.25),.10);}
  }
  rose(0,31.5,61.25,4.85);
  for(const x of [-15.3,15.3])for(const u of [-2.8,2.8])a.window(x+u,27,61.18,3.4,10,{pointed:true,stone:'trim'});
  for(const y of [38.8,44.3])box('trim',0,y,61.4,44.2,.8,1.2);
  for(let x=-20;x<=20;x+=2.2){a.column('trim',x,39.3,61.55,.19,4.4);a.arch('trim',x+1.1,42.5,61.4,1.8,1.1,.18,.25);}
  for(const side of [-1,1]){
    rose(side*24.1,23,-5,6.55,side*Math.PI/2);
    for(let z=-39;z<=31;z+=8){
      a.window(side*8.61,24,z,3.8,7.2,{yaw:side*Math.PI/2,pointed:true,stone:'trim'});
      a.window(side*20.1,3,z,3,9,{yaw:side*Math.PI/2,pointed:true,stone:'trim'});
      box('stone',side*23.7,8,z,2.1,16,2.3);
      cone('trim',side*23.7,23,z,1.3,7,4);
      // Two tiers of flyers attach the aisle buttress to the nave wall.
      for(const [lo,hi] of [[15,25],[19,31]])beam('trim',[side*23.7,lo,z],[side*8.9,hi,z],near?.42:.6);
    }
  }
  for(let i=0;i<9;i++){
    const t=Math.PI+i*Math.PI/8,x=23*Math.cos(t),z=-49+23*Math.sin(t);
    box('stone',x,7,z,2,14,2);cone('trim',x,19,z,1.2,6,4);
    beam('trim',[x,16,z],[9*Math.cos(t),29,-49+9*Math.sin(t)],.5);
  }
  cylinder('roof',0,51,-5,4.2,3.5,16,8);
  for(let i=0;i<8;i++){const t=i*Math.PI/4;beam('trim',[4*Math.cos(t),43,-5+4*Math.sin(t)],[2.8*Math.cos(t),59,-5+2.8*Math.sin(t)],.22);}
  cone('roof',0,75,-5,3.8,36,8);beam('iron',[0,93,-5],[0,96,-5],.18);
  if(near)for(let z=-42;z<41;z+=3)beam('iron',[-.4,43,z],[.4,43,z],.1);
}

function sacreCoeur(b){
  const {near,box,beam,cylinder,cone,roof,archCap}=b,a=b.detail;
  box('stone',0,11,-6,42,22,68);box('stone',0,12,-9,56,24,24);
  cylinder('stone',0,11,-36,16,16,22,near?32:16);
  a.dome('roof',0,22,-36,16,12);
  // Tall, tapering Romano-Byzantine cupola; four smaller domes at corners.
  for(const [x,z,r,base,h] of [[0,-8,14,36,40],[-18,-21,6.5,27,13],[18,-21,6.5,27,13],[-18,16,6.5,27,13],[18,16,6.5,27,13]]){
    cylinder('stone',x,base-5,z,r,r,10,near?32:16);
    for(let i=0;i<(r>10?16:8);i++){
      const t=i*Math.PI*2/(r>10?16:8),xx=x+(r+.02)*Math.sin(t),zz=z+(r+.02)*Math.cos(t);
      a.window(xx,base-8,zz,r>10?2.0:1.2,5.5,{yaw:t,stone:'trim'});
    }
    cylinder('trim',x,base+.3,z,r+.65,r+.65,.6,near?32:16);
    a.dome('roof',x,base+.6,z,r,h,{ribs:near?12:8,ribMaterial:'trim',profile:[[1,0],[1,.08],[.94,.28],[.77,.52],[.53,.73],[.25,.91],[0,1]]});
    cylinder('stone',x,base+h+1.8,z,1.4,1.4,2.6,near?12:8);
    cone('roof',x,base+h+4,z,1.7,2,near?12:8);
    beam('trim',[x,base+h+5,z],[x,base+h+7,z],.13);beam('trim',[x-.65,base+h+6.3,z],[x+.65,base+h+6.3,z],.12);
  }
  // Central campanile behind the apse, with twin open belfry windows.
  box('stone',0,29,-42,13,58,13);
  for(const y of [24,43,58,67])box('trim',0,y,-42,14.2,1.3,14.2);
  for(let side=0;side<4;side++){
    const t=side*Math.PI/2;
    for(const u of [-2.5,2.5])a.window(u*Math.cos(t)+6.6*Math.sin(t),49,-42-u*Math.sin(t)+6.6*Math.cos(t),3,14,{yaw:t,stone:'trim'});
  }
  box('stone',0,64,-42,12,12,12);a.dome('roof',0,70,-42,7,11);beam('trim',[0,81,-42],[0,84,-42],.18);
  // Raised west/south-facing frontispiece, with Christ niche and small turrets.
  box('stone',0,13,27,42,26,9);box('stone',0,34,27,14,16,9);
  for(const side of [-1,1]){box('stone',side*14,29,27,14,6,9);roof('stone',side*14,32,27,14,10,4);}
  roof('stone',0,42,27,15,10,7);
  for(const y of [20,26,32])box('trim',0,y,31.8,42,.5,.55);
  if(near)for(const x of [-19,-10,10,19])a.column('trim',x,20,32,.38,12);
  a.window(0,29,31.65,7,14,{stone:'trim'});
  cylinder('trim',0,34.5,32,1,1.3,6,10);b.sphere('trim',0,38.2,32,1,1.15,.75,12);
  beam('trim',[0,36.2,32],[2,38,32],.3);
  for(const x of [-13,13])a.window(x,23,31.7,6,9,{stone:'trim'});
  for(const x of [-21,21]){
    cylinder('stone',x,26,27,3.5,3.5,17,8);a.dome('roof',x,34.5,27,3.6,7);
    for(const dx of [-1.5,1.5])a.window(x+dx,29,30.4,1.2,4,{stone:'trim'});
  }
  // Three genuinely open portico arches in front of recessed doors.
  for(const x of [-14,0,14]){
    a.window(x,.8,31.7,7,12,{stone:'trim'});
    archCap('stone',x,8,39,5.3,6,16.2,5.2);
  }
  for(const x of [-20.5,-7,7,20.5]){
    box('stone',x,7.8,39,2.6,15.6,5.2);
    for(const dx of [-1.25,1.25])a.column('trim',x+dx,0,41.8,.34,8.2);
  }
  for(const y of [15.8,17.2])box('trim',0,y,39,45,1,7);
  // Original low-polygon equestrian silhouettes on the two porch plinths.
  for(const x of [-17,17]){
    box('trim',x,18.2,39,5.5,1.4,4);
    b.sphere('bronze',x,21,39,2.1,.85,.7,near?12:8);
    for(const dx of [-1.4,1.4])for(const dz of [-.45,.45])beam('bronze',[x+dx,19,39+dz],[x+dx*.85,21,39+dz],.18);
    beam('bronze',[x+1.4,21,39],[x+2.1,23,39],.4);
    cylinder('bronze',x,23,39,.42,.56,2.2,8);b.sphere('bronze',x,24.6,39,.4,.5,.4,8);
  }
  if(near)for(const side of [-1,1])for(let z=-29;z<21;z+=7)a.window(side*21.1,5,z,2.7,8,{yaw:side*Math.PI/2,stone:'trim'});
  // Steps rise toward the porch rather than rising away from the church.
  for(let i=0;i<6;i++)box('stone',0,(6-i)*.13,43+i*1.15,46+i*.7,(6-i)*.26,1.2);
}

function invalides(b){
  const {near,box,beam,cylinder,sphere,cone,roof}=b,a=b.detail;
  // Bounded church cross and short wings only; excludes the 15 ha complex.
  box('stone',0,16,-1,42,32,66);box('stone',0,16,14,56,32,28);
  for(const x of [-23.5,23.5]){box('stone',x,13,-2,10,26,44);roof('roof',x,26,-2,10,44,7);}
  roof('roof',0,32,-1,42,66,8);
  box('trim',0,34,14,47,3,28);
  cylinder('stone',0,44,14,20,18,20,near?32:16);
  for(let i=0;i<(near?24:12);i++){const t=i*Math.PI*2/(near?24:12);cylinder('trim',Math.cos(t)*18,47,14+Math.sin(t)*18,.85,.85,19,near?8:5);
    if(i%2===0)a.window(Math.cos(t)*19,42,14+Math.sin(t)*19,2.4,10,{yaw:Math.PI/2-t,stone:'trim'});}
  cylinder('trim',0,57,14,21,20,5,near?32:16);
  a.dome('gold',0,60,14,20,29,{ribs:near?24:12,ribMaterial:'trim'});
  cylinder('gold',0,91,14,4,3,8);cone('gold',0,99,14,4,8);beam('gold',[0,103,14],[0,107,14],.33);
  // Stone portico toward Place Vauban and repeated shallow wing bays.
  for(const x of [-15,-9,-3,3,9,15])a.column('trim',x,0,35,.85,22);
  for(const x of [-12,0,12])box('glass',x,11,32.4,6,14,.35);
  box('trim',0,23,35,39,2,4);roof('stone',0,24,35,39,5,7);
  box('trim',0,18,33.5,52,1.4,1);
  for(const side of [-1,1])for(const z of [-18,-6,6,18])a.window(side*28.55,7,z,3.2,11,{yaw:side*Math.PI/2,stone:'trim'});
  for(const x of [-21,-12,0,12,21])a.window(x,4,33.15,5,12,{stone:'trim'});
  for(const y of [4,17,27,31])box('trim',0,y,33.2,56,.45,.65);
  if(near)for(const x of [-25,-19,19,25])a.column('trim',x,18,33.5,.45,11);
  beam('gold',[-1.3,105.4,14],[1.3,105.4,14],.23);
}

const makers={'paris-tour-eiffel':eiffel,'paris-arc-de-triomphe':triomphe,'paris-notre-dame':notreDame,'paris-sacre-coeur':sacreCoeur,'paris-invalides':invalides};
export function createParisIcon(id,{detail='near'}={}){const spec=PARIS_ICON_BY_ID[id];if(!spec)throw Error('Unknown Paris icon: '+id);const b=builder(spec,detail);makers[id](b);return b.finish();}
