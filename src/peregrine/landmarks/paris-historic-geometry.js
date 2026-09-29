import * as THREE from 'three';
import { assetBuilder } from './asset-geometry.js';
import { PARIS_HISTORIC_BY_ID as S, PARIS_HISTORIC_PALETTES } from './paris-historic-config.js';

// Editable common primitives; details are batched by material by assetBuilder.
function tools(id,detail){
  const spec=S[id],b=assetBuilder({...spec,palette:PARIS_HISTORIC_PALETTES.light},detail),near=detail==='near';
  const box=(m,x,y,z,w,h,d)=>b.box(m,[x,y,z],[w,h,d]);
  const cyl=(m,x,y,z,r1,r2,h,n=near?12:8)=>{
    const g=new THREE.CylinderGeometry(r1,r2,h,n);g.translate(x,y,z);b.put(g,m);
  };
  const dome=(m,x,y,z,rx,ry,rz)=>{
    const g=new THREE.SphereGeometry(1,near?32:16,near?12:6,0,Math.PI*2,0,Math.PI/2);
    g.scale(rx,ry,rz);g.translate(x,y,z);b.put(g,m);
  };
  const gable=(m,x,y,z,w,h,d)=>{
    const pts=[],idx=[];
    for(const zz of [z-d/2,z+d/2])pts.push(x-w/2,y,zz,x+w/2,y,zz,x,y+h,zz);
    idx.push(0,2,1,3,4,5,0,1,4,0,4,3,1,2,5,1,5,4,2,0,3,2,3,5);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));g.setIndex(idx);g.computeVertexNormals();b.put(g,m);
  };
  const hip=(m,x,y,z,w,d,h)=>{
    const p=[],idx=[];for(const [yy,ww,dd] of [[y,w,d],[y+h,w*.58,d*.58]])for(const [sx,sz] of [[-1,-1],[1,-1],[1,1],[-1,1]])p.push(x+sx*ww/2,yy,z+sz*dd/2);
    idx.push(0,1,5,0,5,4,1,2,6,1,6,5,2,3,7,2,7,6,3,0,4,3,4,7,4,5,6,4,6,7);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();b.put(g,m);
  };
  const windows=(x,z,count,span,levels=2,front=true)=>{
    for(let floor=0;floor<levels;floor++)for(let i=0;i<count;i++){
      const xx=x+(i-(count-1)/2)*span/(count-1||1);
      box('glass',xx,6+floor*7,z+(front?-.08:.08),near?2.1:2.8,near?4.2:4.8,.18);
      if(near){box('shade',xx,8.4+floor*7,z,2.7,.35,.55);box('shade',xx,3.55+floor*7,z,2.7,.3,.5);}
    }
  };
  return {spec,b,near,box,cyl,dome,gable,hip,windows,finish:()=>{
    const root=b.finish();root.rotation.y=spec.rotation;
    root.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift');});
    root.userData.elevationDatum='Local y=0 is a rigid foundation plane at the host-selected ground datum; no DEM or sea-level height is baked.';
    return root;
  }};
}

function pantheon(t){
  const {box,cyl,dome,gable,hip,near}=t;
  // East-west cruciform mass and four shallow corner recesses.
  box('steps',0,.8,0,79,1.6,101);
  box('stone',0,16,0,53,29,100);
  box('stone',0,16,4,80,29,33);
  for(const x of [-1,1])for(const z of [-1,1]){
    const xx=x*30,zz=z*34;
    box('shade',xx,7,zz,1.1,10,12);
    if(near)box('glass',xx,13,zz,1.2,8,5);
  }
  box('stone',0,31,0,56,2.4,103);
  gable('roof',0,32,0,54,12,99);
  gable('roof',0,32,4,80,11,32);
  // West porch: six visible front columns, a second rank and five returns
  // on either side, totaling the sourced 22 columns without a dense screen.
  box('steps',0,1.8,-59,45,3.6,21);
  const portico=[];
  for(const z of [-64,-54])for(let i=0;i<6;i++)portico.push([-20+i*8,z]);
  for(const x of [-20,20])for(let i=1;i<=5;i++)portico.push([x,-64+i*10/6]);
  for(const [x,z] of portico){
    cyl('stone',x,13.5,z,1,1.05,20,near?14:8);
    cyl('shade',x,23.8,z,near?1.6:1.4,1.12,near?.8:.55,near?12:8);
  }
  box('stone',0,24.2,-59.5,46,1.8,21);
  gable('stone',0,25,-68,46,7,2.5);
  // Open-column drum, three stepped roof stages, oculus and lantern.
  cyl('stone',0,34,4,22,22,6,near?32:20);
  cyl('shade',0,41,4,17.5,17.5,11,near?32:20);
  for(let i=0;i<32;i++){
    const a=2*Math.PI*i/32;
    cyl('stone',Math.cos(a)*19.2,41,4+Math.sin(a)*19.2,.75,.8,11,near?8:6);
  }
  cyl('stone',0,47.5,4,21,21,2,near?32:20);
  cyl('shade',0,51.5,4,18.5,19,6,near?32:20);
  dome('roof',0,54,4,18.5,22,18.5);
  cyl('stone',0,73,4,4.5,5.1,5,near?16:10);
  dome('roof',0,75.5,4,5.1,4.2,5.1);
  cyl('stone',0,79.5,4,1,1.1,5,near?10:6);
  if(near)for(let i=0;i<16;i++){
    const a=i*Math.PI*2/16;
    t.b.bar('shade',[Math.cos(a)*18.4,54,4+Math.sin(a)*18.4],[Math.cos(a)*2.5,75,4+Math.sin(a)*2.5],.19);
  }
}
function madeleine(t){
  const {box,cyl,gable,near}=t;
  // The central cella is recessed from a true continuous peristyle.
  for(let i=0;i<9;i++)box('steps',0,(i+1)*.12,-55+i*1.2,43,(i+1)*.24,1.2);
  box('steps',0,2,0,43,4,108);
  box('shade',0,14,0,27,20,79);
  for(const z of [-48,48])for(let i=0;i<8;i++)
    cyl('stone',-18+i*36/7,15,z,.85,1,20,near?12:8);
  for(const x of [-18,18])for(let i=0;i<18;i++)
    cyl('stone',x,15,-43+i*86/17,.85,1,20,near?12:8);
  box('stone',0,25.4,0,41,1.8,104);
  box('stone',0,27,0,31,1.5,87);
  gable('roof',0,27,0,31,3,86);
  for(const z of [-51,51])gable('stone',0,26,z,42,4,2);
  box('glass',0,13,-39.65,7,15,.25);
  box('stone',0,23,-51.5,42,1.2,1.3);
  if(near)for(let i=0;i<11;i++)for(const x of [-13.6,13.6]){
    const z=-34+i*6.8;
    box('glass',x,15,z,.12,5,2.6);
    box('stone',x,19,z,.35,.45,3.2);
  }
}
function hotel(t){
  const {box,hip,windows,near}=t;
  // U perimeter leaves the court and west-facing public esplanade open.
  box('stone',0,11,-37,148,22,22);
  box('stone',-62,10,2,24,20,66);
  box('stone',62,10,2,24,20,66);
  box('stone',0,9,37,148,18,18);
  for(const [x,z,w,d] of [[0,-37,148,22],[-62,2,24,66],[62,2,24,66],[0,37,148,18]])hip('slate',x,20,z,w,d,10);
  for(const x of [-64,-32,0,32,64]){
    box('stone',x,14,-50,17,28,5);
    hip('roof',x,28,-50,19,9,9);
    if(x!==0){box('stone',x,37,-50,2,2,2);hip('roof',x,38,-50,5,5,5);}
  }
  // Deep arches and entrance panels break the long facade.
  for(const x of [-52,0,52]){
    box('glass',x,5,-50.8,8,9,.24);
    box('stone',x,10,-50.8,10,1.1,1);
    for(const side of [-1,1])box('shade',x+side*5.1,5,-50.8,.8,10,1);
  }
  // Dormers and cresting repeat across the central and side roofs.
  for(const x of [-68,-55,-42,-29,-16,16,29,42,55,68]){
    box('stone',x,26,-37,3.3,4.5,1.5);
    hip('slate',x,28.2,-37,4,2.5,2.4);
  }
  // Tall clock pavilion and belfry.
  box('stone',0,30,-51,20,18,8);
  hip('roof',0,39,-51,22,11,7);
  box('clock',0,34.5,-55.15,5.6,5.6,.22);
  box('shade',0,34.5,-55.32,.25,4.2,.15);
  box('shade',0,34.5,-55.32,3.8,.25,.15);
  box('stone',0,46,-51,5,8,5);
  hip('roof',0,49,-51,8,8,1);
  windows(0,-48.1,27,140,2);
  if(near)for(const x of [-50,-25,25,50])for(const z of [-8,10])box('glass',x,8,z,1.6,4,.2);
}
function conciergerie(t){
  const {box,cyl,hip,gable,windows,near}=t;
  // The river frontage is represented without extending into the Palace.
  box('stone',0,12,-1,158,24,29);
  box('shade',0,24,-1,160,1.5,31);
  hip('slate',0,25,-1,158,29,10);
  // Clock tower at eastern end; César, Argent and Bonbec on the river line.
  const towers=[[-75,5.5,36,'round'],[-31,5.5,32,'round'],[17,5.2,31,'round'],[77,6,42,'square']];
  for(const [x,r,h,type] of towers){
    if(type==='square'){box('stone',x,h/2,-17,12,h,12);hip('roof',x,h,-17,14,14,8);}
    else{cyl('stone',x,h/2,-17,r,r,h,near?16:10);cyl('shade',x,h,-17,r+1,r+1,1,near?16:10);
      const g=new THREE.ConeGeometry(r+1.3,9,near?16:10);g.translate(x,h+5,-17);t.b.put(g,'roof');}
    if(near)for(let yy=9;yy<h-5;yy+=8)box('glass',x,yy,-17-r-.12,1.1,3,.15);
  }
  windows(0,-15.58,22,145,2);
  // Gothic dormer rhythm and a dark gate between the two central towers.
  for(let x=-66;x<70;x+=9)if(Math.abs(x+31)>7&&Math.abs(x-17)>7){
    box('stone',x,29,-15.4,3,5,1.4);
    gable('stone',x,31,-15.5,3.5,2,1.8);
  }
  box('glass',-7,5,-15.7,5.4,10,.2);
  if(near)for(let x=-67;x<70;x+=9)box('stone',x,2,-16.1,1.1,5,.6);
}
function institut(t){
  const {box,cyl,dome,hip,gable,near}=t;
  // The two arc-shaped wings form the open half-moon Seine frontage.
  const segments=near?12:8;
  for(const side of [-1,1])for(let i=0;i<segments;i++){
    const a=(i+.5)/segments, x=side*(16+a*57),z=-9+19*a*a;
    const angle=side*(.16+.45*a);
    const g=new THREE.BoxGeometry(59/segments+1,18,17);g.rotateY(angle);g.translate(x,9,z);t.b.put(g,'stone');
    const roof=new THREE.BoxGeometry(59/segments+1,2.2,18);roof.rotateY(angle);roof.translate(x,19.2,z);t.b.put(roof,'slate');
    if(near){box('glass',x,8,z-8.55,1.7,4,.16);box('glass',x,14,z-8.55,1.7,3,.16);}
  }
  for(const x of [-75,75]){box('stone',x,12,8,19,24,23);hip('slate',x,24,8,20,24,6);}
  // Chapelle, paired entrance bays, arched drum and 44 m cupola.
  box('stone',0,13,5,36,26,37);
  for(const x of [-15,-10,-5,5,10,15])cyl('stone',x,11,-15.5,.7,.78,16,near?10:6);
  box('stone',0,20,-15.5,38,1.8,5);
  gable('stone',0,21,-17,35,5,2.3);
  box('clock',0,22.5,-18.2,2.5,2.5,.15);
  cyl('stone',0,27.5,5,15.5,15.5,15,near?28:16);
  for(let i=0;i<16;i++){const a=i*Math.PI*2/16;
    const x=Math.cos(a)*15.52,z=5+Math.sin(a)*15.52;
    cyl('stone',x,30,z,.55,.62,6,near?8:6);
    if(i%2===0)box('glass',Math.cos(a)*15.7,28.5,5+Math.sin(a)*15.7,1.8,3,.18);
  }
  cyl('shade',0,34,5,16,16,2,near?28:16);
  dome('slate',0,35,5,15,8,15);
  if(near)for(let i=0;i<16;i++){
    const a=i*Math.PI*2/16;
    t.b.bar('gold',[Math.cos(a)*14.8,35,5+Math.sin(a)*14.8],[Math.cos(a)*2.3,42,5+Math.sin(a)*2.3],.14);
  }
  cyl('stone',0,42,5,2.2,2.6,2,near?12:8);
  dome('slate',0,43,5,2.6,1,2.6);
}

export function createParisHistoric(id,{detail='near'}={}){
  if(!S[id])throw new Error('Unknown Paris historic landmark: '+id);
  const t=tools(id,detail);
  ({'paris-pantheon':pantheon,'paris-hotel-de-ville':hotel,'paris-conciergerie':conciergerie,'paris-madeleine':madeleine,'paris-institut-de-france':institut})[id](t);
  return t.finish();
}
export const createPantheon=options=>createParisHistoric('paris-pantheon',options);
export const createHotelDeVille=options=>createParisHistoric('paris-hotel-de-ville',options);
export const createConciergerie=options=>createParisHistoric('paris-conciergerie',options);
export const createMadeleine=options=>createParisHistoric('paris-madeleine',options);
export const createInstitutDeFrance=options=>createParisHistoric('paris-institut-de-france',options);
