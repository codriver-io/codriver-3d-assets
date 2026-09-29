import * as THREE from 'three';
import { assetBuilder } from './asset-geometry.js';
import { architecture } from './paris-architecture.js';
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
    // +Z points south: the original X/Z outline wound the roof inward.
    for(let i=0;i<idx.length;i+=3)[idx[i+1],idx[i+2]]=[idx[i+2],idx[i+1]];
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();b.put(g,m);
  };
  const windows=(x,z,count,span,levels=2,front=true)=>{
    for(let floor=0;floor<levels;floor++)for(let i=0;i<count;i++){
      const xx=x+(i-(count-1)/2)*span/(count-1||1);
      box('glass',xx,6+floor*7,z+(front?-.08:.08),near?2.1:2.8,near?4.2:4.8,.18);
      if(near){box('shade',xx,8.4+floor*7,z,2.7,.35,.55);box('shade',xx,3.55+floor*7,z,2.7,.3,.5);}
    }
  };
  return {spec,b,near,box,cyl,dome,gable,hip,windows,a:architecture((g,m)=>b.put(g,m),near),finish:()=>{
    const root=b.finish();root.rotation.y=spec.rotation;
    root.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift');});
    root.userData.elevationDatum='Local y=0 is a rigid foundation plane at the host-selected ground datum; no DEM or sea-level height is baked.';
    return root;
  }};
}

function pantheon(t){
  const {box,cyl,dome,gable,hip,near,a}=t;
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
    a.column('stone',x,3.5,z,1,20);
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
  a.dome('roof',0,54,4,18.5,22,{ribs:near?24:12,ribMaterial:'shade'});
  cyl('stone',0,73,4,4.5,5.1,5,near?16:10);
  dome('roof',0,75.5,4,5.1,4.2,5.1);
  cyl('stone',0,79.5,4,1,1.1,5,near?10:6);
  // Rusticated base, pilasters and high nave windows on the long sides.
  for(const side of [-1,1]){
    for(let z=-40;z<=40;z+=near?10:20){
      a.window(side*26.6,13,z,4,10,{yaw:side*Math.PI/2,stone:'shade'});
      box('shade',side*26.7,16,z+4,1,27,1.2);
    }
    for(const y of [3,10,29])box('shade',side*27,y,0,.9,.5,98);
  }
  for(const x of [-12,0,12])a.window(x,4,-50.2,5,15,{yaw:Math.PI,stone:'shade',arched:false});
  for(let i=0;i<10;i++)box('steps',0,(i+1)*.17,-70+i*.65,45,(i+1)*.34,.72);
  // Pediment relief stays an original, deliberately simplified sculptural group.
  if(near)for(let x=-17;x<=17;x+=2.5){
    const h=1.2+3.5*(1-Math.abs(x)/20);
    a.column('shade',x,25.6,-69.4,.23,h);
  }

}
function madeleine(t){
  const {box,cyl,gable,near,a}=t;
  // The central cella is recessed from a true continuous peristyle.
  for(const side of [-1,1])for(let i=0;i<14;i++)box('steps',0,(i+1)*.145,side*(53.8-i*.44),43,(i+1)*.29,.46);
  box('steps',0,2,0,43,4,95);
  box('shade',0,14,0,27,20,79);
  for(const z of [-48,48])for(let i=0;i<8;i++)
    a.column('stone',-18+i*36/7,5,z,1,20);
  for(const x of [-18,18])for(let i=0;i<18;i++)
    a.column('stone',x,5,-43+i*86/17,1,20);
  box('stone',0,25.4,0,41,1.8,104);
  box('stone',0,27,0,31,1.5,87);
  gable('roof',0,27,0,31,3,86);
  for(const z of [-51,51])gable('stone',0,26,z,42,4,2);
  box('glass',0,13,-39.65,7,15,.25);
  box('stone',0,23,-51.5,42,1.2,1.3);
  for(const side of [-1,1]){
    const z=side*51.15;
    for(const y of [25.2,26.2])box('shade',0,y,z,42,.22,.4);
    if(near)for(let x=-17;x<=17;x+=2){
      const h=3.1*(1-Math.abs(x)/20);
      a.column('shade',x,26.5,z+side*.1,.22,h);
    }
  }
  if(near)for(let i=0;i<11;i++)for(const x of [-13.6,13.6]){
    const z=-34+i*6.8;
    box('glass',x,15,z,.12,5,2.6);
    box('stone',x,19,z,.35,.45,3.2);
  }
}
function hotel(t){
  const {box,cyl,near,a,gable,b}=t;
  // Open courtyard, two-storey wings and five projecting Renaissance pavilions.
  box('stone',0,10,-37,148,20,22);
  for(const x of [-62,62])box('stone',x,10,2,24,20,66);
  box('stone',0,9,37,148,18,18);
  for(const [x,z,w,d] of [[0,-37,148,22],[-62,2,24,66],[62,2,24,66],[0,37,148,18]])a.mansard('slate',x,20,z,w,d,10);
  function statue(x,y,z,h=2){
    cyl('stone',x,y+h*.43,z,h*.16,h*.21,h*.85,6);
    const g=new THREE.SphereGeometry(h*.17,near?8:6,5);a.place(g,'stone',x,y+h,z);
    a.bar('stone',[x-h*.25,y+h*.72,z],[x+h*.27,y+h*.55,z],h*.085);
    box('shade',x,y-.15,z,h*.6,.3,h*.55);
  }
  function bay(x,z,y,w=2.6,h=5.5,yaw=Math.PI,arched=false){
    a.window(x,y,z,w,h,{yaw,stone:'shade',arched});
    if(near){
      // Cross-mullioned casements, layered sill and alternating pediment crowns.
      a.box('stone',x,y+h*.55,z+(z<0?-.28:.28),w,.2,.22,yaw);
      if(z<0&&yaw===Math.PI){gable('stone',x,y+h+.4,z-.18,w+1.2,.9,.7);box('stone',x,y-.35,z-.2,w+1.1,.35,.9);}
    }
  }
  for(const x of [-64,-32,32,64]){
    box('stone',x,13.5,-43,17,27,20);a.mansard('roof',x,27,-43,19,22,11);
    for(const u of [-5.5,0,5.5])for(const y of [2,12,21])bay(x+u,-53.15,y,2.8,y===21?4.6:6,Math.PI,y===21);
    for(const u of [-8,8]){
      box('stone',x+u,16,-53.6,.85,25,1.2);
      // Tall paired chimney stacks define the pavilion's roof silhouette.
      box('stone',x+u,35,-43,1.7,11,2.9);box('shade',x+u,40.7,-43,2.2,.7,3.4);
    }
    box('stone',x,31,-53,4.8,7,2);bay(x,-54.15,28,3,5,Math.PI,true);
    gable('stone',x,34.6,-53.8,6,2,2);
    for(const y of [10.3,19.7,26.7])box('shade',x,y,-53.4,18,.6,1.2);
    for(const u of [-5,5])statue(x+u,37.4,-43,1.7);
  }
  // Central steep roof and sculpted clock frontispiece, separate from the belfry.
  a.mansard('roof',0,20,-38,48,24,14);
  box('stone',0,25,-49.5,10,10,4);gable('stone',0,30,-49.8,13,4.2,4);
  a.clock(0,25.5,-51.8,2.7,{yaw:Math.PI,face:'clock',rim:'shade',hands:'roof'});
  a.opening('shade',0,29.3,-51.8,3.6,4.5,{yaw:Math.PI});statue(0,29.4,-52,2.8);
  for(const x of [-6,6]){statue(x,22,-51.2,2.3);a.bar('shade',[x,23,-51],[x*1.7,20.7,-51],.35);}
  for(const x of [-16,16]){box('stone',x,24,-48.8,5,8,2.5);bay(x,-50.2,21,3.2,6,Math.PI,true);gable('stone',x,28,-49.5,6.6,2.4,3);}
  // Open octagonal campanile: two stacked arcades and a bulbous slate cap.
  const bx=0,bz=-34;
  cyl('roof',bx,34,bz,3.6,4.4,4,8);
  for(const [base,r,h] of [[36,3.2,5.3],[43,1.85,3.7]]){
    cyl('shade',bx,base,bz,r+.5,r+.5,.5,8);
    for(let k=0;k<8;k++){
      const angle=k*Math.PI/4+Math.PI/8,xx=r*Math.sin(angle),zz=bz+r*Math.cos(angle);
      a.column('stone',xx,base,zz,near?.23:.3,h,6);
      const mid=angle+Math.PI/8,apothem=r*Math.cos(Math.PI/8);
      a.arch('shade',apothem*Math.sin(mid),base+h-.75,bz+apothem*Math.cos(mid),2*r*Math.sin(Math.PI/8)-.46,.75,.18,.25,mid);
    }
    cyl('roof',bx,base+h+.15,bz,r+.55,r+.55,.45,8);
  }
  a.dome('roof',0,41.5,bz,3.7,1.7,{ribs:8,ribMaterial:'shade'});
  a.dome('roof',0,47,bz,2.4,2.1,{ribs:8,ribMaterial:'shade'});
  a.bar('gold',[0,49.1,bz],[0,50,bz],.12);
  // Lower facade: recessed door arches, rectangular upper windows, statue niches.
  for(let x=-69;x<=69;x+=near?5.3:10.6){
    if([-64,-32,32,64].some(p=>Math.abs(x-p)<9))continue;
    bay(x,-48.2,2,2.7,6,Math.PI,false);bay(x,-48.2,11.3,2.7,6.5,Math.PI,false);
    if(near&&Math.abs(x)>9){
      const nx=x+2.6;a.opening('shade',nx,12.1,-48.4,1.25,4.5,{yaw:Math.PI});
      a.arch('stone',nx,15.9,-48.6,1.4,.8,.19,.3,Math.PI);statue(nx,12.4,-48.65,2.8);
      box('shade',nx,11.9,-48.6,1.7,.45,1.1);
    }
  }
  for(const x of [-21,0,21]){
    a.window(x,.3,-48.7,x===0?4.2:6,9.4,{yaw:Math.PI,stone:'shade'});
    a.arch('stone',x,x===0?7.3:6.4,-49, x===0?4.2:6,x===0?2.1:3,.55,.65,Math.PI);
    for(const side of [-1,1])a.column('stone',x+side*(x===0?2.8:3.7),.3,-49,.32,8,6);
  }
  for(const y of [1.2,9.7,10.5,18.9,20])box('shade',0,y,-48.5,147,y===20?.65:.3,1);
  a.balustrade('stone',0,20.4,-48.7,145);
  // Iron ridge cresting and roof statuary survive as silhouettes at far LOD.
  for(let x=-22;x<=22;x+=near?1.1:3.7){a.bar('roof',[x,33.8,-38],[x,35,-38],.065);if(near)a.bar('roof',[x-.45,34,-38],[x+.45,34.7,-38],.05);}
  for(const x of [-21,-14,-7,7,14,21])statue(x,35,-38,1.6);
  for(const side of [-1,1])for(let z=-26;z<29;z+=near?6:12)for(const y of [3,11])bay(side*74.15,z,y,2.8,5.5,side*Math.PI/2,false);
  for(let x=-68;x<=68;x+=near?6:12)for(const y of [3,11])bay(x,46.2,y,2.6,5.5,0,false);
  for(const y of [10,18])box('shade',0,y,46.5,147,.4,.8);
}

function conciergerie(t){
  const {box,cyl,hip,gable,windows,near,a}=t;
  // The river frontage is represented without extending into the Palace.
  box('stone',0,12,-1,158,24,29);
  box('shade',0,24,-1,160,1.5,31);
  hip('slate',0,25,-1,158,29,10);
  // Clock tower at eastern end; César, Argent and Bonbec on the river line.
  const towers=[[-75,5.5,30,'round'],[-22,5.5,28,'round'],[2,5.2,28,'round'],[77,6,42,'square']];
  for(const [x,r,h,type] of towers){
    if(type==='square'){box('stone',x,h/2,-17,12,h,12);a.mansard('roof',x,h,-17,14,14,8);}
    else{cyl('stone',x,h/2,-17,r,r,h,near?16:10);cyl('shade',x,h,-17,r+1,r+1,1,near?16:10);
      const g=new THREE.ConeGeometry(r+1.3,type==='round'&&x===-75?7:12,near?24:12);g.translate(x,h+(x===-75?3.5:6),-17);t.b.put(g,'roof');
      if(x===-75)for(let i=0;i<12;i++){const ang=i*Math.PI/6;box('stone',x+(r+.5)*Math.cos(ang),h+1,-17+(r+.5)*Math.sin(ang),.7,1.5,.7);}}
    if(near)for(let yy=9;yy<h-5;yy+=8)box('glass',x,yy,-17-r-.12,1.1,3,.15);
  }
  for(let x=-64;x<68;x+=near?8:16)for(const y of [4,15])a.window(x,y,-15.65,3,7.4,{yaw:Math.PI,pointed:true,stone:'shade'});
  for(const y of [3,12.5,23.5])box('shade',0,y,-15.75,155,.35,.45);
  // Famous gilded clock belongs on the square eastern Tour de l'Horloge.
  a.clock(77,30,-23.25,2.1,{yaw:Math.PI,face:'clock',rim:'gold',hands:'roof'});
  for(const x of [73.7,80.3])a.column('stone',x,25.5,-23.4,.35,8);

  // Gothic dormer rhythm and a dark gate between the two central towers.
  for(let x=-66;x<70;x+=9)if(Math.abs(x+22)>7&&Math.abs(x-2)>7){
    box('stone',x,29,-15.4,3,5,1.4);
    gable('stone',x,31,-15.5,3.5,2,1.8);
  }
  box('glass',-7,5,-15.7,5.4,10,.2);
  if(near)for(let x=-67;x<70;x+=9)box('stone',x,2,-16.1,1.1,5,.6);
}
function institut(t){
  const {box,cyl,dome,hip,gable,near,a}=t;
  // The two arc-shaped wings form the open half-moon Seine frontage.
  const segments=near?12:8;
  for(const side of [-1,1])for(let i=0;i<segments;i++){
    const fraction=(i+.5)/segments, x=side*(16+fraction*57),z=-9+19*fraction*fraction;
    const angle=side*(.16+.45*fraction);
    const g=new THREE.BoxGeometry(59/segments+1,18,17);g.rotateY(angle);g.translate(x,9,z);t.b.put(g,'stone');
    const roof=new THREE.BoxGeometry(59/segments+1,2.2,18);roof.rotateY(angle);roof.translate(x,19.2,z);t.b.put(roof,'slate');
    const frontX=x-Math.sin(angle)*8.6,frontZ=z-Math.cos(angle)*8.6;
    for(const yy of [3,11])a.window(frontX,yy,frontZ,2.5,5.5,{yaw:angle+Math.PI,stone:'shade',arched:yy===3});
    for(const yy of [9.5,18.3])a.box('shade',frontX,yy,frontZ,59/segments+1,.4,.55,angle);
    a.mansard('slate',x,20,z,59/segments+1,18,4);

  }
  for(const x of [-75,75]){box('stone',x,12,8,19,24,23);hip('slate',x,24,8,20,24,6);}
  // Chapelle, paired entrance bays, arched drum and 44 m cupola.
  box('stone',0,13,5,36,26,37);
  for(const x of [-15,-10,-5,5,10,15])a.column('stone',x,3,-15.5,.78,16);
  box('stone',0,20,-15.5,38,1.8,5);
  gable('stone',0,21,-17,35,5,2.3);
  box('clock',0,22.5,-18.2,2.5,2.5,.15);
  cyl('stone',0,27.5,5,15.5,15.5,15,near?28:16);
  for(let i=0;i<16;i++){const a=i*Math.PI*2/16;
    const x=Math.cos(a)*15.52,z=5+Math.sin(a)*15.52;
    cyl('stone',x,30,z,.55,.62,6,near?8:6);
    if(i%2===0)t.a.window(Math.cos(a)*15.7,25.5,5+Math.sin(a)*15.7,2.3,6,{yaw:Math.PI/2-a,stone:'shade'});
  }
  cyl('shade',0,34,5,16,16,2,near?28:16);
  a.dome('slate',0,35,5,15,8,{ribs:near?16:8,ribMaterial:'shade'});
  a.window(0,1,-13.7,7,15,{yaw:Math.PI,stone:'shade'});
  for(const x of [-75,75])for(const u of [-5,0,5])for(const y of [3,12])a.window(x+u,y,-3.7,2.6,6,{yaw:Math.PI,stone:'shade'});
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
