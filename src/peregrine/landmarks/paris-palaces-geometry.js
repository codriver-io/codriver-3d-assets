import { PARIS_BUILDING_FRAMES, applyParisBuildingFrame } from './paris-building-placement.js';
// Original procedural Paris palace exteriors, commissioned for Codriver, 2026.
// Coordinates are local metres: east / up / south. No elevation or Mercator scale is baked in.
// MIT source; exported models are CC BY 4.0. Geographic placement © OSM contributors, ODbL.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { architecture } from './paris-architecture.js';

export const PARIS_PALACES = Object.freeze({
  'paris-louvre': {name:'Palais du Louvre',...PARIS_BUILDING_FRAMES['paris-louvre'],radius:490,
    description:'Historic east palace around the Cour Carrée and the long north and south wings around the Cour Napoléon, including the glass entrance pyramid.',
    references:['https://presse.louvre.fr/le-musee-du-louvre-1063000201419/?lang=fr','https://www.louvre.fr/en/explore/the-palace/a-pyramid-for-a-symbol']},
  'paris-palais-garnier': {name:'Palais Garnier',...PARIS_BUILDING_FRAMES['paris-palais-garnier'],radius:115,
    description:'South colonnaded front, domed auditorium, tall northern fly tower and gilded roof silhouettes.',
    references:['https://www.operadeparis.fr/apropos/theatres-et-ateliers/palais-garnier']},
  'paris-grand-palais': {name:'Grand Palais',...PARIS_BUILDING_FRAMES['paris-grand-palais'],radius:180,
    description:'Stone enclosure, long glazed barrel nave, crossing dome and dense but economical structural ribs.',
    references:['https://www.grandpalais.fr/sites/default/files/BROCHURE-LOCATION-GRAND-PALAIS.pdf']},
  'paris-petit-palais': {name:'Petit Palais',...PARIS_BUILDING_FRAMES['paris-petit-palais'],radius:105,
    description:'West entrance arch, long colonnaded facade, domed entry and open curved garden court.',
    references:['https://www.petitpalais.paris.fr/professionnels/tournage-et-prise-de-vue','https://parismusees.paris.fr/en/node/5829']},
  'paris-musee-orsay': {name:'Musée d’Orsay',...PARIS_BUILDING_FRAMES['paris-musee-orsay'],radius:190,
    description:'Long former station along the Seine with curved iron roof, end pavilions and clock bays.',
    references:['https://www.musee-orsay.fr/en/museum/history-museum','https://data.bnf.fr/en/ark:/12148/cb12042796j.pdf']},
});

const COLORS={stone:0xbdb5a2,stoneDark:0x9c927f,roof:0x555965,roofLight:0x718087,glass:0x728d91,iron:0x526267,gold:0xc7a553,shadow:0x46515a,clock:0xe6dec7,glazing:0xbed3d5,patina:0x6f9a86};

function builder(id,detail) {
  const near=detail==='near';
  const root=new THREE.Group();root.name=id;root.userData={landmark:id,detail,units:'metres',origin:PARIS_PALACES[id].origin,
    provenance:'Original geometry commissioned for Codriver; map placement © OpenStreetMap contributors'};
  const bins=new Map();
  const put=(g,mat)=>{g.deleteAttribute('uv');if(!g.index)g.setIndex(Array.from({length:g.attributes.position.count},(_,i)=>i));if(!bins.has(mat))bins.set(mat,[]);bins.get(mat).push(g);};
  const a=architecture(put,near);
  const box=(mat,x,y,z,w,h,d)=>{const g=new THREE.BoxGeometry(w,h,d);g.translate(x,y,z);
    if(y-h/2<.01){const ix=Array.from(g.index.array);ix.splice(18,6);g.setIndex(ix);} // no underside on the ground plane
    put(g,mat);};
  // Thin members have open ends (every joint hides them); pass open=false for thick, visible stems.
  const bar=(mat,a,b,r=0.35,sides=6,open=true)=>{const p=new THREE.Vector3(...a),q=new THREE.Vector3(...b),len=p.distanceTo(q);if(len<0.01)return;
    const g=new THREE.CylinderGeometry(r,r,len,sides,1,open);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),q.clone().sub(p).normalize()));g.translate(...p.add(q).multiplyScalar(0.5).toArray());put(g,mat);};
  const cyl=(mat,x,y,z,r,h,sides=near?16:10)=>{const g=new THREE.CylinderGeometry(r,r,h,sides,1);g.translate(x,y,z);put(g,mat);};
  const dome=(mat,x,y,z,r,h,segments=near?20:12)=>{const g=new THREE.SphereGeometry(r,segments,Math.max(5,segments/2),0,Math.PI*2,0,Math.PI/2);
    g.scale(1,h/r,1);g.translate(x,y,z);put(g,mat);};
  const barrel=(mat,axis,length,r,base,rise=r)=>{
    const steps=near?28:14,arr=[];
    const point=(t,s)=>axis==='z'?[r*Math.cos(t),base+rise*Math.sin(t),s]:[s,base+rise*Math.sin(t),r*Math.cos(t)];
    for(let i=0;i<steps;i++){
      const a=Math.PI*i/steps,c=Math.PI*(i+1)/steps;
      const p=point(a,-length/2),q=point(a,length/2),u=point(c,-length/2),v=point(c,length/2);
      arr.push(...p,...q,...v,...p,...v,...u);
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(arr,3));g.computeVertexNormals();put(g,mat);
  };
  const roof=(mat,x,z,w,d,eave,ridge,axis='x')=>{
    // Open-bottomed double slope on top of a rigid mass: no underside to fight the wall top.
    // The two axes are mirror images, so the x-axis triangles reverse their winding to face outward.
    const la=axis==='x'?w:d,lb=axis==='x'?d:w,P=(u,y,t)=>axis==='x'?[x+u,y,z+t]:[x+t,y,z+u];
    const v=[P(-la/2,eave,-lb/2),P(la/2,eave,-lb/2),P(-la/2,eave,lb/2),P(la/2,eave,lb/2),P(-la/2,ridge,0),P(la/2,ridge,0)];
    const faces=[[0,1,5],[0,5,4],[2,4,5],[2,5,3],[0,4,2],[1,3,5]],arr=[];
    for(const [i,j,k] of faces)for(const n of axis==='x'?[i,k,j]:[i,j,k])arr.push(...v[n]);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(arr,3));g.computeVertexNormals();put(g,mat);
  };
  const arcade=(x0,x1,z,y=2,height=12,spacing=6,front=true)=>{
    const count=Math.max(1,Math.floor((x1-x0)/spacing));for(let i=0;i<=count;i++){
      const x=x0+(x1-x0)*i/count;box('stone',x,y+height/2,z,near?0.95:1.3,height,1.2);
      if(i<count&&near){const nx=x0+(x1-x0)*(i+0.5)/count;box('shadow',nx,y+height*0.55,z+(front?0.12:-0.12),(x1-x0)/count-1.45,height*0.63,0.18);}
    }
    box('stoneDark',(x0+x1)/2,y+height+1,z,x1-x0+2,2,2.3);
  };
  // ---- Flat facade vocabulary: framed quads, bands and cheap shafts instead of per-window solids. ----
  const outlines=new Map();
  const outline=(w,h,arch)=>{const key=`${w}|${h}|${arch}`;
    if(!outlines.has(key)){let g;
      if(!arch){g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);}
      else{const r=w/2,spring=Math.max(0,h-r),sh=new THREE.Shape();sh.moveTo(-r,0);sh.lineTo(r,0);sh.lineTo(r,spring);sh.absarc(0,spring,r,0,Math.PI,false);sh.lineTo(-r,0);g=new THREE.ShapeGeometry(sh,near?5:3);}
      outlines.set(key,g);}
    return outlines.get(key).clone();};
  // (x,y,z) is the bottom centre ON the wall; yaw turns +Z into the outward normal. Quads stand 6 and 12 cm proud.
  const face=(mat,x,y,z,yaw,g,d)=>{g.rotateY(yaw);g.translate(x+d*Math.sin(yaw),y,z+d*Math.cos(yaw));put(g,mat);};
  const pane=(x,y,z,w,h,yaw=0,{arch=false,glass='shadow',frame='stoneDark'}={})=>{
    face(frame,x,y,z,yaw,outline(w+.7,h+.35,arch),.06);face(glass,x,y,z,yaw,outline(w,h,arch),.12);};
  const band=(mat,x,y,z,len,h,yaw=0,d=.06)=>face(mat,x,y,z,yaw,outline(len,h,false),d);
  const shaft=(mat,x,y,z,r,h,sides=near?8:5)=>{
    const g=new THREE.CylinderGeometry(r*.88,r,h,sides,1,true);g.translate(x,y+h/2,z);put(g,mat);
    box(mat,x,y+h*.015,z,r*2.5,h*.03,r*2.5);box(mat,x,y+h*.98,z,r*2.7,h*.04,r*2.7);};
  // Point on a wall that runs along world x (yaw 0/PI) or world z (yaw +-PI/2); o gives the fixed coordinate.
  const along=(o,yaw)=>Math.abs(Math.cos(yaw))>.5?w=>[w,o[1]]:w=>[o[0],w];
  // One window system per elevation: near = framed quads per bay, far = one dark band per run per storey.
  const elevation=(o,yaw,w0,w1,{pitch=8,blocked=[],rows=[],margin=2}={})=>{
    const at=along(o,yaw),n=Math.max(1,Math.round((w1-w0)/pitch)),step=(w1-w0)/n,ws=[];
    for(let i=0;i<n;i++){const w=w0+(i+.5)*step;if(!blocked.some(([lo,hi])=>w+margin>lo&&w-margin<hi))ws.push(w);}
    if(near){for(const w of ws){const [x,z]=at(w);for(const r of rows)pane(x,r.y,z,r.w,r.h,yaw,r);}return ws;}
    for(let i=0;i<ws.length;){let j=i;while(j+1<ws.length&&ws[j+1]-ws[j]<step*1.5)j++;
      const lo=ws[i]-step/2+1,hi=ws[j]+step/2-1,[x,z]=at((lo+hi)/2);
      for(const r of rows)band('shadow',x,r.y+r.h*.18,z,hi-lo,r.h*.62,yaw,.12);
      i=j+1;}
    return ws;};
  const course=(o,yaw,w0,w1,ys)=>{const [x,z]=along(o,yaw)((w0+w1)/2);for(const y of ys)a.box('stoneDark',x,y,z,w1-w0,.6,.6,yaw);};
  // Dormer on a roof slope: set back 60 cm from the wall plane, gabled, one framed pane.
  const dormer=(x,z,yaw,eave)=>{
    const s=Math.sin(yaw),c=Math.cos(yaw),cx=x-s*1.8,cz=z-c*1.8;
    a.box('stone',cx,eave+2.5,cz,3.4,5.4,2.4,yaw);
    if(Math.abs(c)>.5)roof('roof',cx,cz,3.9,2.8,eave+5.2,eave+7,'z');else roof('roof',cx,cz,2.8,3.9,eave+5.2,eave+7,'x');
    pane(x-s*.6,eave+.8,z-c*.6,1.8,3.2,yaw);};
  // Roof-edge balustrade from rails and sparse posts (a lathed baluster every metre cost thousands of triangles).
  const parapet=(x,y,z,len,yaw=0,step=2.4)=>{
    a.box('stone',x,y+1.2,z,len,.25,.6,yaw);a.box('stone',x,y+.1,z,len,.23,.6,yaw);
    if(near)for(let u=-len/2+step/2;u<len/2;u+=step)a.box('stone',x+u*Math.cos(yaw),y+.6,z-u*Math.sin(yaw),.4,.96,.4,yaw);};
  const finish=()=>{for(const [name,geoms] of bins){const geometry=mergeGeometries(geoms);for(const g of geoms)g.dispose();geometry.computeBoundingBox();geometry.computeBoundingSphere();
      const material=new THREE.MeshStandardMaterial({color:COLORS[name],roughness:name==='glass'?.43:.86,metalness:['iron','gold'].includes(name)?.34:0,side:THREE.DoubleSide});if(name==='glazing'){material.transparent=true;material.opacity=.32;material.depthWrite=false;material.roughness=.18;}material.name=name;
      const mesh=new THREE.Mesh(geometry,material);mesh.name=`${id}-${name}`;root.add(mesh);}
    return applyParisBuildingFrame(root,id);};
  return {root,put,box,bar,cyl,dome,barrel,roof,arcade,pane,band,shaft,elevation,course,dormer,parapet,finish,a};
}

function louvre(b,detail){
  const {box,roof,band,shaft,elevation,course,dormer,a}=b,near=detail==='near';
  const WIN=[{y:2,h:7,w:3.2,arch:true},{y:12,h:7.5,w:3.2}];
  // Mapped footprint (authoring frame): the Cour Carrée block spans x 299..466 and z about +-84, its court
  // about 127 m square. Ranges are 20 m deep; the Sully range runs on across the end of the Cour Napoléon.
  const pavilion=(x,z)=>{
    box('stoneDark',x,14,z,33,28,34);a.mansard('roof',x,27.95,z,34,34,13);
    for(const face of [-1,1])elevation([x,z+face*17],face<0?Math.PI:0,x-15,x+15,{pitch:10,rows:[{y:2,h:7,w:4.3,arch:true},{y:12,h:8,w:4.3},{y:23,h:3.5,w:4.3}]});
  };
  // Long Richelieu / Denon wings around the Cour Napoléon, ending inside the Cour Carrée corner pavilions.
  for(const z of [-105,105]){box('stone',109.5,11,z,399,22,25);roof('roof',109.5,z,399,25,22,29,'x');}
  // Cour Carrée: Sully range (west), east colonnade range, and the north and south ranges between them.
  box('stone',309,12,0,20,24,210);roof('roof',309,0,20,210,24,32,'z');
  box('stone',456,12,0,20,24,167);roof('roof',456,0,20,167,24,32,'z');
  for(const s of [-1,1]){box('stone',382.5,12,s*73.5,127,24,20);roof('roof',382.5,s*73.5,147,20,24,32,'x');}
  for(const [x,z] of [[-85,-105],[-85,105],[309,-105],[309,105],[456,-73.5],[456,73.5]])pavilion(x,z);
  // West end porticoes frame the court but retain a broad central opening.
  box('stone',-100,12,-105,24,24,42);box('stone',-100,12,105,24,24,42);roof('roof',-100,-105,24,42,24,33,'z');roof('roof',-100,105,24,42,24,33,'z');
  // Long elevations: ground-floor arches, upper rectangles, dormers on every second bay.
  for(const z of [-117.5,-92.5,92.5,117.5]){
    const yaw=z===-117.5||z===92.5?Math.PI:0,blocked=[[-112,-68.5],[292.5,325.5]];
    if(Math.abs(z)<100)blocked.push([74.5,105.5],[189.5,220.5]);
    const bays=elevation([0,z],yaw,-70,292.5,{pitch:8,blocked,rows:WIN});
    course([0,z],yaw,-70,292.5,[10.5,21.5]);
    if(near)bays.forEach((w,i)=>{if(i%2===0)dormer(w,z,yaw,22);});
  }
  // Cour Carrée north and south ranges, outer and court elevations.
  for(const z of [-83.5,-63.5,63.5,83.5]){
    const yaw=z===-83.5||z===63.5?Math.PI:0;
    const bays=elevation([0,z],yaw,321,439.5,{pitch:8,rows:WIN});
    course([0,z],yaw,321,439.5,[10.5,21.5]);
    if(near)bays.forEach((w,i)=>{if(i%2===0)dormer(w,z,yaw,24);});
  }
  // Sully range west (Cour Napoléon) face and east (Cour Carrée) face, and the east range court face.
  for(const [wx,yaw,range] of [[299,-Math.PI/2,86],[319,Math.PI/2,63.5],[446,-Math.PI/2,63.5]]){
    const blocked=wx===446?[]:[[-22,22]],rows=wx===299?[{y:2,h:8,w:3.5,arch:true},{y:13,h:8,w:3.5}]:WIN;
    const bays=elevation([wx,0],yaw,-range,range,{pitch:8,blocked,rows});
    course([wx,0],yaw,-range,range,[10.5,21.5]);
    if(near)bays.forEach((w,i)=>{if(i%2===0)dormer(wx,w,yaw,24);});
  }
  // Pavillon de l'Horloge: central domed pavilion of the Sully range, clock on its Cour Napoléon face.
  box('stoneDark',311,18,0,32,36,40);a.mansard('roof',311,35.95,0,32,40,18);
  elevation([295,0],-Math.PI/2,-16.25,16.25,{pitch:6.5,rows:[{y:2,h:8,w:4.2,arch:true},{y:13,h:8,w:4.2,arch:true},{y:25,h:8,w:4.2,arch:true}]});
  for(const z of [-18,-10,10,18])shaft('stone',294.5,12,z,.6,22);
  box('stone',294.7,40,0,2,12,14);
  a.clock(293.5,41,0,3,{yaw:-Math.PI/2});
  // Projecting Napoleon III pavilions and taller mansards break the long ranges.
  // Their bays are estimates; the courtyard remains open between the projections.
  for(const side of [-1,1])for(const x of [90,205]){
    const z=side*91,front=side*77,yaw=side<0?0:Math.PI;
    box('stone',x,15,z,31,30,28);a.mansard('roof',x,29.95,z,33,30,14);
    elevation([x,front],yaw,x-13.5,x+13.5,{pitch:9,rows:[{y:1.5,h:8,w:4.3,arch:true},{y:12,h:8,w:4.3},{y:22,h:5.8,w:4.3}]});
    for(const u of [-13,-5,5,13])shaft('stone',x+u,11,front-side*.35,.45,18);
    for(const y of [11,21,29])box('stoneDark',x,y,front,33,.65,1.2);
    box('stone',x,36,front+side*2,9,10,2.5);
    b.pane(x,32,front+side*.75,4,6,yaw);
    roof('stone',x,front+side*1.5,12,3,41,44,'z');
    for(const u of [-11,11]){box('stone',x+u,42,z,1.7,6,3);box('stoneDark',x+u,45,z,2.2,.5,3.6);}
  }
  // I. M. Pei entrance: official rounded anchors 35 m base and 21 m height.
  // Position follows the existing schematic court frame, not a surveyed site plan.
  const px=170,pz=0,half=17.5,height=21;
  const corners=[[-half,-half],[half,-half],[half,half],[-half,half]];
  box('stoneDark',px,.12,pz,35.5,.24,35.5);
  for(let j=0;j<4;j++){
    const [u,v]=corners[j],[uu,vv]=corners[(j+1)%4],tip=[px,height,pz],l=[px+u,.24,pz+v],r=[px+uu,.24,pz+vv];
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([...l,...tip,...r],3));g.computeVertexNormals();b.put(g,'glazing');
    const mix=(a,c,t)=>a.map((n,k)=>n+(c[k]-n)*t);
    b.bar('iron',l,tip,.095);b.bar('iron',l,r,.10);
    // Two diagonal families create diamond glazing, not a triangular fan.
    const n=near?14:5;
    for(let k=1;k<n;k++){
      const t=k/n;b.bar('roofLight',mix(l,r,t),mix(l,tip,t),near?.045:.075,4);
      b.bar('roofLight',mix(r,l,t),mix(r,tip,t),near?.045:.075,4);
    }
  }
  // East colonnade (Perrault): paired columns on a stylobate in front of a dark loggia wall.
  box('stone',467,9.75,0,2,.5,170);
  band('shadow',466,10,0,164,11.5,Math.PI/2,.05);
  for(let z=-80;z<=80;z+=near?6:12)for(const dz of [-.8,.8])shaft('stone',466.9,10,z+dz,.5,12);
  box('stone',466.9,23,0,3,2,168);
}

function garnier(b,detail){const {box,roof,cyl,bar,pane,elevation,a}=b,near=detail==='near';
  box('stone',0,13,42,75,26,31);box('stone',0,16,-9,66,32,85);box('stone',0,16,-62,78,32,25);
  // Auditorium rotundas: verdigris copper domes.
  for(const x of [-38,38]){
    cyl('stone',x,13,9,12,26);a.dome('patina',x,26,9,12,9);
    if(near)for(let i=0;i<12;i++){const t=i*Math.PI/6;pane(x+11.9*Math.sin(t),6,9+11.9*Math.cos(t),3,12,t,{arch:true});}
  }
  // Seven entrance arcades; paired Corinthian upper order and recessed loggia.
  for(let i=0;i<7;i++){
    const x=-25.5+i*8.5;
    if(near){a.window(x,1,57.7,5,10,{glass:'shadow',stone:'stoneDark'});a.window(x,15,57.7,4.7,11,{glass:'shadow',stone:'stoneDark'});}
    else{pane(x,1,57.5,5,10,0,{arch:true});pane(x,15,57.5,4.7,11,0,{arch:true});}
    for(const dx of [-3.05,3.05])a.column('stone',x+dx,13.7,60,.65,13.7);
    if(near){a.balustrade('stone',x,12,60,6);a.clock(x,30.5,58.8,1.1,{face:'gold',rim:'stone',hands:'gold'});}
  }
  for(const y of [12,27.7,29,33.5])box('stoneDark',0,y,59,77,.8,3);
  for(const x of [-34,34]){
    box('stone',x,21,58,10,19,5);a.mansard('roof',x,34.95,52,14,15,6);
    pane(x,3,60.5,5,9,0,{arch:true});
    box('gold',x,24,61,6,.5,.1);
  }
  // Auditorium dome: green patina with gilded ribs.
  cyl('stoneDark',0,33,1,25,7);a.dome('patina',0,36.5,1,25,17,{ribs:near?24:8,ribMaterial:'gold'});
  box('stone',0,41,-53,55,26,37);roof('roof',0,-53,59,39,54,66,'x');
  // Apollo/lyre at the high fly tower and winged gilded groups on the front corner pavilions, at twice the first size.
  const group=(x,y,z,s=2)=>{
    bar('gold',[x,y,z],[x,y+5*s,z],.52*s,6,false);cyl('gold',x,y+5.5*s,z,.58*s,1.1*s,8);
    for(const side of [-1,1]){bar('gold',[x,y+3.5*s,z],[x+side*2.7*s,y+5.4*s,z],.26*s,6,false);bar('gold',[x+side*2.7*s,y+5.4*s,z],[x+side*3.3*s,y+7*s,z],.18*s,6,false);}
  };
  for(const [x,y,z] of [[-34,41,56],[34,41,56],[0,66,-53]])group(x,y,z);
  // Side elevations: only the stretch not buried by the rotundas and the rear block gets windows.
  if(near)for(const side of [-1,1])elevation([side*33,0],side*Math.PI/2,-50,-4,{pitch:8,rows:[{y:4,h:9,w:3.8,arch:true},{y:18,h:9,w:3.8,arch:true}]});
  for(let i=0;i<6;i++)box('stone',0,(6-i)*.14,59+i*.8,77,(6-i)*.28,.9);
}

function grand(b,detail){const {box,cyl,a,put,elevation,shaft,parapet}=b,near=detail==='near';
  // Thin glazing bars have four faces and open ends hidden inside their joints.
  const bar=(mat,start,end,r)=>{
    const p=new THREE.Vector3(...start),q=new THREE.Vector3(...end),v=q.clone().sub(p);
    if(v.length()<1e-5)return;
    const g=new THREE.CylinderGeometry(r,r,v.length(),4,1,true);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));
    g.translate(...p.add(q).multiplyScalar(.5).toArray());put(g,mat);
  };
  // 200 m nave / 50 m span. Roof lattice and cross-vaults traced from exterior photos.
  for(const x of [-41,41]){box('stone',x,11,0,24,22,202);box('roof',x,22.3,0,24,.6,202);}
  for(const z of [-93,93]){box('stone',0,12,z,108,24,18);box('roof',0,24.3,z,108,.6,18);}
  box('stone',0,11,0,142,22,36);
  box('roof',0,22.2,0,108,.35,202); // Lead shoulders close the strips beside the nave.
  function surface(points,mat='glass'){
    const vertices=[];
    for(let i=0;i<points.length;i+=3){const [p,q,r]=points.slice(i,i+3);
      const normal=new THREE.Vector3(...q).sub(new THREE.Vector3(...p)).cross(new THREE.Vector3(...r).sub(new THREE.Vector3(...p)));
      if(normal.lengthSq()<1e-12)continue; // No zero-area triangles at an apse pole.
      vertices.push(...p,...(normal.y<0?r:q),...(normal.y<0?q:r));
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.computeVertexNormals();put(g,mat);
  }
  function vault(axis,lo,hi){
    // Glass at full resolution; only the major ribs (about every 8 m) and every third longitudinal bar are drawn.
    const n=near?24:12,steps=Math.max(2,Math.round((hi-lo)/(near?8:13)));
    const p=(t,s,inner=0)=>axis==='z'?[(25-inner)*Math.cos(t),22+(20-inner)*Math.sin(t),s]:[s,22+(20-inner)*Math.sin(t),(25-inner)*Math.cos(t)];
    for(let j=0;j<n;j++){
      const t=j*Math.PI/n,q=(j+1)*Math.PI/n;
      surface([p(t,lo),p(t,hi),p(q,hi),p(t,lo),p(q,hi),p(q,lo)]);
      if(near||j%3===0)bar('iron',p(t,lo),p(t,hi),j%3===0?.16:.075);
    }
    for(let i=0;i<=steps;i++){
      const s=lo+(hi-lo)*i/steps;
      for(let j=0;j<n;j++){
        const t=j*Math.PI/n,q=(j+1)*Math.PI/n;
        bar('iron',p(t,s),p(q,s),.25);
        if(near)bar('iron',p(t,s,1.1),p(q,s,1.1),.16);
      }
    }
    // Raised glazed ridge lantern, with vertical clerestory sides and fine mullions.
    const len=hi-lo,mid=(lo+hi)/2;
    box('glass',axis==='z'?0:mid,42.3,axis==='z'?mid:0,axis==='z'?4:len,1.6,axis==='z'?len:4);
    for(const side of [-1,1]){
      bar('iron',axis==='z'?[side*2,43.2,lo]:[lo,43.2,side*2],axis==='z'?[side*2,43.2,hi]:[hi,43.2,side*2],.14);
    }
  }
  vault('z',-65,-25);vault('z',25,65);vault('x',-64,-25);vault('x',25,64);
  // Rounded glazed apses close the north/south nave; no open tunnel ends.
  for(const side of [-1,1]){
    const na=near?20:8,np=near?12:5;
    const p=(theta,phi)=>[25*Math.cos(theta)*Math.sin(phi),22+20*Math.cos(phi),side*(65+27*Math.sin(theta)*Math.sin(phi))];
    for(let i=0;i<na;i++)for(let j=0;j<np;j++){
      const t=i*Math.PI/na,q=(i+1)*Math.PI/na,v=j*Math.PI/(2*np),w=(j+1)*Math.PI/(2*np);
      surface([p(t,v),p(q,v),p(q,w),p(t,v),p(q,w),p(t,w)]);
      if(i%2===0)bar('iron',p(t,v),p(t,w),.16);
      if(near&&j%2===1)bar('iron',p(t,w),p(q,w),.14);
    }
    // Vertical fan glazing above the projecting transverse entrance pediment.
    const shape=new THREE.Shape();shape.moveTo(-25,0);shape.lineTo(25,0);
    for(let i=1;i<=(near?32:16);i++){const t=i*Math.PI/(near?32:16);shape.lineTo(25*Math.cos(t),20*Math.sin(t));}shape.closePath();
    a.place(new THREE.ShapeGeometry(shape), 'glass',side*64,22,0,side*Math.PI/2);
    for(let u=-24;u<=24;u+=near?3:8){const y=22+20*Math.sqrt(1-(u/25)**2);bar('iron',[side*64.1,22,u],[side*64.1,y,u],.10);}
    for(let h=4;h<20;h+=near?3:6){const half=25*Math.sqrt(1-(h/20)**2);bar('iron',[side*64.1,22+h,-half],[side*64.1,22+h,half],.10);}
  }
  // Four intersecting vault shoulders under the low circular crossing cupola.
  const count=near?12:6,point=(x,z)=>[x,22+20*Math.sqrt(Math.max(0,1-(Math.min(Math.abs(x),Math.abs(z))/25)**2)),z];
  for(let i=0;i<count;i++)for(let j=0;j<count;j++){
    const x=-25+i*50/count,z=-25+j*50/count,d=50/count;
    if(Math.hypot(x+d/2,z+d/2)<15.5)continue;
    const p=point(x,z),q=point(x+d,z),r=point(x+d,z+d),s=point(x,z+d);
    surface([p,s,q,q,s,r]);bar('iron',p,q,.1);bar('iron',p,s,.1);
  }
  // Radial ribs AND concentric glazing rings follow the flattened dome profile.
  const profile=[[1,0],[.98,.14],[.9,.36],[.75,.63],[.50,.83],[.2,.97],[0,1]];
  a.dome('glass',0,40.5,0,19,6,{profile,ribs:near?32:12,ribMaterial:'iron'});
  for(const [r,h] of profile.slice(0,-1)){
    const n=near?40:16;for(let j=0;j<n;j++){const t=j*2*Math.PI/n,q=(j+1)*2*Math.PI/n;bar('iron',[19*r*Math.cos(t),40.5+6*h,19*r*Math.sin(t)],[19*r*Math.cos(q),40.5+6*h,19*r*Math.sin(q)],.13);}
  }
  cyl('iron',0,46.9,0,3.5,.5);cyl('glass',0,48.5,0,2.5,3);
  for(let i=0;i<8;i++){const t=i*Math.PI/4;bar('iron',[2.5*Math.cos(t),47,2.5*Math.sin(t)],[1.8*Math.cos(t),50.5,1.8*Math.sin(t)],.14);}
  a.dome('iron',0,50,0,2.7,2);cyl('iron',0,53.3,0,.55,3);bar('iron',[0,54.8,0],[0,58,0],.12);
  // Side elevations on the real wall plane (x = +-53): arched bays with a column at every pier.
  for(const side of [-1,1]){
    const x=side*54.1,yaw=side*Math.PI/2;
    elevation([side*53,0],yaw,-80,80,{pitch:8,rows:[{y:3,h:13,w:4.5,arch:true}]});
    for(let z=-80;z<=80;z+=near?8:16)shaft('stone',side*53.7,1,z,.6,18);
    for(const y of [2,19.5,22])box('stoneDark',x,y,0,2,.6,190);
    parapet(x,22,0,187,yaw,3);
    for(const z of [-12,-6,6,12])shaft('stone',side*72,0,z,1,20,near?10:6);
    box('stone',side*71,21,0,4,2,34);
    const g=new THREE.ConeGeometry(17,7,4);g.rotateY(Math.PI/4);g.scale(.13,1,1);a.place(g,'stone',side*71,25,0);
  }
  for(const z of [-102,102])elevation([0,z],z>0?0:Math.PI,-42,42,{pitch:8.4,rows:[{y:3,h:15,w:4.5,arch:true}]});
}

function petit(b,detail){const {box,roof,bar,cyl,dome,arcade,pane,shaft,elevation,parapet,a}=b,near=detail==='near';
  // Entrance faces west (-X); 125m historic frontage and open courtyard east.
  box('stone',-36,13,-39,25,26,47);box('stone',-36,13,39,25,26,47);
  box('stone',-36,23,0,25,6,31);
  // Low slate roofs sit behind balustraded attics: ridges only a few metres above the cornice.
  roof('roof',-36,0,25,125,26,28.5,'z');
  box('stone',7,11,-51,75,22,19);roof('roof',7,-51,75,19,22,24.8,'x');
  box('stone',7,11,51,75,22,19);roof('roof',7,51,75,19,22,24.8,'x');
  for(const z of [-60.2,-41.8,41.8,60.2])parapet(7,22,z,75,0,2.4);
  // Curved peristyle encloses, but does not cover, the garden court.
  for(let i=0;i<=12;i++){const a=-Math.PI/2+Math.PI*i/12;const x=16+37*Math.cos(a),z=37*Math.sin(a);
    cyl('stone',x,7,z,near?.85:1.2,14,7);
    if(i>0){const p=-Math.PI/2+Math.PI*(i-1)/12;bar('stoneDark',[16+37*Math.cos(p),15,37*Math.sin(p)],[x,15,z],1.1,5,false);}}
  for(const z of [-12,12])box('stoneDark',-50,20,z,10,40,3);
  box('stoneDark',-50,35,0,10,10,27);cyl('stone',-43,37,0,14,3);a.dome('roofLight',-43,38.5,0,14,9,{ribs:near?16:8,ribMaterial:'iron'});
  // West entrance arch, two jambs and open center. Pediment and gilded gate.
  box('stone',-56,8,-12,2,16,3);box('stone',-56,8,12,2,16,3);
  const n=near?12:6;for(let i=0;i<n;i++){
    const a=Math.PI*i/n,c=Math.PI*(i+1)/n;
    bar('stoneDark',[-56,16+12*Math.sin(a),12*Math.cos(a)],[-56,16+12*Math.sin(c),12*Math.cos(c)],1.35,6,false);
  }
  if(near){for(let z=-58;z<=58;z+=7)box('stoneDark',-49.2,11,z,0.14,9,3.1);
    for(const z of [-54,54]){cyl('stoneDark',-37,28,z,7,5);dome('roofLight',-37,30,z,7,5);}}
  // Front: arched windows on the wall plane (x = -48.5) behind a paired-column colonnade on a stylobate.
  for(const s of [-1,1]){
    for(const z of [31,39,47,55])pane(-48.5,5,s*z,4.6,13,-Math.PI/2,{arch:true});
    box('stone',-50.4,1.5,s*43,4,3,37);box('stone',-50.4,22.2,s*43,4,2.4,37);
    for(const z of [27,35,43,51,59])for(const dz of [-.85,.85])shaft('stone',-50.4,3,s*(z+dz),.65,18,6);
  }
  // Wing end walls at z = +-60.5 (east wings) and +-62.5 (west block): panes stand proud of the wall plane.
  for(const z of [-60.5,60.5])elevation([0,z],z>0?0:Math.PI,-20,44,{pitch:8,rows:[{y:4,h:12,w:4.3,arch:true}]});
  for(const z of [-62.5,62.5])elevation([0,z],z>0?0:Math.PI,-47,-25,{pitch:7.3,rows:[{y:4,h:12,w:4.3,arch:true}]});
  for(const z of [-42,42])parapet(-49.3,26,z,37,Math.PI/2,2.4);
  if(near)for(let z=-10;z<=10;z+=.65)bar('gold',[-56.5,1,z],[-56.5,15+10*Math.sqrt(1-(z/12)**2),z],.055);
  arcade(-20,40,-39,1,9,7);arcade(-20,40,39,1,9,7,false);
}

function orsay(b,detail){const {box,roof,bar,barrel,pane,elevation,parapet,a,cyl}=b,near=detail==='near';
  // The 138 x 40 x 32 m hall is wrapped by the stone station/hotel envelope.
  // Seine elevation: seven huge arches, two clock towers and steep slate roofs.
  box('stone',0,11,-31,175,22,19);box('stone',0,11,31,175,22,19);
  for(const x of [-94,94]){box('stone',x,13,0,27,26,85);a.mansard('roof',x,25.95,0,29,85,10);}
  a.mansard('roof',0,21.95,31,175,20,10);
  // Broad, steep river-side roof with raised longitudinal glazing strips.
  roof('roof',0,-29,142,25,22,34,'x');
  barrel('glass','x',138,20,20,12);
  for(const z of [-12,12]){box('glass',0,33.1,z,140,1.4,2.2);box('iron',0,34,z,141,.3,2.8);}
  box('roof',0,34.6,0,138,1.4,16);
  for(let x=-65;x<=65;x+=near?5:14)for(const z of [-12,12])box('iron',x,33.2,z,.09,1.4,2.4);
  const hoops=near?14:6,hn=near?12:8;
  for(let i=0;i<=hoops;i++){
    const x=-69+138*i/hoops;
    for(let j=0;j<hn;j++){const t=Math.PI*j/hn,q=Math.PI*(j+1)/hn;bar('iron',[x,20+12*Math.sin(t),20*Math.cos(t)],[x,20+12*Math.sin(q),20*Math.cos(q)],near?.14:.25,4);}
  }
  function figure(x,y,z,scale=1){
    if(!near)return;
    cyl('stoneDark',x,y+.95*scale,z,.27*scale,1.9*scale,6);
    const g=new THREE.SphereGeometry(.32*scale,6,4);a.place(g,'stone',x,y+2.15*scale,z);
    bar('stone',[x-.55*scale,y+1.8*scale,z],[x+.55*scale,y+1.2*scale,z],.16*scale,4);
  }
  // Seven tall round-headed windows above dark entrance panels, with heavy piers.
  for(let i=-3;i<=3;i++){
    const x=i*16;
    pane(x,4.5,-40.5,11,13.8,Math.PI,{arch:true});
    a.arch('stone',x,12.8,-41.1,11,5.5,.85,.55,Math.PI);
    box('shadow',x,2,-40.9,10,3.8,.15);box('stoneDark',x,5,-41.2,12,.8,1.2);
    for(let u=-4;u<=4;u+=near?1:2)bar('iron',[x+u,5,-41.3],[x+u,12.8+Math.sqrt(Math.max(0,30.25-u*u)),-41.3],.065,4);
    for(const y of [8,12])box('iron',x,y,-41.35,10.8,.10,.12);
  }
  for(let x=-56;x<=56;x+=16){
    box('stone',x,11,-41,3,22,2);for(const y of [2,5.5,19,21.5])box('stoneDark',x,y,-41.4,3.7,.6,2.4);
    if(near){a.column('stone',x-.95,6,-42.3,.36,13,6);a.column('stone',x+.95,6,-42.3,.36,13,6);}
    box('stoneDark',x,23,-41.3,3.5,1.2,2);figure(x,23.6,-41.4,1.2);
    if(near)for(const side of [-1,1])bar('stone',[x+side*1.5,24,-41.5],[x+side*5,22.5,-41.5],.23,5);
  }
  for(const y of [19.8,21.6])box('stoneDark',0,y,-41.5,144,.55,1.3);
  parapet(0,22,-41.3,143,0,2.4);
  // Clock pavilions continue down to the pavement, with curved stone crowns.
  for(const x of [-70,70]){
    box('stone',x,13,-34,19,26,19);a.mansard('roof',x,25.95,-32,22,23,13);
    for(const u of [-8.3,8.3]){box('stone',x+u,18,-43.8,1.7,36,2);box('stoneDark',x+u,35.5,-43.8,2.4,.7,2.7);}
    pane(x,1,-43.5,7,15,Math.PI,{arch:true});
    a.arch('stone',x,13,-44,8,4,1,.8,Math.PI);
    a.opening('stone',x-0,21,-44,15,17,{yaw:Math.PI});
    a.arch('stoneDark',x,30.5,-44.2,15,7.5,.65,.7,Math.PI);
    a.clock(x,29.7,-44.6,5.5,{yaw:Math.PI,face:'shadow',rim:'stone',hands:'roofLight'});
    if(near){
      for(let i=0;i<12;i++){const t=i*Math.PI/6;bar('roofLight',[x+Math.sin(t)*1.3,29.7+Math.cos(t)*1.3,-45],[x+Math.sin(t)*4.5,29.7+Math.cos(t)*4.5,-45],.035,4);}
      for(const side of [-1,1])figure(x+side*6,21,-44.7,1.05);
      for(const u of [-6,0,6])for(const y of [30,34])a.clock(x+u,y,-37.7, .55,{yaw:Math.PI,face:'shadow',rim:'roofLight',hands:'roofLight'});
    }
    box('stoneDark',x,39,-32,10,.5,5);cyl('stone',x,39.8,-32,.6,1.2,8);
  }
  // End elevations and the rue de Lille front: framed quads on the real wall planes.
  for(const side of [-1,1])elevation([side*107.5,0],side*Math.PI/2,-30,30,{pitch:7.5,rows:[{y:2,h:9,w:4,arch:true},{y:14,h:9,w:4,arch:true}]});
  elevation([0,40.5],0,-76,76,{pitch:7.6,rows:[{y:2,h:7.5,w:3.8,arch:true},{y:13,h:7.5,w:3.8,arch:true}]});
  for(const x of [-94,94])for(const side of [-1,1]){
    elevation([0,side*42.5],side>0?0:Math.PI,x-12,x+12,{pitch:8,rows:[{y:2,h:7,w:3.2},{y:12,h:7,w:3.2},{y:21,h:3.6,w:3.2}]});
    for(const y of [10.7,20,25.7])box('stoneDark',x,y,side*42.9,27,.55,.7);
  }
  // Dormers sit on the slate hotel wings' steep lower slopes, not in the air beside them.
  if(near)for(const x of [-94,94])for(const s of [-1,1])for(const z of [-28,-14,0,14,28]){
    const dx=x+s*12.7,yaw=s*Math.PI/2;
    a.box('stone',dx,29.25,z,2.2,4.5,2.4,yaw);roof('roof',dx,z,2.8,2.8,31.5,33,'x');
    pane(x+s*13.9,29.3,z,1.4,1.7,yaw);
  }
}

const makers={'paris-louvre':louvre,'paris-palais-garnier':garnier,'paris-grand-palais':grand,'paris-petit-palais':petit,'paris-musee-orsay':orsay};
export function createParisPalace(id,{detail='near'}={}){
  if(!makers[id])throw new Error(`Unknown Paris palace: ${id}`);
  const b=builder(id,detail);makers[id](b,detail);return b.finish();
}
export const createLouvre=options=>createParisPalace('paris-louvre',options);
export const createPalaisGarnier=options=>createParisPalace('paris-palais-garnier',options);
export const createGrandPalais=options=>createParisPalace('paris-grand-palais',options);
export const createPetitPalais=options=>createParisPalace('paris-petit-palais',options);
export const createMuseeOrsay=options=>createParisPalace('paris-musee-orsay',options);
