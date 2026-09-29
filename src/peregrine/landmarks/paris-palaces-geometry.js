// Original procedural Paris palace exteriors, commissioned for Codriver, 2026.
// Coordinates are local metres: east / up / south. No elevation or Mercator scale is baked in.
// MIT source; exported models are CC BY 4.0. Geographic placement © OSM contributors, ODbL.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { architecture } from './paris-architecture.js';

export const PARIS_PALACES = Object.freeze({
  'paris-louvre': {name:'Palais du Louvre',origin:[2.3335,48.86124],radius:490,
    description:'Historic east palace around the Cour Carrée and the long north and south wings around the Cour Napoléon; pyramid excluded.',
    references:['https://presse.louvre.fr/le-musee-du-louvre-1063000201419/?lang=fr','https://www.louvre.fr/en/explore/the-palace/a-pyramid-for-a-symbol']},
  'paris-palais-garnier': {name:'Palais Garnier',origin:[2.33164,48.87203],radius:115,
    description:'South colonnaded front, domed auditorium, tall northern fly tower and gilded roof silhouettes.',
    references:['https://www.operadeparis.fr/apropos/theatres-et-ateliers/palais-garnier']},
  'paris-grand-palais': {name:'Grand Palais',origin:[2.31253,48.86612],radius:180,
    description:'Stone enclosure, long glazed barrel nave, crossing dome and dense but economical structural ribs.',
    references:['https://www.grandpalais.fr/sites/default/files/BROCHURE-LOCATION-GRAND-PALAIS.pdf']},
  'paris-petit-palais': {name:'Petit Palais',origin:[2.31454,48.86603],radius:105,
    description:'West entrance arch, long colonnaded facade, domed entry and open curved garden court.',
    references:['https://www.petitpalais.paris.fr/professionnels/tournage-et-prise-de-vue','https://parismusees.paris.fr/en/node/5829']},
  'paris-musee-orsay': {name:'Musée d’Orsay',origin:[2.32575,48.86000],radius:190,
    description:'Long former station along the Seine with curved iron roof, end pavilions and clock bays.',
    references:['https://www.musee-orsay.fr/en/museum/history-museum','https://data.bnf.fr/en/ark:/12148/cb12042796j.pdf']},
});

const COLORS={stone:0xbdb5a2,stoneDark:0x9c927f,roof:0x555965,roofLight:0x718087,glass:0x728d91,iron:0x526267,gold:0xc7a553,shadow:0x46515a,clock:0xe6dec7};

function builder(id,detail) {
  const root=new THREE.Group();root.name=id;root.userData={landmark:id,detail,units:'metres',origin:PARIS_PALACES[id].origin,
    provenance:'Original geometry commissioned for Codriver; map placement © OpenStreetMap contributors'};
  const bins=new Map();
  const put=(g,mat)=>{g.deleteAttribute('uv');if(!g.index)g.setIndex(Array.from({length:g.attributes.position.count},(_,i)=>i));if(!bins.has(mat))bins.set(mat,[]);bins.get(mat).push(g);};
  const box=(mat,x,y,z,w,h,d)=>{const g=new THREE.BoxGeometry(w,h,d);g.translate(x,y,z);put(g,mat);};
  const bar=(mat,a,b,r=0.35,sides=6)=>{const p=new THREE.Vector3(...a),q=new THREE.Vector3(...b),len=p.distanceTo(q);if(len<0.01)return;
    const g=new THREE.CylinderGeometry(r,r,len,sides,1);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),q.clone().sub(p).normalize()));g.translate(...p.add(q).multiplyScalar(0.5).toArray());put(g,mat);};
  const cyl=(mat,x,y,z,r,h,sides=detail==='near'?16:10)=>{const g=new THREE.CylinderGeometry(r,r,h,sides,1);g.translate(x,y,z);put(g,mat);};
  const dome=(mat,x,y,z,r,h,segments=detail==='near'?20:12)=>{const g=new THREE.SphereGeometry(r,segments,Math.max(5,segments/2),0,Math.PI*2,0,Math.PI/2);
    g.scale(1,h/r,1);g.translate(x,y,z);put(g,mat);};
  const barrel=(mat,axis,length,r,base,rise=r)=>{
    const steps=detail==='near'?28:14,arr=[];
    const point=(t,s)=>axis==='z'?[r*Math.cos(t),base+rise*Math.sin(t),s]:[s,base+rise*Math.sin(t),r*Math.cos(t)];
    for(let i=0;i<steps;i++){
      const a=Math.PI*i/steps,c=Math.PI*(i+1)/steps;
      const p=point(a,-length/2),q=point(a,length/2),u=point(c,-length/2),v=point(c,length/2);
      arr.push(...p,...q,...v,...p,...v,...u);
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(arr,3));g.computeVertexNormals();put(g,mat);
  };
  const roof=(mat,x,z,w,d,eave,ridge,axis='x')=>{
    // Closed double slope, ridgeline along axis, sitting on top of a rigid mass.
    const a=axis==='x'?w:d,b=axis==='x'?d:w,vertices=[-a/2,eave,-b/2, a/2,eave,-b/2, -a/2,eave,b/2,a/2,eave,b/2,-a/2,ridge,0,a/2,ridge,0];
    const pts=[];for(let i=0;i<vertices.length;i+=3){const u=vertices[i],v=vertices[i+1],t=vertices[i+2];pts.push(axis==='x'?[x+u,v,z+t]:[x+t,v,z+u]);}
    const ix=[0,1,5,0,5,4,2,4,5,2,5,3,0,4,2,1,3,5,0,2,3,0,3,1];const arr=[];for(const n of ix)arr.push(...pts[n]);const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(arr,3));g.computeVertexNormals();put(g,mat);
  };
  const arcade=(x0,x1,z,y=2,height=12,spacing=6,front=true)=>{
    const count=Math.max(1,Math.floor((x1-x0)/spacing));for(let i=0;i<=count;i++){
      const x=x0+(x1-x0)*i/count;box('stone',x,y+height/2,z,detail==='near'?0.95:1.3,height,1.2);
      if(i<count&&detail==='near'){const nx=x0+(x1-x0)*(i+0.5)/count;box('shadow',nx,y+height*0.55,z+(front?0.12:-0.12),(x1-x0)/count-1.45,height*0.63,0.18);}
    }
    box('stoneDark',(x0+x1)/2,y+height+1,z,x1-x0+2,2,2.3);
  };
  const windows=(x0,x1,z,y0,rows,spacing=8,height=5)=>{if(detail==='far')return;const n=Math.floor((x1-x0)/spacing);
    for(let row=0;row<rows;row++)for(let i=0;i<n;i++){const x=x0+(i+0.5)*(x1-x0)/n;box('shadow',x,y0+row*(height+2),z,Math.min(3.4,spacing*.55),height,0.13);
      box('stoneDark',x,y0+row*(height+2)-height/2-0.25,z,Math.min(4,spacing*.63),0.45,0.32);}
  };
  const finish=()=>{for(const [name,geoms] of bins){const geometry=mergeGeometries(geoms);for(const g of geoms)g.dispose();geometry.computeBoundingBox();geometry.computeBoundingSphere();
      const material=new THREE.MeshStandardMaterial({color:COLORS[name],roughness:name==='glass'?.43:.86,metalness:['iron','gold'].includes(name)?.34:0,side:THREE.DoubleSide});material.name=name;
      const mesh=new THREE.Mesh(geometry,material);mesh.name=`${id}-${name}`;root.add(mesh);}
    return root;};
  return {root,put,box,bar,cyl,dome,barrel,roof,arcade,windows,finish,a:architecture(put,detail==='near')};
}

function louvre(b,detail){
  const {box,roof,windows,cyl,dome,arcade,a}=b;
  // Westward U wings and east Cour Carrée. Every court remains physically open.
  const wing=(x,z,w,d,h=22)=>{box('stone',x,h/2,z,w,h,d);roof('roof',x,z,w,d,h,h+7,'x');windows(x-w/2+5,x+w/2-5,z+(z>0?d/2:-d/2),6,2,detail==='near'?9:14,4);};
  wing(135,-105,450,25);wing(135,105,450,25); // cour Napoléon wings
  wing(350,-105,110,25);wing(350,105,110,25);
  // Cour Carrée east: four long ranges leave a square void, no pyramid.
  wing(405,-105,155,23);wing(405,105,155,23);
  box('stone',477,12,0,25,24,210);roof('roof',477,0,25,210,24,32,'z');
  box('stone',332,12,0,25,24,210);roof('roof',332,0,25,210,24,32,'z');
  for(const [x,z] of [[-85,-105],[-85,105],[332,-105],[332,105],[477,-105],[477,105]]){
    box('stoneDark',x,14,z,33,28,34);a.mansard('roof',x,28,z,34,34,13);
    if(detail==='near'){for(const q of [-11,0,11])box('shadow',x+q,15,z+17,5,8,.2);}
  }
  // Pavillon Sully center of eastern range; Louvre landmark silhouette.
  box('stoneDark',332,18,0,44,36,40);a.mansard('roof',332,36,0,44,40,18);
  box('stone',332,42,-20,16,12,2);a.clock(332,43,-21.2,2.1,{yaw:Math.PI});
  // West end porticoes frame court but retain broad central opening.
  box('stone',-100,12,-105,24,24,42);box('stone',-100,12,105,24,24,42);roof('roof',-100,-105,24,42,24,33,'z');roof('roof',-100,105,24,42,24,33,'z');
  // Recessed bays, projecting orders and dormers on both long elevations.
  for(const z of [-117.7,-92.3,92.3,117.7]){
    const yaw=z===-117.7||z===92.3?Math.PI:0;
    for(let x=-70;x<470;x+=detail==='near'?8:16){
      for(const y of [2,12])a.window(x,y,z,3.2,7,{yaw,glass:'shadow',stone:'stoneDark',arched:y===2});
      if(detail==='near'){
        a.column('stone',x+3.3,10,z,.3,10,6);
        box('stone',x,26,z*.96,3.4,5,1.8);a.mansard('roof',x,28.5,z*.96,4.2,3,2);
      }
    }
    for(const y of [10.5,21.7])box('stoneDark',197,y,z,542,.6,.6);
  }
  // East colonnade remains an open screen in front of the wall.
  for(let z=-88;z<89;z+=detail==='near'?6:12)for(const dz of [-.8,.8])a.column('stone',490.3,10,z+dz,.5,12,detail==='near'?8:6);
  for(const z of [-62,62])box('stone',490.3,23,z,3,2,115);
  if(detail==='near'){arcade(350,455,-92,1,11,7);arcade(350,455,92,1,11,7,false);}
}

function garnier(b,detail){const {box,roof,cyl,bar,a}=b,near=detail==='near';
  box('stone',0,13,42,75,26,31);box('stone',0,16,-9,66,32,85);box('stone',0,16,-62,78,32,25);
  for(const x of [-38,38]){
    cyl('stone',x,13,9,12,26);a.dome('roofLight',x,26,9,12,9);
    for(let i=0;i<12;i++){const t=i*Math.PI/6;a.window(x+12.1*Math.sin(t),6,9+12.1*Math.cos(t),3,12,{yaw:t,glass:'shadow',stone:'stoneDark'});}
  }
  // Seven entrance arcades; paired Corinthian upper order and recessed loggia.
  for(let i=0;i<7;i++){
    const x=-25.5+i*8.5;
    a.window(x,1,57.7,5,10,{glass:'shadow',stone:'stoneDark'});
    a.window(x,15,57.7,4.7,11,{glass:'shadow',stone:'stoneDark'});
    for(const dx of [-3.05,3.05])a.column('stone',x+dx,13.7,60,.65,13.7);
    if(near){a.balustrade('stone',x,12,60,6);a.clock(x,30.5,58.8,1.1,{face:'gold',rim:'stone',hands:'gold'});}
  }
  for(const y of [12,27.7,29,33.5])box('stoneDark',0,y,59,77,.8,3);
  for(const x of [-34,34]){
    box('stone',x,21,58,10,19,5);a.mansard('roof',x,35,52,14,15,6);
    a.window(x,3,61,5,9,{glass:'shadow',stone:'stoneDark'});
    box('gold',x,24,61,6,.5,.1);
  }
  cyl('stoneDark',0,33,1,25,7);a.dome('roofLight',0,36.5,1,25,17,{ribs:near?24:12,ribMaterial:'iron'});
  box('stone',0,41,-53,55,26,37);roof('roof',0,-53,59,39,54,66,'x');
  // Apollo/lyre at the high fly tower and winged roof groups at the front ends.
  for(const [x,y,z] of [[-34,37,56],[34,37,56],[0,66,-53]]){
    bar('gold',[x,y,z],[x,y+5,z],.52);cyl('gold',x,y+5.5,z,.58,1.1,8);
    for(const side of [-1,1]){bar('gold',[x,y+3.5,z],[x+side*2.7,y+5.4,z],.26);bar('gold',[x+side*2.7,y+5.4,z],[x+side*3.3,y+7,z],.18);}
  }
  for(const side of [-1,1])for(let z=-66;z<45;z+=near?8:16)for(const y of [4,18])a.window(side*33.2,y,z,3.8,9,{yaw:side*Math.PI/2,glass:'shadow',stone:'stoneDark'});
  for(let i=0;i<6;i++)box('stone',0,(6-i)*.14,59+i*.8,77,(6-i)*.28,.9);
}

function grand(b,detail){const {box,bar,cyl,barrel,a}=b,near=detail==='near';
  // 200m long nave / 50m clear width; low shoulders and a taller crossing.
  // Vertical exterior envelope is a photograph estimate, not interior clear height.
  for(const x of [-41,41])box('stone',x,11,0,24,22,202);
  for(const z of [-93,93])box('stone',0,12,z,108,24,18);
  box('stone',0,11,0,142,22,36);
  barrel('glass','z',184,25,22,18);
  const ribs=near?32:14,n=near?20:10;
  for(let i=0;i<=ribs;i++){
    const z=-92+184*i/ribs;
    for(let j=0;j<n;j++){const t=Math.PI*j/n,q=Math.PI*(j+1)/n;bar('iron',[25*Math.cos(t),22+18*Math.sin(t),z],[25*Math.cos(q),22+18*Math.sin(q),z],near?.22:.35);}
  }
  for(let j=1;j<12;j++){const t=Math.PI*j/12;bar('iron',[25*Math.cos(t),22+18*Math.sin(t),-92],[25*Math.cos(t),22+18*Math.sin(t),92],.15);}
  cyl('iron',0,35,0,17,4);a.dome('glass',0,37,0,18,12,{ribs:near?24:12,ribMaterial:'iron'});
  cyl('iron',0,51,0,2,5);bar('iron',[0,53.5,0],[0,58,0],.18);
  for(const side of [-1,1]){
    const x=side*54.1,yaw=side*Math.PI/2;
    for(let z=-82;z<=82;z+=near?8:16){
      a.window(x,3,z,4.5,13,{yaw,glass:'shadow',stone:'stoneDark'});
      a.column('stone',x+side*.8,1,z+3.3,.6,18);
    }
    for(const y of [2,19.5,22])box('stoneDark',x,y,0,2,.6,190);
    a.balustrade('stone',x,22,0,187,Math.PI/2);
    // Projecting central entrance order and pediment.
    for(const z of [-12,-6,6,12])a.column('stone',side*72,0,z,1,20);
    box('stone',side*71,21,0,4,2,34);
    const g=new THREE.ConeGeometry(17,7,4);g.rotateY(Math.PI/4);g.scale(.13,1,1);a.place(g,'stone',side*71,25,0);
  }
  for(const z of [-94,94])for(let x=-42;x<=42;x+=near?8.4:16.8)a.window(x,3,z+(z>0?9.1:-9.1),4.5,15,{yaw:z>0?0:Math.PI,glass:'shadow',stone:'stoneDark'});
}

function petit(b,detail){const {box,roof,bar,cyl,dome,arcade,a}=b;
  // Entrance faces west (-X); 125m historic frontage and open courtyard east.
  box('stone',-36,13,-39,25,26,47);box('stone',-36,13,39,25,26,47);
  box('stone',-36,23,0,25,6,31);roof('roof',-36,0,25,125,26,34,'z');
  box('stone',7,11,-51,75,22,19);roof('roof',7,-51,75,19,22,29,'x');
  box('stone',7,11,51,75,22,19);roof('roof',7,51,75,19,22,29,'x');
  // Curved peristyle encloses, but does not cover, the garden court.
  for(let i=0;i<=12;i++){const a=-Math.PI/2+Math.PI*i/12;const x=16+37*Math.cos(a),z=37*Math.sin(a);
    cyl('stone',x,7,z,detail==='near'?.85:1.2,14,7);
    if(i>0){const p=-Math.PI/2+Math.PI*(i-1)/12;bar('stoneDark',[16+37*Math.cos(p),15,37*Math.sin(p)],[x,15,z],1.1,5);}}
  for(const z of [-12,12])box('stoneDark',-50,20,z,10,40,3);
  box('stoneDark',-50,35,0,10,10,27);cyl('stone',-43,37,0,14,3);a.dome('roofLight',-43,38.5,0,14,9,{ribs:detail==='near'?16:8,ribMaterial:'iron'});
  // West entrance arch, two jambs and open center. Pediment and gilded gate.
  box('stone',-56,8,-12,2,16,3);box('stone',-56,8,12,2,16,3);
  const n=detail==='near'?12:6;for(let i=0;i<n;i++){
    const a=Math.PI*i/n,c=Math.PI*(i+1)/n;
    bar('stoneDark',[-56,16+12*Math.sin(a),12*Math.cos(a)],[-56,16+12*Math.sin(c),12*Math.cos(c)],1.35,6);
  }
  if(detail==='near'){for(let z=-58;z<=58;z+=7)box('stoneDark',-49.2,11,z,0.14,9,3.1);
    for(const z of [-54,54]){cyl('stoneDark',-37,28,z,7,5);dome('roofLight',-37,30,z,7,5);}}
  for(const z of [-55,-47,-39,-31,31,39,47,55]){
    a.window(-48.7,5,z,4.6,13,{yaw:-Math.PI/2,glass:'shadow',stone:'stoneDark'});
    a.column('stone',-50,3,z+3.2,.65,18);
  }
  for(const z of [-60,60])for(let x=-26;x<40;x+=detail==='near'?8:16)a.window(x,4,z,4.3,12,{yaw:z>0?0:Math.PI,glass:'shadow',stone:'stoneDark'});
  for(const z of [-42,42])a.balustrade('stone',-49.3,26,z,37,Math.PI/2);
  if(detail==='near')for(let z=-10;z<=10;z+=.65)bar('gold',[-56.5,1,z],[-56.5,15+10*Math.sqrt(1-(z/12)**2),z],.055);
  arcade(-20,40,-39,1,9,7);arcade(-20,40,39,1,9,7,false);
}

function orsay(b,detail){const {box,roof,bar,barrel,a}=b,near=detail==='near';
  // Official hall: 138 x 40 x 32m. The stone hotel envelope surrounds it.
  box('stone',0,11,-31,175,22,19);box('stone',0,11,31,175,22,19);
  box('stone',-94,15,0,27,30,85);box('stone',94,15,0,27,30,85);
  a.mansard('roof',0,22,-31,175,20,10);a.mansard('roof',0,22,31,175,20,10);
  barrel('glass','x',138,20,20,12);
  for(let i=0;i<=(near?28:12);i++){
    const x=-69+138*i/(near?28:12),n=near?16:8;
    for(let j=0;j<n;j++){const t=Math.PI*j/n,q=Math.PI*(j+1)/n;bar('iron',[x,20+12*Math.sin(t),20*Math.cos(t)],[x,20+12*Math.sin(q),20*Math.cos(q)],near?.16:.28);}
  }
  for(let j=1;j<10;j++){const t=Math.PI*j/10;bar('iron',[-69,20+12*Math.sin(t),20*Math.cos(t)],[69,20+12*Math.sin(t),20*Math.cos(t)],.12);}
  for(const x of [-94,94])a.mansard('roof',x,30,0,29,85,10);
  for(const side of [-1,1]){
    const z=side*40.7,yaw=side>0?0:Math.PI;
    for(let x=-76;x<=76;x+=near?7.6:15.2){
      a.window(x,1,z,4.5,10,{yaw,glass:'shadow',stone:'stoneDark'});
      a.window(x,13,z,3.4,6.5,{yaw,glass:'shadow',stone:'stoneDark',arched:false});
      if(near){box('stone',x,25,z*.94,3.8,5,1.7);a.mansard('roof',x,27.5,z*.94,4.6,3,2.5);}
    }
    for(const y of [11.8,21.5])box('stoneDark',0,y,z,180,.65,.8);
    // The Seine-facing monumental dials stand vertically in two roof pavilions.
    if(side===-1)for(const x of [-61,61]){
      box('stone',x,26,-40.8,16,14,4);a.clock(x,27,-43,4.3,{yaw:Math.PI});
      a.mansard('roof',x,33,-39,19,8,4);
    }
  }
  for(const side of [-1,1])for(let z=-30;z<=30;z+=near?7.5:15)for(const y of [2,14])a.window(side*107.7,y,z,4,9,{yaw:side*Math.PI/2,glass:'shadow',stone:'stoneDark'});
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
