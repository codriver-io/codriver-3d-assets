// Original procedural Paris palace exteriors, commissioned for Codriver, 2026.
// Coordinates are local metres: east / up / south. No elevation or Mercator scale is baked in.
// MIT source; exported models are CC BY 4.0. Geographic placement © OSM contributors, ODbL.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

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
  const barrel=(mat,axis,length,r,base)=>{
    const steps=detail==='near'?28:14,arr=[];
    const point=(t,s)=>axis==='z'?[r*Math.cos(t),base+r*Math.sin(t),s]:[s,base+r*Math.sin(t),r*Math.cos(t)];
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
  return {root,put,box,bar,cyl,dome,barrel,roof,arcade,windows,finish};
}

function louvre(b,detail){
  const {box,roof,windows,cyl,dome,arcade}=b;
  // Westward U wings and east Cour Carrée. Every court remains physically open.
  const wing=(x,z,w,d,h=22)=>{box('stone',x,h/2,z,w,h,d);roof('roof',x,z,w,d,h,h+7,'x');windows(x-w/2+5,x+w/2-5,z+(z>0?d/2:-d/2),6,2,detail==='near'?9:14,4);};
  wing(135,-105,450,25);wing(135,105,450,25); // cour Napoléon wings
  wing(350,-105,110,25);wing(350,105,110,25);
  // Cour Carrée east: four long ranges leave a square void, no pyramid.
  wing(405,-105,155,23);wing(405,105,155,23);
  box('stone',477,12,0,25,24,210);roof('roof',477,0,25,210,24,32,'z');
  box('stone',332,12,0,25,24,210);roof('roof',332,0,25,210,24,32,'z');
  for(const [x,z] of [[-85,-105],[-85,105],[332,-105],[332,105],[477,-105],[477,105]]){
    box('stoneDark',x,14,z,33,28,34);roof('roof',x,z,34,34,28,41,'x');
    if(detail==='near'){for(const q of [-11,0,11])box('shadow',x+q,15,z+17,5,8,.2);}
  }
  // Pavillon Sully center of eastern range; Louvre landmark silhouette.
  box('stoneDark',332,18,0,44,36,40);cyl('stone',332,39,0,17,9);dome('roof',332,43,0,18,13);
  // West end porticoes frame court but retain broad central opening.
  box('stone',-100,12,-105,24,24,42);box('stone',-100,12,105,24,24,42);roof('roof',-100,-105,24,42,24,33,'z');roof('roof',-100,105,24,42,24,33,'z');
  if(detail==='near'){arcade(350,455,-92,1,11,7);arcade(350,455,92,1,11,7,false);}
}

function garnier(b,detail){const {box,roof,windows,cyl,dome,bar,arcade}=b;
  // Front faces south (+Z). 155m north-south, east and west pavilions widen to ~101m.
  box('stone',0,13,42,75,26,31);box('stone',0,16,-9,66,32,85);box('stone',0,16,-62,78,32,25);
  for(const x of [-44,44]){box('stone',x,13,13,19,26,45);roof('roof',x,13,20,45,26,35,'z');}
  arcade(-35,35,59,2,17,7);box('stoneDark',0,31,56,76,7,10);
  for(const x of [-31,31]){box('stoneDark',x,28,52,12,19,11);roof('roof',x,52,14,12,38,46,'z');}
  cyl('stoneDark',0,33,1,27,9);dome('roof',0,38,1,27,23);
  // Tall north fly tower and profile above the auditorium.
  box('stoneDark',0,34,-53,55,40,37);roof('roof',0,-53,59,39,54,66,'z');
  if(detail==='near'){
    windows(-33,33,57,9,2,7,6);windows(-29,29,-74,8,3,8,5);
    for(const x of [-35,-20,0,20,35]){bar('gold',[x,37,60],[x,44,60],.72);dome('gold',x,44,60,2.8,3,8);}
    for(const x of [-43,43]){bar('gold',[x,36,38],[x,46,38],.8);dome('gold',x,46,38,3,3,8);}
  }else{for(const x of [-35,0,35])bar('gold',[x,37,60],[x,43,60],1.2);}
}

function grand(b,detail){const {box,bar,cyl,dome,barrel,arcade}=b;
  // The 200m nave runs north/south; both glass barrel shoulders remain legible.
  box('stone',0,12,0,108,24,202);box('stoneDark',0,25,0,88,4,202);
  box('stone',0,14,0,142,28,40); // crossing side volumes
  // Half-cylinder glass vault over the nave, ribs separately batched.
  barrel('glass','z',190,36,28);
  const ribCount=detail==='near'?26:10;for(let i=0;i<=ribCount;i++){const z=-94+188*i/ribCount;
    for(let j=0;j<(detail==='near'?12:6);j++){const a=Math.PI*j/(detail==='near'?12:6),c=Math.PI*(j+1)/(detail==='near'?12:6);
      bar('iron',[36*Math.cos(a),28+36*Math.sin(a),z],[36*Math.cos(c),28+36*Math.sin(c),z],detail==='near'?.4:.65,5);}}
  cyl('iron',0,47,0,24,5);dome('glass',0,50,0,25,18);
  for(const z of [-82,82]){box('stoneDark',0,27,z,112,10,22);arcade(-51,51,z+(z>0?12:-12),1,18,8,z>0);}
  // Winston Churchill entrance, west/east facade rhythm.
  if(detail==='near')for(const x of [-67,67])for(let k=-8;k<=8;k++)box('stoneDark',x,11,k*11,2,22,2);
}

function petit(b,detail){const {box,roof,bar,cyl,dome,arcade}=b;
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
  box('stoneDark',-50,35,0,10,10,27);cyl('stone',-50,42,0,17,5);dome('roofLight',-50,44,0,17,11);
  // West entrance arch, two jambs and open center. Pediment and gilded gate.
  box('stone',-56,8,-12,2,16,3);box('stone',-56,8,12,2,16,3);
  const n=detail==='near'?12:6;for(let i=0;i<n;i++){
    const a=Math.PI*i/n,c=Math.PI*(i+1)/n;
    bar('stoneDark',[-56,16+12*Math.sin(a),12*Math.cos(a)],[-56,16+12*Math.sin(c),12*Math.cos(c)],1.35,6);
  }
  if(detail==='near'){for(let z=-58;z<=58;z+=7)box('stoneDark',-49.2,11,z,0.14,9,3.1);
    for(const z of [-54,54]){cyl('stoneDark',-37,28,z,7,5);dome('roofLight',-37,30,z,7,5);}}
  arcade(-20,40,-39,1,9,7);arcade(-20,40,39,1,9,7,false);
}

function orsay(b,detail){const {box,roof,bar,cyl,dome,barrel,arcade}=b;
  // Long east-west former station; north/Seine side is -Z. Stone outer wings and iron vault.
  box('stone',0,13,-31,175,26,19);box('stone',0,13,31,175,26,19);
  box('stone',-94,18,0,27,36,85);box('stone',94,18,0,27,36,85);
  roof('roof',0,-31,175,20,26,34,'x');roof('roof',0,31,175,20,26,34,'x');
  barrel('glass','x',175,31,25);
  const n=detail==='near'?24:9;for(let i=0;i<=n;i++){const x=-87+174*i/n;
    for(let j=0;j<10;j++){const a=Math.PI*j/10,c=Math.PI*(j+1)/10;
      bar('iron',[x,25+31*Math.sin(a),31*Math.cos(a)],[x,25+31*Math.sin(c),31*Math.cos(c)],detail==='near'?.35:.65,5);}}
  for(const x of [-94,94]){box('stoneDark',x,31,-41,28,14,8);cyl('clock',x,37,-45,8,1,20);
    // Dial plane oriented to river, with visible hands and rim.
    if(detail==='near'){bar('iron',[x,37,-46],[x+5,40,-46],.45);bar('iron',[x,37,-46],[x-1,43,-46],.35);}
    roof('roof',x,0,29,85,36,44,'z');}
  arcade(-78,78,-41,2,12,8,false);
  if(detail==='near')for(const x of [-66,-44,-22,0,22,44,66])box('shadow',x,17,-41.3,5,10,.15);
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
