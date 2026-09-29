// Original procedural Paris palace exteriors, commissioned for Codriver, 2026.
// Coordinates are local metres: east / up / south. No elevation or Mercator scale is baked in.
// MIT source; exported models are CC BY 4.0. Geographic placement © OSM contributors, ODbL.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { architecture } from './paris-architecture.js';

export const PARIS_PALACES = Object.freeze({
  'paris-louvre': {name:'Palais du Louvre',origin:[2.3335,48.86124],radius:490,
    description:'Historic east palace around the Cour Carrée and the long north and south wings around the Cour Napoléon, including the glass entrance pyramid.',
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

const COLORS={stone:0xbdb5a2,stoneDark:0x9c927f,roof:0x555965,roofLight:0x718087,glass:0x728d91,iron:0x526267,gold:0xc7a553,shadow:0x46515a,clock:0xe6dec7,glazing:0xbed3d5};

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
      const material=new THREE.MeshStandardMaterial({color:COLORS[name],roughness:name==='glass'?.43:.86,metalness:['iron','gold'].includes(name)?.34:0,side:THREE.DoubleSide});if(name==='glazing'){material.transparent=true;material.opacity=.32;material.depthWrite=false;material.roughness=.18;}material.name=name;
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
  // Cour Carrée east: four long ranges leave a square void.
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
        box('shadow',x,25.75,z*.96+Math.cos(yaw)*1.01,1.8,3.1,.12);
        box('stoneDark',x,25.75,z*.96+Math.cos(yaw)*1.12,.12,3.1,.2);
      }
    }
    for(const y of [10.5,21.7])box('stoneDark',197,y,z,542,.6,.6);
  }
  // Projecting Napoleon III pavilions and taller mansards break the long ranges.
  // Their bays are estimates; the courtyard remains open between the projections.
  for(const side of [-1,1])for(const x of [90,205]){
    const z=side*91,front=side*77,yaw=side<0?0:Math.PI;
    box('stone',x,15,z,31,30,28);a.mansard('roof',x,30,z,33,30,14);
    for(const y of [1.5,12,22])for(const u of [-9,0,9])a.window(x+u,y,front,4.3,y===22?5.8:8,{yaw,glass:'shadow',stone:'stoneDark'});
    for(const u of [-13,-5,5,13])a.column('stone',x+u,11,front,.45,18,detail==='near'?8:5);
    for(const y of [11,21,29])box('stoneDark',x,y,front,33,.65,1.2);
    box('stone',x,36,front+side*2,9,10,2.5);
    a.window(x,32,front+side*.65,4,6,{yaw,glass:'shadow',stone:'stoneDark'});
    roof('stone',x,front+side*1.5,12,3,41,44);
    for(const u of [-11,11]){box('stone',x+u,42,z,1.7,6,3);box('stoneDark',x+u,45,z,2.2,.5,3.6);}
  }
  // Pavillon de l'Horloge faces the Cour Napoléon to the west (-X).
  for(const u of [-13,-6.5,0,6.5,13])for(const y of [2,13,25])a.window(309.8,y,u,4.2,8,{yaw:-Math.PI/2,glass:'shadow',stone:'stoneDark'});
  for(const z of [-18,-10,10,18])a.column('stone',309,12,z,.6,22,detail==='near'?8:5);
  box('stone',309.7,40,0,2,12,14);
  a.clock(308.5,41,0,3,{yaw:-Math.PI/2});
  for(const range of [332,477])for(const side of [-1,1]){
    const x=range+side*12.7,yaw=side*Math.PI/2;
    for(let z=-84;z<=84;z+=detail==='near'?8:16){
      if(range===332&&Math.abs(z)<24)continue;
      for(const y of [2,13])a.window(x,y,z,3.5,8,{yaw,glass:'shadow',stone:'stoneDark',arched:y===2});
      if(detail==='near')box('stoneDark',x+side*.12,12,z+3.6,.6,21,.5);
    }
    for(const y of [11,23.5])box('stoneDark',x,y,0,.8,.55,202);
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
    const n=detail==='near'?18:8;
    for(let k=1;k<n;k++){
      const t=k/n;b.bar('roofLight',mix(l,r,t),mix(l,tip,t),detail==='near'?.045:.075,4);
      b.bar('roofLight',mix(r,l,t),mix(r,tip,t),detail==='near'?.045:.075,4);
    }
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

function grand(b,detail){const {box,cyl,a,put}=b,near=detail==='near';
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
    const n=near?36:18,steps=near?Math.ceil((hi-lo)/2):Math.ceil((hi-lo)/7);
    const p=(t,s,inner=0)=>axis==='z'?[(25-inner)*Math.cos(t),22+(20-inner)*Math.sin(t),s]:[s,22+(20-inner)*Math.sin(t),(25-inner)*Math.cos(t)];
    for(let j=0;j<n;j++){
      const t=j*Math.PI/n,q=(j+1)*Math.PI/n;
      surface([p(t,lo),p(t,hi),p(q,hi),p(t,lo),p(q,hi),p(q,lo)]);
      bar('iron',p(t,lo),p(t,hi),j%3===0?.16:.075,4);
    }
    for(let i=0;i<=steps;i++){
      const s=lo+(hi-lo)*i/steps,major=i%4===0||i===steps;
      for(let j=0;j<n;j++){
        const t=j*Math.PI/n,q=(j+1)*Math.PI/n;
        bar('iron',p(t,s),p(q,s),major?.25:.075,4);
        if(near&&major){bar('iron',p(t,s,1.1),p(q,s,1.1),.16,4);bar('iron',p(t,s),p(q,s,1.1),.095,4);}
      }
    }
    // Raised glazed ridge lantern, with vertical clerestory sides and fine mullions.
    const len=hi-lo,mid=(lo+hi)/2;
    box('glass',axis==='z'?0:mid,42.3,axis==='z'?mid:0,axis==='z'?4:len,1.6,axis==='z'?len:4);
    for(const side of [-1,1]){
      bar('iron',axis==='z'?[side*2,43.2,lo]:[lo,43.2,side*2],axis==='z'?[side*2,43.2,hi]:[hi,43.2,side*2],.14,4);
    }
  }
  vault('z',-65,-25);vault('z',25,65);vault('x',-64,-25);vault('x',25,64);
  // Rounded glazed apses close the north/south nave; no open tunnel ends.
  for(const side of [-1,1]){
    const na=near?28:14,np=near?18:9;
    const p=(theta,phi)=>[25*Math.cos(theta)*Math.sin(phi),22+20*Math.cos(phi),side*(65+27*Math.sin(theta)*Math.sin(phi))];
    for(let i=0;i<na;i++)for(let j=0;j<np;j++){
      const t=i*Math.PI/na,q=(i+1)*Math.PI/na,v=j*Math.PI/(2*np),w=(j+1)*Math.PI/(2*np);
      surface([p(t,v),p(q,v),p(q,w),p(t,v),p(q,w),p(t,w)]);
      bar('iron',p(t,v),p(t,w),i%4===0?.20:.075);bar('iron',p(t,w),p(q,w),j%4===0?.16:.075);
    }
    // Vertical fan glazing above the projecting transverse entrance pediment.
    const shape=new THREE.Shape();shape.moveTo(-25,0);shape.lineTo(25,0);
    for(let i=1;i<=32;i++){const t=i*Math.PI/32;shape.lineTo(25*Math.cos(t),20*Math.sin(t));}shape.closePath();
    a.place(new THREE.ShapeGeometry(shape), 'glass',side*64,22,0,side*Math.PI/2);
    for(let u=-24;u<=24;u+=near?2:6){const y=22+20*Math.sqrt(1-(u/25)**2);bar('iron',[side*64.1,22,u],[side*64.1,y,u],.10);}
    for(let h=4;h<20;h+=near?2:4){const half=25*Math.sqrt(1-(h/20)**2);bar('iron',[side*64.1,22+h,-half],[side*64.1,22+h,half],.10);}
  }
  // Four intersecting vault shoulders under the low circular crossing cupola.
  const count=near?20:10,point=(x,z)=>[x,22+20*Math.sqrt(Math.max(0,1-(Math.min(Math.abs(x),Math.abs(z))/25)**2)),z];
  for(let i=0;i<count;i++)for(let j=0;j<count;j++){
    const x=-25+i*50/count,z=-25+j*50/count,d=50/count;
    if(Math.hypot(x+d/2,z+d/2)<15.5)continue;
    const p=point(x,z),q=point(x+d,z),r=point(x+d,z+d),s=point(x,z+d);
    surface([p,s,q,q,s,r]);bar('iron',p,q,.085,4);bar('iron',p,s,.085,4);
  }
  // Radial ribs AND concentric glazing rings follow the flattened dome profile.
  const profile=[[1,0],[.98,.14],[.9,.36],[.75,.63],[.50,.83],[.2,.97],[0,1]];
  a.dome('glass',0,40.5,0,19,6,{profile,ribs:near?48:24,ribMaterial:'iron'});
  for(const [r,h] of profile.slice(0,-1)){
    const n=near?64:32;for(let j=0;j<n;j++){const t=j*2*Math.PI/n,q=(j+1)*2*Math.PI/n;bar('iron',[19*r*Math.cos(t),40.5+6*h,19*r*Math.sin(t)],[19*r*Math.cos(q),40.5+6*h,19*r*Math.sin(q)],.13,4);}
  }
  cyl('iron',0,46.9,0,3.5,.5);cyl('glass',0,48.5,0,2.5,3);
  for(let i=0;i<8;i++){const t=i*Math.PI/4;bar('iron',[2.5*Math.cos(t),47,2.5*Math.sin(t)],[1.8*Math.cos(t),50.5,1.8*Math.sin(t)],.14,4);}
  a.dome('iron',0,50,0,2.7,2);cyl('iron',0,53.3,0,.55,3);bar('iron',[0,54.8,0],[0,58,0],.12);
  for(const side of [-1,1]){
    const x=side*54.1,yaw=side*Math.PI/2;
    for(let z=-82;z<=82;z+=near?8:16){a.window(x,3,z,4.5,13,{yaw,glass:'shadow',stone:'stoneDark'});a.column('stone',x+side*.8,1,z+3.3,.6,18);}
    for(const y of [2,19.5,22])box('stoneDark',x,y,0,2,.6,190);
    a.balustrade('stone',x,22,0,187,Math.PI/2);
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

function orsay(b,detail){const {box,roof,bar,barrel,a,cyl}=b,near=detail==='near';
  // The 138 x 40 x 32 m hall is wrapped by the stone station/hotel envelope.
  // Seine elevation: seven huge arches, two clock towers and steep slate roofs.
  box('stone',0,11,-31,175,22,19);box('stone',0,11,31,175,22,19);
  for(const x of [-94,94]){box('stone',x,13,0,27,26,85);a.mansard('roof',x,26,0,29,85,10);}
  a.mansard('roof',0,22,31,175,20,10);
  // Broad, steep river-side roof with raised longitudinal glazing strips.
  roof('roof',0,-29,142,25,22,34,'x');
  barrel('glass','x',138,20,20,12);
  for(const z of [-12,12]){box('glass',0,33.1,z,140,1.4,2.2);box('iron',0,34,z,141,.3,2.8);}
  box('roof',0,34.6,0,138,1.4,16);
  for(let x=-68;x<=68;x+=near?2.5:7){
    for(const z of [-12,12])box('iron',x,33.2,z,.09,1.4,2.4);
    if(near)bar('roofLight',[x,22.2,-41.4],[x,34,-29],.055,4);
  }
  for(let i=0;i<=(near?28:12);i++){
    const x=-69+138*i/(near?28:12),n=near?16:8;
    for(let j=0;j<n;j++){const t=Math.PI*j/n,q=Math.PI*(j+1)/n;bar('iron',[x,20+12*Math.sin(t),20*Math.cos(t)],[x,20+12*Math.sin(q),20*Math.cos(q)],near?.14:.25,4);}
  }
  function figure(x,y,z,scale=1){
    cyl('stoneDark',x,y+.95*scale,z,.27*scale,1.9*scale,6);
    const g=new THREE.SphereGeometry(.32*scale,8,5);a.place(g,'stone',x,y+2.15*scale,z);
    bar('stone',[x-.55*scale,y+1.8*scale,z],[x+.55*scale,y+1.2*scale,z],.16*scale,4);
  }
  // Seven tall round-headed windows above dark entrance panels, with heavy piers.
  for(let i=-3;i<=3;i++){
    const x=i*16;
    a.window(x,4.5,-40.8,11,13.8,{yaw:Math.PI,glass:'shadow',stone:'stoneDark',mullions:false});
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
  a.balustrade('stone',0,22,-41.3,143);
  // Clock pavilions continue down to the pavement, with curved stone crowns.
  for(const x of [-70,70]){
    box('stone',x,13,-34,19,26,19);a.mansard('roof',x,26,-32,22,23,13);
    for(const u of [-8.3,8.3]){box('stone',x+u,18,-43.8,1.7,36,2);box('stoneDark',x+u,35.5,-43.8,2.4,.7,2.7);}
    a.window(x,1,-43.7,7,15,{yaw:Math.PI,glass:'shadow',stone:'stoneDark'});
    a.arch('stone',x,13,-44,8,4,1,.8,Math.PI);
    a.opening('stone',x-0,21,-44,15,17,{yaw:Math.PI});
    a.arch('stoneDark',x,30.5,-44.2,15,7.5,.65,.7,Math.PI);
    a.clock(x,29.7,-44.6,5.5,{yaw:Math.PI,face:'shadow',rim:'stone',hands:'roofLight'});
    for(let i=0;i<12;i++){const t=i*Math.PI/6;bar('roofLight',[x+Math.sin(t)*1.3,29.7+Math.cos(t)*1.3,-45],[x+Math.sin(t)*4.5,29.7+Math.cos(t)*4.5,-45],.035,4);}
    if(near){for(const side of [-1,1])figure(x+side*6,21,-44.7,1.05);
      for(const u of [-6,0,6])for(const y of [30,34])a.clock(x+u,y,-37.7, .55,{yaw:Math.PI,face:'roof',rim:'roofLight',hands:'roofLight'});}
    box('stoneDark',x,39,-32,10,.5,5);cyl('stone',x,39.8,-32,.6,1.2,8);
  }
  for(const side of [-1,1]){
    for(let z=-30;z<=30;z+=near?7.5:15)for(const y of [2,14])a.window(side*107.7,y,z,4,9,{yaw:side*Math.PI/2,glass:'shadow',stone:'stoneDark'});
    for(let x=-76;x<=76;x+=near?7.6:15.2)for(const y of [2,13])a.window(x,y,40.7,3.8,7.5,{glass:'shadow',stone:'stoneDark'});
  }
  for(const x of [-94,94])for(const side of [-1,1]){
    for(const u of [-8,0,8])for(const y of [2,12,21])a.window(x+u,y,side*42.7,3.2,y===21?3.6:7,{yaw:side>0?0:Math.PI,glass:'shadow',stone:'stoneDark',arched:false});
    for(const y of [10.7,20,25.7])box('stoneDark',x,y,side*42.9,27,.55,.7);
  }
  // Dormers belong to the slate hotel wings, not the central river-side arches.
  for(const x of [-94,94])for(const z of [-28,-14,0,14,28]){
    box('stone',x,29,z,4,5,3);a.window(x-14.7,27,z,2.5,4,{yaw:-Math.PI/2,glass:'shadow',stone:'stoneDark'});
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
